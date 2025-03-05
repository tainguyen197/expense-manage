import { Suspense } from "react";
import MonthStatic from "./_components/MonthStatic";
import StaticsTabWrapper from "./_components/StaticsTabWrapper";

const StaticPage = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
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
