/**
 * Walking surfaces. Positions are intrinsic surface coordinates (mm measured
 * along the surface), so distances walked are true path lengths even on steep
 * substrates. A surface reports its local inclination and the in-surface
 * direction of steepest descent, which is what an ant can sense through
 * gravity receptors.
 */
export interface SlopeSense {
  /** Inclination of the substrate from horizontal (rad). */
  incline: number;
  /** In-surface heading (rad) pointing straight downhill; undefined on flat ground. */
  downhill: number;
}

export interface Surface {
  slopeAt(x: number, y: number): SlopeSense;
  /** World height (mm) of a surface point, for rendering. */
  heightAt(x: number, y: number): number;
}

/** A flat plane tilted by `incline` with its downhill direction along `downhill` (in-surface coords). */
export class PlaneSurface implements Surface {
  constructor(
    readonly incline = 0,
    readonly downhill = -Math.PI / 2,
  ) {}

  slopeAt(): SlopeSense {
    return { incline: this.incline, downhill: this.downhill };
  }

  heightAt(x: number, y: number): number {
    // Height drops along the downhill direction.
    const d = x * Math.cos(this.downhill) + y * Math.sin(this.downhill);
    return -d * Math.sin(this.incline);
  }
}
