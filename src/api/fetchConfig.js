const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchConfig() {
  const response = await fetch(`${API_BASE}/config`);
  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }
  return response.json();
}
