import { useMemo } from 'react';
import React from 'react';
import { MaterialReactTable } from 'material-react-table';

// Bu component artık sadece props alıp bir tablo render ediyor.
// Kendi içinde state veya logic tutmuyor.
const DataTable = ({ columns, data, rowCount, state, onPaginationChange, renderRowActions }) => {
  return (
    <>
      {/* <h5 className="text-center mt-4">{title}</h5> // Title'ı da dışarıdan prop olarak alabilir veya FileManager'da gösterebilirsiniz. */}
      <MaterialReactTable
        columns={columns}
        data={data ?? []}
        rowCount={rowCount ?? 0}
        // Sunucu taraflı modları etkinleştir
        manualPagination
        // manualFiltering, manualSorting vb. de ekleyebilirsiniz.

        // State ve event handler'ları doğrudan ana component'ten (FileManager) al
        state={state}
        onPaginationChange={onPaginationChange}
        // Row actions (opsiyonel)
        enableRowActions={!!renderRowActions}
        positionActionsColumn="last"
        renderRowActions={renderRowActions}
        // Diğer ayarlar
        initialState={{
          density: 'compact',
        }}
      />
    </>
  );
};

export default React.memo(DataTable);
