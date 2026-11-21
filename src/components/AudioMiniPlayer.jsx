import { Pause, Maximize2, Play, X } from 'lucide-react';
import { RELAXATION_SOUNDS } from '../data/audioSounds';
import './AudioMiniPlayer.css';

export default function AudioMiniPlayer({
  isVisible,
  isPlaying,
  activeSound,
  onOpenModal,
  onStop,
  onTogglePlay,
  hasBottomNav = true,
}) {
  if (!isVisible) return null;

  const currentSound =
    RELAXATION_SOUNDS.find((s) => s.id === activeSound) || RELAXATION_SOUNDS[0];
  const Icon = currentSound.icon;

  return (
    <div
      className={`audio-mini-player ${!hasBottomNav ? 'audio-mini-player--subpage' : ''}`}
      role="region"
      aria-label="Pemutar Audio Mini"
    >
      <button
        type="button"
        className="mini-player-body"
        onClick={onOpenModal}
        aria-label={`Buka pemutar audio ${currentSound.shortName}`}
      >
        <span
          className="mini-player-icon"
          style={{
            backgroundColor: `${currentSound.color}22`,
            color: currentSound.color,
          }}
          aria-hidden="true"
        >
          <Icon size={16} />
        </span>

        <span className="mini-player-info">
          <span className={`mini-player-wave ${!isPlaying ? 'mini-player-wave--paused' : ''}`} aria-hidden="true">
            <span className="wave-bar bar-1" />
            <span className="wave-bar bar-2" />
            <span className="wave-bar bar-3" />
          </span>
          <span className="mini-player-title">{currentSound.shortName}</span>
        </span>
      </button>

      <div className="mini-player-actions">
        <button
          type="button"
          className="mini-player-btn mini-player-btn--play"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Jeda audio' : 'Putar audio'}
          title={isPlaying ? 'Jeda' : 'Putar'}
        >
          {isPlaying ? <Pause size={15} fill="currentColor" aria-hidden="true" /> : <Play size={15} fill="currentColor" aria-hidden="true" />}
        </button>

        <button
          type="button"
          className="mini-player-btn"
          onClick={onOpenModal}
          aria-label="Perbesar pemutar audio"
          title="Buka Layar Penuh"
        >
          <Maximize2 size={15} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="mini-player-btn mini-player-btn--close"
          onClick={onStop}
          aria-label="Hentikan audio"
          title="Tutup & Hentikan"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
