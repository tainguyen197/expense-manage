import { db } from "@/db";
import { Income, IncomeHistory, IncomeResponse } from "@/types/expense";
import { incomeHistory } from "./schema";
import { and, desc, eq } from "drizzle-orm";

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
    orderBy: [desc(incomeHistory.timestamp)],
  });
}

const getIncomeHistoryByDate = async (
  user_id: string,
  from: string,
  to: string
): Promise<IncomeHistory[]> => {
  return getIncomeHistoryByDateInternal(user_id, from, to);
};

function getIncomeHistoryByDateInternal(
  user_id: string,
  from: string,
  to: string
) {
  return db.query.incomeHistory.findMany({
    where: ({ userId, timestamp }, { and, eq, gte, lt }) =>
      and(eq(userId, user_id), gte(timestamp, from), lt(timestamp, to)),
    orderBy: [desc(incomeHistory.timestamp)],
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
