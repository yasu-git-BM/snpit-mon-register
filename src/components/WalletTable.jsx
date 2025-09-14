import React from 'react';

function formatAddress(addr) {
  if (!addr || typeof addr !== 'string') return '-';
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 5)}...${addr.slice(-5)}`;
}

export default function WalletTable({ status, setStatus }) {
  if (!status?.wallets?.length) return null;

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>Status</h2>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #ccc',
        backgroundColor: '#fff'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Wallet</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Max Shots</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Enable Shots</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              Camera<br />Token ID
            </th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Total Shots</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Last Checked</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>🗑</th>
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
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
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
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'right' }}>
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

                  {/* Total Shots */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'right' }}>
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
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {w.lastChecked ? new Date(w.lastChecked).toLocaleString('ja-JP') : '-'}
                  </td>

                  {/* Delete Button */}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'center' }}>
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
    </section>
  );
}
