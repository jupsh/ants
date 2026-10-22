---
id: D115
date: 2026-10-22
time: 16:44
kind: design
title: Part C design: what observable pattern distinguishes propagation between ants from a within-system external driver; one propagation and two driver diagnostics, calibrated on magnitude only, a simulation power check before any new data statistic; proposal, nothing built
---
- **2026-10-22 ≈ 16:44 UTC — Part C design: what observable pattern distinguishes propagation between ants from a within-system external driver; one propagation and two driver diagnostics, calibrated on magnitude only, a simulation power check before any new data statistic; proposal, nothing built.**
  - **Question (D114):** what observable pattern, measured through the project's 2-fps pipeline, would distinguish
    **propagation between ants** from a **driver acting on ants within one recording system**? Both are allowed by
    every check so far (F023, F024, F026, F065, Test B recheck). "Can explain" is the most a reproduction shows.
    Indistinguishability is a valid outcome, and then the deliverable is the measurement or intervention that would
    separate them.
  - **Scope and status:**
    - diagnostics only, on the 22 Stroeymeyt fit colonies, light phase, C2's fit as the base (motion fixed);
    - every mechanism is a runner-level switch in the oracle family, off by default and bit-identical when off, never
      adoptable (Rules in force). A mechanism this suggests is designed separately, and adopting one is the user's
      decision;
    - no held-out data, no 1999 rows, no step 9;
    - all statistics come from observed frames: the frozen tracker at 2 fps, the same hooks as the data (checked:
      `tmpShortSim.ts` feeds `InNestAccumulator.frame`'s observed ids and positions to every recorder).
  - **Mechanisms (C1, build):** the walk-on multiplier g_i, as the oracle, reaching nurses and foragers.
    - **P, local propagation** (`oracle: { kind: 'local', kappa, r, tauC }`): g_i = clamp((u_i / ū)^κ, 0.25, 4).
      - u_i is the τ_c-smoothed moving fraction of the other in-nest ants within r of ant i (true state, a cheat
        channel like the global oracle); ū is the colony's slow (1800 s) moving fraction.
      - An ant with no neighbour within r gets the neutral input ū, so isolated ants are not coupled. That is the
        hypothesis.
      - r = ∞ reproduces the existing global coupled oracle (a nesting test).
      - Variants: **r = 4.1 mm** (the contact threshold), **10 mm** and **20 mm**; τ_c 60 s.
    - **E_u, shared exogenous driver** (`kind: 'driverShared', amp, tau`): g = exp(A·z(t) − A²/2) for every in-nest ant.
      z is a unit OU process with τ 60 s on its own stream, independent of the colony's state. This is a box-wide
      disturbance (handling, vibration, light) that reaches every ant at once.
    - **E_l, local exogenous driver** (`kind: 'driverLocal', amp, sigma, rate, dur`): disturbance events (Poisson, rate
      λ per nest, uniform position in the nest, lasting 60 s) with g_i = exp(A·Σ_events exp(−d_i² / 2σ²)). The rate is
      fixed so that on average one event is active (λ = 1/60 s).
      - This is a spatially graded driver: it produces distance-graded co-movement without ant-to-ant transmission.
      - Variants: **σ = 10 mm** and **20 mm**.
    - The mechanisms use one timescale (60 s) throughout, so timescale results are read at that choice only. Each
      variant's mean moving fraction is reported against C2 base; a change > 20 % is flagged as a mean-activity
      confound.
    - **Tests:** strength 0 bit-identical; r = ∞ equals the coupled oracle; the event and driver streams leave existing
      draws unchanged; an isolated ant under P keeps g = 1; restoration of `P.nest`.
  - **Signatures** (all as differences from C2 base on the same seeds, so mechanism-free effects such as
    encounter-range co-movement cancel):
    - **S1 magnitude and timescales:** D_w at 5 s / 1 min / 10 min, all ants, nurses and foragers (`syncStats`, F022).
    - **S2 spatial profile:** co-movement C by distance, < 5 / 5–10 / 10–20 / 20–40 / ≥ 40 mm (Y, `ydistStats`, F024).
    - **S3 order within episodes:** Test A's ρ (lag after the initiator vs distance) against null 1 and null 2, and
      mean lag by distance band (F026).
    - **S4 contact precedence:** the Test-B time course, onset hazard at −10 … +10 frames around a moving partner's
      contact, and the pre / post excess ratio (Test B recheck).
    - **S5 neighbour dependence (new):** within-ant coupling to colony activity by the ant's number of neighbours
      within 10 mm (0 / 1–2 / ≥ 3).
      - Per ant-minute: the ant's moving-fraction deviation regressed on the leave-one-out colony deviation, as D_w's
        deviations.
      - The contrast compares the same ant at times with ≥ 3 vs 0 neighbours, with ant fixed effects, so ant identity
        and its usual position are held.
      - Expectation: P raises it; E_u leaves it flat; E_l depends on position, not on neighbours.
    - **S6 density scaling (new):** across the 22 colonies, Spearman ρ between colony D_w (1 min, all) and the ants
      per cm² of the nest.
    - X (sharing across systems) cannot be simulated with one system per run and is not used.
  - **C2, calibration (magnitude only):** each of the 6 variants' strength (κ ∈ [0, 2] for P, A ∈ [0, 2] for E) is set
    by bisection so that all-ant D_w at 1 min matches the data's 4.15 within ±0.30.
    - At most 6 steps; 22 colonies × 1 run per step on `diag` seeds; B1's window (warm-up 7200 s, 4 h, light).
    - A variant that cannot reach it inside its box is carried at the bound and flagged.
    - Nothing else is read during calibration.
  - **Reading 1, sufficiency (per variant, data beside):**
    - S1's other 8 cells and S2's 5 bands, each **consistent** (difference CI includes 0 and |difference| < 25 % of
      the data value), **inconsistent** (CI excludes 0) or **unresolved**;
    - a variant **reproduces magnitude, timescales and spatial pattern together** if every S1 and S2 cell is
      consistent. Reported per variant, for P and E alike: either can only show "can explain".
  - **Reading 2, power on simulated tracks (truth known), before any new data statistic.**
    - Fresh `judge` seeds, 2 runs per colony, the 6 calibrated variants plus C2 base.
    - A signature **discriminates** if, for all 9 (P variant, E variant) pairs, the P − E difference has a 95 %
      colony-bootstrap CI excluding 0, with the same sign in every pair, **and** the smallest separation exceeds the
      data's own 95 % CI half-width for that statistic (so the data could be placed).
    - Otherwise it does not discriminate *in this pipeline*.
    - Also reported per signature: which pairs separate, so a partial discriminator (e.g. against E_u only) is named.
  - **Reading 3, the data, only on discriminating signatures:**
    - S1–S4's data values are already known (F022, F024, F026, Test B recheck);
    - **S5 and S6 have never been computed on the data**, and stay uncomputed until reading 2 is logged. Disclosed:
      S6's inputs (per-colony D_w, colony sizes) have each been seen, but their relation has not;
    - per discriminating signature, the data are **P-like** if its 95 % CI overlaps the P variants' range and
      excludes the E range, **E-like** in the reverse case, otherwise **neither / both**.
    - Reading: "propagation of this kind can produce the synchrony and the data resemble it on S…" (or the E version),
      never "is the cause".
  - **If nothing discriminates (or the data are neither / both everywhere):** the outcome is "indistinguishable
    through this pipeline". The candidates for the separating measurement or intervention are listed now, and the
    reading ranks them by which signature came closest:
    - a **barrier partition** within one nest (blocks propagation, not a box-level driver);
    - **within-colony density manipulation** (propagation scales with neighbours; S5 / S6 in an experiment, not across
      colonies);
    - a **higher frame rate** (sub-second onset order; S3 / S4 are limited by 0.5 s);
    - **vibration isolation or deliberate disturbance** (an intervention on the driver);
    - **two colonies in one system** (shared driver vs within-colony propagation; X's design with a common box).

    These need new data or experiments: they are proposals for the user, outside M1's data.
  - **Limits stated now:**
    - P is one implementation, and a cheat channel on true state; E is two families. A miss by every P variant does
      not exclude other propagation forms, nor does an E miss exclude other drivers;
    - one timescale; light only; C2's motion as fitted (its still-run failures persist);
    - S5 / S6 are new definitions, so their data reading is exploratory, however fixed its rule;
    - power at 22 colonies only.
  - **Cost:**
    - build ≈ 1 day local (3 oracle kinds with tests; S5 in shared statistics code for data and model; the
      calibration driver and readers);
    - box ≈ 3–4 h: calibration ≤ 6 variants × 6 steps × ≈ 3 min; reading 2's 7 arms × 44 runs with the lite outputs
      (sync, ydist, onsets, contacts, tb);
    - the box can be closed meanwhile and re-rented once C1 passes its tests (a 1-day idle ≈ $7, over the user's $5).
  - **For the user:** approve or amend: the variants, the calibration target, readings 1–3, S5 / S6, and the list of
    interventions. Nothing is built before.
- **2026-10-22 — Amendment 1 (D116, user guidance adopted), before anything was built.** It replaces the parts named;
  everything else stands. Values marked **[confirm]** are the lead's choices, which the guidance asked to be fixed;
  they are confirmed by the user before any run.
  - **P, consistent definition (point 1):**
    - m_i(t) is the moving fraction of the *other* in-nest, alive ants within r of ant i at step t. u_i relaxes toward
      m_i with τ_c 60 s; ū is the colony's slow (1800 s) moving fraction over all in-nest ants.
    - **No neighbour within r ⇒ g_i = 1 at that step.** Its filter is reset to ū, so no earlier coupling carries over;
      on regaining neighbours, u_i starts from ū.
    - The comparator is a **global oracle excluding the focal ant** (`coupled` with `excludeFocal`: m_i = moving
      fraction of the other in-nest ants). Test: P with r = ∞ equals it to floating-point identity. The existing
      `coupled` (focal included) is unchanged and is not the comparator.
  - **E_l normalised (point 2):**
    - events: Poisson with mean active count μ = λ·T = 1 (T = 60 s), positions uniform over the nest, footprint
      w(d) = exp(−d² / 2σ²); S_i = Σ_active w(d_i);
    - **normalisation fixed now:** g_i = exp(A·S_i − c(x_i)) with c(x) = μ·(E_Y[exp(A·w(|x − Y|))] − 1), Y uniform over
      the nest. That is the log Laplace functional of the Poisson process, so E[g | position x] = 1 at every position
      under the prescribed process;
    - c is tabulated once per (A, σ) on a 1-mm grid over the nest at set-up (numerical integration, tested against
      Monte-Carlo).
    - E_u stays exp(A·z − A²/2).
    - Every arm reports realised E[g], SD of log g and its autocorrelation (the oracle recorder) and the mean moving
      fraction against C2 base, with the > 20 % flag.
  - **Calibration (point 3):**
    - **grid [confirm]:** κ or A ∈ {0.25, 0.5, 0.75, 1.0, 1.5, 2.0}, 6 points per variant; 22 colonies × 1 run, `diag`
      seeds; B1's window;
    - **selection:** the grid point with the smallest |D_w(1 min, all) − 4.15|;
    - **refinement (once):** if consecutive grid points bracket 4.15, 3 points evenly spaced inside the bracket nearest
      the selected point; otherwise 3 points between the selected point and its neighbour on the side of the target
      (or none if it is at the box end); the closest of all evaluated points is taken;
    - **verification:** at the selected strength, fresh seeds (`seedFor(2018, 'judge', 0xc4a1, i)`, 2 runs per
      colony). **Calibrated** if the verified D_w(1 min, all) is within ±0.30 of 4.15 [confirm]; otherwise a
      **sufficiency failure on magnitude**, reported, and **left out of the separation screen** (its comparison
      cannot isolate mechanism from magnitude).
  - **Sufficiency by equivalence (point 4):**
    - difference = sim − data, CI from a bootstrap over colonies (data and simulation resampled independently, 2000);
    - **D_w cells** (the 8 besides the target): tolerance ±20 % of the data value [confirm] (data values 1.58–6.28, so
      ±0.32 to ±1.26);
    - **C by distance** (5 bands): **absolute** tolerance ±0.015 [confirm] (about the CI half-width of D025's
      differences; data values 0.003–0.092);
    - classes: **equivalent** (90 % CI wholly inside ±tol), **outside** (90 % CI wholly outside), **unresolved**
      (else). "Reproduces magnitude, timescales and spatial pattern together" = all 13 equivalent.
  - **Separation check (point 5), replacing reading 2's "power":**
    - on fresh seeds (`seedFor(2018, 'judge', 0xc4a2, i)`, 2 runs per colony; the calibrated variants plus C2 base);
    - **screen:** a signature separates P from E if, for every (calibrated P, calibrated E) pair (up to 9), the
      difference of means has a 95 % colony-bootstrap CI excluding 0, with the same sign. Partial separation (which
      pairs, which direction) is reported for every signature;
    - **then** the fixed data statistics are computed for all signatures (S5 and S6 for the first time), with their
      colony-bootstrap uncertainty;
    - **data placement, screened signatures only:**
      - each mechanism's range is the union of its calibrated variants' 95 % CIs (simulation uncertainty included);
      - the data are **P-like** if the data's 95 % CI overlaps the P range and not the E range, **E-like** in the
        reverse case, otherwise **neither / both**;
      - unscreened signatures' data values are reported descriptively.
    - **No signature screened ⇒ "no discriminator found among these signatures and variants"**; it does not show that
      none exists. A screened signature shows separation of means at this n, not reliable classification of a new
      22-colony data set.
  - **S5, fixed (point 6):**
    - 1-min bins in the observed window. The neighbour count n_i is the number of *detected* in-nest ants within
      10 mm (centre distance) at the bin's first frame, measured before the activity it conditions on;
    - eligibility: the focal ant is detected in-nest at the first frame and in ≥ 80 % of the bin's frames;
    - activity: its moving fraction over the bin's detected steps (moving step as the rows);
    - deviation: minus its own mean in the 4-h clock block (as D_w); the colony deviation is the leave-one-out mean of
      the other eligible ants' deviations in the bin;
    - strata: isolated (n_i = 0) and crowded (n_i ≥ 3);
    - **primary:** a position-matched within-ant contrast. The nest is split into a 4 × 2 grid of cells (17.5 × 20 mm,
      by the ant's position at the bin's first frame) [confirm]. Per ant × cell with ≥ 10 eligible bins in *both*
      strata, Δβ = slope(crowded) − slope(isolated) of own deviation on colony deviation. The ant's value is the
      bin-weighted mean over its cells, the colony value the mean over ants, the data-set value the mean over colonies;
    - **secondary:** the same without position matching (ant × stratum, ≥ 20 bins in each);
    - ants without both strata are left out and **counted per colony and stratum**; a colony with < 5 included ants
      is unestimable and reported;
    - disclosed: position matching removes between-cell position effects, not packing within a cell or the
      association of crowding with where a driver acts. That is exactly what the separation check on E_l tests.
  - **S6, fixed:** density = the mean over frames of the observed window of the number of detected in-nest ants,
    divided by the nest's accessible area (70 × 40 mm = 28 cm², the same apparatus in data and model). Spearman ρ
    across the 22 colonies between colony D_w (1 min, all) and density, with a colony-bootstrap CI. **Descriptive
    only:** colonies differ in more than density.
  - **Interventions:** kept as candidates. The reading **ranks them by the P − E difference each would predict and by
    the controls needed to interpret it**:
    - barrier: sham barrier with gaps, area and packing matched; check which channels it blocks;
    - density: area-matched changes; exposure to a driver changes with packing;
    - frame rate: the same tracker at both rates;
    - disturbance: dose and timing known, with a placebo period;
    - two colonies in one system: a barrier between them, and their placement.

    Predictions come from the mechanisms as implemented where that is possible without new arms. Simulating an
    intervention would be a separate design.
  - **Conclusions this can reach (D116):** which tested mechanisms reproduce the observations (sufficiency), and
    whether the current pipeline distinguishes them (separation). Not which mechanism operates.
  - **Cost:** unchanged in kind. Calibration: up to 6 variants × (6 + 3) points + verification ≈ 3 h box; the
    separation check ≈ 1 h; build ≈ 1–1.5 days (P's filter reset, the excludeFocal comparator, E_l's tabulated
    normalisation, S5 in shared code).
  - **2026-10-22 ≈ 20:28 UTC — amendment 2 (D119):** S5's radius is 4.1 mm (was 10 mm, unestimable in the two
    simulated colonies checked, D118); every other definition and eligibility rule unchanged; S5 now measures
    dependence on contact-range neighbours.
