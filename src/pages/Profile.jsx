import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  updateProfile,
  resetAllData,
  syncLocalToSupabase,
  fetchSupabaseToLocal,
} from '../utils/storage';
import { isSupabaseConfigured } from '../utils/supabaseClient';
import {
  printMedicalSummary,
  exportDataToJSON,
  importDataFromJSON,
} from '../utils/exportData';
import { formatDateID, calculateDueDate } from '../utils/pregnancyCalc';
import { calculateBMI } from '../utils/bmiTracker';
import {
  Save,
  RotateCcw,
  Hospital,
  User,
  Baby,
  Shield,
  Scale,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Printer,
  Download,
  Upload,
  Building2,
  LogOut,
  Cloud,
  Check,
  AlertCircle,
  Calendar,
  Target,
  Clock,
} from 'lucide-react';
import './Profile.css';

const insuranceLabels = {
  bpjs: 'BPJS Kesehatan',
  asuransi_kerja: 'Asuransi dari Kantor',
  mandiri: 'Bayar Mandiri',
};

function Profile() {
  const navigate = useNavigate();
  const { profile, refreshProfile, pregnancyData, handleLogout, session } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cloudStatus, setCloudStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem('bumpbuddy_theme') || 'system');

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
    if (editing === section) {
      setEditing(null);
      return;
    }
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
    } else if (section === 'bodyStats') {
      setForm({
        heightCm: profile.heightCm || '',
        prePregnancyWeight: profile.prePregnancyWeight || '',
      });
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

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
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

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importDataFromJSON(file);
    if (res.success) {
      await refreshProfile();
      setCloudStatus({ type: 'success', message: res.message });
      setTimeout(() => window.location.reload(), 800);
    } else {
      setCloudStatus({ type: 'error', message: res.message });
    }
  };

  const isGuestSession = !!session?.isGuest;
  const canCloudSync = isSupabaseConfigured && !isGuestSession;

  return (
    <div className="page-content profile-page" id="profile-page">
      <header className="profile-header animate-fade-in-up">
        <h1>Profil &amp; Pengaturan</h1>
      </header>

      {saved && (
        <div className="profile-saved animate-scale-in" role="status">
          Perubahan tersimpan
        </div>
      )}

      {/* Pregnancy summary card */}
      <section className="profile-summary card animate-fade-in-up" style={{ animationDelay: '40ms' }} aria-label="Ringkasan usia kehamilan">
        <div className="profile-summary__row">
          <Baby size={18} color="var(--color-primary)" aria-hidden="true" />
          <span>Usia Kehamilan</span>
          <strong className="tabular-nums">Minggu {pregnancyData?.currentWeek || '-'}</strong>
        </div>
        <div className="profile-summary__row">
          <Calendar size={18} color="var(--color-secondary-dark)" aria-hidden="true" />
          <span>HPHT</span>
          <strong className="tabular-nums">{formatDateID(profile.hpht)}</strong>
        </div>
        <div className="profile-summary__row">
          <Target size={18} color="var(--color-accent-dark)" aria-hidden="true" />
          <span>HPL (Perkiraan Lahir)</span>
          <strong className="tabular-nums">{formatDateID(calculateDueDate(profile.hpht))}</strong>
        </div>
        <div className="profile-summary__row">
          <Clock size={18} color="var(--color-papa)" aria-hidden="true" />
          <span>Sisa Hari</span>
          <strong className="tabular-nums">{pregnancyData?.daysRemaining || '-'} hari</strong>
        </div>
      </section>

      {/* Quick Action: Bandar Lampung Hospital Directory */}
      <button
        type="button"
        className="profile-hosp-btn card animate-fade-in-up"
        style={{ animationDelay: '60ms' }}
        onClick={() => navigate('/hospitals')}
      >
        <div className="profile-hosp-btn__left">
          <div className="profile-hosp-icon">
            <Building2 size={20} color="var(--color-primary)" aria-hidden="true" />
          </div>
          <div>
            <h2>Faskes &amp; RS Bandar Lampung</h2>
            <p className="text-secondary text-xs">RSIA Bunda, Belleza, RS Advent, RSUDAM &amp; Telepon IGD</p>
          </div>
        </div>
        <ChevronRight size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
      </button>

      {/* Theme Switcher */}
      <section className="profile-theme-card card animate-fade-in-up" style={{ animationDelay: '80ms' }} aria-label="Pengaturan tema">
        <div className="profile-theme-header">
          <h2 className="eyebrow">Tema Tampilan</h2>
          <span className="text-xs text-secondary">Terang &amp; Warm Night</span>
        </div>
        <div className="profile-theme-options" role="group" aria-label="Pilih tema warna">
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
                aria-pressed={isActive}
                className={`profile-theme-btn ${isActive ? 'profile-theme-btn--active' : ''}`}
                onClick={() => handleThemeChange(t.id)}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Edit Sections */}
      <div className="profile-sections stagger-children" style={{ animationDelay: '100ms' }}>
        {/* Names */}
        <div className="profile-section card">
          <button
            type="button"
            className="profile-section__header"
            onClick={() => startEdit('names')}
            aria-expanded={editing === 'names'}
          >
            <div className="profile-section__title">
              <User size={18} color="var(--color-text-secondary)" aria-hidden="true" />
              <div>
                <span className="eyebrow">Nama Orang Tua</span>
                <p>{profile.mamaName} &amp; {profile.papaName}</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
          </button>
          {editing === 'names' && (
            <div className="profile-section__form animate-fade-in-up">
              <div className="input-group">
                <label htmlFor="profile-mama-name">Nama Mama</label>
                <input
                  id="profile-mama-name"
                  type="text"
                  className="input-field"
                  value={form.mamaName || ''}
                  onChange={(e) => setForm((f) => ({ ...f, mamaName: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label htmlFor="profile-papa-name">Nama Papa</label>
                <input
                  id="profile-papa-name"
                  type="text"
                  className="input-field"
                  value={form.papaName || ''}
                  onChange={(e) => setForm((f) => ({ ...f, papaName: e.target.value }))}
                />
              </div>
              <button type="button" className="btn btn-primary btn-full" onClick={handleSave}>
                <Save size={16} aria-hidden="true" />
                <span>Simpan</span>
              </button>
            </div>
          )}
        </div>

        {/* HPHT */}
        <div className="profile-section card">
          <button
            type="button"
            className="profile-section__header"
            onClick={() => startEdit('hpht')}
            aria-expanded={editing === 'hpht'}
          >
            <div className="profile-section__title">
              <Calendar size={18} color="var(--color-text-secondary)" aria-hidden="true" />
              <div>
                <span className="eyebrow">HPHT</span>
                <p className="tabular-nums">{formatDateID(profile.hpht)}</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
          </button>
          {editing === 'hpht' && (
            <div className="profile-section__form animate-fade-in-up">
              <div className="input-group">
                <label htmlFor="profile-hpht">Tanggal HPHT</label>
                <input
                  id="profile-hpht"
                  type="date"
                  className="input-field"
                  value={form.hpht || ''}
                  onChange={(e) => setForm((f) => ({ ...f, hpht: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <button type="button" className="btn btn-primary btn-full" onClick={handleSave}>
                <Save size={16} aria-hidden="true" />
                <span>Simpan</span>
              </button>
            </div>
          )}
        </div>

        {/* Physical Baseline & BMI */}
        <div className="profile-section card">
          <button
            type="button"
            className="profile-section__header"
            onClick={() => startEdit('bodyStats')}
            aria-expanded={editing === 'bodyStats'}
          >
            <div className="profile-section__title">
              <Scale size={18} color="var(--color-text-secondary)" aria-hidden="true" />
              <div>
                <span className="eyebrow">Fisik &amp; IMT Pra-Hamil</span>
                <p className="tabular-nums">
                  {profile.heightCm && profile.prePregnancyWeight
                    ? `TB ${profile.heightCm} cm · BB ${profile.prePregnancyWeight} kg (IMT ${calculateBMI(profile.prePregnancyWeight, profile.heightCm)})`
                    : 'Belum diisi (Ketuk untuk atur)'}
                </p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
          </button>
          {editing === 'bodyStats' && (
            <div className="profile-section__form animate-fade-in-up">
              <div className="input-group">
                <label htmlFor="profile-height-cm">Tinggi Badan Ibu (cm)</label>
                <input
                  id="profile-height-cm"
                  type="number"
                  step="0.5"
                  className="input-field"
                  placeholder="Contoh: 158"
                  value={form.heightCm || ''}
                  onChange={(e) => setForm((f) => ({ ...f, heightCm: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label htmlFor="profile-pre-weight">Berat Badan Sebelum Hamil (kg)</label>
                <input
                  id="profile-pre-weight"
                  type="number"
                  step="0.1"
                  className="input-field"
                  placeholder="Contoh: 52.0"
                  value={form.prePregnancyWeight || ''}
                  onChange={(e) => setForm((f) => ({ ...f, prePregnancyWeight: e.target.value }))}
                />
              </div>
              <button type="button" className="btn btn-primary btn-full" onClick={handleSave}>
                <Save size={16} aria-hidden="true" />
                <span>Simpan</span>
              </button>
            </div>
          )}
        </div>

        {/* Hospital */}
        <div className="profile-section card">
          <button
            type="button"
            className="profile-section__header"
            onClick={() => startEdit('hospital')}
            aria-expanded={editing === 'hospital'}
          >
            <div className="profile-section__title">
              <Hospital size={18} color="var(--color-text-secondary)" aria-hidden="true" />
              <div>
                <span className="eyebrow">Rumah Sakit &amp; Dokter</span>
                <p>{profile.hospitalName || 'Belum diisi'}</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
          </button>
          {editing === 'hospital' && (
            <div className="profile-section__form animate-fade-in-up">
              <div className="input-group">
                <label htmlFor="profile-hosp-name">Nama Rumah Sakit / Klinik</label>
                <input
                  id="profile-hosp-name"
                  type="text"
                  className="input-field"
                  placeholder="Contoh: RSIA Bunda"
                  value={form.hospitalName || ''}
                  onChange={(e) => setForm((f) => ({ ...f, hospitalName: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label htmlFor="profile-hosp-addr">Alamat RS (opsional)</label>
                <input
                  id="profile-hosp-addr"
                  type="text"
                  className="input-field"
                  placeholder="Contoh: Jl. Teuku Umar No. 12"
                  value={form.hospitalAddress || ''}
                  onChange={(e) => setForm((f) => ({ ...f, hospitalAddress: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label htmlFor="profile-doctor-name">Nama Dokter (opsional)</label>
                <input
                  id="profile-doctor-name"
                  type="text"
                  className="input-field"
                  placeholder="Contoh: dr. Rina, SpOG"
                  value={form.doctorName || ''}
                  onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))}
                />
              </div>
              <button type="button" className="btn btn-primary btn-full" onClick={handleSave}>
                <Save size={16} aria-hidden="true" />
                <span>Simpan</span>
              </button>
            </div>
          )}
        </div>

        {/* Insurance */}
        <div className="profile-section card">
          <button
            type="button"
            className="profile-section__header"
            onClick={() => startEdit('insurance')}
            aria-expanded={editing === 'insurance'}
          >
            <div className="profile-section__title">
              <Shield size={18} color="var(--color-text-secondary)" aria-hidden="true" />
              <div>
                <span className="eyebrow">Asuransi Kesehatan</span>
                <p>{insuranceLabels[profile.insuranceType] || '-'}</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
          </button>
          {editing === 'insurance' && (
            <div className="profile-section__form animate-fade-in-up">
              <div className="profile-insurance-options">
                {Object.entries(insuranceLabels).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={form.insuranceType === value}
                    className={`profile-insurance-option ${form.insuranceType === value ? 'profile-insurance-option--active' : ''}`}
                    onClick={() => setForm((f) => ({ ...f, insuranceType: value }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button type="button" className="btn btn-primary btn-full" onClick={handleSave}>
                <Save size={16} aria-hidden="true" />
                <span>Simpan</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cloud Sync Card */}
      <section className="profile-cloud-card card animate-fade-in-up" style={{ animationDelay: '140ms' }} aria-label="Sinkronisasi Cloud">
        <div className="profile-cloud-title" style={{ marginBottom: '10px' }}>
          <Cloud size={18} color="var(--color-secondary-dark)" aria-hidden="true" />
          <div>
            <h2 className="eyebrow">Sinkronisasi Cloud</h2>
            <p className="text-xs text-secondary">
              {canCloudSync
                ? 'Terhubung ke database Supabase akun Anda'
                : isGuestSession
                  ? 'Mode Tamu aktif: data tersimpan aman secara lokal di perangkat ini'
                  : 'Koneksi Supabase tidak aktif pada pratinjau lokal'}
            </p>
          </div>
        </div>

        {cloudStatus && (
          <div
            className={`profile-cloud-status profile-cloud-status--${cloudStatus.type} animate-scale-in`}
            role={cloudStatus.type === 'error' ? 'alert' : 'status'}
          >
            {cloudStatus.type === 'error' ? <AlertCircle size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}
            <span>{cloudStatus.message}</span>
          </div>
        )}

        <div className="profile-cloud-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleFetchFromCloud}
            disabled={isSyncing || !isSupabaseConfigured}
          >
            {isSyncing ? 'Memuat...' : 'Tarik Cloud'}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSyncToCloud}
            disabled={isSyncing || !isSupabaseConfigured}
          >
            {isSyncing ? 'Menyinkronkan...' : 'Unggah ke Cloud'}
          </button>
        </div>
      </section>

      {/* Export & Medical Summary Card */}
      <section className="profile-export-card card animate-fade-in-up" style={{ animationDelay: '160ms' }} aria-label="Ekspor dan cadangan data">
        <h2 className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
          Ekspor &amp; Cadangan Data
        </h2>

        <button
          type="button"
          className="btn btn-secondary btn-full profile-export-action-btn"
          onClick={printMedicalSummary}
        >
          <Printer size={16} aria-hidden="true" />
          <span>Cetak / PDF Ringkasan Medis</span>
        </button>

        <div className="profile-backup-row">
          <button
            type="button"
            className="btn btn-ghost profile-backup-btn"
            onClick={exportDataToJSON}
          >
            <Download size={14} aria-hidden="true" />
            <span>Cadangkan JSON</span>
          </button>

          <label className="btn btn-ghost profile-backup-btn" htmlFor="profile-json-import">
            <Upload size={14} aria-hidden="true" />
            <span>Pulihkan JSON</span>
            <input
              id="profile-json-import"
              type="file"
              accept=".json"
              className="sr-only"
              onChange={handleFileImport}
            />
          </label>
        </div>
      </section>

      {/* Reset */}
      <div className="profile-reset animate-fade-in-up" style={{ animationDelay: '180ms' }}>
        {!showReset ? (
          <button type="button" className="btn btn-ghost" onClick={() => setShowReset(true)}>
            <RotateCcw size={16} aria-hidden="true" />
            <span>Reset Semua Data</span>
          </button>
        ) : (
          <div className="profile-reset__confirm card">
            <p className="text-sm"><strong>Yakin ingin reset?</strong> Semua data lokal akan dihapus.</p>
            <div className="profile-reset__actions">
              <button type="button" className="btn btn-ghost" onClick={() => setShowReset(false)}>Batal</button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: 'var(--color-danger)', color: 'var(--color-text-inverse)' }}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="profile-reset animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ color: 'var(--color-danger)', gap: '6px' }}
          onClick={handleLogout}
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Keluar dari Akun</span>
        </button>
      </div>

      {/* App info */}
      <div className="profile-info animate-fade-in-up" style={{ animationDelay: '220ms' }}>
        <p className="text-xs text-tertiary" style={{ textAlign: 'center' }}>
          Bumil Ceria v1.0 · Bandar Lampung
        </p>
      </div>
    </div>
  );
}

export default Profile;
