import { DAY, clamp, hypot2 } from '../core/math';
import { Ant, Loc } from '../agent/ant';
import { consume, metabolicRate, transferCrop, SUCROSE_MG_PER_UL_PER_M } from '../agent/physiology';
import { Mat } from '../nest/grid';
import type { Chamber } from '../nest/nest';
import type { Sim } from '../simulation';
import { type Brood, Stage, developmentRate } from './brood';

/**
 * Oleic acid accumulates on corpses and triggers necrophoresis
 * (Wilson, Durlach & Roth 1958); most corpses are removed within ~1 h.
 */
const CORPSE_DELAY = 3600;
/** Protein-equivalent fraction of insect prey fresh mass (estimated). */
const INSECT_PROTEIN = 0.5;
/** Seed composition used when milled (estimated): protein and carbohydrate fractions. */
const SEED_PROTEIN = 0.2;
const SEED_CARB = 0.55;
/** Larvae unfed for this long (days) die and are cannibalised (estimated). */
const LARVA_STARVE_DAYS = 4;

export interface NestCorpse {
  id: number;
  voxel: number;
  died: number;
  mass: number;
  len: number;
  claimed: boolean;
}

export interface ColonyStats {
  births: number;
  eggsLaid: number;
  deaths: Record<string, number>;
  sugarCollected: number;
  proteinCollected: number;
  seedsCollected: number;
  leafCollected: number;
  pellets: number;
  tandemRuns: number;
  hitchhikes: number;
  recruitEvents: number;
  trips: number;
}

export interface HistorySample {
  t: number;
  workers: number;
  eggs: number;
  larvae: number;
  pupae: number;
  outside: number;
  volume: number;
  carbNeed: number;
  proteinNeed: number;
  surfaceT: number;
  airT: number;
  broodT: number;
}

export class Colony {
  ants: Ant[] = [];
  readonly byId = new Map<number, Ant>();
  queens: Ant[] = [];
  brood: Brood[] = [];
  readonly broodById = new Map<number, Brood>();
  nestCorpses: NestCorpse[] = [];
  private nextAnt = 1;
  private nextBrood = 1;

  // Food stores (mg)
  proteinStore = 0;
  granary = 0;
  garden = 0;
  leafPending = 0;
  fungusFood = 0;
  refuse = 0;
  refuseVoxels: number[] = [];

  /** Task stimuli, 0..1. */
  stimulus: Record<string, number> = { forage: 0.3, nurse: 0, dig: 0, midden: 0, garden: 0, build: 0 };
  carbNeed = 0;
  proteinNeed = 0;
  hungryLarvae = 0;
  forageAllowed = false;
  readonly waitingHitchhikers = new Set<number>();

  // Chamber roles (voxel anchors)
  sites = { wait: -1, store: -1, queen: -1, egg: -1, larva: -1, pupa: -1, refuse: -1, garden: [] as number[] };
  private broodChamber: [number, number, number] = [-1, -1, -1];
  private siteTime = -1e9;
  private misplacedCursor = 0;

  // Pogonomyrmex interaction model (Prabhakar et al. 2012)
  alpha = 0;
  private departuresPrev = 0;
  private returnsSlot = 0;
  forageDay = false;
  private patrolLaunched = false;
  patrolReturns = 0;

  // Temnothorax wall
  readonly wallGrains = new Map<number, number>();
  private wallCandidates: number[] = [];
  private wallVersion = -1;
  wallRadius = 0;

  readonly stats: ColonyStats = {
    births: 0,
    eggsLaid: 0,
    deaths: {},
    sugarCollected: 0,
    proteinCollected: 0,
    seedsCollected: 0,
    leafCollected: 0,
    pellets: 0,
    tandemRuns: 0,
    hitchhikes: 0,
    recruitEvents: 0,
    trips: 0,
  };
  history: HistorySample[] = [];
  private lastSample = -1e9;
  private pendingRemoval = false;

  constructor(w: Sim) {
    const sp = w.sp;
    const c = sp.colony;
    const now = w.time;
    this.alpha = sp.special.harvester?.alphaMin ?? 0;
    w.nest.updateChambers();
    this.assignSites(w, true);
    const floorVox = (stage: 'queen' | 'egg' | 'larva' | 'pupa' | 'wait') => this.siteVoxel(w, this.sites[stage]);

    for (let i = 0; i < Math.round(c.queens); i++) {
      const q = this.addAnt(w, sp.morphology.lengthMax * 1.35, now - w.rng.range(1, 3) * 365 * DAY, true);
      q.diesAt = Infinity;
      q.queenProtein = sp.physiology.eggCost * 20;
      q.task = 'queen';
      this.placeInNest(w, q, floorVox('queen'));
    }
    for (let i = 0; i < Math.round(c.workers); i++) {
      const age = w.rng.next() * c.workerLifespan * 0.9;
      const a = this.addAnt(w, this.sampleLength(w), now - age * DAY);
      a.cropVol = a.cropCap * w.rng.range(0.2, 0.6);
      a.cropSugar = a.cropVol * 0.5 * SUCROSE_MG_PER_UL_PER_M;
      const t = age / c.forageAge;
      const v = t > 1.1 && w.rng.chance(0.6) ? floorVox('wait') : w.rng.chance(0.5) ? floorVox('larva') : this.randomChamberVoxel(w);
      this.placeInNest(w, a, v);
      a.decideAt = now + w.rng.range(0, 300);
    }
    const addBrood = (stage: Stage, n: number) => {
      for (let i = 0; i < Math.round(n); i++) {
        const b = this.newBrood(w, stage, floorVox(stage === Stage.Egg ? 'egg' : stage === Stage.Larva ? 'larva' : 'pupa'));
        b.progress = w.rng.next() * 0.9;
        if (stage !== Stage.Egg) {
          b.targetLen = this.sampleLength(w);
          b.need = this.larvalNeed(w, b.targetLen);
          b.fed = stage === Stage.Pupa ? b.need : b.need * clamp(b.progress + 0.1, 0, 1);
        }
      }
    };
    addBrood(Stage.Egg, c.eggs);
    addBrood(Stage.Larva, c.larvae);
    addBrood(Stage.Pupa, c.pupae);
    // Some food in store at the start.
    this.proteinStore = this.brood.length * 0.02 * sp.physiology.larvalProtein;
    if (sp.foraging.mode === 'harvester') this.granary = c.workers * 1.0;
    if (sp.special.leafcutter) {
      this.garden = c.workers * sp.special.leafcutter.gardenPerWorker * 0.8;
      this.fungusFood = this.garden * 0.05;
    }
  }

  // ------------------------------------------------------------ population

  addAnt(w: Sim, len: number, born: number, queen = false): Ant {
    const a = new Ant(this.nextAnt++, w.sp, w.rng, born, len, queen);
    if (!queen) {
      // Weibull-distributed lifespan (shape 3) around the species mean.
      const L = w.sp.colony.workerLifespan * DAY * (0.8 + 0.4 * a.sizeClass);
      a.diesAt = born + L * Math.pow(-Math.log(1 - w.rng.next()), 1 / 3) * 1.12;
      this.initThresholds(w, a);
    }
    this.ants.push(a);
    this.byId.set(a.id, a);
    if (queen) this.queens.push(a);
    return a;
  }

  placeInNest(w: Sim, a: Ant, voxel: number): void {
    a.loc = Loc.Nest;
    a.voxel = voxel >= 0 && w.nest.grid.isAir(voxel) ? voxel : w.nest.entrance;
    const [x, y, z] = w.nest.grid.center(a.voxel);
    a.x = x + a.jx * w.nest.grid.voxel;
    a.y = y + a.jy * w.nest.grid.voxel;
    a.z = w.nest.grid.onFloor(a.voxel) ? z - w.nest.grid.voxel * 0.5 + a.bodyHeight * 0.6 : z;
    a.heading = w.rng.angle();
  }

  /** Worker body length drawn from the species' size distribution (may depend on colony size). */
  sampleLength(w: Sim): number {
    const m = w.sp.morphology;
    const lo = m.lengthMin;
    const hi = m.lengthMax;
    const range = hi - lo;
    const n = this.ants.length;
    const r = w.rng;
    switch (m.sizeDistribution) {
      case 'mono':
        return clamp(r.normal((lo + hi) / 2, range / 6), lo, hi);
      case 'continuous':
        return lo + range * clamp(Math.pow(r.next(), 1.3) * 0.95 + r.normal(0, 0.04), 0, 1);
      case 'fire': {
        // Majors appear and become more frequent as the colony grows (Tschinkel 2006).
        const pMajor = clamp((n - 500) / 20000, 0, 0.35);
        if (r.chance(pMajor)) return clamp(r.normal(hi - range * 0.2, range * 0.1), lo, hi);
        return clamp(r.normal(lo + range * 0.25, range * 0.1), lo, hi);
      }
      case 'atta': {
        // Minims, minors, mediae, (rare) majors; majors scale with colony size (Wilson 1980).
        const pMajor = clamp((n - 1000) / 60000, 0, 0.05);
        const u = r.next();
        if (u < pMajor) return r.range(10, hi);
        if (u < pMajor + 0.25) return r.range(lo, 3);
        if (u < pMajor + 0.5) return r.range(3, 5);
        return r.range(5, 9);
      }
    }
  }

  larvalNeed(w: Sim, len: number): number {
    return w.sp.physiology.larvalProtein * w.sp.morphology.massCoef * len ** 3;
  }

  /**
   * Initial response thresholds from age (temporal polyethism) and size
   * (physical castes), with individual variation.
   */
  initThresholds(w: Sim, a: Ant): void {
    const sp = w.sp;
    const f = a.ageDays(w.time) / sp.colony.forageAge;
    const v = () => w.rng.lognormal(1, 0.25);
    const th = a.th;
    th.forage = (0.1 + 1.2 / (1 + Math.exp(4 * (f - 1)))) * v();
    th.nurse = (0.1 + 1.0 / (1 + Math.exp(-4 * (f - 1)))) * v();
    th.dig = 0.5 * v() * (0.6 + 0.8 * Math.abs(f - 0.8));
    th.midden = 0.6 * v();
    th.garden = 0.5 * v();
    th.build = 0.45 * v();
    const sc = a.sizeClass;
    switch (sp.morphology.sizeDistribution) {
      case 'atta':
        if (a.len < 3) {
          th.garden = 0.08 * v();
          th.nurse = 0.15 * v();
          th.forage += 2.2;
          th.dig += 0.5;
        } else if (a.len < 5) {
          th.garden = 0.25 * v();
          th.nurse = 0.4 * v();
          th.forage += 0.5;
        } else if (a.len < 10) {
          th.forage *= 0.5;
          th.nurse += 0.8;
          th.garden += 0.6;
        } else {
          th.forage += 2;
          th.nurse += 2;
          th.garden += 2;
          th.dig += 1;
        }
        break;
      case 'fire':
        if (sc > 0.55) {
          th.forage += 0.4;
          th.nurse += 0.8;
        }
        break;
      case 'continuous':
        th.forage -= 0.2 * sc;
        break;
    }
  }

  newBrood(w: Sim, stage: Stage, voxel: number): Brood {
    const b: Brood = { id: this.nextBrood++, stage, progress: 0, targetLen: 0, fed: 0, need: 0, hunger: 0, voxel, carried: false, queenBrood: false };
    this.brood.push(b);
    this.broodById.set(b.id, b);
    void w;
    return b;
  }

  kill(w: Sim, a: Ant, cause: string): void {
    if (!a.alive) return;
    a.alive = false;
    this.pendingRemoval = true;
    this.stats.deaths[cause] = (this.stats.deaths[cause] ?? 0) + 1;
    // Release anything the ant was holding or claiming.
    const it = w.items.get(a.target);
    if (it && 'carriedBy' in it && it.carriedBy === a.id) it.carriedBy = -1;
    for (const item of w.items.values()) if (item.kind === 'insect' && item.carriers.includes(a.id)) item.carriers = item.carriers.filter((id) => id !== a.id);
    if (a.load) {
      if (a.loc === Loc.Surface) w.dropLoadOnSurface(a);
      else if (a.load.kind === 'brood') this.dropBrood(w, a);
      a.load = null;
    }
    if (a.partner >= 0) {
      const p = this.byId.get(a.partner);
      if (p) p.partner = -1;
    }
    if (a.rider >= 0) {
      const r = this.byId.get(a.rider);
      if (r) r.riding = -1;
    }
    this.waitingHitchhikers.delete(a.id);
    // Leave a corpse.
    if (a.loc === Loc.Surface) w.addCorpseItem(a.x, a.y, a.len, a.sizeClass);
    else if (cause !== 'eaten') this.nestCorpses.push({ id: a.id, voxel: a.voxel, died: w.time, mass: a.mass, len: a.len, claimed: false });
  }

  /** Remove dead ants from the lists (deferred to avoid mutating during iteration). */
  sweep(): void {
    if (!this.pendingRemoval) return;
    this.pendingRemoval = false;
    this.ants = this.ants.filter((a) => {
      if (!a.alive) this.byId.delete(a.id);
      return a.alive;
    });
    this.queens = this.queens.filter((q) => q.alive);
  }

  get workers(): number {
    return this.ants.length - this.queens.length;
  }

  // ------------------------------------------------------------ periodic update

  slowUpdate(w: Sim, dt: number): void {
    const sp = w.sp;
    const now = w.time;
    if (now - this.siteTime > 60) this.assignSites(w, false);
    const compression = w.lifeCycleCompression;

    // --- Physiology: metabolism, ageing, starvation.
    let cropSum = 0;
    let cropN = 0;
    const inNest: Ant[] = [];
    for (const a of this.ants) {
      if (!a.alive) continue;
      const temp = a.loc === Loc.Surface ? w.env.bodyTemp(a.bodyHeight) : w.env.nestTemp(a.z, sp.nest.moundHeight);
      const active = a.loc === Loc.Surface || (a.mode !== 'rest' && a.mode !== 'wait');
      if (!consume(a, metabolicRate(sp, a, temp, active) * dt * compression)) {
        this.kill(w, a, 'starvation');
        continue;
      }
      if (!a.queen && now > a.diesAt) {
        this.kill(w, a, 'age');
        continue;
      }
      if (a.loc === Loc.Nest) {
        if (!w.nest.grid.isAir(a.voxel)) this.placeInNest(w, a, w.nest.entrance);
        if (!a.queen) {
          inNest.push(a);
          cropSum += a.cropFill;
          cropN++;
        }
      }
      // Threshold dynamics: reinforcement by performance, and age drift.
      if (!a.queen) {
        const dd = (dt * compression) / DAY;
        const ageRate = 0.5 / sp.colony.forageAge;
        for (const t of ['forage', 'nurse', 'dig', 'midden', 'garden', 'build']) {
          const delta = a.task === t ? -0.3 * dd : 0.03 * dd;
          a.th[t] = clamp((a.th[t] ?? 1) + delta, 0.05, 3);
        }
        a.th.forage = clamp(a.th.forage - ageRate * dd, 0.05, 3);
        a.th.nurse = clamp(a.th.nurse + ageRate * dd, 0.05, 3);
      }
    }
    this.selfFeed(w, inNest, dt);
    this.mixCrops(w, inNest, dt);

    // --- Brood.
    this.updateBrood(w, dt * compression);

    // --- Gardens (Atta).
    const lc = sp.special.leafcutter;
    if (lc) {
      this.fungusFood += ((this.garden * lc.gardenYield) / DAY) * dt * compression;
      this.fungusFood = Math.min(this.fungusFood, this.garden * 0.15);
      const senesce = ((this.garden * 0.01) / DAY) * dt * compression;
      this.garden -= senesce;
      this.refuse += senesce;
    }

    // --- Needs and stimuli.
    this.carbNeed = clamp(1 - cropSum / Math.max(1, cropN) / 0.45, 0, 1);
    let demand = 0;
    this.hungryLarvae = 0;
    for (const b of this.brood)
      if (b.stage === Stage.Larva) {
        demand += Math.max(0, b.need - b.fed);
        if (b.fed < b.need * Math.min(1, b.progress + 0.15)) this.hungryLarvae++;
      }
    for (const q of this.queens) demand += Math.max(0, sp.physiology.eggCost * 10 - q.queenProtein);
    const proteinAvail = this.proteinStore + this.granary * SEED_PROTEIN + this.fungusFood;
    this.proteinNeed = clamp(1 - proteinAvail / (0.5 * demand + 1e-3), 0, 1);
    const N = Math.max(1, this.workers);
    let forage = Math.max(this.carbNeed, this.proteinNeed);
    if (lc) forage = Math.max(clamp(1 - this.garden / (lc.gardenPerWorker * N), 0, 1), this.carbNeed * 0.3);
    if (sp.foraging.mode === 'harvester') forage = Math.max(clamp(1 - this.granary / (N * 2), 0, 1), 0.3);
    this.stimulus.forage = Math.max(0.15, forage);
    const nurses = this.ants.filter((a) => a.task === 'nurse').length;
    this.stimulus.nurse = this.brood.length ? clamp(this.hungryLarvae / (nurses * 3 + 1) + 0.15, 0, 1) : 0;
    const diggable = sp.nest.architecture !== 'cavity' && sp.nest.architecture !== 'crevice';
    const target = N * sp.colony.volumePerWorker;
    this.stimulus.dig = diggable ? clamp((4 * (target - w.nest.volume)) / target, 0, 1) : 0;
    this.stimulus.midden = this.nestCorpses.some((c) => !c.claimed && now - c.died > CORPSE_DELAY) ? 0.8 : 0;
    this.stimulus.garden = lc ? clamp(this.leafPending / (N * 0.05), 0, 1) : 0;
    this.stimulus.build = sp.special.crevice ? this.wallDeficit(w) : 0;

    // --- Is it possible to forage right now?
    const tb = w.env.bodyTemp(sp.morphology.rideHeight * ((sp.morphology.lengthMin + sp.morphology.lengthMax) / 2));
    this.forageAllowed = tb >= sp.foraging.bodyTempMin && tb <= sp.foraging.bodyTempMax && (!sp.foraging.diurnal || w.env.light > 0.25);
    if (sp.special.harvester) this.harvesterDaily(w);
    if (this.queens.length === 0 && !this.reportedQueenless) {
      this.reportedQueenless = true;
      w.log('The colony has lost its last queen.');
    }

    // --- Corpses inside the nest decay eventually.
    this.nestCorpses = this.nestCorpses.filter((c) => now - c.died < 20 * DAY);

    if (now - this.lastSample >= 300) {
      this.lastSample = now;
      this.sample(w);
    }
  }
  private reportedQueenless = false;

  /** Workers that stay inside eat from stores that are not liquid (seeds, fungus). */
  private selfFeed(w: Sim, inNest: Ant[], dt: number): void {
    const lc = w.sp.special.leafcutter;
    const harvester = w.sp.foraging.mode === 'harvester';
    if (!lc && !harvester) return;
    for (const a of inNest) {
      if (a.cropFill > 0.3) continue;
      const want = (a.cropCap - a.cropVol) * 0.5 * SUCROSE_MG_PER_UL_PER_M * Math.min(1, dt / 600);
      if (lc && this.fungusFood > want) {
        this.fungusFood -= want;
        a.cropSugar += want;
        a.cropVol += want / (0.5 * SUCROSE_MG_PER_UL_PER_M);
      } else if (harvester && this.granary * SEED_CARB > want) {
        this.granary -= want / SEED_CARB;
        a.cropSugar += want;
        a.cropVol += want / (0.5 * SUCROSE_MG_PER_UL_PER_M);
      }
      a.cropVol = Math.min(a.cropVol, a.cropCap);
    }
  }

  /**
   * Trophallactic mixing: random encounters between nestmates in the nest
   * level out crop contents (stochastic approximation of the exchange network).
   */
  private mixCrops(w: Sim, inNest: Ant[], dt: number): void {
    const n = inNest.length;
    if (n < 2) return;
    const exchanges = Math.round(n * 0.02 * (dt / 10));
    for (let k = 0; k < exchanges; k++) {
      const a = inNest[w.rng.int(n)];
      const b = inNest[w.rng.int(n)];
      if (a === b) continue;
      const [rich, poor] = a.cropFill > b.cropFill ? [a, b] : [b, a];
      const diff = (rich.cropFill - poor.cropFill) * Math.min(rich.cropCap, poor.cropCap);
      if (diff > 0) transferCrop(rich, poor, diff * 0.35);
    }
  }

  private updateBrood(w: Sim, dt: number): void {
    const sp = w.sp;
    const g = w.nest.grid;
    const died: Brood[] = [];
    for (const b of this.brood) {
      const z = b.carried ? 0 : g.center(b.voxel)[2];
      const temp = w.env.nestTemp(z, sp.nest.moundHeight);
      const rate = developmentRate(sp, b.stage, temp);
      if (b.stage === Stage.Larva) {
        b.hunger += dt;
        // Growth cannot outrun nourishment.
        const cap = b.need > 0 ? b.fed / b.need + 0.15 : 1;
        b.progress = Math.min(b.progress + rate * dt, cap);
        if (b.hunger > LARVA_STARVE_DAYS * DAY) {
          died.push(b);
          continue;
        }
        if (b.progress >= 1 && b.fed >= b.need * 0.85) {
          b.stage = Stage.Pupa;
          b.progress = 0;
        }
      } else {
        b.progress += rate * dt;
        if (b.progress >= 1) {
          if (b.stage === Stage.Egg) {
            b.stage = Stage.Larva;
            b.progress = 0;
            b.targetLen = this.sampleLength(w);
            b.need = this.larvalNeed(w, b.targetLen);
            b.hunger = 0;
          } else {
            died.push(b);
            this.eclose(w, b);
          }
        }
      }
    }
    if (died.length) {
      const ids = new Set(died.map((b) => b.id));
      for (const b of died)
        if (b.stage === Stage.Larva) {
          this.proteinStore += b.fed * 0.3;
          this.stats.deaths['larva starved'] = (this.stats.deaths['larva starved'] ?? 0) + 1;
        }
      this.brood = this.brood.filter((b) => !ids.has(b.id));
      for (const id of ids) this.broodById.delete(id);
    }
  }

  private eclose(w: Sim, b: Brood): void {
    if (this.workers >= w.sp.colony.workerCap) return;
    const a = this.addAnt(w, b.targetLen || this.sampleLength(w), w.time);
    a.reserve = a.reserveMax * 0.6;
    this.placeInNest(w, a, b.voxel >= 0 ? b.voxel : w.nest.entrance);
    a.decideAt = w.time + w.rng.range(60, 600);
    this.stats.births++;
  }

  // ------------------------------------------------------------ queens

  queenLay(w: Sim, q: Ant, dt: number): void {
    const sp = w.sp;
    if (this.workers + this.brood.length >= sp.colony.workerCap) return;
    const temp = w.env.nestTemp(q.z, sp.nest.moundHeight);
    const tf = clamp(developmentRate(sp, Stage.Egg, temp) / developmentRate(sp, Stage.Egg, sp.development.refTemp), 0, 1.3);
    const nutrition = clamp(q.queenProtein / (sp.physiology.eggCost * 5), 0, 1);
    const rate = (sp.colony.eggsPerQueenDay / DAY) * tf * nutrition * w.lifeCycleCompression;
    if (q.queenProtein >= sp.physiology.eggCost && w.rng.hazard(rate, dt)) {
      q.queenProtein -= sp.physiology.eggCost;
      const b = this.newBrood(w, Stage.Egg, q.voxel);
      b.queenBrood = false;
      this.stats.eggsLaid++;
    }
  }

  hungryQueen(): Ant | null {
    for (const q of this.queens) if (q.alive && q.queenProtein < 0) return q;
    let worst: Ant | null = null;
    for (const q of this.queens) if (q.alive && (q.queenProtein < 0.0001 + this.queenTarget || q.cropFill < 0.3)) if (!worst || q.queenProtein < worst.queenProtein) worst = q;
    return worst;
  }
  queenTarget = 0;

  feedQueen(w: Sim, a: Ant): void {
    const q = this.queens.find((x) => x.voxel === a.voxel || hypot2(x.x - a.x, x.y - a.y) < w.nest.grid.voxel * 3) ?? this.queens[0];
    if (!q) return;
    if (a.load?.kind === 'protein') {
      q.queenProtein += a.load.mass;
      a.load = null;
    }
    transferCrop(a, q, a.cropVol * 0.5);
    a.tasksDone++;
  }

  queenVoxel(w: Sim, q: Ant): number {
    const idx = this.queens.indexOf(q);
    if (idx <= 0) return this.sites.queen;
    // Additional queens rest nearby within the same chamber.
    const ch = w.nest.chamberOf.get(this.sites.queen);
    const chamber = ch !== undefined ? w.nest.chambers[ch] : undefined;
    if (!chamber) return this.sites.queen;
    return chamber.floor[(idx * 7919) % chamber.floor.length];
  }

  // ------------------------------------------------------------ nursing

  hasFoodFor(_who: 'queen' | 'larvae'): boolean {
    return this.proteinStore > 0.001 || this.granary > 0.01 || this.fungusFood > 0.001;
  }

  foodVoxel(w: Sim): number {
    if (w.sp.special.leafcutter) return this.gardenVoxel(w);
    return this.siteVoxel(w, this.sites.store);
  }

  nurseTakeFood(w: Sim, a: Ant): void {
    const want = a.mass * 0.4;
    let got = 0;
    if (this.fungusFood > 0) {
      got = Math.min(want, this.fungusFood);
      this.fungusFood -= got;
    } else if (this.proteinStore > 0) {
      got = Math.min(want, this.proteinStore);
      this.proteinStore -= got;
    } else if (this.granary > 0) {
      const seed = Math.min(want / SEED_PROTEIN, this.granary);
      this.granary -= seed;
      got = seed * SEED_PROTEIN;
    }
    a.load = got > 0 ? { kind: 'protein', mass: got, ref: -1 } : null;
    void w;
  }

  hungriestLarvaVoxel(w: Sim): number {
    let best: Brood | null = null;
    let score = -1;
    // Sample a subset for efficiency.
    const n = this.brood.length;
    const step = Math.max(1, Math.floor(n / 64));
    for (let i = w.rng.int(step); i < n; i += step) {
      const b = this.brood[i];
      if (b.stage !== Stage.Larva || b.carried) continue;
      const s = b.hunger * (1 - b.fed / Math.max(1e-6, b.need));
      if (s > score) {
        score = s;
        best = b;
      }
    }
    return best ? best.voxel : this.siteVoxel(w, this.sites.larva);
  }

  /** Feed larvae lying near the nurse, hungriest first. */
  nurseFeed(w: Sim, a: Ant): void {
    if (!a.load || a.load.kind !== 'protein') return;
    const g = w.nest.grid;
    const [x, y, z] = g.center(a.voxel);
    const r2 = (g.voxel * 4) ** 2;
    const near = this.brood.filter((b) => {
      if (b.stage !== Stage.Larva || b.carried) return false;
      const [bx, by, bz] = g.center(b.voxel);
      return (bx - x) ** 2 + (by - y) ** 2 + (bz - z) ** 2 <= r2;
    });
    near.sort((p, q) => q.hunger - p.hunger);
    let left = a.load.mass;
    for (const b of near) {
      if (left <= 0) break;
      const give = Math.min(left, Math.max(0, b.need - b.fed), a.load.mass / 3);
      if (give <= 0) continue;
      b.fed += give;
      b.hunger = 0;
      left -= give;
      // Nurses also pass on some carbohydrate.
      a.cropVol *= 0.97;
      a.cropSugar *= 0.97;
    }
    this.proteinStore += left;
    a.load = null;
  }

  /** Find a brood item lying outside the chamber chosen for its stage. */
  misplacedBrood(w: Sim): Brood | null {
    const n = this.brood.length;
    if (n === 0) return null;
    for (let k = 0; k < Math.min(n, 40); k++) {
      this.misplacedCursor = (this.misplacedCursor + 1) % n;
      const b = this.brood[this.misplacedCursor];
      if (b.carried) continue;
      const want = this.broodChamber[b.stage];
      if (want < 0) continue;
      const ch = w.nest.chamberOf.get(b.voxel);
      if (ch !== want) return b;
    }
    return null;
  }

  pickBrood(w: Sim, a: Ant): boolean {
    const b = this.broodById.get(Number(a.outMode));
    if (!b) return false;
    b.carried = true;
    a.load = { kind: 'brood', mass: w.sp.morphology.massCoef * (b.targetLen || 2) ** 3 * 0.3, ref: b.id };
    return true;
  }

  broodDropVoxel(w: Sim, a: Ant): number {
    const b = a.load ? this.broodById.get(a.load.ref) : undefined;
    const stage = b ? b.stage : Stage.Larva;
    return this.siteVoxel(w, stage === Stage.Egg ? this.sites.egg : stage === Stage.Larva ? this.sites.larva : this.sites.pupa);
  }

  dropBrood(_w: Sim, a: Ant): void {
    if (!a.load || a.load.kind !== 'brood') return;
    const b = this.broodById.get(a.load.ref);
    if (b) {
      b.carried = false;
      b.voxel = a.voxel;
    }
    a.load = null;
  }

  broodSiteVoxel(w: Sim, stage: Stage): number {
    return this.siteVoxel(w, stage === Stage.Egg ? this.sites.egg : stage === Stage.Larva ? this.sites.larva : this.sites.pupa);
  }

  // ------------------------------------------------------------ foragers

  needFor(kind: string): number {
    switch (kind) {
      case 'sugar':
      case 'honeydew':
        return this.carbNeed;
      case 'insect':
        return Math.max(this.proteinNeed, 0.3);
      case 'seed':
        return this.stimulus.forage;
      case 'leaf':
        return this.stimulus.forage;
      default:
        return 0.5;
    }
  }

  waitVoxel(w: Sim): number {
    return this.siteVoxel(w, this.sites.wait);
  }

  storeVoxel(w: Sim, kind: string): number {
    if (kind === 'leaf') return this.gardenVoxel(w);
    return this.siteVoxel(w, this.sites.store);
  }

  depositFood(w: Sim, a: Ant, _voxel: number): void {
    const l = a.load;
    if (!l) return;
    switch (l.kind) {
      case 'insect':
        this.proteinStore += l.mass * INSECT_PROTEIN;
        this.stats.proteinCollected += l.mass * INSECT_PROTEIN;
        break;
      case 'protein':
        this.proteinStore += l.mass;
        break;
      case 'seed':
        this.granary += l.mass;
        this.stats.seedsCollected++;
        break;
      case 'leaf':
        this.leafPending += l.mass;
        break;
      case 'corpse':
      case 'refuse':
        this.addRefuse(w, a.voxel, l.mass);
        break;
    }
    this.stats.trips++;
    if (a.rider >= 0) {
      const r = this.byId.get(a.rider);
      if (r) r.riding = -1;
      a.rider = -1;
    }
  }

  /** Workers in the nest near ant a (for unloading the crop). */
  nearbyNestmates(w: Sim, a: Ant, n: number): Ant[] {
    const out: Ant[] = [];
    const r2 = (w.nest.grid.voxel * 6) ** 2;
    const len = this.ants.length;
    for (let tries = 0; tries < 80 && out.length < n && len > 0; tries++) {
      const b = this.ants[w.rng.int(len)];
      if (b === a || b.loc !== Loc.Nest || b.queen || !b.alive || b.cropFill > 0.7) continue;
      if ((b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z - a.z) ** 2 < r2) out.push(b);
    }
    // Fall back to any hungry nestmates (receivers come to the entrance chamber).
    for (let tries = 0; tries < 40 && out.length < Math.min(2, n) && len > 0; tries++) {
      const b = this.ants[w.rng.int(len)];
      if (b !== a && b.loc === Loc.Nest && !b.queen && b.alive && b.cropFill < 0.5 && !out.includes(b)) out.push(b);
    }
    return out;
  }

  /**
   * In-nest recruitment by a successful forager. Mass recruiters stimulate
   * several available foragers, who then follow the trail; Temnothorax
   * recruits exactly one follower for a tandem run.
   */
  recruit(w: Sim, a: Ant): void {
    const sp = w.sp;
    this.stats.recruitEvents++;
    const pool = this.ants.filter((b) => b !== a && b.alive && b.loc === Loc.Nest && !b.queen && b.task === 'forage' && b.mode === 'wait' && !b.recruited && b.partner < 0);
    if (sp.foraging.mode === 'tandem') {
      if (!a.mem) return;
      const b = pool.length ? pool[w.rng.int(pool.length)] : this.ants.find((x) => x !== a && x.loc === Loc.Nest && !x.queen && x.task !== 'nurse' && x.partner < 0);
      if (!b) return;
      a.partner = b.id;
      b.partner = a.id;
      b.recruited = true;
      b.task = 'forage';
      if (b.mode !== 'wait') {
        b.mode = 'wait';
        b.timer = 0;
      }
      a.target = 0;
      return;
    }
    const contacts = Math.round(sp.foraging.recruitContacts * clamp(a.laying, 0.3, 2));
    for (let k = 0; k < contacts; k++) {
      let b: Ant | undefined = pool.length ? pool.splice(w.rng.int(pool.length), 1)[0] : undefined;
      if (!b) {
        // Idle workers with low foraging thresholds can also be recruited.
        const cand = this.ants[w.rng.int(this.ants.length)];
        if (cand && cand !== a && cand.loc === Loc.Nest && !cand.queen && cand.mode === 'rest' && cand.th.forage < 0.6) b = cand;
      }
      if (!b) continue;
      if (w.rng.chance(sp.foraging.recruitResponse * (0.4 + 0.6 * this.stimulus.forage))) {
        b.task = 'forage';
        b.recruited = true;
        b.mode = 'wait';
        b.timer = 0;
        b.mem = null;
      }
    }
  }

  isMinimHitchhiker(w: Sim, a: Ant): boolean {
    const lc = w.sp.special.leafcutter;
    return !!lc && a.len < 3 && w.env.light > 0.3;
  }

  // ------------------------------------------------------------ harvester ants

  harvesterReturn(): void {
    this.returnsSlot++;
  }

  /** Called once per second (Prabhakar, Dektar & Gordon 2012). */
  harvesterStep(w: Sim): void {
    const hp = w.sp.special.harvester;
    if (!hp) return;
    if (!this.forageAllowed || !this.forageDay) {
      this.returnsSlot = 0;
      this.departuresPrev = 0;
      return;
    }
    this.alpha = Math.max(this.alpha - hp.q * this.departuresPrev + hp.c * this.returnsSlot - hp.d, hp.alphaMin);
    let D = w.rng.poisson(this.alpha);
    let sent = 0;
    if (D > 0) {
      const pool = this.ants.filter((b) => b.alive && b.loc === Loc.Nest && b.task === 'forage' && b.mode === 'wait');
      while (D-- > 0 && pool.length) {
        const b = pool.splice(w.rng.int(pool.length), 1)[0];
        b.mode = 'toExit';
        b.outMode = b.mem && w.rng.chance(w.sp.navigation.siteFidelity) ? 'toSite' : 'search';
        b.nextVoxel = -1;
        sent++;
      }
    }
    this.departuresPrev = sent;
    this.returnsSlot = 0;
  }

  /** Daily patrol cycle: foraging begins only after patrollers return (Greene & Gordon). */
  private harvesterDaily(w: Sim): void {
    const hp = w.sp.special.harvester!;
    const light = w.env.light;
    if (light < 0.05) {
      this.forageDay = false;
      this.patrolLaunched = false;
      this.patrolReturns = 0;
      this.alpha = hp.alphaMin;
      return;
    }
    if (!this.patrolLaunched && light > 0.2) {
      this.patrolLaunched = true;
      const cands = this.ants.filter((a) => a.loc === Loc.Nest && !a.queen && a.ageDays(w.time) > w.sp.colony.forageAge * 0.8);
      for (let i = 0; i < hp.patrollers && cands.length; i++) {
        const a = cands.splice(w.rng.int(cands.length), 1)[0];
        a.task = 'patrol';
        a.mode = 'toExit';
        a.outMode = 'patrol';
        a.nextVoxel = -1;
      }
      w.log(`Morning: ${hp.patrollers} patrollers leave the nest.`);
    }
  }

  patrolReturned(w: Sim, _a: Ant): void {
    const hp = w.sp.special.harvester;
    if (!hp) return;
    this.patrolReturns++;
    if (!this.forageDay && this.patrolReturns >= Math.max(3, hp.patrollers * 0.2)) {
      this.forageDay = true;
      this.alpha = hp.alphaMin + hp.c * this.patrolReturns;
      w.log('Patrollers have returned — foraging begins.');
    }
  }

  // ------------------------------------------------------------ corpses & refuse

  claimCorpse(a: Ant): NestCorpse | null {
    void a;
    const now = this.timeRef;
    const c = this.nestCorpses.find((x) => !x.claimed && now - x.died > CORPSE_DELAY);
    if (c) c.claimed = true;
    return c ?? null;
  }
  timeRef = 0;

  takeCorpse(a: Ant): NestCorpse | null {
    const i = this.nestCorpses.findIndex((x) => x.claimed && x.voxel === a.voxel);
    const j = i >= 0 ? i : this.nestCorpses.findIndex((x) => x.claimed);
    if (j < 0) return null;
    return this.nestCorpses.splice(j, 1)[0];
  }

  refuseVoxel(w: Sim): number {
    return this.sites.refuse >= 0 ? this.siteVoxel(w, this.sites.refuse) : -1;
  }

  addRefuse(_w: Sim, voxel: number, mass: number): void {
    this.refuse += mass;
    if (voxel >= 0) this.refuseVoxels.push(voxel);
    if (this.refuseVoxels.length > 400) this.refuseVoxels.shift();
  }

  // ------------------------------------------------------------ fungus gardens (Atta)

  gardenVoxel(w: Sim): number {
    if (!this.sites.garden.length) return this.siteVoxel(w, this.sites.store);
    return this.siteVoxel(w, this.sites.garden[w.rng.int(this.sites.garden.length)]);
  }

  /** A gardener processes pending leaf material into fungus garden. */
  processGarden(w: Sim, a: Ant): void {
    const lc = w.sp.special.leafcutter;
    if (!lc) return;
    // Estimated processing capacity: ~1 mg of leaf per 10 min per worker.
    const amount = Math.min(this.leafPending, 0.0017 * 600 * (a.len / 3));
    this.leafPending -= amount;
    this.garden += amount * lc.leafToGarden;
  }

  // ------------------------------------------------------------ Temnothorax walls

  private updateWallCandidates(w: Sim): void {
    const g = w.nest.grid;
    if (this.wallVersion === g.version && this.wallCandidates.length) return;
    this.wallVersion = g.version;
    const cav = w.sp.special.crevice;
    if (!cav) return;
    const centre = this.siteVoxel(w, this.sites.larva);
    const [cx, cy] = g.center(centre >= 0 ? centre : w.nest.entrance);
    // Franks & Deneubourg 1997: the wall is built at a distance set by colony size.
    const N = this.workers + this.brood.length * 0.3;
    this.wallRadius = Math.sqrt((N * cav.wallAreaPerWorker) / Math.PI);
    const R = this.wallRadius;
    const entranceAngle = Math.atan2(w.ey - cy, w.ex - cx);
    const out: number[] = [];
    for (let i = 0; i < g.airCount; i++) {
      const v = g.airList[i];
      const [x, y] = g.center(v);
      const d = Math.hypot(x - cx, y - cy);
      if (d < R || d > R + g.voxel * 1.6) continue;
      const ang = Math.atan2(y - cy, x - cx);
      if (Math.abs(((ang - entranceAngle + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) < 0.3) continue;
      out.push(v);
    }
    for (const [v] of this.wallGrains) if (g.mat[v] === Mat.Wall) out.push(v);
    this.wallCandidates = out;
  }

  private wallDeficit(w: Sim): number {
    this.updateWallCandidates(w);
    if (!this.wallCandidates.length) return 0;
    let built = 0;
    for (const v of this.wallCandidates) if (w.nest.grid.mat[v] === Mat.Wall) built++;
    return clamp(1 - built / this.wallCandidates.length, 0, 1);
  }

  wallTarget(w: Sim): number {
    this.updateWallCandidates(w);
    const open = this.wallCandidates.filter((v) => w.nest.grid.isAir(v));
    if (!open.length) return w.nest.entrance;
    // Stigmergy: prefer to add to sites that already have grains.
    let best = open[w.rng.int(open.length)];
    for (let k = 0; k < 6; k++) {
      const v = open[w.rng.int(open.length)];
      if ((this.wallGrains.get(v) ?? 0) > (this.wallGrains.get(best) ?? 0)) best = v;
    }
    return best;
  }

  placeGrain(w: Sim, a: Ant): void {
    const cav = w.sp.special.crevice;
    if (!cav || !w.nest.grid.isAir(a.voxel)) return;
    const n = (this.wallGrains.get(a.voxel) ?? 0) + 1;
    this.wallGrains.set(a.voxel, n);
    const perVoxel = Math.max(1, Math.round(w.nest.grid.voxel ** 3 / cav.grainVolume));
    if (n >= perVoxel) {
      const v = a.voxel;
      w.nest.grid.fill(v, Mat.Wall);
      // The builder steps back out of the filled voxel.
      w.nest.grid.forNeighbours(v, () => {});
      this.placeInNest(w, a, this.siteVoxel(w, this.sites.wait));
    }
    a.tasksDone++;
  }

  // ------------------------------------------------------------ chambers & sites

  /**
   * Assign roles to chambers: waiting/unloading near the entrance, food store
   * close to it, brood where the temperature best matches the nurses'
   * preference, queen at the species' preferred relative depth, refuse in the
   * deepest chamber (Atta), gardens in the remaining chambers (Atta).
   */
  assignSites(w: Sim, initial: boolean): void {
    this.siteTime = w.time;
    this.timeRef = w.time;
    const nest = w.nest;
    nest.updateChambers();
    const chambers = nest.chambers;
    const sp = w.sp;
    const exit = nest.exitField(w.time);
    if (!chambers.length) {
      const e = nest.entrance;
      this.sites = { wait: e, store: e, queen: e, egg: e, larva: e, pupa: e, refuse: -1, garden: [] };
      this.broodChamber = [-1, -1, -1];
      return;
    }
    const dist = (c: Chamber) => nest.dist(exit, nest.chamberCentreVoxel(c));
    const byExit = [...chambers].sort((a, b) => dist(a) - dist(b));
    const tempOf = (c: Chamber) => w.env.nestTemp(c.cz, sp.nest.moundHeight);
    const single = chambers.length === 1;
    const ch0 = byExit[0];
    const anchor = (c: Chamber, x: number, y: number, z: number) => {
      let best = c.floor[0];
      let bd = Infinity;
      for (const v of c.floor) {
        const [vx, vy, vz] = nest.grid.center(v);
        const d = (vx - x) ** 2 + (vy - y) ** 2 + (vz - z) ** 2;
        if (d < bd) {
          bd = d;
          best = v;
        }
      }
      return best;
    };
    if (single) {
      // One cavity (crevice/void): partition it spatially — workers near the
      // entrance, brood and queen in the middle.
      const c = ch0;
      const [ex, ey, ez] = nest.grid.center(nest.entrance);
      const mx = c.cx * 0.75 + ex * 0.25;
      const my = c.cy * 0.75 + ey * 0.25;
      const centre = anchor(c, c.cx, c.cy, c.cz);
      this.sites = {
        wait: anchor(c, c.cx * 0.4 + ex * 0.6, c.cy * 0.4 + ey * 0.6, ez),
        store: anchor(c, mx, my, c.cz),
        queen: centre,
        egg: centre,
        larva: anchor(c, c.cx + (c.cx - ex) * 0.1, c.cy + (c.cy - ey) * 0.1, c.cz),
        pupa: anchor(c, c.cx + (c.cx - ex) * 0.2, c.cy - (c.cy - ey) * 0.15, c.cz),
        refuse: -1,
        garden: [],
      };
      this.broodChamber = [c.id, c.id, c.id];
      return;
    }
    const lc = sp.special.leafcutter;
    const deepest = chambers[chambers.length - 1];
    const refuse = lc && chambers.length > 3 ? deepest : null;
    const usable = chambers.filter((c) => c !== refuse);
    const pref = sp.development.broodTempPref;
    const bestFor = (list: Chamber[], T: number) => list.reduce((b, c) => (Math.abs(tempOf(c) - T) < Math.abs(tempOf(b) - T) ? c : b), list[0]);
    const gardens = lc ? usable.filter((c) => c !== ch0) : [];
    const broodPool = lc && gardens.length ? gardens : usable;
    const larvaC = bestFor(broodPool, pref);
    const pupaC = bestFor(broodPool, pref + 1);
    const depthMax = Math.max(1, -Math.min(...chambers.map((c) => c.cz)));
    const queenC = usable.reduce((b, c) => (Math.abs(-c.cz / depthMax - sp.nest.queenDepth) < Math.abs(-b.cz / depthMax - sp.nest.queenDepth) ? c : b), usable[0]);
    const storeC = byExit.find((c) => c !== refuse && c !== larvaC) ?? ch0;
    const keep = (old: number, c: Chamber) => (!initial && old >= 0 && nest.chamberOf.get(old) === c.id ? old : nest.chamberCentreVoxel(c));
    this.sites = {
      wait: keep(this.sites.wait, ch0),
      store: keep(this.sites.store, storeC),
      queen: keep(this.sites.queen, queenC),
      egg: keep(this.sites.egg, queenC),
      larva: keep(this.sites.larva, larvaC),
      pupa: keep(this.sites.pupa, pupaC),
      refuse: refuse ? nest.chamberCentreVoxel(refuse) : -1,
      garden: gardens.map((c) => nest.chamberCentreVoxel(c)),
    };
    this.broodChamber = [queenC.id, larvaC.id, pupaC.id];
  }

  /** A random floor voxel in the chamber containing `anchor`, near the anchor. */
  siteVoxel(w: Sim, anchor: number): number {
    const nest = w.nest;
    if (anchor < 0) return nest.entrance;
    const ch = nest.chamberOf.get(anchor);
    if (ch === undefined) return nest.grid.isAir(anchor) ? anchor : nest.entrance;
    const c = nest.chambers[ch];
    const [ax, ay, az] = nest.grid.center(anchor);
    const spread = (nest.grid.voxel * 4) ** 2;
    for (let k = 0; k < 12; k++) {
      const v = c.floor[w.rng.int(c.floor.length)];
      const [x, y, z] = nest.grid.center(v);
      if ((x - ax) ** 2 + (y - ay) ** 2 + (z - az) ** 2 < spread) return v;
    }
    return anchor;
  }

  randomChamberVoxel(w: Sim): number {
    const ch = w.nest.chambers;
    if (!ch.length) return w.nest.entrance;
    const c = ch[w.rng.int(ch.length)];
    return c.floor[w.rng.int(c.floor.length)];
  }

  // ------------------------------------------------------------ history

  private sample(w: Sim): void {
    let eggs = 0;
    let larvae = 0;
    let pupae = 0;
    for (const b of this.brood) {
      if (b.stage === Stage.Egg) eggs++;
      else if (b.stage === Stage.Larva) larvae++;
      else pupae++;
    }
    let outside = 0;
    for (const a of this.ants) if (a.loc === Loc.Surface) outside++;
    const lv = this.siteVoxel(w, this.sites.larva);
    this.history.push({
      t: w.time,
      workers: this.workers,
      eggs,
      larvae,
      pupae,
      outside,
      volume: w.nest.volume,
      carbNeed: this.carbNeed,
      proteinNeed: this.proteinNeed,
      surfaceT: w.env.surfaceT,
      airT: w.env.airT,
      broodT: w.env.nestTemp(w.nest.grid.center(lv)[2], w.sp.nest.moundHeight),
    });
    if (this.history.length > 4000) this.history.splice(0, this.history.length - 4000);
  }
}
