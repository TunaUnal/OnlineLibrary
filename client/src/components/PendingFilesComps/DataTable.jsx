import React from 'react';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import DownloadButton from '../../Utils/DownloadButton';
const DataTable = ({ pendingFiles, handleChange }) => {
  console.log('renderProblam');
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
        accessorKey: 'category_name',
        header: 'Kategori',
        size: 150,
      },
      {
        accessorKey: 'ext',
        header: 'Dosya Uzantısı',
        size: 150,
      },
      {
        accessorKey: 'user_name',
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

  const table = useMaterialReactTable({
    columns,
    data: pendingFiles || [],
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => {
      return (
        <>
          <DownloadButton fileId={row.original.id} filename={row.original.filename} />

          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              className="btn btn-sm btn-warning"
              onClick={() => handleChange(row.original.id, 'confirm')}
            >
              Yayınla
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => setEditing(row.original)}
            >
              Düzenle
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => handleChange(row.original.id, 'delete')}
            >
              Sil
            </button>
          </div>
        </>
      );
    },
    initialState: {
      density: 'compact', //set default density to compact
      expanded: true, //expand all rows by default
      columnVisibility: {
        // başlangıçta 'username' sütununu gizle
        category_path: false,
        filename: true,
        ext: false,
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default React.memo(DataTable);
