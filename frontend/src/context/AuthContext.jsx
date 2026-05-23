import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true); // true until we finish hydrating

  // ── Hydrate from localStorage on first mount ────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser  = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch {
        // Corrupt data — clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ── Persist helpers ─────────────────────────────────────────────────────
  const persistSession = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // ── Auth Actions ────────────────────────────────────────────────────────

  /**
   * Register a new user.
   * @param {{ name: string, email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  const register = useCallback(async ({ name, email, password }) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      persistSession(data.token, data.user);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    }
  }, []);

  /**
   * Log in an existing user.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  const login = useCallback(async ({ email, password }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      persistSession(data.token, data.user);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please check your credentials.";
      return { success: false, message };
    }
  }, []);

  /**
   * Log out the current user and wipe the session.
   */
  const logout = useCallback(() => {
    clearSession();
  }, []);

  // ── Derived State ───────────────────────────────────────────────────────
  const isAuthenticated = !!token && !!user;

  // ── Context Value ───────────────────────────────────────────────────────
  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── Custom Hook ───────────────────────────────────────────────────────────────
/**
 * useAuth — consume the AuthContext anywhere in the tree.
 *
 * Usage:
 *   const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
};

export default AuthContext;
