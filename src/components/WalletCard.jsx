import React from 'react';
import { sortWalletEntries } from '../utils/sortWallets';

export default function WalletCard({ walletData }) {
  if (!walletData || Object.keys(walletData).length === 0) {
    return <div>ウォレット情報がありません</div>;
  }

  const sortedWallets = sortWalletEntries(walletData);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {sortedWallets.map(([address, info]) => {
        const enableShots = info.count ?? null;
        const maxShots = info.maxShots ?? null;

        let shotsLabel = '';
        let shotsColor = '#333';

        if (enableShots === null) {
          shotsLabel = '⚠️ 不整合';
          shotsColor = 'red';
        } else if (maxShots !== null && enableShots < maxShots) {
          shotsLabel = `残り ${enableShots} / ${maxShots}`;
          shotsColor = '#996600';
        } else if (enableShots === maxShots) {
          shotsLabel = '満タン';
          shotsColor = 'green';
        } else {
          shotsLabel = `Shots: ${enableShots}`;
        }

        return (
          <div
            key={address}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: '1rem',
              minWidth: 200,
              backgroundColor: enableShots === null ? '#ffe5e5' :
                               enableShots === maxShots ? '#e5ffe5' :
                               enableShots < maxShots ? '#fffbe5' : '#fff'
            }}
          >
            <h3 style={{ margin: 0 }}>{info.name || '(名前なし)'}</h3>
            <p style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{address}</p>
            <p style={{ color: shotsColor }}>{shotsLabel}</p>
          </div>
        );
      })}
    </div>
  );
}
