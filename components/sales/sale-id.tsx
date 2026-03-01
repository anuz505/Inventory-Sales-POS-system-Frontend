"use client";

import { useParams, useRouter } from "next/navigation";
import { useSale, useDeleteSale } from "@/hooks/use-sales";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Receipt,
  User,
  UserCheck,
  CreditCard,
  CalendarDays,
  FileText,
  Trash,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { downloadSalesReport } from "@/services/salescsv";

// --- Helpers ---

const paymentMethodLabels: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  cash: "Cash",
  wallet: "Wallet",
  net_banking: "Net Banking",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

// --- Skeleton ---

function SaleByIdSkeleton() {
  return (
    <div className=" bg-background">
      <div className="mx-auto  px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Separator />
        <Skeleton className="h-56 rounded-lg" />
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function SaleById() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: sale, isLoading, isError, error } = useSale(id);
  const { mutate: deleteSale, isPending: deleteSalePending } = useDeleteSale();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteSale(sale!.id, {
      onSuccess: () => {
        toast.success("Sale deleted successfully");
        setOpen(false);
        router.back();
      },
      onError: () => {
        toast.error("Failed to delete sale");
      },
    });
  };

  if (isLoading) return <SaleByIdSkeleton />;

  if (isError) {
    return (
      <div className=" bg-background">
        <div className=" px-4 py-10 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="-ml-2 mb-8 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sales
          </Button>

          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5">
            <p className="text-sm font-medium text-destructive">
              Failed to load sale:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!sale) return null;

  return (
    <div className=" bg-background">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 pt-10">
        {/* Back button + Delete button */}
        <div className="flex justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sales
          </Button>{" "}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Delete
                <Trash />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-lg overflow-y-auto"
              style={{ maxHeight: "70vh" }}
            >
              <DialogHeader>Are you sure?</DialogHeader>
              <div>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteSalePending}
                >
                  {deleteSalePending ? "Deleting..." : "Yes, Delete"}
                </Button>{" "}
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={deleteSalePending}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Title + Badges */}
        <div className="flex flex-col gap-4 mt-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-2/3 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Invoice #{sale.invoice_number}
              </h1>
              <p className="my-5 font-mono text-sm text-muted-foreground">
                {sale.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {sale.payment_status}
            </Badge>
            <Badge variant="secondary">
              {paymentMethodLabels[sale.payment_method]}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: User, label: "Customer", value: sale.customer_name || "—" },
            { icon: UserCheck, label: "Staff", value: sale.staff_name || "—" },
            {
              icon: CalendarDays,
              label: "Created",
              value: formatDate(sale.created_at),
            },
            {
              icon: CreditCard,
              label: "Total",
              value: sale.total_amount,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="mb-1.5 flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  {label}
                </span>
              </div>
              <p className="truncate text-sm font-semibold text-card-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Line Items */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 px-5 py-4">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-card-foreground">
              Line Items
            </h2>
          </div>
          <Separator />
          {sale.items && sale.items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items.map((item, i) => (
                  <TableRow key={(item as any).id ?? i}>
                    <TableCell className="text-center text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {(item as any).product_name ??
                        (item as any).name ??
                        (item as any).product ??
                        "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {(item as any).quantity ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      Rs.
                      {(item as any).unit_price
                        ? (item as any).unit_price
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {(item as any).discount &&
                      Number((item as any).discount) > 0
                        ? `-${(item as any).discount}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {(item as any).total_price
                        ? (item as any).total_price
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No items found.
            </p>
          )}
        </div>

        {/* Notes + Payment Summary */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* Notes */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-card-foreground">
              Notes
            </h2>
            {sale.notes ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {sale.notes}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                No notes added.
              </p>
            )}
          </div>

          {/* Payment Summary */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-card-foreground">
              Payment Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-card-foreground">
                  Rs. {sale.subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-card-foreground">
                  - Rs.{sale.discount_amount}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="text-card-foreground">Total</span>
                <span className="text-card-foreground">
                  Rs. {sale.total_amount}
                </span>
              </div>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Last updated {formatDate(sale.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
