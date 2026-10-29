---
id: D168
date: 2026-10-26
time: 01:29
kind: design
title: Part D bounded timing bench frozen before it runs (P50; D165 item 4; D158 cost): 55 local runs at 4 jobs, timed only: the standard run, base on all 22 colonies, the 11 members and 2 controls on colonies 1 and 3 at strength 2, Stage 2b output flags on three arms; fresh probe seeds; outputs deleted unread; the estimate rule fixed here
---
- **2026-10-26 ≈ 01:29 UTC — Part D bounded timing bench frozen before it runs (P50; D165 item 4; D158 cost): 55 local runs at 4 jobs, timed only: the standard run, base on all 22 colonies, the 11 members and 2 controls on colonies 1 and 3 at strength 2, Stage 2b output flags on three arms; fresh probe seeds; outputs deleted unread; the estimate rule fixed here.**
  - **Why now:** D165 item 4: after the precision forecast (D166, D167; P56 fulfilled), freeze and run the bounded
    timing bench under P50, then bring the measured runtime, resource assumptions and cost before any rental. D158's
    ≈ 21–25 h, ≈ $9–11 is a planning estimate only (D159 item 6).
  - **What runs** (`scripts/scratch/partDBench.ts`, md5 `bcf855f5…`; `--dry` lists the jobs): `tmpShortSim.ts` runs with
    exactly partD2.ts's arguments (C2 fit, `--trips --lite --noActivity`, 2-h warm-up + 4 h light, `--oracle <spec>
    --oracleTrace` for members), **4 at a time on the laptop**, 55 runs:
    1. the **standard run** (base, colony 1, seed 4242, as `box.mjs bench`; 132 s on the reference box), to convert
       local seconds into reference seconds;
    2. **base on all 22 colonies** (Stage 2a output flags), for the spread of run time over colony size;
    3. the **11 members and the 2 controls on colonies 1 (81 ants) and 3 (193 ants, the largest)**, Stage 2a flags;
       every member at **strength 2** (inside D158's grid, fixed here; no calibrated or smoke-selected value exists or is
       used, P57); the controls at their D121 strengths;
    4. **Stage 2b flags** (`--ydist --s5 --snap`) on base, T10f and Es, colonies 1 and 3.
    - Seeds: `seedFor(2018, 'probe', 0xc4bf, job index)` (the standard run 4242): none of Stage 2's `diag` 0xc4b0 or
      `judge` 0xc4b1 / 0xc4b2 streams.
    - Code at this entry: `colonyBles.ts` `8b77cc4e…`, `colonyStroeymeyt.ts` `124221d9…`, `s2018Lib.ts` `295716dd…`
      (D164's), `tmpShortSim.ts` `6c85d31c…`.
  - **What is read: wall-clock seconds and exit codes only** (`logs/partd2-bench/times.json`). Each run's output JSON is
    deleted as soon as it ends, unread; stdout is discarded; stderr is kept for failures. The output path is sealed
    while the bench runs.
  - **Estimate rule, fixed here:**
    - local speed s = 132 / t(standard); reference seconds of a run = local seconds × s;
    - colony factor: mean over the 22 base runs ÷ the base run on colony 1 (calib flags);
    - arm factor a: per member or control, the mean over colonies 1 and 3 of t(arm, c) / t(base, c) (calib flags);
      assessment factor b: the same ratio for 2b flags over calib flags, base, T10f and Es pooled;
    - runs (D158): Stage 2a 264 per member (grid 7 + refinement 3, × 22 × 1, plus verification 2 × 22) = 2,904; Stage 2b
      (11 members + 2 controls + base) × 44 = 616; 3,520 in all. Every member counted as calibrated (the pessimistic
      side);
    - reference seconds = Σ runs × t_ref(base, colony 1) × colony factor × arm factor (× b in 2b); passed to `box.mjs
      offers` as `--runs 3520 --run-s <mean reference seconds per run>`, which adds its set-up and tail;
    - the S2-J J draws run locally after the box (≈ 5 min per 150 files, D156), outside the box estimate.
  - **Limits, reported with the estimate:** one strength (run time may depend on strength through activity); two colony
    sizes for the members; laptop timing at 4 jobs may differ from a box at full load (the box's own pace is checked
    against its stop rule, docs/BOX.md); the laptop is otherwise in use.
  - **Gate:** `plied review T033 --action run:partd-bench-20261026 --gate`, then `run.sh start partd-bench --node T033`.
  - **2026-10-26 ≈ 01:31 UTC, launched:** gate passed for `run:partd-bench-20261026` on T033 (dispositions recorded,
    P50 acting); run `partd-bench-20261026-20261026T013134Z`. A first `run.sh start partd-bench` was refused by the gate
    (the action name differed) and started nothing.
