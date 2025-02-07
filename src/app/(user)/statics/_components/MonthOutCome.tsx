import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import CategoryItem from "./CategoryItem";
import {
  getExpenseHistoryByMonthAndYear,
  groupTransactionsByDate,
} from "@/app/api/expense-manage";
import { useSearchParams } from "next/navigation";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { Category } from "@/types/category";
import { TopCategoryChart } from "./TopCategoryChart";
import { DailyTransactionsChart } from "./DailyTransactionsChart";
import { ChartConfig } from "@/components/ui/chart";
import {
  convertArrayToObject,
  mappingCategory,
  transactionMonthByCategory,
} from "../_utils";

const MonthOutCome = () => {
  const searchParams = useSearchParams();
  const category = loadDataFromLocalStorage<Category[]>("category") || [];

  const currentMonth = searchParams.get("month");
  const currentYear = searchParams.get("year");

  const expenseMonth = getExpenseHistoryByMonthAndYear(
    Number(currentMonth),
    Number(currentYear)
  );

  // get expense history by date
  const expenseByDate = groupTransactionsByDate(expenseMonth).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getExpenseHistoryCategory = transactionMonthByCategory(expenseMonth);

  const chartConfig: ChartConfig = {};

  const expenseByCategory = mappingCategory(getExpenseHistoryCategory, category)
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  expenseByCategory.forEach((item, key) => {
    chartConfig[item.id] = {
      color: `hsl(var(--chart-${key + 1}))`,
      label: item.category,
    };
  });

  const chartData = convertArrayToObject(expenseByCategory);

  return (
    <Card>
      <CardHeader>
        <DailyTransactionsChart chartData={expenseByDate} />
        <TopCategoryChart chartData={[chartData]} chartConfig={chartConfig} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 mt-4 p-2 transition-all animate-fadeIn">
        <CardDescription className="text-muted/70 mb-2">
          All expenses:
        </CardDescription>
        {expenseByCategory.map((item) => (
          <CategoryItem
            icon={item.icon}
            category={item.category}
            key={item.icon}
            total={item.total}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default MonthOutCome;
