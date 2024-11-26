"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const PieChartExpense: React.FC = () => {
  const { theme } = useTheme();
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
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
  const amounts = Object.values(expenseData);

  // Dinamik olarak farklı renkler üret
  const backgroundColors = generateDistinctColors(categories.length);
  const borderColors = generateDistinctColors(categories.length, true);

  // Chart.js veri yapılandırması
  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: theme === "dark" ? "#FFFFFF" : "#000000",
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw}₺`,
        },
      },
      datalabels: {
        color: "#FFFFFF",
        font: {
          weight: "bold" as const,
          size: 14,
        },
        formatter: (value: number) => `${value}₺`,
      },
    },
  };

  return (
    <div className="w-full mx-auto mt-8">
      <h2 className="text-center text-xl font-bold mb-4 text-red-500">
        Gider Dağılımı (Kategorilere Göre)
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
};

const generateDistinctColors = (
  numColors: number,
  isLighter: boolean = false
): string[] => {
  const colors = [];
  const saturation = 20; // Renklerin canlılık seviyesi
  const lightness = isLighter ? 65 : 45; // Daha açık veya daha koyu tonlar için lightness ayarı

  for (let i = 0; i < numColors; i++) {
    const hue = (360 / numColors) * i; // Eşit aralıklarla hue değerleri
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};
