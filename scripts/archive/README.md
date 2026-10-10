# Archived scripts

Finished one-off studies and superseded fits, moved here on 2026-10-10 to keep
`scripts/` limited to current work. They are kept because they reproduce
results recorded in [`docs/archive/STATUS-2026-10-07-to-10.md`](../../docs/archive/STATUS-2026-10-07-to-10.md).
They still type-check and run from the repo root:
`npx vite-node scripts/archive/<name>.ts`. Results recorded before the
wall fix (2026-10-10 night, 157cd66) may differ slightly when rerun.

| Script | What it did |
|---|---|
| `analyzeKhuong.ts` | Per-incline summary of the Khuong et al. 2013 trajectories (session 1). |
| `censorE1.ts` | E1 censoring audit (exit times). |
| `covE1.ts` | Covariance and normality of the E1 fit statistics. |
| `diagE1Turns.ts` | E1 stop-duration and turn-linked speed diagnostics. |
| `judgeE1.ts` | Step-5 E1 candidate judging (B vs A0). |
| `recoverE1.ts` | E1 staged-vs-joint recovery fits. |
| `scaleE1.ts` | E1 sampling-scale sweep. |
| `scanE1.ts` | E1 loss on a 2-parameter grid. |
| `selectE1.ts` | Draft A0 vs T selection rule (parked with E1). |
| `strideE1.ts` | Stride sway vs correlated tracking error (E1 side task). |
| `sweepE1Signatures.ts` | E1 signature table with reachability. |
| `fitE2.ts` | Step-3 E2 variant fits (M_a–M_d; the legacy layer `e2-drinking.json`). |
| `compareE2.ts` | Step-3 comparison of the E2 variants. |
| `identifyE2.ts` | Step-3 local identifiability of an E2 variant. |
| `profileE2.ts` | Step-3b profiles (σ_m, q, pipette accessibility). |
| `testE2Heldout.ts` | Step-3b held-out test on Mailleux 2003 (run once). |
| `calibrateE2Speed.ts` | E2 walking-speed context factor (step-3c amendment). |
| `diagE2Search.ts` | Step-3c search-around-food diagnostics. |
| `regE2Drops.ts` | Per-drop volume–time regressions (2009). |
| `checkM1999Shared.ts` | Design-equivalence check for shared warm-ups (passed). |
