import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CategoryItem from "./CategoryItem";
import {
  getExpenseHistoryByDate,
  getExpenseHistoryByMonthAndYear,
  groupTransactionsByDate,
} from "@/app/api/expense-manage";
import { useSearchParams } from "next/navigation";
import { Expense } from "@/types/expense";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { Category } from "@/types/category";
import { Chart } from "./Chart";
import { Chart_1 } from "./Chart_1";

// function list expenseMonth by category
const expenseMonthByCategory = (expenseList: Expense[]) => {
  const expenseByCategory = new Map<string, number>();

  expenseList.forEach((expense) => {
    const currentAmount = expenseByCategory.get(expense.category) ?? 0;
    expenseByCategory.set(expense.category, currentAmount + expense.amount);
  });

  return expenseByCategory;
};

const mappingExpenseCategory = (
  expenseByCategory: Map<string, number>,
  category: Category[]
) => {
  const data = category.map((item) => {
    const total = expenseByCategory.get(item.id) ?? 0;
    return {
      icon: item.icon,
      category: item.name,
      total,
    };
  });

  return data;
};

const CategoryStatic = () => {
  const searchParams = useSearchParams();
  const category = loadDataFromLocalStorage<Category[]>("category") || [];

  const currentMonth = searchParams.get("month");
  const currentYear = searchParams.get("year");

  const expenseMonth = getExpenseHistoryByMonthAndYear(
    Number(currentMonth),
    Number(currentYear)
  );

  // get expense history by date
  const expenseByDate = groupTransactionsByDate(expenseMonth);
  console.log("expenseByDate", expenseByDate);

  const getExpenseHistoryCategory = expenseMonthByCategory(expenseMonth);
  const data = mappingExpenseCategory(
    getExpenseHistoryCategory,
    category
  ).filter((item) => item.total > 0);

  return (
    <Card>
      <CardHeader>
        <Chart_1 chartData={expenseByDate} />
        <Chart />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 mt-4 p-2 transition-all animate-fadeIn">
        {data.map((item) => (
          <CategoryItem
            icon={item.icon}
            category={item.category}
            key={item.icon}
            total={item.total}
          />
        ))}
        {/* <CardDescription className="mt-6">
          <p className="text-md text-gray-500">You are doing great!</p>
        </CardDescription> */}
      </CardContent>
    </Card>
  );
};

export default CategoryStatic;
