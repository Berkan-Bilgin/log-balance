"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "next-themes";
import { Transaction } from "@/data/mockData";
import { AlertCircle } from "lucide-react"; // Lucide React'ten ikon

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const PieChartExpense: React.FC<{
  transactions: Transaction[];
}> = ({ transactions }) => {
  const { theme } = useTheme();

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

  // Eğer veri yoksa hata mesajı göster
  if (categories.length === 0 || amounts.length === 0) {
    return (
      <div className="w-full mx-auto mt-8 text-center p-4 border border-red-300 rounded bg-red-50 dark:bg-red-900">
        <div className="flex flex-col items-center">
          <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-300 mb-2" />
          <h2 className="text-xl font-bold text-red-600 dark:text-red-300">
            Veri Bulunamadı
          </h2>
          <p className="text-red-500 dark:text-red-200">
            Gösterilecek gider verisi bulunamadı. Lütfen işlem ekleyin.
          </p>
        </div>
      </div>
    );
  }

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

// Eşit aralıklı farklı renkler üretmek için fonksiyon
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
