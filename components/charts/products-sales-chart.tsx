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
import { useState } from "react";

function getChartConfig(productName: string) {
  return {
    views: {
      label: "Sales",
    },
    productName: {
      label: productName,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
}

export function ProductSalesChartLine({
  productName,
}: {
  productName: string;
}) {
  const chartConfig = getChartConfig(productName);
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("productName");
}
