import type { Page } from '@playwright/test';
import { HC, HEADERS, expect, tabTo, test } from './fixtures';

type Level = 0 | 1 | 2 | 3 | 'unknown';
const AREAS = ['A', 'B', 'C', 'D', 'E'] as const;
const MIXED: Record<(typeof AREAS)[number], Level[]> = {
  A: [0, 1, 3, 3],
  B: [3, 3, 2, 3],
  C: [1, 3, 3, 3],
  D: ['unknown', 'unknown', 2, 3],
  E: [0, 0, 1, 2],
};
/** Urutan opsi di setiap pernyataan: Belum ada, Ada tapi belum konsisten, Sebagian besar, Berjalan, Tidak tahu. */
const optionIndex = (v: Level) => (v === 'unknown' ? 4 : v);

const next = (page: Page) => page.locator('[data-hc-next]').click();

async function completeWithMouse(page: Page, plan = MIXED) {
  await next(page);
  for (const area of AREAS) {
    for (const [i, v] of plan[area].entries()) await page.locator(`input[name="${area}${i + 1}"][value="${v}"]`).check();
    await next(page);
  }
  await expect(page.getByRole('heading', { level: 1, name: 'Hasil Business & People Health Check' })).toBeFocused();
}

/** Fokus sudah di radio pertama sebuah pernyataan yang belum dijawab: Spasi memilih, panah bawah berpindah opsi. */
async function answerFocusedGroup(page: Page, v: Level) {
  await page.keyboard.press('Space');
  for (let k = 0; k < optionIndex(v); k++) await page.keyboard.press('ArrowDown');
}

test('perjalanan lengkap dengan keyboard saja: validasi, jawaban, hasil, ulangi', async ({ page, problems }) => {
  await page.goto(HC);

  // Profil: pilih jumlah karyawan lewat grup radio.
  await tabTo(page, 'input[name="profile_size"]');
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('input[name="profile_size"][value="6–20"]')).toBeChecked();
  await tabTo(page, '[data-hc-next]');
  await page.keyboard.press('Enter');
  await expect(page.locator('#hc-step-A')).toBeFocused();

  // Validasi: Lanjut tanpa jawaban → pesan alert, fokus ke jawaban pertama.
  await tabTo(page, '[data-hc-next]');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('alert')).toHaveText('Masih ada 4 pernyataan yang belum dijawab.');
  await expect(page.locator('input[name="A1"][value="0"]')).toBeFocused();

  for (const [n, area] of AREAS.entries()) {
    if (n > 0) {
      await expect(page.locator(`#hc-step-${area}`)).toBeFocused();
      await page.keyboard.press('Tab');
    }
    for (const [i, v] of MIXED[area].entries()) {
      await expect(page.locator(`input[name="${area}${i + 1}"]`).first()).toBeFocused();
      await answerFocusedGroup(page, v);
      await expect(page.locator(`input[name="${area}${i + 1}"][value="${v}"]`)).toBeChecked();
      if (i < 3) await page.keyboard.press('Tab');
    }
    await tabTo(page, '[data-hc-next]');
    await page.keyboard.press('Enter');
  }

  const h1 = page.getByRole('heading', { level: 1, name: 'Hasil Business & People Health Check' });
  await expect(h1).toBeFocused();
  await expect(page.locator('.hc-overview__count strong')).toHaveText('2');
  await expect(page.locator('.hc-res-context')).toContainText('dengan 6–20 karyawan');

  // Tautan langkah berikutnya bisa dicapai dengan Tab.
  await tabTo(page, 'a.hc-resource');
  await expect(page.locator(':focus')).toHaveAttribute('href', '/insights/penilaian-kinerja-subjektif/');

  // Ulangi lewat keyboard.
  await page.locator('.hc-res-actions button').nth(1).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#hc-step-profile')).toBeFocused();
  await expect(page.locator('[data-hc-results]')).toBeHidden();
  await expect(page.locator('input:checked')).toHaveCount(0);

  expect(problems).toEqual({ console: [], page: [], csp: [] });
});

test('jalur Beranda → Health Check → Hasil → artikel langkah berikutnya, tanpa error atau pelanggaran CSP', async ({
  page,
  problems,
}) => {
  const home = await page.goto('/');
  // Pastikan test benar-benar berjalan di bawah CSP produksi.
  expect(home!.headers()['content-security-policy']).toBe(HEADERS['content-security-policy']);
  expect(home!.headers()['content-security-policy']).toContain("font-src 'self'");

  await page.getByRole('link', { name: 'Coba Business Health Check' }).click();
  await expect(page).toHaveURL(HC);
  expect(await page.evaluate(async () => (await document.fonts.ready, document.fonts.check('16px "Plus Jakarta Sans"')))).toBe(true);

  await completeWithMouse(page);
  await page.locator('a.hc-resource').click();
  await expect(page).toHaveURL('/insights/penilaian-kinerja-subjektif/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  expect(problems).toEqual({ console: [], page: [], csp: [] });
});

test('privasi: setelah halaman dimuat, tidak ada request yang membawa jawaban', async ({ page, baseURL }) => {
  await page.goto(HC, { waitUntil: 'networkidle' });
  const requests: { method: string; url: string; body: string | null }[] = [];
  page.on('request', (r) => requests.push({ method: r.method(), url: r.url(), body: r.postData() }));

  await page.locator('#hc-type').selectOption('Manufaktur');
  await completeWithMouse(page);
  await page.locator('.hc-how summary').click();
  await page.waitForLoadState('networkidle');

  // Hanya aset statis dari situs sendiri (mis. subset font untuk glyph baru) yang boleh dimuat.
  for (const r of requests) {
    expect(r.method).toBe('GET');
    expect(r.body).toBeNull();
    expect(r.url.startsWith(`${baseURL}/_astro/`)).toBe(true);
    expect(r.url).not.toMatch(/Manufaktur|profile_|[?&][A-E][1-4]=|unknown/);
  }
  expect(page.url()).toBe(`${baseURL}${HC}`);
});

test('layar ponsel 375 px: tidak ada scroll horizontal di pertanyaan maupun hasil', async ({ page, problems }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(HC);
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await next(page);
  expect(await overflow()).toBeLessThanOrEqual(0);
  await page.goto(HC);
  await completeWithMouse(page);
  expect(await overflow()).toBeLessThanOrEqual(0);
  expect(problems).toEqual({ console: [], page: [], csp: [] });
});
