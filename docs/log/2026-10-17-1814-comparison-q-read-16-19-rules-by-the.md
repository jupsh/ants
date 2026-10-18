---
id: D029
date: 2026-10-17
time: 18:14
kind: reading
title: Comparison Q read (16:19 rules): by the table, W+E(1.0) reads "the still–still deficit is packing", the other two arms "not tested"; the guard failed; three qualifications are reported beside the verdict, not in place of it
---
**2026-10-17 ≈ 18:14 UTC — Comparison Q read (16:19 rules): by the
table, W+E(1.0) reads "the still–still deficit is packing", the other
two arms "not tested"; the guard failed; three qualifications are
reported beside the verdict, not in place of it.** Run
`q-20261017T162344Z` ok (1 h 50 min, 396 runs); `logs/q/agg.txt`
(`qAgg.py`). Medians over colonies, light (dark within ≈ 0.04 unless
given).

| arm (control observer) | S1 median NN (mm) | S2 near share | S3 | occupancy r | wall band |
|---|---|---|---|---|---|
| data | 2.17 | 0.962 | 0.997 | (ceiling 0.96) | — |
| baseline | 2.10 | 0.803 | 0.965 | −0.14 | 0.53 |
| W | 2.54 | 0.788 | 0.977 | +0.29 | 0.16 |
| W+E(0.25) | 1.25 | 0.900 | 0.958 | +0.23 | 0.10 |
| W+E(1.0) | 1.40 | 0.937 | 0.981 | +0.29 | 0.07 |
| W+S(3) | 2.07 | 0.834 | 0.964 | +0.90 | 0.07 |

- **Effects (paired ratios):** W / baseline: S1 1.21, S2 0.98, occupancy
  r +0.43, wall band ×0.30. Against W: E(0.25) S1 0.51, S2 1.14; E(1.0)
  S1 0.52, S2 1.22; S(3) S1 0.80, S2 1.06, occupancy r +0.59. E leaves
  occupancy r unchanged (Δ −0.08 … −0.01, CIs include 0).
- **Guard: failed.** W / baseline: exits per ant-hour **0.68** [0.66,
  0.71] (light and dark), moving fraction 1.10 [1.09, 1.12] (just
  outside); light / dark ratios unchanged (1.00, 1.00). The wall-neutral
  edge cuts nest exits by a third (exits are presumably found by
  following walls) — W shifts matched quantities, a caveat on every arm.
- **Outcome table** (S2 ≥ 0.92 = packing reached; r_ss from M-observed
  output): W+E(0.25) S2 0.900 / 0.911 → **not tested** (r_ss(M) 1.64 /
  1.84); **W+E(1.0) S2 0.937 / 0.936, r_ss(M) 1.35 [1.22, 1.50] / 1.64
  [1.45, 1.88] → (i) "the still–still deficit is packing"**; W+S(3) S2
  0.834 / 0.833 → **not tested** (r_ss(M) 0.84 / 1.00; manipulation check
  passed, occupancy r 0.90 / 0.92, not evidence).
- **Qualifications (found at reading time, disclosed; the rule's verdict
  stands as written):** (1) **W+E(1.0) reaches the near-share threshold
  by over-compacting**: its median NN is 1.40 mm against the data's 2.17
  (ratio ≈ 0.65); the table used S2 alone for "packing reached", a weak
  rule (S1 was a judged statistic in P and should have entered it). (2)
  **The M-observed count overshoots** (×1.35–1.64 of the data), while
  the **control-observer still–still ratio falls** with aggregation
  (baseline 0.26 / 0.29 → W+E(1.0) 0.23 / 0.27): in this model, still
  ants in a cluster do not move relative to each other, so still–still
  crossings are produced by measurement error, in proportion to how many
  still pairs sit near 4.1 mm. The verdict therefore says that packing
  plus M-sized error can produce (and here overshoot) the data's count —
  not that the data's crossings are real creep, nor that they are not;
  as R showed, the tracks cannot separate the two. (3) Guard failure
  above. Taken together: **packing is a sufficient explanation of the
  still–still deficit under M-sized measurement error, with the caveat
  that this arm overshoots both compaction and the count**; the
  data-like configuration (S1 ≈ 2.2 mm with S2 ≈ 0.96) was not reached by
  any arm.
- **Other findings (descriptive):** a data-fed site alone (W+S) puts the
  ants in the right place (r 0.90) without the data's packing (S2 0.83),
  so location is not packing. W removes most of the wall excess (0.53 →
  0.16) and turns occupancy r positive, at the cost of exits.
- No further arms without the user (rule). Options for the user, none
  taken: (a) accept "packing is sufficient under M-sized error" as the
  answer to the contact blocker, with the qualifications; (b) one
  bounded follow-up aimed at the data-like configuration (S1 and S2
  together, e.g. aggregation with a minimum spacing), with S1 in the
  "packing reached" rule; (c) a wall rule that keeps exit rates (e.g.
  edge-following only near the entrance) before any adoption.
