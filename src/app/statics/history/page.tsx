"use client";

import React from "react";
import Calendar from "@/components/ui/calendar";
import { StaticsTab } from "../_components/Tabs";
import { useSearchParams } from "next/navigation";
import { getExpenseHistoryByDate } from "@/app/api/expense-manage";
import { formatCurrency } from "@/utils/curency";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { Expense, Income } from "@/types/expense";
import { getIncomeHistoryByDate } from "@/app/api/income-manage";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [tab, setTab] = React.useState<string>("outcome");

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

  React.useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const date = new Date(Number(dateParam));
      setDate(date);
    }

    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setTab(tabParam);
    }
  }, [searchParams]);

  let totalToday = 0;

  switch (tab) {
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

  return (
    <div className="flex flex-col items-center mx-auto container pt-2 gap-10">
      <div className="flex justify-center bg-card rounded-xl shadow-lg">
        <div className="p-4 overflow-hidden">
          <Calendar
            disabledFuture
            onSelectedDate={handleSelectedDate}
            selectedDate={date}
          />
        </div>
      </div>

      <div className="font-semibold text-balance flex flex-col items-center gap-2">
        <span
          className={cn(
            "text-3xl font-bold text-blue-main",
            tab === "income" && "text-[#ff6e09]",
            tab === "outcome" && "text-blue-main"
          )}
        >
          {formatCurrency(totalToday)}
        </span>
        <span className="text-sm text-gray-500">
          ✨ It is your total expense today
        </span>
      </div>
      <div className="flex justify-center w-full">
        <StaticsTab onTabChange={handleTabChange} value={tab} />
      </div>
    </div>
  );
}
