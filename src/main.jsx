import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register PWA Service Worker for offline capability
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/bumil_ceria/sw.js', { scope: '/bumil_ceria/' }).catch((err) => {
      console.warn('ServiceWorker registration failed: ', err);
    });
  });
}
