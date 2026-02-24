"use client ";
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
import { useCategory } from "@/hooks/use-category";
import React, { useState } from "react";
import { parseProductQuery } from "@/utils/product-params-parse";
import { useSupplier } from "@/hooks/use-supplier";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function FiltersProducts() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const searchParam = useSearchParams();
  const rawQuery: Record<string, string | undefined> = {
    name: searchParam.get("name") ?? undefined,
    sku: searchParam.get("sku") ?? undefined,
    description: searchParam.get("description") ?? undefined,
    category: searchParam.get("category") ?? undefined,
    supplier: searchParam.get("supplier") ?? undefined,
    min_selling_price: searchParam.get("min_selling_price") ?? undefined,
    max_selling_price: searchParam.get("max_selling_price") ?? undefined,
    min_cost_price: searchParam.get("min_cost_price") ?? undefined,
    max_cost_price: searchParam.get("max_cost_price") ?? undefined,
    min_stock: searchParam.get("min_stock") ?? undefined,
    max_stock: searchParam.get("max_stock") ?? undefined,
    low_stock: searchParam.get("low_stock") ?? undefined,
    created_after: searchParam.get("created_after") ?? undefined,
    created_before: searchParam.get("created_before") ?? undefined,
    ordering: searchParam.get("ordering") ?? undefined,
    limit: searchParam.get("limit") ?? undefined,
    offset: searchParam.get("offset") ?? undefined,
  };
  const parsedQuery = parseProductQuery(rawQuery);
  const params = parsedQuery.success ? parsedQuery.data : { limit, offset };
  const router = useRouter();
  const handleApplyFilters = () => {
    router.replace(`?${params.toString()}`);
  };
  const {
    data: categories,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategory();
  const {
    data: suppliers,
    isLoading: suppliersLoading,
    error: supplierError,
  } = useSupplier();
  return (
    <div className="px-4 flex items-center justify-end pb-3 gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <Funnel className="w-4 h-4 mr-1" /> Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4 rounded-lg shadow-lg bg-white dark:bg-muted min-w-[220px]">
          <DropdownMenuGroup className="position-relative">
            <DropdownMenuLabel>Product Filters</DropdownMenuLabel>
            <div className="flex flex-col gap-2 position-absolute overflow-scroll">
              <DropdownMenuLabel>categories</DropdownMenuLabel>
              <Select>
                <SelectTrigger className="w-full max-w-64">
                  <SelectValue placeholder="select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories?.pages
                      ?.flatMap((page) => page.results)
                      .map((category) => (
                        <SelectLabel key={category.id}>
                          {category.name}
                        </SelectLabel>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FiltersProducts;
