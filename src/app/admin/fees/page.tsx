// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";
import { PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/Icons";

const emptyFeeForm = {
  student: "",
  amount: "",
  due_date: "",
  is_paid: false,
  paid_date: "",
};

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function FeesPage() {
  const { access } = useAuth();
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyFeeForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const [feeRes, studentRes] = await Promise.all([authFetch("/api/fees/", access), authFetch("/api/students/", access)]);
      setFees(feeRes || []);
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

  const paidRevenue = useMemo(() => {
    return fees.reduce((sum, fee) => {
      if (!fee.is_paid) return sum;
      return sum + Number(fee.amount || 0);
    }, 0);
  }, [fees]);

  const pendingAmount = useMemo(() => {
    return fees.reduce((sum, fee) => {
      if (fee.is_paid) return sum;
      return sum + Number(fee.amount || 0);
    }, 0);
  }, [fees]);

  const filteredFees = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return fees.filter((fee) => {
      const status = fee.is_paid ? "paid" : "pending";
      const byStatus = statusFilter === "all" || statusFilter === status;
      if (!byStatus) return false;

      const studentName = studentMap.get(fee.student) || "";
      if (!normalized) return true;
      return `${studentName} ${fee.amount} ${fee.due_date}`.toLowerCase().includes(normalized);
    });
  }, [fees, search, statusFilter, studentMap]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      await authFetch("/api/fees/", access, {
        method: "POST",
        body: JSON.stringify({
          student: Number(form.student),
          amount: Number(form.amount || 0),
          due_date: form.due_date,
          is_paid: Boolean(form.is_paid),
          paid_date: form.is_paid && form.paid_date ? form.paid_date : null,
        }),
      });

      setForm(emptyFeeForm);
      setShowForm(false);
      setMessage({ type: "success", text: "Fee entry created." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleMarkPaid = async (fee) => {
    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/fees/${fee.id}/`, access, {
        method: "PUT",
        body: JSON.stringify({
          student: fee.student,
          amount: fee.amount,
          due_date: fee.due_date,
          is_paid: true,
          paid_date: fee.paid_date || new Date().toISOString().slice(0, 10),
        }),
      });

      setMessage({ type: "success", text: "Payment marked as paid." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/fees/${id}/`, access, { method: "DELETE" });
      setMessage({ type: "success", text: "Fee deleted." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-5">
      {message.text ? (
        <p className={`rounded-2xl border px-4 py-3 text-sm ${message.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {message.text}
        </p>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 font-[var(--font-poppins)]">Current Plan</h2>
          <p className="mt-1 text-sm text-slate-500">Startup SaaS plan for Coaching Management</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Plan</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Pro Growth</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Expiry Date</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{addDays(45)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Active Modules</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Students, Attendance, Exams</p>
            </div>
          </div>

          <button className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
            Upgrade Plan
          </button>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Billing Snapshot</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Paid Revenue</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-700">${paidRevenue.toLocaleString("en-US")}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs uppercase tracking-wide text-amber-700">Pending Amount</p>
              <p className="mt-1 text-2xl font-semibold text-amber-700">${pendingAmount.toLocaleString("en-US")}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Payment History</h3>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            <PlusIcon className="h-4 w-4" />
            Add Fee
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500 md:col-span-2">
            <SearchIcon className="h-4 w-4" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student or amount"
              className="w-full bg-transparent text-slate-700 outline-none"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Create Fee Record</h3>
          <form onSubmit={handleCreate} className="mt-4 grid gap-3 md:grid-cols-2">
            <select
              required
              value={form.student}
              onChange={(event) => setForm((prev) => ({ ...prev, student: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              required
              type="date"
              value={form.due_date}
              onChange={(event) => setForm((prev) => ({ ...prev, due_date: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_paid}
                onChange={(event) => setForm((prev) => ({ ...prev, is_paid: event.target.checked }))}
              />
              Mark as paid
            </label>

            {form.is_paid ? (
              <input
                type="date"
                value={form.paid_date}
                onChange={(event) => setForm((prev) => ({ ...prev, paid_date: event.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300 md:col-span-2"
              />
            ) : null}

            <div className="flex items-center gap-2 md:col-span-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save Fee</button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyFeeForm);
                  setShowForm(false);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Due Date</th>
                <th className="px-3 py-2">Paid Date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="bg-slate-50 transition hover:bg-slate-100">
                  <td className="rounded-l-xl px-3 py-3 font-semibold text-slate-900">{studentMap.get(fee.student) || `Student #${fee.student}`}</td>
                  <td className="px-3 py-3 text-slate-700">${Number(fee.amount || 0).toLocaleString("en-US")}</td>
                  <td className="px-3 py-3 text-slate-700">{fee.due_date}</td>
                  <td className="px-3 py-3 text-slate-700">{fee.paid_date || "-"}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${fee.is_paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {fee.is_paid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="rounded-r-xl px-3 py-3">
                    <div className="flex items-center gap-2">
                      {!fee.is_paid ? (
                        <button
                          onClick={() => handleMarkPaid(fee)}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"
                        >
                          Mark Paid
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDelete(fee.id)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-rose-600"
                        aria-label="Delete fee"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    No fee history found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {loading ? <p className="mt-3 text-sm text-slate-500">Loading fee history...</p> : null}
      </section>
    </div>
  );
}

