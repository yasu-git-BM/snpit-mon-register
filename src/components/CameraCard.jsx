// mon_register/src/components/CameraCard.jsx
import React, { useState } from 'react';
import { updateStatus } from '../api/client';
import { ethers } from 'ethers';

// ★ 環境変数から設定を読み込む（.env に設定）
const RPC_URL = process.env.REACT_APP_RPC_URL;
const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT;

const ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

// tokenId からウォレットアドレスと Total Shots を取得
async function getOwnerAndShots(tokenId) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, ABI, provider);

  const owner = await contract.ownerOf(tokenId);
  let uri = await contract.tokenURI(tokenId);

  if (uri.startsWith("ipfs://")) {
    uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  const response = await fetch(uri);
  if (!response.ok) throw new Error(`メタデータ取得失敗: ${response.status}`);
  const metadata = await response.json();

  const totalShots = metadata.attributes?.find(
    attr => attr.trait_type === "Total Shots"
  )?.value ?? 0;

  return { owner, totalShots };
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

      console.log('📤 handleRegister → updateStatus with:', updatedStatus);
      const saved = await updateStatus(updatedStatus);
      console.log('✅ updateStatus result:', saved);
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
