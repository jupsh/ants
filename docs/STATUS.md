# Project status

_Last updated: 2026-10-07 (session 2: step 1 done; research for steps 2–5 filed in `docs/research/`). Keep this file current: update it whenever a step starts or finishes._

## ▶ RESUME HERE

**State in one paragraph.** Milestone M1 (*Lasius niger* as the single
reference species). The TypeScript simulation core compiles, runs and is
tested (`npm test`: 22 pass + 2 expected-fail, ~20 s). Model–data
comparisons now use the combined-SE criteria (step 1, done). Under them, E1
(exploratory walking) fits the median speed, stopping and long-lag heading
correlation but **not** the slow-speed tail, turn-increment shape, drift
near the release point or straightness, even on flat ground; steep slopes are
far off. E2 (drinking and trail laying) matches most means but the
between-ant **spread** of drinking time is twice the data's — a new,
discriminating observation for the mechanism comparison. For E6 (food sharing in the nest), the
data are imported and summarised and no model has been run against them yet.
Session-1 work is committed on branch `browser-sim-m1` (a7b5269); ask the
user before committing further. `side-projects/` is the user's own scratch
area: it is excluded locally via `.git/info/exclude` and is outside the
tsconfig/vitest scope — leave it alone.

**Session 2 research (background agents, all done):** notes on (a) Bles et al. 2022
one-caste/TEC model specification, (b) the exact Mailleux stopping and
trail rules plus the 1999 recruiter data — **done:**
[`docs/research/mailleux-rules.md`](research/mailleux-rules.md), (c)
slope-walking literature and data diagnostics for the E1 gap — **done:**
[`docs/research/slope-walking.md`](research/slope-walking.md). (a) —
**done:** [`docs/research/bles-tec-spec.md`](research/bles-tec-spec.md).

**Guiding principle (from review 2):** tighten the evidence before adding
biology. Keep asking *which observation could distinguish competing
explanations?* Don't add mechanisms (grooming, wall-following, …) until the
existing ones are shown to be identifiable and necessary.

**Deployment.** GitHub Pages via `.github/workflows/pages.yml` (tests, build,
deploy on push to `main`). Vite `base: './'` so it works under `/ants/`. One-time
step: repo Settings → Pages → Source = "GitHub Actions".

### Next steps (in order)
1. ~~**Fix the comparison statistics.**~~ Done (session 2), see Decisions log
   and Results. `src/sim/analysis/compare.ts`; reports via
   `scripts/reportE1.ts` and `scripts/reportE2.ts`.
2. **E6 observation pipeline + TEC baseline.** Spec:
   [`bles-tec-spec.md`](research/bles-tec-spec.md) (session 2). The
   authors' model code is on Zenodo (CC BY 4.0); a Python port that
   reproduces all six published variants is at
   `docs/research/scripts/bles/bles_port.py`.
   - **Finding:** the paper's model outputs were **not** passed through a
     scan observer — every pair formation counts as an event, even 1 s
     long. Through our planned observer (60-s scans, contact > 5 s, merge
     consecutive scans), published TEC-exp gives **≈ 83 ± 15 events, not
     99**, and NF→NF ≈ 25 instead of 32 (non-forager-donor pairs are
     shorter: the code's pair-ending hazard is 1/130 s⁻¹ for NF donors vs
     1/260 for F donors because of a dead code branch; Fig. 1 says 1/120).
   - (a) A reusable simulated observer in TS (as above, random scan
     phase). Reuse `src/sim/analysis/trophallaxis.ts` for the statistics.
   - (b) **Tier 1, exact reproduction (regression test):** port the TEC
     and one-caste models to TS with the code's quirks behind a
     `blesCompat` flag (N = 52, power-law α, U(0, 2m), exponential with
     mean = Table 1 value, dead first tick, …); count raw events; gate on
     Table 1 / Table S1 (TEC-exp: events 98.7, foragers 12.5, pair types
     9.7/49.6/7.1/32.0, T50 29.47 min, Gini 0.343).
   - (c) **Tier 2, observer-consistent baseline:** refit θ/ϒ (and perhaps
     the pair-ending rate) so the *observed* output hits the E6 targets.
     This is the baseline the encounter model must beat. It is fitted to
     E6, so it is a reference, not a test of ours.
   - Our encounter-based model (step 4) must go through the same observer.

3. **Bounded E2 mechanism comparison** (before any new E2 mechanism):
   - **M_a (current):** individual desired volume plus a low-max stop
     hazard, never-layers fixed at 12 %, and an unsatisfied-lay probability.
   - **M_b (Mailleux et al.'s published rule, corrected 2026-10-07):**
     S(V) = ηΔV / (1 + e^{−η(V − Vc)}) per second with ΔV = 0.01 µL/s, so
     the ceiling is ηΔV ≈ 0.043 s⁻¹, **not 1** (a max-1 rule stops ants at
     ~0.2 µL). Equivalent to logistic desired volumes (centre Vc, scale
     1/η). Pt = 0.9 of satisfied ants lay trail. Published η = 4.3, Vc =
     0.9–1.0 (2006: η = 5, Vc by starvation 0.64/0.86/0.90). Run it both
     with published parameters and refitted. See `mailleux-rules.md`.
     - Noted by the research agent (inferred, not by the authors): with
       published parameters M_b predicts 8–19 % trail after the first
       0.7 µL drop (data 38 %) and too little trail at 0.3 µL drops.
     - A logistic volume spread with fixed intake implies a drinking-time
       SD ≈ 36–42 s (data 21–26 s). 2009 reports intake rate as an
       individual trait (volume ≈ 0.006 × time + 0.15). Between-ant intake
       rate is therefore a documented candidate for the spread problem in
       both M_a and M_b; decide before the comparison whether it is part of
       the shared base model, and log it.
   - **M_c:** M_a with the never-layer fraction free (prior 10–20 %),
     tested with and without the unsatisfied-lay probability.
   - **How:** same fit targets and same optimiser budget. Report the
     parameter count and the fit.
   - **New discriminating observation:** the between-ant SD of drinking
     time (data 21–24 s at the 3 µL drop; M_a gives 42–53 s) and of
     first-drop intake (data 0.25 µL; M_a 0.12). Decide *before fitting*
     whether the SDs become fit targets or stay as development checks, and
     log it.
   - **Identifiability check for M_a:** profiles or correlations of
     desiredFed/Hungry, stopHazard, pipette accessibility and
     unsatisfiedLayProb, plus the `reserveDays` mapping.
   - **Then decide.** The between-drop timing failure may then be addressed
     (homing/edge behaviour), now explicitly as development evidence.
4. **E6 encounter-based model:**
   - Build the lab nest (56 × 41 × 2 mm chamber, 4 × 3 × 2 mm passage,
     61 × 49 mm area) with resting and active workers and trophallaxis on
     actual contact.
   - Calibrate in-nest parameters on Mailleux 1999 recruiter data only
     (Actes Table 2a/2b, full values in `mailleux-rules.md` §4): recruiter
     stays 80–113 s, makes 3.3–6.1 contacts, 56–66 s total trophallaxis;
     a *contacted nestmate* leaves within 5 min with P = 44–86 % after
     trophallaxis, 69–93 % after other contacts. Table 2b's n values
     look copied from Table 1 — use its proportions with caution.
   - Then test once on E6.
5. **E1 structure revisit** (new, from step 1). The walking model fails
   the stricter criteria on flat ground too (see Results § E1). Research
   note [`slope-walking.md`](research/slope-walking.md) (session 2)
   re-reads the failures; its [C] numbers come from Python scripts and must
   first be **reproduced in the TS pipeline** (add a speed-binned
   statistics function to `trajectory.ts`, applied to data and sims alike).
   Key claims:
   - Short-scale tortuosity is a **speed effect**: at equal speed, slopes
     are *straighter*; turning per mm falls steeply with speed at every
     incline. Our walker turns per mm independent of speed.
   - In log terms the speed distribution **widens** on slopes (p90/p50
     1.66 → 2.50); within-ant log-SD is flat (0.68 → 0.62), between-ant
     grows (0.31 → 0.56, partly session/colony effects). Our
     `slopeSpeedSdK > 0` does the wrong thing. Median speed is linear in θ
     (v/v₀ = 1 − 0.737θ, RMSE 0.018).
   - Tracking noise is anisotropic, σy rising 0.19 → 0.36 mm at 60°
     (≈ 1/cos θ); simulations have none.
   - Flat-ground alignment is real (all sessions, axis ≈ 14° off y, only
     for displacements ≥ 4 mm): a fixed weak cue in the set-up, not noise.
   - Downhill exits 46–57 of 69 on slopes (reproduced); our geomenotaxis is
     purely axial. Check the data's y orientation (assumed +y = uphill,
     matching `PlaneSurface(incline, −π/2)`).
   - Return-to-start bias near release fades on slopes (published for
     flat ground by Bonavita et al. 2026, PLoS ONE e0327957 — a reanalysis
     of the same data; citation not yet checked by me).
   Candidate changes, in the note's order (each with its distinguishing
   observation in the note, §4):
   - **A** add measured tracking noise to the simulated observer (0
     behavioural parameters; do first — it is an observation model, like
     the E6 observer);
   - **B** speed-dependent turning per mm (per-time/per-stride heading
     noise), replacing `slopeJitterK` (net 0 to +1);
   - **C** continuous axial restoring torque + downhill polar term,
     replacing the event pull (net 0 to +1);
   - **D** between-ant slope sensitivity, `slopeSpeedSdK` → 0 (+1 to +2);
   - **G** homing weakened on slopes vs masked (0 or +1);
   - **H** fixed environmental axis (+2), or exclude `alignY` at 0°;
   - rejected: mechanical speed cap (data contradict it); deferred:
     two-state switching (+4–6).
   Then compare per-ant as well as pooled statistics (pooled quantiles are
   time-weighted towards slow ants), and refit with `scripts/fitE1.ts`.
   **Evidence note:** all five inclines are now fit or development data;
   E1 has no held-out walking data. Fresh candidates: L. niger walking in
   other published experiments (e.g. Czaczkes et al. 2011), if conditions
   match.
6. Backlog (below), sensitivity analysis.

### How to run
- The dev server is run by the user: `npx vite` → http://localhost:5173
  (pages: `#e1` walking, `#e2` recruit decision, `#status`). Don't start a
  second one.
- Tests: `npm test` (~20 s).
- Fits: `npx vite-node scripts/fitE1.ts` (~10 min) and
  `scripts/fitE2.ts` (~5 min). They write `data/fits/*.json`, which
  `src/sim/species/lasiusM1.ts` merges. Data summaries:
  `scripts/analyzeKhuong.ts` and `scripts/analyzeBles.ts`.
- Judge the current fits (combined-SE criteria, writes nothing):
  `npx vite-node scripts/reportE1.ts` (~2 min) and `scripts/reportE2.ts`
  (~25 s, 10 seed blocks × 150 scouts).

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
- Headless browser checks: scratchpad `pw/probe.mjs` (args: hash, png
  path, text to wait for) imports playwright-core from
  `/home/norma/repos/math-ui/node_modules/playwright-core/index.mjs` with
  `~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`. Recreate
  it if the scratchpad is gone.
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
    **Mailleux et al. 2003 six-pipette experiment** (6 × 0.3 µL; % trail
    57 %, volumes, pipettes visited, exploitation times, n = 88 — their
    own model's predictions are printed alongside, ours never run);
    Portha et al. 2004 (returners, 1 M sucrose, brood vs no brood).
    Mailleux et al. 2000 volume series: paywalled, not obtained.
  - **2006 single-drop data** (Mailleux et al. 2006, J Exp Biol): the
    research agent compared the 0.3 µL trail fractions (37/17/12 %) with
    the *published* M_b rule. They are therefore **development** for M_b
    and should not be used as a held-out test of any E2 model.
  - The 2006 3 µL data largely overlap the 1999 data (same lab, near-equal
    means, re-selected n). Never treat them as an independent replicate.
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
- **Implementation** (`src/sim/analysis/compare.ts`, step 1):
  - E2: SE_sim from 10 independent seed blocks (batch-means ratio
    estimator); spread as z of log(SD_sim/SD_data) with
    SE(log s) ≈ 1/√(2(n−1)) — approximate, since times are right-skewed.
  - E1: SE_data and SE_sim by cluster bootstrap over ants (200 resamples;
    each simulated ant has its own seed stream, so ants are the
    replicates). Instantaneous speeds are autocorrelated, so their
    distribution is compared via q10/q50/q90, not KS. KS only for per-ant
    values (mean speed, exit time), with the real numbers of ants, shown as
    the equivalent z of its p-value.
  - **Calibration check** (`test/compare.test.ts`): model vs itself (69 vs
    300 ants, 20 replicates, 480 z-scores): SD(z) = 1.05, |z| > 2 in 6.0 %,
    |z| > 3 in 1.3 %. Caveat: short-lag heading correlations have
    rms z ≈ 1.3–1.45, so their SEs may be ~30 % too small.
  - Verdicts: |z| ≤ 2 consistent, ≤ 3 marginal, else off.

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
  - **Withdrawn (session 2):** "flat and 20° are within data
    uncertainty" held only under the old hand-set tolerances. Under the
    combined-SE criteria (`scripts/reportE1.ts`, 300 ants):
    - consistent at 0° and 20°: median and 90th-percentile speed, fraction
      stopped, heading correlation at 10–50 mm, radial drift beyond 40 mm,
      between-ant speed spread;
    - off at 0°: speed q10 (data 12.9, sim 23 mm/s, z ≈ 6), turn SD
      (z 5.4), turn kurtosis (z 3.8), radial drift at 0–20 mm (z −4.7),
      straightness (z −3.7), flat-ground alignment (z −3.6, probably an
      apparatus artefact);
    - 20° similar (q10 z 10.5, 5 mm heading correlation z 4.8);
    - 30° and 60° are *fit* conditions yet clearly off (60°: median speed
      data 10.8, sim 17.9 mm/s; q90 26.9 vs 57.2; turn kurtosis 3.1 vs
      6.4). The saved fit's own report already had loss 114 at 60°.
  - Both development inclines (20°, 45°) are expected-failure tests.
    See next step 5.
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
- **Combined-SE report** (session 2, `scripts/reportE2.ts`, 10 blocks ×
  150 scouts; z for the mean, then z for the SD between ants):
  - Fit targets: drinking times z 2.3 / −1.0 / 0.7 (1/4/8 days); trail
    fraction at 4 days **z −3.2** (86 % vs 94 %: the never-layer ceiling);
    drop-1 intake, time and trail fraction within 2.
  - **Spread (new):** drinking-time SD at the 3 µL drop is 43–53 s vs
    21–24 s in the data (z_SD 7.7–11); drop-1 intake SD 0.12 vs 0.25 µL
    (z_SD −8). The low-max stop hazard gives a long tail; the published
    logistic rule (max 1) would truncate it. This is the first observation
    that clearly separates M_a from M_b.
  - Development (2009, already inspected): consistent — drop-2 intake
    (z 2.0), total intake (0.1); inconsistent — overall trail 66 % vs 84 %
    (z −3.7), drop-2 drinking time 38 vs 23 s (z 10), between drops
    26 vs 58 s for layers (z −4.5) and 72 vs 134 s for non-layers
    (z −4.4), total time 208 vs 178 s (z 2.7, SD z 6).
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
  from the paper's summaries (foragers 12.2 ± 1.9; pair types
  F→F 10.2 ± 8.2, F→NF 50.0 ± 10.1, NF→F 7.0 ± 2.6, NF→NF 31.8 ± 7.9;
  per-ant event histograms are hard-coded in the authors' script, see
  `bles-tec-spec.md` §4.2).
  - "≈ 40 % of donated food by non-foragers" is **40 % of donation
    events** (194/495), not of food quantity (the TEC model gives ≈ 27 %
    by quantity). Use the event share as the target.
  - The paper's "99.0 ± 17.4" uses the population SD (ddof 0); the sample
    SD is 19.4, matching our 19.9 within merging differences.

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
- `src/sim/analysis/`: trajectory statistics (per-track accumulation +
  combine, for cheap bootstraps), Khuong parser, trophallaxis statistics
  (Bles), Nelder–Mead, and `compare.ts` (combined-SE z, log-SD z, KS
  test, block estimates, cluster bootstrap).
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
  `fitE2.ts`, `reportE1.ts`, `reportE2.ts`.
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
- **2026-10-07** Comparison statistics (step 1):
  - Judging uses combined-SE z; **fitting uses SE_data only** (fixed
    weights), because SE_sim in the objective would reward noisier
    simulations.
  - E1 loss = Σ over 11 families of the mean z² within the family, so
    correlated statistics (5 heading-correlation lags, 8 radial bins)
    count once.
  - E1 SEs by cluster bootstrap over ants; E2 SE_sim by seed blocks.
  - `fitE2.ts` now uses the shared `e2Targets` definitions (it had its own
    copy with different seeds).
  - E2 roles renamed: `validation` → `development` (they were inspected).
  - The E1 20° test is now an expected failure: the earlier pass came from
    loose tolerances, not from agreement.
