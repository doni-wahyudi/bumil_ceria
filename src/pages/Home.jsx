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
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCompletedItems, toggleChecklistItem } from '../utils/storage';
import { formatDateID } from '../utils/pregnancyCalc';
import { getWeekData, getWeekChecklist } from '../data/weeklyData';
import { getNextUSG } from '../data/usgSchedule';
import ProgressRing from '../components/ProgressRing';
import RoleToggle from '../components/RoleToggle';
import ChecklistItem from '../components/ChecklistItem';
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
            Hai, {displayName}
          </h1>
          <p className="home-header__subtitle text-secondary tabular-nums">
            {pregnancyData.trimester.label} · {pregnancyData.daysRemaining} hari menuju HPL
          </p>
        </div>
        <RoleToggle />
      </header>

      {/* Progress Hero Card */}
      <section className="home-progress card animate-fade-in-up" style={{ animationDelay: '40ms' }} aria-label="Ringkasan kehamilan">
        <div className="home-progress__top">
          <ProgressRing
            progress={pregnancyData.progress}
            week={pregnancyData.currentWeek}
          />
          <div className="home-progress__info">
            <div className="home-progress__stat">
              <span className="home-progress__stat-label">HPL</span>
              <span className="home-progress__stat-value tabular-nums">{formatDateID(pregnancyData.dueDate)}</span>
            </div>
            <div className="home-progress__stat">
              <span className="home-progress__stat-label">Ukuran Janin</span>
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

      {/* Quick Actions Grid */}
      <section className="home-quick-actions-wrap animate-fade-in-up" style={{ animationDelay: '80ms' }} aria-labelledby="home-qa-heading">
        <h2 id="home-qa-heading" className="sr-only">Menu Akses Cepat</h2>
        <div className="home-quick-actions">
          <button
            type="button"
            className="home-qa-card card"
            onClick={() => navigate('/hospital-bag')}
          >
            <div className="home-qa-icon-wrap home-qa-icon--pink">
              <Luggage size={20} aria-hidden="true" />
            </div>
            <div className="home-qa-info">
              <span className="home-qa-title">Tas Bersalin</span>
              <span className="home-qa-sub">Perlengkapan RS</span>
            </div>
          </button>

          <button
            type="button"
            className="home-qa-card card"
            onClick={() => navigate('/doctor-notes')}
          >
            <div className="home-qa-icon-wrap home-qa-icon--teal">
              <Stethoscope size={20} aria-hidden="true" />
            </div>
            <div className="home-qa-info">
              <span className="home-qa-title">Catatan &amp; USG</span>
              <span className="home-qa-sub">Biometri &amp; Tensi</span>
            </div>
          </button>

          <button
            type="button"
            className="home-qa-card card"
            onClick={() => navigate('/nutrition')}
          >
            <div className="home-qa-icon-wrap home-qa-icon--honey">
              <Apple size={20} aria-hidden="true" />
            </div>
            <div className="home-qa-info">
              <span className="home-qa-title">Nutrisi &amp; Mitos</span>
              <span className="home-qa-sub">Porsi &amp; Fakta Medis</span>
            </div>
          </button>

          <button
            type="button"
            className="home-qa-card card"
            onClick={() => navigate('/calculator')}
          >
            <div className="home-qa-icon-wrap home-qa-icon--blue">
              <Calculator size={20} aria-hidden="true" />
            </div>
            <div className="home-qa-info">
              <span className="home-qa-title">Kalkulator HPL</span>
              <span className="home-qa-sub">Hitung Usia &amp; HPL</span>
            </div>
          </button>

          <button
            type="button"
            className="home-qa-card card"
            onClick={() => navigate('/labor-tools')}
          >
            <div className="home-qa-icon-wrap home-qa-icon--coral">
              <Activity size={20} aria-hidden="true" />
            </div>
            <div className="home-qa-info">
              <span className="home-qa-title">Alat Persalinan</span>
              <span className="home-qa-sub">Gerak &amp; Kontraksi</span>
            </div>
          </button>

          <button
            type="button"
            className="home-qa-card card"
            onClick={() => navigate('/cost-simulator')}
          >
            <div className="home-qa-icon-wrap home-qa-icon--gold">
              <Coins size={20} aria-hidden="true" />
            </div>
            <div className="home-qa-info">
              <span className="home-qa-title">Simulasi Biaya</span>
              <span className="home-qa-sub">Estimasi &amp; Tabungan</span>
            </div>
          </button>
        </div>
      </section>

      {/* USG Reminder */}
      {nextUSG && (
        <section className="animate-fade-in-up" style={{ animationDelay: '120ms' }} aria-label="Jadwal USG Berikutnya">
          <button
            type="button"
            className="home-usg card"
            onClick={() => navigate('/usg-tracker')}
          >
            <div className="home-usg__header">
              <CalendarClock size={18} color="var(--color-accent-dark)" aria-hidden="true" />
              <span className="eyebrow" style={{ color: 'var(--color-accent-dark)' }}>USG Berikutnya</span>
            </div>
            <div className="home-usg__content">
              <div>
                <h2 className="home-usg__title">{nextUSG.title}</h2>
                <p className="text-secondary text-sm">{nextUSG.weekLabel} · Ketuk untuk catat hasil</p>
              </div>
              <ChevronRight size={20} color="var(--color-text-tertiary)" aria-hidden="true" />
            </div>
          </button>
        </section>
      )}

      {/* Bandar Lampung Hospital Banner */}
      <section className="animate-fade-in-up" style={{ animationDelay: '140ms' }} aria-label="Faskes Bandar Lampung">
        <button
          type="button"
          className="home-hosp-banner card"
          onClick={() => navigate('/hospitals')}
        >
          <div className="home-hosp-banner__icon">
            <Building2 size={20} color="var(--color-primary)" aria-hidden="true" />
          </div>
          <div className="home-hosp-banner__content">
            <h2>Faskes &amp; RS Bandar Lampung</h2>
            <p className="text-secondary text-xs">
              {profile.hospitalName ? `Faskes Pilihan: ${profile.hospitalName}` : 'RSIA Bunda, Belleza, RS Advent, RSUDAM · Telepon IGD'}
            </p>
          </div>
          <ChevronRight size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
        </button>
      </section>

      {/* Audio Relaxation Banner */}
      <section className="animate-fade-in-up" style={{ animationDelay: '160ms' }} aria-label="Audio Relaksasi">
        <button
          type="button"
          className="home-hosp-banner home-audio-banner card"
          onClick={openAudioModal}
        >
          <div className="home-hosp-banner__icon" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
            <Headphones size={20} aria-hidden="true" />
          </div>
          <div className="home-hosp-banner__content">
            <h2>Audio Relaksasi &amp; Meditasi</h2>
            <p className="text-secondary text-xs">
              Denyut rahim, ombak tenang, dan panduan napas 4-7-8
            </p>
          </div>
          <ChevronRight size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
        </button>
      </section>

      {/* This Week's Checklist */}
      <section className="section animate-fade-in-up" style={{ animationDelay: '180ms' }}>
        <div className="section-header">
          <h2 className="section-title">
            <ListChecks size={20} aria-hidden="true" />
            <span>Minggu Ini</span>
          </h2>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/checklist')}>
            <span>Semua</span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>

        {incompleteThisWeek.length === 0 && weekChecklist.length > 0 ? (
          <div className="home-empty-state card">
            <p>Semua tugas untuk minggu ke-{pregnancyData.currentWeek} sudah selesai.</p>
          </div>
        ) : incompleteThisWeek.length === 0 ? (
          <div className="home-empty-state card">
            <p>Belum ada tugas khusus minggu ini. Buka semua daftar di menu Checklist.</p>
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
              <button type="button" className="btn btn-secondary btn-full" onClick={() => navigate('/checklist')}>
                +{incompleteThisWeek.length - 4} tugas lainnya
              </button>
            )}
          </div>
        )}
      </section>

      {/* Tips */}
      {weekData && (
        <section className="section animate-fade-in-up" style={{ animationDelay: '220ms' }}>
          <div className="section-header">
            <h2 className="section-title">
              <Lightbulb size={20} color="var(--color-accent-dark)" aria-hidden="true" />
              <span>Tips Minggu Ini</span>
            </h2>
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
