"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/curency";
import { GroupedData } from "@/types/expense";

export function DailyTransactionsChart({
  chartData,
  type = "outcome",
}: {
  chartData: GroupedData[];
  type?: "income" | "outcome";
}) {
  const isIncome = type === "income";

  const chartConfig = {
    amount: {
      label: "Transaction",
      color: isIncome ? "hsl(var(--emerald-400))" : "hsl(var(--rose-400))",
    },
  } satisfies ChartConfig;

  const axisStyle = {
    fontSize: 12,
    fill: "rgba(255,255,255,0.6)",
    fontWeight: 500,
  };

  const maxAmount = Math.max(...chartData.map((item) => item.amount));

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 15,
              bottom: 20,
              left: 15,
            }}
            barSize={32}
          >
            <defs>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={
                    isIncome ? "rgb(52, 211, 153)" : "rgb(244, 63, 94)"
                  }
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor={
                    isIncome ? "rgb(52, 211, 153)" : "rgb(244, 63, 94)"
                  }
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              horizontal={true}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="timestamp"
              stroke="rgba(255,255,255,0.1)"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
              dy={10}
              tick={axisStyle}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="rgba(255,255,255,0.1)"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              orientation="right"
              tick={axisStyle}
              dx={2}
              width={35}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="bg-gray-800/95 border border-gray-700/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg shadow-lg text-xs"
                  formatter={(value: any) => [
                    formatCurrency(value),
                    isIncome ? " Income" : " Outcome",
                  ]}
                />
              }
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="url(#colorBar)"
                  opacity={entry.amount === maxAmount ? 1 : 0.7}
                  className="transition-opacity duration-200 hover:opacity-100"
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
