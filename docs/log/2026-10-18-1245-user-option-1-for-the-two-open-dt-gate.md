---
id: D053
date: 2026-10-18
time: 12:45
kind: decision
title: User: option 1 for the two open dt-gate rows (one more seed batch, the last). Pre-registered before running
---
- **2026-10-18 ≈ 12:45 UTC — User: option 1 for the two open dt-gate rows (one more seed batch, the last).
  Pre-registered before running.**
  - **Seeds doubled, only new seeds simulated:** new `--repFrom r --merge f` in `checkS2018Window.ts` dt mode
    simulates reps r..REPS−1 and takes reps 0..r−1 from the earlier file; rep r is recomputed and must equal the
    earlier file bit for bit (else the run stops). Local smoke test: a merged 3-rep run equals a full 3-rep run
    exactly.
    - **Motion:** the 03:47 command (`--dts 0.05,0.025 --obs 3600`, warm-up 1200) at `--reps 72 --repFrom 35
      --merge logs/checkS2018-dt-c2-c2-motion.json` (reps 0–35 earlier, 36–71 new).
    - **Activity:** the 03:49 command at `--reps 48 --repFrom 23 --merge
      logs/checkS2018-dt-c2-c2-activity-r24.json` (reps 0–23 earlier, 24–47 new).
  - **Verdicts:** these runs decide `runStill.P10.forager` (motion) and `persist.forager` (activity), by the
    unchanged rule (90 % bootstrap CI of the paired difference inside ±0.5 SE_data; units the runs). The other rows'
    earlier passes stand; their new values are reported beside.
  - **This is the last batch.** A row that still fails goes to the user as a precision limit, with its effect size
    and CI, never as a reason to change settings; no further seeds without the user.
  - **Code:** the 04:09 speed-up (bit-identical) is deployed with this run; the overlapping rep checks it on the box.
    Estimated ≈ 2.1 h (motion ≈ 0.5 h, activity ≈ 1.6 h).
  Launched ≈ 12:46 as `run.sh` run `c2gates3-20261018T124606Z` (`scripts/scratch/box/run-c2gates3.sh`); box idle
  at launch; all simulation code, scripts, references, tracker and trip files checksum-identical to the local tree
  (copied: the speed-up's `lasiusNestWorker.ts`, `contactPairs.ts`, the gate script, `lib.ts`'s `runProgress`).
