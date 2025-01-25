import React, { useState } from "react";
import "react-day-picker/dist/style.css";
import "./CustomDayPicker.css"; // Add custom styles
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalenderProps = {
  selectedDate?: Date;
  onSelectedDate?: (date: Date) => void;
};

const Calender = ({
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

  // Custom renderer for the grid
  const renderWeek = () => (
    <div className="week-row">
      {weekDays.map((day, index) => (
        <Button
          size={"icon"}
          key={day.toISOString()}
          className={`rounded-md border-none shadow-none text-black bg-white  hover:text-white hover:bg-blue-main
             ${
               selectedDate?.toDateString() === day.toDateString()
                 ? "bg-blue-main text-primary-foreground"
                 : ""
             }
              ${index === 0 && "bg-[#527cff63]"}
              ${
                day.toDateString() === new Date().toDateString() &&
                "border-[#527cff63] border-solid border"
              }`}
          onClick={() => setSelectedDate(day)}
        >
          {day.getDate()}
        </Button>
      ))}
    </div>
  );

  //render name of the week
  const renderWeekName = () => (
    <div className="flex gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <Button
          size={"icon"}
          key={day}
          disabled
          className="rounded-md font-semibold border-none shadow-none text-black bg-white "
        >
          {day}
        </Button>
      ))}
    </div>
  );

  React.useEffect(() => {
    if (selectedDateProp) setSelectedDate(selectedDateProp);
  }, [selectedDateProp]);

  React.useEffect(() => {
    if (onSelectedDate) onSelectedDate(selectedDate!);
  }, [selectedDate]);

  return (
    <div className="w-fit">
      <div className="flex items-center justify-between text-sm">
        <Button
          size={"icon"}
          className="rounded-md border-none shadow-none text-black bg-white hover:bg-gray-100 "
          onClick={() =>
            setSelectedDate(
              new Date(selectedDate!.setDate(selectedDate!.getDate() - 7))
            )
          }
        >
          <ChevronLeft size={24} />
        </Button>

        <span className="font-bold">
          {startOfWeek.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <Button
          size={"icon"}
          className="rounded-md border-none shadow-none text-black bg-white hover:bg-gray-100 "
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
      {renderWeek()}
    </div>
  );
};

export default Calender;
