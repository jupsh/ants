#!/usr/bin/env node
// Exploratory backlog. The item folders (Bnnn-slug/README.md frontmatter, plus
// a .claim/ folder while claimed) are the only source of truth; README.md (the
// open index) and CLOSED.md are generated from them. Protocol: backlog/PROTOCOL.md.
//
//   node backlog/backlog.mjs                         regenerate the index files
//   node backlog/backlog.mjs new "<title>" [--question q] [--source s] [--priority n]
//   node backlog/backlog.mjs claim <id> --as "<session label>"
//   node backlog/backlog.mjs release <id> [--status open|blocked|done|dropped]
//   node backlog/backlog.mjs log <id> "<text>" [--as "<agent>"]   append a Progress entry
//   node backlog/backlog.mjs check [<id>]     results computed on code/inputs that have changed
//
// Every command but check regenerates the index files. Status, size, priority, note and
// outcome are otherwise edited in the item's frontmatter by hand.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const STATUSES = ['unscoped', 'open', 'active', 'blocked', 'done', 'dropped'];
const CLOSED = new Set(['done', 'dropped']);
const STALE_HOURS = 24;
const ITEM_DIR = /^B(\d{3})-[a-z0-9-]+$/;
const PROGRESS = /^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) UTC/gm;

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function parseArgs(argv) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) opt[argv[i].slice(2)] = argv[++i] ?? '';
    else pos.push(argv[i]);
  }
  return { pos, opt };
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fields = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return fields;
}

function setField(file, key, value) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) die(`${file}: no frontmatter`);
  const lines = m[1].split('\n');
  const i = lines.findIndex((l) => l.startsWith(`${key}:`));
  if (i >= 0) lines[i] = `${key}: ${value}`;
  else lines.push(`${key}: ${value}`);
  fs.writeFileSync(file, `---\n${lines.join('\n')}\n---\n` + text.slice(m[0].length));
}

function utcStamp(d = new Date()) {
  return d.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
}

function lastProgress(dir) {
  let last = null;
  for (const name of ['README.md', 'LOG.md']) {
    const f = path.join(dir, name);
    if (!fs.existsSync(f)) continue;
    for (const m of fs.readFileSync(f, 'utf8').matchAll(PROGRESS)) {
      const t = new Date(m[1].replace(' ', 'T') + 'Z');
      if (!last || t > last) last = t;
    }
  }
  return last;
}

function readItems() {
  const items = [];
  const problems = [];
  for (const name of fs.readdirSync(DIR).sort()) {
    const m = name.match(ITEM_DIR);
    if (!m || !fs.statSync(path.join(DIR, name)).isDirectory()) continue;
    const dir = path.join(DIR, name);
    const readme = path.join(dir, 'README.md');
    if (!fs.existsSync(readme)) {
      problems.push(`${name}: no README.md`);
      continue;
    }
    const fm = frontmatter(fs.readFileSync(readme, 'utf8'));
    if (!fm) {
      problems.push(`${name}: no frontmatter`);
      continue;
    }
    const claimDir = path.join(dir, '.claim');
    const claimed = fs.existsSync(claimDir);
    const item = {
      ...fm,
      folder: name,
      dir,
      readme,
      priority: Number(fm.priority),
      claim: claimed ? fs.readFileSync(path.join(claimDir, 'who'), 'utf8').trim() : '',
      claimTime: claimed ? fs.statSync(claimDir).mtime : null,
      progress: lastProgress(dir),
    };
    if (item.id !== `B${m[1]}`) problems.push(`${name}: id ${item.id} does not match the folder`);
    if (!STATUSES.includes(item.status)) problems.push(`${name}: unknown status "${item.status}"`);
    if (item.status === 'active' && !claimed) problems.push(`${name}: active but not claimed`);
    if (item.status !== 'active' && claimed) problems.push(`${name}: claimed but ${item.status}`);
    if (!Number.isFinite(item.priority)) problems.push(`${name}: priority is not a number`);
    items.push(item);
  }
  const seen = new Map();
  for (const it of items) {
    if (seen.has(it.id)) problems.push(`duplicate id ${it.id}: ${seen.get(it.id)}, ${it.folder}`);
    seen.set(it.id, it.folder);
  }
  return { items, problems };
}

function cell(s) {
  return String(s ?? '').replace(/\|/g, '\\|');
}

function writeIndex() {
  const { items, problems } = readItems();
  const now = Date.now();
  const open = items
    .filter((it) => !CLOSED.has(it.status))
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  const closed = items.filter((it) => CLOSED.has(it.status)).sort((a, b) => a.id.localeCompare(b.id));

  const rows = open.map((it) => {
    let claim = '';
    if (it.claim) {
      const since = Math.max(it.claimTime.getTime(), it.progress?.getTime() ?? 0);
      const stale = (now - since) / 3.6e6 > STALE_HOURS;
      claim = `${it.claim}${stale ? ' **(stale)**' : ''}`;
    }
    const title = it.note ? `${it.title} — *${it.note}*` : it.title;
    const last = it.progress ? utcStamp(it.progress).slice(0, 10) : '';
    return `| ${it.priority} | [${it.id}](${it.folder}/README.md) | ${it.status} | ${cell(it.size)} | ${cell(title)} | ${cell(claim)} | ${last} |`;
  });

  const index = [
    '<!-- Generated by `node backlog/backlog.mjs` from the item folders; do not edit. -->',
    '# Exploratory backlog',
    '',
    'Open items by priority (lower first; set `priority:` in an item\'s README).',
    'Protocol: `PROTOCOL.md`. Closed items: `CLOSED.md`.',
    'Sizes: **S** no simulation, under ~1 h of work · **M** simulations under ~1 h',
    'of local compute · **L** long runs (box, or over 1 h): needs the user\'s go-ahead.',
    `A claim with no progress for ${STALE_HOURS} h is stale and may be taken over.`,
    '',
    '| pri | id | status | size | title | claim | last progress |',
    '|---|---|---|---|---|---|---|',
    ...rows,
  ];
  if (problems.length) index.push('', '## Problems', ...problems.map((p) => `- ${p}`));
  fs.writeFileSync(path.join(DIR, 'README.md'), index.join('\n') + '\n');

  const closedText = [
    '<!-- Generated by `node backlog/backlog.mjs` from the item folders; do not edit. -->',
    '# Exploratory backlog — closed items',
    '',
    '| id | status | title | outcome |',
    '|---|---|---|---|',
    ...closed.map(
      (it) => `| [${it.id}](${it.folder}/README.md) | ${it.status} | ${cell(it.title)} | ${cell(it.outcome)} |`,
    ),
  ];
  fs.writeFileSync(path.join(DIR, 'CLOSED.md'), closedText.join('\n') + '\n');

  for (const p of problems) console.error(`problem: ${p}`);
  console.log(`README.md: ${open.length} open; CLOSED.md: ${closed.length} closed`);
}

function findItem(id) {
  const { items } = readItems();
  const it = items.find((x) => x.id === id);
  if (!it) die(`no item ${id}`);
  return it;
}

function cmdNew(pos, opt) {
  const title = pos[0];
  if (!title) die('usage: new "<title>" [--question q] [--source s] [--priority n]');
  const { items } = readItems();
  const n = Math.max(0, ...items.map((it) => Number(it.id.slice(1)))) + 1;
  const id = `B${String(n).padStart(3, '0')}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cut = slug.length > 40 ? slug.slice(0, 41).replace(/-[^-]*$/, '') : slug;
  const priority = opt.priority ?? Math.max(0, ...items.map((it) => it.priority || 0)) + 10;
  const dir = path.join(DIR, `${id}-${cut}`);
  fs.mkdirSync(dir); // throws if it exists
  const text = fs
    .readFileSync(path.join(DIR, 'TEMPLATE.md'), 'utf8')
    .replaceAll('{{id}}', id)
    .replaceAll('{{title}}', title)
    .replaceAll('{{priority}}', String(priority))
    .replaceAll('{{question}}', opt.question ?? '<One question that the work can answer.>')
    .replaceAll('{{source}}', opt.source ?? '<STATUS § … / found while working on Bxxx>');
  fs.writeFileSync(path.join(dir, 'README.md'), text);
  console.log(`created ${path.basename(dir)}`);
}

function cmdClaim(pos, opt) {
  const it = findItem(pos[0]);
  if (!opt.as) die('usage: claim <id> --as "<session label>"');
  if (CLOSED.has(it.status)) die(`${it.id} is ${it.status}`);
  try {
    fs.mkdirSync(path.join(it.dir, '.claim')); // atomic: fails if already claimed
  } catch (e) {
    if (e.code === 'EEXIST') die(`${it.id} is already claimed: ${it.claim}`);
    throw e;
  }
  fs.writeFileSync(path.join(it.dir, '.claim', 'who'), `${opt.as} ${utcStamp()}\n`);
  setField(it.readme, 'status', 'active');
  console.log(`claimed ${it.folder}`);
}

function cmdRelease(pos, opt) {
  const it = findItem(pos[0]);
  const status = opt.status ?? 'open';
  if (!STATUSES.includes(status) || status === 'active') die(`bad --status ${status}`);
  fs.rmSync(path.join(it.dir, '.claim'), { recursive: true, force: true });
  setField(it.readme, 'status', status);
  console.log(`released ${it.folder} as ${status}`);
}

function cmdLog(pos, opt) {
  const it = findItem(pos[0]);
  const text = pos.slice(1).join(' ').trim();
  if (!text) die('usage: log <id> "<text>" [--as "<agent>"]');
  const agent = opt.as ?? it.claim.replace(/\s+\d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC$/, '');
  if (!agent) die(`${it.id} is not claimed: pass --as "<agent>"`);
  const entry = `- ${utcStamp()} · ${agent} · ${text.split('\n').join('\n  ')}\n`;
  const doc = fs.readFileSync(it.readme, 'utf8');
  const at = doc.indexOf('\n## Findings');
  fs.writeFileSync(it.readme, at < 0 ? doc.replace(/\n*$/, '\n') + entry : doc.slice(0, at).replace(/\n*$/, '\n') + entry + doc.slice(at));
  console.log(`logged in ${it.folder}`);
}

function resultFiles(dir) {
  const out = [];
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.json')) out.push(p);
    }
  };
  walk(path.join(dir, 'results'));
  return out;
}

function cmdCheck(pos) {
  const { items } = readItems();
  const chosen = pos[0] ? items.filter((it) => it.id === pos[0]) : items;
  if (pos[0] && !chosen.length) die(`no item ${pos[0]}`);
  const stamped = [];
  for (const it of chosen) {
    for (const f of resultFiles(it.dir)) {
      let prov;
      try {
        prov = JSON.parse(fs.readFileSync(f, 'utf8')).provenance;
      } catch {
        prov = undefined;
      }
      stamped.push({ it, file: path.relative(it.dir, f), prov });
    }
  }
  const deps = [...new Set(stamped.flatMap((s) => Object.keys(s.prov?.depends ?? {})))];
  const now = JSON.parse(
    execFileSync('npx', ['vite-node', path.join(DIR, '_lib/currentHashes.ts'), ...deps], {
      cwd: path.dirname(DIR),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    })
      .trim()
      .split('\n')
      .pop(),
  );
  let stale = 0;
  for (const it of chosen) {
    const mine = stamped.filter((s) => s.it === it);
    const lines = [];
    for (const { file, prov } of mine) {
      if (!prov?.simHash) {
        lines.push(`  unstamped  ${file}`);
        continue;
      }
      const why = [];
      if (prov.simHash !== now.simHash) why.push(`simHash ${prov.simHash} → ${now.simHash}`);
      for (const [p, h] of Object.entries(prov.depends ?? {})) if (now.depends[p] !== h) why.push(`${p} changed`);
      if (prov.dirty) why.push('(computed on a dirty tree)');
      const changed = why.some((w) => !w.startsWith('('));
      if (changed) stale++;
      lines.push(`  ${changed ? 'STALE' : 'ok   '}      ${file}${why.length ? ': ' + why.join('; ') : ''}`);
    }
    if (!mine.length && CLOSED.has(it.status)) lines.push('  no results files: findings cannot be checked');
    if (lines.length) console.log(`${it.id} (${it.status})\n${lines.join('\n')}`);
  }
  console.log(`current simHash ${now.simHash}; ${stamped.length} results files, ${stale} stale`);
  process.exit(stale ? 1 : 0);
}

const { pos, opt } = parseArgs(process.argv.slice(2));
const cmd = pos.shift();
if (cmd === 'new') cmdNew(pos, opt);
else if (cmd === 'claim') cmdClaim(pos, opt);
else if (cmd === 'release') cmdRelease(pos, opt);
else if (cmd === 'log') cmdLog(pos, opt);
else if (cmd === 'check') cmdCheck(pos);
else if (cmd !== undefined) die(`unknown command ${cmd}`);
writeIndex();
