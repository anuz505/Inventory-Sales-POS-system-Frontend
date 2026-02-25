"use client";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { usePeriod } from "@/hooks/use-period-param";
import { Leaderboard3 } from "@/components/products/leaderboard3";
import { ChartPieDonutText } from "./ui/chart-pie-donut-text";
import { FilterParams } from "@/hooks/use-revenue-profit-chart";

export default function DashboardDataFlow() {
  const params: FilterParams = usePeriod();
  const { data, isLoading, error } = useDashboardStats(params);

  return (
    <div className="p-6">
      <div className="flex gap-2 w-full">
        <Leaderboard3
          data={data}
          isLoading={isLoading}
          error={error}
          params={params}
        />
        <ChartPieDonutText
          data={data}
          isLoading={isLoading}
          error={error}
          params={params}
        />
      </div>
    </div>
  );
}
