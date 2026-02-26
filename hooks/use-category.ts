"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export interface CategoryTypes {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface CategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CategoryTypes[];
}

const fetchCategories = async ({ pageParam = 0 }: { pageParam: number }) => {
  const res = await axios.get<CategoryResponse>(
    "http://localhost:8000/api-inventory/category",
    {
      params: {
        limit: 10,
        offset: pageParam,
      },
    },
  );
  return res.data;
};

export function useCategory() {
  return useInfiniteQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
  });
}
