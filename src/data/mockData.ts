import dayjs from "dayjs";

export type Transaction = {
  id: string; // Benzersiz bir id
  description: string; // Gelir veya gider açıklaması
  amount: number; // Tutar
  type: "income" | "expense"; // Gelir veya gider tipi
  category: string; // Gelir veya gider kategorisi
  date: string; // Tarih (ISO formatında string)
};

export const mockTransactions: Transaction[] = [
  // 2024 Kasım
  {
    id: "1",
    description: "Maaş",
    amount: 7000,
    type: "income",
    category: "Çalışma Geliri",
    date: dayjs("2024-11-01").toISOString(),
  },
  {
    id: "2",
    description: "Kira Ödemesi",
    amount: -1600,
    type: "expense",
    category: "Kira",
    date: dayjs("2024-11-02").toISOString(),
  },
  {
    id: "3",
    description: "Market Alışverişi",
    amount: -800,
    type: "expense",
    category: "Market",
    date: dayjs("2024-11-03").toISOString(),
  },
  {
    id: "4",
    description: "Freelance Yazılım",
    amount: 3000,
    type: "income",
    category: "Freelance",
    date: dayjs("2024-11-05").toISOString(),
  },
  {
    id: "5",
    description: "Elektrik Faturası",
    amount: -350,
    type: "expense",
    category: "Faturalar",
    date: dayjs("2024-11-07").toISOString(),
  },

  // 2024 Aralık
  {
    id: "6",
    description: "Yeni Yıl Hediyesi",
    amount: -1200,
    type: "expense",
    category: "Eğlence",
    date: dayjs("2024-12-01").toISOString(),
  },
  {
    id: "7",
    description: "Danışmanlık Ücreti",
    amount: 4500,
    type: "income",
    category: "Hizmet Geliri",
    date: dayjs("2024-12-03").toISOString(),
  },
  {
    id: "8",
    description: "Araba Yakıtı",
    amount: -600,
    type: "expense",
    category: "Ulaşım",
    date: dayjs("2024-12-05").toISOString(),
  },
  {
    id: "9",
    description: "E-Ticaret Satışı",
    amount: 1500,
    type: "income",
    category: "Satış Geliri",
    date: dayjs("2024-12-10").toISOString(),
  },
  {
    id: "10",
    description: "Su Faturası",
    amount: -200,
    type: "expense",
    category: "Faturalar",
    date: dayjs("2024-12-15").toISOString(),
  },

  // 2025 Ocak
  {
    id: "11",
    description: "Maaş",
    amount: 7200,
    type: "income",
    category: "Çalışma Geliri",
    date: dayjs("2025-01-01").toISOString(),
  },
  {
    id: "12",
    description: "Kredi Kartı Ödemesi",
    amount: -1800,
    type: "expense",
    category: "Borç",
    date: dayjs("2025-01-05").toISOString(),
  },
  {
    id: "13",
    description: "Serbest Tasarım Geliri",
    amount: 4000,
    type: "income",
    category: "Freelance",
    date: dayjs("2025-01-10").toISOString(),
  },
  {
    id: "14",
    description: "Market Alışverişi",
    amount: -900,
    type: "expense",
    category: "Market",
    date: dayjs("2025-01-12").toISOString(),
  },
  {
    id: "15",
    description: "Spor Salonu Üyeliği",
    amount: -350,
    type: "expense",
    category: "Spor",
    date: dayjs("2025-01-15").toISOString(),
  },

  // 2025 Şubat
  {
    id: "16",
    description: "Maaş",
    amount: 7400,
    type: "income",
    category: "Çalışma Geliri",
    date: dayjs("2025-02-01").toISOString(),
  },
  {
    id: "17",
    description: "Market Alışverişi",
    amount: -850,
    type: "expense",
    category: "Market",
    date: dayjs("2025-02-05").toISOString(),
  },
  {
    id: "18",
    description: "Freelance Yazılım",
    amount: 3200,
    type: "income",
    category: "Freelance",
    date: dayjs("2025-02-10").toISOString(),
  },
  {
    id: "19",
    description: "Telefon Faturası",
    amount: -250,
    type: "expense",
    category: "Faturalar",
    date: dayjs("2025-02-12").toISOString(),
  },
  {
    id: "20",
    description: "Tatil Harcamaları",
    amount: -3000,
    type: "expense",
    category: "Eğlence",
    date: dayjs("2025-02-15").toISOString(),
  },
];
