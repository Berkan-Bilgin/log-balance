import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/data/mockData";

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [], // Başlangıç durumu
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
  },
});

export const {
  setTransactions,
  addTransaction,
  removeTransaction,
  removeLastTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
