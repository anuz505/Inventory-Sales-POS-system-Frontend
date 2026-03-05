"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { SalesItemResponseType } from "@/types/sales-item-type";

const fetchSalesItemsByProductId = async (
  product: string,
): Promise<SalesItemResponseType> => {
  const response = await axios.get<SalesItemResponseType>(
    `http://localhost:8000/api-inventory/products/${product}/sale`,
    { withCredentials: true },
  );
  return response.data;
};

export function useSaleItem(product: string) {
  return useQuery({
    queryKey: ["saleitem", product],
    queryFn: () => fetchSalesItemsByProductId(product),
  });
}
