#!/usr/bin/env node
/* Batch-export formation diagrams as PNGs, using the app's own drawing logic.
 *
 *   node batch.mjs "24B I" "18 R" "23 I UB"
 *   node batch.mjs --file calls.txt --out diagrams
 *   node batch.mjs --app ./index.html "44W L"     # run against a local copy
 *
 * Needs playwright (npm i playwright && npx playwright install chromium).
 * Output is the same 2400x1560 PNG the Download button produces.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const LIVE = 'https://thadmoren.github.io/FormationDrawer/';

const argv = process.argv.slice(2);
const calls = [];
let out = 'diagrams';
let app = LIVE;

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--out') out = argv[++i];
  else if (a === '--app') app = argv[++i];
  else if (a === '--file') {
    const lines = readFileSync(argv[++i], 'utf8').split('\n');
    for (const l of lines) {
      const call = l.trim();
      if (call && !call.startsWith('#')) calls.push(call);
    }
  } else calls.push(a);
}

if (!calls.length) {
  console.error('usage: node batch.mjs "24B I" ... | --file calls.txt [--out dir] [--app url|path]');
  process.exit(2);
}

const url = /^https?:/i.test(app) ? app : pathToFileURL(app).href;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: 'load' });

// One filename per call: "24B I" -> "24B_I.png"
const slug = c => c.toUpperCase().trim().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');

let written = 0;
const skipped = [];

for (const call of calls) {
  const r = await page.evaluate(c => {
    const input = document.getElementById('call');
    input.value = c;
    input.dispatchEvent(new Event('input'));           // renders synchronously
    const msg = document.getElementById('msg');
    const stale = document.getElementById('dl').disabled; // true => call didn't parse
    return {
      status: msg.className || 'ok',                    // 'ok' | 'warn' | 'err'
      note: msg.textContent,
      stale,
      png: stale ? null : document.getElementById('cv').toDataURL('image/png'),
    };
  }, call);

  if (r.stale) {                     // unparseable: canvas still shows the previous call
    console.error(`SKIP     ${call} — ${r.note}`);
    skipped.push(call);
    continue;
  }

  const file = join(out, `${slug(call)}.png`);
  writeFileSync(file, Buffer.from(r.png.split(',')[1], 'base64'));
  written++;

  const tag = r.status === 'err' ? 'ILLEGAL' : r.status.toUpperCase().padEnd(7);
  console.log(`${tag}  ${call} -> ${file}${r.status === 'ok' ? '' : `   (${r.note})`}`);
}

await browser.close();

console.log(`\n${written}/${calls.length} diagrams written to ${out}/`);
if (skipped.length) {
  console.log(`unreadable calls: ${skipped.join(', ')}`);
  process.exit(1);
}
