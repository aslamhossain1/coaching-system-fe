// @ts-nocheck
"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SaasShell from "@/components/SaasShell";
import { AttendanceIcon, DashboardIcon, ExamsIcon, FeesIcon, NotificationsIcon, SettingsIcon, StudentsIcon } from "@/components/ui/Icons";

export default function AppShell({ title, children }) {
  const { role } = useAuth();

  const menuItems = useMemo(() => {
    if (role === "teacher") {
      return [
        { href: "/teacher", label: "Dashboard", icon: DashboardIcon },
        { href: "/admin/students", label: "Students", icon: StudentsIcon },
        { href: "/admin/attendance", label: "Attendance", icon: AttendanceIcon },
        { href: "/admin/exams", label: "Exams", icon: ExamsIcon },
        { href: "/admin/fees", label: "Fees", icon: FeesIcon },
        { href: "/admin/notifications", label: "Notifications", icon: NotificationsIcon },
        { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
      ];
    }

    if (role === "student") {
      return [
        { href: "/student", label: "Dashboard", icon: DashboardIcon },
        { href: "/student#notifications", label: "Notifications", icon: NotificationsIcon },
      ];
    }

    return [
      { href: "/guardian", label: "Dashboard", icon: DashboardIcon },
      { href: "/guardian#notifications", label: "Notifications", icon: NotificationsIcon },
    ];
  }, [role]);

  const titleMap = useMemo(
    () => ({
      "/teacher": title || "Teacher Dashboard",
      "/student": title || "Student Dashboard",
      "/guardian": title || "Guardian Dashboard",
    }),
    [title]
  );

  const profileMenuItems = useMemo(() => {
    if (role === "teacher") {
      return [
        { label: "My Profile", href: "/teacher" },
        { label: "Billing", href: "/admin/fees" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Logout", action: "logout" },
      ];
    }

    if (role === "student") {
      return [
        { label: "My Profile", href: "/student" },
        { label: "Settings", href: "/student" },
        { label: "Logout", action: "logout" },
      ];
    }

    return [
      { label: "My Profile", href: "/guardian" },
      { label: "Settings", href: "/guardian" },
      { label: "Logout", action: "logout" },
    ];
  }, [role]);

  const notificationHref = role === "teacher" ? "/admin/notifications" : role === "student" ? "/student#notifications" : "/guardian#notifications";

  return (
    <SaasShell
      menuItems={menuItems}
      titleMap={titleMap}
      defaultTitle={title || "Dashboard"}
      workspaceLabel="Coaching System"
      workspaceName={`${role || "Role"} Workspace`}
      profileMenuItems={profileMenuItems}
      notificationHref={notificationHref}
    >
      {children}
    </SaasShell>
  );
}

