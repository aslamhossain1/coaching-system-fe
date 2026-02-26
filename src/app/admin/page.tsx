// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminAnalyticsCharts from "@/components/admin/AdminAnalyticsCharts";
import RecentActivityTable from "@/components/admin/RecentActivityTable";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";
import { AttendanceIcon, FeesIcon, StudentsIcon, TeachersIcon } from "@/components/ui/Icons";

const initialData = {
  students: [],
  teachers: [],
  guardians: [],
  batches: [],
  attendance: [],
  fees: [],
  exams: [],
  homework: [],
  notifications: [],
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminOverviewPage() {
  const { access } = useAuth();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [students, teachers, guardians, batches, attendance, fees, exams, homework, notifications] = await Promise.all([
          authFetch("/api/students/", access),
          authFetch("/api/teachers/", access),
          authFetch("/api/students/guardians/", access),
          authFetch("/api/teachers/batches/", access),
          authFetch("/api/attendance/", access),
          authFetch("/api/fees/", access),
          authFetch("/api/exams/", access),
          authFetch("/api/homework/", access),
          authFetch("/api/notifications/", access),
        ]);

        setData({
          students: students || [],
          teachers: teachers || [],
          guardians: guardians || [],
          batches: batches || [],
          attendance: attendance || [],
          fees: fees || [],
          exams: exams || [],
          homework: homework || [],
          notifications: notifications || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (access) {
      loadDashboard();
    }
  }, [access]);

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    return data.fees.reduce((sum, fee) => {
      if (!fee.is_paid) return sum;
      const paidDate = fee.paid_date ? new Date(fee.paid_date) : null;
      if (!paidDate) return sum;
      if (paidDate.getMonth() !== now.getMonth() || paidDate.getFullYear() !== now.getFullYear()) return sum;
      return sum + Number(fee.amount || 0);
    }, 0);
  }, [data.fees]);

  const attendancePercentage = useMemo(() => {
    if (!data.attendance.length) return 0;
    const present = data.attendance.filter((item) => (item.status || "").toLowerCase() === "present").length;
    return Math.round((present / data.attendance.length) * 100);
  }, [data.attendance]);

  const studentById = useMemo(() => {
    const map = new Map();
    data.students.forEach((student) => map.set(student.id, student.full_name));
    return map;
  }, [data.students]);

  const activities = useMemo(() => {
    const studentEvents = data.students.map((student) => ({
      id: `student-${student.id}`,
      type: "Student",
      event: "New student added",
      actor: student.full_name,
      details: student.email,
      createdAt: student.created_at || "",
      date: formatDate(student.created_at),
    }));

    const paymentEvents = data.fees
      .filter((fee) => fee.is_paid)
      .map((fee) => ({
        id: `fee-${fee.id}`,
        type: "Payment",
        event: "Payment received",
        actor: studentById.get(fee.student) || `Student #${fee.student}`,
        details: `$${Number(fee.amount || 0).toLocaleString("en-US")}`,
        createdAt: fee.paid_date || fee.due_date || "",
        date: formatDate(fee.paid_date || fee.due_date),
      }));

    const examEvents = data.exams.map((exam) => ({
      id: `exam-${exam.id}`,
      type: "Exam",
      event: "Exam created",
      actor: exam.title,
      details: `${exam.total_marks || 0} marks`,
      createdAt: exam.exam_date || "",
      date: formatDate(exam.exam_date),
    }));

    const attendanceEvents = data.attendance.map((item) => ({
      id: `attendance-${item.id}`,
      type: "Attendance",
      event: "Attendance marked",
      actor: studentById.get(item.student) || `Student #${item.student}`,
      details: (item.status || "").toUpperCase(),
      createdAt: item.date || "",
      date: formatDate(item.date),
    }));

    return [...studentEvents, ...paymentEvents, ...examEvents, ...attendanceEvents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 12);
  }, [data.attendance, data.exams, data.fees, data.students, studentById]);

  return (
    <div className="space-y-5">
      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" subtitle="Active learners" value={data.students.length} icon={StudentsIcon} gradient="from-blue-600 to-indigo-600" />
        <StatCard label="Total Teachers" subtitle="Faculty members" value={data.teachers.length} icon={TeachersIcon} gradient="from-indigo-600 to-purple-600" />
        <StatCard
          label="Monthly Revenue"
          subtitle="Paid fees this month"
          value={monthlyRevenue}
          icon={FeesIcon}
          gradient="from-emerald-500 to-teal-600"
          prefix="$"
        />
        <StatCard
          label="Attendance Percentage"
          subtitle="Present ratio"
          value={attendancePercentage}
          icon={AttendanceIcon}
          gradient="from-fuchsia-500 to-indigo-600"
          suffix="%"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickLinkCard href="/admin/students" title="Manage Students" description="Create, update and monitor student profiles" />
        <QuickLinkCard href="/admin/teachers" title="Manage Teachers" description="Assign batches and maintain teacher records" />
        <QuickLinkCard href="/admin/fees" title="Billing Center" description="Track dues, payments and plan status" />
        <QuickLinkCard href="/admin/settings" title="Institute Settings" description="Profile, password, logo and subscription" />
      </section>

      <AdminAnalyticsCharts fees={data.fees} attendance={data.attendance} />

      {loading ? <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading dashboard insights...</p> : null}

      <RecentActivityTable activities={activities} />
    </div>
  );
}

function StatCard({ label, subtitle, value, icon: Icon, gradient, prefix = "", suffix = "" }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-900 font-[var(--font-poppins)]">
              <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
            </h3>
          </div>
          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg shadow-blue-500/20`}>
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-500">{subtitle}</p>
      </div>
    </article>
  );
}

function QuickLinkCard({ href, title, description }) {
  return (
    <Link href={href} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-700">Open Page</p>
    </Link>
  );
}

