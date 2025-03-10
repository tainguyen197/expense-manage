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
import { Button } from "@/components/ui/button";

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
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-200">
              {currentMonthName?.name} {currentYear}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-2 bg-gray-800/95 border-gray-700/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Select
            defaultValue={currentMonthName?.value}
            onValueChange={(value) => handleValueChange({ month: value })}
          >
            <SelectTrigger className="h-9 bg-gray-900/50 border-gray-700/50 text-gray-200">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectGroup>
                <SelectLabel className="text-gray-400 px-2 py-1.5 text-xs">
                  Month
                </SelectLabel>
                {monthName.map((month) => (
                  <SelectItem
                    key={month.value}
                    value={month.value}
                    className="text-gray-200 focus:bg-gray-700 focus:text-gray-200"
                  >
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
            <SelectTrigger className="h-9 bg-gray-900/50 border-gray-700/50 text-gray-200">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectGroup>
                <SelectLabel className="text-gray-400 px-2 py-1.5 text-xs">
                  Year
                </SelectLabel>
                {yearName.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="text-gray-200 focus:bg-gray-700 focus:text-gray-200"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthPicker;
