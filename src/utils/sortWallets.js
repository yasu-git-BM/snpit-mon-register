// src/utils/sortWallets.js
export function sortWalletEntries(walletData) {
  return Object.entries(walletData).sort(([addrA, infoA], [addrB, infoB]) => {
    const nameA = infoA.name?.trim();
    const nameB = infoB.name?.trim();

    if (nameA && nameB) {
      return nameA.localeCompare(nameB, 'ja');
    }
    if (nameA && !nameB) return -1; // 名前ありを先に
    if (!nameA && nameB) return 1;  // 名前なしを後に
    return addrA.localeCompare(addrB, 'ja'); // 両方名前なしならアドレスで
  });
}
