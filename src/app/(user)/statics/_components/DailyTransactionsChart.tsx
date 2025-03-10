"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/curency";
import { GroupedData } from "@/types/expense";
import { useSearchParams } from "next/navigation";

export function DailyTransactionsChart({
  chartData,
}: {
  chartData: GroupedData[];
}) {
  const params = useSearchParams();
  const isIncome = params.get("tab") === "income";

  const chartConfig = {
    amount: {
      label: "Transaction",
      color: isIncome ? "hsl(var(--emerald-400))" : "hsl(var(--rose-400))",
    },
  } satisfies ChartConfig;

  const axisStyle = {
    fontSize: 12,
    fill: "#ffffff",
    fontWeight: 500,
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              bottom: 5,
              left: 0,
            }}
            barSize={40}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="timestamp"
              stroke="#ffffff"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
              dy={10}
              tick={axisStyle}
            />
            <YAxis
              stroke="#ffffff"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value)}
              orientation="right"
              tick={axisStyle}
              dx={5}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="bg-gray-800/95 border border-gray-700/50 backdrop-blur-sm text-white p-2 rounded-lg shadow-lg"
                  formatter={(value: any) => [
                    formatCurrency(value),
                    isIncome ? " Income" : " Outcome",
                  ]}
                />
              }
            />
            <Bar
              dataKey="amount"
              radius={[4, 4, 0, 0]}
              fill={
                isIncome ? "rgba(52, 211, 153, 0.6)" : "rgba(244, 63, 94, 0.6)"
              }
              className={
                isIncome
                  ? "hover:fill-emerald-500 transition-colors"
                  : "hover:fill-rose-500 transition-colors"
              }
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
