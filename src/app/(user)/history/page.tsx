import React, { Suspense } from "react";
import { StaticsTab } from "./_components/client/Tabs";
import TotalToday from "./_components/TotalToday";
import WeekCalender from "./_components/client/WeekCalender";
import Header from "./_components/Header";

async function HistoryPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="sticky top-0 z-10 px-4 py-2 bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-gray-700/50">
                <div className="h-5 w-5 animate-pulse bg-gray-600 rounded" />
              </div>
              <div className="space-y-0.5">
                <div className="h-5 w-32 animate-pulse bg-gray-600 rounded" />
                <div className="h-3 w-24 animate-pulse bg-gray-600 rounded" />
              </div>
            </div>
          </div>
        }
      >
        <Header />
      </Suspense>
      <main className="pt-8 pb-32">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
              <Suspense
                fallback={
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 w-32 animate-pulse bg-gray-700 rounded" />
                      <div className="flex gap-2">
                        <div className="h-8 w-8 animate-pulse bg-gray-700 rounded-full" />
                        <div className="h-8 w-8 animate-pulse bg-gray-700 rounded-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center p-2">
                          <div className="h-3 w-8 mb-1 animate-pulse bg-gray-700 rounded" />
                          <div className="h-6 w-6 animate-pulse bg-gray-700 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                }
              >
                <WeekCalender />
              </Suspense>
            </div>

            <Suspense
              fallback={
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
                  Loading today's total...
                </div>
              }
            >
              <TotalToday />
            </Suspense>

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
