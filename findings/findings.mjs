#!/usr/bin/env node
// Findings register: one file per empirical claim (Fnnn-slug.md, frontmatter +
// a short body). The files are the only source of truth; README.md is generated
// from them. Kept by the lead agent (CLAUDE.md); other agents report and never
// edit findings/. STATUS 2026-10-18 ≈ 16:18.
//
//   node findings/findings.mjs                     regenerate README.md
//   node findings/findings.mjs new "<claim>" --topic t --status s [--data d] [--evidence e]
//   node findings/findings.mjs list [--topic t] [--status s] [--grep text]
//   node findings/findings.mjs find '<Mongo-style JSON query>' [--sort [-]field] [--fields a,b] [--json]
//     e.g. find '{"topic":"packing","status":{"$in":["established","indicated"]}}' --sort -date
//     Matching by sift (MongoDB query semantics): $eq $ne $in $nin $gt $gte $lt $lte $regex ($options)
//     $exists $size $all $elemMatch $not; $and $or $nor. $where is refused (it runs code).
//     List fields (evidence, bears_on, related, supersedes, superseded_by, depends) are arrays: a plain
//     value matches if any element equals it ({"related":"F006"}). `body` is the text below the header.
//   node findings/findings.mjs supersede <old> <new>     mark old as replaced by new
//   node findings/findings.mjs check                     fields, references, stale results
//
// Fields (frontmatter, one line each):
//   title       the claim, one line (the index shows it)
//   topic       one of TOPICS
//   status      one of STATUSES (see LEGEND)
//   date        YYYY-MM-DD the finding was read or last revised
//   data        where it came from and that data's role (STATUS § Evidence policy)
//   evidence    "; "-separated: STATUS:<text of an entry header in docs/STATUS.md, docs/log/,
//               docs/contamination/ or
//               docs/archive/*.md>, a backlog id (B014), or a repository path
//   bears_on    "; "-separated free text: what it matters for
//   related, supersedes, superseded_by    ", "-separated finding ids
//   depends     ", "-separated stamped results (JSON with `provenance`); check flags
//               them when simulation code or their inputs have changed
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cell, die, findAndPrint, frontmatter, headerLines, parseArgs, setField, slugify } from '../scripts/records.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(DIR);
const FILE = /^F(\d{3})-[a-z0-9-]+\.md$/;
const TOPICS = [
  ['motion', 'In-nest motion (step 4)'],
  ['activity', 'Per-ant activity and persistence'],
  ['synchrony', 'Colony synchrony'],
  ['packing', 'Packing, walls and resting sites'],
  ['contacts', 'Contacts'],
  ['measurement', 'Measurement and observers'],
  ['light-dark', 'Light / dark'],
  ['trips', 'Forager trips'],
  ['colony-1999', 'Colony (Mailleux 1999, step 5)'],
  ['e2', 'E2 (drinking, trail laying)'],
  ['e1', 'E1 (walking)'],
  ['numerics', 'Numerics and tooling'],
];
const LEGEND = [
  ['established', 'a pre-registered reading, read mechanically against its rule'],
  ['indicated', 'descriptive, post hoc, exploratory or measured without a prior rule'],
  ['literature', 'reported by a cleared source; not tested here'],
  ['hypothesis', 'our reasoning; untested'],
  ['closed', 'a tested line with no further arms (a negative result)'],
  ['superseded', 'replaced by a later finding (superseded_by)'],
];
const STATUSES = LEGEND.map(([s]) => s);
const LIST = (s, sep) => (s ?? '').split(sep).map((x) => x.trim()).filter(Boolean);

function readFindings() {
  const out = [];
  const problems = [];
  for (const name of fs.readdirSync(DIR).sort()) {
    const m = name.match(FILE);
    if (!m) continue;
    const file = path.join(DIR, name);
    const fm = frontmatter(fs.readFileSync(file, 'utf8'));
    if (!fm) {
      problems.push(`${name}: no frontmatter`);
      continue;
    }
    const f = { ...fm.fields, body: fm.body, name, file };
    if (f.id !== `F${m[1]}`) problems.push(`${name}: id ${f.id} does not match the file name`);
    if (!f.title) problems.push(`${name}: no title`);
    if (!TOPICS.some(([t]) => t === f.topic)) problems.push(`${name}: unknown topic "${f.topic}"`);
    if (!STATUSES.includes(f.status)) problems.push(`${name}: unknown status "${f.status}"`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date ?? '')) problems.push(`${name}: date is not YYYY-MM-DD`);
    if (!LIST(f.evidence, ';').length) problems.push(`${name}: no evidence`);
    out.push(f);
  }
  const ids = new Map();
  for (const f of out) {
    if (ids.has(f.id)) problems.push(`duplicate id ${f.id}: ${ids.get(f.id)}, ${f.name}`);
    ids.set(f.id, f.name);
  }
  for (const f of out) {
    for (const key of ['related', 'supersedes', 'superseded_by'])
      for (const id of LIST(f[key], ',')) if (!ids.has(id)) problems.push(`${f.name}: ${key} ${id} does not exist`);
    if (f.status === 'superseded' && !LIST(f.superseded_by, ',').length) problems.push(`${f.name}: superseded without superseded_by`);
    if (f.status !== 'superseded' && LIST(f.superseded_by, ',').length) problems.push(`${f.name}: has superseded_by but status ${f.status}`);
    for (const id of LIST(f.supersedes, ',')) {
      const old = out.find((x) => x.id === id);
      if (old && !LIST(old.superseded_by, ',').includes(f.id)) problems.push(`${f.name}: supersedes ${id}, which does not name it in superseded_by`);
    }
  }
  return { findings: out, problems };
}

function renderIndex() {
  const { findings, problems } = readFindings();
  const live = findings.filter((f) => f.status !== 'superseded');
  const count = (s) => findings.filter((f) => f.status === s).length;
  const lines = [
    '<!-- Generated by `node findings/findings.mjs` from the F*.md files; do not edit. -->',
    '# Findings register',
    '',
    'One file per empirical claim; the files point to the evidence (STATUS entries, backlog items, results), they',
    'do not replace it. Kept by the lead agent; other agents report findings and never edit this folder.',
    'Query: `node findings/findings.mjs find \'{"topic":"packing","status":{"$in":["established","indicated"]}}\'`',
    '(MongoDB query syntax via sift; see the script header), or `list --topic t --status s --grep text`.',
    '',
    '| status | meaning | n |',
    '|---|---|---|',
    ...LEGEND.map(([s, d]) => `| ${s} | ${d} | ${count(s)} |`),
  ];
  for (const [topic, heading] of TOPICS) {
    const rows = live.filter((f) => f.topic === topic).sort((a, b) => a.id.localeCompare(b.id));
    if (!rows.length) continue;
    lines.push('', `## ${heading}`, '', '| id | status | finding | date |', '|---|---|---|---|');
    for (const f of rows) lines.push(`| [${f.id}](${f.name}) | ${f.status} | ${cell(f.title)} | ${f.date} |`);
  }
  const old = findings.filter((f) => f.status === 'superseded');
  if (old.length) {
    lines.push('', '## Superseded', '', '| id | finding | replaced by |', '|---|---|---|');
    for (const f of old) lines.push(`| [${f.id}](${f.name}) | ${cell(f.title)} | ${LIST(f.superseded_by, ',').join(', ')} |`);
  }
  if (problems.length) lines.push('', '## Problems', ...problems.map((p) => `- ${p}`));
  return { text: lines.join('\n') + '\n', problems, live: live.length, old: old.length };
}

function writeIndex() {
  const { text, problems, live, old } = renderIndex();
  fs.writeFileSync(path.join(DIR, 'README.md'), text);
  for (const p of problems) console.error(`problem: ${p}`);
  console.log(`README.md: ${live} live, ${old} superseded`);
}

function cmdNew(pos, opt) {
  const title = pos[0];
  if (!title || !opt.topic || !opt.status) die('usage: new "<claim>" --topic t --status s [--data d] [--evidence e]');
  if (!TOPICS.some(([t]) => t === opt.topic)) die(`unknown topic ${opt.topic}: ${TOPICS.map(([t]) => t).join(', ')}`);
  if (!STATUSES.includes(opt.status)) die(`unknown status ${opt.status}: ${STATUSES.join(', ')}`);
  const { findings } = readFindings();
  const n = Math.max(0, ...findings.map((f) => Number(f.id.slice(1)))) + 1;
  const id = `F${String(n).padStart(3, '0')}`;
  const cut = slugify(title);
  const file = path.join(DIR, `${id}-${cut}.md`);
  const fields = [
    ['id', id], ['title', title], ['topic', opt.topic], ['status', opt.status],
    ['date', new Date().toISOString().slice(0, 10)], ['data', opt.data ?? ''], ['evidence', opt.evidence ?? ''],
    ['bears_on', ''], ['related', ''], ['supersedes', ''], ['superseded_by', ''], ['depends', ''],
  ];
  fs.writeFileSync(file, `---\n${fields.map(([k, v]) => `${k}: ${v}`.trimEnd()).join('\n')}\n---\n<Two to six lines: the numbers, the caveats.>\n`, { flag: 'wx' });
  console.log(`created ${path.basename(file)}`);
}

function cmdList(opt) {
  const { findings } = readFindings();
  const g = opt.grep?.toLowerCase();
  const rows = findings.filter(
    (f) =>
      (!opt.topic || f.topic === opt.topic) &&
      (!opt.status || f.status === opt.status) &&
      (!g || `${f.title}\n${f.body}\n${f.bears_on ?? ''}`.toLowerCase().includes(g)),
  );
  for (const f of rows) console.log(`${f.id}  ${f.status.padEnd(11)} ${f.topic.padEnd(11)} ${f.title}`);
  console.log(`${rows.length} of ${findings.length}`);
}

// A finding as a document: list fields become arrays.
function asDoc(f) {
  const doc = { id: f.id, title: f.title, topic: f.topic, status: f.status, date: f.date, data: f.data ?? '' };
  doc.evidence = LIST(f.evidence, ';');
  doc.bears_on = LIST(f.bears_on, ';');
  for (const k of ['related', 'supersedes', 'superseded_by', 'depends']) doc[k] = LIST(f[k], ',');
  doc.body = f.body;
  doc.file = f.name;
  return doc;
}

function cmdFind(pos, opt) {
  const docs = readFindings().findings.map(asDoc);
  findAndPrint(docs, pos[0], opt, (d) => `${d.id}  ${d.status.padEnd(11)} ${d.topic.padEnd(11)} ${d.title}`);
}

function cmdSupersede(pos) {
  const { findings } = readFindings();
  const [oldId, newId] = pos;
  const old = findings.find((f) => f.id === oldId);
  const neu = findings.find((f) => f.id === newId);
  if (!old || !neu) die('usage: supersede <old id> <new id> (both must exist)');
  setField(old.file, 'status', 'superseded');
  setField(old.file, 'superseded_by', [...new Set([...LIST(old.superseded_by, ','), newId])].join(', '));
  setField(neu.file, 'supersedes', [...new Set([...LIST(neu.supersedes, ','), oldId])].join(', '));
  console.log(`${oldId} superseded by ${newId}`);
}

function cmdCheck() {
  const { findings, problems } = readFindings();
  const headers = headerLines(ROOT);
  const backlog = new Set(
    fs.readdirSync(path.join(ROOT, 'backlog')).map((n) => n.match(/^(B\d{3})-/)?.[1]).filter(Boolean),
  );
  for (const f of findings) {
    for (const ref of LIST(f.evidence, ';')) {
      if (ref.startsWith('STATUS:')) {
        const text = ref.slice('STATUS:'.length).trim();
        if (!headers.some((h) => h.includes(text))) problems.push(`${f.name}: no STATUS or archive entry header contains "${text}"`);
      } else if (/^B\d{3}$/.test(ref)) {
        if (!backlog.has(ref)) problems.push(`${f.name}: backlog item ${ref} does not exist`);
      } else if (!fs.existsSync(path.join(ROOT, ref))) problems.push(`${f.name}: evidence path ${ref} does not exist`);
    }
  }
  // Stamped results: same test as `backlog.mjs check`.
  const stamped = [];
  for (const f of findings)
    for (const rel of LIST(f.depends, ',')) {
      let prov;
      try {
        prov = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')).provenance;
      } catch {
        problems.push(`${f.name}: depends ${rel} is missing or not JSON`);
        continue;
      }
      if (!prov?.simHash) problems.push(`${f.name}: depends ${rel} has no provenance stamp`);
      else stamped.push({ f, rel, prov });
    }
  let stale = 0;
  if (stamped.length) {
    const deps = [...new Set(stamped.flatMap((s) => Object.keys(s.prov.depends ?? {})))];
    const now = JSON.parse(
      execFileSync('npx', ['vite-node', path.join(ROOT, 'backlog/_lib/currentHashes.ts'), ...deps], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'inherit'],
      })
        .trim()
        .split('\n')
        .pop(),
    );
    for (const { f, rel, prov } of stamped) {
      const why = [];
      if (prov.simHash !== now.simHash) why.push(`simHash ${prov.simHash} → ${now.simHash}`);
      for (const [p, h] of Object.entries(prov.depends ?? {})) if (now.depends[p] !== h) why.push(`${p} changed`);
      if (why.length) {
        stale++;
        console.log(`STALE ${f.id} ${rel}: ${why.join('; ')}`);
      }
    }
  }
  const idx = path.join(DIR, 'README.md');
  if (!fs.existsSync(idx) || fs.readFileSync(idx, 'utf8') !== renderIndex().text) problems.push('README.md is out of date: run `node findings/findings.mjs`');
  for (const p of problems) console.log(`problem: ${p}`);
  console.log(`${findings.length} findings; ${problems.length} problems; ${stamped.length} stamped results, ${stale} stale`);
  process.exit(problems.length || stale ? 1 : 0);
}

const { pos, opt } = parseArgs(process.argv.slice(2));
const cmd = pos.shift();
if (cmd === 'list') cmdList(opt);
else if (cmd === 'find') cmdFind(pos, opt);
else if (cmd === 'check') cmdCheck();
else {
  if (cmd === 'new') cmdNew(pos, opt);
  else if (cmd === 'supersede') cmdSupersede(pos);
  else if (cmd !== undefined) die(`unknown command ${cmd}`);
  writeIndex();
}
