// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/Icons";

const emptyTeacherForm = {
  full_name: "",
  email: "",
  subject: "",
  password: "",
  batch: "",
};

export default function AdminTeachersPage() {
  const { access } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyTeacherForm);
  const [assignments, setAssignments] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const [teacherRes, batchRes] = await Promise.all([authFetch("/api/teachers/", access), authFetch("/api/teachers/batches/", access)]);
      const safeTeachers = teacherRes || [];
      const safeBatches = batchRes || [];

      setTeachers(safeTeachers);
      setBatches(safeBatches);

      const nextAssignments = {};
      safeTeachers.forEach((teacher) => {
        nextAssignments[teacher.id] = teacher.batch ? String(teacher.batch) : "";
      });
      setAssignments(nextAssignments);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access) loadData();
  }, [access]);

  const filteredTeachers = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return teachers;

    return teachers.filter((teacher) => `${teacher.full_name} ${teacher.email} ${teacher.subject}`.toLowerCase().includes(normalized));
  }, [search, teachers]);

  const batchMap = useMemo(() => {
    const map = new Map();
    batches.forEach((batch) => map.set(batch.id, batch.name));
    return map;
  }, [batches]);

  const handleCreateTeacher = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        subject: form.subject,
        batch: form.batch ? Number(form.batch) : null,
      };
      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      await authFetch("/api/teachers/", access, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setForm(emptyTeacherForm);
      setShowForm(false);
      setMessage({ type: "success", text: "Teacher created successfully." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleAssignBatch = async (teacher) => {
    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/teachers/${teacher.id}/`, access, {
        method: "PUT",
        body: JSON.stringify({
          full_name: teacher.full_name,
          email: teacher.email,
          subject: teacher.subject,
          batch: assignments[teacher.id] ? Number(assignments[teacher.id]) : null,
        }),
      });

      setMessage({ type: "success", text: "Batch assignment updated." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    setMessage({ type: "", text: "" });
    try {
      await authFetch(`/api/teachers/${id}/`, access, { method: "DELETE" });
      setMessage({ type: "success", text: "Teacher removed." });
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
            <h2 className="text-lg font-semibold text-slate-900 font-[var(--font-poppins)]">Teachers</h2>
            <p className="text-sm text-slate-500">Create teachers and assign batches from one place</p>
          </div>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            <PlusIcon className="h-4 w-4" />
            Add Teacher
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
          <SearchIcon className="h-4 w-4" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teacher by name, email, subject"
            className="w-full bg-transparent text-slate-700 outline-none"
          />
        </label>
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Create Teacher</h3>
          <form onSubmit={handleCreateTeacher} className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              required
              placeholder="Full name"
              value={form.full_name}
              onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              required
              placeholder="Subject"
              value={form.subject}
              onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <select
              value={form.batch}
              onChange={(event) => setForm((prev) => ({ ...prev, batch: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            >
              <option value="">Assign batch (optional)</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
            <input
              type="password"
              placeholder="Password (optional)"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300 md:col-span-2"
            />

            <div className="flex items-center gap-2 md:col-span-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create Teacher</button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyTeacherForm);
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
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Batch</th>
                <th className="px-3 py-2">Assign Batch</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="bg-slate-50 transition hover:bg-slate-100">
                  <td className="rounded-l-xl px-3 py-3">
                    <p className="font-semibold text-slate-900">{teacher.full_name}</p>
                    <p className="text-xs text-slate-500">{teacher.subject}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{teacher.email}</td>
                  <td className="px-3 py-3 text-slate-700">{teacher.batch ? batchMap.get(teacher.batch) || `Batch #${teacher.batch}` : "-"}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={assignments[teacher.id] || ""}
                        onChange={(event) => setAssignments((prev) => ({ ...prev, [teacher.id]: event.target.value }))}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none"
                      >
                        <option value="">Unassigned</option>
                        {batches.map((batch) => (
                          <option key={batch.id} value={batch.id}>
                            {batch.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssignBatch(teacher)}
                        className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </td>
                  <td className="rounded-r-xl px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-blue-600" aria-label="Edit teacher">
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-rose-600"
                        aria-label="Delete teacher"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                    No teacher records found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {loading ? <p className="mt-3 text-sm text-slate-500">Loading teachers...</p> : null}
      </section>
    </div>
  );
}

