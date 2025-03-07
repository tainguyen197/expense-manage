import React, { Suspense } from "react";
import { StaticsTab } from "./_components/client/Tabs";
import TotalToday from "./_components/TotalToday";
import WeekCalender from "./_components/client/WeekCalender";

async function HistoryPage() {
  return (
    <Suspense fallback={<div>Loading statics...</div>}>
      <div className="flex flex-col items-center mx-auto container pt-4 gap-10 h-full">
        <div className="flex justify-center bg-background rounded-xl border border-solid">
          <div className="p-4 overflow-hidden">
            <WeekCalender />
          </div>
        </div>
        <TotalToday />
        <div className="flex justify-center w-full h-full">
          <StaticsTab />
        </div>
      </div>
    </Suspense>
  );
}

export default HistoryPage;
