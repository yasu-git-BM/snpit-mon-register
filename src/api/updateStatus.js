// mon_register/src/api/updateStatus.js
export async function updateStatus() {
  const res = await fetch('/api/update/status', {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`updateStatus failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}
