"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/curency";

export function TopCategoryChart({
  chartData,
  chartConfig,
}: {
  chartData: any[];
  chartConfig: ChartConfig;
}) {
  const total = Object.keys(chartData[0]).reduce((acc, key, index) => {
    if (index < 4) return acc + chartData[0][key];

    return acc;
  }, 0);

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={80} outerRadius={130}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox?.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox?.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted/70 text-xl font-bold text-muted"
                        >
                          {formatCurrency(total)}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            {Object.keys(chartConfig).map((key, index) => {
              if (index < 4)
                return (
                  <RadialBar
                    key={key}
                    dataKey={key}
                    fill={chartConfig[key].color}
                    stackId="a"
                    cornerRadius={50}
                    className="stroke-transparent stroke-2"
                  />
                );
            })}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-muted/80">
          Top 4 highest categories
        </div>
      </CardFooter>
    </Card>
  );
}
