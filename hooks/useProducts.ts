import axios from "axios";
import { keepPreviousData, useQuery, useMutation } from "@tanstack/react-query";
import {
  ProductQueryParams,
  ProductListResponse,
} from "@/types/products-types";
const fetchProducts = async (params: ProductQueryParams = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  const response = await axios.get<ProductListResponse>(
    `http://localhost:8000/api-inventory/products?${searchParams}`,
  );
  return response.data;
};

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData,
  });
}
