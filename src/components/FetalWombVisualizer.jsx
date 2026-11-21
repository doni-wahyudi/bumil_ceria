import { useState, useEffect, useId } from 'react';
import {
  ZoomIn,
  ZoomOut,
  HeartPulse,
  Baby,
  Ruler,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { getWeekData } from '../data/weeklyData';
import { getFetalGrowthForWeek } from '../data/fetalGrowthData';
import './FetalWombVisualizer.css';

function formatWeight(grams) {
  if (grams < 1) return `${grams} g`;
  if (grams < 1000) return `${Math.round(grams)} g`;
  return `${(grams / 1000).toFixed(2).replace('.', ',')} kg`;
}

function formatLength(cm) {
  if (cm < 1) return `${(cm * 10).toFixed(1).replace('.', ',')} mm`;
  return `${cm.toString().replace('.', ',')} cm`;
}

export default function FetalWombVisualizer({
  week,
  currentWeek,
  weekData: externalWeekData,
  onWeekChange,
}) {
  const [previewWeek, setPreviewWeek] = useState(null);
  const [viewMode, setViewMode] = useState('proportional'); // 'proportional' | 'zoom'
  const [activeLayer, setActiveLayer] = useState('fetus'); // 'fetus' | 'womb' | 'vital'
  const [isSimulatingKick, setIsSimulatingKick] = useState(false);

  const sliderId = useId();
  const bellyGradId = `${sliderId}-belly`;
  const uterusGradId = `${sliderId}-uterus`;
  const cavityGradId = `${sliderId}-cavity`;
  const maskGradId = `${sliderId}-maskgrad`;
  const featherMaskId = `${sliderId}-feathermask`;
  const stageClipId = `${sliderId}-stage`;
  const loupeClipId = `${sliderId}-loupe`;
  const wombClipId = `${sliderId}-womb`;

  const displayWeek = onWeekChange ? week : (previewWeek ?? week ?? 1);

  // Finite 2.4s kick/heartbeat feedback loop
  useEffect(() => {
    if (!isSimulatingKick) return undefined;
    const timer = setTimeout(() => setIsSimulatingKick(false), 2400);
    return () => clearTimeout(timer);
  }, [isSimulatingKick]);

  const handleSelectWeek = (nextWeek) => {
    const clamped = Math.max(1, Math.min(40, Number(nextWeek) || 1));
    if (onWeekChange) {
      onWeekChange(clamped);
    } else {
      setPreviewWeek(clamped === currentWeek ? null : clamped);
    }
  };

  const growth = getFetalGrowthForWeek(displayWeek);
  const weekInfo = displayWeek === week && externalWeekData ? externalWeekData : getWeekData(displayWeek);
  const termPercent = Math.max(1, Math.round((growth.lengthCm / 51.2) * 100));
  const stageImageUrl = `${import.meta.env.BASE_URL}${growth.imagePath}`;

  // Anatomical SVG coordinate system (viewBox 0..380 x 0..300)
  // Left/Center (18..228): Volumetric maternal profile completely enclosing pyriform uterus & 3D fetus
  // Right (238..370): Clinical TFU landmarks & early-week 3D zoom loupe with collision avoidance
  const wombBottomY = 242;
  const fundusY = 230 - growth.wombScale * 134; // rises from pelvis (y=206) to epigastrium (y=96)
  const wombCenterY = (fundusY + wombBottomY) / 2;
  const wombH = wombBottomY - fundusY;
  const wombHalfW = 16 + growth.wombScale * 48; // 24.6 -> 64
  const wombW = wombHalfW * 2;
  const wombCenterX = 78 + growth.wombScale * 46; // 86 -> 124
  const apexX = Math.max(118 + growth.bellyCurve * 92, wombCenterX + wombHalfW + 18);
  const lowerBellyX = Math.max(114 + growth.bellyCurve * 26, wombCenterX + wombHalfW * 0.42 + 12);

  const showLoupe = viewMode === 'proportional' && displayWeek <= 12;

  // Maternal profile contour tightly wrapping around growing uterus
  const upperControlX = Math.max(118, wombCenterX + wombHalfW * 0.72);
  const upperControlY = Math.max(88, fundusY - 14);
  const bellyPath = [
    'M 42 16',
    'L 104 16',
    'C 108 38, 120 50, 118 66',
    'C 116 77, 108 84, 112 92',
    `C ${upperControlX} ${upperControlY}, ${apexX} ${Math.max(112, fundusY + 20)}, ${apexX} ${wombCenterY + 6}`,
    `C ${apexX} ${wombBottomY - 14}, ${lowerBellyX + 14} ${wombBottomY + 4}, ${lowerBellyX} 262`,
    'L 118 282',
    'L 42 282',
    'C 38 220, 44 144, 40 76',
    'Z',
  ].join(' ');

  // Anatomical Pyriform (Pear-Shaped) Uterus path builder
  const buildUterusPath = (inset = 0) => {
    const fY = fundusY + inset;
    const bY = wombBottomY - inset * 0.6;
    const hW = Math.max(12, wombHalfW - inset);
    const neckW = Math.max(7, hW * 0.36);
    const upperShoulderY = fY + (bY - fY) * 0.34;
    const midY = fY + (bY - fY) * 0.68;

    return [
      `M ${wombCenterX} ${fY}`,
      `C ${wombCenterX + hW * 0.85} ${fY}, ${wombCenterX + hW} ${upperShoulderY}, ${wombCenterX + hW * 0.92} ${midY}`,
      `C ${wombCenterX + hW * 0.78} ${bY - 10}, ${wombCenterX + neckW} ${bY}, ${wombCenterX + neckW * 0.55} ${bY + 10}`,
      `L ${wombCenterX - neckW * 0.55} ${bY + 10}`,
      `C ${wombCenterX - neckW} ${bY}, ${wombCenterX - hW * 0.78} ${bY - 10}, ${wombCenterX - hW * 0.92} ${midY}`,
      `C ${wombCenterX - hW} ${upperShoulderY}, ${wombCenterX - hW * 0.85} ${fY}, ${wombCenterX} ${fY}`,
      'Z',
    ].join(' ');
  };

  const outerUterusPath = buildUterusPath(0);
  const innerCavityPath = buildUterusPath(4.5);

  // Proportional sizing of the 3D photorealistic stage image inside the uterine cavity
  const isMicroStage = growth.stage === 'blastocyst' || growth.stage === 'embryo';
  const imgW = isMicroStage
    ? Math.max(28, Math.min(wombW * 0.96, 18 + growth.fetusScale * 180))
    : Math.max(wombW * 1.04, growth.fetusScale * 144);
  const imgH = isMicroStage
    ? imgW
    : Math.max(wombH * 0.96, growth.fetusScale * 150);
  const imgX = wombCenterX - imgW / 2;
  const imgY = wombCenterY - imgH / 2 + (displayWeek >= 28 ? 2 : 0);

  // Overlap-avoidant right clinical reference marks
  const tfuBadgeY = Math.max(20, Math.min(266, fundusY));
  const referenceMarks = [
    { y: 88, label: 'Ulu Hati' },
    { y: 166, label: 'Pusar (Mg 20)' },
    { y: 232, label: 'Simfisis' },
  ];

  return (
    <section
      className="fwv-card card"
      aria-label={`Visualisasi realistis dan proporsional janin di dalam rahim minggu ke-${displayWeek}`}
    >
      {/* Header Row */}
      <div className="fwv-header">
        <div className="fwv-heading">
          <span className="fwv-eyebrow tabular-nums">
            Minggu {displayWeek} dari 40 · Trimester {displayWeek <= 13 ? 1 : displayWeek <= 27 ? 2 : 3}
          </span>
          <h2 className="fwv-title">Janin di Dalam Rahim</h2>
        </div>

        <div className="fwv-size-pill">
          <span className="fwv-size-emoji" aria-hidden="true">{weekInfo?.babySizeEmoji}</span>
          <span className="fwv-size-text">{weekInfo?.babySize}</span>
        </div>
      </div>

      {/* Mode & Action Toolbar */}
      <div className="fwv-toolbar" role="group" aria-label="Kontrol tampilan visualisasi janin">
        <div className="fwv-mode-switch" role="group" aria-label="Mode tampilan">
          <button
            type="button"
            className={`fwv-mode-btn ${viewMode === 'proportional' ? 'fwv-mode-btn--active' : ''}`}
            aria-pressed={viewMode === 'proportional'}
            onClick={() => setViewMode('proportional')}
          >
            <Ruler size={15} aria-hidden="true" />
            <span>Proporsi 1:1</span>
          </button>
          <button
            type="button"
            className={`fwv-mode-btn ${viewMode === 'zoom' ? 'fwv-mode-btn--active' : ''}`}
            aria-pressed={viewMode === 'zoom'}
            onClick={() => setViewMode('zoom')}
          >
            {viewMode === 'zoom' ? <ZoomOut size={15} aria-hidden="true" /> : <ZoomIn size={15} aria-hidden="true" />}
            <span>Perbesar 3D</span>
          </button>
        </div>

        <button
          type="button"
          className={`fwv-kick-btn ${isSimulatingKick ? 'fwv-kick-btn--active' : ''}`}
          onClick={() => setIsSimulatingKick(true)}
          aria-pressed={isSimulatingKick}
        >
          <HeartPulse size={16} aria-hidden="true" />
          <span>{isSimulatingKick ? 'Berdetak...' : 'Detak & Gerak'}</span>
        </button>
      </div>

      {/* Interactive Realistic Womb + Proportional Belly Stage */}
      <div className="fwv-stage">
        <button
          type="button"
          className="fwv-svg-trigger"
          onClick={() => setIsSimulatingKick(true)}
          aria-label={`Ketuk visualisasi untuk melihat respons detak jantung dan gerak janin minggu ${displayWeek}`}
        >
          {viewMode === 'proportional' ? (
            <svg
              viewBox="0 0 380 300"
              className="fwv-svg"
              role="img"
              aria-label={`Proporsi realistis janin di dalam perut ibu minggu ${displayWeek}: panjang ${growth.lengthCm} cm, ${growth.fundusLabel}`}
            >
              <defs>
                <linearGradient id={bellyGradId} x1="0%" y1="10%" x2="100%" y2="85%">
                  <stop offset="0%" stopColor="var(--fwv-belly-shadow)" />
                  <stop offset="52%" stopColor="var(--fwv-belly-fill)" />
                  <stop offset="100%" stopColor="var(--fwv-belly-highlight)" />
                </linearGradient>

                <linearGradient id={uterusGradId} x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="var(--fwv-uterus-wall)" />
                  <stop offset="100%" stopColor="var(--fwv-uterus-deep)" />
                </linearGradient>

                <radialGradient id={cavityGradId} cx="48%" cy="46%" r="58%">
                  <stop offset="0%" stopColor="#5D1B26" />
                  <stop offset="62%" stopColor="#3B0F18" />
                  <stop offset="100%" stopColor="#21070C" />
                </radialGradient>

                <radialGradient id={maskGradId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="68%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="96%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>

                <mask id={featherMaskId} maskContentUnits="objectBoundingBox">
                  <rect x="0" y="0" width="1" height="1" fill={`url(#${maskGradId})`} />
                </mask>

                <clipPath id={stageClipId}>
                  <rect x="0" y="0" width="380" height="300" rx="14" />
                </clipPath>
                <clipPath id={loupeClipId}>
                  <circle cx="308" cy="70" r="46" />
                </clipPath>
                <clipPath id={wombClipId}>
                  <path d={innerCavityPath} />
                </clipPath>
              </defs>

              <g clipPath={`url(#${stageClipId})`}>
                {/* Right Reference Landmarks with collision avoidance */}
                <g className="fwv-ref-labels" aria-hidden="true">
                  {referenceMarks.map((mark) => {
                    const collidesWithLoupe = showLoupe && mark.y < 134;
                    const collidesWithTFU = Math.abs(mark.y - tfuBadgeY) < 25;
                    return (
                      <g key={mark.label}>
                        <line
                          x1={Math.max(216, apexX + 8)}
                          y1={mark.y}
                          x2="366"
                          y2={mark.y}
                          className="fwv-ref-line"
                          opacity={collidesWithLoupe ? 0.2 : 0.75}
                        />
                        {!collidesWithLoupe && !collidesWithTFU && (
                          <text x="366" y={mark.y - 5} textAnchor="end" className="fwv-ref-text">
                            {mark.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Active TFU Fundus Indicator */}
                  <line
                    x1={wombCenterX}
                    y1={fundusY}
                    x2="258"
                    y2={fundusY}
                    className={`fwv-tfu-line ${activeLayer === 'womb' ? 'fwv-tfu-line--highlight' : ''}`}
                  />
                  <circle cx={wombCenterX} cy={fundusY} r="3.6" fill="var(--color-secondary-dark)" />
                  <rect x="258" y={tfuBadgeY - 12} width="108" height="24" rx="12" className="fwv-tfu-badge" />
                  <text x="312" y={tfuBadgeY + 4} textAnchor="middle" className="fwv-tfu-badge-text">
                    Puncak Rahim
                  </text>
                </g>

                {/* Maternal Silhouette Profile */}
                <path
                  d={bellyPath}
                  fill={`url(#${bellyGradId})`}
                  stroke="var(--fwv-belly-stroke)"
                  strokeWidth="1.4"
                  className="fwv-belly-path"
                />

                {/* Soft anatomical rib & pelvic curvature */}
                <path
                  d="M 74 44 C 92 52, 102 68, 96 86 M 56 244 C 74 268, 106 270, 122 254"
                  fill="none"
                  stroke="var(--fwv-belly-stroke)"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  opacity="0.4"
                />

                {/* Muscular Myometrium Uterine Wall enclosing 3D intrauterine space */}
                <path
                  d={outerUterusPath}
                  fill={`url(#${uterusGradId})`}
                  stroke={activeLayer === 'womb' ? 'var(--color-secondary-dark)' : 'var(--fwv-uterus-stroke)'}
                  strokeWidth={activeLayer === 'womb' ? 2.4 : 1.4}
                />

                {/* Deep Photorealistic Burgundy-Amber Uterine Interior */}
                <path d={innerCavityPath} fill={`url(#${cavityGradId})`} />

                {/* Proportional 3D Photorealistic Fetus Inside the Uterine Cavity */}
                <g clipPath={`url(#${wombClipId})`}>
                  <image
                    href={stageImageUrl}
                    x={imgX}
                    y={imgY}
                    width={imgW}
                    height={imgH}
                    preserveAspectRatio="xMidYMid slice"
                    mask={isMicroStage ? `url(#${featherMaskId})` : undefined}
                    className={isSimulatingKick ? 'fwv-fetus-img--kick' : ''}
                  />

                  {/* Subtle warm intrauterine rim integration */}
                  <path
                    d={innerCavityPath}
                    fill="none"
                    stroke="#E79CB8"
                    strokeWidth="2"
                    strokeOpacity="0.28"
                  />
                </g>

                {/* Finite heartbeat ripple waves */}
                {isSimulatingKick && (
                  <g transform={`translate(${wombCenterX} ${wombCenterY})`} aria-hidden="true">
                    <circle cx="0" cy="0" r={Math.max(12, growth.fetusScale * 26)} className="fwv-ripple fwv-ripple--1" />
                    <circle cx="0" cy="0" r={Math.max(12, growth.fetusScale * 26)} className="fwv-ripple fwv-ripple--2" />
                  </g>
                )}

                {/* Navel contour dimple on maternal belly */}
                <path
                  d={`M ${apexX - 1} 163 Q ${apexX - 4} 166 ${apexX - 1} 169`}
                  fill="none"
                  stroke="var(--fwv-belly-stroke)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Early-Week 3D Realism Loupe Inset (Weeks 1-12) */}
                {showLoupe && (
                  <g className="fwv-loupe" aria-hidden="true">
                    <line
                      x1={wombCenterX + 4}
                      y1={wombCenterY}
                      x2="262"
                      y2="82"
                      stroke="var(--color-primary)"
                      strokeWidth="1.4"
                      strokeDasharray="3 3"
                    />
                    <circle cx="308" cy="70" r="47" fill="#21070C" stroke="var(--color-primary)" strokeWidth="2.4" />
                    <g clipPath={`url(#${loupeClipId})`}>
                      <image
                        href={stageImageUrl}
                        x="261"
                        y="23"
                        width="94"
                        height="94"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </g>
                    <rect x="275" y="106" width="66" height="18" rx="9" fill="var(--color-primary)" />
                    <text x="308" y="118.5" textAnchor="middle" className="fwv-loupe-label">
                      Zoom 3D
                    </text>
                  </g>
                )}
              </g>
            </svg>
          ) : (
            /* Full 3D Realism Studio Close-Up View */
            <div className={`fwv-realism-zoom ${isSimulatingKick ? 'fwv-realism-zoom--kick' : ''}`}>
              <img
                src={stageImageUrl}
                alt={`Ilustrasi 3D realistis janin usia minggu ke-${displayWeek} di dalam rahim`}
                width={768}
                height={768}
                className="fwv-realism-img"
              />
              <div className="fwv-realism-vignette" aria-hidden="true" />
              {isSimulatingKick && <div className="fwv-zoom-ripple" aria-hidden="true" />}

              <div className="fwv-zoom-overlay-top" aria-hidden="true">
                <span className="fwv-zoom-pill tabular-nums">
                  {formatLength(growth.lengthCm)} · {formatWeight(growth.weightGrams)}
                </span>
              </div>
              <div className="fwv-zoom-overlay-bottom" aria-hidden="true">
                <span className="fwv-zoom-caption">
                  {activeLayer === 'womb'
                    ? growth.fundusLabel
                    : activeLayer === 'vital'
                      ? growth.heartRateBpm
                      : growth.positionLabel}
                </span>
              </div>
            </div>
          )}
        </button>

        {/* Bottom Proportion Meter */}
        <div className="fwv-proportion-bar">
          <div className="fwv-proportion-labels">
            <span className="fwv-prop-title">Proporsi terhadap bayi lahir (51,2 cm)</span>
            <span className="fwv-prop-pct tabular-nums">{termPercent}%</span>
          </div>
          <div
            className="fwv-proportion-track"
            role="progressbar"
            aria-valuenow={termPercent}
            aria-valuemin={1}
            aria-valuemax={100}
            aria-label="Persentase ukuran panjang janin dibanding bayi lahir"
          >
            <div className="fwv-proportion-fill" style={{ width: `${Math.max(4, termPercent)}%` }} />
          </div>
        </div>
      </div>

      {/* Interactive 40-Week Proportional Growth Scrubber */}
      <div className="fwv-scrubber">
        <div className="fwv-scrubber-top">
          <label htmlFor={sliderId} className="fwv-scrubber-label">
            Geser Usia Kehamilan (Mg 1 s/d 40)
          </label>
          {displayWeek !== currentWeek && (
            <button
              type="button"
              className="fwv-reset-btn tabular-nums"
              onClick={() => handleSelectWeek(currentWeek)}
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span>Kembali ke Mg {currentWeek}</span>
            </button>
          )}
        </div>

        <div className="fwv-scrubber-controls">
          <button
            type="button"
            className="fwv-step-btn"
            onClick={() => handleSelectWeek(displayWeek - 1)}
            disabled={displayWeek <= 1}
            aria-label="Kurangi 1 minggu"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <input
            id={sliderId}
            type="range"
            min="1"
            max="40"
            value={displayWeek}
            onChange={(e) => handleSelectWeek(Number(e.target.value))}
            className="fwv-range-slider"
          />

          <button
            type="button"
            className="fwv-step-btn"
            onClick={() => handleSelectWeek(displayWeek + 1)}
            disabled={displayWeek >= 40}
            aria-label="Tambah 1 minggu"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Key Clinical Biometry Trio */}
      <div className="fwv-metrics-grid">
        <div className="fwv-metric-card">
          <span className="fwv-metric-label">Panjang Janin</span>
          <strong className="fwv-metric-value tabular-nums">{formatLength(growth.lengthCm)}</strong>
          <span className="fwv-metric-hint">{growth.lengthType}</span>
        </div>

        <div className="fwv-metric-card">
          <span className="fwv-metric-label">Perkiraan Berat</span>
          <strong className="fwv-metric-value tabular-nums">{formatWeight(growth.weightGrams)}</strong>
          <span className="fwv-metric-hint">Estimasi klinis rata-rata</span>
        </div>

        <div className="fwv-metric-card">
          <span className="fwv-metric-label">Detak Jantung</span>
          <strong className="fwv-metric-value tabular-nums">{growth.heartRateBpm}</strong>
          <span className="fwv-metric-hint">Normal janin 120-160</span>
        </div>
      </div>

      {/* Anatomical Layer Hotspot Tabs */}
      <div className="fwv-layers" role="group" aria-label="Pilih lapisan informasi anatomi janin dan rahim">
        {[
          { id: 'fetus', label: 'Janin & Posisi', icon: Baby },
          { id: 'womb', label: 'Rahim & TFU', icon: Layers },
          { id: 'vital', label: 'Detak & Respons', icon: HeartPulse },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeLayer === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`fwv-layer-btn ${isActive ? 'fwv-layer-btn--active' : ''}`}
              aria-pressed={isActive}
              onClick={() => setActiveLayer(tab.id)}
            >
              <Icon size={15} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Anatomical Layer Readout */}
      <div className="fwv-detail-box" role="status" aria-live="polite">
        {activeLayer === 'fetus' && (
          <>
            <p className="fwv-detail-lead">
              <strong>Posisi di Dalam Rahim:</strong> {growth.positionLabel}
            </p>
            <p className="fwv-detail-body">{weekInfo?.babyDevelopment}</p>
          </>
        )}
        {activeLayer === 'womb' && (
          <>
            <p className="fwv-detail-lead">
              <strong>Tinggi Puncak Rahim (TFU):</strong> {growth.fundusLabel}
            </p>
            <p className="fwv-detail-body">
              Kantung ketuban menjaga suhu konstan, meredam benturan dari luar, dan memberi ruang gerak bebas sesuai ukuran mingguan bayi.
            </p>
          </>
        )}
        {activeLayer === 'vital' && (
          <>
            <p className="fwv-detail-lead">
              <strong>Kemampuan &amp; Respons Minggu {displayWeek}:</strong> {growth.heartRateBpm}
            </p>
            <p className="fwv-detail-body">{growth.sensoryMilestone}</p>
          </>
        )}
      </div>
    </section>
  );
}
