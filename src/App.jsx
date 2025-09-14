import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';
import CameraCard from './components/CameraCard';

function getTokenId(nft) {
  if (!nft) return null;
  // 後方互換: "tokeinid" → tokenId
  const id = nft.tokenId ?? nft.tokeinid;
  return id == null ? null : id;
}

function getCameraName(nft) {
  return nft?.name ?? '';
}

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
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Camera Name</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Max Shots</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Enable Shots</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Last Checked</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>Total Shots</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', background: '#f5f5f5' }}>NFT Token ID</th>
          </tr>
        </thead>
        <tbody>
          {status.wallets.map((w, wIdx) =>
            (w.nfts && w.nfts.length > 0 ? w.nfts : [null]).map((nft, nIdx) => {
              const tokenId = getTokenId(nft);
              const cameraName = getCameraName(nft);
              const unregistered = (w.maxShots == null) && (w.enableShots == null);
              const inconsistent =
                (!unregistered) &&
                (
                  (w.enableShots == null && w.maxShots != null) ||
                  (typeof w.enableShots === 'number' && w.enableShots < 0) ||
                  (typeof w.enableShots === 'number' && typeof w.maxShots === 'number' && w.enableShots > w.maxShots)
                );

              return (
                <tr key={`${wIdx}-${nIdx}`}>
                  {/* Wallet Name（編集可, ウォレット単位） */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    <input
                      type="text"
                      value={w['wallet name'] ?? ''}
                      onChange={e => {
                        const val = e.target.value;
                        setStatus(prev => {
                          const updated = { ...prev };
                          updated.wallets = [...updated.wallets];
                          updated.wallets[wIdx] = { ...updated.wallets[wIdx], ['wallet name']: val };
                          return updated;
                        });
                      }}
                      style={{ width: '12rem' }}
                      placeholder="Wallet Name"
                    />
                  </td>

                  {/* Wallet Address（短縮表示・非編集） */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                    {formatAddress(w['wallet address'])}
                  </td>

                  {/* Camera Name（編集可, NFT単位: nft.name） */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    <input
                      type="text"
                      value={cameraName ?? ''}
                      onChange={e => {
                        const val = e.target.value;
                        setStatus(prev => {
                          const updated = { ...prev };
                          updated.wallets = [...updated.wallets];
                          const uw = { ...updated.wallets[wIdx] };
                          const nfts = uw.nfts && uw.nfts.length ? [...uw.nfts] : [];
                          const un = { ...(nft ?? {}) };
                          un.name = val;
                          if (nfts.length) {
                            nfts[nIdx] = un;
                          } else {
                            nfts.push(un);
                          }
                          uw.nfts = nfts;
                          updated.wallets[wIdx] = uw;
                          return updated;
                        });
                      }}
                      style={{ width: '12rem' }}
                      placeholder="Camera Name"
                    />
                  </td>

                  {/* Max Shots（編集可, ウォレット単位） */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    <input
                      type="number"
                      value={w.maxShots ?? ''}
                      min="0"
                      onChange={e => {
                        const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
                        setStatus(prev => {
                          const updated = { ...prev };
                          updated.wallets = [...updated.wallets];
                          updated.wallets[wIdx] = { ...updated.wallets[wIdx], maxShots: val };
                          return updated;
                        });
                      }}
                      style={{ width: '5rem' }}
                      placeholder="-"
                    />
                  </td>

                  {/* Enable Shots（編集可, ウォレット単位／不整合は赤表示） */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {inconsistent ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>不整合</span>
                    ) : (
                      <input
                        type="number"
                        value={w.enableShots ?? ''}
                        min="0"
                        onChange={e => {
                          const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
                          setStatus(prev => {
                            const updated = { ...prev };
                            updated.wallets = [...updated.wallets];
                            updated.wallets[wIdx] = { ...updated.wallets[wIdx], enableShots: val };
                            return updated;
                          });
                        }}
                        style={{ width: '5rem' }}
                        placeholder="-"
                      />
                    )}
                  </td>

                  {/* Last Checked（表示のみ） */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {w.lastChecked ? new Date(w.lastChecked).toLocaleString('ja-JP') : '-'}
                  </td>

                  {/* Total Shots（表示のみ, オンチェーン） */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {nft?.lastTotalShots ?? 0}
                  </td>

                  {/* NFT Token ID（編集可, NFT単位: tokenId; tokeinid 互換） */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                    <input
                      type="text"
                      value={tokenId ?? ''}
                      onChange={e => {
                        const raw = e.target.value.trim();
                        setStatus(prev => {
                          const updated = { ...prev };
                          updated.wallets = [...updated.wallets];
                          const uw = { ...updated.wallets[wIdx] };
                          const nfts = uw.nfts && uw.nfts.length ? [...uw.nfts] : [];
                          const un = { ...(nft ?? {}) };
                          // 正規化: tokenId に書き、古い tokeinid は消す
                          if (raw === '') {
                            delete un.tokenId;
                          } else {
                            // 数字以外はそのまま文字列で保持（必要なら Number に変更可能）
                            const asNum = /^[0-9]+$/.test(raw) ? Number(raw) : raw;
                            un.tokenId = asNum;
                          }
                          if ('tokeinid' in un) delete un.tokeinid;

                          if (nfts.length) {
                            nfts[nIdx] = un;
                          } else {
                            nfts.push(un);
                          }
                          uw.nfts = nfts;
                          updated.wallets[wIdx] = uw;
                          return updated;
                        });
                      }}
                      style={{ width: '10rem' }}
                      placeholder="-"
                    />
                  </td>
                    {/* NFT Token ID（編集可, NFT単位: tokenId; tokeinid 互換） */}
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                      <input
                        type="text"
                        value={tokenId ?? ''}
                        onChange={e => {
                          const raw = e.target.value.trim();
                          setStatus(prev => {
                            const updated = { ...prev };
                            updated.wallets = [...updated.wallets];
                            const uw = { ...updated.wallets[wIdx] };
                            const nfts = uw.nfts && uw.nfts.length ? [...uw.nfts] : [];
                            const un = { ...(nft ?? {}) };
                            // 正規化: tokenId に書き、古い tokeinid は消す
                            if (raw === '') {
                              delete un.tokenId;
                            } else {
                              const asNum = /^[0-9]+$/.test(raw) ? Number(raw) : raw;
                              un.tokenId = asNum;
                            }
                            if ('tokeinid' in un) delete un.tokeinid;

                            if (nfts.length) {
                              nfts[nIdx] = un;
                            } else {
                              nfts.push(un);
                            }
                            uw.nfts = nfts;
                            updated.wallets[wIdx] = uw;
                            return updated;
                          });
                        }}
                        style={{ width: '10rem' }}
                        placeholder="-"
                      />
                    </td>

                    {/* 削除ボタン列 */}
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`このNFTを削除しますか？\nWallet: ${w['wallet name'] ?? ''}\nToken ID: ${tokenId ?? '-'}`)) {
                            setStatus(prev => {
                              const updated = { ...prev };
                              updated.wallets = [...updated.wallets];
                              const uw = { ...updated.wallets[wIdx] };
                              const nfts = uw.nfts && uw.nfts.length ? [...uw.nfts] : [];
                              nfts.splice(nIdx, 1);
                              uw.nfts = nfts;
                              updated.wallets[wIdx] = uw;
                              return updated;
                            });
                          }
                        }}
                        style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
                        title="このNFTを削除"
                      >
                        🗑
                      </button>
                    </td>
                </tr>
              );
            })
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

  {/* Config 表示（画面最下部） */}
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
