import axios from "axios";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  Customer,
  CustomerParamsTypes,
  PaginatedCustomerResponse,
} from "@/types/customer-types";

const fetchCustomers = async (params: CustomerParamsTypes = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  const response = await axios.get<PaginatedCustomerResponse>(
    `http://localhost:8000/api-sales/customer/?${searchParams.toString()}`,
  );
  return response.data;
};

const fetchCustomer = async (id: string): Promise<Customer> => {
  const response = await axios.get(
    `http://localhost:8000/api-sales/customer/${id}/`,
  );
  return response.data;
};
export function useCustomers(params?: CustomerParamsTypes) {
  return useInfiniteQuery({
    queryKey: ["customers", params],
    queryFn: ({ pageParam = 0 }) =>
      fetchCustomers({ ...params, offset: String(pageParam) }),
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
  });
}
