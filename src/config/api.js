// This is the complete, corrected code for src/config/api.js

export const apiBase = import.meta.env.VITE_API_BASE || '';

export async function fetchJSON(path, options = {}) {
  const url = `${apiBase}${path}`;
  
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      // This part gets the specific message from the backend (e.g., "Invalid or expired OTP")
      const errorMsg = (data && data.message) || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }
    return data;
  } catch (error) {
    // THIS IS THE FIX: We now re-throw the original error, not a generic one.
    // This allows the UI to display the specific message.
    console.error(`API call to ${url} failed:`, error.message);
    throw error;
  }
}

export default { apiBase, fetchJSON };