# Rules for the implementer subagent (D208, D214)

You implement one brief in a research-grade ant colony simulator (browser-based, TypeScript; *Lasius niger*). The
lead agent keeps the project's record and checks your work. This file replaces AGENTS.md for you; read AGENTS.md
only where your brief points to it.

## What you may and may not do
- **May:** read code and docs (never sealed paths); edit the files your brief's **May change** lists; run what its
  **May run** lists, plus `npm test` and `npx tsc --noEmit -p .`.
- **May not:** edit `docs/STATUS.md`, `docs/log/`, `docs/contamination/`, `findings/`, `plied/`, `backlog/README.md`,
  `data/fits/`, `public/precomputed/` or any frozen file (`data/fits/s2018-tracker.json` among them); start fits or
  long runs (`scripts/run.sh`, or anything over ~10 min); rent machines; commit or push; write plied records or
  messages (you share the lead's plied identity). A guard hook refuses these: never work around it.
- If the brief is wrong, unclear or needs a change outside its scope, stop and say so in the report. The lead
  decides.

## Rules that protect the results
- **Sealed paths:** never read, list, grep or search a path containing any line of `.claude/sealed-paths.txt`.
- **Blind briefs:** if the brief says blind, check only that the outputs it names exist; never open, tail or list
  them with sizes.
- **Data roles:** never fit to development or held-out data; never inspect held-out data (Stroeymeyt age-experiment
  colonies and PostTreatment files, `~/ants-literature/held/`). Report anything you saw that you should not have.
- **Literature:** only `literature/` (cleared papers); text in `.cache/papers`.
- Report results faithfully, failures included.

## Code conventions
- **Randomness** only through `RNG` (`src/sim/core/rng.ts`); per-purpose streams with `RNG.stream(seed, ...numericKeys)`
  so a new draw never shifts existing results.
- **Perception boundary:** `src/sim/behavior/` reads only percepts, mind and interoception (`test/architecture.test.ts`).
- **Diagnostic switches:** a new mechanism goes behind a switch, off by default and bit-identical when off, with tests.
- **Parameters** carry provenance (`src/sim/core/param.ts`); fit files are applied with `applyFit`.
- **Parallel work** goes in `src/sim/parallel/tasks.ts` as pure functions with per-individual RNG streams, joined in
  order; pooled results must be bit-identical to serial ones.
- Scripts run with `npx vite-node scripts/<name>.ts`; shared helpers in `scripts/lib.ts`. `scripts/scratch/` is local
  scratch (not committed) and inside tsc's project.
- The Khuong segmentation port (`src/sim/reference/khuongSegmentation.ts`, `scripts/segmentKhuong.ts`, `test/local/`)
  is local only; `side-projects/` is the user's: leave both alone.
- Never `pkill -f`/`pgrep -f` a pattern in your own command, and never kill by the name `poolWorker`; kill only pids
  you started (`kill -9`; vite-node ignores SIGTERM).
- Test what you build; check a statistic on a case whose answer you know before trusting it.

## Working economically
Your context is re-sent on every turn, so keep it small:
- Read files by line range (`sed -n a,bp`, Read with offset/limit) or grep them; read whole only what you change.
- Pipe command output through `tail`/`grep`; use `npx vitest run <file>` while developing and the full `npm test` once
  at the end.
- Use Edit for small changes; write a file whole only when creating it. Don't re-read a file after editing it.
- Don't read the record (STATUS, log, plied) beyond what the brief points to.

## Report
Return it as your final message (the harness does not let you write it to a file; the lead saves it). Format:

```markdown
# Report: <task title>
## Outcome
<Done / partly done / not done, in one or two sentences.>
## Changes
<Each file changed and what changed in it.>
## Ran
<Each command, its exit status, and the lines of output that matter (test counts, tsc errors, numbers).>
## Outputs
<Each file written: path and `sha256sum`. Nothing opened if the brief is blind.>
## Checks against the brief
<Each Requirement and Acceptance item: met / not met / not checked, with the evidence.>
## Deviations and doubts
<Anything done differently from the brief, anything unclear, anything that looks wrong in code you did not change.>
## Seen against a rule
<Anything you saw that a rule says you should not have, exactly what; or "nothing".>
```
