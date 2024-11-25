"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart: React.FC = () => {
  // Redux Store'dan transactions verisini al
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  // Gelir ve giderleri gruplama
  const incomeTotal = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenseTotal = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  // Chart.js için veri yapılandırması
  const data = {
    labels: ["Gelir", "Gider"],
    datasets: [
      {
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
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
    <div className="w-full md:w-1/2 lg:w-1/3 mx-auto mt-8">
      <h2 className="text-center text-xl font-bold mb-4">
        Gelir ve Gider Dağılımı
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
};
