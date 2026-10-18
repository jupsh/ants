---
id: D014
date: 2026-10-17
time: 15:10
kind: design
title: Comparison R (measurement-robust contact statistic, next step 1), design and reading logged before building
---
**2026-10-17 ≈ 15:10 UTC — Comparison R (measurement-robust contact
statistic, next step 1), design and reading logged before building.**
Bar approved by the user (just before this entry): a robust statistic moves by less
than 10 % under variant M.
- **Statistic family (one code path for data and simulated observers,
  `scripts/scratch/robustContacts.ts`).** Pairs of tracked ants both
  detected in the nest, as `contactStats.ts`; entry radius **r = 4.1 mm
  fixed** (the contact definition, one body length). Grid: exit radius
  **rOut ∈ {5.1, 6.1, 7.1} mm** (band 1 / 2 / 3 mm; the relative offset
  of two tags under M has SD ≈ 0.7·√2 ≈ 1.0 mm) × **dwell D ∈ {0, 2, 4,
  10} frames** (0 / 1 / 2 / 5 s): a contact is a crossing into < r by a
  pair whose last D joint detections were all > rOut, confirmed when its
  next D joint detections all stay < rOut (counted then, classified by
  the moving flags at the crossing frame, as now). A joint gap > 3 frames
  forgets the pair, as now. The cell (5.1, 0) is the current statistic
  and must reproduce `ContactStats` counts exactly (check before the
  box run).
- **Calibration, model only (paired, seed 4242):** start point, 22
  colonies × light / dark × 12 h, `--lite`; control (observer unchanged,
  as `night-ctl`) and **M** (`--obsVariant tag:0.7:90 --pxRound
  0.0229658793`, as in O): 88 runs on the box. Per cell and phase, ratio
  M / control of pooled counts, still–still and moving-involved, colony
  bootstrap 2000. **A cell passes** if both ratios lie in [0.90, 1.10]
  in both phases (point estimates; CIs reported). **Choice:** the
  passing cell with the narrowest band, then the shortest dwell (closest
  to the established definition, keeps most events). Retention vs the
  current statistic reported, no rule. None passes → reported, no wider
  grid without the user.
- **Then data vs model on the chosen cell only** (data side computed
  after the choice; 22 fit colonies, PreTreatment, light / dark by UTC as
  before): model / data ratio of contacts per detected ant-frame,
  still–still and moving-involved, colony bootstrap as `contactAgg.py`.
  **Reading, fixed now (still–still):** the deficit **survives** (real
  at this geometry) if the ratio's 95 % CI upper bound is < 0.8 in both
  phases; it is **largely measurement** if the point ratio is ≥ 0.8 in
  both phases; otherwise **mixed**, reported as such. Moving-involved
  reported with the same thresholds, descriptive. The other cells' data /
  model ratios are reported afterwards as sensitivity, not used for the
  reading. Limit, stated in advance: insensitivity to M shows robustness
  to slow per-tag drift only, not to other tracking errors (jumps, swaps).
- **Packing recorded in the same runs (next step 2), not read:**
  nearest-neighbour distance histograms (tracked ants detected in the
  nest, 0–30 mm in 0.25 mm bins + overflow, per role and phase) and
  occupancy (observed positions in 1 mm cells, per colony, role and
  phase), control, M and later data. Their reading is logged separately
  before any packing output is opened (blind checks until then).
- **Amended ≈ 15:13, before any box run (found building).** Check 1
  passed: cell (5.1, 0) reproduces `ContactStats` exactly (colony 0,
  light, 300 s warm-up + 30 min: 388 / 288 control, 447 / 277 M, still
  the case after the amendment). Defect: "its last D joint detections
  were all > rOut" breaks the run on every frame in the band, so a slow
  approach (≈ 1.3 mm/frame through a 2–3 mm band) can never count — the
  wider bands kept 1–4 % of contacts. **Amended pre-crossing dwell: ≥ D
  joint detections > rOut since the pair was last near or first seen**
  (band frames neither add nor reset; a > 3-frame joint gap still
  forgets the pair, so re-acquisition inside the band needs a fresh D
  beyond rOut). Confirmation after the crossing unchanged. Choice rule,
  bar and data reading unchanged. **Seen while checking (disclosed):**
  the 12 cells' counts for that one colony / 30 min, control and M
  (e.g. dwell 0: 388 → 447, i.e. +15 % under M at every band — at
  dwell 0 the wider bands do little, apparently because gaps re-acquire
  pairs inside the band as far). Not used for the choice; the rule above
  stands.
- **Launched ≈ 15:14 on the box** (`run.sh` run
  `robust-20261017T151427Z`, script `scripts/scratch/box/run-robust.sh`,
  88 runs, `xargs -P 62`). Copied only `tmpShortSim.ts` (adds
  `--robust`, otherwise identical to the box copy) and
  `robustContacts.ts`; md5 checked both sides. Other differences found
  in the full checksum sweep, none loaded by this run's recorder:
  `scripts/lib.ts` (local adds `runProgress`), `syncStats.ts` (local
  adds 4-h blocks; synchrony is not read here), data-side scripts absent
  on the box. Reductions in `logs/robust/cs-rob-*`; calibration read
  with `scripts/scratch/robustAgg.py` (cells only, packing not opened).
