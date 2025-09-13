// mon_register/src/App.jsx
import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';
import CameraCard from './components/CameraCard';

export default function App() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError]   = useState(null);

  useEffect(() => {
    console.log('🚀 useEffect start in App');

    fetchConfig()
      .then(cfg => {
        console.log('📥 fetchConfig result:', cfg);
        setConfig(cfg);
      })
      .catch(err => {
        console.error('❌ fetchConfig error:', err);
        setError(err.message);
      });

    fetchStatus()
      .then(st => {
        console.log('📥 fetchStatus result:', st);
        setStatus(st);
      })
      .catch(err => {
        console.error('❌ fetchStatus error:', err);
        setError(err.message);
      });
  }, []);

  const handleUpdate = async () => {
    try {
      console.log('🔄 handleUpdate called with status:', status);
      const updated = await updateStatus(status);
      console.log('✅ updateStatus result:', updated);
      setStatus(updated);
    } catch (err) {
      console.error('❌ updateStatus error:', err);
      setError(err.message);
    }
  };

  console.log('🖥️ App render - config:', config, 'status:', status);

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!config || !status) return <div>Loading…</div>;

  return (
    <div style={{ maxWidth: 680, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>MON Register</h1>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2>Config</h2>
        <ul>
          {Object.entries(config).map(([k, v]) => (
            <li key={k}><strong>{k}</strong>: {String(v)}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2>Status</h2>
        {Object.keys(status).length === 0 ? (
          <p>No status data</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Camera</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Last Shot</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Count</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>NFT Address</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(status).map(([cam, info]) => (
                <tr key={cam}>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{cam}</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {info.lastShot ? new Date(info.lastShot).toLocaleString('ja-JP') : '-'}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{info.count ?? 0}</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                    {info.nftAddress ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <button
        type="button"
        onClick={handleUpdate}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Update Status
      </button>

      {/* カメラ登録カード（フォーム） */}
      <CameraCard currentStatus={status} onStatusUpdated={setStatus} />
    </div>
  );
}
