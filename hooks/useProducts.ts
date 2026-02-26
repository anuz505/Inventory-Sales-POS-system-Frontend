import axios from "axios";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ProductQueryParams,
  ProductListResponse,
  ProductType,
  CreateProductType,
} from "@/types/products-types";

export type CreateProductPayload = {
  name: string;
  sku: string;
  description: string;
  category: string;
  supplier: string;
  cost_price: string;
  selling_price: string;
  stock_quantity: string;
  low_stock_limit: string;
};
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

const createProduct = async (product: CreateProductType) => {
  const response = await axios.post<ProductType>(
    `http://localhost:8000/api-inventory/products/`,
    product,
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

export function useCreateProduct() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
