# 03 — Decision Log: Fansightful

Aturan: rekomendasi **tidak** menjadi keputusan final tanpa persetujuan eksplisit pengguna. Setiap perubahan status dicatat dengan tanggal dan sumber.

---

## 1. Keputusan LOCKED (sumber: Strategic Foundation v1.0)

| ID | Keputusan | Status | Sumber |
|---|---|---|---|
| SF-01 | Fansightful adalah Knowledge & Tools Ecosystem, bukan sekadar blog, situs konsultan, atau direktori software | Locked | SF §1, §12 |
| SF-02 | Indonesia-first; Indonesia pasar awal; ekspansi internasional opsi masa depan | Locked | SF §2, §12 |
| SF-03 | Platform-first dengan sentuhan founder-led | Locked | SF §3, §12 |
| SF-04 | Audiens utama: founder, business builder, manajer | Locked | SF §2, §12 |
| SF-05 | Pengalaman pembeda: tools interaktif terhubung ke pengetahuan dan solusi | Locked | SF §12 |
| SF-06 | Journey: Discover → Understand → Experiment → Act → Return & Grow | Locked | SF §1, §12 |
| SF-07 | Free-to-value, paid-to-implement | Locked | SF §7, §12 |
| SF-P | Positioning, brand promise ("Every insight should help you move forward"), value proposition, experience principles, prinsip gamifikasi, bahasa, prinsip pasar & konten | Locked | SF §1–§4 |
| SF-08 | Fokus awal Business & People Systems | *Recommended direction* | SF §5, §12 |
| SF-09 | Shortlist tool: Health Check; KPI & Performance Designer; HR Cost & Workforce Calculator | *Proposed MVP* | SF §6, §12 |
| SF-WC | "Understand the Problem. Discover the Possibilities. Build Better." | *Working copy* | SF §1 |

## 1a. Keputusan yang disetujui pengguna

| ID | Keputusan | Tanggal | Sumber | Catatan |
|---|---|---|---|---|
| R-01 | Mini-game keluar dari homepage | 27 Okt 2026 | Persetujuan pengguna di chat | Sub-opsi (hapus / arsip di route terpisah / Lumi jadi maskot) **belum dipilih** — lihat Q-08 |
| R-02 | Stack: Astro (static output) di Cloudflare Pages | 27 Okt 2026 | Persetujuan pengguna di chat | — |
| R-04 | Vertical slice pertama: Business & People Health Check | 27 Okt 2026 | Persetujuan pengguna di chat | Konsekuensi: R-05 (tanpa skor total) diperlakukan sebagai default kerja sampai pengguna menyatakan lain |

## 2. Rekomendasi yang menunggu persetujuan

| ID | Rekomendasi | Alasan | Alternatif |
|---|---|---|---|
| R-01 | Mini-game "Ekspedisi kebijaksanaan" **dikeluarkan dari homepage**. Pilihan: (a) dihapus, (b) diarsipkan di route terpisah sebagai easter egg, (c) maskot Lumi dijadikan maskot brand | Bertentangan dengan positioning dan arah visual | Pengguna mungkin punya alasan personal/brand untuk mempertahankannya |
| R-02 | Stack: **Astro (static) di Cloudflare Pages** | Situs konten + island interaktif; SEO; murah dipelihara | HTML statis (A) atau Next.js (C) — lihat `01` §10 |
| R-03 | Inisialisasi Git dan hubungkan project Pages ke repository (preview per branch) | Saat ini direct upload tanpa riwayat | Tetap direct upload via Wrangler CLI dengan Git lokal |
| R-04 | Vertical slice pertama: **Business & People Health Check** | Pintu masuk journey; risiko data & regulasi terendah | KPI Designer atau HR Cost Calculator — lihat `01` §5.1 |
| R-05 | Health Check **tanpa skor total**; status per area dengan aturan transparan; disebut "pemeriksaan awal" | Metodologi belum tervalidasi | Skor numerik setelah ada validasi |
| R-06 | Slug Indonesia untuk halaman umum (`/solusi`, `/tentang`, `/kontak`, `/privasi`) dan istilah brand untuk `/tools-lab`, `/insights`, `/playbooks` | Indonesia-first + konsistensi vocabulary brand | Semua slug Inggris atau semua Indonesia |
| R-07 | Arah visual opsi A (editorial hangat, Fraunces + Outfit, latar terang) sebagai default sementara | Kontinuitas aset, sesuai prinsip editorial-modern | Opsi B atau C — lihat `01` §8.2 |
| R-08 | Jawaban tool tidak dikirim/disimpan di server pada MVP | Minimisasi data | Penyimpanan anonim agregat untuk riset (butuh kebijakan) |
| R-09 | Event `result_view` menyertakan jumlah area yang ditandai (0–5) | Mengetahui area mana yang paling dibutuhkan untuk memilih tool kedua | Tanpa properti hasil sama sekali |

## 3. Keputusan terbuka (tidak ditebak)

| ID | Pertanyaan | Mengapa material |
|---|---|---|
| Q-01 | Apakah ada repository/versi Fansightful lain di luar workspace ini? | Bila ada, audit harus diulang terhadapnya |
| Q-02 | Layanan apa yang benar-benar bisa dideliver saat ini, oleh entitas mana (founder pribadi / Fansightful / Mierakigai), dan dengan cakupan apa? | Menentukan isi `/solusi` dan CTA komersial |
| Q-03 | Vendor analytics dan pendekatan persetujuan | Memengaruhi privasi, biaya, dan kemampuan custom event |
| Q-04 | Domain kustom apa dan kapan? | SEO dan identitas brand |
| Q-05 | Penanganan form kontak: Pages Function + Turnstile, layanan form pihak ketiga, atau mailto | Keamanan, spam, privasi |
| Q-06 | Siapa yang menulis/meninjau konten, dan alur publikasinya | Kapasitas produksi Insights |
| Q-07 | Hosting dan akun (Cloudflare, Git) sebaiknya berada di bawah akun brand Fansightful yang independen? Saat ini project Pages berada di akun Cloudflare yang terhubung ke email domain Mierakigai | Prinsip brand independen (SF-03) dan kepemilikan aset jangka panjang |
| Q-08 | Nasib mini-game setelah keluar dari homepage: (a) dihapus, (b) diarsipkan di route terpisah (mis. `/lab/ekspedisi`, `noindex`), (c) Lumi dijadikan maskot brand | Menentukan apakah file lama ikut dimigrasi; tidak memblokir P0 bila default (a) diterapkan saat cutover |
| Q-09 | Alamat email penerima pesan kontak | Dibutuhkan untuk alur kontak P0-09 |

## 4. Asumsi yang perlu diverifikasi

| ID | Asumsi | Cara verifikasi |
|---|---|---|
| A-01 | Pengguna target memiliki tim ±5–200 orang | Wawancara 5–8 calon pengguna |
| A-02 | Health Check dapat diselesaikan ±10 menit | Uji pengguna dengan prototipe |
| A-03 | Urutan prioritas area (peran & tujuan sebagai prasyarat) masuk akal | Tinjauan founder |
| A-04 | Pengguna mau membaca artikel setelah hasil (bukan langsung pergi) | Event `next_action_click` |
| A-05 | `pages.dev` cukup untuk fase validasi | Keputusan Q-04 |

## 5. Keputusan yang dibuat selama audit

| ID | Tanggal | Keputusan | Alasan | Dapat diubah? |
|---|---|---|---|---|
| D-AUD-01 | 27 Okt 2026 | Dokumen audit diletakkan di `C:\Irfan\New folder\Claude Code File\docs\fansightful\`, **bukan** di dalam folder `fansightful/` | Folder `fansightful/` di-deploy dengan direct upload; dokumen internal bisa ikut terpublikasi bila folder itu di-upload ulang | Ya — pindahkan setelah ada repository dengan output build terpisah |
| D-AUD-02 | 27 Okt 2026 | Konfigurasi Cloudflare dibaca hanya via API read-only (GET); tidak ada perubahan | Aturan tahap audit | — |
| D-IMP-01 | 27 Okt 2026 | Dokumen dipindah ke `fansightful-web/docs/fansightful/` (menutup D-AUD-01) | Astro hanya mempublikasikan `dist/` | Ya |
| D-IMP-02 | 27 Okt 2026 | TypeScript 6.0.3 (dipilih npm sesuai peer dependency `@astrojs/check`), bukan 7.x | Menghindari ketidakcocokan typecheck | Naikkan saat `@astrojs/check` mendukung TS 7 |
| D-IMP-03 | 27 Okt 2026 | Font Fraunces & Outfit di-*self-host* via Fontsource, bukan Google Fonts | Tanpa request ke pihak ketiga; CSP `font-src 'self'` | Ya |
| D-IMP-04 | 27 Okt 2026 | CSP ketat (`script-src 'self'`, `style-src 'self'`) dengan `inlineStylesheets: 'never'`; satu-satunya script inline adalah JSON-LD (tidak dieksekusi, tidak diblokir CSP) | Keamanan dasar | Tinjau saat vendor analytics dipasang (Q-03) |
| D-IMP-06 | 27 Okt 2026 | Tombol "Lanjut"/"Lihat hasil" tidak dinonaktifkan; validasi dijalankan saat diklik (ringkasan error + pesan per pernyataan + fokus ke pernyataan pertama yang kosong). Menggantikan bunyi AC 2 di blueprint §5.2 ("non-aktif sampai semua terjawab") | Tombol nonaktif tidak menjelaskan apa yang kurang dan sulit ditemukan pengguna keyboard/screen reader; tujuan AC 2 (tidak ada hasil dengan jawaban kosong) tetap terpenuhi | Ya |
| D-IMP-07 | 27 Okt 2026 | Event `result_view` dikirim tanpa properti hasil (`areas_flagged_count`) | R-09 belum disetujui | Tambahkan bila R-09 disetujui |
| D-IMP-05 | 27 Okt 2026 | Status "Relatif terbentuk" tetap berlaku bila satu jawaban "Tidak tahu" dan sisanya ≥ level 2 | Konsekuensi urutan aturan di blueprint §5.2; diuji di `evaluate.test.ts` | Ya, bila founder menginginkan aturan lain |

## 6. Riwayat perubahan

| Tanggal | Perubahan |
|---|---|
| 27 Okt 2026 | Dokumen dibuat dari audit awal |
| 27 Okt 2026 | R-01, R-02, R-04 disetujui pengguna; Q-08 dan Q-09 ditambahkan; rencana implementasi P0 dibuat (`04_P0_IMPLEMENTATION_PLAN.md`) |
| 27 Okt 2026 | M0–M2 selesai di `fansightful-web/` (commit `157f570`, belum di-deploy); D-IMP-01 s.d. D-IMP-05 dicatat |
| 27 Okt 2026 | M3 selesai: `/tools-lab/` dan `/tools-lab/health-check/` (kuesioner bertahap, validasi, hasil, cetak, CTA bantuan); adapter analytics no-op; D-IMP-06 dan D-IMP-07 dicatat. Belum di-deploy |
