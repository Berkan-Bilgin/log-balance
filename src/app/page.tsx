"use client";
import React from "react";
import { TransactionList } from "@/components/TransactionList";
import { TransactionsHeader } from "@/components/TransactionsHeader";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { useState } from "react";
import {
  mockTransactions as initialTransactions,
  Transaction,
} from "@/data/mockData";
import { addTransaction } from "@/store/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { TransactionChart } from "@/components/TransactionChart";
import { PieChart } from "@/components/PieChart";
import { PieChartIncome } from "@/components/PieChartIncome";
import { PieChartExpense } from "@/components/PieChartExpense";
import { ExpenseProgressBar } from "@/components/ExpenseProgressBar";
import dayjs from "dayjs";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
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

  const handleAddTransaction = (newTransaction: Omit<Transaction, "id">) => {
    const newTransactionWithId: Transaction = {
      ...newTransaction,
      id: (transactions.length + 1).toString(), // Otomatik ID
    };

    // Redux store'a yeni işlem ekle
    dispatch(addTransaction(newTransactionWithId));
  };

  return (
    <>
      <div className="container mx-auto">
        <ExpenseProgressBar transactions={transactions} />
      </div>

      <hr className="my-4" />

      <div className="container mx-auto p-4">
        <div className="flex space-x-4 mb-4">
          {/* Tarih Filtreleme UI */}
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

          <select
            value={filterDate.month || ""}
            onChange={(e) =>
              setFilterDate((prev) => ({
                ...prev,
                month: e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined,
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PieChartIncome transactions={filteredTransactions} />
          <PieChartExpense transactions={filteredTransactions} />
        </div>
      </div>

      <hr />

      <div className="container mx-auto">
        <TransactionsHeader onAddClick={() => setIsModalOpen(true)} />
        <TransactionList />
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={(newTransaction) =>
            dispatch(
              addTransaction({
                ...newTransaction,
                id: (transactions.length + 1).toString(),
              })
            )
          }
        />
        <TransactionChart />
      </div>
    </>
  );
};

export default Home;
