---
id: B020
title: Nestmate-only crop gate in the Mailleux runner
status: done
size: M
priority: 920
note:
outcome: At the historical pilot, fixing the recruiter reduces the largest shift to 1.49 SE_data; guard precision remains unresolved; nestmate-only leaving is 18.2/11.4/10.2% with identical 0.5 and 1 outputs.
depends: data/fits/colony-m1999-main-shared-pilot.json, scripts/pool.ts, src/sim/parallel/tasks.ts, backlog/B020-nestmate-only-crop-gate-in-the-mailleux/sweep.ts
---
# B020 — Nestmate-only crop gate in the Mailleux runner

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: B001 lead review 2026-10-19 (recruiter shares P.nest.leaveCropFrac)

## Question
With leaveCropFrac relaxed for nestmates only (recruiter at 0.05), does the Table-2a guard still break at 0.5 and 1.0, and does after-trophallaxis leaving still saturate at 13–19 %?

## Why it matters
B001 relaxed the crop threshold for the recruiter as well as its nestmates. Its
Table-2a guard failure therefore cannot isolate the effect of nestmate departures.
This diagnostic separates those effects at the same historical pilot point. D138
item 5 permits this diagnostic; neither B001 nor B020 is adopted in M1.

## Done when
At the B001 pilot point, compare the baseline (0.05 for everyone), a shared
threshold of 0.5/1, and nestmate-only thresholds of 0.5/1 with the recruiter fixed
at 0.05. Use the existing shared-warm-up runner, paired seeds and all three
starvation days. Report all 15 Table-2a mean shifts in SE_data, with the original
1-SE_data guard, and Table-2b leaving proportions. Report finite-simulation
uncertainty by resampling whole nests. First verify that the role override at
0.05 is bit-identical to the ordinary runner and that only the recruiter gets it.

## Base
Claimed by codex-side-c7b49e12 at `6464a31273428f4d5339899c8cfcc2e867104a46`.
`src/`, `scripts/`, the pilot fit and B001 were clean; unrelated research records
were already dirty and remain owned by the main line. Use B001's historical
pilot parameters, density, dt (0.025 s), warm-up (900 s), 4 recruiters/nest and
seed `seedFor(1999, 'diag', 1001)`. This isolates the old confound; it is not a
test of the later C2/step-5 candidate.

## Data and roles
Mailleux Table 2a: existing fit targets, used only as SE_data units for shifts
against the baseline. Table 2b: existing development targets, reported
descriptively, without significance tests against its questionable sample sizes.
No paper reading, new data or held-out data. No fitting.

## Compute
Local, niced, 4 pool workers; initial 4-recruiter timing/identity check. Fixed
main budget: 80 recruiters/day/arm (20 independent nests), 5 arms, 3 days.
Each invocation is limited to one arm/day and must stay under 10 minutes.
No long-run launcher or rented box. A small sample may leave guard decisions
unresolved; do not increase the budget after reading the result.

## Out of scope
Changing source code, defaults, fits, contact observers or frozen artifacts;
adoption or reopening step 5; E6; adding or tuning a contact-triggered rule;
generalizing to C2 or other parameter points. No proposal to change the adopted
model follows from this diagnostic.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-31 02:19 UTC · codex-side · Pre-run reading: ordinary-runner identity check (4 recruiters/day, all 3 days) and recruiter-only routing assertions must pass before the sweep. Fixed sweep: baseline; shared 0.5/1; nestmate-only 0.5/1, 80 recruiters/day, all 3 days, paired seedFor(1999, diag, 1001), 4/nest, historical pilot. A >1 SE_data shift breaks the original guard; per-row paired whole-nest bootstrap CIs disclose uncertainty, and a CI straddling the boundary is unresolved. Failure to reproduce the shared-gate break prevents attribution of the old confound. Nestmate-only after-troph leaving outside 13–19% revises that historical descriptive range; neither outcome adopts a mechanism or reopens step 5. Each cell runs separately, under 10 minutes, with 4 niced workers; no extra seeds or budget after reading.
- 2026-10-31 02:20 UTC · codex-side · Identity and role-routing checks passed: 4 recruiters per day at 1/4/8 days, all M1999Recruiter fields exactly equal between ordinary baseline and role-marked baseline; only the recruiter receives the override. Standalone TypeScript check of sweep.ts passed. Beginning the fixed 80-recruiter cells; no new arms or increased budget.
- 2026-10-31 02:24 UTC · codex-side · Sweep progress: all five day-1 cells, plus the day-4 baseline and shared-0.5 cell, completed in 26–48 seconds each. Every invocation checks simulation/dependency hashes before saving. The full prespecified set is continuing; no interpretation or budget change.
- 2026-10-31 02:32 UTC · codex-side · Fixed sweep and reading complete (results/reading.md, results/summary.json). Shared gates max |shift| 7.31/11.16 SE_data; nestmate-only both 1.49, with day-4 timeInNest/trophTotal intervals spanning the guard boundary. Nestmate-only after-troph leaving 18.2/11.4/10.2%; all 240 recruiter outputs identical between 0.5 and 1. Role/identity assertions, standalone item tsc, repository tsc, and npm test (292/292, 37 files) pass; 17 stamped JSONs current. No new exposures or production changes. Ready for lead record updates; guard precision remains unresolved and no adoption is proposed.

## Findings
**The recruiter confound matters, but a guard pass is unresolved.** The shared
0.5/1 gates reproduce large sample shifts (maximum absolute shifts 7.31/11.16
SE_data). Fixing the recruiter at 0.05 reduces both maxima to 1.49. Two rows
still exceed the original 1-SE_data guard: `timeInNest.d4` +1.482 (95% paired
whole-nest bootstrap interval −0.269 to +4.102) and `trophTotal.d4` +1.494
(−0.444 to +4.051). The fixed sample does not establish either a guard pass or
a confidently persistent failure. All 15 row estimates and uncertainty are in
[the reading](results/reading.md) and [summary](results/summary.json).

**Low leaving persists in this sample.** With nestmate-only thresholds 0.5 and
1, after-trophallaxis leaving is 18.2 / 11.4 / 10.2% at 1 / 4 / 8 starvation
days, with no increasing sample pattern; after other contacts it is 24.7 /
38.7 / 40.2%. The historical 13–19% range is not universal, but the intervals
overlap it. Both thresholds produce exactly equal recruiter summaries for all
240 paired observations. Saturation is established only for these seeds and
this pilot point, not for C2 or the wider parameter space.

**Evidence and checks.** `sweep.ts`; 1,200 recruiter observations (20 nests per
arm/day, 4 recruiters per nest), fixed before running; 532 s across 15 separate
invocations (26–63 s each). Recruiter-only routing and ordinary-versus-marked
baseline identity pass for all three days. Standalone item TypeScript and the
repository typecheck pass; `npm test` passes all 292 tests in 37 files.
`backlog.mjs check B020` reports all 17 JSON files current. `npm run runs`
returned 1 because historical runs include failures; no running jobs appeared
in that status snapshot.

**For the lead.** This qualifies B001's shared-gate guard interpretation;
neither adopting a rule nor reopening step 5 follows (D138 item 5). Remaining
uncertainty is the nestmate-only guard at greater precision and transfer to
later model settings. Further work needs a separate scope; no extra budget or
arms were run. The lead owns any log/finding/thread update. No main-tree code,
default, fit or frozen artifact changed, and no sealed, held-out or uncleared
material was inspected.
