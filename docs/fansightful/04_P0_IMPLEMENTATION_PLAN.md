# 04 — Rencana Implementasi P0: Fansightful

- **Versi:** draft 1, 27 Oktober 2026
- **Dasar keputusan:** R-01 (mini-game keluar dari homepage), R-02 (Astro static di Cloudflare Pages), R-04 (Health Check sebagai tool pertama) — disetujui 27 Okt 2026. Lihat `03_DECISION_LOG.md`.
- **Lingkup:** item P0-01 s.d. P0-12 di `02_MVP_BACKLOG.md`.
- **Status:** rencana. Belum ada kode yang ditulis, belum ada perubahan deployment.

---

## 1. Prinsip eksekusi

1. **Vertical slice dulu.** Urutan kerja mengejar satu alur yang berfungsi: Home → Health Check → hasil → langkah berikutnya. Halaman pendukung menyusul di sekitarnya.
2. **Produksi tidak disentuh sampai cutover.** Situs baru dibangun di folder terpisah dan diuji di URL preview Cloudflare. Mini-game tetap tayang sampai cutover disetujui.
3. **Yang terblokir keputusan tidak menghentikan yang lain.** Setiap blocker punya *default sementara* yang aman (§6).
4. **Logika terpisah dari UI.** Aturan penilaian Health Check adalah fungsi murni yang diuji unit, sehingga perubahan isi pernyataan atau ambang tidak menyentuh UI.
5. **Tanpa dependency yang tidak perlu.** Tidak ada UI framework (React/Preact) di MVP: kuesioner dirender sebagai HTML statis dan diperkaya TypeScript ringan.

## 2. Lokasi dan struktur proyek

### 2.1 Lokasi
- Proyek baru: `C:\Irfan\New folder\Claude Code File\fansightful-web\` (repository Git baru).
- Folder lama `fansightful/` dibiarkan utuh sebagai arsip sampai Q-08 diputuskan.
- Dokumen strategi dipindahkan ke `fansightful-web/docs/fansightful/` setelah repository ada. Karena Astro hanya mempublikasikan `dist/`, `docs/` tidak ikut ter-deploy (menutup D-AUD-01).

### 2.2 Struktur direktori yang direncanakan

```
fansightful-web/
├─ astro.config.mjs          # site URL, output static, integrasi sitemap
├─ package.json
├─ tsconfig.json
├─ public/
│  ├─ robots.txt
│  ├─ favicon.svg
│  ├─ og-default.png
│  └─ _headers               # security headers Cloudflare Pages
├─ src/
│  ├─ i18n/id.ts             # semua string UI (locale id)
│  ├─ styles/tokens.css      # warna, tipografi, spasi (opsi visual A)
│  ├─ styles/global.css
│  ├─ layouts/BaseLayout.astro   # <head>, SEO, header, footer, skip-link
│  ├─ components/
│  │  ├─ SeoHead.astro       # title, description, canonical, OG, JSON-LD
│  │  ├─ SiteHeader.astro / SiteFooter.astro
│  │  ├─ ProblemCard.astro / ToolCard.astro
│  │  └─ Callout.astro       # kotak asumsi & batasan
│  ├─ tools/health-check/
│  │  ├─ instrument.ts       # area, pernyataan, skala, teks hasil, next actions
│  │  ├─ evaluate.ts         # fungsi murni: jawaban → status per area
│  │  ├─ evaluate.test.ts    # unit test T1–T6 + kasus tepi
│  │  ├─ ui.ts               # stepper, validasi, render hasil, cetak
│  │  └─ HealthCheck.astro   # markup fieldset/radio statis
│  ├─ lib/analytics.ts       # track(event, props) — adapter, no-op default
│  ├─ content/insights/      # artikel Markdown (content collection)
│  └─ pages/
│     ├─ index.astro
│     ├─ tools-lab/index.astro
│     ├─ tools-lab/health-check.astro
│     ├─ insights/index.astro, insights/[slug].astro
│     ├─ solusi.astro, tentang.astro, kontak.astro, privasi.astro
│     └─ 404.astro
└─ docs/fansightful/          # dokumen 00–04 (tidak di-deploy)
```

### 2.3 Tooling (versi di npm per 27 Okt 2026; dikunci di lockfile saat setup)

| Paket | Versi terbaru | Kegunaan |
|---|---|---|
| `astro` | 7.4.2 | Framework situs statis |
| `@astrojs/sitemap` | 3.7.4 | `sitemap-index.xml` otomatis |
| `@astrojs/check` | 0.9.12 | Typecheck file `.astro` |
| `typescript` | 7.0.2 | Typecheck — **kompatibilitas dengan `@astrojs/check` harus dicek saat setup**; bila bermasalah, pakai versi TypeScript yang direkomendasikan template Astro |
| `vitest` | 5.0.5 | Unit test logika Health Check |
| `wrangler` | 4.153.0 | Deploy ke Cloudflare Pages (preview & produksi) |

Lingkungan lokal terverifikasi: Node v24.22.1, npm 11.19.1, Git 2.55.

Script `package.json` yang direncanakan: `dev`, `build`, `preview`, `check` (astro check), `test` (vitest run), `verify` (check + test + build).

## 3. Desain teknis Health Check

### 3.1 Model data (`instrument.ts`)

```ts
type AreaId = 'A' | 'B' | 'C' | 'D' | 'E';
type Answer = 0 | 1 | 2 | 3 | 'unknown';
// 0 Belum ada · 1 Ada, tapi belum konsisten · 2 Sebagian besar berjalan · 3 Berjalan dan ditinjau rutin

interface Statement { id: string; area: AreaId; text: string }
interface Area {
  id: AreaId; title: string; why: string;          // mengapa area ini penting
  nextActions: string[];                            // 1–3 langkah konkret
  relatedInsight?: string;                          // slug artikel; tautan tampil hanya bila artikel ada
}
type AreaStatus = 'needs_attention' | 'forming' | 'established' | 'insufficient_info';
```

Konten instrumen ditulis sebagai data, bukan di dalam komponen, sehingga founder dapat meninjau satu file.

### 3.2 Logika (`evaluate.ts`)
Implementasi persis aturan `01_PRODUCT_UX_BLUEPRINT.md` §5.2, dengan urutan pemeriksaan:
1. ≥2 jawaban `unknown` → `insufficient_info`
2. ≥2 jawaban bernilai 0/1 → `needs_attention`
3. tepat 1 jawaban bernilai 0/1 → `forming`
4. selainnya → `established`

Output: status per area, pernyataan pemicu, dan urutan prioritas (jumlah jawaban 0 terbanyak, seri A→E). Tidak ada skor total.

Kasus tepi yang ditambahkan ke T1–T6: semua `unknown`; satu area kosong (harus melempar error, karena UI mencegahnya); urutan prioritas saat seri.

### 3.3 UI (`HealthCheck.astro` + `ui.ts`)
- **Tanpa JavaScript:** halaman tetap menampilkan pengantar dan seluruh pernyataan sebagai `fieldset` + radio, plus pesan bahwa JavaScript diperlukan untuk melihat hasil.
- **Dengan JavaScript:**
  - Satu area per langkah, dengan progres "Area X dari 5".
  - Tombol Kembali/Lanjut. Validasi per langkah memindahkan fokus ke pernyataan pertama yang belum dijawab.
  - Hasil dirender ke region dengan `aria-live="polite"`, lalu fokus dipindah ke judul hasil.
- **Teks hasil:** dibuat dengan `textContent`/`createElement`, bukan `innerHTML`.
- **Cetak:** CSS `@media print` menampilkan ringkasan saja; tombol memanggil `window.print()`.
- **Persistensi:** tidak ada di P0 (refresh = mulai ulang; T7). localStorage menunggu P1-01.

### 3.4 Analytics (`lib/analytics.ts`)
- Satu fungsi `track(name, props)` dengan daftar event yang di-*type* (sesuai tabel di `01` §5.2).
- **Default: no-op + `console.debug` di mode dev.** Vendor dipasang belakangan tanpa mengubah pemanggil (Q-03).
- Penjaga tipe memastikan properti hanya berisi enum atau angka kecil, tidak pernah string bebas atau jawaban.

## 4. Milestone dan urutan kerja

Kompleksitas memakai skala S/M/L, bukan estimasi durasi. Setiap milestone ditutup dengan `npm run verify` hijau.

### M0 · Setup proyek — P0-01 (S)
- `git init`, scaffold Astro (template minimal), TypeScript strict, Vitest, sitemap, `.gitignore`, README singkat.
- Pindahkan `docs/fansightful/` ke repository.
- **Selesai bila:** `npm run verify` lulus pada halaman kosong; commit awal dibuat (atas izin pengguna).
- **Tidak termasuk:** remote Git atau integrasi Git di Cloudflare (Q-07).

### M1 · Fondasi situs + SEO teknis — P0-02, P0-03 (M)
- `tokens.css` (opsi visual A sebagai default sementara: latar terang, Fraunces + Outfit, satu aksen biru-teal), `BaseLayout`, header/footer, skip-link, `SeoHead`, `404.astro`, `robots.txt`, sitemap, `_headers` (CSP dasar, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`), favicon.
- Font: tetap Google Fonts dengan `display=swap`, atau di-*self-host* untuk privasi dan performa. Rekomendasi: self-host, agar tidak ada request ke pihak ketiga tanpa disebut di `/privasi`.
- **Selesai bila:**
  - Build menghasilkan `404.html`, `robots.txt`, dan sitemap.
  - Halaman contoh lulus axe/Lighthouse Accessibility ≥95.
  - Tidak ada scroll horizontal di 360 px.

### M2 · Mesin Health Check — P0-06 bagian logika (M)
- `instrument.ts` berisi **draf** pernyataan dari blueprint, ditandai `// DRAFT — perlu review founder`.
- `evaluate.ts` + `evaluate.test.ts`.
- **Selesai bila:** T1–T6 dan kasus tepi lulus; cakupan test `evaluate.ts` 100% baris.

### M3 · UI Health Check + hasil — P0-06, P0-07 (L)
- Halaman `/tools-lab/health-check`: pengantar (apa yang diperiksa, untuk siapa, ±10 menit, batasan), kuesioner bertahap, hasil, callout asumsi & batasan, next actions, tombol cetak, CTA "Diskusikan hasil ini" (lihat default Q-02 di §6).
- Halaman `/tools-lab` berisi satu kartu tool.
- **Selesai bila:** AC 1–8 dan 10 di `01` §5.2 terpenuhi secara manual. Uji T7–T9 lulus. Tab Network menunjukkan tidak ada request yang memuat jawaban.

### M4 · Homepage dan halaman pendukung — P0-04, P0-09, P0-10 (M)
- `index.astro` sesuai `01` §4. Section Insights tersembunyi otomatis bila artikel <3; section "Dikurasi oleh" memakai placeholder sampai profil founder tersedia.
- `/tentang`, `/privasi` (draf; perlu tinjauan UU PDP), `/solusi` dan `/kontak` dengan default sementara (§6).
- **Selesai bila:** semua link internal valid (cek otomatis saat build); tidak ada klaim/testimonial/partner yang belum terkonfirmasi.

### M5 · Insights minimal — P0-08 (M, dominan konten)
- Content collection `insights` dengan skema (judul, ringkasan, penulis, tanggal terbit/diperbarui, area terkait, sumber), template artikel, schema `Article`.
- Tautan "Baca selengkapnya" di hasil Health Check hanya muncul untuk area yang artikelnya sudah ada.
- **Bergantung pada penulis (Q-06).** Kode bisa selesai lebih dulu; nav "Insights" muncul saat ≥3 artikel terbit.

### M6 · Analytics — P0-11 (S untuk adapter, M bila vendor dipasang)
- Pemanggilan `track()` di semua titik event.
- Pemasangan vendor setelah Q-03, beserta pembaruan `/privasi`.

### M7 · QA, preview, dan cutover — P0-12 (S–M)
1. Checklist QA (§5) di build lokal.
2. Deploy ke **URL preview** Cloudflare (`wrangler pages deploy dist --branch=preview`) — **butuh izin pengguna**.
3. Review pengguna di preview (desktop + ponsel nyata).
4. Deploy produksi ke branch `main` — **butuh izin pengguna terpisah**. Mini-game hilang dari `/` (R-01). Nasib file lama mengikuti Q-08; default sementara: tidak dimigrasi, tetap tersimpan di folder `fansightful/` dan di riwayat deployment Cloudflare.
5. Pasca-cutover: cek 404, robots, sitemap, OG preview (tempel link di WhatsApp/LinkedIn), dan riwayat rollback di dashboard.

### Ketergantungan antar milestone

```
M0 → M1 → M3 → M4 → M7
      M2 ↗          ↑
      M5 (konten, paralel) ┘
      M6 (adapter bersama M3; vendor menunggu Q-03)
```

## 5. Strategi pengujian

| Lapisan | Alat | Cakupan |
|---|---|---|
| Logika | Vitest | `evaluate.ts`: T1–T6 + kasus tepi |
| Tipe | `astro check` | Seluruh `.astro`/`.ts` |
| Build | `astro build` | Semua halaman ter-render; sitemap; 404 |
| Aksesibilitas | Lighthouse + axe (DevTools), uji keyboard manual | Home, Tools Lab, Health Check (awal & hasil), Kontak |
| Responsif | Browser pane: 360, 768, 1280 px; satu Android + satu iPhone nyata oleh pengguna | Semua halaman P0 |
| Privasi | Tab Network saat menyelesaikan tool | Tidak ada payload berisi jawaban |
| SEO | `curl -I` URL acak (404), validator sitemap, Rich Results Test untuk artikel | Pasca-preview |

E2E otomatis (mis. Playwright) **ditunda ke P1**: satu alur dengan logika yang sudah diuji unit belum membenarkan biaya pemeliharaannya.

## 6. Blocker dan default sementara

| Keputusan | Memblokir | Default sementara (agar kerja jalan) |
|---|---|---|
| Q-02 Entitas & cakupan layanan | Isi `/solusi` | `/solusi` hanya berisi "Butuh bantuan menerapkan hasil? Hubungi kami." tanpa daftar layanan, harga, atau nama entitas |
| Q-09 Email penerima kontak | Fungsi `/kontak` | Form belum diaktifkan; tampilkan placeholder sampai alamat diberikan |
| Q-05 Penanganan form | Fungsi `/kontak` | Rekomendasi: Pages Function + Turnstile, dikerjakan setelah Q-09. **Tidak memblokir cutover** bila `/kontak` sementara memakai `mailto:` |
| Q-03 Vendor analytics | Data validasi MVP | Adapter no-op; cutover boleh tanpa analytics, tetapi validasi MVP baru dimulai setelah vendor aktif |
| Q-06 Penulis konten | Insights | Nav Insights disembunyikan; hasil tool tanpa tautan artikel |
| Q-07 Akun brand independen | Integrasi Git di Cloudflare, remote repo | Deploy tetap via Wrangler ke project yang ada; Git hanya lokal |
| Q-08 Nasib mini-game | Tidak ada | Tidak dimigrasi |
| Q-04 Domain | Canonical final | `site` = `https://fansightful.pages.dev`; diganti satu baris saat domain siap |
| Review instrumen oleh founder (P0-05) | **Cutover** | Pengembangan memakai draf; **cutover ke produksi tidak dilakukan** sebelum founder menyetujui pernyataan dan next actions |
| Profil founder (`/tentang`, home) | Cutover | Placeholder hanya di preview; wajib diisi sebelum produksi |

**Syarat minimum cutover produksi:**
- Instrumen sudah disetujui founder.
- Halaman `/tentang` sudah terisi.
- Halaman `/privasi` sudah ada.
- `/kontak` berfungsi, minimal lewat `mailto:`.
- Checklist QA lulus.
- Pengguna memberi izin deploy.

## 7. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| TypeScript 7 belum kompatibel dengan `@astrojs/check` | Typecheck gagal | Cek saat M0; pakai versi yang dipasang template Astro |
| Konten instrumen tertunda | Cutover tertunda | Mulai review founder paralel dengan M1 |
| Hasil terasa generik | Nilai rendah, pengguna tidak kembali | Uji draf ke 3–5 calon pengguna sebelum cutover; next actions spesifik dan berkonteks Indonesia |
| Halaman Solusi kosong terlihat tidak meyakinkan | Konversi rendah | Lebih baik jujur dan sedikit daripada mengklaim layanan yang belum siap (SF §7) |
| Deploy produksi tanpa Git remote | Kehilangan riwayat bila laptop bermasalah | Putuskan Q-07 sedini mungkin; sementara simpan cadangan repo |

## 8. Langkah segera setelah rencana ini disetujui

Bisa dikerjakan langsung tanpa menunggu keputusan lain:
1. **M0:** buat `fansightful-web/`, `git init`, scaffold Astro, tooling, pindahkan dokumen.
2. **M1:** fondasi dan SEO teknis.
3. **M2:** mesin Health Check + unit test dengan draf instrumen.

Yang dibutuhkan dari pengguna secara paralel:
- Review draf 20 pernyataan dan next actions (file `instrument.ts` atau versi dokumen).
- Profil singkat founder untuk `/tentang`.
- Jawaban Q-02 dan Q-09.
