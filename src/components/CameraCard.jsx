import React, { useState } from 'react';
import { updateStatus } from '../api/client';

async function getOwnerAndShots(tokenId) {
  const res = await fetch(`/api/nft-info/${tokenId}`);
  if (!res.ok) throw new Error(`NFT情報取得失敗: ${res.status}`);
  return await res.json(); // { owner, totalShots }
}

export default function CameraCard({ currentStatus, onStatusUpdated }) {
  const [walletName, setWalletName] = useState('');
  const [nftTokenId, setNftTokenId] = useState('');
  const [nftName, setNftName] = useState('');

  const handleRegister = async () => {
    if (!nftTokenId.trim()) {
      alert('NFT Token IDは必須です');
      return;
    }

    try {
      console.log(`🔍 Fetching owner & shots for tokenId=${nftTokenId}`);
      const { owner, totalShots } = await getOwnerAndShots(nftTokenId.trim());
      console.log(`✅ owner=${owner}, totalShots=${totalShots}`);

      const updatedStatus = currentStatus && typeof currentStatus === 'object'
        ? { ...currentStatus }
        : { wallets: [] };

      if (!Array.isArray(updatedStatus.wallets)) {
        updatedStatus.wallets = [];
      }

      const newNft = {
        tokenId: nftTokenId.trim(),
        name: nftName.trim() || undefined,
        lastTotalShots: totalShots
      };

      const existingWallet = updatedStatus.wallets.find(
        w => w['wallet address']?.toLowerCase() === owner.toLowerCase()
      );

      if (existingWallet) {
        if (!Array.isArray(existingWallet.nfts)) {
          existingWallet.nfts = [];
        }
        existingWallet.nfts.push(newNft);
      } else {
        updatedStatus.wallets.push({
          'wallet name': walletName.trim() || undefined,
          'wallet address': owner,
          maxShots: 16,
          enableShots: 0,
          lastChecked: new Date().toISOString(),
          nfts: [newNft]
        });
      }

      const saved = await updateStatus(updatedStatus);
      onStatusUpdated?.(saved);

      setWalletName('');
      setNftTokenId('');
      setNftName('');
    } catch (err) {
      console.error('❌ handleRegister error:', err);
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
