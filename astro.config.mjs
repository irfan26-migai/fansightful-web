// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Ganti ke domain kustom saat Q-04 diputuskan; canonical, OG, robots, dan sitemap ikut berubah.
const SITE = 'https://fansightful.pages.dev';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [sitemap()],
  build: {
    // CSS sebagai file terpisah agar CSP tidak perlu mengizinkan style inline.
    inlineStylesheets: 'never',
  },
});
