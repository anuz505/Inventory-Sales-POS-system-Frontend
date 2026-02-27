"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { useCreateCustomer, useCustomers } from "@/hooks/use-customer";
import { Spinner } from "../ui/spinner";
import SkeletonTable from "../common/skeleton-table";
import { useRouter, useSearchParams } from "next/navigation";
import FiltersCustomers from "../filters/filterCustomer";
import { NewCustomer } from "@/types/customer-types";
import toast from "react-hot-toast";
import router from "next/router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CommonForm from "../common/forms";
import { customerFormControls } from "@/config/customer-form-controls";
const inititalCustomerForm: NewCustomer = {
  name: "",
  email: "",
  phone_number: "",
  address: "",
};
function Customers() {
  const searchParam = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParam.get(key) ?? undefined;

  const params = {
    name: getParam("name"),
    email: getParam("email"),
    phone_number: getParam("phone_number"),
    address: getParam("address"),
    created_after: getParam("created_after"),
    created_before: getParam("created_before"),
  };

  const { mutateAsync, isPending } = useCreateCustomer();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCustomers(params);

  const allCustomers = data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;
  const [customerFormData, setCustomerFormData] =
    useState<NewCustomer>(inititalCustomerForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCustomerFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    try {
      await mutateAsync(customerFormData);
      setCustomerFormData(inititalCustomerForm);
      setDialogOpen(false);
      toast.success("Added a new Customer");
    } catch (error: any) {
      if (error?.response?.data) {
        const rawErrors = error.response.data;
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
    return <div className="text-red-500 text-sm">Error loading customers.</div>;
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
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <CommonForm
              formControls={customerFormControls}
              formData={customerFormData}
              setFormData={setCustomerFormData}
              onSubmit={handleCustomerFormSubmit}
              buttonText={isPending ? "Creating..." : "Create Customer"}
              isBtnDisabled={isPending}
              errors={formErrors}
            />
          </DialogContent>
        </Dialog>
      </div>

      <FiltersCustomers />

      <Table>
        <TableCaption>Customer List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCustomers.map((customer) => (
            <TableRow
              key={customer.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/customers/${customer.id}`)}
            >
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone_number}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>
                {new Date(customer.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center gap-4 mt-4">
        <span>
          Showing {allCustomers.length} of {totalCount} customers
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

export default Customers;
