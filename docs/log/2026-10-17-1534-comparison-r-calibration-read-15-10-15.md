---
id: D017
date: 2026-10-17
time: 15:34
kind: reading
title: Comparison R calibration read (15:10 / 15:13 rules): no cell passes; the data side is not run
---
**2026-10-17 ≈ 15:34 UTC — Comparison R calibration read (15:10 / 15:13
rules): no cell passes; the data side is not run.** Box run
`robust-20261017T151427Z` ok (19 min, 88 runs); reductions
`logs/robust/cs-rob-*`, `logs/robust/calib.txt` (`robustAgg.py calib`;
cells only, packing not opened). M / control, pooled counts, light
(dark within 0.03):

| rOut \ dwell | 0 | 2 | 4 | 10 |
|---|---|---|---|---|
| 5.1 still–still | **2.51** | 2.41 | 2.39 | 2.38 |
| 6.1 still–still | 2.37 | 1.94 | 1.95 | 1.97 |
| 7.1 still–still | 2.36 | 1.81 | 1.82 | 1.85 |
| moving-involved (all bands) | 0.90–0.92 | 0.95–0.97 | 0.95–0.96 | 0.93–0.94 |

Retention vs the current statistic 0.97–1.00 at dwell 0, 0.45–0.65 at
dwell 2, 0.29–0.40 at dwell 10. Cell (5.1, 0) vs comparison O's ×2.43:
**checked ≈ 15:45** — O's and R's raw counts are identical in all 22
colonies, both phases, control and M; pooled still–still M / control
is 2.505 (light) / 2.534 (dark) from either run. O's ×2.43 is the
geometric mean of per-colony ratios (`contactSplit.py`), R's the pooled
ratio; aggregation only.
- **Reading:** no cell has both ratios in [0.90, 1.10]; per the rule,
  reported, no wider grid without the user, and the data-vs-model step is
  not run. Moving-involved contacts are robust with any dwell ≥ 2 (0.95–
  0.97, inside the bar); still–still contacts stay ×1.8–2.5 throughout.
- **Why (interpretation, not a criterion):** for two still ants, any
  change in observed distance is either real creep or measurement error.
  M's error varies on τ 90 s with a relative SD ≈ 1 mm, so dwells of ≤
  5 s are far shorter than its time scale and a band of ≤ 3 mm is ≤ 3
  SD: pairs resting 4–7 mm apart still cross. A crossing count between
  still ants is in effect a measure of distance fluctuation, which is
  what M adds; no band × dwell choice of this family separates it.
- **Consequence for the contact blocker:** the still–still deficit
  (model / data 0.26 light, 0.29 dark) cannot be shown real or
  measurement with an event statistic of this kind. Options for the user
  (none taken): (a) judge contacts on the moving-involved part with a
  robust cell (e.g. 5.1 / 2, ratios 0.97) — a new comparison, needs its
  own reading; (b) move the still–still question to state measures
  robust to M — near share (0.77 vs 0.78 under M, comparison O) and the
  packing statistics already recorded in these runs (next step 2);
  (c) a much wider dwell (minutes, at τ's scale) — would mostly count
  arrivals, not contacts.
