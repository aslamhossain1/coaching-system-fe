// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";
import { PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/Icons";

const emptyExamForm = {
  title: "",
  exam_date: "",
  total_marks: 100,
};

export default function ExamsPage() {
  const { access } = useAuth();
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyExamForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const data = await authFetch("/api/exams/", access);
      setExams(data || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access) loadData();
  }, [access]);

  const filteredExams = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return exams;

    return exams.filter((exam) => `${exam.title} ${exam.exam_date} ${exam.total_marks}`.toLowerCase().includes(normalized));
  }, [exams, search]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      await authFetch("/api/exams/", access, {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          exam_date: form.exam_date,
          total_marks: Number(form.total_marks || 0),
        }),
      });

      setForm(emptyExamForm);
      setShowForm(false);
      setMessage({ type: "success", text: "Exam created successfully." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/exams/${id}/`, access, { method: "DELETE" });
      setMessage({ type: "success", text: "Exam deleted." });
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
            <h2 className="text-lg font-semibold text-slate-900 font-[var(--font-poppins)]">Exams</h2>
            <p className="text-sm text-slate-500">Create and manage exams for your batches</p>
          </div>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            <PlusIcon className="h-4 w-4" />
            Add Exam
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
          <SearchIcon className="h-4 w-4" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, date, marks"
            className="w-full bg-transparent text-slate-700 outline-none"
          />
        </label>
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Create Exam</h3>
          <form onSubmit={handleCreate} className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              required
              placeholder="Exam title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              required
              type="date"
              value={form.exam_date}
              onChange={(event) => setForm((prev) => ({ ...prev, exam_date: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              required
              type="number"
              min="1"
              value={form.total_marks}
              onChange={(event) => setForm((prev) => ({ ...prev, total_marks: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />

            <div className="flex items-center gap-2 md:col-span-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create Exam</button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyExamForm);
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
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Exam Date</th>
                <th className="px-3 py-2">Total Marks</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="bg-slate-50 transition hover:bg-slate-100">
                  <td className="rounded-l-xl px-3 py-3 font-semibold text-slate-900">{exam.title}</td>
                  <td className="px-3 py-3 text-slate-700">{exam.exam_date}</td>
                  <td className="px-3 py-3 text-slate-700">{exam.total_marks}</td>
                  <td className="rounded-r-xl px-3 py-3">
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-rose-600"
                      aria-label="Delete exam"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                    No exams found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {loading ? <p className="mt-3 text-sm text-slate-500">Loading exams...</p> : null}
      </section>
    </div>
  );
}

