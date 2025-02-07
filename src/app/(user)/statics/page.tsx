"use client";

import { Suspense } from "react";
import MonthStatic from "./_components/MonthStatic";
import { StaticsTab } from "./_components/StaticsTab";

const StaticPage = () => {
  return (
    <div className="flex flex-col container">
      <div className="m-4 rounded-xl bg-white shadow-md overflow-hidden">
        <Suspense fallback={<div>Loading statics...</div>}>
          <MonthStatic />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading statics...</div>}>
        <StaticsTab />
      </Suspense>
    </div>
  );
};
export default StaticPage;
