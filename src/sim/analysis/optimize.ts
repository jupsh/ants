/** Nelder–Mead simplex minimisation (unconstrained; transform parameters for bounds). */
export interface NMResult {
  x: number[];
  f: number;
  evals: number;
}

export function nelderMead(fn: (x: number[]) => number, x0: number[], step: number[] | number = 0.2, maxEvals = 400, tol = 1e-4, log?: (r: NMResult) => void): NMResult {
  const n = x0.length;
  const steps = Array.isArray(step) ? step : x0.map(() => step);
  let simplex: { x: number[]; f: number }[] = [{ x: x0.slice(), f: fn(x0) }];
  let evals = 1;
  for (let i = 0; i < n; i++) {
    const x = x0.slice();
    x[i] += steps[i];
    simplex.push({ x, f: fn(x) });
    evals++;
  }
  const alpha = 1;
  const gamma = 2;
  const rho = 0.5;
  const sigma = 0.5;
  while (evals < maxEvals) {
    simplex.sort((a, b) => a.f - b.f);
    if (log && evals % 20 < n + 2) log({ x: simplex[0].x, f: simplex[0].f, evals });
    if (Math.abs(simplex[n].f - simplex[0].f) < tol * (Math.abs(simplex[0].f) + tol)) break;
    const centroid = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) centroid[j] += simplex[i].x[j] / n;
    const worst = simplex[n];
    const xr = centroid.map((c, j) => c + alpha * (c - worst.x[j]));
    const fr = fn(xr);
    evals++;
    if (fr < simplex[0].f) {
      const xe = centroid.map((c, j) => c + gamma * (xr[j] - c));
      const fe = fn(xe);
      evals++;
      simplex[n] = fe < fr ? { x: xe, f: fe } : { x: xr, f: fr };
    } else if (fr < simplex[n - 1].f) {
      simplex[n] = { x: xr, f: fr };
    } else {
      const outside = fr < worst.f;
      const xc = outside ? centroid.map((c, j) => c + rho * (xr[j] - c)) : centroid.map((c, j) => c + rho * (worst.x[j] - c));
      const fc = fn(xc);
      evals++;
      if (fc < (outside ? fr : worst.f)) simplex[n] = { x: xc, f: fc };
      else {
        const best = simplex[0];
        simplex = simplex.map((v, i) => {
          if (i === 0) return v;
          const x = v.x.map((xi, j) => best.x[j] + sigma * (xi - best.x[j]));
          evals++;
          return { x, f: fn(x) };
        });
      }
    }
  }
  simplex.sort((a, b) => a.f - b.f);
  return { x: simplex[0].x, f: simplex[0].f, evals };
}
