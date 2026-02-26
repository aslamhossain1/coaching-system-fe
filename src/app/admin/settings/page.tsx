// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";

export default function SettingsPage() {
  const { access } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [profileForm, setProfileForm] = useState({ full_name: "", email: "", subject: "" });
  const [passwordForm, setPasswordForm] = useState({ password: "", confirm_password: "" });
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadProfile = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authFetch("/api/teachers/", access);
      const profile = (response || [])[0] || null;
      setTeacher(profile);
      if (profile) {
        setProfileForm({
          full_name: profile.full_name || "",
          email: profile.email || "",
          subject: profile.subject || "",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access) loadProfile();
  }, [access]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!teacher) return;

    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/teachers/${teacher.id}/`, access, {
        method: "PUT",
        body: JSON.stringify({
          full_name: profileForm.full_name,
          email: profileForm.email,
          subject: profileForm.subject,
          batch: teacher.batch || null,
        }),
      });

      setMessage({ type: "success", text: "Profile updated successfully." });
      loadProfile();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (!teacher) return;

    if (!passwordForm.password.trim()) {
      setMessage({ type: "error", text: "Password is required." });
      return;
    }

    if (passwordForm.password !== passwordForm.confirm_password) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setMessage({ type: "", text: "" });

    try {
      await authFetch(`/api/teachers/${teacher.id}/`, access, {
        method: "PUT",
        body: JSON.stringify({
          full_name: profileForm.full_name,
          email: profileForm.email,
          subject: profileForm.subject,
          batch: teacher.batch || null,
          password: passwordForm.password,
        }),
      });

      setPasswordForm({ password: "", confirm_password: "" });
      setMessage({ type: "success", text: "Password changed successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      {message.text ? (
        <p className={`rounded-2xl border px-4 py-3 text-sm ${message.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {message.text}
        </p>
      ) : null}

      {loading ? <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading settings...</p> : null}

      {!loading ? (
        <section className="grid gap-5 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 font-[var(--font-poppins)]">Update Profile</h2>
            <p className="mt-1 text-sm text-slate-500">Keep your institute contact and teacher details updated</p>

            <form onSubmit={handleUpdateProfile} className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                required
                value={profileForm.full_name}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, full_name: event.target.value }))}
                placeholder="Full name"
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
              />
              <input
                required
                type="email"
                value={profileForm.email}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email"
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
              />
              <input
                required
                value={profileForm.subject}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, subject: event.target.value }))}
                placeholder="Subject"
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300 md:col-span-2"
              />

              <button className="w-max rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save Profile</button>
            </form>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Subscription</h3>
            <p className="mt-1 text-sm text-slate-500">Plan and billing information</p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Current Plan</p>
                <p className="mt-1 font-semibold text-slate-900">Pro Growth</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Renewal Date</p>
                <p className="mt-1 font-semibold text-slate-900">In 45 days</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">API Base URL</p>
                <p className="mt-1 break-all font-semibold text-slate-900">{process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}</p>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      {!loading ? (
        <section className="grid gap-5 xl:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Change Password</h3>

            <form onSubmit={handleChangePassword} className="mt-4 grid gap-3">
              <input
                type="password"
                required
                placeholder="New password"
                value={passwordForm.password}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, password: event.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
              />
              <input
                type="password"
                required
                placeholder="Confirm password"
                value={passwordForm.confirm_password}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm_password: event.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-300"
              />

              <button className="w-max rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Change Password</button>
            </form>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Institute Logo</h3>
            <p className="mt-1 text-sm text-slate-500">Upload branding used in reports and dashboards</p>

            <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-medium text-slate-600">
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              Click to upload logo
            </label>

            {logoPreview ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                <img src={logoPreview} alt="Institute logo preview" className="max-h-40 w-auto rounded-lg object-contain" />
              </div>
            ) : null}
          </article>
        </section>
      ) : null}
    </div>
  );
}

