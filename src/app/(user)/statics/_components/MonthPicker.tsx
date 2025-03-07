"use client";

import { CardTitle } from "@/components/ui/card";
import { CalendarDays, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

const monthName = [
  {
    name: "January",
    value: "01",
  },
  {
    name: "February",
    value: "02",
  },
  {
    name: "March",
    value: "03",
  },
  {
    name: "April",
    value: "04",
  },
  {
    name: "May",
    value: "05",
  },
  {
    name: "June",
    value: "06",
  },
  {
    name: "July",
    value: "07",
  },
  {
    name: "August",
    value: "08",
  },
  {
    name: "September",
    value: "09",
  },
  {
    name: "October",
    value: "10",
  },
  {
    name: "November",
    value: "11",
  },
  {
    name: "December",
    value: "12",
  },
];

const yearName = ["2024", "2025", "2026", "2027", "2028"];

const MonthPicker = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const currentMonth = searchParams.get("month");
  const currentMonthName = monthName.find(
    (month) => month.value === currentMonth
  );
  const currentYear = searchParams.get("year");

  const handleValueChange = (params: Record<string, string>) => {
    updateSearchParams(params);
  };

  React.useEffect(() => {
    // set default month and year by current date if not exist
    if (!searchParams.get("month") && !searchParams.get("year")) {
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();

      handleValueChange({ year, month });
    }
  }, [searchParams]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <CardTitle className="flex items-end text-md gap-2 text-accent">
          <CalendarDays />{" "}
          <span className="text-sm font-bold leading-4">
            {currentMonthName?.name} {currentYear}
          </span>
          <ChevronDown size={16} />
        </CardTitle>
      </PopoverTrigger>
      <PopoverContent className="w-80 flex gap-4">
        <Select
          defaultValue={currentMonthName?.value}
          onValueChange={(value) => handleValueChange({ month: value })}
        >
          <SelectTrigger className="border-none shadow-none">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Month</SelectLabel>
              {monthName.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          defaultValue={currentYear ?? undefined}
          onValueChange={(value) => handleValueChange({ year: value })}
        >
          <SelectTrigger className="border-none shadow-none">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              {yearName.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};

export default MonthPicker;
