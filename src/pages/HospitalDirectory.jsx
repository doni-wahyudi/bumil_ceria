import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  Search,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { LAMPUNG_HOSPITALS, EMERGENCY_RED_FLAGS } from '../data/lampungHospitals';
import './HospitalDirectory.css';

function HospitalDirectory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'bpjs' | 'rsia'
  const [showRedFlags, setShowRedFlags] = useState(false);

  const filteredHospitals = useMemo(() => {
    return LAMPUNG_HOSPITALS.filter((hosp) => {
      const matchSearch =
        hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.address.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (filter === 'bpjs') return hosp.bpjsAccept;
      if (filter === 'rsia') return hosp.type.includes('RSIA') || hosp.type.includes('Khusus Ibu & Anak');
      return true;
    });
  }, [searchQuery, filter]);

  return (
    <div className="page-content hospital-dir-page" id="hospital-dir-page">
      {/* Header */}
      <header className="hd-header animate-fade-in-up">
        <button className="hd-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="hd-header-badge">
            <Building2 size={14} /> Faskes Maternal Bandar Lampung
          </div>
          <h2>Direktori RS & Rujukan</h2>
        </div>
      </header>

      {/* Emergency Protocol & Red Flags Alert */}
      <section className="hd-emergency-card card animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <button
          type="button"
          className="hd-emergency-toggle"
          onClick={() => setShowRedFlags(!showRedFlags)}
        >
          <div className="hd-emergency-title">
            <AlertTriangle size={18} color="var(--color-danger)" />
            <span>Tanda Bahaya & Protokol Darurat IGD</span>
          </div>
          {showRedFlags ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        <div className="hd-bpjs-rule-box">
          <ShieldCheck size={16} color="var(--color-secondary-dark)" className="hd-shield-icon" />
          <p>
            <strong>Hak Pasien BPJS:</strong> Pada kondisi gawat darurat maternal (ketuban pecah, pendarahan, tensi tinggi), Anda <strong>berhak langsung masuk IGD rumah sakit manapun tanpa surat rujukan</strong> faskes 1!
          </p>
        </div>

        {showRedFlags && (
          <div className="hd-red-flags-list animate-fade-in-up">
            {EMERGENCY_RED_FLAGS.map((flag) => (
              <div key={flag.id} className="hd-flag-item">
                <span className="hd-flag-emoji">{flag.emoji}</span>
                <div className="hd-flag-content">
                  <div className="hd-flag-top">
                    <strong>{flag.title}</strong>
                    <span className="hd-urgency-badge">{flag.urgency}</span>
                  </div>
                  <p>{flag.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Search & Filter Bar */}
      <div className="hd-controls animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        <div className="hd-search-wrap card">
          <Search size={16} color="var(--color-text-tertiary)" />
          <input
            type="text"
            className="hd-search-input"
            placeholder="Cari RS atau kawasan (misal: Kedaton, Teluk)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="hd-filter-tabs">
          {[
            { id: 'all', label: 'Semua Faskes' },
            { id: 'bpjs', label: 'Bisa BPJS' },
            { id: 'rsia', label: 'Khusus RSIA' },
          ].map((f) => (
            <button
              key={f.id}
              className={`hd-filter-btn ${filter === f.id ? 'hd-filter-btn--active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards List */}
      <div className="hd-list stagger-children">
        {filteredHospitals.map((hosp) => (
          <div key={hosp.id} className="hd-card card">
            <div className="hd-card-top">
              <div>
                <div className="hd-badges-row">
                  <span className="hd-area-badge">{hosp.area}</span>
                  {hosp.bpjsAccept ? (
                    <span className="hd-bpjs-badge hd-bpjs-badge--yes">✓ BPJS</span>
                  ) : (
                    <span className="hd-bpjs-badge hd-bpjs-badge--no">Umum / Asuransi</span>
                  )}
                  {hosp.isTopRecommendation && (
                    <span className="hd-rec-badge">
                      <Sparkles size={11} /> Rekomendasi
                    </span>
                  )}
                </div>
                <h3 className="hd-card-name">{hosp.name}</h3>
                <span className="hd-card-type">{hosp.type}</span>
              </div>
            </div>

            <p className="hd-card-address">
              <MapPin size={14} className="hd-addr-icon" />
              <span>{hosp.address}</span>
            </p>

            <div className="hd-facilities-chips">
              {hosp.facilities.map((fac, idx) => (
                <span key={idx} className="hd-fac-chip">
                  {fac}
                </span>
              ))}
            </div>

            {/* Actions: Call & Maps */}
            <div className="hd-card-actions">
              <a
                href={`tel:${hosp.phoneRaw}`}
                className="btn btn-secondary hd-call-btn"
                title={`Hubungi ${hosp.name}`}
              >
                <Phone size={15} />
                <span>Panggil IGD ({hosp.phone})</span>
              </a>
              <a
                href={hosp.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost hd-maps-btn"
                title="Buka Navigasi Rute Maps"
              >
                <ExternalLink size={15} />
                <span>Rute Maps</span>
              </a>
            </div>
          </div>
        ))}

        {filteredHospitals.length === 0 && (
          <div className="hd-empty-card card">
            <span className="hd-empty-emoji">🏥</span>
            <p>Tidak ada faskes yang cocok dengan pencarian "{searchQuery}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HospitalDirectory;
