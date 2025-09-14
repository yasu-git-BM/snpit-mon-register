export async function fetchConfig() {
  const res = await fetch('/api/config');
  if (!res.ok) {
    throw new Error(`fetchConfig failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}
