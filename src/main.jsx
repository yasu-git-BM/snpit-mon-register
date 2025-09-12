import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

console.log('🌱 main.jsx loaded');

const container = document.getElementById('root');
createRoot(container).render(<App />);
