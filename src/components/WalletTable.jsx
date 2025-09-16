import React, { useState } from 'react';
import { updateStatus } from '../api/updateStatus';

function formatAddress(addr) {
  if (!addr || typeof addr !== 'string') return '-';
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 5)}...${addr.slice(-5)}`;
}

export default function WalletTable({ status, setStatus, onReload, isLoading }) {
  if (isLoading) {
    return <div style={{ padding: '1rem', color: '#666' }}>⏳ 読み込み中...</div>;
  }
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!status?.wallets?.length) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStatus({ wallets: status.wallets }, true); // forceOverride
      if (onReload) onReload();
      alert('✅ 保存しました');
    } catch (err) {
      console.error('❌ 保存エラー:', err);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

const handleCorrection = async (wallet) => {
  const input = prompt('補正値を入力してください', wallet.enableShots ?? '');
  if (input === null) return;

  const newShots = input === '' ? null : Math.max(0, parseInt(input, 10) || 0);

  // 全体をコピーして補正対象だけ更新
  const updatedWallets = status.wallets.map(w => {
    if (w['wallet address'] === wallet['wallet address']) {
      return {
        ...w,
        enableShots: newShots,
        manualOverride: true
      };
    }
    return w;
  });

  setIsUpdating(true);
  try {
    await updateStatus({ wallets: updatedWallets }, true); // ← 全体を保存
    if (onReload) onReload();
    alert(`✅ 補正しました (${wallet['wallet name']})`);
  } catch (err) {
    console.error('❌ 補正エラー:', err);
    alert('補正に失敗しました');
  } finally {
    setIsUpdating(false);
  }
};

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>Status</h2>
      {(isSaving || isUpdating) && (
        <div style={{ marginBottom: '0.5rem', color: '#666' }}>⏳ 処理中...</div>
      )}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #ccc',
        backgroundColor: '#fff'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' , borderBottom: '1px solid #ccc' }}>
            <th>Wallet</th>
            <th>Max Shots</th>
            <th>Enable Shots</th>
            <th>Camera<br />Token ID</th>
            <th>Total Shots</th>
            <th>Last Checked</th>
            <th>🗑</th>
            <th>補正</th>
          </tr>
        </thead>
        <tbody>
          {status.wallets.map((w, wIdx) =>
            (w.nfts?.length ? w.nfts : [null]).map((nft, nIdx) => {
              const tokenId = nft?.tokenId ?? nft?.tokeinid ?? '';
              const cameraName = nft?.name ?? '';
              const imageUrl = nft?.image ?? '';
              const enableShots = w.enableShots;
              const maxShots = w.maxShots;
              const lastShots = nft?.lastTotalShots;
              const recordedShots = nft?.recordedShots;

              const enableBg =
                enableShots === null ? '#ffe5e5' :
                enableShots === maxShots ? '#e5ffe5' :
                enableShots < maxShots ? '#fffbe5' : '#fff';

              const shotDelta = (typeof lastShots === 'number' && typeof recordedShots === 'number')
                ? lastShots - recordedShots
                : null;

              return (
                <tr key={`${wIdx}-${nIdx}`} style={{ backgroundColor: '#fff' }}>
                  {/* Wallet Name + Address */}
                  <td>
                    <input
                      type="text"
                      value={w['wallet name'] ?? ''}
                      onChange={e => {
                        const val = e.target.value;
                        setStatus(prev => {
                          const updated = { ...prev };
                          updated.wallets[wIdx]['wallet name'] = val;
                          return updated;
                        });
                      }}
                      style={{ width: '6rem', marginBottom: '0.25rem' }}
                    />
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#555' }}>
                      {formatAddress(w['wallet address'])}
                    </div>
                  </td>

                  {/* Max Shots */}
                  <td style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      value={maxShots ?? ''}
                      min="0"
                      onChange={e => {
                        const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
                        setStatus(prev => {
                          const updated = { ...prev };
                          updated.wallets[wIdx].maxShots = val;
                          return updated;
                        });
                      }}
                      style={{ width: '5rem' }}
                    />
                  </td>

                  {/* Enable Shots */}
                  <td style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      value={enableShots ?? ''}
                      min="0"
                      onChange={e => {
                        const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
                        setStatus(prev => {
                          const updated = { ...prev };
                          updated.wallets[wIdx].enableShots = val;
                          return updated;
                        });
                      }}
                      style={{ width: '5rem', backgroundColor: enableBg }}
                    />
                    {enableShots === null && (
                      <div style={{ color: 'red', fontSize: '0.8rem' }}>⚠️ 不整合</div>
                    )}
                    {enableShots !== null && maxShots !== null && enableShots < maxShots && (
                      <div style={{ color: '#996600', fontSize: '0.8rem' }}>
                        残り {enableShots} / {maxShots}
                      </div>
                    )}
                    {enableShots === maxShots && (
                      <div style={{ color: 'green', fontSize: '0.8rem' }}>満タン</div>
                    )}
                  </td>

                  {/* Camera Name + Token ID + Thumbnail */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="NFT"
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <input
                          type="text"
                          value={cameraName}
                          onChange={e => {
                            const val = e.target.value;
                            setStatus(prev => {
                              const updated = { ...prev };
                              const uw = { ...updated.wallets[wIdx] };
                              const nfts = uw.nfts?.slice() ?? [];
                              const un = { ...(nft ?? {}) };
                              un.name = val;
                              nfts[nIdx] = un;
                              uw.nfts = nfts;
                              updated.wallets[wIdx] = uw;
                              return updated;
                            });
                          }}
                          style={{ width: '6rem' }}
                        />
                        <input
                          type="text"
                          value={tokenId}
                          onChange={e => {
                            const raw = e.target.value.trim();
                            setStatus(prev => {
                              const updated = { ...prev };
                              const uw = { ...updated.wallets[wIdx] };
                              const nfts = uw.nfts?.slice() ?? [];
                              const un = { ...(nft ?? {}) };
                              if (raw === '') {
                                delete un.tokenId;
                              } else {
                                const asNum = /^[0-9]+$/.test(raw) ? Number(raw) : raw;
                                un.tokenId = asNum;
                              }
                              delete un.tokeinid;
                              nfts[nIdx] = un;
                              uw.nfts = nfts;
                              updated.wallets[wIdx] = uw;
                              return updated;
                            });
                          }}
                          style={{ width: '8rem' }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Total Shots */}
                  <td style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      value={lastShots ?? ''}
                      min="0"
                      onChange={e => {
                        const raw = e.target.value;
                        const val = raw === '' ? null : Math.max(0, parseInt(raw, 10) || 0);
                        setStatus(prev => {
                          const updated = { ...prev };
                          const uw = { ...updated.wallets[wIdx] };
                          const nfts = uw.nfts?.slice() ?? [];
                          const un = { ...(nft ?? {}) };
                          un.lastTotalShots = val;
                          nfts[nIdx] = un;
                          uw.nfts = nfts;
                          updated.wallets[wIdx] = uw;
                          return updated;
                        });
                      }}
                      style={{ width: '5rem' }}
                    />
                    {shotDelta !== null && (
                      <div style={{ fontSize: '0.8rem', color: shotDelta > 0 ? 'blue' : shotDelta < 0 ? 'red' : '#666' }}>
                        {shotDelta > 0 ? `+${shotDelta}枚` : shotDelta < 0 ? '⚠️ 不整合' : '変化なし'}
                      </div>
                    )}
                  </td>

                  {/* Last Checked */}
                  <td>
                    {w.lastChecked ? new Date(w.lastChecked).toLocaleString('ja-JP') : '-'}
                  </td>

                  {/* Delete Button */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`このNFTを削除しますか？\nWallet: ${w['wallet name'] ?? ''}\nToken ID: ${tokenId ?? '-'}`)) {
                          setStatus(prev => {
                            const updated = { ...prev };
                            const uw = { ...updated.wallets[wIdx] };
                            const nfts = uw.nfts?.slice() ?? [];
                            nfts.splice(nIdx, 1);
                            uw.nfts = nfts;
                            updated.wallets[wIdx] = uw;
                            return updated;
                          });
                        }
                      }}
                      style={{
                        cursor: 'pointer',
                        color: 'red',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        background: 'none',
                        border: 'none'
                      }}
                      title="このNFTを削除"
                    >
                      🗑
                    </button>
                  </td>

                  {/* Manual Correction Button */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleCorrection(w)}
                      disabled={isUpdating}
                      style={{
                        backgroundColor: '#ffcc00',
                        color: '#333',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                      }}
                      title="このウォレットの補正を実行"
                    >
                      補正
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Save Button */}
      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            backgroundColor: isSaving ? '#ccc' : '#0066ff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          保存
        </button>
      </div>
    </section>
  );
}
