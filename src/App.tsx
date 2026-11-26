import { useEffect, useState } from 'react';
import './App.css';
import { HeartConductionDiagram } from './components/HeartConductionDiagram';
import { ProcessStagesPanel } from './components/ProcessStagesPanel';
import { SingleLeadViewer } from './components/SingleLeadViewer';
import type { LeadId, StageId } from './data/ecgConditions';
import { ECG_CONDITIONS, STAGE_IDS } from './data/ecgConditions';
import {
  getAnchorProgressForStage,
  getStageAtCycleProgress,
} from './utils/ecgWaveform';

type SpeedMode = 'real' | 'slow';

function App() {
  const [activeConditionId, setActiveConditionId] = useState<string>(ECG_CONDITIONS[0].id);
  const activeCondition =
    ECG_CONDITIONS.find((c) => c.id === activeConditionId) ?? ECG_CONDITIONS[0];

  const [selectedLead, setSelectedLead] = useState<LeadId>(activeCondition.defaultLead);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMode, setSpeedMode] = useState<SpeedMode>('slow');
  const [cycleProgress, setCycleProgress] = useState<number>(0.12);
  const [lockedStage, setLockedStage] = useState<StageId | null>(null);

  const currentLeadParams = activeCondition.leads[selectedLead].params;

  // Durasi 1 siklus: "1x (Real)" (~0.8 detik pada 75 bpm) atau "Lambat (10s)" (10 detik per siklus)
  const cycleDurationSeconds =
    speedMode === 'real' ? 60 / activeCondition.heartRateBpm : 10;

  useEffect(() => {
    if (!isPlaying) return;

    let rafId = 0;
    let prevTime: number | null = null;

    const animate = (now: number) => {
      if (prevTime !== null) {
        const dtSec = (now - prevTime) / 1000;
        setCycleProgress((prev) => (prev + dtSec / cycleDurationSeconds) % 1);
      }
      prevTime = now;
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [isPlaying, cycleDurationSeconds]);

  const computedLiveStage = getStageAtCycleProgress(
    currentLeadParams,
    activeCondition.heartRateBpm,
    cycleProgress,
  );
  const activeStage: StageId | null = lockedStage ?? computedLiveStage;

  const handleConditionChange = (nextId: string) => {
    const next = ECG_CONDITIONS.find((c) => c.id === nextId);
    if (!next) return;
    setActiveConditionId(next.id);
    setSelectedLead(next.defaultLead);
    setLockedStage(null);
    setCycleProgress(0.12);
    setIsPlaying(true);
  };

  const handleSelectStage = (stageId: StageId) => {
    setIsPlaying(false);
    setLockedStage(stageId);
    setCycleProgress(
      getAnchorProgressForStage(currentLeadParams, activeCondition.heartRateBpm, stageId),
    );
  };

  const handleSelectAllCycles = () => {
    setLockedStage(null);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      setLockedStage(null);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleStepStage = (direction: -1 | 1) => {
    const baseStage: StageId = activeStage ?? (direction === 1 ? 1 : 4);
    const currentIndex = STAGE_IDS.indexOf(baseStage);
    const nextIndex = activeStage
      ? (currentIndex + direction + STAGE_IDS.length) % STAGE_IDS.length
      : currentIndex;
    handleSelectStage(STAGE_IDS[nextIndex]);
  };

  return (
    <div className="app-shell">
      {/* 1. HEADER BERSIH: HANYA JUDUL & DROPDOWN MODUL */}
      <header className="minimal-header">
        <div className="header-brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" width="30" height="30">
              <rect width="36" height="36" rx="9" fill="#dc2626" />
              <path
                d="M 4 19 L 10 19 L 13 13 L 16 25 L 20 8 L 23 23 L 26 17 L 32 17"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="app-main-title">ECG PathoLogic</h1>
        </div>

        <div className="header-module-picker">
          <label htmlFor="module-dropdown" className="sr-only">
            Pilih Modul Kondisi
          </label>
          <select
            id="module-dropdown"
            className="module-dropdown"
            value={activeCondition.id}
            onChange={(e) => handleConditionChange(e.target.value)}
          >
            {ECG_CONDITIONS.map((cond) => (
              <option key={cond.id} value={cond.id}>
                {cond.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* KONTROL EDUKASI & 2 MODE KECEPATAN */}
      <section className="education-toolbar" aria-label="Kontrol Animasi dan Tahap Siklus Jantung">
        <div className="playback-controls">
          <button
            type="button"
            className={`btn-play-toggle ${isPlaying ? 'playing' : 'paused'}`}
            onClick={handleTogglePlay}
          >
            {isPlaying ? '⏸ Jeda' : '▶ Putar'}
          </button>

          <button
            type="button"
            className="btn-step-nav"
            onClick={() => handleStepStage(-1)}
          >
            ← Tahap Sebelumnya
          </button>

          <button
            type="button"
            className="btn-step-nav"
            onClick={() => handleStepStage(1)}
          >
            Tahap Berikutnya →
          </button>
        </div>

        <div className="stage-pills-bar" role="group" aria-label="Pilih fase siklus jantung">
          <button
            type="button"
            className={`stage-pill-btn ${lockedStage === null && isPlaying ? 'active-all' : ''}`}
            onClick={handleSelectAllCycles}
          >
            Semua Siklus
          </button>

          {STAGE_IDS.map((stageId) => {
            const st = activeCondition.stages[stageId];
            const isSelected = activeStage === stageId;
            return (
              <button
                key={stageId}
                type="button"
                className={`stage-pill-btn ${isSelected ? 'active' : ''}`}
                style={
                  isSelected
                    ? {
                        borderColor: st.accentColor,
                        backgroundColor: st.softBg,
                        color: st.accentColor,
                      }
                    : undefined
                }
                onClick={() => handleSelectStage(stageId)}
              >
                <span className="pill-dot" style={{ backgroundColor: st.accentColor }} />
                {st.shortPillLabel}
              </button>
            );
          })}
        </div>

        <div className="speed-picker" role="group" aria-label="Mode kecepatan siklus jantung">
          <span className="speed-caption">Kecepatan:</span>
          <button
            type="button"
            className={`speed-option-btn ${speedMode === 'real' ? 'selected' : ''}`}
            onClick={() => setSpeedMode('real')}
            title={`Ritme nyata (~${(60 / activeCondition.heartRateBpm).toFixed(1)} detik per siklus)`}
          >
            1x (Real)
          </button>
          <button
            type="button"
            className={`speed-option-btn ${speedMode === 'slow' ? 'selected' : ''}`}
            onClick={() => setSpeedMode('slow')}
            title="Mode belajar: 1 siklus penuh selama 10 detik"
          >
            Lambat (10s)
          </button>
        </div>
      </section>

      {/* KONTEN UTAMA: 2 KOLOM VISUAL DI ATAS + 4 TAHAP PENJELASAN DI BAWAH */}
      <main className="main-learning-container">
        <div className="top-visual-grid">
          <HeartConductionDiagram
            condition={activeCondition}
            activeStage={activeStage}
            onSelectStage={handleSelectStage}
          />

          <SingleLeadViewer
            condition={activeCondition}
            selectedLead={selectedLead}
            onSelectLead={setSelectedLead}
            activeStage={activeStage}
            cycleProgress={cycleProgress}
            onSelectStage={handleSelectStage}
          />
        </div>

        <ProcessStagesPanel
          condition={activeCondition}
          selectedLead={selectedLead}
          activeStage={activeStage}
          onSelectStage={handleSelectStage}
        />
      </main>

      {/* FOOTER CATATAN EDUKASI & REFERENSI TEXTBOOK */}
      <footer className="clean-disclaimer-footer" role="contentinfo">
        <div className="footer-inner">
          <p className="footer-disclaimer-line">
            <strong>Catatan Edukasi:</strong> ECG PathoLogic merupakan media pembelajaran visual untuk memahami mekanisme fisiologi dan elektrokardiografi secara konseptual, bukan alat diagnostik maupun dasar pengambilan keputusan klinis pada pasien.
          </p>
          <p className="footer-references-line">
            <strong>Referensi Materi:</strong>{' '}
            <em>Harrison’s Principles of Internal Medicine</em> •{' '}
            <em>Marriott&apos;s Practical Electrocardiography 13th</em> •{' '}
            Ary L. Goldberger, Zachary D. Goldberger, Alexei Shvilkin -{' '}
            <em>Goldberger&apos;s Clinical Electrocardiography: A Simplified Approach</em> (2024, Elsevier).
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
