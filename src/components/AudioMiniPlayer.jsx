import { Square, Maximize2, Play, Volume2 } from 'lucide-react';
import { RELAXATION_SOUNDS } from '../data/audioSounds';
import './AudioMiniPlayer.css';

export default function AudioMiniPlayer({
  isPlaying,
  activeSound,
  onOpenModal,
  onStop,
  onTogglePlay,
}) {
  if (!isPlaying) return null;

  const currentSound =
    RELAXATION_SOUNDS.find((s) => s.id === activeSound) || RELAXATION_SOUNDS[0];
  const Icon = currentSound.icon;

  return (
    <div className="audio-mini-player animate-fade-in-up" role="region" aria-label="Pemutar Audio Mini">
      <div
        className="mini-player-body"
        onClick={onOpenModal}
        role="button"
        tabIndex={0}
      >
        <div
          className="mini-player-icon"
          style={{
            backgroundColor: `${currentSound.color}22`,
            color: currentSound.color,
          }}
        >
          <Icon size={16} className="animate-pulse" />
        </div>

        <div className="mini-player-info">
          <div className="mini-player-wave">
            <span className="wave-bar bar-1" />
            <span className="wave-bar bar-2" />
            <span className="wave-bar bar-3" />
          </div>
          <span className="mini-player-title">{currentSound.shortName}</span>
        </div>
      </div>

      <div className="mini-player-actions">
        <button
          type="button"
          className="mini-player-btn mini-player-btn--play"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Jeda' : 'Putar'}
          title={isPlaying ? 'Jeda' : 'Putar'}
        >
          {isPlaying ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
        </button>

        <button
          type="button"
          className="mini-player-btn"
          onClick={onOpenModal}
          aria-label="Perbesar Pemutar"
          title="Buka Layar Penuh"
        >
          <Maximize2 size={14} />
        </button>

        <button
          type="button"
          className="mini-player-btn mini-player-btn--close"
          onClick={onStop}
          aria-label="Hentikan Audio"
          title="Tutup & Hentikan"
        >
          <Square size={12} />
        </button>
      </div>
    </div>
  );
}
