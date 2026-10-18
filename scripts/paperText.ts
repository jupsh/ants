/**
 * Page text of the papers cleared for full-text reading (docs/literature.json)
 * for `rg`: literature/<file>.pdf → .cache/papers/<Paper>/pNN.txt, one file
 * per PDF page (1-based PDF page, not the printed journal page). A paper whose
 * bytes differ from the pinned SHA-256 is refused and its text removed; PDFs
 * in literature/ that are not listed are reported and never extracted; text
 * of papers no longer listed is removed. Held papers live outside the repo
 * (~/ants-literature/held/) and are never touched. STATUS 2026-10-17 ≈ 14:30.
 *
 * Scanned pages (no text layer) are OCR'd with tesseract.js (English, French,
 * German models, downloaded once to .cache/tessdata). Each OCR'd page starts
 * with an `[OCR …]` line giving the mean word confidence and the numbers read
 * with low confidence (and where on the page, as a fraction of its height), so
 * a hit can be checked against the page image (scripts/paperPage.ts).
 * Figures and tables come out garbled: read those from the image. A paper
 * directory without the `.sha256` stamp was not made here (e.g. a hand
 * transcription) and is left alone.
 *
 *   npx vite-node scripts/paperText.ts            # extract new or changed
 *   npx vite-node scripts/paperText.ts --rebuild  # re-extract all
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createWorker, type Worker } from 'tesseract.js';
import { flag, readJson } from './lib';
import { LIT, OUT, clearedPapers, renderPage, sha256Of, pageSize } from './paperLib';

const OCR_LANGS = ['eng', 'fra', 'deu'], OCR_DPI = 300, TESSDATA = '.cache/tessdata';
const OCR_ID = `tesseract.js@${readJson<{ version: string }>('node_modules/tesseract.js/package.json').version} ${OCR_LANGS.join('+')} ${OCR_DPI}dpi`;
const MIN_TEXT = 50; // non-space characters below which a page counts as having no text layer
const LOW_CONF = 75; // a word with a digit below this confidence is listed in the page's OCR line

const papers = clearedPapers();
fs.mkdirSync(OUT, { recursive: true });
const listed = new Set(papers.map((p) => p.file));
for (const f of fs.readdirSync(LIT)) {
  if (f.endsWith('.pdf') && !listed.has(f)) console.warn(`not cleared, not extracted (move to ~/ants-literature/held/): ${LIT}/${f}`);
}
const keep = new Set(papers.map((p) => p.short));
const ours = (dir: string) => fs.existsSync(`${dir}/.sha256`);
for (const d of fs.readdirSync(OUT)) {
  if (keep.has(d)) continue;
  if (!ours(`${OUT}/${d}`)) { console.warn(`left alone (no .sha256 stamp, not made by this script): ${OUT}/${d}`); continue; }
  fs.rmSync(`${OUT}/${d}`, { recursive: true });
  console.log(`removed text of unlisted paper: ${d}`);
}

let worker: Worker | undefined;
async function ocr(pdf: string, page: number, short: string): Promise<{ text: string; conf: number }> {
  worker ??= await createWorker(OCR_LANGS, 1, { cachePath: TESSDATA });
  const { data } = await worker.recognize(renderPage(pdf, page, OCR_DPI), {}, { text: true, blocks: true });
  const height = pageSize(pdf, page).h * OCR_DPI / 72;
  const words = (data.blocks ?? []).flatMap((b) => b.paragraphs.flatMap((p) => p.lines.flatMap((l) => l.words)));
  const unsure = words.filter((w) => /\d/.test(w.text) && w.confidence < LOW_CONF)
    .map((w) => `${w.text} (${Math.round(w.confidence)} %, y ${(w.bbox.y0 / height).toFixed(2)})`);
  const head = `[OCR ${OCR_ID}, mean word confidence ${Math.round(data.confidence)} %; check numbers against the page image: ` +
    `npx vite-node scripts/paperPage.ts ${short} ${page}]` + (unsure.length ? `\n[OCR low-confidence numbers: ${unsure.join('; ')}]` : '');
  return { text: `${head}\n\n${data.text}`, conf: data.confidence };
}

let failed = 0;
for (const p of papers) {
  const stamp = `${p.dir}/.sha256`;
  if (!fs.existsSync(p.pdf)) { console.warn(`missing: ${p.pdf}`); continue; }
  const sha = sha256Of(p.pdf);
  if (fs.existsSync(p.dir) && !ours(p.dir)) { console.warn(`left alone (no .sha256 stamp, not made by this script): ${p.dir}`); continue; }
  if (sha !== p.sha256) {
    fs.rmSync(p.dir, { recursive: true, force: true });
    console.error(`REFUSED (bytes differ from the reviewed file; needs a scope review, not a hash update): ${p.pdf}`);
    failed++;
    continue;
  }
  // The stamp is the hash, plus the OCR set-up when any page was OCR'd, so a new OCR version re-extracts.
  const old = fs.existsSync(stamp) ? fs.readFileSync(stamp, 'utf8') : '';
  if (!flag('--rebuild') && (old === sha || old === `${sha} ${OCR_ID}`)) continue;
  // Reading order, not -layout: -layout interleaves the columns of two-column pages.
  const pages = execFileSync('pdftotext', ['-enc', 'UTF-8', p.pdf, '-'], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\f');
  if (pages.at(-1)!.trim() === '') pages.pop();
  const confs: number[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].replace(/\s/g, '').length >= MIN_TEXT) continue;
    const r = await ocr(p.pdf, i + 1, p.short);
    pages[i] = r.text;
    confs.push(r.conf);
    process.stdout.write(`\r${p.short}: OCR page ${i + 1}/${pages.length}`);
  }
  if (confs.length) process.stdout.write('\n');
  fs.rmSync(p.dir, { recursive: true, force: true });
  fs.mkdirSync(p.dir);
  const width = Math.max(2, String(pages.length).length);
  pages.forEach((text, i) => fs.writeFileSync(`${p.dir}/p${String(i + 1).padStart(width, '0')}.txt`, text));
  fs.writeFileSync(stamp, confs.length ? `${sha} ${OCR_ID}` : sha);
  const ocrNote = confs.length ? `, ${confs.length} OCR'd (mean confidence ${Math.round(confs.reduce((a, b) => a + b) / confs.length)} %)` : '';
  console.log(`${p.short}: ${pages.length} pages${ocrNote} (${p.role})`);
}
await worker?.terminate();
if (failed) process.exit(1);
