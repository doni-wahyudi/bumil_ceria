import { useState } from 'react';
import { useApp } from '../App';
import { getWeekData } from '../data/weeklyData';
import { hasUSGInWeek, getUSGForWeek } from '../data/usgSchedule';
import WeekSelector from '../components/WeekSelector';
import USGTimeline from '../components/USGTimeline';
import { ChevronDown, ChevronUp, Stethoscope } from 'lucide-react';
import './Timeline.css';

function Timeline() {
  const { pregnancyData, role } = useApp();
  const currentWeek = pregnancyData?.currentWeek || 1;
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [tab, setTab] = useState('week'); // 'week' | 'usg'
  const [expandedWeeks, setExpandedWeeks] = useState(new Set([currentWeek]));

  const weekData = getWeekData(selectedWeek);
  const hasUSG = hasUSGInWeek(selectedWeek);
  const usgData = getUSGForWeek(selectedWeek);

  const toggleExpand = (week) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      next.has(week) ? next.delete(week) : next.add(week);
      return next;
    });
  };

  return (
    <div className="page-content timeline-page" id="timeline-page">
      <header className="timeline-header animate-fade-in-up">
        <h2>Timeline Kehamilan</h2>
      </header>

      {/* Tab toggle */}
      <div className="timeline-tabs animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <button
          className={`timeline-tab ${tab === 'week' ? 'timeline-tab--active' : ''}`}
          onClick={() => setTab('week')}
        >
          Mingguan
        </button>
        <button
          className={`timeline-tab ${tab === 'usg' ? 'timeline-tab--active' : ''}`}
          onClick={() => setTab('usg')}
        >
          <Stethoscope size={16} /> Jadwal USG
        </button>
      </div>

      {tab === 'week' ? (
        <>
          {/* Week Selector */}
          <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <WeekSelector
              currentWeek={currentWeek}
              selectedWeek={selectedWeek}
              onSelectWeek={setSelectedWeek}
            />
          </div>

          {/* Week Detail */}
          {weekData && (
            <div className="timeline-week-detail animate-fade-in-up" style={{ animationDelay: '180ms' }}>
              <div className="timeline-week-card card">
                <div className="timeline-week-card__header">
                  <div>
                    <span className="eyebrow">
                      Minggu {selectedWeek} • {weekData.trimester === 1 ? 'Trimester 1' : weekData.trimester === 2 ? 'Trimester 2' : 'Trimester 3'}
                    </span>
                    <h3>Perkembangan Bayi</h3>
                  </div>
                  <span className="timeline-week-card__size-emoji">{weekData.babySizeEmoji}</span>
                </div>

                <div className="timeline-week-card__size">
                  <span className="text-sm text-secondary">Ukuran: </span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{weekData.babySize}</span>
                </div>

                <p className="timeline-week-card__dev">{weekData.babyDevelopment}</p>

                {hasUSG && usgData && (
                  <div className="timeline-week-card__usg">
                    <span className="badge badge-usg">📋 USG: {usgData.title}</span>
                    <p className="text-sm text-secondary" style={{ marginTop: 'var(--space-2)' }}>
                      {usgData.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Mama section */}
              <button
                className="timeline-section-toggle card"
                onClick={() => toggleExpand(`mama-${selectedWeek}`)}
              >
                <div className="timeline-section-toggle__header">
                  <span>👩 Kondisi Mama</span>
                  {expandedWeeks.has(`mama-${selectedWeek}`) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>
              {expandedWeeks.has(`mama-${selectedWeek}`) && (
                <div className="timeline-section-content card animate-fade-in-up">
                  <div className="timeline-info-block">
                    <h5>Gejala & Perubahan</h5>
                    <p>{weekData.mamaSymptoms}</p>
                  </div>
                  <div className="timeline-info-block">
                    <h5>Tips</h5>
                    <p>{weekData.mamaTips}</p>
                  </div>
                </div>
              )}

              {/* Checklist preview */}
              <button
                className="timeline-section-toggle card"
                onClick={() => toggleExpand(`checklist-${selectedWeek}`)}
              >
                <div className="timeline-section-toggle__header">
                  <span>{role === 'mama' ? '📋 Checklist Mama' : '📋 Checklist Papa'}</span>
                  {expandedWeeks.has(`checklist-${selectedWeek}`) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>
              {expandedWeeks.has(`checklist-${selectedWeek}`) && (
                <div className="timeline-section-content card animate-fade-in-up">
                  <ul className="timeline-checklist-preview">
                    {(role === 'mama' ? weekData.mamaChecklist : weekData.papaChecklist).map((item) => (
                      <li key={item.id}>
                        <span className={`timeline-priority timeline-priority--${item.priority}`} />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* USG Tab */
        <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <USGTimeline currentWeek={currentWeek} />
        </div>
      )}
    </div>
  );
}

export default Timeline;
