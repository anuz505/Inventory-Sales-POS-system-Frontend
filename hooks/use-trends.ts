"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { DashboardTrendsResponse } from "@/types/dashboard-types";
const fetchTrends = async (period: string) => {
  const response = await axios.get<DashboardTrendsResponse>(
    `http://localhost:8000/api-dashboard/trends/?period=${period}`,
  );
  return response.data;
};
export function useTrends(period: string) {
  return useQuery({
    queryKey: ["trends", period],
    queryFn: () => fetchTrends(period),
  });
}
