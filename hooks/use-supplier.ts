"use client";
import { CreateSupplierPayload } from "@/types/supplier-types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

interface SupplierParams {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_after?: string;
  created_before?: string;
}

const fetchSuppliers = async ({
  pageParam = 0,
  params,
}: {
  pageParam: number;
  params: SupplierParams;
}) => {
  const res = await axios.get<SupplierResponse>(
    "http://localhost:8000/api-inventory/supplier",
    {
      params: {
        limit: 10,
        offset: pageParam,
        ...params,
      },
    },
  );
  return res.data;
};

const fetchSupplier = async (id: string) => {
  const res = await axios.get<SupplierTypes>(
    `http://localhost:8000/api-inventory/supplier/${id}`,
  );
  return res.data;
};

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: () => fetchSupplier(id),
  });
}
const createSupplier = async (supplier: CreateSupplierPayload) => {
  const res = await axios.post<SupplierTypes>(
    `http://localhost:8000/api-inventory/supplier/`,
    supplier,
  );
  return res.data;
};
export function useSuppliers(params: SupplierParams = {}) {
  return useInfiniteQuery({
    queryKey: ["suppliers", params],
    queryFn: ({ pageParam }) => fetchSuppliers({ pageParam, params }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
  });
}
export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
