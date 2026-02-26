// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import { EditIcon, FilterIcon, SearchIcon, TrashIcon } from "@/components/ui/Icons";

export default function RecentActivityTable({ activities = [] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return activities.filter((item) => {
      const byType = filter === "all" || item.type.toLowerCase() === filter;
      if (!byType) return false;

      if (!normalized) return true;

      const haystack = `${item.event} ${item.actor} ${item.details || ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [activities, filter, query]);

  const typeOptions = useMemo(() => {
    const types = new Set(activities.map((item) => item.type));
    return ["all", ...Array.from(types).map((type) => type.toLowerCase())];
  }, [activities]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Recent Activity</h3>
          <p className="text-sm text-slate-500">Latest actions across students, payments, exams and attendance</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
            <SearchIcon className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search activity"
              className="w-40 bg-transparent text-sm text-slate-700 outline-none"
            />
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
            <FilterIcon className="h-4 w-4" />
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="bg-transparent text-sm text-slate-700 outline-none">
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All" : option[0].toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Details</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="rounded-xl bg-slate-50/90 text-slate-700 transition hover:bg-slate-100">
                <td className="rounded-l-xl px-3 py-3 font-medium text-slate-900">{item.event}</td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">{item.type}</span>
                </td>
                <td className="px-3 py-3">
                  <p className="font-medium text-slate-800">{item.actor}</p>
                  {item.details ? <p className="text-xs text-slate-500">{item.details}</p> : null}
                </td>
                <td className="px-3 py-3 text-slate-600">{item.date}</td>
                <td className="rounded-r-xl px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-blue-600" aria-label="Edit">
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-rose-600" aria-label="Delete">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-500">
                  No activity found for this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

