import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';
import CameraCard from './components/CameraCard';

function formatAddress(addr) {
  if (!addr || typeof addr !== 'string') return '-';
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 5)}...${addr.slice(-5)}`;
}

function isUnregistered(wallet) {
  return (wallet.maxShots === null || wallet.maxShots === undefined) &&
         (wallet.enableShots === null || wallet.enableShots === undefined);
}

function isInconsistent(wallet) {
  if (isUnregistered(wallet)) return false;
  const maxShots = wallet.maxShots;
  const enableShots = wallet.enableShots;
  if (enableShots === null && maxShots !== null) return true;
  if (typeof enableShots === 'number' && enableShots < 0) return true;
  if (typeof enableShots === 'number' && typeof maxShots === 'number' && enableShots > maxShots) return true;
  return false;
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
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>MON Register</h1>

      {/* Status 表示 */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h2>Status</h2>
        {status.wallets?.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Wallet Name</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Wallet Address</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Max Shots</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Enable Shots</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Last Checked</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Total Shots</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>NFT Token ID</th>
              </tr>
            </thead>
            <tbody>
              {status.wallets.map((w, wIdx) =>
                (w.nfts && w.nfts.length > 0 ? w.nfts : [null]).map((nft, nIdx) => (
                  <tr key={`${wIdx}-${nIdx}`}>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                      {w['wallet name'] ?? '-'}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                      {formatAddress(w['wallet address'])}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                      {w.maxShots === null || w.maxShots === undefined ? '-' : w.maxShots}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                      {isInconsistent(w) ? (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>不整合</span>
                      ) : (
                        <input
                          type="number"
                          value={w.enableShots ?? ''}
                          min="0"
                          onChange={e => {
                            const newVal = e.target.value === '' ? null : parseInt(e.target.value, 10);
                            setStatus(prev => {
                              const updated = { ...prev };
                              updated.wallets[wIdx].enableShots = newVal;
                              return updated;
                            });
                          }}
                          style={{ width: '4rem' }}
                        />
                      )}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                      {w.lastChecked ? new Date(w.lastChecked).toLocaleString('ja-JP') : '-'}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                      {nft?.lastTotalShots ?? 0}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                      {nft?.tokenId ?? '-'}
                    </td>
                  </tr>
                ))
              )}
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
