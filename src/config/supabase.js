// DEPRECATED: Supabase removed. Use `src/config/api.js` (frontend API helper) instead.
export const apiBase = import.meta.env.VITE_API_BASE || '';

export async function fetchJSON(path, options = {}) {
  const res = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.message) || 'Request failed');
  return data;
}

export default { apiBase, fetchJSON };
