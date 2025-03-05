import { db } from "@/db";
import { Income, IncomeHistory, IncomeResponse } from "@/types/expense";
import { incomeHistory } from "./schema";
import { and, eq } from "drizzle-orm";

const getIncomeHistory = async (
  user_id: string,
  { limit }: { limit?: number }
) => {
  return getIncomeHistoryInternal(user_id, { limit });
};

function getIncomeHistoryInternal(
  user_id: string,
  { limit }: { limit?: number }
) {
  return db.query.incomeHistory.findMany({
    where: ({ userId }, { eq }) => eq(userId, user_id),
    limit,
  });
}

const getIncomeHistoryByDate = async (
  user_id: string,
  from: Date,
  to: Date
): Promise<IncomeHistory[]> => {
  return getIncomeHistoryByDateInternal(user_id, from, to);
};

function getIncomeHistoryByDateInternal(user_id: string, from: Date, to: Date) {
  from.setHours(0, 0, 0, 0); // Set to 00:00:00
  to.setHours(23, 59, 59, 999); // Set to 23:59:59

  console.log("from", from);
  console.log("to", to);

  return db.query.incomeHistory.findMany({
    where: ({ userId, timestamp }, { and, eq, gte, lt }) =>
      and(eq(userId, user_id), gte(timestamp, from), lt(timestamp, to)),
  });
}

const createIncomeHistory = async (
  income: Income,
  user_id: string
): Promise<IncomeResponse> => {
  try {
    await createIncomeHistoryInternal(income, user_id);
    console.log("created income history");
    return {
      success: true,
      data: income,
    };
  } catch (e) {
    console.log("error creating income history", e);
    return {
      success: false,
      message: (e as Error).message,
    };
  } finally {
  }
};

async function createIncomeHistoryInternal(income: Income, user_id: string) {
  // only save to db when no duplicated
  const duplicate = await db.query.expenseHistory.findFirst({
    where: ({ userId, item, amount, timestamp }, { and, eq }) =>
      and(
        eq(userId, user_id),
        eq(item, income.item),
        eq(amount, income.amount),
        eq(timestamp, income.timestamp)
      ),
  });

  if (duplicate) {
    throw new Error("Duplicate expense found");
  }

  return db.insert(incomeHistory).values({
    ...income,
    userId: user_id,
  });
}

async function deleteIncomeHistory(income: Income, user_id: string) {
  try {
    await deleteIncomeHistoryInternal(income, user_id);

    return {
      success: true,
      data: income,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  } finally {
  }
}

const deleteIncomeHistoryInternal = async (income: Income, user_id: string) => {
  return db
    .delete(incomeHistory)
    .where(
      and(
        eq(incomeHistory.userId, user_id),
        eq(incomeHistory.item, income.item),
        eq(incomeHistory.amount, income.amount)
      )
    )
    .returning({ id: incomeHistory.id });
};

const updateIncomeHistory = async (
  income: Income,
  user_id: string
): Promise<IncomeResponse> => {
  try {
    await updateIncomeHistoryInternal(income, user_id);

    return {
      success: true,
      data: income,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  } finally {
  }
};

export const updateIncomeHistoryInternal = async (
  income: Income,
  user_id: string
) => {
  return db
    .update(incomeHistory)
    .set({
      ...income,
    })
    .where(
      and(
        eq(incomeHistory.userId, user_id),
        eq(incomeHistory.amount, income.amount)
      )
    )
    .returning({ id: incomeHistory.id });
};

export {
  getIncomeHistory,
  getIncomeHistoryByDate,
  createIncomeHistory,
  deleteIncomeHistory,
  updateIncomeHistory,
};
