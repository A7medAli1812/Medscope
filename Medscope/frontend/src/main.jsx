// ...existing code...
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n/i18n';


// ...existing code...

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found');

const root = createRoot(rootEl);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// ...existing code...