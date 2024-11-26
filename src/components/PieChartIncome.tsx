"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const PieChartIncome: React.FC = () => {
  const { theme } = useTheme(); // Mevcut temayı al
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

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
      <h2 className="text-center text-xl font-bold mb-4 text-blue-500">
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
