// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function HomeworkSubmissionForm({ homeworkItems = [] }) {
  const { profileId } = useAuth();
  const [form, setForm] = useState({
    homeworkId: "",
    note: "",
    link: "",
  });
  const [message, setMessage] = useState("");

  const key = useMemo(() => `student_homework_submissions_${profileId || "guest"}`, [profileId]);

  const submitForm = (e) => {
    e.preventDefault();
    if (!form.homeworkId || !form.note.trim()) {
      setMessage("Please select homework and add your notes.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const selected = homeworkItems.find((item) => String(item.id) === form.homeworkId);
    const payload = {
      id: Date.now(),
      homework_id: Number(form.homeworkId),
      homework_title: selected?.title || "Homework",
      note: form.note.trim(),
      link: form.link.trim(),
      submitted_at: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify([payload, ...existing]));
    setForm({ homeworkId: "", note: "", link: "" });
    setMessage("Submission saved locally. Connect backend submission API to persist server-side.");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Homework Submission Form</h3>
      <p className="mb-3 text-sm text-slate-500">Submit completion notes and optional reference links.</p>

      <form onSubmit={submitForm} className="grid gap-3">
        <select
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300"
          value={form.homeworkId}
          onChange={(e) => setForm((prev) => ({ ...prev, homeworkId: e.target.value }))}
        >
          <option value="">Select homework</option>
          {homeworkItems.map((homework) => (
            <option key={homework.id} value={homework.id}>
              {homework.title}
            </option>
          ))}
        </select>

        <textarea
          rows={3}
          placeholder="What did you complete?"
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300"
          value={form.note}
          onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
        />

        <input
          placeholder="Attachment or drive link (optional)"
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300"
          value={form.link}
          onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
        />

        {message ? <p className="text-sm text-slate-700">{message}</p> : null}

        <button className="w-max rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
          Save Submission
        </button>
      </form>
    </section>
  );
}

