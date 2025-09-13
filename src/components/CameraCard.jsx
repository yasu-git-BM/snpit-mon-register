// mon_register/src/components/CameraCard.jsx
import React, { useState } from 'react';
import { updateStatus } from '../api/client';

export default function CameraCard({ currentStatus, onStatusUpdated }) {
  const [cameraName, setCameraName] = useState('');
  const [nftAddress, setNftAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // バリデーション（重複登録防止）
    if (!cameraName.trim() || !nftAddress.trim()) return;
    if (currentStatus && Object.prototype.hasOwnProperty.call(currentStatus, cameraName)) {
      alert('同名のカメラが既に存在します。別名で登録してください。');
      return;
    }

    // 既存ステータスに新カメラを追加
    const newStatus = {
      ...(currentStatus || {}),
      [cameraName]: {
        nftAddress,
        count: 0,
        lastShot: null
      }
    };

    try {
      const updated = await updateStatus(newStatus);
      onStatusUpdated(updated);
      setCameraName('');
      setNftAddress('');
    } catch (err) {
      alert(`登録に失敗しました: ${err.message}`);
    }
  };

  return (
    <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>カメラ登録</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: 4 }}>カメラ名</label>
          <input
            type="text"
            value={cameraName}
            onChange={(e) => setCameraName(e.target.value)}
            placeholder="例: Alpha-01"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: 4 }}>NFTアドレス</label>
          <input
            type="text"
            value={nftAddress}
            onChange={(e) => setNftAddress(e.target.value)}
            placeholder="0x..."
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          登録
        </button>
      </form>
    </div>
  );
}
