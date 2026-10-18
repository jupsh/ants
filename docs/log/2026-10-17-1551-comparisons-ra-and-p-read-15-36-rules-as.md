---
id: D022
date: 2026-10-17
time: 15:51
kind: reading
title: Comparisons Ra and P read (15:36 rules as amended 15:45)
---
**2026-10-17 ≈ 15:51 UTC — Comparisons Ra and P read (15:36 rules as
amended 15:45).** Data side `logs/robust/data-c*.json` (22 fit
colonies, `robustData.ts`); model control `logs/robust/cs-rob-ctl-*`.

*Ra — moving-involved contacts: marginal in light, reproduced in dark;
the model lacks the data's light / dark contrast.* Only the moving lines
of `robustAgg.py data` were read (`logs/robust/ra.txt`); the aggregator's
"mixed" label is R's wording, the Ra rule was applied by hand.

| cell | light model / data | dark model / data | verdict |
|---|---|---|---|
| 5.1 / dwell 2 | 0.73 [0.65, 0.85] | 1.10 [0.93, 1.32] | marginal (light), reproduced (dark) |
| 5.1 / dwell 0 | 0.78 [0.69, 0.89] | 1.19 [1.00, 1.42] | marginal (light), reproduced (dark) |

Both cells agree (Claude's 15:45 equal-weight rule does not bite). Light /
dark rate ratio (geometric mean over colonies): **data 1.51 / 1.53,
model 1.01 / 1.01**. ~~So the model is not short of contacts with movers
overall~~ (overstated, corrected ≈ 15:58, user guidance: the level is
about right *on average*, partly a coincidence of averaging a flat model
against a 1.5× contrast — not reproduction); the model sits between the
data's phases because it has no light / dark modulation of them (related open item: the data's light / dark
trip-location difference, not modelled). Scope (15:45 item 6): dwell 2
keeps 0.45–0.65 of contacts; dwell 0 is the established definition.

*P — packing: mixed by the rule; same density where the ants are, but
the model has more isolated ants and puts them in different places.*
`logs/robust/pack.txt` (`packAgg.py`).
- Robustness (M / control): S1 1.05, S2 0.99, S3 1.00 → judged; **S4
  (A50) 1.69 → not robust** (drift spreads occupancy), reported only.
  Three judged statistics (15:45 item 5).
- Model / data, all ants (light; dark within 0.01): **S1 median NN 0.98
  [0.90, 1.09]** (data 2.17 mm, model 2.10) — matched; **S2 NN < 4.1 mm
  0.82 [0.77, 0.86]** (data 0.96, model 0.80) — less packed; **S3 NN <
  8.2 mm 0.95 [0.93, 0.97]** (0.997 vs 0.965) — matched by the [0.9,
  1.1] rule. **Verdict: mixed** (S1, S3 matched; S2 less packed). Nurses
  carry the S2 gap (0.80; foragers 0.86).
- Reading in words: the typical neighbour distance is the same, but in
  the data almost every ant has a neighbour within a body length (96 %),
  in the model one ant-frame in five has none — the model's distribution
  has a heavier upper tail of isolated ants.
- Beside (descriptive): occupancy maps correlate **negatively** with the
  data's (median r −0.14, range −0.25 … 0.15, 5-mm cells). Checked ≈
  15:51 that both use the same frame (≈ 0–70 × 0–40 mm): the model's
  most-occupied cells are at walls and corners and its centroid at the
  nest centre; the data's are at a colony-specific site (e.g. colony 112
  near y ≈ 8 mm), presumably the brood pile. The model has no brood or
  aggregation mechanism (Evidence policy note on the held-out spatial
  papers).
- **Bearing on the still–still contact question (interpretation):** a
  model with ~20 % isolated ant-frames and no shared resting site
  should have fewer still–still crossings, whatever the measurement
  error. This points at aggregation / a resting site (step-3 option
  "packing / aggregation mechanism") over physical creep, without
  deciding it.
