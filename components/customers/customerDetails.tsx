"use client";
import React, { useState } from "react";
import {
  useCustomer,
  useDeleteCustomer,
  useUpdateCustomer,
} from "../../hooks/use-customer";
import { useSales } from "@/hooks/use-sales";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash, Pencil, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { NewCustomer } from "@/types/customer-types";
import { Sale } from "@/types/sales-types";

export default function CustomerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const {
    data: customer,
    isLoading: customerIsLoading,
    error: customerError,
  } = useCustomer(id);

  const { mutate: deleteCustomer, isPending: deleteCustomerPending } =
    useDeleteCustomer();

  const { mutate: updateCustomer, isPending: updateCustomerPending } =
    useUpdateCustomer();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<NewCustomer>>({});

  const handleEditOpen = (open: boolean) => {
    if (open && customer) {
      setEditForm({
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number,
        address: customer.address,
      });
    }
    setEditOpen(open);
  };

  const handleDelete = () => {
    deleteCustomer(customer!.id, {
      onSuccess: () => {
        toast.success("Customer deleted successfully");
        setDeleteOpen(false);
        router.back();
      },
      onError: () => {
        toast.error("Failed to delete customer");
      },
    });
  };

  const handleUpdate = () => {
    updateCustomer(
      { id: customer!.id, data: editForm },
      {
        onSuccess: () => {
          toast.success("Customer updated successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update customer");
        },
      },
    );
  };

  const {
    data: salesData,
    isLoading: salesLoading,
    error: salesError,
  } = useSales({ customer: id });

  const allSales: Sale[] =
    salesData?.pages.flatMap((page) => page.results) ?? [];

  if (customerIsLoading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  if (customerError || !customer)
    return <div className="text-red-500">Customer not found</div>;

  return (
    <div className="p-6 space-y-4 pb-20">
      {/* Top bar */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.push("/customers")}
        >
          <ArrowLeft className="h-2 w-2" />
          Back
        </Button>

        <div className="flex gap-2">
          {/* Edit Dialog */}
          <Dialog open={editOpen} onOpenChange={handleEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Edit
                <Pencil className="ml-1 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-lg overflow-y-auto"
              style={{ maxHeight: "80vh" }}
            >
              <DialogHeader className="font-semibold text-lg">
                Edit Customer
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editForm.name ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={editForm.phone_number ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        phone_number: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editForm.address ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleUpdate}
                    disabled={updateCustomerPending}
                  >
                    {updateCustomerPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditOpen(false)}
                    disabled={updateCustomerPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Delete
                <Trash className="ml-1 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-lg overflow-y-auto"
              style={{ maxHeight: "70vh" }}
            >
              <DialogHeader>Are you sure?</DialogHeader>
              <p className="text-sm text-muted-foreground">
                This will permanently delete{" "}
                <span className="font-medium text-foreground">
                  {customer.name}
                </span>
                . This action cannot be undone.
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteCustomerPending}
                >
                  {deleteCustomerPending ? "Deleting..." : "Yes, Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleteCustomerPending}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Customer Name */}
      <h1 className="px-6 pt-6 text-2xl font-semibold text-foreground">
        {customer.name}
      </h1>

      {/* Customer Details */}
      <div className="flex flex-wrap justify-baseline items-center gap-x-8 gap-y-4 px-6 pb-6 text-sm">
        <div className="w-40">
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium text-foreground">{customer.email}</p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Phone Number</p>
          <p className="font-medium text-foreground">{customer.phone_number}</p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Address</p>
          <p className="font-medium text-foreground">{customer.address}</p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Member Since</p>
          <p className="font-medium text-foreground">
            {new Date(customer.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Last Updated</p>
          <p className="font-medium text-foreground">
            {new Date(customer.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Sales linked to this customer */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg px-6 mb-4">Sales History</h2>
        {salesLoading ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : salesError ? (
          <div className="text-red-500 px-6">Error loading sales</div>
        ) : allSales.length > 0 ? (
          <div className="px-6">
            <Table>
              <TableCaption>Sales linked to this customer</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSales.map((sale: Sale) => (
                  <TableRow
                    key={sale.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/sales/${sale.id}`)}
                  >
                    <TableCell className="font-mono text-sm">
                      {sale.invoice_number}
                    </TableCell>
                    <TableCell>
                      {new Date(sale.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{sale.total_amount}</TableCell>
                    <TableCell>{sale.payment_status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center py-10 text-center">
            <ShoppingCart className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-semibold">No sales history yet</h3>
            <p className="text-sm text-muted-foreground">
              Sales associated with this customer will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
