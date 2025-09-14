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
  if (!status?.wallets?.length) return null;

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>Status</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Wallet Name</th>
            <th>Wallet Address</th>
            <th>Camera Name</th>
            <th>Max Shots</th>
            <th>Enable Shots</th>
            <th>Last Checked</th>
            <th>Total Shots</th>
            <th>Token ID</th>
            <th>🗑</th>
          </tr>
        </thead>
        <tbody>
          {status.wallets.map((w, wIdx) =>
            (w.nfts?.length ? w.nfts : [null]).map((nft, nIdx) => {
              const tokenId = getTokenId(nft);
              const cameraName = getCameraName(nft);
              const inconsistent = isInconsistent(w);

              return (
                <tr key={`${wIdx}-${nIdx}`}>
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
                      style={{ width: '10rem' }}
                    />
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>{formatAddress(w['wallet address'])}</td>
                  <td>
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
                  <td>
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
                  <td>
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
                  <td>{w.lastChecked ? new Date(w.lastChecked).toLocaleString('ja-JP') : '-'}</td>
                  <td>{nft?.lastTotalShots ?? 0}</td>
                  <td>
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
