import { Suspense } from "react";
import MonthStatic from "./_components/MonthStatic";
import StaticsTabWrapper from "./_components/StaticsTabWrapper";
import { getExpenseByDate } from "@/actions/expense";
import { getIncomeByDate } from "@/actions/income";
import { getCategories } from "@/actions/category";
import Header from "./_components/Header";

export const runtime = "edge";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="space-y-4">
          {/* Monthly Overview Card */}
          <Suspense
            fallback={
              <div className="p-8 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-xl">
                <div className="space-y-4">
                  <div className="h-8 w-48 bg-gray-700/50 animate-pulse rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-gray-700/50 animate-pulse rounded" />
                    <div className="h-24 bg-gray-700/50 animate-pulse rounded" />
                  </div>
                </div>
              </div>
            }
          >
            <MonthStatic searchParams={searchParams} />
          </Suspense>

          {/* Detailed Statistics */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-xl">
            <Suspense
              fallback={
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="h-8 w-64 bg-gray-700/50 animate-pulse rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="h-48 bg-gray-700/50 animate-pulse rounded" />
                      <div className="h-48 bg-gray-700/50 animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              }
            >
              <StaticsDataWrapper searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaticsDataWrapper = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // let { month, year } = await searchParams;

  // if (!month || !year) {
  //   month = (new Date().getMonth() + 1).toString();
  //   year = new Date().getFullYear().toString();
  // }

  // // create a new date object with beginning of the month
  // const from = new Date(Number(year), Number(month) - 1, 1);
  // // create a new date object with end of the month
  // const to = new Date(Number(year), Number(month), 0);

  // const [outcomeData, incomeData, categories] = await Promise.all([
  //   getExpenseByDate(from.toISOString(), to.toISOString()),
  //   getIncomeByDate(from.toISOString(), to.toISOString()),
  //   getCategories(),
  // ]);

  return <StaticsTabWrapper searchParams={searchParams} />;
};

export default StaticPage;
