# Project status

_Last updated: 2026-10-07 (session 1, after second external review). Keep this file current: update it whenever a step starts or finishes._

## ▶ RESUME HERE

**State in one paragraph.** Milestone M1 (*Lasius niger* as the single
reference species). The TypeScript simulation core compiles, runs and is
tested (`npm test`: 17 pass + 1 expected-fail). E1 (exploratory walking) is
fitted and partly validated. E2 (drinking and the trail-laying decision) is
fitted, and its withheld checks are partly passing; it now needs a mechanism
comparison rather than more parameters. For E6 (food sharing in the nest), the
data are imported and summarised and no model has been run against them yet.
Nothing is committed to git (all work is uncommitted on `main`); ask the user
before committing.

**Guiding principle (from review 2):** tighten the evidence before adding
biology. Keep asking *which observation could distinguish competing
explanations?* Don't add mechanisms (grooming, wall-following, …) until the
existing ones are shown to be identifiable and necessary.

### Next steps (in order)
1. **Fix the comparison statistics** (see Evidence policy § Criteria):
   - Use z = (sim − data) / √(SE_data² + SE_sim²), with SE_sim estimated
     from replicate simulation runs (different seed blocks).
   - Report spread (SD) separately from the mean.
   - Apply this to `src/sim/experiments/e2Targets.ts`, the E2 page and the
     E1 comparison. Small task; do it before any more fitting.
2. **E6 observation pipeline + TEC baseline.**
   - (a) A reusable simulated observer: scan every 60 s, record exchanges
     with mandible contact > 5 s, merge the same pair across consecutive
     scans. Reuse `src/sim/analysis/trophallaxis.ts` for the statistics.
   - (b) Implement Bles et al.'s non-spatial one-caste and two-castes (TEC)
     models with *their* published parameters, run through the same observer.
     They should reproduce their reported numbers (events ≈ 99, foragers
     ≈ 12.2), which checks the pipeline.
   - (c) This gives the encounter-based model a concrete baseline to beat.
     The TEC model is fitted to E6 data by its authors, so it is a
     reference, not a test of ours.
3. **Bounded E2 mechanism comparison** (before any new E2 mechanism):
   - **M_a (current):** individual desired volume plus a low-max stop
     hazard, never-layers fixed at 12 %, and an unsatisfied-lay probability.
   - **M_b (Mailleux et al.'s published rule):** per-second stopping
     probability logistic in η(V − Vc) with maximum 1, a population Vc, and
     90 % of ants that stop voluntarily lay trail.
   - **M_c:** M_a with the never-layer fraction free (prior 10–20 %),
     tested with and without the unsatisfied-lay probability.
   - **How:** same fit targets and same optimiser budget. Report the
     parameter count and the fit.
   - **Identifiability check for M_a:** profiles or correlations of
     desiredFed/Hungry, stopHazard, pipette accessibility and
     unsatisfiedLayProb, plus the `reserveDays` mapping.
   - **Then decide.** The between-drop timing failure may then be addressed
     (homing/edge behaviour), now explicitly as development evidence.
4. **E6 encounter-based model:**
   - Build the lab nest (56 × 41 × 2 mm chamber, 4 × 3 × 2 mm passage,
     61 × 49 mm area) with resting and active workers and trophallaxis on
     actual contact.
   - Calibrate in-nest parameters on Mailleux 1999 recruiter data only:
     stay 80–113 s, 3–6 contacts, 56–66 s total trophallaxis, P(leave)
     44–93 %.
   - Then test once on E6.
5. Backlog (below), sensitivity analysis.

### How to run
- The dev server is run by the user: `npx vite` → http://localhost:5173
  (pages: `#e1` walking, `#e2` recruit decision, `#status`). Don't start a
  second one.
- Tests: `npm test` (≈3–4 min; the E1 dt-convergence test is the slow one).
- Fits: `npx vite-node scripts/fitE1.ts` (~10 min) and
  `scripts/fitE2.ts` (~5 min). They write `data/fits/*.json`, which
  `src/sim/species/lasiusM1.ts` merges. Data summaries:
  `scripts/analyzeKhuong.ts` and `scripts/analyzeBles.ts`.

### Gotchas learned
- Never `pkill -f`/`pgrep -f` with a pattern that also appears in your own
  shell command: it kills the tool shell. Use
  `ps -eo pid,args | grep fitE2 | grep -v grep`, then `kill -9 <pids>`
  (vite-node ignores SIGTERM).
- Don't run two fits writing the same log or JSON. A non-monotone "best
  loss" in a Nelder–Mead log means two processes are running (fits are
  deterministic through common random numbers, `RNG.stream(seed, id)`).
- Vite dev serves `.gz` with `Content-Encoding: gzip`. Loaders check the
  gzip magic bytes before decompressing (`src/worker/e1Worker.ts`).
- Headless browser checks: scratchpad `pw/shot.mjs` and `pw/probe.mjs` use
  playwright-core with
  `~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`. Recreate
  them if the scratchpad is gone.
- Animation clocks must persist across frames. Advancing from the current
  frame's timestamp each tick froze the E2 playback at 60 fps; this is fixed.

---

## Evidence policy

### Roles of data
- **fit**: used to estimate parameters.
- **development**: inspected while choosing model *structure*. This is
  legitimate, but it is no longer an independent test.
- **held-out test**: never inspected against any model version before the
  final test of a milestone. When a held-out result motivates a change, it
  becomes *development* and must be logged below.

### Contamination log (which "withheld" results have been seen)
- **E1 (Khuong et al. 2013):**
  - The first fit's results at 20° and 45° were inspected before
    slope-dependent pausing, jitter and speed variability were added.
  - Those terms were fitted only on 30° and 60°, but 20° and 45° are now
    **development**, not held-out.
  - No fresh L. niger walking data are held out yet. Candidates: walking
    statistics in other published L. niger experiments (e.g. Czaczkes et
    al. 2011 speeds and straightness on trails), if the conditions match.
- **E2 (Mailleux et al. 2009):**
  - The drop-1 trail fraction was moved into the fit.
  - The second-drop intake and time, between-drop times, overall trail
    fraction and total time have been inspected. They will guide the next
    changes, so they are **development** from now on.
  - Fresh held-out candidates not yet used for anything: Beckers et al.
    1993 (1 M vs 0.1 M: 43 % more trail marks; collective choice);
    Detrain & Prieur 2014 (acceptance and intake vs concentration);
    Mailleux et al. 2000 volume series (needs the full text; only
    "90 % at ≥ 3 µL" is known numerically).
- **E6 (Bles et al. 2022):**
  - The raw data have been *summarised descriptively* (`scripts/analyzeBles.ts`)
    but **no model has been run against them**. E6 remains **held-out** for
    our encounter-based model.
  - In-nest parameters must be calibrated on other data (Mailleux 1999).
  - The TEC baseline is fitted to E6 by its authors; it serves only as a
    reference.

### Criteria (how "reproduced" is judged)
- **Means:**
  z = (m_sim − m_data) / √(SE_data² + SE_sim²), where SE_data = SD/√n as
  reported and SE_sim comes from replicate simulation blocks.
  |z| ≤ 2 counts as consistent. Being "within the data's mean ± SD" is
  **not** evidence that the mean is reproduced.
- **Spread:** compare the SD between ants (or colonies) separately, for
  example with a variance-ratio check.
- **Distributions:** two-sample KS or Anderson–Darling with the actual
  sample sizes.
- **Proportions:** binomial SEs (or exact tests) on both sides.
- **Colony-level outcomes (E6, n = 5 colonies):**
  - Simulate ≥ 50 colonies.
  - Test the mean with SE = SD_data/√5 combined with SE_sim, and check the
    between-colony SD separately.
  - Primary metrics: event count, T50, participants, Gini, number of
    foragers, share of food given by non-foragers.
  - The network metrics (efficiency, betweenness, closeness, clustering)
    are correlated. Treat them as one secondary family and don't count
    them as independent confirmations.
- **Status:** the current E1 loss terms and the E2 table still use the older
  SE_data-only or tolerance-scaled scores. That is next step 1.

---

## Results so far

### E1 — exploratory walking (Khuong et al. 2013 data, CC BY 4.0)
- **Shared statistics:** the trajectory statistics module
  (`src/sim/analysis/trajectory.ts`) is applied identically to the data and
  to simulations.
- **What the data changed in the model:**
  - Median speed is 43 mm/s at 26 °C (my estimate had been 20).
  - Slope slows ants regardless of walking direction.
  - Turning decorrelates per distance walked (persistence ≈ 23 mm), and
    turn angles are heavy-tailed, so a Boltzmann-walker structure fits.
  - Ants drift back towards the release point within ~60 mm.
  - On slopes, ants also pause more and wiggle more at small scales.
- **Model** (`src/sim/models/walk.ts`):
  - Reorientations are event-exact (no time-step dependence).
  - OU speed process, pauses, slope terms, and a homing bias that fades
    with distance.
  - Each ant has its own RNG stream.
- **Fit** (`data/fits/e1-walk.json`):
  - Fitted mean free path 10.1 mm and g = 0.60. These match Khuong et
    al.'s own segmentation estimates (10 mm, 0.6), which is an independent
    consistency check.
  - Flat and 20° are within data uncertainty (20° is now *development*,
    see the log).
  - **Known gap:** ≥ 45° (speed-distribution shape and fine-scale turning).
    It is encoded as an expected-failure test.
- **Numerics:** time-step convergence (8× smaller step, 1200 ants),
  determinism and per-ant stream independence are all tested.

### E2 — drinking and the trail-laying decision (Mailleux et al. 1999, 2009)
- **Limits of the 1999 data:** the 1999 set-up geometry is not reported
  (tray, ramp, platform), so only at-the-drop measures are used from it.
- **Why q exists:** the 2009 data contradict a pure desired-volume trail
  decision: trail layers and non-layers drank the same volume at the 0.7 µL
  drop. I added a probability of laying after an exhausted drop,
  `unsatisfiedLayProb` (q), fitted on the 38 % drop-1 trail fraction.
  This is a candidate for removal in the mechanism comparison.
- **Fitted values** (`data/fits/e2-drinking.json`):

  | Parameter | Value |
  |---|---|
  | desiredFed | 0.66 µL |
  | desiredHungry | 0.83 µL |
  | desiredSd | 0.37 (log) |
  | stopHazard | 0.061/s |
  | q (unsatisfiedLayProb) | 0.34 |
  | pipette accessible fraction | 0.77 |

  Fixed or estimated: never-layers 12 %, `reserveDays` 14, bridge width 5 mm.
- **Fit targets:**
  - Drinking times: 66/89/90 s (data 65/88/93) ✓.
  - Drop-1 intake ✓, drop-1 drinking time ✓, drop-1 trail fraction ✓.
  - Trail % at 1/4/8 days: 82/85/81 (data 85/94/88).
- **Never-layer ceiling check.** A fixed 12 % caps the expected trail-laying
  rate at 88 %, and the model sits below that cap.
  - The 4-day condition alone is in tension with it: 133/141 laid; under a
    0.88 ceiling, P(X ≥ 133) ≈ 0.009.
  - The pooled 1999 data (275/305 = 90 %) are compatible (P ≈ 0.14) and
    imply at most ≈ 10 % never-layers, against 14 % in Mailleux et al. 2005.
  - The fraction should be estimated within 10–20 % rather than fixed. It
    may also differ between colonies or studies.
- **Inspected 2009 results** (now development evidence):
  - **Consistent:** drop-2 intake 0.31 µL (0.28 ± 0.20); total intake
    0.75 µL (0.75 ± 0.30); total time 195 s (178 ± 83).
  - **Inconsistent:**
    - Overall trail 72 % (84 %).
    - Drop-2 drinking time 36 s (23 ± 11).
    - Between drops: trail layers 21 s (58 ± 33); non-layers 67 s
      (134 ± 87). Homing in the area is too efficient.
- **Tests:** a ledger test checks that food is conserved (accounts equal
  entity holdings); determinism and time-step convergence are tested.
  `test/e2.test.ts`.

### E6 — food sharing in the nest (Bles et al. 2022 raw data, CC BY 4.0)
- **Imported:** `data/bles2022/trophallaxis_scans.csv` (1,324 scan records,
  5 colonies).
- **The observation model checks out.** Merging the same pair across
  consecutive minutes reproduces the paper's event count: 98.4 ± 19.9
  (reported 99.0 ± 17.4).
- **Descriptive targets** (mean ± SD over colonies, minutes 30–90):

  | Measure | Value |
  |---|---|
  | T50 | 32.8 ± 3.4 min |
  | Participants | 44.2 ± 1.6 of 50 |
  | Activity Gini | 0.41 ± 0.03 |
  | Ants with both roles | 58 ± 13 % |
  | Network efficiency | 0.40 ± 0.04 |

  Forager identities are not in the raw file, so forager-based numbers come
  from the paper's summaries (foragers 12.2 ± 1.9; ≈ 40 % of donations by
  non-foragers).

---

## Open problems and backlog
- **E2 identifiability:** desired volume, stop hazard, starvation→reserve
  mapping, accessible fraction and q overlap. See next step 3.
- **Not yet done from the original M1 plan:**
  - State save/restore with a reproducibility test (only determinism is
    tested).
  - A grid-spacing convergence test for the pheromone field.
  - The trail *response* model (no trail following is implemented yet).
  - Repellent-channel sensing (needed for the Pharaoh ant draft; the old
    clamping bug only existed in `attic/`).
  - Nest cue fields and per-ant view memories (needed for field nests, not
    for the flat lab nests of M1).
  - Sensitivity analysis.
  - The three.js 3D renderer (the M1 pages use 2D canvas/SVG).
- **Draft species:**
  - The seven non-Lasius files use v1-style provenance (no conditions, n
    or uncertainty) and some behavioural-effect durations converted to
    lifetimes (e.g. Pharaoh-ant pheromones). These are unvalidated drafts.
  - The *P. barbatus* tunnel width is now correctly labelled as derived
    from *P. badius*.
- **E1:** steep-slope gap.
- **E2:** never-layer fraction; between-drop timing; second-drop drinking.

## Code map (M1 architecture)
- `src/sim/core/`: rng (per-agent streams, wrapped Cauchy), math, param
  (provenance v2: measured/fitted/derived/estimated, plus conditions, n,
  uncertainty, fit, validatedBy).
- `src/sim/analysis/`: trajectory statistics, Khuong parser,
  trophallaxis statistics (Bles), Nelder–Mead.
- `src/sim/models/walk.ts`: the motor program (MotorMod hooks for steering).
- `src/sim/perception/`: percept types and `perceive.ts`, the only bridge
  from world to behaviour.
- `src/sim/mind/mind.ts`: traits and cognitive state.
- `src/sim/behavior/lasiusForager.ts`: the policy. It uses only percepts,
  mind and interoception; `test/architecture.test.ts` enforces this.
- `src/sim/physics/`: `antPhysics.ts` (walls, path integration with compass
  error, drinking, trail deposition, metabolism, evaporation) and
  `ledger.ts`.
- `src/sim/world/`: apparatus (lab geometries), food, world, surface,
  pheromone field, alarm plumes, terrain, items, spatial hash.
- `src/sim/experiments/`: `e1Exploration` and `e1Compare`; `e2Mailleux`
  (protocols) and `e2Targets` (targets with roles, shared by fit, tests and
  UI).
- `src/sim/species/`: `lasiusM1.ts` (M1 parameters; merges
  `data/fits/*.json`), `refs.ts`, and 7 other draft species (unvalidated).
- `src/sim/nest/` and `src/sim/env/`: the 3D voxel nest and the soil
  heat/climate models, built early and reserved for field colonies.
- `attic/`: pre-rework draft code, excluded from the build. Its colony,
  brood and task logic is to be ported later.
- UI: `src/main.ts`, `src/ui/` (E1 and E2 pages, charts), `src/worker/`.
- Scripts: `scripts/analyzeKhuong.ts`, `analyzeBles.ts`, `fitE1.ts`,
  `fitE2.ts`.
- Data: `data/khuong2013/`, `data/bles2022/`, `data/fits/`.
- Evidence base: `docs/research/lasius-niger.md`. Architecture:
  `docs/DESIGN.md`.

## Milestones
- **M1 (current):** L. niger reproduces food collection and food sharing
  (E1, E2, E6, with E3/E4/E5 as further checks):
  - using only local information,
  - with conserved resources,
  - with uncertainty estimates,
  - stable under time-step changes,
  - with explicit held-out tests.
- **M2+:** bring other species up to the M1 standard, one at a time.
- **Later:** emergent excavation, tunnel traffic and occupancy, and
  validated aggregation for very large colonies (see `docs/DESIGN.md`).

## Decisions log
- **2026-10-07** Browser, TypeScript, three.js. The simulation core is
  pure, deterministic and runs in a Web Worker. Language performance is not
  the bottleneck; hot kernels can move to WASM if profiling demands it.
- **2026-10-07** 3D world: surface heightmap plus 3D voxel nest. The dense
  grid is fine at current sizes. Nest architecture uses Tschinkel templates;
  reproducing them cannot validate emergent construction.
- **2026-10-07** Review 1 adopted:
  - one reference species first;
  - the perception boundary;
  - numerics before calibration;
  - provenance v2;
  - the pheromone chemistry/response split;
  - water balance and the ledger in the foundation.

  The earlier draft code was moved to `attic/`. That resolved the review's
  issues: world-truth reads, the time-step-dependent hazard, per-call
  absorption, per-step compass noise and repellent clamping.
- **2026-10-07** Movement model chosen by data: a spatial Boltzmann walker
  (per-distance reorientation), because heading decorrelation is per
  distance and turn angles are heavy-tailed.
- **2026-10-07** Review 2 adopted:
  - tighten evidence before adding biology;
  - a stricter meaning of "withheld", with a contamination log;
  - combined-SE criteria, with spread reported separately;
  - E6 metrics grouped into primary and secondary families;
  - check the never-layer ceiling;
  - next work: the E6 observation pipeline plus the TEC baseline and a
    bounded E2 mechanism comparison before any new mechanisms.
