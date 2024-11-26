"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCategoryLimit } from "@/store/transactionSlice";
import { Edit } from "lucide-react";
import { Notifications } from "./Notifications";
import { Transaction } from "@/data/mockData";

export const ExpenseProgressBar: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}) => {
  const dispatch = useDispatch();
  const categoryLimits = useSelector(
    (state: RootState) => state.transactions.categoryLimits
  );

  // Giderleri kategorilere göre gruplandır
  const expenseData = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (acc, transaction) => {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + Math.abs(transaction.amount);
        return acc;
      },
      {} as Record<string, number>
    );

  const categories = Object.keys(expenseData);

  // Harcamaların %80'i aştığı kategorileri kontrol et
  const criticalExpenses = categories.filter((category) => {
    const spent = expenseData[category];
    const limit = categoryLimits[category] || 25000; // Varsayılan limit 100,000
    return spent / limit >= 0.8;
  });

  const handleEditLimit = (category: string) => {
    const currentLimit = categoryLimits[category] || 25000;
    const newLimit = parseInt(
      prompt(`Yeni limit belirleyin (${category}):`, currentLimit.toString()) ||
        currentLimit.toString(),
      10
    );
    if (newLimit && newLimit > 0) {
      dispatch(setCategoryLimit({ category, limit: newLimit }));
    }
  };

  return (
    <div className="w-full mx-auto mt-8 space-y-4 px-4">
      <div className="flex justify-end mb-4 mt-20">
        <Notifications criticalExpenses={criticalExpenses} />
      </div>

      <h2 className="text-center text-xl font-bold mb-4  text-red-500 dark:text-red-400">
        Bütçe Limitleri - Uyarılar
      </h2>

      {categories.map((category) => {
        const spent = expenseData[category];
        const limit = categoryLimits[category] || 10000; // Varsayılan limit 100,000
        const percentage = Math.min((spent / limit) * 100, 100);

        return (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm dark:text-white">
                {category}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm dark:text-gray-300">
                  {spent.toLocaleString()}₺ / {limit.toLocaleString()}₺
                </span>
                <button
                  onClick={() => handleEditLimit(category)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Edit className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                </button>
              </div>
            </div>
            <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              <div
                className="h-full bg-red-500 dark:bg-red-400"
                style={{
                  width: `${percentage}%`,
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
