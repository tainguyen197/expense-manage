import { Income } from "@/types/expense";
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";

export const getIncomeHistory = () => {
  return loadDataFromLocalStorage("income-history") || [];
};

// get income history for a specific date
export const getIncomeHistoryByDate = (date: string) => {
  const data = loadDataFromLocalStorage<Income[]>("income-history");
  if (!data) return [];

  return data.filter((entry: Income) => {
    const entryDate = new Date(entry.timestamp);

    const startOfDate = new Date(
      entryDate.getFullYear(),
      entryDate.getMonth(),
      entryDate.getDate()
    ).getTime();
    return startOfDate.toString() === date;
  });
};

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

export const addIncome = (income: Income) => {
  const incomeHistory = loadDataFromLocalStorage<Income[]>("income-history");
  saveDataToLocalStorage("income-history", [...(incomeHistory || []), income]);
  console.log("Saved income", income);
};

export const deleteIncome = (item: any) => {
  const incomeHistory = loadDataFromLocalStorage<Income[]>("income-history");
  if (!incomeHistory) return;

  saveDataToLocalStorage(
    "income-history",
    incomeHistory.filter(
      (income) => income.amount == item.amount && income.item == item.item
    )
  );
  console.log("Deleted income", item);
};

export const calculateIncome = (args: any) => {
  const incomeHistory = loadDataFromLocalStorage<Income[]>("income-history");
  if (!incomeHistory) return 0;

  const start = new Date(args.start_date).getTime();
  const end = new Date(args.end_date).getTime();

  return incomeHistory
    .filter((income) => {
      const incomeDate = new Date(income.timestamp).getTime();
      return incomeDate >= start && incomeDate <= end;
    })
    .reduce((acc, income) => acc + income.amount, 0);
};
