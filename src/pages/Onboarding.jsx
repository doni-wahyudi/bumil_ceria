import { useState } from 'react';
import { Heart, Calendar, Shield, ChevronRight, Baby } from 'lucide-react';
import { saveProfile, setOnboardingDone } from '../utils/storage';
import { useApp } from '../App';
import './Onboarding.css';

const insuranceOptions = [
  { value: 'bpjs', label: 'BPJS Kesehatan', desc: 'Asuransi kesehatan pemerintah', emoji: '🏥' },
  { value: 'asuransi_kerja', label: 'Asuransi dari Kantor', desc: 'Asuransi dari tempat kerja', emoji: '🏢' },
  { value: 'mandiri', label: 'Bayar Mandiri', desc: 'Bayar sendiri tanpa asuransi', emoji: '💳' },
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
        <div className="onboarding__progress">
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
              <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Bumil Ceria" style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover', boxShadow: '0 8px 24px rgba(255,107,138,0.3)' }} />
            </div>
            <h1 className="onboarding__title">Bumil Ceria</h1>
            <p className="onboarding__subtitle">
              Perjalanan Indah Bersama — Panduan kehamilan minggu demi minggu untuk Mama &amp; Papa
            </p>
          </div>

          <div className="onboarding__features stagger-children">
            <div className="onboarding__feature">
              <div className="onboarding__feature-icon" style={{ background: 'var(--color-mama-light)' }}>
                <Calendar size={20} color="var(--color-mama)" />
              </div>
              <div>
                <h4>Timeline Mingguan</h4>
                <p>Perkembangan bayi & tips setiap minggu</p>
              </div>
            </div>
            <div className="onboarding__feature">
              <div className="onboarding__feature-icon" style={{ background: 'var(--color-accent-light)' }}>
                <Shield size={20} color="var(--color-accent-dark)" />
              </div>
              <div>
                <h4>Jadwal USG</h4>
                <p>Pengingat pemeriksaan penting</p>
              </div>
            </div>
            <div className="onboarding__feature">
              <div className="onboarding__feature-icon" style={{ background: 'var(--color-success-light)' }}>
                <Heart size={20} color="var(--color-success)" />
              </div>
              <div>
                <h4>Checklist Mama & Papa</h4>
                <p>Tugas terpisah agar tidak overwhelmed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Names */}
      {step === 1 && (
        <div className="onboarding__step animate-fade-in-up">
          <div className="onboarding__step-header">
            <span className="onboarding__step-emoji">👋</span>
            <h2>Hai, salam kenal!</h2>
            <p className="text-secondary">Siapa nama kalian berdua?</p>
          </div>

          <div className="onboarding__form">
            <div className="input-group">
              <label htmlFor="mama-name">Nama Mama</label>
              <input
                id="mama-name"
                type="text"
                className={`input-field ${errors.mamaName ? 'input-field--error' : ''}`}
                placeholder="Contoh: Rina"
                value={form.mamaName}
                onChange={(e) => handleChange('mamaName', e.target.value)}
                autoFocus
              />
              {errors.mamaName && <span className="input-error">{errors.mamaName}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="papa-name">Nama Papa</label>
              <input
                id="papa-name"
                type="text"
                className={`input-field ${errors.papaName ? 'input-field--error' : ''}`}
                placeholder="Contoh: Andi"
                value={form.papaName}
                onChange={(e) => handleChange('papaName', e.target.value)}
              />
              {errors.papaName && <span className="input-error">{errors.papaName}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: HPHT */}
      {step === 2 && (
        <div className="onboarding__step animate-fade-in-up">
          <div className="onboarding__step-header">
            <span className="onboarding__step-emoji">📅</span>
            <h2>Kapan HPHT-nya?</h2>
            <p className="text-secondary">
              HPHT = Hari Pertama Haid Terakhir. Ini digunakan untuk menghitung usia kehamilan dan perkiraan lahir.
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
              {errors.hpht && <span className="input-error">{errors.hpht}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Insurance */}
      {step === 3 && (
        <div className="onboarding__step animate-fade-in-up">
          <div className="onboarding__step-header">
            <span className="onboarding__step-emoji">🏥</span>
            <h2>Jenis asuransi kesehatan</h2>
            <p className="text-secondary">
              Ini membantu kami menyesuaikan informasi biaya dan prosedur.
            </p>
          </div>

          <div className="onboarding__options">
            {insuranceOptions.map((opt) => (
              <button
                key={opt.value}
                className={`onboarding__option ${form.insuranceType === opt.value ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleChange('insuranceType', opt.value)}
              >
                <span className="onboarding__option-emoji">{opt.emoji}</span>
                <div className="onboarding__option-text">
                  <strong>{opt.label}</strong>
                  <span>{opt.desc}</span>
                </div>
                {form.insuranceType === opt.value && (
                  <div className="onboarding__option-check">✓</div>
                )}
              </button>
            ))}
            {errors.insuranceType && <span className="input-error">{errors.insuranceType}</span>}
          </div>
        </div>
      )}

      {/* Bottom action */}
      <div className="onboarding__actions">
        {step > 0 && (
          <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
            Kembali
          </button>
        )}
        <button className="btn btn-primary btn-full" onClick={handleNext}>
          {step === 0 ? 'Mulai' : step === 3 ? 'Selesai 🎉' : 'Lanjut'}
          {step < 3 && <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
