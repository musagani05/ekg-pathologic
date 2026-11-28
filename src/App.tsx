import { useEffect, useState } from 'react';
import './App.css';
import { HeartConductionDiagram } from './components/HeartConductionDiagram';
import { ProcessStagesPanel } from './components/ProcessStagesPanel';
import { SingleLeadViewer } from './components/SingleLeadViewer';
import type { EcgCondition, LeadId, StageId } from './data/ecgConditions';
import { ECG_DOMAINS, STAGE_IDS } from './data/ecgConditions';
import {
  getStageAtCycleProgress,
  getStageProgressRange,
} from './utils/ecgWaveform';

type SpeedMode = 'real' | 'slow';

function App() {
  const [selectedDomainId, setSelectedDomainId] = useState<string>(ECG_DOMAINS[0].id);
  const [activeConditionId, setActiveConditionId] = useState<string>(
    ECG_DOMAINS[0].conditions[0]?.id ?? '',
  );

  const activeDomain =
    ECG_DOMAINS.find((d) => d.id === selectedDomainId) ?? ECG_DOMAINS[0];
  const activeCondition: EcgCondition | null =
    activeDomain.conditions.find((c) => c.id === activeConditionId) ??
    activeDomain.conditions[0] ??
    null;

  const [selectedLead, setSelectedLead] = useState<LeadId>(
    activeCondition?.defaultLead ?? 'II',
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMode, setSpeedMode] = useState<SpeedMode>('slow');
  const [cycleProgress, setCycleProgress] = useState<number>(0.12);
  const [loopStage, setLoopStage] = useState<StageId | null>(null);

  const currentLeadParams = activeCondition
    ? activeCondition.leads[selectedLead].params
    : null;

  // Durasi 1 siklus: "1x (Real)" (~0.8 detik pada 75 bpm) atau "Lambat (20s)" (20 detik per siklus)
  const cycleDurationSeconds =
    activeCondition && speedMode === 'real' ? 60 / activeCondition.heartRateBpm : 20;

  useEffect(() => {
    if (!isPlaying || !activeCondition || !currentLeadParams) return;

    const stageRange =
      loopStage !== null
        ? getStageProgressRange(
            currentLeadParams,
            activeCondition.heartRateBpm,
            loopStage,
          )
        : null;

    let rafId = 0;
    let prevTime: number | null = null;

    const animate = (now: number) => {
      if (prevTime !== null) {
        const dtSec = Math.min(0.1, (now - prevTime) / 1000);
        const delta = dtSec / cycleDurationSeconds;
        setCycleProgress((prev) => {
          if (stageRange) {
            const span = Math.max(0.005, stageRange.endProgress - stageRange.startProgress);
            const offset =
              (((prev - stageRange.startProgress + delta) % span) + span) % span;
            return stageRange.startProgress + offset;
          }
          return (prev + delta) % 1;
        });
      }
      prevTime = now;
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [isPlaying, cycleDurationSeconds, activeCondition, currentLeadParams, loopStage]);

  const computedLiveStage =
    activeCondition && currentLeadParams
      ? getStageAtCycleProgress(
          currentLeadParams,
          activeCondition.heartRateBpm,
          cycleProgress,
        )
      : null;
  const activeStage: StageId | null = loopStage ?? computedLiveStage;

  const applyCondition = (cond: EcgCondition) => {
    setSelectedDomainId(cond.domainId);
    setActiveConditionId(cond.id);
    setSelectedLead(cond.defaultLead);
    if (loopStage !== null) {
      const nextParams = cond.leads[cond.defaultLead].params;
      const range = getStageProgressRange(nextParams, cond.heartRateBpm, loopStage);
      setCycleProgress(range.startProgress);
    } else {
      setCycleProgress(0.12);
    }
    setIsPlaying(true);
  };

  const handleDomainChange = (nextDomainId: string) => {
    const nextDomain = ECG_DOMAINS.find((d) => d.id === nextDomainId);
    if (!nextDomain) return;

    setSelectedDomainId(nextDomain.id);
    if (nextDomain.conditions.length > 0) {
      applyCondition(nextDomain.conditions[0]);
    } else {
      setActiveConditionId('');
      setLoopStage(null);
      setIsPlaying(false);
    }
  };

  const handleSubdomainChange = (nextConditionId: string) => {
    const nextCond = activeDomain.conditions.find((c) => c.id === nextConditionId);
    if (!nextCond) return;
    applyCondition(nextCond);
  };

  const handleSelectStage = (stageId: StageId) => {
    if (!activeCondition || !currentLeadParams) return;
    const range = getStageProgressRange(
      currentLeadParams,
      activeCondition.heartRateBpm,
      stageId,
    );
    setLoopStage(stageId);
    setCycleProgress(range.startProgress);
    setIsPlaying(true);
  };

  const handleSelectAllCycles = () => {
    if (!activeCondition) return;
    setLoopStage(null);
    setCycleProgress(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (!activeCondition) return;
    setIsPlaying((prev) => !prev);
  };

  const handleStepStage = (direction: -1 | 1) => {
    if (!activeCondition) return;
    const baseStage: StageId = activeStage ?? (direction === 1 ? 1 : 4);
    const currentIndex = STAGE_IDS.indexOf(baseStage);
    const nextIndex = activeStage
      ? (currentIndex + direction + STAGE_IDS.length) % STAGE_IDS.length
      : currentIndex;
    handleSelectStage(STAGE_IDS[nextIndex]);
  };

  return (
    <div className="app-shell">
      {/* 1. HEADER BERSIH: JUDUL & DROPDOWN 2 TINGKAT (DOMAIN -> SUBDOMAIN) */}
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
          <label htmlFor="domain-dropdown" className="sr-only">
            Pilih Domain Kategori
          </label>
          <select
            id="domain-dropdown"
            className="module-dropdown domain-select"
            value={activeDomain.id}
            onChange={(e) => handleDomainChange(e.target.value)}
          >
            {ECG_DOMAINS.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>

          <label htmlFor="condition-dropdown" className="sr-only">
            Pilih Subdomain Kondisi
          </label>
          <select
            id="condition-dropdown"
            className="module-dropdown condition-select"
            value={activeCondition ? activeCondition.id : ''}
            disabled={activeDomain.conditions.length === 0}
            onChange={(e) => handleSubdomainChange(e.target.value)}
          >
            {activeDomain.conditions.length === 0 ? (
              <option value="" disabled>
                Belum ada kondisi ditambahkan
              </option>
            ) : (
              activeDomain.conditions.map((cond) => (
                <option key={cond.id} value={cond.id}>
                  {cond.name}
                </option>
              ))
            )}
          </select>
        </div>
      </header>

      {/* KONTROL EDUKASI & 2 MODE KECEPATAN (Tampil hanya jika ada kondisi aktif) */}
      {activeCondition && (
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
              className={`stage-pill-btn ${loopStage === null ? 'active-all' : ''}`}
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
              title="Mode belajar: 1 siklus penuh selama 20 detik"
            >
              Lambat (20s)
            </button>
          </div>
        </section>
      )}

      {/* KONTEN UTAMA: 2 KOLOM VISUAL DI ATAS + 4 TAHAP PENJELASAN DI BAWAH, ATAU STATUS KOSONG */}
      <main className="main-learning-container">
        {activeCondition ? (
          <>
            <div className="top-visual-grid">
              <HeartConductionDiagram
                condition={activeCondition}
                leadParams={currentLeadParams!}
                cycleProgress={cycleProgress}
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
          </>
        ) : (
          <section className="empty-domain-card" aria-label="Status domain belum berisi kondisi">
            <div className="empty-domain-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="44" height="44">
                <rect width="48" height="48" rx="12" fill="#f1f5f9" />
                <path
                  d="M 10 25 L 17 25 L 20 19 L 23 31 L 27 15 L 30 28 L 33 23 L 38 23"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="empty-domain-title">{activeDomain.name}</h2>
            <p className="empty-domain-desc">
              Belum ada kondisi yang ditambahkan pada domain ini. Pilih domain lain pada menu di atas untuk mempelajari simulasi jantung dan gelombang EKG yang tersedia.
            </p>
            <button
              type="button"
              className="btn-return-baseline"
              onClick={() => handleDomainChange(ECG_DOMAINS[0].id)}
            >
              Kembali ke Fisiologi Normal
            </button>
          </section>
        )}
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
            <em>Marriott&apos;s Practical Electrocardiography</em> •{' '}
            <em>Goldberger&apos;s Clinical Electrocardiography</em>
          </p>
          <p className="footer-references-line">
            Kritik dan saran dapat dikirimkan ke email{' '}
            <a href="mailto:musaganirahman@mail.ugm.ac.id" style={{ color: 'inherit' }}>
              musaganirahman@mail.ugm.ac.id
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
