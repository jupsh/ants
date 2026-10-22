import { lasiusForager, startTrip, type ForagerAction } from '../behavior/lasiusForager';
import { restRecord, restTick, type LazyRest } from '../behavior/lasiusNestRest';
import { enterNest, lasiusNestWorker, nestParamsOf, type NestAction, type NestParams } from '../behavior/lasiusNestWorker';
import { deepClone } from '../core/clone';
import { RNG } from '../core/rng';
import { stepDrive } from '../mind/drive';
import { newTrip } from '../mind/mind';
import { contactPercepts, interoceptInto, updateAdjacency } from '../perception/lazyPerception';
import { interocept, perceive, perceiveResting } from '../perception/perceive';
import type { Interoception, SurfacePercept } from '../perception/types';
import { applyForagerAction, metabolise, walkAnt } from '../physics/antPhysics';
import { alignFaceToFace, mouthContact } from '../physics/contacts';
import { shareCrop } from '../physics/trophallaxis';
import { SugarDroplet } from '../world/food';
import type { Agent, World } from '../world/world';
import { ColonySim, frame, type ColonyOptions, type ColonyParams, type ColonyStepInfo } from './colonyBles';

/**
 * A colony run with lazy resting ants (`ColonyOptions.lazyRest`; backlog B014, DESIGN rev 2): bit-identical to
 * `ColonySim`, faster where most in-nest ants rest. In its own module, as a subclass, so the stepped runner's code
 * is unchanged (B014 Progress, 2026-10-19: code added to the stepped modules, even uncalled, put stepped runs into
 * a slow garbage-collection regime in some runs).
 */
export class LazyColonySim extends ColonySim {
  /**
   * Per ant, the record and action of its last full policy call (null: none, or not resting), and each body's
   * signals at the last sensing; the nest parameters per role (`nestParamsOf`, nurse then forager; P.nest is not
   * changed during such a run); a reused interoception. Plain data, so `clone` copies them.
   */
  private readonly lazyRec: (LazyRest | null)[] = [];
  private readonly lazyAct: (NestAction | null)[] = [];
  private readonly sigPrev: number[] = [];
  private readonly sharePrev: number[] = [];
  private readonly lazyP: [NestParams, NestParams];
  private readonly lazyIo = {} as Interoception;

  constructor(P: ColonyParams, o: ColonyOptions) {
    super(P, o);
    if (!o.lazyRest) throw new Error('LazyColonySim needs the lazyRest option');
    if (o.fastPath === false || o.oracle || o.aggregate || o.site || o.taxis || o.slowEp) throw new Error('lazyRest needs the fast path and none of oracle, aggregate, site, taxis, slowEp');
    this.lazyP = [P.nest, nestParamsOf(P.nest, true)];
  }

  /**
   * `ColonySim.step` with lazy resting ants: the same sequence, except that sensing keeps the contact pairs without
   * building every percept, and resting ants with a record and no change are advanced by the policy's `restTick`.
   * The branches of the diagnostics it refuses (oracle, aggregate, site, taxis, slowEp) are left out. A change to
   * `ColonySim.step` must be mirrored here: the lazyRest tests compare the two bit for bit.
   */
  override step(onStep?: (w: World, info: ColonyStepInfo) => boolean | void): boolean {
    const { P, w, dt, outside, forager, feedRun, bouts, open } = this;
    const app = w.apparatus;
    const t = this.stepIndex * dt;
    this.stepIndex++;
    w.time = t;
    // Ad-libitum sources: what was drunk is replaced from outside.
    for (const f of this.adLib) {
      const d = f.initialUl - f.volumeUl;
      if (d > 0) {
        w.ledger.move('sugar', 'external', 'food', d * f.sugarPerUl());
        w.ledger.move('water', 'external', 'food', d * f.waterPerUl());
        f.volumeUl = f.initialUl;
      }
    }
    if (!this.foodAdded && t >= this.foodTime) {
      w.addFood((id) => new SugarDroplet(id, this.feeder[0], this.feeder[1], this.o.foodUl ?? 3000, this.o.molar ?? 1, 1));
      this.foodAdded = true;
    }
    const rec = this.recruiter;
    if (rec && !this.recruiterIn && t >= rec.enterAt - 1e-9) {
      // The recruiter steps into the nest from the passage, heading inwards, carrying its load.
      const a = this.addAnt(this.n, this.entrance[0] - 1, this.entrance[1], Math.PI, false, this.recruiterSeed);
      a.body.cropUl = rec.cropUl;
      a.body.cropSugar = rec.cropSugar;
      a.body.cropWater = rec.cropWater;
      w.ledger.move('sugar', 'external', 'crop', rec.cropSugar);
      w.ledger.move('water', 'external', 'crop', rec.cropWater);
      // Initial condition: it arrives from a trip on which it fed (its trip record; read by the return rule).
      a.mind.trip = { ...newTrip(), ingested: rec.ingested };
      // A forager: stops and walks with the forager values where they differ (option B).
      if (P.nest.forager) a.mind.traits.forager = true;
      this.recruiterIn = true;
    }
    const frameEvery = this.o.frameEvery ?? 0;
    if (frameEvery > 0 && t >= this.nextFrame - 1e-9) {
      this.frames.push(frame(w, t, app.bounds));
      this.nextFrame += frameEvery;
    }
    // Perceive (same state for all), then decide. A nest worker resting at the start of the step decides from what its
    // rest mode reads (the fast path). A resting ant with a record (a candidate) is advanced by the rest tick unless
    // the pair upkeep or a partner's signals mark a change for it; percepts are built only for the ants that need them.
    w.contactGrid?.build(w.ants);
    const observe = this.o.lazyRest!.observe;
    const resting = w.ants.map((a, i) => a.body.alive && !outside[i] && a.mind.mode === 'rest');
    const cand = resting.map((r, i) => r && !!this.lazyRec[i]);
    const marks = this.lazyMarks(cand);
    const contactsOf = (i: number) => contactPercepts(w, this.pairCache!, i);
    const tick = cand.map((c, i) => c && !marks[i]);
    const per: (SurfacePercept | null)[] = w.ants.map((a, i) => (!a.body.alive || (tick[i] && !observe?.includes(i)) ? null : resting[i] ? perceiveResting(w, a.body, dt, contactsOf(i)) : perceive(w, a.body, dt, contactsOf(i))));
    const ticked = w.ants.map(() => false);
    // The latent activity drive runs for every ant wherever it is (drawn only when some role uses it).
    if (P.nest.driveSd > 0 || (P.nest.forager?.driveSd ?? 0) > 0)
      w.ants.forEach((a, i) => {
        if (a.body.alive) stepDrive(a.mind, P.nest.driveTau, dt, (this.driveRng[i] ??= RNG.stream(this.o.seed, 0xd21e, i)));
      });
    const acts: (NestAction | ForagerAction | null)[] = w.ants.map((a, i) => {
      if (tick[i]) {
        if (this.lazyStep(i, a, dt)) {
          ticked[i] = true;
          return this.lazyAct[i];
        }
        // Handed back: the full call, with the percept the stepped run builds (no body state has changed since sensing).
        per[i] ??= perceiveResting(w, a.body, dt, contactsOf(i));
      }
      this.lazyRec[i] = null;
      this.lazyAct[i] = null;
      const p = per[i];
      if (!p) return null;
      if (outside[i]) return lasiusForager(p, interocept(a.body), a.mind, this.foragerP, a.body.rng);
      // A full call; its record, if it left the ant standing in rest, lets the next steps tick.
      const io = interocept(a.body);
      const act = lasiusNestWorker(p, io, a.mind, P.nest, a.body.rng);
      const r = restRecord(p, io, a.mind, P.nest, act);
      if (r) {
        this.lazyRec[i] = r;
        this.lazyAct[i] = act;
      }
      return act;
    });
    // A resting ant that walks this step (it woke, or leaves or returns) gets the full percept of the same pre-move state.
    w.ants.forEach((a, i) => {
      if (resting[i] && acts[i] && !(acts[i] as NestAction).stand) per[i] = perceive(w, a.body, dt, contactsOf(i));
    });
    // Move (and, outside, drink and metabolise as in E2). Mouth flow is re-sensed from here on.
    for (const a of w.ants) a.body.mouthFlow = 0;
    const walked = new Array<number>(w.ants.length).fill(0);
    // The diagnostic switch, else the model's wall rule (candidate C2: specular).
    const wall = this.o.wall ?? (P.nest.wallRule === 'specular' ? 'specular' : undefined);
    w.ants.forEach((a, i) => {
      const act = acts[i];
      // The offering and sharing signals nestmates sense next step (STATUS 2026-10-10); foragers show neither.
      const na0 = act && !outside[i] ? (act as NestAction) : null;
      a.body.offering = !!na0 && na0.offer;
      a.body.soliciting = !!na0 && na0.solicit;
      a.body.sharingWith = !na0 ? -1 : na0.give >= 0 ? na0.give : na0.receive;
      if (!act) return;
      if (outside[i]) {
        const before = a.body.cropUl;
        const keepOut = this.o.exploreOutside && a.mind.mode === 'explore' ? (x: number, y: number) => { const r = app.regionAt(x, y); return !!r && r.kind !== 'nest'; } : undefined;
        applyForagerAction(w, a, act as ForagerAction, per[i]!, this.walkFor(per[i]!, a), P.phys, dt, this.motor, keepOut);
        // Forager status: ≥ 5 consecutive seconds of feeding at the source.
        feedRun[i] = a.mind.mode === 'drink' && a.body.cropUl > before ? feedRun[i] + dt : 0;
        if (feedRun[i] >= 5 - 1e-9) forager[i] = true;
        return;
      }
      const na = act as NestAction;
      a.body.gasterDown = false;
      a.body.stepLen = 0;
      // A ticked ant stands (and may have no percept).
      if (na.stand) return;
      // A partial step (a rest/walk switch inside it) walks through a percept with the shorter dt.
      const p = per[i]!;
      walked[i] = walkAnt(w, a, na.walkFrac !== undefined ? { ...p, dt: p.dt * na.walkFrac } : p, this.walkFor(p, a), P.phys, na.motor, this.motor, undefined, wall === 'inward' ? this.inwardTurn(i) : wall === 'specular' ? ColonySim.specularTurn : undefined);
    });
    // Food sharing between ants that both agreed, in donor-index order.
    w.ants.forEach((a, i) => {
      const act = acts[i];
      if (!act || outside[i]) return;
      const j = (act as NestAction).give;
      if (j < 0 || outside[j] || !acts[j]) return;
      if ((acts[j] as NestAction).receive !== i) return;
      const b = w.ants[j];
      if (!mouthContact(a.body, b.body) && !alignFaceToFace(a.body, b.body, (x, y) => app.inside(x, y))) return;
      a.mind.walk.heading = a.body.heading;
      b.mind.walk.heading = b.body.heading;
      const ul = shareCrop(a.body, b.body, P.nest.shareRate, dt);
      if (ul <= 0) return;
      const key = `${i}>${j}`;
      const bout = open.get(key);
      if (bout && bout.end >= t - 1e-9) {
        bout.end = t + dt;
        bout.ul += ul;
      } else {
        if (bout) bouts.push(bout);
        open.set(key, { donor: i, receiver: j, start: t, end: t + dt, ul });
      }
    });
    for (const [key, bout] of open)
      if (bout.end < t + dt - 1e-9) {
        bouts.push(bout);
        open.delete(key);
      }
    // Metabolism in the nest; hand-overs between the nest and forager policies.
    w.ants.forEach((a, i) => {
      const act = acts[i];
      if (!act) return;
      if (outside[i]) {
        if ((act as ForagerAction).enterNest) {
          outside[i] = false;
          a.inactive = false;
          enterNest(a.mind);
        }
        return;
      }
      metabolise(w, a.body, P.phys, walked[i] > 0, dt);
      if ((act as NestAction).leaveNest) {
        outside[i] = true;
        // The trip starts here, at the entrance: the path integrator from the ant's position relative to it.
        startTrip(a.mind, this.foragerP, interocept(a.body), a.body.rng, { x: a.body.x - this.entrance[0], y: a.body.y - this.entrance[1] });
      }
    });
    return !!onStep?.(w, { t, per, outside, lazy: ticked });
  }

  /**
   * Lazy resting: update the contact pairs and mark every candidate that must have a full call this step: its position,
   * heading, life or partner set changed, or a partner's signals did (offering, soliciting, sharing partner,
   * moving, laying trail: every non-geometric field of a contact percept). An ant whose own signals changed is
   * marked too.
   */
  private lazyMarks(cand: readonly boolean[]): Uint8Array {
    const ants = this.w.ants;
    const marks = new Uint8Array(ants.length);
    updateAdjacency(this.w, this.pairCache!, marks, cand);
    const adj = this.pairCache!.adj;
    for (let j = 0; j < ants.length; j++) {
      const b = ants[j].body;
      const sig = (b.offering ? 1 : 0) | (b.soliciting ? 2 : 0) | (b.gasterDown ? 4 : 0) | (b.stepLen > 0 ? 8 : 0);
      if (sig === this.sigPrev[j] && b.sharingWith === this.sharePrev[j]) continue;
      this.sigPrev[j] = sig;
      this.sharePrev[j] = b.sharingWith;
      marks[j] = 1;
      for (const k of adj[j] ?? []) marks[k] = 1;
    }
    return marks;
  }

  /** Lazy resting: ant i's rest tick (true: done, the last action stands); with `verify`, checked against the full call on a copy. */
  private lazyStep(i: number, a: Agent, dt: number): boolean {
    const p = this.lazyP![a.mind.traits.forager && this.P.nest.forager ? 1 : 0];
    const io = interoceptInto(a.body, this.lazyIo);
    if (!this.o.lazyRest!.verify) return restTick(io, a.mind, p, a.body.rng, dt, this.lazyRec[i]!);
    const mind0 = deepClone(a.mind);
    const rng0 = a.body.rng.snapshot();
    const mindC = deepClone(a.mind);
    const rngC = new RNG().restore(rng0);
    const actC = lasiusNestWorker(perceiveResting(this.w, a.body, dt, contactPercepts(this.w, this.pairCache!, i)), interocept(a.body), mindC, this.P.nest, rngC);
    const ok = restTick(io, a.mind, p, a.body.rng, dt, this.lazyRec[i]!);
    const where = `lazyRest verify: ant ${i}, step ${this.stepIndex - 1}`;
    if (!ok) {
      const d = firstDiff(mind0, a.mind) ?? firstDiff(rng0, a.body.rng.snapshot());
      if (d) throw new Error(`${where}: a handed-back tick changed ${d}`);
      return false;
    }
    const last = this.lazyAct[i]!;
    const d =
      firstDiff(mindC, a.mind, 'mind') ??
      firstDiff(rngC.snapshot(), a.body.rng.snapshot(), 'rng') ??
      firstDiff({ stand: actC.stand, give: actC.give, receive: actC.receive, leaveNest: actC.leaveNest, offer: actC.offer, solicit: actC.solicit, walkFrac: actC.walkFrac }, { stand: true, give: -1, receive: -1, leaveNest: false, offer: last.offer, solicit: last.solicit, walkFrac: undefined }, 'action');
    if (d) throw new Error(`${where}: the tick differs from the full call at ${d}`);
    return true;
  }
}

/** A colony run: `LazyColonySim` when `o.lazyRest` is set, else `ColonySim` (the same results either way). */
export function newColonySim(P: ColonyParams, o: ColonyOptions): ColonySim {
  return o.lazyRest ? new LazyColonySim(P, o) : new ColonySim(P, o);
}

/** Path of the first difference between two plain values (numbers by Object.is), or null if they are equal. */
function firstDiff(x: unknown, y: unknown, path = ''): string | null {
  if (Object.is(x, y)) return null;
  if (typeof x !== 'object' || typeof y !== 'object' || x === null || y === null) return `${path} (${String(x)} vs ${String(y)})`;
  if (Array.isArray(x) !== Array.isArray(y)) return `${path} (array vs object)`;
  const keys = new Set([...Object.keys(x), ...Object.keys(y)]);
  for (const k of keys) {
    const d = firstDiff((x as Record<string, unknown>)[k], (y as Record<string, unknown>)[k], `${path}.${k}`);
    if (d) return d;
  }
  return null;
}
