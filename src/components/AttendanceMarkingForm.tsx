// @ts-nocheck
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";

export default function AttendanceMarkingForm({ students = [], onCreated }) {
  const { access } = useAuth();
  const [form, setForm] = useState({
    student: "",
    date: new Date().toISOString().slice(0, 10),
    status: "present",
    remarks: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.student) {
      setError("Select a student.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        student: Number(form.student),
        date: form.date,
        status: form.status,
        remarks: form.remarks,
      };
      const created = await authFetch("/api/attendance/", access, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSuccess("Attendance marked successfully.");
      setForm((prev) => ({ ...prev, remarks: "" }));
      if (onCreated) onCreated(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Attendance Marking UI</h3>
      <p className="mb-3 text-sm text-slate-500">Quickly mark present, absent or late status for students in your batch.</p>

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <select
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300"
          value={form.student}
          onChange={(e) => setForm((prev) => ({ ...prev, student: e.target.value }))}
        >
          <option value="">Select student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.full_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300"
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          required
        />

        <select
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300"
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>

        <input
          placeholder="Remarks (optional)"
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300"
          value={form.remarks}
          onChange={(e) => setForm((prev) => ({ ...prev, remarks: e.target.value }))}
        />

        <div className="md:col-span-2">
          {error ? <p className="mb-2 text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="mb-2 text-sm text-emerald-600">{success}</p> : null}
          <button
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </form>
    </section>
  );
}

