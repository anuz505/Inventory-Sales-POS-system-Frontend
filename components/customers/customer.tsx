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
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useCustomers } from "@/hooks/use-customer";
import { Spinner } from "../ui/spinner";
import SkeletonTable from "../common/skeleton-table";
import { useRouter, useSearchParams } from "next/navigation";
import FiltersCustomers from "../filters/filterCustomer";
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

  if (isLoading) return <SkeletonTable />;
  if (error) {
    console.error(error);
    return <div className="text-red-500 text-sm">Error loading customers.</div>;
  }

  return (
    <div className="py-5 px-7 w-full">
      <Button variant="ghost" onClick={() => router.push("/")}>
        <ArrowLeft />
        Back
      </Button>

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
