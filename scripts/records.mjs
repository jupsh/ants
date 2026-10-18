// Shared helpers for the record folders (findings/, docs/log/, docs/contamination/):
// one Markdown file per record with a one-line-per-field frontmatter, generated
// indexes, and MongoDB-style queries through sift. STATUS 2026-10-18 ≈ 16:32.
import fs from 'node:fs';
import path from 'node:path';
import sift from 'sift';

export function die(msg) {
  console.error(msg);
  process.exit(1);
}

export function parseArgs(argv) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) opt[argv[i].slice(2)] = argv[++i] ?? '';
    else pos.push(argv[i]);
  }
  return { pos, opt };
}

/** Split a record into its fields (one `key: value` per line) and body. */
export function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fields = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return { fields, body: text.slice(m[0].length).trim() };
}

export function setField(file, key, value) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) die(`${file}: no frontmatter`);
  const lines = m[1].split('\n');
  const i = lines.findIndex((l) => l.startsWith(`${key}:`));
  if (i >= 0) lines[i] = `${key}: ${value}`;
  else lines.push(`${key}: ${value}`);
  fs.writeFileSync(file, `---\n${lines.join('\n')}\n---\n` + text.slice(m[0].length));
}

export function writeRecord(file, fields, body) {
  const head = fields.map(([k, v]) => `${k}: ${v ?? ''}`.trimEnd()).join('\n');
  fs.writeFileSync(file, `---\n${head}\n---\n${body.trim()}\n`, { flag: 'wx' });
}

export const LIST = (s, sep) => (s ?? '').split(sep).map((x) => x.trim()).filter(Boolean);
export const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function slugify(title, max = 40) {
  const slug = title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return slug.length > max ? slug.slice(0, max + 1).replace(/-[^-]*$/, '') : slug;
}

/** Files of a record folder whose names match `re`, parsed; problems for unparseable ones. */
export function readFolder(dir, re) {
  const out = [];
  const problems = [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (!re.test(name)) continue;
    const file = path.join(dir, name);
    const fm = frontmatter(fs.readFileSync(file, 'utf8'));
    if (!fm) problems.push(`${name}: no frontmatter`);
    else out.push({ ...fm.fields, body: fm.body, name, file });
  }
  return { records: out, problems };
}

/**
 * MongoDB-style query over documents (sift). `$where` is refused (it runs code).
 * Options: sort ("[-]field"), fields ("a,b"), json (print the documents).
 */
export function findAndPrint(docs, queryText, opt, line) {
  let q;
  try {
    q = JSON.parse(queryText ?? '{}');
  } catch (e) {
    die(`query is not JSON: ${e.message}`);
  }
  if (JSON.stringify(q).includes('"$where"')) die('$where is not allowed (it runs code); use the field operators');
  let test;
  try {
    test = sift(q);
  } catch (e) {
    die(`bad query: ${e.message}`);
  }
  const hits = docs.filter(test);
  if (opt.sort) {
    const desc = opt.sort.startsWith('-');
    const key = opt.sort.replace(/^-/, '');
    hits.sort((a, b) => String(a[key] ?? '').localeCompare(String(b[key] ?? '')) * (desc ? -1 : 1) || String(a.id).localeCompare(String(b.id)));
  }
  if (opt.json !== undefined) {
    console.log(JSON.stringify(hits, null, 2));
    return;
  }
  const fields = opt.fields ? opt.fields.split(',') : null;
  for (const d of hits) console.log(fields ? fields.map((k) => (Array.isArray(d[k]) ? d[k].join('; ') : d[k] ?? '')).join('  |  ') : line(d));
  console.log(`${hits.length} found`);
}

/** Entry-header lines (STATUS, archives, log and contamination records) that `STATUS:<text>` references resolve against. */
export function headerLines(root) {
  const files = [path.join(root, 'docs/STATUS.md')];
  for (const sub of ['docs/archive', 'docs/log', 'docs/contamination']) {
    const d = path.join(root, sub);
    if (fs.existsSync(d)) for (const n of fs.readdirSync(d)) if (n.endsWith('.md') && n !== 'README.md') files.push(path.join(d, n));
  }
  const out = [];
  for (const f of files)
    for (const line of fs.readFileSync(f, 'utf8').split('\n'))
      if (/^(\*\*|- \*\*|#|title: )/.test(line)) out.push(line);
  return out;
}
