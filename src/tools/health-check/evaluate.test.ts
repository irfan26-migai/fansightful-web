import { describe, expect, it } from 'vitest';
import { evaluate, evaluateArea, statusFor, type Answers } from './evaluate';
import { AREAS, STATEMENTS, type Answer, type AreaId } from './instrument';

const U = 'unknown' as const;

/** Semua area diisi `fill`, lalu area tertentu ditimpa dengan empat jawaban. */
function answersWith(overrides: Partial<Record<AreaId, Answer[]>> = {}, fill: Answer = 3): Answers {
  const answers: Answers = {};
  for (const area of AREAS) {
    const items = STATEMENTS.filter((s) => s.area === area.id);
    const values = overrides[area.id] ?? items.map(() => fill);
    items.forEach((s, i) => (answers[s.id] = values[i]));
  }
  return answers;
}

describe('statusFor — test cases blueprint §5.2', () => {
  it('T1: dua jawaban "Belum ada" → Perlu perhatian', () => {
    expect(statusFor([0, 0, 3, 3])).toBe('needs_attention');
  });

  it('T2: tepat satu jawaban rendah → Mulai terbentuk', () => {
    expect(statusFor([1, 2, 2, 3])).toBe('forming');
  });

  it('T3: semua minimal "Sebagian besar berjalan" → Relatif terbentuk', () => {
    expect(statusFor([2, 2, 3, 3])).toBe('established');
  });

  it('T4: dua "Tidak tahu" didahulukan → Belum cukup informasi', () => {
    expect(statusFor([U, U, 0, 3])).toBe('insufficient_info');
  });

  it('T5: satu "Tidak tahu" tidak membatalkan penilaian', () => {
    expect(statusFor([U, 0, 1, 3])).toBe('needs_attention');
  });

  it('satu "Tidak tahu" dengan sisanya baik → Relatif terbentuk', () => {
    expect(statusFor([U, 2, 3, 3])).toBe('established');
  });

  it('semua "Tidak tahu" → Belum cukup informasi', () => {
    expect(statusFor([U, U, U, U])).toBe('insufficient_info');
  });
});

describe('evaluateArea', () => {
  it('mencatat pernyataan pemicu berlevel rendah', () => {
    const r = evaluateArea('A', answersWith({ A: [0, 3, 1, 2] }));
    expect(r.status).toBe('needs_attention');
    expect(r.triggers).toEqual(['A1', 'A3']);
    expect(r.zeroCount).toBe(1);
    expect(r.lowCount).toBe(2);
  });

  it('pemicu insufficient_info adalah pernyataan "Tidak tahu"', () => {
    const r = evaluateArea('B', answersWith({ B: [0, U, 3, U] }));
    expect(r.status).toBe('insufficient_info');
    expect(r.triggers).toEqual(['B2', 'B4']);
  });

  it('melempar error bila ada jawaban yang hilang', () => {
    const answers = answersWith();
    delete answers.C3;
    expect(() => evaluateArea('C', answers)).toThrow(/C3/);
  });
});

describe('evaluate', () => {
  it('T6: semua area baik → tidak ada area ditandai', () => {
    const r = evaluate(answersWith());
    expect(r.flagged).toEqual([]);
    expect(r.areas.every((a) => a.status === 'established')).toBe(true);
  });

  it('tidak menghasilkan skor total atau persentase', () => {
    const r = evaluate(answersWith()) as unknown as Record<string, unknown>;
    expect(Object.keys(r).sort()).toEqual(['areas', 'flagged']);
  });

  it('mengurutkan status: perlu perhatian → mulai terbentuk → belum cukup informasi → relatif terbentuk', () => {
    const r = evaluate(
      answersWith({
        A: [3, 3, 3, 3],
        B: [U, U, 3, 3],
        C: [1, 3, 3, 3],
        D: [0, 1, 3, 3],
      }),
    );
    expect(r.areas.map((a) => [a.area, a.status])).toEqual([
      ['D', 'needs_attention'],
      ['C', 'forming'],
      ['B', 'insufficient_info'],
      ['A', 'established'],
      ['E', 'established'],
    ]);
  });

  it('di antara area yang ditandai, jumlah "Belum ada" terbanyak didahulukan', () => {
    const r = evaluate(answersWith({ B: [1, 1, 3, 3], E: [0, 0, 0, 3] }));
    expect(r.flagged).toEqual(['E', 'B']);
  });

  it('seri penuh diurutkan A→E', () => {
    const r = evaluate(answersWith({ E: [0, 1, 3, 3], A: [0, 1, 3, 3] }));
    expect(r.flagged).toEqual(['A', 'E']);
  });

  it('melempar error bila jawaban tidak lengkap', () => {
    expect(() => evaluate({})).toThrow();
  });
});

describe('integritas instrumen', () => {
  it('setiap area memiliki tepat 4 pernyataan dan 1–3 langkah berikutnya', () => {
    for (const area of AREAS) {
      expect(STATEMENTS.filter((s) => s.area === area.id)).toHaveLength(4);
      expect(area.nextActions.length).toBeGreaterThanOrEqual(1);
      expect(area.nextActions.length).toBeLessThanOrEqual(3);
    }
  });

  it('ID pernyataan unik', () => {
    const ids = STATEMENTS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
