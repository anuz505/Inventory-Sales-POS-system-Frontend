"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DashboardResponse } from "@/types/dashboard-types";

const fetchDashboardStats = async (period: string = "12months") => {
  const response = await axios.get<DashboardResponse>(
    `http://localhost:8000/api-dashboard/?period=${period}`,
  );
  return response.data;
};

export function useDashboardStats(period: string) {
  return useQuery({
    queryKey: ["dashboard-stats", period],
    queryFn: () => fetchDashboardStats(period),
  });
}
