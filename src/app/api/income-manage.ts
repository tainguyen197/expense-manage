import { Income } from "@/types/expense";
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";
import { getCategoryList } from "./category";

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
  // prevent adding income with duplicate item and amount in the same day
  const incomeHistory = loadDataFromLocalStorage<Income[]>("income-history");
  const duplicate = incomeHistory?.find(
    (entry) =>
      entry.item === income.item &&
      entry.amount === income.amount &&
      new Date(entry.timestamp).toDateString() ===
        new Date(income.timestamp).toDateString()
  );

  if (duplicate) {
    return {
      success: false,
      message: "Duplicate income found",
    };
  }

  // convert the category name to id
  const categoryList = getCategoryList();
  const category = categoryList.find((c) => c.name === income.category);
  if (category) {
    income.category = category.id;
  }

  saveDataToLocalStorage("income-history", [...(incomeHistory || []), income]);
  console.log("Added income", income);

  return {
    success: true,
    message: "added",
  };
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

export const calculateIncome = (args: { start_date: Date; end_date: Date }) => {
  const incomeHistory = loadDataFromLocalStorage<Income[]>("income-history");
  if (!incomeHistory) return 0;

  // Get the start and end of the day
  const startTime = new Date(args.start_date).setHours(0, 0, 0, 0);
  const endTime = new Date(args.end_date).setHours(23, 59, 59, 999);

  return incomeHistory
    .filter((income) => {
      const incomeDate = new Date(income.timestamp).getTime();
      return incomeDate >= startTime && incomeDate <= endTime;
    })
    .reduce((acc, income) => acc + income.amount, 0);
};
