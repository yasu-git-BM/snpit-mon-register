// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchStatus } from '../api/fetchStatus';

export default function Dashboard() {
  const [data, setData] = useState({ wallets: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel = false;
    console.log('🚀 Dashboard useEffect start');

    async function load() {
      try {
        const d = await fetchStatus();
        if (!cancel) {
          console.log('✅ fetchStatus resolved');
          setData(d);
        }
      } catch (e) {
        console.error('❌ fetchStatus error:', e);
        if (!cancel) setError(e.message);
      }
    }

    load();
    return () => { cancel = true; };
  }, []);

  console.log('🖥️ Dashboard state data:', data);

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>MON Register</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>
          Error: {error}
        </div>
      )}

      <section style={{ marginTop: 12 }}>
        <h2 style={{ margin: '8px 0' }}>Status</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 6, textAlign: 'left' }}>Wallet name</th>
              <th style={{ border: '1px solid #ddd', padding: 6, textAlign: 'left' }}>Wallet address</th>
              <th style={{ border: '1px solid #ddd', padding: 6, textAlign: 'right' }}>enableShots</th>
              <th style={{ border: '1px solid #ddd', padding: 6, textAlign: 'left' }}>lastChecked</th>
              <th style={{ border: '1px solid #ddd', padding: 6, textAlign: 'left' }}>NFTs (tokenId : name / lastTotalShots)</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data.wallets) && data.wallets.length > 0 ? (
              data.wallets.map((w, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #eee', padding: 6 }}>{w['wallet name'] || '-'}</td>
                  <td style={{ border: '1px solid #eee', padding: 6, fontFamily: 'monospace' }}>{w['wallet address'] || '-'}</td>
                  <td style={{ border: '1px solid #eee', padding: 6, textAlign: 'right' }}>{w.enableShots ?? 0}</td>
                  <td style={{ border: '1px solid #eee', padding: 6 }}>{w.lastChecked || '-'}</td>
                  <td style={{ border: '1px solid #eee', padding: 6 }}>
                    {Array.isArray(w.nfts) && w.nfts.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {w.nfts.map((n, i) => (
                          <li key={i} style={{ margin: '2px 0' }}>
                            <span style={{ fontFamily: 'monospace' }}>{n.tokenId || '-'}</span>
                            {' : '}
                            <span>{n.name || '-'}</span>
                            {' / '}
                            <span>{n.lastTotalShots ?? 0}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ border: '1px solid #eee', padding: 8, textAlign: 'center', color: '#888' }}>
                  No wallets
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
