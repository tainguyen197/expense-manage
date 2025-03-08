"use server";

import { Suspense } from "react";
import MonthStatic from "./_components/MonthStatic";
import StaticsTabWrapper from "./_components/StaticsTabWrapper";
import { getExpenseByDate } from "@/actions/expense";
import { getIncomeByDate } from "@/actions/income";
import { getCategories } from "@/actions/category";

const StaticPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
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
    <div className="flex flex-col container">
      <div className="m-4 rounded-xl bg-white border border-solid overflow-hidden">
        <Suspense fallback={<div>Loading statics...</div>}>
          {/* TODO: Wrap the MonthStatic with new MonthStaticWrapper */}
          <MonthStatic searchParams={searchParams} />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading statics...</div>}>
        <StaticsTabWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
};
export default StaticPage;
