"use client";
import React from "react";
import { AddTransactionButton } from "./AddTransactionButton";

interface TransactionsHeaderProps {
  onAddClick: () => void;
}

export const TransactionsHeader: React.FC<TransactionsHeaderProps> = ({
  onAddClick,
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Recent Transactions
      </h2>
      <AddTransactionButton onClick={onAddClick} />
    </div>
  );
};
