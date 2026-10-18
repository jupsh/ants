---
id: D047
date: 2026-10-18
time: 03:49
kind: decision
title: User: option 1, more seeds for the persistence gates (no setting change). Pre-registered before running
---
- **2026-10-18 ≈ 03:49 UTC — User: option 1, more seeds for the persistence gates (no setting change).
  Pre-registered before running.**
  - **Window gate:** the same command at `--reps 28` (616 runs; 7 × the 88). Reps 0–3 are the earlier seeds, so the
    runs are a superset of the first gate.
  - **dt gate, activity rows:** the same command at `--reps 24` (528 paired runs; 4 × the 132). Reps 0–5 are the
    earlier seeds.
  - **Rule unchanged:** per row, the 90 % bootstrap CI of the paired difference inside ±0.5 SE_data; units are the
    runs, colony-set aggregation and the missing-value rule as at 02:05.
  - **Verdicts:** these runs decide the two persistence rows in each gate. The spread rows' earlier passes stand;
    their new values are reported beside. The window gate's motion rows come from the same runs and are reported
    beside (they passed at 4 seeds).
  - **No automatic escalation.** If a persistence row still fails, its effect size and CI go to the user:
    - forager persistence on width in the dt gate is expected to need ≈ 15 × (02:05 power note);
    - a nurse dt shift whose CI excludes 0 would point to option 2 (finer dt), the user's call.
  - Estimated ≈ 3 h on the box (window ≈ 1.5 h, dt ≈ 1.6 h, run one after the other with all 62 workers).
  Launched ≈ 03:49 as `run.sh` run `c2gates2-20261018T034927Z` (`scripts/scratch/box/run-c2gates2.sh`); box idle at launch, code unchanged since the first gates.
