"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import React from "react";
import IncomeList from "./Income";
import OutcomeList from "./Outcome";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";

export function StaticsTab() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const tabUrl = searchParams.get("tab") ?? "outcome";

  const handleTabChange = (value: string) => {
    updateSearchParams({ tab: value });
  };

  return (
    <Tabs
      onValueChange={handleTabChange}
      value={tabUrl}
      className="w-full relative"
    >
      <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-800/50">
        <TabsTrigger
          value="outcome"
          className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
        >
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-rose-400" />
            <span>Expenses</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="income"
          className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
        >
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4 text-emerald-400" />
            <span>Income</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="outcome" className="mt-4">
        <OutcomeList />
      </TabsContent>

      <TabsContent value="income" className="mt-4">
        <IncomeList />
      </TabsContent>
    </Tabs>
  );
}
