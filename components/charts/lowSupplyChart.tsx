"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
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

interface InventoryData {
  total_refunds: { movement_type: string; reason: string; count: number }[];
  total_low_supply_products: number;
  low_supply_percentage: number;
  total_customers: number;
}

interface InventoryRadialChartProps {
  inventory?: InventoryData;
  isLoading?: boolean;
  totalProducts?: number;
}

const chartConfig = {
  healthy: {
    label: "Healthy Stock",
    color: "var(--chart-1)",
  },
  low: {
    label: "Low Stock",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function InventoryRadialChart({
  inventory,
  isLoading,
  totalProducts,
}: InventoryRadialChartProps) {
  if (isLoading) {
    return (
      <Card className="flex flex-col w-full">
        <CardHeader className="items-center pb-0 pt-4 px-4">
          <CardTitle className="text-sm font-semibold">
            Inventory Supply Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[160px]">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const lowSupply = inventory?.total_low_supply_products ?? 0;
  const lowSupplyPercentage = inventory?.low_supply_percentage ?? 0;
  const healthySupply = (totalProducts ?? 0) - lowSupply;
  const healthyPercentage = Math.round(100 - lowSupplyPercentage);

  const chartData = [
    {
      label: "Inventory Health",
      healthy: healthySupply,
      low: lowSupply,
    },
  ];

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0 pt-4 px-4">
        <CardTitle className="text-sm font-semibold">
          Inventory Supply Status
        </CardTitle>
        <CardDescription className="text-xs">Last 12 Months</CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-center px-4 pb-2 pt-0">
        <ChartContainer
          config={chartConfig}
          className="w-full max-w-[180px] h-[130px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={55}
            outerRadius={90}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 10}
                          className="fill-foreground text-xl font-bold"
                        >
                          {totalProducts}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 6}
                          className="fill-muted-foreground text-[10px]"
                        >
                          Products
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="healthy"
              fill="var(--chart-1)"
              stackId="a"
              cornerRadius={4}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="low"
              fill="var(--chart-2)"
              stackId="a"
              cornerRadius={4}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      {/* Legend */}
      <div className="flex justify-center gap-4 pb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--chart-1)]" />
          Healthy {healthyPercentage}%
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--chart-2)]" />
          Low {lowSupplyPercentage}%
        </span>
      </div>
    </Card>
  );
}
