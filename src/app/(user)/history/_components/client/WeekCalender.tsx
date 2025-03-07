"use client";

import Calendar from "@/components/ui/calendar";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import React from "react";

const WeekCalender = () => {
  const updateSearchParams = useUpdateSearchParams();
  const searchParams = useSearchParams();

  const dateUrl = searchParams.get("date")
    ? new Date(Number(searchParams.get("date")))
    : new Date();

  const handleSelectedDate = (date: Date) => {
    const startOfToday = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const timestampStartOfToday = startOfToday.getTime().toString(); // Timestamp in milliseconds
    console.log("startOfToday", startOfToday);

    updateSearchParams({ date: timestampStartOfToday });
  };

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

      console.log(
        "startOfToday --",
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        )
      );

      updateSearchParams({ date: startOfToday });
    }
  }, []);

  return (
    <Calendar
      disabledFuture
      onSelectedDate={handleSelectedDate}
      selectedDate={dateUrl}
    />
  );
};

export default WeekCalender;
