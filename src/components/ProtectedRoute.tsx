// @ts-nocheck
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      const fallback = role ? `/${role}` : "/login";
      if (fallback !== pathname) router.replace(fallback);
    }
  }, [allowedRoles, isAuthenticated, loading, pathname, role, router]);

  if (loading || !isAuthenticated || !allowedRoles.includes(role)) {
    return <div className="p-6 text-sm text-slate-600">Loading...</div>;
  }

  return children;
}

