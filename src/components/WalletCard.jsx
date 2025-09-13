// src/components/WalletCard.jsx
import React from 'react';
import { sortWalletEntries } from '../utils/sortWallets';

export default function WalletCard({ walletData }) {
  if (!walletData || Object.keys(walletData).length === 0) {
    return <div>ウォレット情報がありません</div>;
  }

  const sortedWallets = sortWalletEntries(walletData);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {sortedWallets.map(([address, info]) => (
        <div
          key={address}
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: '1rem',
            minWidth: 200
          }}
        >
          <h3 style={{ margin: 0 }}>{info.name || '(名前なし)'}</h3>
          <p style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{address}</p>
          <p>Shots: {info.count ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
