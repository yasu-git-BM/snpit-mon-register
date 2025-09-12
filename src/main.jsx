// mon_register/src/main.jsx
console.log('🚀 ENTRY file loaded');
console.log('API_BASE=', import.meta.env.VITE_API_BASE);

// 環境変数がビルド時に正しく渡っているか確認
const API_BASE = import.meta.env.VITE_API_BASE
  || 'https://snpit-line-bot.onrender.com';
console.log('API_BASE=', API_BASE);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import App from './App.jsx';
import './index.css';
import theme from './styles/theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
