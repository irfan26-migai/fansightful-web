// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { INSIGHTS_MIN_TO_LIST } from './src/lib/insights.ts';

// Ganti ke domain kustom saat Q-04 diputuskan; canonical, OG, robots, dan sitemap ikut berubah.
const SITE = 'https://fansightful.pages.dev';

// /insights/ diberi noindex sampai cukup artikel terbit; jangan cantumkan di sitemap selama itu.
const INSIGHTS_DIR = new URL('./src/content/insights/', import.meta.url);
const publishedInsights = readdirSync(INSIGHTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .filter((f) => !/^draft:\s*true\s*$/m.test(readFileSync(new URL(f, INSIGHTS_DIR), 'utf8'))).length;
const insightsIndexed = publishedInsights >= INSIGHTS_MIN_TO_LIST;

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [sitemap({ filter: (page) => insightsIndexed || new URL(page).pathname !== '/insights/' })],
  build: {
    // CSS sebagai file terpisah agar CSP tidak perlu mengizinkan style inline.
    inlineStylesheets: 'never',
  },
});
