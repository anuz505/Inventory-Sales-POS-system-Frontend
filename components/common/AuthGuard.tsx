"use client";
import { usePathname, useRouter } from "next/navigation";
import useAuthCheckUser from "@/hooks/AuthCheckUser";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuthCheckUser();

  useEffect(() => {
    if (loading) return;
    if (!user && !["/sign-up"].includes(pathname)) {
      router.replace("/sign-in");
    }
    if (
      user &&
      ["/sign-in", "/sign-up", "/(auth)/sign-in", "/(auth)/sign-up"].includes(
        pathname,
      )
    ) {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <Spinner />;
  }

  return <>{children}</>;
}
