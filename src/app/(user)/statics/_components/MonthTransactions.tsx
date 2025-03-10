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

type MonthTransactionsProps = {
  data: Expense[];
  categories: Category[];
};

const MonthTransactions = ({
  data = [],
  categories = [],
}: MonthTransactionsProps) => {
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
            <div className="relative" key={index}>
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
                <p className="text-lg font-semibold text-gray-200">
                  {formatCurrency(item.total)}
                </p>
              </div>
              <div className="h-1 w-full bg-gray-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((item.total / totalOutcome) * 100)}%`,
                    backgroundColor: `hsl(var(--chart-${index + 1}))`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthTransactions;
