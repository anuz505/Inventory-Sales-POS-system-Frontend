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
import { ArrowLeft, Trash, Pencil, Tag } from "lucide-react";
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

      {/* Placeholder for products under this category */}
      <Card className="flex flex-col items-center justify-center py-10 text-center">
        <Tag className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="font-semibold">No products in this category</h3>
        <p className="text-sm text-muted-foreground">
          Products assigned to this category will appear here.
        </p>
      </Card>
    </div>
  );
}
