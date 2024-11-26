"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const ExpensePieChart: React.FC = () => {
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

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
          label: (context: any) => `${context.label}: ${context.raw}₺`,
        },
      },
      datalabels: {
        formatter: () => "",
      },
    },
    animation: {
      onComplete: function () {
        const chart = this as any;

        if (!chart || !chart.data || !chart.data.datasets) return;

        const ctx = chart.ctx;
        chart.data.datasets[0].data.forEach((value: number, index: number) => {
          const meta = chart.getDatasetMeta(0).data[index];
          const { startAngle, endAngle } = meta;
          const angle = (startAngle + endAngle) / 2;
          const x =
            chart.width / 2 +
            (Math.cos(angle) * (meta.outerRadius + meta.innerRadius)) / 2;
          const y =
            chart.height / 2 +
            (Math.sin(angle) * (meta.outerRadius + meta.innerRadius)) / 2;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillStyle = "#ffffff";
          ctx.font = "12px Arial";
          const percentage = (
            (value / amounts.reduce((a, b) => a + b, 0)) *
            100
          ).toFixed(2);
          ctx.fillText(`${categories[index]}: ${percentage}%`, 0, 0);
          ctx.restore();
        });
      },
    },
  };

  return (
    <div className="w-full mx-auto mt-8">
      <h2 className="text-center text-xl font-bold mb-4">
        Gider Dağılımı (Kategorilere Göre)
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
};
