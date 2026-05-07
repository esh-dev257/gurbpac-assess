"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import queryClient from "../lib/queryClient";
import { Toaster } from "sonner";

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" richColors closeButton duration={3500} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
