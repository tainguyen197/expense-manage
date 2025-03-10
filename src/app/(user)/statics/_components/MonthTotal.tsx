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

  const totalIncomeAmount = incomeData.reduce((acc, income) => {
    return acc + income.amount;
  }, 0);

  const totalOutcomeAmount = outcomeData.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  const progressValue =
    totalOutcomeAmount > totalIncomeAmount
      ? 100
      : (totalOutcomeAmount / totalIncomeAmount) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-400 mb-1">
              Total Outcome
            </span>
            <span className="text-2xl font-bold text-rose-400 transition-all animate-fadeIn">
              {formatCurrency(totalOutcomeAmount)}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-gray-700/50" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-400 mb-1">
              Total Income
            </span>
            <span className="text-2xl font-bold text-emerald-400 transition-all animate-fadeIn">
              {formatCurrency(totalIncomeAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-400">
              Remaining Balance
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-2xl font-bold ${
                  totalIncomeAmount - totalOutcomeAmount > 0
                    ? "text-blue-400"
                    : "text-indigo-400"
                }`}
              >
                {formatCurrency(
                  Math.abs(totalIncomeAmount - totalOutcomeAmount)
                )}
              </span>
              <span className="text-xs text-gray-500">
                {totalIncomeAmount - totalOutcomeAmount > 0
                  ? "saved"
                  : "over budget"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-400">Budget Usage</span>
            <span
              className={`text-lg font-semibold ${
                progressValue > 80 ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {Math.round(progressValue)}%
            </span>
          </div>
        </div>
        <div className="mt-3">
          <Progress
            className={`h-2 bg-gray-700 ${
              progressValue > 80
                ? "[&>div]:bg-rose-500"
                : "[&>div]:bg-emerald-500"
            }`}
            value={progressValue}
          />
          <div className="text-xs text-gray-500 mt-2">
            {progressValue > 100
              ? "⚠️ You've exceeded your income"
              : progressValue > 80
              ? "⚠️ Approaching income limit"
              : "✨ Within budget"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthTotal;
