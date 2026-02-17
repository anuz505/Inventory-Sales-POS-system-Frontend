"use client";
import { Provider } from "react-redux";
import { useState } from "react";
import store from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
