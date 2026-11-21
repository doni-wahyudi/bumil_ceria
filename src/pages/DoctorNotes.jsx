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
  updateProfile,
} from '../utils/storage';
import WeightGainChart from '../components/WeightGainChart';
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
  const { profile, refreshProfile, pregnancyData } = useApp();

  const defaultTab = initialTab || (location.state?.tab) || 'usg';
  const [activeTab, setActiveTab] = useState(defaultTab); // 'usg' | 'mother' | 'guide' | 'questions'

  const [usgRecords, setUsgRecords] = useState([]);
  const [maternalVitals, setMaternalVitals] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');

  const [guideSearch, setGuideSearch] = useState('');
  const [expandedGuideId, setExpandedGuideId] = useState(null);

  const [showUsgForm, setShowUsgForm] = useState(false);
  const [showVitalForm, setShowVitalForm] = useState(false);

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
    placenta: 'Korpus Posterior (Aman)',
    gender: 'Belum Jelas',
    notes: '',
  });

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

  const handleUpdateBaseline = async (data) => {
    await updateProfile(data);
    if (refreshProfile) {
      await refreshProfile();
    }
  };

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

  const latestUSG = usgRecords[0] || null;
  const latestVital = maternalVitals[0] || null;

  const liveBpEval = evaluateBloodPressure(vitalForm.systolic, vitalForm.diastolic);
  const liveLilaEval = evaluateLila(vitalForm.lila);
  const liveHbEval = evaluateHb(vitalForm.hemoglobin);
  const liveDjjEval = evaluateDJJ(usgForm.djj);
  const liveAfiEval = evaluateAFI(usgForm.afi);

  const formatDoctorName = (name) => {
    if (!name) return 'Pemeriksaan USG Sp.OG';
    return /^dr\.?\s/i.test(name.trim()) ? name.trim() : `dr. ${name.trim()}`;
  };

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
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div>
          <div className="dn-header-badge">
            <Stethoscope size={14} aria-hidden="true" />
            <span>Buku KIA &amp; Medis Bumil</span>
          </div>
          <h1>Catatan Medis &amp; USG</h1>
        </div>
      </header>

      {/* 4-Tab Navigation */}
      <div className="dn-tab-toggle animate-fade-in-up" style={{ animationDelay: '40ms' }} role="tablist" aria-label="Bagian catatan medis">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'usg'}
          className={`dn-tab-btn ${activeTab === 'usg' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('usg')}
        >
          <Baby size={15} aria-hidden="true" />
          <span className="tabular-nums">USG Janin ({usgRecords.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'mother'}
          className={`dn-tab-btn ${activeTab === 'mother' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('mother')}
        >
          <HeartPulse size={15} aria-hidden="true" />
          <span className="tabular-nums">Kondisi Ibu ({maternalVitals.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'guide'}
          className={`dn-tab-btn ${activeTab === 'guide' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          <BookOpen size={15} aria-hidden="true" />
          <span>Kamus &amp; Mitigasi</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'questions'}
          className={`dn-tab-btn ${activeTab === 'questions' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <HelpCircle size={15} aria-hidden="true" />
          <span className="tabular-nums">Tanya Dokter ({questions.filter((q) => !q.isAnswered).length})</span>
        </button>
      </div>

      {/* TAB 1: USG JANIN */}
      {activeTab === 'usg' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {latestUSG && (
            <section className="dn-quick-glance card" aria-label="Ringkasan hasil USG terakhir">
              <div className="dn-qg-header">
                <h2 className="eyebrow">Hasil USG Terakhir</h2>
                <span className="dn-qg-date tabular-nums">{formatDateID(latestUSG.date)} (Mg {latestUSG.week})</span>
              </div>
              <div className="dn-qg-grid">
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Denyut Jantung (DJJ)</span>
                  <strong className="dn-qg-val tabular-nums">{latestUSG.djj ? `${latestUSG.djj} bpm` : '-'}</strong>
                  {latestUSG.djj && (
                    <span className={`badge badge-${evaluateDJJ(latestUSG.djj)?.color || 'secondary'}`}>
                      {evaluateDJJ(latestUSG.djj)?.label}
                    </span>
                  )}
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Air Ketuban (AFI)</span>
                  <strong className="dn-qg-val tabular-nums">{latestUSG.afi ? `${latestUSG.afi} cm` : '-'}</strong>
                  {latestUSG.afi && (
                    <span className={`badge badge-${evaluateAFI(latestUSG.afi)?.color || 'secondary'}`}>
                      {evaluateAFI(latestUSG.afi)?.label}
                    </span>
                  )}
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Taksiran Berat (TBJ)</span>
                  <strong className="dn-qg-val tabular-nums">{latestUSG.efw ? `${latestUSG.efw} gram` : '-'}</strong>
                  <span className="dn-qg-sub">{latestUSG.gender ? `JK: ${latestUSG.gender}` : ''}</span>
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Plasenta</span>
                  <strong className="dn-qg-val dn-qg-text-small">{latestUSG.placenta || '-'}</strong>
                  <span className="dn-qg-sub">{latestUSG.doctorName || profile?.doctorName || 'Sp.OG'}</span>
                </div>
              </div>
            </section>
          )}

          <div className="dn-action-bar">
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => setShowUsgForm(!showUsgForm)}
              aria-expanded={showUsgForm}
            >
              <Plus size={16} aria-hidden="true" />
              <span>{showUsgForm ? 'Tutup Formulir USG' : 'Catat Hasil USG Baru'}</span>
            </button>
          </div>

          {showUsgForm && (
            <form className="dn-form card animate-fade-in-up" onSubmit={handleSaveUSG}>
              <div className="dn-form-header">
                <h3>Pencatatan Biometri USG Janin</h3>
                <span className="text-xs text-secondary">Sesuai printout USG dokter</span>
              </div>

              <div className="dn-form-grid">
                <div className="input-group">
                  <label htmlFor="usg-date">Tanggal Pemeriksaan *</label>
                  <input
                    id="usg-date"
                    type="date"
                    className="input-field"
                    value={usgForm.date}
                    onChange={(e) => setUsgForm({ ...usgForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="usg-week">Usia Janin (Minggu) *</label>
                  <input
                    id="usg-week"
                    type="number"
                    min="4"
                    max="42"
                    className="input-field tabular-nums"
                    value={usgForm.week}
                    onChange={(e) => setUsgForm({ ...usgForm, week: parseInt(e.target.value, 10) || '' })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="usg-doctor">Nama Dokter / Sp.OG</label>
                  <input
                    id="usg-doctor"
                    type="text"
                    className="input-field"
                    placeholder="Contoh: dr. Anita, Sp.OG"
                    value={usgForm.doctorName}
                    onChange={(e) => setUsgForm({ ...usgForm, doctorName: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="usg-clinic">Klinik / Rumah Sakit</label>
                  <input
                    id="usg-clinic"
                    type="text"
                    className="input-field"
                    placeholder="RSIA Bunda / Belleza"
                    value={usgForm.clinicName}
                    onChange={(e) => setUsgForm({ ...usgForm, clinicName: e.target.value })}
                  />
                </div>
              </div>

              <div className="dn-sub-form-section">
                <div className="dn-sub-form-title">
                  <Baby size={14} color="var(--color-primary)" aria-hidden="true" />
                  <span>Pengukuran Biometri Janin (mm &amp; gram)</span>
                </div>

                <div className="dn-form-grid-3">
                  <div className="input-group">
                    <label htmlFor="usg-crl">
                      CRL (mm) <span className="dn-field-hint">T1</span>
                    </label>
                    <input
                      id="usg-crl"
                      type="number"
                      step="0.1"
                      className="input-field tabular-nums"
                      placeholder="cth: 54"
                      value={usgForm.crl}
                      onChange={(e) => setUsgForm({ ...usgForm, crl: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="usg-bpd">
                      BPD (mm) <span className="dn-field-hint">Pelipis</span>
                    </label>
                    <input
                      id="usg-bpd"
                      type="number"
                      step="0.1"
                      className="input-field tabular-nums"
                      placeholder="cth: 62"
                      value={usgForm.bpd}
                      onChange={(e) => setUsgForm({ ...usgForm, bpd: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="usg-hc">
                      HC (mm) <span className="dn-field-hint">Kepala</span>
                    </label>
                    <input
                      id="usg-hc"
                      type="number"
                      step="0.1"
                      className="input-field tabular-nums"
                      placeholder="cth: 230"
                      value={usgForm.hc}
                      onChange={(e) => setUsgForm({ ...usgForm, hc: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="usg-ac">
                      AC (mm) <span className="dn-field-hint">Perut</span>
                    </label>
                    <input
                      id="usg-ac"
                      type="number"
                      step="0.1"
                      className="input-field tabular-nums"
                      placeholder="cth: 215"
                      value={usgForm.ac}
                      onChange={(e) => setUsgForm({ ...usgForm, ac: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="usg-fl">
                      FL (mm) <span className="dn-field-hint">Paha</span>
                    </label>
                    <input
                      id="usg-fl"
                      type="number"
                      step="0.1"
                      className="input-field tabular-nums"
                      placeholder="cth: 48"
                      value={usgForm.fl}
                      onChange={(e) => setUsgForm({ ...usgForm, fl: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="usg-efw">
                      TBJ (gram) <span className="dn-field-hint">Berat</span>
                    </label>
                    <input
                      id="usg-efw"
                      type="number"
                      className="input-field tabular-nums"
                      placeholder="cth: 1250"
                      value={usgForm.efw}
                      onChange={(e) => setUsgForm({ ...usgForm, efw: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="dn-sub-form-section">
                <div className="dn-sub-form-title">
                  <HeartPulse size={14} color="var(--color-secondary-dark)" aria-hidden="true" />
                  <span>Kondisi Fisiologis Janin &amp; Air Ketuban</span>
                </div>

                <div className="dn-form-grid">
                  <div className="input-group">
                    <label htmlFor="usg-djj">DJJ / Denyut Jantung (bpm)</label>
                    <input
                      id="usg-djj"
                      type="number"
                      className="input-field tabular-nums"
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
                    <label htmlFor="usg-afi">AFI / Ketuban (cm)</label>
                    <input
                      id="usg-afi"
                      type="number"
                      step="0.1"
                      className="input-field tabular-nums"
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
                    <label htmlFor="usg-placenta">Posisi Plasenta</label>
                    <select
                      id="usg-placenta"
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
                    <label htmlFor="usg-gender">Jenis Kelamin</label>
                    <select
                      id="usg-gender"
                      className="input-field"
                      value={usgForm.gender}
                      onChange={(e) => setUsgForm({ ...usgForm, gender: e.target.value })}
                    >
                      <option value="Belum Jelas">Belum Jelas / Rahasia</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '12px' }}>
                  <label htmlFor="usg-notes">Kesimpulan &amp; Catatan Dokter</label>
                  <textarea
                    id="usg-notes"
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

          <div className="dn-records-list">
            {usgRecords.length === 0 ? (
              <div className="dn-empty-card card">
                <h3>Belum Ada Catatan USG</h3>
                <p className="text-secondary text-xs">
                  Catat ukuran CRL, BPD, AC, FL, dan DJJ setelah kontrol agar riwayat pertumbuhan janin tersimpan rapi.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '12px' }}
                  onClick={() => setShowUsgForm(true)}
                >
                  <Plus size={14} aria-hidden="true" />
                  <span>Catat Pemeriksaan Pertama</span>
                </button>
              </div>
            ) : (
              usgRecords.map((rec) => {
                const djjEval = evaluateDJJ(rec.djj);
                const afiEval = evaluateAFI(rec.afi);
                return (
                  <article key={rec.id} className="dn-record-card card animate-fade-in-up">
                    <div className="dn-rec-header">
                      <div className="dn-rec-meta">
                        <span className="dn-rec-week-badge tabular-nums">Mg {rec.week}</span>
                        <span className="dn-rec-date tabular-nums">
                          <Calendar size={13} aria-hidden="true" />
                          <span>{formatDateID(rec.date)}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="dn-delete-btn"
                        onClick={() => handleDeleteUSG(rec.id)}
                        aria-label={`Hapus riwayat USG tanggal ${formatDateID(rec.date)}`}
                        title="Hapus Catatan Ini"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="dn-rec-doctor-line">
                      <span>{formatDoctorName(rec.doctorName)}</span>
                      {rec.clinicName && <span className="text-tertiary"> · {rec.clinicName}</span>}
                    </div>

                    <div className="dn-chips-grid tabular-nums">
                      {rec.djj && (
                        <div className={`dn-chip dn-chip--${djjEval?.color || 'normal'}`}>
                          <HeartPulse size={13} aria-hidden="true" />
                          <span>DJJ: <strong>{rec.djj} bpm</strong></span>
                        </div>
                      )}
                      {rec.afi && (
                        <div className={`dn-chip dn-chip--${afiEval?.color || 'normal'}`}>
                          <Droplets size={13} aria-hidden="true" />
                          <span>AFI: <strong>{rec.afi} cm</strong></span>
                        </div>
                      )}
                      {rec.efw && (
                        <div className="dn-chip dn-chip--primary">
                          <Weight size={13} aria-hidden="true" />
                          <span>TBJ: <strong>{rec.efw} g</strong></span>
                        </div>
                      )}
                      {rec.gender && rec.gender !== 'Belum Jelas' && (
                        <div className="dn-chip dn-chip--accent">
                          <Baby size={13} aria-hidden="true" />
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
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: KONDISI KESEHATAN IBU */}
      {activeTab === 'mother' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <WeightGainChart
            maternalVitals={maternalVitals}
            profile={profile}
            currentWeek={pregnancyData?.currentWeek || 12}
            onUpdateBaseline={handleUpdateBaseline}
            onOpenAddVital={() => {
              setShowVitalForm(true);
              setTimeout(() => {
                const el = document.getElementById('vital-weight-input');
                if (el) {
                  el.focus();
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 120);
            }}
          />

          {latestVital && (
            <section className="dn-quick-glance card" aria-label="Status kesehatan terakhir ibu">
              <div className="dn-qg-header">
                <h2 className="eyebrow">Status Kesehatan Terakhir</h2>
                <span className="dn-qg-date tabular-nums">{formatDateID(latestVital.date)} (Mg {latestVital.week})</span>
              </div>
              <div className="dn-qg-grid">
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Tensi Darah</span>
                  <strong className="dn-qg-val tabular-nums">
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
                  <strong className="dn-qg-val tabular-nums">{latestVital.lila ? `${latestVital.lila} cm` : '-'}</strong>
                  {latestVital.lila && (
                    <span className={`badge badge-${evaluateLila(latestVital.lila)?.color || 'secondary'}`}>
                      {evaluateLila(latestVital.lila)?.label}
                    </span>
                  )}
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Hemoglobin (Hb)</span>
                  <strong className="dn-qg-val tabular-nums">{latestVital.hemoglobin ? `${latestVital.hemoglobin} g/dL` : '-'}</strong>
                  {latestVital.hemoglobin && (
                    <span className={`badge badge-${evaluateHb(latestVital.hemoglobin)?.color || 'secondary'}`}>
                      {evaluateHb(latestVital.hemoglobin)?.label}
                    </span>
                  )}
                </div>
                <div className="dn-qg-item">
                  <span className="dn-qg-label">Berat Badan</span>
                  <strong className="dn-qg-val tabular-nums">{latestVital.weight ? `${latestVital.weight} kg` : '-'}</strong>
                  <span className="dn-qg-sub tabular-nums">
                    {profile?.prePregnancyWeight ? `Awal: ${profile.prePregnancyWeight} kg` : (latestVital.bloodSugar ? `Gula: ${latestVital.bloodSugar} mg/dL` : '')}
                  </span>
                </div>
              </div>
            </section>
          )}

          <div className="dn-action-bar">
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => setShowVitalForm(!showVitalForm)}
              aria-expanded={showVitalForm}
            >
              <Plus size={16} aria-hidden="true" />
              <span>{showVitalForm ? 'Tutup Formulir' : 'Catat Berat Badan & Tensi Baru'}</span>
            </button>
          </div>

          {showVitalForm && (
            <form id="maternal-vital-form" className="dn-form card animate-fade-in-up" onSubmit={handleSaveVital}>
              <div className="dn-form-header">
                <h3>Pencatatan Kesehatan Ibu (Buku KIA)</h3>
                <span className="text-xs text-secondary">Saat kontrol Bidan / Puskesmas / RS</span>
              </div>

              <div className="dn-form-grid">
                <div className="input-group">
                  <label htmlFor="vital-date">Tanggal Pemeriksaan *</label>
                  <input
                    id="vital-date"
                    type="date"
                    className="input-field"
                    value={vitalForm.date}
                    onChange={(e) => setVitalForm({ ...vitalForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="vital-week">Minggu Kehamilan *</label>
                  <input
                    id="vital-week"
                    type="number"
                    min="1"
                    max="42"
                    className="input-field tabular-nums"
                    value={vitalForm.week}
                    onChange={(e) => setVitalForm({ ...vitalForm, week: parseInt(e.target.value, 10) || '' })}
                    required
                  />
                </div>
              </div>

              <div className="dn-sub-form-section">
                <div className="dn-sub-form-title">
                  <Activity size={14} color="var(--color-primary)" aria-hidden="true" />
                  <span>Tekanan Darah &amp; Berat Badan</span>
                </div>

                <div className="dn-form-grid-3">
                  <div className="input-group">
                    <label htmlFor="vital-sys">Sistolik (mmHg)</label>
                    <input
                      id="vital-sys"
                      type="number"
                      className="input-field tabular-nums"
                      placeholder="cth: 110"
                      value={vitalForm.systolic}
                      onChange={(e) => setVitalForm({ ...vitalForm, systolic: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="vital-dia">Diastolik (mmHg)</label>
                    <input
                      id="vital-dia"
                      type="number"
                      className="input-field tabular-nums"
                      placeholder="cth: 70"
                      value={vitalForm.diastolic}
                      onChange={(e) => setVitalForm({ ...vitalForm, diastolic: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="vital-weight-input">Berat Badan (kg)</label>
                    <input
                      id="vital-weight-input"
                      type="number"
                      step="0.1"
                      className="input-field tabular-nums"
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

              <div className="dn-sub-form-section">
                <div className="dn-sub-form-title">
                  <Stethoscope size={14} color="var(--color-secondary-dark)" aria-hidden="true" />
                  <span>Gizi &amp; Laboratorium (LiLA, Hb, Gula)</span>
                </div>

                <div className="dn-form-grid-3">
                  <div className="input-group">
                    <label htmlFor="vital-lila">
                      LiLA (cm) <span className="dn-field-hint">≥23.5</span>
                    </label>
                    <input
                      id="vital-lila"
                      type="number"
                      step="0.1"
                      className="input-field tabular-nums"
                      placeholder="cth: 25.0"
                      value={vitalForm.lila}
                      onChange={(e) => setVitalForm({ ...vitalForm, lila: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="vital-hb">
                      Hb (g/dL) <span className="dn-field-hint">≥11.0</span>
                    </label>
                    <input
                      id="vital-hb"
                      type="number"
                      step="0.1"
                      className="input-field tabular-nums"
                      placeholder="cth: 12.1"
                      value={vitalForm.hemoglobin}
                      onChange={(e) => setVitalForm({ ...vitalForm, hemoglobin: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="vital-sugar">
                      Gula (mg/dL) <span className="dn-field-hint">&lt;140</span>
                    </label>
                    <input
                      id="vital-sugar"
                      type="number"
                      className="input-field tabular-nums"
                      placeholder="cth: 105"
                      value={vitalForm.bloodSugar}
                      onChange={(e) => setVitalForm({ ...vitalForm, bloodSugar: e.target.value })}
                    />
                  </div>
                </div>

                {liveLilaEval && liveLilaEval.status === 'danger' && (
                  <div className="dn-eval-card dn-eval-card--danger" style={{ marginTop: '8px' }}>
                    <div className="dn-eval-header">
                      <AlertTriangle size={15} aria-hidden="true" />
                      <span className="dn-eval-tag">Peringatan: {liveLilaEval.label}</span>
                    </div>
                    <p className="dn-eval-advice">{liveLilaEval.advice}</p>
                  </div>
                )}

                {liveHbEval && (liveHbEval.status === 'warning' || liveHbEval.status === 'danger' || liveHbEval.status === 'critical') && (
                  <div className="dn-eval-card dn-eval-card--warning" style={{ marginTop: '8px' }}>
                    <div className="dn-eval-header">
                      <AlertTriangle size={15} aria-hidden="true" />
                      <span className="dn-eval-tag">Peringatan: {liveHbEval.label}</span>
                    </div>
                    <p className="dn-eval-advice">{liveHbEval.advice}</p>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="vital-symptoms">Keluhan Fisik Saat Ini</label>
                <input
                  id="vital-symptoms"
                  type="text"
                  className="input-field"
                  placeholder="Contoh: Kaki agak bengkak sore hari..."
                  value={vitalForm.symptoms}
                  onChange={(e) => setVitalForm({ ...vitalForm, symptoms: e.target.value })}
                />
              </div>

              <div className="input-group" style={{ marginTop: '12px' }}>
                <label htmlFor="vital-notes">Catatan Tambahan Bidan / Dokter</label>
                <textarea
                  id="vital-notes"
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

          <div className="dn-records-list">
            {maternalVitals.length === 0 ? (
              <div className="dn-empty-card card">
                <h3>Belum Ada Riwayat Vital Ibu</h3>
                <p className="text-secondary text-xs">
                  Catat tensi, berat badan, lingkar lengan (LiLA), dan kadar Hb setiap pemeriksaan kehamilan (ANC).
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '12px' }}
                  onClick={() => setShowVitalForm(true)}
                >
                  <Plus size={14} aria-hidden="true" />
                  <span>Catat Vitals Pertama</span>
                </button>
              </div>
            ) : (
              maternalVitals.map((v) => {
                const bpEval = evaluateBloodPressure(v.systolic, v.diastolic);
                const lilaEval = evaluateLila(v.lila);
                const hbEval = evaluateHb(v.hemoglobin);
                const hasAlert = bpEval?.status === 'danger' || bpEval?.status === 'critical' || lilaEval?.status === 'danger' || hbEval?.status === 'danger' || hbEval?.status === 'critical';

                return (
                  <article key={v.id} className="dn-record-card card animate-fade-in-up">
                    <div className="dn-rec-header">
                      <div className="dn-rec-meta">
                        <span className="dn-rec-week-badge tabular-nums">Mg {v.week}</span>
                        <span className="dn-rec-date tabular-nums">
                          <Calendar size={13} aria-hidden="true" />
                          <span>{formatDateID(v.date)}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="dn-delete-btn"
                        onClick={() => handleDeleteVital(v.id)}
                        aria-label={`Hapus catatan vital tanggal ${formatDateID(v.date)}`}
                        title="Hapus Catatan Ini"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="dn-chips-grid tabular-nums">
                      {v.systolic && v.diastolic && (
                        <div className={`dn-chip dn-chip--${bpEval?.color || 'normal'}`}>
                          <Activity size={13} aria-hidden="true" />
                          <span>Tensi: <strong>{v.systolic}/{v.diastolic}</strong></span>
                        </div>
                      )}
                      {v.weight && (
                        <div className="dn-chip dn-chip--primary">
                          <Weight size={13} aria-hidden="true" />
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

                    {hasAlert && (
                      <div className="dn-rec-alert-box card" role="alert">
                        <div className="dn-rec-alert-head">
                          <AlertTriangle size={15} color="var(--color-danger)" aria-hidden="true" />
                          <strong>Panduan Tindakan &amp; Mitigasi:</strong>
                        </div>
                        {(bpEval?.status === 'danger' || bpEval?.status === 'critical') && <p><strong>Tensi Tinggi:</strong> {bpEval.advice}</p>}
                        {lilaEval?.status === 'danger' && <p><strong>Gizi Rendah:</strong> {lilaEval.advice}</p>}
                        {(hbEval?.status === 'danger' || hbEval?.status === 'critical') && <p><strong>Anemia:</strong> {hbEval.advice}</p>}
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
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: KAMUS MEDIS USG & MITIGASI */}
      {activeTab === 'guide' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <div className="dn-emergency-banner card">
            <div className="dn-eb-icon">
              <ShieldAlert size={22} aria-hidden="true" />
            </div>
            <div className="dn-eb-content">
              <strong>Tanda Bahaya Kehamilan (Segera ke IGD RSIA)</strong>
              <p className="text-xs">
                Perdarahan jalan lahir, ketuban rembes, pusing hebat dengan pandangan kabur, atau gerak janin turun drastis merupakan kondisi darurat.
              </p>
              <div className="dn-eb-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate('/hospitals')}
                >
                  <PhoneCall size={14} aria-hidden="true" />
                  <span>Daftar IGD RSIA Lampung</span>
                </button>
              </div>
            </div>
          </div>

          <div className="dn-search-wrap card">
            <label htmlFor="dn-guide-search" className="sr-only">Cari istilah USG</label>
            <Search size={18} color="var(--color-text-tertiary)" aria-hidden="true" />
            <input
              id="dn-guide-search"
              type="text"
              className="dn-search-input"
              placeholder="Cari istilah USG (CRL, BPD, AC, AFI, DJJ)..."
              value={guideSearch}
              onChange={(e) => setGuideSearch(e.target.value)}
            />
            {guideSearch && (
              <button
                type="button"
                className="dn-search-clear"
                onClick={() => setGuideSearch('')}
                aria-label="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          <section className="dn-guide-list">
            <div className="dn-guide-section-header">
              <BookOpen size={16} color="var(--color-primary)" aria-hidden="true" />
              <h2>Kamus Istilah Biometri USG &amp; Nilai Acuan</h2>
            </div>

            {filteredGuide.map((item) => {
              const isExpanded = expandedGuideId === item.id;
              return (
                <div key={item.id} className="dn-guide-card card">
                  <button
                    type="button"
                    className="dn-guide-header-btn"
                    onClick={() => setExpandedGuideId(isExpanded ? null : item.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="dn-guide-header-left">
                      <span className="dn-guide-code">{item.code}</span>
                      <div>
                        <h3>{item.name}</h3>
                        <span className="dn-guide-indo text-xs text-secondary">{item.indonesianName}</span>
                      </div>
                    </div>
                    <div className="dn-guide-header-right">
                      <span className="dn-guide-badge badge badge-mama">{item.badge}</span>
                      {isExpanded ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
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
                        <strong className="dn-gb-text dn-gb-text--highlight tabular-nums">{item.normalRange}</strong>
                      </div>
                      <div className="dn-gb-block">
                        <span className="dn-gb-title">Apa Artinya?</span>
                        <p>{item.description}</p>
                      </div>
                      <div className="dn-gb-block">
                        <span className="dn-gb-title">Makna Medis</span>
                        <p>{item.clinicalMeaning}</p>
                      </div>
                      <div className="dn-gb-block dn-gb-block--mitigation">
                        <span className="dn-gb-title">Langkah Mitigasi &amp; Saran</span>
                        <p>{item.mitigation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredGuide.length === 0 && (
              <div className="dn-empty-card card">
                <p className="text-xs text-secondary">Istilah USG tidak ditemukan. Coba kata kunci seperti CRL, BPD, AC, DJJ, atau AFI.</p>
              </div>
            )}
          </section>

          <section className="dn-redflags-section">
            <div className="dn-guide-section-header">
              <AlertTriangle size={16} color="var(--color-danger)" aria-hidden="true" />
              <h2>6 Tanda Bahaya Kehamilan Buku KIA</h2>
            </div>

            <div className="dn-rf-grid">
              {PREGNANCY_RED_FLAGS.map((rf) => (
                <div key={rf.id} className="dn-rf-card card">
                  <div className="dn-rf-top">
                    <span className="dn-rf-dot" aria-hidden="true" />
                    <strong>{rf.title}</strong>
                  </div>
                  <p className="dn-rf-desc text-xs text-secondary">{rf.desc}</p>
                  <div className="dn-rf-urgency">
                    <Info size={13} color="var(--color-danger)" aria-hidden="true" />
                    <span>{rf.urgency}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: TANYA DOKTER */}
      {activeTab === 'questions' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <div className="dn-intro-card card">
            <HelpCircle size={18} color="var(--color-accent-dark)" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
            <p>
              Catat pertanyaan yang terpikirkan di rumah agar tidak terlupa saat konsultasi dengan dokter kandungan atau bidan.
            </p>
          </div>

          <form className="dn-add-q-form card" onSubmit={handleAddQuestion}>
            <label htmlFor="dn-question-input" className="sr-only">Tulis pertanyaan untuk dokter</label>
            <input
              id="dn-question-input"
              type="text"
              className="input-field dn-q-input"
              placeholder="Tulis pertanyaan untuk dokter..."
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary dn-q-submit-btn"
              disabled={!newQuestionText.trim()}
              aria-label="Tambah Pertanyaan"
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          </form>

          <div className="dn-questions-list">
            {questions.length === 0 ? (
              <div className="dn-empty-card card">
                <h3>Belum Ada Pertanyaan Tercatat</h3>
                <p className="text-secondary text-xs">
                  Contoh: Bolehkah vitamin ini diminum sebelum tidur? Apakah posisi tidur miring kanan aman?
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
                    className="dn-q-toggle-btn"
                    onClick={() => handleToggleQuestion(q.id)}
                    aria-pressed={q.isAnswered}
                    aria-label={`${q.isAnswered ? 'Sudah terjawab' : 'Belum terjawab'}: ${q.text}`}
                  >
                    <span className="dn-q-check-icon" aria-hidden="true">
                      {q.isAnswered ? (
                        <CheckCircle2 size={20} color="var(--color-secondary-dark)" />
                      ) : (
                        <Circle size={20} color="var(--color-text-tertiary)" />
                      )}
                    </span>
                    <span className="dn-q-body">
                      <span className={`dn-q-text ${q.isAnswered ? 'dn-q-text--strikethrough' : ''}`}>
                        {q.text}
                      </span>
                      {q.isAnswered && (
                        <span className="dn-q-badge badge badge-success">Sudah Dijawab Dokter</span>
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="dn-delete-btn"
                    onClick={() => handleDeleteQuestion(q.id)}
                    aria-label={`Hapus pertanyaan: ${q.text}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
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
