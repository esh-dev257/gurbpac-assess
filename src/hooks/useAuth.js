import { useState, useEffect, useCallback } from "react";
import {
  login as loginApi,
  getUserFromToken,
  logout as logoutApi,
} from "../services/auth.service";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    getUserFromToken(token)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

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
