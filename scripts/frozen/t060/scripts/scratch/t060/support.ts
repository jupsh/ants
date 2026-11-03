// Scratch (not committed): T060 Stage 0, the restricted support reader and the support audit (D266, the user's answer to
// Q37; the lead's details in D243's dated block of 2026-11-03 ≈ 15:18 UTC, which governs). Only support is read: whether
// enough histories are complete to support the comparison, and why not. The result is "support retained by the frozen
// extraction" (P178): spurious accepted onsets can split intervals (D265 rule 3), so these counts are not the true numbers
// of biological intervals or triplets, and neither a pass nor a failure says anything about contact resetting as a
// biological mechanism. Histories made unknown stay unknown (P153): counting them does not make them complete.
//
//   npx vite-node scripts/scratch/t060/support.ts --colony i --out <dir>
//       The extraction pass for colony i, as extract.ts's main without --repro (colonyList, ExtractPass, streamColony,
//       finish), with no event table written: the five tables go in memory to the support reader, and only
//       <dir>/support-c<i>.json is written. Prints one line with no count in it.
//   npx vite-node scripts/scratch/t060/support.ts --pool --in <dir> --out <file>
//       Reads the 22 support-c<i>.json, writes the pooled result and prints only the pooled lines: the primary's two
//       counts and verdict, each sensitivity's two counts (no verdict), and the colony-237 flag.
//   `--out` and `--in` are required (no default).
//
// What the reader may not compute or output (15:18 block): any frame number or time, interval or bout length, A, B, I1,
// quintile cut, rate, shape, CV or bootstrap, and nothing of 0b's fit, its reference, its mean shape or a 0b label. It
// uses from reader.ts only the triplets (`buildTriplets`), the matching (`matchColony`: only the number of matched
// contact triplets, the number left without context and the ants supplying them leave the call; the quintile cuts stay
// inside) and `fitInputOf` (only `supplyingAnts` and `uncensored` are read), with the support constants. The 0b entry rule
// is the reader's: supplyingAnts >= MIN_ANTS_0B and uncensored >= MIN_UNCENSORED_0B, on the primary censoring mode and the
// ants supplying the matched contact triplets. Its counts equal the Stage 0 reader's (reader.ts lines 532–600) on the same
// tables (t060.support.test.ts; logs/t060-support-check/).
//
// Colony 237 (P181): tag 52 is kept conservative (a partner, unseen unless read; nothing changes for it); the pooled
// output flags it separately.
import { ARGV } from './argvGuard';
import fs from 'node:fs';
import { context } from '../../frozen/h6/scripts/scratch/h6-next/reader';
import { CAUSES, validateColony, type ColonyEvents, type Interval, type Role } from './events';
import { buildTriplets, fitInputOf, matchColony, MIN_ANTS_0B, MIN_COLONIES, MIN_MATCHED, MIN_UNCENSORED_0B, type Kind } from './reader';
import type { Variant } from './extract';

export const SUPPORT_VARIANTS = ['primary', 'v10', 'bridge', 'plain', 'nodeath'] as const satisfies readonly Variant[];
export const SENSITIVITIES = ['v10', 'bridge', 'plain', 'nodeath'] as const;
export const N_COLONIES = 22;
export const COLONY_237 = 'colony237';
/** The verdict's key and wording (P178). */
export const VERDICT_KEY = 'support retained by the frozen extraction';
const ROLES: Role[] = ['nurse', 'forager'];
const ZONES = ['L', 'H', 'U'];
const STATUSES = ['complete', 'noOnset', ...CAUSES] as const;

// Copied from reader.ts line 62 (not exported there): H6's zone 0 = L, 1 = H, null = unassigned (U).
const zoneName = (z: number | null): string => (z === null ? 'U' : z === 0 ? 'L' : z === 1 ? 'H' : `Z${z}`);
// Copied from reader.ts line 65 (not exported there): an onset on frame lightEnd (18:00) or later is not observed in the
// light phase.
const observedOnset = (c: ColonyEvents, v: Interval): boolean => v.onset !== null && v.onset < c.lightEnd;

// ------------------------------------------------------------------------------------------------------------- output
export interface Split { n: number; byRole: Record<string, number>; byZone: Record<string, number> }
export interface VariantSupport {
  /** Inactive intervals whose first still frame is in [lightStart, lightEnd), as the Stage 0 reader counts them. */
  intervals: { light: Split; withObservedOnset: Split; noUnknownFrame: Split; complete: Split };
  /** Light intervals made unknown, by cause, overall and by role. */
  unknown: { byCause: Record<string, number>; byRole: Record<string, Record<string, number>> };
  /** Bouts after a light interval with an observed onset (the reader's `afterLightIntervals`). */
  bouts: { n: number; complete: number; incompleteByCause: Record<string, number> };
  triplets: {
    contact: number; reference: number; matchedContact: number; contactNoContext: number; counts0a: boolean;
    /** Candidates with a contact or reference pattern of observed events, by status (complete = a triplet). */
    candidates: Record<Kind, Record<string, number>>;
  };
  entry0b: { supplyingAnts: number; uncensored: number; enters: boolean };
  /** From the table's own `extraction` field (null where the table has none, e.g. Scope A's). */
  extraction: {
    unknownOnlyByUnseenTags: number | null;
    unknownOnlyByUnseenTagsWithoutDeathRecord?: number | null;
    tags: { list: number | null; unseenInLightPhase: number | null };
    retaggedPartners?: { tag: number; lightReads: number }[] | null;
  };
}
export type ColonySupport = { label: string; colony: number } & Record<Variant, VariantSupport>;

const zeros = (keys: readonly string[]): Record<string, number> => Object.fromEntries(keys.map((k) => [k, 0]));
const split = (): Split => ({ n: 0, byRole: zeros(ROLES), byZone: zeros(ZONES) });
const addTo = (s: Split, role: string, zone: string): void => { s.n++; s.byRole[role] = (s.byRole[role] ?? 0) + 1; s.byZone[zone] = (s.byZone[zone] ?? 0) + 1; };
const num = (x: unknown): number | null => (typeof x === 'number' && Number.isFinite(x) ? x : null);

/** The support counts of one variant's event table; `colony` is the colony's index (the matching stream's key, as the
 * Stage 0 reader's position in its list) and `keys` the stream keys (none for real data). */
export function supportOfVariant(c: ColonyEvents, colony: number, keys: number[], primary: boolean): VariantSupport {
  validateColony(c);
  // ---- triplets and matching (reader.ts lines 536–542)
  const { triplets, candidates } = buildTriplets(c, context(c.bins));
  let matchedContact = 0, contactNoContext = 0;
  const supply = new Map<number, number>();
  {
    const m = matchColony(triplets, keys, colony);
    matchedContact = m.matches.size;
    contactNoContext = m.noContext;
    for (const k of m.matches.keys()) supply.set(triplets[k].ant, (supply.get(triplets[k].ant) ?? 0) + 1);
  }
  const contact = triplets.filter((t) => t.kind === 'contact').length;
  const reference = triplets.length - contact;
  const cand = (k: Kind): Record<string, number> => {
    const o = zeros(STATUSES);
    for (const [s, n] of Object.entries(candidates[k])) o[s] = (o[s] ?? 0) + n;
    return o;
  };
  // ---- 0b's entry (reader.ts line 355, the entry rule; lines 605–607, the primary fit's input on the contact ants)
  const inp = fitInputOf(c, supply, 'primary');
  const entry0b = { supplyingAnts: inp.supplyingAnts, uncensored: inp.uncensored, enters: inp.supplyingAnts >= MIN_ANTS_0B && inp.uncensored >= MIN_UNCENSORED_0B };
  // ---- intervals, unknowns and bouts (reader.ts lines 548–562)
  const iv = { light: split(), withObservedOnset: split(), noUnknownFrame: split(), complete: split() };
  const unknown = { byCause: zeros(CAUSES), byRole: Object.fromEntries(ROLES.map((r) => [r, zeros(CAUSES)])) as Record<string, Record<string, number>> };
  const bouts = { n: 0, complete: 0, incompleteByCause: zeros(CAUSES) };
  for (const a of c.ants) {
    a.intervals.forEach((v, j) => {
      if (v.start < c.lightStart || v.start >= c.lightEnd) return;
      const z = zoneName(v.zone), onset = observedOnset(c, v);
      addTo(iv.light, a.role, z);
      if (onset) addTo(iv.withObservedOnset, a.role, z);
      if (v.unknownFrame === null) addTo(iv.noUnknownFrame, a.role, z);
      if (v.unknownFrame === null && onset) addTo(iv.complete, a.role, z);
      if (v.unknownFrame !== null) {
        const k = v.cause!;
        unknown.byCause[k] = (unknown.byCause[k] ?? 0) + 1;
        const r = (unknown.byRole[a.role] ??= zeros(CAUSES));
        r[k] = (r[k] ?? 0) + 1;
      }
      if (j < a.bouts.length && onset) {
        bouts.n++;
        if (a.bouts[j].complete) bouts.complete++;
        else { const k = a.bouts[j].cause!; bouts.incompleteByCause[k] = (bouts.incompleteByCause[k] ?? 0) + 1; }
      }
    });
  }
  // ---- the extraction's own counts (whitelisted fields only)
  const x = (c.extraction ?? null) as Record<string, unknown> | null;
  const tags = (x?.tags ?? null) as Record<string, unknown> | null;
  const extraction: VariantSupport['extraction'] = {
    unknownOnlyByUnseenTags: num(x?.unknownOnlyByUnseenTags),
    tags: { list: num(tags?.list), unseenInLightPhase: num(tags?.unseenInLightPhase) },
  };
  if (primary) {
    extraction.unknownOnlyByUnseenTagsWithoutDeathRecord = num(x?.unknownOnlyByUnseenTagsWithoutDeathRecord);
    const rp = x?.retaggedPartners;
    extraction.retaggedPartners = Array.isArray(rp) ? rp.map((p: { tag: unknown; lightReads: unknown }) => ({ tag: Number(p.tag), lightReads: Number(p.lightReads) })) : null;
  }
  return {
    intervals: iv,
    unknown,
    bouts,
    triplets: { contact, reference, matchedContact, contactNoContext, counts0a: matchedContact >= MIN_MATCHED, candidates: { contact: cand('contact'), reference: cand('reference') } },
    entry0b,
    extraction,
  };
}

/** One colony's support counts from its five event tables (primary and sensitivities). */
export function supportOfColony(tables: Record<Variant, ColonyEvents>, colony: number, keys: number[] = []): ColonySupport {
  const label = tables.primary.label;
  for (const v of SUPPORT_VARIANTS) if (tables[v].label !== label) throw new Error(`support: the ${v} table's label differs from the primary's`);
  const out = { label, colony } as ColonySupport;
  for (const v of SUPPORT_VARIANTS) out[v] = supportOfVariant(tables[v], colony, keys, v === 'primary');
  return out;
}

// ------------------------------------------------------------------------------------------------------------ pooling
/** Per-colony sums of a variant's counts, in the shape of `VariantSupport` without its booleans (counted instead as
 * colonies) and without the retagged partners (colony 237's flag); a field missing (null) in any colony sums to null. */
function sumCounts(xs: unknown[]): unknown {
  const first = xs[0];
  if (typeof first === 'number' || first === null) return xs.some((x) => x === null) ? null : (xs as number[]).reduce((s, x) => s + x, 0);
  const keys: string[] = [];
  for (const x of xs) for (const k of Object.keys(x as object)) if (!keys.includes(k)) keys.push(k);
  const o: Record<string, unknown> = {};
  for (const k of keys) {
    if (k === 'retaggedPartners') continue;
    const vs = xs.map((x) => (x as Record<string, unknown>)[k]);
    if (vs.some((v) => typeof v === 'boolean' || Array.isArray(v))) continue;
    o[k] = sumCounts(vs.map((v) => (v === undefined ? 0 : v)));
  }
  return o;
}

export interface PooledVariant { coloniesCounting0a: number; coloniesEntering0b: number; sums: unknown }
export interface Pooled {
  colonies: number;
  primary: PooledVariant & { [VERDICT_KEY]: 'passes' | 'fails'; parts: { '0a': 'passes' | 'fails'; '0bEntry': 'passes' | 'fails' } };
  sensitivities: Record<(typeof SENSITIVITIES)[number], PooledVariant>;
  colony237: {
    label: string; colony: number;
    retaggedPartners: { tag: number; lightReads: number }[] | null;
    unknownOnlyByUnseenTags: number | null; unknownOnlyByUnseenTagsWithoutDeathRecord: number | null;
    counts0a: boolean; enters: boolean; pivotal0a: boolean; pivotal0b: boolean;
  };
}

const pooledVariant = (cols: ColonySupport[], v: Variant): PooledVariant => ({
  coloniesCounting0a: cols.filter((c) => c[v].triplets.counts0a).length,
  coloniesEntering0b: cols.filter((c) => c[v].entry0b.enters).length,
  sums: sumCounts(cols.map((c) => c[v])),
});

/** Pools the colonies' support counts. The verdict is the primary's only: support passes only if at least MIN_COLONIES
 * colonies count for 0a and at least MIN_COLONIES enter 0b (P161). Throws if no colony is labelled colony237. */
export function poolSupport(cols: ColonySupport[]): Pooled {
  const c237 = cols.find((c) => c.label === COLONY_237);
  if (!c237) throw new Error(`no colony has the label ${COLONY_237}: stopped, nothing pooled`);
  const p = pooledVariant(cols, 'primary');
  const pass0a = p.coloniesCounting0a >= MIN_COLONIES, pass0b = p.coloniesEntering0b >= MIN_COLONIES;
  const word = (b: boolean): 'passes' | 'fails' => (b ? 'passes' : 'fails');
  const others = cols.filter((c) => c !== c237);
  const pr = c237.primary;
  return {
    colonies: cols.length,
    primary: { coloniesCounting0a: p.coloniesCounting0a, coloniesEntering0b: p.coloniesEntering0b, [VERDICT_KEY]: word(pass0a && pass0b), parts: { '0a': word(pass0a), '0bEntry': word(pass0b) }, sums: p.sums },
    sensitivities: Object.fromEntries(SENSITIVITIES.map((v) => [v, pooledVariant(cols, v)])) as Pooled['sensitivities'],
    colony237: {
      label: c237.label,
      colony: c237.colony,
      retaggedPartners: pr.extraction.retaggedPartners ?? null,
      unknownOnlyByUnseenTags: pr.extraction.unknownOnlyByUnseenTags,
      unknownOnlyByUnseenTagsWithoutDeathRecord: pr.extraction.unknownOnlyByUnseenTagsWithoutDeathRecord ?? null,
      counts0a: pr.triplets.counts0a,
      enters: pr.entry0b.enters,
      // pivotal: the other colonies' count is exactly one short of MIN_COLONIES while colony 237 does not count (enter),
      // so the count would reach MIN_COLONIES if colony 237 alone were counted as passing it (15:18 block)
      pivotal0a: !pr.triplets.counts0a && others.filter((c) => c.primary.triplets.counts0a).length === MIN_COLONIES - 1,
      pivotal0b: !pr.entry0b.enters && others.filter((c) => c.primary.entry0b.enters).length === MIN_COLONIES - 1,
    },
  };
}

/** The lines the pool CLI prints (the only console output from pooled real data). */
export function pooledLines(r: Pooled): string[] {
  const yn = (b: boolean) => (b ? 'yes' : 'no');
  const counts = (x: PooledVariant) => `0a: ${x.coloniesCounting0a}/${r.colonies} colonies counting; 0b entry: ${x.coloniesEntering0b}/${r.colonies} colonies entering`;
  const c = r.colony237;
  const rp = c.retaggedPartners === null ? 'none recorded' : c.retaggedPartners.length ? c.retaggedPartners.map((p) => `tag ${p.tag}: ${p.lightReads} light-phase reads`).join(', ') : 'none';
  return [
    `primary: ${counts(r.primary)}; ${VERDICT_KEY}: ${r.primary[VERDICT_KEY]} (0a ${r.primary.parts['0a']}, 0b entry ${r.primary.parts['0bEntry']})`,
    ...SENSITIVITIES.map((v) => `sensitivity ${v} (counts only): ${counts(r.sensitivities[v])}`),
    `${c.label} flag (tag 52 kept conservative, nothing changed for it): retagged partners ${rp}; intervals unknown only by unseen tags ${c.unknownOnlyByUnseenTags} (without the death record ${c.unknownOnlyByUnseenTagsWithoutDeathRecord}); counts for 0a ${yn(c.counts0a)}, enters 0b ${yn(c.enters)}; pivotal for 0a ${yn(c.pivotal0a)}, for 0b entry ${yn(c.pivotal0b)}`,
  ];
}

// ------------------------------------------------------------------------------------------------------------------ CLI
const argOf = (name: string): string | null => { const i = ARGV.indexOf(name); return i >= 0 && i + 1 < ARGV.length ? ARGV[i + 1] : null; };

async function auditColony(): Promise<void> {
  const ci = Number(argOf('--colony'));
  const out = argOf('--out');
  if (!out) throw new Error('support.ts: --out <dir> is required (no default)');
  const dir = out.replace(/\/$/, '');
  // extract.ts runs its own main when argv holds --colony unless T060_SUPPORT_AUDIT is set: set it, then import it
  process.env.T060_SUPPORT_AUDIT = '1';
  const X = await import('./extract');
  if (!Number.isInteger(ci) || ci < 0 || ci >= N_COLONIES) throw new Error('support.ts: --colony must be 0 ... 21');
  const { colonies, streamColony } = await import('../../frozen/h6/scripts/stroeymeytTracks');
  const col = colonies()[ci];
  const t0 = Date.now();
  let support: ColonySupport;
  try {
    const list = await X.colonyList(ci);
    const index = new Map(list.tags.map((t, i) => [t.tag, i]));
    const pass = new X.ExtractPass(list);
    await streamColony(col, index, (f, t, ids, xs, ys, ins) => pass.frame(f, t, ids, xs, ys, ins));
    support = supportOfColony(pass.finish().tables, ci, []);
  } catch (e) {
    // a message could name an ant, an interval or a frame of a real event table: withheld
    console.error(`${col.label}: the support audit failed (${(e as Error).message.startsWith('event table') ? 'validation' : 'error'}; details withheld)`);
    process.exit(1);
  }
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/support-c${ci}.json`, JSON.stringify(support, null, 1));
  console.log(`${col.label}: support counts written (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}

function pool(): void {
  const dir = argOf('--in'), out = argOf('--out');
  if (!dir || !out) throw new Error('support.ts --pool: --in <dir> and --out <file> are required (no default)');
  const cols = Array.from({ length: N_COLONIES }, (_, i) => {
    const c = JSON.parse(fs.readFileSync(`${dir.replace(/\/$/, '')}/support-c${i}.json`, 'utf8')) as ColonySupport;
    if (c.colony !== i) throw new Error(`support-c${i}.json holds colony ${c.colony}`);
    return c;
  });
  const r = poolSupport(cols);
  if (out.includes('/')) fs.mkdirSync(out.replace(/\/[^/]*$/, ''), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(r, null, 1));
  for (const l of pooledLines(r)) console.log(l);
}

async function main(): Promise<void> {
  const audit = ARGV.includes('--colony'), pooling = ARGV.includes('--pool');
  if (audit === pooling) throw new Error('support.ts: either --colony i --out <dir> or --pool --in <dir> --out <file>');
  if (audit) await auditColony();
  else pool();
}

if (!process.env.VITEST && (ARGV.includes('--colony') || ARGV.includes('--pool'))) await main().catch((e) => { console.error((e as Error).message); process.exit(1); });
