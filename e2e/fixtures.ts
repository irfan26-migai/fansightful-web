// Fixture bersama: header produksi dari public/_headers disuntikkan ke setiap respons `astro preview`
// (yang tidak membaca _headers), lalu error console, error halaman, dan pelanggaran CSP dikumpulkan.
import { readFileSync } from 'node:fs';
import { test as base, expect, type Page } from '@playwright/test';

/** Header di blok `/*` pada public/_headers — sama dengan yang dikirim Cloudflare Pages. */
function productionHeaders(): Record<string, string> {
  const lines = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8').split(/\r?\n/);
  const headers: Record<string, string> = {};
  let inGlobal = false;
  for (const line of lines) {
    if (/^\S/.test(line)) inGlobal = line.trim() === '/*';
    else if (inGlobal && line.includes(':')) {
      const i = line.indexOf(':');
      headers[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
    }
  }
  return headers;
}

export const HEADERS = productionHeaders();

export interface Problems {
  console: string[];
  page: string[];
  csp: string[];
}

export const test = base.extend<{ problems: Problems }>({
  problems: async ({ page, baseURL }, use) => {
    const problems: Problems = { console: [], page: [], csp: [] };
    await page.route(`${baseURL}/**`, async (route) => {
      const response = await route.fetch();
      await route.fulfill({ response, headers: { ...response.headers(), ...HEADERS } });
    });
    await page.exposeFunction('__reportCsp', (uri: string, directive: string) =>
      problems.csp.push(`${directive} → ${uri.slice(0, 80)}`),
    );
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (e) =>
        (window as unknown as { __reportCsp: (u: string, d: string) => void }).__reportCsp(e.blockedURI, e.violatedDirective),
      );
    });
    page.on('console', (msg) => msg.type() === 'error' && problems.console.push(msg.text().slice(0, 200)));
    page.on('pageerror', (err) => problems.page.push(err.message));
    await use(problems);
  },
});

export { expect };

export const HC = '/tools-lab/health-check/';

/** Tab sampai elemen yang cocok mendapat fokus (maks. `limit` kali). */
export async function tabTo(page: Page, selector: string, limit = 40): Promise<void> {
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return;
  }
  throw new Error(`Fokus tidak pernah mencapai ${selector} dalam ${limit} kali Tab`);
}
