# Catatan Referensi Lokal — ECG PathoLogic (`src/notes/`)

Folder ini menyimpan materi klinis berbasis mekanisme dalam format Markdown untuk setiap modul kondisi pada aplikasi **ECG PathoLogic**.

## Daftar Catatan Saat Ini
- `01-normal-sinus-rhythm.md` — Baseline: **Normal Sinus Rhythm & Fisiologi Elektrofisiologi Normal** (terhubung ke kondisi `normal-sinus-rhythm` pada `src/data/ecgConditions.ts`).

## Rencana Ekspansi Kondisi Berikutnya (Modular)
Untuk menambahkan kondisi patofisiologis baru (misal *STEMI Anterior/Inferior*, *Hiperkalemia*, *AV Block*, *LBBB/RBBB*):
1. Tambahkan file catatan Markdown baru di `src/notes/` dengan 6 subbab standar:
   1. Konteks Klinis Interna
   2. Fisiologi / Anatomi Terkait
   3. Patofisiologi / Mekanisme Seluler
   4. Vektor & Temuan per Lead
   5. Rantai Clinical Reasoning
   6. Jebakan / Differential Diagnosis EKG
2. Tambahkan objek bertipe `EcgCondition` ke dalam array `ECG_CONDITIONS` di `src/data/ecgConditions.ts`. UI 3 kolom (Diagram Konduksi SVG, 12-Lead Parametrik, dan Panel Clinical Reasoning) akan otomatis merender kondisi baru tersebut tanpa perlu mengubah struktur komponen utama.
