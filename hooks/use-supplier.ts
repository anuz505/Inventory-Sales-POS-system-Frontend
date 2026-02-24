"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface SupplierTypes {
  id: string;
  name: string;
  email: string;
  phone: number;
  address: string;
  created_at: string;
  updated_at: string;
}
interface SupplierResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SupplierTypes[];
}

const fetchSuppliers = async ({ pageParam = 0 }) => {
  const res = await axios.get<SupplierResponse>(
    "http://localhost:8000/api-inventory/suppliers",
    {
      params: {
        limit: 10,
        offset: pageParam,
      },
    },
  );
  return res.data;
};

export function useSupplier() {
  return useInfiniteQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
  });
}
