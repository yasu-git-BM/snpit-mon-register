const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function updateConfig(config) {
  const response = await fetch(`${API_BASE}/update/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!response.ok) {
    throw new Error('Failed to update config');
  }
  return response.json();
}
