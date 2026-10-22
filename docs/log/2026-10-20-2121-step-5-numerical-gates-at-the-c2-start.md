---
id: D098
date: 2026-10-20
time: 21:21
kind: design
title: Step-5 numerical gates at the C2 start points (D094, user go): warm-up then dt, equivalence rule unchanged; order and branching fixed before launch
---
- **2026-10-20 ≈ 21:21 UTC — Step-5 numerical gates at the C2 start points (D094, user go): warm-up then dt, equivalence rule unchanged; order and branching fixed before launch.**
  - **User:** "Go for it" (after D097).
  - **Rule** (Rules in force, "Equivalence gate", unchanged): per fit row, Δ = (mean at the level in use − mean at the
    reference) / SE_data. 90 % bootstrap CI (recruiters resampled jointly over rows and levels); pass if every row's CI
    lies inside ±0.5. Independent design, 1600 recruiters per day per level, paired seeds.
  - **Where:** C2's two step-5 start points (`m1999Points('c2')`: C2 with the role mix, density 3 / 2.3, B3).
  - **Order and branching (fixed now; the box script applies them mechanically):**
    1. **Warm-up gate** at dt 0.05: 900 vs 7200 s. If it fails, 1800 vs 7200, then 3600 vs 7200. The shortest that
       passes is adopted; if none passes, 7200 s.
    2. **dt gate** at the adopted warm-up: 0.05 vs 0.025.

    If the dt gate fails, it goes to the user before anything else runs (the rule says a failing knob is changed and
    its comparison rerun before refitting; the next dt is the user's call).
  - **Code:** `convergeM1999.ts` gains `--dt` (a warm-up comparison's dt, default 0.1), `--warmup` (a dt comparison's
    warm-up, default 300) and `--lazy` (B014, bit-identical). With the defaults, earlier gates are reproduced unchanged.
  - **Disclosed:** the local smoke test (n 8, warm-up 300 vs 600 s, not gate levels) printed the gate's built-in no-bout
    fractions at the two C2 start points. Day 1: 100 % / 100 % (start 1), 100 % / 87.5 % (start 2). Days 4 and 8: 0 %.
    These are model outputs at unfitted points, on n = 8; no data were seen. They bear on the adoption rule's no-bout
    bound (≈ 11 % per day): a day-1 recruiter without a bout would fail it. To be read only from the full runs.
  - **Budget:** ≈ 25 min per warm-up comparison (independent design, 1600 × 3 days × 2 points per level). Worst case,
    with all three warm-up comparisons failing and the dt gate at 7200 s, ≈ 2.5 h on the box.
- 2026-10-20 ≈ 21:22 UTC: launched, `run.sh` run `step5gate-20261020T212207Z` (box, 62 workers; script `scripts/scratch/box/run-step5gate.sh`, md5 of inputs printed first; box md5-equal to the local tree for every input and all of `src/sim`).
