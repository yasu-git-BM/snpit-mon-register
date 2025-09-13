// src/api/client.js
export const API_BASE = import.meta.env.VITE_API_BASE;

// 設定取得はそのまま
export async function fetchConfig() {
  const res = await fetch(`${API_BASE}/config.json`);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

// ステータス更新 → 更新後の最新データを返すように
export async function updateStatus(newData) {
  const res = await fetch(`${API_BASE}/api/update/status`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(newData)
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();  // 更新後のステータスをそのまま返却
}
