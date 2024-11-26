"use client";

import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import { ThemeProvider } from "next-themes";
import { PersistGate } from "redux-persist/integration/react";

interface ClientProviderProps {
  children: React.ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </PersistGate>
    </Provider>
  );
};
