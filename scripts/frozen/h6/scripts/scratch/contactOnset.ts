// Scratch (not committed): Test B recheck — contact-associated activation (STATUS 2026-10-17 ≈ 13:53 UTC, amended ≈ 13:54,
// logged before building). One code path for recorded tracks and simulated observers. Per ant a 64-frame history of step codes: 0 not
// seen in the nest this frame, 1 still step, 2 moving step (≥ 0.6 mm between consecutive frames), 3 seen after a gap
// (no step). "Uninterrupted" = codes 1 or 2 on every frame of a window. Onset at g: code 2 at g after ≥ 20 consecutive
// code-1 frames; sustained(M): codes g … g+M−1 all 2. Events are resolved D frames late, when their windows are known.
// Contact: a pair crosses into 4.1 mm (far again only beyond 5.1 mm) while the partner moves (code 2) and the focal is
// still (code 1). Close pass: crossing into 7 mm (hysteresis 8 mm) under the same conditions, the pair never within
// 4.1 mm from f−4 to f+4.
const H = 64;
const D = 15;
const MS = [1, 2, 4];

interface Ev { f: number; i: number; vx: number; vy: number }
export interface TbOut {
  /** Per M (1, 2, 4), per stratum: [n exposed, onsets exposed, n unexposed, onsets unexposed]. */
  risk: number[][][];
  /** Sustained (M = 2) onsets of eligible ants, and those preceded by a contact within 4 frames. */
  onsets: number;
  onsetsAfterContact: number;
  /** Time courses (M = 2), offsets −10 … +10: [at risk, first sustained onsets] for contact, close pass, matched null. */
  tc: { contact: number[][]; pass: number[][]; nul: number[][] };
  /** Direction of the first sustained step vs the partner's motion: [n, Σ cos, n cos > 0.5] for contact and close pass. */
  dir: { contact: number[]; pass: number[] };
  /** Contact vs close pass, per M, per pre-outcome stratum (81): [n contact, onsets, n pass, onsets] (STATUS ≈ 13:54 UTC). */
  cvp: number[][][];
}

export class ContactOnset {
  private readonly n: number;
  private readonly code: Uint8Array[];
  private readonly px: Float64Array[];
  private readonly py: Float64Array[];
  private readonly lastF: Int32Array;
  private readonly st4: Uint8Array;
  private readonly st7: Uint8Array;
  private readonly lastJoint: Int32Array;
  private readonly lastNear4: Int32Array;
  private prevF = NaN;
  private readonly contacts: Ev[][] = []; // by frame % H: contact events (focal i)
  private readonly passes: Ev[] = [];
  private readonly onsetLog: { f: number; x: number; y: number }[] = [];
  private readonly rng = { s: 0x9e3779b9 };
  readonly out: Record<string, TbOut> = {};
  private readonly labelAt: string[] = new Array(H).fill('');
  constructor(readonly track: boolean[]) {
    const n = (this.n = track.length);
    this.code = Array.from({ length: n }, () => new Uint8Array(H));
    this.px = Array.from({ length: n }, () => new Float64Array(H));
    this.py = Array.from({ length: n }, () => new Float64Array(H));
    this.lastF = new Int32Array(n).fill(-1e9);
    this.st4 = new Uint8Array(n * n);
    this.st7 = new Uint8Array(n * n);
    this.lastJoint = new Int32Array(n * n).fill(-1e9);
    this.lastNear4 = new Int32Array(n * n).fill(-1e9);
    for (let k = 0; k < H; k++) this.contacts.push([]);
  }
  private rand(): number {
    this.rng.s = (Math.imul(this.rng.s ^ (this.rng.s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0;
    return this.rng.s / 4294967296;
  }
  private O(lab: string): TbOut {
    const t = () => Array.from({ length: 21 }, () => [0, 0]);
    return (this.out[lab] ??= { risk: MS.map(() => Array.from({ length: 12 }, () => [0, 0, 0, 0])), onsets: 0, onsetsAfterContact: 0, tc: { contact: t(), pass: t(), nul: t() }, dir: { contact: [0, 0, 0], pass: [0, 0, 0] }, cvp: MS.map(() => Array.from({ length: 81 }, () => [0, 0, 0, 0])) });
  }
  private c(i: number, g: number): number { return this.code[i][((g % H) + H) % H]; }
  private unint(i: number, a: number, b: number): boolean { for (let g = a; g <= b; g++) { const k = this.c(i, g); if (k !== 1 && k !== 2) return false; } return true; }
  private stillRun(i: number, a: number, b: number): boolean { for (let g = a; g <= b; g++) if (this.c(i, g) !== 1) return false; return true; }
  private sustained(i: number, g: number, M: number): boolean { for (let k = g; k < g + M; k++) if (this.c(i, k) !== 2) return false; return true; }
  /** First moving step in [a, b] given still before a: [offset frame or −1, sustained (M = 2)]. */
  private firstMove(i: number, a: number, b: number): [number, boolean] {
    for (let g = a; g <= b; g++) if (this.c(i, g) === 2) return [g, this.sustained(i, g, 2)];
    return [-1, false];
  }
  /** `label`: 'light' / 'dark'; with the frame's UTC time t instead, light is 06–18 UTC. */
  frame(f: number, ids: number[], xs: number[], ys: number[], ins: boolean[], label: string | number): void {
    const lab = typeof label === 'string' ? label : (() => { const h = (((label / 3600) % 24) + 24) % 24; return h >= 6 && h < 18 ? 'light' : 'dark'; })();
    // Frames skipped by the stream: nobody seen.
    if (!Number.isNaN(this.prevF)) for (let g = this.prevF + 1; g < f && g <= this.prevF + H; g++) this.clearFrame(g);
    this.clearFrame(f);
    this.labelAt[f % H] = lab;
    const seen: number[] = [];
    for (let q = 0; q < ids.length; q++) {
      const i = ids[q];
      if (!this.track[i] || !ins[q] || this.lastF[i] === f) continue;
      const k = f % H;
      const g = f - this.lastF[i];
      const pk = (f - 1 + H) % H;
      this.code[i][k] = g === 1 ? (Math.hypot(xs[q] - this.px[i][pk], ys[q] - this.py[i][pk]) >= 0.6 ? 2 : 1) : 3;
      this.px[i][k] = xs[q];
      this.py[i][k] = ys[q];
      this.lastF[i] = f;
      seen.push(i);
    }
    // Onsets at f (M = 1 definition, for the strata).
    for (const i of seen) if (this.c(i, f) === 2 && this.stillRun(i, f - 20, f - 1)) this.onsetLog.push({ f, x: this.px[i][(f - 1) % H], y: this.py[i][(f - 1) % H] });
    while (this.onsetLog.length && this.onsetLog[0].f < f - 40) this.onsetLog.shift();
    // Pairs: contact and close-pass crossings.
    const cs = this.contacts[f % H];
    cs.length = 0;
    for (let a = 0; a < seen.length; a++) {
      for (let b = a + 1; b < seen.length; b++) {
        const [i, j] = seen[a] < seen[b] ? [seen[a], seen[b]] : [seen[b], seen[a]];
        const p = i * this.n + j;
        const k = f % H;
        const dx = this.px[i][k] - this.px[j][k];
        const dy = this.py[i][k] - this.py[j][k];
        const fresh = f - this.lastJoint[p] <= 3;
        this.lastJoint[p] = f;
        if (!fresh) { this.st4[p] = 0; this.st7[p] = 0; }
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) { this.st4[p] = 1; this.st7[p] = 1; continue; }
        const d = Math.hypot(dx, dy);
        const ci = this.c(i, f);
        const cj = this.c(j, f);
        const ev = (focal: number, partner: number): Ev => ({ f, i: focal, vx: this.px[partner][k] - this.px[partner][(f - 1) % H], vy: this.py[partner][k] - this.py[partner][(f - 1) % H] });
        // 4.1 mm
        if (d < 4.1) {
          this.lastNear4[p] = f;
          if (this.st4[p] === 1) {
            if (ci === 1 && cj === 2) cs.push(ev(i, j));
            if (cj === 1 && ci === 2) cs.push(ev(j, i));
          }
          this.st4[p] = 2;
        } else if (d > 5.1 || this.st4[p] === 0) this.st4[p] = 1;
        // 7 mm (close passes)
        if (d < 7) {
          if (this.st7[p] === 1) {
            if (ci === 1 && cj === 2) this.passes.push({ ...ev(i, j), pair: p } as Ev & { pair: number });
            if (cj === 1 && ci === 2) this.passes.push({ ...ev(j, i), pair: p } as Ev & { pair: number });
          }
          this.st7[p] = 2;
        } else if (d > 8 || this.st7[p] === 0) this.st7[p] = 1;
      }
    }
    // Close passes become valid or invalid at f = event + 4: no 4.1-mm nearness from event − 4 to event + 4.
    for (const ev of this.passes as (Ev & { pair: number; valid?: boolean })[]) if (ev.f === f - 4) ev.valid = this.lastNear4[ev.pair] < ev.f - 4;
    this.prevF = f;
    this.resolve(f - D);
  }
  private clearFrame(g: number): void {
    const k = g % H;
    for (let i = 0; i < this.n; i++) this.code[i][k] = 0;
  }
  private resolve(e: number): void {
    const lab = this.labelAt[((e % H) + H) % H];
    if (!lab || e < 40) return;
    const O = this.O(lab);
    const contacted = new Map<number, Ev>();
    for (const ev of this.contacts[((e % H) + H) % H]) if (ev.f === e) contacted.set(ev.i, ev);
    const recentContact = (i: number, g: number) => { for (let h = g - 4; h <= g - 1; h++) for (const ev of this.contacts[((h % H) + H) % H]) if (ev.f === h && ev.i === i) return true; return false; };
    // Strata at e: nearest onset in the last 4 frames and colony onsets in the last 10.
    const near4 = this.onsetLog.filter((o) => o.f > e - 4 && o.f <= e);
    const n10 = this.onsetLog.filter((o) => o.f > e - 10 && o.f <= e).length;
    const inten = n10 === 0 ? 0 : n10 <= 2 ? 1 : 2;
    const eligibleNull: number[] = [];
    for (let i = 0; i < this.n; i++) {
      if (!this.track[i]) continue;
      // (1) units: still e−19 … e, uninterrupted through e+8.
      if (this.stillRun(i, e - 19, e) && this.unint(i, e + 1, e + 8)) {
        let d = Infinity;
        const k = ((e % H) + H) % H;
        for (const o of near4) d = Math.min(d, Math.hypot(o.x - this.px[i][k], o.y - this.py[i][k]));
        const s = (d < 5 ? 0 : d < 10 ? 1 : d < 20 ? 2 : 3) * 3 + inten;
        const [g] = this.firstMove(i, e + 1, e + 4);
        const ex = contacted.has(i);
        MS.forEach((M, m) => {
          const y = g >= 0 && this.sustained(i, g, M) ? 1 : 0;
          const r = O.risk[m][s];
          if (ex) { r[0]++; r[1] += y; } else { r[2]++; r[3] += y; }
        });
      }
      // (4) sustained onsets at e (M = 2) of ants still for 20 frames before and uninterrupted through e+1.
      if (this.c(i, e) === 2 && this.stillRun(i, e - 20, e - 1) && this.sustained(i, e, 2)) {
        O.onsets++;
        if (recentContact(i, e)) O.onsetsAfterContact++;
      }
      // Null-event candidates: still e−30 … e−11 and uninterrupted to e+12, not contacted at e.
      if (!contacted.has(i) && this.c(i, e) === 1 && this.stillRun(i, e - 30, e - 11) && this.unint(i, e - 10, e + 12)) eligibleNull.push(i);
    }
    // (2) time courses.
    const course = (tc: number[][], i: number, dir?: number[], v?: [number, number]) => {
      const [g, sus] = this.firstMove(i, e - 10, e + 10);
      const end = g < 0 ? e + 10 : g;
      for (let h = e - 10; h <= end; h++) tc[h - e + 10][0]++;
      if (g >= 0 && sus) {
        tc[g - e + 10][1]++;
        if (dir && v && g > e && g <= e + 4) {
          const ax = this.px[i][g % H] - this.px[i][(g - 1) % H];
          const ay = this.py[i][g % H] - this.py[i][(g - 1) % H];
          const nv = Math.hypot(...v) * Math.hypot(ax, ay);
          if (nv > 0) { const cos = (ax * v[0] + ay * v[1]) / nv; dir[0]++; dir[1] += cos; if (cos > 0.5) dir[2]++; }
        }
      }
    };
    const okCourse = (i: number) => this.stillRun(i, e - 30, e - 11) && this.unint(i, e - 10, e + 12);
    // Contact vs close pass on pre-outcome strata: still time before e, local density at e, partner speed, colony onsets.
    const ke = ((e % H) + H) % H;
    const cvp = (ev: Ev, col: 0 | 2) => {
      const i = ev.i;
      if (!this.stillRun(i, e - 19, e) || !this.unint(i, e + 1, e + 8)) return;
      let still = 20;
      while (still < 120 && this.c(i, e - still) === 1) still++;
      let dens = 0;
      for (let j = 0; j < this.n; j++) {
        if (j === i || !this.track[j]) continue;
        const cj = this.c(j, e);
        if ((cj === 1 || cj === 2) && Math.hypot(this.px[j][ke] - this.px[i][ke], this.py[j][ke] - this.py[i][ke]) < 10) dens++;
      }
      const sp = Math.hypot(ev.vx, ev.vy);
      const s = (still < 40 ? 0 : still < 120 ? 1 : 2) * 27 + (dens <= 2 ? 0 : dens <= 5 ? 1 : 2) * 9 + (sp < 1 ? 0 : sp < 1.5 ? 1 : 2) * 3 + inten;
      const [g] = this.firstMove(i, e + 1, e + 4);
      MS.forEach((M, m) => {
        const y = g >= 0 && this.sustained(i, g, M) ? 1 : 0;
        O.cvp[m][s][col]++;
        O.cvp[m][s][col + 1] += y;
      });
    };
    for (const ev of contacted.values()) cvp(ev, 0);
    for (const ev of contacted.values()) {
      if (!okCourse(ev.i)) continue;
      course(O.tc.contact, ev.i, O.dir.contact, [ev.vx, ev.vy]);
      if (eligibleNull.length) course(O.tc.nul, eligibleNull[Math.floor(this.rand() * eligibleNull.length)]);
    }
    // (3) close passes at e (valid once f ≥ e+4: no 4.1-mm nearness from e−4 to e+4).
    let k = 0;
    for (const ev of this.passes as (Ev & { pair: number; valid?: boolean })[]) {
      if (ev.f > e) { this.passes[k++] = ev; continue; }
      if (ev.f < e) continue;
      if (!ev.valid) continue;
      cvp(ev, 2);
      if (okCourse(ev.i)) course(O.tc.pass, ev.i, O.dir.pass, [ev.vx, ev.vy]);
    }
    this.passes.length = k;
  }
}
