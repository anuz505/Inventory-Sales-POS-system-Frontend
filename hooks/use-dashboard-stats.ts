"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DashboardResponse } from "@/types/dashboard-types";

const fetchDashboardStats = async () => {
  const response = await axios.get<DashboardResponse>(
    "http://localhost:8000/api-dashboard/",
  );
  return response.data;
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });
}
