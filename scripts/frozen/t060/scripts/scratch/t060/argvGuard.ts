// Scratch (not committed): T060 brief 2. The frozen H6 extractor (scripts/frozen/h6/scripts/scratch/h6-next/extract.ts,
// last line) runs its own `main` when process.argv holds '--colony', which would rewrite H6's intermediates. T060's
// extract.ts takes `--colony` too, so it imports this module first (static imports are evaluated before the importing
// module's body) and loads the frozen module only afterwards, by a dynamic import in its body: '--colony' is renamed
// '--t060-colony' here, and the original arguments are kept in ARGV.
export const ARGV: readonly string[] = process.argv.slice();
for (let k = 0; k < process.argv.length; k++) if (process.argv[k] === '--colony') process.argv[k] = '--t060-colony';
