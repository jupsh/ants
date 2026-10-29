---
id: D164
date: 2026-10-25
time: 18:22
kind: run
title: Part D Stage 1 built (D158 as amended by D159; T033): mapping M, driverWave (uniform and perimeter origins), Es with its floor-normalised map, the before/after-clipping record (P21), oracle specs for the 11 members, the Stage 2a/2b driver; reapplied after the Q03 recheck ended; 13 Part D tests pass, base and every Part C kind bit-identical to HEAD; calibration smoke at toy size only
---
- **2026-10-25 ≈ 18:22 UTC — Part D Stage 1 built (D158 as amended by D159; T033): mapping M, driverWave (uniform and perimeter origins), Es with its floor-normalised map, the before/after-clipping record (P21), oracle specs for the 11 members, the Stage 2a/2b driver; reapplied after the Q03 recheck ended; 13 Part D tests pass, base and every Part C kind bit-identical to HEAD; calibration smoke at toy size only.**
  - **What was built** (uncommitted; the lead's previous session wrote it from ≈ 17:00 UTC and set it aside during the
    recheck, D162 process note):
    - `src/sim/experiments/colonyBles.ts`: mapping M, under which `relay` is `local`; `driverWave` with uniform and
      perimeter origins; Es, with its map normalised over the nest floor (P46); g before and after clipping, and 1 / g,
      summed at the oracle trace's samples (P21).
    - `src/sim/experiments/colonyStroeymeyt.ts`: `StroeymeytRun.oracleG` returns that record. The file is the frozen
      D162 version plus these two additions only.
    - `scripts/s2018Lib.ts`: `--oracle` specs for all 11 members; `--snap` and `oracleG` in the short-run script.
    - `scripts/scratch/partD2.ts` (local): the Stage 2a calibration and 2b run driver. `test/partD.test.ts`: 13 tests
      (strength-0 and limiting-case identities, front timing, E[g | x] = 1 by Monte Carlo for both origin kinds and
      for Es).
  - **Reapplied** at ≈ 18:15 UTC, after the recheck run had ended (18:08) and its reading was taken (D163), so no
    frozen file changed while a recheck run was live after the restore.
  - **Checks:**
    - `test/partD.test.ts`: 13 of 13 pass. Full fast suite: 274 of 275 pass. The failure is `records.test.ts`: the
      findings check reports 12 stamped results stale (simHash `27482bdb…` → `ecce22a6…`), which any change under
      `src/sim` causes, including D162's switch alone. They are re-stamped only where outputs are unchanged, with the
      commit (as D120).
    - `tsc`: one error, an unused variable in the local `scripts/scratch/s2AuditSyn.ts` (last changed 2026-10-24); none
      in the Stage 1 files.
    - Bit-identity: `tmpBitId2.ts` (short C2 runs on colony 0, seed 5: base and the seven Part C kinds, rows and oracle
      traces) gives the same eight hashes as HEAD. Rerun by this session; it matches the previous session's check.
  - **Smoke** (`partD2.ts calib --smoke`, `logs/partd2-smoke`, 5 min 41 s): the calibration chain ran end to end for
    all 11 members (2 colonies, 2 grid points plus refinement, 30 + 30 min window), writing `calib-<member>.json`.
    Its values are toy-size ~~and meaningless~~ **(2026-10-26, D165 item 1: debugging outputs with no inferential
    standing; "meaningless" was too strong, since seen values can still influence later choices)**. They were seen;
    they are not a calibration result and select nothing.
    The `assess` stage was not smoked.
  - **md5 at this entry:** `colonyBles.ts` `8b77cc4e…`, `colonyStroeymeyt.ts` `124221d9…`, `s2018Lib.ts` `295716dd…`,
    `partD2.ts` `7564aae4…`, `partD.test.ts` `2cc1d4d5…`.
  - **Next (T033):** freeze the settings of the bounded timing benchmark (P50) before any rental request; P29's 2-D rule
    and the precision forecast are logged before Stage 2b runs (D158).
- **2026-10-25 ≈ 18:23 UTC — Process note (lead's lapse, disclosed): the smoke and P28.** P28 (D126) says "Unattainable rows
  are listed before any Part D model run", and that list has not been drawn up. The calibration smoke above simulated
  all 11 Part D members (toy size: 2 colonies, 30 + 30 min). The lead ran it as the previous session's plan for Stage 1
  checks and did not review P28 first.
  - **What was seen:** only the printed calibration lines: per member, D_w at 1 min for each grid point, the selected
    strength, a verified D_w and calibrated or miss. D_w at 1 min is the calibration target (magnitude), the only
    statistic the calibration stage reads. The per-run files `tmpShortSim.ts` wrote under `logs/` may hold other
    synchrony statistics; they were not opened. The `assess` flags (S2 series, S5, snapshots) were not used.
  - **Whether a toy smoke counts as a "Part D model run" under P28 is the user's to say** (Q18). Until then no further
    Part D member is simulated, smoke or otherwise, and the unattainable-row list is drawn up before Stage 2a.
  - **2026-10-26, answered (D165):** the smoke counts as a Part D model run. P28's "before any Part D model run" was
    unreconciled with D158's "before Stage 2b" (approved, D159); per the user this is recorded as an unreconciled
    commitment summary, not an unambiguous breach. From here on the precision forecast comes before any further Part D
    member simulation, smoke and timing benchmark included (P56).
