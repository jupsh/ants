import { Body } from '../agent/body';
import type { ContactInterval } from '../analysis/trophallaxis';
import { lasiusForager, drawTraits, startTrip, type ForagerAction, type ForagerParams } from '../behavior/lasiusForager';
import { drawNestTraits, enterNest, lasiusNestWorker, type NestAction, type NestParams } from '../behavior/lasiusNestWorker';
import { deepClone } from '../core/clone';
import { RNG } from '../core/rng';
import { stepDrive } from '../mind/drive';
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
   * modulation without sharing; with `meanOne`, g = exp(x_i − sd²/2), stationary mean 1 (STATUS 2026-10-17 ≈ 13:15 UTC).
   * `shift` (placebo): g = exp(x_i + shift), added to `meanOne`'s −sd²/2 if both are set; set from the coupled arm's
   * realised E[g] for the matched placebo (D108 amendment 1). `const`: g = `factor` for every ant at every step (the
   * rate-only arm of the mean-matched comparison). Absent: nothing changes.
   */
  oracle?:
    | { kind: 'coupled'; kappa: number; tauC: number }
    | { kind: 'placebo'; sd: number; tauC: number; meanOne?: boolean; shift?: number }
    | { kind: 'const'; factor: number }
    | { kind: 'coupledX'; kappa: number; tauC: number }
    | { kind: 'local'; kappa: number; r: number; tauC: number }
    | { kind: 'driverShared'; amp: number; tau: number }
    | { kind: 'driverLocal'; amp: number; sigma: number; mu?: number; dur?: number };
  /*
   * Part C (D115 amendment 1, D117; diagnostics, never adoptable):
   * - `coupledX`: the global coupling with the focal ant excluded. Ant i's input m_i is the moving fraction of the other
   *   in-nest ants; u_i relaxes toward it with τ_c from ū; g_i = clamp((u_i / ū)^κ, 0.25, 4), ū the colony's slow
   *   (1800 s) moving fraction. With no other in-nest ant, g_i = 1 and u_i is reset to ū.
   * - `local`: the same with only the other in-nest ants within `r` mm (true positions); r = ∞ is `coupledX`.
   * - `driverShared`: g = exp(A·z − A²/2) for every in-nest ant, z a unit OU process (τ `tau` s) on its own stream.
   * - `driverLocal`: disturbance events (Poisson, mean active count `mu` (1), each `dur` s (60) at a uniform nest
   *   position); g_i = exp(A·S_i − c(x_i)), S_i = Σ exp(−d² / 2σ²), c(x) = μ·(E_Y[exp(A·w(|x − Y|))] − 1) over Y uniform
   *   in the nest (tabulated on a 1-mm grid), so E[g | x] = 1 under the prescribed process.
   */
  /**
   * Realised-signal recorder for the oracle (D108 amendments 1–2; observation only): every `every` s in [`from`, `to`)
   * (defaults 1800 s and the end), log g is appended to `ColonySim.oracleTrace`. The coupled arm gives one series (the colony's g). The placebo
   * gives one per ant: NaN while the ant is outside or dead. Needs `oracle` coupled or placebo. Absent: nothing recorded.
   */
  oracleTrace?: { every: number; from?: number; to?: number };
  /**
   * The oracle's multiplier reaches nurses and foragers (their own `P.nest.forager` walk-on value too; fixed 2026-10-17
   * ≈ 21:17 UTC). `oracleNurseOnly`: the earlier behaviour, nurses only (STATUS 16:18 defect), to reproduce runs logged
   * before the fix.
   */
  oracleNurseOnly?: boolean;
  /**
   * Slow-episode what-if (STATUS 2026-10-17, overnight; a diagnostic, not a mechanism, not adoptable). An in-nest ant
   * that walks enters, at `rate` per walking second, a slow episode of exponential duration (mean `dur` s) during which
   * its walker's speed is × `factor`; the episode ends early if it stops. Absent: nothing changes.
   */
  slowEp?: { rate: number; dur: number; factor: number };
  /**
   * Comparison Q (STATUS 2026-10-17 ≈ 16:19 UTC; diagnostics, not mechanisms, not adoptable). `wall: 'inward'`: in the
   * nest an ant whose step reaches the edge of the surface takes a uniformly drawn heading that stays on the surface
   * (own stream per ant) instead of turning along the edge; `wall: 'specular'` (comparison WR, STATUS ≈ 21:31): the
   * heading is mirrored (of π − h and −h, the one whose next 0.5 mm stays on the surface; both: the smaller turn;
   * neither: reverse), no random draw. `aggregate`: each in-nest ant's stop rate (`activeToRest`,
   * nurse and forager values) × (1 + k·n), n = resting in-nest nestmates within r mm (true state), recounted every 1 s.
   * `site`: stop rate × (1 + k·w(x, y)), w a map on 1-mm cells from (x0, y0), nx × ny, row-major by y. Absent: nothing
   * changes.
   */
  wall?: 'inward' | 'specular';
  /**
   * Comparison T (STATUS 2026-10-17 ≈ 22:59 UTC; diagnostic, not adoptable): an in-nest ant walking in the `active` mode
   * whose action has no motor goal steers (first-order, `gain` 1/s) toward atan2(v), v = Σ unit vectors toward resting
   * in-nest nestmates within `r` mm (true state), recomputed every 1 s; no steering if |v| < 0.5. Rates unchanged.
   */
  taxis?: { gain: number; r: number };
  aggregate?: { k: number; r: number };
  site?: { k: number; x0: number; y0: number; nx: number; ny: number; w: number[] };
  /**
   * Lazy resting ants (backlog B014, DESIGN rev 2; a speed-up, bit-identical to the stepped runs). An in-nest ant
   * whose last full policy call left it standing in rest is advanced by the policy's `restTick` instead, without a
   * percept, while its contact set, its partners' signals and its own position are unchanged; the tick hands any
   * step on which the full call could do anything else back to it. `observe`: ants whose percept is always built
   * (`ColonyStepInfo.per`); otherwise a ticked ant's percept is null. `verify`: on every tick, also run the full
   * policy on a copy and throw at the first difference (checks only; slow). Needs the fast path; refuses the
   * diagnostics that change rates per call or steer from full percepts (oracle, aggregate, site, taxis, slowEp).
   * Honoured by `LazyColonySim` (`newColonySim`, experiments/colonyLazy.ts); `ColonySim` itself ignores it (same
   * results, stepped speed). Absent: nothing changes.
   */
  lazyRest?: { observe?: number[]; verify?: boolean };
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
  /** With `lazyRest`: ants advanced by the policy's rest tick this step (their percept is null unless observed). */
  lazy?: readonly boolean[];
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
  protected foodAdded = false;
  /** Oracle diagnostic state (see `ColonyOptions.oracle`); plain fields so `clone` copies it. */
  private oracleU = NaN;
  private oracleSlow = NaN;
  private readonly oracleOu: number[] = [];
  private readonly oracleRng: RNG[] = [];
  /** Σ and Σ² of log g over the steps after 30 min (coupled), and their count: the signal's variability, read for the placebo's SD. */
  oracleLogSum = 0;
  oracleLogSq = 0;
  oracleLogN = 0;
  /** Part C oracle state: per-ant filters (`coupledX`, `local`), the shared driver's z, the local driver's events. */
  private readonly oracleUi: number[] = [];
  private oracleZ = NaN;
  private readonly oracleEvents: { x: number; y: number; left: number }[] = [];
  private oracleCTable: number[] | null = null;
  private oracleEventsInit = false;
  /** With `oracleTrace`: log g samples, one series per signal (see `ColonyOptions.oracleTrace`). */
  oracleTrace: number[][] = [];
  private oracleNextSample = NaN;
  /** Comparison Q state (see `ColonyOptions.wall` / `aggregate`); plain fields so `clone` copies it. */
  private readonly wallRng: RNG[] = [];
  /** Latent-drive streams, one per ant (created on first use; STATUS 2026-10-18, candidate C2). */
  protected readonly driveRng: RNG[] = [];
  private aggN: number[] = [];
  private aggNext = 0;
  private taxisGoal: number[] = [];
  private taxisNext = 0;
  /** Slow-episode what-if: seconds left in each ant's episode, own streams, the slowed walk parameters (nest, forager). */
  private readonly slowLeft: number[] = [];
  private readonly slowRng: RNG[] = [];
  private slowP: [WalkParams, WalkParams] | null = null;
  /** Ad-libitum sources (topped up every step). */
  protected readonly adLib: SugarDroplet[] = [];
  protected nextFrame = 0;
  private readonly walkP: WalkParams;
  private readonly walkNestP: WalkParams;
  /** In-nest walking for ants with the forager trait (option B: their own speed factor). */
  private readonly walkNestForagerP: WalkParams;
  protected readonly foragerP: ForagerParams;
  protected readonly pairCache?: ContactPairCache;
  protected readonly motor: MotorFn;
  private readonly reserveMax: number;
  private readonly reserveFrac: number;
  private readonly deficit: number;
  protected readonly entrance: [number, number];
  protected readonly feeder: [number, number];

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

  protected addAnt(i: number, x: number, y: number, heading: number, rest: boolean, seed: number): Agent {
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

  protected walkFor(p: SurfacePercept, a: Agent): WalkParams {
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

  /** With `oracleTrace`: whether this step takes a sample (and advance the sample clock). */
  private oracleSampleDue(dt: number): boolean {
    const tr = this.o.oracleTrace;
    if (!tr) return false;
    if (Number.isNaN(this.oracleNextSample)) this.oracleNextSample = tr.from ?? 1800;
    const t = this.stepIndex * dt;
    if (t < this.oracleNextSample - 1e-9 || t >= (tr.to ?? Infinity) - 1e-9) return false;
    this.oracleNextSample += tr.every;
    return true;
  }

  /** Part C kinds (see `ColonyOptions.oracle`): per-ant multipliers, recorded per ant with `oracleTrace`. */
  private oracleStepC(dt: number, outside: boolean[]): (i: number) => number {
    const o = this.o.oracle!;
    const ants = this.w.ants;
    const inNest = ants.map((a, i) => a.body.alive && !outside[i]);
    const logG = new Array<number>(ants.length).fill(0);
    if (o.kind === 'coupledX' || o.kind === 'local') {
      let n = 0;
      let moving = 0;
      const mov = ants.map((a, i) => inNest[i] && a.mind.mode !== 'rest');
      for (let i = 0; i < ants.length; i++) if (inNest[i]) (n++, mov[i] && moving++);
      const u = n ? moving / n : 0;
      if (Number.isNaN(this.oracleSlow)) this.oracleSlow = u;
      this.oracleSlow += (u - this.oracleSlow) * (1 - Math.exp(-dt / 1800));
      const slow = this.oracleSlow;
      // Other in-nest ants (and how many move) within r of each in-nest ant; all others for coupledX.
      const cnt = new Array<number>(ants.length).fill(0);
      const cm = new Array<number>(ants.length).fill(0);
      if (o.kind === 'coupledX') {
        for (let i = 0; i < ants.length; i++) if (inNest[i]) ((cnt[i] = n - 1), (cm[i] = moving - (mov[i] ? 1 : 0)));
      } else {
        const r2 = o.r * o.r;
        for (let i = 0; i < ants.length; i++) {
          if (!inNest[i]) continue;
          const bi = ants[i].body;
          for (let j = i + 1; j < ants.length; j++) {
            if (!inNest[j]) continue;
            const bj = ants[j].body;
            const dx = bi.x - bj.x;
            const dy = bi.y - bj.y;
            if (dx * dx + dy * dy < r2) {
              cnt[i]++;
              cnt[j]++;
              if (mov[j]) cm[i]++;
              if (mov[i]) cm[j]++;
            }
          }
        }
      }
      const k = 1 - Math.exp(-dt / o.tauC);
      for (let i = 0; i < ants.length; i++) {
        // Outside the nest (or dead): reset like an isolated ant, so no coupling carries over a trip (D118 build note).
        if (!inNest[i]) {
          if (i < this.oracleUi.length) this.oracleUi[i] = NaN;
          continue;
        }
        if (cnt[i] === 0) {
          // Isolated: no coupling at this step, and none carried over (D115 amendment 1).
          this.oracleUi[i] = slow;
          continue;
        }
        const ui = Number.isNaN(this.oracleUi[i] ?? NaN) ? slow : this.oracleUi[i];
        this.oracleUi[i] = ui + (cm[i] / cnt[i] - ui) * k;
        logG[i] = slow > 0 ? Math.min(Math.log(4), Math.max(-Math.log(4), o.kappa * Math.log(this.oracleUi[i] / slow))) : 0;
      }
    } else if (o.kind === 'driverShared') {
      const rng = (this.oracleRng[0] ??= RNG.stream(this.o.seed, 0x0c0b));
      if (Number.isNaN(this.oracleZ)) this.oracleZ = rng.gauss();
      const k = Math.exp(-dt / o.tau);
      this.oracleZ = this.oracleZ * k + Math.sqrt(1 - k * k) * rng.gauss();
      const l = o.amp * this.oracleZ - (o.amp * o.amp) / 2;
      for (let i = 0; i < ants.length; i++) if (inNest[i]) logG[i] = l;
    } else if (o.kind === 'driverLocal') {
      const nest = this.w.apparatus.regions.find((r) => r.kind === 'nest')!;
      const mu = o.mu ?? 1;
      const dur = o.dur ?? 60;
      const rng = (this.oracleRng[0] ??= RNG.stream(this.o.seed, 0x0c0c));
      const place = (left: number) => this.oracleEvents.push({ x: rng.range(nest.x0, nest.x1), y: rng.range(nest.y0, nest.y1), left });
      if (!this.oracleEventsInit) {
        // Stationary start: a Poisson number of active events with uniform remaining lives.
        this.oracleEventsInit = true;
        for (let e = rng.poisson(mu); e > 0; e--) place(rng.range(0, dur));
        this.oracleCTable = driverLocalTable(nest, o.amp, o.sigma, mu);
      }
      for (const e of this.oracleEvents) e.left -= dt;
      for (let e = this.oracleEvents.length - 1; e >= 0; e--) if (this.oracleEvents[e].left <= 0) this.oracleEvents.splice(e, 1);
      for (let e = rng.poisson((mu / dur) * dt); e > 0; e--) place(dur);
      const c = this.oracleCTable!;
      const nx = Math.round(nest.x1 - nest.x0);
      const ny = Math.round(nest.y1 - nest.y0);
      const s2 = 2 * o.sigma * o.sigma;
      for (let i = 0; i < ants.length; i++) {
        if (!inNest[i]) continue;
        const b = ants[i].body;
        let S = 0;
        for (const e of this.oracleEvents) S += Math.exp(-((b.x - e.x) ** 2 + (b.y - e.y) ** 2) / s2);
        const cx = Math.min(nx - 1, Math.max(0, Math.floor(b.x - nest.x0)));
        const cy = Math.min(ny - 1, Math.max(0, Math.floor(b.y - nest.y0)));
        logG[i] = o.amp * S - c[cy * nx + cx];
      }
    }
    if (this.oracleSampleDue(dt)) for (let i = 0; i < ants.length; i++) (this.oracleTrace[i] ??= []).push(inNest[i] ? logG[i] : NaN);
    return (i) => Math.exp(logG[i]);
  }

  /** Advance the oracle signal one step; returns each ant's walk-on multiplier. */
  private oracleStep(dt: number, outside: boolean[]): (i: number) => number {
    const o = this.o.oracle!;
    const ants = this.w.ants;
    if (o.kind === 'const') return () => o.factor;
    if (o.kind === 'placebo') {
      // Ants added after the first step (the 1999 recruiter) get their own stream when they appear (D104).
      for (let i = this.oracleRng.length; i < ants.length; i++) {
        this.oracleRng.push(RNG.stream(this.o.seed, 0x0c0a, i));
        this.oracleOu.push(o.sd * this.oracleRng[i].gauss());
      }
      const k = Math.exp(-dt / o.tauC);
      const sd = o.sd * Math.sqrt(1 - k * k);
      for (let i = 0; i < ants.length; i++) this.oracleOu[i] = this.oracleOu[i] * k + sd * this.oracleRng[i].gauss();
      const shift = (o.shift ?? 0) - (o.meanOne ? (o.sd * o.sd) / 2 : 0);
      if (this.oracleSampleDue(dt)) {
        for (let i = 0; i < ants.length; i++) (this.oracleTrace[i] ??= []).push(ants[i].body.alive && !outside[i] ? this.oracleOu[i] + shift : NaN);
      }
      return (i) => Math.exp(this.oracleOu[i] + shift);
    }
    if (o.kind !== 'coupled') return this.oracleStepC(dt, outside);
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
      if (this.oracleSampleDue(dt)) {
        (this.oracleTrace[0] ??= []).push(l);
      }
    }
    return () => g;
  }

  /** Comparison Q: each in-nest ant's stop-rate multiplier this step (`aggregate` × `site`). */
  private stopMultStep(t: number, outside: boolean[]): (i: number) => number {
    const ants = this.w.ants;
    const ag = this.o.aggregate;
    if (ag && t >= this.aggNext - 1e-9) {
      this.aggNext = t + 1;
      const r2 = ag.r * ag.r;
      const rest = ants.map((a, i) => a.body.alive && !outside[i] && a.mind.mode === 'rest');
      this.aggN = ants.map((a, i) => {
        if (!a.body.alive || outside[i]) return 0;
        let n = 0;
        for (let j = 0; j < ants.length; j++) {
          if (j === i || !rest[j]) continue;
          const dx = ants[j].body.x - a.body.x;
          const dy = ants[j].body.y - a.body.y;
          if (dx * dx + dy * dy < r2) n++;
        }
        return n;
      });
    }
    const st = this.o.site;
    return (i) => {
      let g = ag ? 1 + ag.k * (this.aggN[i] ?? 0) : 1;
      if (st) {
        const cx = Math.floor(ants[i].body.x - st.x0);
        const cy = Math.floor(ants[i].body.y - st.y0);
        if (cx >= 0 && cy >= 0 && cx < st.nx && cy < st.ny) g *= 1 + st.k * st.w[cy * st.nx + cx];
      }
      return g;
    };
  }

  /** Comparison Q `wall: 'inward'`: a uniformly drawn heading whose next 0.5 mm stays on the surface (else reverse). */
  protected inwardTurn(i: number): (x: number, y: number, h: number, walkable: (x: number, y: number) => boolean) => number {
    const rng = (this.wallRng[i] ??= RNG.stream(this.o.seed, 0x0e1d, i));
    return (x, y, h, walkable) => {
      for (let k = 0; k < 36; k++) {
        const g = rng.range(0, 2 * Math.PI);
        if (walkable(x + Math.cos(g) * 0.5, y + Math.sin(g) * 0.5)) return g;
      }
      return h + Math.PI;
    };
  }

  /** Comparison T: each ant's taxis goal heading (NaN: none), recomputed every 1 s. */
  private taxisStep(t: number, outside: boolean[]): number[] {
    const tx = this.o.taxis!;
    if (t >= this.taxisNext - 1e-9) {
      this.taxisNext = t + 1;
      const ants = this.w.ants;
      const r2 = tx.r * tx.r;
      const rest = ants.map((a, i) => a.body.alive && !outside[i] && a.mind.mode === 'rest');
      this.taxisGoal = ants.map((a, i) => {
        if (!a.body.alive || outside[i]) return NaN;
        let vx = 0;
        let vy = 0;
        for (let j = 0; j < ants.length; j++) {
          if (j === i || !rest[j]) continue;
          const dx = ants[j].body.x - a.body.x;
          const dy = ants[j].body.y - a.body.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= r2 || d2 === 0) continue;
          const d = Math.sqrt(d2);
          vx += dx / d;
          vy += dy / d;
        }
        return Math.hypot(vx, vy) < 0.5 ? NaN : Math.atan2(vy, vx);
      });
    }
    return this.taxisGoal;
  }

  /** Comparison WR `wall: 'specular'`: the mirrored heading that stays on the surface (else reverse). */
  protected static specularTurn(x: number, y: number, h: number, walkable: (x: number, y: number) => boolean): number {
    const turn = (g: number) => Math.abs(Math.atan2(Math.sin(g - h), Math.cos(g - h)));
    const ok = [Math.PI - h, -h].filter((g) => walkable(x + Math.cos(g) * 0.5, y + Math.sin(g) * 0.5));
    if (!ok.length) return h + Math.PI;
    return ok.length === 1 || turn(ok[0]) <= turn(ok[1]) ? ok[0] : ok[1];
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
    // The latent activity drive runs for every ant wherever it is (drawn only when some role uses it).
    if (P.nest.driveSd > 0 || (P.nest.forager?.driveSd ?? 0) > 0)
      w.ants.forEach((a, i) => {
        if (a.body.alive) stepDrive(a.mind, P.nest.driveTau, dt, (this.driveRng[i] ??= RNG.stream(this.o.seed, 0xd21e, i)));
      });
    const orc = this.o.oracle ? this.oracleStep(dt, outside) : null;
    const stopMult = this.o.aggregate || this.o.site ? this.stopMultStep(t, outside) : null;
    const acts: (NestAction | ForagerAction | null)[] = w.ants.map((a, i) => {
      const p = per[i];
      if (!p) return null;
      if (outside[i]) return lasiusForager(p, interocept(a.body), a.mind, this.foragerP, a.body.rng);
      if (!orc && !stopMult) return lasiusNestWorker(p, interocept(a.body), a.mind, P.nest, a.body.rng);
      // The oracle scales the nurse and forager walk-on values (nurses only with `oracleNurseOnly`, the pre-fix
      // behaviour); the comparison-Q multiplier scales the nurse and forager stop rates.
      const base = P.nest.restToActive;
      const baseA = P.nest.activeToRest;
      const f = P.nest.forager;
      const fA = f?.activeToRest;
      const fR = f?.restToActive;
      if (orc) {
        const g = orc(i);
        P.nest.restToActive = base * g;
        if (f && fR !== undefined && !this.o.oracleNurseOnly) f.restToActive = fR * g;
      }
      if (stopMult) {
        const g = stopMult(i);
        P.nest.activeToRest = baseA * g;
        if (f && fA !== undefined) f.activeToRest = fA * g;
      }
      try {
        return lasiusNestWorker(p, interocept(a.body), a.mind, P.nest, a.body.rng);
      } finally {
        P.nest.restToActive = base;
        P.nest.activeToRest = baseA;
        if (f && fA !== undefined) f.activeToRest = fA;
        if (f && fR !== undefined) f.restToActive = fR;
      }
    });
    // Comparison T: walking in-nest ants without a motor goal steer toward resting nestmates (what-if, true state).
    if (this.o.taxis) {
      const goal = this.taxisStep(t, outside);
      w.ants.forEach((a, i) => {
        const na = acts[i] as NestAction | null;
        if (!na || outside[i] || na.stand || a.mind.mode !== 'active' || na.motor?.goal !== undefined || Number.isNaN(goal[i])) return;
        acts[i] = { ...na, motor: { ...na.motor, goal: goal[i], goalGain: this.o.taxis!.gain } };
      });
    }
    // A resting ant that walks this step (it woke, or leaves or returns) gets the full percept of the same pre-move state.
    w.ants.forEach((a, i) => {
      if (resting[i] && acts[i] && !(acts[i] as NestAction).stand) per[i] = perceive(w, a.body, dt, contacts![i]);
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
      // A partial step (a rest/walk switch inside it) walks through a percept with the shorter dt.
      const p = per[i]!;
      const wp = this.o.slowEp && p.inNest ? this.slowWalk(i, a, p, !na.stand, dt) : this.walkFor(p, a);
      if (!na.stand) walked[i] = walkAnt(w, a, na.walkFrac !== undefined ? { ...p, dt: p.dt * na.walkFrac } : p, wp, P.phys, na.motor, this.motor, undefined, wall === 'inward' ? this.inwardTurn(i) : wall === 'specular' ? ColonySim.specularTurn : undefined);
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

export function frame(w: World, t: number, bounds: { x0: number; y0: number; x1: number; y1: number }): ColonyFrame {
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

/**
 * `driverLocal`'s normalisation (D115 amendment 1): c(x) = μ·(mean over Y of exp(A·exp(−|x − Y|² / 2σ²)) − 1), Y over the
 * 1-mm cell centres of the nest, for every cell x (row-major, y then x). E[exp(A·S(x) − c(x))] = 1 for Poisson events
 * with mean active count μ at uniform positions (the log Laplace functional).
 */
export function driverLocalTable(nest: { x0: number; x1: number; y0: number; y1: number }, amp: number, sigma: number, mu: number): number[] {
  const nx = Math.round(nest.x1 - nest.x0);
  const ny = Math.round(nest.y1 - nest.y0);
  const s2 = 2 * sigma * sigma;
  const out = new Array<number>(nx * ny);
  for (let cy = 0; cy < ny; cy++)
    for (let cx = 0; cx < nx; cx++) {
      let sum = 0;
      for (let yy = 0; yy < ny; yy++) for (let xx = 0; xx < nx; xx++) sum += Math.exp(amp * Math.exp(-((cx - xx) ** 2 + (cy - yy) ** 2) / s2));
      out[cy * nx + cx] = mu * (sum / (nx * ny) - 1);
    }
  return out;
}
