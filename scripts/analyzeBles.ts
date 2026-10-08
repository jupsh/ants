/**
 * Summarise the Bles et al. (2022) trophallaxis scan data per colony.
 * Usage: npx vite-node scripts/analyzeBles.ts
 */
import { colonyStats, parseScans, scansToEvents } from '../src/sim/analysis/trophallaxis';
import { BLES_SCANS } from './lib';
import { meanSd } from '../src/sim/analysis/compare';

const scans = parseScans(BLES_SCANS());
const events = scansToEvents(scans);
const FOOD_MINUTE = 30;
const rows = [1, 2, 3, 4, 5].map((c) => colonyStats(events, c, FOOD_MINUTE, 50));
for (const r of rows) console.log(`colony ${r.colony}: events ${r.events}, T50 ${r.t50} min, participants ${r.participants}, Gini ${r.gini.toFixed(2)}, both roles ${(r.bothRoles * 100).toFixed(0)}%, efficiency ${r.efficiency.toFixed(2)}`);
const m = (k: keyof (typeof rows)[0]) => {
  const { mean, sd } = meanSd(rows.map((r) => r[k] as number));
  return `${mean.toFixed(2)} ± ${sd.toFixed(2)}`;
};
console.log(`mean ± sd: events ${m('events')} (paper: 99.0 ± 17.4), T50 ${m('t50')}, participants ${m('participants')}, Gini ${m('gini')}, both roles ${m('bothRoles')}, efficiency ${m('efficiency')}`);
