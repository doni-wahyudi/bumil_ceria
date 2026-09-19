import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calculator,
  Calendar,
  Sparkles,
  Check,
  Baby,
  Clock,
  Heart,
  Save,
} from 'lucide-react';
import { useApp } from '../App';
import { updateProfile } from '../utils/storage';
import { formatDateID } from '../utils/pregnancyCalc';
import './PregnancyCalc.css';

function PregnancyCalc() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useApp();

  const [calcMethod, setCalcMethod] = useState('hpht'); // 'hpht' | 'usg'
  const [hphtDate, setHphtDate] = useState(profile?.hpht || new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState(28); // 21 - 35 days

  // USG method inputs
  const [usgDate, setUsgDate] = useState(new Date().toISOString().split('T')[0]);
  const [usgWeeks, setUsgWeeks] = useState(8);
  const [usgDays, setUsgDays] = useState(0);

  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Calculation logic
  let calculatedDueDate = null;
  let calculatedHpht = null;
  let currentGestationalDays = 0;
  let estimatedConception = null;
  let trimester2Date = null;
  let trimester3Date = null;
  let fullTermStartDate = null;
  let fullTermEndDate = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (calcMethod === 'hpht' && hphtDate) {
    const hpht = new Date(hphtDate);
    hpht.setHours(0, 0, 0, 0);
    calculatedHpht = hphtDate;

    // Adjusted Naegele rule: 280 days + (cycleLength - 28)
    const cycleAdjustment = (Number(cycleLength) || 28) - 28;
    const dueTime = hpht.getTime() + (280 + cycleAdjustment) * 24 * 60 * 60 * 1000;
    calculatedDueDate = new Date(dueTime);

    // Current days
    currentGestationalDays = Math.floor((today - hpht) / (24 * 60 * 60 * 1000));

    // Conception date: HPHT + (cycleLength - 14) days
    const conceptionTime = hpht.getTime() + (Number(cycleLength) - 14) * 24 * 60 * 60 * 1000;
    estimatedConception = new Date(conceptionTime);

    // Trimester milestones
    trimester2Date = new Date(hpht.getTime() + 14 * 7 * 24 * 60 * 60 * 1000);
    trimester3Date = new Date(hpht.getTime() + 28 * 7 * 24 * 60 * 60 * 1000);
    fullTermStartDate = new Date(hpht.getTime() + 37 * 7 * 24 * 60 * 60 * 1000);
    fullTermEndDate = new Date(hpht.getTime() + 42 * 7 * 24 * 60 * 60 * 1000);
  } else if (calcMethod === 'usg' && usgDate) {
    const uDate = new Date(usgDate);
    uDate.setHours(0, 0, 0, 0);
    const totalUsgDays = Number(usgWeeks) * 7 + Number(usgDays);

    // Equivalent HPHT = usgDate - totalUsgDays
    const equivHphtTime = uDate.getTime() - totalUsgDays * 24 * 60 * 60 * 1000;
    const equivHpht = new Date(equivHphtTime);
    calculatedHpht = equivHpht.toISOString().split('T')[0];

    // Due Date = equivHpht + 280 days
    calculatedDueDate = new Date(equivHphtTime + 280 * 24 * 60 * 60 * 1000);

    // Current days
    currentGestationalDays = Math.floor((today - equivHpht) / (24 * 60 * 60 * 1000));

    // Conception
    estimatedConception = new Date(equivHphtTime + 14 * 24 * 60 * 60 * 1000);

    // Milestones
    trimester2Date = new Date(equivHphtTime + 14 * 7 * 24 * 60 * 60 * 1000);
    trimester3Date = new Date(equivHphtTime + 28 * 7 * 24 * 60 * 60 * 1000);
    fullTermStartDate = new Date(equivHphtTime + 37 * 7 * 24 * 60 * 60 * 1000);
    fullTermEndDate = new Date(equivHphtTime + 42 * 7 * 24 * 60 * 60 * 1000);
  }

  const currentWeeks = Math.max(1, Math.min(42, Math.floor(currentGestationalDays / 7)));
  const currentRemainingDays = Math.max(0, currentGestationalDays % 7);

  // Save to profile
  const handleApplyToProfile = async () => {
    if (!calculatedHpht) return;
    await updateProfile({ hpht: calculatedHpht });
    await refreshProfile();
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 2500);
  };

  return (
    <div className="page-content calc-page" id="calc-page">
      {/* Header */}
      <header className="calc-header animate-fade-in-up">
        <button className="calc-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="calc-header-badge">
            <Calculator size={14} /> Alat Medis
          </div>
          <h2>Kalkulator HPL & Usia Janin</h2>
        </div>
      </header>

      {appliedSuccess && (
        <div className="calc-alert-success animate-scale-in">
          <Check size={16} /> Berhasil disimpan ke profil Bumil Ceria Anda!
        </div>
      )}

      {/* Method Switcher */}
      <div className="calc-methods animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <button
          className={`calc-method-btn ${calcMethod === 'hpht' ? 'calc-method-btn--active' : ''}`}
          onClick={() => setCalcMethod('hpht')}
        >
          <Calendar size={16} />
          <span>Dari HPHT (Haid Terakhir)</span>
        </button>
        <button
          className={`calc-method-btn ${calcMethod === 'usg' ? 'calc-method-btn--active' : ''}`}
          onClick={() => setCalcMethod('usg')}
        >
          <Baby size={16} />
          <span>Dari Hasil USG T1</span>
        </button>
      </div>

      {/* Input Form Card */}
      <section className="calc-input-card card animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        {calcMethod === 'hpht' ? (
          <div>
            <div className="input-group">
              <label>Hari Pertama Haid Terakhir (HPHT)</label>
              <input
                type="date"
                className="input-field"
                value={hphtDate}
                onChange={(e) => setHphtDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="input-group" style={{ marginTop: '12px' }}>
              <div className="calc-cycle-label">
                <label>Panjang Rata-rata Siklus Haid</label>
                <span className="calc-cycle-value">{cycleLength} hari</span>
              </div>
              <input
                type="range"
                min="21"
                max="35"
                step="1"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="calc-slider-hints">
                <span>Pendek (21 hari)</span>
                <span>Standar (28 hari)</span>
                <span>Panjang (35 hari)</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="input-group">
              <label>Tanggal Pemeriksaan USG</label>
              <input
                type="date"
                className="input-field"
                value={usgDate}
                onChange={(e) => setUsgDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="calc-usg-row" style={{ marginTop: '12px' }}>
              <div className="input-group">
                <label>Usia Janin Saat USG (Minggu)</label>
                <input
                  type="number"
                  min="4"
                  max="14"
                  className="input-field"
                  value={usgWeeks}
                  onChange={(e) => setUsgWeeks(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>+ Hari</label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  className="input-field"
                  value={usgDays}
                  onChange={(e) => setUsgDays(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-secondary" style={{ marginTop: '8px' }}>
              💡 USG Trimester 1 (usia 8–12 minggu) berdasarkan panjang CRL adalah metode paling akurat untuk menentukan HPL.
            </p>
          </div>
        )}
      </section>

      {/* Calculation Results Card */}
      {calculatedDueDate && (
        <section className="calc-results-section animate-fade-in-up" style={{ animationDelay: '180ms' }}>
          <div className="calc-hpl-card card">
            <div className="calc-hpl-badge">
              <Sparkles size={14} /> Hari Perkiraan Lahir (HPL)
            </div>
            <h3 className="calc-hpl-date">{formatDateID(calculatedDueDate)}</h3>
            <p className="calc-hpl-sub">
              Usia Kehamilan Saat Ini: <strong>{currentWeeks} Minggu {currentRemainingDays} Hari</strong>
            </p>

            <button
              type="button"
              className="btn btn-primary btn-full calc-apply-btn"
              onClick={handleApplyToProfile}
            >
              <Save size={16} /> Terapkan ke Profil Saya
            </button>
          </div>

          {/* Timeline Milestones Table */}
          <div className="calc-milestones card">
            <h4 className="calc-milestones-title">
              <Clock size={16} color="var(--color-secondary-dark)" />
              <span>Milestone Penting Kehamilan</span>
            </h4>

            <div className="calc-milestone-rows">
              {estimatedConception && (
                <div className="calc-milestone-row">
                  <div className="calc-ms-label">
                    <Heart size={14} color="var(--color-primary)" />
                    <span>Perkiraan Konsepsi (Pembuahan)</span>
                  </div>
                  <strong>{formatDateID(estimatedConception)}</strong>
                </div>
              )}

              {trimester2Date && (
                <div className="calc-milestone-row">
                  <div className="calc-ms-label">
                    <span>🌱 Masuk Trimester 2 (Minggu 14)</span>
                  </div>
                  <strong>{formatDateID(trimester2Date)}</strong>
                </div>
              )}

              {trimester3Date && (
                <div className="calc-milestone-row">
                  <div className="calc-ms-label">
                    <span>🌟 Masuk Trimester 3 (Minggu 28)</span>
                  </div>
                  <strong>{formatDateID(trimester3Date)}</strong>
                </div>
              )}

              {fullTermStartDate && fullTermEndDate && (
                <div className="calc-milestone-row calc-ms-aterm">
                  <div className="calc-ms-label">
                    <span>👶 Rentang Siap Lahir (Aterm 37–42 Minggu)</span>
                  </div>
                  <strong>
                    {formatDateID(fullTermStartDate)} — {formatDateID(fullTermEndDate)}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default PregnancyCalc;
