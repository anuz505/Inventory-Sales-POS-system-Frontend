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
import { ArrowLeft, Plus } from "lucide-react";
import AnimatedWarehouse from "../animated-icon/animated-icon-wrapper";
import { Button } from "../ui/button";
import { useCreateProduct, useProducts } from "@/hooks/useProducts";
import type { CreateProductPayload } from "@/hooks/useProducts";
import { Spinner } from "../ui/spinner";
import SkeletonTable from "../common/skeleton-table";
import { useRouter, useSearchParams } from "next/navigation";
import { parseProductQuery } from "@/utils/product-params-parse";
import FiltersProducts from "../filters/filtersproducts";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CommonForm from "../common/forms";
import { useCategory } from "@/hooks/use-category";
import { useSuppliers } from "@/hooks/use-supplier";
import { productFormControls } from "@/config/products-form-controls";

const initialProductForm: CreateProductPayload = {
  name: "",
  sku: "",
  description: "",
  category: "",
  supplier: "",
  cost_price: "",
  selling_price: "",
  stock_quantity: "",
  low_stock_limit: "",
};

function Products() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productFormData, setProductFormData] =
    useState<CreateProductPayload>(initialProductForm);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const searchParam = useSearchParams();
  const router = useRouter();

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

  useEffect(() => {
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

  const { data: categories } = useCategory();
  const categoryOptions: { id: string; label: string }[] =
    categories?.pages.flatMap((page) =>
      page.results.map((c) => ({ id: String(c.id), label: c.name })),
    ) ?? [];

  const { data: suppliers } = useSuppliers();
  const supplierOptions: { id: string; label: string }[] =
    suppliers?.pages.flatMap((page) =>
      page.results.map((s) => ({ id: String(s.id), label: s.name })),
    ) ?? [];

  const controls = productFormControls.map((control) => {
    if (control.name === "category")
      return { ...control, options: categoryOptions };
    if (control.name === "supplier")
      return { ...control, options: supplierOptions };
    return control;
  });

  const { mutateAsync, isPending } = useCreateProduct();

  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    try {
      await mutateAsync({
        ...productFormData,
        stock_quantity: Number(productFormData.stock_quantity),
        low_stock_limit: Number(productFormData.low_stock_limit),
        cost_price: productFormData.cost_price,
        selling_price: productFormData.selling_price,
      });
      setProductFormData(initialProductForm);
      setDialogOpen(false);
      toast.success("Added New Product");
    } catch (err: any) {
      if (err?.response?.data) {
        const rawErrors = err.response.data;
        const flatErrors: Record<string, string> = {};
        for (const key in rawErrors) {
          flatErrors[key] = Array.isArray(rawErrors[key])
            ? rawErrors[key][0]
            : rawErrors[key];
        }
        setFormErrors(flatErrors);
      }
    }
  };

  if (isLoading && offset === 0) return <SkeletonTable />;
  if (error) {
    console.error(error);
    return <div className="text-red-500 text-sm">Error loading products.</div>;
  }

  return (
    <div className="py-5 px-7 w-full">
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft />
          Back
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <CommonForm
              formControls={controls}
              formData={productFormData}
              setFormData={setProductFormData}
              onSubmit={handleProductFormSubmit}
              buttonText={isPending ? "Creating..." : "Create Product"}
              isBtnDisabled={isPending}
              errors={formErrors}
            />
          </DialogContent>
        </Dialog>
      </div>

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
            <TableHead>Stock Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allProducts.map((product) => (
            <TableRow
              key={product.id}
              className="cursor-pointer"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.category_name}</TableCell>
              <TableCell>{product.supplier_name}</TableCell>
              <TableCell>{product.stock_quantity}</TableCell>
              <TableCell>{product.selling_price}</TableCell>
              <TableCell>
                <AnimatedWarehouse
                  stock={
                    product.stock_quantity < product.low_stock_limit
                      ? "low"
                      : "ok"
                  }
                />
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
          onClick={() => setOffset((prev) => prev + limit)}
          disabled={!hasMore || isLoading}
          className="px-4 py-2 rounded bg-primary disabled:opacity-50"
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
