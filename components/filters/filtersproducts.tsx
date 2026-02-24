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
import React, { useCallback, useState } from "react";
import { parseProductQuery } from "@/utils/product-params-parse";
import { useSupplier } from "@/hooks/use-supplier";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

function FiltersProducts() {
  const searchParam = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParam.get("category") ?? "",
  );
  const [selectedSupplier, setSelectedSupplier] = useState<string>(
    searchParam.get("supplier") ?? "",
  );
  const router = useRouter();
  const handleApplyFilters = () => {
    const currentFilters = new URLSearchParams(searchParam.toString());
    if (selectedCategory && selectedCategory !== "none") {
      currentFilters.set("category", selectedCategory);
    } else {
      currentFilters.delete("category");
    }
    if (selectedSupplier && selectedSupplier !== "none") {
      currentFilters.set("supplier", selectedSupplier);
    } else {
      currentFilters.delete("supplier");
    }

    router.replace(`?${currentFilters.toString()}`);
  };
  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedSupplier("");
    router.replace("?");
  };
  const {
    data: categories,
    isLoading: categoryLoading,
    error: categoryError,
    fetchNextPage: fetchNextCategories,
    hasNextPage: hasNextCategories,
    isFetchingNextPage: isFetchingNextCategories,
  } = useCategory();
  const {
    data: suppliers,
    isLoading: suppliersLoading,
    error: supplierError,
    fetchNextPage: fetchNextSuppliers,
    hasNextPage: hasNextSuppliers,
    isFetchingNextPage: isFetchingNextSuppliers,
  } = useSupplier();

  const onCategoryEnd = useCallback(() => {
    if (hasNextCategories && !isFetchingNextCategories) fetchNextCategories();
  }, [hasNextCategories, isFetchingNextCategories, fetchNextCategories]);
  const onSupplierEnd = useCallback(() => {
    if (hasNextSuppliers && !isFetchingNextSuppliers) fetchNextSuppliers();
  }, [hasNextSuppliers, isFetchingNextSuppliers, fetchNextSuppliers]);
  const categorySentinel = useInfiniteScroll(onCategoryEnd, !categoryLoading);
  const supplierSentinel = useInfiniteScroll(onSupplierEnd, !suppliersLoading);
  const allCategories = categories?.pages.flatMap((page) => page.results) ?? [];
  const allSuppliers = suppliers?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="px-4 flex items-center justify-end pb-3 gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <Funnel className="w-4 h-4 mr-1" /> Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4 rounded-lg shadow-lg bg-white dark:bg-muted min-w-[220px]">
          <DropdownMenuGroup className="relative">
            <DropdownMenuLabel>Product Filters</DropdownMenuLabel>
            <div className="flex flex-col gap-2 overflow-y-auto">
              <DropdownMenuLabel>categories</DropdownMenuLabel>
              {categoryError && <div>Error fetching categories</div>}

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full max-w-64">
                  <SelectValue placeholder="select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="none">select</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                    <div ref={categorySentinel} className="h-1 w-full">
                      {isFetchingNextCategories && (
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                          Loading more...
                        </div>
                      )}
                    </div>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {supplierError && <div>Error Fetching Suppliers</div>}
              <Select
                value={selectedSupplier}
                onValueChange={setSelectedSupplier}
              >
                <SelectTrigger className="w-full max-w-64">
                  <SelectValue placeholder="select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">select</SelectItem>

                    {allSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                    <div ref={supplierSentinel} className="h-1 w-full">
                      {isFetchingNextSuppliers && (
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                          Loading more...
                        </div>
                      )}
                    </div>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </DropdownMenuGroup>
          <Button onClick={handleApplyFilters}> Apply Filters</Button>
          <Button onClick={handleClearFilters}>Clear Filters</Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FiltersProducts;
