"use client";
import { createContext, useContext, useState } from "react";
import {
  getUserFromTokenSync,
  logout as logoutApi,
} from "../services/auth.service";

const AuthContext = createContext();

function getInitialUser() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  return getUserFromTokenSync(token);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const loading = false;

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
