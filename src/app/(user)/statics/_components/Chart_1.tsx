"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GroupedData } from "@/app/api/expense-manage";

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
        <div className="text-sm text-muted/80 text-center w-full font-medium">
          <span className="text-center">Monthly transactions</span>
        </div>
      </CardFooter>
    </Card>
  );
}
