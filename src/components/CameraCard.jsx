// mon_register/src/components/CameraCard.jsx
import React, { useState } from 'react';
import { updateStatus } from '../api/client';

export default function CameraCard({ currentStatus, onStatusUpdated }) {
  const [walletName, setWalletName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [nftTokenId, setNftTokenId] = useState('');
  const [nftName, setNftName] = useState('');

  const handleRegister = async () => {
    if (!walletAddress.trim() || !nftTokenId.trim()) {
      alert('ウォレットアドレスとNFT Token IDは必須です');
      return;
    }

    // 現在の status をコピー（wallets配列を保証）
    const updatedStatus = currentStatus && typeof currentStatus === 'object'
      ? { ...currentStatus }
      : { wallets: [] };

    if (!Array.isArray(updatedStatus.wallets)) {
      updatedStatus.wallets = [];
    }

    // 新しいNFTオブジェクト
    const newNft = {
      tokenId: nftTokenId.trim(),
      name: nftName.trim() || undefined,
      lastTotalShots: 0
    };

    // 既存ウォレットを探す
    const existingWallet = updatedStatus.wallets.find(
      w => w['wallet address']?.toLowerCase() === walletAddress.trim().toLowerCase()
    );

    if (existingWallet) {
      // 既存ウォレットにNFT追加
      if (!Array.isArray(existingWallet.nfts)) {
        existingWallet.nfts = [];
      }
      existingWallet.nfts.push(newNft);
    } else {
      // 新規ウォレット作成
      updatedStatus.wallets.push({
        'wallet name': walletName.trim() || undefined,
        'wallet address': walletAddress.trim(),
        maxShots: 16,
        enableShots: 0,
        lastChecked: new Date().toISOString(),
        nfts: [newNft]
      });
    }

    try {
      console.log('📤 handleRegister → updateStatus with:', updatedStatus);
      const saved = await updateStatus(updatedStatus);
      console.log('✅ updateStatus result:', saved);
      onStatusUpdated?.(saved);

      // 入力欄クリア
      setWalletName('');
      setWalletAddress('');
      setNftTokenId('');
      setNftName('');
    } catch (err) {
      console.error('❌ updateStatus error:', err);
      alert(`登録に失敗しました: ${err.message}`);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 8, marginTop: '1.5rem' }}>
      <h2 style={{ marginTop: 0 }}>カメラ登録</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="ウォレット名（任意）"
          value={walletName}
          onChange={e => setWalletName(e.target.value)}
        />
        <input
          type="text"
          placeholder="ウォレットアドレス（必須）"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="NFT Token ID（必須）"
          value={nftTokenId}
          onChange={e => setNftTokenId(e.target.value)}
        />
        <input
          type="text"
          placeholder="カメラ名（任意）"
          value={nftName}
          onChange={e => setNftName(e.target.value)}
        />
        <button
          type="button"
          onClick={handleRegister}
          style={{ padding: '0.5rem', cursor: 'pointer' }}
        >
          登録
        </button>
      </div>
    </div>
  );
}
