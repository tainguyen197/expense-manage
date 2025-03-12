"use server";

import {
  createIncomeHistory,
  getIncomeHistoryByDate,
  deleteIncomeHistory,
  updateIncomeHistory,
} from "@/db/income-history";
import { Income, IncomeResponse } from "@/types/expense";
import { auth } from "@clerk/nextjs/server";

async function createIncome(data: Income): Promise<IncomeResponse> {
  const { userId } = await auth();

  return createIncomeHistory(data, userId!);
}

async function getIncomeByDate(from: string, to: string) {
  const { userId } = await auth();

  return getIncomeHistoryByDate(userId!, from, to);
}

async function deleteIncome(income: Income) {
  const { userId } = await auth();
  const result = await deleteIncomeHistory(income, userId!);

  return {
    success: Boolean(result),
    ...income,
  };
}

async function updateIncome(income: Income) {
  const { userId } = await auth();
  const result = await updateIncomeHistory(income, userId!);

  return {
    success: Boolean(result),
    ...income,
  };
}

async function calculateIncome(from: string, to: string) {
  const incomeList = await getIncomeByDate(from, to);

  return incomeList.reduce((acc, item) => acc + item.amount, 0);
}

async function calculateIncomeByDays(from: string, to: string) {
  const incomeHistory = await getIncomeByDate(from, to);
  const dayLength = Math.ceil(
    (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)
  );

  //return arr of spent by days [1000, 40000, 6000, 0,0,0,0]
  const spentByDays = Array.from({ length: dayLength }, (_, i) => {
    const date = new Date(from);
    date.setDate(date.getDate() + i);
    const spent = incomeHistory
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
  createIncome,
  getIncomeByDate,
  deleteIncome,
  updateIncome,
  calculateIncome,
  calculateIncomeByDays,
};
