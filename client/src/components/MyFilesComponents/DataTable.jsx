import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const DataTableForMe = ({ data }) => {
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

export default DataTableForMe;
