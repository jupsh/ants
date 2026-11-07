// Scratch (not committed): colony moving fraction per 1-min bin (STATUS 2026-10-17 ≈ 06:38 UTC check C-a). One code path
// for tracks and simulations; moving step as in the rows (≤ 3-frame gap, ≥ 0.6 mm/frame). Output per bin: [bin start
// frame, t of the bin's first frame (UTC s; NaN in simulations), moving steps, steps].
// The step rule is factored out as `StepRule` (2026-10-30, Part D item 1(b), D212 amendment 1) so that other scripts
// import it rather than copy it; `ActivitySeries`' output is unchanged.

/**
 * The step rule, per ant: a step is two in-nest detections ≤ 3 frames apart, moving if its displacement per frame is
 * ≥ 0.6 mm. `read` takes one read of ant i at frame f and returns -1 if the read is skipped (the ant already has an
 * in-nest read in this frame), 0 if it makes no step, 1 for a step that is not moving, 2 for a moving step.
 */
export class StepRule {
  private readonly lastF: Int32Array;
  private readonly lastX: Float64Array;
  private readonly lastY: Float64Array;
  constructor(n: number) {
    this.lastF = new Int32Array(n).fill(-1e9);
    this.lastX = new Float64Array(n);
    this.lastY = new Float64Array(n);
  }
  read(i: number, f: number, x: number, y: number, inNest: boolean): number {
    if (this.lastF[i] === f) return -1;
    const g = f - this.lastF[i];
    let r = 0;
    if (inNest && g <= 3) r = Math.hypot(x - this.lastX[i], y - this.lastY[i]) / g >= 0.6 ? 2 : 1;
    this.lastF[i] = inNest ? f : -1e9;
    this.lastX[i] = x;
    this.lastY[i] = y;
    return r;
  }
}

export class ActivitySeries {
  private readonly rule: StepRule;
  readonly bins: number[][] = [];
  private cur: number[] | null = null;
  constructor(readonly track: boolean[], readonly binFrames = 120) {
    this.rule = new StepRule(track.length);
  }
  frame(f: number, ids: number[], xs: number[], ys: number[], ins: boolean[], t = NaN): void {
    const b = Math.floor(f / this.binFrames) * this.binFrames;
    if (!this.cur || this.cur[0] !== b) this.bins.push((this.cur = [b, t, 0, 0]));
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      if (!this.track[i]) continue;
      const r = this.rule.read(i, f, xs[q], ys[q], ins[q]);
      if (r > 0) {
        this.cur[3]++;
        if (r === 2) this.cur[2]++;
      }
    }
  }
}
