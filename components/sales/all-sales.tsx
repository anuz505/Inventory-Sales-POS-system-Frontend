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
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useSales, useCreateSale } from "@/hooks/use-sales";
import { Spinner } from "../ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { parseSalesQuery } from "@/utils/product-params-parse";
import { NewSaleType, Sale } from "@/types/sales-types";
import FiltersSales from "../filters/filtersales";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import toast from "react-hot-toast";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/use-customer";
import CommonForm from "../common/forms";
import { salesFormControls } from "@/config/sales-form-controls";
import { SaleItemsField, SaleItem } from "../sales/SaleItemsfield";

// ─── Constants ───────────────────────────────────────────────────────────────

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

// ─── Form Data Shape ──────────────────────────────────────────────────────────
// Flat shape for CommonForm. `items` lives separately in its own state.

export interface SaleFormData {
  customer: string;
  discount_amount: string;
  payment_method: string;
  payment_status: string;
  notes: string;
}

const initialSaleForm: SaleFormData = {
  customer: "",
  discount_amount: "0",
  payment_method: "cash",
  payment_status: "completed",
  notes: "",
};

const initialItems: SaleItem[] = [{ product: "", quantity: 1 }];

// ─── Component ────────────────────────────────────────────────────────────────

function Sales() {
  const limit = 20;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saleFormData, setSaleFormData] =
    useState<SaleFormData>(initialSaleForm);
  // Items managed separately — CommonForm can't handle array fields
  const [saleItems, setSaleItems] = useState<SaleItem[]>(initialItems);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});

  // ── Query params ──
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

  // ── Data fetching ──
  const {
    data: sale,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useSales({ ...params, limit: limit.toString() });

  const { data: productsData } = useProducts({ limit: "100" });
  const productOptions: { id: string; label: string }[] =
    productsData?.results.map((p) => ({ id: p.id, label: p.name })) ?? [];

  const { data: customersData } = useCustomers({ limit: "100" });
  const customerOptions: { id: string; label: string }[] =
    customersData?.pages?.flatMap((p: any) =>
      p.results.map((c: any) => ({ id: c.id, label: c.name })),
    ) ?? [];

  const { mutateAsync: createSale, isPending } = useCreateSale();

  // ── Inject dynamic options into controls ──
  const controls = salesFormControls.map((control) => {
    if (control.name === "customer")
      return { ...control, options: customerOptions };
    return control;
  });

  // ── Submit — called by CommonForm's onSubmit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validate items separately since they're outside CommonForm
    if (saleItems.some((item) => !item.product)) {
      setFormErrors({ items: "All items must have a product selected." });
      return;
    }

    const payload: NewSaleType = {
      customer: saleFormData.customer,
      items: saleItems,
      discount_amount: Number(saleFormData.discount_amount),
      payment_method:
        saleFormData.payment_method as NewSaleType["payment_method"],
      payment_status:
        saleFormData.payment_status as NewSaleType["payment_status"],
      notes: saleFormData.notes,
    };

    try {
      await createSale(payload);
      setSaleFormData(initialSaleForm);
      setSaleItems(initialItems);
      setDialogOpen(false);
      toast.success("Sale created successfully!");
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
      } else {
        toast.error("Failed to create sale.");
      }
    }
  };

  // ── Render guards ──
  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading sales.</div>;

  const allSales: Sale[] = sale?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = sale?.pages?.[0]?.count ?? 0;

  // ── Render ──
  return (
    <div className="py-5 px-7 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        {/* Add Sale Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sale
            </Button>
          </DialogTrigger>

          <DialogContent
            className="max-w-lg overflow-y-auto"
            style={{ maxHeight: "70vh" }}
          >
            <DialogHeader>
              <DialogTitle>New Sale</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-1">
              <SaleItemsField
                items={saleItems}
                productOptions={productOptions}
                onChange={setSaleItems}
                error={formErrors.items}
              />

              <hr className="border-border" />

              <CommonForm
                formControls={controls}
                formData={saleFormData}
                setFormData={setSaleFormData}
                onSubmit={handleSubmit}
                buttonText={isPending ? "Creating..." : "Create Sale"}
                isBtnDisabled={isPending}
                errors={formErrors}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <FiltersSales />

      {/* Table */}
      <div className="mt-4 rounded-lg border">
        <Table>
          <TableCaption className="mb-3">
            {allSales.length > 0
              ? `Showing ${allSales.length} of ${totalCount} sales`
              : "No sales found."}
          </TableCaption>
          <TableHeader>
            <TableRow>
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
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
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

      {/* Load More */}
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
