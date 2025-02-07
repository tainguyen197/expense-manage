"use client";

import React, { useState } from "react";
import "react-day-picker/dist/style.css";
import "./CustomDayPicker.css"; // Add custom styles
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { calculateIncome } from "@/app/api/income-manage";
import { calculateSpent } from "@/app/api/expense-manage";
import { formatVND } from "@/utils/curency";

type CalenderProps = {
  selectedDate?: Date;
  onSelectedDate?: (date: Date) => void;
  disabledFuture?: boolean;
};

const Calender = ({
  disabledFuture,
  selectedDate: selectedDateProp,
  onSelectedDate,
}: CalenderProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Get the current week (start and end)
  const startOfWeek = new Date(selectedDate!);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start on Sunday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday

  // Show only the current week
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  React.useEffect(() => {
    if (selectedDateProp) setSelectedDate(selectedDateProp);
  }, [selectedDateProp]);

  React.useEffect(() => {
    if (onSelectedDate) onSelectedDate(selectedDate!);
  }, [selectedDate]);

  // Custom renderer for the grid
  const renderWeek = React.useMemo(
    () => (
      <div className="week-row">
        {weekDays.map((day) => {
          const income = calculateIncome({
            start_date: day,
            end_date: day,
          });

          const outcome = calculateSpent({
            range: "custom",
            start_date: day,
            end_date: day,
          });

          return (
            <div key={day.toISOString()}>
              <Button
                size={"icon"}
                key={day.toISOString()}
                className={`rounded-md border-none shadow-none text-muted bg-background hover:text-background
             ${
               selectedDate?.toDateString() === day.toDateString()
                 ? "bg-primary text-primary-foreground"
                 : ""
             }
              ${
                day.toDateString() === new Date().toDateString() &&
                "border-primary border-solid border"
              }`}
                disabled={disabledFuture && day > new Date()}
                onClick={() => setSelectedDate(day)}
              >
                {day.getDate()}
              </Button>
              {!(disabledFuture && day > new Date()) && (
                <div className="flex flex-col gap-1 pt-2">
                  <div className="text-[0.625rem] font-semibold flex justify-center items-end gap-1 text-muted">
                    <span className="leading-none">
                      {formatVND(outcome.total)}
                    </span>
                  </div>
                  <div className="text-[0.625rem] font-semibold flex justify-center items-end gap-1 text-muted/70">
                    <span className="leading-none">{formatVND(income)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    ),
    [weekDays, selectedDate]
  );

  //render name of the week
  const renderWeekName = () => (
    <div className="flex gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <Button
          size={"icon"}
          key={day}
          disabled
          className="rounded-md font-semibold border-none shadow-none text-muted bg-background"
        >
          {day}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="w-fit">
      <div className="flex items-center justify-between text-sm">
        <Button
          size={"icon"}
          className="rounded-md border-none shadow-none text-accent bg-background"
          onClick={() =>
            setSelectedDate(
              new Date(selectedDate!.setDate(selectedDate!.getDate() - 7))
            )
          }
        >
          <ChevronLeft size={24} />
        </Button>

        <span className="font-bold text-accent">
          {startOfWeek.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <Button
          size={"icon"}
          className="rounded-md border-none shadow-none text-accent bg-background"
          disabled={disabledFuture && endOfWeek > new Date()}
          onClick={() =>
            setSelectedDate(
              new Date(selectedDate!.setDate(selectedDate!.getDate() + 7))
            )
          }
        >
          <ChevronRight size={24} />
        </Button>
      </div>
      {renderWeekName()}
      {renderWeek}
    </div>
  );
};

export default Calender;
