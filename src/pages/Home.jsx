import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarClock,
  ListChecks,
  ChevronRight,
  Luggage,
  Stethoscope,
  Apple,
  Calculator,
  Building2,
  Activity,
  Coins,
  Headphones,
} from 'lucide-react';
import { useApp } from '../App';
import { getCompletedItems } from '../utils/storage';
import { formatDateID } from '../utils/pregnancyCalc';
import { getWeekData, getWeekChecklist } from '../data/weeklyData';
import { getNextUSG } from '../data/usgSchedule';
import ProgressRing from '../components/ProgressRing';
import RoleToggle from '../components/RoleToggle';
import ChecklistItem from '../components/ChecklistItem';
import { toggleChecklistItem } from '../utils/storage';
import './Home.css';

function Home() {
  const { profile, role, pregnancyData, openAudioModal } = useApp();
  const navigate = useNavigate();
  const [completedItems, setCompletedItems] = useState([]);
  const weekData = pregnancyData ? getWeekData(pregnancyData.currentWeek) : null;
  const nextUSG = pregnancyData ? getNextUSG(pregnancyData.currentWeek) : null;

  useEffect(() => {
    getCompletedItems().then(setCompletedItems);
  }, []);

  const handleToggle = async (id) => {
    await toggleChecklistItem(id);
    const updated = await getCompletedItems();
    setCompletedItems(updated);
  };

  if (!profile || !pregnancyData) return null;

  const displayName = role === 'mama' ? profile.mamaName : profile.papaName;
  const weekChecklist = getWeekChecklist(pregnancyData.currentWeek, role);
  const incompleteThisWeek = weekChecklist.filter((item) => !completedItems.includes(item.id));

  return (
    <div className="page-content home-page" id="home-page">
      {/* Header */}
      <header className="home-header animate-fade-in-up">
        <div className="home-header__greeting">
          <h1 className="home-header__title">
            Hai, {displayName}! <span className="home-header__wave">👋</span>
          </h1>
          <p className="home-header__subtitle text-secondary">
            {pregnancyData.trimester.label} • {pregnancyData.daysRemaining} hari lagi
          </p>
        </div>
        <RoleToggle />
      </header>

      {/* Progress Card */}
      <section className="home-progress card animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <div className="home-progress__top">
          <ProgressRing
            progress={pregnancyData.progress}
            week={pregnancyData.currentWeek}
          />
          <div className="home-progress__info">
            <div className="home-progress__stat">
              <span className="home-progress__stat-label">HPL</span>
              <span className="home-progress__stat-value">{formatDateID(pregnancyData.dueDate)}</span>
            </div>
            <div className="home-progress__stat">
              <span className="home-progress__stat-label">Ukuran Bayi</span>
              <span className="home-progress__stat-value">
                {weekData?.babySizeEmoji} {weekData?.babySize}
              </span>
            </div>
          </div>
        </div>
        {weekData && (
          <p className="home-progress__dev">
            {weekData.babyDevelopment}
          </p>
        )}
      </section>

      {/* Quick Actions Grid (Phase 2) */}
      <section className="home-quick-actions animate-fade-in-up" style={{ animationDelay: '90ms' }}>
        <div
          className="home-qa-card card"
          onClick={() => navigate('/hospital-bag')}
          role="button"
          tabIndex={0}
        >
          <div className="home-qa-icon-wrap home-qa-icon--pink">
            <Luggage size={20} />
          </div>
          <div className="home-qa-info">
            <span className="home-qa-title">Tas Bersalin</span>
            <span className="home-qa-sub">Perlengkapan RS</span>
          </div>
        </div>

        <div
          className="home-qa-card card"
          onClick={() => navigate('/doctor-notes')}
          role="button"
          tabIndex={0}
        >
          <div className="home-qa-icon-wrap home-qa-icon--teal">
            <Stethoscope size={20} />
          </div>
          <div className="home-qa-info">
            <span className="home-qa-title">Catatan Kontrol</span>
            <span className="home-qa-sub">Tensi & Tanya Dokter</span>
          </div>
        </div>

        <div
          className="home-qa-card card"
          onClick={() => navigate('/nutrition')}
          role="button"
          tabIndex={0}
        >
          <div className="home-qa-icon-wrap home-qa-icon--honey">
            <Apple size={20} />
          </div>
          <div className="home-qa-info">
            <span className="home-qa-title">Nutrisi & Mitos</span>
            <span className="home-qa-sub">Isi Piring & Fakta</span>
          </div>
        </div>

        <div
          className="home-qa-card card"
          onClick={() => navigate('/calculator')}
          role="button"
          tabIndex={0}
        >
          <div className="home-qa-icon-wrap home-qa-icon--blue">
            <Calculator size={20} />
          </div>
          <div className="home-qa-info">
            <span className="home-qa-title">Kalkulator HPL</span>
            <span className="home-qa-sub">Hitung Usia & HPL</span>
          </div>
        </div>

        <div
          className="home-qa-card card"
          onClick={() => navigate('/labor-tools')}
          role="button"
          tabIndex={0}
        >
          <div className="home-qa-icon-wrap home-qa-icon--coral">
            <Activity size={20} />
          </div>
          <div className="home-qa-info">
            <span className="home-qa-title">Alat Persalinan</span>
            <span className="home-qa-sub">Tendangan & Kontraksi</span>
          </div>
        </div>

        <div
          className="home-qa-card card"
          onClick={() => navigate('/cost-simulator')}
          role="button"
          tabIndex={0}
        >
          <div className="home-qa-icon-wrap home-qa-icon--gold">
            <Coins size={20} />
          </div>
          <div className="home-qa-info">
            <span className="home-qa-title">Simulasi Biaya</span>
            <span className="home-qa-sub">Dana Lahiran Lampung</span>
          </div>
        </div>
      </section>

      {/* USG Reminder */}
      {nextUSG && (
        <section
          className="home-usg card animate-fade-in-up"
          style={{ animationDelay: '120ms' }}
          onClick={() => navigate('/timeline')}
          role="button"
          tabIndex={0}
        >
          <div className="home-usg__header">
            <CalendarClock size={20} color="var(--color-accent-dark)" />
            <span className="eyebrow" style={{ color: 'var(--color-accent-dark)' }}>USG Berikutnya</span>
          </div>
          <div className="home-usg__content">
            <div>
              <h4>{nextUSG.title}</h4>
              <p className="text-secondary text-sm">{nextUSG.weekLabel}</p>
            </div>
            <ChevronRight size={20} color="var(--color-text-tertiary)" />
          </div>
        </section>
      )}

      {/* Bandar Lampung Hospital Banner (Phase 3) */}
      <section
        className="home-hosp-banner card animate-fade-in-up"
        style={{ animationDelay: '140ms' }}
        onClick={() => navigate('/hospitals')}
        role="button"
        tabIndex={0}
      >
        <div className="home-hosp-banner__icon">
          <Building2 size={20} color="var(--color-primary)" />
        </div>
        <div className="home-hosp-banner__content">
          <h4>Faskes & RS Bandar Lampung</h4>
          <p className="text-secondary text-xs">
            {profile.hospitalName ? `Faskes Pilihan: ${profile.hospitalName}` : 'RSIA Bunda, Belleza, RS Advent, RSUDAM • Call IGD'}
          </p>
        </div>
        <ChevronRight size={18} color="var(--color-text-tertiary)" />
      </section>

      {/* Audio Relaxation Banner (Phase 5) */}
      <section
        className="home-hosp-banner home-audio-banner card animate-fade-in-up"
        style={{ animationDelay: '160ms' }}
        onClick={openAudioModal}
        role="button"
        tabIndex={0}
      >
        <div className="home-hosp-banner__icon" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
          <Headphones size={20} />
        </div>
        <div className="home-hosp-banner__content">
          <h4>Audio Relaksasi & Meditasi</h4>
          <p className="text-secondary text-xs">
            Denyut rahim alami, deburan ombak & panduan pernapasan 4-7-8
          </p>
        </div>
        <ChevronRight size={18} color="var(--color-text-tertiary)" />
      </section>

      {/* This Week's Checklist */}
      <section className="section animate-fade-in-up" style={{ animationDelay: '180ms' }}>
        <div className="section-header">
          <h3 className="section-title">
            <ListChecks size={20} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Minggu Ini
          </h3>
          <button className="btn btn-ghost text-sm" onClick={() => navigate('/checklist')}>
            Semua <ChevronRight size={16} />
          </button>
        </div>

        {incompleteThisWeek.length === 0 && weekChecklist.length > 0 ? (
          <div className="home-empty-state card">
            <span className="home-empty-state__emoji">🎉</span>
            <p>Semua tugas minggu ini sudah selesai!</p>
          </div>
        ) : incompleteThisWeek.length === 0 ? (
          <div className="home-empty-state card">
            <span className="home-empty-state__emoji">📋</span>
            <p>Tidak ada tugas khusus minggu ini. Tetap semangat!</p>
          </div>
        ) : (
          <div className="home-checklist stagger-children">
            {incompleteThisWeek.slice(0, 4).map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                isCompleted={completedItems.includes(item.id)}
                onToggle={handleToggle}
              />
            ))}
            {incompleteThisWeek.length > 4 && (
              <button className="btn btn-secondary btn-full" onClick={() => navigate('/checklist')}>
                +{incompleteThisWeek.length - 4} tugas lainnya
              </button>
            )}
          </div>
        )}
      </section>

      {/* Tips */}
      {weekData && (
        <section className="section animate-fade-in-up" style={{ animationDelay: '240ms' }}>
          <div className="section-header">
            <h3 className="section-title">
              {role === 'mama' ? '💡' : '💪'} Tips Minggu Ini
            </h3>
          </div>
          <div className="card home-tips-card">
            <p>{role === 'mama' ? weekData.mamaTips : (weekData.papaTips || weekData.mamaTips)}</p>
            {role === 'mama' && weekData.mamaSymptoms && (
              <div className="home-tips-symptoms">
                <span className="eyebrow">Yang Mungkin Dirasakan</span>
                <p className="text-sm text-secondary">{weekData.mamaSymptoms}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
