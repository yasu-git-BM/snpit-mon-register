import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';
import WalletTable from './components/WalletTable';
import CameraCard from './components/CameraCard';

function checkWalletInconsistency(wallet) {
  const max = Number(wallet.maxShots);
  const enable = Number(wallet.enableShots);

  if (isNaN(enable) && !isNaN(max)) return 'Enable Shots が未設定';
  if (!isNaN(enable) && enable < 0) return 'Enable Shots が負の値';
  if (!isNaN(enable) && !isNaN(max) && enable > max) return 'Enable Shots が Max を超えている';

  return null;
}

export default function App() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState({ wallets: [] });
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const verifyStatus = rawWallets => {
    return rawWallets.map(w => {
      const reason = checkWalletInconsistency(w);
      return { ...w, inconsistent: !!reason, inconsistentReason: reason };
    });
  };

  const loadStatus = async () => {
    try {
      const raw = await fetchStatus();
      const verified = verifyStatus(raw);
      setStatus({ wallets: verified });
    } catch (err) {
      console.error('❌ fetchStatus error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchConfig()
      .then(cfg => setConfig(cfg))
      .catch(err => setError(err.message));

    loadStatus();
  }, []);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await updateStatus({ wallets: status.wallets }); // ✅ オブジェクト形式で送信
      await loadStatus(); // ✅ 再取得＋検証
      setError(null);
    } catch (err) {
      console.error('❌ updateStatus error:', err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (error?.includes('JSONフォーマットが不正')) {
    return <div style={{ color: 'red' }}>⚠️ JSONフォーマットが不正です。編集内容を確認してください。</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!config || !status?.wallets) return <div>Loading…</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>MON Register</h1>

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
            <li key={k}><strong>{k}</strong>: {String(v)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
