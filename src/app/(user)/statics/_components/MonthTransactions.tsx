import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import CategoryItem from "./CategoryItem";
import { Category } from "@/types/category";
import { DailyTransactionsChart } from "./DailyTransactionsChart";
import { ChartConfig } from "@/components/ui/chart";
import { mappingCategory, transactionMonthByCategory } from "../_utils";
import { Expense } from "@/types/expense";
import { groupTransactionsByDate } from "../../chat/_utils/groupTransactionsByDate";
import { formatCurrency } from "@/utils/curency";
import { useState } from "react";
import Item from "../../history/_components/client/Item";
import { getIconCategoryByName } from "@/utils/getIconCategoryByName";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";

type MonthTransactionsProps = {
  data: Expense[];
  categories: Category[];
};

const MonthTransactions = ({
  data = [],
  categories = [],
}: MonthTransactionsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const totalOutcome = data.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  // get expense history by date
  const expenseByDate = groupTransactionsByDate(data).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getExpenseHistoryCategory = transactionMonthByCategory(data);

  const chartConfig: ChartConfig = {};

  const expenseByCategory = mappingCategory(
    getExpenseHistoryCategory,
    categories
  )
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  expenseByCategory.forEach((item, key) => {
    chartConfig[item.id] = {
      color: `hsl(var(--chart-${key + 1}))`,
      label: item.category,
    };
  });

  const selectedCategoryTransactions = selectedCategory
    ? data
        .filter((expense) => expense.category === selectedCategory)
        .map((expense) => ({
          ...expense,
          category: getIconCategoryByName(expense.category),
        }))
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
    : [];

  // Group transactions by date
  const groupedTransactions = selectedCategoryTransactions.reduce(
    (acc, transaction) => {
      const date = format(new Date(transaction.timestamp), "MMM dd, yyyy");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    },
    {} as Record<string, typeof selectedCategoryTransactions>
  );

  return (
    <div className="space-y-4 p-4">
      <div className="mt-4">
        <DailyTransactionsChart chartData={expenseByDate} />
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-200 mb-1">
          Category Breakdown
        </h3>
        <p className="text-sm text-gray-400 mb-4">View spending by category</p>
        <div className="space-y-3">
          {expenseByCategory.map((item, index) => (
            <div
              className="relative cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
              key={index}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === item.id ? null : item.id
                )
              }
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-900/50 flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{item.category}</p>
                    <p className="text-sm text-gray-400">
                      {Math.round((item.total / totalOutcome) * 100)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-gray-200">
                    {formatCurrency(item.total)}
                  </p>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      selectedCategory === item.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((item.total / totalOutcome) * 100)}%`,
                    background: "hsl(var(--primary))",
                    opacity: "1",
                  }}
                />
              </div>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  selectedCategory === item.id
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
                            {transactions.map((transaction, idx) => (
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
                                  {formatCurrency(transaction.amount)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthTransactions;
