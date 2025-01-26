import { Chart } from "../_components/Chart";
import MonthStatic from "./_components/MonthStatic";
import { StaticsTab } from "./_components/StaticsTab";

const StaticPage = () => {
  return (
    <div className="flex flex-col h-screen container">
      <div className="m-4 rounded-2xl bg-white shadow-md overflow-hidden">
        <MonthStatic />
      </div>
      <Chart />
      <StaticsTab />
    </div>
  );
};
export default StaticPage;
