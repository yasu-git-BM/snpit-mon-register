import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';
import WalletTable from './components/WalletTable';
import CameraCard from './components/CameraCard';

export default function App() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState({ wallets: [] }); // ✅ 初期構造を明示
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

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
      .then(result => {
        console.log('📥 fetchStatus result:', result);
        setStatus({ wallets: result }); // ✅ 配列 → オブジェクトにラップ
      })
      .catch(err => {
        console.error('❌ fetchStatus error:', err);
        setError(err.message);
      });
  }, []);

  const handleUpdate = async () => {
    try {
      console.log('🧪 Before updateStatus, current status:', status);
      setUpdating(true);
      await updateStatus(status.wallets); // ✅ Gist保存は配列形式
      const refreshed = await fetchStatus();
      console.log('✅ updateStatus + reload result:', refreshed);
      setStatus({ wallets: refreshed }); // ✅ 再取得もラップ
      setError(null);
    } catch (err) {
      console.error('❌ updateStatus error:', err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (error?.includes('JSONフォーマットが不正')) {
    return <div style={{ color: 'red' }}>
      ⚠️ JSONフォーマットが不正です。編集内容を確認してください。
    </div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!config || !status?.wallets) return <div>Loading…</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>MON Register</h1>

      {/* ✅ CameraCard を先に表示 */}
      <CameraCard currentStatus={status} onStatusUpdated={setStatus} />

      <WalletTable status={status} setStatus={setStatus} />

      <button
        type="button"
        onClick={handleUpdate}
        disabled={updating}
        style={{
          padding: '0.5rem 1rem',
          cursor: updating ? 'not-allowed' : 'pointer',
          marginBottom: '1.5rem',
          backgroundColor: updating ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        {updating ? 'Updating…' : 'Update Status'}
      </button>

      <section style={{ marginTop: '2rem' }}>
        <h2>Config</h2>
        <ul>
          {Object.entries(config).map(([k, v]) => (
            <li key={k}>
              <strong>{k}</strong>: {String(v)}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Debug: Current Status</h2>
        <pre style={{
          backgroundColor: '#f0f0f0',
          padding: '1rem',
          fontSize: '0.8rem',
          overflowX: 'auto',
          border: '1px solid #ccc'
        }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      </section>
    </div>
  );
}
