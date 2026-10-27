# 02 — MVP Backlog: Fansightful

- **Versi:** draft 1, 27 Oktober 2026
- **Vertical slice pertama (direkomendasikan):** kebutuhan pengguna → **Business & People Health Check** → hasil per area → penjelasan & batasan → langkah berikutnya (artikel / ringkasan / solusi). Spesifikasi lengkap: `01_PRODUCT_UX_BLUEPRINT.md` §5.
- **Kompleksitas relatif:** S / M / L — bukan estimasi durasi.
- **27 Okt 2026:** P0-00 sebagian selesai — R-01, R-02, R-04 disetujui. Q-02 masih terbuka; default sementaranya ada di `04_P0_IMPLEMENTATION_PLAN.md` §6. Urutan pengerjaan P0 mengikuti milestone M0–M7 di dokumen tersebut.

---

## P0 — Wajib untuk vertical slice MVP

### P0-00 · Gerbang keputusan arah
- **Outcome pengguna:** — (prasyarat)
- **Alasan bisnis:** mencegah membangun di atas asumsi yang salah.
- **Dependensi:** dokumen audit & blueprint ini.
- **Kompleksitas:** S
- **Acceptance criteria:** pengguna memutuskan R-01 (nasib mini-game), R-02 (stack), R-04 (tool pertama), Q-02 (entitas layanan); keputusan dicatat di `03_DECISION_LOG.md`.
- **Risiko/pertanyaan:** keputusan entitas layanan bisa menunda halaman Solusi.

### P0-01 · Version control dan pipeline deploy
- **Outcome pengguna:** situs stabil; perubahan bisa ditinjau sebelum tayang.
- **Alasan bisnis:** saat ini deploy direct upload tanpa riwayat; risiko menimpa versi yang benar.
- **Dependensi:** P0-00; persetujuan perubahan deployment.
- **Kompleksitas:** S
- **Acceptance criteria:** repository Git dibuat; deploy dari branch `main` ke produksi dan branch lain ke URL preview; folder `docs/` tidak ikut terpublikasi; ada cara rollback yang terdokumentasi.
- **Risiko/pertanyaan:** Git hosting mana (GitHub?) dan akun siapa — terkait independensi brand dari Mierakigai (Q-07).

### P0-02 · Fondasi situs (layout, navigasi, token desain, string i18n)
- **Outcome pengguna:** navigasi konsisten dan mudah dibaca di semua perangkat.
- **Alasan bisnis:** dasar untuk semua halaman.
- **Dependensi:** P0-01, pilihan visual (R-07).
- **Kompleksitas:** M
- **Acceptance criteria:** header/footer/nav sesuai `01` §3.2; token warna & tipografi terpusat; string UI di file locale `id`; tanpa scroll horizontal di 360 px; skip-link; kontras AA terukur.
- **Risiko:** pilihan visual tertunda → gunakan opsi A sementara.

### P0-03 · SEO teknis dasar
- **Outcome pengguna:** halaman yang relevan dapat ditemukan; URL salah menunjukkan halaman 404 yang membantu.
- **Alasan bisnis:** memperbaiki soft-404 yang ditemukan di audit.
- **Dependensi:** P0-02.
- **Kompleksitas:** S
- **Acceptance criteria:** URL tak dikenal → HTTP 404 dengan tautan ke Home/Tools Lab; `/robots.txt` (text/plain) dan `/sitemap.xml` (XML) valid; title, description, canonical, OG per halaman; favicon.
- **Test:** `curl -I` ke URL acak mengembalikan 404; validator sitemap lulus.

### P0-04 · Homepage v1
- **Outcome pengguna:** dalam 5 detik paham apa Fansightful dan bisa memulai tool.
- **Alasan bisnis:** pintu masuk utama journey.
- **Dependensi:** P0-02; minimal P0-06 untuk CTA berfungsi.
- **Kompleksitas:** M
- **Acceptance criteria:** section sesuai `01` §4; section Insights disembunyikan bila <3 artikel; tidak ada testimonial/angka/partner yang belum terkonfirmasi; CTA primer menuju Health Check.
- **Risiko:** copy perlu diuji ke 3–5 calon pengguna.

### P0-05 · Konten instrumen Health Check (ditinjau ahli)
- **Outcome pengguna:** pernyataan relevan dan mudah dipahami.
- **Alasan bisnis:** kualitas diagnosis adalah inti nilai produk.
- **Dependensi:** founder sebagai reviewer domain.
- **Kompleksitas:** M
- **Acceptance criteria:** 20 pernyataan final (4 per area), teks penjelasan per area, 1–3 langkah berikutnya per area, teks asumsi & batasan; diuji keterbacaan pada ≥3 orang target.
- **Risiko:** ini pekerjaan konten, bukan kode — bisa menjadi bottleneck.

### P0-06 · Health Check: UI kuesioner dan logika
- **Outcome pengguna:** menyelesaikan pemeriksaan ±10 menit tanpa akun.
- **Alasan bisnis:** inti vertical slice.
- **Dependensi:** P0-02, P0-05.
- **Kompleksitas:** L
- **Acceptance criteria:** AC 1–4, 7–8 di `01` §5.2; logika dalam modul terpisah dengan unit test T1–T6; progres "Area X dari 5"; tidak ada request jaringan berisi jawaban.
- **Risiko:** godaan menambah skor total — dilarang tanpa metodologi.

### P0-07 · Halaman hasil dan next action
- **Outcome pengguna:** tahu area mana yang perlu perhatian dan langkah pertama yang konkret.
- **Alasan bisnis:** tahap Act; titik konversi yang tidak memaksa.
- **Dependensi:** P0-06, P0-08 (tautan artikel).
- **Kompleksitas:** M
- **Acceptance criteria:** AC 3, 5, 6, 10 di `01` §5.2; tautan ke artikel terkait; tombol cetak/simpan PDF; CTA solusi hanya setelah hasil dan dengan nama penyedia.
- **Test:** T6 (semua baik) menampilkan saran pemeliharaan, bukan dorongan komersial.

### P0-08 · Insights minimal (3 artikel)
- **Outcome pengguna:** memahami penyebab dan cara memperbaiki area yang bermasalah.
- **Alasan bisnis:** tahap Understand; SEO; kredibilitas.
- **Dependensi:** sistem konten (P0-02), penulis/founder.
- **Kompleksitas:** M (per 3 artikel, dominan konten)
- **Acceptance criteria:** 3 artikel mengikuti template `01` §7.2, masing-masing terhubung ke ≥1 area Health Check; penulis dan tanggal tercantum; schema `Article`.
- **Risiko:** artikel tipis demi jumlah — hindari.

### P0-09 · Halaman Solusi dan alur kontak
- **Outcome pengguna:** tahu bantuan apa yang tersedia, dari siapa, dan cara memulai.
- **Alasan bisnis:** jalur paid-to-implement.
- **Dependensi:** Q-02 (entitas & cakupan layanan), Q-05 (form handler).
- **Kompleksitas:** M
- **Acceptance criteria:** hanya layanan terkonfirmasi; penyedia disebut eksplisit; form kontak (nama, email, perusahaan opsional, pesan, checkbox lampirkan hasil tidak tercentang default) dengan validasi dan proteksi spam; konfirmasi keberhasilan dan pesan error berbahasa Indonesia; pesan sampai ke inbox yang ditentukan.
- **Risiko:** bila entitas belum diputuskan, tampilkan hanya "Hubungi kami" tanpa daftar layanan.

### P0-10 · Tentang dan Privasi
- **Outcome pengguna:** percaya pada siapa yang ada di balik platform dan bagaimana data diperlakukan.
- **Alasan bisnis:** trust through transparency.
- **Dependensi:** profil founder, keputusan analytics (Q-03).
- **Kompleksitas:** S
- **Acceptance criteria:** `/tentang` memuat misi, pendekatan, profil founder sebagai kurator, hubungan dengan entitas lain; `/privasi` memuat poin di `01` §9 dan tanggal berlaku.
- **Risiko:** teks privasi perlu ditinjau terhadap UU PDP.

### P0-11 · Analytics MVP yang menjaga privasi
- **Outcome pengguna:** — (tidak terlihat; tidak mengganggu)
- **Alasan bisnis:** memvalidasi apakah tool dipakai, diselesaikan, dan memicu langkah berikutnya.
- **Dependensi:** Q-03 (vendor). Catatan: Cloudflare Web Analytics mencatat pageview tetapi tidak mendukung custom event; event tool butuh solusi lain (mis. Plausible/Umami, atau endpoint sendiri).
- **Kompleksitas:** M
- **Acceptance criteria:** event di `01` §5.2 tercatat tanpa data pribadi dan tanpa isi jawaban; funnel `tool_view → tool_start → tool_complete → next_action_click` dapat dilihat; terdokumentasi di `/privasi`.

### P0-12 · QA dan aksesibilitas sebelum rilis
- **Outcome pengguna:** situs bekerja di perangkat dan cara akses yang beragam.
- **Alasan bisnis:** kualitas dan kepercayaan.
- **Dependensi:** semua item P0.
- **Kompleksitas:** S–M
- **Acceptance criteria:** T1–T9 lulus; uji keyboard penuh; kontras AA; Lighthouse Accessibility ≥95 di halaman utama; uji di Chrome Android dan Safari iOS; tidak ada error console; 404 benar.

## P1 — Setelah alur utama tervalidasi

| ID | Item | Outcome | Kompleksitas | Catatan / pemicu |
|---|---|---|---|---|
| P1-01 | Simpan hasil di perangkat (localStorage) + "lanjutkan" | Kembali tanpa mengulang | S | Hanya di browser; tetap tanpa akun |
| P1-02 | Newsletter + persetujuan eksplisit | Hubungan berkelanjutan | M | Butuh penyedia email & kebijakan |
| P1-03 | Playbook pertama + template unduhan | Tahap Build | M | Dipicu area yang paling sering "Perlu perhatian" |
| P1-04 | Tool kedua: KPI & Performance Designer | Menyusun tujuan–ukuran–target | L | Bila data menunjukkan area C/E dominan |
| P1-05 | Tool ketiga: HR Cost & Workforce Calculator | Membandingkan skenario biaya | L | Wajib verifikasi regulasi & tanggal |
| P1-06 | Rekomendasi berdasarkan kebutuhan yang dipilih | Rute personal tanpa akun | M | — |
| P1-07 | Alur demo/referral software | Akses ke solusi pihak ketiga | M | Hanya dengan partner terkonfirmasi + disclosure |
| P1-08 | Domain kustom (bila tidak diputuskan di P0) | Otoritas brand & SEO | S | Sebaiknya diputuskan lebih awal (Q-04) |
| P1-09 | Lebih banyak Insights (cluster Business & People) | Discovery | M berulang | Berdasarkan data pencarian & pertanyaan pengguna |

## P2 — Ditunda sampai ada bukti kebutuhan

- Akun pengguna dan dashboard pribadi
- Gamifikasi kompleks / progres lintas sesi di server
- Komunitas dan fitur sosial; leaderboard
- Marketplace software besar
- AI advisor lintas banyak area bisnis
- Versi bahasa Inggris (`/en/` + `hreflang`)
- Mode gelap

## Pertanyaan terbuka yang memengaruhi backlog

Lihat `03_DECISION_LOG.md` bagian "Keputusan terbuka" (Q-01 s.d. Q-07).
