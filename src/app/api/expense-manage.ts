import { Expense } from "@/types/expense";
import { loadDataFromLocalStorage } from "@/utils/localStorage";

// get expense history for a specific date
export const getExpenseHistoryByDate = (date: string) => {
  const data = loadDataFromLocalStorage<Expense[]>("expense-history");
  if (!data) return [];

  return data.filter((entry: Expense) => {
    const entryDate = new Date(entry.timestamp);

    const startOfDate = new Date(
      entryDate.getFullYear(),
      entryDate.getMonth(),
      entryDate.getDate()
    ).getTime();
    return startOfDate.toString() === date;
  });
};

// get expense history for a specific month and year
export const getExpenseHistoryByMonthAndYear = (
  month: number,
  year: number
) => {
  const data = loadDataFromLocalStorage<Expense[]>("expense-history");
  if (!data) return [];

  const result = data.filter((entry: Expense) => {
    const entryDate = new Date(entry.timestamp);

    return entryDate.getMonth() + 1 == month && entryDate.getFullYear() == year;
  });

  return result;
};

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
