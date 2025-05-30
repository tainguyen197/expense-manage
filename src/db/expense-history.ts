import { db } from "@/db";
import { expenseHistory } from "@/db/schema";
import {
  Transaction,
  TransactionHistory,
  TransactionResponse,
} from "@/types/expense";
import { and, asc, desc, eq } from "drizzle-orm";

const getExpenseHistory = async (
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
    orderBy: [desc(expenseHistory.timestamp)],

    limit,
  });
}

const getExpenseHistoryByDate = async (
  user_id: string,
  from: string,
  to: string
): Promise<TransactionHistory[]> => {
  return getExpenseHistoryByDateInternal(user_id, from, to);
};

function getExpenseHistoryByDateInternal(
  user_id: string,
  from: string,
  to: string
) {
  return db.query.expenseHistory.findMany({
    where: ({ userId, timestamp }, { and, eq, gte, lt }) =>
      and(eq(userId, user_id), gte(timestamp, from), lt(timestamp, to)),
    orderBy: [desc(expenseHistory.timestamp)],
  });
}

const createExpenseHistory = async (
  expense: Transaction,
  user_id: string
): Promise<TransactionResponse> => {
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

async function createExpenseHistoryInternal(
  expense: Transaction,
  user_id: string
) {
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

const deleteExpenseHistory = async (
  expense: TransactionHistory,
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
  expense: TransactionHistory,
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

const updateExpenseHistory = async (
  expense: TransactionHistory,
  user_id: string
) => {
  return updateExpenseHistoryInternal(expense, user_id);
};

async function updateExpenseHistoryInternal(
  expense: TransactionHistory,
  user_id: string
) {
  return db
    .update(expenseHistory)
    .set({
      ...expense,
    })
    .where(
      and(eq(expenseHistory.userId, user_id), eq(expenseHistory.id, expense.id))
    );
}

export {
  getExpenseHistory,
  getExpenseHistoryByDate,
  createExpenseHistory,
  updateExpenseHistory,
  deleteExpenseHistory,
};
