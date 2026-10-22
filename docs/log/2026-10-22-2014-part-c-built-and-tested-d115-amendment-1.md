---
id: D118
date: 2026-10-22
time: 20:14
kind: run
title: Part C built and tested (D115 amendment 1, D117); build notes fixed before any run; S5 as fixed (10 mm) found unestimable on simulated colonies, amendment 2 proposed (4.1 mm) for the user
---
- **2026-10-22 ≈ 20:14 UTC — Part C built and tested (D115 amendment 1, D117); build notes fixed before any run; S5 as fixed (10 mm) found unestimable on simulated colonies, amendment 2 proposed (4.1 mm) for the user.**
  - **Built** (all off by default; diagnostics, never adoptable):
    - `ColonyOptions.oracle` kinds `coupledX`, `local`, `driverShared`, `driverLocal`, with `driverLocalTable`
      (`src/sim/experiments/colonyBles.ts`); `s2018Lib.ts` parses `coupledX:κ:τ_c`, `local:κ:r:τ_c`,
      `driverShared:A:τ`, `driverLocal:A:σ`;
    - the per-ant realised signal (`oracleTrace`) for every new kind;
    - `scripts/scratch/s5Stats.ts` (S5 / S6, one code path for data and model), with `tmpShortSim.ts --s5`;
    - `scripts/scratch/s5Data.ts`, the data side. It refuses to run without `--after-screen` and has not been run;
    - `scripts/scratch/partC.ts`: `calib`, `sep` and `read --stage screen|place`, plus a `--smoke` mode;
    - `spreadAgg.py --dump`: per-colony Test A values, NaN written as null.
  - **Checks:**
    - `test/oracle.test.ts` 20 / 20: strength 0 bit-identical for every kind; local r = ∞ equals `coupledX` (rows and
      realised signal); a vanishing range leaves rows unchanged with SD of log g 0 (isolated ⇒ g = 1 at once); the
      shared driver gives every in-nest ant the same g; `P.nest` restored; E_l's normalisation gives E[g | x] = 1 by
      Monte Carlo at three positions (within ±0.016);
    - `npm test` 258 / 258; tsc clean; 1999 identity hash `dddbafeb…` unchanged;
    - simHash `72e05b81…` → `f57a833f31cc3b4f`; the 9 stamped results re-stamped (`scratch/restampD118.ts`);
    - S5 self-check on synthetic frames (`scratch/s5Check.ts`, known truth): coupling only when crowded gives
      Δβ +1.73; none gives +0.01; a position-only driver gives −0.005. When an ant is isolated only in another
      (undriven) cell, the unmatched secondary is spuriously +1.60, while the position-matched primary is ≈ 0 for
      the undriven ants;
    - toy smoke of the whole chain (`partC.ts --smoke`: 2 colonies, 2 grid points, 30 + 30 min): every stage runs
      and `screen.json` holds all 20 statistics; S4 is missing in 2 arms and S5 in all at that size.
  - **Build notes, fixed before any run** (where amendment 1 was not specific):
    - outside the nest (or dead), an ant's P filter is reset like an isolated ant's, so no coupling carries over a
      trip;
    - **sufficiency is computed on the separation runs' outputs** (`judge` 0xc4a2, 2 per colony), which carry Y. The
      verification runs (0xc4a1) serve only the magnitude check;
    - S2 uses the all-pairs C (not by role pair); the data's Y files are as in D025;
    - **S3** is three statistics: ρ − null 1, ρ − null 2 (means over colonies), and the lag gradient (pooled mean lag at
      20–40 mm minus at < 5 mm, frames). Test A uses 1000 permutations, as before;
    - **S4** is the pre / post excess ratio, (contact − null hazard) at −4 … −2 over +1 … +4, pooled over colonies
      (Test B recheck);
    - S6 occupancy is the mean number of detected tracked in-nest ants per frame over 28 cm²;
    - every bootstrap draws colonies (2000); separation pairs use the same draw for both arms (common seeds); the
      sufficiency differences resample data and simulation independently.
  - **Property of S5, disclosed:** the slope of an ant's deviation on the colony deviation also depends on how much of a
    shared signal the colony deviation carries in its crowded vs isolated bins. In a synthetic case (ants alone at a
    driven cluster), this gave the primary −1.5 for those ants. The separation check on E_u and E_l measures how far
    the tested drivers produce such effects.
  - **Problem found (simulation only, before any box run): S5 as fixed is unestimable.**
    - On two simulated colonies (C2 base, 4-h window, colonies 4 and 10), bins with 0 neighbours within 10 mm are
      0.7 % (90 of ≈ 12 000), so no ant reaches 10 such bins in any cell, nor 20 overall.
    - At 3.5 ants / cm², a 10-mm disc holds about 11 others. The neighbour-count shares at bin starts (0 / 1 / 2 / ≥ 3)
      at other radii (`scratch/s5Coverage.ts`; simulations only, all bin starts) were:

      | radius | 0 | 1 | 2 | ≥ 3 |
      |---|---|---|---|---|
      | 3 mm | 39 % | 31 % | 17 % | 13 % |
      | 4.1 mm | 21 % | 26 % | 22 % | 32 % |
      | 5 mm | 13 % | 20 % | 20 % | 48 % |
      | 7.5 mm | 3 % | 8 % | 11 % | 78 % |
      | 10 mm | 0.8 % | 2.5 % | 4.6 % | 92 % |
    - **Proposed amendment 2 (for the user):** S5's radius **4.1 mm** (the contact threshold used by Test B and P4),
      strata unchanged (0 vs ≥ 3), everything else as fixed.
      - Disclosed: chosen from simulated coverage only, no data inspected. F078 says the data are more packed than the
        model, so data coverage may be lower, and S5 can still be unestimable there. That would be reported as such,
        with no further change.
  - **Seen early (disclosed):** the toy smoke's calibration lines (toy D_w per grid point, all "MISS" at that size)
    and the S5 coverage counts above. Simulation only; nothing of the data's S5 / S6.
  - **Next:** the user's decision on amendment 2, then the box (≈ 4 h: `partC.ts calib`, then `sep`, the Test A
    dump, `read --stage screen`).
  - **2026-10-22 ≈ 20:28 UTC — amendment 2 approved (D119)** with three qualifications; applied.
