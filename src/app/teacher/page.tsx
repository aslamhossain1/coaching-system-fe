// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import AttendanceExamCharts from "@/components/AttendanceExamCharts";
import AttendanceMarkingForm from "@/components/AttendanceMarkingForm";
import NotificationsPanel from "@/components/NotificationsPanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";

export default function TeacherDashboardPage() {
  const { access } = useAuth();
  const [data, setData] = useState({ students: [], attendance: [], homework: [], exams: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [students, attendance, homework, exams] = await Promise.all([
          authFetch("/api/students/", access),
          authFetch("/api/attendance/", access),
          authFetch("/api/homework/", access),
          authFetch("/api/exams/", access),
        ]);
        setData({
          students: students || [],
          attendance: attendance || [],
          homework: homework || [],
          exams: exams || [],
        });
      } catch (e) {
        setError(e.message);
      }
    };

    if (access) load();
  }, [access]);

  const completion = useMemo(() => {
    if (!data.students.length) return 0;
    return Math.min(100, Math.round((data.attendance.length / data.students.length) * 10));
  }, [data.attendance.length, data.students.length]);

  const handleAttendanceCreated = (record) => {
    setData((prev) => ({ ...prev, attendance: [record, ...prev.attendance] }));
  };

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <AppShell title="Teacher Dashboard">
        {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Students" value={data.students.length} tone="from-cyan-500 to-cyan-700" />
          <StatCard label="Attendance" value={data.attendance.length} tone="from-indigo-500 to-indigo-700" />
          <StatCard label="Homework" value={data.homework.length} tone="from-teal-500 to-teal-700" />
          <StatCard label="Exams" value={data.exams.length} tone="from-fuchsia-500 to-fuchsia-700" />
        </section>

        <section className="mb-4">
          <div className="glass rise-in flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Need full control?</p>
              <p className="text-xs text-slate-600">Use Admin Panel to manage students, teachers, and guardians from separate pages.</p>
            </div>
            <Link href="/admin" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Open Admin Panel
            </Link>
          </div>
        </section>

        <section className="mb-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
          <article className="glass rise-in rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Class Momentum</h2>
            <p className="mt-1 text-sm text-slate-600">Attendance coverage from current records</p>
            <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">{completion}% progress signal</p>
          </article>

          <div id="notifications"><NotificationsPanel /></div>
        </section>

        <section className="mb-4">
          <AttendanceMarkingForm students={data.students} onCreated={handleAttendanceCreated} />
        </section>

        <AttendanceExamCharts attendanceRecords={data.attendance} exams={data.exams} />
      </AppShell>
    </ProtectedRoute>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <article className="rise-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className={`h-1.5 bg-gradient-to-r ${tone}`} />
      <div className="p-5">
        <p className="text-sm text-slate-600">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
    </article>
  );
}


