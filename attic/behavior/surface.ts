import { TAU, clamp, hypot2, wrapAngle } from '../core/math';
import { Loc, type Ant } from '../agent/ant';
import { SUCROSE_MG_PER_UL_PER_M } from '../agent/physiology';
import type { Item } from '../world/items';
import type { Sim } from '../simulation';
import { followStrength, senseTrail, steer, toEntrance, walk } from './locomotion';

/** Modes in which an ant is heading away from the nest on a foraging trip. */
const OUTBOUND = new Set(['search', 'toSite', 'trail', 'approach', 'tandemLead', 'tandemFollow', 'waitHitch']);

/** Map an item kind to the food category in species definitions. */
function foodCategory(it: Item): string | null {
  switch (it.kind) {
    case 'sugar':
      return it.volume > 0.001 ? 'sugar' : null;
    case 'aphids':
      return 'honeydew';
    case 'insect':
      return it.carriedBy < 0 ? 'insect' : null;
    case 'seed':
      return it.carriedBy < 0 ? 'seed' : null;
    case 'plant':
      return it.leafArea > 20 ? 'leaf' : null;
    default:
      return null;
  }
}

export function updateSurface(w: Sim, a: Ant, dt: number): void {
  const sp = w.sp;
  if (a.riding >= 0) return ride(w, a);
  const temp = w.env.bodyTemp(a.bodyHeight);
  if (temp > sp.locomotion.tempMax && w.rng.hazard(1 / 30, dt)) return w.colony.kill(w, a, 'heat');
  if (!a.queen && w.rng.hazard(sp.foraging.extranidalHazard, dt)) return w.colony.kill(w, a, 'predation');
  if (a.pause > 0) {
    a.pause -= dt;
    return;
  }
  if (w.alarm.plumes.length > 0 && a.mode !== 'alarm' && a.mode !== 'coop' && a.load === null) checkAlarm(w, a);

  if (OUTBOUND.has(a.mode)) {
    const tooLong = w.time - a.tripStart > sp.foraging.giveUpTime;
    if (!w.colony.forageAllowed || tooLong) {
      if (a.partner >= 0) endTandem(w, a);
      goHome(a);
    }
  }

  switch (a.mode) {
    case 'search':
      return search(w, a, dt);
    case 'toSite':
      return toSite(w, a, dt);
    case 'trail':
      return followTrail(w, a, dt);
    case 'approach':
      return approach(w, a, dt);
    case 'drink':
      return drink(w, a, dt);
    case 'cut':
      return cut(w, a, dt);
    case 'handle':
      return handle(w, a, dt);
    case 'coop':
      return coop(w, a, dt);
    case 'home':
      return home(w, a, dt);
    case 'nestSearch':
      return nestSearch(w, a, dt);
    case 'tandemLead':
      return tandemLead(w, a, dt);
    case 'tandemFollow':
      return tandemFollow(w, a, dt);
    case 'patrol':
      return patrol(w, a, dt);
    case 'dump':
      return dump(w, a, dt);
    case 'fetchGrit':
      return fetchGrit(w, a, dt);
    case 'alarm':
      return alarmed(w, a, dt);
    case 'waitHitch':
      return waitHitch(w, a, dt);
    default:
      goHome(a);
  }
}

export function goHome(a: Ant): void {
  a.mode = 'home';
  a.target = -1;
  a.recruited = false;
}

/** Called when an ant emerges from the entrance onto the surface. */
export function emerge(w: Sim, a: Ant): void {
  const sp = w.sp;
  a.loc = Loc.Surface;
  a.voxel = -1;
  a.nextVoxel = -1;
  a.x = w.ex + w.rng.normal(0, a.len * 0.3);
  a.y = w.ey + w.rng.normal(0, a.len * 0.3);
  a.z = w.terrain.heightAt(a.x, a.y);
  a.startTrip(sp, w.rng, w.time);
  a.mode = a.outMode || 'search';
  a.outMode = '';
  if (a.mode === 'patrol') a.timer = sp.special.harvester?.patrolDuration ?? 600;
  a.siteVisit = false;
  a.heading = w.rng.angle();
  if (a.mode === 'toSite' && a.mem) a.heading = Math.atan2(a.mem.y, a.mem.x);
  else if (a.mode === 'trail' || a.mode === 'search') {
    // Pick the direction with the strongest trail around the entrance.
    if (w.trailChannels.length) {
      let best = -1;
      for (let k = 0; k < 12; k++) {
        const h = (k / 12) * TAU;
        let s = 0;
        for (const ch of w.trailChannels) if (ch.weight > 0) s += (ch.weight * ch.field.sample(w.ex + Math.cos(h) * a.len * 3, w.ey + Math.sin(h) * a.len * 3)) / ch.threshold;
        if (s > best) {
          best = s;
          if (s > 0.2) a.heading = h;
        }
      }
    }
  }
}

// ---------------------------------------------------------------- outbound

function lookForFood(w: Sim, a: Ant): boolean {
  const sp = w.sp;
  let best: Item | null = null;
  let bestD = Infinity;
  w.itemIndex.query(a.x, a.y, sp.senses.foodDetect + a.len, (it, d) => {
    const cat = foodCategory(it);
    if (!cat || !sp.foraging.foods.includes(cat as never)) return;
    if (it.kind === 'seed' && it.mass > a.carryMax) return;
    if (d < bestD) {
      bestD = d;
      best = it;
    }
  });
  if (best) {
    a.mode = 'approach';
    a.target = (best as Item).id;
    return true;
  }
  return false;
}

function search(w: Sim, a: Ant, dt: number): void {
  const sp = w.sp;
  let turn = 0;
  let noise = 1;
  if (a.ars > 0) {
    // Area-restricted search: tighter turning around a promising spot.
    a.ars -= dt;
    noise = 2.2;
    if (a.ars <= 0 && a.siteVisit && a.mem) {
      a.siteVisit = false;
      a.mem.fails++;
      if (a.mem.fails >= sp.navigation.memoryFailures) a.mem = null;
    }
  } else {
    const r = hypot2(a.pix, a.piy);
    if (r < a.exploreR) turn += steer(a, Math.atan2(a.piy, a.pix), 0.35);
  }
  if (w.trailChannels.length && sp.senses.trailGain > 0) {
    const t = senseTrail(w, a);
    if (t.presence > 0.15 && w.rng.chance(followStrength(t.presence) * Math.min(1, dt * 4))) {
      a.mode = 'trail';
      a.lostTrail = 0;
    } else turn += t.turn * 0.3;
  }
  if (lookForFood(w, a)) return;
  walk(w, a, dt, turn, noise);
}

function toSite(w: Sim, a: Ant, dt: number): void {
  const m = a.mem;
  if (!m) {
    a.mode = 'search';
    return;
  }
  const gx = m.x - a.pix;
  const gy = m.y - a.piy;
  if (hypot2(gx, gy) < Math.max(6 * a.len, 25)) {
    // Arrived where memory says the food was: search locally.
    a.mode = 'search';
    a.ars = w.rng.range(60, 180);
    a.exploreR = 0;
    a.siteVisit = true;
    return;
  }
  let turn = steer(a, Math.atan2(gy, gx), 1.2);
  if (w.trailChannels.length && w.sp.senses.trailGain > 0) {
    const t = senseTrail(w, a);
    const routeW = w.sp.special.trunk?.routeMemoryWeight ?? 1;
    if (t.presence > 0.2) turn = turn * (routeW / (1 + routeW)) + t.turn * (1 / (1 + routeW));
  }
  if (lookForFood(w, a)) return;
  walk(w, a, dt, turn, 0.55);
}

function followTrail(w: Sim, a: Ant, dt: number): void {
  const t = senseTrail(w, a);
  if (t.presence < 0.06) a.lostTrail += dt;
  else a.lostTrail = 0;
  if (a.lostTrail > 1.5) {
    // Trail end or lost: search locally (often at the food source).
    a.mode = 'search';
    a.ars = w.rng.range(40, 120);
    a.exploreR = 0;
    a.layRepel = w.sp.pheromones.some((p) => p.laidBy === 'unrewarded') ? 1 : 0;
    return;
  }
  let turn = t.turn;
  // Polarity: outbound ants keep their path-integration sense of "away from home".
  if (hypot2(a.pix, a.piy) > 2 * a.len) turn += steer(a, Math.atan2(a.piy, a.pix), 0.25);
  if (lookForFood(w, a)) return;
  walk(w, a, dt, turn, 0.35);
}

function approach(w: Sim, a: Ant, dt: number): void {
  const it = w.items.get(a.target);
  if (!it || !foodCategory(it)) {
    a.mode = 'search';
    a.ars = 30;
    return;
  }
  const d = hypot2(it.x - a.x, it.y - a.y) - it.r;
  if (d <= a.len * 0.4) return arriveAtFood(w, a, it);
  walk(w, a, dt, steer(a, Math.atan2(it.y - a.y, it.x - a.x), 4), 0.3);
}

function arriveAtFood(w: Sim, a: Ant, it: Item): void {
  const sp = w.sp;
  a.siteVisit = false;
  if (a.mem) a.mem.fails = 0;
  switch (it.kind) {
    case 'sugar':
    case 'aphids':
      a.mode = 'drink';
      a.timer = 0;
      return;
    case 'seed':
      a.mode = 'handle';
      a.timer = w.rng.range(2, 8);
      a.target = it.id;
      it.carriedBy = a.id;
      return;
    case 'insect': {
      if (it.mass <= a.carryMax) {
        a.mode = 'handle';
        a.timer = w.rng.range(3, 10);
        it.carriedBy = a.id;
        return;
      }
      if (sp.foraging.mode === 'solitary' || sp.foraging.mode === 'harvester' || sp.foraging.mode === 'tandem') {
        // Cut off a piece the ant can carry.
        a.mode = 'cut';
        a.timer = w.rng.range(30, 90);
        return;
      }
      if (!it.carriers.includes(a.id)) it.carriers.push(a.id);
      a.mode = 'coop';
      a.timer = 0;
      return;
    }
    case 'plant': {
      const lc = sp.special.leafcutter;
      if (a.after === 'hitch') {
        // Minim: wait at the cutting site to ride a fragment home.
        a.mode = 'waitHitch';
        a.timer = 0;
        w.colony.waitingHitchhikers.add(a.id);
        return;
      }
      if (!lc) {
        a.mode = 'search';
        return;
      }
      const area = Math.min(it.leafArea, lc.fragmentAreaCoef * a.len * a.len * w.rng.range(0.7, 1.3));
      // Perimeter of a roughly semicircular fragment.
      const rad = Math.sqrt((2 * area) / Math.PI);
      const cutLen = Math.PI * rad + 2 * rad;
      a.mode = 'cut';
      a.timer = cutLen / (lc.cutRate * Math.sqrt(a.len / 7));
      a.target = it.id;
      return;
    }
  }
}

function drink(w: Sim, a: Ant, dt: number): void {
  const sp = w.sp;
  const it = w.items.get(a.target);
  const rate = sp.foraging.drinkRate * (a.cropCap / sp.foraging.cropVolume) * dt;
  let taken = 0;
  let conc = 1;
  if (it && it.kind === 'sugar') {
    taken = Math.min(rate, it.volume, a.cropCap - a.cropVol);
    it.volume -= taken;
    conc = it.conc;
  } else if (it && it.kind === 'aphids') {
    taken = Math.min(rate, it.honeydew, a.cropCap - a.cropVol);
    it.honeydew -= taken;
    conc = it.conc;
  }
  a.cropVol += taken;
  a.cropSugar += taken * conc * SUCROSE_MG_PER_UL_PER_M;
  a.timer += dt;
  const full = a.cropVol >= a.cropCap * 0.98;
  const empty = taken < rate * 0.05;
  if (full || (empty && a.timer > 5)) {
    if (a.cropVol < a.cropCap * 0.1) {
      a.mode = 'search';
      a.ars = 60;
      return;
    }
    w.colony.stats.sugarCollected += a.cropSugar;
    finishFood(w, a, it?.kind === 'aphids' ? 'honeydew' : 'sugar', conc, a.cropFill);
  }
}

function handle(w: Sim, a: Ant, dt: number): void {
  a.timer -= dt;
  if (a.timer > 0) return;
  const it = w.items.get(a.target);
  if (!it || (it.kind !== 'seed' && it.kind !== 'insect')) {
    a.mode = 'search';
    return;
  }
  a.load = { kind: it.kind, mass: it.mass, ref: it.id };
  w.removeItem(it.id);
  finishFood(w, a, it.kind, it.kind === 'insect' ? 1 : 0.8, 1);
}

function cut(w: Sim, a: Ant, dt: number): void {
  const sp = w.sp;
  a.timer -= dt;
  const it = w.items.get(a.target);
  const lc = sp.special.leafcutter;
  if (it && it.kind === 'plant' && lc) {
    // Leaf-cutters imbibe plant sap while cutting.
    const sap = Math.min(lc.sapRate * dt, a.cropCap - a.cropVol);
    a.cropVol += sap;
    a.cropSugar += sap * 0.3 * SUCROSE_MG_PER_UL_PER_M;
  }
  if (a.timer > 0) return;
  if (it && it.kind === 'plant' && lc) {
    const area = Math.min(it.leafArea, lc.fragmentAreaCoef * a.len * a.len * w.rng.range(0.7, 1.3));
    if (area < 5) {
      a.mode = 'search';
      return;
    }
    it.leafArea -= area;
    a.load = { kind: 'leaf', mass: area * lc.leafDensity, ref: it.id, area };
    w.colony.stats.leafCollected += a.load.mass;
    finishFood(w, a, 'leaf', it.palatability, 1);
    return;
  }
  if (it && it.kind === 'insect') {
    const piece = Math.min(it.mass, a.carryMax * 0.8);
    it.mass -= piece;
    it.r = Math.max(0.5, it.len * 0.3 * Math.cbrt(it.mass / Math.max(piece, 0.001)) * 0.2 + 0.5);
    a.load = { kind: 'insect', mass: piece, ref: -1 };
    if (it.mass < 0.05) w.removeItem(it.id);
    finishFood(w, a, 'insect', 1, 1);
    return;
  }
  a.mode = 'search';
}

/** Cooperative transport: the item is moved by Sim.updateTransports. */
function coop(w: Sim, a: Ant, dt: number): void {
  const it = w.items.get(a.target);
  a.timer += dt;
  if (!it || it.kind !== 'insect') {
    a.mode = 'search';
    a.ars = 30;
    return;
  }
  if (!it.carriers.includes(a.id)) it.carriers.push(a.id);
  const cap = it.carriers.reduce((s, id) => s + (w.colony.byId.get(id)?.carryMax ?? 0), 0);
  if (cap < it.mass && a.timer > 25 + w.rng.next() * 20) {
    // Too heavy: either go back to recruit help, or cut off a piece.
    it.carriers = it.carriers.filter((id) => id !== a.id);
    if (w.sp.pheromones.length && w.rng.chance(0.6)) {
      a.mem = { x: a.pix, y: a.piy, kind: 'insect', fails: 0, quality: 1 };
      a.laying = 1.5;
      a.distFromFood = 0;
      a.foodDist = hypot2(a.pix, a.piy);
      goHome(a);
    } else {
      a.mode = 'cut';
      a.timer = w.rng.range(40, 120);
    }
  }
}

/** Common bookkeeping when an ant has secured food. */
function finishFood(w: Sim, a: Ant, kind: string, quality: number, amount: number): void {
  const sp = w.sp;
  a.mem = { x: a.pix, y: a.piy, kind, fails: 0, quality };
  a.lastFoodTime = w.time;
  a.distFromFood = 0;
  a.foodDist = hypot2(a.pix, a.piy);
  a.laying = 0;
  if (sp.foraging.recruitProbability > 0) {
    const need = w.colony.needFor(kind);
    // Recruitment is modulated by food quality and colony need (Beckers et al. 1993; Mailleux et al. 2000).
    const p = sp.foraging.recruitProbability * clamp(quality, 0, 1.5) * (0.35 + 0.65 * need) * clamp(amount, 0.3, 1);
    if (w.rng.chance(p)) a.laying = clamp(quality * (0.5 + need), 0.2, 2);
  }
  goHome(a);
  if (a.load?.kind === 'leaf') maybeMountHitchhiker(w, a);
}

// ---------------------------------------------------------------- homing

function home(w: Sim, a: Ant, dt: number): void {
  const sp = w.sp;
  const [d, angTrue] = toEntrance(w, a);
  if (d < Math.max(a.len * 0.8, w.entranceRadius)) return w.enterNest(a);
  let goal = Math.atan2(-a.piy, -a.pix);
  let gain = 1.2;
  let noise = 0.5;
  const vis = sp.navigation.visualCatchment;
  if (vis > 0 && w.env.light > 0.2 && d < vis) {
    // Familiar panorama near the nest: view-based homing towards the true entrance.
    goal = angTrue;
    gain = 1.6;
    a.pix += (a.x - w.ex - a.pix) * Math.min(1, dt * 0.5);
    a.piy += (a.y - w.ey - a.piy) * Math.min(1, dt * 0.5);
  }
  if (d < sp.senses.nestDetect) {
    goal = angTrue;
    gain = 3;
    noise = 0.3;
  }
  let turn = steer(a, goal, gain);
  if (w.trailChannels.length && sp.senses.trailGain > 0 && d >= sp.senses.nestDetect) {
    const t = senseTrail(w, a);
    if (t.presence > 0.25) {
      // On a trail: follow it, using PI only to disambiguate direction.
      const routeW = sp.special.trunk?.routeMemoryWeight ?? 0.5;
      turn = (turn * routeW + t.turn) / (1 + routeW);
      noise = 0.3;
    }
  }
  const piDist = hypot2(a.pix, a.piy);
  if (piDist < Math.max(3 * a.len, 20) && d >= sp.senses.nestDetect) {
    // Home vector run down but nest not found: start searching.
    a.mode = 'nestSearch';
    a.sox = a.pix;
    a.soy = a.piy;
    a.searchPhase = 0;
    a.searchGamma = 0;
    a.searchAngle = w.rng.angle();
    a.timer = 0;
    return;
  }
  walk(w, a, dt, turn, noise);
}

/**
 * Searching for the nest when the path integrator reads zero. Cataglyphis
 * performs centred loops of increasing size around the fictive nest
 * (Wehner & Srinivasan 1981; centred-loops model 2018); other species walk
 * a tortuous random search tethered to the expected nest position.
 */
function nestSearch(w: Sim, a: Ant, dt: number): void {
  const sp = w.sp;
  const [d] = toEntrance(w, a);
  if (d < sp.senses.nestDetect || (sp.navigation.visualCatchment > 0 && w.env.light > 0.2 && d < sp.navigation.visualCatchment)) {
    a.mode = 'home';
    return;
  }
  a.timer += dt;
  let turn: number;
  let noise: number;
  if (sp.navigation.systematicSearch) {
    const D0 = Math.max(40 * a.len, 120);
    const Dk = D0 * (1 + 0.35 * a.searchPhase);
    const R = Dk / 2;
    const ccx = a.sox + Math.cos(a.searchAngle) * R;
    const ccy = a.soy + Math.sin(a.searchAngle) * R;
    const th = Math.atan2(a.piy - ccy, a.pix - ccx);
    const tx = ccx + Math.cos(th + 0.5) * R;
    const ty = ccy + Math.sin(th + 0.5) * R;
    turn = steer(a, Math.atan2(ty - a.piy, tx - a.pix), 2.5);
    noise = 0.5;
    const prev = a.searchGamma;
    a.searchGamma = th;
    let dth = wrapAngle(th - prev);
    if (Math.abs(dth) > 1) dth = 0;
    a.searchPhase += dth / TAU;
    if (a.searchPhase >= Math.floor(a.searchPhase - dth / TAU) + 1) a.searchAngle += 2.4 + w.rng.normal(0, 0.4);
  } else {
    const gx = a.sox - a.pix;
    const gy = a.soy - a.piy;
    const r = hypot2(gx, gy);
    const tether = Math.max(10 * a.len, 30) * (1 + a.timer / 300);
    turn = r > tether ? steer(a, Math.atan2(gy, gx), 1) : 0;
    noise = 2;
    if (w.trailChannels.length) {
      const t = senseTrail(w, a);
      if (t.presence > 0.3) {
        // A trail leads home; following it re-anchors the home vector.
        a.mode = 'home';
        a.pix = a.x - w.ex;
        a.piy = a.y - w.ey;
      }
    }
  }
  walk(w, a, dt, turn, noise);
}

// ---------------------------------------------------------------- tandem running (Temnothorax)

function endTandem(w: Sim, a: Ant): void {
  const p = w.colony.byId.get(a.partner);
  if (p && p.partner === a.id) {
    p.partner = -1;
    if (p.mode === 'tandemFollow' || p.mode === 'tandemLead') {
      p.mode = 'search';
      p.ars = 60;
    }
  }
  a.partner = -1;
}

function tandemLead(w: Sim, a: Ant, dt: number): void {
  const tp = w.sp.special.tandem!;
  const f = w.colony.byId.get(a.partner);
  if (!f || !f.alive || f.partner !== a.id) {
    a.partner = -1;
    a.mode = a.mem ? 'toSite' : 'search';
    return;
  }
  const gap = f.loc === Loc.Surface ? hypot2(f.x - a.x, f.y - a.y) : Infinity;
  // Leader stops when contact is lost and waits for the follower's tap.
  if (gap > tp.gapStop * (a.timer > 0 ? 0.4 : 1)) {
    a.timer = 1; // waiting
    if (gap > tp.gapStop * 25) {
      a.target += dt;
      if (a.target > 90) {
        endTandem(w, a);
        a.mode = 'toSite';
        a.target = -1;
      }
    }
    return;
  }
  if (gap < tp.gapResume) a.timer = 0;
  if (a.timer > 0) return;
  a.target = 0;
  const m = a.mem!;
  const gx = m.x - a.pix;
  const gy = m.y - a.piy;
  if (hypot2(gx, gy) < Math.max(4 * a.len, 10)) {
    // Arrived: both search for the food; follower has learned the route.
    f.mem = { x: f.pix, y: f.piy, kind: m.kind, fails: 0, quality: m.quality };
    endTandem(w, a);
    a.mode = 'search';
    a.ars = 60;
    a.exploreR = 0;
    w.colony.stats.tandemRuns++;
    return;
  }
  if (lookForFood(w, a)) {
    f.mem = { x: f.pix, y: f.piy, kind: m.kind, fails: 0, quality: m.quality };
    const target = a.target;
    endTandem(w, a);
    a.target = target;
    a.mode = 'approach';
    w.colony.stats.tandemRuns++;
    return;
  }
  walk(w, a, dt, steer(a, Math.atan2(gy, gx), 1.2), 0.6, tp.leaderSlowdown);
}

function tandemFollow(w: Sim, a: Ant, dt: number): void {
  const tp = w.sp.special.tandem!;
  const l = w.colony.byId.get(a.partner);
  if (!l || !l.alive || l.partner !== a.id) {
    a.partner = -1;
    a.mode = 'search';
    a.ars = 90;
    return;
  }
  if (l.loc !== Loc.Surface) return; // leader not out yet
  // Followers pause to look around (learning the route).
  if (w.rng.hazard(tp.followerPause, dt)) {
    a.pause = w.rng.range(0.5, 2.5);
    return;
  }
  const gx = l.x - a.x;
  const gy = l.y - a.y;
  const gap = hypot2(gx, gy);
  if (gap < tp.gapResume * 0.7) return;
  // Within antennal reach: track the leader; beyond it: search in loops.
  const turn = gap < tp.gapStop * 3 ? steer(a, Math.atan2(gy, gx), 3) : steer(a, Math.atan2(gy, gx), 0.6);
  walk(w, a, dt, turn, gap < tp.gapStop * 3 ? 0.4 : 1.6);
}

// ---------------------------------------------------------------- other tasks

function patrol(w: Sim, a: Ant, dt: number): void {
  const hp = w.sp.special.harvester;
  a.timer -= dt;
  if (a.timer <= 0) {
    a.mode = 'home';
    return;
  }
  const r = hypot2(a.pix, a.piy);
  const turn = r < (hp ? 600 : 100) ? steer(a, Math.atan2(a.piy, a.pix), 0.3) : steer(a, Math.atan2(-a.piy, -a.pix), 0.3);
  walk(w, a, dt, turn, 1.2);
}

/** Carry a soil pellet, corpse or refuse a short way from the entrance and drop it. */
function dump(w: Sim, a: Ant, dt: number): void {
  const r = hypot2(a.pix, a.piy);
  if (r >= a.timer || w.time - a.tripStart > 300) {
    const load = a.load;
    a.load = null;
    if (load?.kind === 'pellet') w.terrain.depositSoil(a.x, a.y, load.mass);
    else if (load?.kind === 'corpse' || load?.kind === 'refuse') w.dropAtMidden(a, load);
    a.mode = 'home';
    return;
  }
  // Midden-bound ants head for the midden; soil carriers walk out a few body lengths.
  let turn = 0;
  if (a.load && a.load.kind !== 'pellet' && w.midden) turn = steer(a, Math.atan2(w.midden[1] - a.y, w.midden[0] - a.x), 2);
  walk(w, a, dt, turn, 0.8);
}

function fetchGrit(w: Sim, a: Ant, dt: number): void {
  if (a.target >= 0) {
    const it = w.items.get(a.target);
    if (!it || it.kind !== 'grit' || (it.carriedBy >= 0 && it.carriedBy !== a.id)) {
      a.target = -1;
    } else {
      const d = hypot2(it.x - a.x, it.y - a.y);
      if (d < a.len * 0.5) {
        a.load = { kind: 'grit', mass: 0.05, ref: it.id };
        w.removeItem(it.id);
        a.mode = 'home';
        return;
      }
      walk(w, a, dt, steer(a, Math.atan2(it.y - a.y, it.x - a.x), 4), 0.3);
      return;
    }
  }
  let found: Item | null = null;
  let bd = Infinity;
  w.itemIndex.query(a.x, a.y, a.len * 4, (it, d) => {
    if (it.kind === 'grit' && it.carriedBy < 0 && d < bd) {
      bd = d;
      found = it;
    }
  });
  if (found) {
    a.target = (found as Item).id;
    (found as Item & { carriedBy: number }).carriedBy = a.id;
    return;
  }
  if (w.time - a.tripStart > 600) {
    a.mode = 'home';
    return;
  }
  const r = hypot2(a.pix, a.piy);
  walk(w, a, dt, r > 40 ? steer(a, Math.atan2(-a.piy, -a.pix), 0.6) : 0, 1.4);
}

function checkAlarm(w: Sim, a: Ant): void {
  const c = w.alarm.at(a.x, a.y, a.z, w.time);
  if (c >= 1 && w.rng.chance(w.sp.alarm.aggression + 0.2)) {
    a.alarm = 1;
    a.outMode = a.mode;
    a.mode = 'alarm';
    a.timer = 0;
  }
}

function alarmed(w: Sim, a: Ant, dt: number): void {
  const sp = w.sp;
  const c = w.alarm.at(a.x, a.y, a.z, w.time);
  a.timer += dt;
  if (c < 0.6 || a.timer > 180) {
    a.alarm = 0;
    a.mode = 'home';
    return;
  }
  // Aggressive species run up the gradient; timid ones flee.
  const [gx, gy] = w.alarm.gradient(a.x, a.y, a.z, w.time);
  const up = Math.atan2(gy, gx);
  const toward = sp.alarm.aggression >= 0.3;
  const turn = steer(a, toward ? up : up + Math.PI, 3);
  // Positive feedback: alarmed workers release more alarm pheromone.
  if (toward && w.rng.hazard(sp.alarm.aggression * 0.15, dt)) w.alarm.release(a.x, a.y, a.z, w.time, 0.3);
  walk(w, a, dt, turn, c > 8 ? 2.5 : 1, 1.3);
}

function waitHitch(w: Sim, a: Ant, dt: number): void {
  a.timer += dt;
  if (a.timer > 1200) {
    a.mode = 'home';
    return;
  }
  walk(w, a, dt, 0, 2, 0.3);
}

function maybeMountHitchhiker(w: Sim, carrier: Ant): void {
  if (carrier.rider >= 0) return;
  for (const id of w.colony.waitingHitchhikers) {
    const h = w.colony.byId.get(id);
    if (!h || h.mode !== 'waitHitch' || h.loc !== Loc.Surface) continue;
    if (hypot2(h.x - carrier.x, h.y - carrier.y) < 12) {
      h.riding = carrier.id;
      h.mode = 'ride';
      carrier.rider = h.id;
      w.colony.stats.hitchhikes++;
      return;
    }
  }
}

function ride(w: Sim, a: Ant): void {
  const c = w.colony.byId.get(a.riding);
  if (!c || !c.alive || c.loc !== Loc.Surface || !c.load) {
    a.riding = -1;
    if (c && c.loc === Loc.Nest) {
      w.enterNest(a);
      return;
    }
    a.mode = 'home';
    return;
  }
  a.x = c.x;
  a.y = c.y;
  a.z = c.z + c.len * 0.8;
  a.heading = c.heading;
  a.pix = c.pix;
  a.piy = c.piy;
}
