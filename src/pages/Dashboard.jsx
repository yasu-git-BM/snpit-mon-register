import React, { useEffect, useState } from 'react';
import { fetchStatus } from '../api/fetchStatus';
import { updateStatus } from '../api/updateStatus';
import WalletForm from '../components/WalletForm';
import WalletCard from '../components/WalletCard';
import CameraCard from '../components/CameraCard';
import SettingsPanel from '../components/SettingsPanel';
import '../styles/theme.js';

export default function Dashboard() {
  const [statusData, setStatusData] = useState({});
  const [walletOrder, setWalletOrder] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // 初回ロード／更新後にステータスを取得
  useEffect(() => {
    (async () => {
      try {
        const status = await fetchStatus();
        setStatusData(status);
      } catch (err) {
        console.error('fetchStatus error:', err);
      }
    })();
  }, [refreshFlag]);

  // 「最新化」ボタン押下時にステータス更新APIを呼ぶ
  const onRefresh = async () => {
    try {
      await updateStatus();
      setRefreshFlag(f => !f);
    } catch (err) {
      console.error('updateStatus error:', err);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <SettingsPanel onAddWallet={address => {
        setWalletOrder(order => [...order, address]);
      }} />

      <button onClick={onRefresh} style={{ margin: '20px 0' }}>
        最新化
      </button>

      <div>
        {/* Wallet の順番に合わせて CameraCard を並べる */}
        {walletOrder.map(addr => {
          const data = statusData[addr];
          return data
            ? <CameraCard key={addr} wallet={addr} status={data} />
            : <WalletCard key={addr} wallet={addr} missing />;
        })}
      </div>
    </div>
  );
}
