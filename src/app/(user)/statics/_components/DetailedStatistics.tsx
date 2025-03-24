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
      <TabsList className="w-full flex p-0 h-auto bg-transparent border-b border-gray-700/30">
        <TabsTrigger
          value="outcome"
          className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-rose-400 data-[state=active]:text-rose-400 text-gray-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <CircleArrowUp className="h-4 w-4" />
            <span className="font-medium text-sm">Outcome</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="income"
          className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-400 data-[state=active]:text-emerald-400 text-gray-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <CircleArrowDown className="h-4 w-4" />
            <span className="font-medium text-sm">Income</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="outcome" className="mt-0 focus-visible:outline-none">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="w-full flex p-0 h-auto bg-transparent border-b border-gray-700/30">
            <TabsTrigger
              value="daily"
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-400 data-[state=active]:text-gray-200 text-gray-300 transition-colors"
            >
              <span className="font-medium text-sm">Daily</span>
            </TabsTrigger>
            <TabsTrigger
              value="category"
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-400 data-[state=active]:text-gray-200 text-gray-300 transition-colors"
            >
              <span className="font-medium text-sm">Category</span>
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-400 data-[state=active]:text-gray-200 text-gray-300 transition-colors"
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

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 mb-6">
                  Daily Overview
                </h3>
                <div className="space-y-6">
                  <div className="relative pl-4 border-l-2 border-emerald-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Average Spending per Day
                    </p>
                    <p className="text-xl font-semibold text-white">
                      {formatCurrency(averageSpendingPerDay)}
                    </p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-rose-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Highest Spending Day
                    </p>
                    <p className="text-xl font-semibold text-rose-400">
                      {format(new Date(highestSpendingDay), "MMM dd")} (
                      {formatCurrency(highestAmount)})
                    </p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-blue-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Lowest Spending Day
                    </p>
                    <p className="text-xl font-semibold text-blue-400">
                      {format(new Date(lowestSpendingDay), "MMM dd")} (
                      {formatCurrency(lowestAmount)})
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
                  Time Analysis
                </h3>
                <div className="space-y-6">
                  <div className="relative pl-4 border-l-2 border-emerald-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Average per Transaction
                    </p>
                    <p className="text-xl font-semibold text-emerald-400">
                      {formatCurrency(averageSpendingPerTransaction)}
                    </p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-orange-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Peak Spending Time
                    </p>
                    <p className="text-xl font-semibold text-orange-400">
                      {peakSpendingTime}
                    </p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-blue-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      No-Spending Days
                    </p>
                    <p className="text-xl font-semibold text-blue-400">
                      {noSpendingDays} days
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
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-6">
                  Category Analysis
                </h3>
                <div className="space-y-6">
                  <div className="relative pl-4 border-l-2 border-rose-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Most Spent Category
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {mostSpentCategoryInfo.icon}
                      </span>
                      <p className="text-xl font-semibold text-rose-400">
                        {mostSpentCategoryInfo.name} (
                        {formatCurrency(mostSpentCategoryInfo.amount)})
                      </p>
                    </div>
                  </div>
                  <div className="relative pl-4 border-l-2 border-emerald-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Least Spent Category
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {leastSpentCategoryInfo.icon}
                      </span>
                      <p className="text-xl font-semibold text-emerald-400">
                        {leastSpentCategoryInfo.name} (
                        {formatCurrency(leastSpentCategoryInfo.amount)})
                      </p>
                    </div>
                  </div>
                  <div className="relative pl-4 border-l-2 border-blue-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Most Frequent Category
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {mostFrequentCategoryInfo.icon}
                      </span>
                      <p className="text-xl font-semibold text-blue-400">
                        {mostFrequentCategoryInfo.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-sm font-medium text-gray-200 mb-1">
                  Category Breakdown
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  View spending by category
                </p>
                <div className="space-y-3">
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
                        ? groupTransactionsByDateAndCategory(
                            outcomeData,
                            item.id
                          )
                        : {};

                      return (
                        <div
                          className="relative cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
                          key={index}
                          onClick={() =>
                            setSelectedCategory(isSelected ? null : item.id)
                          }
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-900/50 flex items-center justify-center text-lg">
                                {item.icon}
                              </div>
                              <div>
                                <p className="font-medium text-gray-200">
                                  {item.category}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {percentage}%
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold text-gray-200">
                                {formatCurrency(item.total)}
                              </p>
                              <ChevronDown
                                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                                  isSelected ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </div>
                          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                background: "hsl(var(--primary))",
                                opacity: "0.6",
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
                              <div className="mt-4 space-y-4">
                                {Object.entries(groupedTransactions).map(
                                  ([date, transactions]) => (
                                    <div key={date} className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <div className="h-px flex-1 bg-gray-800"></div>
                                        <p className="text-sm font-medium text-gray-400">
                                          {date}
                                        </p>
                                        <div className="h-px flex-1 bg-gray-800"></div>
                                      </div>
                                      <div className="space-y-2 pl-4 border-l border-gray-800">
                                        {transactions.map(
                                          (transaction, idx) => (
                                            <div
                                              key={idx}
                                              className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                <p className="text-gray-200">
                                                  {transaction.item}
                                                </p>
                                              </div>
                                              <p className="text-gray-200 font-medium">
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
                      );
                    })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="items"
            className="mt-0 focus-visible:outline-none"
          >
            <div className="p-4">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-rose-400 mb-6">
                  Item Analysis
                </h3>
                <div className="space-y-6">
                  <div className="relative pl-4 border-l-2 border-rose-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Most Expensive Item
                    </p>
                    <p className="text-xl font-semibold text-rose-400">
                      {mostExpensiveItem.item} (
                      {formatCurrency(mostExpensiveItem.amount)})
                    </p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-emerald-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Most Purchased Item
                    </p>
                    <p className="text-xl font-semibold text-emerald-400">
                      {mostPurchasedItem}
                    </p>
                  </div>
                  <div className="relative pl-4 border-l-2 border-blue-400/50">
                    <p className="text-sm text-gray-300 mb-1">
                      Most Spent Item
                    </p>
                    <p className="text-xl font-semibold text-blue-400">
                      {mostSpentItem} (
                      {formatCurrency(spendingByItem[mostSpentItem])})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="income" className="mt-0 focus-visible:outline-none">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="w-full flex p-0 h-auto bg-transparent border-b border-gray-700/30">
            <TabsTrigger
              value="daily"
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-400 data-[state=active]:text-gray-200 text-gray-300 transition-colors"
            >
              <span className="font-medium text-sm">Daily</span>
            </TabsTrigger>
            <TabsTrigger
              value="category"
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-400 data-[state=active]:text-gray-200 text-gray-300 transition-colors"
            >
              <span className="font-medium text-sm">Category</span>
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="flex-1 px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-400 data-[state=active]:text-gray-200 text-gray-300 transition-colors"
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
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-6">
                  Category Analysis
                </h3>
                <div className="space-y-6">
                  <div className="space-y-3">
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
                          ? groupTransactionsByDateAndCategory(
                              incomeData,
                              item.id
                            )
                          : {};

                        return (
                          <div
                            className="relative cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
                            key={index}
                            onClick={() =>
                              setSelectedIncomeCategory(
                                isSelected ? null : item.id
                              )
                            }
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-900/50 flex items-center justify-center text-lg">
                                  {item.icon}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-200">
                                    {item.category}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {percentage}%
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-lg font-semibold text-gray-200">
                                  {formatCurrency(item.total)}
                                </p>
                                <ChevronDown
                                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                                    isSelected ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                  background: "hsl(var(--primary))",
                                  opacity: "0.6",
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
                                <div className="mt-4 space-y-4">
                                  {Object.entries(groupedTransactions).map(
                                    ([date, transactions]) => (
                                      <div key={date} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <div className="h-px flex-1 bg-gray-800"></div>
                                          <p className="text-sm font-medium text-gray-400">
                                            {date}
                                          </p>
                                          <div className="h-px flex-1 bg-gray-800"></div>
                                        </div>
                                        <div className="space-y-2 pl-4 border-l border-gray-800">
                                          {transactions.map(
                                            (transaction, idx) => (
                                              <div
                                                key={idx}
                                                className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                  <p className="text-gray-200">
                                                    {transaction.item}
                                                  </p>
                                                </div>
                                                <p className="text-gray-200 font-medium">
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
                        );
                      })}
                  </div>
                </div>
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
