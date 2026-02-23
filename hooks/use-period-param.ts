"use client";
import { useSearchParams } from "next/navigation";
import { FilterParams } from "./use-revenue-profit-chart";

export function usePeriod() {
  const searchParam = useSearchParams();
  const period = searchParam.get("period");

  const from = searchParam.get("from");
  const to = searchParam.get("to");
  const params: FilterParams = period
    ? { period, from: undefined, to: undefined }
    : from
      ? { from, to: to ?? "", period: undefined }
      : { period: "12months", from: undefined, to: undefined };
  return params;
}
