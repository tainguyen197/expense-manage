import { db } from "@/db";
import { expenseHistory } from "@/db/schema";
import { Expense, ExpenseHistory, ExpenseResponse } from "@/types/expense";
import { and, eq } from "drizzle-orm";

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
  from: Date,
  to: Date
): Promise<ExpenseHistory[]> => {
  return getExpenseHistoryByDateInternal(user_id, from, to);
};

function getExpenseHistoryByDateInternal(
  user_id: string,
  from: Date,
  to: Date
) {
  from.setHours(0, 0, 0, 0); // Set to 00:00:00
  to.setHours(23, 59, 59, 999); // Set to 23:59:59

  return db.query.expenseHistory.findMany({
    where: ({ userId, timestamp }, { and, eq, gte, lt }) =>
      and(eq(userId, user_id), gte(timestamp, from), lt(timestamp, to)),
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

export const deleteExpenseHistory = async (
  expense: ExpenseHistory,
  user_id: string
) => {
  try {
    await deleteExpenseHistoryInternal(expense, user_id);

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

async function deleteExpenseHistoryInternal(
  expense: ExpenseHistory,
  user_id: string
) {
  return db
    .delete(expenseHistory)
    .where(
      and(
        eq(expenseHistory.userId, user_id),
        eq(expenseHistory.item, expense.item),
        eq(expenseHistory.amount, expense.amount)
      )
    )
    .returning({ id: expenseHistory.id });
}

export const updateExpenseHistory = async (
  expense: ExpenseHistory,
  user_id: string
) => {
  return updateExpenseHistoryInternal(expense, user_id);
};

async function updateExpenseHistoryInternal(
  expense: ExpenseHistory,
  user_id: string
) {
  return db
    .update(expenseHistory)
    .set({
      ...expense,
    })
    .where(
      and(
        eq(expenseHistory.userId, user_id),
        eq(expenseHistory.timestamp, expense.timestamp)
      )
    );
}
