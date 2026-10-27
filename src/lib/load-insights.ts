import { getCollection, type CollectionEntry } from 'astro:content';
import { visibleInsights, type InsightMeta } from './insights';

export type Insight = InsightMeta & { entry: CollectionEntry<'insights'> };

/** Artikel yang boleh tampil di build ini (draf hanya saat `npm run dev`), terbaru lebih dulu. */
export async function loadInsights(): Promise<Insight[]> {
  const entries = (await getCollection('insights')).map((entry) => ({
    entry,
    slug: entry.id,
    title: entry.data.title,
    publishedAt: entry.data.publishedAt,
    areas: entry.data.areas,
    draft: entry.data.draft,
  }));
  return visibleInsights(entries, import.meta.env.DEV);
}
