"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";

export default function AuthGuard({ children, requiredRole }) {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, router, requiredRole]);

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return children;
}
