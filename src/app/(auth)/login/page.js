"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../utils/validators";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Radio, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { user, login, error, loading } = useAuth();
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
      /* error handled by useAuth */
    }
  };

  const busy = loading || isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg mb-4">
            <Radio className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            CBS Platform
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Content Broadcasting System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sign in</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to access the dashboard
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
                  className={`w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-red-600 text-xs mt-1.5">
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
                  className={`w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-red-600 text-xs mt-1.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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
          <div className="mt-6 rounded-lg bg-gray-50 border border-gray-100 p-4 text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-600">Demo credentials</p>
            <p>Teacher: teacher@school.com / password123</p>
            <p>Principal: principal@school.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
