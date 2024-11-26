import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/data/mockData";
import { mockTransactions } from "@/data/mockData";

interface TransactionState {
  transactions: Transaction[];
  categoryLimits: Record<string, number>; // Kategori başına limit
}

const initialState: TransactionState = {
  transactions: mockTransactions,
  categoryLimits: {}, // Başlangıçta boş
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.push(action.payload);
    },
    removeTransaction(state, action: PayloadAction<string>) {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload
      );
    },
    updateTransaction(
      state,
      action: PayloadAction<Partial<Transaction> & { id: string }>
    ) {
      const { id, ...changes } = action.payload;
      const index = state.transactions.findIndex(
        (transaction) => transaction.id === id
      );
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...changes,
        };
      }
    },
    setCategoryLimit(
      state,
      action: PayloadAction<{ category: string; limit: number }>
    ) {
      state.categoryLimits[action.payload.category] = action.payload.limit;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  removeTransaction,
  updateTransaction,
  setCategoryLimit,
} = transactionSlice.actions;

export default transactionSlice.reducer;
