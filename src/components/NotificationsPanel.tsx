// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";

export default function NotificationsPanel() {
  const { access } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!access) return;
      setLoading(true);
      setError("");
      try {
        const data = await authFetch("/api/notifications/", access);
        setNotifications((data || []).slice(0, 6));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [access]);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Notifications</h3>
      <p className="mb-3 text-sm text-slate-500">Latest updates from your coaching system.</p>

      {loading ? <p className="text-sm text-slate-500">Loading notifications...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {!loading && !error && notifications.length === 0 ? <p className="text-sm text-slate-500">No notifications available.</p> : null}

      <ul className="space-y-2">
        {notifications.map((note) => (
          <li key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{note.title}</p>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${note.is_read ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {note.is_read ? "Read" : "Unread"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">{note.message}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}

