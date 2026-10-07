import { sucroseSugarPerUl, sucroseWaterPerUl } from '../physics/ledger';

/**
 * A droplet of sucrose solution. `accessibleFraction` models how much of the
 * drop an ant can actually imbibe (e.g. a drop hanging from a micropipette
 * tip retracts into the tip before it is empty — an apparatus property, not
 * an ant property).
 */
export class SugarDroplet {
  readonly initialUl: number;

  constructor(
    readonly id: number,
    readonly x: number,
    readonly y: number,
    public volumeUl: number,
    readonly molar: number,
    readonly accessibleFraction = 1,
  ) {
    this.initialUl = volumeUl;
  }

  /** Radius of a hemispherical drop (mm; 1 µL = 1 mm³). */
  radius(): number {
    return Math.cbrt((3 * Math.max(this.volumeUl, 0.001)) / (2 * Math.PI));
  }

  accessibleUl(): number {
    return Math.max(0, this.volumeUl - this.initialUl * (1 - this.accessibleFraction));
  }

  sugarPerUl(): number {
    return sucroseSugarPerUl(this.molar);
  }

  waterPerUl(): number {
    return sucroseWaterPerUl(this.molar);
  }
}
