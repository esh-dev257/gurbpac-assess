"use client";
import { createContext, useContext, useState, useCallback } from "react";
import {
  login as loginApi,
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
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const { token, user } = await loginApi({ email, password });
      localStorage.setItem("token", token);
      setUser(user);
      return user;
    } catch (e) {
      setLoginError(e.message);
      throw e;
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutApi();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, loginLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
