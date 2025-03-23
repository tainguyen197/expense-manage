"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import React, { useState, useTransition, useEffect, useCallback } from "react";
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
import { Transaction } from "@/types/expense";
import { useTransactionCache } from "@/contexts/TransactionCacheContext";
import useFetchCategories from "@/hooks/useFetchCategories";

export function StaticsTab() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const [isPending, startTransition] = useTransition();
  const { getCache, setCache, invalidateCache, subscribeToInvalidation } =
    useTransactionCache();
  useFetchCategories();

  const [incomeData, setIncomeData] = useState<Transaction[] | null>(null);
  const [expenseData, setExpenseData] = useState<Transaction[] | null>(null);

  const dateParams = searchParams.get("date");
  const tabUrl = searchParams.get("tab") ?? "outcome";

  const fetchData = useCallback(async () => {
    if (!dateParams) return;

    const from = new Date(Number(dateParams));
    const to = new Date(from);

    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    // Fetch both income and expense data regardless of current tab
    const [income, expense] = await Promise.all([
      getIncomeByDate(from.toISOString(), to.toISOString()),
      getExpenseByDate(from.toISOString(), to.toISOString()),
    ]);

    setIncomeData(income);
    setExpenseData(expense);

    // Cache the fetched data
    setCache(dateParams, { income, expense });
  }, [dateParams, setCache]);

  useEffect(() => {
    if (!dateParams) return;

    // Try to get data from cache first
    const cachedData = getCache(dateParams);
    if (cachedData) {
      setIncomeData(cachedData.income);
      setExpenseData(cachedData.expense);
      return;
    }

    fetchData();
  }, [dateParams, getCache, fetchData]);

  // Add effect to listen for cache invalidation
  useEffect(() => {
    if (!dateParams) return;

    // Subscribe to cache invalidation events
    const unsubscribe = subscribeToInvalidation(dateParams, fetchData);

    return () => {
      unsubscribe();
    };
  }, [dateParams, fetchData, subscribeToInvalidation]);

  const handleTabChange = (value: string) => {
    startTransition(() => {
      updateSearchParams({ tab: value });
    });
  };

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
          ? "Transaction deleted"
          : "Failed to delete income",
      });
      if (result.success) {
        setIncomeData(
          (prev) => prev?.filter((i) => i.timestamp !== item.timestamp) ?? null
        );
        // Invalidate cache when data changes
        invalidateCache(dateParams!);
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
          ? "Transaction deleted"
          : "Failed to delete expense",
      });
      if (result.success) {
        setExpenseData(
          (prev) => prev?.filter((i) => i.timestamp !== item.timestamp) ?? null
        );
        // Invalidate cache when data changes
        invalidateCache(dateParams!);
      }
    }
  };

  const handleEdit = async (item: Transaction | Transaction) => {
    if (tabUrl === "income") {
      const result = await updateIncome(item);
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.success
          ? "Transaction updated"
          : "Failed to update income",
      });
      if (result.success) {
        setIncomeData(
          (prev) =>
            prev?.map((i) => (i.timestamp === item.timestamp ? item : i)) ??
            null
        );
        // Invalidate cache when data changes
        invalidateCache(dateParams!);
      }
    } else {
      const result = await updateExpense(item);
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.success
          ? "Transaction updated"
          : "Failed to update expense",
      });
      if (result.success) {
        setExpenseData(
          (prev) =>
            prev?.map((i) => (i.timestamp === item.timestamp ? item : i)) ??
            null
        );
        // Invalidate cache when data changes
        invalidateCache(dateParams!);
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
            <span>Transaction</span>
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
