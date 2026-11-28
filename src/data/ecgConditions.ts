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

const RBBB_CONDITION: EcgCondition = {
  id: 'rbbb',
  domainId: 'konduksi-intraventrikel',
  domainName: 'Konduksi Intraventrikel & Pre-eksitasi',
  name: 'Right Bundle Branch Block (RBBB)',
  noteReferencePath: 'src/notes/2.1 RBBB.md',
  heartRateBpm: 75,
  defaultLead: 'V1',
  blockedTarget: 'rbb',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls yang menyebar normal melintasi dinding atrium kanan dan kiri tanpa gangguan.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P normal dengan defleksi positif halus di Lead II dan pola bifasik normal di Lead V1.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan jeda fisiologis normal.',
      whatHappensInHeart:
        'Gelombang listrik melalui AV junction dan Bundle of His dengan perlambatan fisiologis normal sebelum tiba di percabangan berkas.',
      whyEcgLooksLikeThis:
        'Tidak ada beda potensial permukaan yang terukur, menghasilkan garis datar isoelektrik pada segmen PR dengan interval PR normal.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      activeParts: ['his-bundle', 'lbb', 'purkinje', 'left-ventricle', 'right-ventricle'],
      vectors: [
        {
          id: 'vec-rbbb-lv',
          label: '1. LV Aktif Normal via LBB',
          x1: 284,
          y1: 240,
          x2: 344,
          y2: 318,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-rbbb-rv',
          label: '2. Aktivasi Lambat RV (Anterior-Kanan)',
          x1: 274,
          y1: 268,
          x2: 204,
          y2: 264,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Cabang kanan (RBB) terputus: ventrikel kiri aktif normal via LBB, lalu ventrikel kanan menyusul lambat antar-sel.',
      whatHappensInHeart:
        'Karena transmisi RBB terblokir, impuls turun lewat LBB mengaktifkan septum kiri-ke-kanan lalu dinding ventrikel kiri secara normal; baru setelahnya impuls merambat lambat sel-ke-sel mengaktifkan ventrikel kanan paling akhir.',
      whyEcgLooksLikeThis:
        'Di Lead V1 terbentuk pola trifasik rSR\' ("telinga kelinci") dengan puncak akhir R\' tinggi dan lebar (QRS ≥ 0,12 dtk), sedangkan di lead lateral (I, V5–V6) muncul gelombang S terminal yang lebar dan tumpul.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Keterlambatan aktivasi ventrikel kanan mengubah urutan repolarisasi lokal sehingga ST-T di V1 berlawanan dengan R\'.',
      whatHappensInHeart:
        'Depolarisasi dinding ventrikel kanan yang sangat terlambat memicu perambatan pemulihan listrik (repolarisasi) abnormal pada sisi kanan jantung.',
      whyEcgLooksLikeThis:
        'Muncul kelainan repolarisasi sekunder (diskordansi) di V1–V3 berupa depresi segmen ST ringan dan inversi gelombang T asimetris berlawanan arah dengan R\', sementara gelombang T di lead lateral tetap tegak normal.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: { sAmpMv: -0.36, sDurationMs: 62 },
        stageNotes: {
          3: 'Tampak gelombang S terminal yang lebar dan tumpul akibat vektor lambat ventrikel kanan yang menjauh ke kanan.',
          4: 'Gelombang T di Lead I tetap tegak positif normal pada RBBB murni.',
        },
      },
      aVR: {
        params: { rPrimeAmpMv: 0.36 },
        stageNotes: {
          3: 'Muncul gelombang R\' akhir mengarah ke bahu kanan.',
        },
      },
      aVL: {
        params: { sAmpMv: -0.28, sDurationMs: 56 },
      },
      V1: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.28,
          rDurationMs: 22,
          sAmpMv: -0.32,
          sDurationMs: 28,
          rPrimeAmpMv: 0.88,
          stDeviationMv: -0.1,
          stMorphology: 'downsloping',
          tAmpMv: -0.28,
        },
        stageNotes: {
          1: 'Gelombang P bifasik normal tetap terjaga di V1.',
          3: 'Pola klasik rSR\' ("telinga kelinci"): r septal awal, S dari LV, dan R\' lebar tinggi (+0,88 mV; QRS 0,14 dtk) dari aktivasi lambat RV.',
          4: 'Depresi ST ringan dan inversi gelombang T asimetris (perubahan repolarisasi sekunder yang diskordan terhadap R\').',
        },
      },
      V2: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.38,
          rDurationMs: 24,
          sAmpMv: -0.44,
          sDurationMs: 30,
          rPrimeAmpMv: 0.64,
          stDeviationMv: -0.08,
          stMorphology: 'downsloping',
          tAmpMv: -0.22,
        },
        stageNotes: {
          3: 'Pola rSR\' tetap jelas di prekordial kanan V2.',
          4: 'Inversi T sekunder mengikuti defleksi akhir R\'.',
        },
      },
      V3: {
        params: {
          rAmpMv: 0.72,
          sAmpMv: -0.58,
          rPrimeAmpMv: 0.24,
          stDeviationMv: -0.04,
          tAmpMv: -0.1,
        },
      },
      V5: {
        params: { sAmpMv: -0.34, sDurationMs: 58 },
        stageNotes: {
          3: 'Gelombang S lebar dan tumpul di akhir QRS; gelombang T tetap tegak positif normal.',
        },
      },
      V6: {
        params: { sAmpMv: -0.38, sDurationMs: 62 },
        stageNotes: {
          3: 'Pola qRS dengan gelombang S terminal lebar (kebalikan dari R\' di V1).',
          4: 'Gelombang T tetap tegak positif normal di V6.',
        },
      },
    },
    { qrsDurationMs: 138 },
  ),
};

export const LBBB_CONDITION: EcgCondition = {
  id: 'lbbb',
  domainId: 'konduksi-intraventrikel',
  domainName: 'Konduksi Intraventrikel & Pre-eksitasi',
  name: 'Left Bundle Branch Block (LBBB)',
  noteReferencePath: 'src/notes/2.2 LBBB.md',
  heartRateBpm: 75,
  defaultLead: 'V1',
  blockedTarget: 'lbb',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls yang mendepolarisasi atrium kanan dan kiri secara berurutan tanpa hambatan.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P dengan morfologi normal di Lead II dan pola bifasik normal di Lead V1.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan jeda fisiologis normal.',
      whatHappensInHeart:
        'Gelombang listrik melalui AV junction dan Bundle of His dengan perlambatan konduksi normal sebelum tiba di percabangan berkas.',
      whyEcgLooksLikeThis:
        'Tidak ada beda potensial yang terekam di permukaan tubuh, menghasilkan segmen PR datar isoelektrik dengan interval PR normal.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      activeParts: ['his-bundle', 'rbb', 'purkinje', 'right-ventricle', 'left-ventricle'],
      vectors: [
        {
          id: 'vec-lbbb-rv',
          label: '1. RV & Septum Kanan-ke-Kiri via RBB',
          x1: 282,
          y1: 242,
          x2: 214,
          y2: 282,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-lbbb-lv',
          label: '2. Aktivasi Lambat LV (Kiri-Posterior)',
          x1: 278,
          y1: 272,
          x2: 356,
          y2: 298,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Cabang kiri (LBB) terputus: RV & septum aktif kanan-ke-kiri via RBB, lalu ventrikel kiri menyusul lambat.',
      whatHappensInHeart:
        'Konduksi terhenti di cabang berkas kiri sehingga impuls turun eksklusif lewat RBB, mendepolarisasi RV dan septum dari kanan ke kiri, lalu merambat sangat lambat miosit-ke-miosit menuju dinding bebas LV.',
      whyEcgLooksLikeThis:
        'Di Lead V1, seluruh vektor menjauh ke posterior-kiri sehingga membentuk kompleks QS lebar dan dalam (QRS ≥ 0,12 dtk); sedangkan di lead lateral (I, aVL, V5–V6) gelombang q septal hilang dan digantikan gelombang R tunggal lebar bertakik ("M").',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Asinkroni depolarisasi mengubah urutan repolarisasi sehingga ST-T selalu berlawanan arah dengan QRS (diskordan).',
      whatHappensInHeart:
        'Ventrikel kanan yang aktif lebih dulu memulai pemulihan listrik lebih awal sebelum dinding ventrikel kiri selesai mengalami repolarisasi.',
      whyEcgLooksLikeThis:
        'Muncul diskordansi ST-T sekunder: di V1–V3 (QRS negatif) tampak elevasi ST sekunder dan gelombang T tegak lebar, sedangkan di lead lateral (I, aVL, V5–V6) tampak depresi ST dan inversi T asimetris.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          qAmpMv: 0,
          rAmpMv: 1.08,
          rDurationMs: 118,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.1,
          stMorphology: 'downsloping',
          tAmpMv: -0.26,
          tDurationMs: 175,
        },
        stageNotes: {
          3: 'Gelombang q septal fisiologis menghilang; terbentuk gelombang R tunggal lebar bertakik ("M").',
          4: 'Depresi segmen ST dan inversi gelombang T sekunder (diskordan terhadap QRS positif).',
        },
      },
      II: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.45,
          rDurationMs: 55,
          sAmpMv: -0.58,
          sDurationMs: 85,
          stDeviationMv: 0.04,
          tAmpMv: 0.14,
        },
      },
      III: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.14,
          sAmpMv: -0.95,
          sDurationMs: 120,
          stDeviationMv: 0.08,
          tAmpMv: 0.22,
        },
      },
      aVR: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.08,
          sAmpMv: -1.05,
          sDurationMs: 122,
          stDeviationMv: 0.09,
          tAmpMv: 0.24,
        },
      },
      aVL: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.96,
          rDurationMs: 116,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.09,
          stMorphology: 'downsloping',
          tAmpMv: -0.24,
          tDurationMs: 175,
        },
        stageNotes: {
          3: 'Gelombang R monofasik lebar bertakik tanpa gelombang q awal.',
          4: 'Depresi ST dan inversi T sekunder.',
        },
      },
      aVF: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.22,
          sAmpMv: -0.68,
          sDurationMs: 105,
          stDeviationMv: 0.05,
          tAmpMv: 0.16,
        },
      },
      V1: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0,
          sAmpMv: -1.48,
          sDurationMs: 140,
          stDeviationMv: 0.18,
          stMorphology: 'concave',
          tAmpMv: 0.34,
          tDurationMs: 185,
        },
        stageNotes: {
          1: 'Gelombang P bifasik normal tetap terjaga di V1.',
          3: 'Kompleks QS negatif lebar dan dalam (-1,48 mV; QRS 0,14 dtk) karena aktivasi septum & LV bergerak menjauhi V1.',
          4: 'Elevasi segmen ST sekunder (+0,18 mV) dan gelombang T positif lebar yang diskordan terhadap QS.',
        },
      },
      V2: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.08,
          rDurationMs: 14,
          sAmpMv: -1.55,
          sDurationMs: 126,
          stDeviationMv: 0.2,
          stMorphology: 'concave',
          tAmpMv: 0.38,
          tDurationMs: 185,
        },
        stageNotes: {
          3: 'Pola rS sangat dalam dengan gelombang r kerdil dan S lebar.',
          4: 'Elevasi ST sekunder dan gelombang T tegak asimetris.',
        },
      },
      V3: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.26,
          rDurationMs: 28,
          sAmpMv: -1.15,
          sDurationMs: 110,
          stDeviationMv: 0.12,
          tAmpMv: 0.28,
          tDurationMs: 180,
        },
      },
      V4: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.85,
          rDurationMs: 95,
          rNotched: true,
          sAmpMv: -0.32,
          sDurationMs: 40,
          stDeviationMv: -0.06,
          tAmpMv: -0.16,
        },
      },
      V5: {
        params: {
          qAmpMv: 0,
          rAmpMv: 1.42,
          rDurationMs: 122,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.12,
          stMorphology: 'downsloping',
          tAmpMv: -0.32,
          tDurationMs: 185,
        },
        stageNotes: {
          3: 'Gelombang R tunggal lebar bertakik ("M") tanpa gelombang q septal.',
          4: 'Depresi ST dan inversi T sekunder di prekordial lateral.',
        },
      },
      V6: {
        params: {
          qAmpMv: 0,
          rAmpMv: 1.32,
          rDurationMs: 120,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.12,
          stMorphology: 'downsloping',
          tAmpMv: -0.3,
          tDurationMs: 185,
        },
        stageNotes: {
          3: 'Gelombang R monofasik lebar bertakik tanpa gelombang q awal; R peak time memanjang.',
          4: 'Depresi ST dan inversi T sekunder yang berlawanan dengan arah R.',
        },
      },
    },
    { qrsDurationMs: 142, qtIntervalMs: 420 },
  ),
};

export const LAFB_CONDITION: EcgCondition = {
  id: 'lafb',
  domainId: 'konduksi-intraventrikel',
  domainName: 'Konduksi Intraventrikel & Pre-eksitasi',
  name: 'Left Anterior Fascicular Block (LAFB)',
  noteReferencePath: 'src/notes/2.3 LAFB.md',
  heartRateBpm: 75,
  defaultLead: 'II',
  blockedTarget: 'left-anterior-fascicle',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik yang menyebar normal melintasi miokardium atrium kanan dan kiri ke arah inferior-anterior.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P positif halus normal di Lead II dengan interval PR fisiologis (0,12–0,20 dtk).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan perlambatan fisiologis normal.',
      whatHappensInHeart:
        'Impuls listrik menyeberangi AV junction dan berkas His secara normal sebelum tiba di percabangan berkas.',
      whyEcgLooksLikeThis:
        'Tidak ada beda potensial di permukaan tubuh sehingga tercatat segmen PR datar isoelektrik.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      vectors: [
        {
          id: 'vec-lafb-init',
          label: '1. Awal ke Inferior-Kanan (Fasikel Posterior)',
          x1: 280,
          y1: 246,
          x2: 298,
          y2: 298,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-lafb-main',
          label: '2. Belokan Tajam ke Superior-Kiri (−45° s/d −90°)',
          x1: 282,
          y1: 266,
          x2: 362,
          y2: 212,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Fasikel anterior terblok: aktivasi awal turun lewat fasikel posterior, lalu berbelok tajam ke superior-kiri.',
      whatHappensInHeart:
        'Karena fasikel anterior kiri terblokir, aktivasi LV dimulai lewat fasikel posterior menuju dinding inferior (vektor awal ke bawah-kanan), lalu gelombang menyebar ke atas menuju dinding anterior-superior yang tertunda.',
      whyEcgLooksLikeThis:
        'Di Lead II (+60°), vektor awal membentuk gelombang r kecil, lalu belokan masif ke atas-kiri membentuk gelombang S dalam (pola rS, S > r) dengan durasi QRS tetap sempit (< 0,12 dtk); sementara Lead I & aVL menampilkan pola qR.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Segmen ST tetap isoelektrik dan repolarisasi ventrikel berlangsung normal.',
      whatHappensInHeart:
        'Seluruh miokardium ventrikel menyelesaikan depolarisasi dan berepolarisasi secara fisiologis dari epikardium ke endokardium.',
      whyEcgLooksLikeThis:
        'Segmen ST kembali rata pada garis isoelektrik diikuti gelombang T positif normal di Lead II tanpa distorsi sekunder.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          qAmpMv: -0.08,
          qDurationMs: 18,
          rAmpMv: 1.05,
          rDurationMs: 48,
          sAmpMv: 0,
        },
        stageNotes: {
          3: 'Pola qR dengan gelombang R dominan tinggi karena vektor terminal berbelok ke kiri-atas.',
        },
      },
      II: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.22,
          rDurationMs: 22,
          sAmpMv: -0.96,
          sDurationMs: 62,
          stDeviationMv: 0,
          tAmpMv: 0.22,
        },
        stageNotes: {
          1: 'Gelombang P positif halus normal di Lead II.',
          3: 'Pola rS klasik (r +0,22 mV disusul S −0,96 mV; S > r) dengan QRS sempit (0,10 dtk) akibat belokan vektor ke superior-kiri.',
          4: 'Segmen ST datar isoelektrik dan gelombang T positif normal pada LAFB terisolasi.',
        },
      },
      III: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.14,
          rDurationMs: 18,
          sAmpMv: -1.55,
          sDurationMs: 66,
          tAmpMv: 0.16,
        },
        stageNotes: {
          3: 'Gelombang S sangat dalam (−1,55 mV, ≥ 1,4× tinggi R di Lead I) menegaskan deviasi aksis kiri ekstrem.',
        },
      },
      aVR: {
        params: { qAmpMv: -0.1, rAmpMv: 0.36, sAmpMv: -0.42 },
      },
      aVL: {
        params: {
          qAmpMv: -0.1,
          qDurationMs: 18,
          rAmpMv: 1.24,
          rDurationMs: 52,
          sAmpMv: 0,
        },
        stageNotes: {
          3: 'Pola qR tinggi (+1,24 mV) dengan waktu puncak R (R peak time) yang memanjang di lateral tinggi.',
        },
      },
      aVF: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.16,
          rDurationMs: 20,
          sAmpMv: -1.16,
          sDurationMs: 64,
          tAmpMv: 0.18,
        },
        stageNotes: {
          3: 'Pola rS dengan kedalaman S (−1,16 mV) melebihi tinggi R di Lead I.',
        },
      },
      V5: {
        params: { qAmpMv: 0, rAmpMv: 1.12, sAmpMv: -0.34 },
      },
      V6: {
        params: { qAmpMv: 0, rAmpMv: 0.94, sAmpMv: -0.38 },
      },
    },
    { qrsDurationMs: 102 },
  ),
};

export const LPFB_CONDITION: EcgCondition = {
  id: 'lpfb',
  domainId: 'konduksi-intraventrikel',
  domainName: 'Konduksi Intraventrikel & Pre-eksitasi',
  name: 'Left Posterior Fascicular Block (LPFB)',
  noteReferencePath: 'src/notes/2.4 LPFB.md',
  heartRateBpm: 75,
  defaultLead: 'III',
  blockedTarget: 'left-posterior-fascicle',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik yang menjalar normal melintasi dinding atrium kanan dan kiri ke arah inferior-anterior.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P normal dengan defleksi positif halus di Lead III dan Lead II disertai interval PR fisiologis (0,12–0,20 dtk).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan perlambatan fisiologis normal.',
      whatHappensInHeart:
        'Impuls melewati AV junction dan berkas His secara normal sebelum tiba di percabangan berkas.',
      whyEcgLooksLikeThis:
        'Tidak ada beda potensial yang terdeteksi di permukaan tubuh sehingga tercatat segmen PR datar isoelektrik.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      vectors: [
        {
          id: 'vec-lpfb-init',
          label: '1. Awal ke Superior-Kiri (Fasikel Anterior)',
          x1: 283,
          y1: 242,
          x2: 344,
          y2: 214,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-lpfb-main',
          label: '2. Belokan Kuat ke Inferior-Kanan (+110° s/d +120°)',
          x1: 284,
          y1: 264,
          x2: 242,
          y2: 344,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Fasikel posterior terblok: aktivasi awal ke superior-kiri lewat fasikel anterior, lalu berbelok kuat ke inferior-kanan.',
      whatHappensInHeart:
        'Karena konduksi fasikel posterior terputus, eksitasi LV dimulai melalui fasikel anterior ke dinding anterosuperior, lalu menyebar melingkar ke bawah mengaktivasi dinding posteroinferior yang tertunda.',
      whyEcgLooksLikeThis:
        'Di Lead III (+120°), vektor awal menjauh membentuk gelombang q kecil lalu belokan masif ke inferior-kanan membentuk gelombang R sangat tinggi (pola qR sempit, QRS < 0,12 dtk; R III > R II), sedangkan Lead I & aVL menampilkan pola rS.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Segmen ST kembali datar isoelektrik dan repolarisasi ventrikel berlangsung normal.',
      whatHappensInHeart:
        'Seluruh miosit ventrikel menyelesaikan depolarisasi dan menjalani pemulihan listrik fisiologis dari epikardium ke endokardium.',
      whyEcgLooksLikeThis:
        'Segmen ST tetap rata di garis isoelektrik diikuti gelombang T positif normal di Lead III tanpa gangguan repolarisasi sekunder yang signifikan.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.22,
          rDurationMs: 22,
          sAmpMv: -0.78,
          sDurationMs: 58,
        },
        stageNotes: {
          3: 'Pola rS dengan gelombang S lebar dan dalam (S > r) karena vektor terminal menjauh ke inferior-kanan.',
        },
      },
      II: {
        params: {
          qAmpMv: -0.06,
          qDurationMs: 16,
          rAmpMv: 0.96,
          rDurationMs: 48,
          sAmpMv: 0,
        },
        stageNotes: {
          3: 'Pola qR dengan gelombang R tinggi (+0,96 mV), namun tetap lebih rendah daripada R di Lead III.',
        },
      },
      III: {
        params: {
          qAmpMv: -0.1,
          qDurationMs: 18,
          rAmpMv: 1.42,
          rDurationMs: 54,
          sAmpMv: 0,
          stDeviationMv: 0,
          tAmpMv: 0.24,
        },
        stageNotes: {
          1: 'Gelombang P positif normal di Lead III.',
          3: 'Pola qR sempit (q −0,10 mV, R tinggi +1,42 mV; R III > R II; QRS 0,10 dtk) karena vektor berotasi sejajar +120°.',
          4: 'Segmen ST isoelektrik dan gelombang T positif normal pada LPFB terisolasi.',
        },
      },
      aVR: {
        params: { qAmpMv: -0.1, rAmpMv: 0.34, sAmpMv: -0.38 },
      },
      aVL: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.16,
          rDurationMs: 20,
          sAmpMv: -1.04,
          sDurationMs: 62,
        },
        stageNotes: {
          3: 'Pola rS jelas dengan gelombang S dalam (−1,04 mV) di lateral tinggi.',
        },
      },
      aVF: {
        params: {
          qAmpMv: -0.08,
          qDurationMs: 18,
          rAmpMv: 1.18,
          rDurationMs: 52,
          sAmpMv: 0,
        },
        stageNotes: {
          3: 'Pola qR dominan dengan R peak time memanjang di lead inferior.',
        },
      },
      V5: {
        params: { qAmpMv: -0.05, rAmpMv: 0.88, sAmpMv: -0.36 },
      },
      V6: {
        params: { qAmpMv: -0.04, rAmpMv: 0.72, sAmpMv: -0.42 },
      },
    },
    { qrsDurationMs: 102 },
  ),
};

export const WPW_CONDITION: EcgCondition = {
  id: 'wpw',
  domainId: 'konduksi-intraventrikel',
  domainName: 'Konduksi Intraventrikel & Pre-eksitasi',
  name: 'Wolff-Parkinson-White (WPW) Pattern',
  noteReferencePath: 'src/notes/2.5 WPW.md',
  heartRateBpm: 75,
  defaultLead: 'V1',
  blockedTarget: 'av-reentry',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik yang menyebar normal melintasi dinding atrium kanan dan kiri ke arah inferior-anterior.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P normal yang bersumber dari nodus sinus (positif di Lead II dan bifasik normal di Lead V1).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      activeParts: ['av-node', 'his-bundle', 'right-ventricle', 'left-ventricle'],
      heartStatusCaption:
        'Jalur aksesori (berkas Kent) memintas jeda AV Node sehingga segmen PR memendek tajam (< 0,12 dtk).',
      whatHappensInHeart:
        'Impuls terbagi dua: sebagian tertahan normal di AV Node, sementara sebagian lainnya meluncur cepat melewati jalur aksesori otot (bypass tract) langsung menuju miokardium ventrikel tanpa jeda.',
      whyEcgLooksLikeThis:
        'Garis datar isoelektrik segmen PR menghilang dan interval PR memendek (< 0,12 dtk) karena aktivasi ventrikel dimulai secara prematur.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      activeParts: ['his-bundle', 'rbb', 'lbb', 'purkinje', 'left-ventricle', 'right-ventricle'],
      vectors: [
        {
          id: 'vec-wpw-delta',
          label: '1. Pre-eksitasi Awal / Gel. Delta (Miosit-ke-Miosit)',
          x1: 350,
          y1: 204,
          x2: 260,
          y2: 238,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-wpw-fusion',
          label: '2. Fusi Jalur His-Purkinje Normal',
          x1: 282,
          y1: 244,
          x2: 336,
          y2: 318,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Kompleks QRS merupakan fusi: pre-eksitasi lambat lewat jalur aksesori (gelombang delta) disusul aktivasi cepat His-Purkinje.',
      whatHappensInHeart:
        'Impuls dari jalur pintas menginvasi miokardium ventrikel lebih awal secara lambat antarsel (membentuk gelombang delta), lalu disusul impuls normal yang menembus AV Node dan menyebar cepat lewat His-Purkinje.',
      whyEcgLooksLikeThis:
        'Terbentuk kompleks QRS lebar tipe fusion (> 0,12 dtk) yang diawali tanjakan landai tumpul (gelombang delta) pada pangkal QRS; di Lead V1 (pola Grup A) tampak gelombang R/delta positif dominan.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Urutan depolarisasi asinkron memicu diskordansi ST-T sekunder berlawanan dengan gelombang delta/QRS.',
      whatHappensInHeart:
        'Area miokardium ventrikel yang mengalami pre-eksitasi lebih awal memulai pemulihan listrik sebelum bagian ventrikel lainnya selesai pulih.',
      whyEcgLooksLikeThis:
        'Muncul perubahan repolarisasi sekunder berupa depresi segmen ST dan inversi gelombang T asimetris yang berlawanan arah dengan defleksi utama gelombang delta/QRS di V1.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.92,
          rDurationMs: 84,
          sAmpMv: -0.22,
          sDurationMs: 28,
          stDeviationMv: -0.05,
          tAmpMv: 0.14,
        },
        stageNotes: {
          2: 'Interval PR memendek (< 0,10 dtk) tanpa segmen PR mendatar.',
          3: 'Gelombang q septal menghilang; awal gelombang R melandai lebar (gelombang delta).',
        },
      },
      II: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.88,
          rDurationMs: 84,
          sAmpMv: -0.18,
          sDurationMs: 26,
          tAmpMv: 0.22,
        },
        stageNotes: {
          2: 'P langsung bersambung ke pangkal QRS (PR 0,10 dtk).',
          3: 'Tanjakan awal QRS tampak landai (delta wave) dengan durasi QRS total 0,13 dtk.',
        },
      },
      III: {
        params: {
          qAmpMv: -0.28,
          qDurationMs: 36,
          rAmpMv: 0.44,
          rDurationMs: 62,
          sAmpMv: -0.1,
          tAmpMv: 0.16,
        },
        stageNotes: {
          3: 'Gelombang delta negatif di lead inferior dapat menyerupai gelombang Q patologis (pseudo-infark).',
        },
      },
      aVR: {
        params: {
          qAmpMv: -0.35,
          qDurationMs: 42,
          rAmpMv: 0.12,
          sAmpMv: -0.45,
          sDurationMs: 56,
        },
      },
      aVL: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.72,
          rDurationMs: 78,
          sAmpMv: -0.16,
          sDurationMs: 24,
        },
      },
      aVF: {
        params: {
          qAmpMv: -0.22,
          qDurationMs: 34,
          rAmpMv: 0.62,
          rDurationMs: 68,
          sAmpMv: -0.12,
        },
        stageNotes: {
          3: 'Defleksi delta negatif awal di aVF sering meniru gambaran infark inferior.',
        },
      },
      V1: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.96,
          rDurationMs: 88,
          sAmpMv: -0.18,
          sDurationMs: 26,
          stDeviationMv: -0.09,
          stMorphology: 'downsloping',
          tAmpMv: -0.24,
          tDurationMs: 165,
        },
        stageNotes: {
          1: 'Gelombang P normal sebelum pre-eksitasi dimulai.',
          2: 'Segmen PR menghilang (PR 0,10 dtk) akibat hantaran cepat lewat jalur aksesori.',
          3: 'Tanjakan landai gelombang delta positif menyatu menjadi R tinggi (+0,96 mV; QRS 0,13 dtk) khas WPW tipe A (jalur kiri).',
          4: 'Depresi ST dan inversi T sekunder yang diskordan terhadap defleksi R/delta positif.',
        },
      },
      V2: {
        params: {
          qAmpMv: 0,
          rAmpMv: 1.08,
          rDurationMs: 88,
          sAmpMv: -0.24,
          sDurationMs: 28,
          stDeviationMv: -0.08,
          stMorphology: 'downsloping',
          tAmpMv: -0.2,
        },
      },
      V5: {
        params: {
          qAmpMv: 0,
          rAmpMv: 1.24,
          rDurationMs: 86,
          sAmpMv: -0.12,
          sDurationMs: 22,
          stDeviationMv: -0.04,
          tAmpMv: 0.16,
        },
      },
      V6: {
        params: {
          qAmpMv: 0,
          rAmpMv: 1.12,
          rDurationMs: 86,
          sAmpMv: -0.1,
          sDurationMs: 20,
          stDeviationMv: -0.04,
          tAmpMv: 0.14,
        },
      },
    },
    { prIntervalMs: 100, qrsDurationMs: 128, qtIntervalMs: 380 },
  ),
};

export const NSTEMI_CONDITION: EcgCondition = {
  id: 'nstemi',
  domainId: 'iskemia-infark-perikardial',
  domainName: 'Iskemia, Infark & Perikardial',
  name: 'Iskemia Subendokardial & NSTEMI',
  noteReferencePath: 'src/notes/3.1 NSTEMI.md',
  heartRateBpm: 82,
  defaultLead: 'V5',
  ischemicZone: 'subendocardial-lv',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik secara normal melintasi miokardium atrium kanan dan kiri ke arah inferior-anterior.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P normal yang positif di Lead II dan V5 dengan interval PR fisiologis (0,12–0,20 dtk).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan jeda normal; segmen PR menjadi garis acuan dasar.',
      whatHappensInHeart:
        'Impuls listrik dihantarkan melalui AV junction dan berkas His dengan perlambatan konduksi normal sebelum mencapai cabang berkas.',
      whyEcgLooksLikeThis:
        'Tercatat garis datar isoelektrik pada segmen PR yang berfungsi sebagai baseline untuk menilai ada tidaknya depresi segmen ST.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Depolarisasi ventrikel tetap menembus dinding dari dalam ke luar sehingga tidak terbentuk gelombang Q patologis baru.',
      whatHappensInHeart:
        'Karena gangguan iskemia terbatas pada lapisan subendokardium dalam, impuls His-Purkinje tetap mendepolarisasi septum dan lapisan epikardium ventrikel kiri secara normal.',
      whyEcgLooksLikeThis:
        'Di Lead V5 terbentuk kompleks QRS normal (gelombang q septal kecil diikuti R tinggi; durasi < 0,11 dtk) tanpa munculnya gelombang Q patologis infark transmural.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      vectors: [
        {
          id: 'vec-nstemi-injury',
          label: 'Arus Cedera ST ke Subendokardium (Inward)',
          x1: 344,
          y1: 288,
          x2: 296,
          y2: 256,
          color: '#d97706',
        },
      ],
      heartStatusCaption:
        'Iskemia subendokardium menarik vektor cedera ST ke arah dalam rongga ventrikel sehingga V5 merekam depresi ST.',
      whatHappensInHeart:
        'Miosit subendokardium yang hipoksia mengalami pemendekan fase plateau potensial aksi, menciptakan gradien arus cedera yang mengarah masuk ke rongga ventrikel kiri selama repolarisasi.',
      whyEcgLooksLikeThis:
        'Di Lead V5 (memandang dari epikardium luar), vektor cedera yang menjauh ke dalam tercatat sebagai depresi segmen ST horizontal/downsloping (≥ 1 mm) disertai pendataran atau inversi gelombang T simetris, serta elevasi ST resiprokal di aVR.',
    },
  },
  leads: buildDerivedLeads({
    I: {
      params: {
        stDeviationMv: -0.1,
        stMorphology: 'flat',
        tAmpMv: -0.08,
      },
      stageNotes: {
        4: 'Depresi segmen ST horizontal (−0,10 mV) dan gelombang T mendatar/terbalik ringan.',
      },
    },
    II: {
      params: {
        stDeviationMv: -0.08,
        stMorphology: 'flat',
        tAmpMv: 0.08,
      },
    },
    III: {
      params: {
        stDeviationMv: -0.06,
        stMorphology: 'flat',
        tAmpMv: 0.06,
      },
    },
    aVR: {
      params: {
        stDeviationMv: 0.14,
        stMorphology: 'flat',
        tAmpMv: 0.1,
      },
      stageNotes: {
        4: 'Elevasi segmen ST resiprokal (+0,14 mV) karena aVR memandang langsung rongga dalam ventrikel.',
      },
    },
    aVL: {
      params: {
        stDeviationMv: -0.08,
        stMorphology: 'downsloping',
        tAmpMv: -0.1,
      },
    },
    aVF: {
      params: {
        stDeviationMv: -0.07,
        stMorphology: 'flat',
        tAmpMv: 0.08,
      },
    },
    V3: {
      params: {
        stDeviationMv: -0.08,
        stMorphology: 'flat',
        tAmpMv: 0.12,
      },
    },
    V4: {
      params: {
        stDeviationMv: -0.14,
        stMorphology: 'flat',
        tAmpMv: -0.12,
      },
      stageNotes: {
        4: 'Depresi segmen ST horizontal (−0,14 mV) di prekordial anterior-apikal.',
      },
    },
    V5: {
      params: {
        stDeviationMv: -0.18,
        stMorphology: 'flat',
        tAmpMv: -0.18,
        tDurationMs: 165,
      },
      stageNotes: {
        1: 'Gelombang P normal sebelum depolarisasi ventrikel.',
        2: 'Segmen PR datar menjadi garis dasar acuan pengukuran ST.',
        3: 'Kompleks QRS normal tanpa gelombang Q patologis baru.',
        4: 'Depresi segmen ST horizontal bermakna (−0,18 mV) disertai inversi gelombang T simetris primer akibat arus cedera ke subendokardium.',
      },
    },
    V6: {
      params: {
        stDeviationMv: -0.16,
        stMorphology: 'downsloping',
        tAmpMv: -0.16,
        tDurationMs: 165,
      },
      stageNotes: {
        4: 'Depresi segmen ST downsloping (−0,16 mV) dan inversi gelombang T simetris di lateral.',
      },
    },
  }),
};

export const STEMI_CONDITION: EcgCondition = {
  id: 'stemi',
  domainId: 'iskemia-infark-perikardial',
  domainName: 'Iskemia, Infark & Perikardial',
  name: 'Iskemia Transmural & STEMI Fase Akut',
  noteReferencePath: 'src/notes/3.2 STEMI.md',
  heartRateBpm: 92,
  defaultLead: 'V3',
  ischemicZone: 'anterior-lv',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal (sering disertai takikardia sinus).',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik secara teratur mendepolarisasi miokardium atrium kanan dan kiri ke arah inferior-anterior.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P normal yang halus di Lead II, V1, dan V3 tanpa distorsi oleh iskemia ventrikel.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan jeda normal; segmen PR menjadi baseline pengukur elevasi ST.',
      whatHappensInHeart:
        'Impuls listrik merambat menembus AV junction dan berkas His dengan perlambatan fisiologis normal sebelum mencapai cabang berkas.',
      whyEcgLooksLikeThis:
        'Tercatat garis datar isoelektrik pada segmen PR yang menjadi garis acuan utama untuk menilai besarnya elevasi segmen ST.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Konduksi di zona infark anterior melambat lokal; amplitudo R menyusut dan gelombang S terangkat ke titik J.',
      whatHappensInHeart:
        'Impuls menyebar melalui cabang berkas ke ventrikel, namun di dinding anterior-apeks yang mengalami oklusi LAD akut, depolarisasi melemah dan sebagian miosit mulai kehilangan eksitabilitas.',
      whyEcgLooksLikeThis:
        'Di Lead V3, gelombang R tampak menurun dan gelombang S mendangkal terangkat menyatu dengan titik J, sering disertai kemunculan gelombang Q awal seiring terbentuknya nekrosis transmural.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      vectors: [
        {
          id: 'vec-stemi-outward',
          label: 'Arus Cedera Transmural ke Epikardium (Outward)',
          x1: 312,
          y1: 274,
          x2: 368,
          y2: 314,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Iskemia transmural memancarkan arus cedera ke arah luar epikardium, membentuk elevasi ST konveks & gel. T hiperakut.',
      whatHappensInHeart:
        'Oklusi koroner total memicu iskemia menembus seluruh tebal dinding (subendokardium hingga epikardium), menghasilkan gradien arus cedera masif yang mengarah keluar ke epikardium anterior.',
      whyEcgLooksLikeThis:
        'Di Lead V3 (menghadap langsung epikardium anterior), tampak elevasi segmen ST konveks (coved/tombstone, +0,38 mV) yang menyatu dengan gelombang T hiperakut tinggi, disertai depresi ST resiprokal di lead inferior (II, III, aVF).',
    },
  },
  leads: buildDerivedLeads({
    I: {
      params: {
        stDeviationMv: 0.08,
        stMorphology: 'convex',
        tAmpMv: 0.28,
      },
    },
    II: {
      params: {
        stDeviationMv: -0.09,
        stMorphology: 'flat',
        tAmpMv: 0.14,
      },
      stageNotes: {
        4: 'Depresi segmen ST resiprokal (−0,09 mV) berlawanan arah dengan elevasi ST di anterior.',
      },
    },
    III: {
      params: {
        stDeviationMv: -0.14,
        stMorphology: 'downsloping',
        tAmpMv: 0.08,
      },
      stageNotes: {
        4: 'Depresi segmen ST resiprokal yang jelas (−0,14 mV) di lead inferior.',
      },
    },
    aVL: {
      params: {
        stDeviationMv: 0.12,
        stMorphology: 'convex',
        tAmpMv: 0.28,
      },
    },
    aVF: {
      params: {
        stDeviationMv: -0.12,
        stMorphology: 'flat',
        tAmpMv: 0.1,
      },
      stageNotes: {
        4: 'Depresi segmen ST resiprokal di lead inferior aVF.',
      },
    },
    V1: {
      params: {
        qAmpMv: 0,
        rAmpMv: 0.08,
        sAmpMv: -0.65,
        stDeviationMv: 0.22,
        stMorphology: 'convex',
        tAmpMv: 0.36,
      },
      stageNotes: {
        4: 'Elevasi ST konveks (+0,22 mV) pada keterlibatan dinding anteroseptal.',
      },
    },
    V2: {
      params: {
        qAmpMv: -0.18,
        qDurationMs: 26,
        rAmpMv: 0.28,
        sAmpMv: -0.35,
        stDeviationMv: 0.34,
        stMorphology: 'convex',
        tAmpMv: 0.52,
        tSharpness: 'peaked',
        tDurationMs: 175,
      },
      stageNotes: {
        4: 'Elevasi ST coved dramatis (+0,34 mV) menyatu dengan gelombang T hiperakut.',
      },
    },
    V3: {
      params: {
        qAmpMv: -0.22,
        qDurationMs: 28,
        rAmpMv: 0.42,
        rDurationMs: 36,
        sAmpMv: -0.12,
        sDurationMs: 16,
        stDeviationMv: 0.38,
        stMorphology: 'convex',
        tAmpMv: 0.58,
        tSharpness: 'peaked',
        tDurationMs: 180,
      },
      stageNotes: {
        1: 'Gelombang P normal sebelum depolarisasi ventrikel.',
        2: 'Segmen PR isoelektrik menjadi baseline pengukuran deviasi titik J.',
        3: 'Gelombang R mengecil dan gelombang S terangkat ke titik J disertai munculnya gelombang Q awal.',
        4: 'Elevasi segmen ST konveks (+0,38 mV) menyatu dengan gelombang T hiperakut tinggi (+0,58 mV) akibat arus cedera transmural ke epikardium.',
      },
    },
    V4: {
      params: {
        qAmpMv: -0.14,
        qDurationMs: 22,
        rAmpMv: 0.68,
        sAmpMv: -0.1,
        stDeviationMv: 0.28,
        stMorphology: 'convex',
        tAmpMv: 0.48,
        tDurationMs: 175,
      },
    },
    V5: {
      params: {
        stDeviationMv: 0.12,
        stMorphology: 'convex',
        tAmpMv: 0.34,
      },
    },
  }),
};

export const CHRONIC_MI_CONDITION: EcgCondition = {
  id: 'chronic-mi',
  domainId: 'iskemia-infark-perikardial',
  domainName: 'Iskemia, Infark & Perikardial',
  name: 'Infark Miokard Kronis (Gelombang Q Patologis)',
  noteReferencePath: 'src/notes/3.3 MI.md',
  heartRateBpm: 75,
  defaultLead: 'V2',
  ischemicZone: 'anterior-lv',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik secara teratur mendepolarisasi miokardium atrium kanan dan kiri secara normal.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P normal yang halus di Lead II dan V2 dengan interval PR fisiologis (0,12–0,20 dtk).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan perlambatan fisiologis normal.',
      whatHappensInHeart:
        'Impuls listrik merambat melintasi AV junction dan berkas His secara normal sebelum memasuki cabang berkas.',
      whyEcgLooksLikeThis:
        'Tidak ada perbedaan potensial listrik di permukaan tubuh sehingga tercatat segmen PR datar isoelektrik.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      vectors: [
        {
          id: 'vec-mi-window',
          label: 'Vektor Menjauh dari Jaringan Parut Anterior',
          x1: 298,
          y1: 274,
          x2: 364,
          y2: 244,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Jaringan parut anterior inaktif secara elektrik; vektor dinding sehat menarik gaya listrik menjauh dari V2.',
      whatHappensInHeart:
        'Area fibrosis pasca-infark lama di dinding anteroseptal bersifat electrically silent, sehingga gaya depolarisasi dinding posterior dan ventrikel sehat menjadi tak terimbangi dan mengarah menjauhi dinding dada anterior.',
      whyEcgLooksLikeThis:
        'Di Lead V2, elektroda bertindak sebagai "jendela elektrik" yang merekam gaya menjauh sejak awal QRS, menghapus gelombang r septal dan membentuk kompleks QS dalam (atau QR patologis) serta hilangnya progresi R di V1–V3.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Arus cedera akut telah reda sehingga segmen ST kembali isoelektrik, disertai gelombang T pasca-iskemik.',
      whatHappensInHeart:
        'Miokardium yang bertahan telah pulih dan jaringan nekrotik digantikan jaringan parut fibrosa yang stabil tanpa arus cedera akut.',
      whyEcgLooksLikeThis:
        'Segmen ST kembali rata pada garis isoelektrik, sementara gelombang T di Lead V2 tampak terbalik simetris atau mendatar sebagai sisa proses penyembuhan kronis.',
    },
  },
  leads: buildDerivedLeads(
    {
      V1: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0,
          sAmpMv: -0.92,
          sDurationMs: 68,
          stDeviationMv: 0,
          tAmpMv: -0.14,
        },
        stageNotes: {
          3: 'Kompleks QS tanpa gelombang r awal akibat hilangnya aktivasi anteroseptal.',
        },
      },
      V2: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0,
          sAmpMv: -1.18,
          sDurationMs: 72,
          stDeviationMv: 0,
          tAmpMv: -0.22,
          tDurationMs: 165,
        },
        stageNotes: {
          1: 'Gelombang P normal sebelum aktivasi ventrikel.',
          3: 'Hilangnya gelombang r septal normal, digantikan kompleks QS negatif dalam (−1,18 mV) sebagai "jendela elektrik" jaringan parut anteroseptal.',
          4: 'Segmen ST kembali isoelektrik (0 mV) dengan inversi gelombang T simetris pasca-iskemik.',
        },
      },
      V3: {
        params: {
          qAmpMv: -0.68,
          qDurationMs: 42,
          rAmpMv: 0.24,
          rDurationMs: 28,
          sAmpMv: -0.26,
          stDeviationMv: 0,
          tAmpMv: -0.2,
          tDurationMs: 165,
        },
        stageNotes: {
          3: 'Gelombang Q patologis lebar (−0,68 mV; ≥ 0,04 dtk) disertai poor R wave progression.',
          4: 'Segmen ST isoelektrik dengan inversi T simetris residual.',
        },
      },
      V4: {
        params: {
          qAmpMv: -0.34,
          qDurationMs: 36,
          rAmpMv: 0.72,
          sAmpMv: -0.18,
          stDeviationMv: 0,
          tAmpMv: -0.12,
        },
        stageNotes: {
          3: 'Gelombang Q patologis masih tampak di V4 dengan progresi gelombang R yang berkurang.',
        },
      },
    },
    { qrsDurationMs: 92 },
  ),
};

export const PERICARDITIS_CONDITION: EcgCondition = {
  id: 'pericarditis',
  domainId: 'iskemia-infark-perikardial',
  domainName: 'Iskemia, Infark & Perikardial',
  name: 'Perikarditis Akut',
  noteReferencePath: 'src/notes/3.4 Perikarditis.md',
  heartRateBpm: 95,
  defaultLead: 'II',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal (sering disertai takikardia sinus).',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik yang menyebar normal mendepolarisasi miokardium atrium kanan dan kiri ke arah inferior-anterior.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P dengan morfologi normal yang positif halus di Lead II dan bifasik normal di Lead V1.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      vectors: [
        {
          id: 'vec-pericarditis-pr',
          label: 'Arus Cedera Epikardium Atrium (ke Basis/Kanan-Atas)',
          x1: 278,
          y1: 162,
          x2: 204,
          y2: 102,
          color: '#d97706',
        },
      ],
      heartStatusCaption:
        'Inflamasi epikardium atrium membangkitkan arus cedera mengarah ke basis jantung (depresi PR difus; elevasi PR di aVR).',
      whatHappensInHeart:
        'Saat impuls melewati AV Node dengan jeda normal, peradangan superfisial pada epikardium atrium menimbulkan arus cedera diastolik atrium yang mengarah ke superior-kanan.',
      whyEcgLooksLikeThis:
        'Segmen PR bergeser turun (depresi segmen PR) pada Lead II, aVF, dan V5–V6 secara berlawanan dengan elevasi ST (PR-ST discordance), sedangkan Lead aVR mencatat elevasi segmen PR (knuckle sign).',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Depolarisasi ventrikel lewat His-Purkinje berlangsung utuh tanpa gelombang Q patologis.',
      whatHappensInHeart:
        'Impuls listrik menuruni berkas His dan sistem Purkinje mengaktivasi seluruh miokardium ventrikel secara simetris karena inflamasi hanya terbatas pada epikardium superfisial tanpa nekrosis transmural.',
      whyEcgLooksLikeThis:
        'Terbentuk kompleks QRS sempit berdurasi normal (< 0,10 dtk) dan bersih tanpa gelombang Q patologis baru di Lead II.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      vectors: [
        {
          id: 'vec-pericarditis-st-inf',
          label: 'Arus Cedera Epikardium Difus (Inferoapikal)',
          x1: 294,
          y1: 274,
          x2: 326,
          y2: 356,
          color: '#dc2626',
        },
        {
          id: 'vec-pericarditis-st-lat',
          label: 'Arus Cedera Epikardium Difus (Lateral)',
          x1: 312,
          y1: 266,
          x2: 378,
          y2: 294,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Inflamasi epikardium ventrikel yang difus memancarkan arus cedera ke permukaan luar, membentuk elevasi ST konkaf.',
      whatHappensInHeart:
        'Peradangan luas pada lapisan epikardium ventrikel memicu gradien arus cedera positif yang memancar keluar secara difus ke hampir seluruh permukaan jantung melampaui batas satu teritori koroner.',
      whyEcgLooksLikeThis:
        'Di Lead II (serta I, aVL, aVF, V2–V6) tampak elevasi segmen ST konkaf (cekung ke atas) disertai gelombang T yang tetap tegak positif, tanpa depresi ST resiprokal kecuali di Lead aVR.',
    },
  },
  leads: buildDerivedLeads({
    I: {
      params: {
        stDeviationMv: 0.18,
        stMorphology: 'concave',
        tAmpMv: 0.28,
      },
      stageNotes: {
        4: 'Elevasi segmen ST konkaf difus (+0,18 mV) dengan gelombang T tetap tegak positif.',
      },
    },
    II: {
      params: {
        stDeviationMv: 0.24,
        stMorphology: 'concave',
        tAmpMv: 0.34,
      },
      stageNotes: {
        1: 'Gelombang P normal sebelum segmen PR.',
        2: 'Segmen PR cenderung tertekan oleh arus cedera epikardium atrium (berlawanan dengan arah elevasi ST).',
        3: 'Kompleks QRS sempit normal tanpa gelombang Q patologis.',
        4: 'Elevasi segmen ST konkaf (+0,24 mV, cekung ke atas) disertai gelombang T positif tegak khas Perikarditis Stadium 1.',
      },
    },
    III: {
      params: {
        stDeviationMv: 0.14,
        stMorphology: 'concave',
        tAmpMv: 0.22,
      },
    },
    aVR: {
      params: {
        stDeviationMv: -0.18,
        stMorphology: 'flat',
        tAmpMv: -0.22,
      },
      stageNotes: {
        2: 'Lead aVR menunjukkan elevasi segmen PR resiprokal (knuckle sign).',
        4: 'Depresi segmen ST resiprokal (−0,18 mV) di aVR (berlawanan arah dengan elevasi ST difus).',
      },
    },
    aVL: {
      params: {
        stDeviationMv: 0.12,
        stMorphology: 'concave',
        tAmpMv: 0.2,
      },
    },
    aVF: {
      params: {
        stDeviationMv: 0.2,
        stMorphology: 'concave',
        tAmpMv: 0.28,
      },
    },
    V1: {
      params: {
        stDeviationMv: -0.06,
        stMorphology: 'flat',
        tAmpMv: 0.08,
      },
    },
    V2: {
      params: {
        stDeviationMv: 0.18,
        stMorphology: 'concave',
        tAmpMv: 0.42,
      },
    },
    V3: {
      params: {
        stDeviationMv: 0.22,
        stMorphology: 'concave',
        tAmpMv: 0.46,
      },
    },
    V4: {
      params: {
        stDeviationMv: 0.24,
        stMorphology: 'concave',
        tAmpMv: 0.44,
      },
    },
    V5: {
      params: {
        stDeviationMv: 0.22,
        stMorphology: 'concave',
        tAmpMv: 0.36,
      },
      stageNotes: {
        4: 'Elevasi segmen ST konkaf difus di prekordial lateral tanpa inversi gelombang T.',
      },
    },
    V6: {
      params: {
        stDeviationMv: 0.2,
        stMorphology: 'concave',
        tAmpMv: 0.32,
      },
    },
  }),
};

export const PERICARDIAL_EFFUSION_CONDITION: EcgCondition = {
  id: 'pericardial-effusion',
  domainId: 'iskemia-infark-perikardial',
  domainName: 'Iskemia, Infark & Perikardial',
  name: 'Efusi Perikardial Masif',
  noteReferencePath: 'src/notes/3.5 Efusi Perikardial.md',
  heartRateBpm: 112,
  defaultLead: 'II',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'Takikardia sinus kompensatori memicu depolarisasi atrium cepat, namun voltasenya teredam cairan.',
      whatHappensInHeart:
        'Stimulasi simpatis memicu Nodus SA melepaskan impuls lebih cepat untuk mempertahankan curah jantung di tengah kompresi ruang atrium oleh cairan perikardial.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P dengan laju takikardia sinus (> 100 bpm) yang beramplitudo kecil/kerdil (+0,08 mV di Lead II).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan kecepatan fisiologis normal.',
      whatHappensInHeart:
        'Konduksi impuls melintasi AV junction dan berkas His berlangsung normal tanpa hambatan struktural.',
      whyEcgLooksLikeThis:
        'Tercatat garis datar isoelektrik segmen PR dengan interval PR yang berada dalam batas normal.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      vectors: [
        {
          id: 'vec-effusion-low',
          label: 'Vektor Teredam & Berayun (Low Voltage)',
          x1: 284,
          y1: 256,
          x2: 314,
          y2: 296,
          color: '#dc2626',
          dashed: true,
        },
      ],
      heartStatusCaption:
        'Massa cairan efusi meredam magnitudo vektor listrik dan membuat jantung berayun di dalam kantung perikardium.',
      whatHappensInHeart:
        'Kedua ventrikel terdepolarisasi normal melalui His-Purkinje, tetapi genangan cairan efusi mengisolasi sinyal listrik menuju permukaan tubuh serta memicu fenomena swinging heart.',
      whyEcgLooksLikeThis:
        'Di Lead II terekam kompleks QRS sempit berdurasi normal namun bervoltase sangat rendah (≤ 5 mm di semua lead ekstremitas; ≤ 10 mm di prekordial) yang pada strip kontinu sering berayun tinggi-pendek (electrical alternans).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Segmen ST tetap isoelektrik dengan gelombang T yang mendatar/beramplitudo rendah secara difus.',
      whatHappensInHeart:
        'Seluruh miosit ventrikel menjalani repolarisasi normal di tengah desakan cairan perikardium yang meredam sinyal listrik ke elektroda luar.',
      whyEcgLooksLikeThis:
        'Segmen ST rata di garis isoelektrik dan diikuti gelombang T beramplitudo sangat rendah (+0,08 mV) di Lead II.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          pAmpMv: 0.06,
          qAmpMv: -0.03,
          rAmpMv: 0.3,
          sAmpMv: -0.05,
          tAmpMv: 0.08,
        },
      },
      II: {
        params: {
          pAmpMv: 0.08,
          qAmpMv: -0.03,
          rAmpMv: 0.34,
          sAmpMv: -0.06,
          tAmpMv: 0.08,
        },
        stageNotes: {
          1: 'Gelombang P rendah (+0,08 mV) dengan laju takikardia sinus (112 bpm).',
          3: 'Voltase QRS rendah mencolok (+0,34 mV, ≤ 5 mm) dibanding garis acuan Normal; pada rekaman strip panjang tampak variasi beat-to-beat (electrical alternans).',
          4: 'Segmen ST isoelektrik dan gelombang T mendatar (+0,08 mV).',
        },
      },
      III: {
        params: {
          pAmpMv: 0.05,
          qAmpMv: -0.02,
          rAmpMv: 0.2,
          sAmpMv: -0.05,
          tAmpMv: 0.05,
        },
      },
      aVR: {
        params: {
          pAmpMv: -0.06,
          qAmpMv: -0.06,
          rAmpMv: 0.04,
          sAmpMv: -0.28,
          tAmpMv: -0.07,
        },
      },
      aVL: {
        params: {
          pAmpMv: 0.04,
          qAmpMv: -0.02,
          rAmpMv: 0.18,
          sAmpMv: -0.04,
          tAmpMv: 0.04,
        },
      },
      aVF: {
        params: {
          pAmpMv: 0.06,
          qAmpMv: -0.02,
          rAmpMv: 0.26,
          sAmpMv: -0.05,
          tAmpMv: 0.06,
        },
      },
      V1: {
        params: {
          pAmpMv: 0.05,
          rAmpMv: 0.1,
          sAmpMv: -0.34,
          tAmpMv: 0.04,
        },
      },
      V2: {
        params: {
          pAmpMv: 0.05,
          rAmpMv: 0.18,
          sAmpMv: -0.46,
          tAmpMv: 0.08,
        },
      },
      V3: {
        params: {
          pAmpMv: 0.06,
          rAmpMv: 0.32,
          sAmpMv: -0.34,
          tAmpMv: 0.1,
        },
      },
      V4: {
        params: {
          pAmpMv: 0.06,
          rAmpMv: 0.54,
          sAmpMv: -0.18,
          tAmpMv: 0.1,
        },
      },
      V5: {
        params: {
          pAmpMv: 0.06,
          rAmpMv: 0.56,
          sAmpMv: -0.1,
          tAmpMv: 0.09,
        },
        stageNotes: {
          3: 'Amplitudo total QRS di prekordial teredam hingga ≤ 10 mm (< 1,0 mV).',
        },
      },
      V6: {
        params: {
          pAmpMv: 0.05,
          rAmpMv: 0.44,
          sAmpMv: -0.06,
          tAmpMv: 0.07,
        },
      },
    },
    { qrsDurationMs: 80, qtIntervalMs: 330 },
  ),
};

export const SINUS_ARREST_CONDITION: EcgCondition = {
  id: 'sinus-arrest',
  domainId: 'bradiaritmia-blok-av',
  domainName: 'Bradiaritmia & Blok AV',
  name: 'Sinus Arrest & Junctional Escape',
  noteReferencePath: 'src/notes/4.1 Sinus Arrest.md',
  heartRateBpm: 45,
  defaultLead: 'II',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      activeParts: ['sa-node'],
      vectors: [],
      heartStatusCaption:
        'SA Node gagal meletup (sinus arrest) sehingga atrium mengalami keheningan elektrik tanpa gelombang P.',
      whatHappensInHeart:
        'Nodus SA mengalami kegagalan pembentukan impuls spontan (pacemaker failure) atau impuls terblokir keluar dari nodus (SA exit block), membuat atrium tetap hening.',
      whyEcgLooksLikeThis:
        'Gelombang P sinus normal yang seharusnya muncul menghilang total di Lead II, menghasilkan garis datar isoelektrik panjang (jeda/pause sinus).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      activeParts: ['av-node'],
      vectors: [],
      heartStatusCaption:
        'Hilangnya overdrive suppression membebaskan AV junction untuk berdepolarisasi spontan sebagai penyelamat.',
      whatHappensInHeart:
        'Ketiadaan impuls dari atrium membebaskan AV junction dari penekanan fisiologis, sehingga sel pacu cadangan perlahan mencapai ambang letup (35–60 bpm).',
      whyEcgLooksLikeThis:
        'Garis datar isoelektrik berlanjut tanpa gelombang P sinus selama jeda penyelamatan hingga fokus junctional melepaskan impuls lolos.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      activeParts: [
        'av-node',
        'his-bundle',
        'rbb',
        'lbb',
        'purkinje',
        'right-ventricle',
        'left-ventricle',
      ],
      vectors: [
        {
          id: 'vec-escape-qrs',
          label: 'Irama Lolos Junctional (His-Purkinje Normal)',
          x1: 276,
          y1: 230,
          x2: 318,
          y2: 330,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Impuls lolos dari AV junction turun melalui berkas His & Purkinje secara sinkron (QRS sempit).',
      whatHappensInHeart:
        'Pusat pacemaker cadangan di AV junction melepaskan impuls lolos yang meluncur normal menuruni berkas His dan kedua cabang berkas menuju seluruh ventrikel.',
      whyEcgLooksLikeThis:
        'Di Lead II terekam kompleks QRS penyelamat (escape beat) yang muncul lambat (45 bpm) namun tetap berdurasi sempit normal (< 0,10 dtk).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      activeParts: ['right-ventricle', 'left-ventricle', 'right-atrium', 'left-atrium'],
      vectors: [
        {
          id: 'vec-escape-repol',
          label: 'Repolarisasi Ventrikel Normal',
          x1: 298,
          y1: 318,
          x2: 280,
          y2: 256,
          color: '#059669',
        },
        {
          id: 'vec-escape-retro-p',
          label: 'P Retrograd (Kaudokranial ke Atrium)',
          x1: 266,
          y1: 184,
          x2: 214,
          y2: 118,
          color: '#d97706',
          dashed: true,
        },
      ],
      heartStatusCaption:
        'Ventrikel berepolarisasi normal; aktivasi atrium retrograd dari AV junction dapat membentuk pseudo-S di Lead II.',
      whatHappensInHeart:
        'Ventrikel pulih normal dari epikardium ke endokardium, sementara impuls junctional yang merambat mundur ke atas (retrograd) mengaktivasi atrium dari bawah ke atas.',
      whyEcgLooksLikeThis:
        'Segmen ST tetap isoelektrik dan diikuti gelombang T positif normal di Lead II, sering disertai lekukan negatif akhir QRS (pseudo-S) dari gelombang P retrograd.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: { params: { pAmpMv: 0 } },
      II: {
        params: {
          pAmpMv: 0,
          sAmpMv: -0.22,
          sDurationMs: 28,
          tAmpMv: 0.24,
        },
        stageNotes: {
          1: 'Gelombang P sinus menghilang total (datar) akibat kegagalan letupan SA Node.',
          2: 'Jeda datar memanjang sebelum AV junction melepaskan impuls lolos.',
          3: 'Kompleks QRS sempit normal (0,08 dtk) berasal dari fokus penyelamat AV junction pada laju lambat (45 bpm); lekukan S kecil di akhir QRS mencerminkan pseudo-S P retrograd.',
          4: 'Segmen ST isoelektrik dan gelombang T positif normal.',
        },
      },
      III: { params: { pAmpMv: 0, sAmpMv: -0.18, sDurationMs: 26 } },
      aVR: { params: { pAmpMv: 0 } },
      aVL: { params: { pAmpMv: 0 } },
      aVF: { params: { pAmpMv: 0, sAmpMv: -0.2, sDurationMs: 26 } },
      V1: { params: { pAmpMv: 0, pTerminalAmpMv: 0 } },
      V2: { params: { pAmpMv: 0 } },
      V3: { params: { pAmpMv: 0 } },
      V4: { params: { pAmpMv: 0 } },
      V5: { params: { pAmpMv: 0 } },
      V6: { params: { pAmpMv: 0 } },
    },
    { pAmpMv: 0, pDurationMs: 90, prIntervalMs: 170, qrsDurationMs: 84, qtIntervalMs: 410 },
  ),
};

export const FIRST_DEGREE_AV_BLOCK_CONDITION: EcgCondition = {
  id: 'av-block-1',
  domainId: 'bradiaritmia-blok-av',
  domainName: 'Bradiaritmia & Blok AV',
  name: 'Blok AV Derajat 1',
  noteReferencePath: 'src/notes/4.2 Blok AV Derajat 1.md',
  heartRateBpm: 68,
  defaultLead: 'II',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik secara teratur yang menyebar normal melintasi miokardium atrium kanan dan kiri ke arah inferior-anterior.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P sinus normal dengan defleksi positif halus dan durasi fisiologis (< 0,12 dtk) di Lead II.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Impuls mengalami perlambatan konduksi konstan di AV Node (interval PR > 0,20 dtk) sebelum masuk ke Bundle of His.',
      whatHappensInHeart:
        'Impuls listrik tertahan lebih lama di dalam Nodus AV akibat peningkatan masa refrakter atau penurunan konduksi kanal kalsium lambat, namun tetap diteruskan seluruhnya (1:1) ke berkas His.',
      whyEcgLooksLikeThis:
        'Garis datar isoelektrik segmen PR terulur memanjang secara konstan sehingga interval PR total melebihi 0,20 detik (0,28 dtk) tanpa ada denyut yang hilang.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Setelah melewati AV Node, impuls meluncur cepat lewat His-Purkinje (QRS sempit 1:1).',
      whatHappensInHeart:
        'Begitu berhasil melintasi Nodus AV, sinyal listrik turun cepat melalui berkas His, RBB/LBB, dan serabut Purkinje untuk mendepolarisasi kedua ventrikel secara serempak.',
      whyEcgLooksLikeThis:
        'Terbentuk kompleks QRS berdurasi sempit normal (< 0,10 dtk) yang bergeser ke kanan pada ujung segmen PR memanjang, mempertahankan rasio konduksi 1:1 di Lead II.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Repolarisasi ventrikel berlangsung normal pada segmen ST isoelektrik dan gelombang T.',
      whatHappensInHeart:
        'Seluruh miosit ventrikel menjalani pemulihan listrik normal dari lapisan epikardium ke endokardium tanpa distorsi primer.',
      whyEcgLooksLikeThis:
        'Segmen ST kembali rata pada garis isoelektrik diikuti gelombang T positif normal yang konkordan di Lead II.',
    },
  },
  leads: buildDerivedLeads(
    {
      II: {
        params: {},
        stageNotes: {
          1: 'Gelombang P sinus normal (+0,22 mV) sebelum jeda AV memanjang.',
          2: 'Interval PR memanjang konstan (0,28 dtk; > 0,20 dtk / > 1 kotak besar) akibat perlambatan di AV Node.',
          3: 'Kompleks QRS sempit normal (0,08 dtk) tetap muncul 1:1 di ujung segmen PR yang terulur.',
          4: 'Segmen ST isoelektrik dan gelombang T positif normal.',
        },
      },
    },
    { prIntervalMs: 280, qtIntervalMs: 380 },
  ),
};

export const MOBITZ_I_CONDITION: EcgCondition = {
  id: 'mobitz-1',
  domainId: 'bradiaritmia-blok-av',
  domainName: 'Bradiaritmia & Blok AV',
  name: 'Blok AV Derajat 2 Tipe Mobitz I (Wenckebach)',
  noteReferencePath: 'src/notes/4.3 Mobitz I.md',
  heartRateBpm: 58,
  defaultLead: 'II',
  blockedTarget: 'av-node',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node melepaskan impuls secara teratur (interval P-P konstan) mendepolarisasi kedua atrium.',
      whatHappensInHeart:
        'Nodus SA bekerja normal dan stabil, mendepolarisasi miokardium atrium kanan dan kiri secara reguler dengan interval P-P yang konstan.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P sinus positif halus di Lead II yang muncul tepat waktu pada setiap siklus.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Konduksi dekremental di AV Node membuat jeda segmen PR memanjang bertahap dari denyut ke denyut.',
      whatHappensInHeart:
        'Sel-sel Nodus AV mengalami kelelahan refrakter relatif bertahap (decremental conduction); setiap impuls atrium berikutnya tiba sebelum nodus pulih penuh sehingga transmisi kian melambat.',
      whyEcgLooksLikeThis:
        'Segmen PR terulur makin panjang secara progresif pada denyut berturut-turut sebelum akhirnya satu gelombang P gagal menembus AV Node.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      activeParts: ['av-node', 'his-bundle', 'rbb', 'lbb', 'purkinje', 'right-ventricle', 'left-ventricle'],
      heartStatusCaption:
        'Saat mencapai refrakter absolut, AV Node memblokir impuls (dropped QRS); denyut yang lolos tetap ber-QRS sempit.',
      whatHappensInHeart:
        'Impuls yang tiba pada fase refrakter absolut Nodus AV terblokir total sebelum memasuki berkas His; sementara denyut sebelumnya yang lolos tetap menuruni His-Purkinje secara simetris.',
      whyEcgLooksLikeThis:
        'Pada denyut terblokir tampak gelombang P tanpa diikuti QRS (dropped beat) yang mengakhiri kelompok denyut (group beating); denyut yang terhantar tetap memiliki kompleks QRS sempit (< 0,10 dtk).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Jeda pasca-blok memulihkan Nodus AV sehingga siklus berikutnya dimulai ulang dengan PR terpendek.',
      whatHappensInHeart:
        'Ventrikel berepolarisasi normal, dan jeda henti konduksi memberi waktu bagi Nodus AV untuk memulihkan masa refrakternya secara penuh kembali ke kondisi awal.',
      whyEcgLooksLikeThis:
        'Segmen ST datar isoelektrik dengan gelombang T positif normal di Lead II; denyut pertama setelah jeda selalu memiliki interval PR lebih pendek daripada denyut tepat sebelum blok.',
    },
  },
  leads: buildDerivedLeads(
    {
      II: {
        params: {},
        stageNotes: {
          1: 'Gelombang P sinus muncul teratur dengan interval P-P konstan.',
          2: 'Interval PR memanjang progresif (0,26 dtk sebelum blok) akibat kelelahan konduksi dekremental di AV Node.',
          3: 'Gelombang P puncak siklus gagal dihantarkan (dropped QRS); denyut yang lolos tetap berdurasi QRS sempit (0,08 dtk).',
          4: 'Pasca-jeda, AV Node pulih sehingga interval PR kembali memendek pada awal kelompok denyut baru.',
        },
      },
    },
    { prIntervalMs: 260, qtIntervalMs: 380 },
  ),
};

export const MOBITZ_II_CONDITION: EcgCondition = {
  id: 'mobitz-2',
  domainId: 'bradiaritmia-blok-av',
  domainName: 'Bradiaritmia & Blok AV',
  name: 'Blok AV Derajat 2 Tipe Mobitz II',
  noteReferencePath: 'src/notes/4.4 Mobitz II.md',
  heartRateBpm: 52,
  defaultLead: 'II',
  blockedTarget: 'rbb',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node melepaskan impuls secara teratur (interval P-P konstan) mendepolarisasi kedua atrium.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik otomatis yang stabil dan menyebar normal melintasi miokardium atrium kanan dan kiri.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P sinus positif halus di Lead II yang muncul tepat waktu dengan jarak antar-P konstan.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dengan jeda konstan; tidak ada pemanjangan PR bertahap sebelum blok.',
      whatHappensInHeart:
        'Nodus AV sehat dan menghantarkan impuls dengan kecepatan tetap, namun sinyal listrik menuju jaringan infranodal (His-Purkinje) yang mengalami kerusakan struktural.',
      whyEcgLooksLikeThis:
        'Tercatat segmen PR isoelektrik dengan durasi interval PR yang persis sama (konstan, 0,16 dtk) di setiap denyut yang terkonduksi.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      activeParts: ['his-bundle', 'lbb', 'purkinje', 'left-ventricle', 'right-ventricle'],
      vectors: [
        {
          id: 'vec-mobitz2-lv',
          label: '1. Konduksi Infranodal Tersisa (LV via LBB)',
          x1: 284,
          y1: 240,
          x2: 344,
          y2: 318,
          color: '#ea580c',
          dashed: true,
        },
        {
          id: 'vec-mobitz2-rv',
          label: '2. Blok Cabang Berkas / Risiko All-or-None',
          x1: 274,
          y1: 268,
          x2: 204,
          y2: 264,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Sistem infranodal bekerja all-or-none: dapat gagal mendadak (dropped QRS) dan denyut yang lolos ber-QRS lebar.',
      whatHappensInHeart:
        'Karena kerusakan berada di distal His / cabang berkas bilateral, impuls sesekali terblokir mendadak total (all-or-none failure), sementara denyut yang berhasil lolos menyebar asinkron lewat jalur berkas yang tersisa.',
      whyEcgLooksLikeThis:
        'Pada saat terblokir tampak gelombang P tanpa diikuti QRS (dropped beat) secara tiba-tiba; denyut yang terkonduksi umumnya memiliki QRS lebar (≥ 0,12 dtk) berpola blok cabang berkas.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Setelah jeda, konduksi kembali dengan interval PR yang persis sama tanpa pemendekan siklus.',
      whatHappensInHeart:
        'Ventrikel berepolarisasi sesuai jalur aktivasi cabang berkasnya, lalu impuls sinus berikutnya melintas kembali lewat jalur infranodal yang sama persis seperti sebelum jeda.',
      whyEcgLooksLikeThis:
        'Gelombang T menunjukkan diskordansi ringan sesuai blok cabang berkas penyerta, dan denyut pertama setelah jeda memiliki interval PR identik dengan denyut sebelum jeda (pembeda kunci dari Mobitz I).',
    },
  },
  leads: buildDerivedLeads(
    {
      I: { params: { sAmpMv: -0.34, sDurationMs: 60 } },
      II: {
        params: {
          sAmpMv: -0.32,
          sDurationMs: 58,
          tAmpMv: 0.22,
        },
        stageNotes: {
          1: 'Gelombang P sinus muncul teratur tepat waktu (interval P-P konstan).',
          2: 'Interval PR konstan (0,16 dtk) sebelum maupun sesudah jeda, tanpa pemanjangan bertahap.',
          3: 'Konduksi infranodal berisiko dropped QRS mendadak (all-or-none); denyut yang terkonduksi melebar (0,14 dtk) dengan gelombang S terminal tumpul akibat blok cabang berkas penyerta.',
          4: 'Pasca-jeda, interval PR tetap konstan identik dengan siklus sebelumnya.',
        },
      },
      V1: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.26,
          rDurationMs: 22,
          sAmpMv: -0.3,
          sDurationMs: 28,
          rPrimeAmpMv: 0.82,
          stDeviationMv: -0.08,
          stMorphology: 'downsloping',
          tAmpMv: -0.24,
        },
        stageNotes: {
          3: 'Pola blok cabang berkas (rSR\' lebar) yang sering menyertai lesi infranodal Mobitz II.',
        },
      },
      V5: { params: { sAmpMv: -0.32, sDurationMs: 56 } },
      V6: { params: { sAmpMv: -0.36, sDurationMs: 60 } },
    },
    { prIntervalMs: 160, qrsDurationMs: 136, qtIntervalMs: 410 },
  ),
};

export const THIRD_DEGREE_AV_BLOCK_CONDITION: EcgCondition = {
  id: 'av-block-3',
  domainId: 'bradiaritmia-blok-av',
  domainName: 'Bradiaritmia & Blok AV',
  name: 'Blok AV Derajat 3 (Total)',
  noteReferencePath: 'src/notes/4.5 Blok AV Derajat 3.md',
  heartRateBpm: 42,
  defaultLead: 'II',
  blockedTarget: 'av-node',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node berdenyut mandiri teratur mendepolarisasi atrium tanpa kendali atas ventrikel.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls otomatis secara stabil dan teratur, mendepolarisasi atrium kanan dan kiri secara normal meskipun sinyalnya tidak dapat menembus ke ventrikel.',
      whyEcgLooksLikeThis:
        'Terbentuk deretan gelombang P sinus yang teratur (interval P-P konstan) di Lead II, melangkah independen dan sesekali dapat bertumpuk di atas segmen ST atau gelombang T.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      heartStatusCaption:
        'Blok AV total memutus komunikasi listrik atrium-ventrikel (disosiasi AV lengkap; PR bervariasi total).',
      whatHappensInHeart:
        'Seluruh impuls dari atrium terhenti total di persimpangan AV atau sistem infranodal, sehingga ruang atas dan bawah jantung berdenyut dengan pacemaker masing-masing.',
      whyEcgLooksLikeThis:
        'Tidak ada hubungan konduksi konstan antara gelombang P dan kompleks QRS (interval PR tampak berubah-ubah acak pada rekaman kontinu).',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      activeParts: ['his-bundle', 'rbb', 'lbb', 'purkinje', 'right-ventricle', 'left-ventricle'],
      vectors: [
        {
          id: 'vec-av3-escape',
          label: 'Irama Lolos Mandiri (40–60 bpm, Terpisah dari P)',
          x1: 276,
          y1: 230,
          x2: 318,
          y2: 330,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Pacemaker cadangan di bawah blok mengambil alih ventrikel secara lambat dan teratur (R-R konstan).',
      whatHappensInHeart:
        'Pusat pacemaker lolos di bawah lokasi blok (AV junction atau serabut Purkinje ventrikel) melepaskan impuls otomatis penyelamat secara mandiri dengan laju intrinsik yang lambat.',
      whyEcgLooksLikeThis:
        'Di Lead II terekam kompleks QRS bradikardia teratur (42 bpm; sempit pada junctional escape atau lebar bizar bila berasal dari fokus idioventrikular < 40 bpm) terpisah total dari gelombang P.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Repolarisasi ventrikel pada bradikardia berat memperpanjang interval QT dan meningkatkan risiko Torsades de Pointes.',
      whatHappensInHeart:
        'Laju ventrikel yang sangat lambat memperlambat repolarisasi seluler dan memperpanjang durasi potensial aksi miokardium ventrikel.',
      whyEcgLooksLikeThis:
        'Segmen ST dan gelombang T mengikuti morfologi fokus lolosnya dengan pemanjangan interval QT yang nyata (0,49 dtk) serta gelombang U menonjol, menciptakan kerentanan aritmia maligna.',
    },
  },
  leads: buildDerivedLeads(
    {
      II: {
        params: {},
        stageNotes: {
          1: 'Gelombang P sinus (+0,22 mV) berbaris teratur mandiri (interval P-P lebih cepat daripada R-R).',
          2: 'Blok AV total memutus konduksi atrium-ke-ventrikel sehingga tidak ada hubungan PR yang tetap (disosiasi AV).',
          3: 'Kompleks QRS lolos yang sangat lambat dan teratur (42 bpm; sempit 0,09 dtk pada ritme lolos junctional).',
          4: 'Interval QT memanjang nyata (0,49 dtk) disertai gelombang U ringan akibat bradikardia berat.',
        },
      },
    },
    { prIntervalMs: 240, qrsDurationMs: 88, qtIntervalMs: 490, uAmpMv: 0.08 },
  ),
};

export const PAC_CONDITION: EcgCondition = {
  id: 'pac',
  domainId: 'takiaritmia',
  domainName: 'Takiaritmia',
  name: 'Premature Atrial Contraction (PAC)',
  noteReferencePath: 'src/notes/5.1 PAC.md',
  heartRateBpm: 98,
  defaultLead: 'II',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      vectors: [
        {
          id: 'vec-pac-ectopic',
          label: 'Vektor P Ektopik Prematur (P\' Berubah Arah)',
          x1: 320,
          y1: 158,
          x2: 236,
          y2: 112,
          color: '#d97706',
        },
      ],
      heartStatusCaption:
        'Fokus ektopik atrium meletup prematur sebelum jadwal SA Node, menghasilkan gelombang P\' abnormal yang lebih dini.',
      whatHappensInHeart:
        'Sebuah fokus ektopik di dinding atrium berdepolarisasi spontan lebih awal mendahului Nodus SA, menyebarkan impuls melintasi kedua atrium sekaligus me-reset siklus Nodus SA.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P prematur (P\') yang datang lebih dini dengan morfologi berbeda dari P sinus normal (dapat terbalik/negatif −0,16 mV di Lead II bila berasal dari atrium inferior, atau menimpa T sebelumnya).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls ektopik memasuki AV Node; PR dapat normal, memendek, atau memanjang bila AV Node masih refrakter relatif.',
      whatHappensInHeart:
        'Impuls prematur menembus AV junction; apabila Nodus AV belum pulih sempurna (masa refrakter relatif), konduksi melambat secara dekremental (atau terblokir total pada blocked PAC).',
      whyEcgLooksLikeThis:
        'Tercatat segmen PR dengan durasi interval PR yang dapat sedikit bergeser (0,14–0,22 dtk) mengikuti waktu kedatangan impuls ektopik di Nodus AV.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Impuls yang lolos melintasi AV Node turun simetris lewat His-Purkinje menghasilkan QRS sempit.',
      whatHappensInHeart:
        'Begitu melewati persimpangan AV, sinyal listrik meluncur cepat melalui berkas His dan sistem Purkinje mengaktivasi kedua ventrikel secara sinkron.',
      whyEcgLooksLikeThis:
        'Di Lead II terekam kompleks QRS berdurasi sempit normal (< 0,10 dtk) dengan kontur identik seperti denyut sinus dasar (kecuali bila terjadi aberasi cabang berkas).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Ventrikel berepolarisasi normal lalu diikuti jeda non-kompensatori (< 2 × P-P) akibat reset Nodus SA.',
      whatHappensInHeart:
        'Miokardium ventrikel menjalani repolarisasi fisiologis normal, sementara Nodus SA yang telah di-reset memulai persiapan letupan baru dari titik awal.',
      whyEcgLooksLikeThis:
        'Segmen ST datar isoelektrik dengan gelombang T normal, diikuti jeda inkomplit (non-kompensatori) sebelum irama sinus reguler kembali berjalan.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: { params: { pAmpMv: 0.08 } },
      II: {
        params: {
          pAmpMv: -0.16,
          pDurationMs: 88,
          pSharpness: 'peaked',
          prIntervalMs: 145,
        },
        stageNotes: {
          1: 'Gelombang P ektopik (P\') muncul prematur dengan polaritas terbalik (−0,16 mV) dibanding gelombang P sinus Normal.',
          2: 'Interval PR denyut ektopik (0,15 dtk) dapat bergeser tergantung tingkat pemulihan AV Node.',
          3: 'Kompleks QRS tetap sempit normal (0,08 dtk) identik dengan denyut sinus.',
          4: 'Segmen ST dan gelombang T normal sebelum jeda non-kompensatori.',
        },
      },
      III: { params: { pAmpMv: -0.14 } },
      aVR: { params: { pAmpMv: 0.14 } },
      aVL: { params: { pAmpMv: 0.06 } },
      aVF: { params: { pAmpMv: -0.14 } },
      V1: { params: { pAmpMv: 0.14, pTerminalAmpMv: 0 } },
    },
    { pDurationMs: 88, prIntervalMs: 145, qrsDurationMs: 82, qtIntervalMs: 360 },
  ),
};

export const PVC_CONDITION: EcgCondition = {
  id: 'pvc',
  domainId: 'takiaritmia',
  domainName: 'Takiaritmia',
  name: 'Premature Ventricular Contraction (PVC)',
  noteReferencePath: 'src/notes/5.2 PVC.md',
  heartRateBpm: 95,
  defaultLead: 'II',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      activeParts: ['sa-node'],
      vectors: [],
      heartStatusCaption:
        'PVC tidak didahului gelombang P ektopik; SA Node tetap berdenyut sesuai jadwal (P sinus sering tertanam di QRS).',
      whatHappensInHeart:
        'Fokus ektopik di miokardium ventrikel meletup prematur sebelum impuls atrium tiba, sementara Nodus SA tetap melepaskan impuls sinusnya secara mandiri.',
      whyEcgLooksLikeThis:
        'Tidak tampak gelombang P mendahului kompleks PVC di Lead II karena P sinus yang berdetak sesuai jadwal sering tertanam (buried) di dalam QRS/T prematur.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      activeParts: ['av-node'],
      vectors: [],
      heartStatusCaption:
        'Tidak ada konduksi anterograd melewati AV Node sebelum PVC; segmen PR tidak terbentuk.',
      whatHappensInHeart:
        'Impuls ektopik berasal langsung dari ventrikel tanpa melewati Nodus AV secara anterograd; refrakteritas Nodus AV umumnya juga menahan penjalaran balik agar tidak me-reset Nodus SA.',
      whyEcgLooksLikeThis:
        'Garis segmen PR sebelum kompleks PVC menghilang sehingga tidak ada interval PR yang dapat diukur.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      activeParts: ['right-ventricle', 'left-ventricle'],
      vectors: [
        {
          id: 'vec-pvc-ectopic',
          label: 'Sebaran Ektopik Ventrikel Asinkron (Miosit-ke-Miosit)',
          x1: 212,
          y1: 284,
          x2: 356,
          y2: 266,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Impuls ektopik menyebar lambat miosit-ke-miosit di luar His-Purkinje menghasilkan QRS lebar bizar (≥ 0,12 dtk).',
      whatHappensInHeart:
        'Aktivasi dimulai dari fokus ektopik dinding ventrikel, merambat lambat antarsel menembus miokardium dan menyeberangi septum untuk mendepolarisasi ventrikel kontralateral secara asinkron.',
      whyEcgLooksLikeThis:
        'Di Lead II terekam kompleks QRS prematur yang melebar (0,15 dtk; ≥ 0,12 dtk) dengan bentuk bizar bertakik dan amplitudo tinggi (+1,56 mV).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      vectors: [
        {
          id: 'vec-pvc-discordant',
          label: 'Repolarisasi Sekunder Diskordan (Berlawanan QRS)',
          x1: 344,
          y1: 274,
          x2: 236,
          y2: 294,
          color: '#d97706',
        },
      ],
      heartStatusCaption:
        'ST-T berlawanan arah dengan QRS (diskordan) dan diikuti jeda kompensatori penuh (2 × P-P).',
      whatHappensInHeart:
        'Depolarisasi asinkron membalik urutan pemulihan listrik miokard ventrikel, sementara Nodus SA yang tidak terganggu melanjutkan ritmenya pada siklus sinus berikutnya.',
      whyEcgLooksLikeThis:
        'Segmen ST mengalami depresi (−0,18 mV) dan gelombang T terbalik (−0,44 mV) berlawanan arah dengan QRS positif, disusul jeda kompensatori penuh pada strip kontinu.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          pAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 1.18,
          rDurationMs: 118,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.14,
          stMorphology: 'downsloping',
          tAmpMv: -0.34,
        },
      },
      II: {
        params: {
          pAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 1.56,
          rDurationMs: 126,
          rNotched: true,
          sAmpMv: -0.24,
          sDurationMs: 26,
          stDeviationMv: -0.18,
          stMorphology: 'downsloping',
          tAmpMv: -0.44,
          tDurationMs: 180,
        },
        stageNotes: {
          1: 'Tidak ada gelombang P ektopik sebelum PVC (P sinus sering tertanam di dalam QRS).',
          2: 'Tidak terbentuk segmen PR sebelum kompleks ventrikel prematur.',
          3: 'Kompleks QRS melebar bizar (+1,56 mV; 0,15 dtk) bertakik akibat rambatan lambat miosit-ke-miosit.',
          4: 'Diskordansi sekunder: depresi ST (−0,18 mV) dan inversi T (−0,44 mV) berlawanan arah dengan QRS dominan.',
        },
      },
      III: {
        params: {
          pAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 0.85,
          rDurationMs: 112,
          rNotched: true,
          sAmpMv: -0.2,
          stDeviationMv: -0.1,
          tAmpMv: -0.26,
        },
      },
      aVR: {
        params: {
          pAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 0.1,
          sAmpMv: -1.35,
          sDurationMs: 132,
          stDeviationMv: 0.16,
          tAmpMv: 0.36,
        },
      },
      aVL: {
        params: {
          pAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 0.65,
          rDurationMs: 96,
          rNotched: true,
          sAmpMv: -0.2,
          stDeviationMv: -0.08,
          tAmpMv: -0.18,
        },
      },
      aVF: {
        params: {
          pAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 1.24,
          rDurationMs: 120,
          rNotched: true,
          sAmpMv: -0.22,
          stDeviationMv: -0.14,
          tAmpMv: -0.34,
        },
      },
      V1: {
        params: {
          pAmpMv: 0,
          pTerminalAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 0,
          sAmpMv: -1.62,
          sDurationMs: 146,
          stDeviationMv: 0.22,
          stMorphology: 'concave',
          tAmpMv: 0.42,
        },
      },
      V2: {
        params: {
          pAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 0.12,
          sAmpMv: -1.48,
          sDurationMs: 136,
          stDeviationMv: 0.18,
          tAmpMv: 0.36,
        },
      },
      V5: {
        params: {
          pAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 1.38,
          rDurationMs: 124,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.14,
          tAmpMv: -0.32,
        },
      },
      V6: {
        params: {
          pAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 1.28,
          rDurationMs: 122,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.12,
          tAmpMv: -0.28,
        },
      },
    },
    { pAmpMv: 0, prIntervalMs: 120, qrsDurationMs: 152, qtIntervalMs: 420 },
  ),
};

export const PSVT_CONDITION: EcgCondition = {
  id: 'psvt',
  domainId: 'takiaritmia',
  domainName: 'Takiaritmia',
  name: 'Paroxysmal Supraventricular Tachycardia (PSVT / AVNRT)',
  noteReferencePath: 'src/notes/5.3 PSVT.md',
  heartRateBpm: 150,
  defaultLead: 'V1',
  blockedTarget: 'av-reentry',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      activeParts: ['av-node'],
      vectors: [],
      heartStatusCaption:
        'Gelombang P sinus menghilang selama takikardia karena PAC pemicu telah memulai sirkuit re-entri di AV Node.',
      whatHappensInHeart:
        'Cetusan prematur atrium (PAC) mendapati jalur cepat AV masih refrakter sehingga impuls melompat ke jalur lambat (slow pathway), menginisiasi putaran re-entri.',
      whyEcgLooksLikeThis:
        'Tidak tampak gelombang P sinus sebelum QRS di Lead V1; aktivasi atrium selanjutnya terjadi secara retrograd hampir bersamaan dengan ventrikel.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      activeParts: ['av-node'],
      vectors: [],
      heartStatusCaption:
        'Mikrosirkuit re-entri berputar cepat (slow-fast) di dalam AV junction tanpa jeda istirahat segmen PR.',
      whatHappensInHeart:
        'Impuls menuruni slow pathway lalu berbalik arah (re-enter) menaiki fast pathway secara terus-menerus membentuk sirkuit tertutup berkecepatan tinggi (140–220 bpm).',
      whyEcgLooksLikeThis:
        'Garis isoelektrik segmen PR menghilang karena putaran mikrosirkuit nodal berlangsung kontinu seperti metronom.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      activeParts: [
        'av-node',
        'his-bundle',
        'rbb',
        'lbb',
        'purkinje',
        'right-ventricle',
        'left-ventricle',
        'right-atrium',
        'left-atrium',
      ],
      vectors: [
        {
          id: 'vec-psvt-vent',
          label: '1. Ventrikel via His-Purkinje (QRS Sempit)',
          x1: 276,
          y1: 230,
          x2: 318,
          y2: 326,
          color: '#dc2626',
        },
        {
          id: 'vec-psvt-retro',
          label: '2. Atrium Retrograd (Pseudo-r\' di V1)',
          x1: 266,
          y1: 184,
          x2: 214,
          y2: 116,
          color: '#d97706',
          dashed: true,
        },
      ],
      heartStatusCaption:
        'Impuls keluar serempak ke bawah (His-Purkinje -> QRS sempit) dan ke atas secara retrograd (pseudo-r\' di V1).',
      whatHappensInHeart:
        'Setiap putaran sirkuit AVNRT mengirim impuls ke bawah menuruni berkas His ke ventrikel dan ke atas secara retrograd mengaktivasi kedua atrium hampir bersamaan.',
      whyEcgLooksLikeThis:
        'Di Lead V1 terbentuk kompleks QRS sempit (< 0,10 dtk) reguler cepat yang di ujung akhirnya muncul defleksi positif runcing (gelombang pseudo-r\'); di lead inferior tampak pseudo-S.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#059669',
      softBg: '#ecfdf5',
      heartStatusCaption:
        'Repolarisasi berlangsung cepat di antara siklus; blokade AV Node menghentikan sirkuit seketika.',
      whatHappensInHeart:
        'Ventrikel berepolarisasi singkat akibat waktu diastol yang memendek; stimulasi vagal atau adenosin memperpanjang refrakteritas slow pathway untuk memutus sirkuit.',
      whyEcgLooksLikeThis:
        'Dapat dijumpai depresi segmen ST ringan transien di V4–V6 akibat laju cepat, yang pulih segera setelah takikardia berhenti mendadak ke irama sinus.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: { params: { pAmpMv: 0 } },
      II: {
        params: {
          pAmpMv: 0,
          rPrimeAmpMv: -0.22,
          stDeviationMv: -0.05,
        },
        stageNotes: {
          3: 'Tampak defleksi negatif semu (pseudo-S) di ujung akhir QRS sempit akibat aktivasi atrium retrograd.',
        },
      },
      III: { params: { pAmpMv: 0, rPrimeAmpMv: -0.2 } },
      aVR: { params: { pAmpMv: 0, rPrimeAmpMv: 0.2 } },
      aVL: { params: { pAmpMv: 0 } },
      aVF: { params: { pAmpMv: 0, rPrimeAmpMv: -0.2 } },
      V1: {
        params: {
          pAmpMv: 0,
          pTerminalAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 0.14,
          rDurationMs: 22,
          sAmpMv: -0.78,
          sDurationMs: 36,
          rPrimeAmpMv: 0.24,
          stDeviationMv: 0,
          tAmpMv: 0.12,
          tDurationMs: 110,
        },
        stageNotes: {
          1: 'Gelombang P sinus menghilang karena tertanam/tergantikan aktivasi retrograd.',
          2: 'Putaran re-entri di AV junction berlangsung tanpa segmen PR isoelektrik.',
          3: 'Kompleks QRS sempit reguler cepat dengan gelombang pseudo-r\' (+0,24 mV) di ekor QRS khas AVNRT.',
          4: 'Repolarisasi singkat di antara denyut cepat; responsif terhadap manuver vagal/adenosin.',
        },
      },
      V2: { params: { pAmpMv: 0, rPrimeAmpMv: 0.14 } },
      V3: { params: { pAmpMv: 0 } },
      V4: { params: { pAmpMv: 0, stDeviationMv: -0.08, stMorphology: 'downsloping' } },
      V5: {
        params: { pAmpMv: 0, stDeviationMv: -0.09, stMorphology: 'downsloping' },
        stageNotes: {
          4: 'Depresi segmen ST horizontal/downsloping transien akibat laju takikardia tinggi.',
        },
      },
      V6: { params: { pAmpMv: 0, stDeviationMv: -0.08, stMorphology: 'downsloping' } },
    },
    { pAmpMv: 0, pDurationMs: 60, prIntervalMs: 70, qrsDurationMs: 78, qtIntervalMs: 240, tDurationMs: 110 },
  ),
};

export const ATRIAL_FLUTTER_CONDITION: EcgCondition = {
  id: 'atrial-flutter',
  domainId: 'takiaritmia',
  domainName: 'Takiaritmia',
  name: 'Atrial Flutter (2:1 Block)',
  noteReferencePath: 'src/notes/5.4 Atrial Flutter.md',
  heartRateBpm: 150,
  defaultLead: 'II',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      activeParts: ['right-atrium', 'left-atrium'],
      vectors: [
        {
          id: 'vec-afl-cti',
          label: 'Makro-Reentri CTI Counterclockwise (Superior-Kiri)',
          x1: 256,
          y1: 184,
          x2: 196,
          y2: 108,
          color: '#2563eb',
        },
      ],
      heartStatusCaption:
        'Sirkuit makro-reentri di atrium kanan (CTI) berputar kontinu ~300 bpm menghasilkan gelombang F gigi gergaji.',
      whatHappensInHeart:
        'Gelombang listrik berputar tanpa henti mengitari anulus trikuspid dan isthmus kavotrikuspid (counterclockwise ~300 putaran/menit), dengan resultan vektor netto mengarah ke superior-kiri.',
      whyEcgLooksLikeThis:
        'Di Lead II terekam gelombang F kontinu berbentuk gigi gergaji (sawtooth) dengan defleksi negatif tajam (−0,24 mV) tanpa garis datar isoelektrik sejati.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Nodus AV bertindak sebagai filter biologis (blok 2:1) yang hanya meloloskan setengah impuls ke ventrikel.',
      whatHappensInHeart:
        'Bombardir impuls atrium ~300 bpm membentur masa refrakter fisiologis Nodus AV, sehingga sebagian besar gelombang flutter tertahan dan hanya rasio 2:1 (atau lebih tinggi) yang lolos ke berkas His.',
      whyEcgLooksLikeThis:
        'Segmen PR isoelektrik normal menghilang karena undulasi gelombang F terus berlangsung, dengan konduksi teratur 2:1 menghasilkan laju ventrikel ~150 bpm.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Impuls yang lolos menembus AV Node mengaktivasi kedua ventrikel lewat His-Purkinje (QRS sempit teratur).',
      whatHappensInHeart:
        'Setiap impuls atrium yang berhasil melewati saringan Nodus AV meluncur cepat menuruni berkas His dan cabang Purkinje secara sinkron.',
      whyEcgLooksLikeThis:
        'Terbentuk kompleks QRS berdurasi sempit normal (< 0,10 dtk) yang teratur pada ~150 bpm di atas gelombang flutter.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Repolarisasi ventrikel (ST-T) menyatu dengan gelombang F berikutnya sehingga batas baseline kabur.',
      whatHappensInHeart:
        'Miokardium ventrikel menjalani repolarisasi sementara sirkuit makro-reentri di atrium terus berputar tanpa jeda istirahat global.',
      whyEcgLooksLikeThis:
        'Segmen ST dan puncak gelombang T di Lead II terdistorsi/berfusi dengan gelombang F berikutnya (manuver vagal/adenosin dapat menyingkap pola sawtooth).',
    },
  },
  leads: buildDerivedLeads(
    {
      II: {
        params: {
          pAmpMv: -0.24,
          pDurationMs: 110,
          pSharpness: 'peaked',
          prIntervalMs: 120,
          tAmpMv: 0.14,
          tDurationMs: 110,
        },
        stageNotes: {
          1: 'Gelombang F negatif tajam (−0,24 mV) khas pola gigi gergaji (sawtooth) menggantikan gelombang P sinus.',
          2: 'Filter AV Node (blok 2:1) menyaring laju atrium ~300 bpm menjadi laju ventrikel ~150 bpm.',
          3: 'Kompleks QRS sempit reguler (0,08 dtk) menandakan aktivasi ventrikel normal via His-Purkinje.',
          4: 'Kontur ST-T berfusi dengan undulasi gelombang F yang berlangsung terus-menerus.',
        },
      },
      III: {
        params: {
          pAmpMv: -0.26,
          pDurationMs: 110,
          pSharpness: 'peaked',
        },
      },
      aVF: {
        params: {
          pAmpMv: -0.22,
          pDurationMs: 110,
          pSharpness: 'peaked',
        },
      },
      V1: {
        params: {
          pAmpMv: 0.18,
          pTerminalAmpMv: 0,
          pSharpness: 'peaked',
          pDurationMs: 100,
        },
        stageNotes: {
          1: 'Gelombang F tampak positif runcing (+0,18 mV) di prekordial kanan V1.',
        },
      },
    },
    { pDurationMs: 105, prIntervalMs: 120, qrsDurationMs: 78, qtIntervalMs: 250, tDurationMs: 110 },
  ),
};

export const ATRIAL_FIBRILLATION_CONDITION: EcgCondition = {
  id: 'atrial-fibrillation',
  domainId: 'takiaritmia',
  domainName: 'Takiaritmia',
  name: 'Atrial Fibrillation (AF)',
  noteReferencePath: 'src/notes/5.5 Atrial Fibrillation.md',
  heartRateBpm: 124,
  defaultLead: 'V1',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      activeParts: ['left-atrium', 'right-atrium'],
      vectors: [
        {
          id: 'vec-af-pv',
          label: 'Mikro-Reentri Multipel Acak (Muara Vena Pulmonalis)',
          x1: 356,
          y1: 132,
          x2: 294,
          y2: 148,
          color: '#2563eb',
          dashed: true,
        },
        {
          id: 'vec-af-ra',
          label: 'Gelombang f Tak Terorganisir',
          x1: 244,
          y1: 142,
          x2: 212,
          y2: 164,
          color: '#d97706',
          dashed: true,
        },
      ],
      heartStatusCaption:
        'Gelombang mikro-reentri multipel berputar acak di kedua atrium (350–600 bpm); tidak ada gelombang P terorganisir.',
      whatHappensInHeart:
        'Letupan ektopik cepat dari muara vena pulmonalis atrium kiri memicu gelombang mikro-reentri multipel yang menyebar acak di seluruh dinding atrium tanpa vektor tunggal terkoordinasi.',
      whyEcgLooksLikeThis:
        'Gelombang P sinus normal lenyap total di Lead V1, digantikan oleh osilasi halus gelombang fibrilasi (gelombang f) dengan amplitudo dan bentuk yang berubah acak.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Konduksi tersembunyi di AV Node menyaring ratusan impuls atrium secara acak; interval PR menghilang.',
      whatHappensInHeart:
        'Ratusan impuls atrium membombardir Nodus AV tiap menit; konduksi dekremental dan concealed conduction di Nodus AV menahan sebagian besar impuls secara tidak teratur.',
      whyEcgLooksLikeThis:
        'Garis datar isoelektrik segmen PR menghilang dan tidak terdapat interval PR terukur karena impuls menembus Nodus AV secara acak.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Impuls yang lolos acak dari AV Node turun lewat His-Purkinje menghasilkan QRS sempit irregularly irregular.',
      whatHappensInHeart:
        'Impuls atrium yang berhasil lolos secara acak melewati saringan Nodus AV meluncur cepat menuruni berkas His dan sistem Purkinje untuk mengaktivasi kedua ventrikel secara simetris.',
      whyEcgLooksLikeThis:
        'Di Lead V1 terekam kompleks QRS berdurasi sempit normal (< 0,10 dtk) pada laju cepat (RVR ~124 bpm) dengan jarak R-R yang pada strip kontinu sepenuhnya tidak teratur (irregularly irregular).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      heartStatusCaption:
        'Repolarisasi ventrikel (ST-T) tampak bergetar halus karena tertimpa osilasi gelombang f yang tak pernah berhenti.',
      whatHappensInHeart:
        'Miokardium ventrikel menjalani repolarisasi di tengah pengisian diastolik yang bervariasi, sementara aktivitas mikro-reentri atrium tetap berlangsung kontinu.',
      whyEcgLooksLikeThis:
        'Segmen ST dan gelombang T di Lead V1–V6 dapat mengalami depresi/pendataran ringan akibat laju cepat dengan kontur repolarisasi yang terdistorsi oleh getaran gelombang f.',
    },
  },
  leads: buildDerivedLeads(
    {
      V1: {
        params: {
          pAmpMv: 0.04,
          pTerminalAmpMv: -0.05,
          pDurationMs: 110,
          pNotched: true,
          stDeviationMv: -0.05,
          tAmpMv: 0.08,
        },
        stageNotes: {
          1: 'Gelombang P sinus lenyap, digantikan getaran halus gelombang f beramplitudo rendah di V1.',
          2: 'Tidak ada segmen PR isoelektrik karena konduksi tersembunyi acak di AV Node.',
          3: 'Kompleks QRS sempit (0,08 dtk) dengan laju RVR cepat (124 bpm); pada strip kontinu jarak R-R bersifat irregularly irregular.',
          4: 'Kontur ST-T tampak bergetar halus akibat tumpukan gelombang f atrium.',
        },
      },
      V4: { params: { pAmpMv: 0, stDeviationMv: -0.06, stMorphology: 'downsloping', tAmpMv: 0.16 } },
      V5: {
        params: { pAmpMv: 0, stDeviationMv: -0.06, stMorphology: 'downsloping', tAmpMv: 0.16 },
        stageNotes: {
          4: 'Depresi ST dan pendataran gelombang T ringan akibat laju ventrikel cepat.',
        },
      },
      V6: { params: { pAmpMv: 0, stDeviationMv: -0.05, stMorphology: 'downsloping', tAmpMv: 0.14 } },
    },
    { pAmpMv: 0, pDurationMs: 90, prIntervalMs: 120, qrsDurationMs: 80, qtIntervalMs: 310, tDurationMs: 130 },
  ),
};

export const VT_CONDITION: EcgCondition = {
  id: 'vt',
  domainId: 'takiaritmia',
  domainName: 'Takiaritmia',
  name: 'Ventricular Tachycardia (VT) Monomorfik',
  noteReferencePath: 'src/notes/5.6 VT.md',
  heartRateBpm: 150,
  defaultLead: 'V1',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      activeParts: ['sa-node'],
      vectors: [],
      heartStatusCaption:
        'SA Node berdenyut lambat mandiri (disosiasi AV) tanpa mengendalikan irama cepat ventrikel.',
      whatHappensInHeart:
        'Nodus SA tetap melepaskan impuls sinus secara teratur dengan lajunya sendiri (60–100 bpm), namun tidak terkoordinasi dengan aktivitas cepat fokus ektopik ventrikel.',
      whyEcgLooksLikeThis:
        'Gelombang P sinus berjalan mandiri di latar belakang (sering terkubur di dalam kompleks QRS lebar VT di Lead V1).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      activeParts: ['av-node'],
      vectors: [],
      heartStatusCaption:
        'AV junction mengalami refrakter akibat bombardir impuls ventrikel; tidak ada segmen PR terukur.',
      whatHappensInHeart:
        'Impuls ventrikel berkecepatan tinggi membuat Nodus AV berada dalam masa refrakter sehingga menghambat sebagian besar impuls atrium (kecuali sesekali capture/fusion beat).',
      whyEcgLooksLikeThis:
        'Segmen PR isoelektrik menghilang sepenuhnya tanpa hubungan konduksi tetap antara gelombang P dan QRS.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      activeParts: ['left-ventricle', 'right-ventricle'],
      vectors: [
        {
          id: 'vec-vt-reentry',
          label: 'Re-entri Ventrikel Kiri ke Anterior-Kanan (Pola RBBB di V1)',
          x1: 344,
          y1: 298,
          x2: 204,
          y2: 254,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Sirkuit re-entri ventrikel meletup cepat (140–200 bpm) menyebar lambat antarsel -> QRS lebar seragam (≥ 0,14 dtk).',
      whatHappensInHeart:
        'Sirkuit makro-reentri di sekitar jaringan parut ventrikel kiri melepaskan impuls cepat secara otonom yang merambat miosit-ke-miosit menembus septum ke arah anterior-kanan.',
      whyEcgLooksLikeThis:
        'Di Lead V1 terekam rentetan QRS lebar (0,15 dtk) bermorfologi R monofasik lebar/bertakik dengan konkordansi positif di V1–V6 dan R awal dominan di aVR.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      vectors: [
        {
          id: 'vec-vt-discordant',
          label: 'Repolarisasi Sekunder Diskordan (Berlawanan QRS)',
          x1: 224,
          y1: 266,
          x2: 336,
          y2: 296,
          color: '#d97706',
        },
      ],
      heartStatusCaption:
        'ST-T berdeviasi berlawanan dengan QRS (diskordan); laju cepat membawa risiko degenerasi ke fibrilasi ventrikel.',
      whatHappensInHeart:
        'Depolarisasi intramiokardial yang kacau membalikkan vektor repolarisasi lokal sementara pemendekan diastol memicu iskemia sekunder.',
      whyEcgLooksLikeThis:
        'Tampak depresi segmen ST (−0,18 mV) dan inversi gelombang T sekunder (−0,38 mV) berlawanan arah dengan R lebar di V1.',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          pAmpMv: 0,
          rAmpMv: 0.45,
          sAmpMv: -1.05,
          sDurationMs: 96,
          stDeviationMv: 0.12,
          tAmpMv: 0.24,
        },
      },
      II: {
        params: {
          pAmpMv: 0,
          rAmpMv: 0.35,
          sAmpMv: -1.18,
          sDurationMs: 102,
          stDeviationMv: 0.14,
          tAmpMv: 0.28,
        },
        stageNotes: {
          3: 'Defleksi dominan negatif di Lead II mencerminkan aksis superior ekstrem (northwest axis) khas asal ventrikel.',
        },
      },
      III: {
        params: {
          pAmpMv: 0,
          rAmpMv: 0.28,
          sAmpMv: -1.24,
          sDurationMs: 106,
          stDeviationMv: 0.14,
          tAmpMv: 0.26,
        },
      },
      aVR: {
        params: {
          pAmpMv: 0,
          rAmpMv: 1.12,
          rDurationMs: 118,
          sAmpMv: -0.15,
          stDeviationMv: -0.14,
          tAmpMv: -0.28,
        },
        stageNotes: {
          3: 'Gelombang R awal dominan tinggi di Lead aVR (kriteria Vereckei positif untuk VT).',
        },
      },
      V1: {
        params: {
          pAmpMv: 0,
          pTerminalAmpMv: 0,
          qAmpMv: 0,
          rAmpMv: 1.48,
          rDurationMs: 120,
          rNotched: true,
          sAmpMv: -0.22,
          sDurationMs: 28,
          stDeviationMv: -0.18,
          stMorphology: 'downsloping',
          tAmpMv: -0.38,
        },
        stageNotes: {
          1: 'Gelombang P sinus independen (disosiasi AV) sering tersembunyi di dalam QRS lebar.',
          2: 'Tidak ada segmen PR terukur akibat refrakteritas AV junction.',
          3: 'QRS lebar monomorfik (+1,48 mV; 0,15 dtk) berbentuk R lebar bertakik khas fokus LV.',
          4: 'Depresi ST (−0,18 mV) dan inversi T sekunder (−0,38 mV) yang diskordan terhadap QRS positif.',
        },
      },
      V2: {
        params: {
          pAmpMv: 0,
          rAmpMv: 1.52,
          rDurationMs: 122,
          rNotched: true,
          sAmpMv: -0.18,
          stDeviationMv: -0.18,
          tAmpMv: -0.36,
        },
      },
      V3: {
        params: {
          pAmpMv: 0,
          rAmpMv: 1.44,
          rDurationMs: 120,
          sAmpMv: -0.14,
          stDeviationMv: -0.16,
          tAmpMv: -0.34,
        },
      },
      V4: {
        params: {
          pAmpMv: 0,
          rAmpMv: 1.36,
          rDurationMs: 118,
          sAmpMv: -0.1,
          stDeviationMv: -0.14,
          tAmpMv: -0.3,
        },
      },
      V5: {
        params: {
          pAmpMv: 0,
          rAmpMv: 1.28,
          rDurationMs: 116,
          sAmpMv: 0,
          stDeviationMv: -0.14,
          tAmpMv: -0.28,
        },
      },
      V6: {
        params: {
          pAmpMv: 0,
          rAmpMv: 1.18,
          rDurationMs: 114,
          sAmpMv: 0,
          stDeviationMv: -0.12,
          tAmpMv: -0.26,
        },
        stageNotes: {
          3: 'Konkordansi positif prekordial (V1–V6 seluruhnya dominan positif) sangat spesifik untuk VT.',
        },
      },
    },
    { pAmpMv: 0, pDurationMs: 40, prIntervalMs: 50, qrsDurationMs: 148, qtIntervalMs: 224, tDurationMs: 60 },
  ),
};

export const VF_CONDITION: EcgCondition = {
  id: 'vf',
  domainId: 'takiaritmia',
  domainName: 'Takiaritmia',
  name: 'Ventricular Fibrillation (VF)',
  noteReferencePath: 'src/notes/5.7 VF.md',
  heartRateBpm: 150,
  defaultLead: 'II',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      activeParts: ['sa-node'],
      vectors: [],
      heartStatusCaption:
        'Gelombang P terorganisir lenyap total; aktivitas listrik atrium tenggelam dalam kekacauan ventrikel.',
      whatHappensInHeart:
        'Kegagalan perfusi koroner mendadak melumpuhkan sinkroni atrium, sementara sinyal sinus kecil yang tersisa tertutup penuh oleh aktivitas listrik kacau ventrikel.',
      whyEcgLooksLikeThis:
        'Tidak tampak gelombang P yang dapat dikenali di Lead II karena permukaan rekaman didominasi oleh osilasi gelombang getar ventrikel.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      activeParts: ['av-node'],
      vectors: [],
      heartStatusCaption:
        'Konduksi nodal terkoordinasi dan garis dasar segmen PR menghilang total.',
      whatHappensInHeart:
        'Sistem transmisi AV junction kehilangan koordinasi fisiologis akibat bombardir potensial aksi kacau dari ventrikel dan kolapsnya sirkulasi koroner.',
      whyEcgLooksLikeThis:
        'Garis datar isoelektrik segmen PR lenyap sepenuhnya tanpa interval PR yang dapat diukur di Lead II.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      activeParts: ['right-ventricle', 'left-ventricle'],
      vectors: [
        {
          id: 'vec-vf-wavelet1',
          label: 'Mikro-Reentri Acak Ventrikel (Kaos Elektrik)',
          x1: 214,
          y1: 282,
          x2: 312,
          y2: 248,
          color: '#dc2626',
          dashed: true,
        },
        {
          id: 'vec-vf-wavelet2',
          label: 'Tabrakan Wavelet Multipel',
          x1: 348,
          y1: 306,
          x2: 248,
          y2: 330,
          color: '#d97706',
          dashed: true,
        },
      ],
      heartStatusCaption:
        'Kaos mikro-reentri multipel membuat ventrikel hanya bergetar (curah jantung = 0); QRS sejati lenyap.',
      whatHappensInHeart:
        'Ratusan gelombang mikro-reentri fungsional bertabrakan secara acak di kedua ventrikel sehingga miokardium hanya berkedut (quivering) tanpa kontraksi mekanis pemompaan.',
      whyEcgLooksLikeThis:
        'Di Lead II tidak ada kompleks QRS sejati; rekaman hanya berupa osilasi undulasi bizar kontinu yang bentuk dan amplitudonya berubah liar (coarse VF).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Diastol listrik menghilang (ST-T melebur ke osilasi); tanpa DC shock cepat akan merosot ke fine VF dan asistol.',
      whatHappensInHeart:
        'Repolarisasi seluler berlangsung kacau tanpa fase pemulihan seragam; deplesi ATP progresif perlahan memadamkan aktivitas listrik miosit.',
      whyEcgLooksLikeThis:
        'Segmen ST dan gelombang T tidak dapat dipisahkan dari osilasi fibrilasi; seiring waktu amplitudo coarse VF akan mengecil menjadi fine VF lalu garis lurus asistol.',
    },
  },
  leads: buildDerivedLeads(
    {
      II: {
        params: {
          pAmpMv: 0,
          qAmpMv: -0.38,
          qDurationMs: 36,
          rAmpMv: 0.64,
          rDurationMs: 56,
          rNotched: true,
          sAmpMv: -0.58,
          sDurationMs: 44,
          rPrimeAmpMv: 0.42,
          stDeviationMv: -0.14,
          stMorphology: 'downsloping',
          tAmpMv: -0.34,
          tDurationMs: 75,
        },
        stageNotes: {
          1: 'Gelombang P terorganisir menghilang total.',
          2: 'Garis dasar isoelektrik segmen PR lenyap.',
          3: 'Tidak ada kompleks QRS sejati; tampak osilasi undulasi kacau coarse VF beramplitudo berubah-ubah.',
          4: 'Hilangnya diastol listrik (ST-T melebur ke getaran); memerlukan defibrilasi asinkron (DC shock) dan RJP segera.',
        },
      },
    },
    {
      pAmpMv: 0,
      pDurationMs: 40,
      prIntervalMs: 45,
      qAmpMv: -0.34,
      qDurationMs: 36,
      rAmpMv: 0.58,
      rDurationMs: 56,
      rNotched: true,
      sAmpMv: -0.52,
      sDurationMs: 44,
      rPrimeAmpMv: 0.36,
      qrsDurationMs: 145,
      stDeviationMv: -0.12,
      stMorphology: 'downsloping',
      tAmpMv: -0.3,
      tDurationMs: 75,
      qtIntervalMs: 225,
    },
  ),
};

export const HYPERKALEMIA_CONDITION: EcgCondition = {
  id: 'hyperkalemia',
  domainId: 'metabolik-obat-pacemaker',
  domainName: 'Metabolik, Obat & Pacemaker',
  name: 'Hiperkalemia',
  noteReferencePath: 'src/notes/6.1 Hiperkalemia.md',
  heartRateBpm: 62,
  defaultLead: 'V3',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Kelebihan kalium menginaktivasi kanal Na⁺ atrium sehingga gelombang P mendatar, mengecil, hingga lenyap.',
      whatHappensInHeart:
        'Peningkatan kalium ekstraseluler mendepolarisasi potensial istirahat membran miosit atrium dan menurunkan eksitabilitasnya hingga berisiko paralisis elektrik atrium (atrial standstill).',
      whyEcgLooksLikeThis:
        'Di Lead V3, amplitudo gelombang P tampak kian rendah dan mendatar (+0,05 mV) dibanding acuan Normal sebelum menghilang total pada derajat berat.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Konduksi di AV Node dan berkas His melambat sehingga interval PR memanjang (> 0,20 dtk).',
      whatHappensInHeart:
        'Hambatan konduksi listrik meluas ke AV junction dan berkas His akibat penurunan kecepatan depolarisasi fase 0.',
      whyEcgLooksLikeThis:
        'Segmen PR terulur memanjang (PR 0,23 dtk) sebelum gelombang P akhirnya menghilang pada hiperkalemia berat (ritme sinoventrikular).',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      heartStatusCaption:
        'Depresi fase 0 memperlambat konduksi intraventrikel difus: QRS melebar toksik (≥ 0,12 dtk).',
      whatHappensInHeart:
        'Inaktivasi parsial kanal natrium cepat menurunkan laju hantar impuls di seluruh sistem His-Purkinje dan miokardium ventrikel secara difus.',
      whyEcgLooksLikeThis:
        'Kompleks QRS di Lead V3 melebar abnormal (0,13 dtk) dan pada kadar kalium sangat tinggi (> 8,0 mEq/L) dapat melebur dengan T membentuk pola sine wave sebelum asistol.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      vectors: [
        {
          id: 'vec-hyperk-t',
          label: 'Percepatan Fase 3 (Gel. T Tenting Tinggi-Simetris)',
          x1: 292,
          y1: 318,
          x2: 338,
          y2: 266,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Percepatan efluks K⁺ fase 3 memicu gelombang T tenting yang tinggi, simetris, dan runcing berdasar sempit.',
      whatHappensInHeart:
        'Peningkatan permeabilitas kalium membran mempercepat aliran keluar ion K⁺ pada fase 3 repolarisasi, memangkas durasi potensial aksi ventrikel secara seragam.',
      whyEcgLooksLikeThis:
        'Di Lead V3 terekam gelombang T tinggi (+1,15 mV), simetris, berujung runcing dengan dasar sempit (tented/peaked T wave) serta segmen ST yang memendek.',
    },
  },
  leads: buildDerivedLeads(
    {
      II: {
        params: {
          pAmpMv: 0.06,
          tAmpMv: 0.68,
          tSharpness: 'peaked',
          tDurationMs: 125,
        },
      },
      V2: {
        params: {
          pAmpMv: 0.04,
          stDeviationMv: 0.05,
          tAmpMv: 1.05,
          tSharpness: 'peaked',
          tDurationMs: 125,
        },
      },
      V3: {
        params: {
          pAmpMv: 0.05,
          stDeviationMv: 0.05,
          tAmpMv: 1.15,
          tSharpness: 'peaked',
          tDurationMs: 125,
        },
        stageNotes: {
          1: 'Gelombang P mendatar/mengecil (+0,05 mV) akibat penurunan eksitabilitas atrium.',
          2: 'Interval PR memanjang (0,23 dtk) akibat perlambatan konduksi AV.',
          3: 'Kompleks QRS melebar toksik (0,13 dtk) akibat inaktivasi parsial kanal Na⁺.',
          4: 'Gelombang T tenting tinggi (+1,15 mV), simetris, dan berdasar sempit khas hiperkalemia.',
        },
      },
      V4: {
        params: {
          pAmpMv: 0.05,
          tAmpMv: 1.02,
          tSharpness: 'peaked',
          tDurationMs: 125,
        },
      },
    },
    {
      pDurationMs: 112,
      prIntervalMs: 230,
      qrsDurationMs: 128,
      qtIntervalMs: 360,
      tSharpness: 'peaked',
      tDurationMs: 125,
    },
  ),
};

export const HYPOKALEMIA_CONDITION: EcgCondition = {
  id: 'hypokalemia',
  domainId: 'metabolik-obat-pacemaker',
  domainName: 'Metabolik, Obat & Pacemaker',
  name: 'Hipokalemia',
  noteReferencePath: 'src/notes/6.2 Hipokalemia.md',
  heartRateBpm: 72,
  defaultLead: 'V3',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls otomatis yang mendepolarisasi kedua atrium secara fisiologis ke arah inferior-anterior tanpa hambatan berarti.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P dengan kontur normal di Lead II dan Lead V3 (terkadang sedikit lebih runcing) disertai interval PR normal.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan kecepatan fisiologis normal.',
      whatHappensInHeart:
        'Impuls listrik dihantarkan melintasi AV junction dan berkas His secara normal sebelum memasuki cabang berkas.',
      whyEcgLooksLikeThis:
        'Tercatat garis datar isoelektrik pada segmen PR tanpa deviasi bermakna di Lead V3.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Depolarisasi ventrikel lewat His-Purkinje berlangsung cepat normal (QRS sempit).',
      whatHappensInHeart:
        'Kedua ruang ventrikel terdepolarisasi serentak melalui sistem His-Purkinje karena konduksi natrium fase 0 tidak tertekan secara primer.',
      whyEcgLooksLikeThis:
        'Di Lead V3 terekam kompleks QRS berdurasi sempit normal (< 0,10 dtk) dengan morfologi RS khas prekordial tengah tanpa gelombang Q patologis.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      vectors: [
        {
          id: 'vec-hypok-tu',
          label: 'Repolarisasi Fase 3 Terulur (Pola Dip-and-Rise & Gel. U)',
          x1: 292,
          y1: 318,
          x2: 338,
          y2: 266,
          color: '#d97706',
        },
      ],
      heartStatusCaption:
        'Penurunan arus keluar K⁺ fase 3 memperpanjang repolarisasi: depresi ST ringan, T mendatar, dan gelombang U menonjol.',
      whatHappensInHeart:
        'Rendahnya kalium ekstraseluler menurunkan arus kalium keluar pada fase 3, menunda pemulihan potensial aksi miosit ventrikel dan serabut Purkinje secara tidak homogen (berisiko EAD / Torsades de Pointes).',
      whyEcgLooksLikeThis:
        'Di Lead V3 terbentuk pola khas "dip-and-rise": depresi segmen ST ringan (−0,09 mV), gelombang T mendatar (+0,05 mV), lalu disusul gelombang U tinggi (+0,28 mV) yang melampaui tinggi T (fusi T-U / interval QU memanjang).',
    },
  },
  leads: buildDerivedLeads(
    {
      II: {
        params: {
          stDeviationMv: -0.06,
          tAmpMv: 0.08,
          uAmpMv: 0.16,
        },
      },
      V2: {
        params: {
          stDeviationMv: -0.08,
          stMorphology: 'downsloping',
          tAmpMv: 0.04,
          uAmpMv: 0.24,
        },
      },
      V3: {
        params: {
          stDeviationMv: -0.09,
          stMorphology: 'downsloping',
          tAmpMv: 0.05,
          tDurationMs: 145,
          uAmpMv: 0.28,
        },
        stageNotes: {
          1: 'Gelombang P normal sebelum segmen PR.',
          2: 'Segmen PR datar isoelektrik dengan interval PR normal.',
          3: 'Kompleks QRS sempit normal (0,08 dtk) tanpa pelebaran primer.',
          4: 'Pola klasik dip-and-rise: depresi ST ringan (−0,09 mV), gelombang T mendatar (+0,05 mV), dan gelombang U prominen (+0,28 mV) melampaui T.',
        },
      },
      V4: {
        params: {
          stDeviationMv: -0.08,
          stMorphology: 'downsloping',
          tAmpMv: 0.06,
          uAmpMv: 0.22,
        },
      },
      V5: {
        params: {
          stDeviationMv: -0.06,
          tAmpMv: 0.08,
          uAmpMv: 0.16,
        },
      },
    },
    { qtIntervalMs: 390, uAmpMv: 0.14 },
  ),
};

export const LONG_QT_SYNDROME_CONDITION: EcgCondition = {
  id: 'long-qt-syndrome',
  domainId: 'metabolik-obat-pacemaker',
  domainName: 'Metabolik, Obat & Pacemaker',
  name: 'Gangguan Kalsium & Long QT Syndrome',
  noteReferencePath: 'src/notes/6.3 Long QT Syndrome.md',
  heartRateBpm: 66,
  defaultLead: 'II',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls sinus secara ritmis mendepolarisasi kedua atrium ke arah inferior-anterior secara fisiologis.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P normal di Lead II dengan interval PR fisiologis (0,12–0,20 dtk).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His dengan kecepatan fisiologis normal.',
      whatHappensInHeart:
        'Impuls listrik melintasi persimpangan AV dan berkas His secara normal tanpa hambatan konduksi intrinsik.',
      whyEcgLooksLikeThis:
        'Tercatat garis datar isoelektrik pada segmen PR yang menjadi garis dasar acuan pengukuran interval QT.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Depolarisasi ventrikel lewat His-Purkinje berlangsung cepat normal (QRS sempit).',
      whatHappensInHeart:
        'Impuls merambat cepat menuruni sistem His-Purkinje untuk mengaktivasi miokardium kedua ventrikel secara simetris dari endokardium ke epikardium.',
      whyEcgLooksLikeThis:
        'Di Lead II terekam kompleks QRS berdurasi sempit normal (< 0,10 dtk) tanpa pergeseran aksis maupun pelebaran fase 0.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      vectors: [
        {
          id: 'vec-lqts-repol',
          label: 'Fase 2–3 Terulur (QTc > 500 ms, Risiko EAD/TdP)',
          x1: 298,
          y1: 320,
          x2: 278,
          y2: 254,
          color: '#d97706',
        },
      ],
      heartStatusCaption:
        'Pemanjangan fase plateau (fase 2) atau repolarisasi (fase 3) mengulur interval QT (> 500 ms), rentan memicu Torsades de Pointes.',
      whatHappensInHeart:
        'Hipokalsemia memperpanjang fase plateau (fase 2), sementara gangguan kanal ion LQTS (IKs/IKr/late INa) menunda pemulihan repolarisasi ventrikel secara heterogen dan memicu early afterdepolarizations (EAD).',
      whyEcgLooksLikeThis:
        'Di Lead II tampak segmen ST isoelektrik yang terentang panjang sebelum gelombang T (QT 0,52 dtk > 0,50 dtk); sebaliknya pada hiperkalsemia segmen ST memendek drastis. QTc > 500 ms berisiko tinggi memicu Torsades de Pointes.',
    },
  },
  leads: buildDerivedLeads(
    {
      II: {
        params: {
          stDeviationMv: 0,
          tAmpMv: 0.3,
          tDurationMs: 165,
        },
        stageNotes: {
          1: 'Gelombang P sinus normal (+0,22 mV) di Lead II.',
          2: 'Segmen PR datar isoelektrik dengan durasi normal.',
          3: 'Kompleks QRS sempit normal (0,08 dtk).',
          4: 'Segmen ST terentang datar memanjangkan interval QT nyata (0,52 dtk vs Normal 0,38 dtk); pola khas hipokalsemia/LQT3 (sedangkan LQT1 ber-T lebar dini dan LQT2 ber-T bifid).',
        },
      },
      V3: {
        params: {
          stDeviationMv: 0,
          tAmpMv: 0.44,
          tDurationMs: 170,
        },
        stageNotes: {
          4: 'Pemanjangan QT yang jelas memudahkan evaluasi risiko fenomena R-on-T dan Torsades de Pointes.',
        },
      },
    },
    { qtIntervalMs: 520, tDurationMs: 165 },
  ),
};

export const BRUGADA_SYNDROME_CONDITION: EcgCondition = {
  id: 'brugada-syndrome',
  domainId: 'metabolik-obat-pacemaker',
  domainName: 'Metabolik, Obat & Pacemaker',
  name: 'Sindrom Brugada (Pola Tipe 1)',
  noteReferencePath: 'src/notes/6.4 Sindrom Brugada.md',
  heartRateBpm: 72,
  defaultLead: 'V1',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'SA Node memicu depolarisasi atrium kanan dan kiri secara normal.',
      whatHappensInHeart:
        'Nodus SA melepaskan impuls listrik yang menyebar normal mendepolarisasi atrium kanan dan kiri tanpa gangguan konduksi berarti.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P normal dengan defleksi bifasik halus di Lead V1 dan positif halus di Lead II.',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Impuls melewati AV Node dan berkas His secara normal; segmen PR menjadi baseline titik J.',
      whatHappensInHeart:
        'Impuls listrik dihantarkan melintasi AV junction dan berkas His menuju percabangan ventrikel dengan kecepatan fisiologis normal.',
      whyEcgLooksLikeThis:
        'Tercatat garis datar isoelektrik pada segmen PR yang menjadi garis acuan untuk mengukur elevasi titik J di prekordial kanan.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Perlambatan lokal di epikardium RVOT membentuk pola pseudo-RBBB dengan lepas landas titik J tinggi (≥ 2 mm).',
      whatHappensInHeart:
        'Disfungsi kanal natrium (loss of function INa / mutasi SCN5A) memicu sedikit perlambatan konduksi lokal di epikardium traktus aliran keluar ventrikel kanan (RVOT).',
      whyEcgLooksLikeThis:
        'Di Lead V1 tampak pola menyerupai RBBB (pseudo-RBBB) tanpa gelombang S lebar di Lead I/V6, dengan ujung akhir QRS langsung lepas landas tinggi membentuk elevasi titik J (+0,28 mV).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      vectors: [
        {
          id: 'vec-brugada-rvot',
          label: 'Gradien Transmural RVOT ke Anterior-Kanan (V1–V2)',
          x1: 244,
          y1: 236,
          x2: 186,
          y2: 204,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Gradien transmural epikardium RVOT membentuk elevasi ST coved (Tipe 1) yang melandai ke inversi gelombang T.',
      whatHappensInHeart:
        'Dominasi arus kalium keluar transien (Ito) di epikardium RVOT yang tak terimbangi oleh INa menciptakan gradien voltase transmural ke arah anterior-kanan, berisiko memicu re-entri fase 2 dan VF.',
      whyEcgLooksLikeThis:
        'Di Lead V1–V2 terekam elevasi segmen ST melengkung coved (≥ 2 mm) yang menurun bertahap bersambung menjadi inversi gelombang T negatif (−0,28 mV), sementara V5–V6 tetap normal.',
    },
  },
  leads: buildDerivedLeads(
    {
      V1: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.34,
          rDurationMs: 32,
          sAmpMv: -0.24,
          sDurationMs: 28,
          rPrimeAmpMv: 0.36,
          stDeviationMv: 0.28,
          stMorphology: 'downsloping',
          tAmpMv: -0.28,
          tDurationMs: 165,
        },
        stageNotes: {
          1: 'Gelombang P bifasik normal di V1.',
          2: 'Segmen PR datar menjadi garis acuan elevasi titik J.',
          3: 'Pola pseudo-RBBB dengan lepas landas titik J tinggi (+0,28 mV; ≥ 2 mm) tanpa S lebar di lateral.',
          4: 'Elevasi segmen ST tipe coved melandai turun menyambung menjadi inversi gelombang T negatif (−0,28 mV) khas Brugada Tipe 1.',
        },
      },
      V2: {
        params: {
          qAmpMv: 0,
          rAmpMv: 0.42,
          rDurationMs: 32,
          sAmpMv: -0.28,
          sDurationMs: 28,
          rPrimeAmpMv: 0.3,
          stDeviationMv: 0.26,
          stMorphology: 'downsloping',
          tAmpMv: -0.24,
          tDurationMs: 165,
        },
        stageNotes: {
          4: 'Elevasi ST coved dan inversi T khas Brugada Tipe 1 tampak jelas di V2.',
        },
      },
      V3: {
        params: {
          stDeviationMv: 0.08,
          stMorphology: 'downsloping',
          tAmpMv: 0.16,
        },
      },
    },
    { qrsDurationMs: 96 },
  ),
};

export const DIGOXIN_CONDITION: EcgCondition = {
  id: 'digoxin',
  domainId: 'metabolik-obat-pacemaker',
  domainName: 'Metabolik, Obat & Pacemaker',
  name: 'Efek & Toksisitas Digitalis (Digoksin)',
  noteReferencePath: 'src/notes/6.5 Digoksin.md',
  heartRateBpm: 58,
  defaultLead: 'V5',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'Stimulasi vagal parasimpatis memperlambat letupan SA Node dengan gelombang P normal.',
      whatHappensInHeart:
        'Peningkatan tonus vagal pada Nodus SA memperlambat laju sinus istirahat, sementara depolarisasi atrium tetap menyebar normal ke arah inferior-anterior.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P sinus normal di Lead II dan V5 dengan frekuensi denyut yang cenderung melambat (58 bpm).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      heartStatusCaption:
        'Penekanan vagal pada AV Node memperlambat konduksi nodal sehingga interval PR memanjang (> 0,20 dtk).',
      whatHappensInHeart:
        'Efek parasimpatomimetik digitalis mendepresi kecepatan konduksi dan memperpanjang masa refrakter di Nodus AV.',
      whyEcgLooksLikeThis:
        'Tercatat pemanjangan interval PR (0,22 dtk / blok AV derajat 1) pada Lead V5 sebelum kompleks QRS terbentuk.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      heartStatusCaption:
        'Aktivasi ventrikel lewat His-Purkinje tetap berlangsung cepat dan sinkron (QRS sempit).',
      whatHappensInHeart:
        'Impuls listrik meluncur normal menuruni berkas His dan cabang Purkinje untuk mendepolarisasi kedua ventrikel secara simetris.',
      whyEcgLooksLikeThis:
        'Di Lead V5 terekam kompleks QRS berdurasi sempit normal (< 0,10 dtk) dengan gelombang R tinggi yang bersih.',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#d97706',
      softBg: '#fffbeb',
      vectors: [
        {
          id: 'vec-digoxin-st',
          label: 'Vektor ST Menjauhi LV + Pemendekan QT (Scooped ST)',
          x1: 344,
          y1: 288,
          x2: 296,
          y2: 256,
          color: '#d97706',
        },
      ],
      heartStatusCaption:
        'Hambatan Na⁺/K⁺-ATPase memendekkan fase plateau & QT, membentuk depresi ST cekung ("scooped") khas di V5.',
      whatHappensInHeart:
        'Kelebihan kalsium intraseluler dan percepatan efluks kalium mempercepat fase 2–3 repolarisasi miosit ventrikel (memicu risiko DAD/aritmia bila toksik).',
      whyEcgLooksLikeThis:
        'Di Lead V5 tampak depresi segmen ST cekung seperti sendok (−0,14 mV; Salvador Dalí mustache) yang menyambung ke gelombang T rendah (+0,08 mV) disertai pemendekan interval QT (0,31 dtk).',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          stDeviationMv: -0.08,
          stMorphology: 'concave',
          tAmpMv: 0.08,
        },
      },
      II: {
        params: {
          stDeviationMv: -0.1,
          stMorphology: 'concave',
          tAmpMv: 0.08,
        },
        stageNotes: {
          4: 'Depresi ST cekung (scooped) dan pemendekan QT juga tampak di lead inferior.',
        },
      },
      III: {
        params: {
          stDeviationMv: -0.06,
          stMorphology: 'concave',
          tAmpMv: 0.06,
        },
      },
      aVF: {
        params: {
          stDeviationMv: -0.08,
          stMorphology: 'concave',
          tAmpMv: 0.08,
        },
      },
      V4: {
        params: {
          stDeviationMv: -0.1,
          stMorphology: 'concave',
          tAmpMv: 0.1,
        },
      },
      V5: {
        params: {
          stDeviationMv: -0.14,
          stMorphology: 'concave',
          tAmpMv: 0.08,
          tDurationMs: 120,
        },
        stageNotes: {
          1: 'Gelombang P normal pada laju sinus yang melambat akibat tonus vagal (58 bpm).',
          2: 'Interval PR memanjang ringan (0,22 dtk) akibat penekanan AV Node oleh digoksin.',
          3: 'Kompleks QRS tetap sempit normal (0,08 dtk).',
          4: 'Depresi ST cekung melengkung ("scooped" −0,14 mV), gelombang T mendatar (+0,08 mV), dan interval QT memendek (0,31 dtk).',
        },
      },
      V6: {
        params: {
          stDeviationMv: -0.12,
          stMorphology: 'concave',
          tAmpMv: 0.08,
          tDurationMs: 120,
        },
      },
    },
    { prIntervalMs: 220, qtIntervalMs: 310, tDurationMs: 120 },
  ),
};

export const PACEMAKER_CONDITION: EcgCondition = {
  id: 'pacemaker',
  domainId: 'metabolik-obat-pacemaker',
  domainName: 'Metabolik, Obat & Pacemaker',
  name: 'Ritme Alat Pacu Jantung (Pacemaker)',
  noteReferencePath: 'src/notes/6.6 Pacu Jantung.md',
  heartRateBpm: 60,
  defaultLead: 'V1',
  stages: {
    1: {
      ...NORMAL_SINUS_CONDITION.stages[1],
      heartStatusCaption:
        'Atrium teraktivasi secara intrinsik oleh SA Node atau melalui pulsa pacu atrium (atrial pacing).',
      whatHappensInHeart:
        'Nodus SA mendepolarisasi atrium secara intrinsik, atau generator alat pacu jantung melepaskan pulsa listrik melalui elektroda atrium kanan bila laju intrinsik di bawah batas minimal.',
      whyEcgLooksLikeThis:
        'Terbentuk gelombang P sinus normal (atau gelombang P pacu beramplitudo rendah setelah atrial spike) dengan laju terprogram teratur (60 bpm).',
    },
    2: {
      ...NORMAL_SINUS_CONDITION.stages[2],
      heartStatusCaption:
        'Alat pacu jantung menghitung jeda AV terprogram (AV delay) sebelum menstimulasi ventrikel.',
      whatHappensInHeart:
        'Sirkuit generator mempertahankan jeda atrioventrikular terprogram (programmed AV delay) untuk memberi waktu pengisian ventrikel mekanis oleh kontraksi atrium.',
      whyEcgLooksLikeThis:
        'Tercatat garis datar isoelektrik antara gelombang P dan pacing spike ventrikel yang menyerupai segmen PR fisiologis.',
    },
    3: {
      ...NORMAL_SINUS_CONDITION.stages[3],
      accentColor: '#dc2626',
      softBg: '#fef2f2',
      activeParts: ['right-ventricle', 'left-ventricle'],
      vectors: [
        {
          id: 'vec-pacemaker-rva',
          label: 'Pacu Apeks RV -> Kiri-Superior-Posterior (Pola LBBB)',
          x1: 218,
          y1: 298,
          x2: 356,
          y2: 242,
          color: '#dc2626',
        },
      ],
      heartStatusCaption:
        'Elektroda di apeks RV memicu pacing spike tajam diikuti sebaran lambat antarsel -> QRS lebar pola LBBB di V1.',
      whatHappensInHeart:
        'Generator melepaskan impuls di apeks ventrikel kanan; gelombang depolarisasi merambat lambat miosit-ke-miosit di luar His-Purkinje menuju ventrikel kiri (kiri-superior-posterior).',
      whyEcgLooksLikeThis:
        'Di Lead V1 tampak artefak vertikal tajam (ventricular pacing spike) yang langsung disusul kompleks QS lebar (0,16 dtk; pola LBBB), serta defleksi negatif di lead inferior (II, III, aVF).',
    },
    4: {
      ...NORMAL_SINUS_CONDITION.stages[4],
      accentColor: '#059669',
      softBg: '#ecfdf5',
      heartStatusCaption:
        'Repolarisasi ventrikel menunjukkan diskordansi ST-T sekunder yang wajar (ST sedikit naik & T positif di V1).',
      whatHappensInHeart:
        'Urutan depolarisasi asinkron dari apeks ventrikel kanan ke ventrikel kiri membalik gradien pemulihan listrik seluler secara sekunder.',
      whyEcgLooksLikeThis:
        'Di Lead V1 tercatat elevasi segmen ST ringan (+0,18 mV) dengan gelombang T positif tegak (+0,34 mV) berlawanan arah dengan kompleks QS (diskordansi normal pasca-pacu).',
    },
  },
  leads: buildDerivedLeads(
    {
      I: {
        params: {
          qAmpMv: 0.38,
          qDurationMs: 6,
          rAmpMv: 1.05,
          rDurationMs: 132,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.09,
          stMorphology: 'downsloping',
          tAmpMv: -0.22,
        },
      },
      II: {
        params: {
          qAmpMv: 0.38,
          qDurationMs: 6,
          rAmpMv: 0,
          sAmpMv: -1.05,
          sDurationMs: 140,
          stDeviationMv: 0.12,
          tAmpMv: 0.24,
        },
        stageNotes: {
          3: 'Aksis superior/kiri ekstrem akibat pacu apeks RV menghasilkan kompleks QS lebar di lead inferior.',
        },
      },
      III: {
        params: {
          qAmpMv: 0.36,
          qDurationMs: 6,
          rAmpMv: 0,
          sAmpMv: -1.24,
          sDurationMs: 144,
          stDeviationMv: 0.14,
          tAmpMv: 0.26,
        },
      },
      aVR: {
        params: {
          qAmpMv: -0.34,
          qDurationMs: 6,
          rAmpMv: 0.72,
          rDurationMs: 120,
          sAmpMv: -0.2,
          stDeviationMv: -0.08,
          tAmpMv: -0.16,
        },
      },
      aVL: {
        params: {
          qAmpMv: 0.36,
          qDurationMs: 6,
          rAmpMv: 0.92,
          rDurationMs: 128,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.08,
          tAmpMv: -0.18,
        },
      },
      aVF: {
        params: {
          qAmpMv: 0.36,
          qDurationMs: 6,
          rAmpMv: 0,
          sAmpMv: -1.14,
          sDurationMs: 142,
          stDeviationMv: 0.12,
          tAmpMv: 0.24,
        },
      },
      V1: {
        params: {
          qAmpMv: 0.42,
          qDurationMs: 6,
          rAmpMv: 0,
          sAmpMv: -1.42,
          sDurationMs: 146,
          stDeviationMv: 0.18,
          stMorphology: 'concave',
          tAmpMv: 0.34,
          tDurationMs: 175,
        },
        stageNotes: {
          1: 'Gelombang P normal sebelum jeda AV terprogram.',
          2: 'Jeda AV terprogram (0,17 dtk) memisahkan aktivitas atrium dan pacu ventrikel.',
          3: 'Ventricular pacing spike tajam (+0,42 mV) diikuti kompleks QS lebar pola LBBB (−1,42 mV; 0,16 dtk) dari apeks RV.',
          4: 'Elevasi ST ringan (+0,18 mV) dan gelombang T positif (+0,34 mV) sebagai diskordansi sekunder yang normal.',
        },
      },
      V2: {
        params: {
          qAmpMv: 0.4,
          qDurationMs: 6,
          rAmpMv: 0,
          sAmpMv: -1.48,
          sDurationMs: 146,
          stDeviationMv: 0.18,
          stMorphology: 'concave',
          tAmpMv: 0.34,
        },
      },
      V5: {
        params: {
          qAmpMv: 0.38,
          qDurationMs: 6,
          rAmpMv: 1.18,
          rDurationMs: 136,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.1,
          stMorphology: 'downsloping',
          tAmpMv: -0.24,
        },
      },
      V6: {
        params: {
          qAmpMv: 0.36,
          qDurationMs: 6,
          rAmpMv: 1.12,
          rDurationMs: 136,
          rNotched: true,
          sAmpMv: 0,
          stDeviationMv: -0.1,
          stMorphology: 'downsloping',
          tAmpMv: -0.22,
        },
      },
    },
    { prIntervalMs: 170, qrsDurationMs: 156, qtIntervalMs: 430 },
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
    conditions: [
      RBBB_CONDITION,
      LBBB_CONDITION,
      LAFB_CONDITION,
      LPFB_CONDITION,
      WPW_CONDITION,
    ],
  },
  {
    id: 'iskemia-infark-perikardial',
    name: 'Iskemia, Infark & Perikardial',
    conditions: [
      NSTEMI_CONDITION,
      STEMI_CONDITION,
      CHRONIC_MI_CONDITION,
      PERICARDITIS_CONDITION,
      PERICARDIAL_EFFUSION_CONDITION,
    ],
  },
  {
    id: 'bradiaritmia-blok-av',
    name: 'Bradiaritmia & Blok AV',
    conditions: [
      SINUS_ARREST_CONDITION,
      FIRST_DEGREE_AV_BLOCK_CONDITION,
      MOBITZ_I_CONDITION,
      MOBITZ_II_CONDITION,
      THIRD_DEGREE_AV_BLOCK_CONDITION,
    ],
  },
  {
    id: 'takiaritmia',
    name: 'Takiaritmia',
    conditions: [
      PAC_CONDITION,
      PVC_CONDITION,
      PSVT_CONDITION,
      ATRIAL_FLUTTER_CONDITION,
      ATRIAL_FIBRILLATION_CONDITION,
      VT_CONDITION,
      VF_CONDITION,
    ],
  },
  {
    id: 'metabolik-obat-pacemaker',
    name: 'Metabolik, Obat & Pacemaker',
    conditions: [
      HYPERKALEMIA_CONDITION,
      HYPOKALEMIA_CONDITION,
      LONG_QT_SYNDROME_CONDITION,
      BRUGADA_SYNDROME_CONDITION,
      DIGOXIN_CONDITION,
      PACEMAKER_CONDITION,
    ],
  },
];

export const ECG_CONDITIONS: EcgCondition[] = ECG_DOMAINS.flatMap(
  (domain) => domain.conditions,
);
