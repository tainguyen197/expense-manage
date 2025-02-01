export type Expense = {
  item: string;
  amount: number;
  timestamp: number;
  category: string;
  icon?: string;
};

export type Income = Expense;

export type ExpenseWithoutCategory =
  | Omit<Expense, "category">
  | Omit<Income, "category">;
