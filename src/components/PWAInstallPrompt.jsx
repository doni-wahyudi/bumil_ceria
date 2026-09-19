import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import './PWAInstallPrompt.css';

export default function PWAInstallPrompt({ hasMiniPlayer = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if dismissed before
    const isDismissed = sessionStorage.getItem('bumpbuddy_pwa_dismissed');
    if (isDismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('bumpbuddy_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <aside
      className={`pwa-prompt-banner card animate-fade-in-up ${hasMiniPlayer ? 'pwa-prompt-banner--lifted' : ''}`}
      role="region"
      aria-label="Instalasi Aplikasi"
    >
      <div className="pwa-prompt-icon">
        <Smartphone size={20} />
      </div>
      <div className="pwa-prompt-content">
        <strong>Pasang Aplikasi Bumil Ceria</strong>
        <p className="text-xs text-secondary">
          Akses langsung dari layar beranda HP Mama & Papa, lebih cepat & praktis.
        </p>
      </div>
      <div className="pwa-prompt-actions">
        <button
          type="button"
          className="btn btn-primary pwa-btn-install"
          onClick={handleInstall}
        >
          <Download size={14} /> Pasang
        </button>
        <button
          type="button"
          className="pwa-btn-close"
          onClick={handleDismiss}
          aria-label="Tutup"
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
