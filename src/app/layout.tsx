import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { ClientProvider } from "./ClientProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body>
        <ClientProvider>
          <ThemeProvider attribute="class">
            <Navbar />
            {children}
          </ThemeProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
