import { Expense } from "@/types/expense";

export type GroupedData = {
  timestamp: string; // formatted date string
  amount: number;
};

export function groupTransactionsByDate(data: Expense[]): GroupedData[] {
  const groups = new Map<string, number>();

  data.forEach((transaction) => {
    // Normalize timestamp to a date string (e.g., "Mon Jan 01 2023")
    const dateKey = new Date(transaction.timestamp).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
      }
    );
    groups.set(dateKey, (groups.get(dateKey) || 0) + transaction.amount);
  });

  // Convert map entries to an array of objects
  return Array.from(groups.entries()).map(([timestamp, amount]) => ({
    timestamp,
    amount,
  }));
}
