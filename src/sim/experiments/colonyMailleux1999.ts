import { blockEstimate, combinedZ, fitZ, type Comparison } from '../analysis/compare';
import { RNG } from '../core/rng';
import { blesApparatus } from '../world/apparatus';
import type { World } from '../world/world';
import { ColonySim, type ColonyOptions, type ColonyParams, type ColonyStepInfo } from './colonyBles';
import { runScoutWorld } from './e2Mailleux';
import { fromX, toX, type FreeParam } from './e2Variants';

/**
 * Mailleux et al. 1999 (Actes Coll. Insectes Soc. 12:73–79; extraction in
 * docs/research/mailleux-rules.md §4): the first recruiter inside the nest
 * after a 3 µL drop of 0.6 M sucrose, at 1 / 4 / 8 days of starvation.
 * Calibration protocol: STATUS 2026-10-09 (approved). Table 2a is the fit
 * set; Table 2b and "all recruiters leave within 20 min" are development.
 *
 * Simulation: the Bles nest chamber (56 × 41 mm) stands in for the
 * unreported Janet-nest chamber, with nestmates at a nuisance density
 * (1999 only); after a warm-up the recruiter enters from the passage with
 * the crop load and feeding memory of an E2 scout (same parameters, 3 µL,
 * 0.6 M, the same starvation) and is followed until it leaves the nest or
 * 20 min have passed.
 */

export const M1999_DAYS = [1, 4, 8] as const;
export type M1999Day = (typeof M1999_DAYS)[number];

export type M1999Stat = 'timeInNest' | 'distance' | 'contacts' | 'trophTotal' | 'contactsBefore';

export interface M1999Target {
  id: string;
  stat: M1999Stat;
  day: M1999Day;
  label: string;
  mean: number;
  sd: number;
  n: number;
  role: 'fit' | 'development';
}

const T2A: Record<M1999Stat, { label: string; unit: string; rows: [number, number, number][] }> = {
  timeInNest: { label: 'Time in nest', unit: 's', rows: [[113, 57, 26], [80, 26, 25], [82, 43, 28]] },
  distance: { label: 'Distance in nest', unit: 'cm', rows: [[9.1, 8.2, 26], [5.9, 4.7, 23], [5.4, 6.4, 26]] },
  contacts: { label: 'Contacts', unit: '', rows: [[6.1, 4.8, 26], [3.3, 1.9, 25], [3.3, 3.2, 28]] },
  trophTotal: { label: 'Total trophallaxis', unit: 's', rows: [[57, 27, 26], [66, 27, 25], [56, 22, 28]] },
  contactsBefore: { label: 'Contacts before the main trophallaxis', unit: '', rows: [[3, 3, 27], [1, 1, 28], [1, 2, 28]] },
};

/** Table 2a: 15 fit rows (mean ± SD, n recruiters). */
export const M1999_TARGETS: M1999Target[] = (Object.keys(T2A) as M1999Stat[]).flatMap((stat) =>
  M1999_DAYS.map((day, k) => {
    const [mean, sd, n] = T2A[stat].rows[k];
    return { id: `${stat}.d${day}`, stat, day, label: `${T2A[stat].label}${T2A[stat].unit ? ` (${T2A[stat].unit})` : ''}, ${day} d`, mean, sd, n, role: 'fit' as const };
  }),
);

/** Table 2b (development; its n look copied from Table 1): P(a contacted nestmate leaves within 5 min). */
export const M1999_LEAVE: Record<M1999Day, { afterTroph: number; afterOther: number }> = {
  1: { afterTroph: 0.44, afterOther: 0.69 },
  4: { afterTroph: 0.56, afterOther: 0.89 },
  8: { afterTroph: 0.86, afterOther: 0.93 },
};

export interface M1999Options {
  seed: number;
  starvationDays: M1999Day;
  /** Nestmates per cm² of the chamber (1999-only nuisance). */
  density: number;
  /** Pipette accessible fraction of the E2 layer in use. */
  pipetteAccessible: number;
  /** Warm-up before the recruiter enters (s; default 600). */
  warmup?: number;
  /** Follow contacted nestmates for 5 min after the recruiter leaves (Table 2b; default false). */
  followNestmates?: boolean;
  /** Minimum duration (s) of an observed contact (default M1999_CONTACT_MIN; sensitivity runs only). */
  contactMin?: number;
  dt?: number;
}

export interface M1999Recruiter {
  /** Entry → leaving the nest (s); 1200 if it had not left after 20 min (`left` false). */
  timeInNest: number;
  left: boolean;
  /** Path length inside the nest (cm). */
  distance: number;
  /** Observed contacts: episodes of antennal contact with a nestmate lasting ≥ M1999_CONTACT_MIN. */
  contacts: number;
  trophTotal: number;
  /** Observed contacts (≥ M1999_CONTACT_MIN) that began before the longest bout, the main partner's own excluded; NaN without trophallaxis. */
  contactsBefore: number;
  cropAtEntry: number;
  cropAtExit: number;
  /** Table 2b (with `followNestmates`): contacted nestmates, and how many left the nest within 5 min of the contact. */
  troph: { n: number; left: number };
  other: { n: number; left: number };
}

const OBSERVE = 20 * 60;
const FOLLOW = 5 * 60;

/**
 * Observed contact (STATUS 2026-10-10, pre-registered observation model,
 * with disclosure): an episode of continuous antennal contact between the
 * recruiter and one nestmate lasting at least this long (s). Geometric
 * antennal-range overlaps last a median 0.1–0.2 s (nestmates brushing
 * past); the paper scored contacts on video. Used for both contact rows and
 * Table 2b's contacted nestmates; sensitivity 0.5 and 2 s.
 */
export const M1999_CONTACT_MIN = 1;

/** Crop load of an E2 scout that drank at the 1999 drop and reached the nest (first qualifying seed). */
export function recruiterLoad(P: ColonyParams, o: M1999Options): { cropUl: number; cropSugar: number; cropWater: number; ingested: number } {
  for (let attempt = 0; attempt < 100; attempt++) {
    const seed = RNG.stream(o.seed, 0x5c0, attempt).int(2 ** 31);
    const { result, world } = runScoutWorld(P, { seed, drop1: { ul: 3, molar: 0.6 }, pipetteAccessible: o.pipetteAccessible, starvationDays: o.starvationDays });
    const a = world.ants[0];
    if (result.reachedNest && a.mind.trip.ingested > 0) return { cropUl: a.body.cropUl, cropSugar: a.body.cropSugar, cropWater: a.body.cropWater, ingested: a.mind.trip.ingested };
  }
  throw new Error('recruiterLoad: no scout drank and returned in 100 attempts');
}

/** One recruiter (Mailleux 1999), observed as the paper defines its measures. */
/** Nestmates in the stand-in chamber at a density (per cm²). */
function nestmates(density: number): number {
  const { app } = blesApparatus();
  const nest = app.regions.find((r) => r.kind === 'nest')!;
  return Math.max(1, Math.round((density * (nest.x1 - nest.x0) * (nest.y1 - nest.y0)) / 100));
}

/** Colony options for a 1999 run (no food; long enough for the observation window). */
function colonyOptions(o: M1999Options, seed: number, n: number, enterAt: number): ColonyOptions {
  return { seed, ants: n, dt: o.dt, minutes: (enterAt + OBSERVE + (o.followNestmates ? FOLLOW : 0)) / 60 + 0.01, foodMinute: Infinity, starvationDays: o.starvationDays };
}

/**
 * Step `sim` (whose recruiter, ant `n`, enters at `enterAt`) to the end of
 * the observation and summarise the recruiter as the paper defines its
 * measures.
 */
function observeRecruiter(sim: ColonySim, n: number, enterAt: number, cropAtEntry: number, followNestmates: boolean, contactMin = M1999_CONTACT_MIN): M1999Recruiter {
  const r = n;
  let exitAt = NaN;
  // End of the step at which the observation ended (absolute time, as bout ends): bouts are clipped to it, so a
  // followed run measures the stay exactly as a run that stops there (the fit runs).
  let stopAt = NaN;
  let dist = 0;
  let px = NaN;
  let py = NaN;
  // Contact episodes with each nestmate during the stay (open ones by start time), then those lasting ≥ contactMin.
  const open = new Map<number, number>();
  const episodes: { id: number; start: number; end: number }[] = [];
  // Nestmates' exits from the nest (for Table 2b), relative to the recruiter's entry.
  const exits = new Map<number, number[]>();
  const wasOut = new Array<boolean>(n).fill(false);
  let cropAtExit = NaN;
  const onStep = (w: World, info: ColonyStepInfo): boolean => {
    const a = w.ants[r];
    const t = info.t - enterAt;
    for (let j = 0; j < n; j++) {
      if (info.outside[j] && !wasOut[j] && t >= 0) exits.set(j, [...(exits.get(j) ?? []), t]);
      wasOut[j] = info.outside[j];
    }
    if (!a) return false;
    if (Number.isNaN(exitAt)) {
      if (info.outside[r] || t >= OBSERVE) {
        exitAt = Math.min(t, OBSERVE);
        stopAt = info.t + sim.dt;
        cropAtExit = a.body.cropUl;
        for (const [id, start] of open) episodes.push({ id, start, end: exitAt });
        open.clear();
        if (!followNestmates) return true;
      } else {
        if (!Number.isNaN(px)) dist += Math.hypot(a.body.x - px, a.body.y - py);
        px = a.body.x;
        py = a.body.y;
        const now = new Set((info.per[r]?.contacts ?? []).map((c) => c.id));
        for (const id of now) if (!open.has(id)) open.set(id, t);
        for (const [id, start] of [...open])
          if (!now.has(id)) {
            episodes.push({ id, start, end: t });
            open.delete(id);
          }
      }
    }
    return t >= exitAt + FOLLOW;
  };
  while (sim.stepIndex < sim.steps) if (sim.step(onStep)) break;
  const observed = episodes.filter((e) => e.end - e.start >= contactMin - 1e-9).sort((p, q) => p.start - q.start || p.id - q.id);
  const bouts = sim
    .result()
    .bouts.filter((b) => b.donor === r || b.receiver === r)
    // Only the stay observed (a followed run continues after the exit; fit runs stop at it): bouts that start
    // before the exit, clipped at the stop (a bout spanning the 20-min censoring would otherwise keep growing).
    .map((b) => ({ ...b, start: b.start - enterAt, end: Math.min(b.end, stopAt) - enterAt }))
    .filter((b) => b.start < exitAt);
  const trophTotal = bouts.reduce((s, b) => s + (b.end - b.start), 0);
  let contactsBefore = NaN;
  if (bouts.length) {
    const main = bouts.reduce((p, q) => (q.end - q.start > p.end - p.start ? q : p));
    const partner = main.donor === r ? main.receiver : main.donor;
    const before = observed.filter((c) => c.start < main.start + 1e-9);
    const partnerOnset = before.filter((c) => c.id === partner).pop();
    contactsBefore = before.length - (partnerOnset ? 1 : 0);
  }
  const partners = new Set(bouts.map((b) => (b.donor === r ? b.receiver : b.donor)));
  const troph = { n: 0, left: 0 };
  const other = { n: 0, left: 0 };
  if (followNestmates) {
    // Table 2b: a contacted nestmate leaving the nest within 5 min of its first observed contact with the recruiter.
    const first = new Map<number, number>();
    for (const e of observed) if (!first.has(e.id)) first.set(e.id, e.start);
    for (const [id, t0] of first) {
      const g = partners.has(id) ? troph : other;
      g.n++;
      if ((exits.get(id) ?? []).some((x) => x >= t0 && x - t0 <= FOLLOW)) g.left++;
    }
  }
  const left = exitAt < OBSERVE;
  return { timeInNest: left ? exitAt : OBSERVE, left, distance: dist / 10, contacts: observed.length, trophTotal, contactsBefore, cropAtEntry, cropAtExit, troph, other };
}

/** One recruiter in its own freshly warmed nest (independent design). */
export function runRecruiter1999(P: ColonyParams, o: M1999Options): M1999Recruiter {
  const load = recruiterLoad(P, o);
  const n = nestmates(o.density);
  const enterAt = o.warmup ?? 600;
  const sim = new ColonySim(P, { ...colonyOptions(o, o.seed, n, enterAt), recruiter: { enterAt, ...load } });
  return observeRecruiter(sim, n, enterAt, load.cropUl, !!o.followNestmates, o.contactMin);
}

/** Recruiters [first, first + count) for one starvation day; recruiter k uses the stream (seed, day, k). */
export function runRecruiters1999(P: ColonyParams, o: Omit<M1999Options, 'seed'> & { seed: number }, first: number, count: number): M1999Recruiter[] {
  return Array.from({ length: count }, (_, i) => runRecruiter1999(P, { ...o, seed: RNG.stream(o.seed, o.starvationDays, first + i).int(2 ** 31) }));
}

/**
 * Shared-warm-up design (STATUS 2026-10-10): nest `nest` of one starvation
 * day is warmed once, then `perNest` copies each receive their own
 * recruiter (load and recruiter streams keyed by (nest, k)); every copy's
 * random streams are forked by k, so the copies continue independently
 * from the same warmed state. Recruiters are returned in k order; nests are
 * the units for standard errors.
 */
export function runNest1999(P: ColonyParams, o: M1999Options, nest: number, perNest: number): M1999Recruiter[] {
  const n = nestmates(o.density);
  const enterAt = o.warmup ?? 600;
  const warm = new ColonySim(P, colonyOptions(o, RNG.stream(o.seed, o.starvationDays, 0x2e57, nest).int(2 ** 31), n, enterAt));
  // Stop just before the step at which the recruiter enters (as in the independent design).
  while (warm.stepIndex * warm.dt < enterAt - 1e-9) warm.step();
  return Array.from({ length: perNest }, (_, k) => {
    const seed = RNG.stream(o.seed, o.starvationDays, 0x2e57, nest, k + 1).int(2 ** 31);
    const load = recruiterLoad(P, { ...o, seed });
    const sim = warm.clone(k + 1);
    sim.recruiter = { enterAt, ...load };
    sim.recruiterSeed = seed;
    return observeRecruiter(sim, n, enterAt, load.cropUl, !!o.followNestmates, o.contactMin);
  });
}

/** Nests [first, first + count) of one starvation day in the shared design, recruiters in nest then k order. */
export function runNests1999(P: ColonyParams, o: M1999Options, first: number, count: number, perNest: number): M1999Recruiter[] {
  return Array.from({ length: count }, (_, i) => runNest1999(P, o, first + i, perNest)).flat();
}

export interface M1999Row {
  target: M1999Target;
  comparison: Comparison;
  simSd: number;
}

/** Mean per fit row: fitZ (fitting) and combinedZ with SE_sim from `blocks` blocks of recruiters (judging). */
export function m1999Compare(sim: Record<M1999Day, M1999Recruiter[]>, blocks = 10): M1999Row[] {
  return M1999_TARGETS.map((t) => {
    const v = sim[t.day].map((x) => x[t.stat]);
    const per = Math.ceil(v.length / blocks);
    const est = blockEstimate(Array.from({ length: blocks }, (_, b) => v.slice(b * per, (b + 1) * per)));
    const seData = t.sd / Math.sqrt(t.n);
    return {
      target: t,
      simSd: est.sd,
      comparison: { id: t.id, label: t.label, kind: 'mean', data: t.mean, sim: est.mean, seData, seSim: est.se, z: combinedZ(est.mean, est.se, t.mean, seData) },
    };
  });
}

/**
 * Recruiters without a main bout (STATUS 2026-10-10, user decision): their
 * `contactsBefore` is NaN and drops out of that row, so the 15 rows alone
 * cannot see them. Table 2a's `contactsBefore` n (27/28/28) are at least the
 * other rows' n, consistent with every observed recruiter having a main
 * bout; 0 of 26 has the 95 % upper bound 1 − 0.05^(1/26) ≈ 11 %. Adequacy
 * requires each day's fraction at or below it; the fit adds the excess as a
 * hinge in binomial-SE units at that bound.
 */
export const M1999_NO_BOUT_N = 26;
export const M1999_NO_BOUT_MAX = 1 - 0.05 ** (1 / M1999_NO_BOUT_N);

/** Fraction of recruiters without any trophallaxis bout (no main bout). */
export function m1999NoBout(xs: M1999Recruiter[]): number {
  return xs.length ? xs.filter((x) => !(x.trophTotal > 0)).length / xs.length : NaN;
}

/** Fit penalty: Σ over days of (max(0, f − bound) / SE(bound))², SE from the bound and n 26. */
export function m1999NoBoutPenalty(sim: Record<M1999Day, M1999Recruiter[]>): number {
  const se = Math.sqrt((M1999_NO_BOUT_MAX * (1 - M1999_NO_BOUT_MAX)) / M1999_NO_BOUT_N);
  return M1999_DAYS.reduce((s, d) => s + (Math.max(0, m1999NoBout(sim[d]) - M1999_NO_BOUT_MAX) / se) ** 2, 0);
}

/** Penalty per fit row the simulation cannot estimate (as fitE2c's DEGENERATE: ranks such points below all that estimate every row). */
export const M1999_DEGENERATE = 1e7;

/**
 * The fit objective (STATUS 2026-10-10, debiased): Σ over the fit rows of
 * [(m − μ)² − Var(m)] / SE_data², i.e. fitZ² minus the sampling variance of
 * the simulated mean, so the objective's expectation is the squared bias
 * alone and noisier designs or parameter regions are not penalised (or
 * favoured) for their noise. Var(m) from blocks of `perNest` recruiters (a
 * nest in the shared design; 0 = independent recruiters). Plus
 * M1999_DEGENERATE per inestimable row and the no-bout penalty.
 */
export function m1999FitLoss(sim: Record<M1999Day, M1999Recruiter[]>, targets: M1999Target[] = M1999_TARGETS, perNest = 0): number {
  let l = 0;
  for (const t of targets) {
    const v = sim[t.day].map((x) => x[t.stat]);
    const k = Math.max(1, perNest);
    const est = blockEstimate(Array.from({ length: Math.ceil(v.length / k) }, (_, b) => v.slice(b * k, (b + 1) * k)));
    if (!Number.isFinite(est.mean)) {
      l += M1999_DEGENERATE;
      continue;
    }
    const seData = t.sd / Math.sqrt(t.n);
    l += fitZ(est.mean, t.mean, seData) ** 2 - (Number.isFinite(est.se) ? (est.se / seData) ** 2 : 0);
  }
  return l + m1999NoBoutPenalty(sim);
}

/** A 1999 calibration point: colony parameters and the 1999-only nestmate density. */
export interface M1999Model {
  P: ColonyParams;
  density: number;
}

type FreeM = FreeParam & { get: (m: M1999Model) => number; set: (m: M1999Model, v: number) => M1999Model };
const nestKey = (k: keyof ColonyParams['nest']): Pick<FreeM, 'get' | 'set'> => ({
  get: (m) => m.P.nest[k],
  set: (m, v) => ({ ...m, P: { ...m.P, nest: { ...m.P.nest, [k]: v } } }),
});

/** The free parameters of the 1999 calibration and their bounds (STATUS 2026-10-10, implementation details). */
export const M1999_FREE: FreeM[] = [
  { key: 'nest.nestSpeedFactor', tf: { lo: 0.02, hi: 1, log: true }, ...nestKey('nestSpeedFactor') },
  { key: 'nest.returnRate', tf: { lo: 1 / 1200, hi: 1, log: true }, ...nestKey('returnRate') },
  { key: 'nest.shareRate', tf: { lo: 0.002, hi: 0.1, log: true }, ...nestKey('shareRate') },
  { key: 'nest.shareEnd', tf: { lo: 1 / 1200, hi: 0.5, log: true }, ...nestKey('shareEnd') },
  { key: 'nest.receiveReserve', tf: { lo: 0.2, hi: 1 }, ...nestKey('receiveReserve') },
  // Between-nestmate reserve variation (STATUS 2026-10-10, user decision).
  { key: 'nest.reserveSd', tf: { lo: 0.05, hi: 2, log: true }, ...nestKey('reserveSd') },
  { key: 'density', tf: { lo: 0.25, hi: 6, log: true }, get: (m) => m.density, set: (m, v) => ({ ...m, density: v }) },
];
export const m1999Encode = (m: M1999Model): number[] => M1999_FREE.map((f) => toX(f.get(m), f.tf));
export const m1999Decode = (x: number[], P: ColonyParams): M1999Model => M1999_FREE.reduce((m, f, i) => f.set(m, fromX(x[i], f.tf)), { P, density: 1 } as M1999Model);
export const m1999Values = (m: M1999Model): Record<string, number> => Object.fromEntries(M1999_FREE.map((f) => [f.key, f.get(m)]));
export const m1999AtBound = (m: M1999Model): string[] =>
  M1999_FREE.filter((f) => {
    const tf = f.tf as { lo: number; hi: number; log?: boolean };
    const v = f.get(m);
    const u = tf.log ? Math.log(v / tf.lo) / Math.log(tf.hi / tf.lo) : (v - tf.lo) / (tf.hi - tf.lo);
    return u < 0.01 || u > 0.99;
  }).map((f) => f.key);
