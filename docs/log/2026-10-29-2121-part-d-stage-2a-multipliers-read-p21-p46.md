---
id: D184
date: 2026-10-29
time: 21:21
kind: reading
title: Part D Stage 2a multipliers read (P21, P46): Es clipped in 94 % of trajectory samples at its calibrated strength, applied mean g 0.33; T20f/T20m about 10 %, the other drivers under 1 %
---
- **2026-10-29 ≈ 21:21 UTC — Part D Stage 2a multipliers read (P21, P46): Es clipped in 94 % of trajectory samples at its calibrated strength, applied mean g 0.33; T20f/T20m about 10 %, the other drivers under 1 %.**
  - **Why now:** D173 owed these before Stage 2a is committed or published (P21: "both reported", governs commit and
    publish; P46: Es's clipped and trajectory multipliers). The user asked for a commit.
  - **Source:** the Stage 2a verification runs (`judge` 0xc4b1, 2 runs × 22 colonies per member at its selected
    strength), already read for D_w (D173); no Stage 2b or capability output. `scripts/scratch/partD2aMult.ts` sums
    each member's `oracleG` (the oracle trace's samples, i.e. along moving ants' trajectories) and `oracleStats`
    over its 44 files; output `logs/partd2/mult-2a.json`. Descriptive, no rule (D158).

    | member | strength | calibrated | E[g] before clipping | E[g] applied | E[1/g] applied | clipped | SD log g | acf 60 s |
    |---|---|---|---|---|---|---|---|---|
    | T10f | 1.375 | no | 1.242 | 0.533 | 3.436 | 82.3 % | 0.723 | 0.310 |
    | T20f | 0.5 | yes | 0.822 | 0.830 | 1.667 | 8.9 % | 0.575 | 0.283 |
    | T10m | 1.25 | no | 0.645 | 0.495 | 3.419 | 77.7 % | 0.672 | 0.571 |
    | T20m | 0.625 | yes | 0.782 | 0.786 | 1.849 | 10.4 % | 0.614 | 0.676 |
    | Eu-M | 0.4375 | yes | 1.006 | 1.005 | 1.208 | 0.2 % | 0.441 | 0.376 |
    | El20-M | 0.875 | yes | 0.998 | 0.982 | 1.250 | 0.9 % | 0.449 | −0.008 |
    | Ed2 | 0.875 | yes | 0.998 | 0.982 | 1.251 | 0.9 % | 0.450 | 0.003 |
    | Ed5 | 0.875 | yes | 0.999 | 0.983 | 1.250 | 0.9 % | 0.451 | −0.004 |
    | Ed20 | 0.875 | yes | 0.998 | 0.982 | 1.250 | 0.9 % | 0.449 | −0.006 |
    | Ew5 | 0.375 | yes | 1.003 | 1.001 | 1.152 | 0.4 % | 0.376 | 0.008 |
    | Es | 3 | yes | 0.523 | 0.327 | 3.833 | 94.3 % | 0.404 | 0.285 |

    (SD log g and the autocorrelation are of the applied multiplier; the clipped share is the same in both records.)
  - **Reading:**
    - **Es is clipped almost all the time.** At A = 3 the unclipped multiplier exp(Aβz − (Aβ)²/2) has a log-SD of
      about 3 where β ≈ 1, so most samples fall below the clamp at 0.25 and a few exceed 4. Applied, Es is close to a
      two-level switch: mostly g = 0.25 (walk-on × 0.25, stop × 4), with brief bursts at 4, mean 0.33 and E[1/g] 3.8.
      Its D_w calibration (D173) was reached in this regime. P46's statement holds as worded: mean 1 only at a fixed
      position before clipping; neither the clipped nor the trajectory multiplier averages 1 (0.33 and 0.52).
    - The calibrated T members are clipped about 10 % of the time, with applied means ≈ 0.8. The ineligible T10f and
      T10m (D173) were near saturation (≈ 80 %).
    - The other D members stay near E[g] = 1 with < 1 % clipped. El20-M, Ed2, Ed5 and Ed20 give nearly identical
      multiplier statistics, as their calibration curves did (D173).
  - **What it bears on (no rule changes):** Stage 2b's mean moving fraction (> 20 % flag) and the reading of Es in
    Stage 2b and the capability test. Es enters both as calibrated and frozen (D158, D159). A family-level statement
    about "a shared signal with spatially varying response" carries this disclosure: at its calibrated strength Es is
    dominated by clipping.
  - **Process note (lead's slip, disclosed):** while looking for the Stage 2a files, the lead listed `logs/partd2/`
    (`ls | head -30`), which printed the names of 15 per-run log files under the sealed prefix for Stage 2b's run
    logs (P64; D179). Names only: no content, sizes or times were shown. They name runs the design already lists.
    Nothing else under a sealed prefix was opened.
