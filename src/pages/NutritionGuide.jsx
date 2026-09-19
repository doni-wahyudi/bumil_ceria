import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Apple,
  Droplets,
  Pill,
  ShieldAlert,
  HelpCircle,
  Sparkles,
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

function NutritionGuide() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plate'); // 'plate' | 'superfoods' | 'restrictions' | 'myths'
  const [expandedMyth, setExpandedMyth] = useState(null);

  // Daily tracker state
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
        <button className="ng-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="ng-header-badge">
            <Apple size={14} /> Gizi & Kesehatan Hamil
          </div>
          <h2>Nutrisi & Mitos</h2>
        </div>
      </header>

      {/* Daily Tracker Banner */}
      <section className="ng-tracker-card card animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <div className="ng-tracker-title">
          <Sparkles size={16} color="var(--color-primary)" />
          <span>Target Sehat Hari Ini</span>
        </div>

        <div className="ng-tracker-grid">
          {/* Water intake */}
          <div className="ng-tracker-item">
            <div className="ng-water-header">
              <Droplets size={16} color="var(--color-secondary)" />
              <span>Minum Air</span>
              <strong>{dailyWater} / 8 gelas</strong>
            </div>
            <div className="ng-water-controls">
              <button
                type="button"
                className="ng-counter-btn"
                onClick={() => handleWaterChange(-1)}
                disabled={dailyWater <= 0}
              >
                <Minus size={14} />
              </button>
              <div className="ng-water-bar">
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
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Vitamin */}
          <div
            className={`ng-tracker-item ng-vitamin-box ${tookVitamin ? 'ng-vitamin-box--done' : ''}`}
            onClick={handleToggleVitamin}
            role="button"
            tabIndex={0}
          >
            <div className="ng-vitamin-content">
              <Pill size={18} color={tookVitamin ? 'var(--color-secondary)' : 'var(--color-primary)'} />
              <div>
                <span className="ng-vitamin-label">Suplemen Harian</span>
                <p className="ng-vitamin-sub">
                  {tookVitamin ? 'Sudah diminum hari ini ✓' : 'Asam folat / zat besi / kalsium'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className={`ng-vitamin-check ${tookVitamin ? 'ng-vitamin-check--checked' : ''}`}
              aria-label="Tandai minum vitamin"
            >
              {tookVitamin && <Check size={14} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="ng-tabs animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        {[
          { id: 'plate', label: 'Isi Piringku', emoji: '🍽️' },
          { id: 'superfoods', label: 'Superfood', emoji: '🥑' },
          { id: 'restrictions', label: 'Pantangan', emoji: '🚫' },
          { id: 'myths', label: 'Mitos vs Fakta', emoji: '🔍' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`ng-tab-btn ${activeTab === tab.id ? 'ng-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* --- TAB 1: ISI PIRINGKU --- */}
      {activeTab === 'plate' && (
        <div className="ng-section animate-fade-in-up" style={{ animationDelay: '180ms' }}>
          <div className="card ng-plate-intro">
            <h4>{BALANCED_PLATE.title}</h4>
            <p className="text-secondary text-xs">{BALANCED_PLATE.description}</p>
          </div>

          <div className="ng-plate-portions stagger-children">
            {BALANCED_PLATE.portions.map((portion, idx) => (
              <div key={idx} className="ng-portion-card card">
                <div className="ng-portion-header">
                  <span className="ng-portion-emoji">{portion.emoji}</span>
                  <div>
                    <span className="ng-portion-fraction" style={{ color: portion.color }}>
                      {portion.fraction}
                    </span>
                    <h4 className="ng-portion-title">{portion.label}</h4>
                  </div>
                </div>
                <div className="ng-portion-body">
                  <p className="ng-portion-examples">
                    <strong>Contoh:</strong> {portion.examples}
                  </p>
                  <p className="ng-portion-tips">💡 {portion.tips}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: LOCAL SUPERFOODS --- */}
      {activeTab === 'superfoods' && (
        <div className="ng-section animate-fade-in-up" style={{ animationDelay: '180ms' }}>
          <div className="ng-superfoods-grid stagger-children">
            {LOCAL_SUPERFOODS.map((food) => (
              <div key={food.id} className="ng-superfood-card card">
                <div className="ng-sf-header">
                  <span className="ng-sf-emoji">{food.emoji}</span>
                  <div>
                    <h4 className="ng-sf-title">{food.name}</h4>
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
        </div>
      )}

      {/* --- TAB 3: PANTANGAN MEDIS --- */}
      {activeTab === 'restrictions' && (
        <div className="ng-section animate-fade-in-up" style={{ animationDelay: '180ms' }}>
          <div className="ng-warning-banner card">
            <ShieldAlert size={18} color="var(--color-danger)" />
            <p className="text-xs">
              Pantangan berikut murni berdasarkan alasan <strong>keamanan medis</strong> untuk melindungi janin dari infeksi bakteri, parasit, atau zat berbahaya.
            </p>
          </div>

          <div className="ng-restrictions-list stagger-children">
            {MEDICAL_RESTRICTIONS.map((res) => (
              <div key={res.id} className="ng-res-card card">
                <div className="ng-res-header">
                  <span className="ng-res-emoji">{res.emoji}</span>
                  <div>
                    <span className="ng-res-risk">{res.riskLevel}</span>
                    <h4 className="ng-res-title">{res.title}</h4>
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
        </div>
      )}

      {/* --- TAB 4: MITOS VS FAKTA --- */}
      {activeTab === 'myths' && (
        <div className="ng-section animate-fade-in-up" style={{ animationDelay: '180ms' }}>
          <div className="ng-myths-list stagger-children">
            {MYTHS_AND_FACTS.map((item) => {
              const isExpanded = expandedMyth === item.id;
              return (
                <div
                  key={item.id}
                  className={`ng-myth-card card ${isExpanded ? 'ng-myth-card--open' : ''}`}
                  onClick={() => toggleMyth(item.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="ng-myth-top">
                    <div className="ng-myth-tag-row">
                      <span className="ng-myth-tag">{item.tag}</span>
                      <span className="ng-verdict-badge">{item.verdict}</span>
                    </div>
                    <div className="ng-myth-question-row">
                      <HelpCircle size={18} color="var(--color-primary)" className="ng-myth-q-icon" />
                      <h4 className="ng-myth-q-text">{item.myth}</h4>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

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
        </div>
      )}
    </div>
  );
}

export default NutritionGuide;
