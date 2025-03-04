import { db } from "@/db";
import { expenseHistory } from "@/db/schema";
import { Expense, ExpenseHistory, ExpenseResponse } from "@/types/expense";

export const getExpenseHistory = async (
  user_id: string,
  { limit }: { limit?: number }
) => {
  return getExpenseHistoryInternal(user_id, { limit });
};

function getExpenseHistoryInternal(
  user_id: string,
  { limit }: { limit?: number }
) {
  return db.query.expenseHistory.findMany({
    where: ({ userId }, { eq }) => eq(userId, user_id),
    limit,
  });
}

export const getExpenseHistoryByDate = async (
  user_id: string,
  date: Date
): Promise<ExpenseHistory[]> => {
  return getExpenseHistoryByDateInternal(user_id, date);
};

function getExpenseHistoryByDateInternal(user_id: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1); // Move to next day at 00:00:00

  return db.query.expenseHistory.findMany({
    where: ({ userId, timestamp }, { and, eq, gte, lt }) =>
      and(
        eq(userId, user_id),
        gte(timestamp, startOfDay),
        lt(timestamp, endOfDay)
      ),
  });
}

export const createExpenseHistory = async (
  expense: Expense,
  user_id: string
): Promise<ExpenseResponse> => {
  try {
    await createExpenseHistoryInternal(expense, user_id);

    return {
      success: true,
      data: expense,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  } finally {
  }
};

async function createExpenseHistoryInternal(expense: Expense, user_id: string) {
  // only save to db when no duplicated
  const duplicate = await db.query.expenseHistory.findFirst({
    where: ({ userId, item, amount, timestamp }, { and, eq }) =>
      and(
        eq(userId, user_id),
        eq(item, expense.item),
        eq(amount, expense.amount),
        eq(timestamp, expense.timestamp)
      ),
  });

  if (duplicate) {
    throw new Error("Duplicate expense found");
  }

  return db.insert(expenseHistory).values({
    ...expense,
    userId: user_id,
  });
}
