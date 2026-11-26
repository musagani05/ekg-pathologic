import type { LeadId } from '../data/ecgConditions';

export interface LeadPositionPanelProps {
  selectedLead: LeadId;
  onSelectLead: (lead: LeadId) => void;
}

interface LimbNode {
  id: LeadId;
  angleLabel: string;
  lineX2: number;
  lineY2: number;
  dotX: number;
  dotY: number;
  labelX: number;
  labelY: number;
  anchor: 'start' | 'middle' | 'end';
}

const LIMB_NODES: LimbNode[] = [
  {
    id: 'aVR',
    angleLabel: '−150°',
    lineX2: 90,
    lineY2: 75,
    dotX: 90,
    dotY: 75,
    labelX: 80,
    labelY: 72,
    anchor: 'end',
  },
  {
    id: 'aVL',
    angleLabel: '−30°',
    lineX2: 190,
    lineY2: 75,
    dotX: 190,
    dotY: 75,
    labelX: 200,
    labelY: 72,
    anchor: 'start',
  },
  {
    id: 'I',
    angleLabel: '0°',
    lineX2: 198,
    lineY2: 104,
    dotX: 198,
    dotY: 104,
    labelX: 208,
    labelY: 108,
    anchor: 'start',
  },
  {
    id: 'II',
    angleLabel: '+60°',
    lineX2: 169,
    lineY2: 154,
    dotX: 169,
    dotY: 154,
    labelX: 179,
    labelY: 166,
    anchor: 'start',
  },
  {
    id: 'aVF',
    angleLabel: '+90°',
    lineX2: 140,
    lineY2: 162,
    dotX: 140,
    dotY: 162,
    labelX: 140,
    labelY: 186,
    anchor: 'middle',
  },
  {
    id: 'III',
    angleLabel: '+120°',
    lineX2: 111,
    lineY2: 154,
    dotX: 111,
    dotY: 154,
    labelX: 101,
    labelY: 166,
    anchor: 'end',
  },
];

interface ChestNode {
  id: LeadId;
  dotX: number;
  dotY: number;
  labelX: number;
  labelY: number;
  anchor: 'start' | 'middle' | 'end';
}

const CHEST_NODES: ChestNode[] = [
  { id: 'V1', dotX: 102, dotY: 150, labelX: 88, labelY: 174, anchor: 'end' },
  { id: 'V2', dotX: 138, dotY: 153, labelX: 134, labelY: 182, anchor: 'middle' },
  { id: 'V3', dotX: 164, dotY: 148, labelX: 176, labelY: 174, anchor: 'start' },
  { id: 'V4', dotX: 188, dotY: 136, labelX: 204, labelY: 150, anchor: 'start' },
  { id: 'V5', dotX: 206, dotY: 116, labelX: 222, labelY: 122, anchor: 'start' },
  { id: 'V6', dotX: 214, dotY: 92, labelX: 228, labelY: 96, anchor: 'start' },
];

const LEAD_DEFLECTION_SUMMARY: Record<LeadId, string> = {
  I: 'Lead I (0°) berada di sisi kiri: arus utama mendekat sehingga gelombang P, R, dan T tampak positif.',
  II: 'Lead II (+60°) sejajar persis dengan arah vektor utama jantung: menghasilkan gelombang P dan R positif paling tegas.',
  III: 'Lead III (+120°) melihat dari kanan-bawah: sebagian arus mendekat sehingga R tetap positif berukuran sedang.',
  aVR: 'Lead aVR (−150°) melihat dari bahu kanan, berlawanan arah vektor jantung: gelombang P, QRS, dan T normalnya negatif.',
  aVL: 'Lead aVL (−30°) berada di samping-atas kiri, hampir tegak lurus vektor utama (+60°): amplitudo gelombang relatif kecil.',
  aVF: 'Lead aVF (+90°) melihat lurus dari bawah: komponen arus yang turun ke apeks menghasilkan defleksi positif.',
  V1: 'V1 di dada kanan depan: melihat arus sekat mendekat sesaat (r kecil) lalu arus besar ventrikel kiri menjauh (S dalam) dan P bifasik.',
  V2: 'V2 di depan sekat jantung: gelombang r bertambah namun tarikan ventrikel kiri ke belakang masih menghasilkan S dalam.',
  V3: 'V3 di zona peralihan depan: arah arus mendekat dan menjauh hampir seimbang sehingga tinggi R dan S tampak setara (bifasik/ekuifasik).',
  V4: 'V4 menghadap ujung depan ventrikel kiri: arus utama lebih banyak mendekat sehingga gelombang R melampaui gelombang S.',
  V5: 'V5 menghadap dinding samping ventrikel kiri: arus utama mendekat kuat menghasilkan gelombang R tinggi.',
  V6: 'V6 di samping aksila kiri: kebalikan V1, menangkap sekat menjauh tipis (q kecil) lalu arus utama mendekat (R tinggi).',
};

export function LeadPositionPanel({
  selectedLead,
  onSelectLead,
}: LeadPositionPanelProps) {
  return (
    <div className="lead-pos-drawer" role="region" aria-label="Posisi Lead dan Dampaknya ke EKG">
      <div className="lead-pos-diagrams">
        {/* 1. LIMB LEADS (BIDANG FRONTAL) */}
        <div className="pos-diagram-card">
          <span className="pos-diagram-title">Limb Leads (Bidang Frontal)</span>
          <svg
            viewBox="0 0 280 202"
            className="pos-mini-svg"
            role="img"
            aria-label="Diagram posisi elektroda Limb Leads I, II, III, aVR, aVL, aVF"
          >
            <defs>
              <marker
                id="pos-vec-red"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
              </marker>
            </defs>

            <text x="140" y="18" textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontWeight="600">
              ATAS • BAHU KANAN / KIRI
            </text>

            <circle
              cx="140"
              cy="104"
              r="58"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />

            {/* Garis Aksis Tiap Limb Lead */}
            {LIMB_NODES.map((node) => {
              const isSelected = selectedLead === node.id;
              return (
                <g
                  key={node.id}
                  className="pos-lead-node"
                  onClick={() => onSelectLead(node.id)}
                >
                  <line
                    x1="140"
                    y1="104"
                    x2={node.lineX2}
                    y2={node.lineY2}
                    stroke={isSelected ? '#2563eb' : '#cbd5e1'}
                    strokeWidth={isSelected ? 2.2 : 1.1}
                  />
                  <circle
                    cx={node.dotX}
                    cy={node.dotY}
                    r={isSelected ? 5 : 3.2}
                    fill={isSelected ? '#2563eb' : '#94a3b8'}
                    stroke="#ffffff"
                    strokeWidth="1.4"
                  />
                  <text
                    x={node.labelX}
                    y={node.labelY}
                    textAnchor={node.anchor}
                    fontSize="10.5"
                    fontWeight={isSelected ? '800' : '600'}
                    fill={isSelected ? '#1d4ed8' : '#334155'}
                  >
                    {node.id} ({node.angleLabel})
                  </text>
                </g>
              );
            })}

            {/* Panah Vektor Utama Jantung (+58°) */}
            <line
              x1="140"
              y1="104"
              x2="162"
              y2="139"
              stroke="#dc2626"
              strokeWidth="2.8"
              strokeLinecap="round"
              markerEnd="url(#pos-vec-red)"
              pointerEvents="none"
            />
            <circle cx="140" cy="104" r="3" fill="#0f172a" />
          </svg>
        </div>

        {/* 2. CHEST LEADS (BIDANG HORIZONTAL V1-V6) */}
        <div className="pos-diagram-card">
          <span className="pos-diagram-title">Chest Leads (Penampang Dada V1–V6)</span>
          <svg
            viewBox="0 0 280 202"
            className="pos-mini-svg"
            role="img"
            aria-label="Diagram posisi elektroda prekordial dada V1 sampai V6"
          >
            <defs>
              <marker
                id="chest-vec-red"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
              </marker>
            </defs>

            <text x="128" y="18" textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontWeight="600">
              PUNGGUNG (POSTERIOR)
            </text>

            {/* Penampang Oval Rongga Dada */}
            <ellipse
              cx="128"
              cy="92"
              rx="86"
              ry="58"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />

            {/* Siluet Penampang Jantung di Dalam Dada */}
            <ellipse
              cx="138"
              cy="102"
              rx="38"
              ry="28"
              transform="rotate(-18 138 102)"
              fill="#fee2e2"
              stroke="#fca5a5"
              strokeWidth="1.3"
            />

            {/* Panah Vektor Utama Ventrikel Kiri (Menuju Kiri-Samping) */}
            <line
              x1="126"
              y1="104"
              x2="172"
              y2="98"
              stroke="#dc2626"
              strokeWidth="2.8"
              strokeLinecap="round"
              markerEnd="url(#chest-vec-red)"
              pointerEvents="none"
            />

            {/* Titik Elektroda V1 - V6 di Dinding Dada */}
            {CHEST_NODES.map((node) => {
              const isSelected = selectedLead === node.id;
              return (
                <g
                  key={node.id}
                  className="pos-lead-node"
                  onClick={() => onSelectLead(node.id)}
                >
                  <circle
                    cx={node.dotX}
                    cy={node.dotY}
                    r={isSelected ? 5.5 : 3.6}
                    fill={isSelected ? '#2563eb' : '#64748b'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={node.labelX}
                    y={node.labelY}
                    textAnchor={node.anchor}
                    fontSize="10.5"
                    fontWeight={isSelected ? '800' : '600'}
                    fill={isSelected ? '#1d4ed8' : '#334155'}
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}

            <text x="54" y="196" fontSize="9" fill="#94a3b8" fontWeight="600">
              DEPAN DADA (ANTERIOR)
            </text>
          </svg>
        </div>
      </div>

      {/* PRINSIP DAMPAK ARAH VEKTOR KE DEFLEKSI EKG */}
      <div className="vector-impact-rules">
        <div className="impact-rule-pill positive">
          <strong>Mendekati (+):</strong> Vektor searah elektroda menghasilkan <em>defleksi positif</em> (ke atas).
        </div>
        <div className="impact-rule-pill negative">
          <strong>Menjauhi (−):</strong> Vektor berlawanan arah menghasilkan <em>defleksi negatif</em> (ke bawah).
        </div>
        <div className="impact-rule-pill biphasic">
          <strong>Tegak Lurus (±):</strong> Vektor memotong 90° menghasilkan <em>gelombang kecil / bifasik</em>.
        </div>
      </div>

      <div className="selected-lead-impact-note">
        <strong>Dampak pada Lead {selectedLead} (Aktif):</strong> {LEAD_DEFLECTION_SUMMARY[selectedLead]}
      </div>
    </div>
  );
}
