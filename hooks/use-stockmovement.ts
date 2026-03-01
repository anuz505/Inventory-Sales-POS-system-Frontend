import axios from "axios";
import {
  keepPreviousData,
  useQuery,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  StockMovement,
  StockMovementParamsTypes,
  PaginatedStockMovementResponse,
} from "@/types/stockmovement-types";

const fetchStockMovements = async (params: StockMovementParamsTypes = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  const response = await axios.get<PaginatedStockMovementResponse>(
    `http://localhost:8000/api-inventory/stockmovement/?${searchParams.toString()}`,
    { withCredentials: true },
  );
  return response.data;
};

const fetchStockMovement = async (id: string): Promise<StockMovement> => {
  const response = await axios.get(
    `http://localhost:8000/api-inventory/stockmovement/${id}/`,
    { withCredentials: true },
  );
  return response.data;
};

export function useStockMovements(params?: StockMovementParamsTypes) {
  return useInfiniteQuery({
    queryKey: ["stockmovements", params],
    queryFn: ({ pageParam = 0 }) =>
      fetchStockMovements({ ...params, offset: String(pageParam) }),
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
  });
}

export function useStockMovement(id: string) {
  return useQuery({
    queryKey: ["stockmovement", id],
    queryFn: () => fetchStockMovement(id),
    enabled: !!id,
  });
}
