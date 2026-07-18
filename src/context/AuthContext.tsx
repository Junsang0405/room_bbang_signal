"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/* ──────────────── Types ──────────────── */

type AuthMode = "guest" | "explore";

interface AuthContextValue {
  mode: AuthMode | null;
  enter: (mode: AuthMode) => void;
  exit: () => void;
  isAuthenticated: boolean;
}

/* ──────────────── Context ──────────────── */

const AuthContext = createContext<AuthContextValue | null>(null);

/* ──────────────── Provider ──────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode | null>(null);

  const enter = (m: AuthMode) => setMode(m);
  const exit = () => setMode(null);

  return (
    <AuthContext.Provider
      value={{ mode, enter, exit, isAuthenticated: mode !== null }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ──────────────── Hook ──────────────── */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
