# 01 — Product & UX Blueprint: Fansightful

- **Versi:** draft 1, 27 Oktober 2026
- **Dasar:** Strategic Foundation v1.0 + `00_CURRENT_STATE_AUDIT.md`
- **Status:** semua isi dokumen ini adalah **rekomendasi** kecuali ditandai *LOCKED* (berasal dari Strategic Foundation). Tidak ada yang dianggap final sebelum disetujui pengguna (lihat `03_DECISION_LOG.md`).

Titik awal faktual: situs saat ini hanyalah mini-game satu halaman, sehingga blueprint ini merancang dari nol dengan memanfaatkan project Cloudflare Pages yang sudah ada.

---

## 1. Target pengguna dan kebutuhan utama

Audiens *LOCKED*: founder/pemilik bisnis, business builder, manajer/pemimpin fungsi — di Indonesia.

| Segmen | Situasi khas (asumsi, perlu divalidasi) | Pertanyaan yang mereka bawa | Yang mereka butuhkan dari Fansightful |
|---|---|---|---|
| Founder / pemilik bisnis kecil–menengah | Tim tumbuh 10–100 orang, peran mulai kabur, founder masih jadi bottleneck | "Kenapa tim saya sibuk tapi hasilnya tidak sesuai?" "Apa yang harus dibenahi duluan?" | Diagnosis cepat, prioritas, langkah konkret yang tidak butuh tim HR besar |
| Business builder (COO, GM, kepala unit baru) | Ditugasi membangun/merapikan unit atau ekspansi | "Struktur dan KPI seperti apa yang masuk akal?" | Kerangka kerja, template, cara membandingkan opsi |
| Manajer / functional leader | Mengelola tim, diminta target dan penilaian kinerja | "Bagaimana menetapkan target dan menilai kinerja dengan adil?" | Panduan praktis, contoh lokal, alat bantu menyusun |

Kebutuhan bersama: **pemahaman yang cepat dan jujur → keputusan tindakan berikutnya**, dengan bahasa Indonesia yang wajar dan contoh konteks Indonesia.

## 2. Insight-to-Action journey (*LOCKED*: Discover → Understand → Experiment → Act → Return & Grow)

| Tahap | Pertanyaan pengguna | Home | Tools Lab | Insights | Playbooks | Solutions |
|---|---|---|---|---|---|---|
| **Discover** | "Apakah ini masalah saya?" | Pilihan masalah ("Mulai dari masalah Anda") | Kartu tool dengan masalah yang disasar | Judul berbasis pertanyaan nyata (dari pencarian) | — | — |
| **Understand** | "Kenapa ini terjadi?" | Penjelasan singkat cara kerja platform | Pengantar tool: apa yang diperiksa dan batasannya | Artikel: penyebab umum, konteks, bukti | — | — |
| **Experiment** | "Bagaimana kondisi saya?" | CTA ke tool utama | Tool interaktif (Health Check) | Embed/CTA "Periksa kondisi tim Anda" di artikel | — | — |
| **Act** | "Apa yang saya lakukan sekarang?" | — | Hasil per area + 1–3 langkah berikutnya | Bagian "Langkah praktis" di akhir artikel | Panduan langkah demi langkah / template | Opsi bantuan profesional, jelas siapa penyedianya |
| **Return & Grow** | "Bagaimana melanjutkan?" | "Lanjutkan dari hasil terakhir" (P1) | Unduh/cetak ringkasan hasil (P0), simpan hasil (P1) | Artikel terkait | Checklist progres (P1) | Konsultasi lanjutan |

Prinsip penerapan: **setiap halaman harus punya satu langkah berikutnya yang jelas** (janji brand *LOCKED*: "Every insight should help you move forward").

## 3. Sitemap dan navigasi

### 3.1 Sitemap yang direkomendasikan

Slug berbahasa Indonesia untuk halaman umum, istilah brand Inggris dipertahankan bila sudah disepakati ("Tools Lab", "Insights", "Playbooks"). [Rekomendasi — R-06]

| Route | Tujuan pengguna | Konten utama | CTA utama | Dependensi teknis | MVP? |
|---|---|---|---|---|---|
| `/` | Mengerti apa Fansightful dan memilih titik mulai | Lihat §4 | "Mulai Health Check" | Layout, komponen kartu | **P0** |
| `/tools-lab` | Melihat tools yang tersedia | Daftar tool yang **benar-benar tersedia**; tool lain hanya disebut bila jadwalnya pasti (atau tidak disebut) | Buka tool | Data daftar tool | **P0** (boleh 1 tool) |
| `/tools-lab/health-check` | Memeriksa kondisi bisnis & tim | Intro, kuesioner, hasil, next action | "Mulai pemeriksaan" → "Lihat langkah berikutnya" | Komponen tool interaktif, analytics | **P0** |
| `/insights` | Belajar tentang masalah spesifik | Indeks artikel per topik | Baca artikel | Sistem konten (Markdown) | **P0** jika ≥3 artikel siap; jika belum, tunda tautan navigasi |
| `/insights/[slug]` | Memahami satu masalah | Artikel + ringkasan + langkah praktis + tool terkait | Tool terkait | Template artikel, metadata, schema Article | P0 (3 artikel) |
| `/playbooks` | Menjalankan perbaikan | Panduan + template | Unduh/ikuti panduan | Sistem konten | **P1** (masuk P0 hanya bila 1 playbook siap) |
| `/solusi` | Mencari bantuan implementasi | Layanan yang terkonfirmasi, penyedia, cakupan, cara memulai | "Diskusikan kebutuhan Anda" | Informasi layanan dari pengguna | **P0** (hanya isi terkonfirmasi) |
| `/tentang` | Menilai kredibilitas | Misi, pendekatan, profil founder/kurator, hubungan dengan entitas lain | Coba tool / hubungi | Foto & profil founder | **P0** |
| `/kontak` | Menghubungi | Form singkat atau email | Kirim | Form handler (lihat §8) | **P0** |
| `/privasi` | Memahami penggunaan data | Kebijakan privasi | — | Teks kebijakan | **P0** |
| `/newsletter` | Berlangganan | Formulir + persetujuan | Daftar | Penyedia email | **P1** |
| `404` | Tersesat | Pesan + tautan ke Home/Tools | Kembali | `404.html` | **P0** |

### 3.2 Navigasi
- **Navigasi utama MVP:** Tools Lab · Insights *(bila sudah ada konten)* · Solusi · Tentang. Logo → Home. Tombol sekunder: "Hubungi".
- **Footer:** Tools Lab, Insights, Solusi, Tentang, Kontak, Privasi, keterangan entitas pemilik/penyedia.
- **Jangan tampilkan** Playbooks/Newsletter di menu sebelum ada isi (sesuai instruksi "jangan memaksakan semua menu").

## 4. Homepage blueprint

Fokus: kebutuhan pengunjung dan tools, bukan biografi founder atau hard selling. Copy berikut adalah *working copy* untuk diuji.

| # | Section | Tujuan | Working copy | CTA → rute |
|---|---|---|---|---|
| 1 | **Hero** | Menyatakan nilai dalam 5 detik | Eyebrow: "Untuk founder, business builder, dan manajer" · H1: "Pahami masalah bisnis Anda. Temukan langkah berikutnya." · Sub: "Tools interaktif, wawasan praktis, dan solusi yang relevan untuk membangun bisnis dan tim yang lebih sehat." (Ekspresi *working copy* SF: "Understand the Problem. Discover the Possibilities. Build Better." dapat dipakai sebagai tagline Inggris sekunder bila pengguna menghendaki) | Primer: "Mulai Business & People Health Check" → `/tools-lab/health-check` · Sekunder: "Lihat cara kerjanya" → #cara-kerja |
| 2 | **Mulai dari masalah Anda** | Discover; membuat pengunjung merasa dikenali | Judul: "Mana yang paling terasa di bisnis Anda?" Kartu (contoh): "Peran dan tanggung jawab tumpang tindih" · "Target ada, tapi tidak ada yang merasa memilikinya" · "Penilaian kinerja terasa subjektif" · "Semua keputusan masih menunggu founder" | Tiap kartu → bagian Health Check yang relevan atau artikel terkait |
| 3 | **Tools Lab (unggulan)** | Experiment; menonjolkan diferensiasi | Kartu Health Check: "±10 menit · Pemeriksaan awal 5 area · Tanpa daftar akun" | → tool |
| 4 | **Cara kerja** (#cara-kerja) | Understand; membangun ekspektasi yang jujur | 3 langkah: "Periksa" → "Pahami" → "Bertindak". Kalimat kejujuran: "Hasilnya adalah pemeriksaan awal, bukan penilaian definitif." | — |
| 5 | **Insights terbaru** | Membangun kepercayaan lewat kualitas | 3 artikel terbaru *(tampilkan hanya bila ada ≥3)* | → artikel |
| 6 | **Dikurasi oleh** | Founder-led touch, singkat | Foto, nama, 1–2 kalimat keahlian relevan (data dari pengguna) | "Tentang Fansightful" → `/tentang` |
| 7 | **Butuh bantuan lebih lanjut?** | Jalur komersial yang tidak memaksa | "Jika Anda ingin dibantu menerapkan perbaikan, lihat layanan yang tersedia — dan siapa penyedianya." | → `/solusi` |
| 8 | **Footer** | Navigasi + transparansi | Keterangan entitas, tautan privasi | — |

Yang **tidak** ditampilkan: angka pengguna, testimonial, logo klien, klaim "terpercaya/terbukti", nama partner — sampai ada bukti dan izin.

## 5. MVP tool — rekomendasi vertical slice pertama

### 5.1 Pilihan dan alasan

**Rekomendasi: Business & People Health Check** sebagai vertical slice pertama. [Rekomendasi — R-04]

| Kriteria | Health Check | KPI & Performance Designer | HR Cost & Workforce Calculator |
|---|---|---|---|
| Posisi di journey | Pintu masuk Discover → Act; mengarahkan ke tool/konten lain | Tahap Build | Tahap Explore |
| Kebutuhan data sensitif | Rendah (persepsi, bukan data karyawan) | Rendah–sedang | **Tinggi** (gaji) |
| Risiko akurasi regulasi | Rendah | Rendah | **Tinggi** (BPJS, PPh 21, THR — harus diverifikasi dan dipelihara) |
| Kompleksitas UX | Sedang (kuesioner + hasil) | **Tinggi** (editor relasi tujuan–ukuran–target) | Sedang |
| Kedekatan dengan keahlian founder & penawaran awal | Tinggi (SF-08 Business & People Systems) | Tinggi | Sedang |
| Risiko utama | Terlihat "ilmiah" padahal belum tervalidasi | Output dianggap KPI baku | Angka salah → kerugian nyata |

Health Check memberi alur end-to-end tercepat dan paling aman, sekaligus menghasilkan sinyal kebutuhan (area mana yang paling sering bermasalah) untuk memutuskan tool kedua.

### 5.2 Spesifikasi draft — Business & People Health Check

**Masalah yang disasar:** pemimpin bisnis merasakan gejala (target meleset, tim sibuk tapi tidak efektif, keputusan menumpuk) tetapi tidak tahu area sistem mana yang perlu dibenahi lebih dulu.

**Pengguna utama:** founder/pemilik bisnis dan pemimpin unit dengan tim ±5–200 orang. (Asumsi rentang; perlu dikonfirmasi.)

**Posisi resmi hasil:** *pemeriksaan awal berbasis persepsi responden*, bukan asesmen tervalidasi.

**Struktur input** (draft; isi pernyataan wajib ditinjau founder sebagai ahli domain):

1. **Konteks (opsional, 2 pertanyaan)** — dipakai hanya untuk menyesuaikan contoh di hasil, tidak dikirim ke server:
   - Ukuran tim: 1–10 · 11–50 · 51–200 · >200
   - Peran Anda: Founder/pemilik · Pimpinan unit · Manajer · Lainnya
2. **Lima area** (dari Strategic Foundation), masing-masing 4 pernyataan:

| Area | Contoh pernyataan (draft) |
|---|---|
| A. Peran & tanggung jawab | "Setiap posisi kunci memiliki uraian tanggung jawab yang ditulis dan dipahami pemegangnya." · "Jelas siapa yang mengambil keputusan untuk hal-hal rutin." |
| B. Struktur tim | "Jumlah orang yang melapor ke satu atasan masih memungkinkan pembinaan rutin." · "Tidak ada pekerjaan penting yang hanya bergantung pada satu orang." |
| C. Tujuan & prioritas | "Tujuan bisnis 6–12 bulan ke depan tertulis dan diketahui para pimpinan tim." · "Setiap tim tahu bagaimana pekerjaannya berkontribusi pada tujuan tersebut." |
| D. Proses kerja | "Proses inti (mis. penjualan, layanan, operasional) terdokumentasi." · "Masalah yang berulang dibahas dan diperbaiki penyebabnya." |
| E. Praktik kinerja | "Setiap orang tahu ukuran keberhasilan pekerjaannya." · "Ada percakapan umpan balik kinerja secara rutin, bukan hanya akhir tahun." |

**Skala jawaban** (deskriptif, bukan angka di UI):
`Belum ada` · `Ada, tapi belum konsisten` · `Sebagian besar berjalan` · `Berjalan dan ditinjau rutin` · `Tidak tahu`

**Logika penilaian (aturan transparan, tanpa skor gabungan):**
- Nilai internal 0–3 untuk empat opsi pertama; "Tidak tahu" tidak dihitung tetapi dicatat.
- Per area:
  - **"Perlu perhatian"** — ≥2 pernyataan dijawab *Belum ada* atau *Ada, tapi belum konsisten*.
  - **"Mulai terbentuk"** — tepat 1 pernyataan di level tersebut.
  - **"Relatif terbentuk"** — semua pernyataan di level *Sebagian besar berjalan* atau lebih.
  - **"Belum cukup informasi"** — ≥2 jawaban *Tidak tahu* (ini sendiri adalah insight: visibilitas rendah).
- **Tidak ada skor total, persentase, atau peringkat.** Ambang di atas adalah aturan kerja yang ditampilkan ke pengguna, bukan norma tervalidasi.
- Urutan prioritas di hasil: area "Perlu perhatian" terlebih dulu, urut berdasarkan jumlah pernyataan level terendah; seri diurutkan A→E (peran dan tujuan sering menjadi prasyarat area lain — asumsi yang perlu dikonfirmasi founder).

**Output:**
1. Ringkasan: "Dari 5 area, 2 perlu perhatian: Peran & tanggung jawab, Praktik kinerja."
2. Per area: status, **pernyataan mana yang memicu status** (agar bisa ditelusuri), penjelasan singkat mengapa ini penting, dan 1–3 langkah berikutnya yang konkret (mis. "Daftar 5 keputusan rutin yang paling sering menunggu Anda, lalu tentukan pemiliknya").
3. Kotak "Cara membaca hasil ini": asumsi dan keterbatasan.
4. Aksi: "Baca: [artikel terkait]" · "Unduh/cetak ringkasan" · "Diskusikan hasil ini" (→ `/solusi` atau `/kontak`).

**Asumsi dan keterbatasan (ditampilkan ke pengguna):**
- Berdasarkan persepsi satu orang; pandangan anggota tim bisa berbeda.
- Pernyataan disusun dari praktik umum, belum divalidasi secara statistik.
- Tidak menggantikan asesmen organisasi menyeluruh atau nasihat profesional.

**Jalur komersial (tidak memaksa):** setelah hasil, satu kotak ringan: "Ingin dibantu memetakan langkah perbaikan? Lihat opsi layanan." Hanya muncul **setelah** nilai diberikan, dengan nama penyedia yang jelas (lihat §6).

**Data yang dikumpulkan dan alasannya:**
- **Jawaban tidak dikirim ke server dan tidak disimpan** di MVP; diproses di browser. Alasan: minimisasi data; tidak ada use case yang membutuhkan penyimpanan.
- Event analytics anonim (lihat bawah) tanpa isi jawaban.
- Bila pengguna memilih "Diskusikan hasil", ringkasan hanya dikirim jika ia secara eksplisit mencentang "Lampirkan ringkasan hasil" pada form kontak.

**Event analytics (tanpa data pribadi, tanpa isi jawaban):**

| Event | Properti |
|---|---|
| `tool_view` | `tool_id` |
| `tool_start` | `tool_id` |
| `tool_area_complete` | `tool_id`, `area` (A–E) |
| `tool_complete` | `tool_id`, `duration_bucket` (<5, 5–10, >10 menit) |
| `result_view` | `tool_id`, `areas_flagged_count` (0–5) — *perlu persetujuan, R-09* |
| `next_action_click` | `tool_id`, `action_type` (article / download / solusi / kontak), `target` |
| `contact_submit` | `source` (halaman asal) |

**Acceptance criteria:**
1. Pengguna dapat menyelesaikan seluruh alur (intro → 20 pernyataan → hasil) tanpa akun, di desktop dan mobile ≥360 px.
2. Tombol "Lihat hasil" non-aktif sampai semua pernyataan terjawab (termasuk "Tidak tahu"); pesan validasi berbahasa Indonesia menyebut pernyataan yang belum dijawab dan memindahkan fokus ke sana.
3. Status per area dihitung persis sesuai aturan §5.2; pernyataan pemicu ditampilkan.
4. Tidak ada skor total/persentase di UI.
5. Setiap area berstatus "Perlu perhatian" menampilkan ≥1 langkah berikutnya dan ≥1 tautan lanjutan.
6. Kotak asumsi & keterbatasan selalu tampil di hasil.
7. Tidak ada request jaringan yang memuat isi jawaban (diverifikasi via tab Network).
8. Semua kontrol dapat dioperasikan dengan keyboard; label terhubung; fokus terlihat.
9. Event analytics di tabel di atas terkirim satu kali per aksi.
10. Ringkasan dapat dicetak/disimpan sebagai PDF lewat dialog cetak browser dengan tata letak yang terbaca.

**Test cases (logika):**

| # | Input area A | Status yang diharapkan |
|---|---|---|
| T1 | 0, 0, 3, 3 | Perlu perhatian |
| T2 | 1, 2, 2, 3 | Mulai terbentuk |
| T3 | 2, 2, 3, 3 | Relatif terbentuk |
| T4 | ?, ?, 0, 3 | Belum cukup informasi (aturan "Tidak tahu" didahulukan) |
| T5 | ?, 0, 1, 3 | Perlu perhatian (1 "Tidak tahu" tidak membatalkan) |
| T6 | Semua area "Relatif terbentuk" | Ringkasan positif + saran pemeliharaan, tidak ada CTA komersial yang menonjol |
| T7 | Jawaban dihapus di tengah (refresh) | Kembali ke awal tanpa error (persistensi lokal = P1) |
| T8 | Keyboard saja | Alur selesai; urutan fokus logis |
| T9 | `prefers-reduced-motion` | Tidak ada animasi transisi selain fade singkat |

## 6. Solusi komersial dan CTA

Prinsip *LOCKED*: free-to-value, paid-to-implement; transparansi penyedia.

| Lapisan | Contoh | Penyedia | Status saat audit |
|---|---|---|---|
| Gratis | Tools, Insights, Playbooks dasar | Fansightful | Belum ada |
| Template/materi premium | Template uraian peran, kerangka KPI | Fansightful | **Belum ada — jangan ditampilkan** |
| Konsultasi / workshop / implementasi | Diagnosis lanjutan, desain struktur, sistem kinerja | **Belum dikonfirmasi**: founder pribadi, Fansightful, atau Mierakigai | Perlu keputusan (Q-02) |
| Software partner (HRIS, CRM, finance) | Rekomendasi berdasarkan kebutuhan | Pihak ketiga | **Tidak ada partner terkonfirmasi — jangan ditampilkan** |

Aturan tampilan di `/solusi`:
- Setiap layanan mencantumkan: **siapa penyedianya**, untuk siapa, apa yang dihasilkan, cara memulai. Harga hanya bila sudah ditetapkan.
- Bila layanan dilaksanakan oleh Mierakigai: pernyataan eksplisit, mis. "Layanan implementasi dilaksanakan oleh Mierakigai, [hubungan dengan Fansightful]."
- Rekomendasi software kelak wajib menyertakan keterangan hubungan komersial (referral/komisi) di dekat tautan.

CTA berjenjang: Tool → artikel terkait → (playbook) → "Diskusikan kebutuhan Anda". Tidak ada pop-up, timer, atau gate email untuk mengakses hasil tool.

## 7. Bahasa, konten, dan SEO Indonesia-first

### 7.1 Bahasa
- Bahasa Indonesia yang wajar dan langsung; sapaan "Anda".
- Istilah Inggris dipertahankan bila lazim: *Tools Lab, Health Check, KPI, Performance Management, Workforce Planning*. Pada kemunculan pertama di halaman, beri penjelasan singkat bila perlu.
- Semua instruksi, validasi, pesan error, empty state, dan hasil tool dalam bahasa Indonesia.
- String UI dikumpulkan di satu file per locale (mis. `src/i18n/id.json`) agar locale lain dapat ditambah tanpa refaktor besar — **tanpa** membangun sistem terjemahan sekarang.

### 7.2 Struktur konten
- Cluster awal **Business & People Systems** (SF-08, *recommended*), 5 sub-topik mengikuti area Health Check: Peran, Struktur, Tujuan, Proses, Kinerja.
- Template artikel: ringkasan 3 poin di atas → gejala → penyebab umum → contoh konteks Indonesia → langkah praktis → batasan → tool/playbook terkait → penulis & tanggal pembaruan.
- Topik yang menyentuh regulasi (ketenagakerjaan, pajak, BPJS) wajib mencantumkan sumber resmi dan tanggal verifikasi.

### 7.3 Contoh judul berdasarkan intent

| Intent | Contoh judul |
|---|---|
| Gejala | "Tim Sibuk tapi Target Tidak Tercapai: 5 Penyebab yang Sering Terlewat" |
| Bagaimana | "Cara Menyusun Uraian Tanggung Jawab untuk Tim 10–50 Orang" |
| Perbandingan | "KPI vs OKR: Mana yang Cocok untuk Bisnis Anda Saat Ini?" |
| Keputusan | "Kapan Founder Perlu Merekrut Manajer Pertama?" |
| Diagnosis | "Tanda Struktur Tim Anda Sudah Tidak Cocok dengan Ukuran Bisnis" |

Prioritas kualitas: 3–5 artikel kuat yang terhubung ke Health Check lebih bernilai daripada 30 artikel tipis.

### 7.4 SEO teknis (berdasarkan temuan audit)
- `404.html` nyata agar URL tak dikenal mengembalikan **404**, bukan homepage (memperbaiki soft-404).
- `robots.txt` dan `sitemap.xml` yang valid.
- `<title>` dan meta description unik per halaman; canonical; Open Graph + Twitter card; favicon.
- Structured data: `Organization`, `Article` (dengan `author`, `datePublished`, `dateModified`), `BreadcrumbList`. Untuk halaman tool, cukup `WebPage`; jangan menambahkan rating/review palsu.
- Tool sebagai konten utama: halaman tool memiliki teks pengantar yang dapat diindeks (apa yang diperiksa, untuk siapa, batasan).
- Internal linking: artikel ↔ area Health Check ↔ playbook.
- **Domain:** `*.pages.dev` bisa dipakai untuk MVP, tetapi otoritas SEO jangka panjang lebih baik dibangun di domain sendiri sejak awal (Q-04).
- Tanpa versi Inggris saat peluncuran; struktur URL tetap memungkinkan `/en/` kelak dengan `hreflang`.

## 8. Visual dan interaksi

### 8.1 Temuan desain saat ini (fakta)
Tema laut dalam gelap, animasi latar terus-menerus, judul shimmer, maskot, gaya game. Tipografi Fraunces + Outfit.

### 8.2 Arah yang direkomendasikan
Karakter: editorial-modern, profesional, tenang, mudah dipindai, interaktif hanya di tempat yang bermakna.

Opsi untuk dipilih (tidak dikunci):

| Opsi | Nuansa | Tipografi | Warna | Catatan |
|---|---|---|---|---|
| A — **Editorial hangat** | Seperti publikasi bisnis yang bersahabat | Fraunces (judul) + Outfit (teks) — sudah dipakai | Latar terang off-white, teks hampir hitam, satu aksen (mis. biru tua/teal yang diturunkan dari palet saat ini) | Kontinuitas dengan aset yang ada |
| B — **Netral profesional** | Bersih, ala produk SaaS | Satu keluarga sans (mis. Inter/Plus Jakarta Sans) | Netral + aksen tunggal | Paling aman, kurang khas |
| C — **Editorial kontras** | Lebih berani dan majalah | Serif tegas untuk judul + sans untuk UI | Hitam/putih + aksen hangat | Memerlukan kurasi gambar yang baik |

Prinsip interaksi:
- Animasi hanya untuk umpan balik (progres, transisi hasil), selalu menghormati `prefers-reduced-motion`.
- Tool menampilkan progres per area (mis. "Area 2 dari 5") — gamifikasi yang mendukung progres nyata.
- Maskot Lumi: tidak dipakai di MVP kecuali pengguna memutuskan menjadikannya maskot brand (R-01).
- Mode terang sebagai default untuk keterbacaan konten panjang; mode gelap opsional (P2).

## 9. Privasi, aksesibilitas, dan keandalan

| Area | Kebutuhan minimum MVP |
|---|---|
| Minimisasi data | Jawaban tool diproses di browser; tidak ada akun; form kontak hanya nama, email, nama perusahaan (opsional), pesan |
| Persetujuan | Checkbox eksplisit (tidak tercentang default) untuk: melampirkan hasil ke form kontak; newsletter (P1) |
| Penjelasan data | Halaman `/privasi`: data apa, untuk apa, berapa lama disimpan, siapa yang memproses (mis. penyedia email/analytics), cara meminta penghapusan. Kepatuhan terhadap UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi perlu ditinjau dengan sumber resmi/penasihat hukum |
| Analytics | Tanpa cookie bila memungkinkan; tanpa IP lengkap, email, atau isi jawaban di event; tidak ada session replay |
| Input & error | Validasi di sisi klien dan server (form kontak); pesan error spesifik dalam bahasa Indonesia; proteksi spam (mis. Cloudflare Turnstile) untuk form |
| Responsif | Mobile-first, diuji di 360, 768, 1280 px; tanpa scroll horizontal |
| Keyboard & label | Semua input memiliki `<label>`; kelompok pilihan memakai `fieldset/legend`; fokus terlihat; urutan fokus logis; dialog mengelola fokus |
| Kontras | Minimal WCAG 2.2 AA (4,5:1 untuk teks normal) — diukur, bukan diasumsikan |
| Keamanan dasar | Header keamanan via `_headers` (CSP, `X-Content-Type-Options`, `Referrer-Policy`); tidak memakai `innerHTML` untuk data pengguna; rahasia hanya di environment variables Cloudflare |
| Keandalan | Halaman statis + tool di sisi klien → tidak tergantung backend; deploy via Git dengan preview per branch |

**Tidak ditambahkan sekarang:** autentikasi, penyimpanan hasil di server, profil pengguna — sampai use case dan pendekatan privasinya jelas (P2).

## 10. Opsi stack teknis (untuk keputusan, bukan final)

| Opsi | Cocok untuk | Kelebihan | Kekurangan |
|---|---|---|---|
| **A. HTML/JS statis multi-halaman** (melanjutkan pola saat ini) | Prototipe sangat kecil | Nol build, sama dengan cara deploy sekarang | Konten artikel, layout bersama, metadata, sitemap harus dikelola manual; cepat menjadi tidak terawat |
| **B. Astro (static output) di Cloudflare Pages** | Situs konten + beberapa tool interaktif | Content collections untuk Insights/Playbooks (Markdown), komponen "island" untuk tool, HTML statis cepat dan SEO-friendly, sitemap otomatis, cocok dengan Pages | Perlu Node.js dan langkah build (Node v24 sudah terpasang di mesin ini) |
| **C. Next.js / framework aplikasi penuh** | Aplikasi dengan akun dan data dinamis | Ekosistem besar | Berlebihan untuk MVP tanpa akun; kompleksitas deploy di Pages lebih tinggi |

**Rekomendasi: Opsi B** [R-02], dengan kode tool ditulis sebagai modul logika murni (mudah diuji unit) terpisah dari UI. Kebutuhan server satu-satunya di MVP (form kontak) dapat ditangani oleh Cloudflare Pages Function + Turnstile, atau layanan form pihak ketiga — keputusan terbuka (Q-05).

Prasyarat apa pun opsinya: inisialisasi Git dan, idealnya, hubungkan project Pages ke repository agar ada riwayat dan preview deploy (R-03; perubahan konfigurasi deployment memerlukan persetujuan).
