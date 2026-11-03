// Scratch (not committed): does activity spread, and do contacts predict it? (STATUS 2026-10-17 ≈ 05:57 UTC, amending
// ≈ 05:55; user's question and guidance.) One code path for recorded tracks and simulated observers. Moving as in the
// rows (step from the last detection ≤ 3 frames back ≥ 0.6 mm/frame). A **movement onset** is an ant's first moving step
// after ≥ ONSET_STILL frames below the threshold (gaps ≤ 3 frames; a longer gap restarts the count) — a threshold
// crossing, not waking. Per label (light / dark):
// - `events`: every onset, flat [frame, ant, x, y, still frames before] (position before the step) — for the episode
//   tests offline (spatial order within an episode against within-episode and cross-episode nulls);
// - `counts[band][|lag|]`: pairs of onsets of different ants within ONSET_MAXLAG frames by distance band (synchrony
//   description only: its far-lag null destroys social spread and shared triggers alike);
// - `risk[stratum]` = [n exposed, onsets exposed, n unexposed, onsets unexposed]: every still ant (≥ ONSET_STILL) in
//   every frame is a unit at risk; exposed if a moving partner made contact with it this frame while it was not moving
//   (`ContactStats` primary radius); outcome its own onset within RISK_WIN frames. Strata: distance to the nearest onset
//   in the last 4 frames (< 5, 5–10, 10–20 mm, farther or none) × colony onsets in the last 10 frames (0, 1–2, ≥ 3).
// - `snaps` (only with `snap`; Part D Stage 0, D126 amendment 1): at every frame with an onset, flat [ant, x, y, still before
//   this frame, in-nest detections in the 20 frames before] for every tracked ant detected in-nest ≤ 3 frames back, keyed by
//   frame (x, y: its last detection at or before the frame). Read-only on the state, so `events` are unchanged.
export const ONSET_STILL = 20; // 10 s at 2 fps
export const ONSET_MAXLAG = 600; // 5 min
export const ONSET_BANDS = [5, 10, 20, 40]; // mm: < 5, 5–10, 10–20, 20–40, ≥ 40
export const RISK_WIN = 4; // 2 s

interface Ev { f: number; x: number; y: number; i: number }
interface Out { events: number[]; counts: number[][]; risk: number[][] }

export class OnsetStats {
  private readonly lastF: Int32Array;
  private readonly lastX: Float64Array;
  private readonly lastY: Float64Array;
  private readonly still: Int32Array;
  private readonly lastOnset: Int32Array;
  private readonly recent: Ev[] = [];
  /** Units at risk awaiting their outcome: frame, ant, stratum, exposed. */
  private pending: { f: number; i: number; s: number; e: boolean; o: Out }[] = [];
  readonly out: Record<string, Out> = {};
  /** With `snap`: per label, frame → flat snapshot (see the header). */
  readonly snaps: Record<string, Record<number, number[]>> = {};
  private readonly det: number[][] = [];
  constructor(readonly track: boolean[], readonly snap = false) {
    const n = track.length;
    this.lastF = new Int32Array(n).fill(-1e9);
    this.lastX = new Float64Array(n);
    this.lastY = new Float64Array(n);
    this.still = new Int32Array(n);
    this.lastOnset = new Int32Array(n).fill(-1e9);
  }
  /** `label`: 'light' / 'dark'; with the frame's UTC time t instead, light is 06–18 UTC. `contacts`: from `ContactStats.frame`. */
  frame(f: number, ids: number[], xs: number[], ys: number[], ins: boolean[], label: string | number, contacts: [number, number, boolean, boolean][]): void {
    const lab = typeof label === 'string' ? label : (() => { const h = (((label / 3600) % 24) + 24) % 24; return h >= 6 && h < 18 ? 'light' : 'dark'; })();
    const O = (this.out[lab] ??= { events: [], counts: Array.from({ length: ONSET_BANDS.length + 1 }, () => new Array(ONSET_MAXLAG + 1).fill(0)), risk: Array.from({ length: 12 }, () => [0, 0, 0, 0]) });
    while (this.recent.length && this.recent[0].f < f - ONSET_MAXLAG) this.recent.shift();
    const now: Ev[] = [];
    const eligible: number[] = [];
    const stillPre = this.snap ? Int32Array.from(this.still) : null;
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      if (!this.track[i] || this.lastF[i] === f) continue;
      if (!ins[q]) {
        this.lastF[i] = -1e9;
        continue;
      }
      const g = f - this.lastF[i];
      if (g > 3) this.still[i] = 0;
      else if (Math.hypot(xs[q] - this.lastX[i], ys[q] - this.lastY[i]) / g >= 0.6) {
        if (this.still[i] >= ONSET_STILL) {
          now.push({ f, x: this.lastX[i], y: this.lastY[i], i });
          O.events.push(f, i, this.lastX[i], this.lastY[i], this.still[i]);
          this.lastOnset[i] = f;
        }
        this.still[i] = 0;
      } else this.still[i] += g;
      this.lastF[i] = f;
      this.lastX[i] = xs[q];
      this.lastY[i] = ys[q];
      if (this.still[i] >= ONSET_STILL) eligible.push(i);
    }
    if (this.snap) this.snapshot(f, lab, now.length > 0, stillPre!);
    // Outcomes of units whose window has closed.
    let k = 0;
    for (const u of this.pending) {
      if (f - u.f < RISK_WIN) {
        this.pending[k++] = u;
        continue;
      }
      const y = this.lastOnset[u.i] > u.f && this.lastOnset[u.i] <= u.f + RISK_WIN ? 1 : 0;
      const r = u.o.risk[u.s];
      if (u.e) { r[0]++; r[1] += y; } else { r[2]++; r[3] += y; }
    }
    this.pending.length = k;
    // Synchrony description (pairs of onsets by distance and lag).
    const band = (d: number) => { let b = 0; while (b < ONSET_BANDS.length && d >= ONSET_BANDS[b]) b++; return b; };
    for (const e of now) for (const r of this.recent) if (r.i !== e.i) O.counts[band(Math.hypot(e.x - r.x, e.y - r.y))][f - r.f]++;
    for (let a = 0; a < now.length; a++) for (let b = a + 1; b < now.length; b++) O.counts[band(Math.hypot(now[a].x - now[b].x, now[a].y - now[b].y))][0]++;
    for (const e of now) this.recent.push(e);
    // Units at risk this frame: still ants, exposed if a moving partner contacted them while they were not moving.
    if (!eligible.length) return;
    const exposed = new Set<number>();
    for (const [i, j, mi, mj] of contacts) {
      if (mj && !mi) exposed.add(i);
      if (mi && !mj) exposed.add(j);
    }
    let n10 = 0;
    const near4: Ev[] = [];
    for (let q = this.recent.length - 1; q >= 0 && this.recent[q].f > f - 10; q--) {
      n10++;
      if (this.recent[q].f > f - 4) near4.push(this.recent[q]);
    }
    const inten = n10 === 0 ? 0 : n10 <= 2 ? 1 : 2;
    for (const i of eligible) {
      let d = Infinity;
      for (const e of near4) d = Math.min(d, Math.hypot(e.x - this.lastX[i], e.y - this.lastY[i]));
      const db = d < 5 ? 0 : d < 10 ? 1 : d < 20 ? 2 : 3;
      this.pending.push({ f, i, s: db * 3 + inten, e: exposed.has(i), o: O });
    }
  }

  /** Snapshot at frame f (only with `snap`): detections in the 20 frames before f, then this frame's detection recorded. */
  private snapshot(f: number, lab: string, any: boolean, stillPre: Int32Array): void {
    const n = this.track.length;
    if (any) {
      const S: number[] = [];
      for (let i = 0; i < n; i++) {
        if (!this.track[i] || this.lastF[i] < f - 3) continue;
        const d = this.det[i] ?? [];
        let c = 0;
        for (const g of d) if (g >= f - 20 && g < f) c++;
        S.push(i, this.lastX[i], this.lastY[i], stillPre[i], c);
      }
      (this.snaps[lab] ??= {})[f] = S;
    }
    for (let i = 0; i < n; i++) {
      if (this.lastF[i] !== f) continue;
      const d = (this.det[i] ??= []);
      d.push(f);
      while (d.length && d[0] < f - 20) d.shift();
    }
  }
}
