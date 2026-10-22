---
id: D085
date: 2026-10-20
time: 16:30
kind: run
title: D083 Part B built (recorder, decomposition, data side) with the observer and reconstruction checks; Part A reader; simHash moved again, stamps re-stamped with a trail
---
- **2026-10-20 ≈ 16:30 UTC — D083 Part B built (recorder, decomposition, data side) with the observer and reconstruction checks; Part A reader; simHash moved again, stamps re-stamped with a trail.**
  - **Recorder** `src/sim/analysis/neighbourRates.ts` (`NeighbourStats`; same frame interface as `ActivityStats`):
    - steps as D043; neighbours = other detected ants (workers, the queen) whose step ending at that frame is still,
      within 4.1 mm;
    - stop / leave hazards: exposure = frames to the next chained step, binned by N (A = 1 + N) at the interval's
      start (as B018), event = that step's class;
    - rest episodes: bounded start (a still step after a moving one), binned by A at the first still step's end,
      censored at chain breaks and the window end. Event and censoring counts are kept by duration to 60 s for
      Kaplan–Meier.
  - **Implementation details, fixed here before any output:**
    - *Cell tables:* the per-cell stop / leave tables use **2-mm cells** (D083 said 1 mm), with E per cell = the mean
      of its four 1-mm cells, so 242 runs' tables stay ≈ 50 MB. E is a 5 × 5-mm smoothed field, so little is lost.
    - *Data-side E:* E from the other phase pooled over ants, so a focal ant's own other-phase rests are not left out.
      The model's E comes from other runs only. Disclosed; the E tables are descriptive.
    - *Runner:* `StroeymeytRunOptions.neighbourStats` returns `nbTables`, passed through the `s2018Colony` pool task.
      Off by default.
  - **Decomposition** `scripts/nbDecomp.ts`, amendment 1 exactly:
    - weights: still exposure (leave), moving exposure (stop), episode starts (survival);
    - the survival quantity is the episode-weighted mixture of conditional Kaplan–Meier estimates;
    - symmetric C / W;
    - support rule (unestimable bins named; > 5 % of draws without support → unestimable);
    - paired bootstrap (data colonies × model runs within colonies, 2000);
    - readings in the amended order.
  - **Checks** (`test/neighbourRates.test.ts`, 12):
    - *observer:* synthetic tracks with known per-frame leave and stop probabilities, isolated and beside two still
      anchors, with detection gaps. The hazards are recovered at A = 1 / 3 and N = 0 / 2, and geometric survival is
      recovered per A bin; nothing counts outside the active window;
    - *reconstruction:* composition-only (W = 0), within-only (C = 0), C + W = gap, missing support → unestimable,
      dominance readings, cancellation → "counteracting", an unresolved gap → "no resolved aggregate gap", > 5 %
      unsupported draws → unestimable, the survival mixture identity;
    - *runner:* `test/slow/restMaps.test.ts` (6): `neighbourStats` on vs off gives identical rows.

    Current code vs a HEAD worktree (`f0a05a0`) on one colony run: identical JSON. `npm test` 214 / 214, `tsc` clean.
  - **simHash** `88f9271e…` → `286c87ca…`. 9 stamped files (12 finding links) were re-stamped with a second trail entry
    (`provenance.restamped`), as D078. No stamped result imports the new module.
  - **Data side computed** (`scripts/stroeymeytNeighbourRates.ts`, 22 fit colonies, PreTreatment, development use as
    B018; ≈ 12 min locally) → `data/reference/stroeymeyt2018-neighbour-rates.json` (2.6 MB, stamped). Cross-check
    against B018, both phases pooled: worker leaving 0.0639 /s at A = 1 and 0.0057 at A = 8 (B018 0.064 / 0.0057);
    stop hazard 0.53 → 1.31 /s (nurses) and 0.43 → 1.17 (foragers) over N 0 → 6+ (B018 workers 0.46 → 1.25).
  - **Part A reader** `scripts/readDiagRound.ts`, the amended readings coded mechanically, with the operational
    choices fixed now:
    - shift = paired per-run difference over the target's colony-set runs (as `reportS2018`'s trade), SE = SD / √n,
      90 % interval;
    - per phase = shift / that phase's SE_data (one model prediction serves both phases);
    - toward / away = sign of the shift against sign(data − control) in that phase;
    - persistence overshoot = arm above the data with combinedZ > 2;
    - persistence away = away and |shift| > 2 SE_data.

    Dry runs on already-read files: zero shifts give no readings; a synthetic top-20 % gain and tail drop give
    "responds" and "reduces the tails". Nothing from the diagnostic round has been run or seen.
