import React, { useState, useEffect } from 'react';
import { fetchConfig } from '../api/fetchConfig';
import { updateConfig } from '../api/updateConfig';

export default function SettingsPanel({ onConfigChange }) {
  const [localConfig, setLocalConfig] = useState(null);

  useEffect(() => {
    fetchConfig().then((cfg) => {
      setLocalConfig(cfg);
      onConfigChange(cfg);
    });
  }, []);

  if (!localConfig) return <p>読み込み中…</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalConfig({ ...localConfig, [name]: Number(value) });
  };

  const handleSave = () => {
    updateConfig(localConfig).then(() => {
      onConfigChange(localConfig);
      alert('設定を保存しました');
    });
  };

  return (
    <div
      className="settings-panel"
      style={{
        padding: '8px',
        marginBottom: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
    >
      <h2 style={{ marginTop: 0 }}>設定</h2>
      <label style={{ display: 'block', marginBottom: '8px' }}>
        ポーリング間隔（ms）：
        <input
          type="number"
          name="pollingIntervalMs"
          value={localConfig.pollingIntervalMs}
          onChange={handleChange}
          style={{ marginLeft: '8px', width: '120px' }}
        />
      </label>
      <button
        onClick={handleSave}
        style={{
          padding: '6px 12px',
          background: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        保存
      </button>
    </div>
  );
}
