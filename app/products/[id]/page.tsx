"use client";
import React from "react";
import { useProduct } from "@/hooks/useProducts";
import { Spinner } from "@/components/ui/spinner";
import { useSaleItem } from "@/hooks/useSalesItem";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TotalProductsSoldCard } from "@/components/ui/total-sales-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PackageOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductSalesChartLine } from "@/components/charts/products-sales-chart";
export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const {
    data: product,
    isLoading: productIsLoading,
    error: productError,
  } = useProduct(id);
  const {
    data: saleitem,
    isLoading: saleitemisLoading,
    error: saleItemError,
  } = useSaleItem(id);

  if (productIsLoading || saleitemisLoading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  if (productError || !product)
    return <div className="text-red-500">Product not found</div>;
  if (saleItemError) return <div className="text-red-500">Sale Item Error</div>;
  if (!saleitem) return <div>Product has not been sold.</div>;
  return (
    <div className="p-6 space-y-4">
      <Button variant="ghost" size="lg">
        <ArrowLeft className="h-2 w-2" />
        Back
      </Button>
      <h1 className="px-6 pt-6 text-2xl font-semibold text-foreground">
        {product.name}
      </h1>

      <div className="flex flex-wrap justify-baseline items-center gap-x-8 gap-y-4 px-6 pb-6 text-sm">
        <div className="w-30">
          <p className="text-muted-foreground">SKU</p>
          <p className="font-medium text-foreground">{product.sku}</p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Category</p>
          <p className="font-medium text-foreground">{product.category_name}</p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Supplier</p>
          <p className="font-medium text-foreground">{product.supplier_name}</p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Stock</p>
          <p
            className={`font-medium ${
              product.stock_quantity < 5
                ? "text-destructive"
                : "text-foreground"
            }`}
          >
            {product.stock_quantity}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Selling Price</p>
          <p className="font-medium text-foreground">
            Rs. {product.selling_price}
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between mx-auto">
          <div className="font-bold text-xl  px-6 h-2 ">
            Sales Related to Product
          </div>
          <div className="flex justify-end items-center gap-4 mr-5">
            <TotalProductsSoldCard quantity={saleitem.length} />
          </div>
        </div>
        {saleitem.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Staff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saleitem.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.invoice_number}</TableCell>
                  <TableCell>{sale.payment_status}</TableCell>
                  <TableCell>
                    {sale.items.find((item) => item.product == id)?.quantity}
                  </TableCell>
                  <TableCell>{sale.total_amount}</TableCell>
                  <TableCell>{sale.customer_name}</TableCell>
                  <TableCell>{sale.staff_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Card className="flex flex-col items-center justify-center py-0 text-center">
            <PackageOpen className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-semibold">No sales yet</h3>
            <p className="text-sm text-muted-foreground">
              Sales for this product will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
