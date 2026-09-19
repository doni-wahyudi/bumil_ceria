import { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  X,
  Headphones,
  Heart,
  Waves,
  CloudRain,
  Wind,
  Clock,
  Sparkles,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';
import { RELAXATION_SOUNDS } from '../data/audioSounds';
import './AudioRelaxationModal.css';

export default function AudioRelaxationModal({
  isOpen,
  onClose,
  activeSound: controlledSound,
  setActiveSound: setControlledSound,
  isPlaying: controlledPlaying,
  setIsPlaying: setControlledPlaying,
}) {
  const [internalSound, setInternalSound] = useState('heartbeat');
  const [internalPlaying, setInternalPlaying] = useState(false);

  const activeSound = controlledSound !== undefined ? controlledSound : internalSound;
  const setActiveSound = setControlledSound || setInternalSound;
  const isPlaying = controlledPlaying !== undefined ? controlledPlaying : internalPlaying;
  const setIsPlaying = setControlledPlaying || setInternalPlaying;

  const [volume, setVolume] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [breathePhase, setBreathePhase] = useState('tarik'); // 'tarik' (4s) | 'tahan' (7s) | 'hembus' (8s)
  const [breatheTimer, setBreatheTimer] = useState(4);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null); // null | 15 | 30 | 45
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState(null);

  const breatheIntervalRef = useRef(null);
  const sleepTimerRef = useRef(null);

  // Volume synchronization
  useEffect(() => {
    audioSynth.setVolume(isMuted ? 0 : volume / 100);
  }, [volume, isMuted]);

  // Handle Play / Stop
  const handleTogglePlay = (soundId = activeSound) => {
    if (isPlaying && activeSound === soundId) {
      stopPlayback();
    } else {
      startPlayback(soundId);
    }
  };

  const startPlayback = (soundId) => {
    setActiveSound(soundId);
    setIsPlaying(true);

    if (soundId === 'heartbeat') {
      audioSynth.playHeartbeat();
    } else if (soundId === 'waves') {
      audioSynth.playWaves();
    } else if (soundId === 'rain') {
      audioSynth.playRain();
    } else if (soundId === 'breathe') {
      audioSynth.stop();
      startBreathingGuide();
    }
  };

  const stopPlayback = () => {
    audioSynth.stop();
    setIsPlaying(false);
    if (breatheIntervalRef.current) {
      clearInterval(breatheIntervalRef.current);
      breatheIntervalRef.current = null;
    }
  };

  // 4-7-8 Breathing Guide Engine
  const startBreathingGuide = () => {
    if (breatheIntervalRef.current) clearInterval(breatheIntervalRef.current);

    let phase = 'tarik';
    let timeLeft = 4;
    setBreathePhase(phase);
    setBreatheTimer(timeLeft);
    audioSynth.playTone(528, 1.2); // Bell chime on start

    breatheIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        if (phase === 'tarik') {
          phase = 'tahan';
          timeLeft = 7;
          audioSynth.playTone(440, 1.0);
        } else if (phase === 'tahan') {
          phase = 'hembus';
          timeLeft = 8;
          audioSynth.playTone(350, 1.5);
        } else {
          phase = 'tarik';
          timeLeft = 4;
          audioSynth.playTone(528, 1.2);
        }
        setBreathePhase(phase);
      }
      setBreatheTimer(timeLeft);
    }, 1000);
  };

  // Sleep Timer logic
  useEffect(() => {
    if (sleepTimerMinutes && isPlaying) {
      setSleepTimerSecondsLeft(sleepTimerMinutes * 60);
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);

      sleepTimerRef.current = setInterval(() => {
        setSleepTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            stopPlayback();
            clearInterval(sleepTimerRef.current);
            setSleepTimerMinutes(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isPlaying) {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
      setSleepTimerSecondsLeft(null);
    }

    return () => {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    };
  }, [sleepTimerMinutes, isPlaying]);

  // Clean up when modal unmounts
  useEffect(() => {
    return () => {
      // Keep audio playing even if modal closes (user can reopen or tap mini player)
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="audio-modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="audio-modal-dialog animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="audio-modal-header">
          <div className="audio-modal-title">
            <div className="audio-title-icon">
              <Headphones size={20} />
            </div>
            <div>
              <h3>Audio Relaksasi & Meditasi</h3>
              <p className="text-xs text-secondary">Suara penenang janin & pereda kecemasan</p>
            </div>
          </div>
          <button className="audio-close-btn" onClick={onClose} aria-label="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* 4-7-8 Interactive Breathing Visualizer */}
        {activeSound === 'breathe' && isPlaying && (
          <div className="breathe-visualizer-card">
            <div className={`breathe-circle breathe-circle--${breathePhase}`}>
              <div className="breathe-circle-inner">
                <span className="breathe-phase-label">
                  {breathePhase === 'tarik' && 'Tarik Napas'}
                  {breathePhase === 'tahan' && 'Tahan Napas'}
                  {breathePhase === 'hembus' && 'Hembuskan'}
                </span>
                <span className="breathe-phase-timer">{breatheTimer}s</span>
              </div>
            </div>
            <p className="breathe-hint text-xs text-secondary">
              Metode 4-7-8 terbukti menurunkan detak jantung dan menenangkan otot rahim.
            </p>
          </div>
        )}

        {/* Sound Selection Grid */}
        <div className="audio-sound-grid">
          {RELAXATION_SOUNDS.map((sound) => {
            const Icon = sound.icon;
            const isThisActive = activeSound === sound.id;
            const isThisPlaying = isThisActive && isPlaying;

            return (
              <div
                key={sound.id}
                className={`audio-sound-card card ${isThisActive ? 'audio-sound-card--active' : ''}`}
                onClick={() => handleTogglePlay(sound.id)}
                role="button"
                tabIndex={0}
              >
                <div
                  className="audio-sound-icon"
                  style={{
                    backgroundColor: `${sound.color}22`,
                    color: sound.color,
                  }}
                >
                  <Icon size={24} className={isThisPlaying ? 'animate-pulse' : ''} />
                </div>
                <div className="audio-sound-info">
                  <div className="audio-sound-top">
                    <strong>{sound.title}</strong>
                    {isThisPlaying && (
                      <span className="audio-live-indicator">
                        <span className="audio-live-dot" /> Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary">{sound.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Player Controls Bar */}
        <div className="audio-controls-panel card">
          <div className="audio-playback-row">
            <button
              type="button"
              className="btn btn-primary audio-play-btn"
              onClick={() => handleTogglePlay(activeSound)}
            >
              {isPlaying ? (
                <>
                  <Square size={16} fill="currentColor" /> Berhenti
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" /> Putar Suara
                </>
              )}
            </button>

            {/* Volume Control */}
            <div className="audio-volume-wrap">
              <button
                type="button"
                className="audio-mute-btn"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="audio-volume-slider"
              />
            </div>
          </div>

          {/* Sleep Timer Bar */}
          <div className="audio-sleep-timer">
            <div className="audio-sleep-label">
              <Clock size={14} />
              <span>Timer Tidur:</span>
              {sleepTimerSecondsLeft && (
                <span className="audio-timer-countdown">
                  ({Math.floor(sleepTimerSecondsLeft / 60)}:{(sleepTimerSecondsLeft % 60).toString().padStart(2, '0')})
                </span>
              )}
            </div>
            <div className="audio-sleep-pills">
              {[null, 15, 30, 45].map((mins) => (
                <button
                  key={mins ?? 'off'}
                  type="button"
                  className={`audio-sleep-pill ${sleepTimerMinutes === mins ? 'audio-sleep-pill--active' : ''}`}
                  onClick={() => setSleepTimerMinutes(mins)}
                >
                  {mins ? `${mins}m` : 'Mati'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
