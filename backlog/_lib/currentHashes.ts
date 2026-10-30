// Current hashes for `backlog.mjs check`: prints {"simHash": …, "depends": {path: hash}} for the paths given, and with
// `--out f` also writes it to f (runHashes.mjs reads that file, not stdout).
import fs from 'node:fs';
import { simHash } from '../../scripts/simHash';
import { hashPaths } from './stamp';

const args = process.argv.slice(2);
const at = args.indexOf('--out');
const out = at >= 0 ? args.splice(at, 2)[1] : undefined;
const json = JSON.stringify({ simHash: simHash(), depends: hashPaths(args) });
if (out) fs.writeFileSync(out, json);
console.log(json);
