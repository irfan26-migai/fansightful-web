// Perilaku interaktif Health Check: stepper per area, validasi, render hasil, cetak.
// Semua teks hasil dibuat dengan textContent; jawaban tidak pernah meninggalkan browser.

import { evaluate, type Answers, type AreaResult } from './evaluate';
import { AREAS, SCALE, STATEMENTS, type Answer } from './instrument';
import { id as t } from '../../i18n/id';
import { durationBucket, track } from '../../lib/analytics';
import type { InsightLink } from '../../lib/insights';

const c = t.healthCheck;
const TOOL = 'health-check' as const;

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

const areaById = (id: string) => AREAS.find((a) => a.id === id)!;
const statementById = (id: string) => STATEMENTS.find((s) => s.id === id)!;
const answerLabel = (a: Answer) => SCALE.find((o) => o.value === a)!.label;
const listNames = (ids: string[]) => ids.map((id) => areaById(id).title).join(', ');

export function initHealthCheck(root: HTMLElement): void {
  const intro = root.querySelector<HTMLElement>('[data-hc-intro]')!;
  const startBtn = root.querySelector<HTMLButtonElement>('[data-hc-start]')!;
  const form = root.querySelector<HTMLFormElement>('[data-hc-form]')!;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-hc-step]')];
  const nav = root.querySelector<HTMLElement>('[data-hc-nav]')!;
  const backBtn = root.querySelector<HTMLButtonElement>('[data-hc-back]')!;
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-hc-next]')!;
  const errorBox = root.querySelector<HTMLElement>('[data-hc-error]')!;
  const results = root.querySelector<HTMLElement>('[data-hc-results]')!;

  const insights: Partial<Record<string, InsightLink>> = JSON.parse(root.dataset.hcInsights || '{}');

  let current = 0;
  let startedAt = 0;

  // Mode JavaScript: kuesioner disembunyikan sampai pengguna menekan "Mulai".
  form.hidden = true;
  startBtn.hidden = false;
  nav.hidden = false;
  track('tool_view', { tool_id: TOOL });

  function readAnswers(): Answers {
    const answers: Answers = {};
    for (const [name, value] of new FormData(form)) {
      answers[name] = value === 'unknown' ? 'unknown' : (Number(value) as Answer);
    }
    return answers;
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
    steps.forEach((s, i) => (s.hidden = i !== index));
    backBtn.hidden = index === 0;
    nextBtn.textContent = index === steps.length - 1 ? c.seeResults : c.next;
    clearErrors(steps[index]);
    if (focus) {
      const heading = steps[index].querySelector<HTMLElement>('h2')!;
      heading.focus();
      heading.scrollIntoView({ block: 'start' });
    }
  }

  /** Mengembalikan true bila semua pernyataan di langkah ini sudah dijawab. */
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
    const q = (e.target as HTMLElement).closest<HTMLElement>('[data-hc-q]');
    if (!q) return;
    q.removeAttribute('aria-invalid');
    q.querySelector<HTMLElement>('.hc-field-error')!.hidden = true;
  });

  startBtn.addEventListener('click', () => {
    startedAt = Date.now();
    intro.hidden = true;
    results.hidden = true;
    form.hidden = false;
    showStep(0);
    track('tool_start', { tool_id: TOOL });
  });

  backBtn.addEventListener('click', () => showStep(current - 1));

  nextBtn.addEventListener('click', () => {
    const step = steps[current];
    if (!validate(step)) return;
    track('tool_area_complete', { tool_id: TOOL, area: step.dataset.hcStep as AreaResult['area'] });
    if (current < steps.length - 1) showStep(current + 1);
    else showResults();
  });

  form.addEventListener('submit', (e) => e.preventDefault());

  function showResults() {
    const answers = readAnswers();
    const evaluation = evaluate(answers);
    track('tool_complete', { tool_id: TOOL, duration_bucket: durationBucket(Date.now() - startedAt) });

    renderResults(results, evaluation.areas, answers, insights, {
      onPrint: () => {
        track('next_action_click', { tool_id: TOOL, action_type: 'download', target: 'print' });
        window.print();
      },
      onRestart: () => {
        track('next_action_click', { tool_id: TOOL, action_type: 'restart', target: 'restart' });
        form.reset();
        results.hidden = true;
        form.hidden = false;
        startedAt = Date.now();
        showStep(0);
      },
      onHelp: () => track('next_action_click', { tool_id: TOOL, action_type: 'solusi', target: '/solusi/' }),
      onArticle: (href) => track('next_action_click', { tool_id: TOOL, action_type: 'article', target: href }),
    });

    form.hidden = true;
    results.hidden = false;
    const heading = results.querySelector<HTMLElement>('h2')!;
    heading.focus();
    heading.scrollIntoView({ block: 'start' });
    track('result_view', { tool_id: TOOL });
  }
}

interface ResultHandlers {
  onPrint: () => void;
  onRestart: () => void;
  onHelp: () => void;
  onArticle: (href: string) => void;
}

function renderResults(
  container: HTMLElement,
  areas: AreaResult[],
  answers: Answers,
  insights: Partial<Record<string, InsightLink>>,
  on: ResultHandlers,
) {
  const flagged = areas.filter((a) => a.status === 'needs_attention').map((a) => a.area);
  const insufficient = areas.filter((a) => a.status === 'insufficient_info').map((a) => a.area);

  const summary = el(
    'div',
    { class: 'hc-summary' },
    el('p', { class: 'lead' }, flagged.length ? c.summaryFlagged(flagged.length, listNames(flagged)) : c.summaryNone),
    insufficient.length > 0 && el('p', {}, c.summaryInsufficient(listNames(insufficient))),
  );

  const printBtn = el('button', { type: 'button', class: 'button' }, c.print);
  const restartBtn = el('button', { type: 'button', class: 'button button--secondary' }, c.restart);
  printBtn.addEventListener('click', on.onPrint);
  restartBtn.addEventListener('click', on.onRestart);

  // Bantuan komersial hanya menonjol bila ada area yang perlu perhatian (T6).
  const helpLink = el('a', { href: '/solusi/' }, flagged.length ? c.helpCta : c.helpQuiet);
  helpLink.addEventListener('click', on.onHelp);
  const help = flagged.length
    ? el('aside', { class: 'callout hc-help' }, el('h2', {}, c.helpTitle), el('p', {}, c.helpBody), helpLink)
    : el('p', { class: 'hc-help' }, helpLink);

  container.replaceChildren(
    el('h2', { tabindex: '-1' }, c.resultsTitle),
    summary,
    ...areas.map((r) => renderArea(r, answers, insights[r.area], on.onArticle)),
    el(
      'aside',
      { class: 'callout' },
      el('h2', {}, c.howToReadTitle),
      el('ul', {}, ...c.howToRead.map((line) => el('li', {}, line))),
    ),
    el('div', { class: 'hc-actions' }, printBtn, restartBtn),
    help,
  );
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

  let next: HTMLElement;
  if (r.status === 'needs_attention' || r.status === 'forming') {
    next = el('ol', {}, ...area.nextActions.map((a) => el('li', {}, a)));
  } else if (r.status === 'insufficient_info') {
    next = el('p', {}, c.insufficientNext);
  } else {
    next = el('p', {}, c.establishedNext);
  }

  // Artikel terkait hanya untuk area yang perlu ditindaklanjuti, dan hanya bila artikelnya sudah terbit.
  let article: HTMLElement | false = false;
  if (insight && r.status !== 'established') {
    const link = el('a', { href: insight.href }, insight.title);
    link.addEventListener('click', () => onArticle(insight.href));
    article = el('p', { class: 'hc-article' }, `${t.insights.readMore}: `, link);
  }

  return el(
    'article',
    { class: 'hc-area', 'aria-labelledby': `res-${r.area}` },
    el('h3', { id: `res-${r.area}` }, area.title, badge),
    el('h4', {}, c.whyTitle),
    el('p', {}, area.why),
    triggers,
    el('h4', {}, c.nextTitle),
    next,
    article,
  );
}
