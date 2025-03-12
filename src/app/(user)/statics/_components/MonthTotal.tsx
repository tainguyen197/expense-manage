import { getExpenseByDate } from "@/actions/expense";
import { getIncomeByDate } from "@/actions/income";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/curency";
import { cn } from "@/lib/utils";

export default async function MonthTotal({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let { month, year } = await searchParams;

  if (!month || !year) {
    month = (new Date().getMonth() + 1).toString();
    year = new Date().getFullYear().toString();
  }

  // create a new date object with beginning of the month
  const from = new Date(Number(year), Number(month) - 1, 1);
  // create a new date object with end of the month
  const to = new Date(Number(year), Number(month), 0);

  const [outcomeData, incomeData] = await Promise.all([
    getExpenseByDate(from.toISOString(), to.toISOString()),
    getIncomeByDate(from.toISOString(), to.toISOString()),
  ]);

  const totalOutcome = outcomeData.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  const totalIncome = incomeData.reduce((acc, income) => {
    return acc + income.amount;
  }, 0);

  const remainingBalance = totalIncome - totalOutcome;
  const progressValue =
    totalOutcome > totalIncome ? 100 : (totalOutcome / totalIncome) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-gray-400 text-sm font-medium mb-2">
          Total Outcome
        </h3>
        <p className="text-2xl font-semibold text-rose-400">
          {formatCurrency(totalOutcome)}
        </p>
      </div>

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-gray-400 text-sm font-medium mb-2">Total Income</h3>
        <p className="text-2xl font-semibold text-emerald-400">
          {formatCurrency(totalIncome)}
        </p>
      </div>

      <div className="md:col-span-2 bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-medium text-gray-400">
              Budget Usage Remaining
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-2xl font-bold  ${
                  remainingBalance >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {remainingBalance >= 0
                  ? `+${formatCurrency(remainingBalance)}`
                  : formatCurrency(remainingBalance)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Progress
            className={`h-2 bg-gray-700 ${
              progressValue > 80
                ? "[&>div]:bg-amber-500"
                : "[&>div]:bg-emerald-500"
            }`}
            value={progressValue}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">
              {progressValue > 100
                ? "⚠️ You've exceeded your income"
                : progressValue > 80
                ? "⚠️ Approaching income limit"
                : "✨ Within budget"}
            </div>
            <div className="text-xs font-medium text-gray-400">
              {Math.round(progressValue || 0)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
