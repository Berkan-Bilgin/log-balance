import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/data/mockData";
import { mockTransactions } from "@/data/mockData";

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: mockTransactions, // Başlangıç durumu
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
      console.log("wut");
    },
    removeTransaction(state, action: PayloadAction<string>) {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload
      );
    },
    removeLastTransaction(state) {
      console.log("mahmut");
      console.log(state.transactions);
      console.log([...state.transactions]);

      if (state.transactions.length > 0) {
        state.transactions.pop(); // Son elemanı kaldır
      }
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
  },
});

export const {
  setTransactions,
  addTransaction,
  removeTransaction,
  removeLastTransaction,
  updateTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
