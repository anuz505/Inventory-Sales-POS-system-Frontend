"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
function FiltersDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const period = searchParams.get("period") || "12months";
  const handleClick = (period: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("period", period);
    router.replace(`?${params.toString()}`);
  };
  return (
    <div className="px-4 flex items-center justify-end pb-3 gap-2">
      <Button
        variant={period === "today" ? "default" : "outline"}
        onClick={() => handleClick("today")}
      >
        Today
      </Button>
      <Button
        variant={period === "3months" ? "default" : "outline"}
        onClick={() => handleClick("3months")}
      >
        3 Months
      </Button>
      <Button
        variant={period === "12months" ? "default" : "outline"}
        onClick={() => handleClick("12months")}
      >
        12 Months
      </Button>
    </div>
  );
}

export default FiltersDashboard;
