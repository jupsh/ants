---
id: B008
title: Fit-speed options for the step-5 Mailleux fit
status: done
size: M
priority: 10
note:
outcome: Shared warm-ups (--perNest 4) are the biggest certain saving (measured 1.6-2.2x; warm-up is 53-68% of a recruiter run); multi-fidelity and screening are second-round, snapshots need B013.
depends: scripts/fitM1999.ts, scripts/m1999Points.ts, scripts/pool.ts, src/sim/parallel/tasks.ts, src/sim/experiments/colonyMailleux1999.ts
---
# B008 — Fit-speed options for the step-5 Mailleux fit

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18). Scoped by the lead agent 2026-10-18.

## Question
Which of the speed options not taken for the Stroeymeyt fits would pay off for the step-5 Mailleux 1999
fit, by how much, and what gate would each need? The options are multi-fidelity generations,
colony-subset screening, shared warm-up snapshots, and fixing flat parameters after an identifiability
check (deleted `docs/faster-fit.md`, last at `e1e6847`).

## Why it matters
- The step-5 colonies are about 10× the Stroeymeyt ones. On the stepped code, the fit could take days of box
  time.
- The step-5 fit design (budget, phases, warm-up design) is not fixed yet, so now is the time to choose.
  C2's fit design is fixed and outside this item.
- Some pieces already exist: `fitM1999.ts --perNest` (shared warm-ups across one nest's recruiters), and C2's
  phase 1 is a multi-fidelity phase (dt 0.1). This item says what is left and what it is worth.

## Done when
A recommendation table for the user, one row per option, giving:
- whether it applies to the Mailleux design (independent vs shared warm-ups, recruiters per nest, days 1 / 4 / 8);
- the expected saving (measured where cheap, otherwise estimated);
- the equivalence gate it would need, in the existing form (90 % CI of the paired difference inside
  ±0.5 SE_data);
- how it interacts with B014 (event-driven resting ants) and B013 (save and restore).

Measurements behind it:
1. Where a Mailleux run's time goes: warm-up vs observed stay, by nest size, at the current pilot set-up
   (`scripts/m1999Points.ts`), plus one CPU profile of the largest nest.
2. One generation's makespan on 62 workers, from the measured run times: independent design vs `--perNest 4`, and
   with a nest subset stratified by size.

## Base
Claimed 2026-10-18 by muse-wonder session 01a14d4b at commit `06fef62`.
`scripts/fitM1999.ts`, `scripts/pool.ts`, `src/sim/parallel/tasks.ts`,
`src/sim/experiments/colonyMailleux1999.ts` and `scripts/m1999Points.ts` are
clean (no `git status --porcelain` entries). Other backlog READMEs and
`docs/STATUS.md` were already dirty from the lead agent's scoping; untouched
here except this folder.

## Data and roles
- No empirical data. The Mailleux 1999 set-up is used only as simulation input (nest sizes, protocol), as in
  `fitM1999.ts`. Held-out: none.
- The Mailleux runner still has the pilot nest motion (the step-4 motion is not plumbed in yet), so the
  timings are indicative, and the report says so.

## Compute
Local and niced: a few single-run timings and one `--cpu-prof` profile, under an hour. No fits, no box.

## Out of scope
- Implementing any option in the main tree. Only a cheap, bit-identical change may go in `proposal.patch`.
- The C2 fit and anything in its fixed design.
- B014 and B013 themselves: only their expected gains enter the table.
- The old note's § 3 (options that change the fitted quantity).

Read-only sources: `git show e1e6847:docs/faster-fit.md`; `side-projects/faster-fit/README.md` and
`more-speedups.md`; `side-projects/colony-fastpath/README.md`; STATUS Decisions log 2026-10-18 ≈ 04:09
(speed-up attempt).

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-18 04:37 UTC · muse-wonder session 01a14d4b · Claimed at 06fef62; base files clean. Reading before runs: if warm-up dominates per-recruiter time, shared warm-ups (--perNest, already implemented) and snapshot extension are the big levers; if the observed stay dominates, multi-fidelity (cheaper dt/window in early generations) matters more. Colony-subset for Mailleux translates to fewer recruiters/days in a screening phase, not fewer of 22 colonies. Will time independent vs shared recruiters at both m1999Points starts (density 1 and 2.3), split warm-up vs stay vs recruiter-load, profile the largest nest, then model one CMA-ES generation (lambda=9, N=80/day x 3 days) on 62 workers. Timings use the pilot nest motion, so indicative only.
- 2026-10-18 04:46 UTC · muse-wonder session 01a14d4b · Measured (timeM1999.ts, results/timings.json): warm-up 300s is 53-68% of an independent recruiter (403-903 ms; 23 nestmates at density 1, 53 at 2.3); recruiter load 4-49 ms; shared perNest4 saves 1.6-2.2x. dt 0.2 costs 0.55-0.62x dt 0.1, dt 0.05 1.9-2.3x. Profile (largest nest, out/*.cpuprofile): no hotspot over 9% (senseIncremental 8.8%, GC 3.7%), so allocation refactor is a poor lever here. Makespan model (makespan.ts, results/makespan.json, lambda=9, 80/day x 3d, 62 workers, local-speed): generation 22.5s independent, 12.8s shared, 6.9s shared+half-recruiter screen. Recommendation table in results/recommendation.md.
- 2026-10-18 04:47 UTC · muse-wonder session 01a14d4b · Done. Recommendation in results/recommendation.md, Findings written. backlog.mjs check B008: 2 results files, 0 stale. No proposal.patch: no main-tree change proposed (shared warm-ups already implemented; other options are step-5 design decisions or B013/B014).

## Findings
Warm-up, not the observed stay, is where a Mailleux recruiter's time goes:
53–68 % of a 403–903 ms independent run at a 300 s warm-up (23 nestmates at
density 1, 53 at 2.3), so the already-implemented shared warm-ups
(`--perNest 4`) are the biggest certain saving, measured at 1.6–2.2×
(≈2.7× estimated at a 900 s warm-up). One generation (λ = 9, 80/day × 3
days, 62 workers) models to 22.5 s independent vs 12.8 s shared at local
core speed. Multi-fidelity transfers only as dt (0.2 costs 0.55–0.62×)
plus recruiter-halving for screening (0.50×); colony-subset screening has
no literal Mailleux form. Cross-candidate warm-up snapshots (needs B013)
cap at ≈1.5× more, fixing flat parameters (existing `identM1999.ts`)
buys convergence, not per-generation time, and the largest-nest profile
shows no hotspot worth a refactor (top 8.8 %, GC 3.7 %). Full table with
the gate each option needs (all in the existing ±0.5 SE_data form) and
the B013/B014 interactions: `results/recommendation.md`; evidence in
`results/timings.json`, `results/makespan.json` and `out/` (profile).
Confidence: high for the ranking at the pilot set-up; absolute times are
indicative only, because the runner still has the pilot nest motion and
candidate densities up to 6/cm² (138 nestmates) will inflate every task.
Implication: the step-5 design can start from `--perNest`, an
identifiability run, and B015; multi-fidelity, B013 and B014 are
second-round multipliers behind their own gates. No main-tree change is
proposed, so there is no `proposal.patch`.
