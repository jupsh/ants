/**
 * Page images of the cleared papers, for reading what text extraction loses:
 * scanned pages, tables, figures, equations, and numbers flagged by OCR
 * (scripts/paperText.ts). Renders 1-based PDF pages (the pNN of
 * .cache/papers/<Paper>/pNN.txt) to .cache/paper-img/<Paper>/ and prints the
 * paths; open them with an image viewer or an agent's file reader. Only papers
 * listed in docs/literature.json whose bytes match the pinned SHA-256.
 *
 *   npx vite-node scripts/paperPage.ts LenoirAtaya1983 6         # whole page, 150 dpi
 *   npx vite-node scripts/paperPage.ts Lenoir 6-8                # a range (any unique part of the name)
 *   npx vite-node scripts/paperPage.ts Lenoir 6 --crop 0,0.6,1,1 # bottom 40 %, 300 dpi
 *   npx vite-node scripts/paperPage.ts Lenoir 6 --crop 0,0.6,1,1 --dpi 400
 *
 * --crop x0,y0,x1,y1: fractions of the page width and height, origin top left
 * (the `y` in an OCR low-confidence note is y0). Default dpi: 150 for a whole
 * page, 300 for a crop.
 */
import fs from 'node:fs';
import { arg, numArg } from './lib';
import { IMG, pageCount, renderPage, resolvePaper } from './paperLib';

const fail = (msg: string): never => { console.error(msg); process.exit(2); };
const [name, range] = process.argv.slice(2).filter((a, i, all) => !a.startsWith('--') && !all[i - 1]?.startsWith('--'));
if (!name || !range) fail('usage: paperPage.ts <Paper> <page|from-to> [--crop x0,y0,x1,y1] [--dpi n]');
let p!: ReturnType<typeof resolvePaper>;
try { p = resolvePaper(name); } catch (e) { fail((e as Error).message); }
const n = pageCount(p.pdf);
const [from, to = from] = range.split('-').map(Number);
if (!(from >= 1 && to >= from && to <= n)) fail(`pages ${range} outside 1–${n} of ${p.short}`);

const cropArg = arg('--crop', '');
const crop = cropArg ? cropArg.split(',').map(Number) as [number, number, number, number] : undefined;
if (crop && !(crop.length === 4 && crop.every((v) => v >= 0 && v <= 1) && crop[0] < crop[2] && crop[1] < crop[3])) {
  fail('--crop x0,y0,x1,y1 with 0 ≤ x0 < x1 ≤ 1 and 0 ≤ y0 < y1 ≤ 1');
}
const dpi = numArg('--dpi', crop ? 300 : 150);

const dir = `${IMG}/${p.short}`;
fs.mkdirSync(dir, { recursive: true });
const width = Math.max(2, String(n).length);
for (let page = from; page <= to; page++) {
  const tag = crop ? `-${crop.join('_')}` : '';
  const out = `${dir}/p${String(page).padStart(width, '0')}${tag}-${dpi}dpi.png`;
  fs.writeFileSync(out, renderPage(p.pdf, page, dpi, crop));
  console.log(out);
}
