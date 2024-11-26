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
import dayjs from "dayjs";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

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
      <TransactionsHeader onAddClick={() => setIsModalOpen(true)} />
      <TransactionList />
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
      <TransactionChart />
      <PieChart />
      <PieChartIncome />
      <ExpensePieChart />
    </>
  );
};

export default Home;
