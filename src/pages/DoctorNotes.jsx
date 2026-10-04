import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Stethoscope,
  Plus,
  Calendar,
  Activity,
  Weight,
  HelpCircle,
  CheckCircle2,
  Circle,
  Trash2,
  Sparkles,
  BookOpen,
  AlertTriangle,
  HeartPulse,
  Droplets,
  Info,
  ChevronDown,
  ChevronUp,
  Baby,
  ShieldAlert,
  PhoneCall,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getDoctorQuestions,
  addDoctorQuestion,
  toggleDoctorQuestion,
  deleteDoctorQuestion,
  getUSGRecords,
  saveUSGRecord,
  deleteUSGRecord,
  getMaternalVitals,
  saveMaternalVital,
  deleteMaternalVital,
} from '../utils/storage';
import { formatDateID } from '../utils/pregnancyCalc';
import {
  USG_INDICATORS,
  PREGNANCY_RED_FLAGS,
  evaluateBloodPressure,
  evaluateLila,
  evaluateHb,
  evaluateDJJ,
  evaluateAFI,
} from '../data/medicalGuideData';
import './DoctorNotes.css';

export default function DoctorNotes({ initialTab = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, pregnancyData } = useApp();

  // Determine starting tab (from props, location state, query string, or default 'usg')
  const defaultTab = initialTab || (location.state?.tab) || 'usg';
  const [activeTab, setActiveTab] = useState(defaultTab); // 'usg' | 'mother' | 'guide' | 'questions'

  // Data states
  const [usgRecords, setUsgRecords] = useState([]);
  const [maternalVitals, setMaternalVitals] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Guide search query
  const [guideSearch, setGuideSearch] = useState('');
  const [expandedGuideId, setExpandedGuideId] = useState(null);

  // Form toggles
  const [showUsgForm, setShowUsgForm] = useState(false);
  const [showVitalForm, setShowVitalForm] = useState(false);

  // USG Form State
  const [usgForm, setUsgForm] = useState({
    date: new Date().toISOString().split('T')[0],
    week: pregnancyData?.currentWeek || 12,
    doctorName: profile?.doctorName || '',
    clinicName: profile?.hospitalName || '',
    crl: '',
    bpd: '',
    hc: '',
    ac: '',
    fl: '',
    efw: '',
    djj: '140',
    afi: '12',
    placenta: 'Korpus Posterior',
    gender: 'Belum Jelas',
    notes: '',
  });

  // Maternal Vitals Form State
  const [vitalForm, setVitalForm] = useState({
    date: new Date().toISOString().split('T')[0],
    week: pregnancyData?.currentWeek || 12,
    systolic: '115',
    diastolic: '75',
    weight: '',
    lila: '24.5',
    hemoglobin: '11.8',
    bloodSugar: '',
    symptoms: '',
    notes: '',
  });

  useEffect(() => {
    async function loadAll() {
      const [uList, vList, qList] = await Promise.all([
        getUSGRecords(),
        getMaternalVitals(),
        getDoctorQuestions(),
      ]);
      setUsgRecords(uList);
      setMaternalVitals(vList);
      setQuestions(qList);
    }
    loadAll();
  }, []);


  // ---- USG Form Handlers ----
  const handleSaveUSG = async (e) => {
    e.preventDefault();
    if (!usgForm.date) return;
    const saved = await saveUSGRecord(usgForm);
    setUsgRecords((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
    setShowUsgForm(false);
  };

  const handleDeleteUSG = async (id) => {
    if (!window.confirm('Hapus riwayat USG ini?')) return;
    const updated = await deleteUSGRecord(id);
    setUsgRecords(updated);
  };

  // ---- Maternal Vitals Form Handlers ----
  const handleSaveVital = async (e) => {
    e.preventDefault();
    if (!vitalForm.date) return;
    const saved = await saveMaternalVital(vitalForm);
    setMaternalVitals((prev) => [saved, ...prev.filter((v) => v.id !== saved.id)]);
    setShowVitalForm(false);
  };

  const handleDeleteVital = async (id) => {
    if (!window.confirm('Hapus catatan vital ibu ini?')) return;
    const updated = await deleteMaternalVital(id);
    setMaternalVitals(updated);
  };

  // ---- Questions Handlers ----
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQ = await addDoctorQuestion(newQuestionText.trim());
    setQuestions((prev) => [newQ, ...prev]);
    setNewQuestionText('');
  };

  const handleToggleQuestion = async (id) => {
    const updated = await toggleDoctorQuestion(id);
    setQuestions([...updated]);
  };

  const handleDeleteQuestion = async (id) => {
    const updated = await deleteDoctorQuestion(id);
    setQuestions([...updated]);
  };

  // Filtered USG dictionary
  const filteredGuide = useMemo(() => {
    if (!guideSearch.trim()) return USG_INDICATORS;
    const q = guideSearch.toLowerCase();
    return USG_INDICATORS.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.indonesianName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [guideSearch]);

  // Latest records for quick glance
  const latestUSG = usgRecords[0] || null;
  const latestVital = maternalVitals[0] || null;

  // Real-time evaluation of vital form inputs
  const liveBpEval = evaluateBloodPressure(vitalForm.systolic, vitalForm.diastolic);
  const liveLilaEval = evaluateLila(vitalForm.lila);
  const liveHbEval = evaluateHb(vitalForm.hemoglobin);
  const liveDjjEval = evaluateDJJ(usgForm.djj);
  const liveAfiEval = evaluateAFI(usgForm.afi);

  return (
    <div className="page-content doctor-notes-page" id="doctor-notes-page">
      {/* Header */}
      <header className="dn-header animate-fade-in-up">
        <button
          type="button"
          className="dn-back-btn"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="dn-header-badge">
            <Stethoscope size={14} /> Buku KIA & Medis Bumil
          </div>
          <h2>Catatan Medis & USG</h2>
        </div>
      </header>

      {/* 4-Tab Navigation */}
      <div className="dn-tab-toggle animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <button
          type="button"
          className={`dn-tab-btn ${activeTab === 'usg' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('usg')}
        >
          <Baby size={15} />
          <span>USG Janin ({usgRecords.length})</span>
        </button>
        <button
          type="button"
          className={`dn-tab-btn ${activeTab === 'mother' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('mother')}
        >
          <HeartPulse size={15} />
          <span>Kondisi Ibu ({maternalVitals.length})</span>
        </button>
        <button
          type="button"
          className={`dn-tab-btn ${activeTab === 'guide' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          <BookOpen size={15} />
          <span>Kamus & Mitigasi</span>
        </button>
        <button
          type="button"
          className={`dn-tab-btn ${activeTab === 'questions' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <HelpCircle size={15} />
          <span>Tanya Dokter ({questions.filter((q) => !q.isAnswered).length})</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: USG JANIN (PROGRESS BIOMETRI & HASIL PEMERIKSAAN)
          ======================================================== */}
      {activeTab === 'usg' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '90ms' }}>
          {/* Quick glance highlight */}
          {latestUSG && (
            <div className="dn-quick-glance card">
              <div className="dn-qg-header">
                <span className="eyebrow">Hasil USG Terakhir</span>
                <span className="dn-qg-date">{formatDateID(latestUSG.date)} (Mg {latestUSG.week})</span>
              </div>
              <div className="dn-qg-grid">
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Denyut Jantung (DJJ)</span>
                  <strong className="dn-qg-val">{latestUSG.djj ? `${latestUSG.djj} bpm` : '-'}</strong>
                  {latestUSG.djj && (
                    <span className={`badge badge-${evaluateDJJ(latestUSG.djj)?.color || 'secondary'}`}>
                      {evaluateDJJ(latestUSG.djj)?.label}
                    </span>
                  )}
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Air Ketuban (AFI)</span>
                  <strong className="dn-qg-val">{latestUSG.afi ? `${latestUSG.afi} cm` : '-'}</strong>
                  {latestUSG.afi && (
                    <span className={`badge badge-${evaluateAFI(latestUSG.afi)?.color || 'secondary'}`}>
                      {evaluateAFI(latestUSG.afi)?.label}
                    </span>
                  )}
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Taksiran Berat (TBJ)</span>
                  <strong className="dn-qg-val">{latestUSG.efw ? `${latestUSG.efw} gram` : '-'}</strong>
                  <span className="text-xs text-secondary">{latestUSG.gender ? `JK: ${latestUSG.gender}` : ''}</span>
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Plasenta</span>
                  <strong className="dn-qg-val dn-qg-text-small">{latestUSG.placenta || '-'}</strong>
                  <span className="text-xs text-secondary">{latestUSG.doctorName || profile?.doctorName || 'Sp.OG'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Add USG Button */}
          <div className="dn-action-bar">
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => setShowUsgForm(!showUsgForm)}
            >
              <Plus size={16} />
              {showUsgForm ? 'Tutup Formulir USG' : 'Catat Hasil USG Baru'}
            </button>
          </div>

          {/* New USG Record Form */}
          {showUsgForm && (
            <form className="dn-form card animate-fade-in-up" onSubmit={handleSaveUSG}>
              <div className="dn-form-header">
                <h4>Pencatatan Biometri USG Janin</h4>
                <span className="text-xs text-secondary">Isi sesuai printout foto USG dokter</span>
              </div>

              <div className="dn-form-grid">
                <div className="input-group">
                  <label>Tanggal Pemeriksaan *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={usgForm.date}
                    onChange={(e) => setUsgForm({ ...usgForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Usia Janin (Minggu) *</label>
                  <input
                    type="number"
                    min="4"
                    max="42"
                    className="input-field"
                    value={usgForm.week}
                    onChange={(e) => setUsgForm({ ...usgForm, week: parseInt(e.target.value, 10) || '' })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Nama Dokter / Sp.OG</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Contoh: dr. Anita, Sp.OG"
                    value={usgForm.doctorName}
                    onChange={(e) => setUsgForm({ ...usgForm, doctorName: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Klinik / Rumah Sakit</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="RSIA Bunda / Belleza / dll"
                    value={usgForm.clinicName}
                    onChange={(e) => setUsgForm({ ...usgForm, clinicName: e.target.value })}
                  />
                </div>
              </div>

              {/* Biometri Janin Sub-Section */}
              <div className="dn-sub-form-section">
                <div className="dn-sub-form-title">
                  <Sparkles size={14} color="var(--color-primary)" />
                  <span>Pengukuran Biometri Janin (Dalam mm & gram)</span>
                </div>

                <div className="dn-form-grid-3">
                  <div className="input-group">
                    <label>
                      CRL (mm) <span className="dn-field-hint">Puncak–Bokong T1</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      placeholder="cth: 54"
                      value={usgForm.crl}
                      onChange={(e) => setUsgForm({ ...usgForm, crl: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      BPD (mm) <span className="dn-field-hint">Diameter Pelipis</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      placeholder="cth: 62"
                      value={usgForm.bpd}
                      onChange={(e) => setUsgForm({ ...usgForm, bpd: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      HC (mm) <span className="dn-field-hint">Lingkar Kepala</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      placeholder="cth: 230"
                      value={usgForm.hc}
                      onChange={(e) => setUsgForm({ ...usgForm, hc: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      AC (mm) <span className="dn-field-hint">Lingkar Perut</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      placeholder="cth: 215"
                      value={usgForm.ac}
                      onChange={(e) => setUsgForm({ ...usgForm, ac: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      FL (mm) <span className="dn-field-hint">Panjang Paha</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      placeholder="cth: 48"
                      value={usgForm.fl}
                      onChange={(e) => setUsgForm({ ...usgForm, fl: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      TBJ / EFW (gram) <span className="dn-field-hint">Taksiran Berat</span>
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="cth: 1250"
                      value={usgForm.efw}
                      onChange={(e) => setUsgForm({ ...usgForm, efw: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Fetal Well-being Sub-Section */}
              <div className="dn-sub-form-section">
                <div className="dn-sub-form-title">
                  <HeartPulse size={14} color="var(--color-secondary)" />
                  <span>Kondisi Fisiologis Janin & Air Ketuban</span>
                </div>

                <div className="dn-form-grid">
                  <div className="input-group">
                    <label>DJJ / Denyut Jantung (bpm)</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Normal 110–160"
                      value={usgForm.djj}
                      onChange={(e) => setUsgForm({ ...usgForm, djj: e.target.value })}
                    />
                    {liveDjjEval && (
                      <span className={`dn-live-badge badge badge-${liveDjjEval.color}`}>
                        {liveDjjEval.label}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <label>AFI / Jumlah Ketuban (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      placeholder="Normal 5–24 cm"
                      value={usgForm.afi}
                      onChange={(e) => setUsgForm({ ...usgForm, afi: e.target.value })}
                    />
                    {liveAfiEval && (
                      <span className={`dn-live-badge badge badge-${liveAfiEval.color}`}>
                        {liveAfiEval.label}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <label>Posisi & Derajat Plasenta</label>
                    <select
                      className="input-field"
                      value={usgForm.placenta}
                      onChange={(e) => setUsgForm({ ...usgForm, placenta: e.target.value })}
                    >
                      <option value="Korpus Posterior (Aman)">Korpus Posterior (Aman)</option>
                      <option value="Korpus Anterior (Aman)">Korpus Anterior (Aman)</option>
                      <option value="Fundus (Puncak Rahim - Aman)">Fundus (Puncak Rahim - Aman)</option>
                      <option value="Plasenta Letak Rendah (Perlu Pantau)">Plasenta Letak Rendah (Perlu Pantau)</option>
                      <option value="Plasenta Previa Totalis (Menutup Jalan Lahir)">Plasenta Previa (Waspada Sesar)</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Jenis Kelamin (Gender)</label>
                    <select
                      className="input-field"
                      value={usgForm.gender}
                      onChange={(e) => setUsgForm({ ...usgForm, gender: e.target.value })}
                    >
                      <option value="Belum Jelas">Belum Jelas / Rahasia</option>
                      <option value="Laki-laki 👦">Laki-laki 👦</option>
                      <option value="Perempuan 👧">Perempuan 👧</option>
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '10px' }}>
                  <label>Kesimpulan & Catatan Dokter</label>
                  <textarea
                    className="input-field dn-textarea"
                    placeholder="Contoh: Janin aktif, posisi kepala di bawah, tidak ada lilitan tali pusat..."
                    value={usgForm.notes}
                    onChange={(e) => setUsgForm({ ...usgForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="dn-form-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowUsgForm(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Hasil USG
                </button>
              </div>
            </form>
          )}

          {/* List of USG Records */}
          <div className="dn-records-list">
            {usgRecords.length === 0 ? (
              <div className="dn-empty-card card">
                <span className="dn-empty-emoji">👶</span>
                <h4>Belum Ada Catatan USG</h4>
                <p className="text-secondary text-xs">
                  Bawa hasil foto USG saat kontrol, lalu catat ukuran CRL, BPD, AC, FL, dan DJJ untuk memantau grafik perkembangan janin.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary text-sm"
                  style={{ marginTop: '12px' }}
                  onClick={() => setShowUsgForm(true)}
                >
                  <Plus size={14} /> Catat Pemeriksaan Pertama
                </button>
              </div>
            ) : (
              usgRecords.map((rec) => {
                const djjEval = evaluateDJJ(rec.djj);
                const afiEval = evaluateAFI(rec.afi);
                return (
                  <div key={rec.id} className="dn-record-card card animate-fade-in-up">
                    <div className="dn-rec-header">
                      <div className="dn-rec-meta">
                        <span className="dn-rec-week-badge">Mg {rec.week}</span>
                        <span className="dn-rec-date">
                          <Calendar size={13} /> {formatDateID(rec.date)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="dn-delete-btn"
                        onClick={() => handleDeleteUSG(rec.id)}
                        title="Hapus Catatan Ini"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="dn-rec-doctor-line">
                      <span>{rec.doctorName ? `dr. ${rec.doctorName}` : 'Pemeriksaan USG Sp.OG'}</span>
                      {rec.clinicName && <span className="text-tertiary"> • {rec.clinicName}</span>}
                    </div>

                    {/* Biometry Chips */}
                    <div className="dn-chips-grid">
                      {rec.djj && (
                        <div className={`dn-chip dn-chip--${djjEval?.color || 'normal'}`}>
                          <HeartPulse size={13} />
                          <span>DJJ: <strong>{rec.djj} bpm</strong></span>
                        </div>
                      )}
                      {rec.afi && (
                        <div className={`dn-chip dn-chip--${afiEval?.color || 'normal'}`}>
                          <Droplets size={13} />
                          <span>AFI: <strong>{rec.afi} cm</strong></span>
                        </div>
                      )}
                      {rec.efw && (
                        <div className="dn-chip dn-chip--primary">
                          <Weight size={13} />
                          <span>TBJ: <strong>{rec.efw} g</strong></span>
                        </div>
                      )}
                      {rec.gender && rec.gender !== 'Belum Jelas' && (
                        <div className="dn-chip dn-chip--accent">
                          <Baby size={13} />
                          <span>JK: <strong>{rec.gender}</strong></span>
                        </div>
                      )}
                      {rec.crl && <div className="dn-chip"><span>CRL: <strong>{rec.crl} mm</strong></span></div>}
                      {rec.bpd && <div className="dn-chip"><span>BPD: <strong>{rec.bpd} mm</strong></span></div>}
                      {rec.hc && <div className="dn-chip"><span>HC: <strong>{rec.hc} mm</strong></span></div>}
                      {rec.ac && <div className="dn-chip"><span>AC: <strong>{rec.ac} mm</strong></span></div>}
                      {rec.fl && <div className="dn-chip"><span>FL: <strong>{rec.fl} mm</strong></span></div>}
                    </div>

                    {rec.placenta && (
                      <p className="dn-rec-sub-info">
                        <strong>Plasenta:</strong> {rec.placenta}
                      </p>
                    )}

                    {rec.notes && (
                      <div className="dn-rec-notes">
                        <span className="dn-notes-label">Catatan Dokter:</span>
                        <p>{rec.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: KONDISI KESEHATAN IBU (BUKU KIA & INDIKATOR VITAL)
          ======================================================== */}
      {activeTab === 'mother' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '90ms' }}>
          {/* Latest Maternal Health Vitals Card */}
          {latestVital && (
            <div className="dn-quick-glance card">
              <div className="dn-qg-header">
                <span className="eyebrow">Status Kesehatan Terakhir</span>
                <span className="dn-qg-date">{formatDateID(latestVital.date)} (Mg {latestVital.week})</span>
              </div>
              <div className="dn-qg-grid">
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Tensi Darah</span>
                  <strong className="dn-qg-val">
                    {latestVital.systolic ? `${latestVital.systolic}/${latestVital.diastolic}` : '-'}
                  </strong>
                  {latestVital.systolic && (
                    <span className={`badge badge-${evaluateBloodPressure(latestVital.systolic, latestVital.diastolic)?.color || 'secondary'}`}>
                      {evaluateBloodPressure(latestVital.systolic, latestVital.diastolic)?.label}
                    </span>
                  )}
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">LiLA (Lengan Atas)</span>
                  <strong className="dn-qg-val">{latestVital.lila ? `${latestVital.lila} cm` : '-'}</strong>
                  {latestVital.lila && (
                    <span className={`badge badge-${evaluateLila(latestVital.lila)?.color || 'secondary'}`}>
                      {evaluateLila(latestVital.lila)?.label}
                    </span>
                  )}
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Hemoglobin (Hb)</span>
                  <strong className="dn-qg-val">{latestVital.hemoglobin ? `${latestVital.hemoglobin} g/dL` : '-'}</strong>
                  {latestVital.hemoglobin && (
                    <span className={`badge badge-${evaluateHb(latestVital.hemoglobin)?.color || 'secondary'}`}>
                      {evaluateHb(latestVital.hemoglobin)?.label}
                    </span>
                  )}
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Berat Badan</span>
                  <strong className="dn-qg-val">{latestVital.weight ? `${latestVital.weight} kg` : '-'}</strong>
                  <span className="text-xs text-secondary">
                    {latestVital.bloodSugar ? `Gula: ${latestVital.bloodSugar} mg/dL` : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Add Vital Button */}
          <div className="dn-action-bar">
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => setShowVitalForm(!showVitalForm)}
            >
              <Plus size={16} />
              {showVitalForm ? 'Tutup Formulir Vital' : 'Catat Tensi & Vital Ibu Baru'}
            </button>
          </div>

          {/* Vital Form */}
          {showVitalForm && (
            <form className="dn-form card animate-fade-in-up" onSubmit={handleSaveVital}>
              <div className="dn-form-header">
                <h4>Pencatatan Kesehatan Ibu (Standar Buku KIA)</h4>
                <span className="text-xs text-secondary">Data saat kontrol ke Bidan / Puskesmas / RS</span>
              </div>

              <div className="dn-form-grid">
                <div className="input-group">
                  <label>Tanggal Pemeriksaan *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={vitalForm.date}
                    onChange={(e) => setVitalForm({ ...vitalForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Minggu Kehamilan *</label>
                  <input
                    type="number"
                    min="1"
                    max="42"
                    className="input-field"
                    value={vitalForm.week}
                    onChange={(e) => setVitalForm({ ...vitalForm, week: parseInt(e.target.value, 10) || '' })}
                    required
                  />
                </div>
              </div>

              {/* Tensi & Berat */}
              <div className="dn-sub-form-section">
                <div className="dn-sub-form-title">
                  <Activity size={14} color="var(--color-primary)" />
                  <span>Tekanan Darah & Berat Badan</span>
                </div>

                <div className="dn-form-grid-3">
                  <div className="input-group">
                    <label>Sistolik (mmHg)</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="cth: 110"
                      value={vitalForm.systolic}
                      onChange={(e) => setVitalForm({ ...vitalForm, systolic: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Diastolik (mmHg)</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="cth: 70"
                      value={vitalForm.diastolic}
                      onChange={(e) => setVitalForm({ ...vitalForm, diastolic: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Berat Badan (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      placeholder="cth: 58.5"
                      value={vitalForm.weight}
                      onChange={(e) => setVitalForm({ ...vitalForm, weight: e.target.value })}
                    />
                  </div>
                </div>

                {liveBpEval && (
                  <div className={`dn-eval-card dn-eval-card--${liveBpEval.color}`}>
                    <div className="dn-eval-header">
                      <span className="dn-eval-tag">Status Tensi: {liveBpEval.label}</span>
                    </div>
                    <p className="dn-eval-advice">{liveBpEval.advice}</p>
                  </div>
                )}
              </div>

              {/* LiLA & Laboratorium */}
              <div className="dn-sub-form-section">
                <div className="dn-sub-form-title">
                  <Stethoscope size={14} color="var(--color-secondary)" />
                  <span>Gizi & Laboratorium (LiLA, Hb, Gula)</span>
                </div>

                <div className="dn-form-grid-3">
                  <div className="input-group">
                    <label>
                      LiLA (cm) <span className="dn-field-hint">≥23.5 cm</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      placeholder="cth: 25.0"
                      value={vitalForm.lila}
                      onChange={(e) => setVitalForm({ ...vitalForm, lila: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      Kadar Hb (g/dL) <span className="dn-field-hint">≥11.0 g/dL</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      placeholder="cth: 12.1"
                      value={vitalForm.hemoglobin}
                      onChange={(e) => setVitalForm({ ...vitalForm, hemoglobin: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      Gula Darah (mg/dL) <span className="dn-field-hint">&lt;140</span>
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="cth: 105"
                      value={vitalForm.bloodSugar}
                      onChange={(e) => setVitalForm({ ...vitalForm, bloodSugar: e.target.value })}
                    />
                  </div>
                </div>

                {liveLilaEval && liveLilaEval.status === 'danger' && (
                  <div className="dn-eval-card dn-eval-card--danger" style={{ marginTop: '8px' }}>
                    <div className="dn-eval-header">
                      <AlertTriangle size={15} />
                      <span className="dn-eval-tag">Peringatan: {liveLilaEval.label}</span>
                    </div>
                    <p className="dn-eval-advice">{liveLilaEval.advice}</p>
                  </div>
                )}

                {liveHbEval && (liveHbEval.status === 'warning' || liveHbEval.status === 'danger') && (
                  <div className="dn-eval-card dn-eval-card--warning" style={{ marginTop: '8px' }}>
                    <div className="dn-eval-header">
                      <AlertTriangle size={15} />
                      <span className="dn-eval-tag">Peringatan: {liveHbEval.label}</span>
                    </div>
                    <p className="dn-eval-advice">{liveHbEval.advice}</p>
                  </div>
                )}
              </div>

              {/* Symptoms & Notes */}
              <div className="input-group">
                <label>Keluhan Fisik Saat Ini</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: Kaki agak bengkak sore hari, sering buang air kecil..."
                  value={vitalForm.symptoms}
                  onChange={(e) => setVitalForm({ ...vitalForm, symptoms: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Catatan Tambahan Bidan / Dokter</label>
                <textarea
                  className="input-field dn-textarea"
                  placeholder="Instruksi obat, jadwal kontrol ulang, atau pantangan..."
                  value={vitalForm.notes}
                  onChange={(e) => setVitalForm({ ...vitalForm, notes: e.target.value })}
                />
              </div>

              <div className="dn-form-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowVitalForm(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Catatan Vital
                </button>
              </div>
            </form>
          )}

          {/* List of Maternal Vitals */}
          <div className="dn-records-list">
            {maternalVitals.length === 0 ? (
              <div className="dn-empty-card card">
                <span className="dn-empty-emoji">🩺</span>
                <h4>Belum Ada Riwayat Vital Ibu</h4>
                <p className="text-secondary text-xs">
                  Catat tensi, berat badan, lingkar lengan (LiLA), dan hasil cek laboratorium Hb setiap kali melakukan pemeriksaan kehamilan (ANC).
                </p>
                <button
                  type="button"
                  className="btn btn-secondary text-sm"
                  style={{ marginTop: '12px' }}
                  onClick={() => setShowVitalForm(true)}
                >
                  <Plus size={14} /> Catat Vitals Pertama
                </button>
              </div>
            ) : (
              maternalVitals.map((v) => {
                const bpEval = evaluateBloodPressure(v.systolic, v.diastolic);
                const lilaEval = evaluateLila(v.lila);
                const hbEval = evaluateHb(v.hemoglobin);
                const hasAlert = bpEval?.status === 'danger' || lilaEval?.status === 'danger' || hbEval?.status === 'danger';

                return (
                  <div key={v.id} className="dn-record-card card animate-fade-in-up">
                    <div className="dn-rec-header">
                      <div className="dn-rec-meta">
                        <span className="dn-rec-week-badge">Mg {v.week}</span>
                        <span className="dn-rec-date">
                          <Calendar size={13} /> {formatDateID(v.date)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="dn-delete-btn"
                        onClick={() => handleDeleteVital(v.id)}
                        title="Hapus Catatan Ini"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Vitals Chips */}
                    <div className="dn-chips-grid">
                      {v.systolic && v.diastolic && (
                        <div className={`dn-chip dn-chip--${bpEval?.color || 'normal'}`}>
                          <Activity size={13} />
                          <span>Tensi: <strong>{v.systolic}/{v.diastolic}</strong></span>
                        </div>
                      )}
                      {v.weight && (
                        <div className="dn-chip dn-chip--primary">
                          <Weight size={13} />
                          <span>BB: <strong>{v.weight} kg</strong></span>
                        </div>
                      )}
                      {v.lila && (
                        <div className={`dn-chip dn-chip--${lilaEval?.color || 'normal'}`}>
                          <span>LiLA: <strong>{v.lila} cm</strong></span>
                        </div>
                      )}
                      {v.hemoglobin && (
                        <div className={`dn-chip dn-chip--${hbEval?.color || 'normal'}`}>
                          <span>Hb: <strong>{v.hemoglobin} g/dL</strong></span>
                        </div>
                      )}
                      {v.bloodSugar && (
                        <div className="dn-chip">
                          <span>Gula: <strong>{v.bloodSugar} mg/dL</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Smart Mitigation Alert Box if any abnormal vital */}
                    {hasAlert && (
                      <div className="dn-rec-alert-box card">
                        <div className="dn-rec-alert-head">
                          <AlertTriangle size={15} color="var(--color-danger)" />
                          <strong>Panduan Tindakan & Mitigasi:</strong>
                        </div>
                        {bpEval?.status === 'danger' && <p>• <strong>Tensi Tinggi:</strong> {bpEval.advice}</p>}
                        {lilaEval?.status === 'danger' && <p>• <strong>Gizi Rendah:</strong> {lilaEval.advice}</p>}
                        {hbEval?.status === 'danger' && <p>• <strong>Anemia:</strong> {hbEval.advice}</p>}
                      </div>
                    )}

                    {v.symptoms && (
                      <p className="dn-rec-sub-info">
                        <strong>Keluhan:</strong> {v.symptoms}
                      </p>
                    )}

                    {v.notes && (
                      <div className="dn-rec-notes">
                        <span className="dn-notes-label">Catatan Khusus:</span>
                        <p>{v.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: KAMUS MEDIS USG & MITIGASI (EDUKASI UNTUK AWAM)
          ======================================================== */}
      {activeTab === 'guide' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '90ms' }}>
          {/* Emergency Alert Banner */}
          <div className="dn-emergency-banner card">
            <div className="dn-eb-icon">
              <ShieldAlert size={24} />
            </div>
            <div className="dn-eb-content">
              <strong>Tanda Bahaya Kehamilan (Segera ke IGD RSIA!)</strong>
              <p className="text-xs">
                Perdarahan jalan lahir, ketuban rembes, pusing hebat + pandangan kabur, atau gerak janin turun drastis adalah kondisi darurat.
              </p>
              <div className="dn-eb-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate('/hospitals')}
                >
                  <PhoneCall size={14} /> Daftar IGD RSIA Lampung
                </button>
              </div>
            </div>
          </div>

          {/* Search bar for USG terms */}
          <div className="dn-search-wrap card">
            <Search size={18} color="var(--color-text-tertiary)" />
            <input
              type="text"
              className="dn-search-input"
              placeholder="Cari istilah USG (misal: CRL, BPD, AC, AFI, DJJ)..."
              value={guideSearch}
              onChange={(e) => setGuideSearch(e.target.value)}
            />
            {guideSearch && (
              <button type="button" className="dn-search-clear" onClick={() => setGuideSearch('')}>
                ✕
              </button>
            )}
          </div>

          {/* Interactive USG Accordion Dictionary */}
          <div className="dn-guide-list">
            <div className="dn-guide-section-header">
              <BookOpen size={16} color="var(--color-primary)" />
              <h4>Kamus Istilah Biometri USG & Nilai Acuan</h4>
            </div>

            {filteredGuide.map((item) => {
              const isExpanded = expandedGuideId === item.id;
              return (
                <div key={item.id} className="dn-guide-card card">
                  <button
                    type="button"
                    className="dn-guide-header-btn"
                    onClick={() => setExpandedGuideId(isExpanded ? null : item.id)}
                  >
                    <div className="dn-guide-header-left">
                      <span className="dn-guide-code">{item.code}</span>
                      <div>
                        <h5>{item.name}</h5>
                        <span className="dn-guide-indo text-xs text-secondary">{item.indonesianName}</span>
                      </div>
                    </div>
                    <div className="dn-guide-header-right">
                      <span className="dn-guide-badge badge badge-mama">{item.badge}</span>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="dn-guide-body animate-fade-in-up">
                      <div className="dn-gb-row">
                        <span className="dn-gb-label">Periode Pemeriksaan:</span>
                        <span className="dn-gb-text">{item.trimester}</span>
                      </div>
                      <div className="dn-gb-row">
                        <span className="dn-gb-label">Rentang Normal:</span>
                        <strong className="dn-gb-text dn-gb-text--highlight">{item.normalRange}</strong>
                      </div>
                      <div className="dn-gb-block">
                        <span className="dn-gb-title">📌 Apa Artinya?</span>
                        <p>{item.description}</p>
                      </div>
                      <div className="dn-gb-block">
                        <span className="dn-gb-title">💡 Makna Medis:</span>
                        <p>{item.clinicalMeaning}</p>
                      </div>
                      <div className="dn-gb-block dn-gb-block--mitigation">
                        <span className="dn-gb-title">🛡️ Langkah Mitigasi & Saran:</span>
                        <p>{item.mitigation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Red Flags Guide Cards */}
          <div className="dn-redflags-section">
            <div className="dn-guide-section-header">
              <AlertTriangle size={16} color="var(--color-danger)" />
              <h4>6 Tanda Bahaya Kehamilan Buku KIA (Wajib Tahu!)</h4>
            </div>

            <div className="dn-rf-grid">
              {PREGNANCY_RED_FLAGS.map((rf) => (
                <div key={rf.id} className="dn-rf-card card">
                  <div className="dn-rf-top">
                    <span className="dn-rf-dot" />
                    <strong>{rf.title}</strong>
                  </div>
                  <p className="dn-rf-desc text-xs text-secondary">{rf.desc}</p>
                  <div className="dn-rf-urgency">
                    <Info size={13} color="var(--color-danger)" />
                    <span>{rf.urgency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: TANYA DOKTER & BIDAN (CHECKLIST PERTANYAAN)
          ======================================================== */}
      {activeTab === 'questions' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '90ms' }}>
          <div className="dn-intro-card card">
            <Sparkles size={18} color="var(--color-accent-dark)" />
            <p>
              Tulis pertanyaan yang sering terpikirkan di rumah, agar saat bertemu Sp.OG atau bidan tidak ada yang terlupa!
            </p>
          </div>

          {/* Add Question Input */}
          <form className="dn-add-q-form card" onSubmit={handleAddQuestion}>
            <input
              type="text"
              className="input-field dn-q-input"
              placeholder="Tulis pertanyaan untuk dokter... (tekan enter)"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary dn-q-submit-btn"
              disabled={!newQuestionText.trim()}
              aria-label="Tambah Pertanyaan"
            >
              <Plus size={18} />
            </button>
          </form>

          {/* Questions List */}
          <div className="dn-questions-list">
            {questions.length === 0 ? (
              <div className="dn-empty-card card">
                <span className="dn-empty-emoji">💬</span>
                <h4>Belum Ada Pertanyaan Tercatat</h4>
                <p className="text-secondary text-xs">
                  Contoh: "Bolehkah saya minum vitamin ini sebelum tidur?", "Apakah posisi tidur miring kanan aman?"
                </p>
              </div>
            ) : (
              questions.map((q) => (
                <div
                  key={q.id}
                  className={`dn-q-card card ${q.isAnswered ? 'dn-q-card--done' : ''}`}
                >
                  <button
                    type="button"
                    className="dn-q-check-btn"
                    onClick={() => handleToggleQuestion(q.id)}
                    aria-label={q.isAnswered ? 'Tandai belum terjawab' : 'Tandai sudah terjawab'}
                  >
                    {q.isAnswered ? (
                      <CheckCircle2 size={20} color="var(--color-secondary)" />
                    ) : (
                      <Circle size={20} color="var(--color-text-tertiary)" />
                    )}
                  </button>
                  <div className="dn-q-text-wrap" onClick={() => handleToggleQuestion(q.id)}>
                    <span className={`dn-q-text ${q.isAnswered ? 'dn-q-text--strikethrough' : ''}`}>
                      {q.text}
                    </span>
                    {q.isAnswered && (
                      <span className="dn-q-badge badge badge-success">✓ Sudah Dijawab Dokter</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="dn-delete-btn"
                    onClick={() => handleDeleteQuestion(q.id)}
                    aria-label="Hapus pertanyaan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
