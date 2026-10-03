import { useState } from 'react';
import { signIn, isSupabaseConfigured } from '../utils/supabaseClient';
import { Heart, LogIn, Eye, EyeOff, AlertCircle, Sparkles, Mail, Lock, ShieldCheck, Smartphone } from 'lucide-react';
import './Login.css';

export default function Auth({ initialTab = 'login', onGuestLogin }) {
  const [activeTab, setActiveTab] = useState(initialTab === 'info' ? 'info' : 'login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Email dan kata sandi harus diisi.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: authError } = await signIn(email.trim(), password);
    setLoading(false);

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        setError('Email atau kata sandi salah. Silakan periksa kembali.');
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Email belum dikonfirmasi. Periksa kotak masuk email Anda.');
      } else {
        setError(authError.message || 'Gagal masuk. Coba lagi beberapa saat lagi.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />

      <div className="login-card animate-fade-in-up">
        {/* Logo */}
        <div className="login-logo">
          <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Bumil Ceria" className="login-logo__img" />
        </div>

        <h1 className="login-title">Bumil Ceria</h1>
        <p className="login-subtitle">Perjalanan Indah Bersama 🌸</p>

        {/* Segmented Tab Switcher */}
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'login'}
            className={`auth-tab ${activeTab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            <LogIn size={15} />
            <span>Masuk</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'info'}
            className={`auth-tab ${activeTab === 'info' ? 'auth-tab--active' : ''}`}
            onClick={() => { setActiveTab('info'); setError(''); }}
          >
            <ShieldCheck size={15} />
            <span>Info Akses</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <div>
            {!isSupabaseConfigured && (
              <div className="login-unconfigured" style={{ marginBottom: '16px' }}>
                <AlertCircle size={20} />
                <p>Mode Offline / Pratinjau Lokal</p>
                <p className="text-xs" style={{ marginTop: '4px' }}>
                  Koneksi Supabase belum terdeteksi secara lokal (secret aktif di GitHub Actions). Anda dapat menggunakan aplikasi sepenuhnya via Mode Tamu.
                </p>
                {onGuestLogin && (
                  <button
                    type="button"
                    className="btn btn-primary btn-full login-btn"
                    style={{ marginTop: '10px' }}
                    onClick={onGuestLogin}
                  >
                    <Smartphone size={16} />
                    <span>Lanjut Mode Tamu (Offline)</span>
                  </button>
                )}
              </div>
            )}

            <form className="login-form" onSubmit={handleLoginSubmit} noValidate>
              <div className="input-group">
                <label htmlFor="login-email">
                  <Mail size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="input-field"
                  placeholder="mama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  disabled={loading}
                />
              </div>

              <div className="input-group" style={{ marginTop: '14px' }}>
                <label htmlFor="login-password">
                  <Lock size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                  Kata Sandi
                </label>
                <div className="input-password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error animate-scale-in">
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Masuk ke Bumil Ceria</span>
                  </>
                )}
              </button>
            </form>

            {isSupabaseConfigured && onGuestLogin && (
              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn btn-ghost text-xs"
                  style={{ color: 'var(--color-text-secondary)', padding: '6px 12px' }}
                  onClick={onGuestLogin}
                >
                  <Smartphone size={14} style={{ marginRight: '4px' }} />
                  Coba Tanpa Akun (Mode Tamu / Offline)
                </button>
              </div>
            )}

            <div className="auth-switch-prompt">
              <span>Belum memiliki akun? </span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setActiveTab('info'); setError(''); }}
              >
                Lihat informasi akses
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INFO AKSES & PENDAFTARAN ADMIN */}
        {activeTab === 'info' && (
          <div className="animate-fade-in-up">
            <div className="auth-mockup-badge" style={{ marginBottom: '14px' }}>
              <Sparkles size={13} />
              <span>Akses Khusus & Terkelola</span>
            </div>

            <div className="card" style={{ padding: '16px', background: 'var(--color-bg-card)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>Pendaftaran Terpusat</h3>
              </div>
              <p className="text-xs text-secondary" style={{ lineHeight: 1.6, margin: 0 }}>
                Akun Bumil Ceria dikelola secara privat oleh Admin. Akses masuk hanya diberikan kepada pengguna yang telah didaftarkan secara resmi di database Supabase.
              </p>
            </div>

            <div className="card" style={{ padding: '14px', background: 'var(--color-primary-subtle)', marginBottom: '18px' }}>
              <p className="text-xs" style={{ color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.5 }}>
                💡 <em>Ingin mencoba seluruh fitur kehamilan langsung?</em> Anda dapat menggunakan <strong>Mode Tamu</strong> dengan penyimpanan lokal tanpa login.
              </p>
            </div>

            {onGuestLogin && (
              <button
                type="button"
                className="btn btn-primary btn-full login-btn"
                onClick={onGuestLogin}
              >
                <Smartphone size={16} />
                <span>Mulai dengan Mode Tamu (Offline)</span>
              </button>
            )}

            <div className="auth-switch-prompt" style={{ marginTop: '16px' }}>
              <span>Sudah memiliki akun? </span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setActiveTab('login'); setError(''); }}
              >
                Masuk sekarang
              </button>
            </div>
          </div>
        )}

        <p className="login-footer">
          <Heart size={12} fill="currentColor" />
          <span>Bumil Ceria v1.0 · Bandar Lampung</span>
        </p>
      </div>
    </div>
  );
}
