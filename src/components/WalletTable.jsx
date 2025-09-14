import React from 'react';

function formatAddress(addr) {
  if (!addr || typeof addr !== 'string') return '-';
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 5)}...${addr.slice(-5)}`;
}

function getTokenId(nft) {
  if (!nft) return null;
  return nft.tokenId ?? nft.tokeinid ?? null;
}

function getCameraName(nft) {
  return nft?.name ?? '';
}

function isUnregistered(wallet) {
  return wallet.maxShots == null && wallet.enableShots == null;
}

function isInconsistent(wallet) {
  if (isUnregistered(wallet)) return false;
  const max = wallet.maxShots;
  const enable = wallet.enableShots;
  if (enable == null && max != null) return true;
  if (typeof enable === 'number' && enable < 0) return true;
  if (typeof enable === 'number' && typeof max === 'number' && enable > max) return true;
  return false;
}

export default function WalletTable({ status, setStatus }) {
  console.log('📦 WalletTable received status:', status);

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
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Wallet Name</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Wallet Address</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Camera Name</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Max Shots</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Enable Shots</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Last Checked</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Total Shots</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Token ID</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>🗑</th>
          </tr>
        </thead>
        <tbody>
          {status.wallets.map((w, wIdx) =>
            (w.nfts?.length ? w.nfts : [null]).map((nft, nIdx) => {
              console.log('🎯 Rendering row:', w, nft);

              const tokenId = getTokenId(nft);
              const cameraName = getCameraName(nft);
              const inconsistent = isInconsistent(w);

              return (
                <tr key={`${wIdx}-${nIdx}`} style={{ backgroundColor: '#fff' }}>
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
                      style={{ width: '10rem' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                    {formatAddress(w['wallet address'])}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
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
                      style={{ width: '10rem' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    <input
                      type="number"
                      value={w.maxShots ?? ''}
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
                            updated.wallets[wIdx].enableShots = val;
                            return updated;
                          });
                        }}
                        style={{ width: '5rem' }}
                      />
                    )}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {w.lastChecked ? new Date(w.lastChecked).toLocaleString('ja-JP') : '-'}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    {nft?.lastTotalShots ?? 0}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    <input
                      type="text"
                      value={tokenId ?? ''}
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
                      style={{ width: '10rem' }}
                    />
                  </td>
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
