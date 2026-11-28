import type {
  BlockedConductionTarget,
  EcgCondition,
  HeartVectorSpec,
  HypertrophyZoneTarget,
  LeadWaveParams,
  StageId,
} from '../data/ecgConditions';
import { getBeatStageWindows } from './ecgWaveform';

export interface VectorRenderState extends HeartVectorSpec {
  scale: number;
  opacity: number;
  currentX2: number;
  currentY2: number;
}

export interface MyocardialWaveState {
  /** Radial expansion progress (0..1) inside clipped chamber wall. */
  spread: number;
  /** Wavefront fill/rim intensity (0..1). */
  intensity: number;
  /** Origin X in SVG user space where depolarization wave initiates. */
  originX: number;
  /** Origin Y in SVG user space where depolarization wave initiates. */
  originY: number;
  /** Max expansion radius in SVG user space to cover chamber wall. */
  maxRadius: number;
  /** True when activation arrives slowly via trans-septal cell-to-cell spread. */
  isSlowSpread: boolean;
}

export interface HeartPropagationState {
  currentStageId: StageId;
  cycleMs: number;
  timeMs: number;
  blockedTarget?: BlockedConductionTarget;
  hypertrophyZone?: HypertrophyZoneTarget;

  // Nodes
  saActivity: number;
  saPulseProgress: number;
  avActivity: number;
  avRingProgress: number;

  // Conduction pathways (0..1 progressive trace length via pathLength=100)
  internodalProgress: number;
  internodalIntensity: number;
  bachmannProgress: number;
  bachmannIntensity: number;
  hisProgress: number;
  hisIntensity: number;
  hisBlocked: boolean;

  rbbProgress: number;
  rbbIntensity: number;
  rbbBlocked: boolean;

  lbbTrunkProgress: number;
  lbbTrunkIntensity: number;
  lbbBlocked: boolean;
  lpfBlocked: boolean;

  lafProgress: number;
  lafIntensity: number;
  lafBlocked: boolean;

  purkinjeRvProgress: number;
  purkinjeRvIntensity: number;
  purkinjeLvInfProgress: number;
  purkinjeLvInfIntensity: number;
  purkinjeLvAntProgress: number;
  purkinjeLvAntIntensity: number;

  // Myocardial chamber wavefronts
  raWave: MyocardialWaveState;
  laWave: MyocardialWaveState;
  rvWave: MyocardialWaveState;
  lvWave: MyocardialWaveState;

  // Stage 4 ST plateau & repolarization sweep
  stPlateauIntensity: number;
  repolProgress: number;
  repolIntensity: number;

  // Progressively drawn physiological vectors
  vectors: VectorRenderState[];
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function windowProgress(tMs: number, startMs: number, endMs: number): number {
  if (endMs <= startMs) return tMs >= startMs ? 1 : 0;
  return clamp01((tMs - startMs) / (endMs - startMs));
}

function decayTail(tMs: number, startMs: number, durationMs: number): number {
  if (tMs <= startMs) return 1;
  return 1 - clamp01((tMs - startMs) / Math.max(1, durationMs));
}

function computeProgressWithHold(
  tMs: number,
  drawStartMs: number,
  drawEndMs: number,
  holdUntilMs: number,
  fadeDurationMs: number,
  maxFraction = 1,
): { progress: number; intensity: number } {
  if (tMs < drawStartMs) {
    return { progress: 0, intensity: 0 };
  }
  const raw = smoothstep(
    0,
    1,
    windowProgress(tMs, drawStartMs, drawEndMs),
  );
  const progress = raw * maxFraction;

  const fadeEnd = holdUntilMs + fadeDurationMs;
  if (tMs > fadeEnd) {
    return { progress, intensity: 0 };
  }

  const fadeIn = smoothstep(0, 1, clamp01(raw * 3.5));
  const fadeOut = tMs <= holdUntilMs ? 1 : decayTail(tMs, holdUntilMs, fadeDurationMs);
  return {
    progress,
    intensity: clamp01(fadeIn * fadeOut),
  };
}

function buildActiveVectors(
  condition: EcgCondition,
  tMs: number,
  stageWindows: Record<StageId, { startMs: number; endMs: number }>,
  currentStageId: StageId,
): VectorRenderState[] {
  const result: VectorRenderState[] = [];
  const stageIds: StageId[] = [1, 2, 3, 4];

  for (const sId of stageIds) {
    const specs = condition.stages[sId].vectors;
    if (specs.length === 0) continue;

    const range = stageWindows[sId];
    const dur = Math.max(1, range.endMs - range.startMs);
    const fadeTailMs = 45;

    if (tMs < range.startMs || tMs > range.endMs + fadeTailMs) {
      continue;
    }

    const stageRatio = (tMs - range.startMs) / dur;
    const stageFadeOut =
      tMs <= range.endMs ? 1 : decayTail(tMs, range.endMs, fadeTailMs);

    const count = specs.length;
    for (let i = 0; i < count; i++) {
      const vec = specs[i];
      // Stagger multiple vectors sequentially while ensuring all finish by ~0.70 of the stage
      const slotStart = count === 1 ? 0.1 : 0.05 + (i / count) * 0.36;
      const slotEnd = count === 1 ? 0.68 : Math.min(0.7, slotStart + 0.34);

      const scale = smoothstep(slotStart, slotEnd, stageRatio);
      if (scale <= 0.01 && sId !== currentStageId) continue;

      const opacity = clamp01(smoothstep(0, 0.25, scale) * stageFadeOut);
      if (opacity <= 0.01) continue;

      result.push({
        ...vec,
        scale,
        opacity,
        currentX2: vec.x1 + (vec.x2 - vec.x1) * scale,
        currentY2: vec.y1 + (vec.y2 - vec.y1) * scale,
      });
    }
  }

  return result;
}

/**
 * Pure deterministic calculator driving sequential conduction tract firing,
 * clipped myocardial depolarization/repolarization wavefronts, and vector arrows
 * synchronized directly with cycleProgress (0..1).
 */
export function computeHeartPropagation(
  condition: EcgCondition,
  leadParams: LeadWaveParams,
  cycleProgress: number,
): HeartPropagationState {
  const normalizedProgress = ((cycleProgress % 1) + 1) % 1;
  const win = getBeatStageWindows(leadParams, condition.heartRateBpm);
  const tMs = normalizedProgress * win.cycleMs;

  // Identify current StageId (1..4) matching ecgWaveform's stage windows
  let currentStageId: StageId = 4;
  for (const sId of [1, 2, 3, 4] as StageId[]) {
    const r = win.stageWindows[sId];
    if (tMs >= r.startMs && tMs < r.endMs) {
      currentStageId = sId;
      break;
    }
  }

  const blocked = condition.blockedTarget;
  const hypertrophy = condition.hypertrophyZone;

  const pDur = Math.max(40, win.pEndMs - win.pStartMs);
  const prSegStart = win.pEndMs;
  const prSegDur = Math.max(20, win.qrsStartMs - prSegStart);
  const qrsStart = win.qrsStartMs;
  const qrsEnd = win.jPointMs;
  const qrsDur = Math.max(60, qrsEnd - qrsStart);

  const hasSinusImpulse =
    condition.id !== 'sinus-arrest' &&
    (Math.abs(condition.leads.II.params.pAmpMv) >= 0.005 ||
      Math.abs(leadParams.pAmpMv) >= 0.005);

  // ------------------------------------------------------------------
  // STAGE 1: SA Node -> Atrial Tracts -> Right Atrium -> Left Atrium
  // (Dimatikan penuh saat Sinus Arrest / tidak ada gelombang P sinus)
  // ------------------------------------------------------------------
  const saStartMs = Math.max(0, win.pStartMs - 18);
  const saPeakMs = win.pStartMs + Math.min(35, pDur * 0.42);
  const saFadeEndMs = win.pEndMs + Math.min(40, prSegDur * 0.6);

  let saActivity = 0;
  let saPulseProgress = 0;
  if (hasSinusImpulse && tMs >= saStartMs && tMs <= saFadeEndMs) {
    saPulseProgress = windowProgress(tMs, saStartMs, saPeakMs + 30);
    const rise = smoothstep(saStartMs, win.pStartMs + 12, tMs);
    const fall = tMs <= saPeakMs ? 1 : decayTail(tMs, saPeakMs, saFadeEndMs - saPeakMs);
    saActivity = clamp01(rise * fall);
  }

  const atrialHoldUntil = win.pEndMs + 10;
  const atrialFadeMs = Math.max(45, prSegDur * 0.7);

  const internodal = hasSinusImpulse
    ? computeProgressWithHold(
        tMs,
        win.pStartMs + pDur * 0.04,
        win.pStartMs + pDur * 0.62,
        atrialHoldUntil,
        atrialFadeMs,
      )
    : { progress: 0, intensity: 0 };
  const bachmann = hasSinusImpulse
    ? computeProgressWithHold(
        tMs,
        win.pStartMs + pDur * 0.12,
        win.pStartMs + pDur * 0.72,
        atrialHoldUntil,
        atrialFadeMs,
      )
    : { progress: 0, intensity: 0 };

  const raProgress = hasSinusImpulse
    ? computeProgressWithHold(
        tMs,
        win.pStartMs + pDur * 0.02,
        win.pStartMs + pDur * 0.66,
        atrialHoldUntil,
        atrialFadeMs,
      )
    : { progress: 0, intensity: 0 };
  const laProgress = hasSinusImpulse
    ? computeProgressWithHold(
        tMs,
        win.pStartMs + pDur * 0.24,
        win.pEndMs,
        atrialHoldUntil,
        atrialFadeMs,
      )
    : { progress: 0, intensity: 0 };

  // ------------------------------------------------------------------
  // STAGE 2: AV Node Delay (atau Escape Pacemaker di AV Junction) -> Bundle of His
  // ------------------------------------------------------------------
  const hisStartMs = Math.max(
    prSegStart + 6,
    qrsStart - Math.min(42, Math.max(22, prSegDur * 0.56)),
  );
  const avArriveMs = hasSinusImpulse
    ? win.pStartMs + pDur * 0.56
    : Math.max(prSegStart + 12, hisStartMs - Math.min(48, Math.max(26, prSegDur * 0.45)));
  const avFadeEndMs = qrsStart + qrsDur * 0.32;

  let avActivity = 0;
  let avRingProgress = 0;
  if (tMs >= avArriveMs && tMs <= avFadeEndMs) {
    avRingProgress = windowProgress(tMs, avArriveMs, hisStartMs);
    const rise = smoothstep(
      avArriveMs,
      hasSinusImpulse ? prSegStart + prSegDur * 0.22 : hisStartMs - 6,
      tMs,
    );
    const fall =
      tMs <= hisStartMs + 16
        ? 1
        : decayTail(tMs, hisStartMs + 16, avFadeEndMs - (hisStartMs + 16));
    avActivity = clamp01(rise * fall);
  }

  const hisBlocked = blocked === 'av-node';
  const his = computeProgressWithHold(
    tMs,
    hisStartMs,
    Math.max(hisStartMs + 14, qrsStart - 2),
    qrsStart + qrsDur * 0.48,
    45,
    hisBlocked ? 0.42 : 1,
  );

  // ------------------------------------------------------------------
  // STAGE 3: Ventricular Bundle Branches, Purkinje & Myocardial Wavefronts
  // ------------------------------------------------------------------
  const ventHoldUntil = qrsEnd;
  const ventFadeMs = Math.max(35, Math.min(60, (win.tStartMs - qrsEnd) * 0.6 + 20));

  const isRbbb = blocked === 'rbb';
  const isLbbb = blocked === 'lbb';
  const isLafBlock = blocked === 'left-anterior-fascicle';
  const isLpfBlock = blocked === 'left-posterior-fascicle';

  let rbb = { progress: 0, intensity: 0 };
  let lbbTrunk = { progress: 0, intensity: 0 };
  let laf = { progress: 0, intensity: 0 };
  let pRv = { progress: 0, intensity: 0 };
  let pLvInf = { progress: 0, intensity: 0 };
  let pLvAnt = { progress: 0, intensity: 0 };
  let rvSpreadState = { progress: 0, intensity: 0 };
  let lvSpreadState = { progress: 0, intensity: 0 };

  let rvOriginX = 212;
  let rvOriginY = 278;
  let rvMaxRadius = 115;
  let lvOriginX = 326;
  let lvOriginY = 304;
  let lvMaxRadius = 135;

  if (isRbbb) {
    // RBB halts near proximal septum; intact LBB fires first, then slow trans-septal spread to RV
    rbb = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.18,
      ventHoldUntil,
      ventFadeMs,
      0.34,
    );
    lbbTrunk = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.28,
      ventHoldUntil,
      ventFadeMs,
    );
    laf = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.05,
      qrsStart + qrsDur * 0.34,
      ventHoldUntil,
      ventFadeMs,
    );
    pLvInf = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.22,
      qrsStart + qrsDur * 0.46,
      ventHoldUntil,
      ventFadeMs,
    );
    pLvAnt = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.24,
      qrsStart + qrsDur * 0.48,
      ventHoldUntil,
      ventFadeMs,
    );
    // LV depolarizes briskly first
    lvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.14,
      qrsStart + qrsDur * 0.56,
      ventHoldUntil,
      ventFadeMs,
    );
    // RV activates late via slow trans-septal cell-to-cell spread from septum (276, 270)
    rvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.44,
      qrsStart + qrsDur * 0.96,
      ventHoldUntil,
      ventFadeMs,
    );
    rvOriginX = 274;
    rvOriginY = 268;
    rvMaxRadius = 112;
  } else if (isLbbb) {
    // LBB halts proximally; intact RBB fires RV first, then slow R->L trans-septal spread to LV
    lbbTrunk = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.18,
      ventHoldUntil,
      ventFadeMs,
      0.28,
    );
    rbb = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.3,
      ventHoldUntil,
      ventFadeMs,
    );
    pRv = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.24,
      qrsStart + qrsDur * 0.48,
      ventHoldUntil,
      ventFadeMs,
    );
    rvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.16,
      qrsStart + qrsDur * 0.54,
      ventHoldUntil,
      ventFadeMs,
    );
    lvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.46,
      qrsStart + qrsDur * 0.96,
      ventHoldUntil,
      ventFadeMs,
    );
    lvOriginX = 278;
    lvOriginY = 272;
    lvMaxRadius = 138;
  } else if (isLafBlock) {
    // LAD: LAF blocked; RBB + LPF activate RV & inferior LV first, then delayed superior LV spread
    rbb = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.4,
      ventHoldUntil,
      ventFadeMs,
    );
    lbbTrunk = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.38,
      ventHoldUntil,
      ventFadeMs,
    );
    laf = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.08,
      qrsStart + qrsDur * 0.24,
      ventHoldUntil,
      ventFadeMs,
      0.42,
    );
    pRv = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.3,
      qrsStart + qrsDur * 0.56,
      ventHoldUntil,
      ventFadeMs,
    );
    pLvInf = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.28,
      qrsStart + qrsDur * 0.56,
      ventHoldUntil,
      ventFadeMs,
    );
    rvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.22,
      qrsStart + qrsDur * 0.7,
      ventHoldUntil,
      ventFadeMs,
    );
    // LV wave originates inferiorly from intact posterior fascicle and sweeps upward/laterally
    lvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.22,
      qrsStart + qrsDur * 0.95,
      ventHoldUntil,
      ventFadeMs,
    );
    lvOriginX = 330;
    lvOriginY = 332;
    lvMaxRadius = 148;
  } else if (isLpfBlock) {
    // RAD: LPF blocked distally after LAF takeoff; RBB + LAF fire first, inferior LV catches up late
    rbb = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.38,
      ventHoldUntil,
      ventFadeMs,
    );
    lbbTrunk = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.28,
      ventHoldUntil,
      ventFadeMs,
      0.56,
    );
    laf = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.08,
      qrsStart + qrsDur * 0.42,
      ventHoldUntil,
      ventFadeMs,
    );
    pRv = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.28,
      qrsStart + qrsDur * 0.56,
      ventHoldUntil,
      ventFadeMs,
    );
    pLvAnt = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.32,
      qrsStart + qrsDur * 0.58,
      ventHoldUntil,
      ventFadeMs,
    );
    rvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.2,
      qrsStart + qrsDur * 0.72,
      ventHoldUntil,
      ventFadeMs,
    );
    // LV wave originates anterolaterally from LAF and sweeps down toward posterior-inferior wall
    lvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.24,
      qrsStart + qrsDur * 0.95,
      ventHoldUntil,
      ventFadeMs,
    );
    lvOriginX = 354;
    lvOriginY = 236;
    lvMaxRadius = 146;
  } else {
    // Normal ventricular conduction (also used for LVH/RVH with extended myocardial spread)
    rbb = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.44,
      ventHoldUntil,
      ventFadeMs,
    );
    lbbTrunk = computeProgressWithHold(
      tMs,
      qrsStart,
      qrsStart + qrsDur * 0.4,
      ventHoldUntil,
      ventFadeMs,
    );
    laf = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.08,
      qrsStart + qrsDur * 0.48,
      ventHoldUntil,
      ventFadeMs,
    );
    pRv = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.34,
      qrsStart + qrsDur * 0.66,
      ventHoldUntil,
      ventFadeMs,
    );
    pLvInf = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.32,
      qrsStart + qrsDur * 0.64,
      ventHoldUntil,
      ventFadeMs,
    );
    pLvAnt = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.35,
      qrsStart + qrsDur * 0.66,
      ventHoldUntil,
      ventFadeMs,
    );
    rvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.26,
      qrsStart + qrsDur * (hypertrophy === 'right-ventricle' ? 0.96 : 0.88),
      ventHoldUntil,
      ventFadeMs,
    );
    lvSpreadState = computeProgressWithHold(
      tMs,
      qrsStart + qrsDur * 0.22,
      qrsStart + qrsDur * (hypertrophy === 'left-ventricle' ? 0.97 : 0.9),
      ventHoldUntil,
      ventFadeMs,
    );
  }

  // ------------------------------------------------------------------
  // STAGE 4: ST Plateau & Repolarization Sweep (T Wave)
  // ------------------------------------------------------------------
  let stPlateauIntensity = 0;
  if (tMs >= qrsEnd && tMs <= win.tStartMs + 25) {
    const enter = smoothstep(qrsEnd, qrsEnd + 20, tMs);
    const exit =
      tMs <= win.tStartMs
        ? 1
        : decayTail(tMs, win.tStartMs, 25);
    stPlateauIntensity = clamp01(enter * exit);
  }

  const repol = computeProgressWithHold(
    tMs,
    win.tStartMs,
    win.tEndMs,
    win.tEndMs,
    45,
  );

  const vectors = buildActiveVectors(
    condition,
    tMs,
    win.stageWindows,
    currentStageId,
  );

  return {
    currentStageId,
    cycleMs: win.cycleMs,
    timeMs: tMs,
    blockedTarget: blocked,
    hypertrophyZone: hypertrophy,

    saActivity,
    saPulseProgress,
    avActivity,
    avRingProgress,

    internodalProgress: internodal.progress,
    internodalIntensity: internodal.intensity,
    bachmannProgress: bachmann.progress,
    bachmannIntensity: bachmann.intensity,
    hisProgress: his.progress,
    hisIntensity: his.intensity,
    hisBlocked,

    rbbProgress: rbb.progress,
    rbbIntensity: rbb.intensity,
    rbbBlocked: isRbbb,

    lbbTrunkProgress: lbbTrunk.progress,
    lbbTrunkIntensity: lbbTrunk.intensity,
    lbbBlocked: isLbbb,
    lpfBlocked: isLpfBlock,

    lafProgress: laf.progress,
    lafIntensity: laf.intensity,
    lafBlocked: isLafBlock,

    purkinjeRvProgress: pRv.progress,
    purkinjeRvIntensity: pRv.intensity,
    purkinjeLvInfProgress: pLvInf.progress,
    purkinjeLvInfIntensity: pLvInf.intensity,
    purkinjeLvAntProgress: pLvAnt.progress,
    purkinjeLvAntIntensity: pLvAnt.intensity,

    raWave: {
      spread: raProgress.progress,
      intensity: raProgress.intensity,
      originX: 212,
      originY: 112,
      maxRadius: 96,
      isSlowSpread: false,
    },
    laWave: {
      spread: laProgress.progress,
      intensity: laProgress.intensity,
      originX: 332,
      originY: 122,
      maxRadius: 88,
      isSlowSpread: false,
    },
    rvWave: {
      spread: rvSpreadState.progress,
      intensity: rvSpreadState.intensity,
      originX: rvOriginX,
      originY: rvOriginY,
      maxRadius: rvMaxRadius,
      isSlowSpread: isRbbb,
    },
    lvWave: {
      spread: lvSpreadState.progress,
      intensity: lvSpreadState.intensity,
      originX: lvOriginX,
      originY: lvOriginY,
      maxRadius: lvMaxRadius,
      isSlowSpread: isLbbb || isLafBlock || isLpfBlock,
    },

    stPlateauIntensity,
    repolProgress: repol.progress,
    repolIntensity: repol.intensity,

    vectors,
  };
}
