import { Body } from '../agent/body';
import { RNG } from '../core/rng';
import { drawTraits, lasiusForager, startTrip, type ForagerParams } from '../behavior/lasiusForager';
import { newMind } from '../mind/mind';
import type { WalkParams } from '../models/walk';
import { interocept, perceive } from '../perception/perceive';
import { applyForagerAction, type PhysParams } from '../physics/antPhysics';
import { E2_CONTEXT } from '../species/lasiusM1';
import { mailleuxApparatus } from '../world/apparatus';
import { SugarDroplet } from '../world/food';
import { World, type Agent } from '../world/world';

/**
 * E2 — scouts at sucrose drops in the Mailleux et al. apparatus
 * (nest → bridge → 6 × 6 cm area; 22 °C). One scout at a time, as in the
 * experiments; measurements follow the papers' definitions.
 */
export interface LasiusParams {
  walk: WalkParams;
  forager: ForagerParams;
  phys: PhysParams;
  morph: { len: number; mass: number; cropCapacity: number; antennaReach: number; reserveDays: number };
}

export interface ScoutResult {
  /** From entering the area to first touching the drop (s). */
  findTime: number;
  /** Per drop: volume as the experimenter would estimate it, true volume removed from the drop, drinking time. */
  drinks: { ul: number; trueUl: number; time: number }[];
  /** Laid trail on the return trip (any gaster contact) — overall and per bridge section. */
  laidTrail: boolean;
  laidSection1: boolean;
  laidSection2: boolean;
  /** Fraction of the return trip with the gaster down. */
  intensity: number;
  /** From leaving the (last) food to entering the nest (s). */
  returnTime: number;
  /** From stopping at drop 1 to starting at drop 2 (s); NaN if no second drop drunk. */
  betweenTime: number;
  /** From entering the area to the end of the run (s). Not the 2009 "Total" (drinking + between + drinking; see e2Targets two.total). */
  total: number;
  satisfiedAt1: boolean;
  reachedNest: boolean;
  /** Distinct drops drunk from (2003: "micropipettes visited"). */
  dropsVisited: number;
  /** One gaster estimate of the total intake (true + observer noise), and the true total (µL). */
  totalUl: number;
  totalTrueUl: number;
  /** First drop contact → leaving the area onto the bridge for the last time (s). */
  exploitTime: number;
  /** Gaster contact on the first 2.5 cm of the bridge from the area (2003 trail criterion). */
  laidFirst25: boolean;
  /** End of the last drink → first crossing of the mid-bridge on the way back (s; Mailleux 2000/2006 giving-up time); NaN if never crossed. */
  givingUpTime: number;
  /**
   * Homebound walking speed over the 2.5 cm at mid-bridge (mm/s; Mailleux
   * 2000/2006 "velocity in"): 25 mm ÷ the time from crossing x = 72.5 to
   * crossing x = 47.5 mm in return mode, first passage; NaN if none.
   */
  homeSpeedMidBridge: number;
}

export interface ScoutOptions {
  seed: number;
  /** Drop at the area centre: volume (µL), molarity. */
  drop1: { ul: number; molar: number };
  /** Optional second drop on the bridge, offered on the way home (Mailleux 2009). */
  drop2?: { ul: number; molar: number };
  /**
   * Drops present from the start at explicit positions (mm), replacing drop1
   * (Mailleux 2003: six 0.3 µL micropipettes).
   */
  drops?: { x: number; y: number; ul: number; molar: number }[];
  /** Fraction of a micropipette drop that can be imbibed. */
  pipetteAccessible: number;
  /** Factor on the walker's speed in this apparatus (default: the derived E2 context factor). */
  walkSpeedFactor?: number;
  /** Factor on the desired volume (desiredFed, desiredHungry) of this cohort (default 1; the step-3d cohort diagnostic). */
  desiredScale?: number;
  starvationDays: number;
  /** SD (µL) of the experimenter's gaster-ellipsoid volume estimate (observation noise). */
  volumeSd?: number;
  dt?: number;
  maxTime?: number;
}

/** x (mm) where the bridge meets the foraging area in the Mailleux apparatus. */
const AREA_X = 120;
/** The 2.5 cm section at mid-bridge where the papers measured walking velocity (mm). */
const MID_LO = AREA_X / 2 - 12.5;
const MID_HI = AREA_X / 2 + 12.5;

export function runScout(P: LasiusParams, o: ScoutOptions): ScoutResult {
  return runScoutWorld(P, o).result;
}

/** As runScout, also returning the world (for conservation checks and visualisation). */
export function runScoutWorld(P: LasiusParams, o: ScoutOptions, onStep?: (w: World) => void): { result: ScoutResult; world: World } {
  const dt = o.dt ?? 0.05;
  const { app, entrance, feeder1, feeder2 } = mailleuxApparatus();
  const w = new World(app, entrance, o.seed, 22, 50);
  const m = P.morph;
  const reserveMax = (P.phys.metabolic * Math.pow(m.mass, 0.75) * 24 * m.reserveDays) / 1; // mg at ~resting rate
  const body = new Body(1, o.seed, { len: m.len, mass: m.mass, cropCapacity: m.cropCapacity, antennaReach: m.antennaReach }, Math.max(0.02, 1 - o.starvationDays / m.reserveDays), reserveMax);
  w.ledger.move('sugar', 'external', 'reserve', body.reserve);
  w.ledger.move('water', 'external', 'reserve', body.water);
  // The papers observe scouts from the moment they reach the foraging area,
  // so the scout starts at the area end of the bridge, with the path-integration
  // state it would have after walking the bridge (true displacement read
  // through its per-trip compass bias).
  const start = app.regions.find((r) => r.kind === 'arena')!.x0 - 2;
  body.x = start;
  body.y = entrance[1];
  body.heading = 0;
  // Physiological trait from its own stream (does not shift behavioural draws).
  const physRng = RNG.stream(o.seed, 0x1a7a);
  body.intakeFactor = Math.exp(physRng.normal(0, P.phys.intakeSd) - (P.phys.intakeSd * P.phys.intakeSd) / 2);
  // The experimenter's volume estimates, from another independent stream.
  const obsRng = RNG.stream(o.seed, 0x0b5e);
  // The E1 walker in the E2 context (22 °C, bridge): speed scaled by the derived context factor.
  const f = o.walkSpeedFactor ?? E2_CONTEXT.walkSpeedFactor;
  const walkP = f === 1 ? P.walk : { ...P.walk, speed: P.walk.speed * f };
  const ds = o.desiredScale ?? 1;
  const forager = ds === 1 ? P.forager : { ...P.forager, desiredFed: P.forager.desiredFed * ds, desiredHungry: P.forager.desiredHungry * ds };
  const mind = newMind(drawTraits(forager, body.rng), walkP, body.rng);
  mind.walk.heading = 0;
  const agent: Agent = { body, mind, inactive: false };
  w.ants.push(agent);
  startTrip(mind, forager, interocept(body), body.rng);
  const walked = start - entrance[0];
  mind.pi.x = Math.cos(mind.piBias) * walked;
  mind.pi.y = Math.sin(mind.piBias) * walked;
  if (o.drops) for (const d of o.drops) w.addFood((id) => new SugarDroplet(id, d.x, d.y, d.ul, d.molar, o.pipetteAccessible));
  else w.addFood((id) => new SugarDroplet(id, feeder1[0], feeder1[1], o.drop1.ul, o.drop1.molar, o.pipetteAccessible));

  const res: ScoutResult = { findTime: NaN, drinks: [], laidTrail: false, laidSection1: false, laidSection2: false, intensity: NaN, returnTime: NaN, betweenTime: NaN, total: NaN, satisfiedAt1: false, reachedNest: false, dropsVisited: 0, totalUl: NaN, totalTrueUl: 0, exploitTime: NaN, laidFirst25: false, givingUpTime: NaN, homeSpeedMidBridge: NaN };
  const visited = new Set<number>();
  let firstContact = NaN;
  let lastExit = NaN;
  let inArea = body.x >= AREA_X;
  let tArea = NaN;
  let drinkStart = NaN;
  let lastDrinkEnd = NaN;
  let firstDrinkEnd = NaN;
  let currentDrinkUl = 0;
  let returnGaster = 0;
  let returnSteps = 0;
  let drop2Added = false;
  let givingUpPending = false;
  let midIn = NaN;
  let prevX = body.x;
  const maxTime = o.maxTime ?? 1800;
  while (w.time < maxTime && !agent.inactive && body.alive) {
    const per = perceive(w, body, dt);
    const io = interocept(body);
    const prevMode = mind.mode;
    const act = lasiusForager(per, io, mind, forager, body.rng);
    applyForagerAction(w, agent, act, per, walkP, P.phys, dt);
    w.time += dt;
    if (onStep) onStep(w);
    // --- Observations (experimenter's view).
    const nowInArea = body.x >= AREA_X;
    if (inArea && !nowInArea) lastExit = w.time;
    inArea = nowInArea;
    if (Number.isNaN(tArea) && body.x >= 120) tArea = w.time;
    if (mind.mode === 'drink' && prevMode !== 'drink') {
      drinkStart = w.time;
      currentDrinkUl = 0;
      visited.add(mind.foodId);
      if (Number.isNaN(firstContact)) firstContact = w.time;
      if (Number.isNaN(res.findTime)) res.findTime = w.time - (Number.isNaN(tArea) ? 0 : tArea);
      if (res.drinks.length === 1) res.betweenTime = w.time - firstDrinkEnd;
      if (o.drop2 && !drop2Added) {
        // The second drop is set out once the scout is at the first one (out of reach on its way out).
        w.addFood((id) => new SugarDroplet(id, feeder2[0], feeder2[1], o.drop2!.ul, o.drop2!.molar, o.pipetteAccessible));
        drop2Added = true;
      }
    }
    // The experimenter's estimate sees what left the drop (crop → midgut transfer stays in the gaster).
    if (mind.mode === 'drink') currentDrinkUl += Math.max(0, body.mouthFlow);
    if (prevMode === 'drink' && mind.mode !== 'drink') {
      const est = currentDrinkUl + (o.volumeSd ? obsRng.normal(0, o.volumeSd) : 0);
      res.drinks.push({ ul: Math.max(0, est), trueUl: currentDrinkUl, time: w.time - drinkStart });
      lastDrinkEnd = w.time;
      res.givingUpTime = NaN;
      givingUpPending = true;
      if (res.drinks.length === 1) {
        firstDrinkEnd = w.time;
        res.satisfiedAt1 = mind.satisfied;
      }
    }
    if (givingUpPending && body.x < AREA_X / 2) {
      res.givingUpTime = w.time - lastDrinkEnd;
      givingUpPending = false;
    }
    if (mind.mode === 'return' && Number.isNaN(res.homeSpeedMidBridge)) {
      if (prevX >= MID_HI && body.x < MID_HI) midIn = w.time;
      if (!Number.isNaN(midIn) && prevX >= MID_LO && body.x < MID_LO) res.homeSpeedMidBridge = (MID_HI - MID_LO) / (w.time - midIn);
    } else if (mind.mode !== 'return') midIn = NaN;
    prevX = body.x;
    if (mind.mode === 'return') {
      returnSteps++;
      if (body.gasterDown) {
        returnGaster++;
        res.laidTrail = true;
        // Section 1: first 3 cm of the bridge from the area; section 2: bridge between drop 2 and the nest.
        if (body.x >= 90 && body.x < 120) res.laidSection1 = true;
        if (body.x >= 10 && body.x < 50) res.laidSection2 = true;
        if (body.x >= AREA_X - 25 && body.x < AREA_X) res.laidFirst25 = true;
      }
    }
  }
  res.reachedNest = agent.inactive;
  res.dropsVisited = visited.size;
  res.totalTrueUl = res.drinks.reduce((s, d) => s + d.trueUl, 0);
  res.totalUl = Math.max(0, res.totalTrueUl + (o.volumeSd ? obsRng.normal(0, o.volumeSd) : 0));
  if (!Number.isNaN(firstContact) && !Number.isNaN(lastExit)) res.exploitTime = lastExit - firstContact;
  if (res.reachedNest && !Number.isNaN(lastDrinkEnd)) res.returnTime = w.time - lastDrinkEnd;
  res.intensity = returnSteps ? returnGaster / returnSteps : NaN;
  if (!Number.isNaN(tArea)) res.total = w.time - tArea;
  return { result: res, world: w };
}
