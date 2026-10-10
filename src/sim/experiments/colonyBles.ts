import { Body } from '../agent/body';
import type { ContactInterval } from '../analysis/trophallaxis';
import { lasiusForager, drawTraits, startTrip, type ForagerAction, type ForagerParams } from '../behavior/lasiusForager';
import { drawNestTraits, lasiusNestWorker, type NestAction, type NestParams } from '../behavior/lasiusNestWorker';
import { RNG } from '../core/rng';
import { newMind, setMode } from '../mind/mind';
import { walkStep } from '../models/walk';
import { interocept, perceive } from '../perception/perceive';
import type { SurfacePercept } from '../perception/types';
import { applyForagerAction, metabolise, walkAnt, type MotorFn } from '../physics/antPhysics';
import { alignFaceToFace, detectContacts, mouthContact } from '../physics/contacts';
import { shareCrop } from '../physics/trophallaxis';
import { E6_CONTEXT } from '../species/lasiusM1';
import { blesApparatus } from '../world/apparatus';
import { SugarDroplet } from '../world/food';
import { PathField } from '../world/pathField';
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

export function runColony(P: ColonyParams, o: ColonyOptions, onStep?: (w: World) => void): ColonyResult {
  const n = o.ants ?? 53;
  const f = o.walkSpeedFactor ?? E6_CONTEXT.walkSpeedFactor;
  const walkP = f === 1 ? P.walk : { ...P.walk, speed: P.walk.speed * f };
  const dt = o.dt ?? 0.1;
  const T = (o.minutes ?? 90) * 60;
  const foodTime = (o.foodMinute ?? 30) * 60;
  const motor = o.motor ?? walkStep;
  const frameEvery = o.frameEvery ?? 0;
  const { app, entrance, feeder } = blesApparatus();
  const w = new World(app, entrance, o.seed, o.tempC ?? 22, 50);
  // Cues along the surface (provisional): nest odour over the whole foraging area, and the way out inside the nest.
  w.nestOdour = new PathField(app, (r) => r.kind === 'nest');
  w.exitCue = new PathField(app, (r) => r.kind !== 'nest');
  w.nestCueRadius = 150;
  const foragerP: ForagerParams = { ...P.forager, exploreGiveUp: o.exploreGiveUp ?? 300 };
  const m = P.morph;
  const reserveMax = P.phys.metabolic * Math.pow(m.mass, 0.75) * 24 * m.reserveDays;
  const nestRegion = app.regions.find((r) => r.kind === 'nest')!;
  const outside: boolean[] = [];
  for (let i = 0; i < n; i++) {
    const body = new Body(i, o.seed, { len: m.len, mass: m.mass, cropCapacity: m.cropCapacity, antennaReach: m.antennaReach }, Math.max(0.02, 1 - (o.starvationDays ?? 4) / m.reserveDays), reserveMax);
    w.ledger.move('sugar', 'external', 'reserve', body.reserve);
    w.ledger.move('water', 'external', 'reserve', body.water);
    // Start positions, headings and in-nest traits from their own streams.
    const place = RNG.stream(o.seed, 0x9e57, i);
    body.x = place.range(nestRegion.x0 + 2, nestRegion.x1 - 2);
    body.y = place.range(nestRegion.y0 + 2, nestRegion.y1 - 2);
    body.heading = place.range(-Math.PI, Math.PI);
    const physRng = RNG.stream(o.seed, 0x1a7a, i);
    body.intakeFactor = Math.exp(physRng.normal(0, P.phys.intakeSd) - (P.phys.intakeSd * P.phys.intakeSd) / 2);
    const traits = { ...drawTraits(P.forager, body.rng), ...drawNestTraits(P.nest, RNG.stream(o.seed, 0x7e57, i)) };
    const mind = newMind(traits, walkP, body.rng);
    mind.walk.heading = body.heading;
    // In the nest the ant knows where it is relative to the entrance (path-integration origin).
    mind.pi.x = body.x - entrance[0];
    mind.pi.y = body.y - entrance[1];
    setMode(mind, place.chance(0.5) ? 'rest' : 'active');
    w.ants.push({ body, mind, inactive: false });
    outside.push(false);
  }

  const bouts: ShareBout[] = [];
  const open = new Map<string, ShareBout>();
  const forager = new Array<boolean>(n).fill(false);
  const feedRun = new Array<number>(n).fill(0);
  const frames: ColonyFrame[] = [];
  let foodAdded = false;
  let nextFrame = 0;
  const steps = Math.round(T / dt);

  for (let step = 0; step < steps; step++) {
    const t = step * dt;
    w.time = t;
    if (!foodAdded && t >= foodTime) {
      w.addFood((id) => new SugarDroplet(id, feeder[0], feeder[1], o.foodUl ?? 3000, o.molar ?? 1, 1));
      foodAdded = true;
    }
    if (frameEvery > 0 && t >= nextFrame - 1e-9) {
      frames.push(frame(w, t, app.bounds));
      nextFrame += frameEvery;
    }
    // Perceive (same state for all), then decide.
    const per: (SurfacePercept | null)[] = w.ants.map((a) => (a.body.alive ? perceive(w, a.body, dt) : null));
    const acts: (NestAction | ForagerAction | null)[] = w.ants.map((a, i) => {
      const p = per[i];
      if (!p) return null;
      return outside[i] ? lasiusForager(p, interocept(a.body), a.mind, foragerP, a.body.rng) : lasiusNestWorker(p, interocept(a.body), a.mind, P.nest, a.body.rng);
    });
    // Move (and, outside, drink and metabolise as in E2). Mouth flow is re-sensed from here on.
    for (const a of w.ants) a.body.mouthFlow = 0;
    const walked = new Array<number>(n).fill(0);
    w.ants.forEach((a, i) => {
      const act = acts[i];
      if (!act) return;
      if (outside[i]) {
        const before = a.body.cropUl;
        applyForagerAction(w, a, act as ForagerAction, per[i]!, walkP, P.phys, dt, motor);
        // Forager status: ≥ 5 consecutive seconds of feeding at the source.
        feedRun[i] = a.mind.mode === 'drink' && a.body.cropUl > before ? feedRun[i] + dt : 0;
        if (feedRun[i] >= 5 - 1e-9) forager[i] = true;
        return;
      }
      const na = act as NestAction;
      a.body.gasterDown = false;
      a.body.stepLen = 0;
      if (!na.stand) walked[i] = walkAnt(w, a, per[i]!, walkP, P.phys, na.motor, motor);
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
          a.mind.partner = -1;
          setMode(a.mind, 'active');
        }
        return;
      }
      metabolise(w, a.body, P.phys, walked[i] > 0, dt);
      if ((act as NestAction).leaveNest) {
        outside[i] = true;
        startTrip(a.mind, foragerP, interocept(a.body), a.body.rng);
        // startTrip zeroes the path integrator: the ant is at the entrance.
        a.mind.pi.x = a.body.x - entrance[0];
        a.mind.pi.y = a.body.y - entrance[1];
      }
    });
    onStep?.(w);
  }
  for (const bout of open.values()) bouts.push(bout);
  bouts.sort((p, q) => p.start - q.start || p.donor - q.donor || p.receiver - q.receiver);
  const contacts = bouts.filter((b) => b.end > foodTime).map((b) => ({ donor: b.donor, receiver: b.receiver, start: b.start - foodTime, end: b.end - foodTime }));
  return { world: w, bouts, contacts, forager, frames, foodTime };
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
    f.partner[i] = a.mind.mode === 'give' || a.mind.mode === 'receive' ? a.mind.partner : -1;
  });
  return f;
}
