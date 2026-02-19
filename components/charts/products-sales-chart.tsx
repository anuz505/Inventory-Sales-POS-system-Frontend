//   const date = created_at.split("T")[0];
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { SalesItemResponseType } from "@/types/sales-item-type";
import { useState, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
function getChartConfig(productName: string) {
  return {
    views: {
      label: "Sales",
    },
    quantity: {
      label: productName,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
}

function buildChartData(
  saleitem: SalesItemResponseType,
  productId: string,
): { date: string; quantity: number }[] {
  const aggregated: Record<string, number> = {};
  for (const sale of saleitem) {
    const date = sale.created_at.split("T")[0];
    for (const item of sale.items) {
      if (item.product === productId) {
        aggregated[date] = aggregated[date] ?? 0 + item.quantity;
      }
    }
  }

  return Object.entries(aggregated)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, quantity]) => ({ date, quantity }));
}

export function ProductSalesChartLine({
  saleitem,
  productId,
  productName,
}: {
  saleitem: SalesItemResponseType;
  productId: string;
  productName: string;
}) {
  const chartConfig = getChartConfig(productName);
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("quantity");
  const chartData = useMemo(
    () => buildChartData(saleitem, productId),
    [saleitem, productId],
  );
  const totalQuantity = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.quantity, 0),
    [chartData],
  );
  if (chartData.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Sales Over Time</CardTitle>
          <CardDescription>
            Total units sold by date for {productName}
          </CardDescription>
        </div>
        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.quantity.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {totalQuantity.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full"
        >
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              dataKey="quantity"
              label={{ value: "Quantity", angle: -90, position: "insideLeft" }}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-6"
                  nameKey="quantity"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              dataKey="quantity"
              type="monotone"
              stroke="var(--color-quantity)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
