import { Body } from '../agent/body';
import type { ContactInterval } from '../analysis/trophallaxis';
import { lasiusForager, drawTraits, startTrip, type ForagerAction, type ForagerParams } from '../behavior/lasiusForager';
import { drawNestTraits, enterNest, lasiusNestWorker, type NestAction, type NestParams } from '../behavior/lasiusNestWorker';
import { deepClone } from '../core/clone';
import { RNG } from '../core/rng';
import { newMind, newTrip } from '../mind/mind';
import { walkStep, type WalkParams } from '../models/walk';
import { interocept, perceive } from '../perception/perceive';
import type { SurfacePercept } from '../perception/types';
import { applyForagerAction, metabolise, walkAnt, type MotorFn } from '../physics/antPhysics';
import { alignFaceToFace, detectContacts, mouthContact } from '../physics/contacts';
import { shareCrop } from '../physics/trophallaxis';
import { E6_CONTEXT } from '../species/lasiusM1';
import { Apparatus, blesApparatus } from '../world/apparatus';
import { SugarDroplet } from '../world/food';
import { PathField } from '../world/pathField';
import { PlaneSurface } from '../world/surface';
import { World, type Agent } from '../world/world';
import type { LasiusParams } from './e2Mailleux';

/**
 * A Bles et al. (2022) colony in its lab nest — step 4, BOUNDED and
 * PROVISIONAL (STATUS 2026-10-08): geometry, contact detection, food
 * transfer with conservation, deterministic runs. The in-nest behaviour
 * (`lasiusNestWorker`) is a placeholder and the walker is the adopted E1
 * walker used provisionally (`motor` replaces it). Nothing here is
 * calibrated or compared with the E6 data yet.
 *
 * Per step: every living ant perceives the same state, then all decide,
 * then movement is applied in index order, then food sharing is resolved
 * between ants that both agreed (the pair held face to face), then
 * metabolism. Food (1 M sucrose) appears at the area centre at `foodMinute`.
 */
export interface ColonyParams extends LasiusParams {
  nest: NestParams;
}

export interface ColonyOptions {
  seed: number;
  /** Workers per colony (default 53: the Bles et al. data imply 267 ants / 5 colonies). */
  ants?: number;
  dt?: number;
  minutes?: number;
  foodMinute?: number;
  starvationDays?: number;
  /** Factor on the walker's speed (default E6_CONTEXT.walkSpeedFactor, the pre-registered primary; sensitivity 1 and E2_CONTEXT.walkSpeedFactor). */
  walkSpeedFactor?: number;
  /** Bles et al. 2022: 22 ± 3 °C (STATUS 2026-10-09; 25 °C was assumed before). */
  tempC?: number;
  foodUl?: number;
  molar?: number;
  /** Scouts that find nothing return after this long (s). */
  exploreGiveUp?: number;
  /** Seconds between recorded frames (0: none). */
  frameEvery?: number;
  /** Motor program (default: the adopted E1 walker). */
  motor?: MotorFn;
  /**
   * One extra ant (index `ants`) that enters the nest from the passage at
   * `enterAt` s carrying a crop load and the memory of having fed
   * (`ingested` µL): the Mailleux 1999 recruiter. Absent until then.
   */
  recruiter?: RecruiterEntry;
}

export interface RecruiterEntry {
  enterAt: number;
  cropUl: number;
  /** Crop contents (mg). */
  cropSugar: number;
  cropWater: number;
  ingested: number;
}

/** Per-step view for observers (`runColony`'s `onStep`); return true from `onStep` to stop the run. */
export interface ColonyStepInfo {
  t: number;
  per: readonly (SurfacePercept | null)[];
  /** Ants under the forager policy (outside the nest, or on their way in). */
  outside: readonly boolean[];
}

/** Behaviour codes in frames. */
export const MODE_CODE: Record<string, number> = { rest: 0, active: 1, give: 2, receive: 3, leave: 4, explore: 5, drink: 6, search: 7, return: 8 };
export const MODE_NAMES = Object.keys(MODE_CODE);

export interface ColonyFrame {
  t: number;
  x: Float32Array;
  y: Float32Array;
  heading: Float32Array;
  /** Crop contents (µL). */
  crop: Float32Array;
  mode: Uint8Array;
  /** Sharing partner (−1: none). */
  partner: Int16Array;
  /** Antennal contacts in progress. */
  contacts: number;
  /** Food left (µL), and sugar (mg) per ledger account. */
  foodUl: number;
  sugar: { food: number; crop: number; reserve: number; respired: number };
  /** Ledger sum over all accounts (0 when sugar is conserved). */
  sugarTotal: number;
}

export interface ShareBout {
  donor: number;
  receiver: number;
  /** Seconds from the start of the run. */
  start: number;
  end: number;
  ul: number;
}

export interface ColonyResult {
  world: World;
  bouts: ShareBout[];
  /** Bouts in the form the E6 observer takes: seconds after food introduction. */
  contacts: ContactInterval[];
  /** Fed ≥ 5 consecutive s at the source (the paper's forager definition). */
  forager: boolean[];
  frames: ColonyFrame[];
  foodTime: number;
}

export function runColony(P: ColonyParams, o: ColonyOptions, onStep?: (w: World, info: ColonyStepInfo) => boolean | void): ColonyResult {
  const sim = new ColonySim(P, o);
  while (sim.stepIndex < sim.steps) if (sim.step(onStep)) break;
  return sim.result();
}

/** Classes whose instances never change during a run and are shared between copies. */
const IMMUTABLE = (x: object) => x instanceof Apparatus || x instanceof PathField || x instanceof PlaneSurface;

/**
 * A colony run as a steppable object (`runColony` steps it to the end).
 * `clone(key)` copies the whole state; with a key, every random stream of
 * the copy is forked, so copies keyed differently continue independently
 * from the same state (shared warm-ups, STATUS 2026-10-10). Fields hold all
 * mutable state; no stored closure refers to it, so copies are complete.
 */
export class ColonySim {
  readonly n: number;
  readonly dt: number;
  readonly steps: number;
  readonly foodTime: number;
  stepIndex = 0;
  readonly w: World;
  readonly outside: boolean[] = [];
  readonly forager: boolean[] = [];
  readonly feedRun: number[] = [];
  readonly bouts: ShareBout[] = [];
  readonly open = new Map<string, ShareBout>();
  readonly frames: ColonyFrame[] = [];
  recruiter: RecruiterEntry | undefined;
  /** Seed for the recruiter's own streams (default the colony seed). */
  recruiterSeed: number;
  recruiterIn = false;
  private foodAdded = false;
  private nextFrame = 0;
  private readonly walkP: WalkParams;
  private readonly walkNestP: WalkParams;
  private readonly foragerP: ForagerParams;
  private readonly motor: MotorFn;
  private readonly reserveMax: number;
  private readonly reserveFrac: number;
  private readonly deficit: number;
  private readonly entrance: [number, number];
  private readonly feeder: [number, number];

  constructor(
    readonly P: ColonyParams,
    readonly o: ColonyOptions,
  ) {
    this.n = o.ants ?? 53;
    const f = o.walkSpeedFactor ?? E6_CONTEXT.walkSpeedFactor;
    this.walkP = f === 1 ? P.walk : { ...P.walk, speed: P.walk.speed * f };
    // Inside the nest the walker is further scaled by the calibrated nest factor (STATUS 2026-10-09).
    const nf = P.nest.nestSpeedFactor ?? 1;
    this.walkNestP = nf === 1 ? this.walkP : { ...this.walkP, speed: this.walkP.speed * nf };
    this.dt = o.dt ?? 0.1;
    this.steps = Math.round(((o.minutes ?? 90) * 60) / this.dt);
    this.foodTime = (o.foodMinute ?? 30) * 60;
    this.motor = o.motor ?? walkStep;
    const { app, entrance, feeder } = blesApparatus();
    this.entrance = entrance;
    this.feeder = feeder;
    const w = new World(app, entrance, o.seed, o.tempC ?? 22, 50);
    // Cues along the surface (provisional): nest odour over the whole foraging area, and the way out inside the nest.
    w.nestOdour = new PathField(app, (r) => r.kind === 'nest');
    w.exitCue = new PathField(app, (r) => r.kind !== 'nest');
    w.nestCueRadius = 150;
    this.w = w;
    this.foragerP = { ...P.forager, exploreGiveUp: o.exploreGiveUp ?? 300 };
    const m = P.morph;
    this.reserveMax = P.phys.metabolic * Math.pow(m.mass, 0.75) * 24 * m.reserveDays;
    this.deficit = (o.starvationDays ?? 4) / m.reserveDays;
    this.reserveFrac = Math.max(0.02, 1 - this.deficit);
    const nestRegion = app.regions.find((r) => r.kind === 'nest')!;
    for (let i = 0; i < this.n; i++) {
      // Start positions, headings and the initial rest/active state from their own streams.
      const place = RNG.stream(o.seed, 0x9e57, i);
      const x = place.range(nestRegion.x0 + 2, nestRegion.x1 - 2);
      const y = place.range(nestRegion.y0 + 2, nestRegion.y1 - 2);
      const heading = place.range(-Math.PI, Math.PI);
      this.addAnt(i, x, y, heading, place.chance(0.5), o.seed);
    }
    this.recruiter = o.recruiter;
    this.recruiterSeed = o.seed;
  }

  private addAnt(i: number, x: number, y: number, heading: number, rest: boolean, seed: number): Agent {
    const { P, w } = this;
    const m = P.morph;
    // Nestmates differ in reserve (STATUS 2026-10-10): deficit × a lognormal factor (mean 1) from their own stream; the
    // recruiter (index n) keeps the scout's reserve.
    const sd = P.nest.reserveSd;
    const frac = i < this.n ? Math.max(0.02, 1 - this.deficit * Math.exp(RNG.stream(seed, 0x5e5e, i).normal(0, sd) - (sd * sd) / 2)) : this.reserveFrac;
    const body = new Body(i, seed, { len: m.len, mass: m.mass, cropCapacity: m.cropCapacity, antennaReach: m.antennaReach, cropFullFrac: m.cropFullFrac }, frac, this.reserveMax);
    w.ledger.move('sugar', 'external', 'reserve', body.reserve);
    w.ledger.move('water', 'external', 'reserve', body.water);
    body.x = x;
    body.y = y;
    body.heading = heading;
    const physRng = RNG.stream(seed, 0x1a7a, i);
    body.intakeFactor = Math.exp(physRng.normal(0, P.phys.intakeSd) - (P.phys.intakeSd * P.phys.intakeSd) / 2);
    const traits = { ...drawTraits(P.forager, body.rng), ...drawNestTraits(P.nest, RNG.stream(seed, 0x7e57, i)) };
    const mind = newMind(traits, this.walkP, body.rng);
    mind.walk.heading = body.heading;
    // In the nest the ant knows where it is relative to the entrance (path-integration origin).
    mind.pi.x = body.x - this.entrance[0];
    mind.pi.y = body.y - this.entrance[1];
    enterNest(mind, rest);
    const agent: Agent = { body, mind, inactive: false };
    w.ants.push(agent);
    this.outside.push(false);
    this.forager.push(false);
    this.feedRun.push(0);
    return agent;
  }

  private walkFor(p: SurfacePercept): WalkParams {
    return p.inNest ? this.walkNestP : this.walkP;
  }

  /** A copy of the whole state; with `key`, its random streams are forked (independent continuation). */
  clone(key?: number): ColonySim {
    return deepClone(this, { share: IMMUTABLE, rekey: key });
  }

  /** Advance one time step; returns true if `onStep` asked to stop. */
  step(onStep?: (w: World, info: ColonyStepInfo) => boolean | void): boolean {
    const { P, w, dt, outside, forager, feedRun, bouts, open } = this;
    const app = w.apparatus;
    const t = this.stepIndex * dt;
    this.stepIndex++;
    w.time = t;
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
      this.recruiterIn = true;
    }
    const frameEvery = this.o.frameEvery ?? 0;
    if (frameEvery > 0 && t >= this.nextFrame - 1e-9) {
      this.frames.push(frame(w, t, app.bounds));
      this.nextFrame += frameEvery;
    }
    // Perceive (same state for all), then decide.
    const per: (SurfacePercept | null)[] = w.ants.map((a) => (a.body.alive ? perceive(w, a.body, dt) : null));
    const acts: (NestAction | ForagerAction | null)[] = w.ants.map((a, i) => {
      const p = per[i];
      if (!p) return null;
      return outside[i] ? lasiusForager(p, interocept(a.body), a.mind, this.foragerP, a.body.rng) : lasiusNestWorker(p, interocept(a.body), a.mind, P.nest, a.body.rng);
    });
    // Move (and, outside, drink and metabolise as in E2). Mouth flow is re-sensed from here on.
    for (const a of w.ants) a.body.mouthFlow = 0;
    const walked = new Array<number>(w.ants.length).fill(0);
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
        applyForagerAction(w, a, act as ForagerAction, per[i]!, this.walkFor(per[i]!), P.phys, dt, this.motor);
        // Forager status: ≥ 5 consecutive seconds of feeding at the source.
        feedRun[i] = a.mind.mode === 'drink' && a.body.cropUl > before ? feedRun[i] + dt : 0;
        if (feedRun[i] >= 5 - 1e-9) forager[i] = true;
        return;
      }
      const na = act as NestAction;
      a.body.gasterDown = false;
      a.body.stepLen = 0;
      if (!na.stand) walked[i] = walkAnt(w, a, per[i]!, this.walkFor(per[i]!), P.phys, na.motor, this.motor);
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
    return !!onStep?.(w, { t, per, outside });
  }

  /** Bouts so far (open ones closed at their last step), and the E6 observer's contact list; does not change the state. */
  result(): ColonyResult {
    const bouts = [...this.bouts, ...this.open.values()].map((b) => ({ ...b }));
    bouts.sort((p, q) => p.start - q.start || p.donor - q.donor || p.receiver - q.receiver);
    const ft = this.foodTime;
    const contacts = bouts.filter((b) => b.end > ft).map((b) => ({ donor: b.donor, receiver: b.receiver, start: b.start - ft, end: b.end - ft }));
    return { world: this.w, bouts, contacts, forager: this.forager, frames: this.frames, foodTime: ft };
  }
}

function frame(w: World, t: number, bounds: { x0: number; y0: number; x1: number; y1: number }): ColonyFrame {
  const n = w.ants.length;
  const f: ColonyFrame = {
    t,
    x: new Float32Array(n),
    y: new Float32Array(n),
    heading: new Float32Array(n),
    crop: new Float32Array(n),
    mode: new Uint8Array(n),
    partner: new Int16Array(n),
    contacts: detectContacts(
      w.ants.map((a) => a.body),
      bounds,
    ).length,
    foodUl: w.food.reduce((s, x) => s + x.volumeUl, 0),
    sugar: { food: w.ledger.get('sugar', 'food'), crop: w.ledger.get('sugar', 'crop'), reserve: w.ledger.get('sugar', 'reserve'), respired: w.ledger.get('sugar', 'respired') },
    sugarTotal: w.ledger.total('sugar'),
  };
  w.ants.forEach((a: Agent, i) => {
    f.x[i] = a.body.x;
    f.y[i] = a.body.y;
    f.heading[i] = a.body.heading;
    f.crop[i] = a.body.cropUl;
    f.mode[i] = a.body.alive ? (MODE_CODE[a.mind.mode] ?? 1) : 255;
    f.partner[i] = a.mind.stay.bout?.partner ?? -1;
  });
  return f;
}
