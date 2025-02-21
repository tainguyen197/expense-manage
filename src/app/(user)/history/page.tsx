"use client";

import React, { Suspense } from "react";
import Calendar from "@/components/ui/calendar";
import { StaticsTab } from "./_components/Tabs";
import { useSearchParams } from "next/navigation";
import { getExpenseHistoryByDate } from "@/app/api/expense-manage";
import { formatCurrency } from "@/utils/curency";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { getIncomeHistoryByDate } from "@/app/api/income-manage";
import { cn } from "@/lib/utils";

function HistoryPage() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const dateUrl = searchParams.get("date")
    ? new Date(Number(searchParams.get("date")))
    : new Date();
  const tabUrl = searchParams.get("tab") ?? "outcome";

  const handleSelectedDate = (date: Date) => {
    const startOfToday = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const timestampStartOfToday = startOfToday.getTime().toString(); // Timestamp in milliseconds
    updateSearchParams({ date: timestampStartOfToday });
  };

  const handleTabChange = (value: string) => {
    updateSearchParams({ tab: value });
  };

  let totalToday = 0;

  switch (tabUrl) {
    case "income":
      const incomeList = getIncomeHistoryByDate(searchParams.get("date") || "");
      totalToday = incomeList.reduce((acc, income) => {
        return acc + income.amount;
      }, 0);
      break;
    case "outcome":
      const expenseList = getExpenseHistoryByDate(
        searchParams.get("date") || ""
      );
      totalToday = expenseList.reduce((acc, expense) => {
        return acc + expense.amount;
      }, 0);

    default:
      break;
  }

  React.useEffect(() => {
    const date = searchParams.get("date");
    if (!date) {
      const startOfToday = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      )
        .getTime()
        .toString();

      updateSearchParams({ date: startOfToday });
    }
  }),
    [];

  return (
    <div className="flex flex-col items-center mx-auto container pt-4 gap-10 h-full">
      <div className="flex justify-center bg-background rounded-xl border border-solid">
        <div className="p-4 overflow-hidden">
          <Calendar
            disabledFuture
            onSelectedDate={handleSelectedDate}
            selectedDate={dateUrl}
          />
        </div>
      </div>

      <div className="font-semibold text-balance flex flex-col items-center gap-2">
        <span className={cn("text-3xl font-bold text-accent")}>
          {formatCurrency(totalToday)}
        </span>
        <span className="text-sm text-gray-500">
          ✨ It is your total expense today
        </span>
      </div>
      <div className="flex justify-center w-full h-full">
        <StaticsTab onTabChange={handleTabChange} value={tabUrl} />
      </div>
    </div>
  );
}

const PageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading statics...</div>}>
      <HistoryPage />
    </Suspense>
  );
};

export default PageWrapper;
