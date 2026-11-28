import type { LeadWaveParams, StageId } from '../data/ecgConditions';

export interface BeatStageWindows {
  cycleMs: number;
  pStartMs: number;
  pEndMs: number;
  qrsStartMs: number;
  jPointMs: number;
  tStartMs: number;
  tPeakMs: number;
  tEndMs: number;
  uEndMs: number;
  stageWindows: Record<StageId, { startMs: number; endMs: number }>;
}

const LEAD_IN_MS = 90;

export function getBeatStageWindows(
  params: LeadWaveParams,
  heartRateBpm: number,
): BeatStageWindows {
  const safeHr = Math.min(150, Math.max(40, heartRateBpm));
  const cycleMs = 60000 / safeHr;

  const pStartMs = LEAD_IN_MS;
  const pEndMs = pStartMs + params.pDurationMs;
  const qrsStartMs = pStartMs + params.prIntervalMs;
  const jPointMs = qrsStartMs + params.qrsDurationMs;
  const tEndMs = Math.min(cycleMs - 36, qrsStartMs + params.qtIntervalMs);
  const tStartMs = Math.max(jPointMs + 24, tEndMs - params.tDurationMs);
  const tPeakMs =
    params.tSharpness === 'peaked'
      ? tStartMs + 0.5 * (tEndMs - tStartMs)
      : tStartMs + 0.58 * (tEndMs - tStartMs);
  const uEndMs =
    params.uAmpMv && Math.abs(params.uAmpMv) > 0.001
      ? Math.min(cycleMs - 32, tEndMs + 96)
      : tEndMs;

  return {
    cycleMs,
    pStartMs,
    pEndMs,
    qrsStartMs,
    jPointMs,
    tStartMs,
    tPeakMs,
    tEndMs,
    uEndMs,
    stageWindows: {
      1: { startMs: pStartMs, endMs: pEndMs },
      2: { startMs: pEndMs, endMs: qrsStartMs },
      3: { startMs: qrsStartMs, endMs: jPointMs },
      4: { startMs: jPointMs, endMs: uEndMs },
    },
  };
}

function smoothBell(u: number, sharpness = 1.55): number {
  if (u <= 0 || u >= 1) return 0;
  return Math.pow(Math.sin(Math.PI * u), sharpness);
}

function asymmetricTWave(t: number, startMs: number, peakMs: number, endMs: number): number {
  if (t <= startMs || t >= endMs) return 0;
  if (t <= peakMs) {
    const u = (t - startMs) / Math.max(1, peakMs - startMs);
    return Math.pow(Math.sin((Math.PI / 2) * u), 1.85);
  }
  const u = (t - peakMs) / Math.max(1, endMs - peakMs);
  return Math.pow(Math.cos((Math.PI / 2) * u), 1.55);
}

export function sampleLeadVoltageMv(
  params: LeadWaveParams,
  timeInBeatMs: number,
  heartRateBpm: number,
): number {
  const win = getBeatStageWindows(params, heartRateBpm);
  const t = ((timeInBeatMs % win.cycleMs) + win.cycleMs) % win.cycleMs;

  // Tahap 1: Gelombang P
  if (t >= win.pStartMs && t <= win.pEndMs) {
    const span = win.pEndMs - win.pStartMs;
    const pSharp = params.pSharpness === 'peaked' ? 2.55 : 1.55;
    if (params.pTerminalAmpMv && Math.abs(params.pTerminalAmpMv) > 0.001) {
      const splitRatio = params.pInitialRatio ?? 0.52;
      const mid = win.pStartMs + span * splitRatio;
      if (t <= mid) {
        const initSharp = params.pSharpness === 'peaked' ? 2.15 : 1.45;
        return params.pAmpMv * smoothBell((t - win.pStartMs) / (mid - win.pStartMs), initSharp);
      }
      return params.pTerminalAmpMv * smoothBell((t - mid) / (win.pEndMs - mid), 1.45);
    }
    if (params.pNotched) {
      const u = (t - win.pStartMs) / span;
      const notchWindow = Math.min(1, Math.max(0, (u - 0.2) / 0.6));
      const notchFactor = 1 - 0.28 * Math.pow(Math.sin(Math.PI * notchWindow), 2);
      return params.pAmpMv * smoothBell(u, 1.2) * notchFactor;
    }
    return params.pAmpMv * smoothBell((t - win.pStartMs) / span, pSharp);
  }

  // Tahap 2: Segmen PR
  if (t > win.pEndMs && t < win.qrsStartMs) {
    return 0;
  }

  // Tahap 3: Kompleks QRS (mendukung Q, R, R berlekuk/LBBB, S, dan R' sekunder/RBBB)
  if (t >= win.qrsStartMs && t <= win.jPointMs) {
    const segments: Array<{ amp: number; weight: number; isR?: boolean }> = [];
    if (Math.abs(params.qAmpMv) > 0.001) {
      segments.push({ amp: params.qAmpMv, weight: params.qDurationMs ?? 18 });
    }
    if (Math.abs(params.rAmpMv) > 0.001) {
      segments.push({ amp: params.rAmpMv, weight: params.rDurationMs ?? 42, isR: true });
    }
    if (Math.abs(params.sAmpMv) > 0.001) {
      segments.push({ amp: params.sAmpMv, weight: params.sDurationMs ?? 24 });
    }
    if (params.rPrimeAmpMv && Math.abs(params.rPrimeAmpMv) > 0.001) {
      segments.push({ amp: params.rPrimeAmpMv, weight: 32 });
    }
    if (segments.length === 0) return 0;

    const totalWeight = segments.reduce((acc, s) => acc + s.weight, 0);
    const qrsSpan = win.jPointMs - win.qrsStartMs;
    let cursor = win.qrsStartMs;
    let val = 0;

    for (const seg of segments) {
      const dur = (seg.weight / totalWeight) * qrsSpan;
      const end = cursor + dur;
      if (t >= cursor && t <= end) {
        const u = (t - cursor) / Math.max(0.5, dur);
        if (seg.isR && params.rNotched) {
          const notchWindow = Math.min(1, Math.max(0, (u - 0.22) / 0.56));
          const notchFactor = 1 - 0.24 * Math.pow(Math.sin(Math.PI * notchWindow), 2);
          val = seg.amp * smoothBell(u, 1.2) * notchFactor;
        } else {
          val = seg.amp * smoothBell(u, 1.45);
        }
        break;
      }
      cursor = end;
    }

    if (Math.abs(params.stDeviationMv) > 0.001) {
      const blendStart = win.jPointMs - Math.min(12, qrsSpan * 0.18);
      if (t > blendStart) {
        const u = (t - blendStart) / (win.jPointMs - blendStart);
        val = val * (1 - u * 0.5) + params.stDeviationMv * u;
      }
    }
    return val;
  }

  // Tahap 4: Segmen ST & Gelombang T
  if (t > win.jPointMs && t <= win.tEndMs) {
    let stVal = 0;
    const stDev = params.stDeviationMv;
    const morph = params.stMorphology ?? 'flat';

    if (Math.abs(stDev) > 0.001) {
      if (t <= win.tStartMs) {
        const uSt = (t - win.jPointMs) / Math.max(1, win.tStartMs - win.jPointMs);
        if (morph === 'concave') {
          stVal = stDev * (1 - 0.18 * Math.sin(Math.PI * uSt));
        } else if (morph === 'convex') {
          stVal = stDev * (1 + 0.25 * Math.sin(Math.PI * uSt));
        } else if (morph === 'upsloping') {
          stVal = stDev * (1 + 0.35 * uSt);
        } else if (morph === 'downsloping') {
          stVal = stDev * (1 - 0.45 * uSt);
        } else {
          stVal = stDev;
        }
      } else {
        const uDecay = (t - win.tStartMs) / Math.max(1, win.tEndMs - win.tStartMs);
        stVal = stDev * Math.pow(1 - uDecay, 1.6);
      }
    }

    const tVal =
      t >= win.tStartMs
        ? params.tSharpness === 'peaked'
          ? params.tAmpMv *
            smoothBell((t - win.tStartMs) / Math.max(1, win.tEndMs - win.tStartMs), 1.95)
          : params.tAmpMv * asymmetricTWave(t, win.tStartMs, win.tPeakMs, win.tEndMs)
        : 0;

    return stVal + tVal;
  }

  // Gelombang U menonjol (misal pada Hipokalemia)
  if (
    params.uAmpMv &&
    Math.abs(params.uAmpMv) > 0.001 &&
    t > win.tEndMs &&
    t <= win.uEndMs
  ) {
    const u = (t - win.tEndMs) / Math.max(1, win.uEndMs - win.tEndMs);
    return params.uAmpMv * smoothBell(u, 1.65);
  }

  return 0;
}

/**
 * Menentukan tahap (1..4) yang sedang berlangsung berdasarkan progres siklus [0..1].
 * Mengembalikan null saat berada pada garis istirahat TP di awal/akhir siklus.
 */
export function getStageAtCycleProgress(
  params: LeadWaveParams,
  heartRateBpm: number,
  cycleProgress: number,
): StageId | null {
  const win = getBeatStageWindows(params, heartRateBpm);
  const tMs = (((cycleProgress % 1) + 1) % 1) * win.cycleMs;

  if (tMs >= win.stageWindows[1].startMs && tMs <= win.stageWindows[1].endMs) return 1;
  if (tMs > win.stageWindows[2].startMs && tMs < win.stageWindows[2].endMs) return 2;
  if (tMs >= win.stageWindows[3].startMs && tMs <= win.stageWindows[3].endMs) return 3;
  if (tMs > win.stageWindows[4].startMs && tMs <= win.stageWindows[4].endMs) return 4;
  return null;
}

/**
 * Mengembalikan rentang progres [startProgress, endProgress] dalam [0..1] untuk suatu tahap.
 */
export function getStageProgressRange(
  params: LeadWaveParams,
  heartRateBpm: number,
  stageId: StageId,
): { startProgress: number; endProgress: number } {
  const win = getBeatStageWindows(params, heartRateBpm);
  const range = win.stageWindows[stageId];
  const startProgress = Math.max(0, Math.min(0.99, range.startMs / win.cycleMs));
  const endProgress = Math.max(
    startProgress + 0.005,
    Math.min(1, range.endMs / win.cycleMs),
  );
  return { startProgress, endProgress };
}

/**
 * Mengembalikan titik progres [0..1] representatif (puncak/akhir segmen) ketika user memilih suatu tahap.
 */
export function getAnchorProgressForStage(
  params: LeadWaveParams,
  heartRateBpm: number,
  stageId: StageId,
): number {
  const win = getBeatStageWindows(params, heartRateBpm);
  const range = win.stageWindows[stageId];
  const anchorRatioByStage: Record<StageId, number> = {
    1: 0.72,
    2: 0.78,
    3: 0.74,
    4: 0.7,
  };
  const targetMs =
    range.startMs + (range.endMs - range.startMs) * anchorRatioByStage[stageId];
  return targetMs / win.cycleMs;
}

export interface SingleLeadCyclePaths {
  fullPath: string;
  normalReferencePath: string | null;
  progressivePath: string;
  stagePaths: Record<StageId, string>;
  penPoint: { x: number; y: number };
  stageRangesPx: Record<StageId, { startX: number; endX: number }>;
}

/**
 * Membangun path kurva SVG untuk tampilan 1 Lead Utama Besar (2 siklus berurutan)
 * sekaligus menghasilkan path garis acuan Normal secara opsional saat kondisi patologis aktif.
 */
export function buildLargeSingleLeadPaths(options: {
  params: LeadWaveParams;
  normalReferenceParams?: LeadWaveParams;
  normalReferenceHeartRateBpm?: number;
  heartRateBpm: number;
  startX: number;
  baselineY: number;
  pxPerMm: number;
  cycleProgress: number;
}): SingleLeadCyclePaths {
  const {
    params,
    normalReferenceParams,
    normalReferenceHeartRateBpm,
    heartRateBpm,
    startX,
    baselineY,
    pxPerMm,
    cycleProgress,
  } = options;
  const win = getBeatStageWindows(params, heartRateBpm);

  const totalMs = Math.max(win.cycleMs * 2, 2500);
  const sampleStepMs = 3;
  const totalSteps = Math.ceil(totalMs / sampleStepMs);

  const clampedProgress = Math.min(1, Math.max(0, cycleProgress));
  const activeTimeMs = clampedProgress * win.cycleMs;

  const msToX = (ms: number) => startX + (ms / 1000) * 25 * pxPerMm;
  const mvToY = (mv: number) => baselineY - mv * 10 * pxPerMm;

  const fullPts: string[] = [];
  const progPts: string[] = [];
  const refPts: string[] = [];

  for (let i = 0; i <= totalSteps; i++) {
    const tMs = Math.min(totalMs, i * sampleStepMs);
    const x = msToX(tMs);
    const y = mvToY(sampleLeadVoltageMv(params, tMs, heartRateBpm));
    const cmd = `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    fullPts.push(cmd);
    if (tMs <= activeTimeMs) {
      progPts.push(cmd);
    }

    if (normalReferenceParams) {
      const refHr = normalReferenceHeartRateBpm ?? heartRateBpm;
      const refY = mvToY(sampleLeadVoltageMv(normalReferenceParams, tMs, refHr));
      refPts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${refY.toFixed(2)}`);
    }
  }

  const buildRangePath = (fromMs: number, toMs: number): string => {
    const pts: string[] = [];
    const steps = Math.max(2, Math.ceil((toMs - fromMs) / 2.5));
    for (let i = 0; i <= steps; i++) {
      const tMs = fromMs + ((toMs - fromMs) * i) / steps;
      const x = msToX(tMs);
      const y = mvToY(sampleLeadVoltageMv(params, tMs, heartRateBpm));
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return pts.join(' ');
  };

  const stagePaths: Record<StageId, string> = {
    1: buildRangePath(win.stageWindows[1].startMs, win.stageWindows[1].endMs),
    2: buildRangePath(win.stageWindows[2].startMs, win.stageWindows[2].endMs),
    3: buildRangePath(win.stageWindows[3].startMs, win.stageWindows[3].endMs),
    4: buildRangePath(win.stageWindows[4].startMs, win.stageWindows[4].endMs),
  };

  const stageRangesPx: Record<StageId, { startX: number; endX: number }> = {
    1: { startX: msToX(win.stageWindows[1].startMs), endX: msToX(win.stageWindows[1].endMs) },
    2: { startX: msToX(win.stageWindows[2].startMs), endX: msToX(win.stageWindows[2].endMs) },
    3: { startX: msToX(win.stageWindows[3].startMs), endX: msToX(win.stageWindows[3].endMs) },
    4: { startX: msToX(win.stageWindows[4].startMs), endX: msToX(win.stageWindows[4].endMs) },
  };

  const penPoint = {
    x: msToX(activeTimeMs),
    y: mvToY(sampleLeadVoltageMv(params, activeTimeMs, heartRateBpm)),
  };

  return {
    fullPath: fullPts.join(' '),
    normalReferencePath: normalReferenceParams ? refPts.join(' ') : null,
    progressivePath: progPts.join(' '),
    stagePaths,
    penPoint,
    stageRangesPx,
  };
}

export function buildCalibrationPulsePath(
  startX: number,
  baselineY: number,
  pxPerMm: number,
): string {
  const leadIn = 1.5 * pxPerMm;
  const width = 5 * pxPerMm;
  const height = 10 * pxPerMm;
  const leadOut = 1.5 * pxPerMm;

  const x0 = startX;
  const x1 = x0 + leadIn;
  const x2 = x1 + width;
  const x3 = x2 + leadOut;
  const yTop = baselineY - height;

  return `M ${x0.toFixed(1)} ${baselineY.toFixed(1)} L ${x1.toFixed(1)} ${baselineY.toFixed(1)} L ${x1.toFixed(1)} ${yTop.toFixed(1)} L ${x2.toFixed(1)} ${yTop.toFixed(1)} L ${x2.toFixed(1)} ${baselineY.toFixed(1)} L ${x3.toFixed(1)} ${baselineY.toFixed(1)}`;
}
