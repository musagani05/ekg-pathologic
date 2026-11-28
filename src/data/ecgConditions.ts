export type LeadId =
  | 'I'
  | 'II'
  | 'III'
  | 'aVR'
  | 'aVL'
  | 'aVF'
  | 'V1'
  | 'V2'
  | 'V3'
  | 'V4'
  | 'V5'
  | 'V6';

export type LeadGroup = 'Limb' | 'Augmented' | 'Precordial';

/**
 * 4 Tahap Berurutan Siklus Jantung & EKG untuk Pembelajaran Visual
 */
export type StageId = 1 | 2 | 3 | 4;

export type EcgPhaseKey = 'P' | 'PR' | 'QRS' | 'ST_T';

export type ConductionPartId =
  | 'sa-node'
  | 'right-atrium'
  | 'left-atrium'
  | 'av-node'
  | 'his-bundle'
  | 'rbb'
  | 'lbb'
  | 'purkinje'
  | 'right-ventricle'
  | 'left-ventricle';

export type BlockedConductionTarget =
  | 'av-node'
  | 'av-reentry'
  | 'rbb'
  | 'lbb'
  | 'left-anterior-fascicle'
  | 'left-posterior-fascicle';

export type IschemicZoneTarget = 'anterior-lv' | 'inferior' | 'subendocardial-lv';

export type HypertrophyZoneTarget =
  | 'right-atrium'
  | 'left-atrium'
  | 'left-ventricle'
  | 'right-ventricle';

export interface LeadWaveParams {
  pAmpMv: number;
  pTerminalAmpMv?: number;
  pInitialRatio?: number;
  pDurationMs: number;
  pSharpness?: 'normal' | 'peaked';
  pNotched?: boolean;
  prIntervalMs: number;
  qAmpMv: number;
  qDurationMs?: number;
  rAmpMv: number;
  rDurationMs?: number;
  rNotched?: boolean;
  sAmpMv: number;
  sDurationMs?: number;
  rPrimeAmpMv?: number;
  qrsDurationMs: number;
  stDeviationMv: number;
  stMorphology?: 'flat' | 'concave' | 'convex' | 'downsloping' | 'upsloping';
  tAmpMv: number;
  tDurationMs: number;
  tSharpness?: 'normal' | 'peaked';
  qtIntervalMs: number;
  uAmpMv?: number;
}

export interface LeadPerspective {
  id: LeadId;
  group: LeadGroup;
  viewLabel: string;
  axisNote: string;
  stageNotes: Record<StageId, string>;
  params: LeadWaveParams;
}

export interface HeartVectorSpec {
  id: string;
  label: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dashed?: boolean;
}

export interface ProcessStageDetail {
  id: StageId;
  phaseKey: EcgPhaseKey;
  shortPillLabel: string;
  heartProcessTitle: string;
  ecgWaveTitle: string;
  accentColor: string;
  softBg: string;
  activeParts: ConductionPartId[];
  vectors: HeartVectorSpec[];
  heartStatusCaption: string;
  whatHappensInHeart: string;
  whyEcgLooksLikeThis: string;
}

export interface EcgCondition {
  id: string;
  domainId: string;
  domainName: string;
  name: string;
  noteReferencePath: string;
  heartRateBpm: number;
  defaultLead: LeadId;
  isNormalBaseline?: boolean;
  blockedTarget?: BlockedConductionTarget;
  ischemicZone?: IschemicZoneTarget;
  hypertrophyZone?: HypertrophyZoneTarget;
  stages: Record<StageId, ProcessStageDetail>;
  leads: Record<LeadId, LeadPerspective>;
}

export interface EcgDomain {
  id: string;
  name: string;
  conditions: EcgCondition[];
}

export const ALL_LEAD_IDS: LeadId[] = [
  'I',
  'II',
  'III',
  'aVR',
  'aVL',
  'aVF',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
];

export const STAGE_IDS: StageId[] = [1, 2, 3, 4];

export const NORMAL_SINUS_CONDITION: EcgCondition = {
  id: 'normal-sinus-rhythm',
  domainId: 'fisiologi-normal',
  domainName: 'Fisiologi Normal',
  name: 'Normal Sinus Rhythm',
  noteReferencePath: 'src/notes/01-normal-sinus-rhythm.md',
  heartRateBpm: 75,
  defaultLead: 'II',
  isNormalBaseline: true,

  stages: {
    1: {
      id: 1,
      phaseKey: 'P',
      shortPillLabel: '1. Gel. P',
      heartProcessTitle: 'Depolarisasi Atrium',
      ecgWaveTitle: 'Gelombang P',
      accentColor: '#2563eb',
      softBg: '#eff6ff',
      activeParts: ['sa-node', 'right-atrium', 'left-atrium'],
      vectors: [
        {
          id: 'vec-atrial',
          label: 'Vektor Atrium (Kiri-Bawah)',
          x1: 214,
          y1: 118,
          x2: 292,
          y2: 176,
          color: '#2563eb',
        },
      ],
      heartStatusCaption: 'SA Node memicu impuls listrik yang menyebar melintasi Atrium Kanan dan Atrium Kiri.',
      whatHappensInHeart:
        'SA Node di puncak atrium kanan melepaskan impuls otomatis, lalu gelombang listrik menyebar rata ke dinding atrium kanan dan menyeberang ke atrium kiri agar kedua atrium memompa darah masuk ke ventrikel.',
      whyEcgLooksLikeThis:
        'Arus depolarisasi atrium mengalir halus ke arah kiri-bawah mendekati elektroda Lead II, sehingga terekam sebagai bukit kecil yang membulat lembut (Gelombang P) namun terbalik di aVR.',
    },
    2: {
      id: 2,
      phaseKey: 'PR',
      shortPillLabel: '2. Segmen PR',
      heartProcessTitle: 'Perlambatan di AV Node',
      ecgWaveTitle: 'Segmen PR',
      accentColor: '#d97706',
      softBg: '#fffbeb',
      activeParts: ['av-node', 'his-bundle'],
      vectors: [
        {
          id: 'vec-av-delay',
          label: 'Konduksi Lambat AV → His',
          x1: 262,
          y1: 194,
          x2: 274,
          y2: 224,
          color: '#d97706',
          dashed: true,
        },
      ],
      heartStatusCaption: 'AV Node menahan impuls sejenak sebelum meneruskannya ke Bundle of His.',
      whatHappensInHeart:
        'Setibanya di AV Node, laju hantaran listrik sengaja diperlambat secara drastis. Jeda singkat ini memberi waktu bagi atrium untuk menuntaskan pengisian darah ke ventrikel sebelum ventrikel berkontraksi.',
      whyEcgLooksLikeThis:
        'Ukuran jaringan AV Node dan Bundle of His sangat kecil sehingga arus listriknya tidak cukup kuat terdeteksi di kulit—kertas EKG pun menggambar garis lurus mendatar (Segmen PR).',
    },
    3: {
      id: 3,
      phaseKey: 'QRS',
      shortPillLabel: '3. Kompleks QRS',
      heartProcessTitle: 'Depolarisasi Ventrikel (His-Purkinje)',
      ecgWaveTitle: 'Kompleks QRS',
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      activeParts: ['his-bundle', 'rbb', 'lbb', 'purkinje', 'right-ventricle', 'left-ventricle'],
      vectors: [
        {
          id: 'vec-septal',
          label: '1. Vektor Septum',
          x1: 288,
          y1: 254,
          x2: 248,
          y2: 242,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-lv-main',
          label: '2. Vektor Utama Ventrikel',
          x1: 274,
          y1: 240,
          x2: 344,
          y2: 326,
          color: '#dc2626',
        },
      ],
      heartStatusCaption: 'Impuls melesat lewat RBB, LBB, dan Purkinje untuk mengaktifkan kedua ventrikel serempak.',
      whatHappensInHeart:
        'Impuls meluncur sangat cepat melalui cabang kanan (RBB), cabang kiri (LBB), dan serabut Purkinje. Sekat jantung aktif lebih dulu dari kiri ke kanan, disusul kontraksi serentak seluruh otot ventrikel yang didominasi dinding tebal ventrikel kiri.',
      whyEcgLooksLikeThis:
        'Karena penyebaran Purkinje berlangsung cepat dan massa otot ventrikel sangat besar, terbentuk lonjakan gelombang yang curam, tinggi, dan sempit (Kompleks QRS).',
    },
    4: {
      id: 4,
      phaseKey: 'ST_T',
      shortPillLabel: '4. Segmen ST & Gel. T',
      heartProcessTitle: 'Repolarisasi Ventrikel',
      ecgWaveTitle: 'Segmen ST & Gelombang T',
      accentColor: '#059669',
      softBg: '#ecfdf5',
      activeParts: ['right-ventricle', 'left-ventricle'],
      vectors: [
        {
          id: 'vec-repol',
          label: 'Vektor Repolarisasi (Searah QRS)',
          x1: 278,
          y1: 248,
          x2: 338,
          y2: 318,
          color: '#059669',
        },
      ],
      heartStatusCaption: 'Otot ventrikel berada di fase datar (ST) lalu memulihkan muatan dari lapisan luar ke dalam (Gel. T).',
      whatHappensInHeart:
        'Sesaat setelah berkontraksi penuh, seluruh sel ventrikel menahan muatan yang seragam (fase plateau), kemudian memulihkan muatan listriknya (repolarisasi) dimulai dari lapisan luar jantung (epikardium) menuju lapisan dalam.',
      whyEcgLooksLikeThis:
        'Saat muatan ventrikel seragam tidak ada aliran arus sehingga Segmen ST tampak datar. Selanjutnya pemulihan dari luar ke dalam membalik arah rambat sekaligus muatannya, menghasilkan Gelombang T yang searah dengan QRS.',
    },
  },

  leads: {
    I: {
      id: 'I',
      group: 'Limb',
      viewLabel: 'Pandangan Lateral Kiri (0°)',
      axisNote: 'Melihat jantung dari sisi bahu/lengan kiri',
      stageNotes: {
        1: 'Gelombang P positif halus karena arus atrium bergerak mendekati sisi kiri.',
        2: 'Segmen PR mendatar selama jeda fisiologis di AV Node.',
        3: 'Tampak lekukan q kecil dari septum diikuti puncak R tegas dari ventrikel kiri.',
        4: 'Segmen ST datar di garis dasar, diikuti Gelombang T positif.',
      },
      params: {
        pAmpMv: 0.1,
        pDurationMs: 94,
        prIntervalMs: 162,
        qAmpMv: -0.06,
        qDurationMs: 18,
        rAmpMv: 0.86,
        rDurationMs: 42,
        sAmpMv: -0.04,
        sDurationMs: 20,
        qrsDurationMs: 82,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: 0.23,
        tDurationMs: 162,
        qtIntervalMs: 380,
      },
    },
    II: {
      id: 'II',
      group: 'Limb',
      viewLabel: 'Pandangan Inferior Utama (+60°)',
      axisNote: 'Sejajar langsung dengan arah aliran listrik utama jantung',
      stageNotes: {
        1: 'Gelombang P tampak positif paling jelas karena arus atrium mengarah lurus ke Lead II.',
        2: 'Garis datar Segmen PR menandakan waktu pengisian ventrikel saat AV Node menahan impuls.',
        3: 'Gelombang R menjulang tinggi dan sempit karena vektor utama ventrikel mengarah langsung ke elektroda ini.',
        4: 'Segmen ST sejajar garis dasar, disusul Gelombang T positif yang landai saat naik dan lebih curam saat turun.',
      },
      params: {
        pAmpMv: 0.16,
        pDurationMs: 96,
        prIntervalMs: 164,
        qAmpMv: -0.05,
        qDurationMs: 18,
        rAmpMv: 1.24,
        rDurationMs: 44,
        sAmpMv: -0.08,
        sDurationMs: 20,
        qrsDurationMs: 84,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: 0.34,
        tDurationMs: 166,
        qtIntervalMs: 382,
      },
    },
    III: {
      id: 'III',
      group: 'Limb',
      viewLabel: 'Pandangan Inferior Kanan (+120°)',
      axisNote: 'Melihat dinding bawah jantung dari sisi kanan bawah',
      stageNotes: {
        1: 'Gelombang P positif rendah karena sudut pandang sedikit menyamping dari vektor atrium.',
        2: 'Segmen PR mendatar selama konduksi lambat di AV Node.',
        3: 'Gelombang R berukuran sedang didahului q kecil fisiologis.',
        4: 'Segmen ST datar dengan Gelombang T positif rendah.',
      },
      params: {
        pAmpMv: 0.06,
        pDurationMs: 90,
        prIntervalMs: 162,
        qAmpMv: -0.06,
        qDurationMs: 20,
        rAmpMv: 0.48,
        rDurationMs: 40,
        sAmpMv: -0.08,
        sDurationMs: 22,
        qrsDurationMs: 82,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: 0.11,
        tDurationMs: 156,
        qtIntervalMs: 380,
      },
    },
    aVR: {
      id: 'aVR',
      group: 'Augmented',
      viewLabel: 'Pandangan Bahu Kanan (−150°)',
      axisNote: 'Berlawanan arah dengan aliran listrik normal jantung',
      stageNotes: {
        1: 'Gelombang P wajib terbalik (negatif) karena arus atrium bergerak menjauhi bahu kanan.',
        2: 'Segmen PR tetap berada pada garis dasar isoelektrik.',
        3: 'Kompleks QRS tampak dominan menghujam ke bawah karena aktivasi ventrikel menjauhi bahu kanan.',
        4: 'Segmen ST datar diikuti Gelombang T negatif yang normal untuk perspektif aVR.',
      },
      params: {
        pAmpMv: -0.13,
        pDurationMs: 94,
        prIntervalMs: 162,
        qAmpMv: 0,
        rAmpMv: 0.05,
        rDurationMs: 16,
        sAmpMv: -1.02,
        sDurationMs: 56,
        qrsDurationMs: 82,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: -0.26,
        tDurationMs: 160,
        qtIntervalMs: 380,
      },
    },
    aVL: {
      id: 'aVL',
      group: 'Augmented',
      viewLabel: 'Pandangan Lateral Tinggi (−30°)',
      axisNote: 'Melihat bagian samping-atas dinding ventrikel kiri',
      stageNotes: {
        1: 'Gelombang P positif kecil.',
        2: 'Segmen PR mendatar.',
        3: 'Gelombang R sedang diikuti s kecil karena posisi aVL hampir tegak lurus aksis utama.',
        4: 'Segmen ST datar dengan Gelombang T positif lembut.',
      },
      params: {
        pAmpMv: 0.05,
        pDurationMs: 90,
        prIntervalMs: 162,
        qAmpMv: -0.05,
        qDurationMs: 18,
        rAmpMv: 0.38,
        rDurationMs: 38,
        sAmpMv: -0.16,
        sDurationMs: 26,
        qrsDurationMs: 82,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: 0.12,
        tDurationMs: 155,
        qtIntervalMs: 380,
      },
    },
    aVF: {
      id: 'aVF',
      group: 'Augmented',
      viewLabel: 'Pandangan Inferior Bawah (+90°)',
      axisNote: 'Melihat bagian bawah jantung lurus dari arah kaki',
      stageNotes: {
        1: 'Gelombang P positif jelas mengikuti gerak turun impuls atrium.',
        2: 'Segmen PR mendatar selama jeda AV Node.',
        3: 'Gelombang R positif tinggi karena arus ventrikel bergerak kuat ke arah bawah.',
        4: 'Segmen ST datar dan Gelombang T positif searah R.',
      },
      params: {
        pAmpMv: 0.12,
        pDurationMs: 94,
        prIntervalMs: 162,
        qAmpMv: -0.04,
        qDurationMs: 18,
        rAmpMv: 0.88,
        rDurationMs: 42,
        sAmpMv: -0.06,
        sDurationMs: 20,
        qrsDurationMs: 82,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: 0.23,
        tDurationMs: 160,
        qtIntervalMs: 380,
      },
    },
    V1: {
      id: 'V1',
      group: 'Precordial',
      viewLabel: 'Dada Kanan Depan (Parasternal Kanan)',
      axisNote: 'Dekat atrium kanan dan sekat antar-ventrikel',
      stageNotes: {
        1: 'Gelombang P bifasik (naik lalu turun): awalnya mendekat di atrium kanan, lalu menjauh ke atrium kiri di belakang.',
        2: 'Segmen PR mendatar.',
        3: 'Pola rS khas: bukit r kecil saat sekat aktif mendekat ke kanan, disusul lembah S dalam saat arus utama pindah ke ventrikel kiri.',
        4: 'Segmen ST datar; Gelombang T datar atau sedikit negatif yang masih fisiologis di V1.',
      },
      params: {
        pAmpMv: 0.07,
        pTerminalAmpMv: -0.05,
        pDurationMs: 98,
        prIntervalMs: 162,
        qAmpMv: 0,
        rAmpMv: 0.24,
        rDurationMs: 24,
        sAmpMv: -1.04,
        sDurationMs: 54,
        qrsDurationMs: 82,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: -0.07,
        tDurationMs: 155,
        qtIntervalMs: 380,
      },
    },
    V2: {
      id: 'V2',
      group: 'Precordial',
      viewLabel: 'Sekat Depan (Parasternal Kiri)',
      axisNote: 'Tepat di depan sekat interventrikel',
      stageNotes: {
        1: 'Gelombang P positif kecil.',
        2: 'Segmen PR mendatar.',
        3: 'Gelombang r lebih tinggi dari V1 namun lembah S masih dominan karena tarikan ventrikel kiri ke belakang.',
        4: 'Segmen ST sangat landai diikuti Gelombang T positif tegas.',
      },
      params: {
        pAmpMv: 0.08,
        pDurationMs: 94,
        prIntervalMs: 162,
        qAmpMv: 0,
        rAmpMv: 0.42,
        rDurationMs: 28,
        sAmpMv: -1.18,
        sDurationMs: 52,
        qrsDurationMs: 84,
        stDeviationMv: 0.02,
        stMorphology: 'concave',
        tAmpMv: 0.32,
        tDurationMs: 165,
        qtIntervalMs: 382,
      },
    },
    V3: {
      id: 'V3',
      group: 'Precordial',
      viewLabel: 'Zona Transisi Depan',
      axisNote: 'Peralihan dari ventrikel kanan menuju ventrikel kiri',
      stageNotes: {
        1: 'Gelombang P positif.',
        2: 'Segmen PR mendatar.',
        3: 'Tinggi gelombang R dan kedalaman gelombang S tampak hampir berimbang (zona transisi normal).',
        4: 'Segmen ST datar-halus diikuti Gelombang T positif.',
      },
      params: {
        pAmpMv: 0.09,
        pDurationMs: 94,
        prIntervalMs: 162,
        qAmpMv: 0,
        rAmpMv: 0.82,
        rDurationMs: 36,
        sAmpMv: -0.84,
        sDurationMs: 46,
        qrsDurationMs: 84,
        stDeviationMv: 0.02,
        stMorphology: 'concave',
        tAmpMv: 0.38,
        tDurationMs: 168,
        qtIntervalMs: 382,
      },
    },
    V4: {
      id: 'V4',
      group: 'Precordial',
      viewLabel: 'Apeks Jantung (Midklavikula Kiri)',
      axisNote: 'Menghadap ujung bawah ventrikel kiri',
      stageNotes: {
        1: 'Gelombang P positif.',
        2: 'Segmen PR mendatar.',
        3: 'Gelombang R kini jauh lebih tinggi daripada gelombang S karena arus mendekati ujung jantung.',
        4: 'Segmen ST datar dan Gelombang T positif jelas.',
      },
      params: {
        pAmpMv: 0.1,
        pDurationMs: 94,
        prIntervalMs: 162,
        qAmpMv: -0.03,
        qDurationMs: 14,
        rAmpMv: 1.28,
        rDurationMs: 42,
        sAmpMv: -0.4,
        sDurationMs: 28,
        qrsDurationMs: 84,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: 0.4,
        tDurationMs: 168,
        qtIntervalMs: 382,
      },
    },
    V5: {
      id: 'V5',
      group: 'Precordial',
      viewLabel: 'Dinding Samping Kiri (Aksila Depan)',
      axisNote: 'Menghadap langsung massa otot tebal ventrikel kiri',
      stageNotes: {
        1: 'Gelombang P positif.',
        2: 'Segmen PR mendatar.',
        3: 'Diawali q kecil saat sekat aktif menjauh ke kanan, lalu gelombang R menjulang tinggi saat ventrikel kiri aktif mendekat.',
        4: 'Segmen ST datar diikuti Gelombang T positif searah QRS.',
      },
      params: {
        pAmpMv: 0.1,
        pDurationMs: 94,
        prIntervalMs: 162,
        qAmpMv: -0.07,
        qDurationMs: 18,
        rAmpMv: 1.38,
        rDurationMs: 44,
        sAmpMv: -0.12,
        sDurationMs: 22,
        qrsDurationMs: 84,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: 0.35,
        tDurationMs: 165,
        qtIntervalMs: 382,
      },
    },
    V6: {
      id: 'V6',
      group: 'Precordial',
      viewLabel: 'Samping Kiri Murni (Midaksila Kiri)',
      axisNote: 'Kebalikan langsung dari sudut pandang V1',
      stageNotes: {
        1: 'Gelombang P positif halus.',
        2: 'Segmen PR mendatar.',
        3: 'Pola qR bersih: q sempit tanda aktivasi sekat ke kanan, diikuti gelombang R tinggi tanpa S.',
        4: 'Segmen ST datar dan Gelombang T positif.',
      },
      params: {
        pAmpMv: 0.09,
        pDurationMs: 92,
        prIntervalMs: 162,
        qAmpMv: -0.08,
        qDurationMs: 20,
        rAmpMv: 1.16,
        rDurationMs: 48,
        sAmpMv: 0,
        qrsDurationMs: 82,
        stDeviationMv: 0,
        stMorphology: 'flat',
        tAmpMv: 0.28,
        tDurationMs: 162,
        qtIntervalMs: 380,
      },
    },
  },
};

type LeadOverrideMap = Partial<
  Record<
    LeadId,
    {
      params?: Partial<LeadWaveParams>;
      stageNotes?: Partial<Record<StageId, string>>;
    }
  >
>;

/**
 * Helper modular untuk menurunkan seluruh 12-lead kondisi patofisiologis dari baseline normal,
 * sehingga perubahan lead mana pun tetap lengkap dan akurat saat pengguna berpindah perspektif.
 */
function buildDerivedLeads(
  overrides: LeadOverrideMap,
  globalParamPatch?: Partial<LeadWaveParams>,
  globalStageNotes?: Partial<Record<StageId, string>>,
): Record<LeadId, LeadPerspective> {
  const result = {} as Record<LeadId, LeadPerspective>;

  for (const leadId of ALL_LEAD_IDS) {
    const baseLead = NORMAL_SINUS_CONDITION.leads[leadId];
    const leadPatch = overrides[leadId];

    result[leadId] = {
      ...baseLead,
      params: {
        ...baseLead.params,
        ...(globalParamPatch ?? {}),
        ...(leadPatch?.params ?? {}),
      },
      stageNotes: {
        ...baseLead.stageNotes,
        ...(globalStageNotes ?? {}),
        ...(leadPatch?.stageNotes ?? {}),
      },
    };
  }

  return result;
}


const P_PULMONALE_CONDITION: EcgCondition = {
  id: 'p-pulmonale',
  domainId: 'kelainan-aksis-ruang',
  domainName: 'Kelainan Aksis & Pembesaran Ruang Jantung',
  name: 'Pembesaran Atrium Kanan (P Pulmonale)',
  noteReferencePath: 'src/notes/1.1 P Pulmonale.md',
  heartRateBpm: 75,
  defaultLead: 'II',
  hypertrophyZone: 'right-atrium',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      activeParts: ['sa-node', 'right-atrium', 'left-atrium'],
      vectors: [
        {
          id: 'vec-rae-dominant',
          label: 'Vektor Atrium Kanan Membesar (+60° s/d +75°)',
          x1: 212,
          y1: 112,
          x2: 274,
          y2: 184,
          color: '#2563eb',
        },
      ],
      heartStatusCaption:
        'Atrium kanan yang menebal dan berdilatasi menghasilkan vektor depolarisasi besar ke arah inferior-anterior (+60° s/d +75°).',
      whatHappensInHeart:
        'SA Node melepaskan impuls yang mendepolarisasi miokardium atrium kanan yang menebal/berdilatasi dengan massa seluler lebih besar, lalu disusul depolarisasi normal atrium kiri.',
      whyEcgLooksLikeThis:
        'Voltase atrium kanan melonjak lurus ke arah Lead II sehingga puncak gelombang P melesat tinggi dan lancip (≥ 2,5 mm), namun turun tepat waktu dengan durasi total tetap normal (<0,12 detik).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls tiba di AV Node dan mengalami jeda fisiologis normal sebelum masuk ke berkas His.',
      whatHappensInHeart:
        'Setelah kedua atrium selesai terdepolarisasi, impuls listrik melintas dan mengalami perlambatan fisiologis normal di AV junction sebelum diteruskan ke berkas His.',
      whyEcgLooksLikeThis:
        'Tidak ada perbedaan voltase permukaan yang terdeteksi selama jeda nodus AV, sehingga segmen PR tetap mendatar isoelektrik dengan interval PR normal (0,12–0,20 detik).',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Sistem His-Purkinje mengaktivasi septum dan kedua ventrikel secara cepat dan sinkron.',
      whatHappensInHeart:
        'Impuls meluncur cepat lewat berkas His, RBB, LBB, dan serabut Purkinje, mengaktivasi septum dari kiri ke kanan lalu dinding bebas kedua ventrikel secara serempak.',
      whyEcgLooksLikeThis:
        'Terbentuk kompleks QRS berdurasi sempit normal (<0,10 detik) dengan defleksi R dominan positif di Lead II karena aktivitas ventrikel kiri tidak terganggu pada RAE murni.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Fase plateau (ST) dan repolarisasi ventrikel (Gel. T) berlangsung normal.',
      whatHappensInHeart:
        'Seluruh miosit ventrikel bertahan seragam di fase plateau, kemudian mengalami repolarisasi normal dari lapisan luar (epikardium) ke dalam (endokardium).',
      whyEcgLooksLikeThis:
        'Segmen ST tetap datar pada garis isoelektrik, diikuti gelombang T halus positif yang searah (konkordan) dengan kompleks QRS di Lead II.',
    },
  },
  leads: buildDerivedLeads({
    I: {
      params: { pAmpMv: 0.14, pDurationMs: 96, pSharpness: 'peaked' },
      stageNotes: {
        1: 'Gelombang P sedikit meninggi dan lebih lancip namun perubahan paling mencolok tetap di lead inferior (II, III, aVF).',
      },
    },
    II: {
      params: { pAmpMv: 0.32, pDurationMs: 100, pSharpness: 'peaked' },
      stageNotes: {
        1: 'P Pulmonale klasik: gelombang P tinggi lancip (+0,32 mV ≥ 2,5 mm) dengan durasi tetap normal (<0,12 detik) dibanding kurva acuan normal.',
      },
    },
    III: {
      params: { pAmpMv: 0.25, pDurationMs: 98, pSharpness: 'peaked' },
      stageNotes: {
        1: 'Gelombang P meninggi tajam (+0,25 mV) mengikuti vektor atrium kanan yang lebih vertikal ke arah inferior.',
      },
    },
    aVR: {
      params: { pAmpMv: -0.24, pDurationMs: 98, pSharpness: 'peaked' },
      stageNotes: {
        1: 'Gelombang P negatif lebih dalam dan lancip di aVR karena vektor atrium kanan yang besar bergerak menjauhi bahu kanan.',
      },
    },
    aVL: {
      params: { pAmpMv: 0.04, pDurationMs: 92 },
      stageNotes: {
        1: 'Gelombang P tetap kecil di aVL karena aksis vertikal atrium kanan hampir tegak lurus terhadap sudut −30°.',
      },
    },
    aVF: {
      params: { pAmpMv: 0.28, pDurationMs: 98, pSharpness: 'peaked' },
      stageNotes: {
        1: 'Gelombang P tinggi lancip (+0,28 mV ≥ 2,5 mm) mengonfirmasi pembesaran atrium kanan di aksis inferior.',
      },
    },
    V1: {
      params: {
        pAmpMv: 0.2,
        pTerminalAmpMv: -0.05,
        pDurationMs: 102,
        pSharpness: 'peaked',
      },
      stageNotes: {
        1: 'Komponen positif awal P di V1 melonjak (>1,5 mm / +0,20 mV) mencerminkan atrium kanan anterior yang membesar, diikuti komponen negatif akhir normal.',
      },
    },
    V2: {
      params: { pAmpMv: 0.16, pDurationMs: 98, pSharpness: 'peaked' },
      stageNotes: {
        1: 'Gelombang P meninggi di prekordial kanan akibat proyeksi vektor atrium kanan ke arah anterior.',
      },
    },
    V3: {
      params: { pAmpMv: 0.13, pDurationMs: 96, pSharpness: 'peaked' },
    },
    V4: {
      params: { pAmpMv: 0.12, pDurationMs: 96 },
    },
    V5: {
      params: { pAmpMv: 0.11, pDurationMs: 96 },
    },
    V6: {
      params: { pAmpMv: 0.1, pDurationMs: 94 },
    },
  }),
};

const P_MITRALE_CONDITION: EcgCondition = {
  id: 'p-mitrale',
  domainId: 'kelainan-aksis-ruang',
  domainName: 'Kelainan Aksis & Pembesaran Ruang Jantung',
  name: 'Pembesaran Atrium Kiri (P Mitrale)',
  noteReferencePath: 'src/notes/1.2 P Mitrale.md',
  heartRateBpm: 75,
  defaultLead: 'V1',
  hypertrophyZone: 'left-atrium',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      activeParts: ['sa-node', 'right-atrium', 'left-atrium'],
      vectors: [
        {
          id: 'vec-lae-terminal',
          label: 'Vektor Terminal Atrium Kiri (Posterior-Kiri)',
          x1: 266,
          y1: 118,
          x2: 358,
          y2: 148,
          color: '#2563eb',
        },
      ],
      heartStatusCaption:
        'Atrium kiri yang berdilatasi dan melambat menggeser vektor terminal ke posterior-kiri menjauhi V1.',
      whatHappensInHeart:
        'SA Node mendepolarisasi atrium kanan secara normal, lalu gelombang listrik menyeberang lebih lambat melalui jalur interatrial yang memanjang pada atrium kiri yang membesar ke arah posterior-kiri.',
      whyEcgLooksLikeThis:
        'Di Lead V1, defleksi positif awal kecil disusul gelombang negatif terminal yang lebar (>0,04 dtk) dan dalam (≥1 mm) saat arus menjauh ke belakang. Di Lead II, gelombang P melebar (≥0,12 dtk) dan berlekuk ganda seperti huruf "M" (P mitrale).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melintasi AV Node dengan jeda fisiologis normal sebelum menuju berkas His.',
      whatHappensInHeart:
        'Setelah aktivasi atrium kiri selesai, impuls listrik masuk ke AV junction dan mengalami perlambatan fisiologis normal sebelum diteruskan ke berkas His.',
      whyEcgLooksLikeThis:
        'Tidak ada beda potensial permukaan yang terukur selama jeda nodus AV, sehingga segmen PR tampak datar isoelektrik dengan interval PR tetap proporsional.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Aktivasi ventrikel melalui His-Purkinje berlangsung cepat dan normal.',
      whatHappensInHeart:
        'Impuls menyebar cepat lewat berkas His, cabang berkas kanan-kiri, dan serabut Purkinje untuk mengaktivasi septum dari kiri ke kanan lalu kedua ventrikel serempak.',
      whyEcgLooksLikeThis:
        'Kompleks QRS tetap berdurasi sempit normal (<0,10 detik) dengan pola rS normal di Lead V1 karena depolarisasi ventrikel tidak terganggu pada LAE murni.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Fase plateau (ST) dan repolarisasi ventrikel (Gel. T) berlangsung normal pada LAE terisolasi.',
      whatHappensInHeart:
        'Seluruh miosit ventrikel bertahan seragam di fase plateau lalu memulihkan muatan dari epikardium ke endokardium.',
      whyEcgLooksLikeThis:
        'Segmen ST datar di garis isoelektrik diikuti gelombang T normal (di V1 gelombang T normalnya datar atau negatif dangkal).',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: { pAmpMv: 0.14, pDurationMs: 128, pNotched: true },
        stageNotes: {
          1: 'Gelombang P melebar (≥0,12 detik) dengan puncak ganda halus (P mitrale) akibat aktivasi atrium kiri yang tertunda.',
        },
      },
      II: {
        params: { pAmpMv: 0.18, pDurationMs: 132, pNotched: true },
        stageNotes: {
          1: 'P Mitrale klasik di Lead II: durasi P melebar (0,13 detik ≥ 0,12 detik) dan berlekuk ganda menyerupai huruf "M" dibanding kurva acuan normal.',
        },
      },
      III: {
        params: { pAmpMv: 0.08, pDurationMs: 126, pNotched: true },
      },
      aVR: {
        params: { pAmpMv: -0.14, pDurationMs: 128 },
      },
      aVL: {
        params: { pAmpMv: 0.08, pDurationMs: 124, pNotched: true },
      },
      aVF: {
        params: { pAmpMv: 0.13, pDurationMs: 126, pNotched: true },
      },
      V1: {
        params: {
          pAmpMv: 0.07,
          pTerminalAmpMv: -0.15,
          pInitialRatio: 0.36,
          pDurationMs: 132,
        },
        stageNotes: {
          1: 'Temuan paling sensitif di V1: komponen negatif terminal P melebar (>0,04 dtk) dan dalam (−0,15 mV ≥ 1 mm) saat vektor atrium kiri menjauh ke posterior.',
        },
      },
      V2: {
        params: { pAmpMv: 0.09, pDurationMs: 126 },
      },
      V3: {
        params: { pAmpMv: 0.1, pDurationMs: 126 },
      },
      V4: {
        params: { pAmpMv: 0.11, pDurationMs: 128, pNotched: true },
      },
      V5: {
        params: { pAmpMv: 0.11, pDurationMs: 128, pNotched: true },
      },
      V6: {
        params: { pAmpMv: 0.1, pDurationMs: 126, pNotched: true },
      },
    },
    { prIntervalMs: 176 },
  ),
};

const LVH_CONDITION: EcgCondition = {
  id: 'lvh',
  domainId: 'kelainan-aksis-ruang',
  domainName: 'Kelainan Aksis & Pembesaran Ruang Jantung',
  name: 'Hipertrofi Ventrikel Kiri (LVH)',
  noteReferencePath: 'src/notes/1.3 LVH.md',
  heartRateBpm: 75,
  defaultLead: 'V1',
  hypertrophyZone: 'left-ventricle',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'Depolarisasi atrium berjalan normal, namun tekanan diastolik LV sering membebani atrium kiri.',
      whatHappensInHeart:
        'SA Node memicu depolarisasi atrium secara normal; bila ventrikel kiri yang kaku meneruskan tekanan ke atrium kiri, aktivasi atrium kiri sedikit tertunda.',
      whyEcgLooksLikeThis:
        'Gelombang P dapat tampak normal atau menunjukkan komponen negatif terminal sedikit lebih dalam/lebar di Lead V1 sebagai cerminan regangan atrium kiri penyerta.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan kecepatan fisiologis normal.',
      whatHappensInHeart:
        'Konduksi listrik melalui AV junction menuju Bundle of His berlangsung normal tanpa hambatan.',
      whyEcgLooksLikeThis:
        'Segmen PR tampak datar isoelektrik dengan interval PR tetap normal (0,12–0,20 detik).',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      vectors: [
        {
          id: 'vec-lvh-septal',
          label: '1. Vektor Septum',
          x1: 288,
          y1: 254,
          x2: 250,
          y2: 242,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-lvh-dominant',
          label: '2. Vektor LV Sangat Kuat (Kiri-Posterior-Kranial)',
          x1: 274,
          y1: 244,
          x2: 364,
          y2: 326,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Massa dinding ventrikel kiri yang menebal hebat menghasilkan vektor depolarisasi sangat kuat ke arah kiri-posterior.',
      whatHappensInHeart:
        'Setelah septum aktif normal dari kiri ke kanan, massa otot ventrikel kiri yang menebal jauh lebih banyak terdepolarisasi sehingga gaya listrik resultan tertarik kuat ke belakang dan kiri.',
      whyEcgLooksLikeThis:
        'Di Lead V1 terbentuk r septal kecil disusul gelombang S sangat dalam (−1,95 mV) menjauhi elektroda; di Lead V5–V6 gelombang R menjulang tinggi (+2,02 mV) dengan durasi QRS di batas atas (0,11 detik).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Tekanan dan ketebalan dinding LV membalik urutan repolarisasi menjadi dari dalam ke luar (LV Strain).',
      whatHappensInHeart:
        'Beban tekanan tinggi dan penebalan miosit membalikkan pemulihan listrik ventrikel kiri sehingga berjalan dari endokardium ke epikardium (kebalikan dari fisiologi normal).',
      whyEcgLooksLikeThis:
        'Muncul diskordansi repolarisasi sekunder: di V1–V2 tampak elevasi ST konkaf sekunder dengan T tegak, sedangkan di lead lateral (V5–V6, I, aVL) tampak depresi ST landai dan inversi T (pola LV strain).',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          rAmpMv: 1.48,
          sAmpMv: 0,
          stDeviationMv: -0.12,
          stMorphology: 'downsloping',
          tAmpMv: -0.22,
        },
        stageNotes: {
          3: 'Gelombang R tinggi (+1,48 mV) akibat pergeseran vektor dan aksis ke kiri.',
          4: 'Depresi ST landai dan inversi gelombang T (LV strain) di lateral tinggi.',
        },
      },
      II: {
        params: { rAmpMv: 0.88, sAmpMv: -0.22 },
      },
      III: {
        params: { rAmpMv: 0.22, sAmpMv: -0.68 },
      },
      aVL: {
        params: {
          rAmpMv: 1.26,
          sAmpMv: 0,
          stDeviationMv: -0.12,
          stMorphology: 'downsloping',
          tAmpMv: -0.2,
        },
        stageNotes: {
          3: 'Amplitudo R di aVL meningkat (+1,26 mV ≥ 11–13 mm) sesuai arah aksis yang bergeser ke kiri.',
          4: 'Pola LV strain dengan depresi ST asimetris dan inversi T.',
        },
      },
      aVF: {
        params: { rAmpMv: 0.36, sAmpMv: -0.44 },
      },
      V1: {
        params: {
          pAmpMv: 0.07,
          pTerminalAmpMv: -0.12,
          pInitialRatio: 0.4,
          pDurationMs: 118,
          rAmpMv: 0.16,
          rDurationMs: 20,
          sAmpMv: -1.95,
          sDurationMs: 76,
          stDeviationMv: 0.14,
          stMorphology: 'concave',
          tAmpMv: 0.34,
        },
        stageNotes: {
          1: 'Komponen negatif terminal P di V1 tampak sedikit lebih dalam (−0,12 mV) akibat beban tekanan atrium kiri penyerta.',
          3: 'Gelombang r septal kecil diikuti gelombang S sangat dalam (−1,95 mV) dibanding acuan normal saat vektor LV menjauh ke posterior-kiri.',
          4: 'Elevasi ST konkaf sekunder dan gelombang T tegak positif (cermin resiprokal dari LV strain, bukan STEMI anterior).',
        },
      },
      V2: {
        params: {
          rAmpMv: 0.24,
          rDurationMs: 22,
          sAmpMv: -2.02,
          sDurationMs: 76,
          stDeviationMv: 0.16,
          stMorphology: 'concave',
          tAmpMv: 0.42,
        },
        stageNotes: {
          3: 'Gelombang S sangat dalam (−2,02 mV) mencerminkan tarikan kuat massa ventrikel kiri.',
          4: 'Elevasi ST sekunder konkaf dengan gelombang T tegak.',
        },
      },
      V3: {
        params: { rAmpMv: 0.62, sAmpMv: -1.65 },
      },
      V4: {
        params: {
          rAmpMv: 1.56,
          sAmpMv: -0.52,
          stDeviationMv: -0.08,
          stMorphology: 'downsloping',
          tAmpMv: -0.12,
        },
      },
      V5: {
        params: {
          qAmpMv: -0.08,
          rAmpMv: 2.02,
          rDurationMs: 56,
          sAmpMv: -0.08,
          stDeviationMv: -0.18,
          stMorphology: 'downsloping',
          tAmpMv: -0.32,
        },
        stageNotes: {
          3: 'Gelombang R menjulang tinggi (+2,02 mV; Sokolow-Lyon S_V1 + R_V5 ≈ 40 mm ≥ 35 mm) dengan puncak R agak melambat.',
          4: 'Pola LV strain klasik: depresi ST landai ke bawah diikuti inversi gelombang T asimetris.',
        },
      },
      V6: {
        params: {
          qAmpMv: -0.09,
          rAmpMv: 1.82,
          rDurationMs: 56,
          sAmpMv: 0,
          stDeviationMv: -0.16,
          stMorphology: 'downsloping',
          tAmpMv: -0.28,
        },
        stageNotes: {
          3: 'Gelombang R tinggi (+1,82 mV) mencerminkan penebalan dinding lateral ventrikel kiri.',
          4: 'Depresi ST landai dan inversi gelombang T asimetris.',
        },
      },
    },
    { qrsDurationMs: 106 },
  ),
};

const RVH_CONDITION: EcgCondition = {
  id: 'rvh',
  domainId: 'kelainan-aksis-ruang',
  domainName: 'Kelainan Aksis & Pembesaran Ruang Jantung',
  name: 'Hipertrofi Ventrikel Kanan (RVH)',
  noteReferencePath: 'src/notes/1.4 RVH.md',
  heartRateBpm: 75,
  defaultLead: 'V1',
  hypertrophyZone: 'right-ventricle',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'Atrium kanan sering ikut terbebani secara retrograd sehingga menghasilkan defleksi awal lebih kuat.',
      whatHappensInHeart:
        'SA Node memicu depolarisasi atrium; bila tekanan tinggi ventrikel kanan menular ke atrium kanan, massa atrium kanan yang membesar menghasilkan voltase awal lebih besar.',
      whyEcgLooksLikeThis:
        'Gelombang P dapat tampak normal atau menunjukkan gambaran P pulmonale (defleksi positif lebih menonjol di V1 dan tinggi lancip ≥ 2,5 mm di Lead II).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan perlambatan fisiologis normal.',
      whatHappensInHeart:
        'Konduksi listrik melalui AV junction menuju percabangan berkas berjalan normal tanpa hambatan tambahan.',
      whyEcgLooksLikeThis:
        'Segmen PR tetap mendatar isoelektrik dengan interval PR normal (0,12–0,20 detik).',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      vectors: [
        {
          id: 'vec-rvh-dominant',
          label: 'Vektor RV Dominan (Anterior-Kanan-Inferior)',
          x1: 274,
          y1: 244,
          x2: 204,
          y2: 302,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Dinding ventrikel kanan yang menebal membelokkan vektor depolarisasi utama ke arah anterior dan kanan.',
      whatHappensInHeart:
        'Massa miokardium ventrikel kanan yang hipertrofi menghasilkan gaya listrik masif yang mengimbangi lalu melampaui ventrikel kiri, menarik resultan vektor ke kanan, depan, dan bawah.',
      whyEcgLooksLikeThis:
        'Di Lead V1 terbentuk gelombang R tinggi abnormal (rasio R/S ≥ 1 atau R ≥ 7 mm) menggantikan S dalam normal, disertai deviasi aksis ke kanan (RAD) dan gelombang S dalam persisten di V5–V6/I.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Beban tekanan sistolik membalik arah pemulihan listrik pada ventrikel kanan (RV Strain).',
      whatHappensInHeart:
        'Tekanan tinggi dan hipertrofi miosit ventrikel kanan memicu repolarisasi abnormal berjalan dari lapisan dalam (endokardium) ke lapisan luar (epikardium).',
      whyEcgLooksLikeThis:
        'Muncul diskordansi repolarisasi sekunder di V1–V3 (dan lead inferior) berupa depresi segmen ST landai ke bawah serta inversi gelombang T asimetris (pola RV strain).',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: { rAmpMv: 0.28, sAmpMv: -0.62 },
        stageNotes: {
          3: 'Gelombang S lebih dalam daripada R (rasio R/S < 1) menandakan deviasi aksis ke kanan (RAD).',
        },
      },
      II: {
        params: {
          pAmpMv: 0.27,
          pDurationMs: 100,
          pSharpness: 'peaked',
          rAmpMv: 1.02,
          sAmpMv: -0.12,
          stDeviationMv: -0.08,
          stMorphology: 'downsloping',
          tAmpMv: -0.14,
        },
        stageNotes: {
          1: 'Gelombang P meninggi lancip (+0,27 mV ≥ 2,5 mm) bila disertai pembesaran atrium kanan.',
          4: 'Depresi ST ringan dan inversi T dapat muncul di lead inferior sebagai perluasan RV strain.',
        },
      },
      III: {
        params: {
          pAmpMv: 0.22,
          pDurationMs: 98,
          pSharpness: 'peaked',
          rAmpMv: 1.18,
          sAmpMv: 0,
          stDeviationMv: -0.1,
          stMorphology: 'downsloping',
          tAmpMv: -0.16,
        },
        stageNotes: {
          3: 'Gelombang R tinggi dominan (+1,18 mV) di Lead III sesuai pergeseran aksis ke kanan (RAD).',
        },
      },
      aVR: {
        params: {
          pAmpMv: -0.2,
          pDurationMs: 98,
          pSharpness: 'peaked',
          qAmpMv: -0.34,
          rAmpMv: 0.36,
          sAmpMv: -0.22,
        },
      },
      aVL: {
        params: { rAmpMv: 0.14, sAmpMv: -0.58 },
      },
      aVF: {
        params: {
          pAmpMv: 0.24,
          pDurationMs: 98,
          pSharpness: 'peaked',
          rAmpMv: 1.12,
          sAmpMv: -0.06,
          stDeviationMv: -0.09,
          stMorphology: 'downsloping',
          tAmpMv: -0.15,
        },
      },
      V1: {
        params: {
          pAmpMv: 0.18,
          pTerminalAmpMv: -0.05,
          pInitialRatio: 0.54,
          pDurationMs: 100,
          pSharpness: 'peaked',
          qAmpMv: 0,
          rAmpMv: 1.08,
          rDurationMs: 52,
          sAmpMv: -0.22,
          sDurationMs: 28,
          stDeviationMv: -0.14,
          stMorphology: 'downsloping',
          tAmpMv: -0.26,
        },
        stageNotes: {
          1: 'Defleksi positif awal P di V1 menonjol (+0,18 mV) mencerminkan beban atrium kanan penyerta.',
          3: 'Pembalikan rasio V1: gelombang R tinggi (+1,08 mV ≥ 7 mm; rasio R/S > 1) menggantikan pola rS normal akibat dominasi vektor RV ke anterior-kanan.',
          4: 'Pola RV strain klasik di V1: depresi segmen ST landai ke bawah dan inversi gelombang T asimetris.',
        },
      },
      V2: {
        params: {
          pAmpMv: 0.15,
          pDurationMs: 98,
          pSharpness: 'peaked',
          rAmpMv: 0.96,
          rDurationMs: 48,
          sAmpMv: -0.42,
          sDurationMs: 36,
          stDeviationMv: -0.12,
          stMorphology: 'downsloping',
          tAmpMv: -0.24,
        },
        stageNotes: {
          3: 'Gelombang R tetap dominan tinggi (R > S) di prekordial kanan V2.',
          4: 'Depresi ST landai dan inversi gelombang T asimetris (RV strain).',
        },
      },
      V3: {
        params: {
          rAmpMv: 0.76,
          sAmpMv: -0.78,
          stDeviationMv: -0.08,
          stMorphology: 'downsloping',
          tAmpMv: -0.18,
        },
      },
      V4: {
        params: { rAmpMv: 0.78, sAmpMv: -0.76 },
      },
      V5: {
        params: { rAmpMv: 0.62, sAmpMv: -0.74 },
        stageNotes: {
          3: 'Gelombang S tetap dalam dan persisten di lead lateral (hilangnya progresi R normal).',
        },
      },
      V6: {
        params: { qAmpMv: -0.04, rAmpMv: 0.54, sAmpMv: -0.68 },
        stageNotes: {
          3: 'Rasio S/R > 1 di V6 (−0,68 vs +0,54 mV) karena gaya ventrikel kanan menarik vektor menjauhi sisi kiri.',
        },
      },
    },
    { qrsDurationMs: 92 },
  ),
};

const LAD_CONDITION: EcgCondition = {
  id: 'lad',
  domainId: 'kelainan-aksis-ruang',
  domainName: 'Kelainan Aksis & Pembesaran Ruang Jantung',
  name: 'Left Axis Deviation (LAD)',
  noteReferencePath: 'src/notes/1.5 LAD.md',
  heartRateBpm: 75,
  defaultLead: 'I',
  blockedTarget: 'left-anterior-fascicle',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu impuls yang menyebar normal melintasi atrium kanan dan kiri.',
      whatHappensInHeart:
        'Depolarisasi atrium berjalan normal dari nodus SA ke arah inferior-anterior melintasi kedua atrium tanpa gangguan.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P positif halus yang normal di Lead I, II, dan aVF dengan durasi dan amplitudo fisiologis.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan perlambatan fisiologis normal.',
      whatHappensInHeart:
        'Impuls listrik mengalami jeda normal di AV junction sebelum memasuki sistem trifasikular ventrikel.',
      whyEcgLooksLikeThis:
        'Tidak ada gradien potensial di permukaan tubuh sehingga segmen PR tampak datar isoelektrik (interval PR 0,12–0,20 detik).',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      vectors: [
        {
          id: 'vec-lad-initial',
          label: '1. Awal ke Inferior (Fasikel Posterior)',
          x1: 280,
          y1: 246,
          x2: 298,
          y2: 296,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-lad-superior',
          label: '2. Resultan Utama ke Kiri-Atas (−30° s/d −90°)',
          x1: 282,
          y1: 266,
          x2: 360,
          y2: 214,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Aktivasi awal turun lewat fasikel posterior, lalu resultan gaya listrik tertarik kuat ke kiri-atas (superior).',
      whatHappensInHeart:
        'Ventrikel awalnya teraktivasi ke inferior melalui fasikel posterior, lalu dinding superior-anterolateral ventrikel kiri mendominasi (atau teraktivasi belakangan akibat hambatan fasikel anterior) sehingga vektor rata-rata berotasi ke kiri-atas (−30° hingga −90°).',
      whyEcgLooksLikeThis:
        'Di Lead I (0°) dan aVL (−30°), arus yang mendekat sejajar menghasilkan gelombang R tinggi (pola qR sempit); sebaliknya di Lead II, III, dan aVF arus menjauh ke atas membentuk pola rS dengan S lebih dalam daripada r (S > r).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Fase plateau (ST) dan repolarisasi ventrikel (Gel. T) berlangsung normal pada LAD terisolasi.',
      whatHappensInHeart:
        'Miokardium ventrikel menyelesaikan fase plateau secara seragam lalu berepolarisasi normal dari epikardium ke endokardium.',
      whyEcgLooksLikeThis:
        'Segmen ST kembali datar pada garis isoelektrik, diikuti gelombang T positif halus yang konkordan dengan gelombang R di Lead I.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          qAmpMv: -0.08,
          qDurationMs: 18,
          rAmpMv: 1.24,
          rDurationMs: 46,
          sAmpMv: 0,
          tAmpMv: 0.28,
        },
        stageNotes: {
          1: 'Gelombang P positif halus normal di Lead I.',
          3: 'Pola qR sempit dengan gelombang R dominan tinggi (+1,24 mV) karena vektor utama berotasi ke kiri-atas sejajar Lead I (0°).',
          4: 'Segmen ST isoelektrik dan gelombang T positif konkordan pada LAD terisolasi.',
        },
      },
      II: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.24,
          rDurationMs: 22,
          sAmpMv: -0.82,
          sDurationMs: 56,
        },
        stageNotes: {
          3: 'Pola rS klasik di Lead II (S −0,82 mV jauh lebih dalam daripada r +0,24 mV) menandakan aksis bergeser ke ≤ −30°.',
        },
      },
      III: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.14,
          rDurationMs: 18,
          sAmpMv: -1.16,
          sDurationMs: 60,
        },
        stageNotes: {
          3: 'Gelombang S sangat dalam (−1,16 mV) di Lead III karena vektor ventrikel bergerak menjauhi kuadran inferior kanan.',
        },
      },
      aVR: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.22,
          rDurationMs: 24,
          sAmpMv: -0.78,
          sDurationMs: 52,
        },
      },
      aVL: {
        params: {
          qAmpMv: -0.09,
          qDurationMs: 18,
          rAmpMv: 1.18,
          rDurationMs: 46,
          sAmpMv: 0,
          tAmpMv: 0.26,
        },
        stageNotes: {
          3: 'Gelombang R tinggi (+1,18 mV, pola qR) di aVL (−30°) karena vektor superior-kiri mengarah langsung ke elektroda ini.',
        },
      },
      aVF: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.18,
          rDurationMs: 20,
          sAmpMv: -0.96,
          sDurationMs: 58,
        },
        stageNotes: {
          3: 'Pola rS dominan negatif (−0,96 mV) di aVF (+90°) mengonfirmasi deviasi aksis ke atas (LAD).',
        },
      },
      V5: {
        params: { sAmpMv: -0.22, sDurationMs: 26 },
      },
      V6: {
        params: { sAmpMv: -0.2, sDurationMs: 24 },
      },
    },
    { qrsDurationMs: 92 },
  ),
};

const RAD_CONDITION: EcgCondition = {
  id: 'rad',
  domainId: 'kelainan-aksis-ruang',
  domainName: 'Kelainan Aksis & Pembesaran Ruang Jantung',
  name: 'Right Axis Deviation (RAD)',
  noteReferencePath: 'src/notes/1.6 RAD.md',
  heartRateBpm: 75,
  defaultLead: 'I',
  blockedTarget: 'left-posterior-fascicle',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu impuls yang menyebar normal melintasi atrium kanan dan kiri.',
      whatHappensInHeart:
        'Depolarisasi atrium berjalan normal dari SA Node ke arah inferior-anterior melintasi dinding kedua atrium.',
      whyEcgLooksLikeThis:
        'Di Lead I (0°), depolarisasi atrium menghasilkan gelombang P positif kecil yang normal dengan interval PR fisiologis.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan perlambatan fisiologis normal.',
      whatHappensInHeart:
        'Gelombang listrik melalui AV junction dan berkas His dengan jeda fisiologis normal sebelum menuju cabang ventrikel.',
      whyEcgLooksLikeThis:
        'Tidak ada perbedaan voltase netto di permukaan tubuh sehingga tercatat garis datar isoelektrik pada segmen PR.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      vectors: [
        {
          id: 'vec-rad-initial',
          label: '1. Awal ke Kiri-Atas (Fasikel Anterior)',
          x1: 280,
          y1: 244,
          x2: 332,
          y2: 228,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-rad-main',
          label: '2. Resultan Utama ke Kanan-Bawah (+100° s/d +120°)',
          x1: 274,
          y1: 250,
          x2: 214,
          y2: 326,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Aktivasi awal mengarah ke kiri-atas lalu resultan gaya listrik tertarik ke kanan dan inferior (+100° s/d +120°).',
      whatHappensInHeart:
        'Impuls awal menyebar ke superior-kiri via fasikel anterior, lalu disusul depolarisasi dominan ventrikel kanan atau dinding inferior-posterior yang menarik resultan vektor ke kanan dan bawah.',
      whyEcgLooksLikeThis:
        'Di Lead I (0°) dan aVL, arus yang menjauh ke kanan membentuk pola rS dengan S jauh lebih dalam daripada r (S > r); di Lead III (+120°) dan aVF, arus mengarah langsung membentuk gelombang R tinggi dengan R III > R II.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Fase plateau (ST) dan repolarisasi ventrikel (Gel. T) berlangsung normal pada RAD terisolasi.',
      whatHappensInHeart:
        'Seluruh miokardium ventrikel menyelesaikan fase depolarisasi penuh lalu menjalani repolarisasi fisiologis normal.',
      whyEcgLooksLikeThis:
        'Segmen ST datar di garis isoelektrik diikuti gelombang T tegak di lead inferior, sementara di Lead I gelombang T mendatar atau positif rendah.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.24,
          rDurationMs: 22,
          sAmpMv: -0.92,
          sDurationMs: 56,
          tAmpMv: 0.08,
        },
        stageNotes: {
          1: 'Gelombang P positif kecil yang normal di Lead I.',
          3: 'Pembalikan defleksi Lead I: r kecil (+0,24 mV) diikuti gelombang S dalam (−0,92 mV, pola rS dengan S > r) akibat vektor bergeser ke kanan.',
          4: 'Segmen ST isoelektrik dan gelombang T positif rendah/datar pada RAD terisolasi.',
        },
      },
      II: {
        params: {
          qAmpMv: -0.04,
          rAmpMv: 0.98,
          rDurationMs: 46,
          sAmpMv: -0.08,
          tAmpMv: 0.24,
        },
        stageNotes: {
          3: 'Gelombang R positif tegas (+0,98 mV) di Lead II, namun tingginya masih di bawah gelombang R di Lead III.',
        },
      },
      III: {
        params: {
          qAmpMv: -0.08,
          qDurationMs: 18,
          rAmpMv: 1.38,
          rDurationMs: 48,
          sAmpMv: 0,
          tAmpMv: 0.26,
        },
        stageNotes: {
          3: 'Ciri khas RAD: gelombang R di Lead III (+1,38 mV) menjulang lebih tinggi daripada Lead II (R III > R II).',
        },
      },
      aVR: {
        params: {
          qAmpMv: -0.32,
          rAmpMv: 0.36,
          sAmpMv: -0.24,
        },
      },
      aVL: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.16,
          rDurationMs: 18,
          sAmpMv: -1.04,
          sDurationMs: 58,
          tAmpMv: 0.06,
        },
        stageNotes: {
          3: 'Pola rS dominan negatif (−1,04 mV) di aVL karena vektor menjauh dari bahu kiri.',
        },
      },
      aVF: {
        params: {
          qAmpMv: -0.06,
          qDurationMs: 16,
          rAmpMv: 1.18,
          rDurationMs: 46,
          sAmpMv: 0,
          tAmpMv: 0.24,
        },
        stageNotes: {
          3: 'Gelombang R tinggi (+1,18 mV) di aVF mengonfirmasi aksis mengarah kuat ke inferior-kanan.',
        },
      },
      V5: {
        params: { sAmpMv: -0.26, sDurationMs: 28 },
      },
      V6: {
        params: { sAmpMv: -0.3, sDurationMs: 30 },
      },
    },
    { qrsDurationMs: 92 },
  ),
};

export const ECG_DOMAINS: EcgDomain[] = [
  {
    id: 'fisiologi-normal',
    name: 'Fisiologi Normal',
    conditions: [NORMAL_SINUS_CONDITION],
  },
  {
    id: 'kelainan-aksis-ruang',
    name: 'Kelainan Aksis & Pembesaran Ruang Jantung',
    conditions: [
      P_PULMONALE_CONDITION,
      P_MITRALE_CONDITION,
      LVH_CONDITION,
      RVH_CONDITION,
      LAD_CONDITION,
      RAD_CONDITION,
    ],
  },
  {
    id: 'konduksi-intraventrikel',
    name: 'Konduksi Intraventrikel & Pre-eksitasi',
    conditions: [],
  },
  {
    id: 'iskemia-infark-perikardial',
    name: 'Iskemia, Infark & Perikardial',
    conditions: [],
  },
  {
    id: 'bradiaritmia-blok-av',
    name: 'Bradiaritmia & Blok AV',
    conditions: [],
  },
  {
    id: 'takiaritmia',
    name: 'Takiaritmia',
    conditions: [],
  },
  {
    id: 'metabolik-obat-pacemaker',
    name: 'Metabolik, Obat & Pacemaker',
    conditions: [],
  },
];

export const ECG_CONDITIONS: EcgCondition[] = ECG_DOMAINS.flatMap(
  (domain) => domain.conditions,
);
