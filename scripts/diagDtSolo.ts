// Development diagnostic (STATUS 2026-10-10 night): dt dependence of nest walking. Not a fit; no data compared.
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { m1999Points } from './m1999Points';
const base = m1999Points('')[0].P;
for (const nsf of [1, 0.2]) {
  const P = { ...base, nest: { ...base.nest, activeToRest: 0, leaveRate: 0, nestSpeedFactor: nsf } };
  const res: Record<number, number[]> = {};
  for (const dt of [0.1, 0.05, 0.025]) {
    res[dt] = [];
    for (let k = 0; k < 40; k++) {
      const sim = new ColonySim(P, { seed: 1000 + k, ants: 1, dt, minutes: 10, foodMinute: Infinity, starvationDays: 1 });
      let d = 0, t = 0, px = NaN, py = NaN;
      sim.step(() => false);
      while (sim.stepIndex < sim.steps)
        sim.step((w: any, info: any) => {
          const a = w.ants[0];
          if (a.mind.mode !== 'active' || info.outside[0]) { px = NaN; return false; }
          if (!Number.isNaN(px)) { d += process.env.CHORD ? Math.hypot(a.body.x - px, a.body.y - py) : a.body.stepLen; t += dt; }
          px = a.body.x; py = a.body.y;
          return false;
        });
      res[dt].push(d / t);
    }
  }
  const lr = (a: number[], b: number[]) => { const r = a.map((x, i) => Math.log(x / b[i])); const m = r.reduce((s, x) => s + x, 0) / r.length; const sd = Math.sqrt(r.reduce((s, x) => s + (x - m) ** 2, 0) / (r.length - 1)); return `${m.toFixed(4)} ± ${(sd / Math.sqrt(r.length)).toFixed(4)}`; };
  const mean = (a: number[]) => (a.reduce((s, x) => s + x, 0) / a.length).toFixed(2);
  console.log(`nestSpeedFactor ${nsf}: speed ${mean(res[0.1])} / ${mean(res[0.05])} / ${mean(res[0.025])} mm/s; log ratio 0.1/0.025 ${lr(res[0.1], res[0.025])}, 0.05/0.025 ${lr(res[0.05], res[0.025])}`);
}
