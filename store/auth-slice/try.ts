import type {
  AuthResponse,
  LoginFormDataType,
  RegisterFormDataType,
  User,
} from "@/types/auth-type";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<AuthResponse, RegisterFormDataType>({
      query: (data) => ({
        url: "/users/",
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation<AuthResponse, LoginFormDataType>({
      query: (data) => ({
        url: "/login/",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query<User, string>({
      query: (token) => ({
        url: "/me/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useGetMeQuery } =
  authApi;
