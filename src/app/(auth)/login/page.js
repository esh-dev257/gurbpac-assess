"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../utils/validators";
import { useAuthContext } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Radio, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { user, login, loginError, loginLoading } = useAuthContext();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (user) {
      if (user.role === "teacher") router.replace("/teacher/dashboard");
      else if (user.role === "principal") router.replace("/principal/dashboard");
    }
  }, [user, router]);

  const onSubmit = async (data) => {
    try {
      const u = await login(data.email, data.password);
      if (u.role === "teacher") router.replace("/teacher/dashboard");
      else if (u.role === "principal") router.replace("/principal/dashboard");
    } catch {
      /* error handled by AuthContext */
    }
  };

  const busy = loginLoading || isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 mb-4">
            <Radio className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CBS Platform</h1>
          <p className="text-sm text-gray-400 mt-1">Content Broadcasting System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sign in</h2>
            <p className="text-sm text-gray-400 mt-1">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@school.com"
                  autoFocus
                  autoComplete="email"
                  className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-violet-500 focus:border-violet-400 ${
                    errors.email
                      ? "border-rose-300 bg-rose-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-rose-600 text-xs mt-1.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-violet-500 focus:border-violet-400 ${
                    errors.password
                      ? "border-rose-300 bg-rose-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-rose-600 text-xs mt-1.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API Error */}
            {loginError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-xl bg-violet-50 border border-violet-100 p-4 text-xs text-violet-700 space-y-1">
            <p className="font-semibold text-violet-800">Demo credentials</p>
            <p>Teacher: teacher@school.com / password123</p>
            <p>Principal: principal@school.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
