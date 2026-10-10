// Development diagnostic (STATUS 2026-10-10 night): dt dependence of nest walking. Not a fit; no data compared.
import { RNG } from '../src/sim/core/rng';
import { blesApparatus } from '../src/sim/world/apparatus';
import { ColonySim } from '../src/sim/experiments/colonyBles';
import { recruiterLoad } from '../src/sim/experiments/colonyMailleux1999';
import { m1999Points } from './m1999Points';

const pts = m1999Points('');
const day = Number(process.env.DAY ?? 1) as 1 | 4 | 8;
for (const pt of pts.slice(0, Number(process.env.NPT ?? 2))) {
  const { app } = blesApparatus();
  const nest = app.regions.find((r) => r.kind === 'nest')!;
  const n = Math.max(1, Math.round((pt.density * (nest.x1 - nest.x0) * (nest.y1 - nest.y0)) / 100));
  for (const dt of [0.1, 0.025]) {
    const agg: Record<string, number> = {};
    let rs1 = 0, rs025 = 0, path = 0, T = 0;
    for (let k = 0; k < Number(process.env.K ?? 12); k++) {
      let ad = 0, at = 0;
      const seed = RNG.stream(77, day, k).int(2 ** 31);
      const o = { seed, starvationDays: day, density: pt.density, pipetteAccessible: pt.accessible, dt, warmup: 300 };
      const load = recruiterLoad(pt.P, o);
      const enterAt = 300;
      const sim = new ColonySim(pt.P, { seed, ants: n, dt, minutes: (enterAt + 1200) / 60 + 0.01, foodMinute: Infinity, starvationDays: day, recruiter: { enterAt, ...load } });
      let px = NaN, py = NaN, sx = NaN, sy = NaN, s2x = NaN, s2y = NaN;
      const onStep = (w: any, info: any) => {
        const a = w.ants[n]; const t = info.t - enterAt;
        if (!a || t < 0) return false;
        if (info.outside[n] || t >= 1200) return true;
        T += dt;
        const key = (info.forager?.[n] ? 'F:' : '') + a.mind.mode;
        if (!Number.isNaN(px)) { const d = Math.hypot(a.body.x - px, a.body.y - py); path += d; agg[key] = (agg[key] ?? 0) + d; agg['t:' + key] = (agg['t:' + key] ?? 0) + dt; if (key === 'active') { ad += d; at += dt; if (d < 1e-9) agg['zeroActive'] = (agg['zeroActive'] ?? 0) + dt; agg['t:zeroActive'] = 0; } }
        px = a.body.x; py = a.body.y;
        const i = Math.round(t / dt);
        if (i % Math.round(1 / dt) === 0) { if (!Number.isNaN(sx)) rs1 += Math.hypot(a.body.x - sx, a.body.y - sy); sx = a.body.x; sy = a.body.y; }
        if (i % Math.round(0.25 / dt) === 0) { if (!Number.isNaN(s2x)) rs025 += Math.hypot(a.body.x - s2x, a.body.y - s2y); s2x = a.body.x; s2y = a.body.y; }
        return false;
      };
      while (sim.stepIndex < sim.steps) if (sim.step(onStep)) break;
      (globalThis as any).sp ??= {}; ((globalThis as any).sp[pt.label + dt] ??= []).push(at > 5 ? ad / at : NaN);
    }
    const modes = Object.keys(agg).filter((k) => !k.startsWith('t:')).map((k) => `${k} ${(agg[k] / 10).toFixed(0)}cm/${agg['t:' + k].toFixed(0)}s`).join(', ');
    console.log(`${pt.label} d${day} dt ${dt}: T ${T.toFixed(0)} s, path ${(path / 10).toFixed(0)} cm, 0.25s-sampled ${(rs025 / 10).toFixed(0)}, 1s-sampled ${(rs1 / 10).toFixed(0)} | ${modes}`);
  }
}

const sp = (globalThis as any).sp;
for (const pt of pts.slice(0, Number(process.env.NPT ?? 2))) {
  const a = sp[pt.label + 0.1], b = sp[pt.label + 0.025];
  const r = a.map((x: number, i: number) => Math.log(x / b[i])).filter((x: number) => Number.isFinite(x));
  const m = r.reduce((s: number, x: number) => s + x, 0) / r.length;
  const sd = Math.sqrt(r.reduce((s: number, x: number) => s + (x - m) ** 2, 0) / (r.length - 1));
  console.log(`${pt.label}: paired log(speed 0.1 / 0.025) in active mode: ${m.toFixed(3)} ± ${(sd / Math.sqrt(r.length)).toFixed(3)} (n ${r.length})`);
}
