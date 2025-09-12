import React, { useState } from 'react';

export default function WalletForm({ onAdd }) {
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address) return;
    onAdd(address.trim());
    setAddress('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', margin: '8px 0' }}
    >
      <input
        type="text"
        placeholder="ウォレットアドレスを追加"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          flex: 1,
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px 0 0 4px'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '8px 12px',
          background: '#0066ff',
          color: '#fff',
          border: 'none',
          borderRadius: '0 4px 4px 0',
          cursor: 'pointer'
        }}
      >
        追加
      </button>
    </form>
  );
}
