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

const data = [
  { month: "Jan", revenue: 50000, margin: 20 },
  { month: "Feb", revenue: 80000, margin: 18 },
  { month: "Mar", revenue: 100000, margin: 12 },
  { month: "Apr", revenue: 120000, margin: 10 },
];

const RevenueMarginChart = () => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        {/* Revenue Axis (Left) */}
        <YAxis
          yAxisId="left"
          tickFormatter={(value) => `Rs ${value / 1000}k`}
        />

        {/* Margin Axis (Right) */}
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(value) => `${value}%`}
        />

        <Tooltip />

        {/* Revenue Bars */}
        <Bar
          yAxisId="left"
          dataKey="revenue"
          fill="#6366f1"
          radius={[6, 6, 0, 0]}
        />

        {/* Profit Margin Line */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="margin"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default RevenueMarginChart;
