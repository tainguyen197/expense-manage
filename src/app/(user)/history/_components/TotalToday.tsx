"use client";

import { getExpenseByDate } from "@/actions/expense";
import { getIncomeByDate } from "@/actions/income";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/curency";
import { useSearchParams } from "next/navigation";
import React from "react";

const TotalToday = () => {
  const searchParams = useSearchParams();
  const [total, setTotal] = React.useState(0);
  const tabUrl = searchParams.get("tab") ?? "outcome";
  const dateParams = searchParams.get("date") || undefined;

  let from = new Date(Number(dateParams));
  let to = new Date(from);

  React.useEffect(() => {
    const fetchingExpenseList = async () => {
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      const transactions =
        tabUrl === "income"
          ? await getIncomeByDate(from.toISOString(), to.toISOString())
          : await getExpenseByDate(from.toISOString(), to.toISOString());

      const totalToday = transactions.reduce((acc, expense) => {
        return acc + expense.amount;
      }, 0);

      setTotal(totalToday);
    };

    if (tabUrl) {
      fetchingExpenseList();
    }
  }, [tabUrl, dateParams]);

  return (
    <div className="font-semibold text-balance flex flex-col items-center gap-2">
      <span className={cn("text-3xl font-bold text-accent")}>
        {formatCurrency(total)}
      </span>
      <span className="text-sm text-gray-500">
        ✨ It is your total expense today
      </span>
    </div>
  );
};

export default TotalToday;
