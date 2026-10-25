---
id: D148
date: 2026-10-25
time: 03:18
kind: design
title: S2 audit synthetic checks: generator settings, replicate count, seeds and the κ calibration rule frozen before any test ran (D147 item 4, P37)
---
- **2026-10-25 ≈ 03:18 UTC — S2 audit synthetic checks: generator settings, replicate count, seeds and the κ calibration rule frozen before any test ran (D147 item 4, P37).**
  - **Frozen before any synthetic test, calibration or timing run.** The code is in `scripts/scratch/` (local, as the S2
    code it builds on):
    - `s2Audit.ts` (statistics, nulls, reference classing) `88c4463d0e317c0254d9723533e25cd5`;
    - `s2AuditGate.ts` (colony statistics, gate, Monte Carlo error) `8123fe67af67fc632088778073806417`;
    - `s2AuditSyn.ts` (generator, cases, acceptance, unit checks) `f9449f7429cd131d98feec3dd80dd115`;
    - `s2AuditFile.ts` (one real file per process) `d888bb33e91583b6853dd75265e72856`.
    - A bug found while testing is fixed and disclosed here with the new hashes. Settings, seeds, replicate count and
      acceptance rules do not change, and no seed is replaced to obtain a pass.
  - **Generator** (header of `s2AuditSyn.ts`):
    - 80 ants (60 nurses, 20 foragers), a 70 × 40 mm nest, 5 complete 240-bin blocks (1,200 one-minute bins).
    - Each ant-bin is undetected with probability 0.1; detected bins carry 120 frames.
    - Activity: a two-state process per ant (switch 1/b per bin), level 0.5 moving / 0.05 resting, + β_i·s(t) (s a
      colony-wide ±1 signal, switch 0.1) + σ_i·N(0, 1), clipped to [0, 1]. Default b = 10, β = 0, σ = 0.05.
    - Coupling κ: rest → moving with probability min(1, (1 + κn)/b), moving → rest 1/(b(1 + κn)), n = ants moving in
      the previous bin with homes within 10 mm.
    - Positions:
      - `home`: home + N(0, 1 mm);
      - `path`: resting at home + N(0, 1); moving on a corridor, x uniform, y = 20 + N(0, 2);
      - `clusters`: homes around (15, 20) or (55, 20), SD 3 mm; resting at home + N(0, 0.5); moving uniform.
    - The levels are not meant to mimic the data: these colonies move far more than real ones (≈ 27 % against a few
      per cent). They test the statistics, not the biology.
  - **Cases** (24 colonies each, 100 J draws per colony):
    - V1a `path`; V1b `clusters`; V3a β = 0.15 and σ = 0.05 for every ant (homogeneous in response and noise).
    - Descriptive challenges: V3b β_i = 0.3·x_home/70; V3c β = 0.15, σ_i ~ U(0.02, 0.15); V3d β = 0.15, σ_i = 0.02 +
      0.13·x_home/70 (spatially patterned noise).
    - V5: b = 2, 10, 30, each without and with κ*, on paired seeds (same generator key). V2 is V5's b = 10 case with
      κ*, its null under its own set index.
  - **κ calibration (rule frozen here):** the grid 0.05, 0.1, 0.2, 0.4, 0.8 at b = 10. The planted effect is mean(L_on −
    L_off) over 24 calibration colonies on their own seed (0x5a01). Only observed L is computed: no null, no S2_J.
    κ* = the smallest grid value with effect ≥ 0.05 (the data's L is ≈ 0.06, from D122's bands). None: stop and
    report. κ* is added here before the cases run.
  - **Seeds:**
    - generator `RNG.stream(0x5a00, genKey, colony, purpose)`, genKey V1a 1, V1b 2, V3a–d 3–6, V5 b = 2/10/30 50/51/52
      (V2 51);
    - nulls as on the real files, `RNG.stream(0x52a0, set, colony, draw, ant, block)`, synthetic set indices V1a–V3d
      101–106, V2 110, V5 120–125;
    - bootstrap 2,000 resamples, `RNG.stream(0x5ea0, key)`, key = the case's set index (V1 L_same − L_ref: + 1000),
      V5 paired 200/201/202;
    - unit checks on their own seed 0x5a0f.
  - **Acceptance (D147 item 4):**
    - V1a, V1b, V3a: the 95 % interval of mean S2_J lies within ±0.01;
    - V2: lower 95 % bound of mean S2_J > 0;
    - V5: the planted effect's lower bound > 0 (else recovery undefined, a failure), and the recovery lower bound ≥ 0.8
      (paired colony bootstrap of mean(S2_J on − off) / mean(L on − off)) at every b;
    - every colony estimable;
    - V4 and V6 unit checks pass.
    - Reported without a rule: L_same − L_ref in V1a and V1b (the matched share too), V3b–d.
    - Any failure: the audit stops after the synthetic checks, and the lead returns with the fallback design (P36).
  - **Continuity check:** before the synthetic run, the full-support data profile is computed with `s2Audit.ts` and
    compared with `ydistAgg.ts` and D122. These are the already-read D122 values, not an audit statistic.
  - **2026-10-25 ≈ 03:21 UTC — calibration read (D149):** no κ reached the target; stopped as frozen, before any case ran.
