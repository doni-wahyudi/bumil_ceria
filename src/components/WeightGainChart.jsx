import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Settings,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
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
}) {
  const [viewMode, setViewMode] = useState('gain'); // 'gain' (+kg) | 'absolute' (kg)
  const [showModal, setShowModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Form state for baseline setup / edit
  const [heightInput, setHeightInput] = useState(profile?.heightCm || '');
  const [weightInput, setWeightInput] = useState(profile?.prePregnancyWeight || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Derived baseline values
  const heightCm = parseFloat(profile?.heightCm) || 0;
  const prePregnancyWeight = parseFloat(profile?.prePregnancyWeight) || 0;
  const hasBaseline = heightCm > 0 && prePregnancyWeight > 0;

  // Calculate pre-pregnancy BMI & category
  const baselineBMI = useMemo(() => {
    return calculateBMI(prePregnancyWeight, heightCm);
  }, [prePregnancyWeight, heightCm]);

  const bmiGuide = useMemo(() => {
    return classifyBMI(baselineBMI);
  }, [baselineBMI]);

  // Preview BMI inside modal
  const previewBMI = useMemo(() => {
    return calculateBMI(weightInput, heightInput);
  }, [weightInput, heightInput]);

  const previewGuide = useMemo(() => {
    return classifyBMI(previewBMI);
  }, [previewBMI]);

  // Save baseline
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
    }, 1200);
  };

  // Prepare and sort recorded weight data points
  const recordedPoints = useMemo(() => {
    if (!hasBaseline) return [];

    // Filter valid vitals with weight & week
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

    // Always include Week 0 baseline
    const points = [
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

    return points;
  }, [maternalVitals, prePregnancyWeight, hasBaseline, bmiGuide, profile?.hpht]);

  // Latest evaluation
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

  // SVG Chart Geometry Constants
  const viewBoxW = 540;
  const viewBoxH = 320;
  const padding = { left: 45, right: 25, top: 25, bottom: 42 };
  const chartW = viewBoxW - padding.left - padding.right;
  const chartH = viewBoxH - padding.top - padding.bottom;

  // Y-axis range calculations
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

  // Coordinate projection helper functions
  const getX = (w) => padding.left + (Math.max(0, Math.min(40, w)) / 40) * chartW;
  const getY = (val) => padding.top + chartH - ((val - minY) / (maxY - minY)) * chartH;

  // Corridor Path (Area between minTarget and maxTarget)
  const corridorPaths = useMemo(() => {
    if (!hasBaseline) return { fillPath: '', minLine: '', maxLine: '' };

    const corridor = generateWeightGainCorridor(bmiGuide.category, prePregnancyWeight);

    let maxPoints = [];
    let minPoints = [];

    corridor.forEach((pt) => {
      const x = getX(pt.week);
      const yMin = getY(viewMode === 'gain' ? pt.minGain : pt.minWeight);
      const yMax = getY(viewMode === 'gain' ? pt.maxGain : pt.maxWeight);

      maxPoints.push(`${x},${yMax}`);
      minPoints.push(`${x},${yMin}`);
    });

    const maxLine = `M ${maxPoints.join(' L ')}`;
    const minLine = `M ${minPoints.join(' L ')}`;

    // Shaded envelope: max points forward, then min points backwards
    const fillPath = `M ${maxPoints.join(' L ')} L ${minPoints.reverse().join(' L ')} Z`;

    return { fillPath, minLine, maxLine };
  }, [hasBaseline, bmiGuide, prePregnancyWeight, viewMode, minY, maxY]);

  // Actual recorded trajectory polyline
  const recordedPolyline = useMemo(() => {
    if (recordedPoints.length < 2) return '';
    return recordedPoints
      .map((p) => {
        const x = getX(p.week);
        const y = getY(viewMode === 'gain' ? p.gain : p.weight);
        return `${x},${y}`;
      })
      .join(' ');
  }, [recordedPoints, viewMode, minY, maxY]);

  // Active point for detail display
  const activeDetailPoint = selectedPoint || (recordedPoints.length > 1 ? recordedPoints[recordedPoints.length - 1] : null);

  return (
    <div className="wgc-container card animate-fade-in-up">
      {/* Header with Title and Mode Switch */}
      <div className="wgc-header">
        <div className="wgc-title-group">
          <div className="wgc-badge-icon">
            <TrendingUp size={16} />
          </div>
          <div>
            <h3 className="wgc-title">Grafik Kenaikan Berat Badan</h3>
            <span className="wgc-subtitle">Standar Medis IOM & Buku KIA Kemenkes</span>
          </div>
        </div>

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
          <Settings size={15} />
          <span>{hasBaseline ? 'Ubah IMT' : 'Atur IMT'}</span>
        </button>
      </div>

      {/* Baseline Prompt if not configured */}
      {!hasBaseline ? (
        <div className="wgc-empty-prompt">
          <div className="wgc-empty-icon">
            <Scale size={28} />
          </div>
          <div className="wgc-empty-text">
            <h4>Kalkulator & Grafik IMT Belum Aktif</h4>
            <p>
              Masukkan Tinggi Badan dan Berat Badan sebelum hamil untuk melihat kurva kenaikan berat badan ideal Anda
              sesuai rekomendasi medis.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-full"
            style={{ marginTop: '12px' }}
            onClick={() => setShowModal(true)}
          >
            <Sparkles size={16} /> Atur Tinggi & BB Pra-Hamil
          </button>
        </div>
      ) : (
        <>
          {/* Status Metric Grid */}
          <div className="wgc-metrics-grid">
            <div className="wgc-metric-item">
              <span className="wgc-metric-label">IMT Pra-Hamil</span>
              <div className="wgc-metric-val-wrap">
                <strong className="wgc-metric-value">{baselineBMI}</strong>
                <span className={`wgc-pill wgc-pill--${bmiGuide.badgeColor}`}>{bmiGuide.label}</span>
              </div>
              <span className="wgc-metric-hint">Target total: {bmiGuide.totalGainMin} - {bmiGuide.totalGainMax} kg</span>
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
              <span className="wgc-metric-hint">Awal: {prePregnancyWeight} kg • TB: {heightCm} cm</span>
            </div>
          </div>

          {/* Toggle View Options */}
          <div className="wgc-controls-bar">
            <span className="wgc-controls-label">Mode Tampilan:</span>
            <div className="wgc-toggle-group">
              <button
                type="button"
                className={`wgc-toggle-btn ${viewMode === 'gain' ? 'wgc-toggle-btn--active' : ''}`}
                onClick={() => setViewMode('gain')}
              >
                Kenaikan (+kg)
              </button>
              <button
                type="button"
                className={`wgc-toggle-btn ${viewMode === 'absolute' ? 'wgc-toggle-btn--active' : ''}`}
                onClick={() => setViewMode('absolute')}
              >
                Berat Total (kg)
              </button>
            </div>
          </div>

          {/* Interactive SVG Chart Container */}
          <div className="wgc-chart-wrapper">
            <svg
              className="wgc-svg-chart"
              viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Linear gradient for target corridor */}
                <linearGradient id="targetCorridorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
                </linearGradient>

                {/* Line Gradient for recorded points */}
                <linearGradient id="actualLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Trimester Zones Background Tint */}
              <rect
                x={getX(0)}
                y={padding.top}
                width={getX(13) - getX(0)}
                height={chartH}
                fill="var(--color-bg-secondary, rgba(0,0,0,0.02))"
                opacity="0.6"
              />
              <rect
                x={getX(28)}
                y={padding.top}
                width={getX(40) - getX(28)}
                height={chartH}
                fill="var(--color-bg-secondary, rgba(0,0,0,0.02))"
                opacity="0.6"
              />

              {/* Trimester Vertical Dividing Lines */}
              <line
                x1={getX(13)}
                y1={padding.top}
                x2={getX(13)}
                y2={padding.top + chartH}
                stroke="var(--color-border, #e5e7eb)"
                strokeDasharray="4 3"
                strokeWidth="1"
              />
              <line
                x1={getX(28)}
                y1={padding.top}
                x2={getX(28)}
                y2={padding.top + chartH}
                stroke="var(--color-border, #e5e7eb)"
                strokeDasharray="4 3"
                strokeWidth="1"
              />

              {/* Trimester Labels */}
              <text x={getX(6.5)} y={padding.top + 14} textAnchor="middle" className="wgc-axis-zone-label">
                Trimester 1
              </text>
              <text x={getX(20.5)} y={padding.top + 14} textAnchor="middle" className="wgc-axis-zone-label">
                Trimester 2
              </text>
              <text x={getX(34)} y={padding.top + 14} textAnchor="middle" className="wgc-axis-zone-label">
                Trimester 3
              </text>

              {/* Y-Axis Grid Lines & Tick Labels */}
              {yTicks.map((tick) => {
                const y = getY(tick);
                return (
                  <g key={`ytick-${tick}`}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + chartW}
                      y2={y}
                      stroke="var(--color-border, #e5e7eb)"
                      strokeWidth="0.8"
                      strokeDasharray={tick === 0 ? 'none' : '2 2'}
                      opacity={tick === 0 ? 0.8 : 0.45}
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

              {/* X-Axis Gestational Week Labels */}
              {[0, 8, 13, 20, 28, 36, 40].map((w) => {
                const x = getX(w);
                return (
                  <g key={`xtick-${w}`}>
                    <line
                      x1={x}
                      y1={padding.top + chartH}
                      x2={x}
                      y2={padding.top + chartH + 4}
                      stroke="var(--color-border, #9ca3af)"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={padding.top + chartH + 16}
                      textAnchor="middle"
                      className="wgc-axis-tick"
                    >
                      {w === 0 ? '0' : `W${w}`}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Target Corridor */}
              {corridorPaths.fillPath && (
                <path d={corridorPaths.fillPath} fill="url(#targetCorridorGrad)" />
              )}

              {/* Corridor Boundary Lines */}
              {corridorPaths.maxLine && (
                <path
                  d={corridorPaths.maxLine}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
              )}
              {corridorPaths.minLine && (
                <path
                  d={corridorPaths.minLine}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
              )}

              {/* Corridor Boundary Labels at Week 40 */}
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

              {/* Current Pregnancy Week Indicator Line */}
              {currentWeek > 0 && currentWeek <= 40 && (
                <g className="wgc-current-week-marker">
                  <line
                    x1={getX(currentWeek)}
                    y1={padding.top + 18}
                    x2={getX(currentWeek)}
                    y2={padding.top + chartH}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <circle cx={getX(currentWeek)} cy={padding.top + 20} r="3" fill="#3b82f6" />
                </g>
              )}

              {/* Actual Recorded Weight Trajectory Polyline */}
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

              {/* Actual Recorded Data Dots */}
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
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Touch target expansion */}
                    <circle cx={cx} cy={cy} r="16" fill="transparent" />

                    {/* Pulse outer ring for latest checkup */}
                    {isLatest && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="8"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="1.5"
                        className="wgc-pulse-ring"
                      />
                    )}

                    {/* Inner and border circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4.5}
                      fill={isSelected ? '#ec4899' : '#ffffff'}
                      stroke={p.isBaseline ? '#6b7280' : '#f43f5e'}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                  </g>
                );
              })}

              {/* X-Axis bottom title */}
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

          {/* Chart Legend */}
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
              <div className="wgc-legend-item">
                <span className="wgc-legend-swatch wgc-legend-swatch--now" />
                <span>Minggu Ini (Mg {currentWeek})</span>
              </div>
            )}
          </div>

          {/* Selected / Latest Inspection Point Details */}
          {activeDetailPoint && (
            <div className="wgc-detail-card card">
              <div className="wgc-detail-header">
                <div className="wgc-detail-meta">
                  <span className="wgc-detail-week-badge">
                    {activeDetailPoint.week === 0 ? 'Awal Hamil' : `Minggu ke-${activeDetailPoint.week}`}
                  </span>
                  <span className="wgc-detail-date">
                    <Calendar size={13} /> {formatDateID(activeDetailPoint.date)}
                  </span>
                </div>
                {activeDetailPoint.eval && (
                  <span className={`wgc-pill wgc-pill--${activeDetailPoint.eval.color || 'success'}`}>
                    {activeDetailPoint.eval.label}
                  </span>
                )}
              </div>

              <div className="wgc-detail-stats">
                <div className="wgc-detail-stat">
                  <span className="wgc-detail-stat-lbl">Berat Tercatat</span>
                  <strong>{activeDetailPoint.weight} kg</strong>
                </div>
                <div className="wgc-detail-stat">
                  <span className="wgc-detail-stat-lbl">Total Kenaikan</span>
                  <strong style={{ color: 'var(--color-primary, #e11d48)' }}>
                    {activeDetailPoint.gain >= 0 ? `+${activeDetailPoint.gain}` : activeDetailPoint.gain} kg
                  </strong>
                </div>
                <div className="wgc-detail-stat">
                  <span className="wgc-detail-stat-lbl">Target Aman Mg Ini</span>
                  <strong>
                    {getTargetGainAtWeek(activeDetailPoint.week, bmiGuide.category).minGain} -{' '}
                    {getTargetGainAtWeek(activeDetailPoint.week, bmiGuide.category).maxGain} kg
                  </strong>
                </div>
              </div>

              {activeDetailPoint.eval?.advice && (
                <div className="wgc-detail-advice">
                  <Info size={14} className="wgc-detail-advice-icon" />
                  <p>{activeDetailPoint.eval.advice}</p>
                </div>
              )}
            </div>
          )}

          {/* Clinical Guidance Accordion / Card */}
          <div className="wgc-guide-note card">
            <div className="wgc-guide-header">
              <span className="wgc-guide-icon">💡</span>
              <h4>Panduan Klinis Kemenkes: Kenaikan Berat Badan</h4>
            </div>
            <p className="wgc-guide-body">{bmiGuide.advice}</p>
            <div className="wgc-guide-table-wrap">
              <table className="wgc-guide-table">
                <thead>
                  <tr>
                    <th>Kategori IMT</th>
                    <th>Rentang</th>
                    <th>Total Target</th>
                    <th>Laju T2 & T3</th>
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
        <div className="wgc-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="wgc-modal card animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="wgc-modal-header">
              <div className="wgc-modal-title">
                <Scale size={18} color="var(--color-primary)" />
                <h4>Atur Tinggi & Berat Pra-Hamil</h4>
              </div>
              <button
                type="button"
                className="wgc-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <p className="wgc-modal-desc text-secondary text-xs">
              Data ini digunakan sebagai patokan dasar untuk menghitung Indeks Massa Tubuh (IMT) awal dan kurva kenaikan berat badan yang sehat.
            </p>

            <form onSubmit={handleSaveBaseline}>
              <div className="input-group">
                <label>Tinggi Badan Ibu (cm) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="120"
                  max="220"
                  placeholder="Contoh: 158"
                  className="input-field"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Berat Badan Sebelum Hamil (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="180"
                  placeholder="Contoh: 52.0"
                  className="input-field"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  required
                />
              </div>

              {/* Live Preview IMT */}
              {previewBMI && (
                <div className="wgc-preview-box">
                  <div className="wgc-preview-header">
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
                <div className="wgc-success-alert">
                  <CheckCircle2 size={16} />
                  <span>Data fisik pra-hamil berhasil disimpan!</span>
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
                  Simpan & Perbarui Grafik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
