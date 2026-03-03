"use client";
import React, { useState } from "react";
import {
  useCategory,
  useDeleteCategory,
  useUpdateCategory,
  CreateCategoryType,
} from "@/hooks/use-category";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "@/hooks/useProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function CategoryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const { data: category, isLoading, error } = useCategory(id);
  const { data: productsData, isLoading: productsLoading } = useProducts({
    category: id,
    limit: "100",
  });
  const { mutate: deleteCategory, isPending: deleteIsPending } =
    useDeleteCategory();
  const { mutate: updateCategory, isPending: updateIsPending } =
    useUpdateCategory();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CreateCategoryType>>({});

  const handleEditOpen = (open: boolean) => {
    if (open && category) {
      setEditForm({
        name: category.name,
        description: category.description ?? "",
      });
    }
    setEditOpen(open);
  };

  const handleDelete = () => {
    deleteCategory(category!.id, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        setDeleteOpen(false);
        router.back();
      },
      onError: () => {
        toast.error("Failed to delete category");
      },
    });
  };

  const handleUpdate = () => {
    updateCategory(
      { id: category!.id, data: editForm },
      {
        onSuccess: () => {
          toast.success("Category updated successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update category");
        },
      },
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  if (error || !category)
    return <div className="text-red-500">Category not found</div>;

  return (
    <div className="p-6 space-y-4 pb-20">
      {/* Top bar */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.push("/categories")}
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
                Edit Category
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
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
                  {category.name}
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

      {/* Category Name */}
      <h1 className="px-6 pt-6 text-2xl font-semibold text-foreground">
        {category.name}
      </h1>

      {/* Category Details */}
      <div className="flex flex-wrap justify-baseline items-center gap-x-8 gap-y-4 px-6 pb-6 text-sm">
        <div>
          <p className="text-muted-foreground">Description</p>
          <p className="font-medium text-foreground">
            {category.description ?? "No description provided."}
          </p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Created At</p>
          <p className="font-medium text-foreground">
            {new Date(category.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="w-30">
          <p className="text-muted-foreground">Last Updated</p>
          <p className="font-medium text-foreground">
            {new Date(category.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Products in this category */}
      <div className="px-6">
        <h2 className="text-lg font-semibold mb-3">Products</h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Cost Price</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : productsData?.results.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No products in this category.
                  </TableCell>
                </TableRow>
              ) : (
                productsData?.results.map((product) => (
                  <TableRow
                    key={product.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.supplier_name}</TableCell>
                    <TableCell className="text-right">
                      Rs. {product.cost_price}
                    </TableCell>
                    <TableCell className="text-right">
                      Rs. {product.selling_price}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.stock_quantity <= product.low_stock_limit
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
