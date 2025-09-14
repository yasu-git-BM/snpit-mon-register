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
    const enableShots = wallet.enableShots ?? null;
    const maxShots = wallet.maxShots ?? null;
    const lastChecked = wallet.lastChecked ?? null;

    // NFTの総ショット数を集計
    const totalShots = (wallet.nfts ?? []).reduce((sum, nft) => {
      return sum + (nft?.lastTotalShots ?? 0);
    }, 0);

    // 不整合判定
    const inconsistent =
      enableShots === null ||
      (typeof enableShots === 'number' && enableShots < 0) ||
      (typeof enableShots === 'number' && typeof maxShots === 'number' && enableShots > maxShots);

    result[address] = {
      name,
      enableShots,
      maxShots,
      count: totalShots,
      lastChecked,
      inconsistent
    };
  });

  return result;
}
