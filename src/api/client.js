const API_BASE = 'https://snpit-line-bot.onrender.com';

export async function fetchConfig() {
  const res = await fetch(`${API_BASE}/api/config`);
  if (!res.ok) throw new Error(`Config取得失敗: ${res.status}`);
  return await res.json();
}

export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/api/status`);
  if (!res.ok) throw new Error(`Status取得失敗: ${res.status}`);
  return await res.json();
}

export async function updateStatus(data) {
  const res = await fetch(`${API_BASE}/api/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Status更新失敗: ${res.status}`);
  return await res.json();
}
