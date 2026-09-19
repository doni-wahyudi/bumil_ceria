import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import {
  updateProfile,
  resetAllData,
  syncLocalToSupabase,
  fetchSupabaseToLocal,
} from '../utils/storage';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
} from '../utils/supabaseClient';
import {
  printMedicalSummary,
  exportDataToJSON,
  importDataFromJSON,
} from '../utils/exportData';
import { formatDateID, calculateDueDate } from '../utils/pregnancyCalc';
import {
  Save,
  RotateCcw,
  Hospital,
  User,
  Baby,
  Shield,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Cloud,
  Database,
  Printer,
  Download,
  Upload,
  Building2,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import './Profile.css';

const insuranceLabels = {
  bpjs: 'BPJS Kesehatan',
  asuransi_kerja: 'Asuransi dari Kantor',
  mandiri: 'Bayar Mandiri',
};

function Profile() {
  const navigate = useNavigate();
  const { profile, refreshProfile, pregnancyData } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [saved, setSaved] = useState(false);

  // Phase 3: Theme State
  const [theme, setTheme] = useState(localStorage.getItem('bumpbuddy_theme') || 'system');

  // Phase 3: Supabase Config State
  const [showCloudConfig, setShowCloudConfig] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [cloudStatus, setCloudStatus] = useState(null); // { type: 'success' | 'error' | 'info', message: string }
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const config = getSupabaseConfig();
    setSupabaseUrl(config.url || '');
    setSupabaseKey(config.anonKey || '');
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('bumpbuddy_theme', newTheme);
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  if (!profile) return null;

  const startEdit = (section) => {
    setEditing(section);
    setSaved(false);
    if (section === 'names') {
      setForm({ mamaName: profile.mamaName, papaName: profile.papaName });
    } else if (section === 'hpht') {
      setForm({ hpht: profile.hpht });
    } else if (section === 'hospital') {
      setForm({
        hospitalName: profile.hospitalName || '',
        hospitalAddress: profile.hospitalAddress || '',
        doctorName: profile.doctorName || '',
      });
    } else if (section === 'insurance') {
      setForm({ insuranceType: profile.insuranceType });
    }
  };

  const handleSave = async () => {
    await updateProfile(form);
    await refreshProfile();
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = async () => {
    await resetAllData();
    window.location.reload();
  };

  // Supabase actions
  const handleSaveCloudConfig = () => {
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    setCloudStatus({ type: 'success', message: 'Kredensial Supabase berhasil disimpan!' });
  };

  const handleTestConnection = async () => {
    setCloudStatus({ type: 'info', message: 'Menguji koneksi ke server Supabase...' });
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setCloudStatus({
      type: res.success ? 'success' : 'error',
      message: res.message,
    });
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    handleSaveCloudConfig();
    const res = await syncLocalToSupabase();
    setIsSyncing(false);
    setCloudStatus({
      type: res.success ? 'success' : 'error',
      message: res.message,
    });
  };

  const handleFetchFromCloud = async () => {
    setIsSyncing(true);
    const res = await fetchSupabaseToLocal();
    setIsSyncing(false);
    if (res.success) {
      await refreshProfile();
    }
    setCloudStatus({
      type: res.success ? 'success' : 'error',
      message: res.message,
    });
  };

  // JSON Import
  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importDataFromJSON(file);
    if (res.success) {
      await refreshProfile();
      alert('Data cadangan berhasil dipulihkan!');
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="page-content profile-page" id="profile-page">
      <header className="profile-header animate-fade-in-up">
        <h2>Profil & Pengaturan</h2>
      </header>

      {saved && (
        <div className="profile-saved animate-scale-in">
          ✓ Tersimpan!
        </div>
      )}

      {/* Pregnancy summary card */}
      <div className="profile-summary card animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <div className="profile-summary__row">
          <Baby size={18} color="var(--color-primary)" />
          <span>Usia Kehamilan</span>
          <strong>Minggu {pregnancyData?.currentWeek || '-'}</strong>
        </div>
        <div className="profile-summary__row">
          <span>📅</span>
          <span>HPHT</span>
          <strong>{formatDateID(profile.hpht)}</strong>
        </div>
        <div className="profile-summary__row">
          <span>🎯</span>
          <span>HPL (Perkiraan Lahir)</span>
          <strong>{formatDateID(calculateDueDate(profile.hpht))}</strong>
        </div>
        <div className="profile-summary__row">
          <span>⏳</span>
          <span>Sisa</span>
          <strong>{pregnancyData?.daysRemaining || '-'} hari</strong>
        </div>
      </div>

      {/* Quick Action: Bandar Lampung Hospital Directory */}
      <div
        className="profile-hosp-btn card animate-fade-in-up"
        style={{ animationDelay: '90ms' }}
        onClick={() => navigate('/hospitals')}
        role="button"
        tabIndex={0}
      >
        <div className="profile-hosp-btn__left">
          <div className="profile-hosp-icon">
            <Building2 size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)' }}>Faskes & RS Bandar Lampung</h4>
            <p className="text-secondary text-xs">RSIA Bunda, Belleza, RS Advent, RSUDAM & Call IGD</p>
          </div>
        </div>
        <ChevronRight size={18} color="var(--color-text-tertiary)" />
      </div>

      {/* Theme Switcher (Phase 3) */}
      <div className="profile-theme-card card animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        <div className="profile-theme-header">
          <span className="eyebrow">Tema Tampilan</span>
          <span className="text-xs text-secondary">Warm Night Mode</span>
        </div>
        <div className="profile-theme-options">
          {[
            { id: 'light', label: 'Terang', icon: Sun },
            { id: 'dark', label: 'Gelap', icon: Moon },
            { id: 'system', label: 'Sistem', icon: Monitor },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`profile-theme-btn ${isActive ? 'profile-theme-btn--active' : ''}`}
                onClick={() => handleThemeChange(t.id)}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit Sections */}
      <div className="profile-sections stagger-children" style={{ animationDelay: '150ms' }}>
        {/* Names */}
        <div className="profile-section card">
          <button className="profile-section__header" onClick={() => startEdit('names')}>
            <div className="profile-section__title">
              <User size={18} color="var(--color-text-secondary)" />
              <div>
                <span className="eyebrow">Nama</span>
                <p>👩 {profile.mamaName} &nbsp;&&nbsp; 👨 {profile.papaName}</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-tertiary)" />
          </button>
          {editing === 'names' && (
            <div className="profile-section__form animate-fade-in-up">
              <div className="input-group">
                <label>Nama Mama</label>
                <input
                  type="text"
                  className="input-field"
                  value={form.mamaName || ''}
                  onChange={(e) => setForm((f) => ({ ...f, mamaName: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Nama Papa</label>
                <input
                  type="text"
                  className="input-field"
                  value={form.papaName || ''}
                  onChange={(e) => setForm((f) => ({ ...f, papaName: e.target.value }))}
                />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleSave}>
                <Save size={16} /> Simpan
              </button>
            </div>
          )}
        </div>

        {/* HPHT */}
        <div className="profile-section card">
          <button className="profile-section__header" onClick={() => startEdit('hpht')}>
            <div className="profile-section__title">
              <span>📅</span>
              <div>
                <span className="eyebrow">HPHT</span>
                <p>{formatDateID(profile.hpht)}</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-tertiary)" />
          </button>
          {editing === 'hpht' && (
            <div className="profile-section__form animate-fade-in-up">
              <div className="input-group">
                <label>Tanggal HPHT</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.hpht || ''}
                  onChange={(e) => setForm((f) => ({ ...f, hpht: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleSave}>
                <Save size={16} /> Simpan
              </button>
            </div>
          )}
        </div>

        {/* Hospital */}
        <div className="profile-section card">
          <button className="profile-section__header" onClick={() => startEdit('hospital')}>
            <div className="profile-section__title">
              <Hospital size={18} color="var(--color-text-secondary)" />
              <div>
                <span className="eyebrow">Rumah Sakit & Dokter</span>
                <p>{profile.hospitalName || 'Belum diisi'}</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-tertiary)" />
          </button>
          {editing === 'hospital' && (
            <div className="profile-section__form animate-fade-in-up">
              <div className="input-group">
                <label>Nama Rumah Sakit / Klinik</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: RSIA Bunda"
                  value={form.hospitalName || ''}
                  onChange={(e) => setForm((f) => ({ ...f, hospitalName: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Alamat RS (opsional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: Jl. Teuku Umar No. 12"
                  value={form.hospitalAddress || ''}
                  onChange={(e) => setForm((f) => ({ ...f, hospitalAddress: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Nama Dokter (opsional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: dr. Rina, SpOG"
                  value={form.doctorName || ''}
                  onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))}
                />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleSave}>
                <Save size={16} /> Simpan
              </button>
            </div>
          )}
        </div>

        {/* Insurance */}
        <div className="profile-section card">
          <button className="profile-section__header" onClick={() => startEdit('insurance')}>
            <div className="profile-section__title">
              <Shield size={18} color="var(--color-text-secondary)" />
              <div>
                <span className="eyebrow">Asuransi Kesehatan</span>
                <p>{insuranceLabels[profile.insuranceType] || '-'}</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-tertiary)" />
          </button>
          {editing === 'insurance' && (
            <div className="profile-section__form animate-fade-in-up">
              <div className="profile-insurance-options">
                {Object.entries(insuranceLabels).map(([value, label]) => (
                  <button
                    key={value}
                    className={`profile-insurance-option ${form.insuranceType === value ? 'profile-insurance-option--active' : ''}`}
                    onClick={() => setForm((f) => ({ ...f, insuranceType: value }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary btn-full" onClick={handleSave}>
                <Save size={16} /> Simpan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Supabase Cloud Sync Card (Phase 3) */}
      <div className="profile-cloud-card card animate-fade-in-up" style={{ animationDelay: '180ms' }}>
        <button
          type="button"
          className="profile-cloud-header"
          onClick={() => setShowCloudConfig(!showCloudConfig)}
        >
          <div className="profile-cloud-title">
            <Cloud size={18} color="var(--color-secondary-dark)" />
            <div>
              <span className="eyebrow">Database Cloud Supabase</span>
              <p className="text-sm">
                {supabaseUrl ? 'Kredensial Terkonfigurasi' : 'Mode Penyimpanan Lokal'}
              </p>
            </div>
          </div>
          <ChevronRight
            size={18}
            color="var(--color-text-tertiary)"
            style={{ transform: showCloudConfig ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </button>

        {showCloudConfig && (
          <div className="profile-cloud-body animate-fade-in-up">
            <p className="text-xs text-secondary" style={{ marginBottom: '10px' }}>
              Sinkronkan data ke database Supabase Anda agar tersimpan aman di cloud. File skema SQL tersedia di <code>supabase_schema.sql</code>.
            </p>

            <div className="input-group">
              <label>Project URL Supabase</label>
              <input
                type="text"
                className="input-field"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginTop: '8px' }}>
              <label>Anon Public Key</label>
              <input
                type="password"
                className="input-field"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
              />
            </div>

            {cloudStatus && (
              <div
                className={`profile-cloud-status profile-cloud-status--${cloudStatus.type} animate-scale-in`}
              >
                {cloudStatus.type === 'success' ? (
                  <Check size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                <span>{cloudStatus.message}</span>
              </div>
            )}

            <div className="profile-cloud-actions">
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={handleTestConnection}
              >
                Tes Koneksi
              </button>
              <button
                type="button"
                className="btn btn-secondary text-xs"
                onClick={handleFetchFromCloud}
                disabled={isSyncing || !supabaseUrl}
              >
                Tarik Cloud
              </button>
              <button
                type="button"
                className="btn btn-primary text-xs"
                onClick={handleSyncToCloud}
                disabled={isSyncing || !supabaseUrl}
              >
                {isSyncing ? 'Menyinkronkan...' : 'Unggah ke Cloud'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Export & Medical Summary Card (Phase 3) */}
      <div className="profile-export-card card animate-fade-in-up" style={{ animationDelay: '210ms' }}>
        <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
          Ekspor & Cadangan Data
        </span>

        <button
          type="button"
          className="btn btn-secondary btn-full profile-export-action-btn"
          onClick={printMedicalSummary}
        >
          <Printer size={16} /> Cetak / PDF Ringkasan Medis
        </button>

        <div className="profile-backup-row">
          <button
            type="button"
            className="btn btn-ghost profile-backup-btn"
            onClick={exportDataToJSON}
          >
            <Download size={14} /> Cadangkan JSON
          </button>

          <label className="btn btn-ghost profile-backup-btn">
            <Upload size={14} /> Pulihkan JSON
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileImport}
            />
          </label>
        </div>
      </div>

      {/* Reset */}
      <div className="profile-reset animate-fade-in-up" style={{ animationDelay: '240ms' }}>
        {!showReset ? (
          <button className="btn btn-ghost" onClick={() => setShowReset(true)}>
            <RotateCcw size={16} /> Reset Semua Data
          </button>
        ) : (
          <div className="profile-reset__confirm card">
            <p className="text-sm"><strong>Yakin ingin reset?</strong> Semua data akan hilang.</p>
            <div className="profile-reset__actions">
              <button className="btn btn-ghost" onClick={() => setShowReset(false)}>Batal</button>
              <button className="btn btn-primary" style={{ background: 'var(--color-danger)' }} onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* App info */}
      <div className="profile-info animate-fade-in-up" style={{ animationDelay: '270ms' }}>
        <p className="text-xs text-tertiary" style={{ textAlign: 'center' }}>
          Bumil Ceria v1.0 • Dibuat dengan ❤️ di Bandar Lampung
        </p>
      </div>
    </div>
  );
}

export default Profile;
