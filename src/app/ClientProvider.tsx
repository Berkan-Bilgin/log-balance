"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "next-themes";

interface ClientProviderProps {
  children: React.ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </Provider>
  );
};
