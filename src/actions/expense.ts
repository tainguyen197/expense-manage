"use server";

import {
  createExpenseHistory,
  deleteExpenseHistory,
  getExpenseHistoryByDate,
  updateExpenseHistory,
} from "@/db/expense-history";
import { Transaction, TransactionResponse } from "@/types/expense";
import { auth } from "@clerk/nextjs/server";

async function createExpense(data: Transaction): Promise<TransactionResponse> {
  const { userId } = await auth();

  return createExpenseHistory(data, userId!);
}

async function getExpenseByDate(from: string, to: string) {
  const { userId } = await auth();

  return getExpenseHistoryByDate(userId!, from, to);
}

async function deleteExpense(expense: Transaction) {
  const { userId } = await auth();

  const result = await deleteExpenseHistory(
    { ...expense, userId: userId! },
    userId!
  );

  return {
    success: Boolean(result),
    message: Boolean(result)
      ? "Transaction deleted"
      : "Failed to delete expense",
  };
}

async function updateExpense(expense: Transaction) {
  const { userId } = await auth();

  // Ensure category is handled as an ID and exclude id from update
  const { id, ...expenseWithoutId } = expense;
  const expenseToUpdate = {
    ...expenseWithoutId,
    category:
      typeof expense.category === "object"
        ? (expense.category as any).id
        : expense.category,
  };

  console.log("expenseToUpdate", expense);

  const result = await updateExpenseHistory(
    { ...expenseToUpdate, id, userId: userId! },
    userId!
  );
  return {
    success: Boolean(result),
    message: Boolean(result)
      ? "Transaction updated"
      : "Failed to update expense",
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
