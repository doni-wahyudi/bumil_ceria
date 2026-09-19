import { useRef, useEffect } from 'react';
import './WeekSelector.css';

function WeekSelector({ currentWeek, selectedWeek, onSelectWeek, totalWeeks = 40 }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeBtn = scrollRef.current.querySelector('.week-pill--current');
      if (activeBtn) {
        activeBtn.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentWeek]);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="week-selector" id="week-selector">
      <div className="week-selector__scroll" ref={scrollRef}>
        {weeks.map((w) => {
          const isCurrent = w === currentWeek;
          const isSelected = w === selectedWeek;
          const isPast = w < currentWeek;
          return (
            <button
              key={w}
              className={`week-pill ${isCurrent ? 'week-pill--current' : ''} ${isSelected && !isCurrent ? 'week-pill--selected' : ''} ${isPast ? 'week-pill--past' : ''}`}
              onClick={() => onSelectWeek(w)}
              aria-label={`Minggu ${w}`}
            >
              <span className="week-pill__num">{w}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WeekSelector;
