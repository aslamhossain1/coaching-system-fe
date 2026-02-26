// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/Icons";

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  guardian: "",
  batch: "",
  password: "",
};

export default function AdminStudentsPage() {
  const { access } = useAuth();
  const [students, setStudents] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const [studentRes, guardianRes, batchRes] = await Promise.all([
        authFetch("/api/students/", access),
        authFetch("/api/students/guardians/", access),
        authFetch("/api/teachers/batches/", access),
      ]);
      setStudents(studentRes || []);
      setGuardians(guardianRes || []);
      setBatches(batchRes || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access) loadData();
  }, [access]);

  const guardianMap = useMemo(() => {
    const map = new Map();
    guardians.forEach((item) => map.set(item.id, item.full_name));
    return map;
  }, [guardians]);

  const batchMap = useMemo(() => {
    const map = new Map();
    batches.forEach((item) => map.set(item.id, item.name));
    return map;
  }, [batches]);

  const filteredStudents = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return students.filter((student) => {
      const status = student.batch ? "active" : "pending";
      const byStatus = statusFilter === "all" || statusFilter === status;
      if (!byStatus) return false;

      if (!normalized) return true;
      return `${student.full_name} ${student.email} ${student.phone || ""}`.toLowerCase().includes(normalized);
    });
  }, [search, statusFilter, students]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (student) => {
    setShowForm(true);
    setEditingId(student.id);
    setForm({
      full_name: student.full_name || "",
      email: student.email || "",
      phone: student.phone || "",
      guardian: student.guardian ? String(student.guardian) : "",
      batch: student.batch ? String(student.batch) : "",
      password: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        guardian: form.guardian ? Number(form.guardian) : null,
        batch: form.batch ? Number(form.batch) : null,
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      const isUpdate = Boolean(editingId);
      await authFetch(isUpdate ? `/api/students/${editingId}/` : "/api/students/", access, {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setMessage({ type: "success", text: isUpdate ? "Student updated successfully." : "Student created successfully." });
      setShowForm(false);
      resetForm();
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    setMessage({ type: "", text: "" });
    try {
      await authFetch(`/api/students/${id}/`, access, { method: "DELETE" });
      setMessage({ type: "success", text: "Student deleted." });
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

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 font-[var(--font-poppins)]">Students Directory</h2>
            <p className="text-sm text-slate-500">Manage student profiles, guardian links and active status</p>
          </div>

          <button
            onClick={() => {
              if (showForm && !editingId) {
                setShowForm(false);
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95"
          >
            <PlusIcon className="h-4 w-4" />
            Add Student
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500 md:col-span-2">
            <SearchIcon className="h-4 w-4" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or phone"
              className="w-full bg-transparent text-slate-700 outline-none"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending Batch</option>
          </select>
        </div>
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">{editingId ? "Update Student" : "Create Student"}</h3>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={form.full_name}
              onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
              required
              placeholder="Full name"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
              placeholder="Email"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <select
              value={form.guardian}
              onChange={(event) => setForm((prev) => ({ ...prev, guardian: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            >
              <option value="">Select Guardian</option>
              {guardians.map((guardian) => (
                <option key={guardian.id} value={guardian.id}>
                  {guardian.full_name}
                </option>
              ))}
            </select>
            <select
              value={form.batch}
              onChange={(event) => setForm((prev) => ({ ...prev, batch: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            >
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder={editingId ? "New password (optional)" : "Password (optional)"}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />

            <div className="flex items-center gap-2 md:col-span-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">{editingId ? "Update Student" : "Create Student"}</button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
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
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Batch</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Guardian</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const active = Boolean(student.batch);
                return (
                  <tr key={student.id} className="bg-slate-50 transition hover:bg-slate-100">
                    <td className="rounded-l-xl px-3 py-3">
                      <p className="font-semibold text-slate-900">{student.full_name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{student.batch ? batchMap.get(student.batch) || `Batch #${student.batch}` : "-"}</td>
                    <td className="px-3 py-3 text-slate-700">{student.phone || "-"}</td>
                    <td className="px-3 py-3 text-slate-700">{student.guardian ? guardianMap.get(student.guardian) || `Guardian #${student.guardian}` : "-"}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {active ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="rounded-r-xl px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-blue-600"
                          aria-label="Edit student"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-rose-600"
                          aria-label="Delete student"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {loading ? <p className="mt-3 text-sm text-slate-500">Loading students...</p> : null}
      </section>
    </div>
  );
}

