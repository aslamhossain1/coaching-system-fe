// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import AttendanceExamCharts from "@/components/AttendanceExamCharts";
import HomeworkSubmissionForm from "@/components/HomeworkSubmissionForm";
import NotificationsPanel from "@/components/NotificationsPanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";

export default function StudentDashboardPage() {
  const { access } = useAuth();
  const [data, setData] = useState({ profile: null, students: [], attendance: [], homework: [], exams: [] });
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
        const safeStudents = students || [];
        setData({
          profile: safeStudents[0] || null,
          students: safeStudents,
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

  const readiness = useMemo(() => {
    const total = data.homework.length + data.exams.length;
    if (!total) return 0;
    return Math.max(25, Math.min(100, 100 - data.homework.length * 6));
  }, [data.exams.length, data.homework.length]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <AppShell title="Student Dashboard">
        {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card label="Student" value={data.profile?.full_name || "-"} />
          <Card label="Attendance" value={data.attendance.length} />
          <Card label="Homework" value={data.homework.length} />
          <Card label="Exams" value={data.exams.length} />
        </section>

        <section className="mb-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
          <article className="glass rise-in rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Readiness Meter</h2>
            <p className="mt-1 text-sm text-slate-600">A quick visual estimate from workload volume</p>
            <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600" style={{ width: `${readiness}%` }} />
            </div>
            <p className="mt-3 text-sm font-medium">{readiness}% ready for this cycle</p>
          </article>

          <div id="notifications"><NotificationsPanel /></div>
        </section>

        <section className="mb-4">
          <HomeworkSubmissionForm homeworkItems={data.homework} />
        </section>

        <AttendanceExamCharts attendanceRecords={data.attendance} exams={data.exams} />
      </AppShell>
    </ProtectedRoute>
  );
}

function Card({ label, value }) {
  return (
    <article className="rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}


