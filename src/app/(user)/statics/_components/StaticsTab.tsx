"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import MonthOutCome from "./MonthTransactions";
import { useSearchParams } from "next/navigation";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { Expense, Income } from "@/types/expense";
import { Category } from "@/types/category";

type StaticsTabProps = {
  incomeData: Income[];
  outcomeData: Expense[];
  categories: Category[];
};

export function StaticsTab({
  incomeData,
  outcomeData,
  categories,
}: StaticsTabProps) {
  const params = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const defaultTab = params.get("tab") || "outcome";

  return (
    <Tabs
      defaultValue={defaultTab}
      className="bg-gray-800/30 rounded-lg border border-gray-700/30"
      onValueChange={(value) => {
        updateSearchParams({ tab: value });
      }}
    >
      <TabsList className="w-full flex p-0 h-auto bg-transparent border-b border-gray-700/30">
        <TabsTrigger
          value="outcome"
          className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-rose-400 data-[state=active]:text-rose-400 text-gray-400"
        >
          <div className="flex items-center gap-2">
            <CircleArrowUp className="h-4 w-4" />
            <span className="font-medium">Outcome</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="income"
          className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-400 data-[state=active]:text-emerald-400 text-gray-400"
        >
          <div className="flex items-center gap-2">
            <CircleArrowDown className="h-4 w-4" />
            <span className="font-medium">Income</span>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="outcome" className="mt-0 focus-visible:outline-none">
        <MonthOutCome data={outcomeData} categories={categories} />
      </TabsContent>
      <TabsContent value="income" className="mt-0 focus-visible:outline-none">
        <MonthOutCome data={incomeData} categories={categories} />
      </TabsContent>
    </Tabs>
  );
}
