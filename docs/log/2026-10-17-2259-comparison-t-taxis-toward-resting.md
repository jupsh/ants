---
id: D037
date: 2026-10-17
time: 22:59
kind: design
title: Comparison T (taxis toward resting nestmates), design and reading logged before building
---
**2026-10-17 ≈ 22:59 UTC — Comparison T (taxis toward resting
nestmates), design and reading logged before building.** Second
checkpoint committed first (`5c3e4dd`; tests 176 / 176, tsc clean).
Fit colonies in a development role. Runner-level what-if with true
positions and modes (diagnostic, **not adoptable**), all arms on the
**W-spec** wall rule; W-spec's uncertain light-activity pass (WR,
22:55) stays attached to this comparison.
- **Heading rule (fixed):** applies to in-nest ants walking in the
  `active` mode whose action carries no motor goal (leaving and
  returning goals are never overridden). Every 1 s each ant's target
  vector is recomputed: v = Σ of unit vectors toward resting in-nest
  nestmates within **8 mm** (centre distance). If |v| < 0.5 — no resting
  neighbours, or opposing directions cancelling to less than half of
  one neighbour's pull — no steering. Otherwise the walker steers toward
  atan2(v) through the motor's existing first-order goal steering with
  gain **g = 0.3 /s (T0.3) or 1.0 /s (T1.0)** (the leaving gain is 1.5
  /s). No rate is changed.
- **Runs:** start point, 22 colonies × light / dark × 12 h, seed 4242,
  `--lite --robust`: W-spec (control observer: WR's runs reused; M: new),
  T0.3 and T1.0 each under the control observer and variant M (220 new
  runs); rows `diagS2018 --at start --reps 4` for W-spec, T0.3 and T1.0
  (still-run summaries).
- **Joint packing criterion (both phases; neither statistic
  compensates for the other):** S1 median NN, geometric mean of per-
  colony model / data ratios in **[0.90, 1.10]**; S2 near share (NN < 4.1
  mm), median over colonies within **data median ± 0.02** (data 0.962
  light, 0.955 dark). Point estimates decide; colony-bootstrap 95 % CIs
  reported, a pass whose CI crosses a bound labelled "uncertain".
  *Packing reached* = S1 and S2 pass in both phases.
- **Guards (every arm, data-relative, against the W-spec control):** m =
  max(model / data, data / model); pass if m_arm ≤ 1.10 × m_Wspec, each
  separately: exits per in-nest ant-hour (light, dark), moving fraction
  (light, dark), light / dark moving-fraction ratio, light / dark
  moving-involved-contact ratio (as WR; colony bootstrap, "uncertain" if
  the 95 % upper bound of m_arm / m_Wspec exceeds 1.10), and **still-run
  summaries** from the rows: runStill.mean and runStill.P10 for nurses
  and foragers (data = the fit rows; uncertainty from the rows' SE_sim:
  "uncertain" if m_arm / m_Wspec computed at the arm's estimate ± 1.96
  SE_sim crosses 1.10).
- **Reading (per strength):** packing reached **and every guard passed**
  → a **usable result**; packing reached with any guard failed → a
  **failed candidate**; packing not reached → not reached. Overall: if
  neither strength reaches packing, **this bounded test did not establish
  the explanation**. Reported beside, never used to choose: still–still
  and moving-involved crossings (cell 5.1 / 0) under the control
  observer and M, model / data; occupancy correlation; wall-band share.
- Two strengths only; after them, read against this table before deciding
  anything else (user).
- **T built and launched ≈ 23:02.** `ColonyOptions.taxis` (`taxisStep`,
  applied to the actions after the policy call; leaving / returning
  goals untouched), `--taxis gain:r`; test: gain 0 bit-identical, a
  positive gain changes the run on both wall rules (`npm test` 177 /
  177, tsc clean); local smoke run on the specular walls completes.
  Aggregator `scripts/scratch/tAgg.py` written to the table above (not
  run). `run.sh` run `t-20261017T230244Z`, `scripts/scratch/box/run-t.sh`:
  rows for W-spec, T0.3, T1.0, then 220 lite runs. md5 sweep: only the
  known `lib.ts` / `paperText.ts` differences.
