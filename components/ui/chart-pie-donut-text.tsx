"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export const description = "A donut chart with text";

const chartConfig = {
  total_sales: {
    label: "Sales",
  },
  cash: {
    label: "Cash",
    color: "var(--chart-1)",
  },
  wallet: {
    label: "Wallet",
    color: "var(--chart-2)",
  },
  net_banking: {
    label: "Net Banking",
    color: "var(--chart-3)",
  },
  upi: {
    label: "UPI",
    color: "var(--chart-4)",
  },
  card: {
    label: "Card",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartPieDonutText() {
  const {
    data: stat,
    isLoading: statIsLoading,
    isError: statError,
  } = useDashboardStats();

  const chartData = React.useMemo(() => {
    const paymentMethods =
      stat?.this_period?.sales?.highest_revenue_payment_method ?? [];

    return paymentMethods.map((item) => ({
      payment_method: item.payment_method,
      total_sales: item.total_sales,
      fill: `var(--color-${item.payment_method})`,
    }));
  }, [stat]);

  const totalSales = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.total_sales, 0);
  }, [chartData]);

  if (statIsLoading) return <div>Loading...</div>;
  if (statError) return <div>Error loading chart data.</div>;

  return (
    <Card className="flex flex-col min-w-1/6 w-md sm:w-2/6">
      <CardHeader className="items-center pb-0">
        <CardTitle>Revenue by Payment Method</CardTitle>
        <CardDescription>This month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] "
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total_sales"
              nameKey="payment_method"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          Rs.{totalSales.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Sales
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total revenue by payment method
        </div>
      </CardFooter>
    </Card>
  );
}
