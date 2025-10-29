import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFiles, getFilesByFilter } from '../../store/FileSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import DataTable from './DataTable';
import EditFileModal from '../EditFileModal';
import Pagination from '../GeneralComponents/Pagination';
function FileManager() {
  const dispatch = useDispatch();

  // Redux state'inden verileri ve durumları çekiyoruz.
  const { filteredFiles, pagination, status, errors } = useSelector((state) => state.files);
  const isLoading = status.gettingFilesByFilter === 'loading';
  const error = errors.getFilesByFilterError;

  // COMPONENT'İN KENDİ YEREL STATE'LERİ
  // Filtreleme formunun durumunu tutmak için.
  const [filters, setFilters] = useState({});
  // Hangi sayfada olduğumuzu tutmak için.
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5; // Sayfa başına gösterilecek kayıt sayısı

  // VERİ ÇEKME İŞLEMİNİ TETİKLEYEN useEffect
  // currentPage veya filters değiştiğinde bu hook yeniden çalışır.
  useEffect(() => {
    dispatch(getFilesByFilter({ filter: filters, page: currentPage, limit }));
  }, [dispatch, filters, currentPage, limit]);

  // Sayfa değiştirme fonksiyonu (Pagination component'ine prop olarak verilecek)
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Filtreleme fonksiyonu (örnek)
  const applyFilter = (status) => {
    setCurrentPage(1); // Filtre değiştiğinde her zaman 1. sayfaya dön.
    setFilters({ status: status });
  };

  return (
    <div>
      <h1>Yönetim Paneli - Dosya Yöneticisi</h1>

      <div className="filter-bar">
        <span>Filtrele: </span>
        <button onClick={() => applyFilter('pending')}>Bekleyenler</button>
        <button onClick={() => applyFilter('approved')}>Onaylananlar</button>
        <button onClick={() => applyFilter({})}>Tümünü Göster</button>
      </div>

      {isLoading && <div>Yükleniyor...</div>}
      {error && <div style={{ color: 'red' }}>Hata: {error}</div>}

      {!isLoading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th>Dosya Adı</th>
                <th>Kullanıcı</th>
                <th>Durum</th>
                <th>Kategori</th>
                <th>Yüklenme Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr key={file.id}>
                  <td>{file.filename}</td>
                  <td>{file.username}</td>
                  <td>{file.status}</td>
                  <td>{file.category_path}</td>
                  <td>{new Date(file.uploaded_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {console.log(pagination)}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default FileManager;
