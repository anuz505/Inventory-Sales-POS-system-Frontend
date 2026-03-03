"use client";
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
import { useCategories } from "@/hooks/use-category";
import React, { useCallback, useEffect, useState } from "react";
import { useSuppliers } from "@/hooks/use-supplier";
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
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/use-debounce";

function FiltersProducts() {
  const searchParam = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParam.get(key) ?? "";

  const [searchName, setSearchName] = useState(getParam("name"));
  const [selectedCategory, setSelectedCategory] = useState(
    getParam("category"),
  );
  const [selectedSupplier, setSelectedSupplier] = useState(
    getParam("supplier"),
  );
  const [sortSelectValue, setSortSelectValue] = useState(getParam("ordering"));
  const [minSellingPrice, setMinSellingPrice] = useState(
    getParam("min_selling_price"),
  );
  const [maxSellingPrice, setMaxSellingPrice] = useState(
    getParam("max_selling_price"),
  );
  const [minCostPrice, setMinCostPrice] = useState(getParam("min_cost_price"));
  const [maxCostPrice, setMaxCostPrice] = useState(getParam("max_cost_price"));
  const [minStock, setMinStock] = useState(getParam("min_stock"));
  const [maxStock, setMaxStock] = useState(getParam("max_stock"));
  const [lowStock, setLowStock] = useState(
    searchParam.get("low_stock") === "true",
  );
  const [createdAfter, setCreatedAfter] = useState(getParam("created_after"));
  const [createdBefore, setCreatedBefore] = useState(
    getParam("created_before"),
  );

  // Debounced search — updates URL automatically
  const debounceSearch = useDebounce(searchName, 500);
  useEffect(() => {
    const current = searchParam.get("name") ?? "";
    if (debounceSearch === current) return;
    const params = new URLSearchParams(searchParam.toString());
    if (debounceSearch) params.set("name", debounceSearch);
    else params.delete("name");
    router.replace(`?${params.toString()}`);
  }, [debounceSearch]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParam.toString());

    // Sort / ordering
    if (sortSelectValue && sortSelectValue !== "none")
      params.set("ordering", sortSelectValue);
    else params.delete("ordering");

    // Category & Supplier
    if (selectedCategory && selectedCategory !== "none")
      params.set("category", selectedCategory);
    else params.delete("category");

    if (selectedSupplier && selectedSupplier !== "none")
      params.set("supplier", selectedSupplier);
    else params.delete("supplier");

    // Numeric / date filters
    const fields: [string, string][] = [
      ["min_selling_price", minSellingPrice],
      ["max_selling_price", maxSellingPrice],
      ["min_cost_price", minCostPrice],
      ["max_cost_price", maxCostPrice],
      ["min_stock", minStock],
      ["max_stock", maxStock],
      ["created_after", createdAfter],
      ["created_before", createdBefore],
    ];
    fields.forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    // Boolean
    if (lowStock) params.set("low_stock", "true");
    else params.delete("low_stock");

    router.replace(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedSupplier("");
    setSortSelectValue("");
    setMinSellingPrice("");
    setMaxSellingPrice("");
    setMinCostPrice("");
    setMaxCostPrice("");
    setMinStock("");
    setMaxStock("");
    setLowStock(false);
    setCreatedAfter("");
    setCreatedBefore("");
    setSearchName("");
    router.replace("?");
  };

  // Categories infinite scroll
  const {
    data: categories,
    isLoading: categoryLoading,
    error: categoryError,
    fetchNextPage: fetchNextCategories,
    hasNextPage: hasNextCategories,
    isFetchingNextPage: isFetchingNextCategories,
  } = useCategories();

  // Suppliers infinite scroll
  const {
    data: suppliers,
    isLoading: suppliersLoading,
    error: supplierError,
    fetchNextPage: fetchNextSuppliers,
    hasNextPage: hasNextSuppliers,
    isFetchingNextPage: isFetchingNextSuppliers,
  } = useSuppliers();

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
    <div className="px-4 flex items-center justify-end py-6 gap-3">
      <Input
        value={searchName}
        type="text"
        placeholder="Search Products"
        onChange={(e) => setSearchName(e.target.value)}
      />

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
          {/* Sort */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-bold text-lg mb-2">
              Sort
            </DropdownMenuLabel>
            <Select value={sortSelectValue} onValueChange={setSortSelectValue}>
              <SelectTrigger className="w-full max-w-64 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="sku">SKU</SelectItem>
                <SelectItem value="selling_price">Selling Price</SelectItem>
                <SelectItem value="cost_price">Cost Price</SelectItem>
                <SelectItem value="stock_quantity">Stock Quantity</SelectItem>
                <SelectItem value="created_at">Date</SelectItem>
              </SelectContent>
            </Select>
          </DropdownMenuGroup>

          {/* Filters */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-lg font-semibold mt-4 mb-2">
              Product Filters
            </DropdownMenuLabel>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              {/* Price */}
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

              {/* Stock */}
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
                <div className="flex items-center gap-2 mt-2 col-span-2">
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

              {/* Dates */}
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

              {/* Category */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Category
                </DropdownMenuLabel>
                {categoryError && (
                  <p className="text-red-500 text-xs mb-1">
                    Error fetching categories
                  </p>
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
                          <p className="px-2 py-1 text-xs text-muted-foreground">
                            Loading more...
                          </p>
                        )}
                      </div>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

              {/* Supplier */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Supplier
                </DropdownMenuLabel>
                {supplierError && (
                  <p className="text-red-500 text-xs mb-1">
                    Error fetching suppliers
                  </p>
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
                          <p className="px-2 py-1 text-xs text-muted-foreground">
                            Loading more...
                          </p>
                        )}
                      </div>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

              {/* Actions */}
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
