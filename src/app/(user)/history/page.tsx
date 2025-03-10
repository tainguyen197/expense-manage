import React, { Suspense } from "react";
import { StaticsTab } from "./_components/client/Tabs";
import TotalToday from "./_components/TotalToday";
import WeekCalender from "./_components/client/WeekCalender";
import Header from "./_components/Header";

async function HistoryPage() {
  return (
    <>
      <Header />
      <main className="pt-8 pb-32">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
              <WeekCalender />
            </div>

            <TotalToday />

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
              <Suspense
                fallback={<div className="p-4">Loading statistics...</div>}
              >
                <StaticsTab />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default HistoryPage;
