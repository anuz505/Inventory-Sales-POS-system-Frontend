"use client";
import SignIn from "./signin";
import Link from "next/link";
import useAuthCheckUser from "@/hooks/AuthCheckUser";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInClient() {
  const { user, loading } = useAuthCheckUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return <Spinner />;
  if (user) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left side - Welcome section */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Welcome
          </h1>
          <p className="text-lg text-gray-600 lg:ml-7">
            Your dashboard awaits.
          </p>
        </div>

        {/* Right side - Sign up form */}
        <div className="flex-1 w-full max-w-md">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-bold text-3xl tracking-tight text-gray-900">
                Create New Account
              </h2>
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
