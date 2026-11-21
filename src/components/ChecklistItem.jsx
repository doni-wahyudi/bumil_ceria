import { useState } from 'react';
import { Check } from 'lucide-react';
import './ChecklistItem.css';

function ChecklistItem({ item, isCompleted, onToggle }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle(item.id);
    setTimeout(() => setIsAnimating(false), 350);
  };

  return (
    <button
      type="button"
      className={`checklist-item ${isCompleted ? 'checklist-item--completed' : ''} ${isAnimating ? 'checklist-item--animating' : ''}`}
      onClick={handleToggle}
      aria-pressed={isCompleted}
      aria-label={`${isCompleted ? 'Selesai' : 'Belum selesai'}: ${item.text}`}
      id={`checklist-${item.id}`}
    >
      <div
        className={`checklist-item__check ${isCompleted ? 'checklist-item__check--done' : ''}`}
        aria-hidden="true"
      >
        {isCompleted && <Check size={14} strokeWidth={3} color="var(--color-text-inverse)" />}
      </div>
      <div className="checklist-item__content">
        <span className="checklist-item__text">{item.text}</span>
        {item.week && (
          <span className="checklist-item__meta tabular-nums">Minggu {item.week}</span>
        )}
      </div>
      {item.priority === 'high' && !isCompleted && (
        <span className="checklist-item__priority badge badge-usg">Penting</span>
      )}
    </button>
  );
}

export default ChecklistItem;
