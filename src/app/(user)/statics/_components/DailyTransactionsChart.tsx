"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GroupedData } from "@/app/api/expense-manage";
import { formatCurrency } from "@/utils/curency";

const chartConfig = {
  amount: {
    label: "Transaction",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function DailyTransactionsChart({
  chartData,
}: {
  chartData: GroupedData[];
}) {
  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              className="text-muted"
              dataKey={"amount"}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <XAxis
              className="text-muted"
              dataKey="timestamp"
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              radius={2}
              dataKey="amount"
              type="monotone"
              fill="var(--color-amount)"
            ></Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="p-0 pt-4">
        <div className="text-sm text-muted/80 text-center w-full font-medium">
          <span className="text-center">Monthly transactions</span>
        </div>
      </CardFooter>
    </Card>
  );
}
