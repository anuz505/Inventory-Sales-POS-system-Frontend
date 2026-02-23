"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { DashboardTrendsResponse } from "@/types/dashboard-types";
import { FilterParams } from "./use-revenue-profit-chart";
import { buildApiUrl } from "@/utils/build-urls";

const fetchTrends = async (params: FilterParams) => {
  let url = buildApiUrl("http://localhost:8000/api-dashboard/trends", params);
  const response = await axios.get<DashboardTrendsResponse>(url);
  return response.data;
};
export function useTrends(params: FilterParams) {
  return useQuery({
    queryKey: ["trends", params],
    queryFn: () => fetchTrends(params),
  });
}
