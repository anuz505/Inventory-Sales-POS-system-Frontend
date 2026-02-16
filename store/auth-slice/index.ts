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
    baseUrl: "http://localhost:8000/api", // point to Django backend
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<AuthResponse, RegisterFormDataType>({
      query: (data) => ({
        url: "/users/", // trailing slash for Django
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation<AuthResponse, LoginFormDataType>({
      query: (data) => ({
        url: "/login/", // trailing slash for Django
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query<User, string>({
      query: (token) => ({
        url: "/me/", // trailing slash for Django
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useGetMeQuery } =
  authApi;
