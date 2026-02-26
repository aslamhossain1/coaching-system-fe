// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";
import { PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/Icons";

const emptyForm = {
  title: "",
  message: "",
  student: "",
};

export default function NotificationsPage() {
  const { access } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const [notificationRes, studentRes] = await Promise.all([
        authFetch("/api/notifications/", access),
        authFetch("/api/students/", access),
      ]);

      setNotifications(notificationRes || []);
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

  const filteredNotifications = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return notifications;

    return notifications.filter((item) => `${item.title} ${item.message}`.toLowerCase().includes(normalized));
  }, [notifications, search]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      await authFetch("/api/notifications/", access, {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          message: form.message,
          student: form.student ? Number(form.student) : null,
        }),
      });

      setForm(emptyForm);
      setShowForm(false);
      setMessage({ type: "success", text: "Notification sent successfully." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleToggleRead = async (notification) => {
    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/notifications/${notification.id}/`, access, {
        method: "PUT",
        body: JSON.stringify({
          title: notification.title,
          message: notification.message,
          student: notification.student || null,
          is_read: !notification.is_read,
        }),
      });

      setMessage({ type: "success", text: "Notification state updated." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/notifications/${id}/`, access, { method: "DELETE" });
      setMessage({ type: "success", text: "Notification deleted." });
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
            <h2 className="text-lg font-semibold text-slate-900 font-[var(--font-poppins)]">Notifications Center</h2>
            <p className="text-sm text-slate-500">Broadcast updates to students and manage read state</p>
          </div>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            <PlusIcon className="h-4 w-4" />
            Add Notification
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
          <SearchIcon className="h-4 w-4" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or message"
            className="w-full bg-transparent text-slate-700 outline-none"
          />
        </label>
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Create Notification</h3>
          <form onSubmit={handleCreate} className="mt-4 grid gap-3">
            <input
              required
              placeholder="Notification title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <textarea
              required
              rows={4}
              placeholder="Message"
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <select
              value={form.student}
              onChange={(event) => setForm((prev) => ({ ...prev, student: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            >
              <option value="">All Students in Batch</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Send Notification</button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm);
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

      <section className="grid gap-4 md:grid-cols-2">
        {filteredNotifications.map((notification) => (
          <article key={notification.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{notification.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
              </div>
              <button
                onClick={() => handleDelete(notification.id)}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-rose-600"
                aria-label="Delete notification"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{notification.student ? studentMap.get(notification.student) || `Student #${notification.student}` : "Batch Broadcast"}</span>
              <span className={`rounded-full px-2 py-1 font-semibold ${notification.is_read ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {notification.is_read ? "Read" : "Unread"}
              </span>
              <button
                onClick={() => handleToggleRead(notification)}
                className="rounded-full border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-600"
              >
                Toggle Read
              </button>
            </div>
          </article>
        ))}

        {!loading && filteredNotifications.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">No notifications found.</p>
        ) : null}
      </section>

      {loading ? <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading notifications...</p> : null}
    </div>
  );
}

