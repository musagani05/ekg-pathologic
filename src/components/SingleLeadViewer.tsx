import { useMemo, useState } from 'react';
import type {
  EcgCondition,
  LeadId,
  StageId,
} from '../data/ecgConditions';
import {
  ALL_LEAD_IDS,
  NORMAL_SINUS_CONDITION,
  STAGE_IDS,
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
  activeStage: StageId | null;
  cycleProgress: number;
  onSelectStage: (stage: StageId) => void;
}

const SVG_WIDTH = 680;
const SVG_HEIGHT = 396;
const PX_PER_MM = 7.0;
const BASELINE_Y = 202;
const TRACE_START_X = 96;

export function SingleLeadViewer({
  condition,
  selectedLead,
  onSelectLead,
  activeStage,
  cycleProgress,
  onSelectStage,
}: SingleLeadViewerProps) {
  const [showLeadPositions, setShowLeadPositions] = useState<boolean>(false);

  const isPathologic = !condition.isNormalBaseline;
  const leadData = condition.leads[selectedLead];
  const normalLeadData = NORMAL_SINUS_CONDITION.leads[selectedLead];
  const activeStageMeta = activeStage ? condition.stages[activeStage] : null;

  const renderPaths = useMemo(
    () =>
      buildLargeSingleLeadPaths({
        params: leadData.params,
        normalReferenceParams: isPathologic ? normalLeadData.params : undefined,
        normalReferenceHeartRateBpm: NORMAL_SINUS_CONDITION.heartRateBpm,
        heartRateBpm: condition.heartRateBpm,
        startX: TRACE_START_X,
        baselineY: BASELINE_Y,
        pxPerMm: PX_PER_MM,
        cycleProgress,
      }),
    [
      leadData.params,
      normalLeadData.params,
      isPathologic,
      condition.heartRateBpm,
      cycleProgress,
    ],
  );

  const calibPath = useMemo(
    () => buildCalibrationPulsePath(16, BASELINE_Y, PX_PER_MM),
    [],
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
  const activeMidX = activeRange
    ? Math.min(SVG_WIDTH - 145, Math.max(155, (activeRange.startX + activeRange.endX) / 2))
    : 340;

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

      {isPathologic && (
        <div className="ecg-comparison-legend" aria-label="Legenda perbandingan gelombang">
          <span className="legend-item">
            <span className="legend-swatch-dashed" aria-hidden="true" />
            Normal
          </span>
          <span className="legend-item legend-item-active">
            <span className="legend-swatch-solid" aria-hidden="true" />
            Patologis
          </span>
        </div>
      )}

      <div className="ecg-single-canvas-box">
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
                stroke="rgba(239, 138, 138, 0.22)"
                strokeWidth="0.65"
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
                stroke="rgba(224, 92, 92, 0.42)"
                strokeWidth="1.1"
              />
            </pattern>
          </defs>

          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#fffdfd" />
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#clean-ecg-major)" />

          {activeRange && activeStageMeta && (
            <g>
              <rect
                x={activeRange.startX}
                y={46}
                width={Math.max(6, activeRange.endX - activeRange.startX)}
                height={SVG_HEIGHT - 96}
                rx="6"
                fill={activeStageMeta.accentColor}
                opacity="0.11"
              />
              <line
                x1={(activeRange.startX + activeRange.endX) / 2}
                y1={40}
                x2={(activeRange.startX + activeRange.endX) / 2}
                y2={48}
                stroke={activeStageMeta.accentColor}
                strokeWidth="1.6"
              />
            </g>
          )}

          {STAGE_IDS.map((stId) => {
            const rng = renderPaths.stageRangesPx[stId];
            return (
              <rect
                key={`hit-${stId}`}
                x={rng.startX}
                y={46}
                width={Math.max(10, rng.endX - rng.startX)}
                height={SVG_HEIGHT - 96}
                fill="transparent"
                className="wave-stage-hitbox"
                onClick={() => onSelectStage(stId)}
              />
            );
          })}

          <line
            x1={TRACE_START_X}
            y1={BASELINE_Y}
            x2={SVG_WIDTH - 16}
            y2={BASELINE_Y}
            stroke="#94a3b8"
            strokeWidth="0.9"
            strokeDasharray="4 4"
            opacity="0.55"
          />

          <path
            d={calibPath}
            fill="none"
            stroke="#334155"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={16 + 4 * PX_PER_MM}
            y={BASELINE_Y + 20}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#64748b"
          >
            1 mV
          </text>

          {/* Lapisan 1: Garis Acuan Normal Samar (Putus-putus) saat Kondisi Patologis Aktif */}
          {isPathologic && renderPaths.normalReferencePath && (
            <path
              d={renderPaths.normalReferencePath}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.6"
              strokeDasharray="5 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
              pointerEvents="none"
            />
          )}

          {/* Lapisan 2: Jejak Utuh Kondisi Aktif */}
          <path
            d={renderPaths.fullPath}
            fill="none"
            stroke={isPathologic ? '#0f172a' : '#94a3b8'}
            strokeWidth={isPathologic ? 2.35 : 1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={isPathologic ? 0.86 : 0.4}
            pointerEvents="none"
          />

          {/* Lapisan 3: Jejak Progresif Tegas Kondisi Aktif */}
          <path
            d={renderPaths.progressivePath}
            fill="none"
            stroke="#0f172a"
            strokeWidth={isPathologic ? 2.9 : 2.7}
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
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
            />
          )}

          <circle
            cx={renderPaths.penPoint.x}
            cy={renderPaths.penPoint.y}
            r="6.5"
            fill={activeStageMeta ? activeStageMeta.accentColor : '#0f172a'}
            opacity="0.22"
            pointerEvents="none"
          />
          <circle
            cx={renderPaths.penPoint.x}
            cy={renderPaths.penPoint.y}
            r="3.8"
            fill={activeStageMeta ? activeStageMeta.accentColor : '#0f172a'}
            stroke="#ffffff"
            strokeWidth="1.6"
            pointerEvents="none"
          />

          {activeStageMeta ? (
            <g transform={`translate(${activeMidX}, 26)`} pointerEvents="none">
              <rect
                x="-135"
                y="-14"
                width="270"
                height="26"
                rx="13"
                fill="#ffffff"
                stroke={activeStageMeta.accentColor}
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="700"
                fill={activeStageMeta.accentColor}
              >
                {activeStageMeta.ecgWaveTitle} ({activeStageMeta.heartProcessTitle})
              </text>
            </g>
          ) : (
            <g transform="translate(340, 26)" pointerEvents="none">
              <rect
                x="-125"
                y="-14"
                width="250"
                height="26"
                rx="13"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="600"
                fill="#475569"
              >
                Segmen TP — Garis Dasar Istirahat
              </text>
            </g>
          )}

          <g transform="translate(340, 370)" pointerEvents="none">
            <rect
              x="-275"
              y="-14"
              width="550"
              height="24"
              rx="12"
              fill="rgba(255, 255, 255, 0.94)"
              stroke="#e2e8f0"
            />
            <text
              x="0"
              y="2"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#334155"
            >
              {activeStageMetricText}
            </text>
          </g>
        </svg>
      </div>

      <p className="visual-footer-caption">
        {activeStage
          ? leadData.stageNotes[activeStage]
          : `${leadData.axisNote}. Klik bagian gelombang atau gunakan tombol tahap untuk menyorot segmen tertentu.`}
      </p>
    </section>
  );
}
