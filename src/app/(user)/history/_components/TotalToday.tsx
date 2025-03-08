import { getExpenseByDate } from "@/actions/expense";
import { getIncomeByDate } from "@/actions/income";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/curency";

const TotalToday = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  const tabUrl = params.tab ?? "outcome";
  const dateUrl = Number(params.date)
    ? new Date(Number(params.date))
    : new Date();

  let totalToday = 0;

  switch (tabUrl) {
    case "income": {
      const from = dateUrl;
      const to = new Date(dateUrl);

      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      const incomeList = await getIncomeByDate(
        from.toISOString(),
        to.toISOString()
      );

      totalToday = incomeList.reduce((acc, income) => {
        return acc + income.amount;
      }, 0);
      break;
    }
    case "outcome": {
      const from = dateUrl;
      const to = new Date(dateUrl);

      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      const expenseList = await getExpenseByDate(
        from.toISOString(),
        to.toISOString()
      );
      totalToday = expenseList.reduce((acc, expense) => {
        return acc + expense.amount;
      }, 0);
    }
    default:
      break;
  }

  return (
    <div className="font-semibold text-balance flex flex-col items-center gap-2">
      <span className={cn("text-3xl font-bold text-accent")}>
        {formatCurrency(totalToday)}
      </span>
      <span className="text-sm text-gray-500">
        ✨ It is your total expense today
      </span>
    </div>
  );
};

export default TotalToday;
