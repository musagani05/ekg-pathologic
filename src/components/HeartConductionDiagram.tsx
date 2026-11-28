import { useMemo } from 'react';
import type {
  ConductionPartId,
  EcgCondition,
  LeadWaveParams,
  StageId,
} from '../data/ecgConditions';
import { computeHeartPropagation } from '../utils/heartPropagation';

export interface HeartConductionDiagramProps {
  condition: EcgCondition;
  leadParams: LeadWaveParams;
  cycleProgress: number;
  activeStage: StageId | null;
  onSelectStage: (stage: StageId) => void;
}

interface ExteriorCallout {
  id: ConductionPartId;
  label: string;
  side: 'left' | 'right';
  labelX: number;
  labelY: number;
  elbowX: number;
  targetX: number;
  targetY: number;
  clickStage: StageId;
}

/**
 * Seluruh label ditempatkan di ruang luar kiri (x <= 146) dan kanan (x >= 454)
 * dengan jarak vertikal 52-56 px dan garis penunjuk tipis menuju struktur anatomi,
 * sehingga tidak pernah bertabrakan dengan dinding jantung, jalur konduksi, maupun panah vektor.
 */
const EXTERIOR_CALLOUTS: ExteriorCallout[] = [
  // SISI LUAR KIRI
  {
    id: 'sa-node',
    label: 'SA Node',
    side: 'left',
    labelX: 132,
    labelY: 78,
    elbowX: 156,
    targetX: 211,
    targetY: 87,
    clickStage: 1,
  },
  {
    id: 'right-atrium',
    label: 'Atrium Kanan',
    side: 'left',
    labelX: 132,
    labelY: 138,
    elbowX: 154,
    targetX: 190,
    targetY: 132,
    clickStage: 1,
  },
  {
    id: 'av-node',
    label: 'AV Node',
    side: 'left',
    labelX: 132,
    labelY: 198,
    elbowX: 198,
    targetX: 275,
    targetY: 174,
    clickStage: 2,
  },
  {
    id: 'rbb',
    label: 'Cabang Kanan (RBB)',
    side: 'left',
    labelX: 132,
    labelY: 262,
    elbowX: 206,
    targetX: 278,
    targetY: 278,
    clickStage: 3,
  },
  {
    id: 'right-ventricle',
    label: 'Ventrikel Kanan',
    side: 'left',
    labelX: 132,
    labelY: 326,
    elbowX: 158,
    targetX: 199,
    targetY: 314,
    clickStage: 3,
  },

  // SISI LUAR KANAN
  {
    id: 'left-atrium',
    label: 'Atrium Kiri',
    side: 'right',
    labelX: 448,
    labelY: 82,
    elbowX: 424,
    targetX: 383,
    targetY: 111,
    clickStage: 1,
  },
  {
    id: 'his-bundle',
    label: 'Bundle of His',
    side: 'right',
    labelX: 448,
    labelY: 144,
    elbowX: 412,
    targetX: 289,
    targetY: 203,
    clickStage: 2,
  },
  {
    id: 'lbb',
    label: 'Cabang Kiri (LBB)',
    side: 'right',
    labelX: 448,
    labelY: 208,
    elbowX: 414,
    targetX: 296,
    targetY: 250,
    clickStage: 3,
  },
  {
    id: 'purkinje',
    label: 'Serabut Purkinje',
    side: 'right',
    labelX: 448,
    labelY: 272,
    elbowX: 424,
    targetX: 391,
    targetY: 295,
    clickStage: 3,
  },
  {
    id: 'left-ventricle',
    label: 'Ventrikel Kiri',
    side: 'right',
    labelX: 448,
    labelY: 334,
    elbowX: 426,
    targetX: 395,
    targetY: 337,
    clickStage: 4,
  },
];

const RA_PATH =
  'M 196 82 C 166 94, 158 152, 188 188 L 270 192 L 268 96 C 250 80, 222 76, 196 82 Z';
const LA_PATH =
  'M 278 96 C 312 78, 366 88, 380 134 C 390 164, 376 186, 356 192 L 280 192 Z';
const VENT_WALL_PATH =
  'M 186 200 C 170 254, 190 330, 294 366 C 372 354, 406 274, 366 200 L 344 200 C 374 264, 350 326, 294 340 C 282 336, 276 328, 270 320 L 292 214 L 274 214 L 254 316 C 210 296, 194 250, 202 200 Z';

const RV_PURKINJE_PATHS = [
  'M 220 302 L 196 290',
  'M 210 284 L 190 264',
  'M 206 280 L 190 238',
];

const LV_INF_PURKINJE_PATHS = [
  'M 306 330 L 316 348',
  'M 332 316 L 354 328',
  'M 342 294 L 366 296',
];

const LV_ANT_PURKINJE_PATHS = [
  'M 342 258 L 370 260',
  'M 334 256 L 364 228',
];

interface ProgressiveTractPathProps {
  d: string;
  progress: number;
  intensity: number;
  baseStrokeWidth: number;
  activeStrokeWidth: number;
  activeColor: string;
  inactiveColor?: string;
  sparkColor?: string;
  dashedBase?: string;
}

function ProgressiveTractPath({
  d,
  progress,
  intensity,
  baseStrokeWidth,
  activeStrokeWidth,
  activeColor,
  inactiveColor = '#cbd5e1',
  sparkColor = '#fef9c3',
  dashedBase,
}: ProgressiveTractPathProps) {
  const showActive = progress > 0.005 && intensity > 0.01;
  const showSpark = showActive && progress > 0.02 && progress < 0.97;
  const dashLength = Math.max(0.05, progress * 100);
  const sparkOffset = -Math.max(0, progress * 100 - 1.8);

  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={inactiveColor}
        strokeWidth={baseStrokeWidth}
        strokeDasharray={dashedBase}
        strokeLinecap="round"
      />
      {showActive && (
        <>
          <path
            d={d}
            pathLength={100}
            fill="none"
            stroke="#ffffff"
            strokeWidth={activeStrokeWidth + 2.4}
            strokeDasharray={`${dashLength} 110`}
            strokeLinecap="round"
            opacity={intensity * 0.82}
          />
          <path
            d={d}
            pathLength={100}
            fill="none"
            stroke={activeColor}
            strokeWidth={activeStrokeWidth}
            strokeDasharray={`${dashLength} 110`}
            strokeLinecap="round"
            opacity={intensity}
          />
        </>
      )}
      {showSpark && (
        <path
          d={d}
          pathLength={100}
          fill="none"
          stroke={sparkColor}
          strokeWidth={activeStrokeWidth + 1.8}
          strokeDasharray="1.8 110"
          strokeDashoffset={sparkOffset}
          strokeLinecap="round"
          opacity={Math.min(1, intensity * 1.1)}
        />
      )}
    </>
  );
}

export function HeartConductionDiagram({
  condition,
  leadParams,
  cycleProgress,
  activeStage,
  onSelectStage,
}: HeartConductionDiagramProps) {
  const prop = useMemo(
    () => computeHeartPropagation(condition, leadParams, cycleProgress),
    [condition, leadParams, cycleProgress],
  );

  const stageMeta = activeStage ? condition.stages[activeStage] : null;
  const activeParts = stageMeta ? stageMeta.activeParts : [];

  const isPartActive = (part: ConductionPartId) => activeParts.includes(part);

  const rightAtriumActive =
    prop.raWave.intensity > 0.15 || isPartActive('right-atrium');
  const leftAtriumActive =
    prop.laWave.intensity > 0.15 || isPartActive('left-atrium');
  const atrialTractLit =
    prop.internodalIntensity > 0.15 || prop.bachmannIntensity > 0.15;

  const ventLit =
    prop.rvWave.intensity > 0.15 ||
    prop.lvWave.intensity > 0.15 ||
    prop.repolIntensity > 0.15 ||
    prop.stPlateauIntensity > 0.15;

  const ventStroke =
    prop.repolIntensity > 0.18 || prop.stPlateauIntensity > 0.25
      ? '#059669'
      : prop.rvWave.intensity > 0.15 || prop.lvWave.intensity > 0.15
        ? '#dc2626'
        : '#cbd5e1';

  const legendVectors = stageMeta ? stageMeta.vectors : [];

  return (
    <section className="visual-card" aria-label="Visualisasi Anatomi dan Konduksi Jantung">
      <header className="visual-card-header">
        <div>
          <span className="visual-eyebrow">ANATOMI & JALUR LISTRIK</span>
          <h2 className="visual-title">Konduksi & Vektor Jantung</h2>
        </div>
        {stageMeta ? (
          <span
            className="active-stage-chip"
            style={{
              backgroundColor: stageMeta.softBg,
              color: stageMeta.accentColor,
              borderColor: `${stageMeta.accentColor}44`,
            }}
          >
            Tahap {stageMeta.id}: {stageMeta.heartProcessTitle}
          </span>
        ) : (
          <span className="active-stage-chip neutral">Fase Istirahat (Diastol Listrik)</span>
        )}
      </header>

      <div className="heart-canvas-box">
        <svg
          viewBox="0 0 580 404"
          className="heart-clean-svg"
          role="img"
          aria-label="Diagram skematik konduksi jantung dengan garis penunjuk anatomi luar"
        >
          <defs>
            <filter id="part-glow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id="ra-myo-clip">
              <path d={RA_PATH} />
            </clipPath>
            <clipPath id="la-myo-clip">
              <path d={LA_PATH} />
            </clipPath>
            <clipPath id="vent-wall-clip">
              <path d={VENT_WALL_PATH} />
            </clipPath>
            <clipPath id="rv-region-clip">
              <rect x="150" y="190" width="138" height="190" />
            </clipPath>
            <clipPath id="lv-region-clip">
              <rect x="272" y="190" width="145" height="190" />
            </clipPath>

            <marker
              id="vec-arrow-blue"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb" />
            </marker>
            <marker
              id="vec-arrow-amber"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
            </marker>
            <marker
              id="vec-arrow-orange"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ea580c" />
            </marker>
            <marker
              id="vec-arrow-red"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
            </marker>
            <marker
              id="vec-arrow-green"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
            </marker>
          </defs>

          {/* SILUET JANTUNG DIPERBESAR DI TENGAH */}
          <g transform="translate(-39, -45) scale(1.18)">
            {/* Muara Vena Cava Superior */}
            <path
              d="M 196 48 L 196 84 M 220 48 L 220 80"
              stroke="#cbd5e1"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Atrium Kanan & Atrium Kiri (Dasar + Gelombang Depolarisasi Progresif Terklip) */}
            <path
              d={RA_PATH}
              fill={
                prop.raWave.intensity > 0.15
                  ? 'rgba(37, 99, 235, 0.09)'
                  : condition.hypertrophyZone === 'right-atrium'
                    ? 'rgba(37, 99, 235, 0.08)'
                    : '#f8fafc'
              }
              className="clickable-anatomy"
              onClick={() => onSelectStage(1)}
            />
            {prop.raWave.spread > 0.01 && prop.raWave.intensity > 0.01 && (
              <g clipPath="url(#ra-myo-clip)" pointerEvents="none">
                <circle
                  cx={prop.raWave.originX}
                  cy={prop.raWave.originY}
                  r={prop.raWave.spread * prop.raWave.maxRadius}
                  fill={`rgba(37, 99, 235, ${0.33 * prop.raWave.intensity})`}
                />
                <circle
                  cx={prop.raWave.originX}
                  cy={prop.raWave.originY}
                  r={prop.raWave.spread * prop.raWave.maxRadius}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.6"
                  opacity={prop.raWave.intensity * (1 - prop.raWave.spread * 0.45)}
                />
              </g>
            )}
            <path
              d={RA_PATH}
              fill="none"
              stroke={
                rightAtriumActive || condition.hypertrophyZone === 'right-atrium'
                  ? '#2563eb'
                  : '#cbd5e1'
              }
              strokeWidth={
                prop.raWave.intensity > 0.15
                  ? 3
                  : condition.hypertrophyZone === 'right-atrium'
                    ? 2.2
                    : 1.7
              }
              filter={
                prop.raWave.intensity > 0.25 &&
                condition.hypertrophyZone === 'right-atrium'
                  ? 'url(#part-glow)'
                  : undefined
              }
              pointerEvents="none"
            />

            <path
              d={LA_PATH}
              fill={
                prop.laWave.intensity > 0.15
                  ? 'rgba(37, 99, 235, 0.09)'
                  : condition.hypertrophyZone === 'left-atrium'
                    ? 'rgba(37, 99, 235, 0.08)'
                    : '#f8fafc'
              }
              className="clickable-anatomy"
              onClick={() => onSelectStage(1)}
            />
            {prop.laWave.spread > 0.01 && prop.laWave.intensity > 0.01 && (
              <g clipPath="url(#la-myo-clip)" pointerEvents="none">
                <circle
                  cx={prop.laWave.originX}
                  cy={prop.laWave.originY}
                  r={prop.laWave.spread * prop.laWave.maxRadius}
                  fill={`rgba(37, 99, 235, ${0.33 * prop.laWave.intensity})`}
                />
                <circle
                  cx={prop.laWave.originX}
                  cy={prop.laWave.originY}
                  r={prop.laWave.spread * prop.laWave.maxRadius}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.6"
                  opacity={prop.laWave.intensity * (1 - prop.laWave.spread * 0.45)}
                />
              </g>
            )}
            <path
              d={LA_PATH}
              fill="none"
              stroke={
                leftAtriumActive || condition.hypertrophyZone === 'left-atrium'
                  ? '#2563eb'
                  : '#cbd5e1'
              }
              strokeWidth={
                prop.laWave.intensity > 0.15
                  ? 3
                  : condition.hypertrophyZone === 'left-atrium'
                    ? 2.2
                    : 1.7
              }
              filter={
                prop.laWave.intensity > 0.25 &&
                condition.hypertrophyZone === 'left-atrium'
                  ? 'url(#part-glow)'
                  : undefined
              }
              pointerEvents="none"
            />

            {/* Cincin Isolator Fibrosa AV */}
            <line
              x1="182"
              y1="195"
              x2="262"
              y2="195"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="288"
              y1="195"
              x2="368"
              y2="195"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Dinding Miokardium Ventrikel (RV, Septum, LV Tebal) + Sebaran Gelombang Progresif */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(activeStage === 3 ? 4 : 3)}
            >
              <path
                d={VENT_WALL_PATH}
                fill={
                  condition.hypertrophyZone === 'left-ventricle' ||
                  condition.hypertrophyZone === 'right-ventricle'
                    ? 'rgba(220, 38, 38, 0.09)'
                    : 'rgba(226, 232, 240, 0.45)'
                }
              />

              {/* Gelombang Depolarisasi & Repolarisasi Terklip di Dinding Ventrikel */}
              <g clipPath="url(#vent-wall-clip)" pointerEvents="none">
                {/* LV wave */}
                {prop.lvWave.spread > 0.01 && prop.lvWave.intensity > 0.01 && (
                  <g clipPath="url(#lv-region-clip)">
                    <circle
                      cx={prop.lvWave.originX}
                      cy={prop.lvWave.originY}
                      r={prop.lvWave.spread * prop.lvWave.maxRadius}
                      fill={`rgba(220, 38, 38, ${0.33 * prop.lvWave.intensity})`}
                    />
                    <circle
                      cx={prop.lvWave.originX}
                      cy={prop.lvWave.originY}
                      r={prop.lvWave.spread * prop.lvWave.maxRadius}
                      fill="none"
                      stroke={prop.lvWave.isSlowSpread ? '#ea580c' : '#dc2626'}
                      strokeWidth={prop.lvWave.isSlowSpread ? 2.8 : 2.4}
                      strokeDasharray={prop.lvWave.isSlowSpread ? '5 4' : undefined}
                      opacity={prop.lvWave.intensity * (1 - prop.lvWave.spread * 0.35)}
                    />
                  </g>
                )}

                {/* RV wave (normal atau rambatan lambat trans-septal pada RBBB) */}
                {prop.rvWave.spread > 0.01 && prop.rvWave.intensity > 0.01 && (
                  <g clipPath="url(#rv-region-clip)">
                    <circle
                      cx={prop.rvWave.originX}
                      cy={prop.rvWave.originY}
                      r={prop.rvWave.spread * prop.rvWave.maxRadius}
                      fill={
                        prop.rvWave.isSlowSpread
                          ? `rgba(234, 88, 12, ${0.33 * prop.rvWave.intensity})`
                          : `rgba(220, 38, 38, ${0.33 * prop.rvWave.intensity})`
                      }
                    />
                    <circle
                      cx={prop.rvWave.originX}
                      cy={prop.rvWave.originY}
                      r={prop.rvWave.spread * prop.rvWave.maxRadius}
                      fill="none"
                      stroke={prop.rvWave.isSlowSpread ? '#ea580c' : '#dc2626'}
                      strokeWidth={prop.rvWave.isSlowSpread ? 3 : 2.4}
                      strokeDasharray={prop.rvWave.isSlowSpread ? '5 4' : undefined}
                      opacity={prop.rvWave.intensity * (1 - prop.rvWave.spread * 0.32)}
                    />
                    {prop.rvWave.isSlowSpread && prop.rvWave.spread > 0.25 && (
                      <circle
                        cx={prop.rvWave.originX}
                        cy={prop.rvWave.originY}
                        r={prop.rvWave.spread * prop.rvWave.maxRadius * 0.62}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1.9"
                        strokeDasharray="4 4"
                        opacity={prop.rvWave.intensity * 0.72}
                      />
                    )}
                  </g>
                )}

                {/* Fase Plateau ST (Segmen ST) */}
                {prop.stPlateauIntensity > 0.01 && (
                  <rect
                    x="160"
                    y="195"
                    width="260"
                    height="185"
                    fill={`rgba(16, 185, 129, ${0.18 * prop.stPlateauIntensity})`}
                  />
                )}

                {/* Sapuan Repolarisasi Ventrikel (Gelombang T: Epikardium -> Endokardium) */}
                {prop.repolIntensity > 0.01 && prop.repolProgress > 0.01 && (
                  <>
                    <circle
                      cx="306"
                      cy="358"
                      r={prop.repolProgress * 205}
                      fill={`rgba(5, 150, 105, ${0.32 * prop.repolIntensity})`}
                    />
                    <circle
                      cx="306"
                      cy="358"
                      r={prop.repolProgress * 205}
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.6"
                      opacity={prop.repolIntensity * (1 - prop.repolProgress * 0.4)}
                    />
                  </>
                )}
              </g>

              {/* Garis tepi dinding ventrikel yang tajam */}
              <path
                d={VENT_WALL_PATH}
                fill="none"
                stroke={
                  ventLit
                    ? ventStroke
                    : condition.hypertrophyZone === 'left-ventricle' ||
                        condition.hypertrophyZone === 'right-ventricle'
                      ? '#ef4444'
                      : '#cbd5e1'
                }
                strokeWidth={
                  ventLit
                    ? 3
                    : condition.hypertrophyZone === 'left-ventricle' ||
                        condition.hypertrophyZone === 'right-ventricle'
                      ? 2.2
                      : 1.7
                }
                filter={ventLit ? 'url(#part-glow)' : undefined}
              />

              {/* Rongga Dalam RV & LV */}
              <path
                d="M 204 202 C 196 248, 212 294, 254 313 L 273 214 L 204 202 Z"
                fill="#ffffff"
                opacity="0.82"
              />
              <path
                d="M 293 214 L 272 320 C 294 336, 348 324, 343 202 Z"
                fill="#ffffff"
                opacity="0.82"
              />
            </g>

            {/* JALUR INTERNODAL & BACHMANN (Mengalir di Tahap 1) */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(1)}
              filter={atrialTractLit ? 'url(#part-glow)' : undefined}
            >
              <ProgressiveTractPath
                d="M 216 110 C 254 96, 302 98, 346 124"
                progress={prop.bachmannProgress}
                intensity={prop.bachmannIntensity}
                baseStrokeWidth={2}
                activeStrokeWidth={4}
                activeColor="#2563eb"
                inactiveColor="#cbd5e1"
                sparkColor="#bfdbfe"
              />
              <ProgressiveTractPath
                d="M 214 112 C 238 128, 254 150, 266 180"
                progress={prop.internodalProgress}
                intensity={prop.internodalIntensity}
                baseStrokeWidth={1.8}
                activeStrokeWidth={3.5}
                activeColor="#2563eb"
                inactiveColor="#cbd5e1"
                sparkColor="#bfdbfe"
              />
              <ProgressiveTractPath
                d="M 208 116 C 218 148, 240 168, 264 184"
                progress={prop.internodalProgress}
                intensity={prop.internodalIntensity}
                baseStrokeWidth={1.8}
                activeStrokeWidth={3.2}
                activeColor="#2563eb"
                inactiveColor="#cbd5e1"
                sparkColor="#bfdbfe"
                dashedBase="5 3"
              />
            </g>

            {/* BUNDLE OF HIS (Mengalir di akhir Tahap 2 -> awal Tahap 3) */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(2)}
              filter={prop.hisIntensity > 0.2 ? 'url(#part-glow)' : undefined}
            >
              <ProgressiveTractPath
                d="M 271 190 L 283 226"
                progress={prop.hisProgress}
                intensity={prop.hisIntensity}
                baseStrokeWidth={3.2}
                activeStrokeWidth={5.8}
                activeColor="#d97706"
                inactiveColor="#cbd5e1"
                sparkColor="#fef08a"
              />
            </g>

            {/* CABANG KANAN / RBB (Berhenti sebelum X bila RBBB) */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(3)}
              filter={prop.rbbIntensity > 0.2 && !prop.rbbBlocked ? 'url(#part-glow)' : undefined}
            >
              <ProgressiveTractPath
                d="M 282 226 L 258 316 C 242 324, 220 308, 206 280"
                progress={prop.rbbProgress}
                intensity={prop.rbbIntensity}
                baseStrokeWidth={2.2}
                activeStrokeWidth={4.4}
                activeColor={prop.rbbBlocked ? '#f59e0b' : '#dc2626'}
                inactiveColor={prop.rbbBlocked ? '#e2e8f0' : '#cbd5e1'}
                sparkColor="#fef08a"
              />
            </g>

            {/* CABANG KIRI / LBB (Trunk/Posterior & Anterior Fascicle) */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(3)}
              filter={
                prop.lbbTrunkIntensity > 0.2 || prop.lafIntensity > 0.2
                  ? 'url(#part-glow)'
                  : undefined
              }
            >
              <ProgressiveTractPath
                d="M 284 226 L 278 314 C 292 336, 322 332, 342 304"
                progress={prop.lbbTrunkProgress}
                intensity={prop.lbbTrunkIntensity}
                baseStrokeWidth={2.4}
                activeStrokeWidth={4.6}
                activeColor="#dc2626"
                inactiveColor={prop.lbbBlocked ? '#e2e8f0' : '#cbd5e1'}
                sparkColor="#fef08a"
              />
              <ProgressiveTractPath
                d="M 283 242 C 302 256, 322 268, 342 258"
                progress={prop.lafProgress}
                intensity={prop.lafIntensity}
                baseStrokeWidth={2}
                activeStrokeWidth={3.8}
                activeColor={prop.lafBlocked ? '#f59e0b' : '#ea580c'}
                inactiveColor={prop.lbbBlocked || prop.lafBlocked ? '#e2e8f0' : '#cbd5e1'}
                sparkColor="#fef08a"
              />
            </g>

            {/* SERABUT PURKINJE (Bercabang simultan sesuai jalur yang teraktivasi) */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(3)}
              filter={
                prop.purkinjeRvIntensity > 0.2 ||
                prop.purkinjeLvInfIntensity > 0.2 ||
                prop.purkinjeLvAntIntensity > 0.2
                  ? 'url(#part-glow)'
                  : undefined
              }
            >
              {RV_PURKINJE_PATHS.map((d) => (
                <ProgressiveTractPath
                  key={d}
                  d={d}
                  progress={prop.purkinjeRvProgress}
                  intensity={prop.purkinjeRvIntensity}
                  baseStrokeWidth={1.7}
                  activeStrokeWidth={3.2}
                  activeColor="#dc2626"
                  inactiveColor={prop.rbbBlocked ? '#e2e8f0' : '#cbd5e1'}
                  sparkColor="#fef08a"
                />
              ))}
              {LV_INF_PURKINJE_PATHS.map((d) => (
                <ProgressiveTractPath
                  key={d}
                  d={d}
                  progress={prop.purkinjeLvInfProgress}
                  intensity={prop.purkinjeLvInfIntensity}
                  baseStrokeWidth={1.7}
                  activeStrokeWidth={3.2}
                  activeColor="#dc2626"
                  inactiveColor={prop.lbbBlocked || prop.lpfBlocked ? '#e2e8f0' : '#cbd5e1'}
                  sparkColor="#fef08a"
                />
              ))}
              {LV_ANT_PURKINJE_PATHS.map((d) => (
                <ProgressiveTractPath
                  key={d}
                  d={d}
                  progress={prop.purkinjeLvAntProgress}
                  intensity={prop.purkinjeLvAntIntensity}
                  baseStrokeWidth={1.7}
                  activeStrokeWidth={3.2}
                  activeColor="#ea580c"
                  inactiveColor={prop.lbbBlocked || prop.lafBlocked ? '#e2e8f0' : '#cbd5e1'}
                  sparkColor="#fef08a"
                />
              ))}
            </g>

            {/* SA NODE (Sinkron deterministik dengan cycleProgress, bebas kedipan CSS) */}
            <g className="clickable-anatomy" onClick={() => onSelectStage(1)}>
              {prop.saActivity > 0.02 && (
                <circle
                  cx="212"
                  cy="112"
                  r={11 + prop.saPulseProgress * 10}
                  fill={`rgba(37, 99, 235, ${0.24 * prop.saActivity * (1 - prop.saPulseProgress * 0.45)})`}
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  opacity={prop.saActivity * (1 - prop.saPulseProgress * 0.4)}
                />
              )}
              <ellipse
                cx="212"
                cy="112"
                rx="9.5"
                ry="6.8"
                transform="rotate(-18 212 112)"
                fill={prop.saActivity > 0.15 ? '#1d4ed8' : '#94a3b8'}
                stroke="#ffffff"
                strokeWidth="2"
                filter={prop.saActivity > 0.25 ? 'url(#part-glow)' : undefined}
              />
            </g>

            {/* AV NODE (Jeda fisiologis sinkron dengan Segmen PR) */}
            <g className="clickable-anatomy" onClick={() => onSelectStage(2)}>
              {prop.avActivity > 0.02 && (
                <circle
                  cx="266"
                  cy="186"
                  r={10 + prop.avRingProgress * 7}
                  fill={`rgba(217, 119, 6, ${0.24 * prop.avActivity})`}
                  stroke="#d97706"
                  strokeWidth="1.5"
                  opacity={prop.avActivity * 0.9}
                />
              )}
              <ellipse
                cx="266"
                cy="186"
                rx="8.5"
                ry="6.5"
                fill={prop.avActivity > 0.15 ? '#d97706' : '#94a3b8'}
                stroke="#ffffff"
                strokeWidth="2"
                filter={prop.avActivity > 0.25 ? 'url(#part-glow)' : undefined}
              />
            </g>

            {/* INDIKATOR HALUS LOKASI BLOK KONDUKSI / ZONA ISKEMIA / PEMBESARAN RUANG (Tanpa teks menimpa jantung) */}
            {condition.hypertrophyZone === 'right-atrium' && (
              <path
                d="M 194 78 C 158 92, 148 154, 184 191"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="5 3"
                opacity="0.85"
                pointerEvents="none"
              />
            )}
            {condition.hypertrophyZone === 'left-atrium' && (
              <path
                d="M 280 92 C 316 74, 372 84, 386 134 C 395 164, 380 188, 360 194"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="5 3"
                opacity="0.85"
                pointerEvents="none"
              />
            )}
            {condition.hypertrophyZone === 'left-ventricle' && (
              <path
                d="M 370 202 C 410 278, 374 358, 294 370"
                fill="none"
                stroke="#dc2626"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeDasharray="6 3"
                opacity="0.85"
                pointerEvents="none"
              />
            )}
            {condition.hypertrophyZone === 'right-ventricle' && (
              <path
                d="M 182 200 C 165 256, 186 332, 286 368"
                fill="none"
                stroke="#dc2626"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeDasharray="6 3"
                opacity="0.85"
                pointerEvents="none"
              />
            )}
            {condition.ischemicZone === 'anterior-lv' && (
              <ellipse
                cx="340"
                cy="296"
                rx="22"
                ry="32"
                transform="rotate(24 340 296)"
                fill="rgba(220, 38, 38, 0.22)"
                stroke="#ef4444"
                strokeWidth="1.6"
                strokeDasharray="3 2"
                pointerEvents="none"
              />
            )}
            {condition.ischemicZone === 'inferior' && (
              <ellipse
                cx="294"
                cy="346"
                rx="34"
                ry="15"
                transform="rotate(-8 294 346)"
                fill="rgba(220, 38, 38, 0.22)"
                stroke="#ef4444"
                strokeWidth="1.6"
                strokeDasharray="3 2"
                pointerEvents="none"
              />
            )}
            {condition.ischemicZone === 'subendocardial-lv' && (
              <path
                d="M 294 220 L 278 318 C 296 330, 336 320, 339 218"
                fill="none"
                stroke="#d97706"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="4 3"
                opacity="0.65"
                pointerEvents="none"
              />
            )}

            {condition.blockedTarget === 'av-node' && (
              <circle
                cx="266"
                cy="186"
                r="13"
                fill="none"
                stroke="#dc2626"
                strokeWidth="1.8"
                strokeDasharray="3 2"
                pointerEvents="none"
              />
            )}
            {condition.blockedTarget === 'av-reentry' && (
              <circle
                cx="266"
                cy="186"
                r="14"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                strokeDasharray="6 3"
                pointerEvents="none"
              />
            )}
            {condition.blockedTarget === 'rbb' && (
              <g transform="translate(274, 258)" pointerEvents="none">
                <circle cx="0" cy="0" r="7" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.8" />
                <path
                  d="M -3 -3 L 3 3 M 3 -3 L -3 3"
                  stroke="#dc2626"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            )}
            {condition.blockedTarget === 'lbb' && (
              <g transform="translate(284, 240)" pointerEvents="none">
                <circle cx="0" cy="0" r="7" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.8" />
                <path
                  d="M -3 -3 L 3 3 M 3 -3 L -3 3"
                  stroke="#dc2626"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            )}
            {condition.blockedTarget === 'left-anterior-fascicle' && (
              <g pointerEvents="none">
                <path
                  d="M 368 202 C 384 232, 388 262, 384 290"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                  opacity="0.82"
                />
                <g transform="translate(314, 258)">
                  <circle cx="0" cy="0" r="6.5" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.7" />
                  <path
                    d="M -2.6 -2.6 L 2.6 2.6 M 2.6 -2.6 L -2.6 2.6"
                    stroke="#dc2626"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            )}
            {condition.blockedTarget === 'left-posterior-fascicle' && (
              <g pointerEvents="none">
                <path
                  d="M 184 202 C 168 256, 188 330, 286 366"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                  opacity="0.82"
                />
                <g transform="translate(280, 294)">
                  <circle cx="0" cy="0" r="6.5" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.7" />
                  <path
                    d="M -2.6 -2.6 L 2.6 2.6 M 2.6 -2.6 L -2.6 2.6"
                    stroke="#dc2626"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            )}

            {/* PANAH VEKTOR AKTIF PROGRESIF (Tanpa teks menimpa jantung) */}
            {prop.vectors.map((vec) => {
              const markerId =
                vec.color === '#2563eb'
                  ? 'vec-arrow-blue'
                  : vec.color === '#d97706'
                    ? 'vec-arrow-amber'
                    : vec.color === '#ea580c'
                      ? 'vec-arrow-orange'
                      : vec.color === '#059669'
                        ? 'vec-arrow-green'
                        : 'vec-arrow-red';

              return (
                <g key={vec.id} pointerEvents="none" opacity={vec.opacity}>
                  <line
                    x1={vec.x1}
                    y1={vec.y1}
                    x2={vec.currentX2}
                    y2={vec.currentY2}
                    stroke="#ffffff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <line
                    x1={vec.x1}
                    y1={vec.y1}
                    x2={vec.currentX2}
                    y2={vec.currentY2}
                    stroke={vec.color}
                    strokeWidth="3.4"
                    strokeDasharray={vec.dashed ? '5 4' : undefined}
                    strokeLinecap="round"
                    markerEnd={vec.scale > 0.18 ? `url(#${markerId})` : undefined}
                  />
                </g>
              );
            })}
          </g>

          {/* GARIS PENUNJUK (LEADER LINES) & LABEL ANATOMI DI RUANG LUAR */}
          {EXTERIOR_CALLOUTS.map((item) => {
            const active = isPartActive(item.id);
            const stageAccent = stageMeta?.accentColor ?? '#0f172a';
            const lineY = item.labelY - 4;
            const startLineX = item.side === 'left' ? item.labelX + 6 : item.labelX - 6;

            return (
              <g
                key={item.id}
                className="callout-group"
                onClick={() => onSelectStage(item.clickStage)}
              >
                <polyline
                  points={`${startLineX},${lineY} ${item.elbowX},${lineY} ${item.targetX},${item.targetY}`}
                  fill="none"
                  stroke={active ? stageAccent : '#cbd5e1'}
                  strokeWidth={active ? 2 : 1.05}
                  opacity={active ? 0.98 : 0.68}
                />
                <circle
                  cx={item.targetX}
                  cy={item.targetY}
                  r={active ? 3.8 : 2.3}
                  fill={active ? stageAccent : '#94a3b8'}
                />
                <text
                  x={item.labelX}
                  y={item.labelY}
                  textAnchor={item.side === 'left' ? 'end' : 'start'}
                  fontSize={active ? '12' : '11.5'}
                  fontWeight={active ? '800' : '500'}
                  fill={active ? stageAccent : '#64748b'}
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* KETERANGAN VEKTOR TERPISAH RAPI (AUTO-WRAPPING ROUNDED BADGE) */}
        {legendVectors.length > 0 && (
          <div
            className="heart-vector-badge"
            style={{
              backgroundColor: stageMeta?.softBg ?? '#f8fafc',
              borderColor: stageMeta ? `${stageMeta.accentColor}55` : '#cbd5e1',
              color: stageMeta?.accentColor ?? '#334155',
            }}
          >
            Arah Vektor Aktif: {legendVectors.map((v) => v.label).join('  •  ')}
          </div>
        )}
      </div>

      <p className="visual-footer-caption">
        {stageMeta
          ? stageMeta.heartStatusCaption
          : 'Seluruh ruang jantung berada pada fase istirahat polarisasi sebelum SA Node memulai siklus berikutnya.'}
      </p>
    </section>
  );
}
