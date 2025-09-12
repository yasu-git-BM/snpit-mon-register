import React from 'react';

export default function WalletCard({ address, index }) {
  return (
    <div
      className="wallet-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderBottom: '1px solid #eee'
      }}
    >
      <span style={{ marginRight: '8px', fontWeight: 'bold' }}>
        {index + 1}.
      </span>
      <span style={{ wordBreak: 'break-all' }}>{address}</span>
    </div>
  );
}
