// mon_register/src/main.jsx

// ① ビルド時に環境変数が正しく渡っているか確認するログ
console.log('API_BASE=', import.meta.env.VITE_API_BASE);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
