// @ts-nocheck
"use client";

import AdminPanelShell from "@/components/AdminPanelShell";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <AdminPanelShell>{children}</AdminPanelShell>
    </ProtectedRoute>
  );
}


