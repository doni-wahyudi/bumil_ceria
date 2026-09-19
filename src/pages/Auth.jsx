import { useState } from 'react';
import { signIn, isSupabaseConfigured } from '../utils/supabaseClient';
import { Heart, LogIn, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2, Sparkles, User, Mail, Lock } from 'lucide-react';
import './Login.css';

export default function Auth({ initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Signup form state (Mockup)
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState('mama'); // 'mama' | 'papa'
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

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
    // On success, App.jsx onAuthStateChange listener automatically updates session
  };

  // Handle Signup Mockup submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim()) {
      setSignupError('Silakan masukkan nama lengkap Mama atau Papa.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setSignupError('Silakan masukkan alamat email yang valid.');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setSignupLoading(true);
    // Simulate real network request
    setTimeout(() => {
      setSignupLoading(false);
      setSignupSuccess(true);
    }, 700);
  };

  // Proceed from signup success to login tab
  const handleProceedToLogin = () => {
    setEmail(signupEmail);
    setActiveTab('login');
    setSignupSuccess(false);
    setError('');
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
            aria-selected={activeTab === 'signup'}
            className={`auth-tab ${activeTab === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => { setActiveTab('signup'); setSignupError(''); }}
          >
            <UserPlus size={15} />
            <span>Daftar</span>
            <span className="auth-tab-mock-pill">Demo</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <div>
            {!isSupabaseConfigured && (
              <div className="login-unconfigured">
                <AlertCircle size={20} />
                <p>Koneksi Supabase belum terdeteksi.</p>
                <p className="text-xs">Pastikan VITE_SUPABASE_URL & ANON_KEY sudah terpasang.</p>
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

            <div className="auth-switch-prompt">
              <span>Belum memiliki akun? </span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setActiveTab('signup'); setSignupError(''); }}
              >
                Daftar sekarang
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SIGNUP (MOCKUP) */}
        {activeTab === 'signup' && (
          <div>
            {signupSuccess ? (
              <div className="auth-success-card animate-scale-in">
                <div className="auth-success-icon">
                  <CheckCircle2 size={40} color="#10b981" />
                </div>
                <h3>Pendaftaran Mockup Berhasil!</h3>
                <p className="auth-success-desc">
                  Selamat datang, <strong>{signupName}</strong> ({signupRole === 'mama' ? 'Calon Mama' : 'Calon Papa'})! 🌸
                </p>
                <div className="auth-success-note">
                  <p className="text-xs">
                    Akun Anda telah tercatat dalam simulasi pendaftaran. Akun resmi Bumil Ceria dikelola secara terpusat oleh admin melalui Supabase Auth.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-full login-btn"
                  onClick={handleProceedToLogin}
                >
                  <LogIn size={16} />
                  <span>Lanjut Masuk dengan Akun Ini</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="auth-mockup-badge">
                  <Sparkles size={13} />
                  <span>Mode Pendaftaran (Simulasi / Mockup)</span>
                </div>

                <form className="login-form" onSubmit={handleSignupSubmit} noValidate>
                  {/* Role Selector */}
                  <div className="input-group">
                    <label>Peran Saya</label>
                    <div className="auth-role-pills">
                      <button
                        type="button"
                        className={`auth-role-pill ${signupRole === 'mama' ? 'auth-role-pill--active' : ''}`}
                        onClick={() => setSignupRole('mama')}
                      >
                        🌸 Calon Mama
                      </button>
                      <button
                        type="button"
                        className={`auth-role-pill ${signupRole === 'papa' ? 'auth-role-pill--active' : ''}`}
                        onClick={() => setSignupRole('papa')}
                      >
                        👔 Calon Papa
                      </button>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="input-group" style={{ marginTop: '12px' }}>
                    <label htmlFor="signup-name">
                      <User size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                      Nama Lengkap
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      className="input-field"
                      placeholder={signupRole === 'mama' ? 'Contoh: Bunda Sarah' : 'Contoh: Ayah Dimas'}
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      disabled={signupLoading}
                    />
                  </div>

                  {/* Email */}
                  <div className="input-group" style={{ marginTop: '12px' }}>
                    <label htmlFor="signup-email">
                      <Mail size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                      Alamat Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      className="input-field"
                      placeholder="nama@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      autoComplete="email"
                      disabled={signupLoading}
                    />
                  </div>

                  {/* Password */}
                  <div className="input-group" style={{ marginTop: '12px' }}>
                    <label htmlFor="signup-password">
                      <Lock size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                      Kata Sandi (min. 6 karakter)
                    </label>
                    <div className="input-password-wrapper">
                      <input
                        id="signup-password"
                        type={showSignupPassword ? 'text' : 'password'}
                        className="input-field"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={signupLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        tabIndex={-1}
                        aria-label={showSignupPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      >
                        {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="input-group" style={{ marginTop: '12px' }}>
                    <label htmlFor="signup-confirm">
                      <Lock size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                      Konfirmasi Kata Sandi
                    </label>
                    <input
                      id="signup-confirm"
                      type={showSignupPassword ? 'text' : 'password'}
                      className="input-field"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={signupLoading}
                    />
                  </div>

                  {signupError && (
                    <div className="login-error animate-scale-in">
                      <AlertCircle size={15} style={{ flexShrink: 0 }} />
                      <span>{signupError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-full login-btn"
                    disabled={signupLoading}
                  >
                    {signupLoading ? (
                      <>
                        <span className="login-spinner" />
                        <span>Mendaftarkan Akun...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Daftar Akun Baru</span>
                      </>
                    )}
                  </button>
                </form>

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
            )}
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
