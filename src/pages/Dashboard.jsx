// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchStatus } from '../api/fetchStatus';
import { sortWalletEntries } from '../utils/sortWallets';

export default function Dashboard() {
  const [walletData, setWalletData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus()
      .then(setWalletData)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!walletData || Object.keys(walletData).length === 0) return <div>Loading…</div>;

  const sortedWallets = sortWalletEntries(walletData);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>ウォレット一覧</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>ウォレット名</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>アドレス</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>その他情報</th>
          </tr>
        </thead>
        <tbody>
          {sortedWallets.map(([address, info]) => (
            <tr key={address}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {info.name || '-'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', fontFamily: 'monospace' }}>
                {address}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {info.count ?? 0} shots
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
