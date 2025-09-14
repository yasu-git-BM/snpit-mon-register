import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';
import CameraCard from './components/CameraCard';

function formatAddress(addr) {
  if (!addr || typeof addr !== 'string') return '-';
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 5)}...${addr.slice(-5)}`;
}

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

      {/* Status 表示 */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h2>Status</h2>
        {status.wallets?.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Wallet Name</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Wallet Address</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Enable Shots</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Last Checked</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Total Shots</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>NFT Token ID</th>
              </tr>
            </thead>
            <tbody>
              {status.wallets.map((w, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {w['wallet name'] ?? '-'}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                    {formatAddress(w['wallet address'])}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {w.enableShots ?? 0}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {w.lastChecked ? new Date(w.lastChecked).toLocaleString('ja-JP') : '-'}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {w.nfts?.[0]?.lastTotalShots ?? 0}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                    {w.nfts?.[0]?.tokenId ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No status data</p>
        )}
      </section>

      {/* 更新ボタン */}
      <button
        type="button"
        onClick={handleUpdate}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer', marginBottom: '1.5rem' }}
      >
        Update Status
      </button>

      {/* カメラ登録カード */}
      <CameraCard currentStatus={status} onStatusUpdated={setStatus} />

      {/* Config 表示（画面最下部に移動） */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Config</h2>
        <ul>
          {Object.entries(config).map(([k, v]) => (
            <li key={k}><strong>{k}</strong>: {String(v)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
