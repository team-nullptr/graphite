import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { StepState } from "~/core/simulator/step";

export type StepStateTableProps = {
  state: StepState<unknown>;
};

export const StepStateTable = ({ state }: StepStateTableProps) => {
  const table = useReactTable({
    data: state.data,
    columns: state.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full table-auto border-collapse border border-slate-300">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border border-slate-300 bg-slate-50 p-2"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border border-slate-300 p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
