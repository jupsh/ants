---
id: F101
title: With a 0.5-mm Gaussian sampling footprint (provisional sigma) and deposit spacing <= cell/2, the pheromone field's signal converges under B012's rule (worst change 3.05 % at 0.25 to 0.125 mm, no gaps); legacy mode is bit-identical; coarse grids stay alignment-sensitive
topic: numerics
status: indicated
date: 2026-10-30
data: synthetic trails, numerical test (no empirical data)
evidence: B017; docs/log/2026-10-30-0432-b017-reviewed-by-the-lead-a-0-5-mm.md
bears_on: E2 trail; T046
related: F049
supersedes:
superseded_by:
depends:
---
<Two to six lines: the numbers, the caveats.>
Against B012's predeclared rule, on synthetic straight trails only: the optional footprint passes (centreline 0.998 and 0.992 at 0.25 and 0.125 mm, analytic 1; 0.5-mm offset 0.607, analytic 0.607) and the legacy control fails. The 0.5-mm sigma is a provisional, unsourced number with `estimated` provenance. Not shown: a safe grid size (coarse grids vary 0.006-1.34 across phases at 4 mm), behaviour near boundaries, or any biological width. The patch is unapplied; adoption is the user's.
