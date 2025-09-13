// mon_register/src/App.jsx
import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';

export default function App() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError]   = useState(null);

  // 初期ロード
  useEffect(() => {
    fetchConfig().then(setConfig).catch(err => setError(err.message));
    fetchStatus().then(setStatus).catch(err => setError(err.message));
  }, []);

  // 更新ボタン
  const handleUpdate = async () => {
    try {
      const updated = await updateStatus(status);
      setStatus(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!config || !status) return <div>Loading…</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>MON Register</h1>

      <section>
        <h2>Config</h2>
        <ul>
          {Object.entries(config).map(([k, v]) => (
            <li key={k}><strong>{k}</strong>: {String(v)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Status</h2>
        {Object.keys(status).length === 0 ? (
          <p>No status data</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Camera</th>
                <th>Last Shot</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(status).map(([cam, info]) => (
                <tr key={cam}>
                  <td>{cam}</td>
                  <td>{new Date(info.lastShot).toLocaleString('ja-JP')}</td>
                  <td>{info.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <button
        type="button" // ← ページ遷移防止
        onClick={handleUpdate}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        Update Status
      </button>
    </div>
  );
}
