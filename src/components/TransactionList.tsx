"use client";
import React, { useEffect } from "react";

import {
  GroupingState,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

import { mockTransactions } from "@/data/mockData";
import { Transaction } from "@/data/mockData";

export const TransactionList = () => {
  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "description",
        header: "Açıklama",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "amount",
        header: "Tutar",
        cell: ({ getValue }) => `${getValue()}₺`,
        aggregationFn: "sum",
        aggregatedCell: ({ getValue }) => `Toplam: ${getValue()}₺`,
      },
      {
        accessorKey: "type",
        header: "Tür",
        cell: (info) => (info.getValue() === "income" ? "Gelir" : "Gider"),
      },
      {
        accessorKey: "category",
        header: "Kategori",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "date",
        header: "Tarih",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  const [data, setData] = React.useState<Transaction[]>([]);
  const [grouping, setGrouping] = React.useState<GroupingState>([]);

  // Veri yükleme işlemi için useEffect kullanımı
  useEffect(() => {
    // Mock veriyi state'e yükle
    setData(mockTransactions);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
    },
    onGroupingChange: setGrouping,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });

  if (!data.length) {
    return <div>Loading...</div>;
  }

  return (
    <table className="w-full h-full border-collapse border border-gray-300">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-blue-400 text-left">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className="px-4 py-2 border border-gray-300 text-center align-middle"
              >
                {header.isPlaceholder ? null : (
                  <div>
                    {header.column.getCanGroup() && (
                      <button
                        onClick={header.column.getToggleGroupingHandler()}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {header.column.getIsGrouped()
                          ? `🛑(${header.column.getGroupedIndex()}) `
                          : `👊 `}
                      </button>
                    )}
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={`${
              row.original.type === "income"
                ? "bg-green-100" // Gelir için yeşil arka plan
                : "bg-red-100" // Gider için kırmızı arka plan
            }`}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="px-4 py-2 border border-gray-300 text-center align-middle"
                style={{
                  background: cell.getIsGrouped()
                    ? "#0aff0082"
                    : cell.getIsAggregated()
                      ? "#ffa50078"
                      : cell.getIsPlaceholder()
                        ? "#ff000042"
                        : undefined,
                }}
              >
                {cell.getIsGrouped() ? (
                  <>
                    <button
                      onClick={row.getToggleExpandedHandler()}
                      style={{
                        cursor: row.getCanExpand() ? "pointer" : "normal",
                      }}
                    >
                      {row.getIsExpanded() ? "👇" : "👉"}{" "}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}{" "}
                      ({row.subRows.length})
                    </button>
                  </>
                ) : cell.getIsAggregated() ? (
                  flexRender(
                    cell.column.columnDef.aggregatedCell ??
                      cell.column.columnDef.cell,
                    cell.getContext()
                  )
                ) : cell.getIsPlaceholder() ? null : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
