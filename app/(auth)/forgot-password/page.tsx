"use client";
import ForgotPassword from "@/components/auth/ForgotPassword";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-bold text-3xl tracking-tight text-gray-900">
              Forgot Password
            </h2>
            <p className="text-gray-600">
              Remembered your password?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <Suspense fallback={<Spinner />}>
              <ForgotPassword />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
