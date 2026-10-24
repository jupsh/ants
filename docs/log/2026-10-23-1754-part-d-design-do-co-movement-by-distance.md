---
id: D126
date: 2026-10-23
time: 17:54
kind: design
title: Part D design: do co-movement by distance (S2) and onset lag by distance (S3) jointly distinguish ant-to-ant transmission from a spatially structured driver? S3 audit first, fast-relay transmission and travelling-front drivers, calibration on 1-min synchrony only, joint equivalence on fresh seeds, a simulation-only separation, a fixed stopping rule; proposal, nothing built
---
- **2026-10-23 ≈ 17:54 UTC — Part D design: do co-movement by distance (S2) and onset lag by distance (S3) jointly distinguish ant-to-ant transmission from a spatially structured driver? S3 audit first, fast-relay transmission and travelling-front drivers, calibration on 1-min synchrony only, joint equivalence on fresh seeds, a simulation-only separation, a fixed stopping rule; proposal, nothing built.**
  - **Question (D125):** at matched synchrony magnitude, do **co-movement by distance (S2)** and **onset lag by distance
    (S3)** together distinguish **ant-to-ant transmission** (family T) from a **spatially structured driver independent
    of ant activity** (family D)? And does either family reproduce magnitude, timescales and both distance profiles
    together?
    - **Conclusions it can reach:** which tested members reproduce the profiles jointly, and whether S2 + S3 separate the
      tested families in this pipeline. Not which mechanism operates.
    - **Evidence class:** development only. S2's data profile was read in D122, S3's raw contrast in F026 / D124. The
      audited S3 rows are new, but their definitions are frozen here before any of them is computed.
  - **Kept from Part C, not relaxed:**
    - D121 stands: P4, P10, P20 and El10 missed the target in their bounded search. No Part C member is re-run with a
      wider box.
    - The T members below are **new members** of a different form (fast relay acting on both rates). A T success would
      leave P20's miss unchanged.
    - D122 stands: Eu and El20 are not sufficient. They are carried as calibrated D members (D121 strengths, no
      re-calibration) and re-run only on Part D's assessment seeds.
  - **Stage 0: S3 audit (local; definitions frozen now).**
    - **As built, written down** (`onsetStats.ts`, `spreadAgg.py`; same code and frozen tracker for data and
      simulations):
      - **Onset:** an ant's first moving step (≥ 0.6 mm/frame from its last detection ≤ 3 frames back) after ≥ 20 still
        frames (10 s). Gaps ≤ 3 frames are bridged; a longer gap resets the still count. Position: the last detection
        before the step. Light phase only (data: the 06–18 UTC clock blocks).
      - **Episode:** the colony's onsets in time order; a gap > 10 frames (5 s) ends one. Each ant counts once, at its
        first onset in the episode. At least 3 distinct ants.
      - **Initiator:** the earliest onset (ties broken by sort order: frame, then ant index).
      - **Distance:** from the initiator's onset position to the participant's, each at its own onset frame.
      - **Lag:** the participant's onset frame minus the initiator's.
      - **Missing detections:** an ant undetected for more than 3 frames cannot have an onset for 20 frames after it
        reappears. Undetected ants are neither participants nor nonresponders.
      - **Nonresponders:** excluded. Every lag statistic is conditional on responding.
    - **The confound the raw contrast leaves open:** the 11-frame contrast (D124) pools lags over participants. Long,
      many-ant episodes contribute most, and they are also the episodes most likely to reach distant ants. Far bands can
      therefore show longer mean lags with no ordering inside any episode. Only the within-episode ρ was compared with
      nulls.
    - **Nulls (as built):**
      - **Null 1 (composition and first-mover selection):** onset frames are permuted among an episode's participants
        (1000 times), and the initiator is re-chosen as the earliest after permutation.
      - **Null 2 (geometry):** the initiator's position is replaced by the initiator positions of 20 other episodes of
        the same colony and phase; lags are kept.
    - **Audited statistics (new):**
      - **S3-raw (continuity):** the pooled 20–40 minus < 5 mm contrast, its pooled null-1 and null-2 expectations, and
        the two excesses. This splits the 11 frames into composition, geometry and the rest.
      - **S3-slope (primary):** in each episode with ≥ 4 participants, the OLS slope of lag on distance (frames per
        10 mm), minus its null-1 expectation (**S3₁**) and minus its null-2 expectation (**S3₂**).
        - Per colony: the mean over episodes, each weighted equally. Data set: the mean over colonies. Colony bootstrap,
          2000 draws.
      - **S3-pair (no initiator):** within each episode, the Spearman correlation between pairwise |lag| and pairwise
        distance over all participant pairs, minus its null-1 expectation. A control for selecting the first observed
        mover.
      - **S3-ρ (carried):** ρ − null 1 +0.015 [0.005, 0.023]; **ρ − null 2 +0.007 [−0.001, 0.015], which includes 0**.
        That less decisive result stays in every summary.
      - **S3-p (response by distance, descriptive):** of the ants detected in-nest and eligible (still ≥ 20 frames) at
        the initiator's onset frame, the share that join the episode, by distance band.
        - It needs a recorder extension, so it is computed on new runs and on the data only.
    - **Sensitivities (declared, reported, never substituted for the primary):**
      - (a) episodes of 4–15 participants only;
      - (b) detection-complete episodes: the initiator detected in all 20 frames before its onset, every other
        participant in ≥ 18 of its 20 (fewer mislabelled initiators);
      - (c) distances measured at the initiator's onset frame: each participant's last detection at or before it, ≤ 3
        frames back.
      - (b) and (c) need the recorder extension, so they are available on the data and on Part D's new runs only.
    - **Pipeline control:** the C2 base arm (no coupling, no driver) through the same tracker and code. Its values are
      what geometry, the tracker and C2's spatial habits produce with neither mechanism.
    - **Order:**
      1. Build, with synthetic tests: a known front speed gives its slope back; episodes with no structure give
         excess ≈ 0; a size-mixed episode generator with no ordering shows whether the raw contrast is positive while
         S3₁ ≈ 0.
      2. Run on simulated files first: Part C's base, Eu and El20 separation arms, plus P20's verification files.
         P20 is uncalibrated and labelled descriptive.
      3. Then on the data.
      4. Log the reading.
    - **Attainability (before Stage 2):**
      - For each assessment row, a perfect model's 90 % CI half-width is 1.645 · √(SE_data² + SE_sim²). SE_sim is the
        largest among base, Eu and El20 at 2 runs × 22.
      - A row is attainable if that half-width is below its tolerance.
      - Unattainable rows are listed before any Part D model run. They can still be "outside", but they cannot support
        "reproduces".
    - **Gate G (after the Stage 0 reading, before Stage 1 is built):**
      - **Proceed as designed** if the data's S3₂ has a 95 % CI excluding 0 **and** the data − base difference in S3₂
        excludes 0.
      - **Otherwise:** distance-ordered lag is not shown beyond geometry and composition. The user decides between
        Stages 1–3 with the S3 rows as computed, or stopping Part D at Stage 0.
      - In neither case is S3 redefined.
  - **Families and members (diagnostics behind switches, off by default, never adoptable):**
    - **T (transmission):** a new kind, `relay`. Ant i's walk-on rate is multiplied by g_i, and its stop rate
      (`activeToRest`) by 1 / g_i.
      - Input: m_i, the moving fraction (true state) of the other in-nest ants within r. u_i relaxes toward m_i with
        τ_c, starting from ū. g_i = clamp((u_i / ū)^κ, 0.25, 4), with ū the colony's 1800-s moving fraction.
      - Isolated ants: g_i = 1 at once, and u_i is reset to ū (as `local`).
      - **Members:** r ∈ {10, 20} mm × τ_c ∈ {5, 20} s: **T10f, T20f, T10m, T20m**. κ grid {0.25, 0.5, 1, 1.5, 2, 3, 4};
        clamp unchanged.
      - **Why this form:**
        - the data's raw lags are seconds (12 → 18 s, F026), and an episode ends at a 5-s gap, so a 60-s filter cannot
          relay within one;
        - acting on both rates adds leverage at 10 min, where El20 fell short;
        - contact range is left out, because P4 plateaued at D_w 1.5 (D121) and contacts precede only ≈ 5 % of onsets
          (F019).
      - T stands for any non-contact signal (vibration, sight, odour). It is a cheat channel on true state, not a
        mechanism.
      - **Tests:**
        - with the stop-rate switch off, it is bit-identical to `local`;
        - κ = 0 is bit-identical to base;
        - isolation resets the filter;
        - the realised clipped fraction is recorded.
    - **D (spatially structured drivers, independent of ant activity):**
      - **Carried:** Eu (0.8125) and El20 (1.5). El20 is the no-delay limit of the new kind below.
      - **New kind `driverWave`: travelling fronts.**
        - Events arrive as a Poisson process at rate μ / dur (μ = 1, dur = 60 s, as El), on their own RNG stream.
        - Each event's front leaves its origin at t_e with speed v. An ant at distance d is exposed during
          [t_e + d / v, t_e + d / v + dur), with weight w(d) = exp(−d² / 2σ²).
        - g_i = exp(A · S_i − c(x_i)), with S_i the ant's summed exposure.
        - c(x) is the log Laplace functional of the event process, so E[g | x] = 1:
          - uniform origins: the process is stationary, so the delay only shifts exposures in time and c equals El's
            table (checked by Monte Carlo);
          - perimeter origins: c gets its own table.
        - Ants' positions set only their exposure; ant activity never feeds the driver.
      - **Members** (A grid {0.25, 0.5, 1, 1.5, 2, 3, 4}):
        - **Ed2, Ed5, Ed20:** uniform origins, σ 20 mm, v 2 / 5 / 20 mm/s (a front crosses the 70-mm nest in 35 /
          14 / 3.5 s);
        - **Ew5:** origins uniform on the nest perimeter, no attenuation (σ = ∞), v 5 mm/s: a disturbance entering
          through a wall and sweeping the nest.
      - Every member is assessed. None is chosen by S2 or S3.
      - **Tests:**
        - v = ∞ is bit-identical to `driverLocal`;
        - A = 0 is bit-identical to base;
        - Monte Carlo gives E[g | x] = 1 for both origin kinds;
        - the front timing is checked on a fixed event.
  - **Statistic roles (fixed):**

    | Role | Statistics | Rule |
    |---|---|---|
    | Calibration | D_w all ants, 1 min | strength only, per member; target 4.15 ± 0.30 |
    | Assessment (15 rows) | S1: the other 8 D_w cells (±20 %); S2: C in 5 bands (±0.015 absolute); S3₁ and S3₂ (±1.0 frame per 10 mm, absolute) | joint equivalence |
    | Separation (simulation only) | R = C(20–40) / C(< 5), and S3₂, jointly | 2-D, below |
    | Secondary screen | S7: Spearman ρ across colonies of per-colony S3₂ against occupancy (relay predicts faster spread when denser; fronts do not) | Part C's per-signature rule |
    | Descriptive | S3-raw decomposition, S3-pair, S3-ρ, S3-p, sensitivities (a)–(c), S4, S5, S6, mean moving fraction (> 20 % flag), realised g, clipped fraction | reported, no rule |

  - **Stage 2a: calibration (D117's rule, new seeds):**
    - Grid: 22 colonies × 1 run, `diag` seeds 0xc4b0, B1's window (light, warm-up 7200 s, 4 h). Selection: the closest
      grid point.
    - One refinement: 3 points inside the nearest bracket, else towards the target. The selection is frozen.
    - Verification: `judge` 0xc4b1, 2 runs × 22. **Calibrated** if within ±0.30 of 4.15.
    - A miss is a sufficiency failure on magnitude: recorded, and not eligible.
  - **Stage 2b: assessment (fresh seeds):**
    - Seeds: `judge` 0xc4b2, 2 runs × 22, for every calibrated new member, Eu, El20 and base.
    - Equivalence as D117: sim − data, data and simulated colonies resampled independently (2000 draws).
      - **Equivalent:** the 90 % CI lies wholly inside ±tolerance.
      - **Outside:** the CI lies wholly beyond it.
      - **Unresolved:** otherwise.
    - **Reproduces jointly:** every attainable row is equivalent and no row is outside. The unattainable rows are named
      in the same sentence.
    - A family reproduces if at least one member does. The number of members tried per family (T 4; D 6) is reported
      with it, because more members give more chances.
  - **Stage 3: separation (simulation only), then the data.**
    - **Eligible:** calibrated members. If a family has none, **comparison not evaluable**: no separation, no placement
      (as D117).
    - **Joint separation:** for each (T, D) pair, a paired colony bootstrap (2000) of the 2-D difference (R, S3₂).
      - The pair is **separated** if 0 lies outside the 95 % region: Mahalanobis² from the bootstrap mean, under the
        bootstrap covariance, above 5.99 (χ²₂).
      - **S2 and S3 jointly distinguish the families** if every pair is separated.
      - Also reported: each coordinate screened alone with Part C's rule (95 % CI excluding 0, same sign in every pair),
        showing whether the joint view adds anything. Also the same restricted to jointly reproducing members, when both
        families have one.
    - **Data placement (only if the joint separation passes):** the data's 2-D bootstrap (2000) against each eligible
      member's.
      - **Compatible** if the Mahalanobis² of the difference, under the summed covariance, is below 5.99.
      - **T-like:** compatible with at least one T member and with no D member. **D-like:** the reverse.
        **Neither / both:** otherwise.
      - Without a pass, the data's values are descriptive.
    - **Wording:** "of the tested members, … reproduce the profiles jointly; S2 + S3 do / do not distinguish the
      tested families in this pipeline; the data resemble …". Never "is the cause".
  - **Stopping rule:**
    - **One pass:** Stage 0 → gate G → Stage 1 build → Stage 2 → Stage 3. Once any Part D output has been seen, no
      member is added, no parameter or grid is changed, and no tolerance or seed is changed.
      - Anything further is a new design. Every Part C and Part D verdict stands.
    - **Box:** the estimate is rebuilt from a bench at strengths near the expected calibrated ones (the D119 lesson),
      and the user approves it.
      - Checks are hourly. If the projected cost exceeds 1.5 × the approved estimate, the run pauses and is reported.
    - **Outcomes:**
      - **O1, not evaluable** (a family has no eligible member): reported as such, reproduction still reported per
        member, then the measurement list.
      - **O2, evaluable but not separated:** "S2 and S3 do not jointly distinguish the tested families in this pipeline
        at 22 colonies", then the measurement list.
      - **O3, separated:** data placement and reproduction.
      - In every outcome where both families reproduce jointly, or neither does, **the measurement list is the
        outcome**, ranked as below.
  - **Measurements and interventions (requirement 6).** Each is ranked at the reading by its predicted T − D difference,
    from the implemented members wherever that needs no new arms, and by the controls it needs:
    1. **Direct sensing of a driver.** Substrate vibration, airflow and temperature at ≥ 3 points, synchronised with
       the video.
       - D predicts onset clusters time-locked to sensed events, with lags following the sensed front. T predicts no
         lock beyond chance.
       - Controls: front speed estimated from the sensor array; placebo windows; sensors that do not themselves
         disturb.
    2. **Density or relay-node manipulation** (area-matched density change, or a band emptied of ants by
       sham-controlled confinement).
       - T's lag slope and reach depend on chains of neighbours; a front's do not. S7 is the between-colony version,
         computed from the members.
       - Controls: exposure to a driver also changes with packing; a handling sham; area matched.
    3. **Partial barrier with gaps.**
       - T relays round through the gaps, so lag follows path distance. A substrate or air front crosses, so lag
         follows straight-line distance. Lag against path vs straight distance is computable from implemented members
         only once a barrier is simulated, which is a separate design.
       - Controls: a sham barrier; a check of which channels it blocks (vibration transmission measured); area and
         packing matched.
    4. **Point stimulus** at a known place and time.
       - Both families respond near it. T predicts a secondary spread beyond the stimulus footprint, scaling with
         density. D predicts a response confined to the stimulus field.
       - Controls: dose, timing, sham stimulus, placebo period.
    5. **Higher frame rate.**
       - T predicts stepwise lags from hop to hop; a front predicts a continuous lag at its speed. At 2 fps, S3 sees
         only the coarse version.
       - Controls: the same tracker at both rates, with matched detection.
    6. **Two colonies in one system.**
       - A box-level driver gives co-movement across colonies; transmission within a colony does not.
       - Controls: a barrier between them; their placement.
  - **Limits stated now:**
    - development evidence only;
    - T is a cheat channel on true state; F019 already constrains transmission at contact range;
    - D adds four members of two forms, each with a fixed speed and footprint, so a miss does not exclude other drivers;
    - multiplicity: 10 members in all, so one member's joint pass is weaker evidence than it looks; counts are always
      reported;
    - one magnitude target, light phase only, C2's motion as fitted (its still-run failures persist), 22 colonies;
    - S3 is conditional on response and detection: S3-p and the sensitivities describe that, they do not remove it.
  - **Cost (before a bench):**
    - **Stage 0:** build ≈ 3–4 h local (audit code, synthetic tests, recorder extension); runs ≈ 1 h local.
    - **Stage 1:** build ≈ 1 day (`relay` stop channel, `driverWave` with the perimeter table, tests, readers).
    - **Stage 2 (box):**
      - runs: 8 new members × 10 grid points × 22 = 1,760 calibration runs, + 8 × 44 = 352 verification runs, + ≤ 11 arms
        × 44 = 484 assessment runs, ≈ 2,600 in all;
      - for scale: Part C made ≈ 1,340 runs in ≈ 8 h on 45 jobs;
      - **≈ 15–18 h, ≈ $6.5–8** at ≈ $0.42/h, to be rebuilt from a bench before rental.
    - **Stage 3:** reading ≈ 1 h local.
  - **For the user: approve or amend.** The values marked here as the lead's choices, which the user should confirm:
    1. T members: r {10, 20} mm × τ_c {5, 20} s, both rates modulated, κ grid up to 4, clamp [0.25, 4];
    2. new D members: Ed v {2, 5, 20} mm/s (σ 20 mm), Ew5 (perimeter, σ ∞); μ 1, dur 60 s; A grid up to 4;
    3. S3₁ / S3₂ tolerance ±1.0 frame per 10 mm (the pooled raw contrast is ≈ 4 frames per 10 mm, taking band centres 2.5 and 30 mm);
    4. gate G as stated;
    5. attainability: a perfect model's 90 % half-width below the tolerance;
    6. separation on (R, S3₂), χ²₂ at 95 %;
    7. sensitivity bounds: 4–15 participants; 20 / 18-of-20 detection frames.

    Nothing is built before approval.
- **2026-10-23 ≈ 18:09 UTC — Amendment 1 (D128, user guidance adopted), before anything was built or run.** It replaces
  the parts named; everything else stands. Values marked **[confirm]** are the lead's, fixed because the guidance asked
  for them to be frozen; the user confirms them before the audit runs on any simulated or recorded tracks. **Stages
  1–3 are amended but not approved.**
  - **Stage 0, frozen in full:**
    - **Inputs:**
      - data: `logs/contacts/data-c*.json`, `onsets.light`, 22 colonies;
      - simulated, from Part C: base, Eu and El20 separation arms (`pc-sep-<arm>-r{0,1}-c*`, seeds 0xc4a2), and P20's
        verification runs (`pc-ver-P20-r{0,1}-c*`, 0xc4a1; uncalibrated, descriptive only), `onsets.light`.
      - Order: synthetic tests → simulated sets → data. Outputs go to `logs/partd/`, sealed until the reading is logged.
    - **Onsets and episodes:** as built (D126 Stage 0). Episodes are formed per file. A simulated colony pools its two
      runs' episodes, each episode weighted equally; null-2 references come from the same file.
    - **Initiator ties [confirm]:** applies to the new statistics only. If k ≥ 2 ants share the earliest onset frame,
      the episode's observed value is the **mean over the k choices** of initiator. Each choice excludes that ant, so
      the other tied ants enter with lag 0.
      - Null 1: the initiator is drawn uniformly among the ants holding the earliest permuted frame (as built).
      - Null 2: the mean over the k choices, each against the same 20 reference positions. A reference episode's
        position belongs to one of its tied earliest ants, drawn uniformly.
      - S3-raw and the carried S3-ρ keep the as-built ant-index order, for continuity.
    - **S3-slope:**
      - **Fit:** OLS **with an intercept** of lag (frames) on distance (mm) over the episode's participants
        **excluding the initiator**, in observed and null statistics alike. Reported per 10 mm.
      - **Defined [confirm]:** ≥ 3 non-initiator participants, and sample variance of their distances > 1e−6 mm².
      - **Null 1** (1000 permutations): a permutation without a defined slope is skipped. Null 1 is defined if ≥ 900
        permutations are defined.
      - **Null 2:** 20 reference episodes drawn without replacement from the file's other episodes. It is defined if
        ≥ 15 of the 20 give a defined slope. It is a **reference-position control**: it does not remove every relation
        between an episode's location, participation and occupancy.
      - **Eligibility:** an episode enters S3₁ only if the observed slope and null 1 are both defined, and S3₂ only if
        the observed slope and null 2 are. Observed − null is taken episode by episode on that same set.
      - **Colony:** the mean of the eligible episodes' differences. Estimable with ≥ 5 eligible episodes, otherwise
        missing and reported [confirm].
      - **Set:** the mean over estimable colonies. If fewer than 15 of the 22 data colonies are estimable, the S3 rows
        are **unestimable** and the gate reports so [confirm].
    - **S3-pair:** over all participants, the Spearman correlation between pairwise |lag| and pairwise distance, minus
      its null-1 expectation (1000 permutations). Defined with ≥ 3 participants and variance in both; otherwise the same
      rules as above.
    - **S3-raw (continuity):** as built (11.0 frames), with its pooled null-1 and null-2 expectations. For each band,
      the expected lag sum and count are averaged over permutations or references; the pooled mean is their ratio.
      **The two excesses are separate comparisons, not an additive decomposition.**
    - **Sensitivities:**
      - (a) episodes of 4–15 participants, initiator included: on every set;
      - (b), (c) and S3-p need a recorder extension: at each onset frame, a snapshot of every detected in-nest ant
        (position, still count, detections in the last 20 frames). Existing events are left bit-identical. At Stage 0
        they are computed **on the data only** (re-streamed, ≈ 6 s per colony) [confirm].
        - (c)'s null 1 uses the snapshot at the permuted initiator's onset frame, which is always some participant's
          onset frame.
      - **S3-p:** the shares by band and their excess over the null-2 references, descriptive.
    - **Seeds and uncertainty [confirm]:**
      - Per file, Python `random.Random(53)` (the D121 per-file practice), drawn in the order the frozen script
        draws them. The script's md5 is recorded in the reading.
      - Colony bootstrap: 2000 draws, 95 % by sorted index (as `spreadAgg.py`). `random.Random(0x5ea0 + k)` for set k in
        the order data, base, Eu, El20, P20.
      - data − base: the two sets resampled independently.
    - **Synthetic tests (before any real input):**
      - **front:** onsets at d / v from a point source give slope 10 / (v · 0.5 s) frames per 10 mm, and S3₁, S3₂ > 0;
      - **no structure:** random times in random positions give S3₁ and S3₂ ≈ 0 (mean over 200 colonies within ± 2 SE);
      - **size-mixed:** episodes with no ordering whose spatial extent grows with their size give a raw pooled
        contrast > 0 and S3₁ ≈ 0;
      - **ties:** the observed tie average equals the brute-force mean over the candidates;
      - **front with an offset origin:** the first observed ant is not at the source. Reported: how far S3-slope then
        is from the front speed (point 6).
    - **Gate G (directional; replaces D126's):**
      - **Positive excess ordering is established** if the lower 95 % bound of the data's S3₂ is > 0 **and** the lower
        95 % bound of data − base S3₂ is > 0. Stages 1–3 then stay subject to the user's approval of their amended
        form.
      - **Otherwise:** "this gate did not establish positive excess ordering". This is not evidence that propagation is
        absent. The user decides whether to continue.
      - S3₁, S3-pair, (a)–(c) and S3-p are reported beside, never as the gate.
  - **Stages 1–3 (amended, not approved):**
    - **Matched behavioural mapping (point 3):** in the primary comparison, every member of both families uses one
      mapping M: walk-on × g, stop (`activeToRest`) × 1 / g, with g clamped to [0.25, 4].
      - **Primary D members:** Eu-M, El20-M (the Eu and El20 driver processes under M, calibrated afresh on the grid as
        new members), Ed2, Ed5, Ed20, Ew5. **T members:** the four of D126, under M.
      - **Historical controls:** Eu and El20 (walk-on only, D121 strengths), run on the assessment seeds; their
        verdicts (D122) are unchanged, and they are outside the primary comparison.
      - **Normalisation:** the drivers keep E[g | x] = 1. Under M, their E[1 / g] exceeds 1; T's g is not
        mean-normalised. Per member, the realised E[g], E[1 / g], clipped fraction and mean moving fraction (> 20 %
        flag) are reported, not adjusted.
      - Grid for every member: {0.25, 0.5, 1, 1.5, 2, 3, 4}.
    - **Correction (point 3):** D126's "a 60-s filter cannot relay within one" is wrong and is withdrawn. A relaxation
      filter responds at once; τ_c sets its speed. After a step in its input it has covered ≈ 8 % of the step in 5 s at
      τ_c 60 s, and ≈ 63 % at 5 s. Faster filters are candidates. P's 60-s filter is not shown unable to order onsets.
    - **All 15 rows (point 4):** **joint reproduction is demonstrated only if all 15 rows are equivalent.** Otherwise the
      equivalent, outside and unresolved rows are reported.
      - The perfect-model calculation becomes a **precision forecast**, reported before Stage 2 and never a filter.
        Low precision gives an unresolved conclusion.
    - **S3 tolerance [confirm]:** ±1.0 frame per 10 mm, as a proposed practical resolution at 2 fps: 0.5 s per 10 mm, an
      apparent spread of 20 mm/s or faster (crossing the 70-mm nest in under 3.5 s). It is no longer justified as a
      fraction of the raw contrast.
    - **2-D rule (point 5): deferred.** It is specified in a later amendment, before Stage 2 runs and after its
      calibration. Fixed now:
      - R is a **ratio of colony means**, mean C(20–40) / mean C(< 5), recomputed in every bootstrap draw. Draws with a
        denominator ≤ 0.01 are counted; if more than 1 %, R is not evaluable.
      - A singular or near-singular covariance (condition number > 1e8) falls back to the per-coordinate screen.
      - Its false-positive rate is checked on synthetic nulls: two arms of one mechanism, 22 colonies, colony summaries
        resampled from Part C's per-colony values, including skewed ones. The threshold or reference distribution is
        chosen to keep the rate ≤ 5 %, and that choice goes to the user.
      - The wording keeps **separation of estimated means** apart from reliable classification of another data set.
      - **Placement:** "**not rejected** relative to member m", always shown with m's row classes. A member with any
        row outside does not count towards its family's not-rejected set. Failing to reject is not equivalence.
    - **Interventions (point 6), as hypotheses:** each is listed with the explicit prediction of each implemented
      member where the member can be run under the intervention without new modelling. Otherwise its prediction is
      **unresolved (needs modelling)**. Withdrawn from D126:
      - "lag follows path distance under T": ant-mediated vibration need not route round a barrier;
      - "a front's lag does not depend on density": the behavioural lag under a driver can;
      - S7's prediction for each member comes from its runs, not from an assertion;
      - S3-slope does not recover a radial front's speed when the first observed ant is not at the origin (the
        offset-origin test above).
    - **Cost (before a bench):** 10 members calibrated × 264 runs ≈ 2,640, plus assessment of 10 primary members, 2
      historical controls and base × 44 ≈ 570. ≈ 3,200 runs in all, **≈ 19–23 h, ≈ $8–10**. Stage 0 stays local:
      build ≈ ½ day, runs ≈ 1 h.
- **2026-10-23 ≈ 18:18 UTC — Stage 0 built; synthetic tests pass; two proposals for the confirmation.** Nothing has
  run on simulated or recorded tracks.
  - **Built (scratch, local only):**
    - `s3Audit.py`: per file, per episode;
    - `s3AuditRead.py`: per set, the bootstrap and gate G;
    - `s3AuditTest.py`: the synthetic tests;
    - the snapshot option of `onsetStats.ts` and `snapData.ts`, writing data snapshots to `logs/contacts/snap-c<i>.json`.
    - The snapshot statistics ((b), (c), S3-p) draw from their own stream, `random.Random(530)`, so the primary values
      do not depend on whether snapshots are given.
  - **Tests** (`s3AuditTest.py`, 200 colonies where repeated):
    - **front at 5 mm/s:** slope 4.00 (expected 4.0); S3₁ 4.00, S3₂ 3.24;
    - **no structure:** S3₁ −0.029 ± 0.043, S3₂ −0.026 ± 0.042, S3-pair −0.006 ± 0.004 (mean ± SE); all within 2 SE of 0;
    - **size-mixed** (no ordering inside an episode; larger episodes span more space and time): the **raw pooled
      contrast is 3.6 frames**, while S3₁ is +0.38 ± 0.23 (within 3 SE). Composition alone produces a raw contrast of the
      kind D124 reported.
    - **ties:** equal to the brute-force mean over the candidates;
    - **snapshot events:** identical to `contactData.ts`'s (colony 0).
    - **Offset origin** (the first observed ant 10 mm from the source; information only): slope 3.60 against a true
      4.0. S3-slope underestimates a front's speed term when the origin is unobserved.
  - **Finding from the tests:** per-episode slopes are heavy-tailed. An episode with little spread in distance gives
    |slope| up to ≈ 25 frames per 10 mm, so equal weighting lets those episodes dominate.
    - Size-mixed, 40 colonies, per-colony S3₁: equal weighting has mean −0.009, SD 0.212 across colonies.
    - Weighting each episode by w = Σ(d − d̄)² over its non-initiator participants (the pooled within-episode slope)
      has mean −0.002, SD 0.074: ≈ 8× less variance, both unbiased.
  - **Proposal 1 [confirm]:**
    - the primary S3₁ / S3₂ use spread weights, colony = Σ w · (obs − null) / Σ w, with w from the observed initiator
      (mean over tied candidates);
    - equal weighting becomes a declared sensitivity;
    - the minimum of 5 eligible episodes per colony is unchanged.
  - **Proposal 2 [confirm], prompted by the user's D127 note** (tag misreads are not in the simulated observer):
    - a one-frame misread jump after ≥ 10 s still is recorded as a movement onset in the data, never in simulations, so
      spurious onsets at random times and places could dilute the data's ordering, on one side of data − base only;
    - **sensitivity (d):** S3₁ / S3₂ on the data with suspected misread onsets removed, before episodes are formed.
    - So that there is one definition of a misread, (d) takes it from the data-only check added to paper 3's list
      (D127) once that check's design is logged. Until then (d) is pending and is not part of gate G.
  - **md5 at this build:** `s3Audit.py` 486175c6, `s3AuditRead.py` f95e1c84, `onsetStats.ts` a35e5144 (first 8 hex).
    They are recorded in full in the reading after any confirmed change.
