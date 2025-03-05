import { getExpenseByDate } from "@/actions/expense";
import { getIncomeByDate } from "@/actions/income";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/curency";

async function MonthTotal({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let { month, year } = await searchParams;

  if (!month || !year) {
    month = new Date().getMonth().toString();
    year = new Date().getFullYear().toString();
  }

  // create a new date object with beginning of the month
  const from = new Date(Number(year), Number(month) - 1, 1);
  // create a new date object with end of the month
  const to = new Date(Number(year), Number(month), 0);

  const totalIncome = await getIncomeByDate(from, to);
  const totalOutcome = await getExpenseByDate(from, to);

  const totalIncomeAmount = totalIncome.reduce((acc, income) => {
    return acc + income.amount;
  }, 0);

  const totalOutcomeAmount = totalOutcome.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  const progressValue =
    totalOutcomeAmount > totalIncomeAmount
      ? 100
      : (totalOutcomeAmount / totalIncomeAmount) * 100;

  return (
    <div>
      <Progress className="h-2" value={progressValue} />
      <div className="flex justify-between mt-6 gap-1">
        <div className="block">
          <p className="text-xl font-bold transition-all animate-fadeIn text-muted/70">
            {formatCurrency(totalOutcomeAmount)}
          </p>
          <h3 className="text-sm text-gray-500">Outcome</h3>
        </div>
        <div className="block">
          <p className="text-xl font-bold text-muted/70 animate-fadeIn">
            {formatCurrency(totalIncomeAmount)}
          </p>

          <h3 className="text-sm text-gray-500 text-right">Income</h3>
        </div>
      </div>
    </div>
  );
}

export default MonthTotal;
