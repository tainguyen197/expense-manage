"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
import { useRouter, useSearchParams } from "next/navigation";
import { routesConfig } from "@/config/routes";
import React from "react";
import { getExpenseHistoryByMonthAndYear } from "@/app/api/expense-manage";
import { formatCurrency } from "@/utils/curency";

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

const MonthStatic = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = searchParams.get("month");
  const currentMonthName = monthName.find(
    (month) => month.value === currentMonth
  );
  const currentYear = searchParams.get("year");

  const expenseMonth = getExpenseHistoryByMonthAndYear(
    Number(currentMonth),
    Number(currentYear)
  );

  const totalOutcome = expenseMonth.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  const handleValueChange = (params: Record<string, string>) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      currentParams.set(key, value);
    });
    router.push(`${routesConfig.statics.static}?${currentParams.toString()}`);
  };

  React.useEffect(() => {
    // set default month and year by current date if not exist
    if (!searchParams.get("month") || !searchParams.get("year")) {
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();
      handleValueChange({ year, month });
    }
  }, [searchParams]);

  return (
    <Card>
      <CardHeader>
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
      </CardHeader>
      <CardContent>
        <Progress className="h-4" value={33} />
        {/* TODO: add 2 block for each income and outcome */}
        <div className="flex justify-between mt-6 gap-1">
          <div className="block">
            <p className="text-lg font-bold text-muted/70">1,000,000 d</p>
            <h3 className="text-sm text-gray-500">Outcome</h3>
          </div>
          <div className="block">
            {totalOutcome ? (
              <p className="text-lg font-bold transition-all animate-fadeIn text-muted/70">
                {formatCurrency(totalOutcome)}
              </p>
            ) : (
              "--"
            )}
            <h3 className="text-sm text-gray-500 text-right">Income</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthStatic;
