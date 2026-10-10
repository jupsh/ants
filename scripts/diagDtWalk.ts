// Development diagnostic (STATUS 2026-10-10 night): dt dependence of nest walking. Not a fit; no data compared.
import { RNG } from '../src/sim/core/rng';
import { initWalkState, walkStep } from '../src/sim/models/walk';
import { m1999Points } from './m1999Points';
const P = m1999Points('')[0].P;
const wp = { ...P.walk, speed: P.walk.speed * 0.781 };
const variants: Record<string, any> = { full: wp, noOU: { ...wp, speedSdWithin: 0 }, noPause: { ...wp, pauseRate: 0 }, noDip: { ...wp, turnDip: 0 } };
for (const [name, p] of Object.entries(variants)) {
  const out: Record<number, number[]> = {};
  for (const dt of [0.1, 0.025]) {
    out[dt] = [];
    for (let k = 0; k < 200; k++) {
      const s = initWalkState(p, RNG.stream(5, k));
      const per: any = { dt, incline: 0, contacts: [] };
      const pi = { x: 0, y: 0 };
      let d = 0;
      for (let i = 0; i < Math.round(300 / dt); i++) d += walkStep(p, s, per, 1, pi, () => {});
      out[dt].push(d / 300);
    }
  }
  const r = out[0.1].map((x, i) => Math.log(x / out[0.025][i]));
  const m = r.reduce((s, x) => s + x, 0) / r.length;
  const sd = Math.sqrt(r.reduce((s, x) => s + (x - m) ** 2, 0) / (r.length - 1));
  console.log(`${name}: log ratio 0.1/0.025 ${m.toFixed(4)} ± ${(sd / Math.sqrt(r.length)).toFixed(4)}`);
}
