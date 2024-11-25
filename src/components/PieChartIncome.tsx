"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChartIncome: React.FC = () => {
  // Redux Store'dan transactions verisini al
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  // Gelirleri kategorilere göre gruplandır ve toplamlarını hesapla
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

  // Gruplandırılmış veriyi grafik formatına dönüştür
  const categories = Object.keys(incomeData); // Kategoriler
  const amounts = Object.values(incomeData); // Toplamlar

  // Chart.js için veri yapılandırması
  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
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
        Gelir Dağılımı (Kategorilere Göre)
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
};
