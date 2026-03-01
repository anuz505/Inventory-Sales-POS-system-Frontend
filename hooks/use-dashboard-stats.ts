"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DashboardResponse } from "@/types/dashboard-types";
import { buildApiUrl } from "@/utils/build-urls";
import { FilterParams } from "./use-revenue-profit-chart";

const fetchDashboardStats = async (params: FilterParams) => {
  let url = buildApiUrl("http://localhost:8000/api-dashboard/", params);

  const response = await axios.get<DashboardResponse>(url, {
    withCredentials: true,
  });
  return response.data;
};

export function useDashboardStats(params: FilterParams) {
  return useQuery({
    queryKey: ["dashboard-stats", params],
    queryFn: () => fetchDashboardStats(params),
  });
}
