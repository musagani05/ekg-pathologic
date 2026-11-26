import type {
  ConductionPartId,
  EcgCondition,
  StageId,
} from '../data/ecgConditions';

export interface HeartConductionDiagramProps {
  condition: EcgCondition;
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
    labelX: 144,
    labelY: 96,
    elbowX: 174,
    targetX: 222,
    targetY: 112,
    clickStage: 1,
  },
  {
    id: 'right-atrium',
    label: 'Atrium Kanan',
    side: 'left',
    labelX: 144,
    labelY: 150,
    elbowX: 172,
    targetX: 204,
    targetY: 150,
    clickStage: 1,
  },
  {
    id: 'av-node',
    label: 'AV Node',
    side: 'left',
    labelX: 144,
    labelY: 204,
    elbowX: 214,
    targetX: 270,
    targetY: 188,
    clickStage: 2,
  },
  {
    id: 'rbb',
    label: 'Cabang Kanan (RBB)',
    side: 'left',
    labelX: 144,
    labelY: 260,
    elbowX: 222,
    targetX: 279,
    targetY: 274,
    clickStage: 3,
  },
  {
    id: 'right-ventricle',
    label: 'Ventrikel Kanan',
    side: 'left',
    labelX: 144,
    labelY: 318,
    elbowX: 176,
    targetX: 212,
    targetY: 314,
    clickStage: 3,
  },

  // SISI LUAR KANAN
  {
    id: 'left-atrium',
    label: 'Atrium Kiri',
    side: 'right',
    labelX: 456,
    labelY: 102,
    elbowX: 418,
    targetX: 368,
    targetY: 132,
    clickStage: 1,
  },
  {
    id: 'his-bundle',
    label: 'Bundle of His',
    side: 'right',
    labelX: 456,
    labelY: 156,
    elbowX: 404,
    targetX: 288,
    targetY: 210,
    clickStage: 2,
  },
  {
    id: 'lbb',
    label: 'Cabang Kiri (LBB)',
    side: 'right',
    labelX: 456,
    labelY: 210,
    elbowX: 406,
    targetX: 294,
    targetY: 250,
    clickStage: 3,
  },
  {
    id: 'purkinje',
    label: 'Serabut Purkinje',
    side: 'right',
    labelX: 456,
    labelY: 266,
    elbowX: 416,
    targetX: 374,
    targetY: 288,
    clickStage: 3,
  },
  {
    id: 'left-ventricle',
    label: 'Ventrikel Kiri',
    side: 'right',
    labelX: 456,
    labelY: 324,
    elbowX: 420,
    targetX: 378,
    targetY: 324,
    clickStage: 4,
  },
];

export function HeartConductionDiagram({
  condition,
  activeStage,
  onSelectStage,
}: HeartConductionDiagramProps) {
  const stageMeta = activeStage ? condition.stages[activeStage] : null;
  const activeParts = stageMeta ? stageMeta.activeParts : [];

  const isPartActive = (part: ConductionPartId) => activeParts.includes(part);

  const atrialActive = isPartActive('right-atrium') || isPartActive('left-atrium');
  const ventricleActive = isPartActive('right-ventricle') || isPartActive('left-ventricle');

  const ventFill =
    activeStage === 4
      ? 'rgba(5, 150, 105, 0.22)'
      : activeStage === 3
        ? 'rgba(220, 38, 38, 0.22)'
        : 'rgba(226, 232, 240, 0.45)';

  const ventStroke =
    activeStage === 4 ? '#059669' : activeStage === 3 ? '#dc2626' : '#cbd5e1';

  const vectors = stageMeta ? stageMeta.vectors : [];

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
          viewBox="0 0 600 424"
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

          {/* SILUET JANTUNG DI TENGAH (x: 185..405, y: 76..366) */}
          <g transform="translate(10, 0)">
            {/* Muara Vena Cava Superior */}
            <path
              d="M 196 48 L 196 84 M 220 48 L 220 80"
              stroke="#cbd5e1"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Atrium Kanan & Atrium Kiri */}
            <path
              d="M 196 82 C 166 94, 158 152, 188 188 L 270 192 L 268 96 C 250 80, 222 76, 196 82 Z"
              fill={atrialActive ? 'rgba(37, 99, 235, 0.16)' : '#f8fafc'}
              stroke={atrialActive ? '#2563eb' : '#cbd5e1'}
              strokeWidth={atrialActive ? 2.6 : 1.8}
              className="clickable-anatomy"
              onClick={() => onSelectStage(1)}
            />
            <path
              d="M 278 96 C 312 78, 366 88, 380 134 C 390 164, 376 186, 356 192 L 280 192 Z"
              fill={atrialActive ? 'rgba(37, 99, 235, 0.16)' : '#f8fafc'}
              stroke={atrialActive ? '#2563eb' : '#cbd5e1'}
              strokeWidth={atrialActive ? 2.6 : 1.8}
              className="clickable-anatomy"
              onClick={() => onSelectStage(1)}
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

            {/* Dinding Miokardium Ventrikel (RV, Septum, LV Tebal) */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(activeStage === 3 ? 4 : 3)}
            >
              <path
                d="M 186 200 C 170 254, 190 330, 294 366 C 372 354, 406 274, 366 200 L 344 200 C 374 264, 350 326, 294 340 C 282 336, 276 328, 270 320 L 292 214 L 274 214 L 254 316 C 210 296, 194 250, 202 200 Z"
                fill={ventFill}
                stroke={ventStroke}
                strokeWidth={ventricleActive ? 2.6 : 1.8}
                filter={ventricleActive ? 'url(#part-glow)' : undefined}
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

            {/* JALUR INTERNODAL & BACHMANN (Menyala terang hanya di Tahap 1) */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(1)}
              filter={atrialActive ? 'url(#part-glow)' : undefined}
              opacity={atrialActive ? 1 : 0.35}
            >
              <path
                d="M 216 110 C 254 96, 302 98, 346 124"
                fill="none"
                stroke={atrialActive ? '#2563eb' : '#94a3b8'}
                strokeWidth={atrialActive ? 4 : 2}
                strokeLinecap="round"
              />
              <path
                d="M 214 112 C 238 128, 254 150, 266 180"
                fill="none"
                stroke={atrialActive ? '#2563eb' : '#94a3b8'}
                strokeWidth={atrialActive ? 3.5 : 1.8}
                strokeLinecap="round"
              />
              <path
                d="M 208 116 C 218 148, 240 168, 264 184"
                fill="none"
                stroke={atrialActive ? '#2563eb' : '#94a3b8'}
                strokeWidth={atrialActive ? 3.2 : 1.8}
                strokeDasharray="5 3"
                strokeLinecap="round"
              />
            </g>

            {/* BUNDLE OF HIS (Menyala di Tahap 2 & awal Tahap 3) */}
            <path
              d="M 271 190 L 283 226"
              fill="none"
              stroke={isPartActive('his-bundle') ? '#d97706' : '#cbd5e1'}
              strokeWidth={isPartActive('his-bundle') ? 5.8 : 3.2}
              strokeLinecap="round"
              filter={isPartActive('his-bundle') ? 'url(#part-glow)' : undefined}
              className="clickable-anatomy"
              onClick={() => onSelectStage(2)}
            />

            {/* CABANG KANAN / RBB (Menyala terang di Tahap 3) */}
            <path
              d="M 282 226 L 258 316 C 242 324, 220 308, 206 280"
              fill="none"
              stroke={isPartActive('rbb') ? '#dc2626' : '#cbd5e1'}
              strokeWidth={isPartActive('rbb') ? 4.4 : 2.2}
              strokeLinecap="round"
              filter={isPartActive('rbb') ? 'url(#part-glow)' : undefined}
              className="clickable-anatomy"
              onClick={() => onSelectStage(3)}
            />

            {/* CABANG KIRI / LBB (Menyala terang di Tahap 3) */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(3)}
              filter={isPartActive('lbb') ? 'url(#part-glow)' : undefined}
            >
              <path
                d="M 284 226 L 278 314 C 292 336, 322 332, 342 304"
                fill="none"
                stroke={isPartActive('lbb') ? '#dc2626' : '#cbd5e1'}
                strokeWidth={isPartActive('lbb') ? 4.6 : 2.4}
                strokeLinecap="round"
              />
              <path
                d="M 283 242 C 302 256, 322 268, 342 258"
                fill="none"
                stroke={isPartActive('lbb') ? '#ea580c' : '#cbd5e1'}
                strokeWidth={isPartActive('lbb') ? 3.8 : 2}
                strokeLinecap="round"
              />
            </g>

            {/* SERABUT PURKINJE (Menyala terang di Tahap 3) */}
            <g
              className="clickable-anatomy"
              onClick={() => onSelectStage(3)}
              filter={isPartActive('purkinje') ? 'url(#part-glow)' : undefined}
            >
              <path
                d="M 220 302 L 196 290 M 210 284 L 190 264 M 204 264 L 190 238 M 306 330 L 316 348 M 332 316 L 354 328 M 342 294 L 366 296 M 346 266 L 370 260 M 342 240 L 364 228"
                fill="none"
                stroke={isPartActive('purkinje') ? '#dc2626' : '#cbd5e1'}
                strokeWidth={isPartActive('purkinje') ? 3.2 : 1.7}
                strokeLinecap="round"
              />
            </g>

            {/* SA NODE */}
            <g className="clickable-anatomy" onClick={() => onSelectStage(1)}>
              {isPartActive('sa-node') && (
                <circle
                  cx="212"
                  cy="112"
                  r="17"
                  fill="rgba(37, 99, 235, 0.2)"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  className="sa-pulse-circle"
                />
              )}
              <ellipse
                cx="212"
                cy="112"
                rx="9.5"
                ry="6.8"
                transform="rotate(-18 212 112)"
                fill={isPartActive('sa-node') ? '#1d4ed8' : '#94a3b8'}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>

            {/* AV NODE */}
            <g className="clickable-anatomy" onClick={() => onSelectStage(2)}>
              {isPartActive('av-node') && (
                <circle
                  cx="266"
                  cy="186"
                  r="15"
                  fill="rgba(217, 119, 6, 0.22)"
                  stroke="#d97706"
                  strokeWidth="1.5"
                />
              )}
              <ellipse
                cx="266"
                cy="186"
                rx="8.5"
                ry="6.5"
                fill={isPartActive('av-node') ? '#d97706' : '#94a3b8'}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>

            {/* PANAH VEKTOR AKTIF (Tanpa teks menimpa jantung) */}
            {vectors.map((vec) => {
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
                <g key={vec.id} pointerEvents="none">
                  <line
                    x1={vec.x1}
                    y1={vec.y1}
                    x2={vec.x2}
                    y2={vec.y2}
                    stroke="#ffffff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <line
                    x1={vec.x1}
                    y1={vec.y1}
                    x2={vec.x2}
                    y2={vec.y2}
                    stroke={vec.color}
                    strokeWidth="3.4"
                    strokeDasharray={vec.dashed ? '5 4' : undefined}
                    strokeLinecap="round"
                    markerEnd={`url(#${markerId})`}
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
                  strokeWidth={active ? 1.6 : 1}
                  opacity={active ? 0.95 : 0.65}
                />
                <circle
                  cx={item.targetX}
                  cy={item.targetY}
                  r={active ? 3.2 : 2.2}
                  fill={active ? stageAccent : '#94a3b8'}
                />
                <text
                  x={item.labelX}
                  y={item.labelY}
                  textAnchor={item.side === 'left' ? 'end' : 'start'}
                  fontSize="11.5"
                  fontWeight={active ? '700' : '500'}
                  fill={active ? stageAccent : '#64748b'}
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* KETERANGAN VEKTOR TERPISAH RAPI DI BAWAH APEKS JANTUNG */}
          {vectors.length > 0 && (
            <g transform="translate(300, 402)" pointerEvents="none">
              <rect
                x="-195"
                y="-15"
                width="390"
                height="24"
                rx="12"
                fill={stageMeta?.softBg ?? '#f8fafc'}
                stroke={stageMeta ? `${stageMeta.accentColor}55` : '#cbd5e1'}
              />
              <text
                x="0"
                y="1"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill={stageMeta?.accentColor ?? '#334155'}
              >
                Arah Vektor Aktif: {vectors.map((v) => v.label).join('  •  ')}
              </text>
            </g>
          )}
        </svg>
      </div>

      <p className="visual-footer-caption">
        {stageMeta
          ? stageMeta.heartStatusCaption
          : 'Seluruh ruang jantung berada pada fase istirahat polarisasi sebelum SA Node memulai siklus berikutnya.'}
      </p>
    </section>
  );
}
