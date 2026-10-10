# Project status

_Last updated: 2026-10-10 (session 3: step 4 — E6 rule and pre-registration done; Mailleux 1999 calibration implemented, not run; see RESUME and the Decisions log). Keep this file current: update it whenever a step starts or finishes._

## ▶ RESUME HERE

**State (2026-10-09).** Milestone M1 (*Lasius niger* as the single
reference species). TypeScript simulation core, tested (`npm test` fast
tier ~45 s, `npm run test:full` adds the slow tier, run in CI); pages open
on precomputed results; work is committed on `browser-sim-m1` and merged to
`main` (GitHub Pages) when the user asks.
- **E1 (walking): fine-scale fitting is paused by decision (2026-10-09).**
  The fitting procedure is validated (acceptance test passed; joint fitting
  recovers predictions at all five inclines on synthetic data, staged does
  not, so joint is adopted). The walkers still miss fine-scale turning
  (z 10–20), but **E2 is insensitive to the walker** (five walkers, max
  |Δz| 0.8), so that structure does not matter for M1's purpose. Today's
  diagnostics: every walker, including the Khuong reference walker, turns
  25–40 % too little at fine time scales (observer/stride-sway question);
  T's speed–turning coupling has the wrong scale dependence; the 34–35 fit
  statistics carry ~5–8 independent dimensions. Running: signature
  reachability sweep (step 2) and the rerun of the joint 69-ant recovery
  cell. Parked: renewed A0 vs T comparison, model-recovery pilot
  (`selectE1.ts` draft).
- **E2 (drinking, trail laying): provisional model adopted for colony
  development** (user decision 2026-10-09): **L0S1c** (`e2-3d-L0S1c.json`;
  baseline desired volumes, its 2009 cohort scale 0.739 only when
  reproducing 2009), alternative **L0S1** (`e2-3d-L0S1.json`); step-4
  results are reported under both. Not validated: L0S1c was a diagnostic,
  its restart did not converge, the within-2009 contrasts fail (z up to
  ±4), the 2000 laying-vs-drop-size series is flattened, giving-up times
  are too long; external E2 validation (Mailleux 2005, held unread) still
  to be frozen and run. Steps 3c / 3d and the between-study re-judging are
  in the Decisions log (2026-10-09). No further laying family without a
  distinguishing prediction (persistent propensity vs no feeding effect).
  Scripts that rebuild step-3 fits use the legacy layer (`E2_LEGACY_*`).
- **E6 / colony (step 4): started 2026-10-09.** Done: the t-based E6
  rule (df 4; Welch–Satterthwaite reported; F-test spread); the TEC rerun
  through the 'after' observer (`e6-tec.json` rewritten); per-ant
  distributions as a Monte Carlo KS test (`e6PerAntCompare`; rejects all
  one-caste models and TEC delta, which the colony means could not). E6
  ran at **22 °C** (25 °C had been assumed; corrected). Pre-registered
  (user decisions 2026-10-09): walking × 0.781 temperature only (sensitivity
  × 1, × 0.289), crop absorption 0 (sensitivity 0.05 /h first-order), L0S1c
  main / L0S1 alternative, N 53, ≥ 200 colonies, per-ant verdict = omnibus
  Σ D. **Mailleux 1999 calibration protocol approved** (Decisions log,
  last entries): k = 6 (`nestSpeedFactor` in the nest, a new return-to-
  source hazard `returnRate`, `shareRate`, `shareEnd`, `receiveReserve`,
  1999-only density), 15 fit rows (Table 2a × 1/4/8 d), Table 2b
  development. **Implemented 2026-10-10, not run** (`scripts/fitM1999.ts`;
  implementation details logged). Cost ≈ 750–2300 core-h per layer as
  set: **next** a budget decision (fewer generations / recruiters, spatial
  index), then rent the box for the two calibrations (L0S1c, L0S1); then
  the E6 test (development benchmark). In parallel:
  freeze the E2 external-validation protocol on Mailleux 2005 (held
  unread).
- **Judging:** a candidate missing a statistic the data estimate is
  unjudgeable (2026-10-09 fix; no earlier ranking was affected).
- Commits: plain messages, no co-author lines; ask before committing.
  `side-projects/` is the user's own scratch area (excluded locally via
  `.git/info/exclude`, outside tsconfig/vitest) — leave it alone.

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
4. **E6 encounter-based model** (bounded version implemented 2026-10-08, provisional; calibration and the E6 test wait for the walking decision):
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
5. **E1 structure revisit** (session 3; **fine-scale fitting paused 2026-10-09**, see the Decisions log: E2 is insensitive to the walker; remaining E1 work is the diagnostics of the reduced plan). Done so far:
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
   - Done since: speed-resolved turning in the fit (15-family loss); T
     vs A0 (T not preferred, under the old fitting procedure); per-purpose
     random streams; CMA-ES; reference walkers (Decisions log).
   - **Now (Decisions log, "Review notes on the next phase"):** bounded
     staged-vs-joint fitting comparison on synthetic data (T truth; large
     and 69-ant references; prediction recovery primary,
     `scripts/recoverE1.ts`); then one renewed A0 vs T comparison with
     the chosen strategy; then the E2 sensitivity to plausible walkers,
     which decides whether E1 work stops (stopping condition). C, D, G
     deferred until then. The Bonavita held-out test runs only after all
     of this, on the adopted walker, with the reference walkers as frozen
     secondary benchmarks.
   - Reference-walker slope threshold sensitivity (pre-registered
     alternative ε): `reportE1Ref.ts --segments
     data/reference/khuong-segments-alt.json` vs default.
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
    been read; no statistic has been computed on the tracks. **Correction
    (2026-10-08):** the paper's *summary* results for this experiment were
    seen before registration: `slope-walking.md` §1.5 (session 2) quotes
    them (homeward bias persists under red light for speed and λ only; ants
    walk faster heading back, ES ≈ 1.7–2.3 mm/s), and that note was read at
    the start of session 3. No model has been compared with them and the
    frozen test statistics do not include direction-to-start effects; if
    such a statistic is ever added it counts as contaminated. It will test the flat-ground walker adopted
    after step 5, under a protocol written down before the first
    computation (geometry, start/end criteria, observer calibration with
    the same noise estimator, white light primary).
  - **Possible exposure (2026-10-08, literature check):** a web-page
    summary of Bonavita et al. 2026, requested for the Khuong re-analysis
    only, also returned one sentence of unclear origin: "Experimentally,
    ants required 4.06 times longer to achieve 200mm net displacement
    compared to isotropic models". It may describe the new experiment. No
    other result on the held-out data was seen; the number is not used
    anywhere. Treat a net-displacement or MSD statistic as contaminated if
    it is ever added to the held-out test.
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
    Mailleux et al. 2000 volume series: ~~paywalled, not obtained~~
    **read in full on 2026-10-09 (user supplied the PDF; requested by
    Claude for the Pl question without flagging that it was listed here as
    a held-out candidate). It is now development.** Seen: per-volume trail
    fractions, giving-up times by trail group, visits, velocities, volumes
    (Decisions log 2026-10-09). No model had been compared with it before
    reading. Remaining fresh E2 candidates: Beckers et al. 1993, Detrain &
    Prieur 2014, Portha et al. 2004; Mailleux et al. 2005 (successive trips)
    is held unread pending the user's decision.
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
    but **no model has been run against them**. ~~E6 remains **held-out** for
    our encounter-based model.~~ **Relabelled a development benchmark
    (review, 2026-10-09):** the TEC comparisons and the observed early-event
    delay have informed spatial-model expectations, so the E6 outcomes are
    not untouched, although the encounter model has not been run on them.
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
    between-colony SD separately. _(Review 2026-10-09: that z is t-like with
    ≈ 4 df, not normal; convert to a normal-equivalent z through t with
    Welch–Satterthwaite df before applying the 2 / 3 cut-offs.)_
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
  - Fitted mean free path 10.1 mm and g = 0.60, close to Khuong et al.'s
    segmentation estimates (10 mm, 0.6). **Withdrawn (2026-10-09) as a
    consistency check:** segment statistics are apparent quantities that
    depend on the segmentation threshold (the published code gives ≈ 17 000
    segments where the paper reports 24 456) and on sampling (Rosser et
    al.); T fits λ 39 mm; and recovery shows the turning split is not
    identified from flat ground.
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
- **Cost of colony calibrations (Mailleux 1999, 2026-10-10):** every
  recruiter run simulates the whole nest (all nestmates perceive and move
  every 0.1 s; contacts are pairwise, so cost grows with the square of the
  density) for a 300-s warm-up plus up to 1200 s, and a fit is ≈ 5000
  evaluations × 240 recruiters. Near the optimum a recruiter stays
  ≈ 100 s, so ≈ 75 % of each run is the unmeasured warm-up. **Before the
  next colony recalibration:** warm each nest once and start several
  recruiters from copies of it (needs the save/restore item below; the
  copies must keep per-ant streams so results stay reproducible and the
  recruiters' independence is stated). Expected ≈ 3–4× near the optimum.
  Other levers: a larger dt only after a convergence test; a surrogate
  model to cut evaluations.
- **Not yet done from the original M1 plan:**
  - State save/restore with a reproducibility test (only determinism is
    tested). Also needed for shared warm-ups (item above).
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
  - **Data orientation and tilt (review 2026-10-09):** "+y is uphill" in the
    Khuong data is still an assumption (the simulation puts downhill at −y).
    The adopted fit has no polar (downhill-specific) term, so today it
    affects only the downhill-exit reading and any future polar candidate.
    Separately, the data's alignment axis is tilted 10–20° from the image y
    axis at 20–45°, but `alignY` is measured against image y for the data and
    against the exact slope axis for the simulation: the fitted alignment
    target is biased low by ≈ cos 2·tilt (0.77–0.94). To settle before E1
    resumes and before the Bonavita held-out test (orientation from the
    paper's figures or the authors' code; tilt-corrected `alignY`, or a
    pre-registered tilt term).
- **E2 observation model:** volume estimates are clipped at 0
  (`Math.max(0, est)`), an unsourced assumption that raises short-bout
  volumes and the per-drop intercepts and creates ties at 0 in the per-drop
  rs (now fit rows). Whether the experimenters reported negative gaster
  differences is unknown.
- **E6:** our contacts end when food stops flowing; the observer sees
  mandible contact (step-4 note).
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
- **2026-10-08** Two more exploratory E1 checks (Khuong data only; this
  session takes over from the other one). Predictions before running:
  - **Stop durations** (`sp` < 2 mm/s episodes, as in `diagTrack`), as
    episodes per minute of track by duration bin. The model's exponential
    pauses (mean 0.7 s) should give too few short and too many long stops;
    if the data's excess is all in < 0.13 s it may be reversals rather than
    halts (those also form "episodes"), so the 0.13–0.4 s bins decide the
    pause-duration question.
  - **Speed around big turns** (turn > 1 rad between the 0.2 s
    displacements before and after a sample, local maxima only): each
    ant's 3-point speed divided by its median moving speed, averaged at
    lags −2 … +2 s from the turn.
    - Turn-linked slowing (motor coupling): a dip centred on the turn,
      ≈ 0.2–0.6 s wide, roughly symmetric, back to baseline within ≈ 1 s.
    - Two-state switching (F): a broad depression still visible at ±1–2 s,
      and big turns clustered in time (inter-turn CV > 1, more than speed
      changes alone explain).
    - A0/B: little beyond the geometric dip from the turn itself.
  - **Results** (`scripts/diagE1Turns.ts`, 600 simulated ants per incline,
    adopted fit A0 and B-loss11, combined z):
    - **Speed around big turns: turn-linked slowing, not F.** In the data
      speed falls to 0.45–0.56 of baseline at the turn and recovers within
      ≈ 0.3–0.4 s. On slopes it recovers more slowly after the turn than it
      fell before it (asymmetry +0.03 / +0.06 / +0.12 / +0.05 at 20–60°:
      slower after); on flat ground the dip is nearly symmetric (−0.03,
      slightly faster after). [Corrected the same day: first written as
      "+0.03 … +0.12" for all inclines.] At ±1–2 s it is back at
      baseline (0.99–1.00 at 0–30°; 0.93–0.95 at 45–60°, a weak broad
      component on steep slopes). Big turns are not clustered (inter-turn
      CV 0.89–1.00, 1.10 at 60°). Both models show the opposite: speed
      around turns *above* baseline (1.04–1.45; per-distance turning puts
      more turns into fast stretches), with only the geometric dip at the
      turn (0.75–0.99), z up to 50. Reading: turn timing is independent of
      the slow speed fluctuations (as for events in time), and each turn
      carries a short deceleration.
    - **Stop durations:** at 0–30° stops ≥ 0.4 s occur at the model's rate
      (|z| ≤ 1.6); the data's excess is in < 0.4 s episodes (3–4× the
      model), i.e. the deep dips at sharp turns. At 45–60° the model has
      too many long pauses (0.8–1.6 s: z 2.3–6.9). The pause process is not
      the main problem; the brief halts belong to the turn mechanics.
- **2026-10-08** Step 5 candidate **T** (turn-coupled walking)
  pre-registration (before implementation and any fit):
  - **Structure:** B (per-distance λ, jitter; per-time μ_t, D_t;
    `slopeJitterK` fixed 0) plus
    - **turn-linked slowing:** each reorientation of angle Δ sets the
      ant's dip state u ← max(u, a·(1 − cos Δ)/2); speed is v·(1 − u), and u
      decays as e^{−t/τ} (a reversal nearly halts the ant; small turns
      barely slow it);
    - **heading reset at pause onset:** new heading = old + wrapped Cauchy
      (g_stop), then a homeward pull of strength `stopHomePull`·homeW; the
      reset counts as a turn for the dip.
    - Event timing is exact in continuous time with the decaying speed
      (separate distance and time clocks; per-time diffusion uses time
      walked). k = 19 + 4 = 23 (a, τ, g_stop, stopHomePull; all stage 1).
  - **Baseline:** A0 refitted under the 15-family loss (same search).
    T's second start is B's ridge start with the same new-parameter
    starting values.
  - **Checks, never fitted:** speed around big turns (dip, 1–2 s shoulders,
    asymmetry), within-ant speed–turning slope with and without
    stop-adjacent segments, ⟨cos⟩ across stops by fine duration bins,
    homeward out-heading at stops, stop-episode rates by duration, and the
    by-speed ⟨cos⟩ at 5/50 mm and kurtosis.
  - **Decision rule:** T is preferred over A0 if the paired fresh-batch
    flat-loss difference is below −2 SE (also after the heuristic 2k
    penalty) and the Σz² over the checks is lower at ≥ 4 of 5 inclines.
    Provisional in the sense of the review notes; homing weakening on
    slopes (G), C and D come after.
- **2026-10-08** Literature check for T and G (while the A0/T fits ran):
  [`docs/research/stops-turns-literature.md`](research/stops-turns-literature.md).
  Pause-linked reorientation (locusts, *A. gracilipes*, scanning desert
  ants) and slower turning via inner-stride shortening are documented, but
  nothing gives sizes or time courses for *L. niger*. One model (Freas &
  Wystrach 2025, not read) puts the causality the other way, speed
  inhibition → turning, which would explain the reset and the coupling
  together; a finer speed–heading lead–lag check can separate the two.
  Desert-ant path integration is accurate on slopes up to 45°, so nothing
  in the literature predicts suppressed homing at 20–45° (G). One possible
  held-out exposure logged in the contamination log.
- **2026-10-08** Reference baselines for E1 (user decision: port the
  published walkers of Khuong et al. 2013 and Bonavita et al. 2026, as TEC
  was ported for E6). Plan, decided before any code:
  - **Source:** the authors' own scripts (Zenodo 10.5281/zenodo.19203503,
    CC BY 4.0, md5 as in `data/bonavita2026/README.md`): `5-K_np_simulations.R`
    (simulation), `2-K_compute_boltzmann_variables.R` (segment variables),
    `botupsegMAE.cpp` (Khuong's bottom-up segmentation, CeCILL 2.1). Only
    the Khuong-side files were extracted; the archive's red/white-light
    tracks, results and figures were not opened.
  - **Model:** non-parametric sectored Boltzmann walker. Each step draws
    one recorded segment (length l, turn ω, duration l / v_seg) from the
    pool of the current heading sector (8 sectors centred on 0, π/4, …).
    Frames: `xy` (sectors fixed to the arena axes; on slopes these are the
    up/down/horizontal sectors of Khuong's Algorithm 3) and `start`
    (Bonavita's Φu: sectors relative to the direction back to the
    release point; flat ground only, as published). Start at the origin
    with a uniform heading; stop on crossing r = 200 mm. Positions sampled
    every 0.04 s along the segments (their `subsample`), then the tracking
    observer and the usual preparation, as for our models.
  - **Quirks reproduced (`compat: true`), fixed with `compat: false`:**
    the drawn length belongs to the segment *after* the drawn turn but is
    walked on the current heading; the first `start`-frame step uses the
    `xy` sector.
  - **Segmentation port** checked against their C++ compiled from source
    (not the binary in the archive) on the 69 flat tracks: identical
    vertices required. Flat pools use their ε = 1.7 mm. Slopes: ε scaled
    by mean speed, ε_γ = ε·c̄₀/c̄_γ (Khuong's text); c̄ = total path / total
    time of the raw tracks per incline — a reconstruction, Khuong's code is
    not public. The repo's Khuong copy is rounded to 0.01 mm; flat pools
    are also built from their full-precision files to measure the effect.
  - **Evidence role:** the pools are built from all Khuong data at every
    incline, so these baselines are judged in-sample everywhere, with no
    parameters to fit. The fair comparison with our walkers is the
    held-out Bonavita experiment; adding the baselines to the frozen
    held-out protocol is an amendment for the user to decide before any
    held-out computation.
- **2026-10-08** **T vs A0 (pre-registered judgement; both under the
  15-family loss; `judgeE1.ts`, `diagE1Turns.ts`, `diagE1Stops.ts
  [--clean]` with `--fits A0=…,T=…`):**
  - (i) flat loss, 5 fresh batches: A0 290.0 ± 2.3, T 162.2 ± 2.5; paired
    T − A0 = −127.8 ± 1.2 (−115.8 after the 2k penalty). Met.
  - (ii) total Σz² over the pre-registered checks lower for T at **1 of 5
    inclines** (0°: 1849 vs 2025; 20°: 1560 vs 1442; 30°: 5340 vs 3033;
    45°: 5588 vs 4289; 60°: 6900 vs 3186). **Not met: T is not preferred.**
  - By check group, T vs A0: turning across stops better at 5/5 (data
    0.1–0.36, T 0.04–0.22, A0 0.55–0.80); stop-episode rates better at 5/5;
    speed around turns better at 4/5 but the dip stays too shallow (T
    0.66–0.71, data 0.45–0.56) and the flat asymmetry has the wrong sign;
    homeward out-heading fixed at 0–30° (z ≈ 0) but T keeps the same pull on
    steep slopes where the data have almost none (z 3.5 / 6.4 at 45/60°:
    homing must weaken on slopes, G); within-ant slope mixed; by-speed
    ⟨cos⟩ at 5/50 mm and kurtosis much worse on slopes (30°: 4845 vs 2465,
    60°: 6282 vs 1049), which dominates the total. Post-hoc reading (not a
    reason to override the rule): T's turning per unit time (μ_t 3.5/s, D_t
    0.23 rad²/s, λ 39 mm) is fitted on flat ground only, so on slopes, where
    ants are 2–4× slower, it becomes far more turning per mm, with nothing
    on slopes to compensate (slopeJitterK removed; C, D, G not yet in).
  - **Fitting problem found:** T's new parameters ended at their starting
    values (turnDip 0.60, τ 0.25 s, g_stop 0.23, stopHomePull 0.28). A grid
    scan on flat ground (`scanE1.ts`, 640 ants, fit seeds) gives 124.7 at
    the fitted point but 148–238 at its neighbours, and irregular values
    over g_stop × stopHomePull. Cause: **common random numbers do not hold
    for this simulator.** The number of draws an ant uses depends on the
    parameters (turns, pauses), so after any parameter change the rest of
    its random sequence shifts and each evaluation effectively uses new
    random numbers. Nelder–Mead on this noisy objective settles on lucky
    points (T: 124.7 on its own seeds vs 162.2 fresh; B: 94 vs 114; A0:
    254 vs 290). Every E1 fit so far, including the adopted session-2 fit,
    is affected; the fresh-batch judging guards the comparisons, but the
    parameter values are not reliable optima.
  - **Proposed next (not started):** (1) per-purpose RNG streams per ant in
    the walker (speed process, distance clock, time clock, turn angles,
    jitter, pauses, stop resets), so a parameter change leaves the other
    streams aligned and CRN works as intended; (2) an optimiser for noisy
    objectives (e.g. CMA-ES with fresh-seed re-evaluation of the best
    points) or averaging over seed sets; (3) only then complete the slope
    structure (C, D, G) and re-run the T comparison, pre-registered anew.
  - **Done (same day):**
    - `src/sim/reference/khuongSegmentation.ts` (port of botupsegMAE): the
      same vertices as the C++ compiled from source on all 69 flat tracks,
      once the C++'s double read of the last point is reproduced
      (`test/reference.test.ts`, fixture of the two shortest tracks).
      Rounding of the repo's copy to 0.01 mm: 96.8 % of vertices identical,
      17 020 vs 17 017 vertices, mean segment length 14.681 vs 14.685 mm.
      (Khuong et al. report 24 456 flat segments; the published code gives
      ≈ 17 000 at the same ε — a paper/code difference, not a port error.)
    - Slope ε (c̄ from raw path length, which tracking jitter inflates at
      low speed): 1.70 / 2.19 / 2.64 / 3.57 / 4.02 mm. The research note's
      reading (≈ 5–6 mm at 60°, from Khuong's speed medians) is larger; the
      slope pools are sensitive to this choice.
    - `src/sim/reference/sectoredWalker.ts`, `scripts/segmentKhuong.ts` →
      `data/reference/khuong-segments.json`, `scripts/reportE1Ref.ts`
      (pool tasks `sectored`, `sectoredSummary`).
  - **Results** (`reportE1Ref.ts --fits walk,A0,T`, 600 ants, combined z;
    T and A0 are the 15-family fits finished today — this is not the
    pre-registered T vs A0 decision):
    - **Port reproduces the published findings** on flat ground: time to
      leave 200 mm, data 49.2 s; Khuong walker 14.6 s (≈ 3.4× too fast, as
      Bonavita et al. report for the isotropic walker); Bonavita Φu
      (`compat`) 48.6 s (z −1.6). With the two quirks fixed the Φu walker
      becomes too slow (78.9 s, z +4.7): the published behaviour depends on
      the length/turn mismatch.
    - **Overall, both baselines are far worse than our walkers** on the
      E1 statistics at every incline (Σz² over compareE1 rows, khuong vs
      our best: 3434 vs 316 at 0°, 3216 vs 642, 1878 vs 1007, 3588 vs 2092,
      4633 vs 1837; bonavita at 0°: 2953), although they resample the very
      segments they are judged against. Failures are structural: straight
      constant-speed segments (no fine-scale turning, no stops, heading
      kept "across stops"), no between-ant speed differences (pooled
      resampling), outward radial drift (Khuong) or too-weak homing at
      20–40 mm (Bonavita, z 10.8).
    - **Where the Khuong walker beats ours:** the by-speed turning checks
      (⟨cos⟩ at 5/50 mm, kurtosis by speed bin) at 0–30°: Σz² 541 / 788 / 649
      vs our best 1181 / 879 / 1469; tie at 45° (1424 vs 1423); worse at 60°
      (1895 vs 703). Resampled real segments carry the observed coupling of
      turning and speed, which our walkers still miss.
    - **Bonavita's Φu at 0°** is also better than ours on the by-speed
      checks (Σz² 1086, 840 with quirks fixed, vs our best 1181) and
      matches exit time about as well as A0 (z −1.6 vs −0.8; T −3.1); on
      the compareE1 rows overall it is far worse (Σz² 2953 vs 316).
- **2026-10-08** Licence and wrap-up of the reference-walker work (user:
  "whatever is permissive"):
  - The repository is **MIT** (`LICENSE`); third-party data and adapted
    code keep their licences, listed in `NOTICE.md` (CC BY 4.0: Khuong,
    Bles, Bonavita data; TEC and sectored-walker ports adapted from CC BY
    material).
  - The Khuong segmentation port derives from `botupsegMAE.cpp` (CeCILL
    2.1, copyleft), so it cannot be relicensed MIT: it stays **local only**
    (`src/sim/reference/khuongSegmentation.ts`, `scripts/segmentKhuong.ts`,
    `test/local/`, excluded via `.git/info/exclude`). Committed: its output
    (`data/reference/khuong-segments.json`) and the C++ output fixture; the
    sectored-walker test now builds segments from the C++ vertices in the
    fixture. To regenerate, compile the authors' C++ from the Zenodo
    archive.
  - Contamination log corrected: the paper's summary of the red/white
    experiment had been read (via `slope-walking.md` §1.5) before the
    held-out registration.
  - **Open, for the user:** (a) whether the reference walkers join the
    frozen held-out protocol on the Bonavita data (an amendment; nothing
    computed yet); (b) slope segmentation thresholds (ε 2.2–4.0 mm) are a
    reconstruction of Khuong's speed scaling, and slope results of the
    reference walkers are sensitive to it.
- **2026-10-08** Fitting machinery, step 1 of the proposal above (decided
  before implementation): the walker draws from **per-purpose streams**
  derived per ant at `initWalkState` (speed process, distance clock, time
  clock, turn angles, heading jitter, pause onset and duration, stop
  resets). Applies to every caller (E1 and the E2 forager), so E2 results
  shift by seed noise only; checked with `reportE2.ts` before and after.
  Success measure: the loss along a one-parameter line (T fit, flat, fit
  seeds) becomes smooth: neighbour-to-neighbour jumps well below the
  fresh-batch SD, instead of the 20–100 jumps seen in the scan above.
  - **Result:** done (`WalkState.r`; initial traits drawn as a fixed number
    of standard normals scaled by the parameters; `walkStep` no longer
    takes an RNG). Loss along turnDip × turnDipTau (T fit, flat, fit seeds,
    640 ants): old single stream 124.7 at the fitted point with neighbours
    up to 167 and no trend; per-purpose streams 152–185 (the fresh-batch
    level) with a clear trend (loss rises with turnDip above ≈ 0.55).
    Neighbour jumps shrink only modestly (mean ≈ 7, max 11, vs ≈ 10 / 24),
    about the fresh-batch SD: the seed-chasing spike is gone, the residual
    roughness (segment-count-dependent jitter draws, finite ants) is left to
    a noise-robust optimiser. E2 (`reportE2.ts`) shifts by seed noise only
    (|Δz| ≤ 1.2, typically ≈ 0.3; no verdict changes). All earlier E1/E2
    numbers were produced with the single stream; they are reproducible
    from git history, not from the current code.
- **2026-10-08** Fitting machinery, step 2 (decided before implementation):
  **CMA-ES** (`src/sim/analysis/cmaes.ts`, standard (μ/μ_w, λ) update after
  Hansen's tutorial) replaces Nelder–Mead for E1 fits.
  - The population of a generation is evaluated in parallel on the pool.
  - Seeds are **fresh in every generation** and shared within it (ranking
    on common random numbers, no accumulation of seed luck across
    generations); the estimate is the final **distribution mean**, not the
    best point seen.
  - Validation before any model comparison uses it: unit tests (sphere,
    Rosenbrock, noisy sphere), then a **parameter-recovery test** on data
    simulated by the model itself (69 ants, the Khuong sample size, known
    parameters; refit from a perturbed start; recovered vs true values
    and their spread over repeated recoveries). This also shows which
    parameters the E1 statistics can identify at all.
  - **Implemented** (`cmaes.ts`, unit tests: exact eigendecomposition,
    sphere, Rosenbrock, noisy sphere with noise redrawn per generation;
    `fitE1.ts --optimizer cma` default, `--recover truth.json --rep r`; the
    recovery output also records the true parameters' own losses on the
    same data, the noise floor).
  - **Smoke test** (quick settings: 40/30 generations, 160 ants; truth =
    the T fit): stage 1 did not recover the turning split (λ 7.1 vs true
    39.5 mm; g 0.75 vs 0.65), and stage 2 then failed (60° loss ≈ 2470 on
    the model's own data). **Hypothesis (to test at full settings):** flat
    ground has too little speed variation to separate per-distance from
    per-time turning; slopes (2–4× slower) separate them. The two-stage fit
    fixes the turning split on flat ground alone, and no slope parameter
    can repair a wrong split. If confirmed, fits with time-based turning
    need a joint fit across inclines (and T's poor slope checks may partly
    be this).
- **2026-10-08** User decisions on the two open items above, and on order
  (logged before any computation they govern):
  - **Order:** parameter recovery is completed and the fitting strategy
    settled before anything is run on the Bonavita data. The adopted
    walker's held-out acceptance criterion stays exactly as frozen above
    (no |z| > 3; at most 2 of ≈ 24 statistics with 2 < |z| ≤ 3); nothing
    below changes it.
  - **Amendment to the frozen held-out protocol: reference walkers as
    secondary benchmarks** (frozen now, before any held-out computation):
    - Walkers: Khuong (`xy` frame) and Bonavita Φu (`start` frame, the
      start being each simulated ant's own release position). **Primary:
      the published-compatible versions (`compat: true`); sensitivity: the
      corrected versions (`compat: false`).**
    - Pools: the flat pools of the committed
      `data/reference/khuong-segments.json` (ε = 1.7 mm on the repo's
      Khuong copy), as at commit f4a4a26. No refit, nothing derived from
      the Bonavita data except the observer.
    - Geometry, stop rule, observer, preparation and statistics identical
      to the adopted walker's: start at the matched recorded ant's first
      position with a uniform heading, end at 180 s or at centre distance
      ≥ 245 mm (segments truncated there, positions every 0.04 s), the
      tracking noise calibrated on the Bonavita data, `KHUONG_PREP`, the
      same `e1Compare` statistics and `walkDiagnostics` checks, same
      number of simulated ants and seeds, white light primary.
    - Reporting: per-statistic combined z for each benchmark, the same
      criterion evaluated and reported for each (descriptive), and Σz²
      over the frozen statistics and over the checks, ours minus each
      benchmark. No decision about our walker depends on the benchmarks.
      A statement "ours better/worse than benchmark X" on any statistic
      group is made only if the published-compatible and the corrected
      versions agree in sign; otherwise it is reported as sensitive to the
      published quirks.
    - **Disclosure:** the held-out report opens with the contamination
      log's exposure entries: the paper's summary of this experiment was
      read before registration (homeward bias under red light; faster
      homeward walking), and the possibly related "4.06× longer to reach
      200 mm net displacement than isotropic models" sentence. The
      exit-time statistic (`exit.ks`, time to 200 mm) is in the frozen
      set; its result, for our walker and the benchmarks, is flagged as
      possibly exposed.
  - **Slope segmentation thresholds of the reference walkers:**
    - **Default (unchanged):** ε_γ = 1.7 mm · c̄₀/c̄_γ with c̄ = total path /
      total time of the raw tracks of an incline: 1.70 / 2.19 / 2.64 /
      3.57 / 4.02 mm.
    - **Alternative, pre-registered here before computing it:** c̄_γ =
      Khuong et al.'s per-ant median average speed (Fig. 3A, distance /
      time including stops: 49 / 38 / 29 / 20 / 14 mm/s;
      `slope-walking.md` table), i.e. the note's literal reading: ε =
      1.70 / 2.19 / 2.87 / 4.17 / 5.95 mm. Same port, same tracks; flat
      pools identical by construction. Output
      `data/reference/khuong-segments-alt.json`.
    - **Comparison:** `reportE1Ref.ts` on both pool files with the same
      seeds, ants and our fits. For every slope result of the reference
      walkers (Σz² over compareE1 rows; over the by-speed checks; each
      vs our best walker), a conclusion is **robust** only if its sign is
      the same under both thresholds; otherwise it is reported as
      **uncertain (threshold-sensitive)**. This applies to the results
      already recorded above (Khuong walker better than ours on the
      by-speed checks at 20–30°, tie at 45°, worse at 60°) and to any later
      slope conclusion about the reference walkers. The held-out test is
      flat and unaffected.
- **2026-10-08** Review notes on the next phase, adopted (logged before
  implementation). Additional mechanisms (C, D, G) are **deferred** until
  the fitting strategy is settled, so existing mechanisms get a fair test
  first.
  - **"T not preferred" stands as recorded, but it is a failure under the
    previous fitting procedure** (single random stream, Nelder–Mead,
    staged flat-then-slopes), not evidence that turn-linked slowing or the
    stop reset cannot work. T is refitted and compared again below.
  - **Precision vs certainty:** the 5 fresh batches measure Monte Carlo
    precision of a model's score on this one data set. They do not include
    sampling of real ants and colonies, or refitting. A precise score
    difference can still support only a tentative biological conclusion;
    reports say which uncertainty a ± is. The spread of refits over
    recovery replicates at 69 ants (below) is the estimate of refit
    variability used when interpreting the renewed comparison.
  - **Bounded comparison: staged vs joint fitting, on synthetic data**
    (truth = `data/fits/e1-T.json`, variant T, CMA-ES, 640 ants per
    evaluation, as in a real fit). Four cells, replicate 0 each:
    - reference size: **large** (2000 simulated ants per incline; data SEs
      rescaled to the 69-ant equivalent, SE·√(2000/69), and KS rows use an
      effective reference size of 69, so loss weights and scale match a
      real fit) vs **69 ants** (the real sample size);
    - strategy: **staged** (stage 1 flat, then stage 2 slope parameters
      on 30°/60°; the current procedure) vs **joint** (one CMA-ES over all
      stage-1 and stage-2 parameters, loss = mean over the 0°/30°/60°
      losses, equal weights, ≤ 250 generations, same warm start).
    - Large-reference failure points to the procedure or to uninformative
      statistics; failure only at 69 ants means the data cannot identify
      everything.
    - **Prediction recovery is primary, parameter recovery secondary.**
      For each fit and incline (all 5, including 20° and 45°, which are
      never fitted): fresh 2000-ant simulations of the recovered and the
      true parameters on different seeds, scored with the fit loss against
      a 2000-ant truth reference (SEs at the 69-ant scale). Excess = loss −
      the truth's own loss (floor). **Recovered**: excess ≤ 0.25 per family
      on average and no family with mean z² excess > 1 (every family within
      ≈ 1 data SE). **Failed**: average > 1 per family or any family > 4
      (> 2 data SE). In between: approximate. Parameters that differ while
      predictions are recovered are reported as an identifiability
      ambiguity (e.g. per-time vs per-distance turning), not a failure.
    - **Decision rule:** staged stays if it recovers predictions at every
      incline on the large reference. Joint is adopted if staged fails
      there and joint does better (more inclines recovered; tie → lower
      total excess). If both fail on the large reference, the optimiser or
      the statistics are at fault, and no model comparison is run until
      that is resolved. The 69-ant cells are interpreted, not used for the
      choice. The chosen strategy is then checked once on A0 (large
      reference), and 2 more replicates at 69 ants (reps 1, 2) give the
      refit spread.
    - Caveat for real data: a joint fit lets slope misfit pull the flat
      parameters (the reason for staging). If joint is adopted, the flat
      loss of the joint fit is reported next to the staged one.
  - **Then one renewed comparison**, A0 vs T, both refitted with the
    chosen strategy, pre-registered anew before the fits.
  - **Stopping condition for E1** (to be made concrete after the renewed
    comparison):
    - The walking outputs that matter downstream are search time (time to
      reach a target or leave a region), encounter rates in a bounded area,
      and spatial occupancy (radial and wall-zone distribution).
    - Test how sensitive E2 (now) and E6 (once step 4 exists) are to
      plausible walkers (the adopted session-2 fit and the refitted A0 and
      T): rerun `reportE2.ts` with each.
    - If the downstream verdicts are stable (|Δz| < 1 on every target, no
      verdict change), E1 work stops with its remaining trajectory
      discrepancies documented as limitations. If they move, further
      walking work aims at the outputs that move them.
- **2026-10-08** UI: pages open on precomputed results (user request:
  "a pre-ran simulation should be loaded already"). `npm run build` runs
  `scripts/precompute.ts` for each page's default settings (E1: every
  incline, 300 ants, seed 1; E2: 150 scouts, every animated condition; E6:
  every model, 200 colonies) and the pages show those at once; Run, or any
  changed setting, simulates live as before. A precomputed file is used only
  if its request and the hash of the simulation inputs match the build, so
  the site never shows results of other code. The page computations moved to
  `src/worker/e*Compute.ts` (shared by the workers and the script). **The E1
  page now applies the tracking observer** (`khuongTracking`), as the
  scripts have since step 5.A; its z-scores now match `reportE1.ts`-style
  comparisons rather than the observer-free ones shown before. The E1 page
  sends the speed distribution as 1001 quantiles (same median) and omits
  per-sample arrays it never drew; the comparison uses the full statistics.
- **2026-10-08** Staged vs joint comparison, first cell (T truth, 69 ants,
  staged) — **optimiser failure, queue stopped:**
  - Stage 1 converged (σ 0.05) to a flat loss of 56.0 ± 1.1 on the fresh
    batches, where the true parameters score **17.8** on the same data: the
    optimiser did not minimise its own objective, so this is not a sample-size
    limit. The optimum it found explains speed variation by strong, slow
    turn-linked slowing (turnDip 0.90, τ 0.88 s; truth 0.60, 0.25 s) with a
    high base speed (84 vs 62 mm/s) and almost no within-ant speed noise
    (0.04 vs 0.38): a different local optimum.
  - Stage 2 drove slopeSpeedSdK to 5.4 (truth 0.93): at 60° no simulated
    track is usable, every family is NaN and scores the fixed penalty 100,
    the loss is flat there, and CMA-ES's σ grew (0.48 → 0.91) instead of
    converging. 45°: stopped-fraction z = 82.
  - The remaining three cells use the same procedure, so they were stopped
    (≈ 9 h of compute that would only confirm this).
  - **Fix before rerunning the four cells (same design, same decision
    rule):** (1) bounded parameters: each fitted parameter gets a plausible
    range (wide, written down with the code; a fit at a bound is reported),
    encoded so the optimiser cannot leave it; (2) in the fit objective
    only, a candidate whose simulation leaves any statistic inestimable
    ranks below every candidate that estimates all of them, then by the
    number of such statistics. The fixed 100 per family was *below* the real
    misfit of most stage-2 candidates (2 000–9 000), so degenerate walkers
    were preferred, not merely tolerated. The judging loss (`compareE1`) is
    unchanged; (3) several starts (warm start and the variant's second
    start) with restarts of increasing population (IPOP-CMA-ES, Auger &
    Hansen 2005); the final mean that scores best on a fixed common batch is
    kept.
  - **Diagnostic first:** stage 1 started *at the truth* (same 69-ant data).
    If it stays near the truth's loss, the failure is a local optimum and
    (3) addresses it; if it drifts to a worse loss, the objective itself is
    at fault (e.g. noise-dependent bias) and that is fixed first.
  - **Acceptance test for the optimiser before the cells run:** on the
    large flat reference, stage 1 from the usual warm start must reach a
    fresh-batch loss within 2 SE of the truth's own.
- **2026-10-08** Reference-walker slope-threshold sensitivity
  (pre-registered above; `reportE1Ref.ts --fits walk,A0,T`, 600 ants, the
  same seeds, default vs `--segments data/reference/khuong-segments-alt.json`;
  per-purpose RNG streams, so our walkers' numbers differ from the earlier
  single-stream report). Ours = best of walk/A0/T per incline.
  - Σz² over compareE1 rows, ours vs Khuong walker (default → alt): 20° 591
    vs 3216 → 3288; 30° 1011 vs 1878 → 1827; 45° 2114 vs 3588 → 3975; 60°
    1842 vs 4633 → 5254. Ours better at every slope under both: **robust.**
  - By-speed checks (primary), ours vs Khuong: 20° 671 vs 788 → 829 (ours
    better); 30° 1409 vs 649 → 831 (Khuong better); 45° 1588 vs 1424 →
    1497 (Khuong better); 60° 736 vs 1895 → 2454 (ours better). Same signs
    under both thresholds, also for the corrected walker (khuong*):
    **robust to the threshold.** Flat pools identical (0° unchanged).
  - **But not robust to simulation noise at 20° and 45°:** the earlier
    single-stream report had Khuong better at 20° (879 vs 788) and a tie at
    45° (1423 vs 1424); only the random streams changed. Those two
    comparisons are reported as uncertain; 30° (Khuong better) and 60°
    (ours better) agree across all three runs. This supersedes the
    by-speed reading in the reference-baselines results above.
- **2026-10-08** Diagnostic result (stage 1 started at the truth, same
  69-ant data, 60 generations, no restarts): CMA-ES **left the truth**:
  final mean fresh-batch loss 76.5 ± 4.5 vs the truth's 17.8. Generation 0
  candidates at σ = 0.5 around the truth scored 720 (best) and 4 700
  (median): the objective is extremely sharp in some directions (a 0.5
  step in transformed speed is a 38 % speed change; speed quantiles have
  ≈ 3 % SEs), so the first update moves the mean to an average of far-off
  candidates, and re-converging needs σ to shrink an order of magnitude and
  the covariance to be learned (O(n²) generations for n = 18 with the
  default population). Not a bias in the objective: slow convergence on an
  ill-conditioned objective, which also explains the first cell (it stopped
  wherever the budget ran out).
  - **Fix (decided before implementing):** per-coordinate initial step
    sizes from the local sensitivity at the start point: loss at x0 ± h·eᵢ
    (h = 0.1, common seeds with x0), curvature cᵢ, initial SD
    sᵢ = clamp(√(Δ/cᵢ), 0.02, 1) (then h 0.2, cap 0.3, below) with Δ = 10 loss units (≈ 3× the 640-ant
    evaluation noise), passed to CMA-ES as the initial diagonal (σ = 1).
    2n extra evaluations per start. Generation caps raised (stage 1 400,
    stage 2 300, joint 600), with the convergence stop.
  - **Test order:** (i) the truth-start diagnostic again: pass if the final
    mean's fresh-batch loss is within 2 SE of the truth's; (ii) the
    acceptance test above (warm start, large flat reference); (iii) the four
    cells.
  - **(i) first try** (h 0.1, SD cap 1): fresh-batch loss 31.3 ± 0.8 vs
    the truth's 17.8 (was 76.5): better, not a pass. Six coordinates the
    probe saw as flat at h = 0.1 got the cap (speedTau, jitter, homeRange,
    homeHeadingPull, turnDip, stopTurnG/stopHomePull); unit steps take them
    into poor regions (homing rows worst, radial z 6.3 near the start;
    speedSdBetween 0.03 vs 0.14). Tweak (synthetic diagnostic only): h =
    0.2, SD cap 0.3; wide exploration stays with the second start and the
    IPOP restarts. Rerun (i).
  - **(i) passed** (h 0.2, cap 0.3, 60 generations): fresh-batch loss 13.4
    ± 0.8 vs the truth's 17.8 (below it, as expected: on 69 ants the data's
    own optimum fits some sampling noise); parameters near the truth (speed
    64.7 vs 62.4 mm/s, mean free path 42.6 vs 39.5 mm, between-/within-ant
    SD 0.146/0.368 vs 0.138/0.378). Next (ii): warm start, large flat
    reference, stage 1 only, full procedure (2 starts + 1 IPOP restart,
    ≤ 400 generations each, convergence stop).
- **2026-10-08** User decisions (after the start-at-truth result):
  - **Checkpoint commit now**, acceptance test **pending** (it runs on the
    code of that commit minus `--stage1From`, the `selectionLoss` rename
    and the rep check, none of which touches stage 1). The result is
    recorded separately when it finishes. The start-at-truth pass is
    encouraging only; the large-reference test from the displaced warm
    start is the acceptance check.
  - **Selection data:** the common batch that picks the best of the
    optimiser's runs is selection data. The selected run is reported only
    on separate fresh batches (flatFresh: seeds +5000; report: +1000;
    selection: +offset+77, distinct from every generation and probe seed).
    Fit files now call those values `selectionLoss`.
  - **Reference walkers:** keep the slope conclusions that are stable
    across thresholds and streams (Σz²: ours better at every slope;
    by-speed checks: Khuong better at 30°, ours at 60°); the 20° and 45°
    by-speed comparisons are **unresolved**, not reported either way.
  - **Step 4, bounded version, started in parallel:** nest geometry
    (Bles lab nest), contact detection, food-transfer conservation,
    deterministic tests, with the current walker used provisionally behind
    a replaceable interface. No calibration and no E6 comparison until the
    walking decision is settled.
  - **Provisional colony page:** minimal, for inspecting movement, contact
    events and food conservation; parameters labelled provisional; visual
    polish allowed before the encounter model is complete.
- **2026-10-08** Step 4, bounded version — plan (decided before code; all
  behavioural parameters **provisional**, `estimated` provenance, no
  calibration and no E6 comparison until the walking decision):
  - **Geometry** (`blesApparatus`, world/apparatus.ts): nest chamber 56 ×
    41 mm (covered), passage 4 × 3 mm, foraging area 61 × 49 mm (Bles et
    al. 2022; 2 mm height ignored: planar). Food drop at the area centre
    (position not reported; assumption). Temperature 25 °C (not reported;
    assumption).
  - **Contact detection** (physics/contacts.ts): head point at 0.4 body
    lengths ahead of the centre; *antennal contact* when a head is within
    antennal reach of the other ant's head or centre; *mouth contact*
    when heads are within 0.3 body lengths and headings roughly opposed
    (cos Δ < −0.5). Spatial hash; pairs reported in a fixed order. The
    percept gains `mouthContact` (perception stays the only bridge).
  - **Food transfer** (physics/trophallaxis.ts): only when the donor acts
    "give" to B and B acts "receive" from the donor; moves crop volume at
    a fixed rate (crop capacity / 120 s, from TEC's unit, 1 unit = 1 s of
    transfer, mean load 120 units), sugar and water in the donor crop's
    proportions, limited by donor content and receiver space. Crop → crop
    leaves the ledger's account totals unchanged by construction; tests
    check per-ant sums against the ledger and the transfer log. While
    sharing, both stand and the pair is held face to face (as the drinking
    ant is held at the drop edge). No collisions between ants (limitation).
  - **Provisional behaviour** (behavior/lasiusNestWorker.ts, percepts
    only): rest ↔ active switching at fixed rates; give when own crop is
    above 10 % of capacity and the mouth-contact partner is not carrying;
    receive when own reserve is below 80 % and crop not full; sharing ends
    on empty/full or at a fixed hazard. Foragers (a fixed subset, ~12 of 50
    as in the paper) leave the nest when their crop is nearly empty at a
    fixed rate and then run the existing forager policy; on entering the
    nest they switch back to the nest policy.
  - **Walker** used provisionally through a replaceable motor function
    (default: the adopted E1 walker).
  - **Runner** (experiments/colonyBles.ts): 50 ants, starved 4 days, 90
    min, food at minute 30, dt 0.1 s; outputs trophallaxis intervals in the
    `ContactInterval` form the E6 observer takes (not compared to E6
    yet), the ledger, and frames for the page.
  - **Tests:** geometry, contact detection cases, transfer conservation,
    whole-run conservation (ledger = entities, every quantity), and
    determinism (same seed → identical events and frames).
  - **Colony page** (`#colony`): the run animated (ants, crop loads,
    sharing pairs, foragers), with a conservation readout and an event
    log; labelled provisional.
- **2026-10-08** **Acceptance test (ii) result — not passed as
  pre-registered.** Warm start, large flat reference (2000 ants scored as
  69), stage 1 only, full procedure (code of 9c48571):
  - Runs (selection batch, selection data): start 0 17.2, start 1 4.0, IPOP
    restart (λ 24) 2.0; each stopped by the convergence rule (116/114/112
    generations, σ ≈ 0.09), far below the 400 cap.
  - **Fresh batches: 2.34 ± 0.22 vs the truth's 1.12** → excess 1.2,
    ≈ 5.5 SE: fails "within 2 SE of the truth's own".
  - In data units the excess is small: ≈ 0.08 per family (≈ 0.3 data SE
    per statistic), which the prediction-recovery rule would call
    recovered — not substituted for the pre-registered criterion.
  - Parameters vs truth: meanFreePath 62 vs 39.5 mm, jitter 0.0046 vs
    0.0015 rad²/mm, speedTau 0.66 vs 1.57 s; speed 64.0 vs 62.4,
    speedSdBetween/Within 0.165/0.366 vs 0.138/0.378. The turning split
    differs again while predictions nearly agree (identifiability
    ambiguity, flat ground only).
  - **Next (diagnostic, decided before running):** polish from this result
    with a 6× tighter convergence tolerance (tolX 0.005, ≤ 400
    generations). If the fresh-batch loss then reaches the truth's within
    2 SE, the stop rule was too loose: tighten it for all fits and rerun
    (ii). If it stays ≈ 2.3, the gap is a flat ridge the noisy objective
    cannot resolve, which goes back to the user (criterion or statistics).
    The four cells do not run until this is settled.
- **2026-10-08** Docs (user request, no model change): `docs/DESIGN.md`
  rewritten to describe the M1 model as built: architecture and step
  order, RNG streams and exact event timing, world, walking model with its
  equations and variants, perception, path integration, physiology,
  forager rules (incl. the M_b stopping-volume distribution), observers
  and statistics per experiment, comparison and fitting maths, reference
  models; the earlier long-term design is kept, condensed, as § 12 with
  reserved code marked. `README.md` updated (pages, test tiers, data
  roles, licence).
- **2026-10-08** Step 4, bounded version — **implemented** (provisional
  throughout; no calibration, no E6 comparison):
  - `blesApparatus`, `physics/contacts.ts` (head points, antennal and mouth
    contact, face-to-face alignment, hashed detection equal to all-pairs),
    `physics/trophallaxis.ts` (`shareCrop`), `behavior/lasiusNestWorker.ts`,
    `LASIUS_NEST` (`estimated`, each note says provisional),
    `experiments/colonyBles.ts` (`runColony`), `world/pathField.ts`;
    `MotorFn` makes the walker replaceable (`walkAnt`, default `walkStep`).
  - **Changes forced by what the first runs showed:**
    - *Mouth-flow sense* (`Body.mouthFlow`, `Interoception.mouthFlow`):
      inferring flow from crop volume failed (absorption also lowers it),
      leaving 12 ants stuck in "receive".
    - *Walls:* only a move's end point was checked, so long steps jumped
      the 4 mm wall between nest and area. Moves are now walked in ≤ 0.5 mm
      pieces up to the wall, then the ant turns along it. Unobstructed
      moves are bit-identical; E2 changes only where scouts had cut the
      bridge/area corners: `reportE2.ts` before → after, |Δz| ≤ 0.6 on every
      row except drop-2 drinking time 8.8 → 10.6 (mean 37 → 38 s; its
      SE_sim 0.81 → 0.36), no verdict changes.
    - *Nest fidelity and cues along the surface:* nest workers wandered out
      and could not find the way back (path integration drifts tens of mm
      over minutes; a straight-line entrance cue points into the wall
      beside the 3 mm passage). Provisional: nest odour and an exit cue as
      path-distance fields (`PathField`, Dijkstra on a 0.5 mm grid); a
      worker outside the nest that is not on a trip heads back. E2 keeps
      its entrance cue (fields unset).
  - **Tests** (`test/colony.test.ts`): geometry, contact cases, hashed =
    all-pairs detection, alignment, transfer proportions/limits/flow sense,
    path field through the passage, no wall jump, whole-run conservation
    (ledger = per-entity sums for sugar and water, |Σ ledger| < 1e-9 of
    inputs), determinism. Fast tier: 52 pass + 2 expected-fail.
  - **Observation (placeholder parameters, not a result):** sharing stops
    ≈ 15 min after food appears: one crop load lifts a starved ant's
    reserve above `receiveReserve`, so the colony stops foraging and
    accepting. Bles et al. see sharing for the whole hour; this is for the
    step-4 calibration.
  - **Colony page** (`#colony`, provisional): animated run (2× default
    playback), click-to-follow, sharing glow, conservation readout (where
    the sugar went, ledger sum), sharing log, sugar-flow and activity
    charts, the provisional parameter table. Opens on the precomputed
    default run like the other pages.
  - Page infrastructure fixes: the simulation hash covers only the three
    fits the pages use (recovery fits written to `data/fits/recover/` had
    marked every page stale), and `precompute.ts` overwrites files in place
    (deleting the folder made the dev server stop serving it).
- **2026-10-08** Polish diagnostic (tolX 0.005 from the acceptance result)
  **interrupted** at generation 380 of 400 when the session restarted; no
  output written. Up to then it had not converged: σ grew from 0.08 to 0.20
  instead of shrinking, and generation medians stayed ≈ 3 (best 1.3–2.5 on
  generation seeds). That leans towards a flat, noisy ridge rather than a
  loose stop rule, but it is not a result: rerun to completion before
  deciding (acceptance still open; the four cells still wait).
- **2026-10-08** Pages: precomputed files are fetched as
  `precomputed/<name>.json?v=<simulation hash>`. GitHub Pages serves them
  with max-age=600, so for 10 min after a deploy a browser could reuse the
  previous build's files, whose hash no longer matched, and the page
  simulated live (seen on E2/E6 after the step-4 deploy).
- **2026-10-08** Polish diagnostic rerun to completion (tolX 0.005 from the
  acceptance result, 400 generations): **did not converge** (σ wandered
  0.08–0.20, never shrank; ran to the cap). Final mean: fresh-batch loss
  **3.37 ± 0.33** (acceptance result 2.34, truth 1.12); meanFreePath drifted
  62 → 96 mm (truth 39.5) with predictions nearly unchanged. Reading: along
  the turning-split ridge (meanFreePath / jitter / speedTau) the loss
  changes less than the 640-ant evaluation noise, so step-size adaptation
  cannot shrink and the final mean is one draw of a random walk along the
  ridge. A looser stop rule was not the cause. Per the pre-registered rule
  this goes back to the user (criterion or statistics/noise); the four
  cells still wait.
- **2026-10-08** User decision (after the polish diagnostic), logged before
  implementation — **acceptance by prediction recovery, with averaging:**
  - **Estimate:** each CMA-ES run's estimate becomes the average (in the
    transformed parameters) of the distribution means over its last 50
    generations (all of them if fewer), a standard noise-handling step that
    damps the random walk along flat directions. Selection among runs on
    the selection batch is unchanged (selection data only).
  - **Acceptance rule (replaces "within 2 SE of the truth's loss"):** on
    the large flat reference, stage 1 from the usual warm start must recover
    *predictions* at 0°: `recoverE1.ts` excess over the truth ≤ 0.25 per
    family on average and no family > 1 (fresh 2000-ant simulations, data-
    SE units at the 69-ant scale). Parameters are reported; those on the
    turning-split ridge (meanFreePath, jitter, jitterTime, turnRateTime,
    speedTau) are reported as **not identified from flat data** when they
    differ while predictions agree.
  - Run once under this rule (full procedure: 2 starts + 1 IPOP restart,
    averaging on), then the four staged/joint cells as designed, judged by
    prediction recovery at all five inclines.
- **2026-10-08** E1 evaluation profile (user asked to profile and to
  consider Rust), logged before acting. One evaluation (640 ants, flat) is
  ≈ 6.5 s of one core with the machine loaded: **~43 % per-track summary
  statistics** (`diagTrack`, `trackStats`, `accFor`, `prepareTrack`),
  **~38 % the walker** (`walkFor`, `runE1`, `homeWeight`, RNG), ~4 % GC;
  the comparison on the main process is < 1 %. The profile is flat (no line
  > 4 %): cost is spread over transcendental calls, small allocations
  (per-sample `push`, `findIndex` closures, a `Map` per ant) and closures.
  All 16 cores are busy during fits, so only faster code helps.
  **Plan:** speed up that path in TypeScript **bit-identically** — exact
  equality of `e1Summary` outputs (all inclines, several seeds and
  parameter sets), Khuong reference statistics and the E2/colony runs that
  share the walker, against snapshots taken from the current code before
  any change. Arithmetic order and every `Math.*` call stay as they are, so
  fits and the running acceptance test are unaffected. Rust (native or
  WASM) is assessed for the user and not started: it cannot be
  bit-identical with the TypeScript (different transcendental functions),
  and the walker is shared by E1, E2 and the colony.
- **2026-10-08** E1 speed-up done (bit-identical): all 76 snapshots
  (`e1Summary` and raw tracks for the T, walk and A0 fits at all inclines,
  Khuong per-track summaries and references, comparisons, E2 scouts, a
  colony run) are identical before and after. Changes: the E1 summary skips
  the `trackStats` parts no fit uses (time-lag heading correlation, MSD;
  `full = false`, as `diagTrack` already did); speed binning without a
  `Map`; bin lookups without per-sample closures; `hypot` in
  `core/math.ts`, an exact copy of V8's two-argument `Math.hypot` (~3×
  faster; checked on 200 000 pairs in `test/math.test.ts`) on the E1 path;
  the walker's per-step slope factors and OU decay memoised; heading
  normalisation without the two `fmod` calls in the usual case (exact).
  **Result:** a full 640-ant evaluation is **13 % faster at 0° and 10 % at
  45°** (alternating runs against the previous code, same load). That is the
  ceiling without changing numerics: what remains is mostly the
  transcendental calls of the walker itself (~16 per 0.02 s step: OU, clocks,
  steering, heading, path integration) and of the statistics.
  **Rust assessment (for the user, not started):** native Rust with the
  system maths library could plausibly be ~3× faster, but not bit-identical
  to the TypeScript (different `exp`/`cos`/`atan2`), so it would be a second
  implementation of a walker that is still changing (A0 vs T) and is shared
  with E2 and the colony. Porting V8's fdlibm functions too would keep it
  bit-identical, testable against the same snapshots, and usable as WASM in
  the browser, but then only the non-maths overhead shrinks: perhaps
  ~1.5–2×. Estimates, not measured; Rust is not installed here.
- **2026-10-08** **Acceptance test passed** (pre-registered prediction
  rule; stage 1, warm start, large flat reference, 2 starts + 1 IPOP
  restart, averaging on). Runs scored 16.6 (start 0), 4.3 (start 1) and
  1.51 (restart, kept) on the selection batch; each stopped by tolX after
  98–116 generations. Prediction recovery at 0° (`recoverE1.ts`, fresh
  2000-ant simulations): **mean excess 0.10 per family, worst turnMed 0.48
  → recovered** (rule: ≤ 0.25, none > 1). Fresh-batch loss against the
  69-scaled reference 2.32 ± 0.24 vs the truth's 1.12: the old "within
  2 SE" rule would still fail, consistently with ≈ 0.1 excess summed over
  ~12 families. Slope inclines fail as expected (stage 1 does not fit slope
  parameters; not part of this test).
  - **Not identified from flat data** (predictions agree, parameters
    differ): meanFreePath ×1.61, jitter ×2.98, jitterTime ×0.56, speedTau
    ×0.19 (the turning-split ridge), and also stopTurnG ×1.69 and
    speedSdBetween ×1.29 (not on the pre-listed ridge; reported). speed,
    speedSdWithin, g, turnRateTime, turnDip, pause and homing parameters
    within ×0.67–1.42.
  - Note for the cells: only the IPOP restart reached the good basin;
    both plain starts stopped early at poorer points, so the restart is
    load-bearing.
  - **Next:** the four cells as designed, in order staged n2000 (stage 1
    reused via `--stage1From` from this file), joint n2000, staged n69, joint
    n69, each followed by `recoverE1.ts` at all five inclines.
  - Started 2026-10-08. Fix first (caught 3 min into the first cell, which
    was restarted): `--stage1From` decoded the encoded stored parameters,
    which moved them by an ulp, so the reuse was not exactly equal to a
    rerun as documented. It now keeps the stored parameters as they are.
- **2026-10-09** **Staged vs joint, three of four cells done** (T truth,
  rep 0; prediction excess per family, data-SE² units; recovered ≤ 0.25
  mean and none > 1):

  | cell | 0° | 20° (dev) | 30° | 45° (dev) | 60° |
  |---|---|---|---|---|---|
  | staged, 2000 ants | 0.10 ✓ | 0.78 ✗ (turnMed 6.0) | 2.16 ✗ (turnMed 18) | 5.27 ✗ (turnMed 43) | 10.9 ✗ (turnMed 89) |
  | **joint, 2000 ants** | **0.06 ✓** | **0.06 ✓** | **−0.02 ✓** | **0.11 ✓** | **0.13 ✓** (worst turnMed 0.96) |
  | staged, 69 ants | 0.50 ~ (stopTurn 2.5) | 0.95 ✗ | 1.26 ✗ | 1.92 ✗ | 1.66 ✗ |
  | joint, 69 ants | running | | | | |

  - **Decision (pre-registered rule): joint is adopted.** Staged fails on
    the large reference at every slope; joint recovers predictions at all
    five inclines, including 20° and 45°, which were never fitted.
  - **Why staged fails:** stage 1 fixes the flat-ground parameters at an
    arbitrary point on the turning-split ridge (here jitter per mm ×3.0,
    jitterTime ×0.56, meanFreePath ×1.6, speedTau ×0.19). On flat ground
    per-distance and per-time turning are interchangeable at the typical
    speed, but ants walk slower on slopes, so the split sets the turning
    per mm there. Stage 2 cannot move it, and the error grows with slope
    (turn-median family). The joint fit uses the slopes to place the split:
    meanFreePath ×1.06, jitter ×0.75, jitterTime ×1.27, speedTau ×1.17.
  - **Joint, parameters that differ while predictions agree**
    (identifiability ambiguity, not failure): homeRunBias ×0.08,
    stopHomePull ×0.20, homeHeadingPull ×2.30, turnDipTau ×2.24, geoRunGain
    ×2.76, geoHeadingPull ×1.54. The homing terms trade off against each
    other; none of these should be read biologically from a fit.
  - Runs: joint 2000 took 8.5 h (starts 340 and 314 generations, restart
    148; selection-batch scores 27.6, 3.7, 1.9: again only the restart
    reached the good basin). Staged 2000 stage 2: 1.5 h; staged 69: 3 h.
  - **Procedure flaw found (does not change the decision):** in stage 2
    of staged 2000, start 1 stopped after one generation. Its probe put
    every initial SD at the 0.02 floor (a very poor, steep start, loss
    ≈ 7 000), and σ·max SD = 0.022 was already below tolX 0.03. The floor
    should not be below tolX. Staged's failure does not depend on it:
    stage 2 cannot change the flat parameters, and the restart from start 0
    reached the same loss (100.5 vs 100.3). Left unchanged for the
    remaining reps so they match rep 0. Proposed for the renewed
    comparison (to pre-register with it): tolX checked only after the
    first 10 generations.
  - **Queued (as designed, run after joint 69 finishes):** joint on A0
    (large reference, `data/fits/e1-A0.json` as the truth), then T joint at
    69 ants reps 1 and 2 (refit spread). Then the renewed A0 vs T
    comparison, pre-registered anew before its fits.
  - Caveat to carry: on real data a joint fit lets slope misfit pull the
    flat parameters; report its flat loss next to the staged fit's.
- **2026-10-09** User review (after Wilson & Collins 2019, "Ten simple
  rules for the computational modeling of behavioral data"): five checks
  adopted, logged before acting. Priorities 1 and 2 first.
  1. **Judging loophole.** `judgeE1.ts` and `reportE1Ref.ts` drop
     non-finite z before summing, so a candidate can lower its score by
     making a statistic inestimable; `compareE1` (fresh-batch losses,
     `recoverE1.ts`) instead charges a fixed z² of 100, which is below the
     real misfit of poor candidates (the same flaw the fitting objective
     already fixes). **Fix:** eligible statistics are defined by the
     reference (finite value, SE > 0); a candidate missing any eligible
     statistic is **unjudgeable** there: it is reported as such and
     cannot win or pass that comparison (counts as failed), never a
     smaller sum. The fitting objective is unchanged. Previous judgements
     (A0 vs B, A0 vs T, reference walkers) are re-run to see whether any
     candidate had missing statistics; the user has not established that
     rankings were affected, and neither have we.
  2. **Model recovery** (Wilson & Collins rule 6): synthetic data from A0
     and from T (`data/fits/e1-A0.json`, `e1-T.json`, i.e. the current
     real-data fits as representative settings), 69 ants per incline (the
     real size), **both models fitted to each data set** with the adopted
     procedure (joint CMA-ES, as in the recovery cells), then the actual
     selection rule of the renewed comparison applied. Outcomes per data
     set: correct, wrong, or inconclusive. Pilot: reps 0 and 1 per truth,
     so 8 fits, of which T-on-T reps 0–1 are already running or queued (6
     new joint fits, ~8 h each on this laptop). The fits do not depend on
     the rule; the rule is drafted and agreed with the user **before**
     any pilot data set is judged, and the renewed real-data comparison
     uses exactly that rule. The fitting procedure stays as in the
     recovery cells (including the tolX-floor quirk) so those runs can be
     reused; the tolX proposal above is withdrawn.
  3. **Calibrate the whole acceptance rule** (no |z| > 3, at most two
     with 2 < |z| ≤ 3): its false-failure rate for a correct model, from
     many synthetic data sets (69 ants, current observer and statistic
     set) scored against large simulations of the same model. Simulation
     and scoring only, no refits. After 1 and 2.
  4. **Censoring audit.** The exit-time statistic uses only tracks that
     reach the final radius; others drop out silently. Report the exit
     fraction and the unusable-track fraction next to the conditional
     exit-time distribution (report only, not added to the fit loss
     mid-comparison), for data and models. Before Bonavita, keep explicit
     wall-exit vs timeout information per track.
  5. **Assumptions self-recovery cannot test:** before interpreting a
     close real-data ranking, its sensitivity to tracking noise (observer
     SDs ×0.5 and ×2) and to leaving out one recording session/colony at
     a time. Judging-level first (fits unchanged); refits only if a
     ranking flips. Any flip goes into the conclusion as uncertainty.
  - **Item 1 implemented** (2026-10-09): `compareE1` now lists `missing`
    rows (estimable from the reference, not from the simulation; the fit
    loss is unchanged); `judgedSumZ2` in `compare.ts`; `judgeE1.ts` and
    `reportE1Ref.ts` mark a model with missing statistics as unjudgeable
    (it cannot win an incline); `recoverE1.ts` fails a family the fit
    cannot estimate (was charged a fixed 100); `fitE1.ts` records missing
    rows per fresh batch. Tests in `test/compare.test.ts`.
    **Re-run of the reference-walker report** (`reportE1Ref.ts --fits
    walk,A0,T`, same seeds; all numbers identical to the earlier report):
    the Khuong walker (both versions) cannot estimate one statistic at 0°
    and 20°, in the all-rows Σz² and the turning sum; its sums there were
    understated. No conclusion changes (ours were already lower there).
    By-speed (primary) sums had no missing statistics.
  - The check statistics of `diagE1Turns.ts` / `diagE1Stops.ts` moved
    unchanged into `src/sim/analysis/e1TurnChecks.ts` /
    `e1StopChecks.ts` (row ids added; script outputs identical, diffed),
    so a selection rule can use them in code. The earlier T vs A0 check
    total was summed by hand from their printed tables; which rows and how
    "—" entries were handled is not recorded, so it is re-checked
    (judging-level, same seeds).
  - **DRAFT for the user — selection rule for the renewed A0 vs T
    comparison and the model-recovery pilot** (`scripts/selectE1.ts`; not
    yet run on any pilot data set or on the real data):
    - (a) objective: the fit loss (15 families, fit-z) on 5 fresh batches
      of 1000 ants at each fit incline (0°, 30°, 60°; joint fitting uses
      all three), the same seeds for both models, per batch summed over the
      inclines. Met if the paired difference T − A0 plus the heuristic
      penalty 2Δk (Δk = 23 − 18 = 5) is below −2 SE of the paired
      difference.
    - (b) never-fitted checks: Σ combined z² over an explicit row list, 2000
      simulated ants per model and incline, same seeds, all five
      inclines; met if T is lower at ≥ 4 of 5. Rows (37 per incline before
      eligibility): by-speed ⟨cos⟩ at 5 and 50 mm and kurtosis (15), speed
      around big turns: dip, shoulders, asymmetry (3), stop-episode rates
      by duration (6), ⟨cos⟩ in/out of stops by fine duration (7), homeward
      out-heading at stops, all and > 0.13 s (2), within-ant speed–turning
      slope, arc and displacement speed, with and without stop-adjacent
      segments (4). Same groups as the earlier pre-registration, now as
      fixed ids.
    - Outcome: T preferred if (a) and (b); A0 kept if neither;
      **inconclusive** if one. Missing statistics as in item 1.
    - Model-recovery pilot reading (4 data sets: reps 0, 1 from each
      truth): any **wrong** selection (T preferred on A0 data, or A0 kept
      on T data) means the rule cannot be trusted as it stands, and it goes
      back to the user before the real comparison. Inconclusive outcomes
      on a model's own data mean limited power, reported as such. Margins
      ((a) in SE, (b) win counts) are reported for every data set. Four
      data sets give no error rate; extending the pilot is a user decision.
    - The real-data comparison then uses exactly this rule, followed by
      item 5's sensitivity checks (observer SDs ×0.5 / ×2, leave one
      session out; judging-level) and item 4's exit and unusable-track
      fractions.
- **2026-10-09** **User decision — change of E1 strategy** (review after
  Grimm & Railsback, Rosser et al., Palminteri et al., Wood 2010, Hansen
  et al.; logged before acting). Methods stay; the question changes. E1
  had become an exhaustive fit of a model that is wrong at fine scales
  (z 10–20), and the queued work compared two models the checks already
  falsify (A0: no reset at stops, no speed dip, within-ant slope −0.3 to
  −1.5 vs −2 to −3.6).
  - **Queue held:** the joint 69-ant cell finishes (completes the
    staged-vs-joint table); the 9 queued joint fits (model-recovery pilot,
    A0 large-reference check, T reps 1–2) are stopped. The draft
    selection rule (`selectE1.ts`) and the pilot wait for step 6.
  - **Order:** (1) downstream sensitivity probe now (`reportE2.ts --walk`
    with e1-walk, e1-A0, e1-A0-loss11, e1-B-loss11, e1-T; judging only;
    one-sided: no movement → the E1 stopping condition is essentially
    met, movement → which E1 outputs matter); (2) signature table with
    reachability (parameter sweeps) for A0 and T, and independent
    signatures for T named before its next fit (speed–heading lead–lag,
    sampling-scale curves, Bonavita); (3) sampling-scale sweep (resampling
    0.04/0.08/0.16/0.32 s × smoothing 1/3/5; data, A0, T, Khuong walker);
    (4) covariance/normality report of the statistic vector (cluster
    bootstrap ≥ 1 000, shrinkage; effective number of statistics;
    Mahalanobis misfit beside the loss; report only); (5) rank-change
    noise measurement (Hansen et al.) on one diagnostic CMA-ES run; (6)
    then decide whether a renewed A0 vs T comparison is still needed, and
    in what form (signature-first, focused recovery: A0-truth data sets
    first).
  - **E1 patterns in two tiers (proposal to settle with step 1):** purpose
    patterns, accepted categorically with tolerances set by what moves
    E2/E6 (exit time, radial drift and homing, speed level and between-ant
    spread, stopped fraction, their slope dependence); mechanism
    signatures, used to choose structure, not required to reach |z| ≤ 2
    (reset at stops, speed dip at turns, within-ant coupling). The frozen
    Bonavita held-out criterion stays as it is; the M1 go/no-go for
    walking rests on the purpose patterns.
  - Noted for interpretation: T vs A0 is not nested (T drops slopeJitterK);
    T's motivating signatures are development data for T; fitted
    `stopCos.0` (stops < 0.4 s) mostly measures pipeline geometry (most
    episodes < 0.13 s, 3-point speed dips at reversals). Next
    pre-registration: split stop statistics at 0.13 s or require ≥ 4
    frames. Weighting by family averaging is an implicit choice (turning
    families likely one dimension counted ~5×); keeping SE_sim out of the
    objective is right for plain Σz² only.
- **2026-10-09** **Step 1 result — E2 is insensitive to the walker.**
  `reportE2.ts --walk` with five walkers (e1-walk adopted, A0, A0-loss11,
  B-loss11, T; E2 parameters as adopted, no refit; `--seed` option added).
  At the default 150 scouts the seed-to-seed spread for one walker is up
  to ±0.7 z, as large as the differences between walkers, so the probe
  was repeated with 600 scouts (same seeds for all walkers):
  - **max |Δz| across walkers ≤ 0.8 on every target** (largest: time
    between drops for trail layers, −4.4 adopted → −3.7 T, sim 28 → 33 s
    vs data 58 s; total time on the apparatus, 1.4 → 2.1). **One verdict
    change:** total time, 1.9 (B) → 2.1 (T), crossing |z| = 2 by 0.1.
    Everything else is within 0.5 z.
  - The large E2 misfits are the same under every walker: drinking time
    at drop 2 (z 10.3–10.8), time between drops (−4.4 / −4.8), trail
    laying overall (−3.1), trail laying after 4 days (−3.3). They are not
    E1 walking problems; the limiting submodel is search and behaviour
    around food (step 3c), as the review suggested.
  - **Stopping condition** (pre-registered: |Δz| < 1 on every target and
    no verdict change): the |Δz| part is met; the verdict part fails by
    one threshold crossing of 0.1 z on a development target. In
    substance, E1 fine-scale structure does not move E2. One-sided as
    planned: the probe cannot show the walker is right, only that these
    differences don't matter for E2. E6 (step 4 calibration) is still to
    be probed.
  - **Item 1 re-check complete:** `judgeE1.ts` A0-loss11 vs B-loss11
    (loss11 checks) and A0 vs T (by-speed): no candidate has a missing
    statistic, fresh flat batches included; all numbers and win counts as
    recorded (B 5/5, T 1/5). In the `diagE1Turns`/`diagE1Stops` tables
    behind the hand-summed T vs A0 total, every "—" z is on a row the data
    cannot estimate (long-stop bins with < 10 stops), left out for both
    models alike. **No earlier ranking was affected by the loophole.**
- **2026-10-09** **User decision after step 1.**
  - **Stopping condition, as recorded:** *not met as pre-registered* (one
    verdict change, total time on the apparatus 1.9 → 2.1, a 0.1 z
    threshold crossing on a development target, within simulation noise;
    every |Δz| < 1). The rule is not reinterpreted after the fact. Stopping
    fine-scale E1 fitting is a strategy decision taken on the substance
    (E2 does not depend on the walker's fine structure) and is reported as
    such, not as the stopping condition having been met.
  - **Reduced plan:** (2) signature table with reachability for A0 and T;
    (3) sampling-scale sweep (decides whether turn kinematics matter at
    all); (4) covariance/normality report (cheap, report only). Step 5
    (CMA-ES rank-change noise) only if E1 fitting resumes. Then the main
    effort moves to E2 search around food (step 3c) and the step-4 colony
    calibration (with the E6 walker probe). The renewed A0 vs T comparison
    and the model-recovery pilot stay parked (`selectE1.ts` draft kept).
- **2026-10-09** **Step 2 design — signature table with reachability**
  (logged before running):
  - **Signatures** (mechanism tier), same code on data and simulations
    (tracking observer on): reset at stops, ⟨cos⟩ in/out of stops by
    duration (`stopCosFine` 0.13–0.25, 0.25–0.41, 0.41–0.81, 0.81–1.61 s;
    the < 0.13 s bin is reported but not used, since it mostly measures
    pipeline geometry); speed dip at big turns (`turnSpeed.dip`, plus
    shoulders and asymmetry); within-ant speed–turning slope (arc speed,
    with and without stop-adjacent segments); between-ant slope
    (`antTurn.slope`).
  - **Reachability:** per model (A0, T), 300 parameter sets drawn
    uniformly in the fit's bounded coordinates (the ranges `fitE1.ts`
    uses, moved unchanged to `scripts/e1Specs.ts`), 150 simulated ants
    each at 0° and 60°. Reported per signature: the reachable range (5–95 %
    and min–max) against the data value ± 2 SE, overall and among
    "plausible" sets (median moving speed and stopped fraction within ±30 %
    of the data at that incline). A model whose reachable set never
    contains the data value (within 2 SE) is **falsified for that
    signature**, whatever a ranking says; random sampling can miss narrow
    regions, so "reachable" is reported as found, "unreachable" as not
    found in 300 draws plus the reasoning from the mechanism.
  - **Fitted values:** the same signatures for the fitted A0 and T
    (2000 ants), for the table's second column.
  - **Independent signatures for T** (named now, before any further T
    fit): the speed–heading lead–lag (does speed drop before, at, or after
    the heading change), the sampling-scale curves of step 3, and the
    Bonavita held-out test.
- **2026-10-09** **Step 3 design — sampling-scale sweep** (logged before
  running; diagnostic, no fits). Tracks prepared as for the fits (25 Hz
  resampling, trimmed at 10/200 mm) but with moving-average windows of
  1, 3 or 5 samples, then subsampled at τ = 0.04, 0.08, 0.16, 0.32 s.
  At each (τ, window), per-ant sums of apparent quantities on consecutive
  steps: stopped-step fraction (step speed < 2 mm/s), median and 10th
  percentile step speed of moving steps (pooled histogram), median |turn|
  and P(|turn| > 0.5 rad) between consecutive moving steps, ⟨cos⟩ between
  them, and the speed–turn coupling (mean |turn| in the slowest vs fastest
  third of each ant's moving steps, as a log ratio). Data, fitted A0, T
  (1000 ants) and the Khuong reference walker (1000 ants, which has real
  segments), at all five inclines, tracking observer on; cluster-bootstrap
  SEs over ants. Read: curves against τ. A model that matches the data at
  the fit scale (τ 0.04, window 3) by compensation should depart at other
  scales; the shape of the curves is a new discriminating pattern (an
  independent signature for T, as named above).
- **2026-10-09** **Step 4 design — covariance and normality of the fit
  statistics** (report only; the loss is not changed mid-comparison).
  Per incline, the scalar and diagnostic fit statistics of `compareE1`
  (not the two KS rows) on the Khuong data: 1000 cluster-bootstrap
  resamples over ants → correlation matrix (pairs |r| ≥ 0.7; mean |r|
  within vs between families), effective number of independent statistics
  (participation ratio of the correlation eigenvalues; number of
  components for 90 % of the variance), normality of each statistic's
  bootstrap distribution (skewness, excess kurtosis; flagged |skew| > 0.5
  or |excess kurtosis| > 1). Misfit of the fitted A0 and T (2000 ants,
  200-resample simulation covariance): Mahalanobis d² with Σ_data + Σ_sim,
  Ledoit–Wolf shrinkage of the correlation towards the identity, beside
  the diagonal Σz² and the family-averaged loss. Reads: does family
  averaging under- or over-count independent evidence, and which rows are
  far from normal.
- **2026-10-09** **Step 4 result — covariance and normality** (`covE1.ts`,
  1000 data resamples, fitted A0 and T with 2000 ants; report only):
  - **Effective number of independent statistics: 5.3–8.0** (participation
    ratio) of 34–35 per incline; 10–12 components carry 90 % of the
    variance. 26–62 pairs per incline have |r| ≥ 0.7, many across families
    (e.g. speed.q10 with hc.1, r 0.92 at 0°; turnBig/turnMed in the middle
    speed bins with speed quantiles and short-lag heading correlation).
  - Per family: speed 1.3–1.5 effective of 3 rows, heading correlation
    1.2–1.7 of 5, turnBig 2.4–3.4 of 5, turnMed 2.1–3.1 of 5, **radial
    3.4–5.7 of 8**. So family averaging under-counts radial drift (several
    dimensions counted once) and over-counts the speed/persistence/turning
    dimension (one dimension appears in the speed, headingCorr, turnBig and
    turnMed families).
  - **Normality:** bootstrap distributions are close to normal; mild
    exceptions (turnMed.0 at 20°, skew 1.1, excess kurtosis 3.5; speed.q10
    at 20°; outer radial bins on steep slopes). KS rows not covered.
  - **Misfit:** Mahalanobis d² (Σ_data + Σ_sim, shrunk) is 2–10× the
    diagonal Σz²: the misfit lies along directions the data constrain
    tightly. **T is lower than A0 at every incline under d²** (0° 3027 vs
    5528; 20° 2627 vs 4381; 30° 2937 vs 4487; 45° 6160 vs 10540; 60° 6075
    vs 11608), while the diagonal Σz² and the family loss favour A0 at
    30–60°. Tentative: with 69 ants per incline the smallest eigenvalues
    are poorly estimated (shrinkage chose λ ≈ 0.01), and d² leans on them.
    It does show that the slope ranking of A0 vs T depends on how
    correlated statistics are weighted.
- **2026-10-09** **Step 3 result — sampling-scale sweep** (`scaleE1.ts`,
  1000 simulated ants per model, all five inclines; τ 0.04–0.32 s ×
  window 1/3/5; curves saved locally):
  - **Every walker turns too little at fine scales, including the Khuong
    reference walker built from real segments.** Median |turn| between
    consecutive steps at the fit window (3) is 25–40 % below the data at
    τ ≤ 0.16 s at every incline (z −4 to −21); the gap closes by 0.32 s.
    With no smoothing (window 1) the data's fine-scale turning is
    noise-dominated and much larger than the models' with their observer
    (60°, τ 0.04: data 1.21 rad, A0 0.76, T 0.86, Khuong walker 1.17).
    Reading: the tracks have fine-scale wiggle that no walker has, and the
    observer model (white noise per frame, SDs from the slow-sample
    estimator) does not supply it; candidates are frame-correlated
    tracking error and real body sway with the stride. This bears directly
    on the fitted fine-scale turning statistics (turnMed, turnBig, speed
    q10): the walkers may be bending their turning to imitate it. Item 5's
    observer check (SDs ×0.5 / ×2) and a correlated-noise variant come
    first if E1 work resumes.
  - **Speed–turning coupling has the wrong scale dependence in T.** The
    data's coupling (log ratio of |turn| in the slowest vs fastest third
    of steps) declines slowly with τ and stays large at 0.32 s (0.63 at 0°,
    0.77 at 30°, 0.89 at 60°). T's collapses (0.46, 0.22, 0.03), A0's less
    so (0.79, 0.50, 0.14), the Khuong walker's most (0.33, 0.00, 0.04).
    Over all 12 scales T's coupling misfit is worse than A0's at every
    incline (Σz² 1385 vs 654 at 0°; 5031 vs 3023 at 60°). So the data's
    coupling is not only a short dip at turns (T's mechanism acts on the
    0.2 s scale) but persists over seconds: slow stretches are tortuous
    stretches. That points to a slower state-level coupling (e.g. search
    vs travel phases) rather than turn-linked slowing. This is an
    independent signature for T (named before it was computed) and T
    fails it.
  - **Stopped fraction across scales:** T follows the data closely at every
    incline (60°: data 0.046 → 0.091, T 0.046 → 0.109); A0 overshoots on
    slopes at coarse scales (0.225 at 60°, τ 0.32). Speed q10 at fine
    scales is too high for both (the missing slow tail, known).
  - **Mishap (2026-10-09):** clearing leftover workers of the stopped
    sweep with `pkill -f poolWorker` also killed the workers of the joint
    69-ant cell, 7.5 h in (final restart, generation 130; starts scored
    146.5 and 25.1 on the selection batch). The fit is deterministic, so
    it was rerun from the start and gives the same result. Gotcha added to
    CLAUDE.md.
  - **Step 2 amendment** (before any result was read beyond the count):
    the first run was stopped after 3 h (bootstrap SEs for every sampled
    set; now values only for sampled sets, SEs for data and fits). Of 300
    uniform A0 draws at 0°, only 4 were plausible, so the plausible column
    would be empty. Now 150 uniform draws (reachable "at any parameters")
    plus 150 local draws around the fitted point (logit coordinates + N(0,
    0.7²)) that fill the plausible region; the verdict uses the union.
- **2026-10-09** **Item 4 result — censoring audit** (`censorE1.ts`;
  simulated tracks now record how they ended, `Track.end` = exit | timeout;
  report only).
  - **Data:** all 345 Khuong tracks (69 per incline) end with an exit and
    none is unusable (longest 577 s). The published set contains only
    exiting ants; whether non-leaving ants were excluded is to be checked in
    the paper (a selection rule we would have to apply to simulations too).
  - **Models (1000 ants per incline):** exit fraction by the statistic
    falls with slope: at 60°, walk 96.2 % (z −4.0), A0 95.8 % (−4.4), T
    84.8 % (−11.3); the 600 s time limit is hit by 0 (walk), 53 (A0) and 71
    (T) ants, against none in the data.
  - **Speed-burst defect (walk and T):** the rest of the missing exits are
    ants that left in one jump: the last prepared point is at 182–192 mm
    and the next beyond 200 mm, a 10–20 mm move in one 0.04 s frame. Over
    0.2 s windows the data never exceed 141 mm/s (60°: max 84, q99 46), but
    T reaches 750 mm/s at 60° (q99 117, q99.9 229) and ~1 % of windows
    exceed 120 mm/s at every incline (walk similar). Cause: the
    within-ant log-normal OU speed with SD 0.36–0.38 on flat ground,
    multiplied on slopes by exp(slopeSpeedSdK·θ) to ≈ 1.0 at 60°. The
    fitted speed statistics stop at q90, so the upper tail was never
    constrained. A0 (SD 0.13–0.29) has no bursts (60° max 105 mm/s).
  - **Reading:** a purpose-tier defect (bursts shorten search and raise
    encounter rates), not fine-scale structure. For the purpose patterns:
    add the exit fraction and an upper speed-tail statistic (q99 of 0.2 s
    speed); the speed process needs a bounded (gait-limited) form rather
    than an unbounded log-normal whose SD grows with slope. Fits are not
    changed now.
- **2026-10-09** **Step 3c proposal — search around food (E2), for the
  user** (nothing built yet). From the 2009 Table 2: drop 2 is on the bridge
  9 cm from drop 1 (a few seconds of walking), yet the time between drops
  is 58 ± 33 s for ants that laid trail after drop 1 (TL1), 141 ± 89 s
  (TL2) and 114 ± 83 s (nTL2). The model sends trail layers home at once
  (sim 26–33 s) and gives non-layers an exponential search with mean 80 s
  (sim 65–70 s in total). Drinking at drop 2 is 23 ± 11 s for 0.28 µL; the
  model drinks at a constant per-ant rate (sim 38 s, 0.34 µL), while the
  published regression, volume = 0.006·t + 0.15 µL (both drops pooled), has
  a large intercept, i.e. fast initial uptake. _(Overstated: the intercept
  is consistent with fast initial uptake but does not show it; see the
  2026-10-09 correction below.)_
  - **Diagnostics first (no model change):** (i) split the model's
    between-drop time into travel and search, by the paper's groups (TL1,
    TL2, nTL2; the report currently splits layers vs non-layers after
    drop 1); (ii) the model's volume–time regression intercept against
    0.15 µL.
  - **Candidates (bounded, pre-registered before any fit):** search — S0
    as now; S1 every ant leaving an exhausted drop searches, layers
    included, one search-duration distribution; S2 as S1 with separate
    durations for layers and non-layers. Intake — I0 constant rate; I1 an
    initial fast phase plus the rate (one extra parameter). Compared with
    the E2 rule used for M_a–M_d (fit Σz² + 2k, development Σz², spread
    checks).
  - **Evidence roles (user decision):** the 2009 two-drop data are
    development data now; fitting search and intake to them needs a role
    change (2009 between-drop and drop-2 times → fit), keeping the 2003
    six-pipette data (pipettes visited; 19.4 ± 18.9 s between visits,
    n = 55) as the development check.
  - The walker's speed bursts are left alone here: E2 does not depend on
    the walker (A0, which has no bursts, gives the same E2 results).
- **2026-10-09** **User decision on step 3c roles.** The 2009 two-drop
  times named above (time between drops by group; drinking time and volume
  at drop 2) move to **fit** data, with candidates and scoring frozen
  before any fit. The 2003 six-pipette data stay a **development check**:
  they were already compared with models, so they are not an independent
  validation and will not be reported as one. Diagnostics run first; they
  may change which mechanisms are worth fitting.
- **2026-10-09** **Step 3c diagnostics** (`scripts/diagE2Search.ts`, 600
  scouts, adopted E2 model; 86 % found both drops vs > 95 % in the data):
  - **(i) Time between drops, split by activity** (model mean = searching
    + heading home):

    | group | model | search + home | data |
    |---|---|---|---|
    | TL1 (laid before drop 2) | 25 ± 29 s | 7 + 18 | 58 ± 33 |
    | TL2 (started after drop 2) | 60 ± 74 s | 41 + 19 | 141 ± 89 |
    | nTL2 (never laid) | 77 ± 71 s | 59 + 18 | 114 ± 83 |

    Heading home from drop 1 to drop 2 takes ~18 s in the model, so the
    data imply roughly 40 s of searching for TL1 and ~95–120 s for the
    others; the model's layers barely search (a laying ant ends its search
    at once) and its non-layers search about half as long. 56 % of the
    model's TL1 were satiated at drop 1, while in the data TL1 and non-TL1
    drank the same volume.
  - **(ii) Intake form:** the model's pooled volume–time regression is
    0.0058·t + 0.124 µL against the published 0.006·t + 0.15, so the pooled
    line does not separate intake forms (between-ant rate differences and
    volume-estimate noise give the model its intercept). The per-drop ratio
    does: in the data volume per second is higher at drop 2 than at drop 1
    (0.28/23 = 0.012 vs 0.47/51 = 0.009 µL/s, ≈ 2 SE apart), in the model it
    is the same (0.0087 vs 0.0084). A per-bout fast initial uptake (I1)
    would produce that, so I1 **stays a candidate**. _(Corrected below: this
    ratio is not evidence that drop 2 is drunk faster; Mailleux found equal
    slopes and intercepts at the two drops.)_ Model ants drink 39 ±
    21 s and 0.34 µL at drop 2 and never exhaust it (0 %) _(wrong: the test
    compared recorded intake with the drop, and the crop drains while the ant
    drinks; the droplets show 36 % exhaust drop 2; see the 2026-10-09
    review entry below)_, against 23 ± 11 s
    and 0.28 µL, so the leaving decision at drop 2 is the other candidate
    explanation (they may combine).
  - **Consequences for the candidates:** S0 (current) cannot produce
    searching trail layers; S1 (one search duration for every unsatisfied
    ant) cannot by itself make TL1 search much shorter than TL2 (58 vs
    141 s), but stays as the parsimonious baseline; S2 (separate durations
    for layers and non-layers) is the minimal structure that can. For drop
    2: I1 (fast initial uptake per bout) and a leaving-rule candidate.
- **2026-10-09** **Step 3c pre-registration — DRAFT for user approval**
  (frozen once approved, before any fit):
  - **Fit targets:** the current E2 fit rows plus the moved 2009 rows,
    `two.betweenTL1` (58 ± 33 s, n 24), `two.betweenNTL1` (134 ± 87 s, n 39),
    `two.t2` (23 ± 11 s), `two.ul2` (0.28 ± 0.20 µL). Development (reported,
    never fitted): `two.trail`, `two.ulTot`, `two.total`, the three-group
    split of the between-drop time (TL1/TL2/nTL2), and the 2003 six-pipette
    rows (a development check, not an independent validation).
  - **Candidates** (all on the adopted M_a structure, every M_a free
    parameter refitted, plus the search mean(s), currently fixed at 80 s):
    - S0I0: as now (laying ants go home at once), refitted on the new target
      set, so the baseline is judged on equal terms;
    - S1I0: every ant leaving an exhausted drop unsatisfied searches,
      layers included (they keep laying on the way home); one exponential
      search duration (k as S0);
    - S2I0: as S1, separate search means for layers and non-layers (+1);
    - S1I1 / S2I1: as S1 / S2 plus a fast initial uptake in each drinking
      bout: the first v0 µL at a fixed fast rate of 0.05 µL/s, then the
      ant's own rate (+1, v0).
  - **Optimiser** (lessons from E1): CMA-ES with fresh seeds per
    generation, bounded parameters, two starts plus one IPOP restart,
    estimate = average of the last 50 generation means, selection on a
    common batch (selection data only), 150 scouts per evaluation as before.
  - **Judging:** fit Σz² on 5 fresh batches of 300 scouts per condition
    (the same seeds for every candidate) + 2k. A more complex candidate is
    preferred over a simpler nested one only if its paired difference
    after the penalty is below −2 SE. Development Σz², the spread checks
    and the 2003 check are reported beside it, not used for the choice.
    A candidate that cannot estimate a fit row is unjudgeable (the E2
    loss's fixed 100 per missing row is a fitting fallback only).
  - **Recovery before adoption:** the chosen candidate is fitted to
    synthetic data from itself at the real sample sizes (one replicate);
    its predictions must be recovered (same excess rule as E1, per row)
    before it replaces the adopted E2 model.
- **2026-10-09** **Step 3c pre-registration — FROZEN** (user approval with
  amendments; supersedes the draft above; nothing fitted yet).
  - **Status of the diagnostics:** motivation, not proof. The ~40 s of
    searching inferred for TL1 assumes the model's walking time is right;
    group differences also reflect satiation and selection into groups;
    volume/time ratios do not uniquely identify an initial burst. All five
    candidates are fitted.
  - **Fit targets:** the 11 current E2 fit rows plus `two.betweenTL1`,
    `two.betweenNTL1`, `two.t2`, `two.ul2`. **Development, reported only:**
    `two.trail`, `two.ulTot`, `two.total`; the TL1/TL2/nTL2 split (labelled
    accurately: TL1 is the fitted `two.betweenTL1` row, TL2 and nTL2
    subdivide the fitted non-layer aggregate, so the split is not an
    independent check); the 2003 six-pipette rows (a development check,
    not an independent validation).
  - **Search eligibility:** an ant searches when it leaves an **exhausted**
    drop **without having reached its desired volume** (unsatisfied).
    Satiated ants (leaving hazard or full crop) never search. S0: laying
    ants among them go home at once (as now). S1/S2: laying ants search
    too and lay on the way home afterwards. Search duration exponential;
    S1 one mean, S2 separate means for laying and non-laying ants.
  - **Candidates and free parameters** (M_a structure; every candidate
    frees desiredFed, desiredHungry, desiredSd, stopHazard,
    unsatisfiedLayProb, accessible, intakeSd, volumeSd, **intakeRate**
    (newly free in all five, so I1 is not handicapped) and the search
    mean(s)): S0I0 (k 10), S1I0 (10), S2I0 (11), S1I1 (11), S2I1 (12). I1:
    the first v0 µL of each drinking bout at 0.05 µL/s, then the ant's own
    rate.
  - **Bounds** (bounded encoding as in E1, a fit at a bound is reported):
    desiredFed 0.1–3 µL, desiredHungry 0.1–5 µL (log); desiredSd 0.01–2,
    stopHazard 1e-4–1 /s, intakeRate 0.002–0.03 µL/s, search means 1–1000
    s (log); unsatisfiedLayProb 0–1, accessible 0.2–1, intakeSd 0–1,
    volumeSd 0–0.5, v0 0–0.5 µL (linear).
  - **Optimiser and budget:** CMA-ES, initial per-coordinate SDs from the
    curvature probe (as E1), fresh seeds each generation, λ default; two
    starts (the adopted values with search mean 80 s and v0 0.1; and
    search mean(s) 150 s, v0 0.2) plus one IPOP restart; at most 300
    generations per run, tolX 0.03; estimate = mean of the last 50
    generation means; 150 scouts per condition per evaluation; runs
    compared on one common selection batch (450 scouts per condition;
    selection data only).
  - **Judging:** fit Σz² on 5 fresh batches of 300 scouts per condition
    (same seeds for every candidate) + 2k. The ± is **simulation noise
    only**, not sampling of the real ants; "2 SE" is a numerical stability
    requirement and +2k a heuristic penalty, not statistical confirmation
    of a mechanism.
  - **Selection rule (all pairs):** rank by penalised loss P̄ = mean
    batch loss + 2k. The candidate with the lowest P̄ is the provisional
    winner. If some candidate with fewer parameters is within 2 paired SE
    of it (P difference not below −2 SE), the simplest such candidate is
    chosen instead (parsimony); among equal k, the one with the lower P̄
    if separated by > 2 SE, otherwise **unresolved** (S0I0 vs S1I0;
    S2I0 vs S1I1): both are reported and the choice goes to the user. No
    other tie-breaks.
  - **Adequacy, separately from winning:** for every candidate, report the
    fraction of scouts that find both drops (data > 95 %; the fitted
    second-drop rows condition on it) and the TL1/TL2/nTL2 group fractions
    (data 38/46/16 %). A candidate is **adequate** if no fit row has
    combined |z| > 3, at most two have 2 < |z| ≤ 3, and at least 90 % find
    both drops. Outcomes: "best and adequate", or "**best candidate, still
    inadequate**". A candidate that improves conditional times while
    lowering the found-both fraction is flagged.
  - **Recovery (a local numerical check, one replicate):** synthetic data
    are whole simulated scouts from the selected candidate's fitted
    parameters, through the same protocol (paired drops, drop-2 timing,
    volume-estimate noise, observation rules), at the real sample sizes
    per condition; refitted with the same procedure. Score: fresh 2000
    scouts per condition from the recovered and the true parameters,
    against a 2000-scout truth reference with SEs scaled to the real n;
    per fit row, excess z² over the truth's own. Recovered if the mean
    excess ≤ 0.25 and no row > 1; failed if the mean > 1 or any row > 4;
    approximate otherwise. One replicate shows only that the procedure
    can recover this one data set, not reliable recovery across data
    sets. **Adoption** requires best + adequate (or the user's decision
    if inadequate) and recovery; recovery alone never triggers adoption.
- **2026-10-09** **Correction: intake at drop 2 (step-3c motivation).**
  Rereading Mailleux et al. 2009 §3.1.2 shows that the volume–time
  regressions at the two drops **do not differ in slope (F(1,122) = 0.01)
  or in intercept (F(1,122) = 0.26)**, and the authors conclude that intake
  rates were similar. Our diagnostics (ii) said that "volume per second is
  higher at drop 2 (≈ 2 SE)". That is a ratio of means, and it follows from
  the common line itself: 0.006·23 + 0.15 = 0.29 µL and 0.006·51 + 0.15 =
  0.46 µL, so shorter bouts have a higher µL/s whenever the intercept is
  positive. It is not a separate signal, and it must not be presented as a
  finding that drop 2 is drunk faster.
  - A within-bout fast phase (I1) remains a **hypothesis**. It is one
    possible source of the shared intercept. The other is attenuation by
    noise in the time and volume estimates (per-drop rs only 0.22/0.31),
    which is how the model already gets its 0.124 µL intercept _(wrong
    source: drinking time has no observer noise and noise in y does not
    bias OLS; the model's intercept comes from clipping estimates at zero
    (drop 2, true intercept 0.05 µL) and the exhaustion ceiling plus early
    leavers (drop 1); review entry below)_. The
    published data do not distinguish the two.
  - **The frozen pre-registration is unchanged.** I1 was always to be fitted
    and judged on equal terms, and its result is reported as "fits better
    or not", never as confirmation of the motivation. The z ≈ 10 drop-2 gap
    is a **duration** gap (model 39 s and 0.34 µL against 23 s and 0.28 µL).
    The leaving decision at drop 2 explains it at least as directly as the
    intake form.
  - Extra check for the step-3c report (development, not fitted): the
    per-drop volume–time regressions of each candidate (slope, intercept,
    rs), compared with the data's equal-slope/equal-intercept result.
  - Reading policy: a paper is recorded as adding evidence only for the
    **specific measurement** it adds beyond what we already use. Leads
    beyond Mailleux 2009 (hypotheses, none used as *Lasius* parameters):
    Le Breton & Fourcassié 2004 (search-path geometry and its experimental
    manipulation); Josens et al. 2006 and Falibene et al. 2009 (direct
    pump-activity measurements, *Camponotus*; bear on I1); Greenwald et al.
    2018 (crop load vs foraging frequency, *Camponotus*; colony step).
- **2026-10-09** **Step 3c follow-up diagnostics** (adopted model, 600
  scouts, `diagE2Search.ts` extended; run before the I1 fits use compute):
  - **Per-drop volume–time regressions:** drop 1 slope 0.0057 µL/s,
    intercept 0.136 µL, rs 0.38; drop 2 slope 0.0057, intercept 0.120,
    rs 0.53. Mailleux: no difference between the drops in slope or
    intercept (F-tests NS), pooled 0.006·t + 0.15, rs 0.22 / 0.31. **The
    model already gives equal slopes and intercepts near 0.12–0.14 µL at
    both drops** through volume-estimate noise and between-ant rates, so
    I1 has nothing left to explain in the drinking regressions _(wrong on
    both counts: with 2607 scouts the model's per-drop regressions differ
    (slope z 7.3, intercept z −8.4), though at n = 63 the test would detect
    it only 15 % / 5 % of the time; and the intercepts come from clipping
    and the exhaustion ceiling; review entry below)_; its only
    remaining route is shortening drop-2 bouts, which the drop-2 leaving
    decision competes for. The frozen comparison still fits I1, and any
    I1 win is to be read in that light. New observation: the model's
    per-drop rs are higher than the data's (0.38 / 0.53 vs 0.22 / 0.31):
    the data's volume–time relation is noisier than the model's (e.g. more
    noise in the time or volume estimates). Not fitted; noted.
  - **Who never reaches drop 2 — correction of the 86 %:** 600 scouts →
    548 drank at drop 1 (52 never found it within 900 s) → 518 also drank
    at drop 2. Among scouts that drank at drop 1 (the experimenters'
    denominator), **94.5 % found both**, against > 95 % in the data, not
    86 % (that figure used all launched scouts). `selectE2.ts` already
    uses the right denominator. Of the 30 that missed drop 2: 26 walked past
    it on the 5 mm bridge without touching it and got home, 4 were still out
    at 900 s; 7 had been satiated at drop 1, 11 were laying.
  - **I1's fast rate (0.05 µL/s) has no source:** chosen by hand, about 5×
    the sustained rate. Any I1 result depends partly on it. If an I1
    candidate is selected, its result is reported with that caveat and
    with a sensitivity check at other fast rates (e.g. 0.02 and 0.1 µL/s;
    reported, not re-selected). Josens et al. 2006 and Falibene et al.
    2009 (direct pump measurements, *Camponotus*) may give a prior for the
    ratio of initial to sustained rate; to be read before interpreting I1.
- **2026-10-09** **Step 3c addition: trail-laying group rows (development,
  reported only; logged before any step-3c result is seen — the S0I0 fit
  had started, but these rows are never fitted and do not enter the frozen
  selection or adequacy).** All five candidates share the laying decision
  (`lasiusForager.ts` drink case: a satiated departure always lays unless
  a never-layer; an unsatisfied departure from an exhausted drop lays with
  `unsatisfiedLayProb`), so none of them tests it, and group membership is
  then mostly a product of satiation (56 % of the model's TL1 satiated at
  drop 1). Mailleux 2009 has group data that bear on it directly:
  - drop 1, TL1 vs nTL1: volume 0.49 ± 0.26 vs 0.46 ± 0.24 µL (NS), time
    52 ± 13 vs 50 ± 11 s (NS);
  - drop 2, TL1 / TL2 / nTL2: time 20 ± 13 / 25 ± 10 / 20 ± 12 s; volume
    0.20 ± 0.14 / 0.33 ± 0.20 / 0.31 ± 0.24 µL (TL1 lower, superscripts
    b vs c); every ant that reached drop 2 drank.
  The fitted rows `two.betweenTL1` and `two.betweenNTL1` are conditional
  on group, so if the model's groups are composed differently, S2's
  separate search mean for layers can absorb the difference and win for
  the wrong reason. `selectE2.ts` (and `diagE2Search.ts` for the adopted
  model) now report, per candidate: these rows with z = difference /
  √(SD_data²/n_data + SD_sim²/n_sim), and the satiated fraction per
  group. Reading: if every candidate fails them, the next structural
  question is "satiation decides laying", not the search or intake form.
  **Adopted model** (`diagE2Search.ts`, 518 scouts that drank at both
  drops; z as above; 10 rows, so one |z| > 2 is expected by chance):
  - drop 1: TL1 0.37 ± 0.23 µL, 44 ± 20 s (z −2.2, −2.6); nTL1 0.46 µL,
    54 s (z −0.1, 1.9). _(Level z's; as contrasts TL1 − nTL1 the drop-1 time is clearly off,
    z −3.2, the volume is not, z −1.7; review entry below.)_ **The model's layers drink less at drop 1 than its
    non-layers (0.37 vs 0.46 µL, 44 vs 54 s); the data show no difference
    (0.49 vs 0.46, 52 vs 50).** This is the satiation route: ants with a low
    desired volume are satiated early, leave sooner and lay.
  - drop 2 time: TL1 39, TL2 35, nTL2 43 s (z 6.2, 4.2, 5.5): too long in
    every group, which is the fitted `two.t2` misfit the step-3c fits
    address; not a group signal by itself.
  - drop 2 volume: TL1 0.33, TL2 0.33, nTL2 0.38 µL (z 4.0, −0.1, 0.9).
    **The data's TL1 drink less at drop 2 (0.20 vs 0.33 / 0.31); the
    model's do not**, although 56 % of them are satiated (they leave at
    about `stopHazard`, not faster) _(wrong: model "satiated" means the
    hazard fired before the drop ran out; those ants left drop 1 at 0.29 µL
    and 35 s, far below their desired volume, and leave drop 2 well below
    `stopHazard`. These are level z's; the paper reports contrasts; review
    entry below)_.
  - satiated at drop 1: TL1 56 %, TL2 29 %, nTL2 15 %.
  Reading for now: two group contrasts go the wrong way (drop-1 TL1 vs
  nTL1, drop-2 TL1 volume). Whether a fitted candidate fixes them is
  read in `selectE2.ts`; if none does, the laying decision is the next
  structural question.
- **2026-10-09** **Step 3c: three corrections from user review (logged
  before acting; none touches the fit rows, the fit seeds or the frozen
  rule, so the running fits continue).**
  1. **`two.total` measured a different interval from the data.** The
     2009 Table 2 "Total" is drinking at drop 1 + time between drops +
     drinking at drop 2 (it adds up: 51 + 105 + 23 ≈ 178, 52 + 58 + 20 =
     130, 46 + 114 + 20 = 180); `res.total` runs from entering the area to
     the end of the run (search for drop 1 and the trip home included).
     Development row only, but every earlier report of `two.total`
     compared mismatched quantities. Fix: the row becomes
     `drinks[0].time + betweenTime + drinks[1].time`; `res.total` keeps
     its meaning, documented.
  2. **An independent measurement covers the search time.** Mailleux 2003
     uses Pl = 1/85 s⁻¹, the rate at which unsatisfied ants leave the area,
     measured as the giving-up time after a single 0.3 µL drop in the 2000
     data (exponential, n = 35, so 85 ± 14 s), not from the two-drop
     experiment; with it (and Pd = 1/20 s) their 2009 Monte Carlo model
     reproduces the group totals (TL1 120 ± 39 vs 130, TL2 219 vs 212,
     nTL2 186 vs 180). Step 3c frees `arsMean` over 1–1000 s and its
     provenance says it was fitted to the two-drop times. **Decision:**
     (a) now: `selectE2.ts` reports each candidate's fitted search mean(s)
     against 85 ± 14 s, and, like for like, the model's giving-up time at
     a single 0.3 µL drop, 4 days starved (end of drinking → crossing the
     mid-bridge on the way back, scouts that drank), against 85 ± 14 s
     (2000) and 86 ± 68 s, n 23 (2006, 4 d; may overlap the 2000 data).
     Development, reported only; a fitted search mean far from it (say 30
     or 300 s) conflicts with a direct measurement and the candidate's
     search cannot then be called a mechanism. Geometry caveat: our bridge
     is 12 cm (2009), the 2006 one 20 cm; mid-bridge is 6 vs 10 cm from
     the area, ≈ 2–3 s of walking. (b) The authors' 2009 rule set as a
     reference baseline in `src/sim/reference/` (as Bles TEC for E6 and
     the Khuong walkers for E1): **adopted as the next step after the
     step-3c judging**, before step 4; it does not affect the fits. It
     reaches the group totals with measured parameters, so it is the
     comparison that says what our fitted search adds; it needs §2.2 of
     the 2009 paper re-read for how between-drop times arise.
  3. **Judging and synthetic seeds collided with fit seeds.** Start 0 of
     `fitE2c.ts` uses seed bases 30M + 10M·(g + 1): generation 5 = 90M
     (`selectE2.ts` batch 0) and generation 10 = 140M (its pooled adequacy
     run); in recovery, generation 1 = 50M, the synthetic-data base, with
     conditions shifted by one. Practical bias ≈ 0 (early generations;
     the estimate averages the last 50), but the pre-registration says
     "fresh batches". Fix: `selectE2.ts` seeds from 4.0e9, synthetic data
     from 4.1e9; fit seeds stay below 3.1e9 (300 generations), and
     scout seeds are hashed as 32-bit integers (< 2³² ≈ 4.29e9), so the
     ranges are disjoint.
- **2026-10-09** **User review of the step-3c analysis (scratch runs of the
  adopted model, 400–600 scouts each) — corrections and decisions.** Items
  1, 4 and 5 correct readings written above (marked inline); 2, 3 and 6
  bear on what the step-3c fits estimate. Verified here: the code for 2
  and 6; the contrasts of 5 (reproduced exactly with `e2Groups.ts`); a
  3000-scout regression check (`scripts/regE2Drops.ts`). The numbers of
  1, 3 and 4 are the reviewer's runs, not re-run here.
  1. **Drop 2 runs dry for 36 % of scouts, not 0 %** (drop 1: 69 %; TL1
     33 %, TL2 27 %, nTL2 43 %). `diagE2Search.ts`'s test (recorded
     intake ≥ 98 % of the accessible volume) cannot be met because of 2.
     Drop-2 bout length is partly capped by the drop, not only by the
     leaving rule, and a scout that empties drop 2 unsatisfied starts a
     second search.
  2. **The crop drains while the ant drinks.** `metabolise`
     (`antPhysics.ts`) moves crop contents into the reserve at
     `room × 0.001 /s` plus the metabolic need; the rate is hard-coded
     with no provenance. Recorded intake (`trueUl`) and the satiation
     signal (`m.ingested`) are ≈ 90 % of what left the drop; drop-1
     recorded intake bunches at 0.48–0.51 µL and longer drinkers record
     less. Confounds the fitted pipette accessibility (0.785), its "well
     identified" profile, and the 2003 "data exceed our accessible volume"
     argument.
  3. **The pooled volume–time targets mostly measure the gap between the
     drop means.** Data pooled rs 0.46 vs 0.22 / 0.31 within drops. Model
     at σ_m 0.21 (adopted): per-drop 0.28 / 0.53, pooled 0.45; at σ_m
     0.35: 0.20 / 0.33 (matching the data), pooled 0.29, which collapses
     only because the model's drop-2 bouts are too long. So `two.vtRs`
     pushed σ_m down to compensate for the drop-2 misfit (consistent with
     the σ_m profile having no upper bound), and in step 3c `vtSlope` and
     `vtRs` largely repeat `ul1`, `t1`, `ul2`, `t2`: double counting.
  4. **The model's intercept does not come from attenuation.** Drinking
     time has no observer noise and noise in y does not bias OLS. Drop 2:
     true intercept 0.05 µL; 0.13 µL in the estimates comes mainly from
     clipping noisy estimates at zero (`Math.max(0, est)`, `e2Mailleux.ts`;
     itself an unsourced observation assumption). Drop 1: the exhaustion
     ceiling plus early leavers. Added here: with 2607 scouts the model's
     per-drop regressions **differ** (drop 1 0.0044·t + 0.204, drop 2
     0.0064·t + 0.096; slope difference z 7.3, intercept z −8.4; the
     600-scout "equal" reading was sampling noise), though at the data's
     n = 63 an ANCOVA would detect the slope difference in 15 % and the
     intercept difference in 5 % of samples, so the paper's NS tests do not
     reject it. "I1 has nothing left to explain" is withdrawn.
  5. **The group rows tested levels, not the paper's contrasts.** Model
     (TL1 − nTL1) vs data (TL1 − nTL1), both SEs: drop-1 time −9.5 vs
     +2.0 s, z −3.2 (clearly off); drop-1 volume z −1.7 (not significant;
     it was bolded above); drop-2 volume z 2.2 (marginal); drop-2 time z
     1.1. Level z's (e.g. TL1 drop-2 volume z 4.0) include the known
     drop-2 level misfit. Model "satiated" = the hazard fired before the
     drop ran out: those ants left drop 1 at 0.29 µL and 35 s on average,
     far below their desired volume, so at drop 2 they leave well below
     `stopHazard`; the drop-1 time contrast follows by construction.
     Group fractions: model 35 / 33 / 31 % vs data 38 / 46 / 16 %.
     `e2Groups.ts` now prints the contrasts (labelled CONTRAST) beside the
     levels.
  6. **The code does not match its documented rule or the frozen
     pre-registration.** `m.satisfied` is set only when the hazard fires;
     an ant past its desired volume that then empties the drop is treated
     as unsatisfied (searches; lays only with probability q). The doc
     comment (`lasiusForager.ts` header) and the frozen eligibility rule
     say "without having reached its desired volume". Size: 9 % of
     unsatisfied exits (10 of 363 at drop 1, 33 of 121 at drop 2); 21 of
     162 model nTL2. **Decision (user left it to me): fix the code to
     match the documented, pre-registered rule** (an ant leaving an
     exhausted drop with ingested ≥ desired counts as satisfied) and
     restart the fits; the frozen text was the intent, and an ant that has
     reached its desired volume is satiated by the model's own definition.
     **Status:** stopping the running fit loop was blocked by the
     permission classifier, so the code is not yet changed (the loop would
     otherwise fit later candidates under a different rule than S0I0);
     waiting for the user to stop the loop or allow it.
  **Before the fits restart, two decisions for the user** (items 2, 3;
  both change the model or the fit rows, so they amend the frozen
  pre-registration):
  - Item 2: the observer should record what left the drop (a gaster
    ellipsoid sees crop + midgut, so crop→midgut transfer barely changes
    it), and crop absorption during a foraging trip should have a sourced
    rate or be limited to the metabolic need; then accessibility is
    re-estimated within the fits as now.
  - Item 3: replace the pooled `two.vtSlope` / `two.vtRs` fit rows with the
    per-drop rs (0.22 and 0.31, n 63 each; SE (1 − r²)/√60), which carry
    the within-drop information without repeating the drop means.
  **First results of the three corrections (adopted model; `reportE2.ts`,
  `selectE2.ts --prefix data/fits/e2- --fits drinking`):** corrected
  `two.total` 141 ± 73 s vs 178 ± 83 s (z −3.5; development). Giving-up time
  at one 0.3 µL drop, 4 d: 67 ± 77 s, median 42 s (274 of 275 crossed
  mid-bridge) vs 85 ± 14 s (2000) and 86 ± 68 s (2006, n 23): consistent
  (z ≈ −1.2), with the fitted `arsMean` 80 s; but **36 % of these scouts laid
  trail vs 17 % in 2006 (4 d, n 23; z ≈ 2.4)**: `unsatisfiedLayProb`,
  identified from the 2009 38 % TL1, over-predicts laying at a 0.3 µL drop,
  another sign that the laying decision is the open question.
- **2026-10-09** **Review follow-up.** The user stopped the step-3c fit loop
  (S0I0 at start 0, generation 110; no fit file written). Done since:
  - **Item 6 fixed:** `lasiusForager.ts` drink case: an ant whose ingested
    volume has reached its desired volume when the drop runs out is a
    satiated departure (`satisfied`, lays unless a never-layer), as the
    doc comment (reworded) and the frozen eligibility rule say. Tests pass.
    The adopted E2 fit was made under the old rule; it is a start point
    for the step-3c fits, which refit every behavioural parameter.
  - **Second-pass review items (user):**
    1. **Crop drain magnitude** (1999 3 µL drop): recorded ÷ removed while
       drinking 0.975 / 0.90 / 0.81 at 1 / 4 / 8 d; crop at the nest ÷
       removed 0.95 / 0.85 / 0.71; drinking 66 / 86 / 96 s. Desired volume
       barely moves between 4 and 8 d (`hungerScale` 0.3 saturates it:
       0.80 vs 0.81 µL), so the model's 86 → 96 s rise comes almost
       entirely from the drain, and `desiredFed` / `desiredHungry` partly
       measure it. In the colony, foragers lose up to ≈ 30 % of what they
       drank before they can share it: every E6 donation statistic depends
       on this unsourced constant. Decision pending (user); see below.
    2. **Drop-1 rows used a different denominator — fixed.** `two.ul1`,
       `two.t1`, `two.tl1` averaged every scout that drank at drop 1; the
       data (0.47 µL, 51 s, 38 %) are from the 63 that found both drops.
       Now computed over scouts that found both (`e2Targets.ts`). Fit
       rows: a correction of a mismatch, applied before any step-3c fit
       has finished.
    3. **E6 scan observer counts contacts the protocol would not**
       (`observeContacts`: in progress at the scan and > 5 s in total; an
       observer starting at the scan instant needs > 5 s *after* it, so a
       contact ending 1 s after the scan is counted and event counts are
       inflated). The TEC baseline went through the same observer, so the
       models stay comparable with each other, not exactly with the data.
       The protocol text ("a pair is recorded if mandible-to-mandible
       contact lasts > 5 s") does not say which; the forward-looking
       reading is the one an instantaneous scan can apply. Proposed: switch
       to it, keep the old reading as a reported sensitivity, refit E6 when
       the E6 test next runs.
    4. **Small (backlog):** CMA-ES `meanAvg` over the last 50 generation
       means pulls a run that stops on tolX early, or is still drifting,
       towards earlier positions (proposed: average over the last
       min(50, half the generations run), and report the drift of the mean
       over that window); the walker counts the full planned distance when
       a wall truncates a step; mulberry32 has 2³² states, so scout
       streams can partly overlap within a batch. The last two negligible.
  - **Crop drain: recommendation for the user's decision.** (a) The
    experimenter's volume estimate records what left the drop (the gaster
    ellipsoid sees crop + midgut, so crop→midgut transfer barely changes
    it). (b) Until a rate is sourced, absorption from the crop during a
    foraging trip is limited to the metabolic need (≈ 0 over minutes); the
    `room × 0.001 /s` term applies only in the nest, still unsourced and
    flagged for E6. (c) A literature check for crop-emptying rates
    (proventriculus passage; *Camponotus* and *Lasius* data) before E6.
    Every E2 parameter will shift, so this precedes the step-3c refits.
- **2026-10-09** **Step 3c pre-registration amendments (user decisions;
  logged before acting; they supersede the frozen text where they differ,
  and the fits restart from scratch after them).**
  1. **Crop and intake.** (a) The experimenter's volume = volume removed
     from the drop + observer noise (a gaster ellipsoid cannot see
     crop→midgut transfer). (b) The satiation signal `m.ingested`
     integrates the flow at the mouthparts, not the net crop change, so it
     is right whatever absorption rule is adopted. (c) One absorption rule
     everywhere (no nest/outside switch, which would create a jump at the
     entrance): absorption = metabolic need + an explicit `cropAbsorption`
     rate (estimated parameter, default 0, flagged in E6's provenance; it
     replaces the hard-coded `room × 0.001 /s`), its value from a
     literature search on crop emptying before the E6 calibration. (d)
     Expected: the model's 4 → 8 d drinking-time rise vanishes
     (`hungerScale` 0.3 saturates the desired volume by day 4); the data's
     rise, 88 → 93 s, is ≈ 1.6 SE (√(24²/135 + 23²/92) ≈ 3.2 s). No
     parameter is added for it; a miss is reported.
  2. **Volume–time rows.** Fit rows: the per-drop Spearman rs (drop 1
     0.22, drop 2 0.31, n 63 each) replace the pooled `two.vtRs`, compared
     on the Fisher-z scale (atanh rs, SE √(1.06/(n − 3)) = 0.133). The
     pooled slope `two.vtSlope` and pooled rs become development rows
     (≈ 60 % of the slope's variance comes from the step between the drop
     means, which are fitted already; the paper gives no per-drop slopes).
     Fit rows: 15 → 15 (− vtSlope − vtRs + rs1 + rs2). Consequence: nothing
     directly targets the intake-rate SD σ_r, and two rs with SE ≈ 0.12
     identify σ_m and σ_r only weakly together, so the selected candidate's
     report adds profiles of σ_m (`volumeSd`) and σ_r (`intakeSd`) beside
     the recovery check; a flat profile is reported as "not identified",
     not read as an estimate.
  3. **E6 observer.** A contact is recorded at a scan if it continues more
     than 5 s after the scan instant (the only reading an instantaneous
     scan can apply); the old reading (in progress, > 5 s in total) is kept
     as a reported sensitivity. At the next E6 test both TEC numbers are
     rerun: the published TEC-exp through the observer (82 events) and the
     tier-2 refit `e6-tec.json`. **Note for step 4:** our model's contacts
     end when food stops flowing, but the observer sees mandible contact;
     the two need not coincide.
  4. **CMA-ES averaging.** `meanAvg` averages the last min(50, ⌊generations
     run / 2⌋) generation means, and the drift of the mean over that window
     is reported. (Unchanged for runs of ≥ 100 generations.)
  5. **Recorded:** the stopped S0I0 run was partly seen (losses 77–190 at
     generation ≈ 90 were looked at). No candidate comparison was made, so
     the selection is not compromised.
  6. **The adopted E2 fit predates the fixes:** `e2-drinking.json` and the
     M_a numbers in this file were produced under the old satiation rule,
     the old drop-1 denominators, the crop drain and the pooled rs row.
     They stay as the step-3c start point; pages run live until
     `npm run precompute` is rerun.
  **Implemented (all six; tests pass):**
  1. `PhysParams.cropAbsorption` (`lasiusM1.ts`: estimated 0 /s, flagged
     for E6); `metabolise` absorbs need + cropAbsorption × room. `mouthFlow`
     is now reset at the start of every forager step (`applyForagerAction`;
     in E2 it had been cumulative, unused), and both the satiation signal
     (`lasiusForager.ts`) and the E2 observer (`e2Mailleux.ts`) integrate it;
     `Mind.lastCropUl` removed.
  2. `two.vtRs1`, `two.vtRs2` fit rows (Fisher z); `two.vtSlope`,
     `two.vtRs` development; `e2Synthetic.ts` SEs to match. Fit rows: d1/d4/d8
     drink + trail, two.ul1, t1, tl1, ul2, t2, betweenTL1, betweenNTL1,
     vtRs1, vtRs2 (15). Profile script `scripts/profileE2c.ts` (pinned value,
     other parameters re-fitted, common batch, Δloss 3.84; "NOT IDENTIFIED"
     when flat across the grid); seeds 3.5e9–3.9e9.
  3. `observeContacts` rule 'after' (default) / 'total' (sensitivity);
     tests updated. E6 numbers not rerun (next E6 test).
  4. `cmaes` window min(averageLast, ⌊g/2⌋), returns `meanDrift` and
     `avgWindow`; `fitE2c.ts` logs them.
  **Adopted model under the amended code** (start point only; not a
  candidate comparison): drinking 67 / 78 / 82 s at 1 / 4 / 8 d (data 65 /
  88 / 93): the 4 → 8 d rise is now 4 s (data 5 s), and the 4 and 8 d
  levels fall (they had leaned on the drain); per-drop rs (Fisher z) 0.40 /
  0.80 vs 0.22 / 0.32. The step-3c fits restart from scratch on this code.
- **2026-10-09** **Step 3c recovery scoring step — FROZEN** (written before
  any candidate result; implements the frozen "Recovery" text as is):
  `scripts/recoverE2c.ts --fit data/fits/recover/e2-3c-<id>-rep0.json`.
  Reference = 2000 scouts per condition from the true parameters (the
  selected candidate's fit), each fit row summarised as the data are, SEs at
  the real n (`E2_TARGETS` n: SD/√n, binomial, the per-drop rs' own Fisher-z
  SE). The true and recovered parameters are each simulated afresh (2000 per
  condition, common seeds, not the reference's) and scored per fit row with
  the fit z; excess = z²(recovered) − z²(truth). Recovered: mean excess
  ≤ 0.25 and no row > 1; failed: mean > 1 or a row > 4 (a row the recovered
  model cannot estimate is +∞); approximate otherwise. Seeds 4.25e9 / 4.27e9
  (disjoint from fits < 3.1e9, profiles 3.5–3.9e9, selection 4.0e9,
  synthetic data 4.1e9, regE2Drops 4.2e9). Smoke test (stand-in truth =
  the adopted M_a as S0I0, 400 scouts): identical parameters give excess 0
  on every row (RECOVERED); stopHazard × 1.5 with arsMean halved gives mean
  1.02, worst d1.drink 4.8 (FAILED). Sequence after selection: `fitE2c.ts
  --variant <id> --recover data/fits/e2-3c-<id>.json --rep 0`, then this
  script, then the σ_m and σ_r profiles (`profileE2c.ts`).
- **2026-10-09** **Reference baseline from Mailleux et al. 2009: not
  buildable as a faithful port (finding; changes the adopted next step).**
  Re-read of the paper (C R Biol 332:500–506, open access, pp. 502–504):
  - §2.2 specifies only the stopping rule S(V) = ηΔV/(1 + e^{−η(V − Vc)})
    (ΔV 0.01 µL/s, η 4.3, Vc 1 µL), that 90 % of ants reaching their
    threshold lay trail, and that Monte Carlo runs predicted trail fractions
    and volumes. It says nothing about how between-drop or total times
    arise. "With Pl = 1/85 s and Pd = 1/20 s their model reproduces the
    group totals" (entry above, correction 2) was our inference, not the
    paper's statement.
  - The theoretical N column of Tables 1–2 does not add up: TL1 190 000,
    TL2 294 570, nTL2 104 570 sum to 589 140 of 500 000; TL1 is exactly
    38 % of 500 000 and TL2 − nTL2 = 190 000. The group sizes look
    imposed from the data, not predicted.
  - Reconstruction of the stated rules (scratch Monte Carlo, 500 000 runs,
    full 0.7 µL drinkable, compared with the authors' *theoretical* column
    only, no data): overall trail 77 % (Vc 1) / 81 % (Vc 0.9) vs their 79 %
    ✓; total volume 1.08 / 1.03 µL vs 0.85 ± 0.30 ✗; TL1 share 19 / 26 %
    vs 38 % ✗; TL1 total 0.98 / 0.94 vs 0.80 µL ✗. Their theory column
    depends on rules the paper does not state (drinkable fraction, travel
    and search times, group formation).
  - **Consequence:** a baseline would be our reconstruction with free
    choices, which defeats its purpose (what a model with only measured
    parameters achieves). Proposal for the user: drop item (b) of the
    "three corrections" entry as a reference baseline; keep its useful
    part, the comparison of each candidate's search with the independent
    measurement Pl = 1/85 s (already reported by `selectE2.ts`, giving-up
    time at one 0.3 µL drop). Also noted from the paper: the text reports
    TL1 vs nTL1 drop-2 volume as "U = 287, p < 0.03, NS" (sic; Table 1
    letters b vs c say different).
- **2026-10-09** **Literature check: crop absorption and I1's fast rate**
  (reading policy: recorded only for the specific measurement each adds).
  - **Crop emptying (`cropAbsorption`).** No *Lasius* or *Camponotus*
    crop-emptying rate was found; the proventriculus of formicines is
    elaborate (occlusory tract / cupola) and retains liquid in the crop.
    The one direct measurement found: Howard & Tschinkel 1981 (J Insect
    Physiol 27:67–74; *Solenopsis invicta*, a myrmicine, workers starved
    1 week, 5 % sucrose with ¹²⁵I, isolated). The crop's share of the meal
    falls "rapidly between 0 and 6 h, then slightly to moderately" (text);
    read from their Fig. 5 for medium workers: ≈ 0.85 at 0 h, ≈ 0.65 at
    6 h, ≈ 0.55 at 24 h (small workers ≈ 0.6 → 0.3 → 0.25). That is a few
    % of the meal per hour (≈ 3–5 %/h over the first 6 h), against ≈ 6 %
    per minute under the old `room × 0.001 /s` drain. Reading: (a) on a
    foraging trip of minutes, absorption beyond metabolism is negligible,
    so `cropAbsorption` = 0 is right for E2; (b) in E6's 60-min window a
    myrmicine-like rate would move ≲ 5 % of a forager's crop, an upper
    bound for a formicine. Proposal for E6: keep 0, or re-parameterise
    as a first-order fraction of crop contents per hour (≈ 0.03–0.05 /h,
    source above, upper bound) rather than × reserve room; decide at the
    step-4 calibration.
  - **I1 fast rate.** Josens et al. 2006 (J Insect Physiol 52:1234;
    *Camponotus mus*, electrical pump recordings): pump frequency 2–12
    peaks/s; for 10–50 % sucrose the pattern is regular and "decreased with
    intake in all cases". Falibene et al. 2009 (J Insect Physiol 55:518):
    initial and final pump frequencies, and their difference, are higher in
    sugar-deprived ants; concentration changes volume per contraction, not
    frequency. Only abstracts were accessible (full texts paywalled), so no
    initial/final ratio is available. Reading: intake rate declines
    *gradually* within a bout; nothing found supports a step-shaped
    initial phase at ≈ 5× the sustained rate (I1's 0.05 µL/s). If I1 is
    selected, the 0.02 µL/s (≈ 2×) sensitivity run is the more plausible
    end, and I1 is reported as a stand-in for a declining rate, not as a
    measured burst.
- **2026-10-09** **Code review, remaining items (no simulated value
  changes; the queued step-3c fits are unaffected).**
  - **Provenance labels** (`lasiusM1.ts`; resolved parameter set checked
    byte-identical before and after): `arsMean`, `homeGain`, `loadSlowdown`
    were labelled "fitted (E2)" but no E2 fit ever freed them (checked every
    `data/fits/e2-*.json` free list) → estimated, with notes (`homeGain` and
    `loadSlowdown` cited return times, which are not an E2 target);
    `intakeRate` → derived (0.47 µL / 51 s). Walk parameters: all 18 in
    `e1-walk.json` were free (stages 1–2 of the fit at a7b5269), but the
    terms added later (`jitterTime`, `turnRateTime`, `turnDip`, …) take
    `DEFAULT_WALK` values and were labelled fitted → estimated. The E1
    provenance said "validated by withheld π/9, π/4"; those are development
    data → corrected.
  - **Tests** (`test/e2.test.ts`, `test/e1.test.ts`; 61 pass): the recorded
    intake equals the volume that left the drops even with crop absorption
    on (the check that would have caught the drain); an ant past its
    desired volume at an exhausted drop leaves satiated and lays, one below
    it searches. The two E1 `it.fails` known-gap tests (which also passed on
    a crash) now assert the gap explicitly, so a crash or a closed gap fails
    them.
  - **Giving-up time** (`selectE2.ts`, development): reported for all scouts
    and for non-layers (Pl is described as the rate of unsatisfied ants; the
    2000 paper does not say which scouts its n = 35 covers).
  - **Profile resolution** (`profileE2c.ts`, before any profile is run):
    each grid value is scored on 3 common batches (mean = profile loss);
    each Δ carries a paired SE, and a Δ within 2 SE of 3.84 is reported
    "borderline", not decided by Monte Carlo noise.
  - Backlog additions (Open problems): E1 data orientation and the tilt bias
    of `alignY`; the E2 clip-at-zero observer; E6 contact vs flow.
- **2026-10-09** **User decision: the Mailleux 2009 reference baseline is
  dropped.** It supersedes item (b) of the "three corrections from user
  review" entry ("adopted as the next step after the step-3c judging"). The
  paper does not specify how its times arise and its theoretical column is
  not reproducible from the stated rules, so a baseline would be our own
  reconstruction (entry "Reference baseline from Mailleux et al. 2009: not
  buildable"). What it was meant to answer, whether a candidate's fitted
  search agrees with a direct measurement, stays as the development
  comparison of the fitted search mean(s) and the model's giving-up time
  (all scouts and non-layers) with Pl = 1/85 s in `selectE2.ts`. After the
  step-3c judging the next step is the laying-decision question (step 3d if
  every candidate fails the group contrasts), else step 4.
- **2026-10-09** **Papers supplied by the user (read 2026-10-09; PDFs are
  local only, not committed).** Reading policy: what each adds.
  - **Mailleux et al. 2000** (Anim Behav 59:1061; now development, see the
    contamination log). Conditions: 4 days starved, 0.6 M (settles the
    "1 M" doubt), 22 °C, bridge 20 cm × 0.5 cm plus a 5 cm drawbridge; the
    drop was renewed as the scout climbed the stick. Giving-up time = end of
    drinking → seen at mid-bridge homebound. Table 1 (all scouts) and
    Table 3 (by trail group):

    | drop | trail % (n) | giving-up all (n) | layers (n) | non-layers (n) | ingested µL |
    |---|---|---|---|---|---|
    | 0.3 µL | 14 % (42) | 113 ± 129 (26) | 28 ± 12 (4) | 128 ± 135 (22) | 0.2 ± 0.1 |
    | 0.7 µL | 17 % (29) | 56 ± 35 (15) | 24 ± 13 (3) | 63 ± 35 (12) | 0.5 ± 0.2 |
    | 1 µL | 70 % (60) | 42 ± 56 (39) | 31 ± 34 (27) | 74 ± 94 (12) | 0.7 ± 0.3 |
    | 3 µL | 91 % (112) | 28 ± 29 (95) | 27 ± 30 (89) | 38 ± 20 (6) | 0.9 ± 0.4 |

    - **Pl = 1/85 s is not printed here.** The 2003 paper attributes it to
      "the 2000 data" (n = 35); no subset in Tables 1–3 gives 85 s with
      n = 35. The like-for-like targets for `selectE2.ts`'s giving-up check
      at 0.3 µL are 113 ± 129 (all), 128 ± 135 (non-layers, roughly
      exponential: SD ≈ mean), 28 ± 12 (layers).
    - **Walking speed on the bridge: 1.5–2.1 cm/s** out and back at every
      drop size, not correlated with the volume ingested (also 2006: 1.6–2.1
      cm/s at 1 / 4 / 8 d). **The model homebound over the same 2.5 cm at
      mid-bridge (3 µL, 4 d, 200 scouts): 3.4 ± 2.0 cm/s** (4.3 ± 3.1 with
      `loadSlowdown` 0): about twice the data. The walker (E1, 26 °C,
      canvas, `speed` 55 mm/s) is used unchanged in E2 (22 °C, bridge).
      The between-drop and search times of step 3c depend on it.
    - `loadSlowdown` = 1 is contradicted (no speed–load relation); the
      model shows none either way (rs −0.09 / −0.03), so it only slows
      laden ants on average.
    - **Trail fraction at a single 0.7 µL drop: 17 % (5/29), against 38 %
      (24/63) after the first 0.7 µL drop in 2009** (z ≈ 2.3; 2000 counts
      any mark on the whole bridge, 2009 TL1 the first section, so the 2000
      criterion is the more inclusive one). The `q` parameter exists to fit
      the 38 %. At 0.3 µL: 14 % (2000), 17 % (2006, 4 d).
    - Measured drinkable share: ingested/offered ≈ 0.67–0.71 at 0.3–1 µL
      (includes satiated departures), consistent with the fitted
      accessible fraction ≈ 0.79.
    - **Volume method (independent bracket for σ_m, inferred):** the width
      of the gaster is assumed equal to its height; width:height was
      1.02 ± 0.10 (empty) and 1.01 ± 0.12 (filled), n = 40. Gaster volumes
      ≈ 1.1 µL before and ≈ 2.0 µL after drinking (Fig. 2b). If the shape
      error is independent before and after, σ_m ≈ √((0.10·1.1)² +
      (0.12·2.0)²) ≈ 0.27 µL; if fixed per ant, ≈ 0.1·0.9 ≈ 0.09 µL; plus
      unreported length/height error. So σ_m ≈ 0.1–0.3 µL: the fitted
      0.21 is plausible; values well above 0.3 are not.
    - 3 µL, 4 d: 89 ± 24 s, 0.9 ± 0.4 µL (n 95), nearly identical to the
      1999 row (88 ± 24, n 135) and the 2006 row (91 ± 24): likely
      overlapping data; never treat them as independent.
  - **Intake-rate time course** (*Camponotus mus*; another genus, larger
    ants): Falibene et al. 2009 (J Insect Physiol 55:518) pump frequency
    initial → final 4.64 → 3.52 /s (10 %, non-starved), 5.86 → 4.30
    (10 %, starved), 4.65 → 3.08 and 7.1 → 4.26 (40 %); volume per
    contraction independent of starvation and of 10 vs 40 %, so intake rate
    follows frequency; most of the fall in the first ≈ 10 s. Josens et al.
    2006 (52:1234, Fig. 4): initial/final ≈ 1.2 (10 %), 1.5 (30 %), 1.55
    (50 %). **Initial/sustained ≈ 1.2–1.7, concentrated in ≈ 10 s**; the
    extra volume over a constant rate is then ≲ 0.03–0.05 µL per bout.
    I1's 0.05 µL/s (≈ 5×) is outside this; a measured-scale I1 has fast
    rate ≈ 0.012–0.016 µL/s and v0 ≲ 0.05 µL. If I1 is selected, add a
    sensitivity run at 0.013 µL/s (≈ 1.4×) beside 0.02 and 0.1.
  - **Starvation and intake rate:** *C. mus* drinks ≈ 1.5× faster when
    starved (Falibene & Josens 2008, J Comp Physiol A 194:491) and ≈ 2×
    after 15 days' deprivation vs satiation (Josens & Roces 2000, J Insect
    Physiol 46:1103, abstract via the user). **Not so in *L. niger***: the
    2006 3 µL data give volume/time 0.72/70, 0.90/91, 0.98/94 → 0.0103,
    0.0099, 0.0104 µL/s at 1 / 4 / 8 d (ratio of means). The model's
    hunger-independent intake rate stands for *Lasius*.
- **2026-10-09** **Step 3c amendment: walking speed in E2 (user decision;
  logged before acting).** The E2 loop was stopped (only its pids; S0I0 at
  generation 250, losses ≈ 150–200 seen, no candidate comparison; the E1
  joint-69 cell and signature sweep keep running).
  - **Why:** E2 uses the E1 walker unchanged (fitted at 26 °C on a canvas,
    `speed` median 55 mm/s; `walk.ts` has no temperature dependence). Its
    homebound mid-bridge speed is ≈ 2× the measured 1.5–2.1 cm/s (2000,
    2006). Turning is per distance, so search and between-drop times
    scale ≈ 1/speed, and the step-3c search parameters would absorb the
    error. The earlier "E2 is insensitive to the walker" probe never varied
    speed (all five walkers were fitted to the same Khuong speeds).
  - **Correction:** one multiplicative **E2 context factor** on the
    walker's `speed`, applied in every Mailleux-apparatus run (bridge and
    area; all E2 conditions, the 2003 six-pipette check and the giving-up
    run). Provenance: derived from the measured bridge speeds. It is not
    split into temperature (26 → 22 °C, Q10 ≈ 2 explains ≈ 25 %) and
    context (surface, scouts vs isolated ants): E2 cannot identify the
    split. **Assumption, stated:** speed in the 6 × 6 cm area scales as on
    the bridge (only bridge speed is measured).
  - **Calibration (derived, not fitted to any E2 target):** f is set so
    that the model's statistic equals the paper's, computed the same way:
    mean over ants of 2.5 cm ÷ each ant's homebound time over the 2.5 cm at
    mid-bridge (model: first crossing of x = 72.5 mm to first crossing of
    x = 47.5 mm in return mode), target **1.6 cm/s** (Mailleux 2000
    Table 1, 3 µL, 4 d, n 93; 2006, 4 d: 1.6 ± 0.6, n 122, overlapping
    data). Model: the adopted E2 parameters with `loadSlowdown` 0, 3 µL
    drop, 4 d, 1000 scouts, bisection on f to ± 0.01 cm/s. Reported beside
    it, not used: the model's SD (data 0.6) and the speed at the other drop
    sizes (2000: 1.5–1.9 cm/s). Outbound speed cannot be calibrated (E2
    scouts start at the area end of the bridge).
  - **`loadSlowdown` = 0** in all step-3c candidates: measured, no speed–
    load relation (2000: no correlation of velocity with volume ingested).
    Its original motivation (1999 return times 110 → 156 s with
    starvation) then needs another explanation; return times are not
    targets, so this is a note in the parameter only.
  - **Giving-up check** (`selectE2.ts`, development): compared with the
    2000 0.3 µL values, 113 ± 129 s (all scouts, n 26), 128 ± 135 s
    (non-layers, n 22), 28 ± 12 s (layers, n 4); Pl = 1/85 s is reported
    as the 2003 model parameter only.
  - **Backlog before E6:** temperature dependence of walking (E6 runs at
    25 °C in another apparatus; the same question).
  - All five step-3c fits restart from scratch after this; every other
    frozen rule is unchanged.
- **2026-10-09** **Walking-speed amendment implemented.**
  - `E2_CONTEXT.walkSpeedFactor` (`lasiusM1.ts`, derived) = **0.289**,
    applied by default in every `runScoutWorld` run (`ScoutOptions.
    walkSpeedFactor` overrides). `scripts/calibrateE2Speed.ts` (1000 scouts,
    3 µL, 4 d, `loadSlowdown` 0, seeds 4.28e9): f = 1 gives 4.77 ± 2.47
    cm/s; f = 0.289 gives **1.60 ± 0.74 cm/s** (data 1.6 ± 0.6). Reported,
    not used: 1.57 / 1.57 / 1.58 cm/s at 0.3 / 0.7 / 1 µL (2000: 1.9 / 1.9 /
    1.5). New observation `ScoutResult.homeSpeedMidBridge` (25 mm ÷ the
    time across 47.5–72.5 mm, first homebound passage).
  - **The factor is larger than the "≈ 2×" estimated earlier** (that came
    from 200 scouts with load slowdown on). It reflects a real difference
    between the two data sets, not a walker artefact: the Khuong ants
    (26 °C, canvas) have a median moving speed of 43 mm/s, which the walker
    reproduces (41.8), while the Mailleux scouts on the bridge walk at
    16 mm/s. Temperature (Q10 ≈ 2) explains ≈ 1.3× of that 2.7×. The rest
    (surface, foragers vs isolated ants, the papers' video method) is not
    separated; recorded for the E6 speed question.
  - `loadSlowdown` 0 in every step-3c candidate (`fix3c`); `mailleux2006`
    reference added; `selectE2.ts` giving-up check labelled with the 2000
    0.3 µL values (Pl = 1/85 s shown as the 2003 model parameter).
  - The adopted fit (`e2-drinking.json`, f = 1 era) now runs with the
    factor in pages and reports: its numbers in this file predate it.
  - Tests pass (61). Step-3c fits restart from scratch on this commit.
- **2026-10-09** **Step-3c fits finished (rented box) and selection run; adequacy bug; profile diagnostic.**
  - Fits run on a rented 92-thread EPYC 9654 VM (vast.ai) at 28aaf5e,
    all five concurrently (18 workers each, ≈ 30 min). Bit-identity
    checked: the box's S0I0 log equals the local run's first 49 lines. The
    local loop was stopped (its own pids only).
  - `selectE2.ts` (frozen rule): **S1I1 selected** (P̄ 82.7; S2I1 92.9,
    Δ 10.2 ± 5.6 paired SE, more complex; S1I0 163.0, S2I0 179.7, S0I0
    217.7). Follow-ups for S1I1 launched automatically: recovery fit,
    σ_m / σ_r profiles, fast-rate refits at 0.013 / 0.02 / 0.1 µL/s
    (`fitE2c.ts --fastRate`, aa57a54). The recovery fit's own progress log
    was lost (launcher bug, two-step job); its JSON and scoring are
    unaffected.
  - **Bug (judging only):** the adequacy step simulated its pooled 1500
    scouts as one block, so SE_sim and every combined z were NaN and every
    candidate read "15 rows |z| > 3, not adequate". Fix: 5 blocks of 300
    (the same scouts and seeds); the selection rule and its numbers are
    untouched. Rerun with the fix before reading adequacy.
  - **σ_m profile not usable as run:** every grid value (0–0.5, refits of
    60 generations warm-started at the fit) is ≥ 10 worse than the fit
    itself (57.8), including 0.1 and 0.2 around the fitted 0.136; the
    curve's minimum is ≈ 0.3 at Δ 10. That points to refits that do not
    reach the fit, not to a sharp optimum. Diagnostic (not a change to the
    frozen profile): the same profile with the fitted value on the grid and
    longer refits (`--grid 0.05,0.1,0.136,0.2,0.3 --gens 200`); if the
    refit at 0.136 is also ≈ +10, the profile procedure is at fault. σ_r
    profile: interval [0, 0.2] (fitted 0.122), as designed.
- **2026-10-09** **Step-3c results for S1I1 (box), adequacy, and step 3d
  pre-registration (user approved the design; frozen here before any code
  or fit).**
  - **Adequacy (fixed `selectE2.ts`): no candidate is adequate.** Two fit
    rows fail in all five: `d4.trail` (data 0.94, n 141; z −3.5 … −3.7) and
    `two.ul2` (0.28 µL; z +3.3 … +4.6). S1I1 also has `two.t2` 2.9 and
    `two.vtRs2` 2.2, the rest |z| ≤ 2. `d4.trail` is unreachable by design:
    `neverLayFraction` is fixed at 0.12 in every step-3c candidate, which
    caps laying at 88 %. The drop-2 excess comes from trail layers (data
    TL1 0.20 µL at drop 2, S1I1 0.40, z 6.9). Group contrasts (S1I1):
    drop-1 time TL1 − nTL1 z −4.4, drop-2 volume z +3.3. Development, 2003
    six pipettes: S1I1 visits far too many (z +14).
  - **Recovery (S1I1, one replicate): APPROXIMATE**: mean excess 0.97,
    worst `two.t2` 3.71, `two.vtRs2` 3.67. The intake parameters trade
    off: recovered `intakeRate` ×1.98, `intakeSd` ×2.5, `volumeSd` ×1.85,
    `stopHazard` ×0.45; accessibility and `unsatisfiedLayProb` recovered.
  - **Profiles:** σ_r (`intakeSd`, fitted 0.122): interval [0, 0.2].
    σ_m with 60-generation refits was not usable (every value ≥ 10 above
    the fit). The diagnostic with 200 generations and the fitted value on
    the grid: refit at 0.136 → 55.0 (fit 57.8; Δ 5.6 ± 5.8), 0.2 → 49.5
    (best), 0.05 → +50, 0.1 → +23.5, 0.3 → +10 ± 10. So the 60-generation
    refits had not converged, the fit is not at the σ_m optimum, and
    σ_m ≈ 0.2 sits inside the independent 0.1–0.3 bracket. Use ≥ 200
    generations for profiles from now on.
  - **I1 fast-rate sensitivity** (reported, not re-selected; selection-batch
    loss, fit 71.5 at 0.05 µL/s): 0.013 → 76.5, 0.02 → 123.7 (a different
    basin: `intakeSd` 0.82, `volumeSd` 0.035; likely an optimiser failure),
    0.1 → 60.3. **I1 as fitted is far from the measured intake:** a fast
    phase of 0.33 µL, then a sustained 0.0036 µL/s, about a third of the
    measured *L. niger* rate (≈ 0.010 µL/s, 2006). At 0.013 µL/s the fit
    has 0.42 µL fast, then 0.0034 µL/s (≈ 4× deceleration; *Camponotus*:
    1.2–1.7×). To be checked against the 2000 ingested volumes (below).
  - **Step 3d: the laying decision (frozen).**
    - *Why:* (1) `d4.trail` 0.94 is impossible with `neverLayFraction`
      fixed at 0.12. (2) The model's layers are the ants satiated early
      (they drink less, for less time, at drop 1); the data's TL1 and nTL1
      drink the same at drop 1 (0.49 vs 0.46 µL, 52 vs 50 s), while TL1
      drink less at drop 2 (0.20 vs 0.33 / 0.31 µL). (3) Laying at one
      drop depends steeply on its size (2000, 4 d: 14 / 17 / 70 / 91 % at
      0.3 / 0.7 / 1 / 3 µL); a constant `unsatisfiedLayProb` cannot make
      that step.
    - *Candidates* (all with the step-3c fixed settings and I1, fast rate
      0.05 µL/s, `boutFastUl` free; `neverLayFraction` free in [0, 0.3]
      in every candidate):
      - **L0:** the current rule: a scout leaving an exhausted drop before
        its desired volume lays with constant probability
        `unsatisfiedLayProb`.
      - **L1:** that probability is graded by how close the scout came to
        its desired volume: P = 1 / (1 + e^(−κ (r − ρ))), r = ingested ÷
        desired, κ ∈ [1, 50] (log scale), ρ ∈ [0, 1.5]; it replaces
        `unsatisfiedLayProb` (one more parameter than L0). Satiated
        departures lay unless never-layers, as before.
      - crossed with **S1** (layers and non-layers search alike) and **S2**
        (layers have their own search mean `arsMeanLay`): **L0S1, L1S1,
        L0S2, L1S2** (k 12, 13, 13, 14). S2 is included because the 2000
        data (development) give layers a giving-up time of ≈ 28 s vs
        ≈ 128 s for non-layers, and S1I1 vs S2I1 was within 2 SE.
    - *Fitting:* `fitE2c.ts` unchanged in procedure (two starts from the
      same base, one IPOP restart, ≤ 300 generations, the same fit seeds);
      L1's starts at κ 10, ρ 0.7. Output `data/fits/e2-3d-<id>.json`.
    - *Judging:* the frozen step-3c rule and adequacy test on the same fit
      rows, among the four step-3d candidates, with the step-3c selection
      seeds (so step-3c and step-3d losses are on common random numbers;
      S1I1 and S2I1 are listed beside them for comparison, not selectable).
      Development, reported only, never fitted: the 2009 group contrasts;
      the 2000 single-drop series at 0.3 / 0.7 / 1 / 3 µL, 4 d (trail %,
      giving-up time of layers and non-layers, ingested volume
      0.2 / 0.5 / 0.7 / 0.9 µL); the 2003 six pipettes; the 2006 0.3 µL
      laying (17 %).
    - *Reading:* if L1 passes the group contrasts and the 2000 trail series
      without being fitted to them, that supports a graded laying decision.
      If no candidate does, the next hypothesis is laying as a per-ant trait
      (independent of the volume ingested), before step 4.
    - Then the selected candidate's recovery and profiles as in step 3c
      (profiles with 200 generations).
- **2026-10-09** **External review (relayed by the user): decisions.**
  Checked against the code before logging: the E6 z uses SE_data =
  SD/√5 (`e6Bles.ts:135`); the profile script printed "approx. 95 %
  profile interval"; `trajectory.ts:300` counts a track as an exit when
  its last point is within 3 % of the exit radius, whatever its `end`.
  1. **Adequate ≠ validated.** The adequacy gate (`selectE2.ts`) covers
     the fitted means and finding both drops only; it ignores the spread
     (SD) checks and the development failures, and recovery tests the
     fitting procedure, not the mechanism. An adequate step-3d candidate
     is adopted **provisionally**, with its limits listed (every spread
     z and development row it fails) and an external E2 validation, to be
     frozen before adoption, still outstanding. Candidate data for it:
     Mailleux 2005 (laying over successive trips; held unread).
  2. **Intake rate: compare like with like.** ≈ 0.010 µL/s is whole-bout
     volume ÷ time at a 3 µL drop; 0.0036 µL/s is I1's sustained phase
     only. The like-for-like check is the model's whole bout under the
     same conditions (the 2000 single-drop series, 3 µL, 4 d: 0.9 ± 0.4 µL,
     and `d4.drink`), already in `selectE2.ts`. The fast/slow split is not
     identified (S1I1 recovery: `intakeRate` ×1.98, `boutFastUl` ×0.65);
     report I1 as "decelerating intake, decomposition not identified".
     Passing the volume check constrains the split, it does not prove it.
  3. **No automatic step 3e.** "Laying independent of the volume ingested"
     predicts a constant laying fraction across drop sizes, which the 2000
     series (14 / 17 / 70 / 91 %) already contradicts. A further laying
     family needs a distinguishing prediction first: "persistent individual
     propensity" (an ant-level random effect, with feeding still acting)
     vs "feeding has no effect". Data that separate them: the same ants
     over successive trips (Mailleux 2005, held unread).
  4. **Profiles are sensitivity diagnostics.** The loss is a diagonal Σz²
     over correlated summaries, not a calibrated −2 log L, so Δ 3.84 is a
     reference line, not a 95 % interval; more generations and the paired
     SEs fix numerical problems only. `profileE2c.ts` output relabelled.
     The earlier "interval [0, 0.2]" for σ_r and "[0.2, 0.2]" for σ_m read
     as "Δ ≤ 3.84 region", diagnostic. Calibrated intervals would need a
     parametric bootstrap of the whole fit (not planned now). The selection
     rule's + 2k penalty is likewise heuristic (as its doc says).
  5. **E6 decision rule:** with 5 colonies, SE_data is estimated with 4
     degrees of freedom, so z = Δ / √(SE_data² + SE_sim²) is t-like, not
     normal: under a correct model ≈ 4 % of |z| exceed 3 and ≈ 12 % exceed
     2 (t₄), whatever the number of simulated colonies (review null
     simulation: 4.1 % beyond 3). Before E6 is judged: convert to a
     normal-equivalent z through the t distribution with Welch–
     Satterthwaite degrees of freedom (≈ 4 when SE_sim is small), and
     report spread checks likewise. **Evidence label:** the E6 outcomes are
     a **development benchmark**, not untouched: the TEC comparisons and the
     observed early-event delay have informed spatial-model expectations
     (contamination log).
  6. **Freeze absorption and walking before judging E6.** Crop absorption
     0 – 0.05 /h is a sensitivity scenario, not a *Lasius* upper bound
     (Howard & Tschinkel 1981 measured isolated *Solenopsis* workers). The
     E2 speed factor confounds temperature and context (surface, scouts,
     method), so it does not transfer to the nest by a temperature
     adjustment alone; the E6 walking assumption (and its scenarios) is
     pre-registered before the E6 test.
  - **E1 (backlog; limits walker-validation claims, no restart of
    fine-scale fitting):** colony variation is not in the main bootstrap
    (ants resampled, not colonies); the covariance shrinkage depends on the
    number of bootstrap draws; a timed-out track ending near the boundary
    counts as an exit (`trajectory.ts:300`; should require `end === 'exit'`
    where known).
- **2026-10-09** **Step 3d result (box, e42e4be; selection on the step-3c
  seeds).**
  - **Selected L0S1** (P̄ 84.4; L1S2 112.0, L1S1 116.7, L0S2 121.0; none
    within 2 paired SE). Fitted never-laying fraction 0.075 (all four:
    0.04–0.08), which brings `d4.trail` to z −1.6. L0S1 is no better than
    step-3c S1I1 overall (82.7 on the same seeds): `two.t2` got worse
    (4.4 vs 2.9).
  - **Not adequate (no candidate):** `two.ul2` z 4.3–4.7 and `two.t2`
    4.4–6.2 in all four. Drop-2 intake and drinking time are too high in
    all nine step-3c/3d candidates. The ingested-volume signal is
    cumulative over the trip (`startTrip` resets it), so this is not a
    reset bug: the fitted desired volumes (≈ 1.0–1.1 µL at 4 d) exceed the
    2009 two-drop total (0.75 µL).
  - **L1 (graded laying) not supported:** worse loss, and the group
    contrasts are not fixed (drop-1 time TL1 − nTL1 z −5.4 L1S1, −2.7
    L1S2, −4.5 L0S1; drop-2 volume 2.0–2.7). Fitted ρ ≈ 0.58–0.70, κ 11–17.
    At 0.3 µL L1 lays far too rarely (3–4 % vs 14 %, z ≈ −2), L0 18–30 %.
  - **Development checks** (L0S1): 2000 single drop, trail % 18 / 42 / 67
    / 91 vs 14 / 17 / 70 / 91 (0.7 µL z 3.5; this is the 2000-vs-2009
    17 % vs 38 % between-study discrepancy). **Whole-bout intake at 3 µL,
    4 d: 0.67 ± 0.31 µL vs 0.9 ± 0.4 (n 95; z ≈ −5)** in all four (0.67–
    0.73) with drinking times that fit (`d4.drink` z 0.1): the whole-bout
    rate is ≈ 0.0075 vs 0.010 µL/s. The like-for-like intake check (review
    item 2) fails. Giving-up layers at 0.3 µL: 171 ± 165 s vs 28 ± 12
    (n 4) under S1. Six pipettes: visits still z 8–12.
  - **Omission in the step-3d pre-registration:** the user's instruction
    that the 2000-vs-2009 discrepancy (17 % vs 38 % at 0.7 µL) is
    between-study variation, to be treated as extra variance in step 3d,
    was not included. Not acted on yet; the judging above uses SE_data ⊕
    SE_sim only.
  - Running (unattended): L0S1 recovery and profiles (diagnostics).
- **2026-10-09** **Between-study variance: pre-registration (frozen; user
  approved with four changes from review, all included).**
  - **Lead finding, independent of any study effect:** within 2009, layers
    and non-layers drink the same at drop 1 but layers drink less at drop 2
    (L0S1: drop-1 time contrast z −4.5, drop-2 volume contrast z +2.7). No
    between-study variance touches comparisons within one study.
  - **τ is not estimable.** Independent cross-study pairs of the same
    quantity (3 µL pairs excluded as overlapping): trail % at 0.7 µL, 2000
    vs 2009 (logit diff 1.08, SE 0.56) and at 0.3 µL, 4 d, 2000 vs 2006
    (0.23, SE 0.71); volume at 0.7 µL (2000 vs 2009) and 0.3 µL (2000 vs
    2006), giving-up at 0.3 µL (2000 vs 2006): log diffs 0.06 / 0.05 / 0.27,
    each below its SE. Estimates (per study, method of moments): logit
    0.32 (0.65 from the 0.7 µL pair alone), log 0; Q-profile 95 % ranges
    [0, 3.45] and [0, 0.38]. **Overlap check (change 3):** 2000 used six
    colonies of 1000–2000 workers in 20 × 20 cm four-section nests at 4 d
    only; 2006 used three colonies of 1000–1300 in 15 × 5 cm three-section
    nests at 1 / 4 / 8 d in random order: different colony sets, so the
    0.3 µL pair is kept (evidence, not proof). If it overlaps, the point
    estimate becomes the generous one (logit ≈ 0.65).
  - **Re-judging (`selectE2.ts`, all nine candidates, no refits):** τ added
    to each row's variance (logit scale for proportions, log scale for
    means, delta method at the data value; Fisher-z rows none). Reference
    scenarios none / point (logit 0.32, log 0) / generous (logit 0.67, log
    0.15). **For every row with |z| > 2: the smallest τ at which it passes
    (|z| ≤ 3 and ≤ 2; change 2)**, plus the same for the 2000 single-drop
    trail series. Reading: a row **fails robustly** if it fails under
    generous, **passes robustly** if it passes under none, otherwise
    "depends on τ".
  - **Limits (change 4):** a study effect is shared by all rows of a
    study, so per-row slack is an upper bound (change 1). The candidates
    were fitted without τ; τ-weighted fits could land elsewhere. **This
    re-judging cannot make a candidate adequate or change the selection**;
    it only shows which failures depend on the between-study assumption.
    A pass under the generous scenario is not adoption.
  - **Cohort diagnostic (change 1; a diagnostic, not a candidate):**
    `L0S1c` = L0S1 plus a desired-volume scale for the 2009 two-drop
    cohort (`setup.desiredScale2009`, log-bounded [0.3, 3]), fitted with
    the same `fitE2c.ts` procedure. Rationale: most ants empty drop 1, so a
    lower desired volume barely changes drop-1 intake but cuts drop-2
    intake; its side effects are checkable (more ants satiated at drop 1,
    shorter drop-1 times, a higher drop-1 trail fraction). Smoke test at
    scale 0.7: `two.ul2` 0.38 → 0.31 µL, `two.t2` 27.5 → 14.8 s, `two.tl1`
    0.32 → 0.44. **Reading:** cohort effect supported if `two.ul2` and
    `two.t2` reach |z| ≤ 2 while `two.ul1`, `two.t1`, `two.tl1` stay
    |z| ≤ 2; if drop-2 passes only by pushing drop-1 rows out, it is not a
    cohort effect; if drop-2 still fails, the failure is structural. Report
    the fitted scale, the satiated fraction at drop 1, ΔP̄ vs L0S1 on the
    selection seeds (1 extra parameter, penalty 2), and the group contrasts
    (a cohort scale is not expected to fix them).
- **2026-10-09** **Addition to the frozen L0S1c reading (user/review;
  logged before any L0S1c output was looked at).** Two reported
  development checks, not fitted, that the cohort hypothesis predicts
  (the scale touches only the 2009 condition, so the other studies keep
  the original desired volume):
  1. **2000 single drop, trail % at 0.7 µL** (L0S1 42 % vs 17 %, z 3.5):
     should fall towards 17 % while `two.tl1` stays near 38 % (a 2009
     cohort that wants less explains both its higher laying fraction and
     its smaller drop-2 intake).
  2. **Whole-bout intake at 3 µL, 4 d** (L0S1 0.67 vs 0.9 µL) **and the
     fitted fast-phase size** (`boutFastUl`; L0S1 0.28 µL): if satiation
     now shortens drop-2 bouts, the fast phase should shrink and the 3 µL
     intake rise towards 0.9.
  **Reading:** drop 2 passes and both checks move the right way → the
  cohort explanation gains support the fit could not produce by itself;
  drop 2 passes but neither check moves → the extra parameter is absorbing
  misfit (stated as such); mixed → reported as mixed.
  **Wording corrections to the re-judging report:** a τ-dependent pass is
  not evidence; the robust results are the within-2009 contrasts. Drop 2
  for L0S1 "would need 7–11 % between-study variation in means, which the
  cross-study pairs neither show nor exclude". The two volume pairs behind
  the log-scale point estimate of 0 (0.3 and 0.7 µL) are at drops the ants
  empty, so their intake is capped by the drop, not the desired volume:
  they cannot register a desired-volume difference between cohorts, and
  the "point" scenario carries little weight for drop 2. Only the
  giving-up and trail pairs can register one.
  **Movement threshold (added before results; the half-gap cut is
  arbitrary, fixed now so it cannot be chosen after seeing the numbers):**
  a check "moves" only if it closes at least half its gap and the change
  exceeds twice its simulation SE (selectE2: 300 scouts per drop size, so
  ≈ 0.026 for the trail fraction, ≈ 0.017 µL for the 3 µL volume). 2000
  trail % at 0.7 µL: ≤ ≈ 30 % (from 42 %, target 17 %). Whole-bout intake
  at 3 µL: ≥ ≈ 0.79 µL (from 0.67, target 0.9). Fast-phase size
  (`boutFastUl`): ≤ ≈ 0.14 µL (from 0.28), reported beside the intake
  check, not a criterion by itself. Smaller moves in the right direction
  are reported as "right direction, below threshold" and count towards
  "mixed", not "support".
  **Disclosure:** while confirming at 22:22 that the L0S1c judging had not
  started, the last line of its fit log was printed: "restart 1 gen 230,
  best 14.82, median 27.92" (one noisy per-generation fit batch). It does
  not contain either check; the threshold above had been written before it
  was seen. CLAUDE.md now has a gotcha on blind status checks.
- **2026-10-09** **Cohort diagnostic L0S1c: result (box, e6f8eb5; judged
  with `selectE2.ts` on the selection seeds).**
  - **Frozen reading: MIXED.**
    - Drop 2 passes, with drop 1 intact: `two.ul2` z 1.2, `two.t2` 1.5;
      `two.ul1` 0.2, `two.t1` −1.5, `two.tl1` 1.4.
    - Check 2 **moves**: whole-bout intake at 3 µL, 4 d **0.88 ± 0.41 µL**
      (threshold ≥ 0.79; data 0.9 ± 0.4); fast phase `boutFastUl` **0.007
      µL** (from 0.28; threshold ≤ 0.14), sustained `intakeRate` 0.0097
      µL/s (measured *L. niger* ≈ 0.010). The I1 fast phase disappears once
      the 2009 cohort has its own desired volume.
    - Check 1 **does not move**: 2000 trail % at 0.7 µL 38 % (from 42 %;
      threshold ≤ 30 %; the change, 4 points, is below 2 simulation SE).
  - Fitted 2009 scale **0.739** (log −0.30; inside the cross-study range
    [0, 0.38] for means but near its upper end). ΔP̄ vs L0S1: 54.2 vs 84.4
    (one extra parameter). All fit rows |z| ≤ 2 (no marginal rows); it is a
    diagnostic, not a candidate, so this is not adequacy for adoption.
  - **Against it (reported, not in the frozen reading):** the within-2009
    contrasts get worse: drop-1 time TL1 − nTL1 z −4.2, drop-1 volume
    −2.1, drop-2 time **+3.2** (L0S1 1.0), drop-2 volume **+3.8** (2.7);
    satiated at drop 1: TL1 78 %, nTL2 39 %. The 2000 laying series
    flattens: 30 / 38 / 55 / 91 % vs 14 / 17 / 70 / 91 (0.3 µL z 3.0, 1 µL
    −2.5; L0S1 0.7 / −0.5). Giving-up times far too long (0.3 µL all
    171 ± 157 s vs 113 ± 129; 0.7 µL non-layers 209 vs 63 ± 35, n 12;
    `arsMean` 185 s). σ_m (`volumeSd`) 0.34, above the 0.1–0.3 bracket;
    `desiredSd` 0.048 (almost no between-ant variation in desired volume).
  - **For it (reported, not in the frozen reading):** 2003 six pipettes
    improve (exploit z −7.8 → 0.5, visits 12.1 → 8.2, ul 3.3 → 1.6).
  - **Fit quality:** the restart (λ 22) reached a much lower selection
    loss than the two starts (23.5 vs 40.8 / 41.4) but did not converge
    (final σ 0.50, drift up to 0.35 encoded units): the surface is
    multimodal here, and the fitted values are less settled than usual.
  - **L0S1 follow-ups (diagnostics):** recovery APPROXIMATE (mean excess
    0.82, worst `two.tl1` 3.81; `unsatisfiedLayProb` ×0.40, `intakeRate`
    ×1.45, `arsMean` ×0.68). Profiles (200 generations; the run printed
    the old "95 %" label, read as Δ ≤ 3.84 regions): σ_m and σ_r both at
    0.2 on the grid, every other grid value Δ > 3.84 or borderline.
- **2026-10-09** **E1 joint 69-ant recovery cell: result** (box copy at
  aa57a54; its log is identical to the local run's for all 63 lines the
  local run has written; every CMA-ES run went ≥ 185 generations, so the
  averaging-window change does not apply and the local run should end
  identical). Prediction excess per incline: 1 (fit) mean 0.59, worst
  turnSd 4.63 → **FAILED**; 2 (dev) 0.33, turnSd 2.47 → approximate; 3
  (fit) 0.20 → recovered; 4 (dev) 0.22 → approximate; 5 (fit) 0.40,
  turnBig 1.64 → approximate. Parameters off most: `stopHomePull` ×2.95,
  `homeRunBias` ×0.34, `homeHeadingPull` ×1.99, `jitter` ×0.43.
- **2026-10-09** **User decision: provisional E2 model for colony
  development (logged before acting).**
  - **Main model: L0S1c** (`data/fits/e2-3d-L0S1c.json`) with **baseline
    desired volumes**: the 2009 cohort scale (0.739) applies only to the
    2009 two-drop condition when reproducing that experiment; every other
    context, the colony included, uses the fitted desired volumes (scale 1).
  - **Alternative (sensitivity) model: fitted L0S1** (`e2-3d-L0S1.json`).
    Step-4 results are reported under both.
  - **Provisional, not validated** (review item 1): L0S1c was a diagnostic,
    not a pre-registered candidate; its restart did not converge; no
    external E2 validation has been run (candidate: Mailleux 2005, held
    unread; to be frozen before any claim beyond "provisional").
  - **E2's remaining failures stay documented** (L0S1c unless noted):
    within-2009 contrasts (drop-1 time TL1 − nTL1 z −4.2, drop-1 volume
    −2.1, drop-2 time +3.2, drop-2 volume +3.8); the 2000 laying series
    flattened (30 / 38 / 55 / 91 % vs 14 / 17 / 70 / 91); giving-up times
    too long (0.7 µL non-layers 209 vs 63 s); σ_m 0.34 above the 0.1–0.3
    bracket; almost no between-ant variation in desired volume (`desiredSd`
    0.048); six-pipette visits z 8.2; drinking-time spread and the other
    spread checks not part of adequacy; L0S1 alternative: drop-2 intake
    and time z 4.7 / 4.4, 3 µL whole-bout intake 0.67 vs 0.9 µL.
  - **Implementation:** `lasiusM1.ts` keeps the parameters used so far
    (defaults + `e2-drinking.json`) as an exported legacy layer, which
    every script that rebuilds step-3 or older fits uses (so they stay
    reproducible), applies L0S1c on top for `LASIUS_PARAMS` and
    `MAILLEUX_SETUP` (with the 2009 scale), and exports L0S1 as the
    alternative. New structural parameters get provenance (searchMode,
    layRule and the fast-uptake terms).
- **2026-10-09** **Step 4 started: E6 decision rule and TEC rerun
  (implements review item 5 and step-3c amendment 3; logged before
  acting).**
  - **Means.** E6 rows report a normal-equivalent z: the combined
    t = Δ / √(SE_data² + SE_sim²) is mapped through Student's t with
    Welch–Satterthwaite df, ν = (a + b)² / (a²/4 + b²/(R − 1)), a =
    SE_data², b = SE_sim² (R = 10 seed blocks), then z = Φ⁻¹(F_ν(t)).
    The cut-offs 2 and 3 then keep their usual meaning (≈ 4.6 % / 0.27 %
    under a correct model). The raw t and ν are reported beside z.
  - **Spread.** The log-SD normal approximation is replaced by the
    variance-ratio F test, s²_sim / s²_data ~ F(n_sim − 1, 4) under equal
    variances (normal colony values assumed; with 5 colonies nothing
    sharper is available), mapped to z the same way (sign: sim SD larger
    is positive). Indicative only, as before.
  - **Fitting is unchanged:** `fitE6TEC.ts` keeps Σ fitZ² (SE_data only;
    the t mapping is monotone per row and would only reweight rows by ν).
  - **Rerun:** published TEC-exp and the tier-2 refit through the
    observer, rule 'after' (default) and 'total' (sensitivity);
    `fitE6TEC.ts` refits under 'after' and writes `e6-tec.json` with the
    observer rule recorded. The TEC numbers are a reference fitted to E6,
    not a test of our model.
  - **Null calibration (before any E6 result was looked at):** 5 data and
    200 simulated colonies (10 blocks) from one normal, 100 000 replicates.
    Welch–Satterthwaite: 4.8 % beyond |z| 2, 0.54 % beyond 3 (nominal 4.55 /
    0.27; uncorrected ≈ 4 % beyond 3): its df is estimated from the same 5
    colonies and rises exactly when SE_data comes out small. Fixed df =
    min(4, R − 1) = 4: 4.1 % / 0.15 % (50 colonies: 3.2 % / 0.04 %; tends to
    exact as SE_sim → 0). Spread F test: 4.6 % beyond 2.
- **2026-10-09** **User decisions: E6 rule and nest assumptions
  (pre-registration for the E6 test; frozen before any output of our
  colony model is judged against E6; logged before acting).**
  1. **Decision rule (primary):** normal-equivalent z through t with fixed
     df = min(n_data − 1, R − 1) = 4; the Welch–Satterthwaite z is reported
     beside it. Our colony model is run with ≥ 200 colonies (SE_sim small,
     so df 4 is close to exact). |z| ≤ 2 consistent, ≤ 3 marginal. Spread:
     the F-test z, indicative only.
  2. **Walking in the nest:** primary = the adopted E1 walker unchanged
     (fitted at 26 °C on canvas; E6 at 25 °C). Sensitivity: temperature
     only, × 0.93 (Q10 2, 26 → 25 °C); the E2 bridge factor × 0.289
     (confounds temperature, surface, task and method; not transferred by
     default).
  3. **Crop absorption:** primary 0 (absorption = metabolic need only).
     Sensitivity: first-order, 0.05 of the crop's sugar per hour (Howard &
     Tschinkel 1981, *Solenopsis*, isolated workers: a scenario, not a
     *Lasius* bound), limited by the reserve room (no overfilling). The
     `cropAbsorption` term is re-parameterised from "× reserve room" to
     "× crop contents" for this; at 0 nothing changes (E2 unaffected).
  4. **E2 layer:** L0S1c (baseline desired volumes) main, L0S1 alternative
     (decided 2026-10-09).
  5. **Reading:** the primary scenario gives the result. A row whose
     verdict (ok / marginal / off) changes across the four sensitivity
     runs (two walking, one absorption, the L0S1 layer) is reported as
     "sensitive to <assumption>", not as a pass. E6 is a development
     benchmark (review item 5); calibration of the colony uses non-E6 data
     (Mailleux 1999 in-nest recruiters) first.
  **Implemented:** `smallSampleZ`, `tToZ`, `welchDf`, `varianceRatioZ`,
  `betaInc` (`compare.ts`; tested against t/F tables and the null rates);
  `e6Compare` reports z (df 4), t, zWS and its df, and the F-test spread z;
  `--rule after|total` in `reportE6.ts`; `observerRule` recorded in
  `e6-tec.json`. Crop-absorption re-parameterisation not yet done (needed
  only for the sensitivity run).
- **2026-10-09** **E6 TEC baseline rerun under the corrected observer and
  rule (400 colonies; `logs/reportE6-rerun.log`, `logs/fitE6TEC-after.log`).**
  - **Refit** (`e6-tec.json` rewritten, rule 'after'): θF 1/7.4, θW 1/19.9,
    ϒF 1/8.8, ϒW 1/21.8 (old 'total'-era refit 1/7.8, 1/21.7, 1/8.1, 1/21.8;
    published 1/9, 1/23, 1/9, 1/27), fit loss 0.41 (old 0.29). Fresh
    colonies: every mean |z| ≤ 1.5; **T50 29.9 vs 32.8 min, t −1.9 → z −1.5**
    (was reported z −2.1 under the normal rule). Spread: both-roles share
    zSD −2.0, efficiency −1.8 (simulated colonies too alike).
  - **Published TEC-exp:** events 80.5 (t −2.0 → z −1.6), T50 29.3 (t −2.3
    → z −1.7), NF→NF 24.7 (z −1.6); nothing beyond |z| 2.
  - **Rule 'total' (sensitivity):** small shifts only (published events
    82.9, refit 99.9; no verdict changes).
  - **Power (one-caste model, rejected by the authors):** every colony
    mean |z| ≤ 1.7 except NF→F (t −3.3 → z −2.2, marginal); F→F spread
    zSD −5.6 is the only clear rejection. Colony-level means with 5
    colonies barely discriminate. The per-ant distributions (267 ants,
    events given / received by foragers and non-foragers; step 2 note)
    should become pre-registered KS targets before our colony model is
    judged on E6.
- **2026-10-09** **Correction: E6 was run at 22 ± 3 °C, not 25 °C.** The
  paper reports 22 ± 3 °C, 60 ± 5 % RH (recorded 2026-10-07 in
  `data/bles2022/README.md` and `docs/research/lasius-niger.md`); the
  2026-10-08 colony plan marked it "not reported" and assumed 25 °C, and
  the nest pre-registration above repeated it. `runColony` now defaults to
  22 °C (metabolism and intake temperature terms; no E6 output of our model
  had been judged). **The walking scenarios need revisiting:** temperature
  only is × 0.76 (Q10 2, 26 → 22 °C), not × 0.93; and E2 (Mailleux, also
  22 ± 3 °C) and E6 now share the temperature, so the × 0.289 bridge factor
  differs from E6 only in surface, task and method. Awaiting the user's
  choice of primary.
- **2026-10-09** **E6 per-ant distributions: method and reference results
  (proposal; the judging rule awaits the user's approval before our colony
  model is run against E6).**
  - **Data:** Bles et al. Fig. 3B–E histograms from the authors' script
    (61 foragers, 206 non-foragers, 5 colonies pooled): events given /
    received per forager and per non-forager (`E6_PER_ANT_HIST`; sums
    checked against the pair counts in `test/e6.test.ts`).
  - **Test (`e6PerAntCompare`):** KS distance of the pooled data histogram
    from the model's pooled per-ant distribution; null distribution by
    Monte Carlo: draw 5 simulated colonies, pool their ants (forager counts
    vary as in the data), score against the pooled remaining colonies;
    p = (k + 1)/(reps + 1), reps 10 000 (z resolution ≥ 3.9), z = two-sided
    normal equivalent (as `pToZ` for KS rows). Handles tied integer counts,
    ants clustered in colonies and variable group sizes, which the
    asymptotic KS p does not. Omnibus Σ D (the authors' D_total) on the
    same draws. Null check (synthetic Poisson colonies with a colony
    effect, 2000 trials): 5.15 % rejected at p ≤ 0.05.
  - **Reference models (400 colonies, rule 'after'; Σ D omnibus z, worst
    group):** one-caste exp ≥ 3.9 (forager receive ≥ 3.9), unif ≥ 3.9,
    delta ≥ 3.9; TEC delta 3.2 (non-forager receive 3.4; the authors'
    Table S2 also rejects delta on the non-forager distributions); TEC
    unif 1.8; TEC published (exp) 2.1 (fewer events through the observer;
    forager give 1.9); TEC refit 0.7 (fitted to E6; not a test). The
    per-ant distributions reject what the colony means could not (one
    caste: means all |z| ≤ 2.2).
  - **Proposed rule:** the omnibus Σ D z is the per-ant verdict (one test,
    so no multiplicity across four correlated rows); the four group rows
    are reported for diagnosis with the usual cut-offs. Our colony model
    runs with N = 53 ants per colony (the data imply 267 / 5 = 53.4;
    `bles-tec-spec.md` ambiguity 1) and ≥ 200 colonies.
- **2026-10-09** **User decisions: amendments to the E6 pre-registration
  (after the 22 °C correction and the per-ant proposal; still before any
  output of our colony model is judged against E6; logged before acting).
  They supersede items 2 and 5 of the nest pre-registration where they
  differ.**
  1. **Walking (primary): temperature only.** Implemented as
     `E6_CONTEXT.walkSpeedFactor` = arrhenius(22 °C, 26 °C, 0.47 eV) =
     **× 0.781** (the mean activation energy of ant running speed across
     22 species, Hurlbert et al. 2008, already used by the draft species
     files; the question offered × 0.76 from Q10 2, a 3 % difference, noted
     in the provenance). Sensitivity: × 1 and × 0.289 (E2 bridge factor).
  2. **Per-ant verdict:** the omnibus Σ D z (`e6PerAntCompare`, 10 000
     Monte Carlo draws); the four group rows reported for diagnosis.
     "Reading" (item 5) applies to it like a primary row.
  3. **Colony size:** 53 ants (`runColony` and the colony page default).
  **Implemented:** `runColony` options `walkSpeedFactor` (default the E6
  primary) and `ants` (default 53), temperature default 22 °C;
  `cropAbsorption` re-parameterised as first-order (× crop sugar, limited
  by the reserve room; 0 by default, so E2 and the primary are unchanged;
  sensitivity 1.39e-5 /s = 0.05 /h). The E6 pre-registration is now
  complete for colony means (t rule, df 4), spreads (F test, indicative),
  per-ant distributions (omnibus) and the four assumptions; the E6 test
  itself waits for the Mailleux 1999 calibration.
- **2026-10-09** **Colony calibration on Mailleux 1999 (in-nest recruiter):
  DRAFT protocol, not frozen; awaiting the user's decisions. No model has
  been run against Table 2a/2b.**
  - **Data and roles.** Mailleux et al. 1999 (Actes Coll. Insectes Soc.
    12:73–79; `mailleux-rules.md` §4), 22 ± 3 °C, colonies of 1000–2000
    workers in plaster Janet nests (geometry and density not reported),
    first recruiter after a 3 µL drop of 0.6 M sucrose, filmed 20 min in
    the nest. **Fit:** Table 2a at 1 / 4 / 8 d (time in nest, distance,
    contacts, total trophallaxis, contacts before the main trophallaxis;
    mean ± SD, n 23–28): 15 means. SDs are checks. **Development
    (reported only):** Table 2b (a contacted nestmate leaves within 5 min;
    its n look copied from Table 1) and "all recruiters leave within
    20 min". Not available: the definition of "distance" (path traced
    from ×2 video? the 1999 text is not in `literature/`), so the distance
    row carries an observation caveat.
  - **Structural gaps found by reading the code (before any run):**
    (G1) a returned forager leaves again only when hungry with a crop
    < 5 % full, at `leaveRate` ≈ 1/300 s, so time in nest would be ≫ the
    80–113 s observed; (G2) the walker moves at ≈ 33 mm/s (E1 median
    43 mm/s × 0.781), while the recruiters cover 5–9 cm in the 14–56 s of
    their stay not spent in trophallaxis (≈ 1.6–4 mm/s averaged over it):
    ≈ 10× slower; (G3) no contact-triggered leaving (Table 2b), and an ant
    that received food cannot leave (its crop is not empty).
  - **Proposed structure (minimal additions, each needed by a fit row):**
    (a) *Return to a known source:* an ant that fed at a source on this
    trip leaves the nest at hazard `returnRate` once its crop falls below
    `giveFrac` (1 parameter; G1). (b) *In-nest walking:* `nestSpeedFactor`
    on the walker's speed inside the nest only (1 parameter; G2); the
    foraging area keeps the pre-registered × 0.781. (G3 is not addressed:
    Table 2b stays development.)
  - **Free parameters (k = 6):** `nestSpeedFactor`, `returnRate`,
    `shareRate`, `shareEnd`, `receiveReserve`, and a 1999-only nuisance,
    nestmate density in the chamber (not transferred: E6 density follows
    from its geometry and N 53). Fixed (estimated, reported as is):
    `giveFrac`, `stallTime`, `restToActive`, `activeToRest`, `leaveRate`,
    `forageDriveSd`. The recruiter's crop on entry comes from the E2 layer
    (3 µL, 0.6 M, the starvation day; L0S1c main, L0S1 alternative: two
    calibrations).
  - **Simulation.** Bles nest chamber (56 × 41 mm) as the stand-in
    chamber, nestmates at the fitted density with reserves for the
    starvation day; the recruiter enters from the passage with its E2 crop
    and is followed up to 20 min. Observed as the paper defines: time
    entry → exit; path length in the nest; contacts = onsets of antennal
    contact with a nestmate (trophallactic partners included); total
    trophallaxis = sum of the recruiter's bouts; contacts before main =
    contact onsets before the longest bout starts.
  - **Fitting and judging** (as E2): CMA-ES on Σ fitZ² (SE_data = SD/√n),
    common random numbers, two starts; judging with combinedZ on fresh
    seeds (|z| ≤ 2 / 3); recovery check of the fitting procedure;
    profiles of the nuisance density and `nestSpeedFactor`. **Adequate**
    = every fit row |z| ≤ 3 and at most 2 of 15 in (2, 3]. Not adequate →
    reported, and E6 still runs with the result labelled accordingly.
  - **E6 consequence (amends the walking pre-registration for movement in
    the nest only, if approved):** primary = calibrated `nestSpeedFactor`
    in the nest and × 0.781 outside; sensitivity = × 0.781 everywhere.
  - **Cost:** a 20-min recruiter run with ≈ 50 nestmates ≈ 6 s single-core
    (from the 27 s / 91-min colony); 100 recruiters × 3 days per
    evaluation ≈ 0.5 core-h, a CMA-ES fit ≈ 300–600 core-h before
    profiling.
  - **User decisions (2026-10-09): the draft above is approved as
    written** (nest speed factor calibrated on 1999, × 0.781 everywhere
    as the E6 sensitivity; the return rule, 1 parameter; density a free
    1999-only nuisance; Table 2b development). It is frozen except for
    implementation details (seeds, batch sizes, CMA-ES settings, bounds),
    which are logged before any fit is run. The E6 walking pre-registration
    is amended accordingly for movement inside the nest.
- **2026-10-10** **Mailleux 1999 calibration: implemented (not run).**
  - **Structure:** `NestParams.returnRate` (return to a known source: an
    ant with `m.ingested` > 0 from its last trip leaves at this hazard once
    its crop is below `giveFrac`; checked in rest and active modes) and
    `NestParams.nestSpeedFactor` (the runner scales the walker for any ant
    inside the nest). Provisional defaults 1/60 /s and 1 (`lasiusM1.ts`).
    E6 colony runs change through the return rule (structure change).
  - **`runColony`:** optional `recruiter` (an extra ant entering from the
    passage with a crop load and feeding memory; sugar and water enter the
    ledger), an observer hook `onStep(w, { t, per, outside })` that can
    stop the run, and per-step nest/outside walking parameters. Ant set-up
    keeps its stream order (no-recruiter runs unchanged apart from the
    return rule).
  - **`colonyMailleux1999.ts`:** Table 2a targets (15 fit rows), Table 2b
    (development); `recruiterLoad` (the first E2 scout seed that drank at
    3 µL, 0.6 M and reached the nest; same layer, same starvation day);
    `runRecruiter1999` with the observer as drafted (contacts = onsets of
    antennal contact; contacts before main exclude the main partner's own
    onset; path length in cm; time capped at 1200 s with `left` false);
    Table 2b counts a contacted nestmate that leaves within 5 min of its
    first contact (`followNestmates`, judging only). `m1999Compare`
    (combinedZ, 10 blocks), `m1999FitLoss` (Σ fitZ², + 1e7 per
    inestimable row). Pool task `m1999` (one recruiter per task; pooled =
    serial, checked). Tests `test/m1999.test.ts` (mechanics only).
  - **Speed-up, results unchanged:** head points cached per position and
    heading; the contact pre-filter is the exact bound (larger reach + both
    head offsets) instead of reach + reach + both lengths. Bit-identical
    (hash of a 50-min colony's bouts and positions, and of a dense
    recruiter run); 1.6–1.8× faster. Remaining cost is genuine contacts.
  - **Implementation details (logged before any fit):** `scripts/
    fitM1999.ts --layer main|alt`; warm-up 300 s (rest/active relaxation
    ≈ 72 s); 80 recruiters per day per evaluation; bounds (log unless
    noted) `nestSpeedFactor` [0.02, 1], `returnRate` [1/1200, 1] /s,
    `shareRate` [0.002, 0.1] µL/s, `shareEnd` [1/1200, 0.5] /s,
    `receiveReserve` [0.2, 1] linear, density [0.25, 6] /cm² (N 6–138);
    starts: provisional values at density 1, and density 2.3 with
    `nestSpeedFactor` 0.2, `returnRate` and `shareEnd` 1/30; CMA-ES as
    fitE2c (curvature probe, two starts + one IPOP restart, ≤ 120
    generations, tolX 0.03, mean of the last 30 generation means); seeds
    7.0e9 + offsets (disjoint from all earlier fits); selection batch 3 ×
    80 per day at seed 7.777e9. Judging on fresh seeds (7.9e9) with
    `m1999Compare`, Table 2b with `followNestmates`.
  - **Cost (measured, 11 local workers):** one evaluation (240 recruiters)
    47 s at start 1, 147 s at start 2 (≈ 9–27 core-min). A full fit
    (≤ ≈ 5000 evaluations) ≈ 750–2300 core-h per layer; two layers plus
    recovery and profiles: several thousand core-h. Options before
    renting: fewer generations or recruiters, a spatial index in
    perception (est. 1.3–2×), a shared warm-up.
  - **Disclosure:** a timing run at the provisional start values printed,
    for one recruiter at 4 d (seed 11), "left false" at densities 1 and 5
    (time in nest 1200 s) and "left true" at 2.3, with crop at exit. No
    fit statistic or loss was printed. Bounds and starts above were set
    from the protocol and code, not from these runs.
- **2026-10-10** **Spatial index in perception: tried, no gain, reverted.**
  A per-step neighbour hash (built between perception phases, candidates
  in ant order, so percepts were bit-identical: same run hashes) did not
  speed up the colony (7.4 vs 7.2 s, 50-min colony) or a dense 1999 run
  (34 vs 31.5 s, 115 nestmates): with the exact contact pre-filter the
  remaining cost is genuine near contacts, not the scan over far ants.
  Worth revisiting only for much larger colonies. Fit cost stays as
  logged (≈ 9–27 core-min per evaluation).
- **2026-10-10** **Mailleux 1999 calibrations started on a rented box**
  (vast.ai container, AMD EPYC 9754, 256 of 512 threads sold, CPU quota
  ≈ 246, 366 GB; Node 22.22.1 as locally; code at b8d5e7a via git
  bundle). Bit-identity checked first: the colony and dense-recruiter run
  hashes equal the local ones (395164ef…, ab0f46e5…), fast tests pass
  (71; the local-only Khuong test is not in the bundle). Both layers
  side by side, `SIM_WORKERS=121` each (logs `logs/fitM1999-main.log`,
  `-alt.log` on the box; the container is not persistent, so fits and
  logs are copied back before it is destroyed).
  - **Container gotcha:** `nproc` reports 512 and each vite-node process
    started ≈ 630 Rolldown threads, so 244 processes exceeded the
    container's task limit (pids.max 62 720) and Rolldown panicked
    (EAGAIN). Fixed with `RAYON_NUM_THREADS=2 ROLLDOWN_WORKER_THREADS=2
    ROLLDOWN_MAX_BLOCKING_THREADS=4 UV_THREADPOOL_SIZE=2` (14 threads per
    process). The simulation is single-threaded per process, so results
    are unaffected.
- **2026-10-10** **Shared warm-ups for the 1999 recruiter runs: design
  (user go-ahead; logged before acting; the box fits keep the logged
  independent design and are not touched).**
  - **Mechanics:** `runColony` becomes a steppable object (`ColonySim`)
    with `clone(key)`: a type-preserving deep copy (geometry and path
    fields shared, being immutable) in which every RNG is replaced by
    `rng.fork(key)` (a new stream derived from its state and the key), so
    copies do not replay the same nestmate futures. Shared-warm-up mode:
    warm nest j (seed from (seed, day, j)) for 300 s, then K = 8 copies,
    each with its own recruiter (load and recruiter streams keyed by
    (j, k)), entering at the same step as in the independent design.
    With 80 recruiters per day, the 10 SE blocks of `m1999Compare` are
    exactly the 10 nests.
  - **Why it is valid:** each copy's recruiter sees a nest drawn from the
    same warm-up process and nestmate dynamics with fresh randomness, so
    every recruiter statistic has the same distribution as in the
    independent design; recruiters of one nest share its configuration at
    entry (correlated), which the per-nest blocks account for. Losses are
    equal in expectation, not run for run: a profile or recovery in the
    shared design compares only with references evaluated in the shared
    design.
  - **Checks, fixed before results:** (1) `runColony` refactor
    bit-identical (colony and dense-recruiter hashes 395164ef…,
    ab0f46e5…); (2) `clone` without re-keying continues bit-identically
    to the original; (3) design equivalence: at the two fit start points,
    3 days × 240 recruiters per design, z of the difference of means per
    fit row (SE from recruiters, independent design; from nests, shared
    design); pass = Σz² over the 30 rows < 50.9 (χ²₃₀, p 0.01) and no
    |z| > 3.5. The two designs' means are compared with each other, never
    with the 1999 data. (4) Speed per recruiter, both designs.
- **2026-10-10** **E1 side task (user approved; pre-registered before any
  computation): stride sway vs correlated tracking error.** Correction
  first: the "measure tracking noise from stopped ants" check proposed on
  2026-10-09 had already been done (step 5.A: white per-frame noise,
  deconvolved, applied to every walker; "noise does not explain the
  gaps"). What is open (sampling-scale sweep, 2026-10-09): every walker,
  the Khuong reference walker included, turns 25–40 % too little at
  τ ≤ 0.16 s; white per-frame noise does not supply the wiggle; candidates
  are frame-correlated tracking error and real body sway with the stride.
  - **Analysis (`scripts/strideE1.ts`, data only; Khuong inclines 1–5,
    fit and development data; Bonavita untouched; writes nothing):** raw
    25 Hz positions (no smoothing). Windows of 32 samples (1.28 s), one
    per non-overlapping stretch, classed by chord speed (first-to-last
    displacement ÷ duration): stopped (< 2 mm/s over the window, every
    0.2 s step < 2 mm/s) and moving bins 10–20, 20–30, 30–45, 45–70 mm/s
    (moving windows: every 0.2 s step speed > 5 mm/s). Lateral
    displacement = signed distance from the chord line, linear trend
    removed, Hann taper, periodogram; averaged per bin and incline (power
    in mm²/Hz, 0.78–12.5 Hz). The same on the adopted walker (`e1-walk`)
    with its tracking observer, 600 ants per incline, as the
    no-sway / white-noise reference. Excess = data ÷ walker power per
    frequency.
  - **Reading:** (a) **stride sway** if the excess lateral power above
    3 Hz has a peak whose frequency rises with the speed bin in at least
    three of the four moving bins at a majority of inclines, and stopped
    windows show no such peak; implied stride length = bin speed ÷ peak
    frequency is reported (not a criterion). (b) **correlated tracking
    error** if the excess above 3 Hz is broad and its shape (peak or
    centroid frequency) does not move with speed. (c) **neither** if the
    data's lateral power above 3 Hz is within ±20 % of the walker's in
    every moving bin; then the fine-scale gap is not lateral jitter.
    Mixed patterns are reported as such. Consequences, not acted on here:
    (a) → a kinematic sway term in the observer or fine-scale turning
    judged only at τ ≥ 0.32 s; (b) → the correlated-noise observer variant
    already planned.
  - **Backlog:** the black-box (mixture-density network) diagnostic, with
    the changes discussed: colony-level split, compared against walkers
    plus the observer, one-step statistics uninformative, walker
    likelihoods need a particle filter, Bonavita untouched. It cannot by
    itself separate observer from behaviour (it learns both from the
    tracks).
