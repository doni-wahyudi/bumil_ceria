import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Apple,
  Droplets,
  Pill,
  ShieldAlert,
  HelpCircle,
  Heart,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import {
  BALANCED_PLATE,
  LOCAL_SUPERFOODS,
  MEDICAL_RESTRICTIONS,
  MYTHS_AND_FACTS,
} from '../data/nutritionData';
import { getDailyLog, updateDailyLog } from '../utils/storage';
import './NutritionGuide.css';

const PORTION_TEXT_COLORS = [
  'var(--color-accent-dark)',
  'var(--color-secondary-dark)',
  'var(--color-primary-dark)',
  'var(--color-papa-dark)',
];

function NutritionGuide() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plate'); // 'plate' | 'superfoods' | 'restrictions' | 'myths'
  const [expandedMyth, setExpandedMyth] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const [dailyWater, setDailyWater] = useState(0);
  const [tookVitamin, setTookVitamin] = useState(false);

  useEffect(() => {
    async function loadDaily() {
      const data = await getDailyLog(todayStr);
      setDailyWater(data.waterGlasses || 0);
      setTookVitamin(!!data.tookVitamin);
    }
    loadDaily();
  }, [todayStr]);

  const handleWaterChange = async (delta) => {
    const newVal = Math.max(0, Math.min(12, dailyWater + delta));
    setDailyWater(newVal);
    await updateDailyLog(todayStr, { waterGlasses: newVal });
  };

  const handleToggleVitamin = async () => {
    const newVal = !tookVitamin;
    setTookVitamin(newVal);
    await updateDailyLog(todayStr, { tookVitamin: newVal });
  };

  const toggleMyth = (id) => {
    setExpandedMyth((prev) => (prev === id ? null : id));
  };

  return (
    <div className="page-content nutrition-page" id="nutrition-page">
      {/* Header */}
      <header className="ng-header animate-fade-in-up">
        <button
          type="button"
          className="ng-back-btn"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          aria-label="Kembali"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div>
          <div className="ng-header-badge">
            <Apple size={14} aria-hidden="true" />
            <span>Gizi &amp; Kesehatan Hamil</span>
          </div>
          <h1>Nutrisi &amp; Mitos</h1>
        </div>
      </header>

      {/* Daily Tracker Banner */}
      <section className="ng-tracker-card card animate-fade-in-up" style={{ animationDelay: '40ms' }} aria-label="Target harian">
        <div className="ng-tracker-title">
          <Heart size={15} color="var(--color-primary)" aria-hidden="true" />
          <span>Target Sehat Hari Ini</span>
        </div>

        <div className="ng-tracker-grid">
          {/* Water intake */}
          <div className="ng-tracker-item">
            <div className="ng-water-header">
              <Droplets size={16} color="var(--color-secondary)" aria-hidden="true" />
              <span>Minum Air</span>
              <strong className="tabular-nums">{dailyWater} / 8 gelas</strong>
            </div>
            <div className="ng-water-controls">
              <button
                type="button"
                className="ng-counter-btn"
                onClick={() => handleWaterChange(-1)}
                disabled={dailyWater <= 0}
                aria-label="Kurangi 1 gelas air"
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <div className="ng-water-bar" role="progressbar" aria-valuenow={dailyWater} aria-valuemin={0} aria-valuemax={8}>
                <div
                  className="ng-water-fill"
                  style={{ width: `${Math.min(100, (dailyWater / 8) * 100)}%` }}
                />
              </div>
              <button
                type="button"
                className="ng-counter-btn"
                onClick={() => handleWaterChange(1)}
                disabled={dailyWater >= 12}
                aria-label="Tambah 1 gelas air"
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Vitamin */}
          <button
            type="button"
            className={`ng-tracker-item ng-vitamin-box ${tookVitamin ? 'ng-vitamin-box--done' : ''}`}
            onClick={handleToggleVitamin}
            aria-pressed={tookVitamin}
          >
            <div className="ng-vitamin-content">
              <Pill size={18} color={tookVitamin ? 'var(--color-secondary-dark)' : 'var(--color-primary)'} aria-hidden="true" />
              <div>
                <span className="ng-vitamin-label">Suplemen Harian</span>
                <p className="ng-vitamin-sub">
                  {tookVitamin ? 'Sudah diminum hari ini' : 'Asam folat, zat besi, kalsium'}
                </p>
              </div>
            </div>
            <span
              className={`ng-vitamin-check ${tookVitamin ? 'ng-vitamin-check--checked' : ''}`}
              aria-hidden="true"
            >
              {tookVitamin && <Check size={14} strokeWidth={3} />}
            </span>
          </button>
        </div>
      </section>

      {/* Tabs */}
      <nav className="ng-tabs animate-fade-in-up" style={{ animationDelay: '80ms' }} aria-label="Kategori informasi gizi">
        {[
          { id: 'plate', label: 'Isi Piringku', emoji: '🍽️' },
          { id: 'superfoods', label: 'Superfood', emoji: '🥑' },
          { id: 'restrictions', label: 'Pantangan', emoji: '🚫' },
          { id: 'myths', label: 'Mitos vs Fakta', emoji: '🔍' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={activeTab === tab.id}
            className={`ng-tab-btn ${activeTab === tab.id ? 'ng-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span aria-hidden="true">{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* --- TAB 1: ISI PIRINGKU --- */}
      {activeTab === 'plate' && (
        <section className="ng-section animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <div className="card ng-plate-intro">
            <h2>{BALANCED_PLATE.title}</h2>
            <p className="text-secondary text-xs">{BALANCED_PLATE.description}</p>
          </div>

          <div className="ng-plate-portions stagger-children">
            {BALANCED_PLATE.portions.map((portion, idx) => (
              <div key={idx} className="ng-portion-card card">
                <div className="ng-portion-header">
                  <span className="ng-portion-emoji" aria-hidden="true">{portion.emoji}</span>
                  <div>
                    <span className="ng-portion-fraction tabular-nums" style={{ color: PORTION_TEXT_COLORS[idx % PORTION_TEXT_COLORS.length] }}>
                      {portion.fraction}
                    </span>
                    <h3 className="ng-portion-title">{portion.label}</h3>
                  </div>
                </div>
                <div className="ng-portion-body">
                  <p className="ng-portion-examples">
                    <strong>Contoh:</strong> {portion.examples}
                  </p>
                  <p className="ng-portion-tips">{portion.tips}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- TAB 2: LOCAL SUPERFOODS --- */}
      {activeTab === 'superfoods' && (
        <section className="ng-section animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <div className="ng-superfoods-grid stagger-children">
            {LOCAL_SUPERFOODS.map((food) => (
              <div key={food.id} className="ng-superfood-card card">
                <div className="ng-sf-header">
                  <span className="ng-sf-emoji" aria-hidden="true">{food.emoji}</span>
                  <div>
                    <h2 className="ng-sf-title">{food.name}</h2>
                    <span className="ng-sf-badge">{food.badge}</span>
                  </div>
                </div>
                <p className="ng-sf-desc">{food.desc}</p>
                <div className="ng-sf-benefit">
                  <strong>Khasiat Janin:</strong> {food.benefit}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- TAB 3: PANTANGAN MEDIS --- */}
      {activeTab === 'restrictions' && (
        <section className="ng-section animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <div className="ng-warning-banner card">
            <ShieldAlert size={18} color="var(--color-danger)" aria-hidden="true" />
            <p className="text-xs">
              Pantangan berikut berdasarkan alasan <strong>keamanan medis</strong> untuk melindungi janin dari infeksi bakteri, parasit, atau zat berbahaya.
            </p>
          </div>

          <div className="ng-restrictions-list stagger-children">
            {MEDICAL_RESTRICTIONS.map((res) => (
              <div key={res.id} className="ng-res-card card">
                <div className="ng-res-header">
                  <span className="ng-res-emoji" aria-hidden="true">{res.emoji}</span>
                  <div>
                    <span className="ng-res-risk">{res.riskLevel}</span>
                    <h2 className="ng-res-title">{res.title}</h2>
                  </div>
                </div>
                <div className="ng-res-danger">
                  <span className="ng-danger-label">Risiko:</span> {res.danger}
                </div>
                <div className="ng-res-guide">
                  <span className="ng-guide-label">Saran Medis:</span> {res.guide}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- TAB 4: MITOS VS FAKTA --- */}
      {activeTab === 'myths' && (
        <section className="ng-section animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <div className="ng-myths-list stagger-children">
            {MYTHS_AND_FACTS.map((item) => {
              const isExpanded = expandedMyth === item.id;
              return (
                <div
                  key={item.id}
                  className={`ng-myth-card card ${isExpanded ? 'ng-myth-card--open' : ''}`}
                >
                  <button
                    type="button"
                    className="ng-myth-toggle"
                    onClick={() => toggleMyth(item.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="ng-myth-tag-row">
                      <span className="ng-myth-tag">{item.tag}</span>
                      <span className="ng-verdict-badge">{item.verdict}</span>
                    </div>
                    <div className="ng-myth-question-row">
                      <HelpCircle size={18} color="var(--color-primary)" className="ng-myth-q-icon" aria-hidden="true" />
                      <h2 className="ng-myth-q-text">{item.myth}</h2>
                      {isExpanded ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="ng-myth-answer animate-fade-in-up">
                      <div className="ng-fact-box">
                        <span className="ng-fact-label">Penjelasan Medis:</span>
                        <p>{item.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default NutritionGuide;
