// mon_register/src/api/fetchStatus.js
export async function fetchStatus() {
  const res = await fetch('/api/status');
  if (!res.ok) {
    throw new Error(`fetchStatus failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}
