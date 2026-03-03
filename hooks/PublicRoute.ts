import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export interface AuthCheckResponse {
  authenticated: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: "admin" | "manager" | "staff" | string;
    date_joined: string;
    isActive: boolean;
  };
}

export default function usePublicRoute(redirectPath: string = "/") {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        // 1️⃣ Check access token
        const res = await axios.get<AuthCheckResponse>(
          "http://localhost:8000/api/check-auth/",
          {
            withCredentials: true,
          },
        );

        // If access token valid → redirect
        router.replace(redirectPath);
      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            // 2️⃣ Try refresh
            await axios.post(
              "http://localhost:8000/api/refresh/",
              {},
              { withCredentials: true },
            );

            // 3️⃣ Retry check-auth
            const res = await axios.get(
              "http://localhost:8000/api/check-auth/",
              {
                withCredentials: true,
              },
            );

            router.replace(redirectPath);
          } catch {
            // Refresh failed → allow access to public page
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    }

    checkAuth();
  }, [router, redirectPath]);

  return { loading };
}
