import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getWeekData } from '../data/weeklyData';
import { hasUSGInWeek, getUSGForWeek } from '../data/usgSchedule';
import WeekSelector from '../components/WeekSelector';
import USGTimeline from '../components/USGTimeline';
import FetalWombVisualizer from '../components/FetalWombVisualizer';
import { ChevronDown, ChevronUp, Stethoscope } from 'lucide-react';
import './Timeline.css';

function Timeline() {
  const { pregnancyData, role } = useApp();
  const currentWeek = pregnancyData?.currentWeek || 1;
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [tab, setTab] = useState('week'); // 'week' | 'usg'
  const [expandedWeeks, setExpandedWeeks] = useState(new Set([`mama-${currentWeek}`]));

  const weekData = getWeekData(selectedWeek);
  const hasUSG = hasUSGInWeek(selectedWeek);
  const usgData = getUSGForWeek(selectedWeek);

  const toggleExpand = (key) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="page-content timeline-page" id="timeline-page">
      <header className="timeline-header animate-fade-in-up">
        <h1>Timeline Kehamilan</h1>
      </header>

      {/* Tab toggle */}
      <div className="timeline-tabs animate-fade-in-up" role="tablist" aria-label="Tampilan timeline" style={{ animationDelay: '40ms' }}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'week'}
          className={`timeline-tab ${tab === 'week' ? 'timeline-tab--active' : ''}`}
          onClick={() => setTab('week')}
        >
          Mingguan
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'usg'}
          className={`timeline-tab ${tab === 'usg' ? 'timeline-tab--active' : ''}`}
          onClick={() => setTab('usg')}
        >
          <Stethoscope size={16} aria-hidden="true" />
          <span>Jadwal USG</span>
        </button>
      </div>

      {tab === 'week' ? (
        <>
          {/* Week Selector */}
          <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <WeekSelector
              currentWeek={currentWeek}
              selectedWeek={selectedWeek}
              onSelectWeek={setSelectedWeek}
            />
          </div>

          {/* Week Detail */}
          {weekData && (
            <div className="timeline-week-detail animate-fade-in-up" style={{ animationDelay: '120ms' }}>
              <FetalWombVisualizer
                week={selectedWeek}
                currentWeek={currentWeek}
                weekData={weekData}
                onWeekChange={setSelectedWeek}
              />

              <section className="timeline-week-card card">
                <div className="timeline-week-card__header">
                  <div>
                    <span className="eyebrow tabular-nums">
                      Minggu {selectedWeek} · {weekData.trimester === 1 ? 'Trimester 1' : weekData.trimester === 2 ? 'Trimester 2' : 'Trimester 3'}
                    </span>
                    <h2>Ringkasan Perkembangan Bayi</h2>
                  </div>
                  <span className="timeline-week-card__size-emoji" aria-hidden="true">{weekData.babySizeEmoji}</span>
                </div>

                <div className="timeline-week-card__size">
                  <span className="text-sm text-secondary">Ukuran: </span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{weekData.babySize}</span>
                </div>

                <p className="timeline-week-card__dev">{weekData.babyDevelopment}</p>

                {hasUSG && usgData && (
                  <div className="timeline-week-card__usg">
                    <span className="badge badge-usg">Jadwal USG: {usgData.title}</span>
                    <p className="text-sm text-secondary" style={{ marginTop: 'var(--space-2)' }}>
                      {usgData.description}
                    </p>
                  </div>
                )}
              </section>

              {/* Mama section */}
              <button
                type="button"
                className="timeline-section-toggle card"
                onClick={() => toggleExpand(`mama-${selectedWeek}`)}
                aria-expanded={expandedWeeks.has(`mama-${selectedWeek}`)}
              >
                <div className="timeline-section-toggle__header">
                  <span>Kondisi &amp; Tips Mama</span>
                  {expandedWeeks.has(`mama-${selectedWeek}`) ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                </div>
              </button>
              {expandedWeeks.has(`mama-${selectedWeek}`) && (
                <div className="timeline-section-content card animate-fade-in-up">
                  <div className="timeline-info-block">
                    <h3>Gejala &amp; Perubahan</h3>
                    <p>{weekData.mamaSymptoms}</p>
                  </div>
                  <div className="timeline-info-block">
                    <h3>Tips Minggu Ini</h3>
                    <p>{weekData.mamaTips}</p>
                  </div>
                </div>
              )}

              {/* Checklist preview */}
              <button
                type="button"
                className="timeline-section-toggle card"
                onClick={() => toggleExpand(`checklist-${selectedWeek}`)}
                aria-expanded={expandedWeeks.has(`checklist-${selectedWeek}`)}
              >
                <div className="timeline-section-toggle__header">
                  <span>{role === 'mama' ? 'Checklist Mama' : 'Checklist Papa'}</span>
                  {expandedWeeks.has(`checklist-${selectedWeek}`) ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                </div>
              </button>
              {expandedWeeks.has(`checklist-${selectedWeek}`) && (
                <div className="timeline-section-content card animate-fade-in-up">
                  <ul className="timeline-checklist-preview">
                    {(role === 'mama' ? weekData.mamaChecklist : weekData.papaChecklist).map((item) => (
                      <li key={item.id}>
                        <span className={`timeline-priority timeline-priority--${item.priority}`} aria-hidden="true" />
                        <span>{item.text}</span>
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
        <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <USGTimeline currentWeek={currentWeek} />
        </div>
      )}
    </div>
  );
}

export default Timeline;
