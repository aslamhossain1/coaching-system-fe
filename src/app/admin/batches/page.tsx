// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";
import { PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/Icons";

const emptyBatchForm = {
  name: "",
  code: "",
  start_date: "",
  end_date: "",
};

export default function BatchesPage() {
  const { access } = useAuth();
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyBatchForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const [batchRes, teacherRes, studentRes] = await Promise.all([
        authFetch("/api/teachers/batches/", access),
        authFetch("/api/teachers/", access),
        authFetch("/api/students/", access),
      ]);

      setBatches(batchRes || []);
      setTeachers(teacherRes || []);
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

  const studentCountByBatch = useMemo(() => {
    return students.reduce((acc, student) => {
      if (!student.batch) return acc;
      acc[student.batch] = (acc[student.batch] || 0) + 1;
      return acc;
    }, {});
  }, [students]);

  const teachersByBatch = useMemo(() => {
    return teachers.reduce((acc, teacher) => {
      if (!teacher.batch) return acc;
      if (!acc[teacher.batch]) acc[teacher.batch] = [];
      acc[teacher.batch].push(teacher.full_name);
      return acc;
    }, {});
  }, [teachers]);

  const filteredBatches = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return batches;

    return batches.filter((batch) => `${batch.name} ${batch.code}`.toLowerCase().includes(normalized));
  }, [batches, search]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      await authFetch("/api/teachers/batches/", access, {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          code: form.code,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
        }),
      });

      setForm(emptyBatchForm);
      setShowForm(false);
      setMessage({ type: "success", text: "Batch created and assigned." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/teachers/batches/${id}/`, access, { method: "DELETE" });
      setMessage({ type: "success", text: "Batch deleted." });
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
            <h2 className="text-lg font-semibold text-slate-900 font-[var(--font-poppins)]">Batches and Classes</h2>
            <p className="text-sm text-slate-500">Create classes and track assigned teachers with student counts</p>
          </div>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            <PlusIcon className="h-4 w-4" />
            Add Batch
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
          <SearchIcon className="h-4 w-4" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by batch name or code"
            className="w-full bg-transparent text-slate-700 outline-none"
          />
        </label>
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Create Batch</h3>
          <form onSubmit={handleCreate} className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              required
              placeholder="Batch name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              required
              placeholder="Batch code"
              value={form.code}
              onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              type="date"
              value={form.start_date}
              onChange={(event) => setForm((prev) => ({ ...prev, start_date: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              type="date"
              value={form.end_date}
              onChange={(event) => setForm((prev) => ({ ...prev, end_date: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />

            <div className="flex items-center gap-2 md:col-span-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create Batch</button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyBatchForm);
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

      <section className="grid gap-4 lg:grid-cols-2">
        {filteredBatches.map((batch) => (
          <article key={batch.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 font-[var(--font-poppins)]">{batch.name}</h3>
                <p className="text-sm text-slate-500">Code: {batch.code}</p>
              </div>
              <button
                onClick={() => handleDelete(batch.id)}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-rose-600"
                aria-label="Delete batch"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Assigned Teachers</p>
                <p className="mt-1 font-semibold text-slate-900">{(teachersByBatch[batch.id] || []).join(", ") || "Unassigned"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Student Count</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{studentCountByBatch[batch.id] || 0}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              {batch.start_date || "No start date"} to {batch.end_date || "No end date"}
            </p>
          </article>
        ))}

        {!loading && filteredBatches.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">No batch found for this filter.</p>
        ) : null}
      </section>

      {loading ? <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading batches...</p> : null}
    </div>
  );
}

