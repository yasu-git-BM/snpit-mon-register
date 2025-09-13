// 例：src/api/fetchConfig.js

const API_BASE    = import.meta.env.VITE_API_BASE;
const CONFIG_PATH = import.meta.env.VITE_CONFIG_PATH || '/config.json';
const STATS_PATH  = import.meta.env.VITE_STATS_PATH  || '/api/stats';

export async function fetchConfig() {
  const url = `${API_BASE}${CONFIG_PATH}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchStats() {
  const url = `${API_BASE}${STATS_PATH}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
  return res.json();
}
