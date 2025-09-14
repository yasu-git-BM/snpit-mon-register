/**
 * Gist構成のwallets配列を { address: { name, count, ... } } 形式に変換
 * 表示やソートに使いやすい構造へ正規化する
 */
export function normalizeWallets(wallets) {
  if (!Array.isArray(wallets)) return {};

  const result = {};

  wallets.forEach(wallet => {
    const address = wallet['wallet address'];
    const name = wallet['wallet name'] ?? '';
    const enableShots = wallet.enableShots ?? 0;

    // NFTの総ショット数を集計
    const totalShots = (wallet.nfts ?? []).reduce((sum, nft) => {
      return sum + (nft?.lastTotalShots ?? 0);
    }, 0);

    result[address] = {
      name,
      enableShots,
      count: totalShots,
      lastChecked: wallet.lastChecked ?? null
    };
  });

  return result;
}
