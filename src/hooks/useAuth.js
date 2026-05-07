import { useState, useCallback } from "react";
import {
  login as loginApi,
  getUserFromTokenSync,
  logout as logoutApi,
} from "../services/auth.service";

function getInitialUser() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  return getUserFromTokenSync(token);
}

export function useAuth() {
  const [user, setUser] = useState(getInitialUser);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await loginApi({ email, password });
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      setUser(user);
      return user;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutApi();
    setUser(null);
  }, []);

  return { user, loading, error, login, logout };
}
