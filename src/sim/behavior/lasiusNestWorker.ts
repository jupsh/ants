import type { RNG } from '../core/rng';
import { setMode, type Mind } from '../mind/mind';
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
 *     `giveFrac` of capacity) offers to a nestmate that is not carrying; a
 *     hungry ant (reserve below `receiveReserve`, crop not full) accepts from
 *     a carrying nestmate. Food moves only when both agree (physics), with
 *     the pair held face to face.
 *   - Sharing ends when the donor's crop falls below `giveFrac`, the
 *     receiver is full or no longer hungry, nothing flowed for `stallTime`
 *     (the partner declined or left), or at the hazard `shareEnd`.
 *   - Hungry ants with a nearly empty crop leave to forage at rate
 *     `leaveRate` × their individual `forageDrive`.
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
  forageDriveSd: number;
  /** Steering gain towards the entrance while leaving, or returning after straying out (1/s). */
  leaveGain: number;
}

export interface NestAction {
  motor: MotorMod;
  stand: boolean;
  /** Offer food to / accept food from this nestmate (−1: none). */
  give: number;
  receive: number;
  /** Left the nest: the runner switches the ant to the forager policy. */
  leaveNest: boolean;
}

const NONE: NestAction = {
  motor: { noHomeBias: true },
  stand: false,
  give: -1,
  receive: -1,
  leaveNest: false,
};

export function drawNestTraits(p: NestParams, rng: RNG): { forageDrive: number } {
  return {
    forageDrive: Math.exp(rng.normal(0, p.forageDriveSd) - (p.forageDriveSd * p.forageDriveSd) / 2),
  };
}

export function lasiusNestWorker(per: SurfacePercept, io: Interoception, m: Mind, p: NestParams, rng: RNG): NestAction {
  m.modeTime += per.dt;
  const carrying = io.cropUl > p.giveFrac * io.cropCapacity;
  const hungry = io.reserve < p.receiveReserve && io.cropUl < 0.98 * io.cropCapacity;

  if (m.mode === 'give' || m.mode === 'receive') {
    const c = per.contacts.find((x) => x.id === m.partner);
    // Flow is sensed at the mouthparts (crop volume also falls as the crop is absorbed).
    const flowed = m.mode === 'give' ? io.mouthFlow < 0 : io.mouthFlow > 0;
    m.shareStall = flowed ? 0 : m.shareStall + per.dt;
    const done = !c || (m.mode === 'give' ? !carrying : !hungry) || m.shareStall > p.stallTime || rng.hazard(p.shareEnd, per.dt);
    if (!done)
      return {
        ...NONE,
        stand: true,
        give: m.mode === 'give' ? m.partner : -1,
        receive: m.mode === 'receive' ? m.partner : -1,
      };
    m.partner = -1;
    setMode(m, 'active');
  }

  // Start sharing with a nestmate in antennal contact (the nearest suitable one).
  const pick = (ok: (c: ContactPercept) => boolean) => per.contacts.filter(ok).sort((a, b) => a.dist - b.dist || a.id - b.id)[0];
  if (per.inNest && m.mode !== 'leave') {
    const partner = carrying ? pick((c) => !c.carrying) : hungry ? pick((c) => c.carrying) : undefined;
    if (partner) {
      m.partner = partner.id;
      m.shareStall = 0;
      setMode(m, carrying ? 'give' : 'receive');
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
      if (rng.hazard(p.restToActive, per.dt) || !per.inNest) setMode(m, 'active');
      return { ...NONE, stand: true };
    default: {
      setMode(m, 'active');
      // Nest fidelity: a worker that has strayed out of the nest (not on a
      // foraging trip) walks back to the entrance and does not rest outside.
      if (!per.inNest) return { ...NONE, motor: { goal: per.nestCue ? m.walk.heading + per.nestCue.bearing : Math.atan2(-m.pi.y, -m.pi.x), goalGain: p.leaveGain, noHomeBias: true } };
      if (hungry && io.cropUl < 0.05 * io.cropCapacity && rng.hazard(p.leaveRate * (m.traits.forageDrive ?? 1), per.dt)) {
        setMode(m, 'leave');
        return { ...NONE };
      }
      if (rng.hazard(p.activeToRest, per.dt)) setMode(m, 'rest');
      return { ...NONE };
    }
  }
}
