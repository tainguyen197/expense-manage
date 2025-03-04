export type Expense = {
  item: string;
  amount: number;
  timestamp: Date;
  category: number;
};

export type Income = Expense;

export type ExpenseWithoutCategory =
  | Omit<Expense, "category">
  | Omit<Income, "category">;

export type ExpenseResponse =
  | { success: true; data: Expense }
  | { success: false; message: unknown };

export type ExpenseHistory = Expense & { userId: string };
