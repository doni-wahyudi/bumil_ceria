import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Footprints,
  Timer,
  Play,
  Square,
  RotateCcw,
  AlertTriangle,
  Heart,
  CheckCircle2,
  Trash2,
  Phone,
  Flame,
  Clock,
  Activity,
} from 'lucide-react';
import {
  getKickSessions,
  saveKickSession,
  deleteKickSession,
  getContractionRecords,
  saveContractionRecord,
  clearContractionRecords,
} from '../utils/storage';
import { formatDateID } from '../utils/pregnancyCalc';
import './LaborTools.css';

function LaborTools() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('kick'); // 'kick' | 'contraction'

  // Kick Counter State
  const [kicks, setKicks] = useState(0);
  const [kickStartTime, setKickStartTime] = useState(null);
  const [kickElapsedSeconds, setKickElapsedSeconds] = useState(0);
  const [isKickActive, setIsKickActive] = useState(false);
  const [isKickFinished, setIsKickFinished] = useState(false);
  const [kickSessions, setKickSessions] = useState([]);
  const [kickRipple, setKickRipple] = useState(false);
  const kickTimerRef = useRef(null);

  // Contraction Timer State
  const [isContracting, setIsContracting] = useState(false);
  const [currentContractionStart, setCurrentContractionStart] = useState(null);
  const [currentContractionSeconds, setCurrentContractionSeconds] = useState(0);
  const [selectedIntensity, setSelectedIntensity] = useState('sedang'); // 'ringan' | 'sedang' | 'kuat'
  const [contractions, setContractions] = useState([]);
  const contractionTimerRef = useRef(null);

  useEffect(() => {
    async function loadHistory() {
      const [kHistory, cHistory] = await Promise.all([
        getKickSessions(),
        getContractionRecords(),
      ]);
      setKickSessions(kHistory);
      setContractions(cHistory);
    }
    loadHistory();
  }, []);

  useEffect(() => {
    if (isKickActive && !isKickFinished) {
      kickTimerRef.current = setInterval(() => {
        setKickElapsedSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(kickTimerRef.current);
    }
    return () => clearInterval(kickTimerRef.current);
  }, [isKickActive, isKickFinished]);

  useEffect(() => {
    if (isContracting) {
      contractionTimerRef.current = setInterval(() => {
        setCurrentContractionSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(contractionTimerRef.current);
    }
    return () => clearInterval(contractionTimerRef.current);
  }, [isContracting]);

  const handleRecordKick = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setKickRipple(true);
    setTimeout(() => setKickRipple(false), 300);

    if (!isKickActive && !isKickFinished) {
      setIsKickActive(true);
      setKickStartTime(new Date());
    }

    const nextCount = kicks + 1;
    setKicks(nextCount);

    if (nextCount >= 10 && !isKickFinished) {
      setIsKickFinished(true);
      setIsKickActive(false);
    }
  };

  const handleSaveKickSession = async () => {
    const session = {
      date: new Date().toISOString().split('T')[0],
      startTime: kickStartTime ? kickStartTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
      durationSeconds: kickElapsedSeconds,
      kicks,
      isTargetReached: kicks >= 10,
    };
    const saved = await saveKickSession(session);
    setKickSessions((prev) => [saved, ...prev]);
    handleResetKick();
  };

  const handleResetKick = () => {
    setIsKickActive(false);
    setIsKickFinished(false);
    setKicks(0);
    setKickStartTime(null);
    setKickElapsedSeconds(0);
  };

  const handleDeleteKickSession = async (id) => {
    const updated = await deleteKickSession(id);
    setKickSessions(updated);
  };

  const handleStartContraction = () => {
    setIsContracting(true);
    setCurrentContractionStart(new Date());
    setCurrentContractionSeconds(0);
    if (navigator.vibrate) navigator.vibrate(80);
  };

  const handleStopContraction = async () => {
    if (!currentContractionStart) return;
    setIsContracting(false);
    const endTime = new Date();
    const durationSeconds = Math.max(1, currentContractionSeconds);

    let intervalMinutes = null;
    if (contractions.length > 0) {
      const lastStart = new Date(contractions[0].startTime);
      intervalMinutes = Math.max(0, Math.round((currentContractionStart.getTime() - lastStart.getTime()) / 60000));
    }

    const record = {
      startTime: currentContractionStart.toISOString(),
      endTime: endTime.toISOString(),
      durationSeconds,
      intervalMinutes,
      intensity: selectedIntensity,
    };

    const saved = await saveContractionRecord(record);
    setContractions((prev) => [saved, ...prev]);
    setCurrentContractionStart(null);
    setCurrentContractionSeconds(0);
  };

  const handleClearContractions = async () => {
    if (window.confirm('Hapus seluruh riwayat kontraksi pada sesi ini?')) {
      await clearContractionRecords();
      setContractions([]);
    }
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isLabor511Active = () => {
    if (contractions.length < 3) return false;
    const recent = contractions.slice(0, 3);
    const avgDuration = recent.reduce((sum, c) => sum + c.durationSeconds, 0) / recent.length;
    const avgInterval = recent.reduce((sum, c) => sum + (c.intervalMinutes || 5), 0) / recent.length;
    return avgInterval <= 5.5 && avgDuration >= 45;
  };

  const is511 = isLabor511Active();

  return (
    <div className="page-content labor-tools-page" id="labor-tools-page">
      {/* Top Header */}
      <header className="lt-header animate-fade-in-up">
        <button
          type="button"
          className="lt-back-btn"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          aria-label="Kembali"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div>
          <div className="lt-header-badge">
            <Activity size={14} aria-hidden="true" />
            <span>Pemantauan Persalinan</span>
          </div>
          <h1>Alat Medis Persalinan</h1>
        </div>
      </header>

      {/* Sub-Tab Selector */}
      <div className="lt-tabs animate-fade-in-up" style={{ animationDelay: '40ms' }} role="tablist" aria-label="Pilih alat pemantauan">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'kick'}
          className={`lt-tab-btn ${activeTab === 'kick' ? 'lt-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('kick')}
        >
          <Footprints size={16} aria-hidden="true" />
          <span>Tendangan Janin (10 Gerakan)</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'contraction'}
          className={`lt-tab-btn ${activeTab === 'contraction' ? 'lt-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('contraction')}
        >
          <Timer size={16} aria-hidden="true" />
          <span>Timer Kontraksi (5-1-1)</span>
        </button>
      </div>

      {/* TAB 1: KICK COUNTER */}
      {activeTab === 'kick' && (
        <div className="lt-section animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <div className="lt-info-box card">
            <Heart size={18} color="var(--color-primary)" className="lt-info-icon" aria-hidden="true" />
            <p>
              <strong>Metode Cardiff Count-to-10:</strong> Hitung minimal <strong>10 gerakan janin</strong> dalam kurun waktu <strong>2 jam</strong> mulai usia kehamilan 28 minggu.
            </p>
          </div>

          <section className="lt-kick-card card" aria-label="Penghitung tendangan janin">
            <div className="lt-kick-timer tabular-nums">
              <Clock size={16} color="var(--color-text-secondary)" aria-hidden="true" />
              <span>Durasi Sesi: <strong>{formatTime(kickElapsedSeconds)}</strong></span>
            </div>

            <div className="lt-kick-button-wrap">
              <button
                type="button"
                className={`lt-kick-main-btn ${kickRipple ? 'lt-kick-main-btn--pulse' : ''} ${kicks >= 10 ? 'lt-kick-main-btn--done' : ''}`}
                onClick={handleRecordKick}
                aria-label={`Rekam satu tendangan janin, saat ini ${kicks} dari 10`}
              >
                <div className="lt-kick-inner">
                  <span className="lt-kick-number tabular-nums">{kicks}</span>
                  <span className="lt-kick-label">
                    {kicks === 0 ? 'Ketuk Saat Janin Bergerak' : kicks >= 10 ? 'Target Tercapai' : 'Tendangan Janin'}
                  </span>
                </div>
              </button>
            </div>

            <div className="lt-kick-progress-wrap">
              <div className="lt-kick-progress-header tabular-nums">
                <span>Progres Gerakan</span>
                <strong>{kicks} / 10 gerakan</strong>
              </div>
              <div className="lt-kick-progress-bar" role="progressbar" aria-valuenow={kicks} aria-valuemin={0} aria-valuemax={10}>
                <div
                  className="lt-kick-progress-fill"
                  style={{ width: `${Math.min(100, (kicks / 10) * 100)}%` }}
                />
              </div>
            </div>

            {isKickFinished && (
              <div className="lt-kick-success card animate-scale-in" role="status">
                <CheckCircle2 size={24} color="var(--color-secondary-dark)" aria-hidden="true" />
                <div>
                  <h2>10 Gerakan Tercapai</h2>
                  <p className="text-xs text-secondary tabular-nums">
                    Tercapai dalam <strong>{formatTime(kickElapsedSeconds)}</strong>. Janin dalam kondisi aktif dan responsif.
                  </p>
                </div>
              </div>
            )}

            <div className="lt-kick-actions">
              {(isKickActive || isKickFinished || kicks > 0) && (
                <>
                  <button type="button" className="btn btn-ghost" onClick={handleResetKick}>
                    <RotateCcw size={15} aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSaveKickSession}>
                    Simpan Sesi Ini
                  </button>
                </>
              )}
            </div>
          </section>

          <div className="lt-low-kick-card card">
            <AlertTriangle size={18} color="var(--color-warning)" className="lt-info-icon" aria-hidden="true" />
            <div>
              <strong>Tips Jika Janin Kurang Aktif:</strong>
              <p className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                Janin mungkin sedang tidur (siklus 20–40 menit). Minum segelas air dingin manis, makan camilan, lalu berbaring miring ke kiri 30 menit. Jika dalam 2 jam tetap kurang dari 10 gerakan, segera periksa ke faskes.
              </p>
            </div>
          </div>

          <section className="lt-history-section">
            <h2 className="lt-history-title">Riwayat Hitung Tendangan</h2>
            <div className="lt-history-list stagger-children">
              {kickSessions.map((s) => (
                <div key={s.id} className="lt-session-card card">
                  <div className="lt-session-left">
                    <span className="lt-session-kicks tabular-nums">
                      {s.kicks}
                    </span>
                    <div>
                      <strong>{formatDateID(s.date)}</strong>
                      <p className="text-xs text-secondary tabular-nums">
                        Mulai {s.startTime} · Durasi {formatTime(s.durationSeconds)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="lt-delete-btn"
                    onClick={() => handleDeleteKickSession(s.id)}
                    aria-label={`Hapus sesi ${formatDateID(s.date)}`}
                    title="Hapus riwayat"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}

              {kickSessions.length === 0 && (
                <div className="lt-empty-card card">
                  <p>Belum ada rekaman sesi. Ketuk tombol lingkaran di atas saat janin bergerak.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: CONTRACTION TIMER */}
      {activeTab === 'contraction' && (
        <div className="lt-section animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {is511 ? (
            <div className="lt-511-alert card animate-scale-in" role="alert">
              <div className="lt-511-top">
                <AlertTriangle size={24} color="#FFFFFF" aria-hidden="true" />
                <div>
                  <h2>Pola Kontraksi 5-1-1 Terdeteksi</h2>
                  <p>Kontraksi teratur tiap ~5 menit berdurasi ~1 menit. Segera hubungi atau berangkat ke rumah sakit.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn lt-511-call-btn"
                onClick={() => navigate('/hospitals')}
              >
                <Phone size={16} aria-hidden="true" />
                <span>Buka Direktori Faskes &amp; Telepon IGD</span>
              </button>
            </div>
          ) : (
            <div className="lt-info-box card">
              <Timer size={18} color="var(--color-secondary-dark)" className="lt-info-icon" aria-hidden="true" />
              <p>
                <strong>Rumus Medis 5-1-1:</strong> Segera ke rumah sakit jika kontraksi terjadi <strong>setiap 5 menit</strong>, berdurasi <strong>minimal 1 menit (60 detik)</strong>, dan konsisten selama <strong>1 jam</strong>.
              </p>
            </div>
          )}

          <section className="lt-contraction-card card" aria-label="Timer kontraksi">
            <div className="lt-contraction-timer-display">
              <span className="lt-contraction-sec-text tabular-nums" aria-live="polite">
                {formatTime(currentContractionSeconds)}
              </span>
              <span className="lt-contraction-status-label">
                {isContracting ? 'Perut sedang mengencang (kontraksi)...' : 'Istirahat / Tidak ada kontraksi'}
              </span>
            </div>

            {!isContracting ? (
              <button
                type="button"
                className="btn btn-primary btn-full lt-contract-btn lt-contract-btn--start"
                onClick={handleStartContraction}
              >
                <Play size={20} aria-hidden="true" />
                <span>Mulai Kontraksi</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-full lt-contract-btn lt-contract-btn--stop"
                onClick={handleStopContraction}
              >
                <Square size={20} aria-hidden="true" />
                <span>Kontraksi Berhenti</span>
              </button>
            )}

            <div className="lt-intensity-wrap">
              <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
                Tingkat Rasa Kencang / Nyeri:
              </span>
              <div className="lt-intensity-buttons" role="group" aria-label="Pilih intensitas kontraksi">
                {[
                  { id: 'ringan', label: 'Ringan' },
                  { id: 'sedang', label: 'Sedang' },
                  { id: 'kuat', label: 'Kuat' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    aria-pressed={selectedIntensity === lvl.id}
                    className={`lt-intensity-btn ${selectedIntensity === lvl.id ? 'lt-intensity-btn--active' : ''}`}
                    onClick={() => setSelectedIntensity(lvl.id)}
                  >
                    <Flame size={14} aria-hidden="true" />
                    <span>{lvl.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="lt-history-section">
            <div className="lt-history-header-row">
              <h2 className="lt-history-title tabular-nums">Riwayat Kontraksi Sesi Ini ({contractions.length})</h2>
              {contractions.length > 0 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleClearContractions}
                >
                  Hapus Sesi
                </button>
              )}
            </div>

            <div className="lt-contractions-list stagger-children">
              {contractions.map((c, idx) => (
                <div key={c.id} className="lt-contraction-row card">
                  <div className="lt-cr-left">
                    <span className="lt-cr-index tabular-nums">#{contractions.length - idx}</span>
                    <div>
                      <strong className="tabular-nums">Durasi: {c.durationSeconds} detik</strong>
                      <p className="text-xs text-secondary tabular-nums">
                        Pukul {new Date(c.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        {c.intervalMinutes !== null ? ` · Jarak: ${c.intervalMinutes} menit` : ' · Kontraksi pertama'}
                      </p>
                    </div>
                  </div>
                  <span className={`lt-cr-badge lt-cr-badge--${c.intensity}`}>
                    {c.intensity}
                  </span>
                </div>
              ))}

              {contractions.length === 0 && !isContracting && (
                <div className="lt-empty-card card">
                  <p>Belum ada kontraksi yang dicatat. Ketuk tombol di atas saat perut mulai mengencang.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default LaborTools;
