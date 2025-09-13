// src/App.jsx
import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';

export default function App() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError]   = useState(null);

  useEffect(() => {
    // 並列で投げてもいいですが、ここでは逐次的に
    fetchConfig()
      .then(cfg => setConfig(cfg))
      .catch(err => setError(err.message));

    fetchStatus()
      .then(st => setStatus(st))
      .catch(err => setError(err.message));
  }, []);

  const handleUpdate = async () => {
    try {
      // newData は必要に応じて組み立ててください
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

      <section className="config">
        <h2>Config</h2>
        <ul>
          {Object.entries(config).map(([key, val]) => (
            <li key={key}>
              <strong>{key}</strong>: {String(val)}
            </li>
          ))}
        </ul>
      </section>

      <section className="status">
        <h2>Status</h2>
        {Object.entries(status).length === 0 ? (
          <p>No status data</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Camera</th>
                <th>Last Shot</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(status).map(([cam, info]) => (
                <tr key={cam}>
                  <td>{cam}</td>
                  <td>{new Date(info.lastShot).toLocaleString('ja-JP')}</td>
                  <td>{info.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <button onClick={handleUpdate}>Update Status</button>
    </div>
  );
}
