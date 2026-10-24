---
id: F089
title: "Within each ant, in-nest still runs are heavy-tailed: exponential rests are rejected in every group × phase cell, and per-ant rates leave the within-ant tail (Lomax shape 0.87–1.06)"
topic: motion
status: indicated
date: 2026-10-23
data: Stroeymeyt 2018 fit colonies, PreTreatment (fit)
evidence: STATUS:Between- vs within-ant still-run tails; STATUS:Rest-duration shapes
bears_on: rest form (Lomax, restShape); synchrony baseline (paper 2); motion model in the transfer paper
related: F003, F008, F009, F090, F013
supersedes:
superseded_by:
depends:
---
`scripts/diagS2018Runs.ts`, `diagS2018Shapes.ts` (`logs/diagS2018Runs.json`, `logs/diagS2018Shapes.json`). Observed / expected
still runs ≥ 300 s under a geometric excess: colony rate 75–1470, per-ant rate 8.8–46, per ant × 2 h 4.1–16; the 10-s
deficit barely moves (0.38 → 0.44). Exponential out everywhere (ΔBIC 48k–600k); base 2 s: Lomax per colony beats a
two-exponential mixture in all 4 cells, shared shape α 0.94–1.06; base 10 s: mixture and Lomax tie. Per-ant scale
does not pay under BIC once the shape is heavy-tailed. Exploratory, no prior rule. Caveats: runs pass through the
observer (0.6 mm/frame threshold, gaps > 3 frames break and discard a run, which censors long rests) and include
walking pauses; position misreads that split rests are not audited (the tracker models gaps only).
