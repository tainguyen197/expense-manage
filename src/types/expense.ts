export type Transaction = {
  id: number;
  item: string;
  amount: number;
  timestamp: string;
  category: number;
};

export type ExpenseWithoutCategory = Omit<Transaction, "category">;

export type TransactionResponse =
  | { success: true; data: Transaction }
  | { success: false; message: unknown };

export type TransactionHistory = Transaction & { userId: string };

export type GroupedData = {
  timestamp: string; // formatted date string
  amount: number;
};
