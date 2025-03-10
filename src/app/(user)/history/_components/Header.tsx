"use client";

import { cn } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";
import moment from "moment";

const Header = () => {
  const searchParams = useSearchParams();
  const tabUrl = searchParams.get("tab") ?? "outcome";
  const dateParams = searchParams.get("date") || undefined;
  const currentDate = moment(dateParams ? Number(dateParams) : undefined);

  return (
    <div className="sticky top-0 z-10 px-4 py-2 bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-1.5 rounded-lg",
            tabUrl === "income" ? "bg-emerald-500/10" : "bg-rose-500/10"
          )}
        >
          {tabUrl === "income" ? (
            <ArrowDownCircle className="h-5 w-5 text-emerald-400" />
          ) : (
            <ArrowUpCircle className="h-5 w-5 text-rose-400" />
          )}
        </div>
        <div className="space-y-0.5">
          <h1 className="text-lg font-medium text-gray-100">
            {tabUrl === "income" ? "Income" : "Expense"} History
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            <span suppressHydrationWarning>
              {currentDate.format("MMMM D, YYYY")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
