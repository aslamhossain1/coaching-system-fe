// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import AttendanceMarkingForm from "@/components/AttendanceMarkingForm";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";
import { SearchIcon, TrashIcon } from "@/components/ui/Icons";

export default function AttendancePage() {
  const { access } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const [attendanceRes, studentRes] = await Promise.all([authFetch("/api/attendance/", access), authFetch("/api/students/", access)]);
      setAttendance(attendanceRes || []);
      setStudents(studentRes || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access) loadData();
  }, [access]);

  const studentMap = useMemo(() => {
    const map = new Map();
    students.forEach((student) => map.set(student.id, student.full_name));
    return map;
  }, [students]);

  const summary = useMemo(() => {
    return attendance.reduce(
      (acc, item) => {
        const status = (item.status || "").toLowerCase();
        if (status === "present") acc.present += 1;
        if (status === "absent") acc.absent += 1;
        if (status === "late") acc.late += 1;
        return acc;
      },
      { present: 0, absent: 0, late: 0 }
    );
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return attendance.filter((entry) => {
      const status = (entry.status || "").toLowerCase();
      const byStatus = statusFilter === "all" || status === statusFilter;
      if (!byStatus) return false;

      const studentName = studentMap.get(entry.student) || "";
      if (!normalized) return true;
      return `${studentName} ${entry.status} ${entry.date}`.toLowerCase().includes(normalized);
    });
  }, [attendance, search, statusFilter, studentMap]);

  const handleDelete = async (id) => {
    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/attendance/${id}/`, access, { method: "DELETE" });
      setMessage({ type: "success", text: "Attendance record deleted." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleCreated = (record) => {
    setAttendance((prev) => [record, ...prev]);
    setMessage({ type: "success", text: "Attendance marked successfully." });
  };

  return (
    <div className="space-y-5">
      {message.text ? (
        <p className={`rounded-2xl border px-4 py-3 text-sm ${message.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {message.text}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Present" value={summary.present} tone="text-emerald-700" bg="bg-emerald-50" />
        <SummaryCard label="Absent" value={summary.absent} tone="text-rose-700" bg="bg-rose-50" />
        <SummaryCard label="Late" value={summary.late} tone="text-amber-700" bg="bg-amber-50" />
      </section>

      <AttendanceMarkingForm students={students} onCreated={handleCreated} />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500 md:col-span-2">
            <SearchIcon className="h-4 w-4" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by student, status or date"
              className="w-full bg-transparent text-slate-700 outline-none"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Remarks</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((entry) => {
                const status = (entry.status || "").toLowerCase();
                return (
                  <tr key={entry.id} className="bg-slate-50 transition hover:bg-slate-100">
                    <td className="rounded-l-xl px-3 py-3 font-semibold text-slate-900">{studentMap.get(entry.student) || `Student #${entry.student}`}</td>
                    <td className="px-3 py-3 text-slate-700">{entry.date}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          status === "present"
                            ? "bg-emerald-100 text-emerald-700"
                            : status === "absent"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {status || "unknown"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{entry.remarks || "-"}</td>
                    <td className="rounded-r-xl px-3 py-3">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-rose-600"
                        aria-label="Delete attendance"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!loading && filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {loading ? <p className="mt-3 text-sm text-slate-500">Loading attendance records...</p> : null}
      </section>
    </div>
  );
}

function SummaryCard({ label, value, tone, bg }) {
  return (
    <article className={`rounded-2xl border border-slate-200 p-4 shadow-sm ${bg}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</p>
    </article>
  );
}

