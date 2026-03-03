"use client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/users";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserType {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
}

interface UserResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserType[];
}

interface UserParams {
  username?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  phone_number?: string;
  is_staff?: boolean;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

const fetchUsers = async ({
  pageParam = 0,
  params,
}: {
  pageParam: number;
  params: UserParams;
}) => {
  const res = await axios.get<UserResponse>(`${BASE_URL}/`, {
    params: { limit: 10, offset: pageParam, ...params },
    withCredentials: true,
  });
  return res.data;
};

const fetchUser = async (id: string) => {
  const res = await axios.get<UserType>(`${BASE_URL}/${id}/`, {
    withCredentials: true,
  });
  return res.data;
};

const fetchMe = async () => {
  const res = await axios.get<UserType>(`${BASE_URL}/me/`, {
    withCredentials: true,
  });
  return res.data;
};

const createUser = async (payload: CreateUserPayload) => {
  const res = await axios.post<UserType>(`${BASE_URL}/`, payload, {
    withCredentials: true,
  });
  return res.data;
};

const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<CreateUserPayload>;
}) => {
  const res = await axios.patch<UserType>(`${BASE_URL}/${id}/`, data, {
    withCredentials: true,
  });
  return res.data;
};

const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}/`, { withCredentials: true });
};

const changePassword = async (payload: ChangePasswordPayload) => {
  const res = await axios.post(`${BASE_URL}/change_password/`, payload, {
    withCredentials: true,
  });
  return res.data;
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useUsers(params: UserParams = {}) {
  return useInfiniteQuery({
    queryKey: ["users", params],
    queryFn: ({ pageParam }) => fetchUsers({ pageParam, params }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
