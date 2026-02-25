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
  const [selectedSku, setSelectedSku] = useState<string>(
    searchParam.get("sku") ?? "",
  );
  const [minSellingPrice, setMinSellingPrice] = useState<string>(
    searchParam.get("min_selling_price") ?? "",
  );
  const [maxSellingPrice, setMaxSellingPrice] = useState<string>(
    searchParam.get("max_selling_price") ?? "",
  );
  const [minCostPrice, setMinCostPrice] = useState<string>(
    searchParam.get("min_cost_price") ?? "",
  );
  const [maxCostPrice, setMaxCostPrice] = useState<string>(
    searchParam.get("max_cost_price") ?? "",
  );
  const [minStock, setMinStock] = useState<string>(
    searchParam.get("min_stock") ?? "",
  );
  const [maxStock, setMaxStock] = useState<string>(
    searchParam.get("max_stock") ?? "",
  );
  const [lowStock, setLowStock] = useState<boolean>(
    searchParam.get("low_stock") === "true",
  );
  const [createdAfter, setCreatedAfter] = useState<string>(
    searchParam.get("created_after") ?? "",
  );
  const [createdBefore, setCreatedBefore] = useState<string>(
    searchParam.get("created_before") ?? "",
  );

  const router = useRouter();
  const handleApplyFilters = () => {
    const currentFilters = new URLSearchParams(searchParam.toString());
    // Handle string/number/date filters
    const filterEntries = [
      ["min_selling_price", minSellingPrice],
      ["max_selling_price", maxSellingPrice],
      ["min_cost_price", minCostPrice],
      ["max_cost_price", maxCostPrice],
      ["min_stock", minStock],
      ["max_stock", maxStock],
      ["created_after", createdAfter],
      ["created_before", createdBefore],
    ];
    // Category and supplier
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
    // Loop for other filters
    filterEntries.forEach(([key, value]) => {
      if (value) currentFilters.set(key, value);
      else currentFilters.delete(key);
    });
    // Boolean filter
    if (lowStock) currentFilters.set("low_stock", "true");
    else currentFilters.delete("low_stock");

    router.replace(`?${currentFilters.toString()}`);
  };
  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedSupplier("");
    setMinSellingPrice("");
    setMaxSellingPrice("");
    setMinCostPrice("");
    setMaxCostPrice("");
    setMinStock("");
    setMaxStock("");
    setLowStock(false);
    setCreatedAfter("");
    setCreatedBefore("");
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
          <Button
            variant="outline"
            className="flex items-center gap-1 shadow-sm rounded-lg"
          >
            <Funnel className="w-4 h-4 mr-1" /> Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-6 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 min-w-[300px] border border-gray-200 dark:border-gray-700 z-50">
          <DropdownMenuGroup className="relative z-1000">
            <DropdownMenuLabel className="text-lg font-semibold mb-2">
              Product Filters
            </DropdownMenuLabel>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              {/* Price Filters */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Min Selling Price
                  </DropdownMenuLabel>
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={minSellingPrice}
                    onChange={(e) => setMinSellingPrice(e.target.value)}
                    placeholder="Min"
                  />
                </div>
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Max Selling Price
                  </DropdownMenuLabel>
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={maxSellingPrice}
                    onChange={(e) => setMaxSellingPrice(e.target.value)}
                    placeholder="Max"
                  />
                </div>
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Min Cost Price
                  </DropdownMenuLabel>
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={minCostPrice}
                    onChange={(e) => setMinCostPrice(e.target.value)}
                    placeholder="Min"
                  />
                </div>
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Max Cost Price
                  </DropdownMenuLabel>
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={maxCostPrice}
                    onChange={(e) => setMaxCostPrice(e.target.value)}
                    placeholder="Max"
                  />
                </div>
              </div>
              {/* Stock Filters */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Min Stock
                  </DropdownMenuLabel>
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    placeholder="Min"
                  />
                </div>
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Max Stock
                  </DropdownMenuLabel>
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={maxStock}
                    onChange={(e) => setMaxStock(e.target.value)}
                    placeholder="Max"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="lowStock"
                    checked={lowStock}
                    onChange={(e) => setLowStock(e.target.checked)}
                  />
                  <label htmlFor="lowStock" className="text-sm">
                    Low Stock
                  </label>
                </div>
              </div>
              {/* Date Filters */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Created After
                  </DropdownMenuLabel>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={createdAfter}
                    onChange={(e) => setCreatedAfter(e.target.value)}
                  />
                </div>
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Created Before
                  </DropdownMenuLabel>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={createdBefore}
                    onChange={(e) => setCreatedBefore(e.target.value)}
                  />
                </div>
              </div>
              {/* Category Filter */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Category
                </DropdownMenuLabel>
                {categoryError && (
                  <div className="text-red-500 text-xs mb-1">
                    Error fetching categories
                  </div>
                )}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full max-w-64 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="none">None</SelectItem>
                      {allCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <div ref={categorySentinel} className="h-1 w-full">
                        {isFetchingNextCategories && (
                          <div className="px-2 py-1 text-xs text-muted-foreground">
                            Loading more...
                          </div>
                        )}
                      </div>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              {/* Supplier Filter */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Supplier
                </DropdownMenuLabel>
                {supplierError && (
                  <div className="text-red-500 text-xs mb-1">
                    Error fetching suppliers
                  </div>
                )}
                <Select
                  value={selectedSupplier}
                  onValueChange={setSelectedSupplier}
                >
                  <SelectTrigger className="w-full max-w-64 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Suppliers</SelectLabel>

                      <SelectItem value="none">None</SelectItem>
                      {allSuppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                      <div ref={supplierSentinel} className="h-1 w-full">
                        {isFetchingNextSuppliers && (
                          <div className="px-2 py-1 text-xs text-muted-foreground">
                            Loading more...
                          </div>
                        )}
                      </div>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              {/* Buttons */}
              <div className="flex gap-2 mt-2 justify-end">
                <Button
                  onClick={handleApplyFilters}
                  className="rounded-md px-4 py-2 shadow-sm"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="rounded-md px-4 py-2 border border-red-400 text-red-600 hover:bg-red-50 transition-all shadow-sm"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FiltersProducts;
