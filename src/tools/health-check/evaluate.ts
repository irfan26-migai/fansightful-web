// Aturan penilaian Business & People Health Check (blueprint §5.2).
// Sengaja tidak menghasilkan skor total, persentase, atau peringkat: ambang di bawah adalah
// aturan kerja yang transparan, bukan norma tervalidasi.

import { AREAS, STATEMENTS, type Answer, type AreaId, type Statement } from './instrument';

export type AreaStatus = 'needs_attention' | 'forming' | 'established' | 'insufficient_info';

export type Answers = Record<string, Answer>;

export interface AreaResult {
  area: AreaId;
  status: AreaStatus;
  /** Pernyataan berlevel 0/1 (atau "Tidak tahu" untuk insufficient_info) yang memicu status. */
  triggers: string[];
  lowCount: number;
  zeroCount: number;
  unknownCount: number;
}

export interface Evaluation {
  /** Hasil per area dalam urutan prioritas tampilan. */
  areas: AreaResult[];
  /** Area berstatus needs_attention, dalam urutan prioritas. */
  flagged: AreaId[];
}

/** Ambang aturan — diekspor agar dapat ditampilkan apa adanya kepada pengguna. */
export const RULES = {
  insufficientInfoMinUnknown: 2,
  needsAttentionMinLow: 2,
  formingLow: 1,
} as const;

const STATUS_ORDER: AreaStatus[] = ['needs_attention', 'forming', 'insufficient_info', 'established'];
const AREA_ORDER: AreaId[] = AREAS.map((a) => a.id);

export function statusFor(levels: Answer[]): AreaStatus {
  const unknown = levels.filter((a) => a === 'unknown').length;
  const low = levels.filter((a) => a === 0 || a === 1).length;
  if (unknown >= RULES.insufficientInfoMinUnknown) return 'insufficient_info';
  if (low >= RULES.needsAttentionMinLow) return 'needs_attention';
  if (low === RULES.formingLow) return 'forming';
  return 'established';
}

export function evaluateArea(area: AreaId, answers: Answers, statements: Statement[] = STATEMENTS): AreaResult {
  const items = statements.filter((s) => s.area === area);
  const missing = items.filter((s) => !(s.id in answers));
  if (missing.length) {
    throw new Error(`Jawaban belum lengkap untuk area ${area}: ${missing.map((s) => s.id).join(', ')}`);
  }

  const levels = items.map((s) => answers[s.id]);
  const status = statusFor(levels);
  const isLow = (a: Answer) => a === 0 || a === 1;

  return {
    area,
    status,
    triggers: items
      .filter((s) => (status === 'insufficient_info' ? answers[s.id] === 'unknown' : isLow(answers[s.id])))
      .map((s) => s.id),
    lowCount: levels.filter(isLow).length,
    zeroCount: levels.filter((a) => a === 0).length,
    unknownCount: levels.filter((a) => a === 'unknown').length,
  };
}

export function evaluate(answers: Answers, statements: Statement[] = STATEMENTS): Evaluation {
  const areas = AREA_ORDER.map((id) => evaluateArea(id, answers, statements)).sort(
    (a, b) =>
      STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
      b.zeroCount - a.zeroCount ||
      b.lowCount - a.lowCount ||
      AREA_ORDER.indexOf(a.area) - AREA_ORDER.indexOf(b.area),
  );

  return {
    areas,
    flagged: areas.filter((a) => a.status === 'needs_attention').map((a) => a.area),
  };
}
