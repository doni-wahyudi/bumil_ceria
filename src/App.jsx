import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isOnboardingDone, getProfile } from './utils/storage';
import { getCurrentWeek, getCurrentDay, getTrimester, getDaysRemaining, getProgressPercentage, calculateDueDate } from './utils/pregnancyCalc';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Timeline from './pages/Timeline';
import Checklist from './pages/Checklist';
import Profile from './pages/Profile';
import HospitalBag from './pages/HospitalBag';
import DoctorNotes from './pages/DoctorNotes';
import NutritionGuide from './pages/NutritionGuide';
import PregnancyCalc from './pages/PregnancyCalc';
import HospitalDirectory from './pages/HospitalDirectory';
import LaborTools from './pages/LaborTools';
import CostSimulator from './pages/CostSimulator';
import BottomNav from './components/BottomNav';
import DesktopCompanionSidebar from './components/DesktopCompanionSidebar';
import AudioRelaxationModal from './components/AudioRelaxationModal';
import AudioMiniPlayer from './components/AudioMiniPlayer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { audioSynth } from './utils/audioSynth';
import { Headphones } from 'lucide-react';
import './index.css';

// Global context for app state
export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

function App() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('mama'); // 'mama' | 'papa'
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [activeSound, setActiveSound] = useState('heartbeat');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleStopAudio = () => {
    audioSynth.stop();
    setIsPlayingAudio(false);
  };

  const handleToggleMiniPlay = () => {
    if (isPlayingAudio) {
      handleStopAudio();
    } else {
      setIsPlayingAudio(true);
      if (activeSound === 'heartbeat') audioSynth.playHeartbeat();
      else if (activeSound === 'waves') audioSynth.playWaves();
      else if (activeSound === 'rain') audioSynth.playRain();
      else if (activeSound === 'breathe') audioSynth.playTone(528, 1.2);
    }
  };

  useEffect(() => {
    // Phase 3: Initialize Theme
    const savedTheme = localStorage.getItem('bumpbuddy_theme') || 'system';
    if (savedTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    async function init() {
      const done = await isOnboardingDone();
      const prof = await getProfile();
      setOnboarded(done);
      setProfile(prof);
      setReady(true);
    }
    init();
  }, []);

  const refreshProfile = async () => {
    const prof = await getProfile();
    setProfile(prof);
  };

  // Derived pregnancy data
  const pregnancyData = profile?.hpht
    ? {
        currentWeek: getCurrentWeek(profile.hpht),
        currentDay: getCurrentDay(profile.hpht),
        trimester: getTrimester(getCurrentWeek(profile.hpht)),
        daysRemaining: getDaysRemaining(profile.hpht),
        progress: getProgressPercentage(getCurrentWeek(profile.hpht)),
        dueDate: calculateDueDate(profile.hpht),
      }
    : null;

  if (!ready) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const contextValue = {
    profile,
    setProfile,
    refreshProfile,
    role,
    setRole,
    pregnancyData,
    onboarded,
    setOnboarded,
    openAudioModal: () => setShowAudioModal(true),
    closeAudioModal: () => setShowAudioModal(false),
    activeSound,
    setActiveSound,
    isPlayingAudio,
    setIsPlayingAudio,
    stopAudio: handleStopAudio,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        {!onboarded ? (
          <div className="app-container">
            <Routes>
              <Route path="*" element={<Onboarding />} />
            </Routes>
          </div>
        ) : (
          <div className="desktop-layout-wrapper">
            <DesktopCompanionSidebar onOpenAudio={() => setShowAudioModal(true)} />

            <div className="app-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/checklist" element={<Checklist />} />
                <Route path="/profile" element={<Profile />} />
                {/* Phase 2 Enhanced Feature Routes */}
                <Route path="/hospital-bag" element={<HospitalBag />} />
                <Route path="/doctor-notes" element={<DoctorNotes />} />
                <Route path="/nutrition" element={<NutritionGuide />} />
                <Route path="/calculator" element={<PregnancyCalc />} />
                {/* Phase 3 Hospital Directory Route */}
                <Route path="/hospitals" element={<HospitalDirectory />} />
                {/* Phase 4 Kick Counter, Contraction Timer & Cost Simulator */}
                <Route path="/labor-tools" element={<LaborTools />} />
                <Route path="/cost-simulator" element={<CostSimulator />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <BottomNav />

              {/* Persistent Mini Audio Player when audio is active */}
              <AudioMiniPlayer
                isPlaying={isPlayingAudio && !showAudioModal}
                activeSound={activeSound}
                onOpenModal={() => setShowAudioModal(true)}
                onStop={handleStopAudio}
                onTogglePlay={handleToggleMiniPlay}
              />

              {/* Mobile Floating Audio Pill (when audio is not actively playing) */}
              {!isPlayingAudio && (
                <button
                  type="button"
                  className="mobile-audio-fab"
                  onClick={() => setShowAudioModal(true)}
                  aria-label="Buka Audio Relaksasi"
                  title="Audio Relaksasi Rahim & Meditasi"
                >
                  <Headphones size={18} />
                  <span>Relaksasi</span>
                </button>
              )}

              <PWAInstallPrompt hasMiniPlayer={isPlayingAudio && !showAudioModal} />
            </div>

            <AudioRelaxationModal
              isOpen={showAudioModal}
              onClose={() => setShowAudioModal(false)}
              activeSound={activeSound}
              setActiveSound={setActiveSound}
              isPlaying={isPlayingAudio}
              setIsPlaying={setIsPlayingAudio}
            />
          </div>
        )}
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
