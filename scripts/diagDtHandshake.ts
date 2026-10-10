// Development diagnostic (STATUS 2026-10-10 night): does the bout handshake (signals sensed a step late) make the
// recruiter's stay depend on dt? Per recruiter: time in each mode (give split into flowing / waiting), bout
// starts and those without any flow, contact episodes ≥ 1 s. Not a fit; no data compared.
import { RNG } from '../src/sim/core/rng';
import { blesApparatus } from '../src/sim/world/apparatus';
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { recruiterLoad } from '../src/sim/experiments/colonyMailleux1999';
import { m1999Points } from './m1999Points';

const K = Number(process.env.K ?? 60);
const day = Number(process.env.DAY ?? 4) as 1 | 4 | 8;
const which = (process.env.PTS ?? '0,1').split(',').map(Number);
const keys = ['stay', 'active', 'giveFlow', 'giveWait', 'receive', 'rest', 'leave', 'starts', 'dryStarts', 'contacts1s'] as const;
for (const pi of which) {
  const pt = m1999Points('')[pi];
  const { app } = blesApparatus();
  const nest = app.regions.find((r) => r.kind === 'nest')!;
  const n = Math.max(1, Math.round((pt.density * (nest.x1 - nest.x0) * (nest.y1 - nest.y0)) / 100));
  const per: Record<number, Record<string, number>[]> = {};
  for (const dt of [0.1, 0.025]) {
    per[dt] = [];
    for (let k = 0; k < K; k++) {
      const seed = RNG.stream(4242, day, k).int(2 ** 31);
      const o = { seed, starvationDays: day, density: pt.density, pipetteAccessible: pt.accessible, dt, warmup: 300 };
      const load = recruiterLoad(pt.P, o);
      const enterAt = 300;
      const sim = new ColonySim(pt.P, { seed, ants: n, dt, minutes: (enterAt + 1200) / 60 + 0.01, foodMinute: Infinity, starvationDays: day, recruiter: { enterAt, ...load } });
      const r: Record<string, number> = Object.fromEntries(keys.map((x) => [x, 0]));
      let prevMode = '';
      let boutFlow = 0;
      const open = new Map<number, number>();
      const closeEp = (start: number, t: number) => { if (t - start >= 1 - 1e-9) r.contacts1s++; };
      const onStep = (w: any, info: any) => {
        const a = w.ants[n];
        const t = info.t - enterAt;
        if (!a || t < 0) return false;
        const done = info.outside[n] || t >= 1200;
        if (done) { for (const s of open.values()) closeEp(s, t); return true; }
        r.stay += dt;
        const mode = a.mind.mode;
        if (mode === 'give') {
          if (prevMode !== 'give') { if (prevMode && boutFlow === 0 && r.starts > 0) r.dryStarts++; r.starts++; boutFlow = 0; }
          if (a.body.mouthFlow < 0) { r.giveFlow += dt; boutFlow++; } else r.giveWait += dt;
        } else {
          if (prevMode === 'give' && boutFlow === 0) r.dryStarts++;
          if (mode in r) r[mode] += dt;
        }
        prevMode = mode;
        const now = new Set<number>((info.per[n]?.contacts ?? []).map((c: any) => c.id));
        for (const id of now) if (!open.has(id)) open.set(id, t);
        for (const [id, s] of [...open]) if (!now.has(id)) { closeEp(s, t); open.delete(id); }
        return false;
      };
      while (sim.stepIndex < sim.steps) if (sim.step(onStep)) break;
      per[dt].push(r);
    }
  }
  console.log(`${pt.label}, ${day} d, ${K} paired recruiters: mean at dt 0.1 / 0.025, paired difference ± SE`);
  for (const key of keys) {
    const a = per[0.1].map((x) => x[key]);
    const b = per[0.025].map((x) => x[key]);
    const d = a.map((x, i) => x - b[i]);
    const m = (v: number[]) => v.reduce((s, x) => s + x, 0) / v.length;
    const sd = Math.sqrt(d.reduce((s, x) => s + (x - m(d)) ** 2, 0) / (d.length - 1));
    console.log(`  ${key.padEnd(10)} ${m(a).toFixed(2).padStart(8)} / ${m(b).toFixed(2).padStart(8)}   Δ ${m(d).toFixed(2).padStart(7)} ± ${(sd / Math.sqrt(d.length)).toFixed(2)}`);
  }
}
