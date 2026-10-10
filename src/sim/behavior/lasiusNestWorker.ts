import type { RNG } from '../core/rng';
import { newStay, setMode, type Mind } from '../mind/mind';
import type { MotorMod } from '../models/walk';
import type { ContactPercept, Interoception, SurfacePercept } from '../perception/types';

/**
 * In-nest worker policy — PROVISIONAL (step 4 bounded version, STATUS
 * 2026-10-08): structure for inspecting movement, contacts and food flow;
 * every rate and threshold is a placeholder, not calibrated, and none is
 * compared with E6 yet.
 *
 * Modes: rest (stand), active (walk), give / receive (trophallaxis with
 * `m.partner`), leave (walk to the entrance to forage; the colony runner then
 * hands the ant to the forager policy).
 *   - Sharing starts on antennal contact: an ant carrying food (crop above
 *     `giveFrac` of capacity) shows an offering signal (`offer`) and offers
 *     to a soliciting nestmate; a hungry ant (reserve below
 *     `receiveReserve`, crop not full, not carrying) shows a soliciting
 *     signal (`solicit`) and accepts from an offering nestmate.
 *     One threshold (`giveFrac`) decides both sides (STATUS 2026-10-10: a
 *     separate crop-volume cue had deadlocked givers between the two). Food moves only when both agree (physics), with
 *     the pair held face to face.
 *   - Sharing ends when the donor's crop falls below `giveFrac`, the
 *     receiver is full or no longer hungry, nothing flowed for `stallTime`
 *     (the partner declined or left), or at the hazard `shareEnd`. The two
     then part: neither shares with the other again until their antennal
     contact has been lost — for every former partner, not just the last
     (STATUS 2026-10-10; before, an ended bout restarted at once with the
     same partner).
 *   - Hungry ants with a nearly empty crop leave to forage at rate
 *     `leaveRate` × their individual `forageDrive`.
 *   - Return to a known source (STATUS 2026-10-09, Mailleux 1999
 *     calibration): an ant that fed at a source on its last trip
 *     (`m.trip.ingested` > 0, reset when a trip starts) leaves again at hazard
 *     `returnRate` once its crop is below `giveFrac`, or with its load once
 *     it has passed no food for `giveUpTime` (STATUS 2026-10-10).
 *   - Nest fidelity: a worker outside the nest that is not on a foraging
 *     trip heads back to the entrance (gain `leaveGain`) and does not rest.
 */
export interface NestParams {
  /** Switching rates between resting and walking (1/s). */
  restToActive: number;
  activeToRest: number;
  /** Crop fill (fraction of capacity) above which an ant offers food. */
  giveFrac: number;
  /** Reserve fraction below which an ant accepts food. */
  receiveReserve: number;
  /** Ending hazard of a sharing bout (1/s) and the no-flow timeout (s). */
  shareEnd: number;
  stallTime: number;
  /** Transfer rate (µL/s). */
  shareRate: number;
  /** Base rate (1/s) at which a hungry ant with an empty crop leaves to forage; SD of log forageDrive. */
  leaveRate: number;
  /** Crop fill (fraction of capacity) below which the crop counts as empty for leaving to forage. */
  leaveCropFrac: number;
  forageDriveSd: number;
  /** Steering gain towards the entrance while leaving, or returning after straying out (1/s). */
  leaveGain: number;
  /** Hazard (1/s) of leaving for a known source once unloaded (ants that fed on their last trip). */
  returnRate: number;
  /** Seconds without passing food after which a carrying ant that fed on its last trip may leave with its load. */
  giveUpTime: number;
  /** Factor on walking speed inside the nest (applied by the runner; the policy does not read it). */
  nestSpeedFactor: number;
  /** SD of log of each nestmate's reserve-deficit factor (between-ant variation; applied by the runner at set-up). */
  reserveSd: number;
}

export interface NestAction {
  motor: MotorMod;
  stand: boolean;
  /** Offer food to / accept food from this nestmate (−1: none). */
  give: number;
  receive: number;
  /** Left the nest: the runner switches the ant to the forager policy. */
  leaveNest: boolean;
  /** Show the offering signal (the runner sets the body's `offering`, sensed by nestmates next step). */
  offer: boolean;
  /** Show the soliciting signal (body `soliciting`, sensed next step). */
  solicit: boolean;
}

const NONE: NestAction = {
  motor: { noHomeBias: true },
  stand: false,
  give: -1,
  receive: -1,
  leaveNest: false,
  offer: false,
  solicit: false,
};

export function drawNestTraits(p: NestParams, rng: RNG): { forageDrive: number } {
  return {
    forageDrive: Math.exp(rng.normal(0, p.forageDriveSd) - (p.forageDriveSd * p.forageDriveSd) / 2),
  };
}

// Mode entry functions (STATUS 2026-10-10): every nest transition goes through one of these.

/** The ant enters (or starts in) the nest: a fresh stay record (no bout, no partner memory), resting or active. */
export function enterNest(m: Mind, rest = false): void {
  m.stay = newStay();
  setMode(m, rest ? 'rest' : 'active');
}

function toActive(m: Mind): void {
  setMode(m, 'active');
}

function toRest(m: Mind): void {
  setMode(m, 'rest');
}

function toLeave(m: Mind): void {
  setMode(m, 'leave');
}

function startBout(m: Mind, partner: number, mode: 'give' | 'receive'): void {
  m.stay.bout = { partner, stall: 0, joined: false };
  setMode(m, mode);
}

/** A bout ends (either side, any reason): the two part; the partner is excluded until contact with it is lost. */
function endBout(m: Mind): void {
  const j = m.stay.bout?.partner ?? -1;
  if (j >= 0 && !m.stay.parted.includes(j)) m.stay.parted.push(j);
  m.stay.bout = null;
  setMode(m, 'active');
}

/** Holds food to give: the one predicate behind both offering (the signal) and giving (STATUS 2026-10-10). */
const hasFoodToGive = (io: Interoception, p: NestParams) => io.cropUl > p.giveFrac * io.cropCapacity;
/** Accepts food: the one predicate behind both soliciting (the signal) and receiving. */
const acceptsFood = (io: Interoception, p: NestParams) => io.reserve < p.receiveReserve && !io.cropFull;

/**
 * An ant that fed on its last trip leaves for the source at hazard
 * `returnRate` once unloaded, or still carrying once it has passed no food
 * for `giveUpTime` (nobody takes its load; STATUS 2026-10-10).
 */
function returning(m: Mind, p: NestParams, carrying: boolean, dt: number, rng: RNG): boolean {
  if ((carrying && m.stay.sinceGive < p.giveUpTime) || !(m.trip.ingested > 0) || !rng.hazard(p.returnRate, dt)) return false;
  toLeave(m);
  return true;
}

export function lasiusNestWorker(per: SurfacePercept, io: Interoception, m: Mind, p: NestParams, rng: RNG): NestAction {
  const act = decide(per, io, m, p, rng);
  // Signals, shown in the nest and not on the way out: offering while holding food to give; soliciting while
  // accepting food and holding none to give (a carrying ant is a donor).
  const signals = per.inNest && m.mode !== 'leave';
  const offer = signals && hasFoodToGive(io, p);
  return { ...act, offer, solicit: signals && !offer && acceptsFood(io, p) };
}

function decide(per: SurfacePercept, io: Interoception, m: Mind, p: NestParams, rng: RNG): NestAction {
  m.modeTime += per.dt;
  const carrying = hasFoodToGive(io, p);
  const hungry = acceptsFood(io, p);
  const stay = m.stay;
  stay.sinceGive = io.mouthFlow < 0 ? 0 : stay.sinceGive + per.dt;
  // After a bout the two ants part: each former partner becomes eligible again once antennal contact with it is lost.
  if (stay.parted.length) stay.parted = stay.parted.filter((j) => per.contacts.some((x) => x.id === j));

  if (m.mode === 'give' || m.mode === 'receive') {
    const bout = stay.bout!;
    const c = per.contacts.find((x) => x.id === bout.partner);
    // Flow is sensed at the mouthparts (crop volume also falls as the crop is absorbed).
    const flowed = m.mode === 'give' ? io.mouthFlow < 0 : io.mouthFlow > 0;
    bout.stall = flowed ? 0 : bout.stall + per.dt;
    // Once the partner has joined (shown sharing with me), its leaving the bout ends it on this side too, sensed one
    // step later; no food flowed meanwhile, as transfer needs both. Before it joins, an invitation waits for it
    // until the stall timeout (signals are sensed a step late, so a partner may join a step after being picked).
    if (c?.sharingWithMe) bout.joined = true;
    const partnerOut = !c || (bout.joined && !c.sharingWithMe);
    const done = partnerOut || (m.mode === 'give' ? !carrying : !hungry) || bout.stall > p.stallTime || rng.hazard(p.shareEnd, per.dt);
    if (!done)
      return {
        ...NONE,
        stand: true,
        give: m.mode === 'give' ? bout.partner : -1,
        receive: m.mode === 'receive' ? bout.partner : -1,
      };
    // Defined outcome of an ending: active, walking on, no new partner this step.
    endBout(m);
    return { ...NONE };
  }

  // Start sharing with a nestmate in antennal contact (the nearest suitable one): not a former partner still in
  // contact, and not one that is sharing with another ant.
  const free = (c: ContactPercept) => !stay.parted.includes(c.id) && (!c.sharing || c.sharingWithMe);
  const pick = (ok: (c: ContactPercept) => boolean) => per.contacts.filter((c) => free(c) && ok(c)).sort((a, b) => a.dist - b.dist || a.id - b.id)[0];
  if (per.inNest && m.mode !== 'leave') {
    // Donors offer only to soliciting nestmates (STATUS 2026-10-10); hungry ants accept from offering ones.
    const partner = carrying ? pick((c) => c.soliciting) : hungry ? pick((c) => c.offering) : undefined;
    if (partner) {
      startBout(m, partner.id, carrying ? 'give' : 'receive');
      return {
        ...NONE,
        stand: true,
        give: carrying ? partner.id : -1,
        receive: carrying ? -1 : partner.id,
      };
    }
  }

  switch (m.mode) {
    case 'leave':
      if (!per.inNest) return { ...NONE, leaveNest: true };
      // Head for the way out: the exit cue where sensed, else the path-integration origin (the entrance).
      return {
        ...NONE,
        motor: {
          goal: per.exitCue ? m.walk.heading + per.exitCue.bearing : Math.atan2(-m.pi.y, -m.pi.x),
          goalGain: p.leaveGain,
          noHomeBias: true,
        },
      };
    case 'rest':
      if (returning(m, p, carrying, per.dt, rng)) return { ...NONE };
      if (rng.hazard(p.restToActive, per.dt) || !per.inNest) toActive(m);
      return { ...NONE, stand: true };
    case 'active': {
      if (per.inNest && returning(m, p, carrying, per.dt, rng)) return { ...NONE };
      // Nest fidelity: a worker that has strayed out of the nest (not on a
      // foraging trip) walks back to the entrance and does not rest outside.
      if (!per.inNest) return { ...NONE, motor: { goal: per.nestCue ? m.walk.heading + per.nestCue.bearing : Math.atan2(-m.pi.y, -m.pi.x), goalGain: p.leaveGain, noHomeBias: true } };
      if (hungry && io.cropUl < p.leaveCropFrac * io.cropCapacity && rng.hazard(p.leaveRate * (m.traits.forageDrive ?? 1), per.dt)) {
        toLeave(m);
        return { ...NONE };
      }
      if (rng.hazard(p.activeToRest, per.dt)) toRest(m);
      return { ...NONE };
    }
    default:
      // A forager mode here means the runner skipped enterNest.
      throw new Error(`lasiusNestWorker: mode '${m.mode}' is not a nest mode (enterNest not called)`);
  }
}
