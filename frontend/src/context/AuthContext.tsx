import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi, LoginResponse, AuthUser } from "../services/authService";
import {
  clearAuth,
  loadAuth,
  saveAuth,
} from "../utils/authStorage";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // load từ localStorage khi mở app
  useEffect(() => {
    const stored = loadAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: LoginResponse = await loginApi(email, password);
      setUser(res.user);
      setToken(res.token);
      saveAuth({ user: res.user, token: res.token });
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuth();
  };

  const value: AuthState = {
    user,
    token,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
