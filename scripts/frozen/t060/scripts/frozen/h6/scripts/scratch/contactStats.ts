// Scratch (not committed): in-nest contact rates from observed positions, one code path for recorded tracks and simulated
// observers (STATUS 2026-10-17, overnight contact check). Per frame, every pair of tracked ants both detected in the nest
// is near if their centre distance is < r and far once it is > rOut (hysteresis, so position noise at the edge does not
// make contacts). A contact is a far → near transition of a pair seen in both states with no joint gap > 3 frames (a
// longer gap forgets the pair's state, so a pair first seen near is not counted; first seen between r and rOut: far). Moving: the ant's step from its last
// detection (≤ 3 frames back) is ≥ 0.6 mm/frame, the rows' threshold. Counted per label (light / dark): detected
// ant-frames, ant-frames with ≥ 1 near neighbour, contacts, contacts in which at least one of the two was moving.
export const CONTACT_R: [number, number][] = [[4.1, 5.1], [6, 7]]; // 1 body length (primary); ≈ antenna tip + half a body

interface Count { antFrames: number; nearFrames: number; contacts: number; contactsMoving: number }

export class ContactStats {
  private readonly n: number;
  private readonly state: Uint8Array[]; // per radius, pair i*n+j (i < j): 0 unknown, 1 far, 2 near
  private readonly last: Int32Array; // last frame both were detected
  private readonly lastF: Int32Array;
  private readonly lastX: Float64Array;
  private readonly lastY: Float64Array;
  readonly out: Record<string, Count[]> = {};
  constructor(readonly track: boolean[], readonly radii = CONTACT_R) {
    this.n = track.length;
    this.state = radii.map(() => new Uint8Array(this.n * this.n));
    this.last = new Int32Array(this.n * this.n).fill(-1e9);
    this.lastF = new Int32Array(this.n).fill(-1e9);
    this.lastX = new Float64Array(this.n);
    this.lastY = new Float64Array(this.n);
  }
  /** `label`: 'light' / 'dark'; with the frame's UTC time t instead, light is 06–18 UTC. */
  /** Returns this frame's contacts at the primary radius as [i, j, i moving, j moving] (for `OnsetStats`). */
  frame(f: number, ids: number[], xs: number[], ys: number[], ins: boolean[], label: string | number): [number, number, boolean, boolean][] {
    const now: [number, number, boolean, boolean][] = [];
    const lab = typeof label === 'string' ? label : (() => { const h = (((label / 3600) % 24) + 24) % 24; return h >= 6 && h < 18 ? 'light' : 'dark'; })();
    const C = (this.out[lab] ??= this.radii.map(() => ({ antFrames: 0, nearFrames: 0, contacts: 0, contactsMoving: 0 })));
    const k: number[] = [];
    const px: number[] = [];
    const py: number[] = [];
    const mv: boolean[] = [];
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      if (!this.track[i] || !ins[q] || this.lastF[i] === f) continue;
      const g = f - this.lastF[i];
      mv.push(g <= 3 && Math.hypot(xs[q] - this.lastX[i], ys[q] - this.lastY[i]) / g >= 0.6);
      this.lastF[i] = f;
      this.lastX[i] = xs[q];
      this.lastY[i] = ys[q];
      k.push(i);
      px.push(xs[q]);
      py.push(ys[q]);
    }
    const near = this.radii.map(() => new Uint8Array(k.length));
    const rMax = Math.max(...this.radii.map((r) => r[1]));
    for (let a = 0; a < k.length; a++) {
      for (let b = a + 1; b < k.length; b++) {
        const [i, j] = k[a] < k[b] ? [k[a], k[b]] : [k[b], k[a]];
        const p = i * this.n + j;
        const fresh = f - this.last[p] <= 3;
        this.last[p] = f;
        const dx = px[a] - px[b];
        const dy = py[a] - py[b];
        if (!fresh) for (const s of this.state) s[p] = 0;
        if (Math.abs(dx) > rMax || Math.abs(dy) > rMax) {
          for (const s of this.state) s[p] = 1;
          continue;
        }
        const d = Math.hypot(dx, dy);
        this.radii.forEach(([r, rOut], m) => {
          const s = this.state[m];
          if (d < r) {
            near[m][a] = near[m][b] = 1;
            if (s[p] === 1) {
              C[m].contacts++;
              if (mv[a] || mv[b]) C[m].contactsMoving++;
              if (m === 0) now.push([k[a], k[b], mv[a], mv[b]]);
            }
            s[p] = 2;
          } else if (d > rOut || s[p] === 0) s[p] = 1;
        });
      }
    }
    this.radii.forEach((_, m) => {
      C[m].antFrames += k.length;
      for (let a = 0; a < k.length; a++) C[m].nearFrames += near[m][a];
    });
    return now;
  }
}
