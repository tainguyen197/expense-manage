export type Expense = {
  id: number;
  item: string;
  amount: number;
  timestamp: string;
  category: number;
};

export type Income = Expense;

export type ExpenseWithoutCategory =
  | Omit<Expense, "category">
  | Omit<Income, "category">;

export type ExpenseResponse =
  | { success: true; data: Expense }
  | { success: false; message: unknown };

export type IncomeResponse = ExpenseResponse;

export type ExpenseHistory = Expense & { userId: string };

export type IncomeHistory = Income & { userId: string };

export type GroupedData = {
  timestamp: string; // formatted date string
  amount: number;
};
