import { useRef, useEffect } from 'react';
import './WeekSelector.css';

function WeekSelector({ currentWeek, selectedWeek, onSelectWeek, totalWeeks = 40 }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const targetWeek = selectedWeek || currentWeek;
    const targetBtn = container.querySelector(`[data-week="${targetWeek}"]`);

    if (targetBtn) {
      const pillLeft = targetBtn.offsetLeft;
      const pillWidth = targetBtn.offsetWidth;
      const containerWidth = container.clientWidth;
      const targetScrollLeft = pillLeft - (containerWidth / 2) + (pillWidth / 2);

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });
    }
  }, [currentWeek, selectedWeek]);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="week-selector" id="week-selector" role="region" aria-label="Pilih minggu kehamilan">
      <div className="week-selector__scroll" ref={scrollRef}>
        {weeks.map((w) => {
          const isCurrent = w === currentWeek;
          const isSelected = w === selectedWeek;
          const isPast = w < currentWeek;
          return (
            <button
              key={w}
              type="button"
              data-week={w}
              className={`week-pill ${isCurrent ? 'week-pill--current' : ''} ${isSelected && !isCurrent ? 'week-pill--selected' : ''} ${isPast ? 'week-pill--past' : ''}`}
              onClick={() => onSelectWeek(w)}
              aria-label={`Minggu ${w}${isCurrent ? ' (Minggu ini)' : ''}`}
              aria-pressed={isSelected}
            >
              <span className="week-pill__num tabular-nums">{w}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WeekSelector;
