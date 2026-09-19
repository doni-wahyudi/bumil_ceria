import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Footprints,
  Timer,
  Play,
  Square,
  RotateCcw,
  Sparkles,
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

  // ---- Kick Counter State ----
  const [kicks, setKicks] = useState(0);
  const [kickStartTime, setKickStartTime] = useState(null);
  const [kickElapsedSeconds, setKickElapsedSeconds] = useState(0);
  const [isKickActive, setIsKickActive] = useState(false);
  const [isKickFinished, setIsKickFinished] = useState(false);
  const [kickSessions, setKickSessions] = useState([]);
  const [kickRipple, setKickRipple] = useState(false);
  const kickTimerRef = useRef(null);

  // ---- Contraction Timer State ----
  const [isContracting, setIsContracting] = useState(false);
  const [currentContractionStart, setCurrentContractionStart] = useState(null);
  const [currentContractionSeconds, setCurrentContractionSeconds] = useState(0);
  const [selectedIntensity, setSelectedIntensity] = useState('sedang'); // 'ringan' | 'sedang' | 'kuat'
  const [contractions, setContractions] = useState([]);
  const contractionTimerRef = useRef(null);

  // Load past history
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

  // Kick Timer Tick
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

  // Contraction Timer Tick
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

  // ---- Kick Handlers ----
  const handleRecordKick = () => {
    // Trigger vibration if supported on mobile
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

  // ---- Contraction Handlers ----
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

    // Calculate interval from previous contraction start
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

  // Format MM:SS
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 5-1-1 Rule Evaluation
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
        <button className="lt-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="lt-header-badge">
            <Activity size={14} /> Pemantauan Persalinan
          </div>
          <h2>Alat Medis Persalinan</h2>
        </div>
      </header>

      {/* Sub-Tab Selector */}
      <div className="lt-tabs animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <button
          type="button"
          className={`lt-tab-btn ${activeTab === 'kick' ? 'lt-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('kick')}
        >
          <Footprints size={16} />
          <span>Tendangan Janin (10 Gerakan)</span>
        </button>
        <button
          type="button"
          className={`lt-tab-btn ${activeTab === 'contraction' ? 'lt-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('contraction')}
        >
          <Timer size={16} />
          <span>Timer Kontraksi (5-1-1)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: KICK COUNTER (CARDIFF COUNT-TO-10 PROTOCOL)              */}
      {/* ============================================================== */}
      {activeTab === 'kick' && (
        <div className="lt-section animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Medical Protocol Notice */}
          <div className="lt-info-box card">
            <Heart size={18} color="var(--color-primary)" className="lt-info-icon" />
            <p>
              <strong>Metode Cardiff Count-to-10:</strong> Dokter kandungan merekomendasikan Mama menghitung minimal <strong>10 gerakan janin</strong> dalam kurun waktu <strong>2 jam</strong> (mulai usia kehamilan 28 minggu).
            </p>
          </div>

          {/* Kick Button & Counter Display */}
          <div className="lt-kick-card card">
            <div className="lt-kick-timer">
              <Clock size={16} color="var(--color-text-secondary)" />
              <span>Durasi Sesi: <strong>{formatTime(kickElapsedSeconds)}</strong></span>
            </div>

            {/* Big Interactive Tactile Kick Button */}
            <div className="lt-kick-button-wrap">
              <button
                type="button"
                className={`lt-kick-main-btn ${kickRipple ? 'lt-kick-main-btn--pulse' : ''} ${kicks >= 10 ? 'lt-kick-main-btn--done' : ''}`}
                onClick={handleRecordKick}
                aria-label="Rekam satu tendangan janin"
              >
                <div className="lt-kick-inner">
                  <span className="lt-kick-number">{kicks}</span>
                  <span className="lt-kick-label">
                    {kicks === 0 ? 'Ketuk Saat Janin Bergerak' : kicks >= 10 ? 'Target Tercapai! 🎉' : 'Tendangan Janin'}
                  </span>
                </div>
              </button>
            </div>

            {/* Target Progress Bar */}
            <div className="lt-kick-progress-wrap">
              <div className="lt-kick-progress-header">
                <span>Progres Gerakan</span>
                <strong>{kicks} / 10 gerakan</strong>
              </div>
              <div className="lt-kick-progress-bar">
                <div
                  className="lt-kick-progress-fill"
                  style={{ width: `${Math.min(100, (kicks / 10) * 100)}%` }}
                />
              </div>
            </div>

            {/* Target Reached Success Card */}
            {isKickFinished && (
              <div className="lt-kick-success card animate-scale-in">
                <CheckCircle2 size={24} color="var(--color-secondary)" />
                <div>
                  <h4>Alhamdulillah! 10 Gerakan Tercapai</h4>
                  <p className="text-xs text-secondary">
                    Tercapai dalam <strong>{formatTime(kickElapsedSeconds)}</strong>. Janin dalam kondisi aktif dan responsif!
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="lt-kick-actions">
              {(isKickActive || isKickFinished || kicks > 0) && (
                <>
                  <button type="button" className="btn btn-ghost" onClick={handleResetKick}>
                    <RotateCcw size={15} /> Reset
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSaveKickSession}>
                    Simpan Sesi Ini
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Advice if low fetal movement */}
          <div className="lt-low-kick-card card">
            <AlertTriangle size={18} color="var(--color-warning)" className="lt-info-icon" />
            <div>
              <strong>Tips Jika Janin Kurang Aktif:</strong>
              <p className="text-xs text-secondary" style={{ marginTop: '2px' }}>
                Janin mungkin sedang tidur (siklus tidur 20–40 menit). Coba minum segelas air dingin manis, makan cemilan, lalu berbaring miring ke kiri selama 30 menit. Jika dalam 2 jam tetap kurang dari 10 gerakan, segera hubungi dokter atau periksa ke faskes.
              </p>
            </div>
          </div>

          {/* Past Sessions History */}
          <div className="lt-history-section">
            <h4 className="lt-history-title">Riwayat Hitung Tendangan</h4>
            <div className="lt-history-list stagger-children">
              {kickSessions.map((s) => (
                <div key={s.id} className="lt-session-card card">
                  <div className="lt-session-left">
                    <span className="lt-session-kicks">
                      {s.kicks} {s.kicks >= 10 ? '✓' : ''}
                    </span>
                    <div>
                      <strong>{formatDateID(s.date)}</strong>
                      <p className="text-xs text-secondary">
                        Mulai {s.startTime} • Durasi {formatTime(s.durationSeconds)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="lt-delete-btn"
                    onClick={() => handleDeleteKickSession(s.id)}
                    title="Hapus riwayat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {kickSessions.length === 0 && (
                <div className="lt-empty-card card">
                  <span className="lt-empty-emoji">👶</span>
                  <p>Belum ada rekaman sesi. Ketuk lingkaran di atas saat janin bergerak!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CONTRACTION TIMER & 5-1-1 RULE DETECTOR                 */}
      {/* ============================================================== */}
      {activeTab === 'contraction' && (
        <div className="lt-section animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* 5-1-1 Emergency Alert Banner */}
          {is511 ? (
            <div className="lt-511-alert card animate-scale-in">
              <div className="lt-511-top">
                <AlertTriangle size={24} color="#fff" />
                <div>
                  <h3>POLA KONTRAKSI 5-1-1 TERDETEKSI!</h3>
                  <p>Kontraksi Anda sudah teratur tiap ~5 menit berdurasi ~1 menit. Ini tanda persalinan aktif!</p>
                </div>
              </div>
              <button
                type="button"
                className="btn lt-511-call-btn"
                onClick={() => navigate('/hospitals')}
              >
                <Phone size={16} /> Buka Direktori Faskes & Telepon IGD
              </button>
            </div>
          ) : (
            <div className="lt-info-box card">
              <Timer size={18} color="var(--color-secondary-dark)" className="lt-info-icon" />
              <p>
                <strong>Rumus Medis 5-1-1:</strong> Segera ke rumah sakit jika kontraksi terjadi <strong>setiap 5 menit</strong>, berdurasi <strong>minimal 1 menit (60 detik)</strong>, dan konsisten berlangsung selama <strong>1 jam</strong>.
              </p>
            </div>
          )}

          {/* Active Timer Card */}
          <div className="lt-contraction-card card">
            <div className="lt-contraction-timer-display">
              <span className="lt-contraction-sec-text">
                {formatTime(currentContractionSeconds)}
              </span>
              <span className="lt-contraction-status-label">
                {isContracting ? 'Perut sedang mengencang (kontraksi)...' : 'Istirahat / Tidak ada kontraksi'}
              </span>
            </div>

            {/* Start / Stop Button */}
            {!isContracting ? (
              <button
                type="button"
                className="btn btn-primary btn-full lt-contract-btn lt-contract-btn--start"
                onClick={handleStartContraction}
              >
                <Play size={20} /> Mulai Kontraksi
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-full lt-contract-btn lt-contract-btn--stop"
                onClick={handleStopContraction}
              >
                <Square size={20} /> Kontraksi Berhenti
              </button>
            )}

            {/* Pain Intensity Selector */}
            <div className="lt-intensity-wrap">
              <span className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>
                Tingkat Rasa Kencang / Nyeri:
              </span>
              <div className="lt-intensity-buttons">
                {[
                  { id: 'ringan', label: 'Ringan', desc: 'Bisa bicara normal' },
                  { id: 'sedang', label: 'Sedang', desc: 'Sulit bicara' },
                  { id: 'kuat', label: 'Kuat', desc: 'Sangat intens' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    className={`lt-intensity-btn ${selectedIntensity === lvl.id ? 'lt-intensity-btn--active' : ''}`}
                    onClick={() => setSelectedIntensity(lvl.id)}
                  >
                    <Flame size={14} />
                    <span>{lvl.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contraction History */}
          <div className="lt-history-section">
            <div className="lt-history-header-row">
              <h4 className="lt-history-title">Riwayat Kontraksi Sesi Ini ({contractions.length})</h4>
              {contractions.length > 0 && (
                <button
                  type="button"
                  className="btn btn-ghost text-xs"
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
                    <span className="lt-cr-index">#{contractions.length - idx}</span>
                    <div>
                      <strong>Durasi: {c.durationSeconds} detik</strong>
                      <p className="text-xs text-secondary">
                        Pukul {new Date(c.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        {c.intervalMinutes !== null ? ` • Jarak: ${c.intervalMinutes} menit` : ' • Kontraksi pertama'}
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
                  <span className="lt-empty-emoji">⏱️</span>
                  <p>Belum ada kontraksi yang dicatat. Ketuk tombol di atas saat perut mulai mengencang.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LaborTools;
