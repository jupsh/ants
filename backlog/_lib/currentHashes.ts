// Current hashes for `backlog.mjs check`: prints {"simHash": …, "depends": {path: hash}} for the paths given.
import { simHash } from '../../scripts/simHash';
import { hashPaths } from './stamp';

console.log(JSON.stringify({ simHash: simHash(), depends: hashPaths(process.argv.slice(2)) }));
