"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { DashboardTrendsResponse } from "@/types/dashboard-types";
const fetchTrends = async () => {
  const response = await axios.get<DashboardTrendsResponse>(
    "http://localhost:8000/api-dashboard/trends",
  );
  return response.data;
};
export function useTrends() {
  return useQuery({
    queryKey: ["trends"],
    queryFn: fetchTrends,
  });
}
