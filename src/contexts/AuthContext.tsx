// @ts-nocheck
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    access: "",
    refresh: "",
    role: "",
    profileId: null,
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("coaching_auth");
    if (raw) {
      try {
        setAuth(JSON.parse(raw));
      } catch {
        localStorage.removeItem("coaching_auth");
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password, role }) => {
    const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const base = (rawBase && rawBase !== "undefined" ? rawBase : "http://127.0.0.1:8000").replace(/\/$/, "");
    const res = await fetch(`${base}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Login failed");
    }

    const nextAuth = {
      access: data.access,
      refresh: data.refresh,
      role: data.role,
      profileId: data.profile_id,
      email,
    };
    localStorage.setItem("coaching_auth", JSON.stringify(nextAuth));
    setAuth(nextAuth);
    return nextAuth;
  };

  const logout = () => {
    localStorage.removeItem("coaching_auth");
    setAuth({ access: "", refresh: "", role: "", profileId: null, email: "" });
  };

  const value = useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth.access),
      loading,
      login,
      logout,
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

