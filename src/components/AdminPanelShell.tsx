// @ts-nocheck
"use client";

import SaasShell from "@/components/SaasShell";
import {
  AttendanceIcon,
  BatchesIcon,
  DashboardIcon,
  ExamsIcon,
  FeesIcon,
  GuardiansIcon,
  NotificationsIcon,
  SettingsIcon,
  StudentsIcon,
  TeachersIcon,
} from "@/components/ui/Icons";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/students", label: "Students", icon: StudentsIcon },
  { href: "/admin/teachers", label: "Teachers", icon: TeachersIcon },
  { href: "/admin/guardians", label: "Guardians", icon: GuardiansIcon },
  { href: "/admin/batches", label: "Batches", icon: BatchesIcon },
  { href: "/admin/attendance", label: "Attendance", icon: AttendanceIcon },
  { href: "/admin/exams", label: "Exams", icon: ExamsIcon },
  { href: "/admin/fees", label: "Fees / Payments", icon: FeesIcon },
  { href: "/admin/notifications", label: "Notifications", icon: NotificationsIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

const titleMap = {
  "/admin": "Dashboard",
  "/admin/students": "Students Management",
  "/admin/teachers": "Teachers Management",
  "/admin/guardians": "Guardians Management",
  "/admin/batches": "Batches Management",
  "/admin/attendance": "Attendance Management",
  "/admin/exams": "Exam Management",
  "/admin/fees": "Fees and Billing",
  "/admin/notifications": "Notifications Center",
  "/admin/settings": "Settings",
};

const profileMenuItems = [
  { label: "My Profile", href: "/admin/settings" },
  { label: "Billing", href: "/admin/fees" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Logout", action: "logout" },
];

export default function AdminPanelShell({ children }) {
  return (
    <SaasShell
      menuItems={menuItems}
      titleMap={titleMap}
      defaultTitle="Dashboard"
      workspaceLabel="Coaching Admin"
      workspaceName="Edufy Style Panel"
      profileMenuItems={profileMenuItems}
    >
      {children}
    </SaasShell>
  );
}

