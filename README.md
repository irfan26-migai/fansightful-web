# fansightful-web

Situs Fansightful: Knowledge & Tools Ecosystem untuk founder, business builder, dan manajer di Indonesia.
Dibangun dengan Astro (output statis) untuk Cloudflare Pages.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm install` | Pasang dependency |
| `npm run dev` | Server pengembangan di `localhost:4321` |
| `npm run check` | Typecheck (`astro check`) |
| `npm run test` | Unit test (Vitest) |
| `npm run build` | Build ke `dist/` |
| `npm run verify` | check + test + build — wajib hijau sebelum commit |

## Struktur penting

- `src/tools/health-check/` — Business & People Health Check: `instrument.ts` (konten, **draf**), `evaluate.ts` (aturan penilaian, fungsi murni), `evaluate.test.ts`.
- `src/i18n/id.ts` — string UI berbahasa Indonesia.
- `src/styles/tokens.css` — token warna, tipografi, spasi.
- `public/_headers` — security headers Cloudflare Pages.
- `docs/fansightful/` — audit, blueprint, backlog, decision log, rencana implementasi. **Tidak ikut ter-deploy** (hanya `dist/` yang dipublikasikan).

## Deploy

Belum ada deploy dari repository ini. Rencana: preview lalu produksi via Wrangler, masing-masing dengan persetujuan pemilik proyek. Lihat `docs/fansightful/04_P0_IMPLEMENTATION_PLAN.md` §M7.
