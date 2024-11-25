"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const TransactionChart: React.FC = () => {
  // Redux Store'dan transactions verisini al
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  // Gelir ve giderleri kategorilere göre gruplama
  const incomeData = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (acc, transaction) => {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      },
      {} as Record<string, number>
    );

  const expenseData = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (acc, transaction) => {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      },
      {} as Record<string, number>
    );

  // Kategoriler ve veriler
  const categories = Array.from(
    new Set([...Object.keys(incomeData), ...Object.keys(expenseData)])
  );
  const incomeValues = categories.map((category) => incomeData[category] || 0);
  const expenseValues = categories.map(
    (category) => expenseData[category] || 0
  );

  // Chart.js için veri yapılandırması
  const data = {
    labels: categories,
    datasets: [
      {
        label: "Gelir",
        data: incomeValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Gider",
        data: expenseValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw}₺`,
        },
      },
    },
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 mx-auto">
      <h2 className="text-center text-xl font-bold mb-4">
        Gelir ve Gider Grafiği
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
};
