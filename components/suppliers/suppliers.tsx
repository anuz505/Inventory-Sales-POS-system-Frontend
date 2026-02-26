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
import { useSuppliers, useCreateSupplier } from "@/hooks/use-supplier";
import type { CreateSupplierPayload } from "@/types/supplier-types";
import { Spinner } from "../ui/spinner";
import SkeletonTable from "../common/skeleton-table";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CommonForm from "../common/forms";
import { supplierFormControls } from "@/config/supplier-form-controls";

const initialSupplierForm: CreateSupplierPayload = {
  name: "",
  email: "",
  phone: 0,
  address: "",
};

function Suppliers() {
  const [supplierFormData, setSupplierFormData] =
    useState<CreateSupplierPayload>(initialSupplierForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const searchParam = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParam.get(key) ?? undefined;
  const params = {
    name: getParam("name"),
    email: getParam("email"),
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
  } = useSuppliers(params);

  const allSuppliers = data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;

  const { mutateAsync, isPending } = useCreateSupplier();

  const handleSupplierFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    try {
      await mutateAsync({
        ...supplierFormData,
        phone: Number(supplierFormData.phone),
      });
      setSupplierFormData(initialSupplierForm);
      setDialogOpen(false);
      toast.success("Added New Supplier");
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
    return <div className="text-red-500 text-sm">Error loading suppliers.</div>;
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
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <CommonForm
              formControls={supplierFormControls}
              formData={supplierFormData}
              setFormData={setSupplierFormData}
              onSubmit={handleSupplierFormSubmit}
              buttonText={isPending ? "Creating..." : "Create Supplier"}
              isBtnDisabled={isPending}
              errors={formErrors}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>Supplier List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allSuppliers.map((supplier) => (
            <TableRow
              key={supplier.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/suppliers/${supplier.id}`)}
            >
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell className="text-muted-foreground">
                {supplier.address}
              </TableCell>
              <TableCell>
                {new Date(supplier.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center gap-4 mt-4">
        <span>
          Showing {allSuppliers.length} of {totalCount} suppliers
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

export default Suppliers;
