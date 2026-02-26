// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/Icons";

const emptyGuardianForm = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
};

export default function AdminGuardiansPage() {
  const { access } = useAuth();
  const [guardians, setGuardians] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyGuardianForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const [guardianRes, studentRes] = await Promise.all([authFetch("/api/students/guardians/", access), authFetch("/api/students/", access)]);
      setGuardians(guardianRes || []);
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

  const studentCountByGuardian = useMemo(() => {
    return students.reduce((acc, student) => {
      if (!student.guardian) return acc;
      acc[student.guardian] = (acc[student.guardian] || 0) + 1;
      return acc;
    }, {});
  }, [students]);

  const filteredGuardians = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return guardians;

    return guardians.filter((guardian) => `${guardian.full_name} ${guardian.email} ${guardian.phone || ""}`.toLowerCase().includes(normalized));
  }, [guardians, search]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };
      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      await authFetch("/api/students/guardians/", access, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setForm(emptyGuardianForm);
      setShowForm(false);
      setMessage({ type: "success", text: "Guardian created successfully." });
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/students/guardians/${id}/`, access, { method: "DELETE" });
      setMessage({ type: "success", text: "Guardian deleted." });
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
            <h2 className="text-lg font-semibold text-slate-900 font-[var(--font-poppins)]">Guardians</h2>
            <p className="text-sm text-slate-500">Create guardian accounts and monitor assigned students</p>
          </div>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            <PlusIcon className="h-4 w-4" />
            Add Guardian
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
          <SearchIcon className="h-4 w-4" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search guardian by name, email, phone"
            className="w-full bg-transparent text-slate-700 outline-none"
          />
        </label>
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Create Guardian</h3>

          <form onSubmit={handleCreate} className="mt-4 grid gap-3 md:grid-cols-2">
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
              placeholder="Phone"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <input
              type="password"
              placeholder="Password (optional)"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
            />
            <textarea
              rows={3}
              placeholder="Address"
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300 md:col-span-2"
            />

            <div className="flex items-center gap-2 md:col-span-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create Guardian</button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyGuardianForm);
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
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Assigned Students</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuardians.map((guardian) => {
                const linkedStudents = studentCountByGuardian[guardian.id] || 0;
                return (
                  <tr key={guardian.id} className="bg-slate-50 transition hover:bg-slate-100">
                    <td className="rounded-l-xl px-3 py-3">
                      <p className="font-semibold text-slate-900">{guardian.full_name}</p>
                      <p className="text-xs text-slate-500">{guardian.address || "No address"}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{guardian.email}</td>
                    <td className="px-3 py-3 text-slate-700">{guardian.phone || "-"}</td>
                    <td className="px-3 py-3 text-slate-700">{linkedStudents}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${linkedStudents > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                        {linkedStudents > 0 ? "Linked" : "No Student"}
                      </span>
                    </td>
                    <td className="rounded-r-xl px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-blue-600" aria-label="Edit guardian">
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(guardian.id)}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-rose-600"
                          aria-label="Delete guardian"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && filteredGuardians.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    No guardians found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {loading ? <p className="mt-3 text-sm text-slate-500">Loading guardians...</p> : null}
      </section>
    </div>
  );
}

