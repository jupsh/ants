import type { RNG } from '../core/rng';
import { driveFactor } from '../mind/drive';
import type { Mind, Stay } from '../mind/mind';
import type { Interoception, SurfacePercept } from '../perception/types';
import { acceptsFood, hasFoodToGive, nestParamsOf, type NestAction, type NestParams } from './lasiusNestWorker';

/**
 * Lazy resting ants (backlog B014, DESIGN rev 2): the rest tick of the in-nest policy `lasiusNestWorker`, for the
 * colony runner's `lazyRest` switch. It repeats the policy's resting step exactly and hands every other step back
 * to it. In its own module so the policy's module is unchanged (with it in the same module, stepped runs fell
 * into a slow garbage-collection regime in some runs; B014 Progress, 2026-10-19).
 */

/**
 * What a resting ant's last full policy call saw that `restTick` cannot read itself (B014, DESIGN rev 2; from
 * `restRecord`): its predicates then, and the crowding from the stopped nestmates in contact (constant while the
 * contact set and the partners' signals are, which the runner guarantees before calling `restTick`).
 */
export interface LazyRest {
  carrying: boolean;
  hungry: boolean;
  /** `switchWithin`'s crowding factor, (1 + stopped nestmates in contact)^−restCrowdExp, by the same expression (unused when restCrowdExp is 0). */
  crowd: number;
}

/**
 * The record `restTick` needs after a full `lasiusNestWorker` call (same `per`, `io` and parameters) that left the
 * ant standing in rest in the nest; undefined otherwise (B014).
 */
export function restRecord(per: SurfacePercept, io: Interoception, m: Mind, p0: NestParams, act: NestAction): LazyRest | undefined {
  if (!act.stand || m.mode !== 'rest' || !per.inNest) return undefined;
  const p = nestParamsOf(p0, m.traits.forager);
  return { carrying: hasFoodToGive(io, p), hungry: acceptsFood(io, p), crowd: Math.pow(1 + per.contacts.filter((c) => !c.moving).length, -p.restCrowdExp) };
}

/**
 * One step of a resting ant without a percept (B014, DESIGN rev 2): exactly what `lasiusNestWorker` would do in
 * this step, provided the ant's contact set and its partners' signals are unchanged since the full call whose
 * record is `rec` (`restRecord`; the runner's precondition), and only on the branch where the ant goes on resting.
 * Returns false, with nothing changed (the random stream restored), whenever the full call could do anything else,
 * so the caller then makes the full call. `p` is the ant's own parameters (`nestParamsOf`).
 *
 * Phase A only reads (and draws, restoring on a bail), phase B commits in `decide`'s order with the same
 * operations: `+= dt` for every timer (accumulated sums, not products), the same encounter update, the same
 * walk-on expression and `need >= left` test as `switchWithin`, the same hazard draws from `rng`.
 */
export function restTick(io: Interoception, m: Mind, p: NestParams, rng: RNG, dt: number, rec: LazyRest): boolean {
  const stay = m.stay;
  if (m.mode !== 'rest' || io.mouthFlow !== 0) return false;
  // The predicates behind pick, returning and the signals.
  const carrying = hasFoodToGive(io, p);
  if (carrying !== rec.carrying || acceptsFood(io, p) !== rec.hungry) return false;
  // A former partner coming off its refractory period may become a partner (pick): the full call decides.
  const parted = stay.parted;
  for (let k = 0; k < parted.length; k++) if (!(parted[k].since + dt < p.partRefractory)) return false;
  // switchWithin would draw a new spell or this rest's depth.
  if (!(stay.spell > 0)) return false;
  const depth = p.restShape > 0 || p.restDeepFrac > 0;
  if (depth && Number.isNaN(stay.restMult)) return false;
  const base = p.restToActive * (m.traits.walkOnFactor ?? 1) * driveFactor(m, p.driveSd);
  const walkOn = !p.restCrowdExp ? base : base * rec.crowd;
  const rate = walkOn * (depth ? stay.restMult : 1);
  const need = rate > 0 ? stay.spell / rate : Infinity;
  if (!(need >= dt)) return false;
  // decide's order: the trip hazard, then (rest) the return hazard, each drawn only where decide draws it; the
  // stream is restored if either fires. switchWithin draws nothing on this branch.
  const sinceGive = stay.sinceGive + dt;
  const drawOut = p.outRate > 0;
  const drawRet = !((carrying && sinceGive < p.giveUpTime) || !(m.trip.ingested > 0));
  if (drawOut || drawRet) {
    const saved = rng.snapshot();
    if ((drawOut && rng.hazard(p.outRate, dt)) || (drawRet && rng.hazard(p.returnRate, dt))) {
      rng.restore(saved);
      return false;
    }
  }
  m.modeTime += dt;
  stay.sinceGive = sinceGive;
  for (let k = 0; k < parted.length; k++) parted[k].since = parted[k].since + dt;
  meetUnchanged(stay, p, dt);
  stay.spell -= rate * dt;
  return true;
}

/**
 * `meet` for an unchanged contact set. After any `meet`, an episode is in contact iff its `unseen` is 0 (in contact
 * it is set to 0; otherwise it grows by dt > 0; new episodes start at 0), so the contact test reads `unseen`; every
 * current contact already has an episode (those in contact are never dropped). Same operations, same order.
 */
function meetUnchanged(stay: Stay, p: NestParams, dt: number): void {
  const met = stay.met;
  let n = 0;
  for (let k = 0; k < met.length; k++) {
    const e = met[k];
    e.unseen = e.unseen === 0 ? 0 : e.unseen + dt;
    if (e.unseen - dt > p.encounterGap + 1e-9) continue;
    e.age += dt;
    met[n++] = e;
  }
  met.length = n;
  for (let k = 0; k < n; k++) {
    const e = met[k];
    if (!e.counted && e.unseen === 0 && e.age + dt >= p.encounterMin - 1e-9) e.counted = true;
  }
}

