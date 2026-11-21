import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Coins,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  PiggyBank,
  Check,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  LABOR_METHODS,
  HOSPITAL_CLASSES,
  INSURANCE_MODES,
  LAMPUNG_COST_ESTIMATES,
  HIDDEN_COSTS_CHECKLIST,
} from '../data/laborCostData';
import { getLaborBudget, saveLaborBudget } from '../utils/storage';
import './CostSimulator.css';

function CostSimulator() {
  const navigate = useNavigate();
  const { profile, pregnancyData } = useApp();

  const [method, setMethod] = useState('normal'); // 'normal' | 'eracs'
  const [insurance, setInsurance] = useState(profile?.insuranceType === 'mandiri' ? 'mandiri' : 'bpjs_full');
  const [hospitalClass, setHospitalClass] = useState('kelas2'); // 'kelas3' | 'kelas2' | 'kelas1' | 'vip'
  const [currentSavings, setCurrentSavings] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadBudget() {
      const b = await getLaborBudget();
      if (b.currentSavings) setCurrentSavings(b.currentSavings);
    }
    loadBudget();
  }, []);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const baselineCost = LAMPUNG_COST_ESTIMATES[method][hospitalClass] || { min: 5000000, max: 8000000, avg: 6500000 };

  let outOfPocketMin = baselineCost.min;
  let outOfPocketMax = baselineCost.max;
  let outOfPocketAvg = baselineCost.avg;

  if (insurance === 'bpjs_full') {
    outOfPocketMin = 0;
    outOfPocketMax = 0;
    outOfPocketAvg = 0;
  } else if (insurance === 'bpjs_upgrade') {
    outOfPocketMin = Math.round(baselineCost.min * 0.35);
    outOfPocketMax = Math.round(baselineCost.max * 0.45);
    outOfPocketAvg = Math.round(baselineCost.avg * 0.4);
  } else if (insurance === 'asuransi_swasta') {
    const cap = 12000000;
    outOfPocketMin = Math.max(0, baselineCost.min - cap);
    outOfPocketMax = Math.max(0, baselineCost.max - cap);
    outOfPocketAvg = Math.max(0, baselineCost.avg - cap);
  }

  const daysRemaining = pregnancyData?.daysRemaining || 180;
  const monthsRemaining = Math.max(1, Math.ceil(daysRemaining / 30));

  const totalTargetWithBuffer = outOfPocketAvg + 2000000;
  const remainingToSave = Math.max(0, totalTargetWithBuffer - currentSavings);
  const monthlySavingsTarget = Math.round(remainingToSave / monthsRemaining);
  const savingsProgressPct = totalTargetWithBuffer > 0 ? Math.min(100, Math.round((currentSavings / totalTargetWithBuffer) * 100)) : 100;

  const handleSaveBudget = async () => {
    await saveLaborBudget({ currentSavings });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="page-content cost-sim-page" id="cost-sim-page">
      {/* Header */}
      <header className="cs-header animate-fade-in-up">
        <button
          type="button"
          className="cs-back-btn"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          aria-label="Kembali"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div>
          <div className="cs-header-badge">
            <Coins size={14} aria-hidden="true" />
            <span>Perencanaan Keuangan</span>
          </div>
          <h1>Simulasi Biaya Persalinan</h1>
        </div>
      </header>

      {savedSuccess && (
        <div className="cs-saved-toast animate-scale-in" role="status">
          <Check size={16} aria-hidden="true" />
          <span>Data tabungan tersimpan.</span>
        </div>
      )}

      {/* 1. Choose Labor Method */}
      <section className="cs-section animate-fade-in-up" style={{ animationDelay: '40ms' }}>
        <h2 className="eyebrow cs-section-heading">
          1. Rencana Metode Persalinan
        </h2>
        <div className="cs-methods-grid">
          {LABOR_METHODS.map((m) => {
            const isSelected = method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={isSelected}
                className={`cs-method-card card ${isSelected ? 'cs-method-card--active' : ''}`}
                onClick={() => setMethod(m.id)}
              >
                <div className="cs-method-top">
                  <span className="cs-method-emoji" aria-hidden="true">{m.emoji}</span>
                  <strong>{m.shortName}</strong>
                </div>
                <p className="cs-method-sub">{m.stayDuration}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Choose Insurance Mode */}
      <section className="cs-section animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <h2 className="eyebrow cs-section-heading">
          2. Skema Penjaminan / Pembayaran
        </h2>
        <div className="cs-insurance-grid">
          {INSURANCE_MODES.map((ins) => {
            const isSelected = insurance === ins.id;
            return (
              <button
                key={ins.id}
                type="button"
                aria-pressed={isSelected}
                className={`cs-insurance-card card ${isSelected ? 'cs-insurance-card--active' : ''}`}
                onClick={() => setInsurance(ins.id)}
              >
                <div className="cs-ins-header">
                  <span aria-hidden="true">{ins.emoji}</span>
                  <strong>{ins.label}</strong>
                  <span className="cs-ins-badge">{ins.badge}</span>
                </div>
                <p className="cs-ins-desc">{ins.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Choose Room Class */}
      {insurance !== 'bpjs_full' && (
        <section className="cs-section animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <h2 className="eyebrow cs-section-heading">
            3. Pilihan Kelas Kamar Rawat Inap
          </h2>
          <div className="cs-classes-grid">
            {HOSPITAL_CLASSES.map((cls) => {
              const isSelected = hospitalClass === cls.id;
              return (
                <button
                  key={cls.id}
                  type="button"
                  aria-pressed={isSelected}
                  className={`cs-class-btn ${isSelected ? 'cs-class-btn--active' : ''}`}
                  onClick={() => setHospitalClass(cls.id)}
                >
                  <strong>{cls.label}</strong>
                  <span>{cls.desc}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Estimated Cost Summary Card */}
      <section className="cs-summary-card card animate-fade-in-up" style={{ animationDelay: '160ms' }}>
        <div className="cs-sum-header">
          <Coins size={16} color="var(--color-primary-dark)" aria-hidden="true" />
          <span>Perkiraan Biaya Persalinan di Bandar Lampung</span>
        </div>

        {insurance === 'bpjs_full' ? (
          <div className="cs-bpjs-zero-card">
            <ShieldCheck size={32} color="var(--color-secondary-dark)" aria-hidden="true" />
            <div>
              <h3>Rp 0 (Ditanggung BPJS 100%)</h3>
              <p className="text-xs text-secondary">
                Dengan rujukan berjenjang Faskes 1 ke RS rekanan, atau penanganan darurat CITO di IGD rumah sakit manapun di Bandar Lampung.
              </p>
            </div>
          </div>
        ) : (
          <div className="cs-sum-amount">
            <h3 className="cs-amount-main tabular-nums">
              {formatIDR(outOfPocketMin)} s/d {formatIDR(outOfPocketMax)}
            </h3>
            <p className="cs-amount-sub tabular-nums">
              Estimasi pengeluaran pribadi (rata-rata <strong>{formatIDR(outOfPocketAvg)}</strong>)
            </p>
          </div>
        )}

        <div className="cs-sum-note">
          <p className="text-xs text-secondary">
            Estimasi dirangkum dari rentang tarif umum RSIA Bunda, RSIA Belleza, RS Advent, dan RS Urip Sumoharjo di Bandar Lampung.
          </p>
        </div>
      </section>

      {/* 4. Monthly Savings Calculator */}
      <section className="cs-savings-card card animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="cs-savings-header">
          <PiggyBank size={20} color="var(--color-accent-dark)" aria-hidden="true" />
          <div>
            <h2>Kalkulator Tabungan Menuju HPL</h2>
            <p className="text-xs text-secondary tabular-nums">
              Sisa <strong>{daysRemaining} hari</strong> (~{monthsRemaining} bulan) menjelang perkiraan lahir
            </p>
          </div>
        </div>

        <div className="input-group" style={{ margin: '14px 0 10px 0' }}>
          <label htmlFor="cs-savings-input">Tabungan yang Sudah Disiapkan (Rp):</label>
          <div className="cs-savings-input-row">
            <input
              id="cs-savings-input"
              type="number"
              className="input-field cs-savings-input tabular-nums"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
              step="500000"
            />
            <button
              type="button"
              className="btn btn-primary cs-save-budget-btn"
              onClick={handleSaveBudget}
            >
              <Save size={16} aria-hidden="true" />
              <span>Simpan</span>
            </button>
          </div>
        </div>

        <div className="cs-progress-wrap">
          <div className="cs-progress-labels tabular-nums">
            <span>Terkumpul: <strong>{formatIDR(currentSavings)}</strong></span>
            <span>Target: <strong>{formatIDR(totalTargetWithBuffer)}</strong></span>
          </div>
          <div className="cs-savings-bar" role="progressbar" aria-valuenow={savingsProgressPct} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="cs-savings-bar-fill"
              style={{ width: `${savingsProgressPct}%` }}
            />
          </div>
        </div>

        <div className="cs-monthly-target-box">
          <TrendingUp size={20} color="var(--color-primary)" aria-hidden="true" />
          <div>
            <span className="cs-target-label">Target Tabungan per Bulan:</span>
            <h3 className="cs-target-amount tabular-nums">
              {remainingToSave === 0 ? 'Target Sudah Terpenuhi' : `${formatIDR(monthlySavingsTarget)} / bulan`}
            </h3>
            {remainingToSave > 0 && (
              <p className="text-xs text-secondary tabular-nums">
                Sisa dana yang perlu dicicil: {formatIDR(remainingToSave)} (termasuk dana cadangan darurat Rp 2jt).
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. Hidden Costs Checklist */}
      <section className="cs-hidden-costs animate-fade-in-up" style={{ animationDelay: '240ms' }}>
        <h2 className="cs-hc-title">
          <AlertCircle size={16} color="var(--color-warning)" aria-hidden="true" />
          <span>Biaya Tambahan yang Sering Terlewat</span>
        </h2>

        <div className="cs-hc-list stagger-children">
          {HIDDEN_COSTS_CHECKLIST.map((item) => (
            <div key={item.id} className="cs-hc-card card">
              <div className="cs-hc-top">
                <strong>{item.title}</strong>
                <span className="cs-hc-cost tabular-nums">~{formatIDR(item.estCost)}</span>
              </div>
              <p className="cs-hc-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CostSimulator;
