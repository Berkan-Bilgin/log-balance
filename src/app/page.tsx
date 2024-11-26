"use client";

import React, { useRef } from "react";
import { TransactionList } from "@/components/TransactionList";
import { TransactionsHeader } from "@/components/TransactionsHeader";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { useState } from "react";
import { addTransaction } from "@/store/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { TransactionChart } from "@/components/TransactionChart";
import { ExpenseProgressBar } from "@/components/ExpenseProgressBar";
import { v4 as uuidv4 } from "uuid";
import { FilteredCharts } from "@/components/FilteredCharts";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const pageRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!pageRef.current) return;

    const canvas = await html2canvas(pageRef.current, {
      backgroundColor: null,
      scale: 1,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true, // Sıkıştırmayı etkinleştir
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("page.pdf");
  };

  return (
    <>
      {/* Tüm bileşenleri kapsayan bir container */}
      <div ref={pageRef}>
        <div className="container mx-auto">
          <ExpenseProgressBar transactions={transactions} />
        </div>

        <hr className="mt-4" />

        <div className="bg-gray-100 dark:bg-gray-700">
          <div className="container mx-auto ">
            <FilteredCharts />
          </div>
        </div>

        <hr />

        <div className="container mx-auto py-4">
          <TransactionsHeader onAddClick={() => setIsModalOpen(true)} />
          <TransactionList />
          <AddTransactionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddTransaction={(newTransaction) =>
              dispatch(
                addTransaction({
                  ...newTransaction,
                  id: uuidv4(),
                })
              )
            }
          />
        </div>
      </div>

      {/* PDF İndir butonu */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleDownloadPdf}
          className="flex items-center px-4 py-2 bg-gray-800 dark:bg-white dark:text-black text-white rounded shadow hover:bg-gray-600 transition"
        >
          <Download className="w-5 h-5 mr-2" />
          PDF İndir
        </button>
      </div>
    </>
  );
};

export default Home;
