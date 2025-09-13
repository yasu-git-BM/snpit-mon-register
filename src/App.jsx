// src/App.jsx
import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';

export default function App() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetchConfig().then(setConfig).catch(err => setError(err.message));
    fetchStatus().then(setStatus).catch(err => setError(err.message));
  }, []);

  // ← 修正：updateStatus の1回呼びでセット
  const handleUpdate = async () => {
    try {
      // ボタンで newData を決めているなら第一引数に渡す
      const newData = status; 
      const updated = await updateStatus(newData);
      setStatus(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  if (!config || !status) {
    return <div className="loading">Loading…</div>;
  }

  return (
    <div className="container">
      <h1>MON Register</h1>
      {/* …省略… */}
      <button onClick={handleUpdate}>Update Status</button>
    </div>
  );
}
