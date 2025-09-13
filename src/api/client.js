// mon_register/src/api/client.js
export const API_BASE = import.meta.env.VITE_API_BASE;

// 設定取得
export async function fetchConfig() {
  const res = await fetch(`${API_BASE}/config.json`);
  if (!res.ok) throw new Error(`fetchConfig failed: ${res.status}`);
  return res.json();
}

// ステータス取得
export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/api/status`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`fetchStatus failed: ${res.status}`);
  return res.json();
}

// ステータス更新（更新後データを返す）
export async function updateStatus(newData) {
  const res = await fetch(`${API_BASE}/api/update/status`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(newData)
  });
  if (!res.ok) throw new Error(`updateStatus failed: ${res.status}`);
  return res.json();
}
