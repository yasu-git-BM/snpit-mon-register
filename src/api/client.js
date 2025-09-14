const API_BASE = import.meta.env.VITE_API_BASE;

// Config取得
export async function fetchConfig() {
  console.log('🌐 fetchConfig start');
  const res = await fetch(`${API_BASE}/api/config`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    throw new Error(`fetchConfig failed: ${res.status}`);
  }
  const data = await res.json();
  console.log('📥 fetchConfig result:', data);
  return data;
}

// Status取得（GETに変更済み）
export async function fetchStatus() {
  console.log('🌐 fetchStatus start');
  const res = await fetch(`${API_BASE}/api/status`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    throw new Error(`fetchStatus failed: ${res.status}`);
  }
  const data = await res.json();
  console.log('📥 fetchStatus result:', data);
  return data;
}

// Status更新（POSTは必要なときだけ）
export async function updateStatus(status) {
  console.log('🌐 updateStatus start', status);
  const res = await fetch(`${API_BASE}/api/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(status)
  });
  if (!res.ok) {
    throw new Error(`updateStatus failed: ${res.status}`);
  }
  const data = await res.json();
  console.log('📥 updateStatus result:', data);
  return data;
}
