---
id: B017
title: Pheromone field with a physical sampling footprint
status: done
size: M
priority: 130
note:
outcome: Optional provisional 0.5-mm Gaussian footprint plus cell-resolved deposits passes B012; legacy mode is bit-identical; proposal remains unadopted.
depends: backlog/B017-pheromone-field-with-a-physical-sampling/baseline, backlog/B012-pheromone-field-grid-convergence/convergence.ts, backlog/B017-pheromone-field-with-a-physical-sampling/field.ts, backlog/B017-pheromone-field-with-a-physical-sampling/antPhysics.ts, backlog/B017-pheromone-field-with-a-physical-sampling/world.ts, backlog/B017-pheromone-field-with-a-physical-sampling/convergence.ts, backlog/B017-pheromone-field-with-a-physical-sampling/footprint.test.ts, backlog/B017-pheromone-field-with-a-physical-sampling/legacyIdentity.ts, backlog/B017-pheromone-field-with-a-physical-sampling/makePatch.mjs
---
# B017 — Pheromone field with a physical sampling footprint

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: B012 Findings (2026-10-18). Added and scoped by the lead agent 2026-10-18.

## Question
B012 found two problems with `PheromoneField`:
- the point-sampled signal does not converge with grid refinement (the centreline factor f² + (1 − f)² stays
  anywhere in 0.5–1);
- 1-mm deposit pieces alias on cells under 1 mm.

Does a physical trail width or antenna-sampling footprint in millimetres, with deposit spacing tied to the cell
size, fix both, so that B012's check passes?

## Why it matters
- The trail-response model (not yet done in the M1 plan) would otherwise depend on the grid size.
- Nothing current uses the field, so this is not urgent, but it must be fixed before any trail-following result.

## Done when
1. **`proposal.patch`:**
   - a footprint parameter, with provenance `estimated` and a value either sourced or marked provisional for the
     user;
   - deposit spacing ≤ cell / 2;
   - tests;
   - the current behaviour kept as the default, bit-identical.
2. **B012's check** (`../B012-pheromone-field-grid-convergence/convergence.ts`, copied here and pointed at the
   patched copy) passes under its own predeclared rule:
   - centreline and 0.5-mm-offset samples within 10 % at the last refinement;
   - no longitudinal gaps.

## Base
`77fb34431025b74aeb1a6ade361023db443458a7` at claim. The field, ant physics and perception files are clean; the main tree has unrelated ongoing edits, including colony runners and research records. Original field and physics sources are preserved in `baseline/`; candidate copies stay here. `world.ts` is an unchanged harness copy with import paths redirected, solely to type its trail as the candidate field. No main-tree implementation is edited.

## Data and roles
No empirical data, synthetic trails only. Held-out: none.

## Compute
Local, under a minute per check, niced.

## Out of scope
Trail-response behaviour, choosing biological values (proposed to the user), applying the patch.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-29 19:52 UTC · codex-b017 · Pre-run reading: B012 concerns the zero-width point sampler and fixed 1-mm deposition. This proposal keeps that mode unchanged at samplingSigmaMm=0. The synthetic candidate uses a provisional 0.5-mm Gaussian sigma, with weights exp(-r²/(2 sigma²))/(sqrt(2 pi) sigma), so an infinite straight unit trail tends to unit centreline signal. Deposits in the enabled mode use spacing min(1 mm, cell/2). Repeat B012 geometry, cells, offsets, phases and fine quadrature; replace its physics1mm candidate mode with the proposed physics spacing. Judge the same last 0.25-to-0.125-mm refinement at centreline and 0.5-mm offset (<10 percent, 0.01 absolute near zero) and require no longitudinal gaps. Also check mass, decay, integration through walkAnt, and exact legacy-mode identity. A pass supports this numerical construction only, not a biological width, trail response or adoption.
- 2026-10-29 19:59 UTC · codex-b017 · First candidate check: all 96 candidate/control cases completed. Candidate passed the B012 rule (worst last-step change 3.046%, no fine-grid gaps); the legacy control failed. Maximum mass error remained 1.173e-5 on 60 units. All six candidate tests passed. The first item typecheck caught a harness-only RNG.stream call using string keys; changed it to numeric keys and will rerun identity, typechecking and convergence so their stamps match the final scripts. No main-tree code or empirical target was changed.
- 2026-10-29 20:04 UTC · codex-b017 · Final checks: six candidate tests passed; item tsc and repository tsc passed; direct original-code comparison passed 10,000 samples and 40 walking-state checks. The provenance checker initially failed because its nested npx spawn is denied by the sandbox (EPERM); the identical command outside the sandbox passed with two current stamped results and zero stale files. Added the original-source snapshot directory to depends and will rerun the two short evidence scripts for final stamps. The patch passes git apply --check and remains unapplied; coarse-grid alignment sensitivity and the provisional, unsourced sigma are disclosed in results/analysis.md.
- 2026-10-29 20:06 UTC · codex-b017 · Completed: final evidence scripts reproduced the same 96-case verdict and exact legacy identity; both result stamps are current (zero stale). proposal.patch passes git apply --check --whitespace=error-all. Findings and caveats are in README and results/analysis.md. Scope/exposure report: only synthetic trails and existing code were used; no sealed file contents or held-out data were inspected. The required npm run runs inventory displayed managed-run states and elapsed times, including Part D, but no run logs or scientific statistics were opened. plied check has zero errors and seven baseline D180 review warnings (T033, P21, P43, P45, P51, P52, P54), left for the lead because this task cannot edit those records. Next: lead review of F049/T046 and user decision on any footprint value or patch adoption; no fit, commit or application performed.
- 2026-10-29 20:07 UTC · codex-b017 · Handoff sent on T046 to lead and this session claim released. The final plied check, run during concurrent project record updates, reports zero errors and 19 unrelated stale-review warnings: D180 on T033, P21, P43, P45, P51, P52, P54; new D181 warnings on P01, P03, Q11, P02, T020, T023, T031, T033, T034, T035, T038, T053. Each is left for the lead: these record reviews are outside B017 and this agent may not edit plied records. This updates the earlier seven-warning inventory; B017 validation results are unchanged. The patch was opened in Codex for review.

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
