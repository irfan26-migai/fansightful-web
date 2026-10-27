// Aturan tampil Insights — fungsi murni agar dapat diuji tanpa runtime Astro.

import type { AreaId } from '../tools/health-check/instrument';

/** Navigasi dan section homepage Insights baru tampil setelah jumlah artikel ini (blueprint §3.1). */
export const INSIGHTS_MIN_TO_LIST = 3;

export interface InsightMeta {
  slug: string;
  title: string;
  publishedAt: Date;
  areas: AreaId[];
  draft: boolean;
}

export interface InsightLink {
  href: string;
  title: string;
}

export const insightHref = (slug: string) => `/insights/${slug}/`;

/** Draf hanya disertakan di mode pengembangan; hasil diurutkan terbaru lebih dulu. */
export function visibleInsights<T extends InsightMeta>(entries: T[], includeDrafts: boolean): T[] {
  return entries
    .filter((e) => includeDrafts || !e.draft)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime() || a.slug.localeCompare(b.slug));
}

export const isInsightsListed = (count: number) => count >= INSIGHTS_MIN_TO_LIST;

/** Artikel terbaru per area Health Check, untuk tautan "Baca selengkapnya" di hasil. */
export function insightsByArea(entries: InsightMeta[]): Partial<Record<AreaId, InsightLink>> {
  const result: Partial<Record<AreaId, InsightLink>> = {};
  for (const e of entries) {
    for (const area of e.areas) result[area] ??= { href: insightHref(e.slug), title: e.title };
  }
  return result;
}
