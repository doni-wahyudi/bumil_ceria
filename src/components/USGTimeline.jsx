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
      <div className="usg-timeline__line" aria-hidden="true" />
      {usgSchedule.map((usg, index) => {
        const isDone = statuses[usg.id];
        const isCurrent = nextUSG?.id === usg.id;
        const isPast = currentWeek > usg.weekRange[1];
        const isExpanded = expandedId === usg.id;

        return (
          <div
            key={usg.id}
            className={`usg-item ${isDone ? 'usg-item--done' : ''} ${isCurrent ? 'usg-item--current' : ''} ${isPast && !isDone ? 'usg-item--missed' : ''}`}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div className="usg-item__dot" aria-hidden="true">
              {isDone ? (
                <Check size={14} strokeWidth={3} color="var(--color-text-inverse)" />
              ) : (
                <span className="usg-item__dot-inner">{usg.icon}</span>
              )}
            </div>

            <div className="usg-item__card">
              <button
                type="button"
                className="usg-item__header"
                onClick={() => setExpandedId(isExpanded ? null : usg.id)}
                aria-expanded={isExpanded}
              >
                <div className="usg-item__header-text">
                  <span className="usg-item__week-label tabular-nums">{usg.weekLabel}</span>
                  <h2 className="usg-item__title">{usg.title}</h2>
                </div>
                {isCurrent && <span className="badge badge-usg">Selanjutnya</span>}
                {isDone && <span className="badge badge-success">Sudah</span>}
              </button>

              {isExpanded && (
                <div className="usg-item__details animate-fade-in-up">
                  <p className="usg-item__desc">{usg.description}</p>

                  <div className="usg-item__section">
                    <h3>Yang Akan Diperiksa</h3>
                    <p>{usg.whatToExpect}</p>
                  </div>

                  <div className="usg-item__section">
                    <h3>Pertanyaan untuk Dokter</h3>
                    <ul>
                      {usg.questionsToAsk.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className={`btn ${isDone ? 'btn-secondary' : 'btn-primary'} btn-full`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(usg.id);
                    }}
                    style={{ marginTop: 'var(--space-3)' }}
                  >
                    {isDone ? 'Tandai Belum Dilakukan' : 'Tandai Sudah Dilakukan'}
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
