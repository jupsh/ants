import { Body } from '../agent/body';
import type { ContactInterval } from '../analysis/trophallaxis';
import { lasiusForager, drawTraits, startTrip, type ForagerAction, type ForagerParams } from '../behavior/lasiusForager';
import { drawNestTraits, enterNest, lasiusNestWorker, type NestAction, type NestParams } from '../behavior/lasiusNestWorker';
import { deepClone } from '../core/clone';
import { RNG } from '../core/rng';
import { newMind, newTrip } from '../mind/mind';
import { walkStep, type WalkParams } from '../models/walk';
import { ContactPairCache, senseAllContacts } from '../perception/contactPairs';
import { interocept, perceive, perceiveResting } from '../perception/perceive';
import type { SurfacePercept } from '../perception/types';
import { applyForagerAction, metabolise, walkAnt, type MotorFn } from '../physics/antPhysics';
import { alignFaceToFace, detectContacts, HEAD_OFFSET, mouthContact } from '../physics/contacts';
import { shareCrop } from '../physics/trophallaxis';
import { E6_CONTEXT } from '../species/lasiusM1';
import { Apparatus, blesApparatus } from '../world/apparatus';
import { ContactGrid } from '../world/contactGrid';
import { SugarDroplet } from '../world/food';
import { sucroseSugarPerUl, sucroseWaterPerUl } from '../physics/ledger';
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
  /** SD of log of a per-trip lognormal give-up time with median `exploreGiveUp` (unset: fixed; STATUS 2026-10-15). */
  exploreGiveUpSd?: number;
  /**
   * Exploring foragers cannot step into the nest chamber, so a trip lasts
   * until `exploreGiveUp` and homing (Stroeymeyt set-up, STATUS 2026-10-11:
   * without it, explorers wandered back through the hole within a minute).
   */
  exploreOutside?: boolean;
  /** Seconds between recorded frames (0: none). */
  frameEvery?: number;
  /** Motor program (default: the adopted E1 walker). */
  motor?: MotorFn;
  /** Contact checks through a spatial grid (default true; results are identical either way, it is only faster). */
  contactGrid?: boolean;
  /**
   * Fast path (default true; results are identical either way, STATUS
   * 2026-10-12): contacts sensed once per nearby pair with a geometry cache,
   * and a resting nest worker senses only what its decision reads
   * (`perceiveResting`), completed with the full percept if it walks.
   */
  fastPath?: boolean;
  /**
   * One extra ant (index `ants`) that enters the nest from the passage at
   * `enterAt` s carrying a crop load and the memory of having fed
   * (`ingested` µL): the Mailleux 1999 recruiter. Absent until then.
   */
  recruiter?: RecruiterEntry;
  /** Apparatus, entrance and food position (default: the Bles et al. nest). */
  setup?: { app: Apparatus; entrance: [number, number]; feeder: [number, number] };
  /**
   * Fixed role per worker (length `ants`; default: none). Workers with role
   * `forager` get the forager trait (its values and `outRate` trips); `nurse`
   * and `queen` do not. Replaces the random `foragerFrac` draw.
   */
  roles?: ('nurse' | 'forager' | 'queen')[];
  /** Sources present from the start (Stroeymeyt set-up: water and sugar water); `adLib`: topped up to their volume every step. */
  sources?: { x: number; y: number; ul: number; molar: number; adLib?: boolean }[];
  /**
   * Initial water state by role (STATUS 2026-10-15), drawn from each ant's
   * own stream: body water as a fraction of the maximum, uniform in [lo, hi]
   * (unset: full; the queen counts as a nurse), and foragers' crop volume
   * (µL), uniform in [lo, hi], filled from one of `sources` at random.
   */
  waterInit?: { nurse: [number, number]; forager: [number, number]; foragerCrop?: [number, number] };
  /**
   * Oracle colony-coupling diagnostic (STATUS 2026-10-17 ≈ 05:11 UTC; a cheat channel, not a mechanism). Each step every
   * in-nest ant's walk-on rate (`restToActive`) is multiplied for its policy call by g. `coupled`: g = clamp((u / ū)^κ,
   * 0.25, 4), u the fraction of in-nest ants not resting (true state) smoothed over `tauC` s, ū the same over 30 min.
   * `placebo`: g = exp(x_i), x_i an independent OU process per ant (time constant `tauC`, stationary SD `sd`): the same
   * modulation without sharing. Absent: nothing changes.
   */
  oracle?: { kind: 'coupled'; kappa: number; tauC: number } | { kind: 'placebo'; sd: number; tauC: number };
  /**
   * Slow-episode what-if (STATUS 2026-10-17, overnight; a diagnostic, not a mechanism, not adoptable). An in-nest ant
   * that walks enters, at `rate` per walking second, a slow episode of exponential duration (mean `dur` s) during which
   * its walker's speed is × `factor`; the episode ends early if it stops. Absent: nothing changes.
   */
  slowEp?: { rate: number; dur: number; factor: number };
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
  /** With the fast path, a nest worker that rested through the step has only contacts, region, light and temperature. */
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
  /** Oracle diagnostic state (see `ColonyOptions.oracle`); plain fields so `clone` copies it. */
  private oracleU = NaN;
  private oracleSlow = NaN;
  private readonly oracleOu: number[] = [];
  private readonly oracleRng: RNG[] = [];
  /** Σ and Σ² of log g over the steps after 30 min (coupled), and their count: the signal's variability, read for the placebo's SD. */
  oracleLogSum = 0;
  oracleLogSq = 0;
  oracleLogN = 0;
  /** Slow-episode what-if: seconds left in each ant's episode, own streams, the slowed walk parameters (nest, forager). */
  private readonly slowLeft: number[] = [];
  private readonly slowRng: RNG[] = [];
  private slowP: [WalkParams, WalkParams] | null = null;
  /** Ad-libitum sources (topped up every step). */
  private readonly adLib: SugarDroplet[] = [];
  private nextFrame = 0;
  private readonly walkP: WalkParams;
  private readonly walkNestP: WalkParams;
  /** In-nest walking for ants with the forager trait (option B: their own speed factor). */
  private readonly walkNestForagerP: WalkParams;
  private readonly foragerP: ForagerParams;
  private readonly pairCache?: ContactPairCache;
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
    // Option B: the walker's own pauses are off in the nest (nestPauseFactor 0; the sourced stops include them).
    const pf = P.nest.nestPauseFactor ?? 1;
    // Within-walk speed fluctuation in the nest (STATUS 2026-10-16 night, under test): factors on the walker's SD and τ.
    const sf = P.nest.nestSpeedSdFactor ?? 1;
    const tf = P.nest.nestSpeedTauFactor ?? 1;
    const inNest = (f: number, pf: number, sf: number, tf: number): WalkParams =>
      f === 1 && pf === 1 && sf === 1 && tf === 1
        ? this.walkP
        : { ...this.walkP, speed: this.walkP.speed * f, pauseRate: this.walkP.pauseRate * pf, speedSdWithin: this.walkP.speedSdWithin * sf, speedTau: this.walkP.speedTau * tf };
    this.walkNestP = inNest(nf, pf, sf, tf);
    const fo = P.nest.forager;
    const [ff, fpf, fsf, ftf] = [fo?.nestSpeedFactor ?? nf, fo?.nestPauseFactor ?? pf, fo?.nestSpeedSdFactor ?? sf, fo?.nestSpeedTauFactor ?? tf];
    this.walkNestForagerP = ff === nf && fpf === pf && fsf === sf && ftf === tf ? this.walkNestP : inNest(ff, fpf, fsf, ftf);
    this.dt = o.dt ?? 0.1;
    this.steps = Math.round(((o.minutes ?? 90) * 60) / this.dt);
    this.foodTime = (o.foodMinute ?? 30) * 60;
    this.motor = o.motor ?? walkStep;
    const { app, entrance, feeder } = o.setup ?? blesApparatus();
    this.entrance = entrance;
    this.feeder = feeder;
    const w = new World(app, entrance, o.seed, o.tempC ?? 22, 50);
    // Cues along the surface (provisional): nest odour over the whole foraging area, and the way out inside the nest.
    w.nestOdour = new PathField(app, (r) => r.kind === 'nest');
    w.exitCue = new PathField(app, (r) => r.kind !== 'nest');
    w.nestCueRadius = 150;
    // Cells as wide as the largest antennal-contact distance (all ants share one morphology here).
    if (o.fastPath !== false) this.pairCache = new ContactPairCache();
    if (o.contactGrid !== false) w.contactGrid = new ContactGrid(P.morph.antennaReach + 2 * HEAD_OFFSET * P.morph.len + 1e-3, app.bounds);
    this.w = w;
    this.foragerP = { ...P.forager, exploreGiveUp: o.exploreGiveUp ?? 300, exploreGiveUpSd: o.exploreGiveUpSd };
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
    for (const s of o.sources ?? []) {
      const f = w.addFood((id) => new SugarDroplet(id, s.x, s.y, s.ul, s.molar, 1));
      if (s.adLib) this.adLib.push(f);
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
    const wi = this.o.waterInit;
    const isForager = this.o.roles?.[i] === 'forager';
    const wrng = RNG.stream(seed, 0x3a7e, i);
    if (wi && i < this.n) {
      const r = isForager ? wi.forager : wi.nurse;
      body.water = body.waterMax * wrng.range(r[0], r[1]);
    }
    w.ledger.move('sugar', 'external', 'reserve', body.reserve);
    w.ledger.move('water', 'external', 'reserve', body.water);
    const src = this.o.sources ?? [];
    if (wi?.foragerCrop && isForager && i < this.n && src.length) {
      const ul = Math.min(m.cropCapacity, wrng.range(wi.foragerCrop[0], wi.foragerCrop[1]));
      const s = src[wrng.int(src.length)];
      body.cropUl = ul;
      body.cropSugar = ul * sucroseSugarPerUl(s.molar);
      body.cropWater = ul * sucroseWaterPerUl(s.molar);
      w.ledger.move('sugar', 'external', 'crop', body.cropSugar);
      w.ledger.move('water', 'external', 'crop', body.cropWater);
    }
    body.x = x;
    body.y = y;
    body.heading = heading;
    const physRng = RNG.stream(seed, 0x1a7a, i);
    body.intakeFactor = Math.exp(physRng.normal(0, P.phys.intakeSd) - (P.phys.intakeSd * P.phys.intakeSd) / 2);
    const traits = { ...drawTraits(P.forager, body.rng), ...drawNestTraits(P.nest, RNG.stream(seed, 0x7e57, i)) };
    const role = i < this.n ? this.o.roles?.[i] : undefined;
    if (role) traits.forager = role === 'forager';
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

  private walkFor(p: SurfacePercept, a: Agent): WalkParams {
    return !p.inNest ? this.walkP : a.mind.traits.forager ? this.walkNestForagerP : this.walkNestP;
  }

  /** Slow-episode what-if: advance ant i's episode for this step and return the walk parameters it walks with. */
  private slowWalk(i: number, a: Agent, p: SurfacePercept, walks: boolean, dt: number): WalkParams {
    const e = this.o.slowEp!;
    if (!this.slowP) this.slowP = [{ ...this.walkNestP, speed: this.walkNestP.speed * e.factor }, { ...this.walkNestForagerP, speed: this.walkNestForagerP.speed * e.factor }];
    while (this.slowLeft.length <= i) {
      this.slowRng.push(RNG.stream(this.o.seed, 0x51e9, this.slowLeft.length));
      this.slowLeft.push(0);
    }
    if (!walks) this.slowLeft[i] = 0;
    else if (this.slowLeft[i] > 0) this.slowLeft[i] -= dt;
    else if (this.slowRng[i].chance(1 - Math.exp(-e.rate * dt))) this.slowLeft[i] = this.slowRng[i].exp(e.dur);
    return this.slowLeft[i] > 0 ? this.slowP[a.mind.traits.forager ? 1 : 0] : this.walkFor(p, a);
  }

  /** Advance the oracle signal one step; returns each ant's walk-on multiplier. */
  private oracleStep(dt: number, outside: boolean[]): (i: number) => number {
    const o = this.o.oracle!;
    const ants = this.w.ants;
    if (o.kind === 'placebo') {
      if (!this.oracleRng.length) {
        for (let i = 0; i < ants.length; i++) {
          this.oracleRng.push(RNG.stream(this.o.seed, 0x0c0a, i));
          this.oracleOu.push(o.sd * this.oracleRng[i].gauss());
        }
      }
      const k = Math.exp(-dt / o.tauC);
      const sd = o.sd * Math.sqrt(1 - k * k);
      for (let i = 0; i < ants.length; i++) this.oracleOu[i] = this.oracleOu[i] * k + sd * this.oracleRng[i].gauss();
      return (i) => Math.exp(this.oracleOu[i]);
    }
    let n = 0;
    let moving = 0;
    for (let i = 0; i < ants.length; i++) {
      if (!ants[i].body.alive || outside[i]) continue;
      n++;
      if (ants[i].mind.mode !== 'rest') moving++;
    }
    const u = n ? moving / n : 0;
    if (Number.isNaN(this.oracleU)) this.oracleU = this.oracleSlow = u;
    this.oracleU += (u - this.oracleU) * (1 - Math.exp(-dt / o.tauC));
    this.oracleSlow += (u - this.oracleSlow) * (1 - Math.exp(-dt / 1800));
    const g = this.oracleSlow > 0 ? Math.min(4, Math.max(0.25, Math.pow(this.oracleU / this.oracleSlow, o.kappa))) : 1;
    if (this.stepIndex * dt >= 1800) {
      const l = Math.log(g);
      this.oracleLogSum += l;
      this.oracleLogSq += l * l;
      this.oracleLogN++;
    }
    return () => g;
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
    // Perceive (same state for all), then decide.
    w.contactGrid?.build(w.ants);
    const fast = this.o.fastPath !== false;
    const contacts = fast ? senseAllContacts(w, this.pairCache) : null;
    // Fast path: a nest worker resting at the start of the step decides from what its rest mode reads.
    const resting = w.ants.map((a, i) => fast && a.body.alive && !outside[i] && a.mind.mode === 'rest');
    const per: (SurfacePercept | null)[] = w.ants.map((a, i) => (!a.body.alive ? null : resting[i] ? perceiveResting(w, a.body, dt, contacts![i]) : perceive(w, a.body, dt, contacts?.[i])));
    const orc = this.o.oracle ? this.oracleStep(dt, outside) : null;
    const acts: (NestAction | ForagerAction | null)[] = w.ants.map((a, i) => {
      const p = per[i];
      if (!p) return null;
      if (outside[i]) return lasiusForager(p, interocept(a.body), a.mind, this.foragerP, a.body.rng);
      if (!orc) return lasiusNestWorker(p, interocept(a.body), a.mind, P.nest, a.body.rng);
      const base = P.nest.restToActive;
      P.nest.restToActive = base * orc(i);
      try {
        return lasiusNestWorker(p, interocept(a.body), a.mind, P.nest, a.body.rng);
      } finally {
        P.nest.restToActive = base;
      }
    });
    // A resting ant that walks this step (it woke, or leaves or returns) gets the full percept of the same pre-move state.
    w.ants.forEach((a, i) => {
      if (resting[i] && acts[i] && !(acts[i] as NestAction).stand) per[i] = perceive(w, a.body, dt, contacts![i]);
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
      // A partial step (a rest/walk switch inside it) walks through a percept with the shorter dt.
      const p = per[i]!;
      const wp = this.o.slowEp && p.inNest ? this.slowWalk(i, a, p, !na.stand, dt) : this.walkFor(p, a);
      if (!na.stand) walked[i] = walkAnt(w, a, na.walkFrac !== undefined ? { ...p, dt: p.dt * na.walkFrac } : p, wp, P.phys, na.motor, this.motor);
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
