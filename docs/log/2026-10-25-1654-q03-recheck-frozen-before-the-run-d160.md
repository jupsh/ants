---
id: D162
date: 2026-10-25
time: 16:54
kind: design
title: Q03 recheck frozen before the run (D160 as amended by D161): the original-start switch (bit-identical when off, tested), runner and reader by md5, the colony-to-seed mapping; row definitions made exact; smoke chain at toy size only; local run through run.sh on T015
---
- **2026-10-25 ≈ 16:54 UTC — Q03 recheck frozen before the run (D160 as amended by D161): the original-start switch (bit-identical when off, tested), runner and reader by md5, the colony-to-seed mapping; row definitions made exact; smoke chain at toy size only; local run through run.sh on T015.**
  - **The design is D160 as amended by D161.** This entry fixes the code and the details D160 left to the build. Nothing
    has been run at the frozen settings.
  - **Switch** (`src/sim/experiments/colonyStroeymeyt.ts`): `StroeymeytRunOptions.waterStart: 'original'` starts every
    ant at body water U(thirst, 1) with an empty crop (`STROEYMEYT_WATER_INIT_ORIGINAL`). It is off by default. The
    colony options moved unchanged into `stroeymeytColonyOptions`, which `simulateStroeymeyt` and the runner share.
    - Bit-identical when off: a short C2 run (colony index 3, seed 99, 600 + 900 s) gives rows md5
      `585dce958a8b0f5e02d79edd527803ff` before and after the change. Tests in `test/stroeymeytSim.test.ts` cover the
      default (production start, same rows) and the original start (body water in [thirst, 1], crops empty).
  - **Settings:** C2's fit (`s2018Params(free, outRate, 'C2')`), trip inputs `data/fits/s2018-trips.json`, light phase
    (26 °C), dt 0.05 s, the experiment's sources, no mechanism, no lazy resting. The production options are used with
    warm-up 7200 s + 64,800 s, so each run lasts 20 h from t = 0. The tracker observer is not run: the rows are true
    state. Its streams are separate, so it would not change the dynamics.
  - **Seeds:** `logs/q03/seeds.json`, colony = index in the fit data, seed = `RNG.stream(0xc4c3, colony).int(2 ** 31)`.
    The runner refuses a seed that differs from the rule. The 143-ant colony is index 6 (`colony201`, 101 + 42); the
    largest is index 3 (`colony122`, 102 + 49).
  - **Row definitions, made exact.** True state is sampled every 10 s of simulated time; hour h holds the samples at
    t ∈ (h, h + 1] h. A window [a, b) h pools hours a … b − 1.
    1. Nurse mean body water: Σ water / waterMax over samples and alive nurses ÷ Σ alive nurses.
    2. Bouts to nurses per hour: closed bouts with a nurse receiver whose start lies in the window, ÷ window hours.
       tmpDrift.ts counted them at recording; a bout still open at 20 h is not counted.
    3. Largest resting-cluster share: the mean over samples of largest cluster ÷ max(1, resting in-nest ants). Clusters
       are single-linkage at centre distance < 5 mm. The share is 0 in a sample with no resting ant; such samples are
       counted (`noRest`) and reported.
    4. Nurse active fraction: Σ in-nest alive nurses with mode ≠ rest ÷ Σ in-nest alive nurses. The per-mode counts are
       kept for description.
    5. Forager outside share: Σ alive foragers outside the nest ÷ Σ alive foragers.
  - **Reader** (D161 items 3–4): the primary window is 14–20 h, original − revised, paired by colony.
    - Bootstrap: 2,000 colony resamples from `RNG.stream(0x5ea0, 30)`. One set of resampled colonies serves all rows,
      and both starts of a colony stay together. The 90 % interval runs from the 5th to the 95th percentile, linear
      between order statistics.
    - Effects: rows 1, 3 and 5 use the mean difference. Rows 2 and 4 use (mean original − mean revised) / mean
      revised, with both means recomputed in every resample.
    - Classes: equivalent, outside or unresolved, as D161 item 4.
    - Missing: a colony value that is not finite, or a missing run, makes the row "missing". So does an undefined
      relative effect (mean revised 0 in the point estimate or in any resample). A missing row prevents a pass.
    - The verdict passes only if all five rows are equivalent. Otherwise it names the rows and "returns for a decision"
      (P53).
    - Descriptive: the same comparison in 2–6 h (stream 32). Per start, the early-to-late difference, 2–6 h − 14–20 h
      (streams 31 and 33), and the drift within 2–6 h, 4–6 h − 2–4 h (streams 34 and 35), each as colony means with 90 %
      intervals. Also the per-colony 14–20 h differences by colony size, hourly colony means per start, and whether
      every ant is alive at 20 h.
  - **Frozen** (`scripts/scratch/` is local; `logs/` is not committed):

    | File | Role | md5 |
    |---|---|---|
    | `scripts/scratch/q03Recheck.ts` | runner: seeds, one run, all runs | `84c25636c509d9e9f5618e1512b99614` |
    | `scripts/scratch/q03Read.ts` | reader | `e450374959b3010f59a5b5014a005044` |
    | `logs/q03/seeds.json` | colony-to-seed mapping | `7e07d8c089b632579a84b97977f2a73d` |
    | `src/sim/experiments/colonyStroeymeyt.ts` | the switch (working tree, not yet committed) | `b89e71a44af9b192d7a0dc5624c9424d` |
    | `data/fits/s2018-motion-c2.json` | C2 fit | `bccbe886208e5804b716d7fae364a77d` |
    | `data/fits/s2018-trips.json` | trip inputs | `6ea0f3adf62ae529624dc83be704b264` |

  - **Smoke** (`--smoke`, `logs/q03-smoke`): 2 colonies, 0.5 h from t = 0, all windows set to that half hour. The chain
    ran end to end: seeds, 4 runs, reader, every descriptive block written. Those values cover the first half hour of
    two colonies, inside the transient, not the frozen windows. They are not a result, and they were seen.
  - **Compute:** the smoke ran 6–11 s per simulated half hour for 40–67 ants. So 20 h is ≈ 4–7 min for small colonies
    and more for the largest. Estimate for the 44 runs on 15 local cores: under 1 h, well under D160's 3–5 h (that
    figure included the tracker and Part C's statistics).
  - **Run:** `plied review T015 T033 --action run:q03-recheck-20261025 --gate`, then `run.sh start q03-recheck --node
    T015 -- npx vite-node scripts/scratch/q03Recheck.ts all --jobs 15`, then the reader. While it runs, only whether
    the output files exist is checked.
- **2026-10-25 ≈ 17:11 UTC — Process note (lead's lapse, disclosed; no run affected).** The run started at 16:55:12 UTC
  (`q03-recheck-20261025-20261025T165512Z`); its first 15 runs started at 16:55:16. From ≈ 17:00 the lead built Stage 1
  (T033) in `colonyBles.ts`, `colonyStroeymeyt.ts` and `s2018Lib.ts`. So for ≈ 10 min the working tree differed from
  the frozen versions; for about a minute (≈ 17:08) a `git stash` held both simulation files at HEAD for a bit-identity
  check.
  - **No run started in that window.** All 15 run logs carry the start time 16:55:16, and no run had finished, so no
    process loaded the edited files.
  - **Restored at 17:10:40 UTC:** `colonyStroeymeyt.ts` is back to the frozen md5 `b89e71a44af9b192d7a0dc5624c9424d`.
    `colonyBles.ts` and `s2018Lib.ts` are back to HEAD (`5b88c6fb…`, `ecc7f496…`), the versions in place at the freeze.
    The Stage 1 edits are set aside and are reapplied only after the last of the 44 runs has started.
  - The edits would not have changed a base run in any case: the eight-arm check showed base and every Part C kind
    bit-identical to HEAD. The restore keeps the frozen code exact, not only equivalent.
