"use client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

interface CategoryTypes {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface CategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CategoryTypes[];
}

interface CategoryParams {
  name?: string;
  created_after?: string;
  created_before?: string;
}

export interface CreateCategoryType {
  name: string;
  description: string;
}
const fetchCategories = async ({
  pageParam = 0,
  params,
}: {
  pageParam: number;
  params: CategoryParams;
}) => {
  const res = await axios.get<CategoryResponse>(
    "http://localhost:8000/api-inventory/category",
    {
      params: {
        limit: 10,
        offset: pageParam,
        ...params,
      },
    },
  );
  return res.data;
};

const fetchCategory = async (id: string) => {
  const res = await axios.get<CategoryTypes>(
    `http://localhost:8000/api-inventory/category/${id}`,
  );
  return res.data;
};
const createCategory = async (category: CreateCategoryType) => {
  const res = await axios.post<CategoryTypes>(
    "http://localhost:8000/api-inventory/category/",
    category,
  );
  return res.data;
};

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategory(id),
  });
}

export function useCategories(params: CategoryParams = {}) {
  return useInfiniteQuery({
    queryKey: ["categories", params],
    queryFn: ({ pageParam }) => fetchCategories({ pageParam, params }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
