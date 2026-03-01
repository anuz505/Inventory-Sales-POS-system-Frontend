"use client";
import axios from "axios";
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Customer,
  NewCustomer,
  PaginatedCustomerResponse,
  CustomerParamsTypes,
} from "@/types/customer-types";

const BASE_URL = "http://localhost:8000/api-sales";
const PAGE_LIMIT = 20;

// ── Fetchers ────────────────────────────────────────────────────────────────

const fetchCustomers = async (
  params: CustomerParamsTypes = {},
  offset = 0,
): Promise<PaginatedCustomerResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries({
    ...params,
    limit: String(PAGE_LIMIT),
    offset: String(offset),
  }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const response = await axios.get<PaginatedCustomerResponse>(
    `${BASE_URL}/customers?${searchParams}`,
    { withCredentials: true },
  );
  return response.data;
};

const fetchCustomer = async (id: string): Promise<Customer> => {
  const response = await axios.get<Customer>(`${BASE_URL}/customers/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const createCustomer = async (customer: NewCustomer): Promise<Customer> => {
  const response = await axios.post<Customer>(
    `${BASE_URL}/customers/`,
    customer,
    { withCredentials: true },
  );
  return response.data;
};

const updateCustomer = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<NewCustomer>;
}): Promise<Customer> => {
  const response = await axios.patch<Customer>(
    `${BASE_URL}/customers/${id}/`,
    data,
    { withCredentials: true },
  );
  return response.data;
};

const deleteCustomer = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/customers/${id}/`, { withCredentials: true });
};

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
export function useCustomers(params?: CustomerParamsTypes) {
  return useInfiniteQuery({
    queryKey: ["customers", params],
    queryFn: ({ pageParam = 0 }) => fetchCustomers(params, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.flatMap((p) => p.results).length;
      return fetched < lastPage.count ? fetched : undefined;
    },
    initialPageParam: 0,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetchCustomer(id),
    enabled: Boolean(id),
  });
}
