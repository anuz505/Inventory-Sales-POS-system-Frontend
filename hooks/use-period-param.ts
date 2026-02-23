"use client";
import { useSearchParams } from "next/navigation";

export function usePeriod() {
  const searchParam = useSearchParams();
  const period = searchParam.get("period") || "12months";
  return period;
}
