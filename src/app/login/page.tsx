// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const roles = [
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "guardian", label: "Guardian" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", role: "teacher" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(form);
      router.replace(`/${res.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-6 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute bottom-6 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-100/55 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-7 lg:grid-cols-2 lg:gap-10">
          <section className="order-1 rise-in rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_30px_70px_-36px_rgba(15,23,42,0.6)] backdrop-blur-sm sm:p-6 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Coaching Management</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900 font-[var(--font-poppins)] sm:text-3xl">Smart Dashboard Experience</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              A unified panel for Teacher, Student, and Guardian with clean analytics and role-based access.
            </p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Live Institute Overview</p>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">Active</span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat value="1,250" label="Students" />
                <Stat value="96%" label="Attendance" />
                <Stat value="42" label="Exams" />
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">Monthly Performance</p>
                <div className="mt-2 space-y-2">
                  <div className="h-2 rounded bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: "80%" }} />
                  <div className="h-2 rounded bg-gradient-to-r from-indigo-400 to-sky-400" style={{ width: "58%" }} />
                  <div className="h-2 rounded bg-gradient-to-r from-blue-400 to-indigo-500" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </section>

          <form
            onSubmit={onSubmit}
            className="order-2 rise-in mx-auto w-full max-w-xl rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_30px_70px_-38px_rgba(15,23,42,0.6)] sm:p-8 lg:order-1"
            style={{ animationDelay: "120ms" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Welcome Back</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 font-[var(--font-poppins)]">Login to Your Account</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Access your Dashboard and Manage Your Institute</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {roles.map((role) => {
                const active = form.role === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, role: role.value }))}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                      active
                        ? "border-indigo-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {role.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email / Username</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email or username"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-20 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 sm:text-sm">
                Forgot Password?
              </a>
            </div>

            {error ? <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

            <button
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-16px_rgba(79,70,229,0.9)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="mt-4 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5">
      <p className="text-sm font-semibold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}
