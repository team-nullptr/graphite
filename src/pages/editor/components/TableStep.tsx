import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableState } from "~/core/simulator/state";

export type StepStateTableProps = {
  state: TableState;
};

export function TableStep({ state }: StepStateTableProps) {
  const table = useReactTable({
    data: state.data,
    columns: state.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full table-auto border-collapse">
      <thead className="sticky -top-0.5 bg-slate-50">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="divide-x divide-slate-300 border-t border-slate-300">
            {headerGroup.headers.map((header) => (
              // It's impossible to have a working border on sticky element inside a table with border-collapse. I hate my life. :(
              <th
                key={header.id}
                className="px-4 py-1.5 pt-2.5 text-left font-medium after:absolute after:-bottom-[1px] after:left-0 after:w-full after:border-b after:border-slate-300"
              >
                <span className="translate--1">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y divide-slate-200 bg-slate-50">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="divide-x divide-slate-200">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-4 py-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
