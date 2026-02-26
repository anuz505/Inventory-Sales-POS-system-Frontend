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
import { useCategories, useCreateCategory } from "@/hooks/use-category";
import type { CreateCategoryType } from "@/hooks/use-category";
import { Spinner } from "../ui/spinner";
import SkeletonTable from "../common/skeleton-table";
import { useRouter, useSearchParams } from "next/navigation";
import FiltersCategories from "../filters/filterCategory";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CommonForm from "../common/forms";
import { categoryFormControls } from "@/config/category-form-controls";

const initialCategoryForm: CreateCategoryType = {
  name: "",
  description: "",
};

function Categories() {
  const [categoryFormData, setCategoryFormData] =
    useState<CreateCategoryType>(initialCategoryForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const searchParam = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParam.get(key) ?? undefined;
  const params = {
    name: getParam("name"),
    created_after: getParam("created_after"),
    created_before: getParam("created_before"),
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategories(params);

  const allCategories = data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;

  const { mutateAsync, isPending } = useCreateCategory();

  const handleCategoryFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    try {
      await mutateAsync(categoryFormData);
      setCategoryFormData(initialCategoryForm);
      setDialogOpen(false);
      toast.success("Added New Category");
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

  if (isLoading) return <SkeletonTable />;
  if (error) {
    console.error(error);
    return (
      <div className="text-red-500 text-sm">Error loading categories.</div>
    );
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
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CommonForm
              formControls={categoryFormControls}
              formData={categoryFormData}
              setFormData={setCategoryFormData}
              onSubmit={handleCategoryFormSubmit}
              buttonText={isPending ? "Creating..." : "Create Category"}
              isBtnDisabled={isPending}
              errors={formErrors}
            />
          </DialogContent>
        </Dialog>
      </div>

      <FiltersCategories />

      <Table>
        <TableCaption>Category List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCategories.map((category) => (
            <TableRow
              key={category.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/categories/${category.id}`)}
            >
              <TableCell>{category.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {category.description ?? "—"}
              </TableCell>
              <TableCell>
                {new Date(category.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center gap-4 mt-4">
        <span>
          Showing {allCategories.length} of {totalCount} categories
        </span>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="px-4 py-2 rounded bg-primary disabled:opacity-50"
        >
          {isFetchingNextPage ? (
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

export default Categories;
