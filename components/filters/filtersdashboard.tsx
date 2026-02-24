"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Funnel } from "lucide-react";

function FiltersDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const period = searchParams.get("period") || "12months";
  const handleClick = (period: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("period", period);
    router.replace(`?${params.toString()}`);
  };
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    params.delete("period"); // Remove period if using custom range
    router.replace(`?${params.toString()}`);
  };
  return (
    <div className="px-4 flex items-center justify-end pb-3 gap-3">
      <div className="flex gap-2">
        <Button
          variant={period === "today" ? "default" : "outline"}
          onClick={() => handleClick("today")}
          className="flex items-center gap-1"
        >
          Today
        </Button>
        <Button
          variant={period === "3months" ? "default" : "outline"}
          onClick={() => handleClick("3months")}
          className="flex items-center gap-1"
        >
          3 Months
        </Button>
        <Button
          variant={period === "12months" ? "default" : "outline"}
          onClick={() => handleClick("12months")}
          className="flex items-center gap-1"
        >
          12 Months
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <Funnel className="w-4 h-4 mr-1" /> Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4 rounded-lg shadow-lg bg-white dark:bg-muted min-w-[220px]">
          <DropdownMenuGroup className="position-relative">
            <DropdownMenuLabel className="mb-2 font-semibold text-sm text-muted-foreground">
              Custom Range
            </DropdownMenuLabel>
            <div className="flex flex-col gap-2 position-absolute overflow-scroll">
              <DropdownMenuLabel className="text-xs">From</DropdownMenuLabel>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm "
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <DropdownMenuLabel className="text-xs">To</DropdownMenuLabel>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm position-absolute right-1 top-10"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </DropdownMenuGroup>
          <Button
            className="items-center flex justify-center m-2 "
            onClick={handleApplyFilters}
          >
            Apply Filter
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FiltersDashboard;
