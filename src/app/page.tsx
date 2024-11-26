"use client";
import React from "react";
import { TransactionList } from "@/components/TransactionList";
import { TransactionsHeader } from "@/components/TransactionsHeader";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { useState } from "react";

import { addTransaction } from "@/store/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { TransactionChart } from "@/components/TransactionChart";

import { ExpenseProgressBar } from "@/components/ExpenseProgressBar";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { FilteredCharts } from "@/components/FilteredCharts";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  return (
    <>
      <div className="container mx-auto">
        <ExpenseProgressBar transactions={transactions} />
      </div>

      <hr className="my-4" />

      <div className="container mx-auto">
        <FilteredCharts />
      </div>

      <hr />

      <div className="container mx-auto py-4">
        <TransactionsHeader onAddClick={() => setIsModalOpen(true)} />
        <TransactionList />
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={(newTransaction) =>
            dispatch(
              addTransaction({
                ...newTransaction,
                id: uuidv4(),
              })
            )
          }
        />
      </div>
    </>
  );
};

export default Home;
