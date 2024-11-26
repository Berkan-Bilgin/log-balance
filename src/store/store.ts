import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./transactionSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage için

// Persist config oluştur
const persistConfig = {
  key: "root", // Anahtar adı
  storage, // Hangi depolama çözümünü kullanacağınız
};

// Reducer'ı persist ile sar
const persistedReducer = persistReducer(persistConfig, transactionReducer);

// Store'u yapılandır
export const store = configureStore({
  reducer: {
    transactions: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor oluştur
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
