// src/App.jsx
import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchStatus, updateStatus } from './api/client';

export default function App({ apiBase }) {
  const [config, setConfig]   = useState(null);
  const [status, setStatus]   = useState(null);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetchConfig()
      .then(cfg => setConfig(cfg))
      .catch(err => setError(err.message));

    fetchStatus()
      .then(st => setStatus(st))
      .catch(err => setError(err.message));
  }, []);

  const handleUpdate = () => {
    updateStatus()
      .then(res => fetchStatus())
      .then(st => setStatus(st))
      .catch(err => setError(err.message));
  };

  if (error) return <pre>Error: {error}</pre>;
  if (!config || !status) return <p>Loading…</p>;

  return (
    <div>
      <h1>MON Register</h1>
      <pre>Config: {JSON.stringify(config, null, 2)}</pre>
      <pre>Status: {JSON.stringify(status, null, 2)}</pre>
      <button onClick={handleUpdate}>Update Status</button>
    </div>
  );
}
