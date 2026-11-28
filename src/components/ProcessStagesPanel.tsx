import type {
  EcgCondition,
  LeadId,
  StageId,
} from '../data/ecgConditions';
import { STAGE_IDS } from '../data/ecgConditions';

export interface ProcessStagesPanelProps {
  condition: EcgCondition;
  selectedLead: LeadId;
  activeStage: StageId | null;
  onSelectStage: (stage: StageId) => void;
}

export function ProcessStagesPanel({
  condition,
  selectedLead,
  activeStage,
  onSelectStage,
}: ProcessStagesPanelProps) {
  const leadPerspective = condition.leads[selectedLead];

  return (
    <section className="stages-section" aria-label="Alur 4 Tahap Proses Jantung dan EKG">
      <div className="stages-section-header">
        <h2 className="stages-section-title">
          Alur Sebab-Akibat Proses Listrik Jantung ke Gelombang EKG
        </h2>
        <span className="stages-section-hint">
          Klik salah satu kartu tahap untuk memutar ulang (loop) visualisasi fase tersebut
        </span>
      </div>

      <div className="stages-horizontal-grid">
        {STAGE_IDS.map((stageId) => {
          const stage = condition.stages[stageId];
          const isHighlighted = activeStage === stageId;

          return (
            <article
              key={stage.id}
              className={`stage-card ${isHighlighted ? 'is-active' : ''}`}
              style={
                isHighlighted
                  ? {
                      borderColor: stage.accentColor,
                      backgroundColor: stage.softBg,
                    }
                  : undefined
              }
              onClick={() => onSelectStage(stage.id)}
            >
              <header className="stage-card-top">
                <span
                  className="stage-step-pill"
                  style={{
                    backgroundColor: isHighlighted ? stage.accentColor : '#f1f5f9',
                    color: isHighlighted ? '#ffffff' : '#334155',
                  }}
                >
                  Tahap {stage.id}
                </span>
                {isHighlighted && (
                  <span
                    className="stage-active-indicator"
                    style={{ color: stage.accentColor }}
                  >
                    ● Sedang Disorot
                  </span>
                )}
              </header>

              <h3 className="stage-flow-heading">
                <span>{stage.heartProcessTitle}</span>
                <span className="flow-arrow" style={{ color: stage.accentColor }}>
                  {' → '}
                </span>
                <span style={{ color: stage.accentColor }}>{stage.ecgWaveTitle}</span>
              </h3>

              <div className="stage-logic-block">
                <span className="logic-label">Apa yang terjadi di jantung</span>
                <p className="logic-text">{stage.whatHappensInHeart}</p>
              </div>

              <div className="stage-logic-block">
                <span className="logic-label">Mengapa gelombang EKG demikian</span>
                <p className="logic-text">{stage.whyEcgLooksLikeThis}</p>
              </div>

              {selectedLead !== condition.defaultLead && (
                <div className="stage-lead-note">
                  <strong>Pada Lead {selectedLead}:</strong> {leadPerspective.stageNotes[stage.id]}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
