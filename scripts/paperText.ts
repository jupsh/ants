/**
 * Page text of the papers cleared for full-text reading (docs/literature.json)
 * for `rg`: literature/<file>.pdf → .cache/papers/<Paper>/pNN.txt, one file
 * per PDF page (1-based PDF page, not the printed journal page). A paper whose
 * bytes differ from the pinned SHA-256 is refused and its text removed; PDFs
 * in literature/ that are not listed are reported and never extracted; text
 * of papers no longer listed is removed. Held papers live outside the repo
 * (~/ants-literature/held/) and are never touched. STATUS 2026-10-17 ≈ 14:30.
 *
 *   npx vite-node scripts/paperText.ts            # extract new or changed
 *   npx vite-node scripts/paperText.ts --rebuild  # re-extract all
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { flag, readJson } from './lib';

const LIT = 'literature', OUT = '.cache/papers';
type Paper = { file: string; sha256: string; role: string; cleared: string };
const { papers } = readJson<{ papers: Paper[] }>('docs/literature.json');

// Short directory names ("Crosscombe2026") keep rg output readable.
const dirOf = new Map(papers.map((p) => [p.file, p.file.split('_')[0]]));
if (new Set(dirOf.values()).size !== papers.length) throw new Error('docs/literature.json: two papers share a short name');

fs.mkdirSync(OUT, { recursive: true });
const listed = new Set(papers.map((p) => p.file));
for (const f of fs.readdirSync(LIT)) {
  if (f.endsWith('.pdf') && !listed.has(f)) console.warn(`not cleared, not extracted (move to ~/ants-literature/held/): ${LIT}/${f}`);
}
const keep = new Set(dirOf.values());
for (const d of fs.readdirSync(OUT)) {
  if (!keep.has(d)) { fs.rmSync(`${OUT}/${d}`, { recursive: true }); console.log(`removed text of unlisted paper: ${d}`); }
}

let failed = 0;
for (const p of papers) {
  const pdf = `${LIT}/${p.file}`, dir = `${OUT}/${dirOf.get(p.file)}`, stamp = `${dir}/.sha256`;
  if (!fs.existsSync(pdf)) { console.warn(`missing: ${pdf}`); continue; }
  const sha = createHash('sha256').update(fs.readFileSync(pdf)).digest('hex');
  if (sha !== p.sha256) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.error(`REFUSED (bytes differ from the reviewed file; needs a scope review, not a hash update): ${pdf}`);
    failed++;
    continue;
  }
  if (!flag('--rebuild') && fs.existsSync(stamp) && fs.readFileSync(stamp, 'utf8') === sha) continue;
  // Reading order, not -layout: -layout interleaves the columns of two-column pages.
  const pages = execFileSync('pdftotext', ['-enc', 'UTF-8', pdf, '-'], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\f');
  if (pages.at(-1)!.trim() === '') pages.pop();
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir);
  const width = Math.max(2, String(pages.length).length);
  pages.forEach((text, i) => fs.writeFileSync(`${dir}/p${String(i + 1).padStart(width, '0')}.txt`, text));
  fs.writeFileSync(stamp, sha);
  console.log(`${dirOf.get(p.file)}: ${pages.length} pages (${p.role})`);
}
if (failed) process.exit(1);
