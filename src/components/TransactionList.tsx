"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setTransactions,
  updateTransaction,
  removeTransaction,
} from "@/store/transactionSlice";
import { mockTransactions, Transaction } from "@/data/mockData";
import dayjs from "dayjs";
import {
  useReactTable,
  ColumnDef,
  GroupingState,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Edit, Save, X, Trash } from "lucide-react"; // İkonlar

export const TransactionList = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<Transaction>>({});
  const [grouping, setGrouping] = useState<GroupingState>([]);

  const handleEditClick = (rowId: string) => {
    console.log("transactions", transactions);
    const row = transactions.find((t) => t.id === rowId);
    console.log("row nedir", row);
    setEditingRowId(rowId);
    setEditedRow(row || {});
  };

  useEffect(() => {
    console.log("Transactions updated:", transactions);
  }, [transactions]);

  const handleSaveClick = () => {
    if (editingRowId) {
      dispatch(updateTransaction({ id: editingRowId, ...editedRow }));
      setEditingRowId(null);
      setEditedRow({});
    }
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditedRow({});
  };

  const handleRemoveClick = (rowId: string) => {
    dispatch(removeTransaction(rowId));
  };

  const handleInputChange = (
    field: keyof Transaction,
    value: string | number
  ) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "category",
        header: "Kategori",
        enableGrouping: true,
        cell: (info) =>
          !info.row.getIsGrouped() && editingRowId === info.row.original?.id ? (
            <input
              type="text"
              value={editedRow.category || ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="border text-center w-full px-2 py-1"
            />
          ) : (
            info.getValue()
          ),
      },
      {
        accessorKey: "date",
        header: "Tarih",
        enableGrouping: true,
        cell: (info) =>
          !info.row.getIsGrouped() && editingRowId === info.row.original?.id ? (
            <input
              type="date"
              value={
                editedRow.date
                  ? dayjs(editedRow.date).format("YYYY-MM-DD")
                  : (info.getValue() as string)
              }
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="border text-center w-full px-2 py-1"
            />
          ) : info.getValue() ? (
            dayjs(info.getValue() as string).format("DD/MM/YYYY")
          ) : (
            ""
          ),
      },
      {
        accessorKey: "type",
        header: "Tür",
        enableGrouping: true,
        cell: (info) =>
          !info.row.getIsGrouped() && editingRowId === info.row.original?.id ? (
            <select
              value={editedRow.type || ""}
              onChange={(e) =>
                handleInputChange(
                  "type",
                  e.target.value as "income" | "expense"
                )
              }
              className="border text-center w-full px-2 py-1"
            >
              <option value="income">Gelir</option>
              <option value="expense">Gider</option>
            </select>
          ) : info.getValue() === "income" ? (
            "Gelir"
          ) : info.getValue() === "expense" ? (
            "Gider"
          ) : (
            ""
          ),
      },
      {
        accessorKey: "description",
        header: "Açıklama",
        enableGrouping: false,
        cell: (info) =>
          !info.row.getIsGrouped() && editingRowId === info.row.original?.id ? (
            <input
              type="text"
              value={editedRow.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="border text-center w-full px-2 py-1"
            />
          ) : (
            info.getValue()
          ),
      },
      {
        accessorKey: "amount",
        header: "Tutar",
        enableGrouping: false,
        cell: (info) =>
          !info.row.getIsGrouped() && editingRowId === info.row.original?.id ? (
            <input
              type="number"
              value={editedRow.amount || ""}
              onChange={(e) =>
                handleInputChange("amount", Number(e.target.value))
              }
              className="border text-center w-full px-2 py-1"
            />
          ) : (
            `${info.getValue()}₺`
          ),
      },
      {
        id: "actions",
        header: "İşlemler",
        cell: (info) =>
          !info.row.getIsGrouped() ? (
            editingRowId === info.row.original?.id ? (
              <div className="flex justify-center space-x-4 ">
                <button
                  onClick={handleSaveClick}
                  className="px-2 py-1 bg-green-500 text-white rounded flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Kaydet
                </button>
                <button
                  onClick={handleCancelClick}
                  className="px-2 py-1 bg-red-500 text-white rounded flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  İptal
                </button>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() =>
                    handleEditClick(info.row.original?.id as string)
                  }
                  className="px-2 py-1 bg-blue-500 text-white rounded flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Düzenle
                </button>
                <button
                  onClick={() =>
                    handleRemoveClick(info.row.original?.id as string)
                  }
                  className="px-2 py-1 bg-gray-500 text-white rounded flex items-center"
                >
                  <Trash className="w-4 h-4 mr-1" />
                  Sil
                </button>
              </div>
            )
          ) : null,
      },
    ],
    [editedRow, editingRowId]
  );

  if (!transactions.length) {
    return <>Loading...</>;
  }

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      grouping,
    },
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <table className="table-fixed w-full h-full border-collapse border border-gray-300 dark:text-black">
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
                          ? `🛑 (${header.column.getGroupedIndex()})`
                          : "👊"}
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
              row.original?.type === "income"
                ? "bg-green-100"
                : row.original?.type === "expense"
                  ? "bg-red-100"
                  : ""
            }`}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="px-4 py-2 border border-gray-300 text-center align-middle"
                style={{
                  background: cell.getIsGrouped()
                    ? "#0aff0082"
                    : cell.getIsPlaceholder()
                      ? "#ff000042"
                      : undefined,
                }}
              >
                {cell.getIsGrouped() ? (
                  <button
                    onClick={row.getToggleExpandedHandler()}
                    style={{
                      cursor: row.getCanExpand() ? "pointer" : "normal",
                    }}
                  >
                    {row.getIsExpanded() ? "👇" : "👉"}{" "}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}{" "}
                    ({row.subRows.length})
                  </button>
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
