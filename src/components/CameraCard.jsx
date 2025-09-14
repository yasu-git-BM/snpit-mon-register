import React, { useState } from 'react';

export default function CameraCard({ currentStatus, onStatusUpdated }) {
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newCameraName, setNewCameraName] = useState('');
  const [newTokenId, setNewTokenId] = useState('');

  const handleAdd = () => {
    if (!newWalletName || !newWalletAddress || !newTokenId) {
      alert('Wallet Name, Address, Token ID は必須です');
      return;
    }

    const newWallet = {
      'wallet name': newWalletName,
      'wallet address': newWalletAddress,
      maxShots: null,
      enableShots: null,
      nfts: [
        {
          tokenId: /^[0-9]+$/.test(newTokenId) ? Number(newTokenId) : newTokenId,
          name: newCameraName
        }
      ]
    };

    const updated = {
      ...currentStatus,
      wallets: [...(currentStatus.wallets ?? []), newWallet]
    };

    onStatusUpdated(updated);

    // 入力フィールドをクリア
    setNewWalletName('');
    setNewWalletAddress('');
    setNewCameraName('');
    setNewTokenId('');
  };

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>新規カメラ登録</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Wallet Name"
          value={newWalletName}
          onChange={e => setNewWalletName(e.target.value)}
          style={{ width: '10rem' }}
        />
        <input
          type="text"
          placeholder="Wallet Address"
          value={newWalletAddress}
          onChange={e => setNewWalletAddress(e.target.value)}
          style={{ width: '20rem', fontFamily: 'monospace' }}
        />
        <input
          type="text"
          placeholder="Camera Name"
          value={newCameraName}
          onChange={e => setNewCameraName(e.target.value)}
          style={{ width: '10rem' }}
        />
        <input
          type="text"
          placeholder="Token ID"
          value={newTokenId}
          onChange={e => setNewTokenId(e.target.value)}
          style={{ width: '10rem' }}
        />
        <button
          type="button"
          onClick={handleAdd}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          追加
        </button>
      </div>
    </section>
  );
}
