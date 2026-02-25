"use client";

import { useTrends } from "@/hooks/use-trends";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { usePeriod } from "@/hooks/use-period-param";

import { TrendingDownIcon } from "./trending-down";
import { TrendingUpIcon } from "./trending-up";
import { InventoryRadialChart } from "../charts/lowSupplyChart";

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

export function SectionCards() {
  const params = usePeriod();

  const {
    data: trends,
    isLoading: trendsLoading,
    error: trendsError,
  } = useTrends(params);

  const { data: stats, isLoading: statsLoading } = useDashboardStats(params);

  if (trendsLoading) return "Loading...";
  if (trendsError) {
    console.error(trendsError);
    return (
      <div className="text-red-500 text-sm">Error loading dashboard data.</div>
    );
  }

  const key = params.period ?? params.from!;
  const currentStats = stats?.[key];

  const salesTrend = trends?.sales_trend;
  const profitTrend = trends?.profit_trend;
  const customerTrend = trends?.customer_trend;

  const renderTrendBadge = (trend?: any) => {
    const percentage = Math.abs(trend?.percentage_change ?? 0);
    return (
      <Badge variant="outline" className="flex gap-1 items-center">
        {trend?.trend === "increasing" && (
          <>
            <TrendingUpIcon />+
          </>
        )}
        {trend?.trend === "decreasing" && (
          <>
            <TrendingDownIcon />-
          </>
        )}
        {trend?.trend === "stable" && <Minus className="w-3 h-3" />}
        {percentage}%
      </Badge>
    );
  };

  const renderTrendFooter = (trend?: any, positiveLabel?: string) => (
    <>
      <div className="flex gap-2 font-medium">
        {trend?.trend === "increasing" && (
          <span className="flex items-center gap-1 text-green-600">
            <TrendingUpIcon />
            {positiveLabel}
          </span>
        )}
        {trend?.trend === "decreasing" && (
          <span className="flex items-center gap-1 text-red-600">
            <TrendingDownIcon />
            Downward Trend
          </span>
        )}
        {trend?.trend === "stable" && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Minus className="w-3 h-3" />
            Stable
          </span>
        )}
      </div>
      <div className="text-muted-foreground">
        {trend?.trend === "increasing" && "Trending up this month"}
        {trend?.trend === "decreasing" && "Trending down this month"}
        {trend?.trend === "stable" && "No change this month"}
      </div>
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-4 lg:px-6 items-start">
      {/* LEFT: Stat Cards */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              Rs. {currentStats?.sales?.total_sales ?? 0}
            </CardTitle>
            <CardAction>{renderTrendBadge(salesTrend)}</CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {renderTrendFooter(salesTrend, "Upward Trend")}
          </CardFooter>
        </Card>

        {/* Customers Card */}
        <Card>
          <CardHeader>
            <CardDescription>New Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {currentStats?.inventory?.total_customers ?? 0}
            </CardTitle>
            <CardAction>{renderTrendBadge(customerTrend)}</CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {renderTrendFooter(customerTrend, "New Customers Up")}
          </CardFooter>
        </Card>

        {/* Profit Card */}
        <Card>
          <CardHeader>
            <CardDescription>Profit</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              Rs. {currentStats?.sales?.total_profit_amount ?? 0}
            </CardTitle>
            <CardAction>{renderTrendBadge(profitTrend)}</CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {renderTrendFooter(profitTrend, "Profit Rising")}
          </CardFooter>
        </Card>
      </div>

      {/* RIGHT: Inventory Chart — fixed width, no stretch */}
      <div className="w-full lg:w-[220px] shrink-0">
        <InventoryRadialChart
          inventory={currentStats?.inventory}
          totalProducts={currentStats?.inventory?.total_products ?? 0}
          isLoading={statsLoading}
        />
      </div>
    </div>
  );
}
