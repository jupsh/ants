import { Body } from '../agent/body';
import { Ledger } from '../physics/ledger';
import type { Mind } from '../mind/mind';
import type { Apparatus } from './apparatus';
import type { PheromoneField } from './field';
import type { SugarDroplet } from './food';
import type { PathField } from './pathField';
import { PlaneSurface, type Surface } from './surface';

export interface Agent {
  body: Body;
  mind: Mind;
  /** Outside the simulation's active set (e.g. back in the nest after a scout trip). */
  inactive: boolean;
}

/**
 * World truth for laboratory experiments on a planar apparatus. Physics and
 * perception read and write it; behaviour never sees it.
 */
export class World {
  time = 0;
  tempC: number;
  rh: number;
  light = 1;
  readonly surface: Surface = new PlaneSurface(0);
  readonly ledger = new Ledger();
  ants: Agent[] = [];
  food: SugarDroplet[] = [];
  trail: PheromoneField | null = null;
  /** Concentration (units/mm) at which a fresh trail is just detectable. */
  trailThreshold = 1;
  /** Radius (mm) within which nest odour at the entrance is detectable. */
  nestCueRadius = 8;
  /**
   * Optional cues that spread along the surface (step 4): nest odour sensed
   * outside the nest (replacing the straight-line entrance cue, detectable
   * within nestCueRadius of path distance), and the exit cue (air/light from
   * the passage) sensed inside it.
   */
  nestOdour: PathField | null = null;
  exitCue: PathField | null = null;
  private nextFoodId = 1;

  constructor(
    readonly apparatus: Apparatus,
    readonly entrance: [number, number],
    readonly seed: number,
    tempC: number,
    rh: number,
  ) {
    this.tempC = tempC;
    this.rh = rh;
  }

  addFood(make: (id: number) => SugarDroplet): SugarDroplet {
    const f = make(this.nextFoodId++);
    this.food.push(f);
    // Food enters the system from outside.
    this.ledger.move('sugar', 'external', 'food', f.volumeUl * f.sugarPerUl());
    this.ledger.move('water', 'external', 'food', f.volumeUl * f.waterPerUl());
    return f;
  }

  /** Sum of sugar/water held by entities, per ledger account (for conservation checks). */
  entityTotals(): Record<string, number> {
    let foodS = 0;
    let foodW = 0;
    for (const f of this.food) {
      foodS += f.volumeUl * f.sugarPerUl();
      foodW += f.volumeUl * f.waterPerUl();
    }
    let cropS = 0;
    let cropW = 0;
    let resS = 0;
    let resW = 0;
    for (const a of this.ants) {
      cropS += a.body.cropSugar;
      cropW += a.body.cropWater;
      resS += a.body.reserve;
      resW += a.body.water;
    }
    return { 'sugar:food': foodS, 'water:food': foodW, 'sugar:crop': cropS, 'water:crop': cropW, 'sugar:reserve': resS, 'water:reserve': resW };
  }
}
