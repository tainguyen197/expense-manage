"use client";

import { getExpenseByDate } from "@/actions/expense";
import { getIncomeByDate } from "@/actions/income";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/curency";
import { useSearchParams } from "next/navigation";
import React from "react";
import AddNew from "./client/AddNew";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TotalToday = () => {
  const searchParams = useSearchParams();
  const [total, setTotal] = React.useState(0);
  const [hasTransactions, setHasTransactions] = React.useState(false);
  const tabUrl = searchParams.get("tab") ?? "outcome";
  const dateParams = searchParams.get("date") || undefined;

  const from = new Date(dateParams ? Number(dateParams) : Date.now());
  const to = new Date(from);

  React.useEffect(() => {
    const fetchingExpenseList = async () => {
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      const transactions =
        tabUrl === "income"
          ? await getIncomeByDate(from.toISOString(), to.toISOString())
          : await getExpenseByDate(from.toISOString(), to.toISOString());

      setHasTransactions(transactions.length > 0);
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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
      <div className="text-center space-y-4">
        {hasTransactions ? (
          <>
            <span
              className={cn(
                "block text-4xl font-bold",
                tabUrl === "income"
                  ? "text-emerald-400"
                  : total < 0
                  ? "text-red-500"
                  : "text-rose-400"
              )}
            >
              {total < 0 && tabUrl !== "income" && "- "}
              {formatCurrency(Math.abs(total))}
            </span>
            <span className="block text-sm text-gray-300">
              ✨ Total {tabUrl === "income" ? "income" : "expense"} for selected
              date {total < 0 && tabUrl !== "income" && "(Negative Balance)"}
            </span>
            <div>
              <AddNew
                type={tabUrl === "income" ? "add_income" : "add_expense"}
                trigger={
                  <Button
                    className={cn(
                      "px-6 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all gap-3 text-base font-medium",
                      tabUrl === "income"
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    )}
                  >
                    <Plus className="h-5 w-5" />
                    Add {tabUrl === "income" ? "Income" : "Expense"}
                  </Button>
                }
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-gray-400">
              No {tabUrl === "income" ? "income" : "expense"} recorded for this
              date
            </p>
            <AddNew
              type={tabUrl === "income" ? "add_income" : "add_expense"}
              trigger={
                <Button
                  className={cn(
                    "px-6 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all gap-3 text-base font-medium",
                    tabUrl === "income"
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  )}
                >
                  <Plus className="h-5 w-5" />
                  Add Your First {tabUrl === "income" ? "Income" : "Expense"}
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalToday;
