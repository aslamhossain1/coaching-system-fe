// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import AttendanceExamCharts from "@/components/AttendanceExamCharts";
import NotificationsPanel from "@/components/NotificationsPanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";

export default function GuardianDashboardPage() {
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

  const summary = useMemo(
    () => ({
      students: data.students.length,
      attendance: data.attendance.length,
      homework: data.homework.length,
      exams: data.exams.length,
    }),
    [data.attendance.length, data.exams.length, data.homework.length, data.students.length]
  );

  return (
    <ProtectedRoute allowedRoles={["guardian"]}>
      <AppShell title="Guardian Dashboard">
        {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Summary title="Students" value={summary.students} />
          <Summary title="Attendance" value={summary.attendance} />
          <Summary title="Homework" value={summary.homework} />
          <Summary title="Exams" value={summary.exams} />
        </section>

        <section className="mb-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
          <section className="glass rise-in rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Student Cards</h2>
            <p className="mt-1 text-sm text-slate-600">Track the children linked to your account.</p>

            {data.students.length === 0 ? (
              <p className="mt-4 rounded-xl bg-white/80 p-4 text-sm text-slate-600">No assigned students found.</p>
            ) : (
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {data.students.map((item, index) => (
                  <li
                    key={item.id}
                    className="rise-in rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <p className="text-base font-semibold text-slate-900">{item.full_name}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.email || "No email provided"}</p>
                    <p className="mt-3 inline-flex rounded-lg bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700">
                      ID #{item.id}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div id="notifications"><NotificationsPanel /></div>
        </section>

        <AttendanceExamCharts attendanceRecords={data.attendance} exams={data.exams} />
      </AppShell>
    </ProtectedRoute>
  );
}

function Summary({ title, value }) {
  return (
    <article className="rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-600">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}


