import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function usePublicRoute() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        // 1️⃣ Check access token
        await axios.get("http://localhost:8000/api/check-auth/", {
          withCredentials: true,
        });

        // If access token valid → redirect
        router.replace("/");
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
            await axios.get("http://localhost:8000/api/check-auth/", {
              withCredentials: true,
            });

            router.replace("/");
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
  }, [router]);

  return loading;
}
