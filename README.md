# fansightful-web

Situs Fansightful: Knowledge & Tools Ecosystem untuk founder, business builder, dan manajer di Indonesia.
Dibangun dengan Astro (output statis) untuk Cloudflare Pages.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm install` | Pasang dependency |
| `npm run dev` | Server pengembangan di `localhost:4321` |
| `npm run check` | Typecheck (`astro check`) |
| `npm run test` | Unit test + DOM test (Vitest; DOM test membaca `dist/`, jadi build dulu) |
| `npm run test:coverage` | Test + laporan coverage `src/tools/` (butuh `dist/`) |
| `npm run build` | Build ke `dist/` |
| `npm run verify` | check + build + test + cek tautan — wajib hijau sebelum commit |
| `npm run test:e2e` | E2E Playwright di Chromium terhadap `dist/` (butuh build; browser: `npx playwright install chromium` bila belum ada) |
| `npm run verify:full` | `verify` + `test:e2e` |

## Test

- **Logika murni** — `evaluate.test.ts`, `src/lib/insights.test.ts`.
- **DOM (jsdom)** — `src/tools/health-check/ui.test.ts`: menjalankan `ui.ts` di atas HTML hasil build. Ini yang mengukur coverage `ui.ts`.
- **E2E (Playwright)** — `e2e/*.e2e.ts`: perjalanan keyboard, privasi request, layar ponsel, dan nol error console/CSP. Header dari `public/_headers` disuntikkan ke `astro preview` agar CSP produksi ikut diuji. Coverage E2E tidak digabung ke laporan coverage.

## Struktur penting

- `src/tools/health-check/` — Business & People Health Check: `instrument.ts` (konten, **draf**), `evaluate.ts` (aturan penilaian, fungsi murni), `ui.ts` (perilaku di browser), beserta test-nya.
- `src/i18n/id.ts` — string UI berbahasa Indonesia.
- `src/styles/tokens.css` — token warna, tipografi, spasi.
- `public/_headers` — security headers Cloudflare Pages.
- `docs/fansightful/` — audit, blueprint, backlog, decision log, rencana implementasi. **Tidak ikut ter-deploy** (hanya `dist/` yang dipublikasikan).

## Deploy

Preview: `npx wrangler pages deploy dist --project-name=fansightful --branch=preview` → https://preview.fansightful.pages.dev. Produksi belum dilakukan. Setiap deploy butuh persetujuan pemilik proyek. Lihat `docs/fansightful/04_P0_IMPLEMENTATION_PLAN.md` §M7.
