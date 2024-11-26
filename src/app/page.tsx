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
import { ExpensePieChart } from "@/components/ExpensePieChart";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const handleAddTransaction = (
    newTransaction: Omit<Transaction, "id" | "date">
  ) => {
    // Yeni bir işlem oluştur
    const newTransactionWithId: Transaction = {
      ...newTransaction,
      id: (transactions.length + 1).toString(), // Otomatik ID oluştur
      date: new Date().toISOString().split("T")[0], // Mevcut tarih
    };

    // Redux store'a yeni işlem ekle
    dispatch(addTransaction(newTransactionWithId));
  };

  return (
    <>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div>
          <PieChartIncome />
        </div>
        <div>
          <ExpensePieChart />
        </div>
      </div>

      <hr />

      <TransactionsHeader onAddClick={() => setIsModalOpen(true)} />
      <TransactionList />
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
      <TransactionChart />
    </>
  );
};

export default Home;
