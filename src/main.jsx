// mon_register/src/main.jsx

// ① Service Worker を強制解除して最新バンドルを確実に取得
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
  });
}

console.log('🚀 ENTRY file loaded');
const API_BASE = import.meta.env.VITE_API_BASE
  || 'https://snpit-line-bot.onrender.com';
console.log('🌐 API_BASE =', API_BASE);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App apiBase={API_BASE} />
    </BrowserRouter>
  </React.StrictMode>
);
