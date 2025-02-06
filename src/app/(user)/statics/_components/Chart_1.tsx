"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Expense, Income } from "@/types/expense";
import { GroupedData } from "@/app/api/expense-manage";
const chartData1 = [
  {
    day: "1",
    income: 0,
    outcome: 2122,
  },
  {
    day: "2",
    income: 1000,
    outcome: 1212,
  },
  {
    day: "3",
    income: 0,
    outcome: 3200,
  },
  {
    day: "4",
    income: 0,
    outcome: 2222,
  },
  {
    day: "5",
    income: 0,
    outcome: 3331,
  },
  {
    day: "6",
    income: 0,
    outcome: 1122,
  },
  {
    day: "7",
    income: 0,
    outcome: 2232,
  },
  {
    day: "8",
    income: 0,
    outcome: 3200,
  },
  {
    day: "9",
    income: 0,
    outcome: 3832,
  },
  {
    day: "10",
    income: 0,
    outcome: 9333,
  },
  {
    day: "11",
    income: 0,
    outcome: 1111,
  },
  {
    day: "12",
    income: 0,
    outcome: 2122,
  },
  {
    day: "13",
    income: 0,
    outcome: 3200,
  },
  {
    day: "14",
    income: 0,
    outcome: 3433,
  },
  {
    day: "15",
    income: 0,
    outcome: 1199,
  },
  {
    day: "16",
    income: 0,
    outcome: 1211,
  },
  {
    day: "17",
    income: 1000,
    outcome: 5312,
  },
  {
    day: "18",
    income: 1000,
    outcome: 1643,
  },
  {
    day: "19",
    income: 0,
    outcome: 2578,
  },
  {
    day: "20",
    income: 0,
    outcome: 2533,
  },
  {
    day: "21",
    income: 0,
    outcome: 2786,
  },
  {
    day: "22",
    income: 0,
    outcome: 1888,
  },
  {
    day: "23",
    income: 1000,
    outcome: 2111,
  },
  {
    day: "24",
    income: 0,
    outcome: 1689,
  },
  {
    day: "25",
    income: 0,
    outcome: 3200,
  },
  {
    day: "26",
    income: 0,
    outcome: 5111,
  },
  {
    day: "27",
    income: 1000,
    outcome: 1221,
  },
  {
    day: "28",
    income: 0,
    outcome: 2011,
  },
  {
    day: "29",
    income: 0,
    outcome: 3911,
  },
  {
    day: "30",
    income: 0,
    outcome: 1223,
  },
];

const chartConfig = {
  amount: {
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function Chart_1({ chartData }: { chartData: GroupedData[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              className="text-muted"
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="timestamp"
                  labelKey="timestamp"
                  key={"timestamp"}
                />
              }
            />

            <Line
              dataKey="amount"
              type="monotone"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="text-sm text-muted/80 text-center w-full">
          <span className="text-center">Monthly transactions</span>
        </div>
      </CardFooter>
    </Card>
  );
}
