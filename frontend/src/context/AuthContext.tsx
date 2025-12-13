// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import {
  AuthResponse,
  loginApi,
  registerApi,
  RegisterPayload,
  UserDto,
} from "../services/authService";

interface AuthState {
  user: UserDto | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "lockin_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { user: null, token: null };

    try {
      const parsed = JSON.parse(raw) as AuthResponse;
      return { user: parsed.user, token: parsed.token };
    } catch {
      return { user: null, token: null };
    }
  });

  const saveAuth = (auth: AuthResponse) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    setState({ user: auth.user, token: auth.token });
  };

  const login = async (email: string, password: string) => {
    const auth = await loginApi(email, password);
    saveAuth(auth);
  };

  const register = async (payload: RegisterPayload) => {
    const auth = await registerApi(payload);
    saveAuth(auth);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({ user: null, token: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
