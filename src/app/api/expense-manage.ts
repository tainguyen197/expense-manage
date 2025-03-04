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

export const calculateSpent = ({
  range,
  start_date,
  end_date,
}: {
  range: "today" | "last_day" | "this_month" | "last_month" | "custom";
  start_date?: Date;
  end_date?: Date;
}) => {
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0)).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  ).getTime();
  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0
  ).getTime();

  let startTime, endTime;

  switch (range) {
    case "today":
      startTime = startOfToday;
      endTime = Date.now();
      break;
    case "last_day":
      startTime = startOfYesterday;
      endTime = startOfToday - 1;
      break;
    case "this_month":
      startTime = startOfMonth;
      endTime = Date.now();
      break;
    case "last_month":
      startTime = startOfLastMonth;
      endTime = endOfLastMonth;
      break;
    case "custom":
      if (!start_date || !end_date) {
        throw new Error(
          "For 'custom' range, both 'start_date' and 'end_date' must be provided."
        );
      }
      // Get the start and end of the day
      startTime = new Date(start_date).setHours(0, 0, 0, 0);
      endTime = new Date(end_date).setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error("Invalid range specified");
  }

  const data = loadDataFromLocalStorage<Expense[]>("expense-history");

  if (!data) {
    return {
      range,
      start_date: new Date(startTime).toISOString(),
      end_date: new Date(endTime).toISOString(),
      total: 0,
      details: [],
    };
  }

  // Filter the data based on the range
  const filteredData = data.filter(
    (entry: any) => entry.timestamp >= startTime && entry.timestamp <= endTime
  );

  // Calculate the total
  const total = filteredData.reduce(
    (sum: any, entry: any) => sum + entry.amount,
    0
  );

  // Return result with explicit range times
  return {
    range,
    start_date: new Date(startTime).toISOString(),
    end_date: new Date(endTime).toISOString(),
    total,
    details: filteredData,
  };
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
