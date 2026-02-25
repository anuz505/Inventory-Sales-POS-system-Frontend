"use client";
import React from "react";
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
import { Button } from "../ui/button";
import { useSales } from "@/hooks/use-sales";
import { Spinner } from "../ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { parseSalesQuery } from "@/utils/product-params-parse";
import { Sale } from "@/types/sales-types";
import FiltersSales from "../filters/filtersales";

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-red-100 text-red-700",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  cash: "Cash",
  wallet: "Wallet",
  net_banking: "Net Banking",
};

function Sales() {
  const limit = 20;
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawQuery: Record<string, string | undefined> = {
    invoice_number: searchParams.get("invoice_number") ?? undefined,
    created_after: searchParams.get("created_after") ?? undefined,
    created_before: searchParams.get("created_before") ?? undefined,
    min_discount: searchParams.get("min_discount") ?? undefined,
    max_discount: searchParams.get("max_discount") ?? undefined,
    min_total: searchParams.get("min_total") ?? undefined,
    max_total: searchParams.get("max_total") ?? undefined,
    product: searchParams.get("product") ?? undefined,
    user: searchParams.get("user") ?? undefined,
    customer: searchParams.get("customer") ?? undefined,
    payment_method: searchParams.get("payment_method") ?? undefined,
    payment_status: searchParams.get("payment_status") ?? undefined,
  };

  const parsedQuery = parseSalesQuery(rawQuery);
  const params = parsedQuery.success
    ? {
        ...parsedQuery.data,
        limit: String(parsedQuery.data.limit ?? limit),
        offset:
          parsedQuery.data.offset !== undefined
            ? String(parsedQuery.data.offset)
            : undefined,
      }
    : { limit: String(limit) };

  const {
    data: sale,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useSales({ ...params, limit: limit.toString() });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading sales.</div>;

  const allSales: Sale[] = sale?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = sale?.pages?.[0]?.count ?? 0;

  return (
    <div className="py-5 px-7 w-full">
      <Button variant="ghost" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <FiltersSales />

      <div className="mt-4 rounded-lg border">
        <Table>
          <TableCaption className="mb-3">
            {allSales.length > 0
              ? `Showing ${allSales.length} of ${totalCount} sales`
              : "No sales found."}
          </TableCaption>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead>Invoice Number</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Staff Name</TableHead>
              <TableHead className="text-right">Discount</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-10"
                >
                  No sales records found.
                </TableCell>
              </TableRow>
            ) : (
              allSales.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors text-center"
                  onClick={() => router.push(`/sales/${s.id}`)}
                >
                  <TableCell className="font-medium">
                    {s.invoice_number}
                  </TableCell>
                  <TableCell>{s.customer_name || "—"}</TableCell>
                  <TableCell>{s.staff_name || "—"}</TableCell>
                  <TableCell className="text-right">
                    {parseFloat(s.discount_amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    Rs. {s.total_amount}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        PAYMENT_STATUS_STYLES[s.payment_status] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.payment_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {PAYMENT_METHOD_LABELS[s.payment_method] ??
                      s.payment_method}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Sales;
