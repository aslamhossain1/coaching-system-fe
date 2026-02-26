// @ts-nocheck
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/Icons";

function defaultProfileMenu(role) {
  const homeByRole = {
    teacher: "/teacher",
    student: "/student",
    guardian: "/guardian",
  };

  return [
    { label: "My Profile", href: homeByRole[role] || "/admin/settings" },
    { label: "Billing", href: "/admin/fees" },
    { label: "Settings", href: "/admin/settings" },
    { label: "Logout", action: "logout" },
  ];
}

function normalizeHref(href = "") {
  return href.split("#")[0].split("?")[0];
}

export default function SaasShell({
  children,
  menuItems = [],
  titleMap = {},
  defaultTitle = "Dashboard",
  workspaceLabel = "Coaching Platform",
  workspaceName = "SaaS Workspace",
  profileMenuItems,
  notificationHref = "/admin/notifications",
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { email, role, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const profileRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pageTitle = useMemo(() => {
    if (titleMap[pathname]) return titleMap[pathname];
    const match = menuItems.find((item) => {
      const cleanHref = normalizeHref(item.href);
      return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
    });
    return match?.label || defaultTitle;
  }, [defaultTitle, menuItems, pathname, titleMap]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    []
  );

  const initials = useMemo(() => {
    if (email) return email.slice(0, 1).toUpperCase();
    if (role) return role.slice(0, 1).toUpperCase();
    return "U";
  }, [email, role]);

  const profileItems = profileMenuItems && profileMenuItems.length ? profileMenuItems : defaultProfileMenu(role);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleProfileClick = (item) => {
    setProfileOpen(false);
    if (item.action === "logout") {
      handleLogout();
      return;
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  const isActive = (href) => {
    const cleanHref = normalizeHref(href);
    return pathname === cleanHref || (cleanHref !== "/admin" && pathname.startsWith(`${cleanHref}/`));
  };

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4">
      {mobileOpen ? <button className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} /> : null}

      <div className="relative flex min-h-[calc(100vh-1.5rem)] overflow-visible lg:overflow-hidden rounded-3xl border border-slate-200/80 bg-white/75 shadow-[0_28px_80px_-24px_rgba(15,23,42,0.3)] backdrop-blur-sm">
        <aside
          className={`absolute inset-y-0 left-0 z-50 h-full w-72 border-r border-slate-200/80 bg-white/95 px-4 py-5 shadow-xl shadow-slate-900/10 transition-transform duration-300 lg:static lg:h-auto lg:shadow-none lg:translate-x-0 ${
            collapsed ? "lg:w-24" : "lg:w-72"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className={`${collapsed ? "lg:hidden" : ""}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{workspaceLabel}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 font-[var(--font-poppins)]">{workspaceName}</h2>
            </div>

            <button
              className="hidden h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:flex"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
            </button>
          </div>

          <nav className="mt-8 space-y-2">
            {menuItems.map((item) => {
              const ItemIcon = item.icon || UserIcon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_14px_30px_-12px_rgba(59,130,246,0.65)]"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <ItemIcon className={`h-5 w-5 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`} />
                  <span className={`${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 shadow-inner shadow-slate-200/40">
            <p className={`text-sm font-semibold text-slate-900 ${collapsed ? "lg:hidden" : ""}`}>System Health</p>
            <p className={`mt-1 text-xs text-slate-600 ${collapsed ? "lg:hidden" : ""}`}>Stable API sync and live role-based access.</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <LogoutIcon className="h-4 w-4" />
            <span className={`${collapsed ? "lg:hidden" : ""}`}>Logout</span>
          </button>
        </aside>

        <section className="relative flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-5 lg:px-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                  onClick={() => setMobileOpen((prev) => !prev)}
                  aria-label="Open menu"
                >
                  <MenuIcon className="h-4 w-4" />
                </button>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{today}</p>
                  <h1 className="text-2xl font-semibold text-slate-900 font-[var(--font-poppins)]">{pageTitle}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm sm:flex">
                  <SearchIcon className="h-4 w-4" />
                  <input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search students, payments, exams"
                    className="w-48 bg-transparent text-sm text-slate-700 outline-none xl:w-64"
                  />
                </label>

                <button
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                  onClick={() => router.push(notificationHref)}
                  aria-label="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
                </button>

                <div className="relative" ref={profileRef}>
                  <button
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-slate-50"
                    onClick={() => setProfileOpen((prev) => !prev)}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-semibold text-white">
                      {initials}
                    </span>
                    <span className="hidden max-w-[160px] truncate text-sm font-medium text-slate-700 sm:block">{email || "Signed User"}</span>
                  </button>

                  {profileOpen ? (
                    <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.5)]">
                      {profileItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleProfileClick(item)}
                          className="block w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5 lg:px-7">{children}</main>

          <footer className="border-t border-slate-200/80 px-4 py-4 text-xs text-slate-500 sm:px-5 lg:px-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p>Copyright {new Date().getFullYear()} Coaching Management System</p>
              <div className="flex items-center gap-3">
                <a className="transition hover:text-slate-700" href="#">About</a>
                <a className="transition hover:text-slate-700" href="#">Contact</a>
                <a className="transition hover:text-slate-700" href="#">Privacy</a>
                <a className="transition hover:text-slate-700" href="#">Terms</a>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}


