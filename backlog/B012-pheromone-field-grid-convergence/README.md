---
id: B012
title: Pheromone field grid convergence
status: done
size: M
priority: 120
note:
outcome: Mass is conserved, but point-sampled signal does not converge with grid refinement; sub-cell deposits also leave gaps.
---
# B012 — Pheromone field grid convergence

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18)

## Question
Does the pheromone field converge under grid-spacing refinement?

## Why it matters
`PheromoneField` is sampled at antenna tips in millimetres. If the sensed
value changes with cell size for the same physical trail, future trail-following
results will depend on a numerical choice rather than a parameter with stated
meaning. The field is currently not instantiated in app or experiment code,
so this is a prospective component check.

## Done when
Compare deposited mass and point samples for a fixed 60-mm line at several
cell sizes, first with sufficiently fine deposition quadrature and then with
the physics code's up-to-1-mm midpoint pieces. Report whether the near-trail
sample stabilises under the last refinement and whether the fixed-size
deposit pieces introduce gaps. Give a concrete recommendation, without
changing the main tree.

## Base
`154055d` at claim (2026-10-18 03:40 UTC). `src/sim/world/field.ts`,
`world.ts`, `physics/antPhysics.ts`, and `perception/perceive.ts` are clean.

## Data and roles
No empirical data. Synthetic straight-trail input only. No held-out material.

## Compute
One local, single-process field calculation, expected under a minute; niced.
`npm run runs` showed no active managed runs at claim.

## Out of scope
No refit, whole-ant simulation, trail-response mechanism, source-paper review,
or main-tree code edit. If a fix is needed, it will be proposed inside this
folder for user/lead-agent review.

## Progress log
<!-- Newest last, a few lines each: what was done, the command, and the result
in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

- 2026-10-18 03:40 UTC · Codex · Claimed B012. Pre-run reading: deposited
  `Σ cellValue × cell` should remain 60 for 1 unit/mm over 60 mm. For a
  physically stable antenna signal, the centreline and 0.5-mm-offset
  samples at 0.25- vs 0.125-mm cells should differ by under 10% (absolute
  tolerance 0.01 for values near zero). A larger last-step difference or
  strong dependence on trail position within a cell means the current
  point-sampled field is not grid-converged at those spacings. Gaps under
  1-mm midpoint deposition but not fine quadrature would identify a separate
  path-discretisation issue. This is a numerical criterion for this check,
  not an adopted model rule.
- 2026-10-18 03:41 UTC · Codex · Ran `nice -n 10 npx vite-node
  backlog/B012-pheromone-field-grid-convergence/convergence.ts`; 48 synthetic
  field cases (6 cell sizes × 2 deposition steps × 4 sub-cell positions).
  Results in [results.json](results.json). Maximum mass error was 1.2×10⁻⁵
  on 60 units. The 0.25→0.125-mm last refinement failed the registered
  point-sample rule; the 1-mm deposit pieces made longitudinal gaps at both
  fine resolutions.

## Findings
**Result: the current point-sampled field is not grid-converged.** With a
60-mm straight trail deposited at 1 unit/mm, `Σ cellValue × cell` stays at
60 to within 1.2×10⁻⁵ across all 48 cases. Conserved trail amount therefore
does not imply stable concentration at the ant's antenna tips.

The fine-quadrature cases place the same continuous trail at y = 30.37 mm,
then sample on its centreline at x = 50.5 mm (the `sample` value is also the
sensory value when `trailThreshold = 1`):

| Cell (mm) | Centreline sample | Sample 0.25 mm off trail | Sample 0.5 mm off trail | Centreline range over four sub-cell trail positions |
|---:|---:|---:|---:|---:|
| 1 | 0.774 | 0.766 | 0.548 | 0.529–0.789 |
| 0.5 | 0.635 | 0.375 | 0.182 | 0.500–0.980 |
| 0.25 | 0.961 | 0.0196 | 0 | 0.501–0.961 |
| 0.125 | 0.503 | 0 | 0 | 0.503–0.923 |

The last centreline step changes by 48%, above the predeclared 10% bar.
At a fixed nonzero offset, the detectable band narrows as the grid is refined.
This persists even with deposition steps ≤ cell/8, so it is intrinsic to
the field representation and point sampler. For a long straight line, the
transverse bilinear deposit and sample weights give a centreline factor
`f² + (1−f)²`, where `f` is the trail's fractional position between cell
centres. It can remain anywhere from 0.5 to 1 as the grid changes.

The physics code deposits walked segments in up-to-1-mm midpoint pieces.
At a 0.25-mm grid, centreline samples at x = 50 and 50.5 mm are **0 and
1.922**; at 0.125 mm they are **0 and 2.013**. Fine quadrature gives a
constant value along that portion of the line. This is a second, longitudinal
aliasing effect when deposit spacing exceeds cell size.

The conclusion concerns `PheromoneField` itself. The current app and
experiments do not instantiate it, and the behaviour code does not yet use
`trailL`/`trailR`; no present fit or behaviour result is affected. Before
using grid refinement as a numerical check on a trail-response model,
specify a physical trail width or antenna-sampling footprint in millimetres,
and tie deposition spacing to grid size. Then repeat this same fixed-geometry
check. This work proposes no parameter value or adopted mechanism. The
reproducible check is [convergence.ts](convergence.ts).
