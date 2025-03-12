"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import React, { useState, useTransition, useEffect } from "react";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { deleteIncome, getIncomeByDate, updateIncome } from "@/actions/income";
import {
  deleteExpense,
  getExpenseByDate,
  updateExpense,
} from "@/actions/expense";
import TransactionList from "./TransactionList";
import { Expense, Income } from "@/types/expense";

export function StaticsTab() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const tabUrl = searchParams.get("tab") ?? "outcome";
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const dateParams = searchParams.get("date");

  const [incomeData, setIncomeData] = useState<Income[] | null>(null);
  const [expenseData, setExpenseData] = useState<Expense[] | null>(null);

  const handleTabChange = (value: string) => {
    startTransition(() => {
      updateSearchParams({ tab: value });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!dateParams) return;

      const from = new Date(Number(dateParams));
      const to = new Date(from);

      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      if (tabUrl === "income") {
        const data = await getIncomeByDate(
          from.toISOString(),
          to.toISOString()
        );
        setIncomeData(data);
      } else {
        const data = await getExpenseByDate(
          from.toISOString(),
          to.toISOString()
        );
        setExpenseData(data);
      }
    };

    fetchData();
  }, [dateParams, tabUrl]);

  const handleDelete = async (item: any) => {
    if (tabUrl === "income") {
      const result = await deleteIncome({
        ...item,
        category: item.category.id,
      });
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.success
          ? "Income deleted"
          : "Failed to delete income",
      });
      if (result.success) {
        setIncomeData(
          (prev) => prev?.filter((i) => i.timestamp !== item.timestamp) ?? null
        );
      }
    } else {
      const result = await deleteExpense({
        ...item,
        category: item.category.id,
      });
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.success
          ? "Expense deleted"
          : "Failed to delete expense",
      });
      if (result.success) {
        setExpenseData(
          (prev) => prev?.filter((i) => i.timestamp !== item.timestamp) ?? null
        );
      }
    }
  };

  const handleEdit = async (item: Income | Expense) => {
    if (tabUrl === "income") {
      const result = await updateIncome(item);
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.success
          ? "Income updated"
          : "Failed to update income",
      });
      if (result.success) {
        setIncomeData(
          (prev) =>
            prev?.map((i) => (i.timestamp === item.timestamp ? item : i)) ??
            null
        );
      }
    } else {
      const result = await updateExpense(item);
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.success
          ? "Expense updated"
          : "Failed to update expense",
      });
      if (result.success) {
        setExpenseData(
          (prev) =>
            prev?.map((i) => (i.timestamp === item.timestamp ? item : i)) ??
            null
        );
      }
    }
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
          disabled={isPending}
        >
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-rose-400" />
            <span>Expenses</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="income"
          className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
          disabled={isPending}
        >
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4 text-emerald-400" />
            <span>Income</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        <TabsContent value="outcome" className="mt-4 relative">
          <div className={isPending ? "opacity-50" : ""}>
            <TransactionList
              data={expenseData}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </TabsContent>

        <TabsContent value="income" className="mt-4 relative">
          <div className={isPending ? "opacity-50" : ""}>
            <TransactionList
              data={incomeData}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
