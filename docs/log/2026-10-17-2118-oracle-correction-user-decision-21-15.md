---
id: D031
date: 2026-10-17
time: 21:18
kind: design
title: Oracle correction (user decision 21:15 item 2): fix, regression test and rerun designed before running
---
**2026-10-17 ≈ 21:18 UTC — Oracle correction (user decision 21:15 item
2): fix, regression test and rerun designed before running.**
- **Fix:** the oracle multiplier now also scales the foragers' own
  walk-on value (`P.nest.forager.restToActive`), restored after each
  policy call; `oracleNurseOnly` (`--oracleNurseOnly`) keeps the pre-fix
  behaviour so runs logged before the fix reproduce. Default (no oracle)
  path unchanged. **Regression test** (`test/oracle.test.ts`, forager
  overlay as at the start point, restToActive 0.6, activeToRest 1.07): a
  constant factor 2 equals doubling both role values; with
  `oracleNurseOnly` it equals doubling the nurse value only; both values
  restored. Passes.
- **Rerun = the 05:11 design, unchanged in settings and rule:** start
  point (σ 0.4), original geometry (no wall switch); arms **coupled κ
  0.5 and κ 1 (τ_c 60 s), placebo SD 0.32 and 0.53 (τ_c 60 s)** — the
  logged placebo SDs; no other κ or τ. Outputs as then: rows
  (`diagS2018 --at start --oracle … --reps 4`, paired with
  `logs/sf/diag-ctl.json`), per-ant activity (`tmpTrackerSim` 12 h,
  `simact.py`, control `sim-s0.4`), synchrony (`tmpShortSim --trips`,
  4-h light window, `syncAgg.py`). The synchrony control is rerun
  (`oc-ctl`) only to add the forager-only series; its all-ant and nurse
  values must reproduce the earlier control (check, reported).
- **Reading, as fixed at 05:11:** (a) *synchrony reproduced by coupling*
  if a coupled arm closes ≥ half the gap at both 1 min and 10 min (all
  ants, light: D ≥ 2.7 and ≥ 3.9) while the placebo of the same κ stays
  at the control's level (control CI); (b) *persistence protected*: nurse
  and forager 6-h lag correlation within 0.10 of the control; (c) rows
  and spread reported as gains / costs against control and placebo.
  **Reported beside (user):** role-specific synchrony (nurses, foragers)
  and persistence; the coupled arms' realised SD of log g next to the
  placebo SDs (a mismatch > 20 % is flagged, the rule unchanged). A
  pass establishes diagnostic capacity only; Y leaves the spatial
  mechanism unresolved.
- Data side: `tmpShortData.ts` rerun locally (22 colonies) to add the
  forager-only synchrony series; all other keys must equal the
  pre-rerun files (backed up in `logs/short/pre-2120/`; check reported).
- **Launched ≈ 21:19** (`run.sh` run `oc-20261017T211940Z`,
  `scripts/scratch/box/run-oc.sh`): stage 1 rows (4 × `diagS2018`,
  `SIM_WORKERS=15` each), stage 2 activity and synchrony (198 runs,
  `xargs -P 62`). Copied the fixed `colonyBles.ts`,
  `colonyStroeymeyt.ts`, `s2018Lib.ts`, `antPhysics.ts`,
  `tmpShortSim.ts` (forager-only synchrony added) and the tests; md5
  sweep shows only the known `lib.ts` / `paperText.ts` differences and
  `syncStats.ts`, **left at the box's version on purpose** (the one the
  05:11 run used, so the arms' synchrony is computed as then; whether
  the local block-wise version gives the same D for one 4-h window is
  not checked and not relied on).
  Outputs `logs/oc/`, `logs/act/sim-sOC*`.
