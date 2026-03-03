"use client";

import { usePathname, useRouter } from "next/navigation";
import useAuthCheckUser from "@/hooks/AuthCheckUser";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuthCheckUser();

  const isAuthPage = ["/sign-in", "/sign-up"].includes(pathname);
  const isUsersPage = pathname === "/users";

  useEffect(() => {
    if (loading) return;

    if (!user && !isAuthPage) {
      router.replace("/sign-in");
      return;
    }

    if (user && isAuthPage) {
      router.replace("/");
      return;
    }

    if (
      user &&
      (user.role === "staff" || user.role === "manager") &&
      isUsersPage
    ) {
      router.replace("/");
      return;
    }
  }, [user, loading, pathname, router]);

  if (
    loading ||
    (!user && !isAuthPage) ||
    (user && isAuthPage) ||
    ((user?.role === "staff" || user?.role === "manager") && isUsersPage)
  ) {
    return <Skeleton />;
  }

  return <>{children}</>;
}
