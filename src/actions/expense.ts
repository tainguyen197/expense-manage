"use server";

import {
  createExpenseHistory,
  deleteExpenseHistory,
  getExpenseHistoryByDate,
  updateExpenseHistory,
} from "@/db/expense-history";
import { Expense, ExpenseResponse } from "@/types/expense";

async function createExpense(data: Expense): Promise<ExpenseResponse> {
  // const { userId } = await auth();
  const userId = "mock_user";

  return createExpenseHistory(data, userId);
}

async function getExpenseByDate(from: Date, to: Date) {
  if (!(from instanceof Date)) return [];
  // const { userId } = await auth();
  const userId = "mock_user";

  return getExpenseHistoryByDate(userId, from, to);
}

async function deleteExpense(expense: Expense) {
  // const { userId } = await auth();
  const userId = "mock_user";

  const expenseHistory = await getExpenseHistoryByDate(
    userId,
    expense.timestamp,
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

async function updateExpense(expense: Expense) {
  // const { userId } = await auth();
  const userId = "mock_user";

  const result = await updateExpenseHistory({ ...expense, userId }, userId);
  return {
    success: Boolean(result),
    message: Boolean(result) ? "Expense updated" : "Failed to update expense",
  };
}

async function calculateSpent(from: Date, to: Date) {
  const expenseHistory = await getExpenseByDate(from, to);
  const total = expenseHistory.reduce((acc, cur) => acc + cur.amount, 0);

  return total;
}

async function calculateSpentByDays(from: Date, to: Date) {
  const expenseHistory = await getExpenseByDate(from, to);
  const dayLength = Math.ceil(
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
  );

  //return arr of spent by days [1000, 40000, 6000, 0,0,0,0]
  const spentByDays = Array.from({ length: dayLength }, (_, i) => {
    const date = new Date(from);
    date.setDate(date.getDate() + i);
    const spent = expenseHistory
      .filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return (
          entryDate.getFullYear() === date.getFullYear() &&
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getDate() === date.getDate()
        );
      })
      .reduce((acc, cur) => acc + cur.amount, 0);

    return spent;
  });

  return spentByDays;
}

export {
  createExpense,
  getExpenseByDate,
  deleteExpense,
  updateExpense,
  calculateSpent,
  calculateSpentByDays,
};
