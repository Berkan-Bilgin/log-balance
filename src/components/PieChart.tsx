"use client";

import React, { useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const incomeTotal = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenseTotal = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

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
    maintainAspectRatio: false, // Grafik boyutunu container'a göre ayarlar
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

  const downloadPdf = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Daha yüksek çözünürlükte bir görüntü oluşturur
      });

      const imgData = canvas.toDataURL("image/png");

      // PDF Ayarları
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Grafik boyutunu PDF'e uygun şekilde ayarla
      const chartWidth = pageWidth * 0.8; // PDF genişliğinin %80'i
      const chartHeight = (canvas.height * chartWidth) / canvas.width;

      // Grafiği PDF'in merkezine yerleştir
      pdf.addImage(
        imgData,
        "PNG",
        (pageWidth - chartWidth) / 2, // Ortalamak için X pozisyonu
        (pageHeight - chartHeight) / 2, // Ortalamak için Y pozisyonu
        chartWidth,
        chartHeight
      );

      // PDF'i kaydet
      pdf.save("chart-full-page.pdf");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Başlık */}
      <h1 className="text-2xl font-bold text-center mb-8">
        Gelir ve Gider Grafiği
      </h1>

      {/* PDF İndir Butonu */}
      <div className="text-center mb-8">
        <button
          onClick={downloadPdf}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          PDF Olarak İndir
        </button>
      </div>

      {/* Grafik Alanı */}
      <div
        ref={chartRef}
        className="relative mx-auto md:w-2/3 lg:w-1/2 bg-red-500 p-4 shadow-md rounded-md"
        style={{ height: "600px" }}
      >
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};
