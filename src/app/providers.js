"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import { getQueryClient } from "../lib/queryClient";
import { useRef } from "react";

export default function Providers({ children }) {
  const queryClientRef = useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = getQueryClient();
  }
  return (
    <QueryClientProvider client={queryClientRef.current}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
