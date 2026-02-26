export async function authFetch(path, accessToken, options = {}) {
  const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const base = (rawBase && rawBase !== "undefined" ? rawBase : "http://127.0.0.1:8000").replace(/\/$/, "");
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Request failed");
  }

  return res.status === 204 ? null : res.json();
}
