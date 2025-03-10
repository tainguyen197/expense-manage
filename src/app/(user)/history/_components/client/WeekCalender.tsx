"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

const WeekCalender = () => {
  const updateSearchParams = useUpdateSearchParams();
  const searchParams = useSearchParams();
  const [currentWeek, setCurrentWeek] = React.useState(new Date());

  const dateUrl = searchParams.get("date")
    ? new Date(Number(searchParams.get("date")))
    : new Date();

  const daysInWeek = React.useMemo(() => {
    const today = new Date(dateUrl);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    const monday = new Date(today.setDate(diff));
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeek); // Use currentWeek instead of monday
      date.setDate(
        currentWeek.getDate() -
          currentWeek.getDay() +
          i +
          (currentWeek.getDay() === 0 ? -6 : 1)
      );
      days.push(date);
    }

    return days;
  }, [dateUrl, currentWeek]);

  const handleSelectedDate = (date: Date) => {
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const timestamp = startOfDay.getTime().toString();
    updateSearchParams({ date: timestamp });
  };

  React.useEffect(() => {
    const date = searchParams.get("date");
    if (!date) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      updateSearchParams({ date: startOfToday.getTime().toString() });
    }
  }, []);

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    if (direction === "prev") {
      newWeek.setDate(newWeek.getDate() - 7);
    } else {
      newWeek.setDate(newWeek.getDate() + 7);
    }
    setCurrentWeek(newWeek);
  };

  const formatDay = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === dateUrl.toDateString();
  };

  const isFuture = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4 text-gray-200">
        <h2 className="text-lg font-semibold">
          {currentWeek.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigateWeek("prev")}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateWeek("next")}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInWeek.map((date, index) => (
          <button
            key={index}
            onClick={() => !isFuture(date) && handleSelectedDate(date)}
            disabled={isFuture(date)}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-all",
              isFuture(date) && "opacity-30 cursor-not-allowed",
              isSelected(date) && "bg-indigo-600 text-white",
              isToday(date) &&
                !isSelected(date) &&
                "bg-indigo-500/20 text-indigo-400",
              !isSelected(date) &&
                !isToday(date) &&
                !isFuture(date) &&
                "hover:bg-gray-800",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            )}
          >
            <span className="text-xs font-medium mb-1">{formatDay(date)}</span>
            <span
              className={cn(
                "text-lg font-semibold",
                isSelected(date) ? "text-white" : "text-gray-300"
              )}
            >
              {date.getDate()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeekCalender;
