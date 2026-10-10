/**
 * Summarise the Khuong et al. 2013 L. niger trajectories per incline.
 * Usage: npx vite-node scripts/analyzeKhuong.ts [incline index 1..5]
 */
import fs from 'node:fs';
import zlib from 'node:zlib';
import { parseKhuongCsv } from '../../src/sim/analysis/khuongData';
import { excessKurtosis, KHUONG_PREP, prepareTrack, summarize, walkStats, type Track } from '../../src/sim/analysis/trajectory';

const which = process.argv[2] ? [Number(process.argv[2])] : [1, 2, 3, 4, 5];
const f = (v: number, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : 'nan');
for (const k of which) {
  const text = zlib.gunzipSync(fs.readFileSync(`data/khuong2013/incline${k}.csv.gz`)).toString('utf8');
  const raw = parseKhuongCsv(text);
  const tracks = raw.map((t) => prepareTrack(t, KHUONG_PREP)).filter((t): t is Track => t !== null);
  const s = walkStats(tracks);
  const sp = summarize(s.speeds);
  const ex = summarize(s.exitTimes);
  const st = summarize(s.straightness);
  const ti = summarize(s.turnIncrements);
  console.log(`\n=== incline ${k} (${(raw[0].incline * 180 / Math.PI).toFixed(0)}°): ${tracks.length}/${raw.length} tracks`);
  console.log(`speed (moving) mm/s: mean ${f(sp.mean)} sd ${f(sp.sd)} q10 ${f(sp.q10)} q50 ${f(sp.q50)} q90 ${f(sp.q90)}; stopped ${f(s.stoppedFraction * 100, 1)}%`);
  console.log(`exit time s: mean ${f(ex.mean)} q10 ${f(ex.q10)} q50 ${f(ex.q50)} q90 ${f(ex.q90)} (n=${ex.n})`);
  console.log(`straightness(50mm): mean ${f(st.mean, 3)} q50 ${f(st.q50, 3)}`);
  console.log(`turn increments over 0.2 s: sd ${f(ti.sd, 3)} rad, excess kurtosis ${f(excessKurtosis(s.turnIncrements), 2)}`);
  console.log('heading corr (time):', s.lags.map((l, i) => `${l}s:${f(s.headingCorr[i], 3)}`).join(' '));
  console.log('heading corr (path):', s.pathLags.map((l, i) => `${l}mm:${f(s.headingCorrPath[i], 3)}`).join(' '));
  console.log('MSD mm²:', s.msdLags.map((l, i) => `${l}s:${f(s.msd[i], 0)}`).join(' '));
  console.log('radial v mm/s:', s.radialBins.map((r, i) => `<${r}:${f(s.radialVelocity[i], 2)}`).join(' '));
}
