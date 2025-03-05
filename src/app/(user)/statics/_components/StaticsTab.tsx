"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import MonthOutCome from "./MonthTransactions";
import { useSearchParams } from "next/navigation";
import { CupSoda, WalletMinimal } from "lucide-react";
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
      className=" bg-card p-2 pt-0 rounded-tl-2xl rounded-tr-2xl w-full"
      onValueChange={(value) => {
        updateSearchParams({ tab: value });
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="outcome">
          <div className="flex  justify-center items-center gap-1 data-[state=active]:border-b-border">
            <CupSoda size={20} />
            <h3 className="text-xs leading-none mt-1">Outcome</h3>
          </div>
        </TabsTrigger>
        <TabsTrigger value="income">
          <div className="flex justify-center items-center gap-1 data-[state=active]:border-b-border">
            <WalletMinimal size={20} />
            <h3 className="text-xs leading-none mt-1">Income</h3>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="outcome">
        <MonthOutCome data={outcomeData} categories={categories} />
      </TabsContent>
      <TabsContent value="income">
        <MonthOutCome data={incomeData} categories={categories} />
      </TabsContent>
    </Tabs>
  );
}
