import { useState } from 'react';
import EmptyState from '../EmptyState';
import Loading from '../UI/Loading';
import HeaderItem from './HeaderItem';
import TableItem from './TableItem';
import Pagination from '../Pagination';

function Table({
  columns,
  rowData,
  isLoading,
  handleRowAction,
  page,
  rowsPerPage,
}) {
  return (
    <>
      <div className="w-full h-full overflow-auto">
        <table className="w-full divide-y table-auto divide-slate-200">
          {/* Table header */}
          <thead className="text-xs uppercase border-t text-slate-500 bg-slate-50 border-slate-200">
            <tr>
              {columns?.map((col) => (
                <HeaderItem key={col.id} name={col.name} />
              ))}
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-sm divide-y divide-slate-200">
            {!isLoading && rowsPerPage
              ? rowData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((data, i) => {
                    return (
                      <TableItem
                        key={`${data.id}_${i}`}
                        header={columns}
                        row={data}
                        handleRowAction={handleRowAction}
                      />
                    );
                  })
              : rowData?.map((data, i) => {
                  return (
                    <TableItem
                      key={`${data.id}_${i}`}
                      header={columns}
                      row={data}
                      handleRowAction={handleRowAction}
                    />
                  );
                })}

            {!isLoading && rowData.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title="No Data!" />
                </td>
              </tr>
            )}

            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center">
                  <Loading />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
