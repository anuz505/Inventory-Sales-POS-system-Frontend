"use client";

import { useParams, useRouter } from "next/navigation";
import { useSale, useDeleteSale, useUpdateSale } from "@/hooks/use-sales";
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
  DialogTitle,
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
  Pencil,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { NewSaleType } from "@/types/sales-types";
import { salesFormControls } from "@/config/sales-form-controls";
import CommonForm from "@/components/common/forms";
import { SaleItemsField, SaleItem } from "@/components/sales/SaleItemsfield";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/use-customer";

// --- Helpers ---

const paymentMethodLabels: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  cash: "Cash",
  wallet: "Wallet",
  net_banking: "Net Banking",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  refunded: "bg-red-100 text-red-700 border-red-200",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

// --- Skeleton ---

function SaleByIdSkeleton() {
  return (
    <div className="bg-background">
      <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
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

// --- Edit Form Shape ---
interface EditSaleFormData {
  customer: string;
  discount_amount: string;
  payment_method: string;
  payment_status: string;
  notes: string;
}

// --- Main Page ---

export default function SaleById() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: sale, isLoading, isError, error } = useSale(id);
  const { mutate: deleteSale, isPending: deleteSalePending } = useDeleteSale();
  const { mutateAsync: updateSale, isPending: updateSalePending } =
    useUpdateSale();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});

  const [editFormData, setEditFormData] = useState<EditSaleFormData>({
    customer: "",
    discount_amount: "0",
    payment_method: "cash",
    payment_status: "pending",
    notes: "",
  });
  const [editItems, setEditItems] = useState<SaleItem[]>([]);

  const { data: productsData } = useProducts({ limit: "100" });
  const productOptions =
    productsData?.results.map((p) => ({ id: p.id, label: p.name })) ?? [];

  const { data: customersData } = useCustomers({ limit: "100" });
  const customerOptions =
    customersData?.pages?.flatMap((p: any) =>
      p.results.map((c: any) => ({ id: c.id, label: c.name })),
    ) ?? [];

  const controls = salesFormControls.map((control) => {
    if (control.name === "customer")
      return { ...control, options: customerOptions };
    if (control.name === "payment_status")
      return {
        ...control,
        options: [
          { id: "pending", label: "Pending" },
          { id: "completed", label: "Completed" },
        ],
      };
    return control;
  });

  const handleEditOpen = (open: boolean) => {
    if (open && sale) {
      setEditFormData({
        customer: sale.customer,
        discount_amount: sale.discount_amount,
        payment_method: sale.payment_method,
        payment_status: sale.payment_status,
        notes: sale.notes ?? "",
      });
      setEditItems(
        sale.items.map((item: any) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
        })),
      );
      setFormErrors({});
    }
    setEditOpen(open);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (editItems.some((item) => !item.product)) {
      setFormErrors({ items: "All items must have a product selected." });
      return;
    }

    const payload: Partial<NewSaleType> = {
      customer: editFormData.customer,
      items: editItems.map(({ product, quantity }) => ({ product, quantity })),
      discount_amount: Number(editFormData.discount_amount),
      payment_method:
        editFormData.payment_method as NewSaleType["payment_method"],
      payment_status:
        editFormData.payment_status as NewSaleType["payment_status"],
      notes: editFormData.notes,
    };

    try {
      await updateSale({ id, data: payload });
      setEditOpen(false);
      toast.success(
        editFormData.payment_status === "completed"
          ? "Sale completed! Invoice has been sent."
          : "Sale updated successfully!",
      );
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
        toast.error("Failed to update sale.");
      }
    }
  };

  const handleRefund = async () => {
    try {
      await updateSale({ id, data: { payment_status: "refunded" } });
      setRefundOpen(false);
      toast.success("Sale refunded. Stock has been restored.");
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ??
        err?.response?.data?.non_field_errors?.[0] ??
        (typeof err?.response?.data === "string" ? err.response.data : null) ??
        JSON.stringify(err?.response?.data) ??
        "Failed to refund sale.";
      toast.error(msg);
    }
  };

  const handleDelete = () => {
    deleteSale(sale!.id, {
      onSuccess: () => {
        toast.success("Sale deleted successfully");
        setDeleteOpen(false);
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
      <div className="bg-background">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
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

  const isPending = sale.payment_status === "pending";
  const isCompleted = sale.payment_status === "completed";

  return (
    <div className="bg-background">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 pt-10">
        {/* Back + Action Buttons */}
        <div className="flex justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sales
          </Button>

          <div className="flex gap-2">
            {/* Edit — pending only */}
            {isPending && (
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Sale
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="max-w-lg overflow-y-auto"
                  style={{ maxHeight: "75vh" }}
                >
                  <DialogHeader>
                    <DialogTitle>Edit Sale — {sale.invoice_number}</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 mt-1">
                    <SaleItemsField
                      items={editItems}
                      productOptions={productOptions}
                      onChange={setEditItems}
                      error={formErrors.items}
                    />
                    <hr className="border-border" />
                    <CommonForm
                      formControls={controls}
                      formData={editFormData}
                      setFormData={setEditFormData}
                      onSubmit={handleEditSubmit}
                      buttonText={
                        updateSalePending ? "Saving..." : "Save Changes"
                      }
                      isBtnDisabled={updateSalePending}
                      errors={formErrors}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Refund — completed only */}
            {isCompleted && (
              <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Refund this sale?</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    This will mark invoice{" "}
                    <span className="font-medium text-foreground">
                      {sale.invoice_number}
                    </span>{" "}
                    as refunded and restore all stock quantities. This cannot be
                    undone.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="destructive"
                      onClick={handleRefund}
                      disabled={updateSalePending}
                      className="flex-1"
                    >
                      {updateSalePending ? "Processing..." : "Yes, Refund"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setRefundOpen(false)}
                      disabled={updateSalePending}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Delete */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete invoice{" "}
                  <span className="font-medium text-foreground">
                    {sale.invoice_number}
                  </span>
                  . This action cannot be undone.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteSalePending}
                    className="flex-1"
                  >
                    {deleteSalePending ? "Deleting..." : "Yes, Delete"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(false)}
                    disabled={deleteSalePending}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                PAYMENT_STATUS_STYLES[sale.payment_status] ??
                "bg-gray-100 text-gray-600"
              }`}
            >
              {sale.payment_status}
            </span>
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
              value: `Rs. ${sale.total_amount}`,
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
                  <TableHead className="text-right">Subtotal</TableHead>
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
                        (item as any).product ??
                        "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {(item as any).quantity ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      Rs. {(item as any).unit_price ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      Rs. {(item as any).subtotal ?? "—"}
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
                  - Rs. {sale.discount_amount}
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
