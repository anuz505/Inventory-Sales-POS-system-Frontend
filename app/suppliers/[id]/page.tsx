"use client";
import React, { useState } from "react";
import {
  useSupplier,
  useDeleteSupplier,
  useUpdateSupplier,
} from "@/hooks/use-supplier";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash, Pencil, Truck } from "lucide-react";
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
import { CreateSupplierPayload } from "@/types/supplier-types";
import { useProducts } from "@/hooks/useProducts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductType } from "@/types/products-types";
export default function SupplierDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const { data: supplier, isLoading, error } = useSupplier(id);

  const { mutate: deleteSupplier, isPending: deleteIsPending } =
    useDeleteSupplier();
  const { mutate: updateSupplier, isPending: updateIsPending } =
    useUpdateSupplier();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CreateSupplierPayload>>({});

  const handleEditOpen = (open: boolean) => {
    if (open && supplier) {
      setEditForm({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      });
    }
    setEditOpen(open);
  };

  const handleDelete = () => {
    deleteSupplier(supplier!.id, {
      onSuccess: () => {
        toast.success("Supplier deleted successfully");
        setDeleteOpen(false);
        router.back();
      },
      onError: () => {
        toast.error("Failed to delete supplier");
      },
    });
  };

  const handleUpdate = () => {
    updateSupplier(
      { id: supplier!.id, data: editForm },
      {
        onSuccess: () => {
          toast.success("Supplier updated successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update supplier");
        },
      },
    );
  };
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts({ supplier: id });
  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  if (error || !supplier)
    return <div className="text-red-500">Supplier not found</div>;

  return (
    <div className="p-6 space-y-4 pb-20">
      {/* Top bar */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.push("/suppliers")}
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
                Edit Supplier
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        phone: Number(e.target.value),
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
                  <Button onClick={handleUpdate} disabled={updateIsPending}>
                    {updateIsPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditOpen(false)}
                    disabled={updateIsPending}
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
                  {supplier.name}
                </span>
                . This action cannot be undone.
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteIsPending}
                >
                  {deleteIsPending ? "Deleting..." : "Yes, Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleteIsPending}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Supplier Name */}
      <h1 className="px-6 pt-6 text-2xl font-semibold text-foreground">
        {supplier.name}
      </h1>

      {/* Supplier Details */}
      <div className="flex flex-wrap justify-baseline items-center gap-x-8 gap-y-4 px-6 pb-6 text-sm">
        <div className="w-40">
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium text-foreground">{supplier.email}</p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Phone</p>
          <p className="font-medium text-foreground">{supplier.phone}</p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Address</p>
          <p className="font-medium text-foreground">{supplier.address}</p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Created At</p>
          <p className="font-medium text-foreground">
            {new Date(supplier.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Last Updated</p>
          <p className="font-medium text-foreground">
            {new Date(supplier.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Products linked to this supplier */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg px-6 mb-4">
          Products Linked to Supplier
        </h2>
        {productsLoading ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : productsError ? (
          <div className="text-red-500 px-6">Error loading products</div>
        ) : products && products.results.length > 0 ? (
          <div className="px-6">
            <Table>
              <TableCaption>Products linked to supplier</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Selling Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.results.map((product: ProductType) => (
                  <TableRow
                    key={product.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>{product.selling_price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center py-10 text-center">
            <Truck className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-semibold">No products linked</h3>
            <p className="text-sm text-muted-foreground">
              Products associated with this supplier will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
