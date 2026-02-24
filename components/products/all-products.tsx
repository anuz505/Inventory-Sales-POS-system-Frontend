"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import AnimatedWarehouse from "../animated-icon/animated-icon-wrapper";
import { Button } from "../ui/button";
import { useProducts } from "@/hooks/useProducts";
import { Spinner } from "../ui/spinner";
import SkeletonTable from "../common/skeleton-table";
import { useRouter, useSearchParams } from "next/navigation";
import { parseProductQuery } from "@/utils/product-params-parse";
import FiltersProducts from "../filters/filtersproducts";
function Products() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [allProducts, setAllProducts] = useState<any[]>([]);
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

  useEffect(() => {
    setOffset(0);
    setAllProducts([]);
  }, [searchParam.toString()]);

  const {
    data: products,
    isLoading,
    error,
  } = useProducts({
    ...params,
    limit: limit.toString(),
    offset: offset.toString(),
  });
  const router = useRouter();
  React.useEffect(() => {
    if (products?.results) {
      setAllProducts((prev) => {
        const base = offset === 0 ? [] : prev;
        const combined = [...base, ...products.results];
        const uniqueMap = new Map();
        for (const item of combined) {
          uniqueMap.set(item.id, item);
        }
        return Array.from(uniqueMap.values());
      });
    }
  }, [products, offset]);

  const totalCount = products?.count || 0;
  const hasMore = offset + limit < totalCount;

  const handleLoadMore = () => {
    if (hasMore) setOffset(offset + limit);
  };

  if (isLoading && offset === 0) return <SkeletonTable />;
  if (error) {
    console.error(error);
    return <div className="text-red-500 text-sm">Error loading products.</div>;
  }
  const handleBackOnclick = () => {
    router.push("/");
  };
  return (
    <div className="py-5 px-7 w-full">
      <Button variant="ghost" onClick={handleBackOnclick}>
        <ArrowLeft />
        Back
      </Button>
      <FiltersProducts />
      <Table>
        <TableCaption>Product List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allProducts.map((product) => (
            <TableRow
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.category_name}</TableCell>
              <TableCell>{product.supplier_name}</TableCell>
              <TableCell>{product.stock_quantity}</TableCell>
              <TableCell>{product.selling_price}</TableCell>
              <TableCell>
                {product.stock_quantity < product.low_stock_limit ? (
                  <AnimatedWarehouse stock={"low"} />
                ) : (
                  <AnimatedWarehouse stock={"ok"} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end items-center gap-4 mt-4">
        <span>
          Showing {allProducts.length} of {totalCount} products
        </span>
        <Button
          onClick={handleLoadMore}
          disabled={!hasMore || isLoading}
          className={`px-4 py-2 rounded bg-primary  disabled:opacity-50`}
        >
          {isLoading ? (
            <div className="flex gap-2">
              <Spinner /> Loading..
            </div>
          ) : (
            "Load More"
          )}
        </Button>
      </div>
    </div>
  );
}

export default Products;
