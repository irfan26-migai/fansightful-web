import { describe, expect, it } from 'vitest';
import { insightsByArea, isInsightsListed, visibleInsights, type InsightMeta } from './insights';

const meta = (slug: string, date: string, areas: InsightMeta['areas'], draft = false): InsightMeta => ({
  slug,
  title: `Judul ${slug}`,
  publishedAt: new Date(date),
  areas,
  draft,
});

describe('visibleInsights', () => {
  const entries = [meta('lama', '2026-01-01', ['A']), meta('draf', '2026-03-01', ['A'], true), meta('baru', '2026-02-01', ['B'])];

  it('membuang draf di build produksi dan mengurutkan terbaru lebih dulu', () => {
    expect(visibleInsights(entries, false).map((e) => e.slug)).toEqual(['baru', 'lama']);
  });

  it('menyertakan draf di mode pengembangan', () => {
    expect(visibleInsights(entries, true).map((e) => e.slug)).toEqual(['draf', 'baru', 'lama']);
  });
});

describe('isInsightsListed', () => {
  it('baru tampil di navigasi setelah 3 artikel', () => {
    expect(isInsightsListed(2)).toBe(false);
    expect(isInsightsListed(3)).toBe(true);
  });
});

describe('insightsByArea', () => {
  it('memilih artikel pertama (terbaru) untuk setiap area', () => {
    const sorted = visibleInsights(
      [meta('a-lama', '2026-01-01', ['A']), meta('a-c-baru', '2026-02-01', ['A', 'C'])],
      false,
    );
    expect(insightsByArea(sorted)).toEqual({
      A: { href: '/insights/a-c-baru/', title: 'Judul a-c-baru' },
      C: { href: '/insights/a-c-baru/', title: 'Judul a-c-baru' },
    });
  });

  it('area tanpa artikel tidak mendapat tautan', () => {
    expect(insightsByArea([])).toEqual({});
  });
});
