import { useState } from 'react';
import { Heart, Calendar, Shield, ChevronRight, Building2, CreditCard } from 'lucide-react';
import { saveProfile, setOnboardingDone } from '../utils/storage';
import { useApp } from '../context/AppContext';
import './Onboarding.css';

const insuranceOptions = [
  { value: 'bpjs', label: 'BPJS Kesehatan', desc: 'Asuransi kesehatan pemerintah', icon: Shield },
  { value: 'asuransi_kerja', label: 'Asuransi dari Kantor', desc: 'Asuransi dari tempat kerja', icon: Building2 },
  { value: 'mandiri', label: 'Bayar Mandiri', desc: 'Bayar sendiri tanpa asuransi', icon: CreditCard },
];

function Onboarding() {
  const { refreshProfile, setOnboarded } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    mamaName: '',
    papaName: '',
    hpht: '',
    insuranceType: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!form.mamaName.trim()) newErrors.mamaName = 'Nama Mama wajib diisi';
      if (!form.papaName.trim()) newErrors.papaName = 'Nama Papa wajib diisi';
    }
    if (step === 2) {
      if (!form.hpht) newErrors.hpht = 'Tanggal HPHT wajib diisi';
      else {
        const hphtDate = new Date(form.hpht);
        const today = new Date();
        if (hphtDate > today) newErrors.hpht = 'HPHT tidak boleh di masa depan';
        const diffWeeks = Math.floor((today - hphtDate) / (7 * 24 * 60 * 60 * 1000));
        if (diffWeeks > 42) newErrors.hpht = 'Tanggal HPHT terlalu lama';
      }
    }
    if (step === 3) {
      if (!form.insuranceType) newErrors.insuranceType = 'Pilih jenis asuransi';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    if (!validateStep()) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    await saveProfile({
      mamaName: form.mamaName.trim(),
      papaName: form.papaName.trim(),
      hpht: form.hpht,
      insuranceType: form.insuranceType,
      hospitalName: '',
      hospitalAddress: '',
      doctorName: '',
    });
    await setOnboardingDone();
    await refreshProfile();
    setOnboarded(true);
  };

  return (
    <div className="onboarding" id="onboarding-page">
      {/* Progress dots */}
      {step > 0 && (
        <div className="onboarding__progress" aria-label={`Langkah ${step} dari 3`}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`onboarding__dot ${step >= s ? 'onboarding__dot--active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Step 0: Welcome */}
      {step === 0 && (
        <div className="onboarding__step onboarding__welcome animate-fade-in-up">
          <div className="onboarding__hero">
            <div className="onboarding__hero-icon">
              <img
                src={`${import.meta.env.BASE_URL}logo.jpg`}
                alt="Logo Bumil Ceria"
                width={80}
                height={80}
                fetchPriority="high"
                className="onboarding__hero-img"
              />
            </div>
            <h1 className="onboarding__title">Bumil Ceria</h1>
            <p className="onboarding__subtitle">
              Perjalanan Indah Bersama: Panduan kehamilan minggu demi minggu untuk Mama dan Papa.
            </p>
          </div>

          <div className="onboarding__features stagger-children">
            <div className="onboarding__feature">
              <div className="onboarding__feature-icon" style={{ background: 'var(--color-mama-light)', color: 'var(--color-mama-dark)' }}>
                <Calendar size={20} aria-hidden="true" />
              </div>
              <div>
                <h2>Timeline Mingguan</h2>
                <p>Perkembangan bayi dan tips terarah setiap minggu</p>
              </div>
            </div>
            <div className="onboarding__feature">
              <div className="onboarding__feature-icon" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-dark)' }}>
                <Shield size={20} aria-hidden="true" />
              </div>
              <div>
                <h2>Jadwal USG</h2>
                <p>Pengingat pemeriksaan penting sesuai usia kehamilan</p>
              </div>
            </div>
            <div className="onboarding__feature">
              <div className="onboarding__feature-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                <Heart size={20} aria-hidden="true" />
              </div>
              <div>
                <h2>Checklist Mama &amp; Papa</h2>
                <p>Tugas terpisah agar persiapan lebih tenang dan terarah</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Names */}
      {step === 1 && (
        <div className="onboarding__step animate-fade-in-up">
          <div className="onboarding__step-header">
            <div className="onboarding__step-icon" style={{ background: 'var(--color-mama-light)', color: 'var(--color-mama-dark)' }}>
              <Heart size={24} aria-hidden="true" />
            </div>
            <h1>Hai, salam kenal!</h1>
            <p className="text-secondary">Siapa nama kalian berdua?</p>
          </div>

          <div className="onboarding__form">
            <div className="input-group">
              <label htmlFor="mama-name">Nama Mama</label>
              <input
                id="mama-name"
                type="text"
                className={`input-field ${errors.mamaName ? 'input-field--error' : ''}`}
                placeholder="Nama panggilan Mama"
                value={form.mamaName}
                onChange={(e) => handleChange('mamaName', e.target.value)}
              />
              {errors.mamaName && <span className="input-error" role="alert">{errors.mamaName}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="papa-name">Nama Papa</label>
              <input
                id="papa-name"
                type="text"
                className={`input-field ${errors.papaName ? 'input-field--error' : ''}`}
                placeholder="Nama panggilan Papa"
                value={form.papaName}
                onChange={(e) => handleChange('papaName', e.target.value)}
              />
              {errors.papaName && <span className="input-error" role="alert">{errors.papaName}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: HPHT */}
      {step === 2 && (
        <div className="onboarding__step animate-fade-in-up">
          <div className="onboarding__step-header">
            <div className="onboarding__step-icon" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary-dark)' }}>
              <Calendar size={24} aria-hidden="true" />
            </div>
            <h1>Kapan HPHT-nya?</h1>
            <p className="text-secondary">
              HPHT (Hari Pertama Haid Terakhir) digunakan untuk menghitung usia kehamilan dan perkiraan lahir.
            </p>
          </div>

          <div className="onboarding__form">
            <div className="input-group">
              <label htmlFor="hpht-date">Tanggal HPHT</label>
              <input
                id="hpht-date"
                type="date"
                className={`input-field ${errors.hpht ? 'input-field--error' : ''}`}
                value={form.hpht}
                onChange={(e) => handleChange('hpht', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.hpht && <span className="input-error" role="alert">{errors.hpht}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Insurance */}
      {step === 3 && (
        <div className="onboarding__step animate-fade-in-up">
          <div className="onboarding__step-header">
            <div className="onboarding__step-icon" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-dark)' }}>
              <Shield size={24} aria-hidden="true" />
            </div>
            <h1>Jenis asuransi kesehatan</h1>
            <p className="text-secondary">
              Membantu menyesuaikan informasi simulasi biaya dan prosedur rumah sakit.
            </p>
          </div>

          <div className="onboarding__options">
            {insuranceOptions.map((opt) => {
              const Icon = opt.icon;
              const selected = form.insuranceType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selected}
                  className={`onboarding__option ${selected ? 'onboarding__option--selected' : ''}`}
                  onClick={() => handleChange('insuranceType', opt.value)}
                >
                  <span className="onboarding__option-icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="onboarding__option-text">
                    <strong>{opt.label}</strong>
                    <span>{opt.desc}</span>
                  </div>
                  {selected && (
                    <div className="onboarding__option-check" aria-hidden="true">✓</div>
                  )}
                </button>
              );
            })}
            {errors.insuranceType && <span className="input-error" role="alert">{errors.insuranceType}</span>}
          </div>
        </div>
      )}

      {/* Bottom action */}
      <div className="onboarding__actions">
        {step > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
            Kembali
          </button>
        )}
        <button type="button" className="btn btn-primary btn-full" onClick={handleNext}>
          <span>{step === 0 ? 'Mulai Perjalanan' : step === 3 ? 'Simpan & Masuk Beranda' : 'Lanjut'}</span>
          {step < 3 && <ChevronRight size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
