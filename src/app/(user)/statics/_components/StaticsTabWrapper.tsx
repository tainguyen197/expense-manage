import { getExpenseByDate } from "@/actions/expense";
import { getIncomeByDate } from "@/actions/income";
import { getCategories } from "@/actions/category";
import DetailedStatistics from "./DetailedStatistics";

export default async function StaticsTabWrapper({
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

  const [outcomeData, incomeData, categories] = await Promise.all([
    getExpenseByDate(from.toISOString(), to.toISOString()),
    getIncomeByDate(from.toISOString(), to.toISOString()),
    getCategories(),
  ]);

  return (
    <div className="space-y-4">
      <DetailedStatistics
        outcomeData={outcomeData}
        incomeData={incomeData}
        categories={categories}
      />
    </div>
  );
}
