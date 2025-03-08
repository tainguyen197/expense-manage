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
    <Card className="p-0">
      <CardHeader className="p-2">
        <DailyTransactionsChart chartData={expenseByDate} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-2 transition-all animate-fadeIn">
        <CardDescription className="text-muted/70 mb-2">
          All transactions:
        </CardDescription>
        {expenseByCategory.map((item, index) => (
          <div className="flex items-center w-full" key={index}>
            <CategoryItem
              icon={item.icon}
              category={item.category}
              key={item.icon}
              total={item.total}
            />
            <p className="text-sm text-accent ml-2">
              ({Math.round((item.total / totalOutcome) * 100)})%
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MonthTransactions;
