"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PieChartIncome } from "@/components/PieChartIncome";
import { PieChartExpense } from "@/components/PieChartExpense";
import dayjs from "dayjs";

export const FilteredCharts = () => {
  const [filterDate, setFilterDate] = useState<{
    year: number;
    month?: number;
  }>({ year: dayjs().year() });

  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = dayjs(transaction.date);
    const isSameYear = transactionDate.year() === filterDate.year;
    const isSameMonth = filterDate.month
      ? transactionDate.month() + 1 === filterDate.month
      : true;

    return isSameYear && isSameMonth;
  });

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        {/* Yıl Seçimi */}
        <select
          value={filterDate.year}
          onChange={(e) =>
            setFilterDate((prev) => ({
              ...prev,
              year: parseInt(e.target.value, 10),
            }))
          }
          className="border p-2"
        >
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Ay Seçimi */}
        <select
          value={filterDate.month || ""}
          onChange={(e) =>
            setFilterDate((prev) => ({
              ...prev,
              month: e.target.value ? parseInt(e.target.value, 10) : undefined,
            }))
          }
          className="border p-2"
        >
          <option value="">Tüm Aylar</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {dayjs()
                .month(month - 1)
                .format("MMMM")}
            </option>
          ))}
        </select>
      </div>

      {/* Gelir ve Gider Grafiklerini Göster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PieChartIncome transactions={filteredTransactions} />
        <PieChartExpense transactions={filteredTransactions} />
      </div>
    </div>
  );
};
