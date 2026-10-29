// B004, data side: one fit colony's PreTreatment tracks → out/data-c<i>.json (nurse and forager apart).
//   nice -n 10 npx vite-node backlog/B004-slow-displacement-in-still-periods/stillData.ts --colony i
import fs from 'node:fs';
import { numArg, writeJson } from '../../scripts/lib';
import { colonyFromData, loadS2018 } from '../../scripts/s2018Lib';
import { colonies, roles } from '../../scripts/stroeymeytTracks';
import { streamWithAngle } from './stream';
import { StillForm } from './stillForm';

const ci = numArg('--colony', 0);
const col = colonies()[ci];
const fit = loadS2018().colonies.find((c) => c.colony === col.label);
if (!fit) throw new Error(`${col.label}: not a fit colony`);
const noiseSd = colonyFromData(fit).noiseSd;
const roleOf = roles(col);
const tags = [...roleOf.keys()];
const index = new Map(tags.map((t, i) => [t, i]));
const R = tags.map((t) => roleOf.get(t));
const nurse = new StillForm(R.map((r) => r === 'nurse'), noiseSd, 1 + ci);
const forager = new StillForm(R.map((r) => r === 'forager'), noiseSd, 1 + ci);
const s = await streamWithAngle(col, index, (frame, _t, ids, xs, ys, ins, angs) => {
  nurse.frame(frame, ids, xs, ys, ins, angs);
  forager.frame(frame, ids, xs, ys, ins, angs);
});
nurse.finish();
forager.finish();
fs.mkdirSync('backlog/B004-slow-displacement-in-still-periods/out', { recursive: true });
writeJson(`backlog/B004-slow-displacement-in-still-periods/out/data-c${ci}.json`, { colony: col.label, hours: (s.last - s.first) / 3600, late: s.late, ants: { nurse: R.filter((r) => r === 'nurse').length, forager: R.filter((r) => r === 'forager').length }, nurse: nurse.out(), forager: forager.out() });
console.log(`${col.label} done: nurse runs ${nurse.nRuns}, forager runs ${forager.nRuns}`);
