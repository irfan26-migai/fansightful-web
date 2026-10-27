// Pemeriksaan hasil build di dist/.
//   node scripts/check-dist.mjs           → setiap tautan internal mengarah ke file yang ada
//   node scripts/check-dist.mjs --launch  → juga gagal bila masih ada penanda <Pending> (gerbang cutover)

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const launch = process.argv.includes('--launch');

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

function resolves(href) {
  const path = decodeURIComponent(href.split(/[?#]/)[0]);
  if (path === '' || path === '/') return existsSync(join(DIST, 'index.html'));
  const target = join(DIST, path);
  return existsSync(path.endsWith('/') ? join(target, 'index.html') : target) || existsSync(join(target, 'index.html'));
}

if (!existsSync(DIST)) {
  console.error('dist/ tidak ditemukan. Jalankan `npm run build` lebih dulu.');
  process.exit(1);
}

const problems = [];
for (const file of htmlFiles(DIST)) {
  const page = relative(DIST, file);
  const html = readFileSync(file, 'utf8');

  for (const [, href] of html.matchAll(/\shref="(\/[^"]*)"/g)) {
    if (!href.startsWith('//') && !resolves(href)) problems.push(`${page}: tautan rusak ${href}`);
  }

  if (launch) {
    for (const [, what] of html.matchAll(/data-pending="([^"]*)"/g)) {
      problems.push(`${page}: menunggu data — ${what}`);
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} masalah ditemukan.`);
  process.exit(1);
}
console.log(launch ? 'Siap launch: tidak ada tautan rusak atau data tertunda.' : 'Tidak ada tautan internal yang rusak.');
