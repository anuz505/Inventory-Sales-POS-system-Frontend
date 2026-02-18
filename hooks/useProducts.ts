import axios from "axios";
import { keepPreviousData, useQuery, useMutation } from "@tanstack/react-query";
import {
  ProductQueryParams,
  ProductListResponse,
  ProductType,
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

const fetchProduct = async (id: string): Promise<ProductType> => {
  const response = await axios.get<ProductType>(
    `http://localhost:8000/api-inventory/products/${id}`,
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

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });
}
