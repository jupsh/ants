/**
 * Realised oracle signal (D108 amendment 1): summary sums of a run's log g trace (`ColonySim.oracleTrace`), reduced in
 * the worker and combined across runs, from which the matching checks are read: E[g], SD and moments of log g, the
 * clipped fraction and the autocorrelation of log g at given lags (each series centred on its own mean, pooled).
 */
export interface OracleStats {
  /** Samples (non-NaN). */
  n: number;
  sumG: number;
  sumL: number;
  sumL2: number;
  sumL3: number;
  /** Samples with g at the coupled arm's clip (0.25 or 4, |log g − log 4| < 1e-12). */
  clipped: number;
  /** Lags in samples, and per lag Σ (x_t − x̄)(x_{t+k} − x̄) over valid pairs; `den` = Σ (x_t − x̄)². */
  lags: number[];
  num: number[];
  den: number;
}

export function oracleStats(series: number[][], lags: number[]): OracleStats {
  const s: OracleStats = { n: 0, sumG: 0, sumL: 0, sumL2: 0, sumL3: 0, clipped: 0, lags, num: lags.map(() => 0), den: 0 };
  const clip = Math.log(4);
  for (const x of series) {
    if (!x) continue;
    const ok = x.filter(Number.isFinite);
    if (!ok.length) continue;
    const m = ok.reduce((a, b) => a + b, 0) / ok.length;
    for (const l of ok) {
      s.n++;
      s.sumG += Math.exp(l);
      s.sumL += l;
      s.sumL2 += l * l;
      s.sumL3 += l * l * l;
      if (Math.abs(Math.abs(l) - clip) < 1e-12) s.clipped++;
      s.den += (l - m) ** 2;
    }
    lags.forEach((k, j) => {
      for (let t = 0; t + k < x.length; t++) if (Number.isFinite(x[t]) && Number.isFinite(x[t + k])) s.num[j] += (x[t] - m) * (x[t + k] - m);
    });
  }
  return s;
}

export function combineOracleStats(all: OracleStats[]): OracleStats {
  const lags = all[0]?.lags ?? [];
  return all.reduce(
    (a, b) => ({ n: a.n + b.n, sumG: a.sumG + b.sumG, sumL: a.sumL + b.sumL, sumL2: a.sumL2 + b.sumL2, sumL3: a.sumL3 + b.sumL3, clipped: a.clipped + b.clipped, lags, num: a.num.map((v, j) => v + b.num[j]), den: a.den + b.den }),
    { n: 0, sumG: 0, sumL: 0, sumL2: 0, sumL3: 0, clipped: 0, lags, num: lags.map(() => 0), den: 0 },
  );
}

/** The matching quantities: E[g], mean / SD / skewness of log g, clipped fraction, autocorrelation per lag. */
export function oracleSummary(s: OracleStats) {
  const mean = s.sumL / s.n;
  const v = s.sumL2 / s.n - mean * mean;
  const sd = Math.sqrt(v);
  const m3 = s.sumL3 / s.n - 3 * mean * (s.sumL2 / s.n) + 2 * mean ** 3;
  return { n: s.n, meanG: s.sumG / s.n, meanLog: mean, sdLog: sd, skewLog: m3 / sd ** 3, clippedFrac: s.clipped / s.n, acf: Object.fromEntries(s.lags.map((k, j) => [k, s.num[j] / s.den])) };
}
