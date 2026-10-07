import { excessKurtosis, KHUONG_PREP, ksStatistic, prepareTrack, summarize, walkStats, type Track, type WalkStats } from '../analysis/trajectory';

/**
 * Comparison of simulated and recorded exploratory walks (E1). Returns a
 * scalar discrepancy (for fitting) and a per-statistic breakdown (for
 * reporting and validation tests). Each term is scaled by a tolerance that
 * reflects sampling noise with ~69 tracks, so a term of ~1 means "off by
 * about the data's own uncertainty".
 */
export interface E1Breakdown {
  speedKS: number;
  trackSpeedKS: number;
  stopped: number;
  headingCorrPath: number;
  turnSd: number;
  turnKurtosis: number;
  exitKS: number;
  radial: number;
  align: number;
  straightness: number;
}

export function statsFor(tracks: Track[]): WalkStats {
  return walkStats(tracks.map((t) => prepareTrack(t, KHUONG_PREP)).filter((t): t is Track => t !== null));
}

export function compareE1(sim: WalkStats, data: WalkStats): { loss: number; parts: E1Breakdown } {
  const sq = (a: number, b: number, tol: number) => ((a - b) / tol) ** 2;
  const corrIdx = [1, 2, 3, 4, 5]; // 5,10,20,30,50 mm
  let hc = 0;
  for (const i of corrIdx) hc += sq(sim.headingCorrPath[i], data.headingCorrPath[i], 0.03);
  hc /= corrIdx.length;
  let rad = 0;
  let rn = 0;
  for (let i = 0; i < 8; i++)
    if (Number.isFinite(data.radialVelocity[i]) && Number.isFinite(sim.radialVelocity[i])) {
      rad += sq(sim.radialVelocity[i], data.radialVelocity[i], 1.5);
      rn++;
    }
  rad /= Math.max(1, rn);
  const ts = summarize(sim.turnIncrements);
  const td = summarize(data.turnIncrements);
  const parts: E1Breakdown = {
    speedKS: (ksStatistic(sim.speeds, data.speeds) / 0.05) ** 2,
    trackSpeedKS: (ksStatistic(sim.trackSpeeds, data.trackSpeeds) / 0.15) ** 2,
    stopped: sq(sim.stoppedFraction, data.stoppedFraction, 0.01),
    headingCorrPath: hc,
    turnSd: sq(ts.sd, td.sd, 0.04),
    turnKurtosis: sq(excessKurtosis(sim.turnIncrements), excessKurtosis(data.turnIncrements), 0.6),
    exitKS: (ksStatistic(sim.exitTimes, data.exitTimes) / 0.15) ** 2,
    radial: rad,
    align: sq(sim.alignY, data.alignY, 0.03),
    straightness: sq(summarize(sim.straightness).mean, summarize(data.straightness).mean, 0.02),
  };
  const loss = Object.values(parts).reduce((s, v) => s + (Number.isFinite(v) ? v : 100), 0);
  return { loss, parts };
}
