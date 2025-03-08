"use server";

import {
  createExpenseHistory,
  deleteExpenseHistory,
  getExpenseHistoryByDate,
  updateExpenseHistory,
} from "@/db/expense-history";
import { Expense, ExpenseResponse } from "@/types/expense";
import { auth } from "@clerk/nextjs/server";

async function createExpense(data: Expense): Promise<ExpenseResponse> {
  const { userId } = await auth();

  return createExpenseHistory(data, userId!);
}

async function getExpenseByDate(from: string, to: string) {
  const { userId } = await auth();

  return getExpenseHistoryByDate(userId!, from, to);
}

async function deleteExpense(expense: Expense) {
  const { userId } = await auth();

  const expenseHistory = await getExpenseHistoryByDate(
    userId!,
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

  const result = await deleteExpenseHistory(updatedExpenseHistory, userId!);

  return {
    success: Boolean(result),
    ...expense,
  };
}

async function updateExpense(expense: Expense) {
  const { userId } = await auth();

  const result = await updateExpenseHistory(
    { ...expense, userId: userId! },
    userId!
  );
  return {
    success: Boolean(result),
    message: Boolean(result) ? "Expense updated" : "Failed to update expense",
  };
}

async function calculateSpent(from: string, to: string) {
  const expenseHistory = await getExpenseByDate(from, to);
  const total = expenseHistory.reduce((acc, cur) => acc + cur.amount, 0);

  return total;
}
async function calculateSpentByDays(from: string, to: string) {
  const expenseHistory = await getExpenseByDate(from, to);

  // Calculate the number of days correctly
  const fromDate = new Date(from);
  const toDate = new Date(to);
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999); // Include the full last day

  const dayLength =
    Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) +
    1; // +1 to include the end date

  // Return an array of spent by days [1000, 40000, 6000, 0,0,0,0]
  const spentByDays = Array.from({ length: dayLength }, (_, i) => {
    const date = new Date(fromDate);
    date.setUTCDate(date.getUTCDate() + i); // Move by days in UTC

    const spent = expenseHistory
      .filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return (
          entryDate.getUTCFullYear() === date.getUTCFullYear() &&
          entryDate.getUTCMonth() === date.getUTCMonth() &&
          entryDate.getUTCDate() === date.getUTCDate()
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
