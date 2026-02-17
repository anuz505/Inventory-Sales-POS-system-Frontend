"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useProducts } from "@/hooks/useProducts";

function Products() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const {
    data: products,
    isLoading,
    error,
  } = useProducts({ limit: limit.toString(), offset: offset.toString() });

  React.useEffect(() => {
    if (products?.results) {
      setAllProducts((prev) => {
        // If offset is 0, start fresh
        const base = offset === 0 ? [] : prev;
        // Combine previous and new products
        const combined = [...base, ...products.results];
        // Deduplicate by id
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

  if (isLoading && offset === 0) return <div>Loading...</div>;
  if (error) {
    console.error(error);
    return <div className="text-red-500 text-sm">Error loading products.</div>;
  }

  return (
    <div className="py-5 px-7">
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {allProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.category_name}</TableCell>
              <TableCell>{product.supplier_name}</TableCell>
              <TableCell>{product.stock_quantity}</TableCell>
              <TableCell>{product.selling_price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center gap-4 mt-4">
        <span>
          Showing {allProducts.length} of {totalCount} products
        </span>
        <button
          onClick={handleLoadMore}
          disabled={!hasMore || isLoading}
          className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50`}
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}

export default Products;
