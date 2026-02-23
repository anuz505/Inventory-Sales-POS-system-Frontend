"use client";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRevenueProfitchart } from "@/hooks/use-revenue-profit-chart";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { usePeriod } from "@/hooks/use-period-param";

const RevenueProfitChart = () => {
  const period = usePeriod();
  const {
    data: RevenueProfit,
    isLoading,
    error,
  } = useRevenueProfitchart(period);
  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-6 pb-3">
          <CardTitle>Profit & Margin Overview</CardTitle>
          <CardDescription>
            Showing total profit and profit margin for the last {period}
          </CardDescription>
        </div>
      </CardHeader>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          style={{
            width: "100%",
            maxWidth: "700px",
            maxHeight: "70vh",
            aspectRatio: 1.618,
          }}
          data={RevenueProfit}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="month" />
          <YAxis
            yAxisId="left"
            tickFormatter={(value) => `Rs ${value / 1000}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="var(--primary)"
            barSize={60}
            radius={[6, 6, 0, 0]}
          />
          <Line
            yAxisId="right"
            dataKey="profit_margin"
            stroke="black"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueProfitChart;
