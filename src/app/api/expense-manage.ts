import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";

export const addExpense = (expense: any) => {
  const expenseHistory = loadDataFromLocalStorage("expense-history");
  saveDataToLocalStorage("expense-history", [...expenseHistory, expense]);
  console.log("Saved expense", expense);
};

export const deleteExpense = (expense: any) => {
  const expenseHistory = loadDataFromLocalStorage("expense-history");
  const updatedExpenseHistory = expenseHistory.filter(
    (entry: any) =>
      entry.amount !== expense.amount || entry.item !== expense.item
  );

  const deleted = expenseHistory.length !== updatedExpenseHistory.length;

  deleted && saveDataToLocalStorage("expense-history", updatedExpenseHistory);

  return {
    success: deleted,
    ...expense,
  };
};

export const calculateSpent = ({
  range,
  start_date,
  end_date,
}: {
  range: "today" | "last_day" | "this_month" | "last_month" | "custom";
  start_date?: any;
  end_date?: any;
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
      startTime = new Date(start_date).getTime();
      endTime = new Date(end_date).getTime();
      break;
    default:
      throw new Error("Invalid range specified");
  }

  const data = loadDataFromLocalStorage("expense-history");

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
