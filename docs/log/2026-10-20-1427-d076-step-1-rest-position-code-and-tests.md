---
id: D078
date: 2026-10-20
time: 14:27
kind: run
title: D076 step 1: rest-position code and tests built; simHash moved by an observation-only change, 8 backlog results re-stamped with a trail
---
- **2026-10-20 ≈ 14:27 UTC — D076 step 1: rest-position code and tests built; simHash moved by an observation-only change, 8 backlog results re-stamped with a trail.**
  - **Code** (D076's definitions; existing rows untouched):
    - `src/sim/analysis/activity.ts`: `ActivityStats(…, recordRest = false)` records each observed still in-nest step's
      1-mm cell by hour (`restOut()`, `restCell`, grid 72 × 48 mm as B018). Off by default.
    - `src/sim/analysis/restPosition.ts` (new): site field E (`SiteField`: 5 × 5-mm box sum over its nest-rectangle
      mean, focal ant left out), `DATA_NEST` (B018's rectangle) and `MODEL_NEST` (0–70 × 0–40 mm), rest position
      (weighted median of E over still steps, ≥ 600 still step-frames), `restWindow` (zFull, zPart, zE),
      `restColony`, `shareSpatial`.
    - `colonyStroeymeyt.ts`: `StroeymeytRunOptions.restMaps` returns `restWindows` (per activity window, per group,
      per ant: hourly counts and window still cells); the `s2018Colony` pool task passes it through.
  - **Implementation detail D076 left open, fixed here before any statistic is computed:** a colony's zFull and zPart
    pool only the windows where both are defined, so S is paired within the colony (zPart is undefined only when R
    or a half has no rank variance after the rank adjustment). Counts of windows and ants are reported.
  - **Tests:** `test/restPosition.test.ts` (8: partial Spearman against the closed form, weighted median, field leave-
    one-out and normalisation, the 600-frame rule, window eligibility and dropped-ant counts, colony weights and S,
    the recorder off by default with unchanged counts); `test/slow/restMaps.test.ts` (2: `restMaps` on vs off gives
    identical rows and activity rows; maps inside the model nest). `npm test` 202 / 202 after the re-stamp below; `tsc` clean.
  - **Old vs new code:** one Stroeymeyt colony (12 nurses, 5 foragers, seed 3, 6 h, dt 0.1, activity window) run in a
    worktree at HEAD (`f0a05a0`) and in the current tree: identical JSON (rows, activity rows, foragers-in share).
  - **simHash** `baf4cb0b4b513531` → `88f9271e1dc0755a` (src/sim changed). The 8 stamped backlog results (11
    finding links: F058–F066) went stale on the hash alone. They were re-stamped, each keeping the old hash and this
    reason under `provenance.restamped`. B018 / B019 import none of the changed files; B001 / B013 / B014 reach them
    only through the Stroeymeyt runner and the pool task table, unchanged with `restMaps` off.
