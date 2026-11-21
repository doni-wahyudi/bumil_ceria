import { useState } from 'react';
import { signIn, isSupabaseConfigured } from '../utils/supabaseClient';
import { Heart, LogIn, Eye, EyeOff, AlertCircle, Mail, Lock, ShieldCheck, Smartphone, Info } from 'lucide-react';
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
    <main className="login-page" id="auth-page">
      <div className="login-bg" aria-hidden="true" />

      <section className="login-card animate-fade-in-up" aria-labelledby="auth-brand-title">
        {/* Logo */}
        <div className="login-logo">
          <img
            src={`${import.meta.env.BASE_URL}logo.jpg`}
            alt="Logo Bumil Ceria"
            width={80}
            height={80}
            fetchPriority="high"
            className="login-logo__img"
          />
        </div>

        <h1 id="auth-brand-title" className="login-title">Bumil Ceria</h1>
        <p className="login-subtitle">Pendamping kehamilan Mama &amp; Papa</p>

        {/* Segmented Tab Switcher */}
        <div className="auth-tabs" role="tablist" aria-label="Pilihan akses">
          <button
            type="button"
            role="tab"
            id="tab-login"
            aria-selected={activeTab === 'login'}
            aria-controls="panel-login"
            className={`auth-tab ${activeTab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            <LogIn size={15} aria-hidden="true" />
            <span>Masuk</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-info"
            aria-selected={activeTab === 'info'}
            aria-controls="panel-info"
            className={`auth-tab ${activeTab === 'info' ? 'auth-tab--active' : ''}`}
            onClick={() => { setActiveTab('info'); setError(''); }}
          >
            <ShieldCheck size={15} aria-hidden="true" />
            <span>Info Akses</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        <div id="panel-login" role="tabpanel" aria-labelledby="tab-login" hidden={activeTab !== 'login'}>
            {!isSupabaseConfigured && (
              <div className="login-unconfigured" role="status">
                <AlertCircle size={18} aria-hidden="true" />
                <p>Pratinjau Lokal (Mode Offline)</p>
                <p className="text-xs login-unconfigured__desc">
                  Sinkronisasi cloud tidak aktif di pratinjau lokal. Gunakan Mode Tamu untuk mengakses seluruh fitur di perangkat ini.
                </p>
                {onGuestLogin && (
                  <button
                    type="button"
                    className="btn btn-primary btn-full login-btn"
                    onClick={onGuestLogin}
                  >
                    <Smartphone size={16} aria-hidden="true" />
                    <span>Masuk Mode Tamu (Offline)</span>
                  </button>
                )}
              </div>
            )}

            <form className="login-form" onSubmit={handleLoginSubmit} noValidate>
              <div className="input-group">
                <label htmlFor="login-email">
                  <Mail size={14} aria-hidden="true" />
                  <span>Alamat Email</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="input-field"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="input-group auth-password-group">
                <label htmlFor="login-password">
                  <Lock size={14} aria-hidden="true" />
                  <span>Kata Sandi</span>
                </label>
                <div className="input-password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error animate-scale-in" role="alert">
                  <AlertCircle size={15} aria-hidden="true" style={{ flexShrink: 0 }} />
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
                    <span className="login-spinner" aria-hidden="true" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} aria-hidden="true" />
                    <span>Masuk ke Bumil Ceria</span>
                  </>
                )}
              </button>
            </form>

            {isSupabaseConfigured && onGuestLogin && (
              <div className="auth-guest-row">
                <button
                  type="button"
                  className="btn btn-ghost text-xs auth-guest-btn"
                  onClick={onGuestLogin}
                >
                  <Smartphone size={14} aria-hidden="true" />
                  <span>Coba Tanpa Akun (Mode Tamu)</span>
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

        {/* TAB 2: INFO AKSES */}
        <div id="panel-info" role="tabpanel" aria-labelledby="tab-info" className="animate-fade-in-up" hidden={activeTab !== 'info'}>
            <div className="auth-mockup-badge">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Akses Privat &amp; Terkelola</span>
            </div>

            <div className="card auth-info-card">
              <div className="auth-info-card__head">
                <ShieldCheck size={18} color="var(--color-primary)" aria-hidden="true" />
                <h2>Pendaftaran Terpusat</h2>
              </div>
              <p className="text-xs text-secondary auth-info-card__desc">
                Akun cloud dikelola secara privat oleh Admin. Akses masuk hanya diberikan kepada pengguna terdaftar di database Supabase.
              </p>
            </div>

            <div className="card auth-tip-card">
              <Info size={16} color="var(--color-secondary-dark)" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
              <p className="text-xs auth-tip-card__text">
                Untuk mencoba seluruh fitur kehamilan secara langsung, gunakan Mode Tamu dengan penyimpanan lokal di perangkat ini.
              </p>
            </div>

            {onGuestLogin && (
              <button
                type="button"
                className="btn btn-primary btn-full login-btn"
                onClick={onGuestLogin}
              >
                <Smartphone size={16} aria-hidden="true" />
                <span>Mulai dengan Mode Tamu</span>
              </button>
            )}

            <div className="auth-switch-prompt">
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

        <p className="login-footer">
          <Heart size={12} fill="currentColor" aria-hidden="true" />
          <span>Bumil Ceria v1.0 · Bandar Lampung</span>
        </p>
      </section>
    </main>
  );
}
