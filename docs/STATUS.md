# Project status

_Last updated: 2026-10-08 (session 3: step 5 (E1 walking revisit) started first, because 3c and 4 both depend on the walking model; see Decisions log). Keep this file current: update it whenever a step starts or finishes._

## ▶ RESUME HERE

**State in one paragraph.** Milestone M1 (*Lasius niger* as the single
reference species). The TypeScript simulation core compiles, runs and is
tested (`npm test`, fast tier: 28 pass + 2 expected-fail, ~7 s;
`npm run test:full` adds the slow validation tests, run in CI). Model–data
comparisons now use the combined-SE criteria (step 1, done). Under them, E1
(exploratory walking) fits the median speed, stopping and long-lag heading
correlation but **not** the slow-speed tail, turn-increment shape, drift
near the release point or straightness, even on flat ground; steep slopes are
far off. E2 (drinking and trail laying) matches most means but the
between-ant **spread** of drinking time is twice the data's — a new,
discriminating observation for the mechanism comparison. For E6 (food
sharing in the nest), the observation pipeline and the reference baseline
are done (step 2): the authors' TEC model, ported and refitted through the
scan observer, matches every colony-level target except T50; our own
encounter-based model has not been run against E6 yet (step 4). The E6 page
(`#e6`) animates one simulated colony.
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
   - **Done (session 2):** (a), (b) and (c).
     - Tier 1: the TS port reproduces Table 1/S1 for all six variants
       (TEC-exp: 99.1 events, 12.6 foragers, 9.5/50.0/7.2/32.4, T50 29.3).
     - Published TEC-exp through the observer: events 82 (z −1.8), NF→NF
       25 (z −1.9), T50 z −2.2.
     - Tier 2 refit (`data/fits/e6-tec.json`, fitted on foragers + the four
       pair types): θF 1/7.8, θW 1/21.7, ϒF 1/8.1, ϒW 1/21.8 (published
       1/9, 1/23, 1/9, 1/27). Fresh colonies: every primary and network
       metric |z| ≤ 1.1 **except T50: 29.6 vs 32.8 min (z −2.1, not
       fitted)**. In the data the first exchanges come 2–5 min after food;
       the model's foragers reach the food instantly. Discovery and travel
       time are exactly what our spatial model adds — a concrete target.
     - **Power caveat:** with n = 5 colonies, SE_data is large; even the
       rejected one-caste model passes most colony-level means (only F→F
       stands out). The fit loss of 0.29 for 4 parameters on 5 targets
       also means the refit parameters are loosely determined. More
       discriminating: per-ant distributions (267 ants: events given /
       received by foragers and non-foragers, the authors' Fig. 3
       histograms) — add them as KS targets before step 4's test.
     Code: `observeContacts` in `src/sim/analysis/trophallaxis.ts`,
     `src/sim/reference/blesTEC.ts` (TS port, `compat` flag),
     `src/sim/experiments/e6Bles.ts` (targets, colonies, comparison),
     `scripts/reportE6.ts`, `scripts/fitE6TEC.ts` → `data/fits/e6-tec.json`,
     `test/e6.test.ts`, and the E6 page (`#e6`: animated colony,
     cumulative events, comparison table).
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

3. ~~**Bounded E2 mechanism comparison.**~~ Done (session 2); pre-
   registration in the Decisions log. Fresh seeds, combined SE
   (`scripts/compareE2.ts`):

   | Variant | k | fit Σz² | + 2k | dev Σz² | drinking-time SD z (1/4/8 d) |
   |---|---|---|---|---|---|
   | **M_a (adopted)** | 8 | 15.9 | **31.9** | 148.8 | 7.1 / 12.2 / 11.8 |
   | M_c (never-layers free) | 9 | 16.3 | 34.3 | 150.7 | 7.2 / 12.2 / 11.6 |
   | M_c0 (q = 0) | 8 | 23.0 | 39.0 | 183.1 | 7.3 / 12.5 / 12.1 |
   | M_b (Mailleux rule) | 6 | 27.6 | 39.6 | 168.7 | 5.5 / 7.9 / 9.3 |

   - q is supported (M_c vs M_c0: Δ 4.7); a free never-layer fraction is
     not (stays at 0.12). M_b's rule (only satisfied ants lay) gives 21 %
     trail after drop 1 (38 %) and 58 % overall (84 %).
   - Shared parameters agree across variants: volume-estimate SD σ_m ≈
     0.20–0.21 µL, intake-rate SD σ_r ≈ 0.19–0.21. The 2009 volume–time
     regression is now reproduced (Spearman 0.45–0.49 vs 0.46).
   - **Every variant fails the pre-registered spread check**: drinking
     time at the 3 µL drop is about twice as variable as in the data.
   - Adopted: M_a + σ_r + σ_m (`data/fits/e2-drinking.json` = `e2-Ma.json`).
   - Identifiability (`scripts/identifyE2.ts`): the finite-difference
     Hessian is indefinite (160 evaluations may not reach the minimum, and
     the Monte-Carlo loss is rough at 150 scouts), so correlations are not
     interpretable. Diagonal curvature: desiredHungry, stopHazard,
     desiredFed, σ_r, desiredSd well constrained; σ_m, q and pipette
     accessibility weakly.
3b. ~~**E2 follow-up.**~~ Done (session 2), as pre-registered:
   - **M_d (time-based satiation):** fit Σz² + 2k 34.3 (M_a 31.9),
     development Σz² 140.7 (M_a 148.8), drinking-time SD still z 7–11 (the
     fit keeps a wide spread of individual thresholds, desiredSd ≈ 0.38).
     Fails decision condition (i) → **M_a stays.**
   - **Held-out test, Mailleux 2003 six pipettes** (`scripts/testE2Heldout.ts`,
     run once; 4 days primary):

     | | primary Σz² | trail | volume | pipettes visited | exploitation |
     |---|---|---|---|---|---|
     | M_a | 27.5 | 55 % vs 57 % (z −0.3) | 0.64 vs 0.80 µL (−2.5) | 3.4 vs 2.8 (+4.2) | 101 vs 115 s (−1.9) |
     | M_d | 26.7 | −0.9 | −2.3 | +4.2 | −1.8 |

     The **trail decision transfers** to a new experiment; both models
     **fail overall** (Σz² ≈ 27 for 4 primaries, ≈ 4 expected) through too
     many pipette visits with too little intake per visit (0.19 vs
     0.29 µL; the data even exceed our accessible 0.24 µL per 0.3 µL drop)
     and too-narrow spreads. 1- and 8-day sensitivity runs agree.
   - **Common failure across experiments:** search between food sources is
     too fast and efficient (2009 between-drop times 25 vs 58 s and 68 vs
     134 s; 2003 visits too many). Drop accessibility may also differ
     between the 2009 pipettes and the 2003 sticks.
   - **Profile, σ_m (M_a; Δ loss vs optimum, re-fitting all others):**
     0.10 µL Δ 6.0 · 0.15 Δ 1.6 · 0.21 Δ 0 · 0.27 Δ −0.3 · 0.33 Δ 0.8.
     Bounded below (≳ 0.13 µL; approximate, Δ loss < 2, not a calibrated
     interval) but **not above** within 0.33 µL:
     the data cannot rule out larger gaster-estimate noise, which would
     make volume-based stopping more compatible with the time-vs-volume
     variability pattern. An independent estimate of σ_m (e.g. a methods
     paper on the gaster-ellipsoid volume method) would settle it.
   - **Profile, q:** 0.17 Δ 1.7 · 0.25 Δ 0.6 · 0.35 Δ 0 · 0.47 Δ −0.1 ·
     0.60 Δ 0.1 — flat. q > 0 is needed (M_c0 loses by Δ 4.7) but its value
     (≈ 0.15–0.6) is not identified by the current targets.
   - **Profile, pipette accessibility:** 0.57 Δ 69.6 · 0.69 Δ 17.9 · 0.785
     Δ 0 · 0.86 Δ 6.9 · 0.91 Δ 17.4 — well identified (≈ 0.73–0.84, approximate: Δ loss < 2)
     for the 2009 pipettes. So the 2003 per-visit intake (0.29 µL,
     above 0.785 × 0.3 = 0.24 µL) points to different accessibility for
     the 2003 sticks, or to volume-estimate bias, not to a loose fit.
3c. **Search around food (new, next E2 work).** Revisit the area-restricted
   search after leaving a drop and local movement in the foraging area,
   using development data (2009 between-drop times; 2003 visits and the
   time between pipette visits, 19.4 ± 18.9 s, n = 55) together with the
   E1 walking-model revisit (step 5), which governs the same movement.
   Drop accessibility per apparatus to be decided first (the 2003 drops
   were delivered onto a stick as the ant climbed it).
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
5. **E1 structure revisit** (in progress, session 3). Done so far:
   - **5.0 Reproduction ✓.** `scripts/diagE1.ts` (code in
     `src/sim/analysis/walkDiagnostics.ts`) reproduces every [C] number of
     the research note from the TS pipeline (speed-binned persistence and
     kurtosis, per-ant and within-ant log-speed spread, tracking noise,
     flat alignment by displacement, downhill exits, radial drift,
     returns), all to the note's rounding. The claims stand.
   - **5.A Tracking observer ✓** (`E1Options.tracking`, per-ant observer
     stream). The data's noise is white (σ² from 1st vs 2nd differences
     1.03–1.05). Noise-free simulated ants already put 0.03–0.09 mm into
     the same estimator through slow movement, so the observer SD is
     deconvolved, σ² = σ_data² − σ_moving²: σx 0.149/0.142/0.141/0.139/0.133,
     σy 0.167/0.159/0.187/0.228/0.357 mm (0–60°). With it, simulated tracks
     reproduce the data's noise estimates (|z| ≤ 0.6) and whiteness. It
     barely changes any behavioural statistic: **noise does not explain the
     gaps.**
   - **New diagnostics (same code on data and model):**
     - Turn structure by speed, 2.5 mm chords: median |turn| and P(|turn| >
       0.5 rad). In the data both fall steeply with speed (flat: big-turn
       fraction 0.67/0.65/0.37/0.12/0.026 across the five speed bins); the
       model has too few big turns when slow and 2–15× too many when fast
       (0.06 per chord at every incline), hence the kurtosis gap (model
       17–30 vs data 5–11 at ≥ 25 mm/s).
     - Caveat, an estimator effect present in data and model alike: a turn
       inside the 0.2 s window shortens the displacement, so "slow" bins
       select turning. In the model the slow bins on flat ground are mostly
       near-reversals (⟨cos⟩ at 5 mm −0.14).
     - **Between ants** (free of that effect): slower ants are more
       tortuous per mm. Slope of log(1 − ⟨cos⟩ at 10 mm) on log median
       speed: data −0.63/−0.56/−0.57/−0.33/−0.40 (SE 0.06–0.15), model
       −0.08 to −0.18. Per-distance turning predicts 0, per-time turning
       about −1 (less once correlations saturate).
     - **Across stops:** heading into vs out of a stop is nearly
       uncorrelated in the data (⟨cos⟩ 0.0–0.26 for stops < 0.4 s, 0.16–0.37
       for 0.4–1.2 s); the model keeps its heading (0.29–0.56 and 0.62–0.79).
       Ants reorient at stops.
     - Downhill exits (model 0.48–0.52 vs data 0.67–0.83), slope-axis tilt
       10–20° at 20–45°, flat alignment, outward radial drift on ≥ 30° and
       within-ant speed SD all confirm the note.
   - **B vs A0 (pre-registered test, exact pause rule; `judgeE1.ts
     --checks loss11`; fits kept as `data/fits/e1-{A0,B}-loss11.json`):**
     - (i) flat loss on 5 fresh 1000-ant batches: A0 123.5 ± 2.8, B
       114.3 ± 1.3; paired B − A0 = −9.2 ± 3.5 (2.6 SE), −5.2 after the
       heuristic 2k penalty. Met.
     - (ii) the primary checks (per-ant tortuosity–speed slope, big-turn
       fraction by speed) improve at 5 of 5 inclines. Met.
     - **But both models stay far off the checks** (primary Σz² over 6
       statistics: B 576–2694, A0 633–3109, i.e. |z| ≈ 10–20). B's
       per-ant slope is −0.18 to −0.22 vs A0 −0.06 to −0.17 and data
       −0.33 to −0.63; over all turning checks B is better on 0–45° but
       worse at 30° and 60°. On the fitted slopes B loses (stage-2 loss 239
       vs 199; combined-SE report at 45°/60°: 269/341 vs 221/271), since
       `slopeJitterK` is gone and C/D are not yet in.
     - The fit keeps the time-based terms small (D_t 0.05 rad²/s, μ_t
       0.29/s; λ 9.9 mm, g 0.65), so per-distance turning still dominates.
       Reading: the current loss barely rewards the turning structure the
       checks expose (it has no speed-resolved turning statistics), so the
       fit cannot pull B towards it.
     - **Decision:** B is preferred over A0 by the pre-registered rule;
       provisional (review notes). It is not evidence that ants turn "per
       unit time" in a specific mechanistic sense, and it does not fix the
       turning structure.
   - **Next:** decide whether the speed-resolved turning statistics move
     into the fit (they are then no longer checks; the flat-ground walker
     is tested on the held-out Bonavita data instead), then C and D on the
     adopted structure.
   - **Cascade:** E2 takes its walk parameters from the E1 fit
     (`LASIUS_PARAMS`). Adopting a new E1 fit means re-running
     `reportE2.ts` and, if E2 moves, refitting E2 before 3c.

   Original plan (session 2): the walking model fails
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
     flat ground by Bonavita et al. 2026, PLoS ONE 21:e0327957, PMC13419209
     — a reanalysis of the same flat data plus a new experiment; citation
     checked in session 3).
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
   **Evidence note:** all five inclines are now fit or development data.
   Held-out for the flat-ground walker: Bonavita et al. 2026's new
   experiment (registered session 3, see contamination log).
6. Backlog (below), sensitivity analysis.

### How to run, gotchas, code map
Moved to [`CLAUDE.md`](../CLAUDE.md) at the repo root (session 2), which
Claude Code loads automatically.

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
  - **Held-out (registered 2026-10-08, never inspected):** Bonavita et
    al. 2026's new experiment, `data/bonavita2026/redwhite.csv.gz` (60
    ants × white and red light, same lab, flat 50 cm arena, 25 °C,
    tooth-pick release, arena cleaned between ants; raw 25 Hz tracks, CC
    BY 4.0). Only the file format, counts and the paper's methods have
    been read; no statistic has been computed, and the paper's results on
    these data are unread. It will test the flat-ground walker adopted
    after step 5, under a protocol written down before the first
    computation (geometry, start/end criteria, observer calibration with
    the same noise estimator, white light primary).
  - Other candidates: Czaczkes et al. 2011 (speeds and straightness on
    trails; experienced foragers, a different context).
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
  - **Step 3 (session 2):** the between-ant drinking-time SDs (1999, 3 µL)
    were the pre-registered checks; they have now been inspected for all
    variants and become **development**. Any variant motivated by them
    (e.g. M_d) needs a held-out test.
  - **Step 3b (session 2):** the Mailleux 2003 six-pipette data were used
    once as a held-out test of M_a and M_d (pre-registered); they are now
    **development**. Remaining fresh E2 candidates: Beckers et al. 1993,
    Detrain & Prieur 2014, Portha et al. 2004.
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
- **E2:** drinking-time spread (all variants); 4-day trail fraction (the
  never-layer ceiling, z −3.3); between-drop timing; second-drop drinking
  time (38 vs 23 s).

## Code map
See [`CLAUDE.md`](../CLAUDE.md).

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
- **2026-10-07** Step 3 pre-registration (decided before any step-3 fit):
  - The between-ant SDs (drinking time at the 3 µL drop, drop-1 intake)
    stay **checks, never fit targets**, so they can discriminate M_a, M_b
    and M_c fairly.
  - Between-ant variation in intake rate joins the **shared base model**
    for all variants (+1 parameter: SD of log intake rate). Its value is
    estimated from the 2009 volume–time relation (volume ≈ 0.006 × time +
    0.15 µL, r_s = 0.46, N = 126) and the 1999/2006 volume and time
    summaries, not tuned to the drinking-time SD.
  - **Amendment (same day, still before any step-3 fit):** the papers'
    volumes are gaster-ellipsoid estimates, and drinking *time* varies
    less than *volume* (3 µL drop, 2006: CV 0.26 vs 0.43; 2009 drop 1:
    0.24 vs 0.53). Under any volume-threshold rule time must vary at least
    as much as volume, so the volume data carry measurement error of
    ≈ 0.2–0.3 µL. The simulated observer therefore reports volume + N(0,
    σ_m) (floored at 0), from its own RNG stream; σ_m joins the shared base
    (+1 observation parameter).
  - σ_r and σ_m are fitted in every variant to the 2009 volume–time
    regression (slope 0.006 µL/s, Spearman r_s = 0.46, N = 126; SEs from
    the usual large-sample formulas, ≈ 0.001 and ≈ 0.07). The drop-1
    intake SD involves the same ants, so it is **no longer an independent
    check**; the 1999 3 µL drinking-time SDs remain fully independent.
  - M_b is implemented as a per-volume hazard η·σ(η(V − Vc)) per µL
    ingested (identical to the published per-second form at a fixed intake
    rate, and it keeps the logistic volume distribution the authors fitted
    when intake rates vary). M_b = shared Vc (desiredSd = 0), Pt = 0.9
    (never-layers 10 %), q = 0; η free.
  - Same targets and optimiser budget (160 Nelder–Mead evaluations, 150
    scouts per condition, common random numbers) for M_a, M_b, M_c (never-
    layer fraction free within 10–20 %) and M_c0 (M_c with q = 0). Report k
    and loss + 2k.
- **2026-10-07** Refactor for maintainability (behaviour-preserving; tests,
  build, page probes and `reportE2` output unchanged):
  - `CLAUDE.md` (auto-loaded) now holds run instructions, conventions,
    code map and gotchas; STATUS keeps progress, plan, evidence, results.
  - `scripts/lib.ts` (args, Khuong/Bles loading, JSON) used by all scripts
    and tests; `scripts/probe.mjs` replaces the scratchpad browser probe.
  - `applyFit` (core/param.ts): fit files now update the provenance
    records, which had drifted from the values in use.
  - `src/ui/dom.ts` (labelled controls, verdict cells, canvas sizing)
    shared by the E1/E2/E6 pages; `meanSd` in compare.ts.
  - Proposed, not done: decide the fate of ~2.4 k lines of unreachable
    reserved code (nest/, env/, draft species, terrain/items/spatialHash);
    split STATUS further (evidence / results / decisions files); one fit-file
    schema for e1/e2/e6; playwright-core as a devDependency.
- **2026-10-07** Speed (session 2): profiling showed the conservation ledger
  (string keys, Map lookups) at 18 % and per-step recomputation of
  metabolic constants at ~10 % of E2 run time; both fixed (−30 %, results
  bit-identical). A process pool (`scripts/pool.ts`, one vite-node child
  per core − 1) runs E1 ants, E2 scouts and E6 colonies in parallel, with
  results bit-identical to serial runs (checked for all three).
  reportE1 2 min → 9 s, reportE2 25 s → 9 s, reportE6 → 4 s.
- **2026-10-07** Step 3b pre-registration (before fitting M_d and before
  running any model on the 2003 data):
  - **M_d (time-based satiation):** identical to M_a (same free parameters,
    k = 8; never-layers 12 %; q free) except that the satiation signal
    grows by `nominalIntake·dt` for each step in which the ant actually
    ingests, instead of by the volume ingested. `nominalIntake` = the
    population mean intake rate (phys.intakeRate, 0.0095 µL/s, fixed): a
    unit conversion so desired values stay in µL-equivalents. Same targets,
    budget (160 evaluations, 150 scouts/condition), start at the M_a fit.
  - **Held-out test: Mailleux et al. 2003 six-pipette experiment**
    (`mailleux-rules.md` §1; seen in the research note, never compared with
    any model version). Simulation: six 0.3 µL drops of 0.6 M sucrose,
    two rows of three 10 mm apart centred in the area (x = 140/150/160 mm,
    y = ±5 mm), present from the start, same pipette accessibility and
    observer σ_m as the adopted fit; starvation not reported → **4 days
    primary**, 1 and 8 days as sensitivity; 150 scouts × 10 seed blocks;
    scouts that never drink are not observed.
  - Measures: trail layer = any gaster contact on the first 2.5 cm of the
    bridge from the area; pipettes visited = distinct drops drunk from;
    ingested volume = one gaster estimate of the total (true + N(0, σ_m),
    floored at 0); exploitation time = first pipette contact → leaving the
    area onto the bridge for the last time.
  - **Primary (4):** % trail layers 57 % (n = 88); ingested volume, all
    0.8 ± 0.5 µL (65); pipettes visited, all 2.8 ± 1.3 (88); exploitation
    time, all 115 ± 67 s (86). Secondary: the layer / non-layer splits.
    Spreads reported separately (log-SD z).
  - **Decision rule:** M_d replaces M_a only if it is no worse on fit
    Σz² + 2k, better on development Σz², and no worse on the held-out
    primary Σz². Both are reported whatever the outcome; after this test
    the 2003 data become development.
- **2026-10-08** Session 3 order: **step 5 before 3c and 4.** Search around
  food (3c) is governed by the same walking model, and the encounter
  model (4) depends on how ants move in the nest, so the walking structure
  should be settled first. Step 5 begins with its stated prerequisite:
  - 5.0 reproduce the research note's [C] diagnostics in TS
    (`src/sim/analysis/walkDiagnostics.ts`: per-track accumulators, so the
    same code runs on data and simulations and gives cluster-bootstrap
    SEs; `scripts/diagE1.ts` prints data vs model). Covered: speed-binned
    persistence at 5/50 mm and 2.5 mm-chord turn kurtosis (B), per-ant vs
    within-ant log-speed spread (D), tracking noise σx/σy (A), alignment
    by displacement length (H), downhill exits (C), radial drift and
    returns (G). Any number that does not reproduce is flagged in the note.
  - 5.A then the tracking-noise observer (measured σx, σy per incline;
    own RNG stream per ant), reported with and without, before any refit.
  - Candidates B, C, D, G, H follow, each judged first on its
    distinguishing observation; E1 has no held-out data, so all five
    inclines remain fit/development.
- **2026-10-08** Step 5 B pre-registration (before any fit with B):
  - **Observer A** is part of every E1 fit and report from now on
    (deconvolved σx, σy per incline, recorded in `lasiusM1.ts` as derived
    values).
  - **A0 (baseline):** current structure + observer, refitted with the
    existing loss, stages and budget (stage 1: 500 evaluations on flat;
    stage 2: 400 on 30° and 60°; 160 ants per evaluation; common random
    numbers). Without this refit, B's gain would mix structure with
    observer and optimiser effects.
  - **B (time-based turning):** A0 plus heading diffusion per unit time
    `jitterTime` D_t (rad²/s) and reorientation events per unit time
    `turnRateTime` μ_t (1/s), both also running while the ant is paused;
    `slopeJitterK` removed (fixed 0). Event rate per mm = 1/λ + μ_t/v, and
    the existing run-length modulations (geomenotaxis, homing, runScale)
    scale the whole rate. Heading variance per mm = D_s + D_t/v. Same phase
    function (wrapped Cauchy, g) for both event kinds. k: +2 − 1 = +1. With
    D_t = μ_t = 0 the model and its random-number sequence are unchanged.
  - **Checks, never fitted:** speed-binned ⟨cos⟩ at 5/50 mm, kurtosis,
    median |turn| and big-turn fraction; the per-ant tortuosity–speed
    slope; ⟨cos⟩ across stops.
  - **Decision rule:** B is adopted if (i) fit-inclines loss + 2k is lower
    than A0's and (ii) the per-ant slope and the big-turn fractions move
    towards the data (smaller Σz² over the checks) at ≥ 4 of 5 inclines.
    Both are reported whatever the outcome. If B fails (ii), the two-state
    model F (Decisions: deferred) is the next structural candidate.
  - **Amendment (same day, after the first A0/B fits, before judging
    them).** The pre-registered protocol could not answer the question:
    - Nelder–Mead left B's new parameters at their starting values (D_t
      0.054 rad²/s, μ_t 0.32/s) and barely moved anything else in A0.
    - The objective is noisy: at 160 ants per evaluation the flat-ground
      loss has a seed-to-seed SD of ±15 (60°: ±18), and the fitted points
      sit ≈ 2.8 SD below their fresh-seed mean (95 vs 138 ± 15): the
      optimiser fits seed noise under common random numbers. The session-2
      fit has the same problem. Turn SD and kurtosis are the noisiest
      families (rare large turns). At 640 ants: ±3.3 (flat), ±6.8 (60°).
    - A grid scan (`scripts/scanE1.ts`) shows a ridge of near-constant
      total turning rate (e.g. λ 50 mm with μ_t 4/s), which a warm-started
      simplex with 0.3 log-steps does not cross.
    - **Changes, identical for A0 and B:** 640 ants per evaluation; each
      stage runs from two starts (warm start, and a second start: B on the
      ridge, λ 50 mm, μ_t 4/s, D_t 0.2; A0 with λ 20 mm, g 0.75), then
      restarts the simplex from the best point until a restart gains < 0.5
      (≤ 3 restarts).
    - **Decision quantity:** stage 1 (flat ground: no geomenotaxis, no
      slope speed structure) is the clean test of B, since stage 2 is
      confounded by the missing C and D. Criterion (i) becomes the
      fresh-seed flat loss (1000 ants, not the optimiser's own seeds) + 2k
      over the stage-1 parameters (A0 12, B 14). Criterion (ii) is
      unchanged. Stage 2 is fitted and reported, but does not decide.
    - First-run results, superseded and kept for the record (combined-SE
      report, 300 fresh ants, loss at 0/20/30/45/60°): adopted session-2
      fit with observer 99/100/127/244/423 (without observer
      98/101/126/250/615); A0 104/83/101/220/341; B 90/69/109/204/332.
- **2026-10-08** Step 5 C and D pre-registration (implemented with defaults
  that leave the model bit-identical; nothing fitted yet). Their
  distinguishing observations, computed before any fit (`diagE1.ts`,
  adopted session-2 fit with observer, data / model):
  - **C:** small-turn steering towards the slope axis, ⟨Δh·sin 2φ⟩ per
    5 mm in turns < 0.3 rad, grows with incline in the data (−0.000,
    −0.002, −0.004, −0.004, −0.005; SE 0.001), model −0.000 … −0.003; a
    small-turn downhill drift ⟨Δh·sin φ⟩ ≈ −0.005 on slopes, model ≈ 0.
    The model's large turns move headings *away* from the axis (+0.016 …
    +0.033); the data's do not (−0.014 … +0.016).
  - **D:** between-ant SD of log median speed *within sessions* grows with
    incline (0.28, 0.43, 0.36, 0.46, 0.54; SE ≈ 0.04), model 0.28–0.36. So
    individuals differ in slope sensitivity; it is not only session
    effects.
  - **Models.** C: `geoTorque` κ and `geoPolar` β (continuous, per mm, ×
    sin θ; exact integration) replace the event pull `geoHeadingPull`
    (fixed 0); `geoRunGain` kept; k +1. D: `slopeSpeedKSd` σ_k (log-normal
    individual multiplier of `slopeSpeedK`) replaces `slopeSpeedSdK`
    (fixed 0); k ±0.
  - **Protocol** (after B is decided, on its adopted structure): refit
    stage 2 only (stage-1 parameters fixed) for S0 (no change), C, D and
    C+D, with the amended search (640 ants, two starts, restarts).
    Decision quantity: fresh-seed loss on the fit slopes (30°, 60°; 1000
    ants) + 2k over stage-2 parameters. Checks, never fitted: for C the
    small-turn drifts, downhill-exit fraction, alignment by displacement
    and 50 mm persistence by speed bin; for D the between-ant SDs (overall
    and within session), within-ant SD and per-ant median quantiles. A
    candidate is adopted if it lowers loss + 2k and lowers the Σz² of its
    checks at ≥ 3 of the 4 sloped inclines.
- **2026-10-08** E1 evaluation speed (user asked whether to port to
  Rust/WebAssembly). Measured first: of one 640-ant evaluation, ≈ 60 % was
  per-track statistics running serially on the main process; the
  (already parallel) simulation kernel was the smaller part. So **no
  port**: it would put the model in two languages that must agree
  bit-for-bit with the browser's TypeScript (`exp`/`atan` differ between
  JS engines and Rust's libm), for a minority of the time. Instead the
  workers now return per-ant summaries (`pool.e1Sample`, task
  `e1Summary`; sparse speed histogram per ant), so statistics run in
  parallel and little data crosses processes. Losses, rows and bootstrap
  SEs are bit-identical to the old path; warm evaluations 3.1–3.3× faster
  (flat 760 → 233 ms, 60° 1155 → 368 ms). The worker time is now ≈ 60 %
  simulation, 40 % `trackStats` (which also computes unused MSD), so
  further micro-optimisation is worth ≤ 25 %. The larger remaining lever
  is the optimiser (noisy objective, ridge); revisit if fits stay slow.
- **2026-10-08** Review notes (user, session 3) adopted:
  - **Pause onset made exact** (`walkStep`: unit-rate exposure clock, a
    pause starts and ends at its exact time inside a step; OU speed
    process advances only while walking, as before). The old rule spent the
    whole onset step paused and then the full drawn pause, a time-step bias
    of ≈ +2–3 % in stopped fraction at dt 0.02 (60°: 0.0984 / 0.0968 /
    0.0939 at dt 0.04 / 0.02 / 0.005). Now flat in dt (0.0943 / 0.0961 /
    0.0935; B-like 0.1042 / 0.1041 / 0.1046), exit times and stop
    turning within 2 SE. New exact test: paused fraction = rate·mean/(1 +
    rate·mean) at dt 0.4 and 0.01 (the old rule gives 0.527 vs 0.333 at
    dt 0.4). This changes the random-number sequence, so the in-flight A0/B
    fits were stopped and are redone; the session-2 fit is not refitted,
    but every report from now on uses the exact rule.
  - **Rankings are provisional.** The E1 loss mixes family-averaged z² with
    KS results converted to z, and "loss + 2k" is a penalised heuristic,
    not AIC (no likelihood). Likewise the E2 profile "95 %" ranges
    (Δloss < 2 thresholds) are approximate: incomplete optimisation and
    simulation noise, not calibrated intervals. Consequences:
    - candidates are judged on **several independent fresh-seed batches**
      (5 × 1000 ants per incline), reported as mean ± SE; a loss
      difference counts only if it exceeds 2 SE of the paired difference
      *and* the pre-registered checks agree;
    - the KS z depends on the simulated sample size, so judging always
      uses the same number of simulated ants;
    - a better score is a reason to prefer a structure, not evidence for a
      specific biological mechanism; STATUS wording follows that.
  - **E2 cascade** (reinforced): adopting any new E1 walker invalidates the
    E2 calibration until checked — rerun `reportE2.ts` on several seed
    batches; if any fit target moves beyond noise, refit M_a before 3c.
- **2026-10-08** Held-out test protocol for Bonavita et al. 2026 (frozen
  before any statistic is computed on those tracks):
  - **Units and dependence:** the ant is the unit; each ant's white and red
    tracks stay together (paired). SEs by a colony-stratified cluster
    bootstrap over ants; a leave-one-colony-out jackknife is reported as a
    sensitivity check, and with three colonies colony-level effects cannot
    be estimated, which the report must say. The 119 tracks are never
    treated as independent.
  - **Primary condition:** white light (closest to an ordinary lit room);
    red light secondary. The model has no light dependence, so the paired
    light difference is reported descriptively, not as a test.
  - **Geometry and pipeline:** each simulated ant starts at the matching
    recorded ant's first tracked position in a 250 mm-radius circular
    arena; a track ends at 180 s or on reaching the wall (centre distance
    ≥ 245 mm), in data and simulation alike; then the unchanged
    `KHUONG_PREP` (start 10 mm from the first point, end at 200 mm from it)
    and the same statistics (`e1Compare` scalars, `walkDiagnostics`
    checks). Exit times are therefore censored identically on both sides.
  - **Observer:** tracking noise estimated on these data with the same
    estimator and deconvolved as for Khuong (an observation-model
    calibration, not a behavioural one); pixel quantisation (≈ 0.24 mm)
    is part of that estimate.
  - **Conditions:** 25 °C vs 26 °C in Khuong; the walker has no
    temperature dependence and no correction is applied. A speed failure
    is reported as such, with this caveat.
  - **Criterion:** the E1 development-test rule (no statistic |z| > 3; at
    most 2 of ≈ 24 with 2 < |z| ≤ 3), combined-SE z with the bootstrap
    above; checks reported alongside. Run once, on the walker adopted at
    the end of step 5; reported whatever the outcome; afterwards the data
    are development.
- **2026-10-08** Step 5: speed-resolved turning moves into the E1 fit
  (user decision after the B vs A0 result; pre-registered before any fit
  with the new loss):
  - **Why:** the loss had no speed-resolved turning statistics, so the
    fits could not see the structure the checks expose (B kept its
    time-based terms small). With held-out flat-ground data now available
    (Bonavita et al. 2026), the independent test of the flat walker moves
    there, and these statistics can become fit targets.
  - **New loss families** (fit-z with bootstrap SE_data, every incline; a
    statistic the data cannot estimate at an incline, e.g. < 10 stops in a
    bin, is left out there, not penalised):
    `turnBig` (P(|turn| > 0.5 rad) per 2.5 mm chord, 5 speed bins),
    `turnMed` (median |turn|, 5 speed bins), `antTurnSlope` (per-ant slope
    of log(1 − ⟨cos⟩ at 10 mm) on log median speed), `stopTurn` (⟨cos⟩
    heading into vs out of stops, < 0.4 s and 0.4–1.2 s). 11 → 15 families.
  - **Remaining checks, never fitted:** ⟨cos⟩ at 5 and 50 mm and kurtosis
    by speed bin, steering drift, alignment by displacement, downhill
    exits, radial/returns, log-speed decomposition, longer stops.
  - **Comparison:** refit A0 and B with the new loss and the same search;
    decision as before (paired difference over 5 fresh batches > 2 SE, and
    lower Σz² of the remaining by-speed checks — cos5, cos50, kurtosis — at
    ≥ 4 of 5 inclines), provisional in the sense of the review notes.
  - **Held-out criterion amended accordingly** (before any inspection):
    the rule "no |z| > 3, at most 2 of ≈ 24 marginal" becomes "no |z| > 3,
    at most 10 % of the statistics marginal" over all `compareE1` rows.
- **2026-10-08** Pool size follows free memory (tooling; results
  unaffected): `SimPool` defaults to min(cores − 1, (MemAvailable − 1 GB) /
  350 MB) workers (`defaultWorkers` in `scripts/pool.ts`; E1 workers
  measured at ≈ 270 MB RSS) and says so on stderr when memory is the limit.
  Why: two concurrent E1 fits started 30 workers on a 16-thread, 16 GB
  laptop and pushed it into swap. Two fits launched at the same moment both
  see the same free memory, so give each `SIM_WORKERS` ≈ half the cores.
- **2026-10-08** Two exploratory E1 checks (user request; Khuong data only,
  already fit/development; Bonavita held-out untouched; adopted A0 fit and
  candidate B, both through the tracking observer). Predictions written
  before running:
  - **Reorientation at stops:** ⟨cos⟩ heading in vs out of a stop by finer
    stop-duration bins, plus the change in alignment with downhill and with
    the release direction across the stop. A reset at stops predicts low
    ⟨cos⟩ even for the shortest stops in the data; diffusion while stopped
    predicts a decay with duration; the model (no stop mechanism) should
    stay high. A downhill or homeward shift ties the reset to C or G.
  - **Trait vs instantaneous speed–turning:** slope of log(1 − ⟨cos⟩ at
    10 mm) on log speed between ants vs within ants (ant fixed effects,
    within-ant speed terciles; speed from arc length / moving time, which
    avoids the "turns shorten displacement" artefact). B predicts within ≈
    between; a correlated per-ant turning trait predicts between steeper
    than within.
  - **Results** (600 simulated ants per incline; `scripts/diagE1Stops.ts`;
    z = combined):
    - **Reorientation at stops: confirmed, at every incline.** For real
      stops (0.13–0.8 s) the data's ⟨cos⟩ in vs out is 0.03–0.41 (mostly
      0.1–0.3); A0 0.64–0.81, B 0.57–0.79 (z 1.8–9.3). It is already low for
      0.13–0.25 s stops and shows no decay with duration: a reset on
      stopping, not diffusion while stopped. B's per-time terms do not
      produce it. Not downhill-directed (|Δ| ≤ 0.11, |z| ≤ 2.5); a weak,
      noisy homeward tendency (out-heading vs release direction 0.08–0.23
      at 0–30°, model ≈ 0).
    - **Side finding, stop durations:** the data's stops (with movement on
      both sides) are almost all < 0.25 s (0°: 296 of 325); the model's are
      long (A0 0°: 464 of 997 over 0.4 s). The stopped fraction matches via
      fewer, longer pauses. Check the pause-duration distribution directly.
    - **Side finding, homing via reversals:** most stop episodes are < 0.13
      s and are sharp reversals (⟨cos⟩ in vs out ≈ 0 in data and model).
      Over all stops, the data's new heading points towards the release
      point (⟨cos⟩ +0.21/+0.24/+0.16 at 0/20/30°, +0.03/+0.08 at 45/60°);
      the model's do not (−0.04 to +0.08; z −2.3 to −5.7 at 0–30°).
      Homing may act through the direction of big turns; relevant to the
      near-release drift gap and to G.
    - **Trait hypothesis: rejected.** Within-ant slope (arc speed) −3.6 /
      −2.9 / −2.8 / −2.1 / −1.9 is much steeper than between-ant −0.62 /
      −0.60 / −0.62 / −0.37 / −0.46, the opposite of the trait prediction;
      the displacement-speed version agrees. No per-ant turning trait.
    - **But the within-ant coupling is the largest gap found so far:** A0
      −0.30 to −1.53, B −0.33 to −1.39 (z 12–22; B no better than A0).
      Per-time heading noise (B) gives at most ≈ −1, so B cannot reach −2 to
      −3.6 at any parameter values. Candidates: turn-linked slowing (ants
      decelerate for turns) or the slow-tortuous mode F. Distinguishing
      observation: speed time course around big turns (short dip centred on
      the turn → motor coupling; dwell and lag → F).
- **2026-10-08** Refits of A0 and B with the 15-family loss **stopped**
  before finishing (user decision). The exploratory checks above show
  that neither structure has a heading reset at stops or the steep
  within-ant speed–turning coupling, so their comparison under the new
  loss would mostly measure which wrong structure distorts less. The
  15-family loss stays as pre-registered and will be used for the next
  candidate. Order of work:
  - observational checks first (other session): pause/stop-duration
    distribution; speed time course around big turns (short dip centred on
    the turn → turn-linked slowing; dwell and lag → two-state F);
  - then pre-register one combined candidate (heading reset at stops,
    corrected pause-duration distribution, the coupling the checks support,
    B's per-time terms only if still needed) and fit it against A0.
- **2026-10-08** Review of the exploratory stop/trait checks
  (`scripts/diagE1Stops.ts`; reproduced exactly, 600 ants, adopted fit):
  - **Homeward redirection at stops is not reversal geometry.** If the
    turn at a stop were independent of where home lies, ⟨cos(out − home)⟩
    would be ⟨cos Δ⟩ · ⟨cos(in − home)⟩: ≈ 0.00 / +0.04 / −0.01 at 0/20/30°.
    The data show +0.21 / +0.24 / +0.16 (model ≈ 0.01). At 45/60° the
    excess is small (+0.03 / +0.08 vs predicted −0.03). So ants redirect
    homeward when they stop, and less on steep slopes (cf. G).
  - **Speed–turning coupling is not a by-product of stops.** Excluding
    every 10 mm segment within 0.4 s of a stop, the data's within-ant slope
    is −3.9 / −3.3 / −3.0 / −2.4 / −2.0 (all segments: −3.6 … −1.9); the
    model's is unchanged (A0 −1.6 … −0.3, z 13–20). Reset at stops and the
    steep coupling are separate phenomena; a candidate needs both.
    Without stop-adjacent segments the between-ant slope shrinks (0°
    −0.52, 45° −0.00, 60° +0.09): part of it came from how often ants
    stop.
  - Caveat for interpreting slope values: smoothing cuts corners, so
    tortuous segments get a lower measured arc speed. That inflates the
    within-ant slope on both sides (A0 has no speed-dependent turning, yet
    shows −0.3 to −1.6), so compare data with model rather than with
    theoretical values such as "−1 for per-time noise".
