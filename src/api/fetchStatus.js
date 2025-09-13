// src/api/fetchStatus.js
// JSONBin の record をそのまま返すバックエンドの /api/status を叩く。
// 受け取ったデータをフロント側でも軽く正規化（tokenid/contract → tokenId、nfts/ wallets の存在保証）する。

function normalizeData(data) {
  const out = data && typeof data === 'object' ? { ...data } : {};
  if (!Array.isArray(out.wallets)) out.wallets = [];

  out.wallets = out.wallets.map(w => {
    const wallet = w && typeof w === 'object' ? { ...w } : {};
    if (!Array.isArray(wallet.nfts)) wallet.nfts = [];

    wallet.nfts = wallet.nfts.map(n => {
      const nft = n && typeof n === 'object' ? { ...n } : {};
      if (nft.tokenid && !nft.tokenId) nft.tokenId = nft.tokenid;
      if (nft.contract && !nft.tokenId) nft.tokenId = nft.contract;
      delete nft.tokenid;
      delete nft.contract;
      return nft;
    });

    return wallet;
  });

  return out;
}

export async function fetchStatus() {
  const res = await fetch('/api/status', { method: 'POST' });
  if (!res.ok) {
    throw new Error(`fetchStatus failed: ${res.status} ${res.statusText}`);
  }
  const raw = await res.json();

  console.log('📥 fetchStatus raw:', raw);

  const normalized = normalizeData(raw);

  console.log('🧹 fetchStatus normalized:', normalized);

  return normalized; // { wallets: [...] } を保証
}
