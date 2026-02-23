"use client";
import { useTrends } from "@/hooks/use-trends";
import { TrendingDownIcon } from "./trending-down";
import { TrendingUpIcon } from "./trending-up";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Minus } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useSearchParams } from "next/navigation";
import { usePeriod } from "@/hooks/use-period-param";
export function SectionCards() {
  const period = usePeriod();

  const {
    data: trends,
    isLoading: TrendsIsLoading,
    error: TrendsError,
  } = useTrends(period);

  const {
    data: stats,
    isLoading: statsIsLoading,
    error: statsError,
  } = useDashboardStats(period);

  const sale_trend = trends?.sales_trend;
  const profit_trend = trends?.profit_trend;
  const customer_trend = trends?.customer_trend;
  if (TrendsIsLoading) return "Loading..";
  if (TrendsError) {
    console.error(TrendsError);
    return <div className="text-red-500 text-sm">Error loading trends.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            Rs. {stats?.[period]?.sales.total_sales}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex gap-1 items-center">
              {sale_trend?.trend === "increasing" && (
                <>
                  <TrendingUpIcon />+
                </>
              )}
              {sale_trend?.trend === "decreasing" && (
                <>
                  <TrendingDownIcon />-
                </>
              )}
              {sale_trend?.trend === "stable" && <Minus />}
              {Math.abs(trends?.sales_trend.percentage_change ?? 0)}%{" "}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm ">
          <div className="flex gap-2 font-medium">
            {sale_trend?.trend === "increasing" && (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <TrendingUpIcon />
                Upward Trend
              </span>
            )}
            {sale_trend?.trend === "decreasing" && <TrendingDownIcon />}
          </div>
          <div className="flex gap-2 font-medium text-muted-foreground ">
            {sale_trend?.trend === "increasing" && "Trending up this month"}
            {sale_trend?.trend === "decreasing" && "Trending down this month"}
            {sale_trend?.trend === "stable" && "No change this month"}
          </div>{" "}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats?.[period]?.inventory.total_customers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {customer_trend?.trend === "increasing" && (
                <>
                  <TrendingUpIcon />+
                </>
              )}
              {customer_trend?.trend === "decreasing" && (
                <>
                  <TrendingDownIcon />-
                </>
              )}
              {customer_trend?.trend === "stable" && <Minus />}
              {Math.abs(trends?.customer_trend.percentage_change ?? 0)}%{" "}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            {customer_trend?.trend === "increasing" && (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <TrendingUpIcon />
                New Customers Up
              </span>
            )}
            {customer_trend?.trend === "decreasing" && <TrendingDownIcon />}
          </div>
          <div className="flex gap-2 font-medium text-muted-foreground">
            {customer_trend?.trend === "increasing" && "Trending up this month"}
            {customer_trend?.trend === "decreasing" &&
              "Trending down this month"}
            {customer_trend?.trend === "stable" && "No change this month"}
          </div>{" "}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Profit</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {/* Replace with actual profit value if available */}
            Rs. {stats?.[period]?.sales.total_profit_amount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex gap-1 items-center">
              {profit_trend?.trend === "increasing" && (
                <>
                  <TrendingUpIcon />+
                </>
              )}
              {profit_trend?.trend === "decreasing" && (
                <>
                  <TrendingDownIcon />-
                </>
              )}
              {profit_trend?.trend === "stable" && <Minus />}
              {Math.abs(trends?.profit_trend.percentage_change ?? 0)}%{" "}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            {profit_trend?.trend === "increasing" && (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <TrendingUpIcon />
                Profit Rising
              </span>
            )}
            {profit_trend?.trend === "decreasing" && <TrendingDownIcon />}
          </div>
          <div className="flex gap-2 font-medium text-muted-foreground">
            {profit_trend?.trend === "increasing" && "Trending up this month"}
            {profit_trend?.trend === "decreasing" && "Trending down this month"}
            {profit_trend?.trend === "stable" && "No change this month"}
          </div>{" "}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Steady performance increase <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
