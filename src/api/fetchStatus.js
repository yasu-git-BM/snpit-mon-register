export async function fetchStatus() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`fetchStatus failed: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('❌ fetchStatus error:', err);
    throw err;
  }
}
