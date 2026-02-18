"use client";
import React from "react";
import { useProduct } from "@/hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  if (error || !product)
    return <div className="text-red-500">Product not found</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <p>
          <b>SKU:</b> {product.sku}
        </p>
        <p>
          <b>Category:</b> {product.category_name}
        </p>
        <p>
          <b>Supplier:</b> {product.supplier_name}
        </p>
        <p>
          <b>Stock:</b> {product.stock_quantity}
        </p>
        <p>
          <b>Selling Price:</b> {product.selling_price}
        </p>
      </div>
    </div>
  );
}
