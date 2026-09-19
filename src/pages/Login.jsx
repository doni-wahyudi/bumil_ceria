import { useState } from 'react';
import { signIn, isSupabaseConfigured } from '../utils/supabaseClient';
import { Heart, LogIn, AlertCircle } from 'lucide-react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan kata sandi harus diisi.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: authError } = await signIn(email.trim(), password);
    setLoading(false);
    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        setError('Email atau kata sandi salah. Silakan coba lagi.');
      } else {
        setError(authError.message);
      }
    }
    // On success, App.jsx's onAuthStateChange listener will update session → no redirect needed
  };

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />

      <div className="login-card animate-fade-in-up">
        {/* Logo */}
        <div className="login-logo">
          <img src="logo.jpg" alt="Bumil Ceria" className="login-logo__img" />
        </div>

        <h1 className="login-title">Bumil Ceria</h1>
        <p className="login-subtitle">Perjalanan Indah Bersama 🌸</p>

        {!isSupabaseConfigured ? (
          <div className="login-unconfigured">
            <AlertCircle size={24} />
            <p>Aplikasi belum terhubung ke database.</p>
            <p className="text-xs">Konfigurasi Supabase diperlukan untuk masuk.</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
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

            <div className="input-group" style={{ marginTop: '12px' }}>
              <label htmlFor="login-password">Kata Sandi</label>
              <input
                id="login-password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="login-error animate-scale-in">
                <AlertCircle size={14} />
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
                  Masuk...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Masuk
                </>
              )}
            </button>
          </form>
        )}

        <p className="login-footer">
          <Heart size={12} fill="currentColor" />
          Bumil Ceria v1.0 · Bandar Lampung
        </p>
      </div>
    </div>
  );
}

export default Login;
