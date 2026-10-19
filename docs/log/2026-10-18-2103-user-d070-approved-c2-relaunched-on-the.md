---
id: D071
date: 2026-10-18
time: 21:03
kind: decision
title: User: D070 approved; C2 relaunched on the box
---
- **2026-10-18 ≈ 21:03 UTC — User: D070 approved; C2 relaunched on the box.**
  - D070 approved as written (user: "That looks good").
  - Box sync: `scripts/fitS2018.ts`, `scripts/s2018Lib.ts`, `test/s2018Probe.test.ts` and
    `scripts/scratch/box/run-c2fit.sh` copied; then 239 local files (`src/`, `scripts/*.ts`, `test/`,
    `data/fits`, `data/reference`, `data/stroeymeyt2018`, package files) checked by SHA-256 against the box
    worktree. All simulation, fit, script and data files match; the only differences are outside the fit (package
    files: `sift`, `tesseract.js` for the record and OCR tools; `src/main.ts`, the UI; the paper and record
    scripts and test, absent on the box). `test/s2018Probe.test.ts` and `test/cmaes.test.ts` pass on the box
    (11 / 11). Local: `npm test` 194 / 194, `tsc` clean.
  - Old run's `logs/fitS2018-c2.ckpt.json` and `logs/c2/fit.log` moved unread to `logs/c2/aborted-20261018/`;
    no `data/fits/s2018-motion-c2.json` existed. Box otherwise idle.
  - Launched: `run.sh` run `c2fit-20261018T210632Z` (`scripts/scratch/box/run-c2fit.sh`), 62 workers. ≈ 28 h
    projected (D044), so until about 2026-10-20 01:00 UTC; less if a switch fires.
  - Monitoring as D055 plus the D068 blind health check (counts only). `run.sh` reports the run as `quiet`
    because the wrapper's log stays silent (the fit writes `logs/c2/fit.log`); read the D068 counts instead.
  - Pending: the D070 reproduction check (largest raw probe SD per phase-1 start vs 0.068 / 0.039, nothing else).
- 2026-10-18 ≈ 22:03 UTC (time from the check's `date -u`), D070 reproduction check read: largest raw probe SD
  start 0 = 0.068, start 1 = 0.039, equal to D069 at 3 decimals. Passes: nothing but the probe scale changed.
  Read only those two numbers (the scaled SDs and everything else on the lines were filtered out on the box).
