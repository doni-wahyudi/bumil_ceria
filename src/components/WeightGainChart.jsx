import { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  Settings,
  Scale,
  CheckCircle2,
  Info,
  Calendar,
  Plus,
} from 'lucide-react';
import {
  calculateBMI,
  classifyBMI,
  getTargetGainAtWeek,
  generateWeightGainCorridor,
  evaluateWeightGain,
} from '../utils/bmiTracker';
import { formatDateID } from '../utils/pregnancyCalc';
import './WeightGainChart.css';

export default function WeightGainChart({
  maternalVitals = [],
  profile = {},
  currentWeek = 12,
  onUpdateBaseline,
  onOpenAddVital,
}) {
  const [viewMode, setViewMode] = useState('gain'); // 'gain' (+kg) | 'absolute' (kg)
  const [showModal, setShowModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const [heightInput, setHeightInput] = useState(profile?.heightCm || '');
  const [weightInput, setWeightInput] = useState(profile?.prePregnancyWeight || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Close modal with Escape key (R-26, R-32)
  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const heightCm = parseFloat(profile?.heightCm) || 0;
  const prePregnancyWeight = parseFloat(profile?.prePregnancyWeight) || 0;
  const hasBaseline = heightCm > 0 && prePregnancyWeight > 0;

  const baselineBMI = useMemo(() => {
    return calculateBMI(prePregnancyWeight, heightCm);
  }, [prePregnancyWeight, heightCm]);

  const bmiGuide = useMemo(() => {
    return classifyBMI(baselineBMI);
  }, [baselineBMI]);

  const previewBMI = useMemo(() => {
    return calculateBMI(weightInput, heightInput);
  }, [weightInput, heightInput]);

  const previewGuide = useMemo(() => {
    return classifyBMI(previewBMI);
  }, [previewBMI]);

  const handleSaveBaseline = async (e) => {
    e.preventDefault();
    if (!heightInput || !weightInput) return;
    if (onUpdateBaseline) {
      await onUpdateBaseline({
        heightCm: parseFloat(heightInput),
        prePregnancyWeight: parseFloat(weightInput),
      });
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowModal(false);
    }, 1000);
  };

  const recordedPoints = useMemo(() => {
    if (!hasBaseline) return [];

    const valid = maternalVitals
      .filter((v) => v.weight && !isNaN(parseFloat(v.weight)) && v.week !== undefined)
      .map((v) => {
        const weight = parseFloat(v.weight);
        const week = Math.max(0, Math.min(42, parseInt(v.week, 10) || 0));
        const gain = Math.round((weight - prePregnancyWeight) * 10) / 10;
        return {
          id: v.id,
          date: v.date,
          week,
          weight,
          gain,
          eval: evaluateWeightGain(weight, prePregnancyWeight, week, bmiGuide.category),
        };
      })
      .sort((a, b) => a.week - b.week);

    return [
      {
        id: 'baseline_w0',
        date: profile?.hpht || 'Awal Kehamilan',
        week: 0,
        weight: prePregnancyWeight,
        gain: 0,
        isBaseline: true,
        eval: {
          status: 'ideal',
          label: 'Berat Awal Pra-Hamil',
          color: 'success',
          actualGain: 0,
          targetMin: 0,
          targetMax: 0,
        },
      },
      ...valid,
    ];
  }, [maternalVitals, prePregnancyWeight, hasBaseline, bmiGuide, profile?.hpht]);

  const latestVitalWithWeight = useMemo(() => {
    return maternalVitals.find((v) => v.weight && !isNaN(parseFloat(v.weight))) || null;
  }, [maternalVitals]);

  const latestEval = useMemo(() => {
    if (!hasBaseline || !latestVitalWithWeight) return null;
    return evaluateWeightGain(
      latestVitalWithWeight.weight,
      prePregnancyWeight,
      latestVitalWithWeight.week,
      bmiGuide.category
    );
  }, [hasBaseline, latestVitalWithWeight, prePregnancyWeight, bmiGuide]);

  const viewBoxW = 540;
  const viewBoxH = 320;
  const padding = { left: 45, right: 28, top: 25, bottom: 42 };
  const chartW = viewBoxW - padding.left - padding.right;
  const chartH = viewBoxH - padding.top - padding.bottom;

  const { minY, maxY, yTicks } = useMemo(() => {
    const maxRecordedGain = recordedPoints.reduce((max, p) => Math.max(max, p.gain), 0);
    const upperGain = Math.max(20, Math.ceil(maxRecordedGain + 2));

    if (viewMode === 'gain') {
      const min = -2;
      const max = upperGain;
      const ticks = [];
      for (let t = 0; t <= max; t += 4) {
        ticks.push(t);
      }
      return { minY: min, maxY: max, yTicks: ticks };
    } else {
      const min = Math.floor(prePregnancyWeight - 2);
      const max = Math.ceil(prePregnancyWeight + upperGain);
      const ticks = [];
      const step = 5;
      const start = Math.floor(min / step) * step;
      for (let t = start; t <= max; t += step) {
        if (t >= min) ticks.push(t);
      }
      return { minY: min, maxY: max, yTicks: ticks };
    }
  }, [recordedPoints, viewMode, prePregnancyWeight]);

  const padLeft = padding.left;
  const padTop = padding.top;
  const getX = (w) => padLeft + (Math.max(0, Math.min(40, w)) / 40) * chartW;
  const getY = (val) => padTop + chartH - ((val - minY) / (maxY - minY)) * chartH;

  const corridorPaths = useMemo(() => {
    if (!hasBaseline) return { fillPath: '', minLine: '', maxLine: '' };

    const toX = (w) => padLeft + (Math.max(0, Math.min(40, w)) / 40) * chartW;
    const toY = (val) => padTop + chartH - ((val - minY) / (maxY - minY)) * chartH;
    const corridor = generateWeightGainCorridor(bmiGuide.category, prePregnancyWeight);
    const maxPoints = [];
    const minPoints = [];

    corridor.forEach((pt) => {
      const x = toX(pt.week);
      const yMin = toY(viewMode === 'gain' ? pt.minGain : pt.minWeight);
      const yMax = toY(viewMode === 'gain' ? pt.maxGain : pt.maxWeight);

      maxPoints.push(`${x},${yMax}`);
      minPoints.push(`${x},${yMin}`);
    });

    const maxLine = `M ${maxPoints.join(' L ')}`;
    const minLine = `M ${minPoints.join(' L ')}`;
    const fillPath = `M ${maxPoints.join(' L ')} L ${[...minPoints].reverse().join(' L ')} Z`;

    return { fillPath, minLine, maxLine };
  }, [hasBaseline, bmiGuide, prePregnancyWeight, viewMode, minY, maxY, padLeft, padTop, chartW, chartH]);

  const recordedPolyline = useMemo(() => {
    if (recordedPoints.length < 2) return '';
    const toX = (w) => padLeft + (Math.max(0, Math.min(40, w)) / 40) * chartW;
    const toY = (val) => padTop + chartH - ((val - minY) / (maxY - minY)) * chartH;
    return recordedPoints
      .map((p) => {
        const x = toX(p.week);
        const y = toY(viewMode === 'gain' ? p.gain : p.weight);
        return `${x},${y}`;
      })
      .join(' ');
  }, [recordedPoints, viewMode, minY, maxY, padLeft, padTop, chartW, chartH]);

  const activeDetailPoint = selectedPoint || (recordedPoints.length > 1 ? recordedPoints[recordedPoints.length - 1] : null);

  return (
    <section className="wgc-container card animate-fade-in-up" aria-label="Grafik Kenaikan Berat Badan">
      {/* Header */}
      <div className="wgc-header">
        <div className="wgc-title-group">
          <div className="wgc-badge-icon">
            <TrendingUp size={16} aria-hidden="true" />
          </div>
          <div>
            <h2 className="wgc-title">Grafik Kenaikan Berat Badan</h2>
            <span className="wgc-subtitle">Standar Medis IOM &amp; Buku KIA Kemenkes</span>
          </div>
        </div>

        <div className="wgc-header-actions">
          {onOpenAddVital && (
            <button
              type="button"
              className="wgc-add-weight-btn"
              onClick={onOpenAddVital}
              title="Catat Berat Badan & Vital Baru"
            >
              <Plus size={14} aria-hidden="true" />
              <span>Catat BB</span>
            </button>
          )}

          <button
            type="button"
            className="wgc-settings-btn"
            onClick={() => {
              setHeightInput(profile?.heightCm || '');
              setWeightInput(profile?.prePregnancyWeight || '');
              setShowModal(true);
            }}
            title="Atur Tinggi & Berat Badan Pra-Hamil"
          >
            <Settings size={14} aria-hidden="true" />
            <span>{hasBaseline ? 'Ubah IMT' : 'Atur IMT'}</span>
          </button>
        </div>
      </div>

      {/* Baseline Prompt if not configured */}
      {!hasBaseline ? (
        <div className="wgc-empty-prompt">
          <div className="wgc-empty-icon">
            <Scale size={28} aria-hidden="true" />
          </div>
          <div className="wgc-empty-text">
            <h3>Kalkulator &amp; Grafik IMT Belum Aktif</h3>
            <p>
              Masukkan tinggi badan dan berat badan sebelum hamil untuk memantau kurva kenaikan berat badan ideal sesuai standar Buku KIA.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-full"
            style={{ marginTop: '14px' }}
            onClick={() => setShowModal(true)}
          >
            <Scale size={16} aria-hidden="true" />
            <span>Atur Tinggi &amp; BB Pra-Hamil</span>
          </button>
        </div>
      ) : (
        <>
          <div className="wgc-metrics-grid tabular-nums">
            <div className="wgc-metric-item">
              <span className="wgc-metric-label">IMT Pra-Hamil</span>
              <div className="wgc-metric-val-wrap">
                <strong className="wgc-metric-value">{baselineBMI}</strong>
                <span className={`wgc-pill wgc-pill--${bmiGuide.badgeColor}`}>{bmiGuide.label}</span>
              </div>
              <span className="wgc-metric-hint">Target total: {bmiGuide.totalGainMin}–{bmiGuide.totalGainMax} kg</span>
            </div>

            <div className="wgc-metric-item">
              <span className="wgc-metric-label">Kenaikan Saat Ini</span>
              <strong className="wgc-metric-value">
                {latestEval ? `+${latestEval.actualGain} kg` : '+0 kg'}
              </strong>
              {latestEval && (
                <span className={`wgc-pill wgc-pill--${latestEval.color}`}>
                  {latestEval.label}
                </span>
              )}
            </div>

            <div className="wgc-metric-item">
              <span className="wgc-metric-label">BB Terakhir</span>
              <strong className="wgc-metric-value">
                {latestVitalWithWeight ? `${latestVitalWithWeight.weight} kg` : `${prePregnancyWeight} kg`}
              </strong>
              <span className="wgc-metric-hint">Awal: {prePregnancyWeight} kg · TB: {heightCm} cm</span>
            </div>
          </div>

          <div className="wgc-controls-bar">
            <span className="wgc-controls-label">Mode Tampilan:</span>
            <div className="wgc-toggle-group" role="group" aria-label="Satuan grafik berat badan">
              <button
                type="button"
                aria-pressed={viewMode === 'gain'}
                className={`wgc-toggle-btn ${viewMode === 'gain' ? 'wgc-toggle-btn--active' : ''}`}
                onClick={() => setViewMode('gain')}
              >
                Kenaikan (+kg)
              </button>
              <button
                type="button"
                aria-pressed={viewMode === 'absolute'}
                className={`wgc-toggle-btn ${viewMode === 'absolute' ? 'wgc-toggle-btn--active' : ''}`}
                onClick={() => setViewMode('absolute')}
              >
                Berat Total (kg)
              </button>
            </div>
          </div>

          <div className="wgc-chart-wrapper">
            <svg
              className="wgc-svg-chart"
              viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Kurva target kenaikan berat badan kehamilan minggu 0 sampai 40"
            >
              <defs>
                <linearGradient id="targetCorridorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#256F3A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#256F3A" stopOpacity="0.06" />
                </linearGradient>

                <linearGradient id="actualLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#B8527A" />
                  <stop offset="100%" stopColor="#943B5E" />
                </linearGradient>
              </defs>

              <rect
                x={getX(0)}
                y={padding.top}
                width={getX(13) - getX(0)}
                height={chartH}
                fill="var(--color-bg-secondary)"
                opacity="0.7"
              />
              <rect
                x={getX(28)}
                y={padding.top}
                width={getX(40) - getX(28)}
                height={chartH}
                fill="var(--color-bg-secondary)"
                opacity="0.7"
              />

              <line
                x1={getX(13)}
                y1={padding.top}
                x2={getX(13)}
                y2={padding.top + chartH}
                stroke="var(--color-border)"
                strokeDasharray="4 3"
                strokeWidth="1"
              />
              <line
                x1={getX(28)}
                y1={padding.top}
                x2={getX(28)}
                y2={padding.top + chartH}
                stroke="var(--color-border)"
                strokeDasharray="4 3"
                strokeWidth="1"
              />

              <text x={getX(6.5)} y={padding.top + 14} textAnchor="middle" className="wgc-axis-zone-label">
                Trimester 1
              </text>
              <text x={getX(20.5)} y={padding.top + 14} textAnchor="middle" className="wgc-axis-zone-label">
                Trimester 2
              </text>
              <text x={getX(34)} y={padding.top + 14} textAnchor="middle" className="wgc-axis-zone-label">
                Trimester 3
              </text>

              {yTicks.map((tick) => {
                const y = getY(tick);
                return (
                  <g key={`ytick-${tick}`}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + chartW}
                      y2={y}
                      stroke="var(--color-border)"
                      strokeWidth="0.8"
                      strokeDasharray={tick === 0 ? 'none' : '2 2'}
                      opacity={tick === 0 ? 0.85 : 0.5}
                    />
                    <text
                      x={padding.left - 6}
                      y={y + 3.5}
                      textAnchor="end"
                      className="wgc-axis-tick"
                    >
                      {viewMode === 'gain' ? (tick > 0 ? `+${tick}` : `${tick}`) : `${tick}`}
                    </text>
                  </g>
                );
              })}

              {[0, 8, 13, 20, 28, 36, 40].map((w) => {
                const x = getX(w);
                return (
                  <g key={`xtick-${w}`}>
                    <line
                      x1={x}
                      y1={padding.top + chartH}
                      x2={x}
                      y2={padding.top + chartH + 4}
                      stroke="var(--color-border-hover)"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={padding.top + chartH + 16}
                      textAnchor="middle"
                      className="wgc-axis-tick"
                    >
                      {w === 0 ? '0' : `M${w}`}
                    </text>
                  </g>
                );
              })}

              {corridorPaths.fillPath && (
                <path d={corridorPaths.fillPath} fill="url(#targetCorridorGrad)" />
              )}

              {corridorPaths.maxLine && (
                <path
                  d={corridorPaths.maxLine}
                  fill="none"
                  stroke="#256F3A"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
              )}
              {corridorPaths.minLine && (
                <path
                  d={corridorPaths.minLine}
                  fill="none"
                  stroke="#256F3A"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
              )}

              <text
                x={getX(40) + 4}
                y={getY(viewMode === 'gain' ? bmiGuide.totalGainMax : prePregnancyWeight + bmiGuide.totalGainMax) + 3}
                className="wgc-corridor-label"
              >
                Maks
              </text>
              <text
                x={getX(40) + 4}
                y={getY(viewMode === 'gain' ? bmiGuide.totalGainMin : prePregnancyWeight + bmiGuide.totalGainMin) + 3}
                className="wgc-corridor-label"
              >
                Min
              </text>

              {currentWeek > 0 && currentWeek <= 40 && (
                <g className="wgc-current-week-marker">
                  <line
                    x1={getX(currentWeek)}
                    y1={padding.top + 18}
                    x2={getX(currentWeek)}
                    y2={padding.top + chartH}
                    stroke="#3C637E"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <circle cx={getX(currentWeek)} cy={padding.top + 20} r="3.5" fill="#3C637E" />
                </g>
              )}

              {recordedPolyline && (
                <polyline
                  points={recordedPolyline}
                  fill="none"
                  stroke="url(#actualLineGrad)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {recordedPoints.map((p, idx) => {
                const cx = getX(p.week);
                const cy = getY(viewMode === 'gain' ? p.gain : p.weight);
                const isSelected = selectedPoint?.id === p.id;
                const isLatest = idx === recordedPoints.length - 1 && recordedPoints.length > 1;

                return (
                  <g
                    key={p.id}
                    className="wgc-data-point-group"
                    onClick={() => setSelectedPoint(p)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Minggu ${p.week}: ${p.weight} kilogram`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPoint(p);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={cx} cy={cy} r="16" fill="transparent" />

                    {isLatest && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="8"
                        fill="none"
                        stroke="#B8527A"
                        strokeWidth="1.5"
                        opacity="0.45"
                      />
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4.5}
                      fill={isSelected ? '#B8527A' : '#FFFFFF'}
                      stroke={p.isBaseline ? '#5C5650' : '#B8527A'}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                  </g>
                );
              })}

              <text
                x={padding.left + chartW / 2}
                y={padding.top + chartH + 34}
                textAnchor="middle"
                className="wgc-axis-caption"
              >
                Minggu Usia Kehamilan
              </text>
            </svg>
          </div>

          <div className="wgc-legend">
            <div className="wgc-legend-item">
              <span className="wgc-legend-swatch wgc-legend-swatch--corridor" />
              <span>Zona Ideal ({bmiGuide.label})</span>
            </div>
            <div className="wgc-legend-item">
              <span className="wgc-legend-swatch wgc-legend-swatch--actual" />
              <span>Kenaikan Mama</span>
            </div>
            {currentWeek > 0 && currentWeek <= 40 && (
              <div className="wgc-legend-item tabular-nums">
                <span className="wgc-legend-swatch wgc-legend-swatch--now" />
                <span>Minggu Ini (Mg {currentWeek})</span>
              </div>
            )}
          </div>

          {activeDetailPoint && (
            <div className="wgc-detail-card card">
              <div className="wgc-detail-header">
                <div className="wgc-detail-meta">
                  <span className="wgc-detail-week-badge tabular-nums">
                    {activeDetailPoint.week === 0 ? 'Awal Hamil' : `Minggu ke-${activeDetailPoint.week}`}
                  </span>
                  <span className="wgc-detail-date tabular-nums">
                    <Calendar size={13} aria-hidden="true" />
                    <span>{formatDateID(activeDetailPoint.date)}</span>
                  </span>
                </div>
                {activeDetailPoint.eval && (
                  <span className={`wgc-pill wgc-pill--${activeDetailPoint.eval.color || 'success'}`}>
                    {activeDetailPoint.eval.label}
                  </span>
                )}
              </div>

              <div className="wgc-detail-stats tabular-nums">
                <div className="wgc-detail-stat">
                  <span className="wgc-detail-stat-lbl">Berat Tercatat</span>
                  <strong>{activeDetailPoint.weight} kg</strong>
                </div>
                <div className="wgc-detail-stat">
                  <span className="wgc-detail-stat-lbl">Total Kenaikan</span>
                  <strong style={{ color: 'var(--color-primary)' }}>
                    {activeDetailPoint.gain >= 0 ? `+${activeDetailPoint.gain}` : activeDetailPoint.gain} kg
                  </strong>
                </div>
                <div className="wgc-detail-stat">
                  <span className="wgc-detail-stat-lbl">Target Aman Mg Ini</span>
                  <strong>
                    {getTargetGainAtWeek(activeDetailPoint.week, bmiGuide.category).minGain}–{getTargetGainAtWeek(activeDetailPoint.week, bmiGuide.category).maxGain} kg
                  </strong>
                </div>
              </div>

              {activeDetailPoint.eval?.advice && (
                <div className="wgc-detail-advice">
                  <Info size={14} className="wgc-detail-advice-icon" aria-hidden="true" />
                  <p>{activeDetailPoint.eval.advice}</p>
                </div>
              )}
            </div>
          )}

          <div className="wgc-guide-note card">
            <div className="wgc-guide-header">
              <Info size={16} color="var(--color-accent-dark)" aria-hidden="true" />
              <h3>Panduan Klinis Kemenkes: Kenaikan Berat Badan</h3>
            </div>
            <p className="wgc-guide-body">{bmiGuide.advice}</p>
            <div className="wgc-guide-table-wrap">
              <table className="wgc-guide-table tabular-nums">
                <thead>
                  <tr>
                    <th>Kategori IMT</th>
                    <th>Rentang</th>
                    <th>Total Target</th>
                    <th>Laju T2 &amp; T3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={bmiGuide.category === 'underweight' ? 'wgc-row--active' : ''}>
                    <td>Kurus</td>
                    <td>&lt; 18.5</td>
                    <td>12.5 – 18 kg</td>
                    <td>~0.51 kg/mgg</td>
                  </tr>
                  <tr className={bmiGuide.category === 'normal' ? 'wgc-row--active' : ''}>
                    <td>Normal</td>
                    <td>18.5 – 24.9</td>
                    <td>11.5 – 16 kg</td>
                    <td>~0.42 kg/mgg</td>
                  </tr>
                  <tr className={bmiGuide.category === 'overweight' ? 'wgc-row--active' : ''}>
                    <td>Overweight</td>
                    <td>25.0 – 29.9</td>
                    <td>7.0 – 11.5 kg</td>
                    <td>~0.28 kg/mgg</td>
                  </tr>
                  <tr className={bmiGuide.category === 'obese' ? 'wgc-row--active' : ''}>
                    <td>Obesitas</td>
                    <td>≥ 30.0</td>
                    <td>5.0 – 9.0 kg</td>
                    <td>~0.22 kg/mgg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Setup / Edit Baseline Modal */}
      {showModal && (
        <div
          className="wgc-modal-backdrop"
          onClick={() => setShowModal(false)}
          role="presentation"
        >
          <div
            className="wgc-modal card animate-scale-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wgc-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wgc-modal-header">
              <div className="wgc-modal-title">
                <Scale size={18} color="var(--color-primary)" aria-hidden="true" />
                <h3 id="wgc-modal-title">Atur Tinggi &amp; Berat Pra-Hamil</h3>
              </div>
              <button
                type="button"
                className="wgc-modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Tutup dialog"
              >
                ✕
              </button>
            </div>

            <p className="wgc-modal-desc text-secondary text-xs">
              Data ini menjadi dasar perhitungan Indeks Massa Tubuh (IMT) awal dan kurva kenaikan berat badan yang sehat.
            </p>

            <form onSubmit={handleSaveBaseline}>
              <div className="input-group">
                <label htmlFor="wgc-height-input">Tinggi Badan Ibu (cm) *</label>
                <input
                  id="wgc-height-input"
                  type="number"
                  step="0.5"
                  min="120"
                  max="220"
                  placeholder="Contoh: 158"
                  className="input-field tabular-nums"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  required
                />
              </div>

              <div className="input-group" style={{ marginTop: '12px' }}>
                <label htmlFor="wgc-weight-input">Berat Badan Sebelum Hamil (kg) *</label>
                <input
                  id="wgc-weight-input"
                  type="number"
                  step="0.1"
                  min="30"
                  max="180"
                  placeholder="Contoh: 52.0"
                  className="input-field tabular-nums"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  required
                />
              </div>

              {previewBMI && (
                <div className="wgc-preview-box">
                  <div className="wgc-preview-header tabular-nums">
                    <span>Hasil Perhitungan IMT Pra-Hamil:</span>
                    <strong>{previewBMI}</strong>
                  </div>
                  <div className="wgc-preview-badge">
                    <span className={`wgc-pill wgc-pill--${previewGuide.badgeColor}`}>
                      {previewGuide.label}
                    </span>
                    <span className="text-xs text-secondary">{previewGuide.summary}</span>
                  </div>
                </div>
              )}

              {saveSuccess && (
                <div className="wgc-success-alert" role="status">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>Data fisik pra-hamil berhasil disimpan.</span>
                </div>
              )}

              <div className="wgc-modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!heightInput || !weightInput}
                >
                  Simpan &amp; Perbarui Grafik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
