"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeLastTransaction } from "@/store/transactionSlice";
import { RootState } from "@/store/store";

export const RemoveTransactionButton: React.FC = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const handleRemoveLast = () => {
    if (transactions.length > 0) {
      dispatch(removeLastTransaction()); // Son işlemi kaldır
    } else {
      alert("Silinecek işlem yok!");
    }
  };

  return (
    <button
      onClick={handleRemoveLast}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Son İşlemi Sil
    </button>
  );
};
