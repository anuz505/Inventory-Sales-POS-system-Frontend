import axios from "axios";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  NewSaleType,
  PaginatedSalesResponse,
  Sale,
  SalesParamsTypes,
} from "@/types/sales-types";

const fetchSales = async (params: SalesParamsTypes = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  const response = await axios.get<PaginatedSalesResponse>(
    `http://localhost:8000/api-sales/sales/?${searchParams.toString()}`,
    { withCredentials: true },
  );
  return response.data;
};

const fetchSale = async (id: string): Promise<Sale> => {
  const response = await axios.get(
    `http://localhost:8000/api-sales/sales/${id}`,
    { withCredentials: true },
  );
  return response.data;
};

const createSales = async (newSale: NewSaleType) => {
  const res = await axios.post<Sale>(
    "http://localhost:8000/api-sales/sales/",
    newSale,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export function useSales(params?: SalesParamsTypes) {
  return useInfiniteQuery({
    queryKey: ["sales", params],
    queryFn: ({ pageParam = 0 }) =>
      fetchSales({ ...params, offset: String(pageParam) }),
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ["sale", id],
    queryFn: () => fetchSale(id),
  });
}

export function useCreateSale() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: createSales,
    onSuccess: () => queryclient.invalidateQueries({ queryKey: ["sales"] }),
  });
}
