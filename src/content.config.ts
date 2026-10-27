import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const AREA = z.enum(['A', 'B', 'C', 'D', 'E']);

// Template artikel: blueprint §7.2. Nama file (tanpa .md) menjadi slug URL /insights/<slug>/.
const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string().max(90),
    /** Meta description, 70–160 karakter. */
    description: z.string().min(70).max(160),
    /** Ringkasan di atas artikel: 2–4 poin. */
    summary: z.array(z.string()).min(2).max(4),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Area Health Check yang dibahas; dipakai untuk tautan dari hasil tool. */
    areas: z.array(AREA).min(1),
    sources: z
      .array(z.object({ title: z.string(), url: z.url(), accessedAt: z.coerce.date().optional() }))
      .default([]),
    /** Draf hanya tampil di `npm run dev`, tidak pernah ikut build produksi. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights };
