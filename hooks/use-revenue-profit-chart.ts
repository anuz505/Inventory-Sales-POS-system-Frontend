"use client";
import { buildApiUrl } from "@/utils/build-urls";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface RevenueProfitType {
  month: string;
  revenue: number;
  profit: number;
  profit_margin: number;
}
export type FilterParams =
  | { period: string; from?: undefined; to?: undefined }
  | { period?: undefined; from: string; to: string };

export type RevenueProfitResponse = RevenueProfitType[];
const fetchRevnueProfitChart = async (params: FilterParams) => {
  let url = buildApiUrl(
    "http://localhost:8000/api-dashboard/revenue-profit-chart",
    params,
  );

  const response = await axios.get<RevenueProfitResponse>(url, {
    withCredentials: true,
  });
  return response.data;
};

export function useRevenueProfitchart(params: FilterParams) {
  return useQuery({
    queryKey: ["revenue-profit-chart", params],
    queryFn: () => fetchRevnueProfitChart(params),
  });
}
