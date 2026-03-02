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
    `http://localhost:8000/api-sales/sales/${id}/`,
    { withCredentials: true },
  );
  return response.data;
};

const createSales = async (newSale: NewSaleType) => {
  const res = await axios.post<Sale>(
    "http://localhost:8000/api-sales/sales/",
    newSale,
    { withCredentials: true },
  );
  return res.data;
};
const getCookie = (name: string): string | null => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? match.split("=")[1] : null;
};
const updateSale = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<NewSaleType>;
}): Promise<Sale> => {
  const res = await axios.patch<Sale>(
    `http://localhost:8000/api-sales/sales/${id}/`,
    data,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    },
  );
  return res.data;
};

const deleteSale = async (id: string): Promise<void> => {
  await axios.delete(`http://localhost:8000/api-sales/sales/${id}/`, {
    withCredentials: true,
  });
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

export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSale,

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["sale", id] });
      await queryClient.cancelQueries({ queryKey: ["sales"] });

      const previousSale = queryClient.getQueryData<Sale>(["sale", id]);
      const previousSales = queryClient.getQueriesData({ queryKey: ["sales"] });

      const safeOptimisticFields: Partial<Sale> = {
        ...(data.payment_status && { payment_status: data.payment_status }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.payment_method && { payment_method: data.payment_method }),
        ...(data.customer && { customer: data.customer }),
        ...(data.discount_amount !== undefined && {
          discount_amount: String(data.discount_amount),
        }),
      };

      // Update individual sale cache
      queryClient.setQueryData<Sale>(["sale", id], (old) => {
        if (!old) return old;
        return { ...old, ...safeOptimisticFields };
      });

      // ✅ Correctly handle InfiniteQuery cache shape { pages: [], pageParams: [] }
      queryClient.setQueriesData<{
        pages: PaginatedSalesResponse[];
        pageParams: unknown[];
      }>({ queryKey: ["sales"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            results: page.results.map((sale) =>
              String(sale.id) === id
                ? { ...sale, ...safeOptimisticFields }
                : sale,
            ),
          })),
        };
      });

      return { previousSale, previousSales, id };
    },

    onError: (_error, { id }, context) => {
      if (!context) return;
      if (context.previousSale) {
        queryClient.setQueryData(["sale", id], context.previousSale);
      }
      context.previousSales?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sale", id] });
    },
  });
}
export function useDeleteSale() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: deleteSale,
    onSuccess: () => queryclient.invalidateQueries({ queryKey: ["sales"] }),
  });
}
