"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "next-themes";
import { Transaction } from "@/data/mockData";
import { AlertCircle } from "lucide-react"; // Lucide React'ten ikon

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const PieChartIncome: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}) => {
  const { theme } = useTheme(); // Mevcut temayı al

  // Gelirleri kategorilere göre gruplandır
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

  const categories = Object.keys(incomeData);
  const amounts = Object.values(incomeData);

  // Eğer veri yoksa hata mesajı göster
  if (categories.length === 0 || amounts.length === 0) {
    return (
      <div className="w-full mx-auto mt-8 text-center p-4 border border-blue-300 rounded bg-blue-50 dark:bg-blue-900">
        <div className="flex flex-col items-center">
          <AlertCircle className="w-8 h-8 text-blue-500 dark:text-blue-300 mb-2" />
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-300">
            Veri Bulunamadı
          </h2>
          <p className="text-blue-500 dark:text-blue-200">
            Gösterilecek gelir verisi bulunamadı. Lütfen işlem ekleyin.
          </p>
        </div>
      </div>
    );
  }

  // Dinamik olarak farklı renkler üret
  const backgroundColors = generateDistinctColors(categories.length);
  const borderColors = backgroundColors.map(
    (color) => color.replace(/(\d+)%\)/, "90%)") // Kenar çizgileri için daha koyu bir ton
  );

  // Chart.js veri yapılandırması
  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: theme === "dark" ? "#FFFFFF" : "#000000", // Dark modda beyaz, normalde siyah
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw}₺`,
        },
      },
      datalabels: {
        color: "#FFFFFF", // Etiketlerin rengini beyaz yapar
        font: {
          weight: "bold" as const,
          size: 14, // Yazı boyutunu ayarlayın
        },
        formatter: (value: number) => `${value}₺`, // Etiket formatı
      },
    },
  };

  return (
    <div className="w-full mx-auto mt-8">
      <h2 className="text-center text-xl font-bold mb-4 text-green-400">
        Gelir Dağılımı (Kategorilere Göre)
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
};

// Eşit aralıklı farklı renkler üretmek için fonksiyon
const generateDistinctColors = (numColors: number): string[] => {
  const colors = [];
  const saturation = 70; // Renklerin canlılık seviyesi
  const lightness = 50; // Renklerin parlaklık seviyesi

  for (let i = 0; i < numColors; i++) {
    const hue = (360 / numColors) * i; // Eşit aralıklarla hue değerleri
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};
