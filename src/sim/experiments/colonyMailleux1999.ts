import { blockEstimate, combinedZ, fitZ, type Comparison } from '../analysis/compare';
import { RNG } from '../core/rng';
import { blesApparatus } from '../world/apparatus';
import { runColony, type ColonyParams } from './colonyBles';
import { runScoutWorld } from './e2Mailleux';

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
  dt?: number;
}

export interface M1999Recruiter {
  /** Entry → leaving the nest (s); 1200 if it had not left after 20 min (`left` false). */
  timeInNest: number;
  left: boolean;
  /** Path length inside the nest (cm). */
  distance: number;
  contacts: number;
  trophTotal: number;
  /** Contact onsets before the longest bout, the main partner's own onset excluded; NaN without trophallaxis. */
  contactsBefore: number;
  cropAtEntry: number;
  cropAtExit: number;
  /** Table 2b (with `followNestmates`): contacted nestmates, and how many left the nest within 5 min of the contact. */
  troph: { n: number; left: number };
  other: { n: number; left: number };
}

const OBSERVE = 20 * 60;
const FOLLOW = 5 * 60;

/** Crop load of an E2 scout that drank at the 1999 drop and reached the nest (first qualifying seed). */
export function recruiterLoad(P: ColonyParams, o: M1999Options): { cropUl: number; cropSugar: number; cropWater: number; ingested: number } {
  for (let attempt = 0; attempt < 100; attempt++) {
    const seed = RNG.stream(o.seed, 0x5c0, attempt).int(2 ** 31);
    const { result, world } = runScoutWorld(P, { seed, drop1: { ul: 3, molar: 0.6 }, pipetteAccessible: o.pipetteAccessible, starvationDays: o.starvationDays });
    const a = world.ants[0];
    if (result.reachedNest && a.mind.ingested > 0) return { cropUl: a.body.cropUl, cropSugar: a.body.cropSugar, cropWater: a.body.cropWater, ingested: a.mind.ingested };
  }
  throw new Error('recruiterLoad: no scout drank and returned in 100 attempts');
}

/** One recruiter (Mailleux 1999), observed as the paper defines its measures. */
export function runRecruiter1999(P: ColonyParams, o: M1999Options): M1999Recruiter {
  const load = recruiterLoad(P, o);
  const { app } = blesApparatus();
  const nest = app.regions.find((r) => r.kind === 'nest')!;
  const areaCm2 = ((nest.x1 - nest.x0) * (nest.y1 - nest.y0)) / 100;
  const n = Math.max(1, Math.round(o.density * areaCm2));
  const enterAt = o.warmup ?? 600;
  const r = n;
  let exitAt = NaN;
  let dist = 0;
  let px = NaN;
  let py = NaN;
  let prev = new Set<number>();
  const onsets: { t: number; id: number }[] = [];
  const firstContact = new Map<number, number>();
  const wasOut = new Array<boolean>(n).fill(false);
  const leftAfterContact = new Set<number>();
  let cropAtExit = NaN;
  const res = runColony(
    P,
    { seed: o.seed, ants: n, dt: o.dt, minutes: (enterAt + OBSERVE + (o.followNestmates ? FOLLOW : 0)) / 60 + 0.01, foodMinute: Infinity, starvationDays: o.starvationDays, recruiter: { enterAt, ...load } },
    (w, info) => {
      const a = w.ants[r];
      const t = info.t - enterAt;
      // Table 2b: a contacted nestmate leaving the nest within 5 min of its first contact with the recruiter.
      for (let j = 0; j < n; j++) {
        if (info.outside[j] && !wasOut[j]) {
          const t0 = firstContact.get(j);
          if (t0 !== undefined && t - t0 <= FOLLOW) leftAfterContact.add(j);
        }
        wasOut[j] = info.outside[j];
      }
      if (!a) return false;
      if (Number.isNaN(exitAt)) {
        if (info.outside[r] || t >= OBSERVE) {
          exitAt = Math.min(t, OBSERVE);
          cropAtExit = a.body.cropUl;
          if (!o.followNestmates) return true;
        } else {
          if (!Number.isNaN(px)) dist += Math.hypot(a.body.x - px, a.body.y - py);
          px = a.body.x;
          py = a.body.y;
          const now = new Set((info.per[r]?.contacts ?? []).map((c) => c.id));
          for (const id of now)
            if (!prev.has(id)) {
              onsets.push({ t, id });
              if (!firstContact.has(id)) firstContact.set(id, t);
            }
          prev = now;
        }
      }
      return t >= exitAt + FOLLOW;
    },
  );
  const bouts = res.bouts.filter((b) => b.donor === r || b.receiver === r).map((b) => ({ ...b, start: b.start - enterAt, end: b.end - enterAt }));
  const trophTotal = bouts.reduce((s, b) => s + (b.end - b.start), 0);
  let contactsBefore = NaN;
  if (bouts.length) {
    const main = bouts.reduce((p, q) => (q.end - q.start > p.end - p.start ? q : p));
    const partner = main.donor === r ? main.receiver : main.donor;
    const before = onsets.filter((c) => c.t < main.start + 1e-9);
    const partnerOnset = before.filter((c) => c.id === partner).pop();
    contactsBefore = before.length - (partnerOnset ? 1 : 0);
  }
  const partners = new Set(bouts.map((b) => (b.donor === r ? b.receiver : b.donor)));
  const troph = { n: 0, left: 0 };
  const other = { n: 0, left: 0 };
  if (o.followNestmates)
    for (const id of firstContact.keys()) {
      const g = partners.has(id) ? troph : other;
      g.n++;
      if (leftAfterContact.has(id)) g.left++;
    }
  const left = exitAt < OBSERVE;
  return { timeInNest: left ? exitAt : OBSERVE, left, distance: dist / 10, contacts: onsets.length, trophTotal, contactsBefore, cropAtEntry: load.cropUl, cropAtExit, troph, other };
}

/** Recruiters [first, first + count) for one starvation day; recruiter k uses the stream (seed, day, k). */
export function runRecruiters1999(P: ColonyParams, o: Omit<M1999Options, 'seed'> & { seed: number }, first: number, count: number): M1999Recruiter[] {
  return Array.from({ length: count }, (_, i) => runRecruiter1999(P, { ...o, seed: RNG.stream(o.seed, o.starvationDays, first + i).int(2 ** 31) }));
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

/** Penalty per fit row the simulation cannot estimate (as fitE2c's DEGENERATE: ranks such points below all that estimate every row). */
export const M1999_DEGENERATE = 1e7;

/** Σ fitZ² over the fit rows (SE_data only; the fit objective), plus M1999_DEGENERATE per inestimable row. */
export function m1999FitLoss(sim: Record<M1999Day, M1999Recruiter[]>, targets: M1999Target[] = M1999_TARGETS): number {
  let l = 0;
  for (const t of targets) {
    const v = sim[t.day].map((x) => x[t.stat]).filter(Number.isFinite);
    if (!v.length) {
      l += M1999_DEGENERATE;
      continue;
    }
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    l += fitZ(m, t.mean, t.sd / Math.sqrt(t.n)) ** 2;
  }
  return l;
}
