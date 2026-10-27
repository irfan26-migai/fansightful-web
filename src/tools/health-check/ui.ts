// Perilaku interaktif Health Check: stepper (profil + per area), validasi, render hasil, cetak.
// Semua teks hasil dibuat dengan textContent; jawaban tidak pernah meninggalkan browser.

import { evaluate, keyFindings, type Answers, type AreaResult, type Evaluation } from './evaluate';
import { AREAS, SCALE, STATEMENTS, type Answer, type AreaId } from './instrument';
import { id as t } from '../../i18n/id';
import { durationBucket, track } from '../../lib/analytics';
import { iconSvg, type IconName } from '../../lib/icons';
import type { InsightLink } from '../../lib/insights';

const c = t.healthCheck;
const TOOL = 'health-check' as const;
const PROFILE_STEP = 'profile';
const STATEMENT_IDS = new Set(STATEMENTS.map((s) => s.id));

type Child = Node | string | null | undefined | false;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  for (const child of children) if (child) node.append(child);
  return node;
}

/** Ikon dari konstanta lokal (bukan masukan pengguna), dekoratif. */
function icon(name: IconName): SVGElement {
  const tpl = document.createElement('template');
  tpl.innerHTML = iconSvg(name);
  return tpl.content.firstElementChild as SVGElement;
}

const tile = (name: IconName, tone: string) => el('span', { class: `tile tile--sm ${tone}` }, icon(name));

const areaById = (id: string) => AREAS.find((a) => a.id === id)!;
const statementById = (id: string) => STATEMENTS.find((s) => s.id === id)!;
const answerLabel = (a: Answer) => SCALE.find((o) => o.value === a)!.label;
const listNames = (ids: string[]) => ids.map((id) => areaById(id).title).join(', ');
const countIn = (area: AreaId) => STATEMENTS.filter((s) => s.area === area).length;

interface Profile {
  type: string;
  size: string;
  age: string;
}

export function initHealthCheck(root: HTMLElement): void {
  const top = root.querySelector<HTMLElement>('[data-hc-top]')!;
  const layout = root.querySelector<HTMLElement>('[data-hc-layout]')!;
  const stepper = root.querySelector<HTMLElement>('[data-hc-stepper]')!;
  const stepperItems = [...root.querySelectorAll<HTMLElement>('[data-hc-stepper-item]')];
  const form = root.querySelector<HTMLFormElement>('[data-hc-form]')!;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-hc-step]')];
  const progress = root.querySelector<HTMLElement>('[data-hc-progress]')!;
  const progressLabel = root.querySelector<HTMLElement>('[data-hc-progress-label]')!;
  const progressPct = root.querySelector<HTMLElement>('[data-hc-progress-pct]')!;
  const progressBar = root.querySelector<HTMLElement>('[data-hc-progress-bar]')!;
  const nav = root.querySelector<HTMLElement>('[data-hc-nav]')!;
  const backBtn = root.querySelector<HTMLButtonElement>('[data-hc-back]')!;
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-hc-next]')!;
  const nextLabel = root.querySelector<HTMLElement>('[data-hc-next-label]')!;
  const errorBox = root.querySelector<HTMLElement>('[data-hc-error]')!;
  const whyText = root.querySelector<HTMLElement>('[data-hc-why-text]')!;
  const results = root.querySelector<HTMLElement>('[data-hc-results]')!;

  const insights: Partial<Record<string, InsightLink>> = JSON.parse(root.dataset.hcInsights || '{}');
  const why: Record<string, string> = JSON.parse(root.dataset.hcWhy || '{}');

  let current = 0;
  let startedAt = 0;

  // Mode JavaScript: satu langkah per layar dengan stepper dan progres.
  stepper.hidden = false;
  progress.hidden = false;
  nav.hidden = false;
  showStep(0, false);
  track('tool_view', { tool_id: TOOL });

  /** Mulai dihitung saat interaksi pertama (memilih jawaban atau menekan "Lanjut"). */
  function markStarted() {
    if (startedAt) return;
    startedAt = Date.now();
    track('tool_start', { tool_id: TOOL });
  }

  function readAnswers(): Answers {
    const answers: Answers = {};
    for (const [name, value] of new FormData(form)) {
      if (!STATEMENT_IDS.has(name)) continue;
      answers[name] = value === 'unknown' ? 'unknown' : (Number(value) as Answer);
    }
    return answers;
  }

  function readProfile(): Profile {
    const data = new FormData(form);
    const get = (name: string) => String(data.get(name) ?? '');
    return { type: get('profile_type'), size: get('profile_size'), age: get('profile_age') };
  }

  function clearErrors(step: HTMLElement) {
    errorBox.textContent = '';
    step.querySelectorAll<HTMLElement>('[data-hc-q]').forEach((q) => {
      q.removeAttribute('aria-invalid');
      q.querySelector<HTMLElement>('.hc-field-error')!.hidden = true;
    });
  }

  function showStep(index: number, focus = true) {
    current = index;
    const total = steps.length;
    steps.forEach((s, i) => (s.hidden = i !== index));
    stepperItems.forEach((item, i) => {
      item.toggleAttribute('data-done', i < index);
      if (i === index) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });

    const pct = Math.round(((index + 1) / total) * 100);
    progressLabel.textContent = c.progress(index + 1, total);
    progressPct.textContent = `${pct}%`;
    progressBar.style.width = `${pct}%`;

    backBtn.hidden = index === 0;
    nextLabel.textContent = index === total - 1 ? c.seeResults : c.next;
    whyText.textContent = why[steps[index].dataset.hcStep!] ?? '';
    clearErrors(steps[index]);
    if (focus) {
      const heading = steps[index].querySelector<HTMLElement>('h2')!;
      heading.focus({ preventScroll: true });
      form.scrollIntoView({ block: 'start' });
    }
  }

  /** Mengembalikan true bila semua pernyataan di langkah ini sudah dijawab. Profil tidak wajib. */
  function validate(step: HTMLElement): boolean {
    clearErrors(step);
    const unanswered = [...step.querySelectorAll<HTMLElement>('[data-hc-q]')].filter(
      (q) => !q.querySelector('input:checked'),
    );
    if (!unanswered.length) return true;

    errorBox.textContent = c.errorStep(unanswered.length);
    unanswered.forEach((q) => {
      q.setAttribute('aria-invalid', 'true');
      q.querySelector<HTMLElement>('.hc-field-error')!.hidden = false;
    });
    unanswered[0].querySelector<HTMLInputElement>('input')!.focus();
    return false;
  }

  // Jawaban yang dipilih menghapus tanda error pada pernyataan itu.
  form.addEventListener('change', (e) => {
    markStarted();
    const q = (e.target as HTMLElement).closest<HTMLElement>('[data-hc-q]');
    if (!q) return;
    q.removeAttribute('aria-invalid');
    q.querySelector<HTMLElement>('.hc-field-error')!.hidden = true;
  });

  backBtn.addEventListener('click', () => showStep(current - 1));

  nextBtn.addEventListener('click', () => {
    markStarted();
    const step = steps[current];
    if (!validate(step)) return;
    const id = step.dataset.hcStep!;
    if (id !== PROFILE_STEP) track('tool_area_complete', { tool_id: TOOL, area: id as AreaId });
    if (current < steps.length - 1) showStep(current + 1);
    else showResults();
  });

  form.addEventListener('submit', (e) => e.preventDefault());

  function showResults() {
    const evaluation = evaluate(readAnswers());
    track('tool_complete', { tool_id: TOOL, duration_bucket: durationBucket(Date.now() - startedAt) });

    renderResults(results, evaluation, readAnswers(), readProfile(), insights, {
      onPrint: () => {
        track('next_action_click', { tool_id: TOOL, action_type: 'download', target: 'print' });
        // Penjelasan cara hitung ikut tercetak.
        results.querySelectorAll('details').forEach((d) => (d.open = true));
        window.print();
      },
      onRestart: () => {
        track('next_action_click', { tool_id: TOOL, action_type: 'restart', target: 'restart' });
        form.reset();
        results.hidden = true;
        results.replaceChildren();
        top.hidden = false;
        layout.hidden = false;
        startedAt = Date.now();
        showStep(0);
      },
      onHelp: () => track('next_action_click', { tool_id: TOOL, action_type: 'solusi', target: '/solusi/' }),
      onArticle: (href) => track('next_action_click', { tool_id: TOOL, action_type: 'article', target: href }),
    });

    top.hidden = true;
    layout.hidden = true;
    results.hidden = false;
    const heading = results.querySelector<HTMLElement>('h1')!;
    heading.focus({ preventScroll: true });
    root.scrollIntoView({ block: 'start' });
    track('result_view', { tool_id: TOOL });
  }
}

interface ResultHandlers {
  onPrint: () => void;
  onRestart: () => void;
  onHelp: () => void;
  onArticle: (href: string) => void;
}

function contextLine(p: Profile): string {
  const date = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());
  const parts = [
    p.type && p.type !== 'Lainnya' ? p.type.toLowerCase() : '',
    p.size ? c.contextSize(p.size) : '',
    p.age ? c.contextAge(p.age) : '',
  ].filter(Boolean);
  return parts.length ? c.context(parts, date) : c.filledOn(date);
}

function renderResults(
  container: HTMLElement,
  evaluation: Evaluation,
  answers: Answers,
  profile: Profile,
  insights: Partial<Record<string, InsightLink>>,
  on: ResultHandlers,
) {
  const { areas, flagged } = evaluation;
  const insufficient = areas.filter((a) => a.status === 'insufficient_info').map((a) => a.area);

  const printBtn = el('button', { type: 'button', class: 'button button--secondary' }, icon('download'), c.print);
  const restartBtn = el('button', { type: 'button', class: 'button button--secondary' }, icon('restart'), c.restart);
  printBtn.addEventListener('click', on.onPrint);
  restartBtn.addEventListener('click', on.onRestart);

  const head = el(
    'div',
    { class: 'hc-results__headwrap' },
    el(
      'div',
      { class: 'container' },
      el(
        'nav',
        { class: 'crumbs', 'aria-label': c.breadcrumb },
        el('a', { href: '/tools-lab/' }, 'Tools Lab'),
        el('span', { 'aria-hidden': 'true' }, '/'),
        el('a', { href: '/tools-lab/health-check/' }, c.title),
        el('span', { 'aria-hidden': 'true' }, '/'),
        el('span', { 'aria-current': 'page' }, c.resultCrumb),
      ),
      el(
        'header',
        { class: 'hc-res-head' },
        el(
          'div',
          {},
          el('span', { class: 'pill pill--sample' }, icon('flag'), c.resultBadge),
          el('h1', { tabindex: '-1' }, c.resultsTitle),
          el('p', { class: 'hc-res-context' }, contextLine(profile)),
        ),
        el('div', { class: 'hc-res-actions' }, printBtn, restartBtn),
      ),
    ),
  );

  // Gambaran umum: jumlah area per status, bukan skor (R-05).
  const overview = el(
    'section',
    { class: 'hc-panel hc-overview', 'aria-labelledby': 'res-overview' },
    el(
      'div',
      {},
      el('h2', { id: 'res-overview' }, c.overviewTitle),
      el('p', { class: 'hc-overview__count' }, el('strong', {}, String(flagged.length)), el('span', {}, c.overviewCount)),
      el(
        'p',
        { class: 'hc-overview__text' },
        flagged.length ? c.summaryFlagged(flagged.length, listNames(flagged)) : c.summaryNone,
      ),
      insufficient.length > 0 && el('p', { class: 'hc-overview__text' }, c.summaryInsufficient(listNames(insufficient))),
    ),
    el(
      'div',
      {},
      el('h2', {}, c.areasTitle),
      el('p', { class: 'hc-panel__note' }, c.areasNote),
      el(
        'ul',
        { class: 'hc-area-list' },
        ...areas.map((r) =>
          el(
            'li',
            {},
            el(
              'a',
              { href: `#area-${r.area}` },
              el('span', { class: 'hc-area-list__name' }, areaById(r.area).title),
              el('span', { class: `hc-badge hc-badge--${r.status}` }, c.status[r.status]),
              el(
                'span',
                { class: 'hc-area-list__detail' },
                r.status === 'insufficient_info'
                  ? c.areaUnknown(r.unknownCount, countIn(r.area))
                  : c.areaLow(r.lowCount, countIn(r.area)),
              ),
            ),
          ),
        ),
      ),
    ),
  );

  const findings = keyFindings(areas);
  const findingsPanel = el(
    'section',
    { class: 'hc-panel', 'aria-labelledby': 'res-findings' },
    el('h2', { id: 'res-findings' }, c.findingsTitle),
    el('p', { class: 'hc-panel__note' }, c.findingsNote),
    findings.length
      ? el(
          'ul',
          { class: 'hc-findings' },
          ...findings.map((f) =>
            el(
              'li',
              {},
              tile(f.status === 'needs_attention' ? 'flag' : 'target', `tile--${f.status}`),
              el(
                'p',
                {},
                statementById(f.statement).text,
                el('small', {}, `${areaById(f.area).title} · ${c.yourAnswer}: ${answerLabel(answers[f.statement])}`),
              ),
            ),
          ),
        )
      : el('ul', { class: 'hc-findings' }, el('li', {}, tile('check', 'tile--established'), el('p', {}, c.findingsNone))),
  );

  const pair = el('div', { class: 'hc-pair' }, findingsPanel, renderNext(areas[0], insights, on.onArticle));

  const detail = el(
    'section',
    { class: 'hc-detail', 'aria-labelledby': 'res-detail' },
    el('h2', { id: 'res-detail' }, c.detailTitle),
    ...areas.map((r) => renderArea(r, answers, insights[r.area], on.onArticle)),
  );

  const how = el(
    'details',
    { class: 'hc-how' },
    el('summary', {}, icon('calc'), c.howToReadTitle),
    el('ul', {}, ...c.howToRead.map((line) => el('li', {}, line))),
  );

  // Bantuan komersial hanya menonjol bila ada area yang perlu perhatian (T6).
  const helpLink = el('a', { href: '/solusi/', class: flagged.length ? 'button button--on-navy' : '' }, flagged.length ? c.helpCta : c.helpQuiet);
  helpLink.addEventListener('click', on.onHelp);
  const help = flagged.length
    ? el(
        'aside',
        { class: 'hc-help', 'aria-labelledby': 'res-help' },
        el('div', {}, tile('chat', 'tile--on-navy'), el('div', {}, el('h2', { id: 'res-help' }, c.helpTitle), el('p', {}, c.helpBody))),
        helpLink,
      )
    : el('p', { class: 'hc-help-quiet' }, helpLink);

  container.replaceChildren(
    head,
    el('div', { class: 'container hc-res-body' }, overview, pair, detail, how, help),
  );
}

/** Kartu "Langkah berikutnya" untuk area dengan prioritas tertinggi. */
function renderNext(
  top: AreaResult,
  insights: Partial<Record<string, InsightLink>>,
  onArticle: (href: string) => void,
): HTMLElement {
  const area = areaById(top.area);
  const resources: HTMLElement[] = [];

  const insight = insights[top.area];
  if (insight && top.status !== 'established') {
    const link = el(
      'a',
      { href: insight.href, class: 'hc-resource' },
      tile('book', 'tile--next'),
      el('span', {}, el('span', { class: 'hc-resource__kind' }, c.resourceInsight), el('span', { class: 'hc-resource__title' }, insight.title)),
      icon('arrow'),
    );
    link.addEventListener('click', () => onArticle(insight.href));
    resources.push(link);
  }
  // Tool berikutnya belum ada: ditampilkan sebagai rencana, tanpa tautan.
  if (top.area === 'C' || top.area === 'E') {
    resources.push(
      el(
        'div',
        { class: 'hc-resource' },
        tile('target', 'tile--muted'),
        el('span', {}, el('span', { class: 'hc-resource__kind' }, c.resourceTool), el('span', { class: 'hc-resource__title' }, c.kpiTool)),
        el('span', { class: 'pill pill--muted' }, c.planned),
      ),
    );
  }

  return el(
    'section',
    { class: 'hc-panel hc-next', 'aria-labelledby': 'res-next' },
    el('span', { class: 'pill pill--next' }, icon('send'), c.nextTitle),
    el('h2', { id: 'res-next' }, area.title),
    nextBody(top),
    resources.length > 0 && el('div', { class: 'hc-resources' }, ...resources),
    el('a', { href: '#res-detail', class: 'arrow-link' }, c.seeDetail, icon('arrow')),
  );
}

function nextBody(r: AreaResult): HTMLElement {
  const area = areaById(r.area);
  if (r.status === 'needs_attention' || r.status === 'forming') {
    return el('ol', {}, ...area.nextActions.map((a) => el('li', {}, a)));
  }
  return el('p', {}, r.status === 'insufficient_info' ? c.insufficientNext : c.establishedNext);
}

function renderArea(
  r: AreaResult,
  answers: Answers,
  insight: InsightLink | undefined,
  onArticle: (href: string) => void,
): HTMLElement {
  const area = areaById(r.area);
  const badge = el('span', { class: `hc-badge hc-badge--${r.status}` }, c.status[r.status]);

  const triggers =
    r.triggers.length > 0 &&
    el(
      'div',
      {},
      el('h4', {}, c.triggersTitle),
      el(
        'ul',
        {},
        ...r.triggers.map((id) =>
          el('li', {}, statementById(id).text + ' ', el('span', { class: 'hc-answer' }, `(${answerLabel(answers[id])})`)),
        ),
      ),
    );

  // Artikel terkait hanya untuk area yang perlu ditindaklanjuti, dan hanya bila artikelnya sudah terbit.
  let article: HTMLElement | false = false;
  if (insight && r.status !== 'established') {
    const link = el('a', { href: insight.href }, insight.title);
    link.addEventListener('click', () => onArticle(insight.href));
    article = el('p', { class: 'hc-article' }, `${t.insights.readMore}: `, link);
  }

  return el(
    'article',
    { class: 'hc-area', id: `area-${r.area}`, 'aria-labelledby': `res-${r.area}` },
    el('h3', { id: `res-${r.area}` }, area.title, badge),
    el('h4', {}, c.whyTitle),
    el('p', {}, area.why),
    triggers,
    el('h4', {}, c.nextTitle),
    nextBody(r),
    article,
  );
}
