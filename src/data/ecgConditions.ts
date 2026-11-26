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

export interface LeadWaveParams {
  pAmpMv: number;
  pTerminalAmpMv?: number;
  pDurationMs: number;
  prIntervalMs: number;
  qAmpMv: number;
  qDurationMs?: number;
  rAmpMv: number;
  rDurationMs?: number;
  sAmpMv: number;
  sDurationMs?: number;
  rPrimeAmpMv?: number;
  qrsDurationMs: number;
  stDeviationMv: number;
  stMorphology?: 'flat' | 'concave' | 'convex' | 'downsloping' | 'upsloping';
  tAmpMv: number;
  tDurationMs: number;
  qtIntervalMs: number;
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
  name: string;
  noteReferencePath: string;
  heartRateBpm: number;
  defaultLead: LeadId;
  stages: Record<StageId, ProcessStageDetail>;
  leads: Record<LeadId, LeadPerspective>;
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
  name: 'Normal Sinus Rhythm & Fisiologi Normal',
  noteReferencePath: 'src/notes/01-normal-sinus-rhythm.md',
  heartRateBpm: 75,
  defaultLead: 'II',

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

export const ECG_CONDITIONS: EcgCondition[] = [NORMAL_SINUS_CONDITION];
