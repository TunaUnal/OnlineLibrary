import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilesByFilter, getCategories } from '../../store/FileSlice';
import DataTable from './DataTable';
import FilterBar from './FilterBar';
import { getUsers } from '../../store/UserSlice';

function FileManager() {
  const dispatch = useDispatch();

  const {
    filteredFiles,
    pagination: paginationFromRedux, // Redux'tan gelen: { totalItems, totalPages, ... }
    categories,
    status,
    errors,
  } = useSelector((state) => state.files);

  const users = useSelector((state) => state.user.userList);
  const isLoading = status.fetchingFilteredFiles === 'loading';
  const error = errors.fetchFilteredFiles;

  // Component'in local state'leri:
  // 1. Filtreler için ayrı bir state
  const [filters, setFilters] = useState({});
  // 2. Tablonun pagination'ı için ayrı bir state (pageIndex, pageSize formatında)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Component ilk yüklendiğinde filtreler için gerekli verileri çek
  useEffect(() => {
    dispatch(getUsers());
    dispatch(getCategories());
  }, [dispatch]);

  // Ana veri çekme useEffect'i: filters veya pagination değiştiğinde tetiklenir
  useEffect(() => {
    // API'nin beklediği formatı burada oluşturuyoruz
    const queryParams = {
      page: pagination.pageIndex + 1, // react-table 0'dan başlar, API 1'den
      limit: pagination.pageSize,
      filter: filters, // Filtreleri doğrudan 'filter' anahtarı altına koyuyoruz
    };

    // Thunk'ı doğru yapıdaki tek bir obje ile çağırıyoruz
    dispatch(getFilesByFilter(queryParams));
  }, [dispatch, filters, pagination]);

  // FilterBar'dan gelen yeni filtreleri state'e yazar
  const handleApplyFilters = (newFilters) => {
    // Filtre değiştiğinde her zaman 1. sayfaya dön
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setFilters(newFilters);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id', //normal accessorKey
        header: 'ID',
        size: 20,
      },
      {
        accessorKey: 'filename', //access nested data with dot notation
        header: 'Dosya Adı',
        size: 150,
      },
      {
        accessorKey: 'category_path',
        header: 'Dosya Yolu',
        size: 150,
      },
      {
        accessorKey: 'ext',
        header: 'Dosya Uzantısı',
        size: 150,
      },
      {
        accessorKey: 'username',
        header: 'Yükleyen',
        size: 150,
      },
      {
        accessorKey: 'status',
        header: 'Durum',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue(); // ham status değeri
          if (value === 'rejected') return 'Reddedildi';
          if (value === 'pending') return 'Onay Bekliyor';
          if (value === 'approved') return 'Yayında';
          if (value === 'hide') return 'Gizlendi';
          // yoksa direk ham değeri göster
          return value;
        },
      },
    ],
    []
  );

  return (
    <>
      <FilterBar
        users={users} // Düzeltilmiş kullanıcı listesi
        categories={categories}
        onApplyFilters={handleApplyFilters}
        isLoading={isLoading}
      />
      <DataTable
        columns={columns}
        data={filteredFiles}
        // DOĞRUSU: rowCount, backend'den gelen toplam öğe sayısı olmalı
        rowCount={paginationFromRedux?.totalItems || 0}
        state={{
          pagination,
          isLoading,
          showAlertBanner: !!error,
        }}
        onPaginationChange={setPagination}
      />
    </>
  );
}

export default FileManager;
