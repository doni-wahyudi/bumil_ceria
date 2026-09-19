import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ClipboardList,
} from 'lucide-react';
import { useApp } from '../App';
import {
  getDoctorVisits,
  addDoctorVisit,
  deleteDoctorVisit,
  getDoctorQuestions,
  addDoctorQuestion,
  toggleDoctorQuestion,
  deleteDoctorQuestion,
} from '../utils/storage';
import { formatDateID } from '../utils/pregnancyCalc';
import './DoctorNotes.css';

function DoctorNotes() {
  const navigate = useNavigate();
  const { profile, pregnancyData } = useApp();

  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'history'
  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [visits, setVisits] = useState([]);

  // Form state for new visit record
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitForm, setVisitForm] = useState({
    date: new Date().toISOString().split('T')[0],
    week: pregnancyData?.currentWeek || 1,
    bloodPressure: '110/70',
    motherWeight: '',
    babyWeight: '',
    doctorNotes: '',
    doctorName: profile?.doctorName || profile?.hospitalName || '',
  });

  useEffect(() => {
    async function loadData() {
      const [qList, vList] = await Promise.all([
        getDoctorQuestions(),
        getDoctorVisits(),
      ]);
      setQuestions(qList);
      setVisits(vList);
    }
    loadData();
  }, []);

  // Question handlers
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

  // Visit handlers
  const handleSaveVisit = async (e) => {
    e.preventDefault();
    const newRecord = await addDoctorVisit({
      date: visitForm.date,
      week: Number(visitForm.week),
      bloodPressure: visitForm.bloodPressure.trim(),
      motherWeight: visitForm.motherWeight.trim(),
      babyWeight: visitForm.babyWeight.trim(),
      doctorNotes: visitForm.doctorNotes.trim(),
      doctorName: visitForm.doctorName.trim(),
    });
    setVisits((prev) => [newRecord, ...prev]);
    setShowVisitForm(false);
    // Reset optional notes
    setVisitForm((prev) => ({ ...prev, doctorNotes: '', motherWeight: '', babyWeight: '' }));
  };

  const handleDeleteVisit = async (id) => {
    if (window.confirm('Hapus catatan kontrol ini?')) {
      const updated = await deleteDoctorVisit(id);
      setVisits([...updated]);
    }
  };

  return (
    <div className="page-content doctor-notes-page" id="doctor-notes-page">
      {/* Header */}
      <header className="dn-header animate-fade-in-up">
        <button className="dn-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="dn-header-badge">
            <Stethoscope size={14} /> Asisten Kontrol Medis
          </div>
          <h2>Catatan Kontrol Dokter</h2>
        </div>
      </header>

      {/* Mode Sub-Tabs */}
      <div className="dn-tab-toggle animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <button
          className={`dn-tab-btn ${activeTab === 'questions' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <HelpCircle size={16} />
          <span>Tanya Dokter ({questions.filter((q) => !q.isAnswered).length})</span>
        </button>
        <button
          className={`dn-tab-btn ${activeTab === 'history' ? 'dn-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <ClipboardList size={16} />
          <span>Riwayat Kontrol ({visits.length})</span>
        </button>
      </div>

      {/* --- TAB 1: TANYA DOKTER --- */}
      {activeTab === 'questions' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '120ms' }}>
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
            >
              <Plus size={16} /> Tambah
            </button>
          </form>

          {/* Questions List */}
          <div className="dn-q-list stagger-children">
            {questions.map((q) => (
              <div
                key={q.id}
                className={`dn-q-card card ${q.isAnswered ? 'dn-q-card--answered' : ''}`}
                onClick={() => handleToggleQuestion(q.id)}
              >
                <button
                  type="button"
                  className="dn-q-check-btn"
                  aria-label={q.isAnswered ? 'Tandai belum dijawab' : 'Tandai sudah dijawab'}
                >
                  {q.isAnswered ? (
                    <CheckCircle2 size={20} color="var(--color-secondary)" />
                  ) : (
                    <Circle size={20} color="var(--color-text-tertiary)" />
                  )}
                </button>

                <div className="dn-q-body">
                  <p className={`dn-q-text ${q.isAnswered ? 'dn-q-text--answered' : ''}`}>{q.text}</p>
                  <span className="dn-q-status">
                    {q.isAnswered ? '✓ Sudah ditanyakan' : 'Perlu ditanyakan saat periksa'}
                  </span>
                </div>

                <button
                  type="button"
                  className="dn-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuestion(q.id);
                  }}
                  title="Hapus pertanyaan"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="dn-empty-card card">
                <span className="dn-empty-emoji">📝</span>
                <p>Belum ada daftar pertanyaan. Tulis hal yang ingin Anda konsultasikan ke dokter!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: RIWAYAT KONTROL --- */}
      {activeTab === 'history' && (
        <div className="dn-section animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          {/* Action to add visit */}
          {!showVisitForm ? (
            <button
              className="btn btn-primary btn-full dn-new-visit-trigger"
              onClick={() => setShowVisitForm(true)}
            >
              <Plus size={18} /> Catat Hasil Kontrol Baru
            </button>
          ) : (
            /* Add Visit Form */
            <form className="dn-visit-form card animate-scale-in" onSubmit={handleSaveVisit}>
              <div className="dn-form-header">
                <h4>Catat Kunjungan Dokter</h4>
                <button
                  type="button"
                  className="btn btn-ghost text-xs"
                  onClick={() => setShowVisitForm(false)}
                >
                  Tutup
                </button>
              </div>

              <div className="dn-form-grid">
                <div className="input-group">
                  <label>Tanggal Periksa</label>
                  <input
                    type="date"
                    className="input-field"
                    value={visitForm.date}
                    onChange={(e) => setVisitForm((f) => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Usia Janin (Minggu ke-)</label>
                  <input
                    type="number"
                    className="input-field"
                    min="1"
                    max="42"
                    value={visitForm.week}
                    onChange={(e) => setVisitForm((f) => ({ ...f, week: e.target.value }))}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Tekanan Darah (Tensi)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Contoh: 110/70"
                    value={visitForm.bloodPressure}
                    onChange={(e) => setVisitForm((f) => ({ ...f, bloodPressure: e.target.value }))}
                  />
                </div>

                <div className="input-group">
                  <label>Berat Badan Mama (kg)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Contoh: 58.5"
                    value={visitForm.motherWeight}
                    onChange={(e) => setVisitForm((f) => ({ ...f, motherWeight: e.target.value }))}
                  />
                </div>

                <div className="input-group">
                  <label>Berat Janin / TFU (opsional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Contoh: 1200 gram"
                    value={visitForm.babyWeight}
                    onChange={(e) => setVisitForm((f) => ({ ...f, babyWeight: e.target.value }))}
                  />
                </div>

                <div className="input-group">
                  <label>Dokter / Rumah Sakit</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nama Sp.OG / Bidan / Faskes"
                    value={visitForm.doctorName}
                    onChange={(e) => setVisitForm((f) => ({ ...f, doctorName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '10px' }}>
                <label>Catatan Dokter / Resep Vitamin</label>
                <textarea
                  className="input-field dn-textarea"
                  rows={3}
                  placeholder="Contoh: Posisi janin bagus kepala sudah di bawah, air ketuban cukup, lanjut minum kalsium & tablet tambah darah."
                  value={visitForm.doctorNotes}
                  onChange={(e) => setVisitForm((f) => ({ ...f, doctorNotes: e.target.value }))}
                />
              </div>

              <div className="dn-form-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowVisitForm(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Catatan
                </button>
              </div>
            </form>
          )}

          {/* Visits History Timeline */}
          <div className="dn-visits-list stagger-children">
            {visits.map((v) => (
              <div key={v.id} className="dn-visit-card card">
                <div className="dn-visit-header">
                  <div className="dn-visit-meta">
                    <span className="dn-visit-week-badge">Minggu ke-{v.week}</span>
                    <span className="dn-visit-date">
                      <Calendar size={13} /> {formatDateID(v.date)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="dn-delete-btn"
                    onClick={() => handleDeleteVisit(v.id)}
                    title="Hapus riwayat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {v.doctorName && <div className="dn-visit-doctor">🩺 {v.doctorName}</div>}

                <div className="dn-visit-metrics">
                  {v.bloodPressure && (
                    <div className="dn-metric-chip">
                      <Activity size={14} color="var(--color-primary)" />
                      <span>Tensi:</span> <strong>{v.bloodPressure}</strong>
                    </div>
                  )}
                  {v.motherWeight && (
                    <div className="dn-metric-chip">
                      <Weight size={14} color="var(--color-secondary)" />
                      <span>BB Mama:</span> <strong>{v.motherWeight} kg</strong>
                    </div>
                  )}
                  {v.babyWeight && (
                    <div className="dn-metric-chip">
                      <span>👶 Janin:</span> <strong>{v.babyWeight}</strong>
                    </div>
                  )}
                </div>

                {v.doctorNotes && (
                  <div className="dn-visit-notes">
                    <span className="dn-notes-label">Catatan Medis:</span>
                    <p>{v.doctorNotes}</p>
                  </div>
                )}
              </div>
            ))}

            {visits.length === 0 && !showVisitForm && (
              <div className="dn-empty-card card">
                <span className="dn-empty-emoji">🩺</span>
                <p>Belum ada catatan kontrol. Klik tombol di atas untuk mencatat kunjungan dokter pertama Anda!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorNotes;
