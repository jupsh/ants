import { clamp } from '../core/math';
import { Loc, type Ant, type Task } from '../agent/ant';
import { tempSpeedFactor, transferCrop } from '../agent/physiology';
import { Stage } from '../colony/brood';
import { Mat, UNREACHABLE } from '../nest/grid';
import type { Sim } from '../simulation';
import { emerge } from './surface';

/** Speed inside the nest relative to surface running (crowded, uneven galleries). */
const NEST_SPEED = 0.45;

/**
 * Walk along a distance field towards its sources. Returns true on arrival,
 * false while en route; returns null if the destination is unreachable.
 */
function followField(w: Sim, a: Ant, dt: number, field: Uint16Array): boolean | null {
  const nest = w.nest;
  const g = nest.grid;
  if (a.voxel < 0 || !g.isAir(a.voxel)) {
    relocate(w, a);
    return null;
  }
  const d0 = nest.dist(field, a.voxel);
  if (d0 === UNREACHABLE) return null;
  const temp = w.env.nestTemp(a.z, w.sp.nest.moundHeight);
  let remaining = a.speed28 * tempSpeedFactor(w.sp, temp) * NEST_SPEED * (a.load ? 0.8 : 1) * dt;
  if (remaining <= 0) return false;
  for (let guard = 0; guard < 8 && remaining > 0; guard++) {
    if (a.nextVoxel < 0 || !g.isAir(a.nextVoxel)) {
      const dHere = nest.dist(field, a.voxel);
      if (dHere === 0) return true;
      let best = -1;
      let bestD = dHere;
      let ties = 0;
      g.forNeighbours(a.voxel, (nb) => {
        const d = nest.dist(field, nb);
        if (d < bestD) {
          bestD = d;
          best = nb;
          ties = 1;
        } else if (d === bestD && best >= 0 && w.rng.chance(1 / ++ties)) best = nb;
      });
      if (best < 0) return dHere === 0;
      a.nextVoxel = best;
    }
    const [tx, ty, tz] = standPoint(w, a, a.nextVoxel);
    const dx = tx - a.x;
    const dy = ty - a.y;
    const dz = tz - a.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist > 1e-6) a.heading = Math.atan2(dy, dx);
    if (dist <= remaining) {
      a.x = tx;
      a.y = ty;
      a.z = tz;
      remaining -= dist;
      a.gait += dist / a.strideLen;
      a.voxel = a.nextVoxel;
      a.nextVoxel = -1;
    } else {
      const f = remaining / dist;
      a.x += dx * f;
      a.y += dy * f;
      a.z += dz * f;
      a.gait += remaining / a.strideLen;
      remaining = 0;
    }
  }
  return nest.dist(field, a.voxel) === 0 && a.nextVoxel < 0;
}

/** Position an ant occupies within a voxel: on the floor if there is one, with a per-ant offset. */
function standPoint(w: Sim, a: Ant, v: number): [number, number, number] {
  const g = w.nest.grid;
  const [x, y, z] = g.center(v);
  const s = g.voxel;
  const floor = g.onFloor(v) ? z - s * 0.5 + a.bodyHeight * 0.6 : z;
  return [x + a.jx * s, y + a.jy * s, floor];
}

/** Put an ant back into the nearest air voxel (after construction etc.). */
function relocate(w: Sim, a: Ant): void {
  const g = w.nest.grid;
  let best = w.nest.entrance;
  let bd = Infinity;
  for (let i = 0; i < g.airCount; i += Math.max(1, Math.floor(g.airCount / 2000))) {
    const v = g.airList[i];
    const [x, y, z] = g.center(v);
    const d = (x - a.x) ** 2 + (y - a.y) ** 2 + (z - a.z) ** 2;
    if (d < bd) {
      bd = d;
      best = v;
    }
  }
  a.voxel = best;
  a.nextVoxel = -1;
  [a.x, a.y, a.z] = standPoint(w, a, best);
}

function goTo(w: Sim, a: Ant, voxel: number, after: string): void {
  a.mode = 'goto';
  a.target = voxel;
  a.after = after;
  a.nextVoxel = -1;
}

function goOut(a: Ant, outMode: string): void {
  a.mode = 'toExit';
  a.outMode = outMode;
  a.nextVoxel = -1;
}

/** Called when an ant arrives at the entrance from the surface. */
export function onEnterNest(w: Sim, a: Ant): void {
  a.loc = Loc.Nest;
  a.voxel = w.nest.entrance;
  a.nextVoxel = -1;
  [a.x, a.y, a.z] = standPoint(w, a, a.voxel);
  const c = w.colony;
  if (a.mode === 'patrol' || a.task === 'patrol') {
    c.patrolReturned(w, a);
    a.task = 'idle';
    rest(w, a, 60);
    return;
  }
  if (a.load?.kind === 'grit') {
    goTo(w, a, c.wallTarget(w), 'build');
    return;
  }
  if (a.load || a.cropFill > 0.15) {
    a.mode = 'unload';
    a.nextVoxel = -1;
    if (a.load?.kind === 'seed' || a.load?.kind === 'insect') c.harvesterReturn();
    return;
  }
  if (a.task === 'dig') {
    a.mode = 'digSelect';
    return;
  }
  if (a.task === 'forage') {
    a.mode = 'wait';
    a.timer = w.rng.exp(w.sp.foraging.restTime);
    return;
  }
  rest(w, a, 30);
}

function rest(w: Sim, a: Ant, mean: number): void {
  a.mode = 'rest';
  a.decideAt = w.time + w.rng.exp(mean);
}

export function updateNest(w: Sim, a: Ant, dt: number): void {
  const c = w.colony;
  if (a.queen) return queenUpdate(w, a, dt);
  switch (a.mode) {
    case 'rest':
      if (w.time >= a.decideAt) decide(w, a);
      else if (w.rng.hazard(1 / 120, dt)) wanderStep(w, a);
      return;
    case 'wander':
      if (followField(w, a, dt, w.nest.fieldTo(a.target, w.time)) !== false) rest(w, a, 120);
      return;
    case 'goto': {
      const r = followField(w, a, dt, w.nest.fieldTo(a.target, w.time));
      if (r === null) {
        a.timer += dt;
        if (a.timer > 30) {
          a.timer = 0;
          dropLoadInside(w, a);
          rest(w, a, 30);
        }
      } else if (r) {
        a.timer = 0;
        arrived(w, a);
      }
      return;
    }
    case 'toExit': {
      const r = followField(w, a, dt, w.nest.exitField(w.time));
      if (r) {
        if (a.outMode === 'dump' || a.outMode === 'fetchGrit' || a.outMode === 'patrol' || c.forageAllowed || a.outMode === 'defend') emerge(w, a);
        else if (a.task === 'forage') {
          // Conditions outside are unsuitable: wait near the entrance.
          a.mode = 'wait';
          a.timer = 120;
          a.recruited = false;
        } else rest(w, a, 60);
      } else if (r === null) {
        a.timer += dt;
        if (a.timer > 30) {
          a.timer = 0;
          rest(w, a, 30);
        }
      }
      return;
    }
    case 'unload':
      return unload(w, a, dt);
    case 'wait':
      return waitAsForager(w, a, dt);
    case 'digSelect':
      return digSelect(w, a);
    case 'digging':
      return digging(w, a, dt);
    case 'nurse':
      return nurseDecide(w, a);
    case 'work':
      a.timer -= dt;
      if (a.timer <= 0) {
        a.tasksDone++;
        if (a.task === 'garden') c.processGarden(w, a);
        rest(w, a, 20);
      }
      return;
    default:
      rest(w, a, 30);
  }
}

function wanderStep(w: Sim, a: Ant): void {
  const g = w.nest.grid;
  const ch = w.nest.chamberOf.get(a.voxel);
  if (ch !== undefined) {
    const chamber = w.nest.chambers[ch];
    if (chamber) {
      const v = chamber.floor[w.rng.int(chamber.floor.length)];
      a.mode = 'wander';
      a.target = v;
      a.nextVoxel = -1;
      return;
    }
  }
  // In a tunnel: drift to a neighbour.
  let pick = -1;
  let n = 0;
  g.forNeighbours(a.voxel, (nb) => {
    if (w.rng.chance(1 / ++n)) pick = nb;
  });
  if (pick >= 0) {
    a.voxel = pick;
    [a.x, a.y, a.z] = standPoint(w, a, pick);
  }
}

// ---------------------------------------------------------------- task allocation

/**
 * Response-threshold task choice (Bonabeau et al. 1996): the probability of
 * engaging in task i is S_i² / (S_i² + θ_i²). Tasks are considered in random
 * order; if none is taken up the ant stays inactive.
 */
function decide(w: Sim, a: Ant): void {
  const c = w.colony;
  const s = c.stimulus;
  const order: Task[] = ['forage', 'nurse', 'dig', 'midden', 'garden', 'build'];
  for (let i = order.length - 1; i > 0; i--) {
    const j = w.rng.int(i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (const t of order) {
    const S = s[t] ?? 0;
    if (S <= 0) continue;
    const th = a.th[t] ?? 1;
    if (w.rng.chance((S * S) / (S * S + th * th))) {
      startTask(w, a, t);
      return;
    }
  }
  a.task = 'idle';
  // Idle ants drift towards the brood or rest where they are.
  rest(w, a, 300);
}

function startTask(w: Sim, a: Ant, t: Task): void {
  const c = w.colony;
  a.task = t;
  switch (t) {
    case 'forage':
      if (c.isMinimHitchhiker(w, a)) {
        goOut(a, 'trail');
        a.after = 'hitch';
        return;
      }
      goTo(w, a, c.waitVoxel(w), 'wait');
      return;
    case 'nurse':
      a.mode = 'nurse';
      return;
    case 'dig':
      a.mode = 'digSelect';
      return;
    case 'midden': {
      const corpse = c.claimCorpse(a);
      if (!corpse) return rest(w, a, 60);
      a.target = corpse.voxel;
      goTo(w, a, corpse.voxel, 'pickCorpse');
      return;
    }
    case 'garden': {
      const gv = c.gardenVoxel(w);
      if (gv < 0) return rest(w, a, 60);
      goTo(w, a, gv, 'garden');
      return;
    }
    case 'build':
      goOut(a, 'fetchGrit');
      return;
    default:
      rest(w, a, 60);
  }
}

function arrived(w: Sim, a: Ant): void {
  const c = w.colony;
  switch (a.after) {
    case 'wait':
      a.mode = 'wait';
      a.timer = w.rng.exp(w.sp.foraging.restTime);
      return;
    case 'pickCorpse': {
      const corpse = c.takeCorpse(a);
      if (!corpse) return rest(w, a, 30);
      a.load = { kind: 'corpse', mass: corpse.mass, ref: corpse.id };
      const refuse = c.refuseVoxel(w);
      if (refuse >= 0) goTo(w, a, refuse, 'dropRefuse');
      else goOut(a, 'dump');
      return;
    }
    case 'dropRefuse':
      c.addRefuse(w, a.voxel, a.load?.mass ?? 0);
      a.load = null;
      return rest(w, a, 30);
    case 'garden':
      a.mode = 'work';
      a.timer = w.rng.range(300, 900);
      return;
    case 'build':
      c.placeGrain(w, a);
      a.load = null;
      if (c.stimulus.build > 0.05) goOut(a, 'fetchGrit');
      else rest(w, a, 60);
      return;
    case 'digFace':
      a.mode = 'digging';
      a.timer = w.sp.nest.pelletTime * w.nest.hardness(a.aux) * w.rng.range(0.6, 1.4);
      return;
    case 'nurseTakeFood':
      c.nurseTakeFood(w, a);
      return nurseAfterFood(w, a);
    case 'nurseFeed':
      c.nurseFeed(w, a);
      a.tasksDone++;
      return rest(w, a, 20);
    case 'nursePick':
      if (!c.pickBrood(w, a)) return rest(w, a, 20);
      goTo(w, a, c.broodDropVoxel(w, a), 'nurseDrop');
      return;
    case 'nurseDrop':
      c.dropBrood(w, a);
      a.tasksDone++;
      return rest(w, a, 20);
    case 'feedQueen':
      c.feedQueen(w, a);
      return rest(w, a, 30);
    default:
      rest(w, a, 30);
  }
}

function dropLoadInside(w: Sim, a: Ant): void {
  if (!a.load) return;
  if (a.load.kind === 'brood') w.colony.dropBrood(w, a);
  else if (a.load.kind === 'pellet') w.nest.totalExcavated--;
  else w.colony.depositFood(w, a, a.voxel);
  a.load = null;
}

// ---------------------------------------------------------------- foragers in the nest

function unload(w: Sim, a: Ant, dt: number): void {
  const c = w.colony;
  const target = a.load ? c.storeVoxel(w, a.load.kind) : c.waitVoxel(w);
  const r = followField(w, a, dt, w.nest.fieldTo(target, w.time));
  if (r === false) return;
  if (a.load) c.depositFood(w, a, a.voxel);
  a.load = null;
  // Trophallaxis: regurgitate the crop load to nestmates (keep ~20% for self).
  if (a.cropFill > 0.25) {
    const receivers = c.nearbyNestmates(w, a, 6);
    for (const b of receivers) {
      if (a.cropFill <= 0.2) break;
      const room = b.cropCap - b.cropVol;
      if (room <= 0) continue;
      transferCrop(a, b, Math.min(room, a.cropVol - a.cropCap * 0.2));
    }
  }
  // Successful foragers recruit nestmates on their way back out.
  if (a.laying > 0) c.recruit(w, a);
  a.laying = 0;
  a.layRepel = 0;
  a.mode = 'wait';
  a.timer = w.rng.exp(w.sp.foraging.restTime);
}

/**
 * An available forager waiting in the entrance chamber. Leaves when recruited,
 * when it has a remembered site and has rested, or spontaneously as a scout.
 * (Pogonomyrmex departures are scheduled by the colony-level interaction model.)
 */
function waitAsForager(w: Sim, a: Ant, dt: number): void {
  const sp = w.sp;
  const c = w.colony;
  if (a.task !== 'forage') return rest(w, a, 30);
  if (!c.forageAllowed) {
    if (w.rng.hazard(1 / 1800, dt)) decide(w, a);
    return;
  }
  if (a.recruited) {
    goOut(a, a.partner >= 0 ? 'tandemFollow' : 'trail');
    return;
  }
  if (a.partner >= 0) {
    goOut(a, 'tandemLead');
    return;
  }
  if (sp.foraging.mode === 'harvester') {
    if (w.rng.hazard(1 / 3600, dt)) decide(w, a);
    return;
  }
  a.timer -= dt;
  if (a.timer > 0) return;
  const need = c.stimulus.forage;
  if (a.mem && w.rng.chance(sp.navigation.siteFidelity)) {
    goOut(a, 'toSite');
    return;
  }
  // Spontaneous scouting.
  if (w.rng.hazard((sp.foraging.scoutRate / 3600) * (0.3 + need), Math.max(dt, 1)) || sp.foraging.mode === 'solitary') {
    goOut(a, 'search');
    return;
  }
  // Stop waiting after a while and reconsider tasks.
  if (w.rng.hazard(1 / 1200, Math.max(dt, 1))) decide(w, a);
}

// ---------------------------------------------------------------- digging

function digSelect(w: Sim, a: Ant): void {
  const c = w.colony;
  if (c.stimulus.dig <= 0.01 && !a.load) return rest(w, a, 120);
  const site = w.nest.chooseDigSite(w.rng, w.time);
  if (site < 0) return rest(w, a, 300);
  const stand = w.nest.digStandpoint(site);
  if (stand < 0) return rest(w, a, 60);
  goTo(w, a, stand, 'digFace');
  a.timer = 0;
  a.aux = site;
}

function digging(w: Sim, a: Ant, dt: number): void {
  a.timer -= dt;
  if (a.timer > 0) return;
  const face = a.aux;
  if (!w.nest.frontier.has(face)) {
    a.mode = 'digSelect';
    return;
  }
  w.nest.removePellet(face, w.time);
  a.load = { kind: 'pellet', mass: w.sp.nest.pelletVolume * 1.3, ref: face };
  a.tasksDone++;
  w.colony.stats.pellets++;
  goOut(a, 'dump');
}

// ---------------------------------------------------------------- nursing

function nurseDecide(w: Sim, a: Ant): void {
  const c = w.colony;
  // 1. Queen care.
  const q = c.hungryQueen();
  if (q && c.hasFoodFor('queen')) {
    goTo(w, a, c.foodVoxel(w), 'nurseTakeFood');
    a.outMode = 'queen';
    return;
  }
  // 2. Feed hungry larvae.
  if (c.hungryLarvae > 0 && c.hasFoodFor('larvae')) {
    goTo(w, a, c.foodVoxel(w), 'nurseTakeFood');
    a.outMode = 'larvae';
    return;
  }
  // 3. Move brood to where the temperature suits its stage.
  const b = c.misplacedBrood(w);
  if (b) {
    b.carried = true;
    a.target = b.id;
    goTo(w, a, b.voxel, 'nursePick');
    a.outMode = String(b.id);
    return;
  }
  // 4. Otherwise tend the brood pile.
  const bv = c.broodSiteVoxel(w, Stage.Larva);
  if (bv >= 0) {
    a.mode = 'wander';
    a.target = bv;
    a.nextVoxel = -1;
    a.decideAt = w.time + 600;
    return;
  }
  rest(w, a, 120);
}

function nurseAfterFood(w: Sim, a: Ant): void {
  const c = w.colony;
  if (a.outMode === 'queen') {
    const q = c.hungryQueen() ?? c.queens[0];
    if (q && q.alive) {
      goTo(w, a, q.voxel, 'feedQueen');
      a.after = 'feedQueen';
      return;
    }
  }
  goTo(w, a, c.hungriestLarvaVoxel(w), 'nurseFeed');
}

// ---------------------------------------------------------------- queen

function queenUpdate(w: Sim, a: Ant, dt: number): void {
  const c = w.colony;
  // Queens stay in their chamber; they relocate slowly if the chosen chamber moves.
  const target = c.queenVoxel(w, a);
  if (target >= 0 && target !== a.voxel) {
    const r = followField(w, a, dt, w.nest.fieldTo(target, w.time));
    if (r === null && w.rng.hazard(1 / 600, dt)) relocate(w, a);
  }
  c.queenLay(w, a, dt);
}

export { followField, standPoint, relocate };
