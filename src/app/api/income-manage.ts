import { ExpenseWithoutCategory, Income } from "@/types/expense";
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";

// get income history for a specific month and year
export const getIncomeHistoryByMonthAndYear = (month: number, year: number) => {
  const data = loadDataFromLocalStorage<Income[]>("income-history");
  if (!data) return [];

  return data.filter((entry: Income) => {
    const entryDate = new Date(entry.timestamp);
    return (
      entryDate.getMonth() + 1 === month && entryDate.getFullYear() === year
    );
  });
};
