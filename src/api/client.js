// src/api/client.js
export const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchConfig() {
  const url = `${API_BASE}/config.json`;
  console.log('→ GET', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchStatus() {
  const url = `${API_BASE}/api/status`;
  console.log('→ POST', url);
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Status fetch failed: ${res.status}`);
  return res.json();
}

export async function updateStatus() {
  const url = `${API_BASE}/api/update/status`;
  console.log('→ POST', url);
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}
