import { useState } from 'react';
import { Check } from 'lucide-react';
import './ChecklistItem.css';

const categoryColors = {
  pemeriksaan: { bg: '#FFF5E0', color: '#D4A84E', emoji: '🏥' },
  nutrisi: { bg: '#E8F5EB', color: '#6BAE7C', emoji: '💊' },
  dokumen: { bg: '#E3EDF3', color: '#6B8EA8', emoji: '📋' },
  kesehatan: { bg: '#F2E8F8', color: '#9B72B0', emoji: '🧘' },
  persiapan_bayi: { bg: '#FAEEF3', color: '#D88EAA', emoji: '👶' },
  keuangan: { bg: '#FFF5E0', color: '#D4A84E', emoji: '💰' },
  transportasi: { bg: '#E3EDF3', color: '#6B8EA8', emoji: '🚗' },
  support: { bg: '#E8F5EB', color: '#6BAE7C', emoji: '📱' },
  rumah: { bg: '#FAF0E6', color: '#B8860B', emoji: '🏠' },
};

function ChecklistItem({ item, isCompleted, onToggle }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const catStyle = categoryColors[item.category] || { bg: '#F0F0F0', color: '#888', emoji: '📌' };

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle(item.id);
    setTimeout(() => setIsAnimating(false), 350);
  };

  return (
    <button
      className={`checklist-item ${isCompleted ? 'checklist-item--completed' : ''} ${isAnimating ? 'checklist-item--animating' : ''}`}
      onClick={handleToggle}
      aria-label={`${isCompleted ? 'Selesai' : 'Belum'}: ${item.text}`}
      id={`checklist-${item.id}`}
    >
      <div
        className={`checklist-item__check ${isCompleted ? 'checklist-item__check--done' : ''}`}
        style={{ borderColor: isCompleted ? catStyle.color : undefined, background: isCompleted ? catStyle.color : undefined }}
      >
        {isCompleted && <Check size={14} strokeWidth={3} color="white" />}
      </div>
      <div className="checklist-item__content">
        <span className="checklist-item__text">{item.text}</span>
        {item.week && (
          <span className="checklist-item__meta">Minggu {item.week}</span>
        )}
      </div>
      {item.priority === 'high' && !isCompleted && (
        <span className="checklist-item__priority" title="Prioritas tinggi">!</span>
      )}
    </button>
  );
}

export default ChecklistItem;
