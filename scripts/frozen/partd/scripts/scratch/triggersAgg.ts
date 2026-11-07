// Scratch (not committed): Part D Part 2 item 1(b), the aggregator (D212 as amended by its amendment 1, D213; T035).
// Reads <in>/colony*.json (from `triggers.ts`), refuses unless every colony's self-check passed and the expected number
// of colonies is present, and writes one result file: the reading per event type (labels verbatim), every row
// amendment 1 lists under "Reported with every result", the descriptive rows, and a meta block. Prints only the
// self-check and the output path.
// Amendment 2 (D216, P100): `--calibration <file>` (required, from `triggersSyn.ts --null-seeds 1-100 --out <file>`).
// Refused if its md5 of triggersCore.ts or triggersStats.ts differs from the current one, or it has fewer than 100
// seeds. Per primary type, a false-positive rate above 0.05 replaces the rise label by "pre-event rise: uncalibrated
// (null false-positive rate <r>)", the class unchanged. The result's meta records the file's sha256 and both rates.
//   npx vite-node scripts/scratch/triggersAgg.ts --in logs/partd2/triggers --calibration <file> --out logs/partd2/triggers/result.json [--expect 22]
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { arg, numArg, readJson, writeJson } from '../lib';
import type { ColonyResult } from './triggersCore';
import { aggregate, applyCalibration, calibrationRates, DESIGN, DRAWS, md5s, PER_COLONY, SEED, type Calibration } from './triggersStats';

const dir = arg('--in', 'logs/partd2/triggers');
const outPath = arg('--out', `${dir}/result.json`);
const expect = numArg('--expect', 22);
const calPath = arg('--calibration', '');
if (!calPath) throw new Error('--calibration <file> is required (triggersSyn.ts --null-seeds 1-100 --out <file>)');
const calBytes = fs.readFileSync(calPath);
const cal = JSON.parse(calBytes.toString()) as Calibration;
const files = fs.readdirSync(dir).filter((f) => /^colony\d+\.json$/.test(f)).sort();
if (files.length !== expect) throw new Error(`${files.length} colony files in ${dir}, expected ${expect}`);
const cols = files.map((f) => readJson<ColonyResult & { meta: { md5: Record<string, string> } }>(`${dir}/${f}`));
// Self-check first (P92): refuse before computing anything if one failed.
for (const c of cols) console.log(`${c.colony} self-check ${c.selfCheck.equal ? 'PASS' : 'FAIL'}`);
if (cols.some((c) => !c.selfCheck.equal)) throw new Error('self-check failed: nothing computed');
const cur = md5s();
const stale = cols.filter((c) => PER_COLONY.some((p) => c.meta.md5[p] !== cur[p]));
if (stale.length) throw new Error(`colony files made with other per-colony code: ${stale.map((c) => c.colony).join(', ')}`);
const rates = calibrationRates(cal);
const res = applyCalibration(aggregate(cols), rates);
let git = 'unknown';
try { git = execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { /* none */ }
writeJson(outPath, {
  meta: {
    design: DESIGN, md5: cur, command: `npx vite-node scripts/scratch/triggersAgg.ts ${process.argv.slice(2).join(' ')}`, commit: git, date: new Date().toISOString(),
    draws: DRAWS, seed: SEED,
    calibration: { file: calPath, sha256: crypto.createHash('sha256').update(calBytes).digest('hex'), seeds: cal.seeds.length, falsePositiveRate: rates, md5: cal.meta.md5, command: cal.meta.command },
    inputs: Object.fromEntries(files.map((f) => [f, crypto.createHash('sha256').update(fs.readFileSync(`${dir}/${f}`)).digest('hex')])),
  },
  ...res,
});
console.log(`wrote ${outPath}`);
