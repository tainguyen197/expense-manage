// src/app/actions/add-transactions.ts
"use server";

import { Transaction } from "@/types/expense";
import { createExpense } from "./expense";
import { createIncome } from "./income";

const transactionsToAdd: Omit<Transaction, "id">[] = [
  // {
  //   item: "Timo Transfer - NGUYEN THI CHUYEN chuyen FT25081130147924",
  //   amount: 100000,
  //   timestamp: "2025-03-22T00:00:00",
  //   category: 3, // Adjust category ID as needed
  // },
  // {
  //   item: "Timo Transfer - NGUYEN THI CHUYEN chuyen FT25080926737008",
  //   amount: 173000,
  //   timestamp: "2025-03-20T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - LE HOANG chuyen tien",
  //   amount: 2200000,
  //   timestamp: "2025-03-19T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - NGUYEN THI CHUYEN chuyen tien an FT25078670314007",
  //   amount: 318000,
  //   timestamp: "2025-03-19T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - NGUYEN TRUNG TAI chuyen FT25077399543434",
  //   amount: 1300000,
  //   timestamp: "2025-03-18T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - NGUYEN NGOC HA chuyen tien",
  //   amount: 250000,
  //   timestamp: "2025-03-16T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - Sent by Nguyen Trung Tai from my Timo",
  //   amount: 1100000,
  //   timestamp: "2025-03-15T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - Sent by Nguyen Trung Tai from my Timo",
  //   amount: 2800000,
  //   timestamp: "2025-03-14T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - NGUYEN THI CHUYEN chuyen FT25069507870616",
  //   amount: 265000,
  //   timestamp: "2025-03-09T00:00:00",
  //   category: 3, // Adjust category ID as needed
  // },
  // {
  //   item: "Timo Transfer - retail dual rev transaction",
  //   amount: 25592,
  //   timestamp: "2025-03-06T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - NGUYEN THI CHUYEN chuyen FT25064378139640",
  //   amount: 110000,
  //   timestamp: "2025-03-05T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - QR - LE DUY THACH HAN chuyen tien",
  //   amount: 500000,
  //   timestamp: "2025-03-04T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - NGUYEN THI CHUYEN chuyen tien ga FT25062880808303",
  //   amount: 142000,
  //   timestamp: "2025-03-02T00:00:00",
  //   category: 3,
  // },
  // {
  //   item: "Timo Transfer - Interest Applied",
  //   amount: 1094,
  //   timestamp: "2025-03-01T00:00:00",
  //   category: 3,
  // },
];

export async function addBulkTransactions() {
  try {
    // Add transactions one by one
    for (const transaction of transactionsToAdd) {
      await createIncome(transaction);
    }

    return { success: true, message: "Transactions added successfully" };
  } catch (error) {
    console.error("Error adding transactions:", error);
    return { success: false, message: "Failed to add transactions" };
  }
}
