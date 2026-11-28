import { useMemo, useState } from 'react';
import type {
  EcgCondition,
  LeadId,
  StageId,
} from '../data/ecgConditions';
import {
  ALL_LEAD_IDS,
  ECG_CONDITIONS,
  ECG_DOMAINS,
} from '../data/ecgConditions';
import {
  buildCalibrationPulsePath,
  buildLargeSingleLeadPaths,
} from '../utils/ecgWaveform';
import { LeadPositionPanel } from './LeadPositionPanel';

export interface SingleLeadViewerProps {
  condition: EcgCondition;
  selectedLead: LeadId;
  onSelectLead: (lead: LeadId) => void;
  comparisonConditionId: string;
  onSelectComparisonCondition: (conditionId: string) => void;
  activeStage: StageId | null;
  stripTimeMs: number;
  onSelectStage: (stage: StageId, preferredBeatIndex?: number) => void;
}

const SVG_WIDTH = 680;
const SVG_HEIGHT = 352;
const PX_PER_MM = 9.6;
const TRACE_START_X = 76;
const SAFE_TOP_Y = 14;
const SAFE_BOTTOM_Y = SVG_HEIGHT - 14;

export function SingleLeadViewer({
  condition,
  selectedLead,
  onSelectLead,
  comparisonConditionId,
  onSelectComparisonCondition,
  activeStage,
  stripTimeMs,
  onSelectStage,
}: SingleLeadViewerProps) {
  const [showLeadPositions, setShowLeadPositions] = useState<boolean>(false);

  const isPathologic = !condition.isNormalBaseline;
  const leadData = condition.leads[selectedLead];
  const comparisonCondition =
    comparisonConditionId !== 'off'
      ? (ECG_CONDITIONS.find((c) => c.id === comparisonConditionId) ?? null)
      : null;
  const comparisonLeadData = comparisonCondition
    ? comparisonCondition.leads[selectedLead]
    : null;
  const activeStageMeta = activeStage ? condition.stages[activeStage] : null;

  const renderPaths = useMemo(
    () =>
      buildLargeSingleLeadPaths({
        params: leadData.params,
        normalReferenceParams: comparisonLeadData?.params,
        normalReferenceHeartRateBpm: comparisonCondition?.heartRateBpm,
        heartRateBpm: condition.heartRateBpm,
        startX: TRACE_START_X,
        pxPerMm: PX_PER_MM,
        stripTimeMs,
        svgHeight: SVG_HEIGHT,
        safeTopY: SAFE_TOP_Y,
        safeBottomY: SAFE_BOTTOM_Y,
      }),
    [
      leadData.params,
      comparisonLeadData?.params,
      comparisonCondition?.heartRateBpm,
      condition.heartRateBpm,
      stripTimeMs,
    ],
  );

  const hasGhostOverlay = Boolean(
    comparisonCondition && comparisonLeadData && renderPaths.normalReferencePath,
  );

  const calibPath = useMemo(
    () => buildCalibrationPulsePath(10, renderPaths.baselineY, PX_PER_MM),
    [renderPaths.baselineY],
  );

  const activeStageMetricText = useMemo(() => {
    if (!activeStage) {
      return 'Garis dasar isoelektrik (0 mV) • Kecepatan kertas 25 mm/dtk, kalibrasi 10 mm/mV';
    }
    const p = leadData.params;
    if (activeStage === 1) {
      const notchedNote = p.pNotched ? ' (berlekuk M)' : '';
      const ampStr = p.pTerminalAmpMv
        ? `+${p.pAmpMv} / ${p.pTerminalAmpMv} mV (bifasik)`
        : `${p.pAmpMv >= 0 ? '+' : ''}${p.pAmpMv} mV${notchedNote}`;
      return `Durasi Gelombang P: ${(p.pDurationMs / 1000).toFixed(2)} dtk  •  Amplitudo di Lead ${leadData.id}: ${ampStr}`;
    }
    if (activeStage === 2) {
      return `Interval PR Total: ${(p.prIntervalMs / 1000).toFixed(2)} dtk  •  Potensial Segmen PR: 0 mV (mendatar)`;
    }
    if (activeStage === 3) {
      const parts: string[] = [];
      if (p.qAmpMv !== 0) parts.push(`Q ${p.qAmpMv} mV`);
      if (p.rAmpMv !== 0) {
        parts.push(`R +${p.rAmpMv} mV${p.rNotched ? ' (R berlekuk)' : ''}`);
      }
      if (p.sAmpMv !== 0) parts.push(`S ${p.sAmpMv} mV`);
      if (p.rPrimeAmpMv) {
        parts.push(
          p.rPrimeAmpMv > 0 ? `R' +${p.rPrimeAmpMv} mV` : `s' ${p.rPrimeAmpMv} mV`,
        );
      }
      return `Durasi QRS: ${(p.qrsDurationMs / 1000).toFixed(2)} dtk  •  Defleksi Lead ${leadData.id}: ${parts.join(', ')}`;
    }
    const stText =
      p.stDeviationMv === 0
        ? 'ST sejajar garis dasar (0 mV)'
        : `ST ${p.stDeviationMv > 0 ? '+' : ''}${p.stDeviationMv} mV`;
    const uText =
      p.uAmpMv && Math.abs(p.uAmpMv) > 0.001 ? `  •  Gel. U +${p.uAmpMv} mV` : '';
    return `${stText}  •  Gelombang T: ${p.tAmpMv >= 0 ? '+' : ''}${p.tAmpMv} mV${uText}`;
  }, [activeStage, leadData]);

  const activeRange = activeStage ? renderPaths.stageRangesPx[activeStage] : null;

  return (
    <section className="visual-card" aria-label="Viewer Gelombang EKG Utama">
      <header className="visual-card-header">
        <div>
          <span className="visual-eyebrow">REKAMAN KERTAS EKG (25 mm/dtk • 10 mm/mV)</span>
          <h2 className="visual-title">
            Lead {leadData.id} — <span className="title-weight-normal">{leadData.viewLabel}</span>
          </h2>
        </div>

        <div className="ecg-card-actions">
          <button
            type="button"
            className={`btn-lead-pos-toggle ${showLeadPositions ? 'active' : ''}`}
            aria-expanded={showLeadPositions}
            onClick={() => setShowLeadPositions((prev) => !prev)}
          >
            {showLeadPositions ? 'Tutup Posisi Lead' : 'Posisi Lead'}
          </button>

          <label htmlFor="single-lead-select" className="sr-only">
            Pilih Perspektif Lead
          </label>
          <select
            id="single-lead-select"
            className="compact-lead-select"
            value={selectedLead}
            onChange={(e) => onSelectLead(e.target.value as LeadId)}
          >
            {ALL_LEAD_IDS.map((id) => (
              <option key={id} value={id}>
                Lead {id} — {condition.leads[id].viewLabel}
              </option>
            ))}
          </select>
        </div>
      </header>

      {showLeadPositions && (
        <LeadPositionPanel
          selectedLead={selectedLead}
          onSelectLead={onSelectLead}
        />
      )}

      <div
        className="ecg-comparison-legend"
        aria-label="Legenda dan pembanding gelombang EKG"
      >
        <span className="legend-item legend-item-active">
          <span className="legend-swatch-solid" aria-hidden="true" />
          <span>Aktif: {condition.name}</span>
        </span>

        <div className="comparison-picker-group">
          <label
            htmlFor="ghost-comparison-select"
            className="comparison-picker-label"
          >
            <span className="legend-swatch-dashed" aria-hidden="true" />
            <span>Pembanding ({selectedLead}):</span>
          </label>
          <select
            id="ghost-comparison-select"
            className="compact-comparison-select"
            value={comparisonCondition ? comparisonCondition.id : 'off'}
            onChange={(e) => onSelectComparisonCondition(e.target.value)}
            aria-label="Pilih kondisi pembanding bayangan EKG"
          >
            <option value="off">Off (Tanpa Bayangan)</option>
            {ECG_DOMAINS.filter((domain) => domain.conditions.length > 0).map(
              (domain) => (
                <optgroup key={domain.id} label={domain.name}>
                  {domain.conditions.map((cond) => (
                    <option key={cond.id} value={cond.id}>
                      {cond.name}
                    </option>
                  ))}
                </optgroup>
              ),
            )}
          </select>
        </div>
      </div>

      <div className="ecg-single-canvas-box">
        <div className="ecg-canvas-top-bar">
          {activeStageMeta ? (
            <div
              className="ecg-stage-badge"
              style={{
                borderColor: activeStageMeta.accentColor,
                color: activeStageMeta.accentColor,
                backgroundColor: '#ffffff',
              }}
            >
              {activeStageMeta.ecgWaveTitle} ({activeStageMeta.heartProcessTitle})
            </div>
          ) : (
            <div className="ecg-stage-badge neutral">
              Segmen TP — Garis Dasar Istirahat
            </div>
          )}
        </div>

        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="ecg-single-svg"
          role="img"
          aria-label={`Grafik gelombang EKG besar pada Lead ${leadData.id}`}
        >
          <defs>
            <pattern
              id="clean-ecg-minor"
              width={PX_PER_MM}
              height={PX_PER_MM}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${PX_PER_MM} 0 L 0 0 0 ${PX_PER_MM}`}
                fill="none"
                stroke="rgba(239, 138, 138, 0.24)"
                strokeWidth="0.7"
              />
            </pattern>
            <pattern
              id="clean-ecg-major"
              width={PX_PER_MM * 5}
              height={PX_PER_MM * 5}
              patternUnits="userSpaceOnUse"
            >
              <rect
                width={PX_PER_MM * 5}
                height={PX_PER_MM * 5}
                fill="url(#clean-ecg-minor)"
              />
              <path
                d={`M ${PX_PER_MM * 5} 0 L 0 0 0 ${PX_PER_MM * 5}`}
                fill="none"
                stroke="rgba(224, 92, 92, 0.45)"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>

          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#fffdfd" />
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#clean-ecg-major)" />

          {activeRange && activeStageMeta && (
            <rect
              x={activeRange.startX}
              y={SAFE_TOP_Y}
              width={Math.max(6, activeRange.endX - activeRange.startX)}
              height={SAFE_BOTTOM_Y - SAFE_TOP_Y}
              rx="6"
              fill={activeStageMeta.accentColor}
              fillOpacity="0.1"
              stroke={activeStageMeta.accentColor}
              strokeOpacity="0.22"
              strokeWidth="1"
              pointerEvents="none"
            />
          )}

          {renderPaths.allBeatStageHitboxes.map((hit) => (
            <rect
              key={`hit-${hit.beatIndex}-${hit.stageId}`}
              x={hit.startX}
              y={SAFE_TOP_Y}
              width={Math.max(10, hit.endX - hit.startX)}
              height={SAFE_BOTTOM_Y - SAFE_TOP_Y}
              fill="transparent"
              className="wave-stage-hitbox"
              onClick={() => onSelectStage(hit.stageId, hit.beatIndex)}
            />
          ))}

          <line
            x1={TRACE_START_X}
            y1={renderPaths.baselineY}
            x2={SVG_WIDTH - 16}
            y2={renderPaths.baselineY}
            stroke="#94a3b8"
            strokeWidth="0.9"
            strokeDasharray="4 4"
            opacity="0.55"
          />

          <path
            d={calibPath}
            fill="none"
            stroke="#334155"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={10 + 3.1 * PX_PER_MM}
            y={Math.min(SVG_HEIGHT - 6, renderPaths.baselineY + 16)}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#64748b"
          >
            1 mV
          </text>

          {/* Lapisan 1: Bayangan Pembanding (Putus-putus) pada Lead Aktif */}
          {hasGhostOverlay && renderPaths.normalReferencePath && (
            <path
              d={renderPaths.normalReferencePath}
              fill="none"
              stroke="#64748b"
              strokeWidth="1.9"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.72"
              pointerEvents="none"
            />
          )}

          {/* Lapisan 2: Jejak Utuh Kondisi Aktif */}
          <path
            d={renderPaths.fullPath}
            fill="none"
            stroke={isPathologic || hasGhostOverlay ? '#0f172a' : '#94a3b8'}
            strokeWidth={isPathologic || hasGhostOverlay ? 2.45 : 1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={isPathologic || hasGhostOverlay ? 0.86 : 0.42}
            pointerEvents="none"
          />

          {/* Lapisan 3: Jejak Progresif Tegas Kondisi Aktif */}
          <path
            d={renderPaths.progressivePath}
            fill="none"
            stroke="#0f172a"
            strokeWidth={isPathologic || hasGhostOverlay ? 3.1 : 2.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            pointerEvents="none"
          />

          {/* Lapisan 4: Sorotan Segmen Tahap Aktif */}
          {activeStage && activeStageMeta && (
            <path
              d={renderPaths.stagePaths[activeStage]}
              fill="none"
              stroke={activeStageMeta.accentColor}
              strokeWidth="4.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
            />
          )}

          <circle
            cx={renderPaths.penPoint.x}
            cy={renderPaths.penPoint.y}
            r="6.8"
            fill={activeStageMeta ? activeStageMeta.accentColor : '#0f172a'}
            opacity="0.22"
            pointerEvents="none"
          />
          <circle
            cx={renderPaths.penPoint.x}
            cy={renderPaths.penPoint.y}
            r="4"
            fill={activeStageMeta ? activeStageMeta.accentColor : '#0f172a'}
            stroke="#ffffff"
            strokeWidth="1.6"
            pointerEvents="none"
          />
        </svg>

        <div className="ecg-canvas-bottom-bar">
          <div className="ecg-metric-badge">{activeStageMetricText}</div>
        </div>
      </div>

      <p className="visual-footer-caption">
        {activeStage
          ? leadData.stageNotes[activeStage]
          : `${leadData.axisNote}. Klik bagian gelombang atau gunakan tombol tahap untuk menyorot segmen tertentu.`}
      </p>
    </section>
  );
}
