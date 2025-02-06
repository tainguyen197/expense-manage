"use client";

import { Chart_1 } from "./_components/Chart_1";
import MonthStatic from "./_components/MonthStatic";
import { StaticsTab } from "./_components/StaticsTab";

const StaticPage = () => {
  return (
    <div className="flex flex-col container">
      <div className="m-4 rounded-xl bg-white shadow-md overflow-hidden">
        <MonthStatic />
      </div>
      <StaticsTab />
    </div>
  );
};
export default StaticPage;
