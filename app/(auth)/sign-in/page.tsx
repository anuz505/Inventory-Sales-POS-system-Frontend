import SignIn from "@/components/auth/signin";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left side - Welcome section */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Welcome
          </h1>
          <p className="text-lg text-gray-600">Hello,</p>
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
                  Sign in
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
