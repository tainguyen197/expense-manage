"use server";

import {
  createExpenseHistory,
  getExpenseHistoryByDate,
} from "@/db/expense-history";
import { Expense, ExpenseResponse } from "@/types/expense";

export async function createExpense(data: Expense): Promise<ExpenseResponse> {
  // const { userId } = await auth();
  const userId = "mock_user";

  console.log("this createExpense running... ");

  return createExpenseHistory(data, userId);
}

export async function getExpenseByDate(date: Date) {
  if (!(date instanceof Date)) return [];
  // const { userId } = await auth();
  const userId = "mock_user";

  return getExpenseHistoryByDate(userId, date);
}
