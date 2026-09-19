import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { getUSGStatus, toggleUSGStatus } from '../utils/storage';
import usgSchedule, { getNextUSG } from '../data/usgSchedule';
import './USGTimeline.css';

function USGTimeline({ currentWeek }) {
  const [statuses, setStatuses] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const nextUSG = getNextUSG(currentWeek);

  useEffect(() => {
    getUSGStatus().then(setStatuses);
  }, []);

  const handleToggle = async (id) => {
    const newState = await toggleUSGStatus(id);
    setStatuses((prev) => ({ ...prev, [id]: newState }));
  };

  return (
    <div className="usg-timeline" id="usg-timeline">
      <div className="usg-timeline__line" />
      {usgSchedule.map((usg, index) => {
        const isDone = statuses[usg.id];
        const isCurrent = nextUSG?.id === usg.id;
        const isPast = currentWeek > usg.weekRange[1];
        const isExpanded = expandedId === usg.id;

        return (
          <div
            key={usg.id}
            className={`usg-item ${isDone ? 'usg-item--done' : ''} ${isCurrent ? 'usg-item--current' : ''} ${isPast && !isDone ? 'usg-item--missed' : ''}`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="usg-item__dot">
              {isDone ? (
                <Check size={14} strokeWidth={3} color="white" />
              ) : (
                <span className="usg-item__dot-inner">{usg.icon}</span>
              )}
            </div>

            <div className="usg-item__card">
              <button
                className="usg-item__header"
                onClick={() => setExpandedId(isExpanded ? null : usg.id)}
                aria-expanded={isExpanded}
              >
                <div className="usg-item__header-text">
                  <span className="usg-item__week-label">{usg.weekLabel}</span>
                  <h4 className="usg-item__title">{usg.title}</h4>
                </div>
                {isCurrent && <span className="badge badge-usg">Selanjutnya</span>}
                {isDone && <span className="badge badge-success">Sudah ✓</span>}
              </button>

              {isExpanded && (
                <div className="usg-item__details animate-fade-in-up">
                  <p className="usg-item__desc">{usg.description}</p>

                  <div className="usg-item__section">
                    <h5>Yang Akan Diperiksa</h5>
                    <p>{usg.whatToExpect}</p>
                  </div>

                  <div className="usg-item__section">
                    <h5>Pertanyaan untuk Dokter</h5>
                    <ul>
                      {usg.questionsToAsk.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className={`btn ${isDone ? 'btn-secondary' : 'btn-primary'} btn-full`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(usg.id);
                    }}
                    style={{ marginTop: 'var(--space-3)' }}
                  >
                    {isDone ? 'Tandai Belum Dilakukan' : 'Tandai Sudah Dilakukan ✓'}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default USGTimeline;
