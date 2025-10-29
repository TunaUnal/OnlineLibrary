import React from 'react';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const DataTable = ({ data }) => {
  console.log('first');
  console.log(data);
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

  const table = useMaterialReactTable({
    columns,
    data: data.data || [],
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => data.actions(row),
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
      <h5 className="text-center mt-4">{data.title}</h5>
      <MaterialReactTable table={table} />
    </>
  );
};

export default React.memo(DataTable);
