import { useEffect, useState } from "react";
import axios from "axios";
import type { AuthCheckResponse } from "./PublicRoute";
export default function useAuthCheckUser() {
  const [user, setUser] = useState<AuthCheckResponse["user"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get<AuthCheckResponse>(
          "http://localhost:8000/api/check-auth/",
          { withCredentials: true },
        );
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading };
}
