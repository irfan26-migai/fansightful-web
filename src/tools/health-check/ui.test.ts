// @vitest-environment jsdom
// Perilaku interaktif Health Check di atas markup hasil build (dist/), bukan markup tiruan.
// Butuh `npm run build` lebih dulu; `npm run verify` sudah menjalankannya sebelum test.

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { evaluate, type Answers } from './evaluate';
import { AREAS, STATEMENTS, type Answer, type AreaId } from './instrument';
import { initHealthCheck } from './ui';
import { track } from '../../lib/analytics';
import { id as t } from '../../i18n/id';

vi.mock('../../lib/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/analytics')>()),
  track: vi.fn(),
}));

const c = t.healthCheck;
const U = 'unknown' as const;
// Vitest berjalan dari root proyek; URL bawaan diganti jsdom, jadi pakai path biasa.
const FIXTURE = resolve(process.cwd(), 'dist/tools-lab/health-check/index.html');

let fixtureHtml = '';

function mount(enhance = true): HTMLElement {
  if (!fixtureHtml) {
    if (!existsSync(FIXTURE)) throw new Error(`${FIXTURE} tidak ada. Jalankan \`npm run build\` lebih dulu.`);
    fixtureHtml = readFileSync(FIXTURE, 'utf8');
  }
  const parsed = new DOMParser().parseFromString(fixtureHtml, 'text/html');
  const main = document.importNode(parsed.querySelector('main')!, true);
  document.body.replaceChildren(main);
  const root = document.querySelector<HTMLElement>('[data-hc]')!;
  if (enhance) initHealthCheck(root);
  return root;
}

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];
const visibleSteps = () => $$('[data-hc-step]').filter((s) => !s.hidden).map((s) => s.dataset.hcStep);
const next = () => $('[data-hc-next]').click();
const back = () => $('[data-hc-back]').click();
const radio = (name: string, value: Answer | string) => $<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
const answer = (id: string, value: Answer) => radio(id, value).click();
const statementsIn = (area: AreaId) => STATEMENTS.filter((s) => s.area === area);

function answerArea(area: AreaId, values: Answer[]) {
  statementsIn(area).forEach((s, i) => answer(s.id, values[i]));
}

function selectValue(id: string, value: string) {
  const select = $<HTMLSelectElement>(`#${id}`);
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

/** Isi semua area lalu tekan "Lihat hasil". Profil dilewati kecuali sudah diisi sebelumnya. */
function complete(plan: Record<AreaId, Answer[]>) {
  next(); // profil
  for (const area of AREAS) {
    answerArea(area.id, plan[area.id]);
    next();
  }
}

const answersFrom = (plan: Record<AreaId, Answer[]>): Answers =>
  Object.fromEntries(AREAS.flatMap((a) => statementsIn(a.id).map((s, i) => [s.id, plan[a.id][i]])));

const ALL_GOOD: Record<AreaId, Answer[]> = { A: [3, 3, 3, 3], B: [3, 3, 2, 3], C: [2, 3, 3, 3], D: [2, 2, 2, 3], E: [3, 2, 2, 2] };
const MIXED: Record<AreaId, Answer[]> = { A: [0, 1, 3, 3], B: [3, 3, 2, 3], C: [1, 3, 3, 3], D: [U, U, 2, 3], E: [0, 0, 1, 2] };
const ALL_UNKNOWN: Record<AreaId, Answer[]> = { A: [U, U, U, U], B: [U, U, U, U], C: [U, U, U, U], D: [U, U, U, U], E: [U, U, U, U] };

const calls = (name: string) => vi.mocked(track).mock.calls.filter(([n]) => n === name);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-27T03:00:00Z'));
  // jsdom tidak mengimplementasikan scroll dan print.
  Element.prototype.scrollIntoView = vi.fn();
  window.print = vi.fn();
  vi.mocked(track).mockClear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('tampilan awal', () => {
  it('tanpa JavaScript: semua pernyataan terlihat, stepper dan navigasi tersembunyi', () => {
    mount(false);
    expect($('[data-hc-stepper]').hidden).toBe(true);
    expect($('[data-hc-nav]').hidden).toBe(true);
    expect(visibleSteps()).toEqual(['profile', 'A', 'B', 'C', 'D', 'E']);
    expect($$('fieldset[data-hc-q]')).toHaveLength(STATEMENTS.length);
  });

  it('dengan JavaScript: hanya langkah profil, progres 1 dari 6, label versi contoh', () => {
    mount();
    expect(visibleSteps()).toEqual(['profile']);
    expect($('[data-hc-stepper]').hidden).toBe(false);
    expect($('[data-hc-progress-label]').textContent).toBe(c.progress(1, 6));
    expect($('[data-hc-progress-pct]').textContent).toBe('17%');
    expect($('[data-hc-progress-bar]').style.width).toBe('17%');
    expect($('[data-hc-back]').hidden).toBe(true);
    expect($('[data-hc-next-label]').textContent).toBe(c.next);
    expect($('[data-hc-stepper-item="profile"]').getAttribute('aria-current')).toBe('step');
    expect($('[data-hc-why-text]').textContent).toBe(c.profile.why);
    expect($('[data-hc-results]').hidden).toBe(true);
    expect(document.body.textContent).toContain(c.sampleTitle);
    expect($$('h1').map((h) => h.textContent)).toEqual([c.title]);
    expect(calls('tool_view')).toEqual([['tool_view', { tool_id: 'health-check' }]]);
    expect(calls('tool_start')).toHaveLength(0);
  });
});

describe('navigasi dan validasi', () => {
  it('profil opsional: "Lanjut" tanpa isian langsung ke area pertama dan memulai sesi', () => {
    mount();
    next();
    expect(visibleSteps()).toEqual(['A']);
    expect($('[data-hc-error]').textContent).toBe('');
    expect(document.activeElement).toBe($('#hc-step-A'));
    expect($('[data-hc-back]').hidden).toBe(false);
    expect($('[data-hc-stepper-item="profile"]').hasAttribute('data-done')).toBe(true);
    expect($('[data-hc-why-text]').textContent).toBe(AREAS[0].why);
    expect(calls('tool_start')).toHaveLength(1);
    expect(calls('tool_area_complete')).toHaveLength(0);
  });

  it('pernyataan wajib: tetap di langkah, tandai yang kosong, fokus ke jawaban pertama', () => {
    mount();
    next();
    next();
    expect(visibleSteps()).toEqual(['A']);
    expect($('[data-hc-error]').getAttribute('role')).toBe('alert');
    expect($('[data-hc-error]').textContent).toBe(c.errorStep(4));
    for (const s of statementsIn('A')) {
      expect($(`[data-hc-q="${s.id}"]`).getAttribute('aria-invalid')).toBe('true');
      expect($(`#err-${s.id}`).hidden).toBe(false);
      expect($(`[data-hc-q="${s.id}"]`).getAttribute('aria-describedby')).toBe(`err-${s.id}`);
    }
    expect(document.activeElement).toBe(radio('A1', 0));
  });

  it('memilih jawaban menghapus tanda error pernyataan itu saja; sisa error dihitung ulang', () => {
    mount();
    next();
    next();
    answer('A1', 2);
    expect($('[data-hc-q="A1"]').hasAttribute('aria-invalid')).toBe(false);
    expect($('#err-A1').hidden).toBe(true);
    expect($('[data-hc-q="A2"]').getAttribute('aria-invalid')).toBe('true');
    answer('A2', 2);
    answer('A3', 2);
    next();
    expect($('[data-hc-error]').textContent).toBe(c.errorStep(1));
    expect(document.activeElement).toBe(radio('A4', 0));
  });

  it('jawaban dan profil tetap tersimpan saat Kembali lalu Lanjut', () => {
    mount();
    selectValue('hc-type', 'UMKM');
    radio('profile_size', '6–20').click();
    next();
    answerArea('A', [0, 1, 2, 3]);
    next();
    answer('B1', U);
    back();
    expect(visibleSteps()).toEqual(['A']);
    expect(document.activeElement).toBe($('#hc-step-A'));
    expect(statementsIn('A').map((s) => $<HTMLInputElement>(`input[name="${s.id}"]:checked`).value)).toEqual(['0', '1', '2', '3']);
    back();
    expect($<HTMLSelectElement>('#hc-type').value).toBe('UMKM');
    expect(radio('profile_size', '6–20').checked).toBe(true);
    expect($('[data-hc-back]').hidden).toBe(true);
    next();
    next();
    expect(visibleSteps()).toEqual(['B']);
    expect(radio('B1', U).checked).toBe(true);
    expect($('[data-hc-stepper-item="B"]').getAttribute('aria-current')).toBe('step');
    expect($('[data-hc-stepper-item="A"]').hasAttribute('data-done')).toBe(true);
  });

  it('langkah terakhir berlabel "Lihat hasil" dan progres 100%', () => {
    mount();
    next();
    for (const area of AREAS.slice(0, -1)) {
      answerArea(area.id, ALL_GOOD[area.id]);
      next();
    }
    expect(visibleSteps()).toEqual(['E']);
    expect($('[data-hc-next-label]').textContent).toBe(c.seeResults);
    expect($('[data-hc-progress-bar]').style.width).toBe('100%');
    expect(calls('tool_area_complete').map(([, p]) => (p as { area: string }).area)).toEqual(['A', 'B', 'C', 'D']);
  });
});

describe('hasil', () => {
  it('campuran: urutan area dan status sesuai evaluate(), tanpa skor, fokus ke judul hasil', () => {
    mount();
    selectValue('hc-type', 'UMKM');
    radio('profile_size', '6–20').click();
    selectValue('hc-age', '2–5 tahun');
    complete(MIXED);

    const expected = evaluate(answersFrom(MIXED));
    expect($('[data-hc-results]').hidden).toBe(false);
    expect($('[data-hc-top]').hidden).toBe(true);
    expect($('[data-hc-layout]').hidden).toBe(true);
    expect(document.activeElement).toBe($('[data-hc-results] h1'));
    expect($('[data-hc-results] h1').textContent).toBe(c.resultsTitle);
    expect($$('h1:not([data-hc-top] h1)')).toHaveLength(1);
    expect($('[data-hc-results] .pill--sample').textContent).toBe(c.resultBadge);
    expect($('.hc-res-context').textContent).toBe('Untuk bisnis UMKM, dengan 6–20 karyawan, berusia 2–5 tahun; diisi 27 Oktober 2026.');

    expect($('.hc-overview__count strong').textContent).toBe(String(expected.flagged.length));
    // Tidak ada skor angka (R-05); kata "skor" hanya muncul di penjelasan "Tidak ada skor total".
    expect($('[data-hc-results]').textContent).not.toContain('dari 100');
    expect($('.hc-overview').textContent).not.toMatch(/skor|%/i);
    const rows = $$<HTMLAnchorElement>('.hc-area-list a');
    expect(rows.map((a) => a.getAttribute('href'))).toEqual(expected.areas.map((r) => `#area-${r.area}`));
    expect(rows.map((a) => a.querySelector('.hc-badge')!.textContent)).toEqual(expected.areas.map((r) => c.status[r.status]));
    rows.forEach((a) => expect(document.querySelector(a.getAttribute('href')!)).not.toBeNull());
    expect($$('.hc-area').map((el) => el.id)).toEqual(expected.areas.map((r) => `area-${r.area}`));

    const findings = $$('.hc-findings li p');
    expect(findings).toHaveLength(4);
    expect(findings[0].textContent).toContain(STATEMENTS.find((s) => s.id === 'E1')!.text);
    expect(findings[0].textContent).toContain(`${c.yourAnswer}: Belum ada`);

    const top = AREAS.find((a) => a.id === expected.areas[0].area)!;
    expect($('#res-next').textContent).toBe(top.title);
    expect($$('.hc-next ol li').map((li) => li.textContent)).toEqual(top.nextActions);
    expect($<HTMLAnchorElement>('a.hc-resource').getAttribute('href')).toBe('/insights/penilaian-kinerja-subjektif/');
    expect($('.hc-next').textContent).toContain(c.kpiTool);
    expect($('.hc-next').textContent).toContain(c.planned);
    expect($$('.hc-next a').map((a) => a.getAttribute('href'))).not.toContain(null);

    expect($('aside.hc-help')).not.toBeNull();
    expect($<HTMLAnchorElement>('aside.hc-help a').getAttribute('href')).toBe('/solusi/');
    expect(calls('tool_complete')).toHaveLength(1);
    expect(calls('result_view')).toHaveLength(1);
  });

  it('semua baik: tidak ada area ditandai, bantuan tidak ditonjolkan, tanpa tautan artikel', () => {
    mount();
    complete(ALL_GOOD);
    expect($('.hc-overview__count strong').textContent).toBe('0');
    expect($('.hc-overview__text').textContent).toBe(c.summaryNone);
    expect($('.hc-findings').textContent).toBe(c.findingsNone);
    expect($('aside.hc-help')).toBeNull();
    expect($('.hc-help-quiet a').textContent).toBe(c.helpQuiet);
    expect($('a.hc-resource')).toBeNull();
    expect($('.hc-article')).toBeNull();
    expect($('.hc-next > p').textContent).toBe(c.establishedNext);
    expect($('.hc-res-context').textContent).toBe('Diisi 27 Oktober 2026.');
  });

  it('semua "Tidak tahu": setiap area "Belum cukup informasi" dengan saran bertanya ke tim', () => {
    mount();
    complete(ALL_UNKNOWN);
    expect($$('.hc-badge').every((b) => b.textContent === c.status.insufficient_info)).toBe(true);
    expect($('.hc-overview__count strong').textContent).toBe('0');
    expect($$('.hc-overview__text')[1].textContent).toBe(c.summaryInsufficient(AREAS.map((a) => a.title).join(', ')));
    expect($('.hc-area-list__detail').textContent).toBe(c.areaUnknown(4, 4));
    expect($('.hc-next > p').textContent).toBe(c.insufficientNext);
    expect($('.hc-findings').textContent).toBe(c.findingsNone);
  });

  it('area prioritas tanpa artikel (Proses kerja): tidak ada tautan Insight maupun KPI Designer', () => {
    mount();
    complete({ ...ALL_GOOD, D: [0, 0, 3, 3] });
    expect($('#res-next').textContent).toBe(AREAS.find((a) => a.id === 'D')!.title);
    expect($('a.hc-resource')).toBeNull();
    expect($('.hc-next').textContent).not.toContain(c.kpiTool);
  });

  it('jenis bisnis biasa ditulis huruf kecil di tengah kalimat, akronim tetap utuh', () => {
    mount();
    selectValue('hc-type', 'Jasa profesional');
    complete(ALL_GOOD);
    expect($('.hc-res-context').textContent).toBe('Untuk bisnis jasa profesional; diisi 27 Oktober 2026.');
  });

  it('profil "Lainnya" tidak ditulis di kalimat konteks', () => {
    mount();
    selectValue('hc-type', 'Lainnya');
    complete(ALL_GOOD);
    expect($('.hc-res-context').textContent).toBe('Diisi 27 Oktober 2026.');
  });
});

describe('tindakan di hasil', () => {
  it('cetak membuka penjelasan cara hitung lalu memanggil print', () => {
    mount();
    complete(MIXED);
    expect($<HTMLDetailsElement>('.hc-how').open).toBe(false);
    $$<HTMLButtonElement>('.hc-res-actions button')[0].click();
    expect($<HTMLDetailsElement>('.hc-how').open).toBe(true);
    expect(window.print).toHaveBeenCalledTimes(1);
    expect(calls('next_action_click').at(-1)![1]).toMatchObject({ action_type: 'download' });
  });

  it('klik artikel dan bantuan tercatat sebagai langkah berikutnya', () => {
    mount();
    complete(MIXED);
    // jsdom tidak bisa berpindah dokumen; cegah navigasi tautan setelah handler tool berjalan.
    const stopNavigation = (e: Event) => e.preventDefault();
    document.addEventListener('click', stopNavigation);
    try {
      $<HTMLAnchorElement>('a.hc-resource').click();
      $<HTMLAnchorElement>('aside.hc-help a').click();
    } finally {
      document.removeEventListener('click', stopNavigation);
    }
    expect(calls('next_action_click').map(([, p]) => p)).toEqual([
      { tool_id: 'health-check', action_type: 'article', target: '/insights/penilaian-kinerja-subjektif/' },
      { tool_id: 'health-check', action_type: 'solusi', target: '/solusi/' },
    ]);
  });

  it('Ulangi mengosongkan semua jawaban dan kembali ke langkah profil', () => {
    mount();
    selectValue('hc-type', 'UMKM');
    complete(MIXED);
    $$<HTMLButtonElement>('.hc-res-actions button')[1].click();

    expect($('[data-hc-results]').hidden).toBe(true);
    expect($('[data-hc-results]').childElementCount).toBe(0);
    expect($('[data-hc-top]').hidden).toBe(false);
    expect($('[data-hc-layout]').hidden).toBe(false);
    expect(visibleSteps()).toEqual(['profile']);
    expect($$('input:checked')).toHaveLength(0);
    expect($<HTMLSelectElement>('#hc-type').value).toBe('');
    expect($('[data-hc-progress-label]').textContent).toBe(c.progress(1, 6));
    expect(document.activeElement).toBe($('#hc-step-profile'));
    expect(calls('next_action_click').at(-1)![1]).toMatchObject({ action_type: 'restart' });

    complete(ALL_GOOD);
    expect($('.hc-overview__count strong').textContent).toBe('0');
    expect(calls('result_view')).toHaveLength(2);
  });
});

describe('privasi', () => {
  it('jawaban tidak dikirim: tidak ada fetch, XHR, atau beacon, dan event analytics tanpa isi jawaban', () => {
    const fetchSpy = vi.fn();
    const beaconSpy = vi.fn();
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, 'open');
    vi.stubGlobal('fetch', fetchSpy);
    Object.defineProperty(navigator, 'sendBeacon', { value: beaconSpy, configurable: true });

    mount();
    selectValue('hc-type', 'Manufaktur');
    complete(MIXED);
    $$<HTMLButtonElement>('.hc-res-actions button')[0].click();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(beaconSpy).not.toHaveBeenCalled();
    expect(xhrOpen).not.toHaveBeenCalled();
    const allowed = new Set(['tool_id', 'area', 'duration_bucket', 'action_type', 'target']);
    for (const [, props] of vi.mocked(track).mock.calls) {
      for (const key of Object.keys(props)) expect(allowed.has(key)).toBe(true);
      expect(JSON.stringify(props)).not.toMatch(/Manufaktur|Belum ada|"A1"|unknown/);
    }
    xhrOpen.mockRestore();
  });
});
