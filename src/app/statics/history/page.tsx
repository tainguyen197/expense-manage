"use client";

import React from "react";
import Calendar from "@/components/ui/calendar";
import { StaticsTab } from "../_components/Tabs";
import { useSearchParams } from "next/navigation";
import { getExpenseHistoryByDate } from "@/app/api/expense-manage";
import { Smile } from "lucide-react";
import { formatCurrency } from "@/utils/curency";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const [date, setDate] = React.useState<Date | undefined>(undefined);

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
  }, [searchParams]);

  // calculate total expense
  const expenseList = getExpenseHistoryByDate(searchParams.get("date") || "");
  const totalExpense = expenseList.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  return (
    <div className="flex flex-col items-center mx-auto container pt-2 gap-10">
      <div className="flex justify-center bg-card rounded-xl shadow-lg">
        <div className="p-4 overflow-hidden">
          <Calendar onSelectedDate={handleSelectedDate} selectedDate={date} />
        </div>
      </div>

      {/* <div className="flex justify-center mt-10 h-20 w-20 relative">
        <div className="absolute z-0 opacity-75 inline-flex w-full h-full bg-gray-300 rounded-full animate-ping-slow "></div>
        <div className="w-20 h-20 bg-blue-main rounded-full inline-flex relative" />
        <p className="absolute text-white text-md w-full h-full flex justify-center items-center font-bold">
          <Smile size={64} />
        </p>
      </div> */}
      <div className="font-semibold text-balance flex flex-col items-center gap-2">
        <span className="text-3xl font-bold text-blue-main">
          {formatCurrency(totalExpense)}
        </span>
        <span className="text-sm text-gray-500">
          It is your total expense today
        </span>
      </div>
      <div className="flex justify-center w-full">
        <StaticsTab onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
