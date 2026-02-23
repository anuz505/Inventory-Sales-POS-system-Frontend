"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface RevenueProfitType {
  month: string;
  revenue: number;
  profit: number;
  profit_margin: number;
}
export type RevenueProfitResponse = RevenueProfitType[];
const fetchRevnueProfitChart = async (period: string) => {
  const response = await axios.get<RevenueProfitResponse>(
    `http://localhost:8000/api-dashboard/revenue-profit-chart?period=${period}`,
  );
  return response.data;
};

export function useRevenueProfitchart(period: string) {
  return useQuery({
    queryKey: ["revenue-profit-chart", period],
    queryFn: () => fetchRevnueProfitChart(period),
  });
}
