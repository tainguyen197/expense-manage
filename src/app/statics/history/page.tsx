"use client";

import React from "react";
import Calendar from "@/components/ui/calendar";
import { StaticsTab } from "../_components/Tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { getExpenseHistoryByDate } from "@/app/api/expense-manage";
import { Smile } from "lucide-react";
import { formatCurrency } from "@/utils/curency";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { Category } from "@/types/category";

export default function HistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const category = loadDataFromLocalStorage<Category[]>("category") || [];

  const handleSelectedDate = (date: Date) => {
    const startOfToday = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const timestampStartOfToday = startOfToday.getTime(); // Timestamp in milliseconds

    router.push(`/statics/history?date=${timestampStartOfToday}`, {
      scroll: false,
    });
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

  const expenseListWithCategory = expenseList.map((expense) => {
    const categoryItem = category.find((c) => c.id === expense.category);
    return {
      ...expense,
      category: categoryItem?.name ?? "--",
      icon: categoryItem?.icon ?? "",
    };
  });

  return (
    <div className="flex flex-col items-center mx-auto container pt-2">
      <div className="flex justify-center bg-card rounded-xl shadow-lg">
        <div className="p-4 overflow-hidden">
          <Calendar onSelectedDate={handleSelectedDate} selectedDate={date} />
        </div>
      </div>

      <div className="flex justify-center mt-10 h-20 w-20 relative">
        <div className="absolute z-0 opacity-75 inline-flex w-full h-full bg-gray-300 rounded-full animate-ping-slow "></div>
        <div className="w-20 h-20 bg-blue-main rounded-full inline-flex relative" />
        <p className="absolute text-white text-md w-full h-full flex justify-center items-center font-bold">
          <Smile size={64} />
        </p>
      </div>
      <div className="text-sm font-semibold text-balance mt-4">
        <span className="text-md font-bold text-blue-main">
          {formatCurrency(totalExpense)}
        </span>{" "}
        <span className="font-normal">for today</span>
      </div>
      <div className="flex justify-center mt-10 w-full">
        <StaticsTab expenseList={expenseListWithCategory} />
      </div>
    </div>
  );
}
