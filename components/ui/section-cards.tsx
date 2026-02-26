"use client";

import { useTrends } from "@/hooks/use-trends";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { usePeriod } from "@/hooks/use-period-param";
import { TrendingUpIcon } from "./trending-up";
import { TrendingDownIcon } from "./trending-down";
import { Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getStatsByParams(stats: any, params: any) {
  if (!stats) return null;
  return params.from ? stats.range : stats[params.period];
}

export function SectionCards() {
  const params = usePeriod();

  const {
    data: trends,
    isLoading: trendsLoading,
    error: trendsError,
  } = useTrends(params);

  const { data: stats, isLoading: statsLoading } = useDashboardStats(params);

  if (trendsLoading || statsLoading) return "Loading...";
  if (trendsError)
    return <div className="text-red-500">Error loading data</div>;

  const currentStats = getStatsByParams(stats, params);

  const saleTrend = trends?.sales_trend;
  const profitTrend = trends?.profit_trend;
  const customerTrend = trends?.customer_trend;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {/* TOTAL REVENUE */}
      <Card>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl">
            Rs.{currentStats?.sales?.total_sales ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {saleTrend?.trend === "increasing" && <TrendingUpIcon />}
              {saleTrend?.trend === "decreasing" && <TrendingDownIcon />}
              {saleTrend?.trend === "stable" && <Minus />}
              {Math.abs(saleTrend?.percentage_change ?? 0)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          {saleTrend?.trend ?? "No data"}
        </CardFooter>
      </Card>

      {/* CUSTOMERS */}
      <Card>
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl">
            {currentStats?.inventory?.total_customers ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {customerTrend?.trend === "increasing" && <TrendingUpIcon />}
              {customerTrend?.trend === "decreasing" && <TrendingDownIcon />}
              {customerTrend?.trend === "stable" && <Minus />}
              {Math.abs(customerTrend?.percentage_change ?? 0)}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* PROFIT */}
      <Card>
        <CardHeader>
          <CardDescription>Profit</CardDescription>
          <CardTitle className="text-2xl">
            Rs.{currentStats?.sales?.total_profit_amount ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {profitTrend?.trend === "increasing" && <TrendingUpIcon />}
              {profitTrend?.trend === "decreasing" && <TrendingDownIcon />}
              {profitTrend?.trend === "stable" && <Minus />}
              {Math.abs(profitTrend?.percentage_change ?? 0)}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* REFUNDS */}
      <Card>
        <CardHeader>
          <CardDescription>Total Refunds</CardDescription>
          <CardTitle className="text-2xl">
            {currentStats?.inventory?.total_refunds?.length ?? 0}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          {currentStats?.inventory?.total_refunds?.length
            ? "Refunds exist in this period"
            : "No refunds in this period"}
        </CardFooter>
      </Card>
    </div>
  );
}
