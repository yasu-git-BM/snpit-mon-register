const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function updateStatus(data, forceOverride = false) {
  const payload = {
    ...data,
    forceOverride
  };

  const res = await fetch(`${API_BASE}/api/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`updateStatus failed: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}
