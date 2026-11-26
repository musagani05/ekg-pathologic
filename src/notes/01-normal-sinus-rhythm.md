# 01. Normal Sinus Rhythm & Fisiologi Elektrofisiologi Normal

> **Modul Kepaniteraan Klinik (Koas) Ilmu Penyakit Dalam — ECG PathoLogic**
> Dokumen referensi lokal untuk kondisi baseline (`normal-sinus-rhythm` pada `src/data/ecgConditions.ts`).

---

## 1. Konteks Klinis Interna
* **Arti Ritme Sinus Normal (NSR):** Secara klinis, ritme sinus menunjukkan bahwa kendali utama detak jantung berasal dari *sinoatrial (SA) node*. Pada populasi dewasa interna, ritme ini secara fisiologis ditandai dengan konduksi 1:1 (setiap gelombang P yang berasal dari sinus diikuti oleh kompleks QRS dengan interval PR yang konstan dan normal) serta laju detak jantung istirahat normal antara **60–100 denyut/menit (bpm)**.
* **Variasi Fisiologis Normal:**
  * **Sinus Aritmia Respiratorik:** Fluktuasi gradual laju jantung yang sinkron dengan fase pernapasan. Selama inspirasi, stimulasi simpatis relatif meningkat dan tonus vagal menurun sehingga laju jantung meningkat; saat ekspirasi, tonus vagal meningkat sehingga laju melambat. Hal ini sering dijumpai pada dewasa muda, individu bugar/atlet, dan merupakan tanda integritas kendali otonom.
  * **Bradikardia Fisiologis:** Penurunan laju jantung hingga 40–50-an bpm saat tidur nyenyak atau pada atlet terlatih akibat tingginya tonus vagal istirahat.
* **Kapan Batas Normal Mulai Dipertanyakan (Red Flags di Ruang Perawatan):**
  * Laju istirahat **<60 bpm** pada pasien non-atlet/terjaga yang disertai gejala hipoperfusi (pusing, lemas, presinkop, sinkop) menandakan kecurigaan *sinus node dysfunction / sick sinus syndrome* atau blok AV.
  * Laju **>100 bpm** saat istirahat tanpa pemicu fisiologis (harus dicari etiologi interna sekunder seperti demam/sepsis, dehidrasi, anemia, hipertiroidisme, emboli paru, atau gagal jantung dekompensasi).
  * Iregularitas yang tidak berhubungan dengan siklus napas, adanya gelombang P yang hilang/tidak seragam, atau kegagalan transmisi impuls atrium ke ventrikel (seperti blok AV derajat dua atau tiga).

---

## 2. Fisiologi Dasar Terkait
Alur aktivasi listrik normal berjalan secara berurutan dan terkoordinasi melalui sistem konduksi khusus:
1. **SA Node:** Terletak di atrium kanan bagian atas (dekat muara *vena cava superior*), berperan sebagai *pacemaker* dominan jantung karena memiliki otomatisitas (*inherent automaticity*) tertinggi (60–100x/menit).
2. **Atrium & Jalur Interatrial/Internodal:** Impuls menyebar radial melintasi atrium kanan dan dihantarkan ke atrium kiri (difasilitasi oleh pita otot horizontal *Bachmann's bundle*) serta menyebar ke arah bawah menuju AV junction. Depolarisasi atrium ini menghasilkan **gelombang P**.
3. **AV Node (AV Junction):** Terletak di bagian inferior atrium kanan dekat septum interatrial. Struktur ini memiliki kecepatan konduksi **paling lambat** (~0.05 m/s) di seluruh sistem konduksi. Perlambatan fisiologis ini memberi jeda krusial (*atrial kick*) agar atrium selesai berkontraksi dan mengisi darah secara maksimal ke dalam ventrikel sebelum kontraksi ventrikel dimulai. Aktivitas listrik AV node sendiri beramplitudo terlalu kecil untuk terekam di permukaan tubuh dan tercermin sebagai garis datar pada **segmen PR**.
4. **Bundle of His:** Meneruskan impuls dari AV node menembus kerangka fibrosa jantung menuju puncak septum interventrikel.
5. **Cabang Berkas Kanan & Kiri (*Right & Left Bundle Branches*):** Berkas His bercabang menjadi *Right Bundle Branch* (menuju ventrikel kanan) dan *Left Bundle Branch* (bercabang lebih lanjut menjadi fasikel anterior dan posterior menuju ventrikel kiri).
6. **Serabut Purkinje:** Jaringan konduksi subendokardial yang memiliki kecepatan konduksi **paling cepat** (~2–4 m/s), mendistribusikan impuls hampir serentak ke seluruh dinding ventrikel.
7. **Miokardium Ventrikel:** Gelombang eksitasi menyebar dari lapisan endokardium ke epikardium dan dari apeks ke basis, menghasilkan kontraksi ventrikel yang sinkron (**kompleks QRS**).

---

## 3. Mekanisme Seluler Normal
Aktivitas pada kertas EKG permukaan merupakan pencerminan terintegrasi dari potensial aksi intraseluler jutaan miosit:
* **Sel Pacemaker (SA Node — Potensial Aksi Respons Lambat):**
  * Sel nodus memiliki membran istirahat yang tidak stabil (~ −60 mV) dan mengalami depolarisasi diastolik spontan bertahap (*Fase 4 automaticity*) melalui arus *funny current* ($I_f$, influx $\text{Na}^+$) serta kanal kalsium transien tipe-T ($I_{\text{Ca,T}}$) hingga mencapai ambang letup (*threshold* ~ −40 mV).
  * Fase 0 di nodus SA digerakkan oleh influx $\text{Ca}^{2+}$ melalui kanal kalsium tipe-L ($I_{\text{Ca,L}}$) yang lebih lambat dibanding kanal $\text{Na}^+$ cepat miosit ventrikel.
* **Miosit Ventrikel & Hubungannya dengan Gelombang EKG (Potensial Aksi Respons Cepat):**
  * **Fase 0 (Depolarisasi Cepat):** Influx masif ion $\text{Na}^+$ cepat ke dalam sel mengubah muatan intraseluler menjadi positif (+20 mV) dan ekstraseluler menjadi negatif. Perambatan depolarisasi dinding ventrikel ini terdaftar sebagai **kompleks QRS**.
  * **Fase 1 (Repolarisasi Awal Transien):** Inaktivasi kanal $\text{Na}^+$ dan aliran keluar transien ion $\text{K}^+$ ($I_{\text{to}}$).
  * **Fase 2 (Plateau):** Aliran masuk ion $\text{Ca}^{2+}$ melalui kanal kalsium tipe-L mengimbangi aliran keluar ion $\text{K}^+$. Karena potensial membran relatif seragam/stabil di seluruh miokardium yang terdepolarisasi, tidak ada gradien voltase netto di permukaan tubuh, sehingga menghasilkan garis isoelektrik pada **segmen ST**.
  * **Fase 3 (Repolarisasi Cepat):** Influx $\text{Ca}^{2+}$ berhenti sementara eflux $\text{K}^+$ ($I_{Kr}, I_{Ks}, I_{K1}$) terus meningkat, mengembalikan potensial transmembran ke kondisi istirahat terpolarisasi. Di permukaan EKG, fase ini tertulis sebagai **gelombang T**.
  * **Fase 4 (Potensial Membran Istirahat):** Sel miosit ventrikel berada dalam kondisi polarisasi istirahat (~ −90 mV; luar positif, dalam negatif) yang dijaga pompa $\text{Na}^+/\text{K}^+$-ATPase dan kanal $I_{K1}$, berkorelasi dengan garis dasar isoelektrik (**segmen TP**).
* **Logika Vektor Gelombang T (Mengapa T Normal Searah/Konkordan dengan QRS):**
  * Pada dinding ventrikel utuh, durasi potensial aksi sel **epikardium lebih pendek** daripada sel **endokardium**. Akibatnya, sel epikardium mengalami repolarisasi terlebih dahulu, sehingga gelombang repolarisasi bergerak dari **epikardium ke endokardium** (berkebalikan dari arah depolarisasi endokardium $\rightarrow$ epikardium).
  * Karena arah perambatan gelombang **terbalik** DAN polaritas muatan repolarisasi juga **terbalik** (negatif $\times$ negatif = positif), vektor defleksi gelombang T di EKG permukaan menjadi **searah (konkordan)** dengan defleksi utama kompleks QRS.

---

## 4. Vektor & Temuan per Lead
Berdasarkan hukum dipole elektrokardiografi:
- Vektor depolarisasi **mendekati** elektroda positif $\rightarrow$ defleksi **positif** (ke atas).
- Vektor depolarisasi **menjauhi** elektroda positif $\rightarrow$ defleksi **negatif** (ke bawah).
- Vektor depolarisasi **tegak lurus** aksis lead $\rightarrow$ defleksi **bifasik / ekuifasik**.

| Gelombang | Arah Vektor Rata-Rata | Limb Leads Khas | Prekordial Khas |
| :--- | :--- | :--- | :--- |
| **Gelombang P** | Inferior, kiri, anterior ($\approx +60^\circ$ frontal) | Positif jelas di **II**; negatif mutlak di **aVR** | Positif di **V2–V6**; **bifasik** di **V1** |
| **QRS Fase 1 (Septal)** | Septum interventrikel: kiri $\rightarrow$ kanan, anterior | *q* kecil di **I, aVL**; *r* kecil opsional di **aVR** | *r* septal kecil di **V1–V2**; *q* septal kecil di **V5–V6** |
| **QRS Fase 2 (Utama)** | Dinding bebas: kiri, posterior, inferior (dominasi LV) | Dominan **R** di **I, II, aVF**; dominan negatif **QS/rS** di **aVR** | **S** dalam di **V1–V2**; **R** tinggi di **V5–V6** |
| **Gelombang T** | Searah QRS (kiri, inferior; sudut QRS-T $<45^\circ$) | Positif di **I, II**; negatif di **aVR** | Positif di **V2–V6**; datar/negatif dangkal di **V1** |

* **Progresi Gelombang R di V1–V6:**
  * **Lead V1:** Pola **rS** (*r* septal kecil diikuti *S* dalam karena massa LV menjauh ke kiri-posterior).
  * **Zona Transisi (R = S):** Normalnya tercapai di **V3 atau V4**.
  * **Lead V5–V6:** Pola **qRs / qR** (*q* septal sempit diikuti *R* tinggi mendekati elektroda aksila kiri).

---

## 5. Rantai Clinical Reasoning
1. **Otomatisitas SA Node** $\rightarrow$ letupan impuls otomatis menyebar melintasi atrium kanan & kiri $\rightarrow$ **Gelombang P** (durasi $<0.12\text{ s}$, tinggi $<2.5\text{ mm}$).
2. **AV Nodal Delay** $\rightarrow$ perlambatan fisiologis di AV junction tanpa gradien voltase permukaan $\rightarrow$ garis datar **Segmen PR** (total **Interval PR** $0.12–0.20\text{ s}$ atau 3–5 kotak kecil).
3. **Konduksi His-Purkinje & Aktivasi Septal** $\rightarrow$ fasikel kiri mengaktivasi septum dari kiri ke kanan $\rightarrow$ **defleksi septal awal** (*r* kecil di V1, *q* sempit di I/aVL/V5/V6).
4. **Depolarisasi Masif Ventrikel** $\rightarrow$ eksitasi endokardium ke epikardium didominasi massa LV tebal $\rightarrow$ **Kompleks QRS** sempit ($0.07–0.10\text{ s}$, $<3$ kotak kecil).
5. **Fase Plateau Potensial Aksi (Fase 2)** $\rightarrow$ seluruh miokardium ventrikel terdepolarisasi seragam $\rightarrow$ **Segmen ST** isoelektrik dimulai dari *J-point*.
6. **Repolarisasi Asimetris (Epikardium $\rightarrow$ Endokardium)** $\rightarrow$ epikardium pulih lebih dulu $\rightarrow$ **Gelombang T** asimetris halus yang konkordan dengan QRS.
7. **Fase Istirahat (Fase 4)** $\rightarrow$ polarisasi transmembran $-90\text{ mV}$ stabil $\rightarrow$ garis dasar referensi **Segmen TP** (kadang didahului **Gelombang U** kecil fisiologis di V2–V3).

---

## 6. Jebakan / Variasi yang Sering Dikira Abnormal
1. **Pola Serba Negatif di Lead aVR:** Pada sinus normal, P, QRS, dan T **wajib negatif** di aVR karena bahu kanan melihat vektor menjauh ke apeks kiri-inferior. Jika P/QRS positif di aVR, curigai salah pasang kabel ekstremitas (*limb lead reversal*) atau dekstrokardia!
2. **Gelombang Q dan T Inversi Terisolasi di Lead III:** Sering merupakan variasi posisi jantung normal bila **Lead II dan aVF tetap normal**. Dapat berkurang saat pasien menarik napas dalam.
3. **Pergeseran Aksis Akibat Habitus & Pernapasan:**
   * **Habitus Astenikus (Kurus-Jangkung):** Diafragma rendah $\rightarrow$ *vertical heart* $\rightarrow$ aksis mendekati $+90^\circ$ (jangan buru-buru didiagnosis RVH tanpa kriteria voltase/strain).
   * **Habitus Piknikus / Obesitas / Kehamilan:** Diafragma terdorong ke atas $\rightarrow$ *horizontal heart* $\rightarrow$ aksis mendekati $0^\circ$ s/d $-30^\circ$ (bedakan dari LAFB).
4. **Gelombang q Septal Fisiologis:** Gelombang *q* kecil di I, aVL, V5, V6 normal selama lebarnya **$<0.03–0.04\text{ s}$** ($<1$ kotak kecil) dan dalamnya **$<25\%$ amplitudo R**.
5. **Pola Early Repolarization (Normal Variant):** Elevasi ST konkaf ringan ($1–2\text{ mm}$) dengan *J-point notching* di V2–V4 pada dewasa muda/atlet asimtomatik tanpa perubahan resiprokal.
6. **Variasi T Inversi Prekordial Kanan:** T negatif di **V1** normal pada dewasa; perluasan T negatif ke V2–V3 (*persistent juvenile T-wave pattern*) dapat dijumpai sebagai varian normal pada dewasa muda/wanita sehat, namun tetap wajib dikorelasikan dengan keluhan klinis.
