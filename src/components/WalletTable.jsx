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
  console.log('📦 WalletTable received status:', status); // ✅ 状態確認ログ

  if (!status?.wallets?.length) return null;

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>Status</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
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
              console.log('🎯 Rendering row:', w, nft); // ✅ 描画ループ確認ログ

              const tokenId = getTokenId(nft);
              const cameraName = getCameraName(nft);
              const inconsistent = isInconsistent(w);

              return (
                <tr key={`${wIdx}-${nIdx}`}>
                  {/* ...省略せずそのまま... */}
                  {/* 既存の <td> 群はそのまま維持 */}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}
