/**
 * Shared by the literature tools (paperText.ts, paperPage.ts): the papers
 * cleared for full-text reading (docs/literature.json), their short names
 * ("LenoirAtaya1983"), the SHA-256 check against the reviewed bytes, and page
 * rendering. Only cleared papers whose bytes match are ever opened; held papers
 * live outside the repo and are never touched. STATUS 2026-10-17 ≈ 14:30.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import { readJson } from './lib';

export const LIT = 'literature', OUT = '.cache/papers', IMG = '.cache/paper-img';
export type Paper = { file: string; sha256: string; role: string; cleared: string; short: string; pdf: string; dir: string };

export function clearedPapers(): Paper[] {
  const { papers } = readJson<{ papers: Omit<Paper, 'short' | 'pdf' | 'dir'>[] }>('docs/literature.json');
  // Short directory names ("Crosscombe2026") keep rg output readable.
  const out = papers.map((p) => {
    const short = p.file.split('_')[0];
    return { ...p, short, pdf: `${LIT}/${p.file}`, dir: `${OUT}/${short}` };
  });
  if (new Set(out.map((p) => p.short)).size !== out.length) throw new Error('docs/literature.json: two papers share a short name');
  return out;
}

export const sha256Of = (path: string) => createHash('sha256').update(fs.readFileSync(path)).digest('hex');

/** Cleared paper by short name (exact, else a unique case-insensitive part of it), with its bytes checked. */
export function resolvePaper(name: string): Paper {
  const papers = clearedPapers();
  const exact = papers.find((p) => p.short === name);
  const hits = exact ? [exact] : papers.filter((p) => p.short.toLowerCase().includes(name.toLowerCase()));
  if (hits.length !== 1) {
    throw new Error(`${hits.length ? 'ambiguous' : 'no cleared paper'} "${name}"; cleared: ${(hits.length ? hits : papers).map((p) => p.short).join(', ')}`);
  }
  const p = hits[0];
  if (!fs.existsSync(p.pdf)) throw new Error(`missing: ${p.pdf}`);
  if (sha256Of(p.pdf) !== p.sha256) throw new Error(`REFUSED (bytes differ from the reviewed file): ${p.pdf}`);
  return p;
}

export function pageCount(pdf: string): number {
  return Number(/^Pages:\s+(\d+)/m.exec(execFileSync('pdfinfo', [pdf], { encoding: 'utf8' }))![1]);
}

/** Page size in points (1/72 in) of one 1-based PDF page. */
export function pageSize(pdf: string, page: number): { w: number; h: number } {
  const info = execFileSync('pdfinfo', ['-f', String(page), '-l', String(page), pdf], { encoding: 'utf8' });
  const m = /Page\s+\d+\s+size:\s+([\d.]+) x ([\d.]+)/.exec(info)!;
  return { w: Number(m[1]), h: Number(m[2]) };
}

/**
 * Renders one 1-based PDF page to a grey PNG at `dpi`, optionally only the
 * crop [x0, y0, x1, y1] given as fractions of the page width and height
 * (origin top left). Returns the PNG bytes.
 */
export function renderPage(pdf: string, page: number, dpi: number, crop?: [number, number, number, number]): Buffer {
  const args = ['-f', String(page), '-l', String(page), '-r', String(dpi), '-gray', '-png', '-singlefile'];
  if (crop) {
    const { w, h } = pageSize(pdf, page), px = dpi / 72;
    const [x0, y0, x1, y1] = crop;
    args.push('-x', String(Math.round(x0 * w * px)), '-y', String(Math.round(y0 * h * px)),
      '-W', String(Math.round((x1 - x0) * w * px)), '-H', String(Math.round((y1 - y0) * h * px)));
  }
  // pdftoppm cannot write PNG to stdout, so through a temporary file.
  const tmp = fs.mkdtempSync(`${os.tmpdir()}/paperpage-`);
  try {
    execFileSync('pdftoppm', [...args, pdf, `${tmp}/page`]);
    return fs.readFileSync(`${tmp}/page.png`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
