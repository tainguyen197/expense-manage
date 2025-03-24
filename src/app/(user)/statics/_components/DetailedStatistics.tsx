"use client";

import { Transaction } from "@/types/expense";
import { formatCurrency } from "@/utils/curency";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/category";
import { DailyTransactionsChart } from "./DailyTransactionsChart";
import { mappingCategory, transactionMonthByCategory } from "../_utils";
import { useState } from "react";
import { ChevronDown, CircleArrowDown, CircleArrowUp } from "lucide-react";
import { groupTransactionsByDate } from "../../chat/_utils/groupTransactionsByDate";

type DetailedStatisticsProps = {
  outcomeData: Transaction[];
  incomeData: Transaction[];
  categories: Category[];
};

export default function DetailedStatistics({
  outcomeData,
  incomeData,
  categories,
}: DetailedStatisticsProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState<
    number | null
  >(null);

  // General Statistics
  const totalIncome = incomeData.reduce(
    (acc, income) => acc + income.amount,
    0
  );
  const totalSpending = outcomeData.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const netBalance = totalIncome - totalSpending;

  // Calculate days with transactions
  const daysWithTransactions = new Set(
    outcomeData.map((expense) =>
      format(new Date(expense.timestamp), "yyyy-MM-dd")
    )
  ).size;
  const averageSpendingPerDay =
    daysWithTransactions > 0 ? totalSpending / daysWithTransactions : 0;

  // Find highest and lowest spending days
  const spendingByDay = outcomeData.reduce((acc, expense) => {
    const date = format(new Date(expense.timestamp), "yyyy-MM-dd");
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const [highestSpendingDay, highestAmount] = Object.entries(
    spendingByDay
  ).reduce(
    (max, [date, amount]) => (amount > max[1] ? [date, amount] : max),
    ["", 0]
  );

  const [lowestSpendingDay, lowestAmount] = Object.entries(
    spendingByDay
  ).reduce(
    (min, [date, amount]) =>
      amount < min[1] && amount > 0 ? [date, amount] : min,
    ["", Infinity]
  );

  // Helper function to get category info
  const getCategoryInfo = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return {
      name: category?.name || "Unknown",
      icon: category?.icon || "❓",
    };
  };

  // Update category statistics with names and icons
  const spendingByCategory = outcomeData.reduce((acc, expense) => {
    acc[expense.category] = {
      amount: (acc[expense.category]?.amount || 0) + expense.amount,
      ...getCategoryInfo(expense.category),
    };
    return acc;
  }, {} as Record<number, { amount: number; name: string; icon: string }>);

  const [mostSpentCategoryId, mostSpentCategoryInfo] = Object.entries(
    spendingByCategory
  ).reduce(
    (max, [id, info]) => (info.amount > max[1].amount ? [id, info] : max),
    ["0", { amount: 0, name: "", icon: "" }]
  );

  const [leastSpentCategoryId, leastSpentCategoryInfo] = Object.entries(
    spendingByCategory
  ).reduce(
    (min, [id, info]) =>
      info.amount < min[1].amount && info.amount > 0 ? [id, info] : min,
    ["0", { amount: Infinity, name: "", icon: "" }]
  );

  // Most frequent category with name and icon
  const categoryFrequency = outcomeData.reduce((acc, expense) => {
    acc[expense.category] = {
      count: (acc[expense.category]?.count || 0) + 1,
      ...getCategoryInfo(expense.category),
    };
    return acc;
  }, {} as Record<number, { count: number; name: string; icon: string }>);

  const [mostFrequentCategoryId, mostFrequentCategoryInfo] = Object.entries(
    categoryFrequency
  ).reduce(
    (max, [id, info]) => (info.count > max[1].count ? [id, info] : max),
    ["0", { count: 0, name: "", icon: "" }]
  );

  // Item-based statistics
  const mostExpensiveItem = [...outcomeData].sort(
    (a, b) => b.amount - a.amount
  )[0];

  const itemFrequency = outcomeData.reduce((acc, expense) => {
    acc[expense.item] = (acc[expense.item] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const [mostPurchasedItem] = Object.entries(itemFrequency).reduce(
    (max, [item, frequency]) => (frequency > max[1] ? [item, frequency] : max),
    ["", 0]
  );

  const spendingByItem = outcomeData.reduce((acc, expense) => {
    acc[expense.item] = (acc[expense.item] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const [mostSpentItem] = Object.entries(spendingByItem).reduce(
    (max, [item, amount]) => (amount > max[1] ? [item, amount] : max),
    ["", 0]
  );

  // Time-based statistics
  const averageSpendingPerTransaction =
    outcomeData.length > 0 ? totalSpending / outcomeData.length : 0;

  const spendingByHour = outcomeData.reduce((acc, expense) => {
    const hour = new Date(expense.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const [peakSpendingHour] = Object.entries(spendingByHour).reduce(
    (max, [hour, amount]) => (amount > max[1] ? [hour, amount] : max),
    ["", 0]
  );

  const peakSpendingTime =
    Number(peakSpendingHour) < 12
      ? "Morning"
      : Number(peakSpendingHour) < 17
      ? "Afternoon"
      : "Night";

  const totalDaysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  const noSpendingDays = totalDaysInMonth - daysWithTransactions;

  // Helper function to group transactions by date
  const groupTransactionsByDateAndCategory = (
    transactions: Transaction[],
    categoryId: number
  ) => {
    return transactions
      .filter((t) => t.category === categoryId)
      .reduce((acc, transaction) => {
        const date = format(new Date(transaction.timestamp), "MMM dd, yyyy");
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      }, {} as Record<string, Transaction[]>);
  };

  return (
    <Tabs defaultValue="outcome" className="w-full">
      <TabsList className="w-full flex p-1.5 h-auto bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/20 mb-4">
        <TabsTrigger
          value="outcome"
          className="flex-1 px-4 py-2.5 rounded-lg data-[state=active]:bg-gray-800/60 data-[state=active]:text-rose-400 data-[state=active]:shadow-lg text-gray-400 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <CircleArrowUp className="h-4 w-4" />
            <span className="font-medium text-sm">Outcome</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="income"
          className="flex-1 px-4 py-2.5 rounded-lg data-[state=active]:bg-gray-800/60 data-[state=active]:text-emerald-400 data-[state=active]:shadow-lg text-gray-400 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <CircleArrowDown className="h-4 w-4" />
            <span className="font-medium text-sm">Income</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="outcome" className="mt-0 focus-visible:outline-none">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="w-full flex p-1.5 h-auto bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/20 mb-4">
            <TabsTrigger
              value="daily"
              className="flex-1 px-4 py-2 rounded-lg data-[state=active]:bg-gray-800/60 data-[state=active]:text-gray-200 data-[state=active]:shadow-lg text-gray-400 transition-all duration-200"
            >
              <span className="font-medium text-sm">Daily</span>
            </TabsTrigger>
            <TabsTrigger
              value="category"
              className="flex-1 px-4 py-2 rounded-lg data-[state=active]:bg-gray-800/60 data-[state=active]:text-gray-200 data-[state=active]:shadow-lg text-gray-400 transition-all duration-200"
            >
              <span className="font-medium text-sm">Category</span>
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="flex-1 px-4 py-2 rounded-lg data-[state=active]:bg-gray-800/60 data-[state=active]:text-gray-200 data-[state=active]:shadow-lg text-gray-400 transition-all duration-200"
            >
              <span className="font-medium text-sm">Items</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="daily"
            className="mt-0 focus-visible:outline-none"
          >
            <div className="grid grid-cols-1 gap-4 p-4">
              <div className="mt-4">
                <DailyTransactionsChart
                  chartData={groupTransactionsByDate(outcomeData)}
                  type="outcome"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          Average Daily
                        </p>
                        <p className="text-base font-medium text-white">
                          {formatCurrency(averageSpendingPerDay)}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          Highest Day
                        </p>
                        <p className="text-base font-medium text-rose-400">
                          {format(new Date(highestSpendingDay), "MMM dd")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(highestAmount)}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-rose-400/10 flex items-center justify-center text-rose-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          Lowest Day
                        </p>
                        <p className="text-base font-medium text-blue-400">
                          {format(new Date(lowestSpendingDay), "MMM dd")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(lowestAmount)}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          Per Transaction
                        </p>
                        <p className="text-base font-medium text-emerald-400">
                          {formatCurrency(averageSpendingPerTransaction)}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          Peak Time
                        </p>
                        <p className="text-base font-medium text-orange-400">
                          {peakSpendingTime}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center text-orange-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          No-Spending
                        </p>
                        <p className="text-base font-medium text-blue-400">
                          {noSpendingDays} days
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                          <path
                            fillRule="evenodd"
                            d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="category"
            className="mt-0 focus-visible:outline-none"
          >
            <div className="p-4 space-y-4">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-400/10 flex items-center justify-center text-lg">
                      {mostSpentCategoryInfo.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Most Spent
                      </p>
                      <p className="text-sm font-medium text-rose-400">
                        {mostSpentCategoryInfo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(mostSpentCategoryInfo.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center text-lg">
                      {leastSpentCategoryInfo.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Least Spent
                      </p>
                      <p className="text-sm font-medium text-emerald-400">
                        {leastSpentCategoryInfo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(leastSpentCategoryInfo.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center text-lg">
                      {mostFrequentCategoryInfo.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Most Frequent
                      </p>
                      <p className="text-sm font-medium text-blue-400">
                        {mostFrequentCategoryInfo.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 divide-y divide-gray-700/30">
                {mappingCategory(
                  transactionMonthByCategory(outcomeData),
                  categories
                )
                  .filter((item) => item.total > 0)
                  .sort((a, b) => b.total - a.total)
                  .map((item, index) => {
                    const totalOutcome = outcomeData.reduce(
                      (acc, expense) => acc + expense.amount,
                      0
                    );
                    const percentage = Math.round(
                      (item.total / totalOutcome) * 100
                    );

                    const isSelected = selectedCategory === item.id;
                    const groupedTransactions = isSelected
                      ? groupTransactionsByDateAndCategory(outcomeData, item.id)
                      : {};

                    return (
                      <div
                        className="relative cursor-pointer hover:bg-gray-800/50 transition-colors"
                        key={index}
                        onClick={() =>
                          setSelectedCategory(isSelected ? null : item.id)
                        }
                      >
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-900/50 flex items-center justify-center text-lg">
                                {item.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-200">
                                    {item.category}
                                  </p>
                                  <p className="text-xs font-medium text-gray-400">
                                    {percentage}%
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {formatCurrency(item.total)}
                                </p>
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                                isSelected ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <div className="h-1.5 w-full bg-gray-900/50 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                background: "hsl(var(--primary))",
                                opacity: "0.8",
                              }}
                            />
                          </div>
                          <div
                            className={`grid transition-all duration-300 ease-in-out ${
                              isSelected
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="mt-3 space-y-3">
                                {Object.entries(groupedTransactions).map(
                                  ([date, transactions]) => (
                                    <div key={date} className="space-y-2">
                                      <p className="text-xs font-medium text-gray-400">
                                        {date}
                                      </p>
                                      <div className="space-y-1 pl-3 border-l border-gray-800">
                                        {transactions.map(
                                          (transaction, idx) => (
                                            <div
                                              key={idx}
                                              className="flex items-center justify-between p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors"
                                            >
                                              <p className="text-xs text-gray-300">
                                                {transaction.item}
                                              </p>
                                              <p className="text-xs text-gray-400">
                                                {formatCurrency(
                                                  transaction.amount
                                                )}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="items"
            className="mt-0 focus-visible:outline-none"
          >
            <div className="p-4">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-400/10 flex items-center justify-center text-lg">
                      💰
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Most Expensive
                      </p>
                      <p className="text-sm font-medium text-rose-400">
                        {mostExpensiveItem.item}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(mostExpensiveItem.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center text-lg">
                      🔄
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Most Purchased
                      </p>
                      <p className="text-sm font-medium text-emerald-400">
                        {mostPurchasedItem}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{itemFrequency[mostPurchasedItem]}×</span>
                        <span>·</span>
                        <span>
                          {formatCurrency(spendingByItem[mostPurchasedItem])}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center text-lg">
                      📊
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Most Spent
                      </p>
                      <p className="text-sm font-medium text-blue-400">
                        {mostSpentItem}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(spendingByItem[mostSpentItem])}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="income" className="mt-0 focus-visible:outline-none">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="w-full flex p-1.5 h-auto bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/20 mb-4">
            <TabsTrigger
              value="daily"
              className="flex-1 px-4 py-2 rounded-lg data-[state=active]:bg-gray-800/60 data-[state=active]:text-gray-200 data-[state=active]:shadow-lg text-gray-400 transition-all duration-200"
            >
              <span className="font-medium text-sm">Daily</span>
            </TabsTrigger>
            <TabsTrigger
              value="category"
              className="flex-1 px-4 py-2 rounded-lg data-[state=active]:bg-gray-800/60 data-[state=active]:text-gray-200 data-[state=active]:shadow-lg text-gray-400 transition-all duration-200"
            >
              <span className="font-medium text-sm">Category</span>
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="flex-1 px-4 py-2 rounded-lg data-[state=active]:bg-gray-800/60 data-[state=active]:text-gray-200 data-[state=active]:shadow-lg text-gray-400 transition-all duration-200"
            >
              <span className="font-medium text-sm">Items</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="daily"
            className="mt-0 focus-visible:outline-none"
          >
            <div className="grid grid-cols-1 gap-4 p-4">
              <div className="mt-4">
                <DailyTransactionsChart
                  chartData={groupTransactionsByDate(incomeData)}
                  type="income"
                />
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-6">
                  Daily Overview
                </h3>
                <div className="space-y-6">
                  <div className="relative pl-4 border-l-2 border-emerald-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Average Income per Day
                    </p>
                    <p className="text-xl font-semibold text-white">
                      {formatCurrency(totalIncome / daysWithTransactions)}
                    </p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-emerald-400/50">
                    <p className="text-sm text-gray-300 mb-1">Total Income</p>
                    <p className="text-xl font-semibold text-emerald-400">
                      {formatCurrency(totalIncome)}
                    </p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-blue-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Average per Transaction
                    </p>
                    <p className="text-xl font-semibold text-blue-400">
                      {formatCurrency(totalIncome / incomeData.length)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="category"
            className="mt-0 focus-visible:outline-none"
          >
            <div className="p-4 space-y-4">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-400/10 flex items-center justify-center text-lg">
                      {mostSpentCategoryInfo.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Most Spent
                      </p>
                      <p className="text-sm font-medium text-rose-400">
                        {mostSpentCategoryInfo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(mostSpentCategoryInfo.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center text-lg">
                      {leastSpentCategoryInfo.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Least Spent
                      </p>
                      <p className="text-sm font-medium text-emerald-400">
                        {leastSpentCategoryInfo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(leastSpentCategoryInfo.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center text-lg">
                      {mostFrequentCategoryInfo.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Most Frequent
                      </p>
                      <p className="text-sm font-medium text-blue-400">
                        {mostFrequentCategoryInfo.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 divide-y divide-gray-700/30">
                {mappingCategory(
                  transactionMonthByCategory(incomeData),
                  categories
                )
                  .filter((item) => item.total > 0)
                  .sort((a, b) => b.total - a.total)
                  .map((item, index) => {
                    const percentage = Math.round(
                      (item.total / totalIncome) * 100
                    );

                    const isSelected = selectedIncomeCategory === item.id;
                    const groupedTransactions = isSelected
                      ? groupTransactionsByDateAndCategory(incomeData, item.id)
                      : {};

                    return (
                      <div
                        className="relative cursor-pointer hover:bg-gray-800/50 transition-colors"
                        key={index}
                        onClick={() =>
                          setSelectedIncomeCategory(isSelected ? null : item.id)
                        }
                      >
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-900/50 flex items-center justify-center text-lg">
                                {item.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-200">
                                    {item.category}
                                  </p>
                                  <p className="text-xs font-medium text-gray-400">
                                    {percentage}%
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {formatCurrency(item.total)}
                                </p>
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                                isSelected ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <div className="h-1.5 w-full bg-gray-900/50 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                background: "hsl(var(--primary))",
                                opacity: "0.8",
                              }}
                            />
                          </div>
                          <div
                            className={`grid transition-all duration-300 ease-in-out ${
                              isSelected
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="mt-3 space-y-3">
                                {Object.entries(groupedTransactions).map(
                                  ([date, transactions]) => (
                                    <div key={date} className="space-y-2">
                                      <p className="text-xs font-medium text-gray-400">
                                        {date}
                                      </p>
                                      <div className="space-y-1 pl-3 border-l border-gray-800">
                                        {transactions.map(
                                          (transaction, idx) => (
                                            <div
                                              key={idx}
                                              className="flex items-center justify-between p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors"
                                            >
                                              <p className="text-xs text-gray-300">
                                                {transaction.item}
                                              </p>
                                              <p className="text-xs text-gray-400">
                                                {formatCurrency(
                                                  transaction.amount
                                                )}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="items"
            className="mt-0 focus-visible:outline-none"
          >
            <div className="p-4">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-6">
                  Item Analysis
                </h3>
                <div className="space-y-6">
                  <div className="relative pl-4 border-l-2 border-emerald-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Highest Income Source
                    </p>
                    <p className="text-xl font-semibold text-emerald-400">
                      {incomeData.length > 0
                        ? `${
                            incomeData.sort((a, b) => b.amount - a.amount)[0]
                              .item
                          } (${formatCurrency(
                            incomeData.sort((a, b) => b.amount - a.amount)[0]
                              .amount
                          )})`
                        : "No income data"}
                    </p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-blue-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Most Frequent Source
                    </p>
                    <p className="text-xl font-semibold text-blue-400">
                      {Object.entries(
                        incomeData.reduce((acc, income) => {
                          acc[income.item] = (acc[income.item] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).sort(([, a], [, b]) => b - a)[0]?.[0] ||
                        "No income data"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
