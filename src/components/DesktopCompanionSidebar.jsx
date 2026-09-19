import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  CheckSquare,
  Home,
  User,
  Luggage,
  Stethoscope,
  Apple,
  Calculator,
  Building2,
  Activity,
  Coins,
  Headphones,
  PhoneCall,
  AlertTriangle,
  Heart,
  Baby,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../App';
import { LAMPUNG_HOSPITALS } from '../data/lampungHospitals';
import './DesktopCompanionSidebar.css';

export default function DesktopCompanionSidebar({ onOpenAudio }) {
  const { profile, pregnancyData, role, setRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!profile) return null;

  const navItems = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/timeline', label: 'Timeline & Jadwal USG', icon: Calendar },
    { path: '/checklist', label: 'Checklist Kehamilan', icon: CheckSquare },
    { path: '/hospital-bag', label: 'Tas Bersalin RS', icon: Luggage },
    { path: '/doctor-notes', label: 'Catatan & Tanya Dokter', icon: Stethoscope },
    { path: '/nutrition', label: 'Nutrisi & Mitos', icon: Apple },
    { path: '/calculator', label: 'Kalkulator HPL / CRL', icon: Calculator },
    { path: '/hospitals', label: 'Faskes Bandar Lampung', icon: Building2 },
    { path: '/labor-tools', label: 'Tendangan & Kontraksi', icon: Activity },
    { path: '/cost-simulator', label: 'Simulasi Biaya Lahiran', icon: Coins },
    { path: '/profile', label: 'Profil & Pengaturan', icon: User },
  ];

  return (
    <>
      {/* Left Companion Panel */}
      <aside className="desktop-sidebar desktop-sidebar--left" aria-label="Navigasi Desktop">
        <div className="desk-brand">
          <div className="desk-logo" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Bumil Ceria" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
          </div>
          <div>
            <h3>Bumil Ceria</h3>
            <p className="text-xs text-secondary">Perjalanan Indah Bersama</p>
          </div>
        </div>

        {/* Status Profile Pill */}
        <div className="desk-profile-card card">
          <div className="desk-profile-header">
            <strong>{profile.motherName || 'Mama'} & {profile.fatherName || 'Papa'}</strong>
            <button
              className={`desk-role-toggle ${role === 'mama' ? 'desk-role--mama' : 'desk-role--papa'}`}
              onClick={() => setRole(role === 'mama' ? 'papa' : 'mama')}
              title="Ganti Mode Tampilan"
            >
              Mode: {role === 'mama' ? '🌸 Mama' : '💼 Papa'}
            </button>
          </div>
          {pregnancyData && (
            <div className="desk-pregnancy-metric">
              <div className="desk-week-pill">
                Minggu ke-<strong>{pregnancyData.currentWeek}</strong> (+{pregnancyData.currentDay} hari)
              </div>
              <p className="text-xs text-secondary" style={{ marginTop: '4px' }}>
                {pregnancyData.trimester?.label || 'Trimester'} • Sisa {pregnancyData.daysRemaining} hari menuju HPL
              </p>
            </div>
          )}
        </div>

        {/* Audio Relaxation Quick Card */}
        <div
          className="desk-audio-card card"
          onClick={onOpenAudio}
          role="button"
          tabIndex={0}
        >
          <div className="desk-audio-icon">
            <Headphones size={20} />
          </div>
          <div className="desk-audio-info">
            <strong>Audio Relaksasi</strong>
            <p className="text-xs text-secondary">Denyut rahim, ombak & napas 4-7-8</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="desk-nav-menu">
          <span className="desk-menu-title">Menu Cepat</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                className={`desk-nav-btn ${isActive ? 'desk-nav-btn--active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Right Companion Panel */}
      <aside className="desktop-sidebar desktop-sidebar--right" aria-label="Informasi Darurat & Faskes">
        {/* Emergency Quick Action */}
        <div className="desk-alert-card card">
          <div className="desk-alert-header">
            <ShieldAlert size={20} color="#e5484d" />
            <strong>Panggilan IGD Siaga 24 Jam</strong>
          </div>
          <p className="text-xs text-secondary" style={{ marginBottom: '10px' }}>
            Hubungi langsung IGD Rumah Sakit Bandar Lampung jika terjadi gawat darurat:
          </p>

          <div className="desk-emergency-list">
            {LAMPUNG_HOSPITALS.slice(0, 4).map((h) => (
              <a
                key={h.id}
                href={`tel:${h.phone}`}
                className="desk-emergency-item"
                title={`Telepon IGD ${h.name}`}
              >
                <div className="desk-em-info">
                  <strong>{h.name}</strong>
                  <span className="text-xs text-secondary">{h.phone}</span>
                </div>
                <div className="desk-em-call-btn">
                  <PhoneCall size={14} /> Hubungi
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Red Flags Card */}
        <div className="desk-redflags-card card">
          <div className="desk-redflags-header">
            <AlertTriangle size={18} color="#d97706" />
            <strong>Tanda Bahaya Kehamilan</strong>
          </div>
          <ul className="desk-redflags-list text-xs">
            <li>🚨 Perdarahan segar dari jalan lahir</li>
            <li>🌊 Ketuban pecah atau merembes dini</li>
            <li>⚡ Pusing berputar, pandangan kabur, atau nyeri ulu hati (tanda Preeklamsia)</li>
            <li>👶 Gerakan janin berkurang drastis (&lt; 10 tendangan dalam 2 jam)</li>
            <li>🌡️ Demam tinggi &gt; 38°C atau menggigil</li>
          </ul>
        </div>
      </aside>
    </>
  );
}
