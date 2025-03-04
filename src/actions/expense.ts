"use server";

import {
  createExpenseHistory,
  deleteExpenseHistory,
  getExpenseHistoryByDate,
  updateExpenseHistory,
} from "@/db/expense-history";
import { Expense, ExpenseResponse } from "@/types/expense";

export async function createExpense(data: Expense): Promise<ExpenseResponse> {
  // const { userId } = await auth();
  const userId = "mock_user";

  return createExpenseHistory(data, userId);
}

export async function getExpenseByDate(date: Date) {
  if (!(date instanceof Date)) return [];
  // const { userId } = await auth();
  const userId = "mock_user";

  return getExpenseHistoryByDate(userId, date);
}

export async function deleteExpense(expense: Expense) {
  // const { userId } = await auth();
  const userId = "mock_user";

  const expenseHistory = await getExpenseHistoryByDate(
    userId,
    expense.timestamp
  );

  if (!expenseHistory) {
    return {
      success: false,
      message: "No expense history found",
    };
  }

  const updatedExpenseHistory = expenseHistory.find(
    (entry) => entry.amount === expense.amount && entry.item === expense.item
  );

  if (!updatedExpenseHistory) {
    return {
      success: false,
      message: "No expense history found",
    };
  }

  const result = await deleteExpenseHistory(updatedExpenseHistory, userId);

  return {
    success: Boolean(result),
    ...expense,
  };
}

export async function updateExpense(expense: Expense) {
  // const { userId } = await auth();
  const userId = "mock_user";

  const result = await updateExpenseHistory({ ...expense, userId }, userId);
  debugger;
  console.log("this updateExpense running... ", result);
  return {
    success: Boolean(result),
    message: Boolean(result) ? "Expense updated" : "Failed to update expense",
  };
}
