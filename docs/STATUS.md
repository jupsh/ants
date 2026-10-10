# Project status

_Last updated: 2026-10-10 night (session 3: STATUS split; colony pilot fit running at dt 0.025, warm-up 900 s; late-signal test running). Keep this file current: update it whenever a step starts or finishes._

Everything up to 2026-10-10 night (session notes, step results, the full
decisions log of about 4,500 lines) is in
[`archive/STATUS-2026-10-07-to-10.md`](archive/STATUS-2026-10-07-to-10.md);
references below to "the archive" mean that file. This file keeps the
current state, the plan, the **rules in force**, the evidence policy and
open problems. New decisions go in the Decisions log at the end; when this
file passes about 600 lines, archive again.

## ▶ RESUME HERE

**State (2026-10-10 night).** Milestone M1, *Lasius niger* as the single
reference species. Work is on `browser-sim-m1`, merged to `main` (GitHub
Pages) when the user asks.

- **E1 (walking): paused** (2026-10-09). The fitting procedure is
  validated, but fine-scale turning is still off by z 10–20 for every
  walker, including the Khuong reference walkers. E2 is insensitive to the
  walker (five walkers, max |Δz| 0.8), so this does not block M1.
- **E2 (drinking, trail laying): provisional.** L0S1c main
  (`e2-3d-L0S1c.json`), L0S1 alternative (`e2-3d-L0S1.json`). Not
  validated: L0S1c's recovery test failed (1 replicate), and a profile
  point (intakeSd 0.4, loss 20.7) beats the adopted fit (26.5). E2 reopens
  only under the triggers in Rules in force. The E2 fits predate the wall
  fix (157cd66), which shifted E2 rows by ≤ 0.51 combined SE.
- **Colony / Mailleux 1999 calibration: in progress.** Since the last
  refits were stopped: behaviour-state refactor, soliciting signal,
  between-nestmate reserve variation (`reserveSd`, 7th free parameter),
  give-up rule (`giveUpTime` 120 s, estimated), contacts observed as
  episodes ≥ 1 s, debiased objective, equivalence gate. The gate at the
  start points failed. That found a **wall bug** (the rest of a step
  after hitting a wall was dropped, so speed near walls depended on dt;
  fixed) and a dt-dependent distance observer (now the walked path). After
  the fixes, contacts and timeInNest (4 d) still depend on dt, and the
  start points are too far from the data for the gate to mean much.
  **Now:** a pilot fit at dt 0.025 / warm-up 900 s (box,
  `logs/pilot-main.log`) to get a point near the data; the late-signal
  (handshake) test (local, `logs/diag-handshake-d4.log`).
- **E6 (Bles et al. 2022): development benchmark, not validation.** Its
  judging rule is pre-registered (Rules in force); it runs only after an
  adequate 1999 fit and the fit-protection checks.
- **M1's honest end state (agreed 2026-10-10 night):** *calibrated and
  stress-tested, with failures disclosed*, not "validated". Validating the
  colony model needs independent held-out data; finding it is a work item
  now (Plan, parallel track).

### Plan (agreed 2026-10-10 night)
1. **Pilot fit** (running): `fitM1999.ts --layer main --dt 0.025
   --warmup 900 --tag pilot --gens 60`. Conditions (user, 2026-10-10):
   (1) a tool, not a result: never judged, adopted, used in the ranking
   check or added to the E6 ensemble; its loss is not reported as fit
   quality; seeds namespaced (extra key 0x9170). (2) Reference settings dt
   0.025, warm-up 900 s, k = 7, debiased objective, shared design (4 per
   nest), main layer, reduced budget. (3) Contact observer fixed first:
   gap 0 (done). (4) Usable as a gate point only if the 1-d no-bout
   fraction is ≤ 2 × `M1999_NO_BOUT_MAX` and no row has |fitZ| > 5; else
   no gate, a stage-3 "not adequate" signal: report the rows, Claude logs
   the model change before acting. (5) The timeInNest dt effect is tested
   regardless and fixed before the pilot-point gate if confirmed. (6) dt
   for the refits comes from the gate at the pilot optimum (0.1 vs 0.025,
   then 0.05 vs 0.025), with warm-up and identifiability (replicate
   Jacobian for the noise floor) at the same point.
2. **Late-signal test** (running): covers contacts as well as timeInNest.
3. **Recovery at the pilot optimum**, 3 replicates at the pilot's budget,
   before any full refit: does the fitting method recover known values?
4. **Encounter redesign decision, before the full refits:**
   stop-and-antennate on meeting, with the share decision made within the
   encounter (one change; it may also replace the ≥ 1 s contact rule and
   the late-signal lag). Inputs: the late-signal result and whether the
   pilot needs extreme values (parameters at bounds). New parameters from
   the literature, not fitted. If adopted, the pilot and its gate are
   redone on the new model.
5. **Gate at the pilot optimum** (dt, warm-up, identifiability); the
   flat-direction rule sets the refits' free set.
6. **Refits**, both layers, larger budget, shared warm-ups (4 per nest),
   debiased objective.
7. **Judging** on fresh seeds (adequacy rule).
8. **Fit protection** (gates E6): ranking check; convergence gate and
   identifiability at the optimum; flat-direction profiles.
9. **E6 preparation:** ensemble pre-registered; directed navigation to a
   known source as its own logged addition (parameters frozen from the
   literature, own tests, run-hash check); `leaveCropFrac` sensitivity
   reported with the E6 run.
10. **E6 run** (development benchmark).
11. **After or alongside E6, sized by it:** full-range 1-D scans at the
    optimum (profiles where flat or stepped); 5 synthetic recovery fits at
    the real n; the E2 backlog only if a reopening trigger fires.
- **Parallel track:** (a) candidate **held-out colony data** (in-nest
  trophallaxis, recruitment, contacts; other labs, ideally *Lasius*);
  (b) **literature values to fix in-nest parameters** (1999 nest density
  from colony and nest size, trophallaxis flow rate for `shareRate`,
  antennation durations for the redesign), so fewer directions are flat.
  E6 must not be used to fix anything.
- **Box:** kept through the gate, refits and fit protection; everything
  copied back. Keeping it for E6 depends on the ensemble's cost.

## Rules in force

Process (see also CLAUDE.md):
- **Log before acting.** Decisions and pre-registrations go in this file
  before the run they govern. **Read the whole relevant entry before
  appending to it** (a pilot was launched against a condition written
  just above the entry being appended, 2026-10-10).
- **Blind while a pre-registration is open:** check only that outputs
  exist; if anything is seen, say exactly what, here and in the reply.
- **New rules only if they block a known way to get a wrong answer**
  (user, 2026-10-10). Prefer fixing the model or data over adding
  procedure.
- Results are reported faithfully, failures included; a superseded rule or
  result is struck through or corrected in place with a date, never
  silently edited.

Judging (all experiments):
- Roles of data and the contamination log: Evidence policy below. Never
  fit to development or held-out data.
- Fitting uses `fitZ` (SE_data); judging uses `combinedZ` (SE_data ⊕
  SE_sim) on fresh seeds. |z| ≤ 2 consistent, ≤ 3 marginal. Spreads are
  compared separately. A candidate missing a statistic the data estimate
  is unjudgeable (cannot win or pass).
- Observation models are part of the comparison: the same statistics code
  on data and simulations.

Mailleux 1999 colony calibration:
- **Rows:** Table 2a at 1 / 4 / 8 d (time in nest, distance, contacts,
  total trophallaxis, contacts before the main trophallaxis): 15 fit rows.
  Table 2b and "all leave within 20 min": development.
- **Observer:** contacts = episodes of continuous antennal contact with
  one nestmate lasting ≥ 1 s (disclosed: chosen after seeing simulated
  durations), no gap merging; distance = path walked during the stay
  (Σ `stepLen`; disclosed: replaces per-step chords, which depended on dt).
- **Model choices (estimated, not fitted):** `giveUpTime` 120 s;
  `leaveCropFrac` 0.05; `cropFullFrac` 0.98; `LOAD_MG_PER_UL` 1.08.
- **Free (k = 7):** nestSpeedFactor, returnRate, shareRate, shareEnd,
  receiveReserve, reserveSd, 1999-only density. The flat-direction rule
  may fix some before the refits.
- **Fit:** CMA-ES, debiased objective Σ[(m − μ)² − Var(m)] / SE_data² +
  no-bout penalty, shared warm-ups with 4 recruiters per nest, larger
  budget per evaluation than the first fits.
- **Adequate** = no row |z| > 3, at most 2 rows in (2, 3], at most
  `M1999_NO_BOUT_MAX` (≈ 11 %) of recruiters per day without a bout.
  Sensitivities at the optimum: contact threshold 0.5 / 2 s, giveUpTime
  60 / 300 s. A verdict that flips under one of them is a real result:
  refit at the flipping setting, and that optimum joins the E6 ensemble
  (likewise a `contactGap`, if one is ever adopted). Not adequate → report
  the failing rows and why; Claude decides the model change and logs it
  before acting; E6 does not run.
- **Equivalence gate:** per row, 90 % bootstrap CI (paired seeds,
  recruiters resampled jointly over rows and levels) inside ±0.5 SE_data;
  1600 recruiters per day per level; dt 0.1 vs 0.025 (then 0.05 vs 0.025),
  warm-up 300 vs 900 s. Run at the pilot optimum, and repeated at each
  optimum. A failing knob is changed and its comparison rerun before
  refitting.
- **Flat-direction rule** (`identM1999`): a direction is flat if its
  singular value s < 1 or s is below the noise floor. One parameter with
  loading ≥ 0.8 → fix it at its provisional value and report ×0.5 / ×2 at
  the optimum; a combination → reparameterise and fix the flat
  combination; noise floor too high to tell → raise n and rerun; no refit
  on an inconclusive check.
- **Ranking check:** the 10 best distinct points per layer (≥ 0.05 apart
  in encoded units, picked greedily by loss), plus the selected optimum,
  plus the flat-direction profile ends; re-evaluated in the independent
  design on ≥ 1000 fresh recruiters per day; the optimum must rank first
  or within bootstrap SE of first. The pilot is excluded.
- **Flat-direction profiles (frozen 2026-10-10):** along each flat
  direction at the optimum, cut at Δloss ≤ 3.84 × max(1, L_min / 8)
  (8 = 15 rows − 7 parameters), Δloss and L_min on the χ² part only (no-bout
  penalty excluded); profile points must also meet the no-bout bound; one
  common large batch, bootstrap SE of Δloss ≤ 0.5 (else enlarge the batch
  first).

E6 (pre-registered 2026-10-09; development benchmark):
- **Ensemble:** the ranking-check survivors plus the flat-direction
  profile ends, both layers; the pilot excluded. Backstop: if a post-E6
  scan finds a comparably fitting region outside it, on a parameter E6 is
  sensitive to, E6 reruns on the widened ensemble and both are reported.
- **Means:** normal-equivalent z through t with fixed df 4
  (Welch–Satterthwaite z reported beside it); ≥ 200 colonies; |z| ≤ 2 / 3.
  **Spread:** F-test z, indicative only. **Per-ant:** omnibus Σ D z
  (`e6PerAntCompare`, 10 000 Monte Carlo draws), the four group rows for
  diagnosis.
- **Set-up:** 53 ants, 22 °C; walking × 0.781 outside the nest and the
  calibrated `nestSpeedFactor` inside (sensitivity × 0.781 everywhere,
  × 1, × 0.289); crop absorption 0 (sensitivity 0.05 /h first-order); E2
  layer L0S1c main, L0S1 alternative. A row whose verdict changes across
  the sensitivity runs is reported as "sensitive to <assumption>", not as
  a pass.
- **Directed navigation to a known source:** parameters from the
  literature, frozen in this file before any E6 run (E6's T50 has been
  inspected); own tests and invariants; run-hash check that the 1999 rows
  and E2 do not change, against a baseline at 157cd66 or later.

E2 reopening (else E2 is closed for M1 as provisional, its known
non-optimum disclosed):
- With paired seeds: (a) a between-layer difference > 1 combined SE whose
  CI excludes 0; (b) the E6 verdict differs between layers; (c) 1999
  adequacy differs between layers.
- Shared failures: drinking-time spread, through the intakeSd 0.4 profile
  point as the drinking layer (same triggers); giving up matters only if
  > 5 % of E6 food visits end in a give-up.
- Before E2 is ever called adopted: ≥ 3 recovery replicates and a
  bigger-budget refit from the profile's better point.

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

- **Additions (2026-10-09/10; details in the archive):**
  - **Mailleux et al. 2005** is **not untouched**: its abstract's findings
    shaped the traits and were compared with the model. At most a limited
    test of quantitative endpoints not yet seen, exposure disclosed.
  - **Mailleux 1999 Table 2a** is **fit** data for the colony calibration;
    Table 2b and "all recruiters leave within 20 min" are
    **development**. Simulated contact durations were inspected (with the
    fit rows' means known) when the ≥ 1 s contact rule was chosen.
  - **E6**: development benchmark (see above); the per-ant histograms and
    the TEC reference results have been computed, our colony model has
    not been judged against E6.
  - **Mailleux, Buffin, Detrain & Deneubourg 2011** (Insect. Soc. 58:559–567,
    recruitment in starved nests): **held-out** colony test, registered
    2026-10-10 night (user). Only title page read. Prior exposure: the
    Bles-thesis summary in `mailleux-rules.md` §7 (≈ 30 % of fed nestmates
    lay pheromone at 4 and 8 d, not at 1 d; nest exits rise with
    starvation independently of direct contacts); statistics on those
    findings do not count. Only its Methods section is read, after the
    model structure is frozen.
  - **Buffin, Mailleux, Detrain & Deneubourg 2011** (Insect. Soc.
    58:177–183, trophallaxis frequency and duration): **parameter and
    structure source** (user, 2026-10-10 night); read in full, so none of
    its results can serve as a test.
  - **Colony pilot fit:** its generation-0 loss at the start points was
    seen while the profile cut-off was still open (disclosed in the
    archive, 2026-10-10 night); judged uninformative.
  - **Buffin et al. 2011 and Mailleux et al. 2011:** abstract-level findings
    were relayed in the assistant's literature replies on 2026-10-10.
    These qualitative findings are development, not untouched test results;
    quantitative full-text results have not been read (Decisions log below).

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


## Results in brief
Full results, tables and the history of each step are in the archive
(§ Results so far, Next steps 1–5, Decisions log).
- **E1:** trajectory statistics shared by data and model; event-exact
  Boltzmann walker with OU speed, pauses, slope terms and homing
  (`e1-walk.json`). Off: fine-scale turning (z 10–20 at every incline, all
  walkers), speed q10 on flat ground, steep slopes. The fitting procedure
  passed its acceptance test; joint fitting recovers predictions at all
  five inclines.
- **E2:** step 3 (M_a adopted then), 3b (held-out Mailleux 2003: the trail
  decision transfers; visits and spreads fail), 3c/3d (search around
  food, L0S1c / L0S1). Open failures: drinking-time spread, within-2009
  contrasts (z up to ±4), the 2000 laying series flattened, giving-up
  times too long.
- **E6:** observation pipeline validated on the raw data; TEC baseline
  reproduced (Tier 1) and refitted through the observer (Tier 2: every
  mean |z| ≤ 1.5); per-ant distributions reject all one-caste models.
- **Colony / 1999:** first fits void (giver/perception deadlock), refits
  stopped unjudged (bout-ending bug); fixed with tests and an invariant
  suite (`test/colonyInvariants.test.ts`); wall fix and walked-path
  distance (2026-10-10 night). No valid colony fit yet.

## Open problems and backlog
- **Colony:** contact-triggered leaving (Table 2b, G3) not modelled;
  the dt dependence of contacts and timeInNest (late-signal test);
  encounters are geometric overlaps (ants brush past; redesign in the
  Plan); `leaveCropFrac`'s effect on nestmate departures (sensitivity with
  E6); load-mass constant `LOAD_MG_PER_UL` 1.08 mg/µL (0.6 M sucrose;
  E6's 1 M food ~4 % heavier, negligible).
- **E2:** see Rules in force (reopening, adoption requirements). The
  volume-estimate clipping at 0 (`Math.max(0, est)`) is an unsourced
  assumption.
- **E1 (when resumed):** data orientation ("+y uphill" assumed) and the
  10–20° tilt of the alignment axis at 20–45° (`alignY` biased low by
  ≈ cos 2·tilt); then the Bonavita 2026 held-out test on the adopted
  flat-ground walker.
- **E6:** our bouts end when food stops flowing; the observer sees
  mandible contact.
- **Not yet done from the original M1 plan:** a grid-spacing convergence
  test for the pheromone field; the trail *response* model; repellent
  channel sensing; nest cue fields and per-ant view memories (field
  nests); sensitivity analysis; the three.js renderer. State cloning
  exists (`ColonySim.clone`, tested); general save/restore does not.
- **Draft species:** the seven non-Lasius files use v1-style provenance;
  unvalidated drafts.

## Milestones
- **M1 (current):** *L. niger* reproduces food collection and food sharing
  (E1, E2, E6) using only local information, with conserved resources,
  uncertainty estimates, stability under time-step changes and explicit
  held-out tests. **Expected end state on current data:** calibrated and
  stress-tested with failures disclosed; colony validation awaits
  independent held-out data.
- **M2+:** other species to the M1 standard, one at a time.
- **Later:** emergent excavation, tunnel traffic and occupancy, validated
  aggregation for very large colonies (`docs/DESIGN.md`).

## Decisions log
Earlier entries: the archive. Newest last.

**2026-10-10 night — STATUS split and scripts archive (user request).**
- The full previous STATUS moved verbatim (with `git mv`) to
  `docs/archive/STATUS-2026-10-07-to-10.md`. This file was rewritten
  around the current state, the agreed plan and a **Rules in force**
  section that collects the rules currently applied (each traceable to a
  dated archive entry). Evidence policy, contamination log and criteria
  carried over verbatim, with the 2026-10-09/10 contamination additions
  summarised.
- 20 finished one-off scripts and superseded fits moved to
  `scripts/archive/` (index in its README; imports fixed; they still
  type-check and run). Provenance strings and comments that named them
  were updated (`lasiusM1.ts`, `e1TurnChecks.ts`), as were CLAUDE.md and
  README.

**2026-10-10 night — late-signal test: not confirmed** (`diagDtHandshake.ts`,
80 paired recruiters per start point, 4 d; `logs/diag-handshake-d4.log`).
- What the handshake lag would lengthen barely moves at dt 0.1 vs 0.025:
  waiting in unanswered invitations +0.50 ± 0.27 s (start 1) / −0.01 ±
  0.23 s (start 2); dry bout starts +0.40 ± 0.19 / +0.03 ± 0.18; giving
  with flow −0.34 ± 1.05 / +0.05 ± 0.21 s. At most ≈ 0.5 s of a ≈ 5 s
  (1 SE_data) timeInNest shift. Contacts ≥ 1 s: +0.24 ± 0.31 /
  −0.29 ± 0.99.
- Resting (+10.4 ± 4.9 / −3.5 ± 2.2 s) and the whole stay (+7.9 ± 11.7 /
  −8.1 ± 4.3 s) differ in sign between start points: no resolved effect.
  At n 80 the test cannot resolve a 2–5 s stay shift.
- **Reading:** pilot condition 5 is not triggered (no confirmed cause, so
  there is nothing to fix before the pilot-point gate). The timeInNest and
  contacts dt dependence remains **unexplained**. The gate at the pilot
  optimum measures it where it matters. If dt 0.1 fails there, the refits
  run at the coarsest passing dt (0.025 at worst), and the encounter
  redesign (Plan 4) is the next suspect, since it replaces the meeting
  dynamics. A larger decomposition (n ≈ 1600, on the box after the
  pilot) runs only if the pilot-point gate fails on these rows.

**2026-10-10 night — user review of the late-signal result: wording, two additions, one caution (logged before acting).**
- **Stronger wording (replaces "not confirmed" above):** the handshake
  lag is **ruled out as the main cause** of the timeInNest dt shift. The
  parts it would lengthen were measured precisely (start 1: unanswered
  invitations +0.50 ± 0.27 s, dry starts +0.40 ± 0.19) and explain at most
  ≈ 0.5 s of a ≈ 5 s shift. Nothing is read into the n 80 whole-stay or
  resting differences: start 2's −8.1 ± 4.3 s points the opposite way from
  the n 1600 gate (+0.39 SE), and start 1's resting +10.4 ± 4.9 s is as
  likely noise.
- **Code check (user):** every random switch in the nest policy uses the
  exact per-step probability 1 − e^(−rate·dt) (`rng.hazard`), so
  step-scaled probabilities are ruled out. What remains dt-dependent is
  contact geometry checked once per step: detection, a former partner
  becoming eligible again only once contact is lost, and partner choice
  each step. That is the meeting dynamics the redesign would replace.
- **Addition 1 — is 0.025 itself converged?** If dt 0.1 and 0.05 both
  fail at the pilot point, run **0.025 vs 0.0125** on the failing rows
  (contacts, timeInNest), same equivalence rule, before any refit. If that
  fails too, a smaller step does not fix it: back to finding the cause
  (decomposition, redesign) before any refit.
- **Addition 2 — decomposition, pre-registered now, run at the pilot
  point** (n 1600 per day per level, paired seeds, same levels as the
  gate; per-row paired mean differences with SE). Parts of the stay:
  (a) **stay** = timeInNest; (b) **unload** = entry → first step with
  crop ≤ `giveFrac` × capacity, censored at the stay; (c) **after
  unload** = stay − unload; (d) **bout time** = time in give or receive
  mode; (e) **give-wait** = give mode without flow; (f) **rest** = time in
  rest mode; (g) **contacts ≥ 1 s** (the fit row). It is run whenever the
  gate at the pilot point fails on contacts or timeInNest. It only
  locates the shift, and does not decide anything by itself.
- **Caution on the redesign (Plan 4):** its case is narrower. The
  late-signal argument is gone. What remains is the ≥ 1 s contact rule
  (chosen after seeing simulated durations) and whether the pilot needs
  extreme parameter values. If the dt effect disappears after a redesign,
  it is logged as **removed, not explained**, unless the decomposition
  first locates it in the meeting dynamics.
- **Decomposition implemented** (not yet run at a real point):
  `M1999Options.decompose` → `M1999Recruiter.parts` (unload, unloaded,
  bout, giveWait, rest; recorded by the observer, nothing else changes,
  test in `test/m1999.test.ts`); `scripts/decompM1999.ts [--fit f]
  [--levels 0.1,0.025] [--n 1600]` uses the dt gate's seeds and design, so
  it decomposes exactly the recruiters the gate compares; it prints paired
  differences only (no means, as the gate). It was smoke-tested at n 8 on
  the start points, mechanics only, not a result.
- **Disclosure (provenance):** the box sources were synced (3cc9be1:
  the inert `decompose` option, shown by test not to change results) while
  the pilot was running from d8090cc. The running process keeps its
  loaded code, but `fitM1999.ts` computed provenance (simHash, commit) at
  **write** time, so the pilot file will record the 3cc9be1 sources.
  Fixed for future runs: provenance is taken at launch. **From now on:
  no syncing of `src/` to the box while a run is going.**

**2026-10-10 night — pilot, start 0 finished: σ diverged, parameters at bounds (diagnostic reading; no loss is reported as fit quality, condition 1).**
- Seen (`logs/pilot-main.log`, after the cut-off was frozen): start 0 ran
  60 generations; CMA-ES σ grew from 0.97 to 285. The averaged mean drifted
  (encoded units) −64 nestSpeedFactor, +71 returnRate, +99 shareRate, −276
  shareEnd, +17 receiveReserve, −37 reserveSd, +1.5 density. Start 1 has
  begun.
- Reading: the bounded transform is logistic, so far from 0 a parameter
  sits at its bound and the loss is flat; CMA-ES then random-walks with
  growing σ. Start 0 pinned **nestSpeedFactor at its lower bound (0.02),
  returnRate at its upper bound (1 /s), shareRate at its upper bound,
  shareEnd at its lower bound (1/1200 /s), reserveSd at its lower bound**.
  That is the pattern of the void first fits (returnRate max, shareEnd
  min), and the "extreme values" input to Plan 4 (encounter redesign).
  Caveats: start 0 only; with σ ≈ 285 the averaged mean is unreliable
  beyond "at a bound".
- **Fitting-method issue** (relevant to the recovery test, Plan 3): on
  the logistic plateau σ diverges, and "mean of the last 30 generation
  means" becomes meaningless. Candidates, to decide after the pilot: σ cap
  or restart on divergence, bounds handled by reflection or penalty
  instead of saturation, and a convergence flag in the fit file.
- No action until the pilot finishes (start 1 and the IPOP restart).

**2026-10-10 night — papers supplied by the user; CMA-ES fix adopted as the plan (user: "I like that").**
- **Read in full (methods only, no ant data):**
  - Sakamoto & Akimoto 2017, Trans. Jpn. Soc. Evol. Comput. 8(2):23–35
    (Mod-BCH box-constraint handling for CMA-ES).
  - Auger & Hansen 2005, CEC (IPOP-CMA-ES restart criteria; bounds by
    penalty; flat regions as needle-in-a-haystack).
  - Carrella 2021, JASSS 24(2):7 ("No free lunch when estimating
    simulation parameters").
- **Adopted plan for the fitting method (before the recovery test, Plan 3):**
  (1) replace the logistic bound transform in CMA-ES with Mod-BCH:
  search in the box coordinates, evaluate an infeasible point at its
  clipped point, plus the penalty (1/n) Σ γᵢ (xᵢ − x_feasᵢ)², γ adapted
  from the normalised IQR of recent losses (trimmed median, uniform
  decrease); unit tests on the paper's bounded sphere / exponential cases
  with the optimum on a bound; (2) stop and restart on σ divergence, and
  record per run in the fit file whether it converged; (3) check whether
  the failed E2 L0S1c recovery (`boutFastUl` ×9.1) shows the same
  plateau signature. Implementation waits until the pilot finishes (the
  pilot's own reading uses the current method).
- **Proposal from Carrella (not adopted; for the user):** a
  reference-table identifiability check. Draw parameter sets over the
  whole box, simulate the 15 rows for each, and predict each parameter
  from the rows by cross-validated regression (random forest / GAM).
  Performance < 0.3 for every method → the parameter is not identified.
  This is global, unlike the local Jacobian whose noise floor left 5–6 of
  7 directions undecided. The same runs serve as the global sensitivity
  analysis and as a cheap recovery test for any number of synthetic
  targets. Cost ≈ one fit (≈ 1000 draws).
- **Two in-nest *L. niger* data papers (abstract-level findings already
  exposed; roles to be set by the user before further results are read):**
  - Buffin, Mailleux, Detrain & Deneubourg 2011, Insect. Soc. 58:177–183,
    "Trophallaxis in *Lasius niger*: a variable frequency and constant
    duration for three food types". Listed in `lasius-niger.md` as an
    evidence gap (trophallaxis durations). **Exposure in the assistant's
    earlier reply:** the abstract says food type changed exchange frequency
    but not duration, and the per-time stopping probability was constant.
    No numerical duration distribution or transfer rates were read; those
    remain an evidence gap.
  - Mailleux, Buffin, Detrain & Deneubourg 2011, Insect. Soc.
    58:559–567, "Recruitment in starved nests: the role of direct and
    indirect interactions between scouts and nestmates in *L. niger*".
    **Prior exposure (now registered):** a second-hand summary (Bles
    thesis) in `mailleux-rules.md` §7: ≈ 30 % of fed nestmates lay
    pheromone at 4 and 8 d, not at 1 d; nest exits rise with starvation
    independently of direct contacts. The assistant's earlier reply also
    relayed the original abstract's qualitative claim that prior antennal
    or trophallactic contact did not affect nest exits and that a chemical
    signal was implicated. Statistics on those findings count as
    contaminated in any test; further full-text results remain unread.
- **User (2026-10-10 night): roles of both 2011 papers undecided**; they
  stay unread beyond the title pages.
- **Pilot start 1 finished (22:18):** σ again grew instead of shrinking
  (peak ≈ 37, final 16; start 0: 285). Drift (encoded): **shareEnd −38
  (pinned at its lower bound again)**; the others moved little (−1.2
  nestSpeedFactor, +2.9 returnRate, −0.7 shareRate, +0.35 receiveReserve,
  −1.7 reserveSd, −1.8 density). Not converged. The IPOP restart (λ 18)
  started from the better run. No loss is reported as fit quality
  (condition 1).

**2026-10-10 night — user decisions: roles of the 2011 papers; noise handling (logged before acting).**
- **Buffin et al. 2011 → parameter and structure source**, read in full
  now, before the redesign decision (Plan 4). What is taken from it is
  logged here; its frequencies are recorded as seen.
- **Mailleux et al. 2011 → held-out colony test** (registered in the
  contamination log above). Methods only, after the model structure is
  frozen, to decide which of its measures the model can produce.
- **Noise handling decided after the recovery test.** First the bound fix
  (Mod-BCH, divergence restart, convergence flag). Only if recovery shows
  noise-limited estimates: re-evaluation (more recruiters per evaluation,
  adaptive as in RA-CMA-ES; Uchida, Nishihara & Shirakawa 2024, GECCO,
  arXiv:2405.11471, abstract read) by default, population-size
  adaptation (PSA-CMA-ES, Nishida & Akimoto; abstract supplied by the
  user) as the alternative. Reason: our loss noise is roughly additive
  near the optimum and roughly multiplicative far from it; under
  multiplicative noise, population-size adaptation can miss the true
  optimum, while re-evaluation does not (Uchida et al.).

**2026-10-10 night — Buffin et al. 2011 read (parameter source); what we take; proposal.**
Extraction in `docs/research/buffin2011.md`.
- **Seen:** set-up (4-d starved; 20 workers fed 2 h on 1 M sucrose,
  protein or melezitose, plus 20 starved, in a 5 cm dish, 30 min);
  trophallaxis = mandible contact with the donor's labrum > 3 s, first
  receiver only. **Durations are exponential** (a constant stopping hazard,
  independent of elapsed time and food type, dependent on hunger state).
  Sucrose fed→starved: 29 ± 28 s, hazard 0.039 /s (0.037–0.041), n 66;
  fed→fed 0.034; starved→starved 0.058. Frequencies (food- and
  state-dependent, constant initiation rate) recorded as seen, not used.
  Table 1's printed confidence bounds are inconsistent (paper error);
  Table 2 is used.
- **Structure taken:** bouts end at a constant hazard. This is our
  `shareEnd` structure, so bout ending needs **no redesign**.
- **Conflict with the pilot:** both pilot runs pinned `shareEnd` at
  1/1200 s ≈ 0.0008 /s, ≈ 45× below Buffin's observed hazard. The 1999 fit
  buys bouts that independent data do not show. This points Plan 4 at bout
  **initiation and encounter dynamics**, not at bout ending.
- **Proposal (Claude; for the user):** `shareEnd` leaves the free set
  (k = 6 for the refits). It is set from a small **Buffin-dish
  calibration**: the nest chamber with 40 workers (≈ 2 /cm², as the dish),
  20 with full crops of 1 M sucrose and 20 starved, 4-d reserves, 30 min,
  a trophallaxis observer as Buffin (mandible contact > 3 s, first
  receiver), and `shareEnd` chosen so the observed fed→starved ending
  hazard is 0.039 /s. The model's other bout endings add to the observed
  hazard, so `shareEnd` ≤ 0.039. Provenance: derived (Buffin 2011, Table
  2). Sensitivity at 0.037 / 0.041. Until the calibration exists, 0.039 /s
  is the interim value (an upper bound).

**2026-10-10 night — pilot finished; condition 4 met; gate at the pilot point.**
- **Pilot (22:26, 4040 s, 2205 evaluations):** starts 0 and 1 diverged
  (σ 285 / 16). The IPOP restart converged (σ 0.21, drift ≤ 0.17 encoded).
  Point: nestSpeedFactor 0.044, returnRate 0.85 /s, shareRate 0.0123
  µL/s, shareEnd 1/1200 (at bound), receiveReserve 0.933, reserveSd 0.124,
  density 0.495 /cm². **Caveat:** the restart started from start 1's end,
  where shareEnd sat at −41.9 encoded (on the logistic plateau); with a
  starting SD of 0.3 it could not return. So "shareEnd at bound" is
  inherited from start 1's drift. The direction (low shareEnd) is
  consistent across both starts; that the bound itself is needed is not
  shown. File copied back (`data/fits/colony-m1999-main-shared-pilot.json`,
  log `logs/pilot-main.log`). No loss reported as fit quality.
- **Condition 4** (`scripts/checkPilotM1999.ts`, pilot seed namespace,
  n 240 per day, shared design, dt 0.025, warm-up 900): 1-d no-bout
  14.2 % (limit 21.8 %), 4 d 4.6 %, 8 d 3.3 %; no row beyond |fitZ| 5 →
  **usable as gate point.** `reportM1999.ts` now passes the fit's dt (it
  re-ran every fit at dt 0.1, a bug for non-default dt).
- **dt 0.1 vs 0.025 at the pilot point (n 1600): not shown equivalent, but
  no row shifts by more than 0.30 SE_data.** Shifts with CIs excluding 0:
  contacts 1 d / 8 d −0.27, trophTotal 8 d −0.19, contactsBefore 1 d
  −0.16. Failures are CIs slightly wider than ±0.5 (timeInNest 4 d / 8 d,
  distance, contacts 4 d, contactsBefore 4 d). At the start points the
  shifts were 1–4 SE.
- **Warm-up 300 vs 900: a real effect at 1 d** (timeInNest +0.45, CI
  0.25–0.64; distance +0.65, CI 0.24–1.11); other rows within ±0.31. So
  warm-up 900 (the pilot's) stays; 300 is out.
- **Launched (pre-registered branches, plus one check by the user's
  0.025-vs-0.0125 argument applied to warm-up):** dt 0.05 vs 0.025;
  decomposition dt 0.1 vs 0.025 (the gate failed on timeInNest and
  contacts); warm-up 900 vs 1800.

**2026-10-10 night — follow-up runs at the pilot point (7-parameter model; a record only, see below).**
- dt 0.05 vs 0.025: not shown equivalent; no systematic shift beyond 0.43
  SE (distance 1 d, CI includes 0); failures are wide CIs (distance).
- Decomposition dt 0.1 vs 0.025 (n 1600): stay −1.7 / −0.9 / −2.2 s
  (± 1.3); the shift sits in **after unload** (−1.5 / −0.75 / −1.85 ± 0.5
  s); contacts ≥ 1 s −0.25 / −0.09 / −0.17 (± 0.08); give-wait −0.04 s;
  bout time and rest within 2 SE. So leaving after unloading starts
  sooner at dt 0.1 (returnRate 0.85 /s here).
- Warm-up 900 vs 1800: distance 1 d +0.40 (CI 0.03–0.77), contacts 8 d
  +0.23 (CI 0.03–0.45); not shown equivalent. 900 s is not settled for
  distance at this point (slow nest walkers, nestSpeedFactor 0.044).

**2026-10-10 night — user review of the Buffin proposal: four changes and three smaller points (adopted; logged before acting).**
1. **Pair ending rate = 2 × shareEnd** (verified: `lasiusNestWorker.ts`
   line 178, each partner draws `rng.hazard(p.shareEnd, dt)`; the other
   then sees `partnerOut`). Matching Buffin's 0.039 /s needs **shareEnd =
   0.0195 /s per ant** (kept per ant, symmetric; it extends to
   per-partner hunger dependence). The pilot's 1/1200 per ant is a pair
   rate of 1/600: **≈ 23× below Buffin, not 45×** (correction).
2. **Uncertainty:** with 66 exponential bouts, SE(p) ≈ p/√n ≈ 0.0048,
   exact 95 % ≈ 0.030–0.048 (Buffin's 0.037–0.041 likely comes from
   regressing log survival, treating curve points as independent and
   pooling 16 replicates). Sensitivity: pair rate 0.030 and 0.048
   (shareEnd 0.015 / 0.024). Context differences (1 M vs 0.6 M sucrose,
   ad-lib donors, dish vs nest) are probably larger and are disclosed.
3. **Bout diagnostic at the pilot optimum (pre-registered here, under pilot
   condition 1; not judged, not compared with the 1999 rows):** for the
   recruiter's bouts and for all bouts, durations of bouts > 3 s, the
   ending cause of each bout (donor depleted, receiver satiated, stall,
   random hazard, other), and SD/mean of the durations. Arithmetic
   (user): at shareRate 0.0123 µL/s and receiveReserve 0.93, a near-full
   recruiter needs ≈ 130 s to give 1.6 µL, and at a pair rate of 1/600 /s
   only ≈ 1 bout in 5 ends at random within that time. So most bouts may
   end by depletion, satiation or stall, with bunched (not exponential)
   durations. Total trophallaxis 56–66 s is about two Buffin-length bouts.
   If confirmed, the conflict with Buffin is in the **shape** of the
   duration distribution, which points at shareRate and the volume and
   hunger rules, not at bout initiation. **Plan 4 is decided on this
   evidence**, not on where shareEnd stopped.
4. **shareEnd is set directly** (pair rate = Buffin's), not tuned in a
   dish (dish-tuning would depend on the still-free shareRate; Buffin's
   exponential shape itself says duration-dependent endings are rare
   there). **The dish becomes a check at each optimum:** a 3 s-threshold
   observer estimates p as Buffin did (log-survival slope) and by maximum
   likelihood; pass if consistent with 0.039 and SD ≈ mean. If other
   endings are common at the fitted shareRate, Buffin's fed→starved
   durations become a **fit row in the joint fit** instead.
   "First receiver only" matters only if donors can feed several
   receivers at once (they cannot now).
- **Hunger state:** Buffin's rate depends on it; we use one constant. Fine
  for fed→starved at 4 d; the 1-d and 8-d receivers of 1999 are an
  extrapolation (disclosed). Buffin's fed→fed 0.034 vs starved→starved
  0.058 suggests a moderate effect.
- **k = 7 → 6:** the frozen profile cut becomes 3.84 × max(1, L_min / 9)
  (15 rows − 6 parameters); free set: nestSpeedFactor, returnRate,
  shareRate, receiveReserve, reserveSd, density.
- **The pilot cannot be the gate point for the 6-parameter model** (its
  optimum is the 7-parameter model's). Its condition-4 result and the gate
  results above describe the old model only. **A new pilot with shareEnd
  fixed runs after the Mod-BCH bound fix.**

**2026-10-10 night — Mod-BCH and the 6-parameter set-up implemented; new pilot pre-registered.**
- **CMA-ES:** Mod-BCH box constraints (option `bounds`), `tolUpSigma`
  divergence stop, `stopReason` per run; tests on Sakamoto & Akimoto's
  bounded sphere and exponential cases (optimum on the boundary;
  objective never sees an infeasible point). Unchanged without bounds
  (existing tests pass).
- **shareEnd = 0.0195 /s per ant** in `lasiusM1.ts` (derived, Buffin 2011;
  pair rate 0.039; sensitivity 0.015 / 0.024). This also changes the E6
  colony default (provisional 1/60 before).
- `fitM1999.ts --bch --fix shareEnd`: box coordinates [0, 4] per free
  parameter (log-linear where log-scaled), Mod-BCH, tolUpSigma 20; per run
  the stop reason, convergence flag and γ; `fixed` recorded. Tagged runs
  now draw seeds with a tag-specific key (0x9170 kept for 'pilot').
- **Bout diagnostic, 1 d (pilot-1 point, 200 recruiters):** 97 % of the
  recruiter's bouts > 3 s end by **donor depletion**; durations > 3 s mean
  37 s, **SD/mean 0.52** (exponential ≈ 1; Buffin ≈ 1); ≈ 1 bout per
  recruiter. This confirms the user's arithmetic: the conflict with Buffin
  is in the shape (depletion-ended bouts). Days 4 and 8 still running.
- **New pilot, pre-registered (pilot conditions 1–6 apply unchanged):**
  `fitM1999.ts --layer main --dt 0.025 --warmup 900 --bch --fix shareEnd
  --tag pilot2 --gens 60`, k = 6. Launched before days 4 and 8 of the bout
  diagnostic finish (user: use the idle box). If the bout evidence leads
  to a model change under Plan 4, pilot2 is void and rerun.

**2026-10-10 night — bout diagnostic complete (pilot-1 point, 200 recruiters per day); Plan 4 decided on it (Claude, as the user asked).**
- Recruiter bouts > 3 s: 1 d mean 37 s, SD/mean 0.52; 4 d 52 s, 0.40; 8 d
  51 s, 0.47. **Ending causes: donor depleted 97 / 97 / 92 %**, receiver
  satiated 0 %, stalled 0 %, random or other 3 / 3 / 8 %. ≈ 1.0–1.05
  recruiter bouts per recruiter. All bouts in the nest show the same
  pattern. (Box copies of days 4 and 8 were launched before the local run
  finished; redundant, same seeds.)
- **Reading:** bouts start readily (one per recruiter, no stalls,
  give-wait ≈ 0) and end when the recruiter's crop empties, so durations
  are bunched rather than exponential. The conflict with Buffin is in the
  duration *shape*, produced by depletion-ended bouts at a low pair ending
  rate. Nothing here implicates bout initiation or encounter dynamics.
- **Plan 4 decision: no encounter redesign now.** With shareEnd fixed at
  Buffin's rate (pilot2), most bouts should end at random (pair mean ≈
  26 s) before the crop empties. Unloading then needs more bouts, so the
  fit must reach the 1999 totals through shareRate and re-initiation. Two
  checks decide whether the volume and hunger rules need a change:
  pilot2's fit (rows, bounds) and the Buffin-dish check at its optimum
  (log-survival slope and ML rate consistent with 0.039, SD/mean ≈ 1).
  The ≥ 1 s contact rule remains a separate, observer-level reason for a
  stop-and-antennate addition; it is not decided here.

**2026-10-10 night — user review of the bout diagnostic: corrections (logged before acting).**
- **Correction 1 (wording above):** the diagnostic confirms the
  *conclusion* (depletion ends most bouts, bunched durations), but the
  user's arithmetic's **premise was wrong**: recruiters do not arrive near
  full (1.6 µL over ≈ 130 s). Mean bouts of 37 s (1 d) and 52 s (4 / 8 d) at
  0.0123 µL/s mean ≈ 0.45–0.65 µL given per recruiter.
- **Correction 2 (Plan 4):** "no encounter redesign now" is replaced by
  **deferred to pilot2's evidence**. At a pair ending rate of 0.039 /s
  (mean 26 s), ≈ 75–85 % of recruiter bouts should end at random before
  depletion, so a recruiter needs ≈ 2 bouts (consistent with 56–66 s of
  total trophallaxis). The fit then rests on bout *initiation*: finding a
  second partner, the part-after-a-bout rule. That is what Plan 4 is about.
  Inputs at pilot2's optimum: (a) whether it still needs extreme values;
  (b) the bout diagnostic rerun there; (c) the dish check.
- **Other extreme values at the pilot-1 point (to watch in pilot2):**
  returnRate 0.85 /s (top of [1/1200, 1]; recruiter leaves ≈ 1 s after
  unloading, the phase where the dt shift sat); nestSpeedFactor 0.044
  (near its floor 0.02; in-nest walking ≈ 1.5–2.4 mm/s depending on the
  baseline speed taken); receiveReserve 0.93 (almost every nestmate
  counts as hungry). A published in-nest walking speed (parallel track b)
  could fix nestSpeedFactor as Buffin fixed shareEnd.
- **Onward food flow (user):** "all bouts" was only ≈ 8–14 % above the
  recruiter's own bouts. **Likely partly an artefact:** the diagnostic
  counts only bouts that end during the recruiter's stay, and receivers
  would pass food on mostly afterwards. Check before the structure is
  frozen: `diagBoutsM1999.ts --follow s` keeps counting for s seconds after
  the recruiter leaves and reports onward bouts (donor = a nestmate that
  received from the recruiter).
- **Dish check, pre-registered pass rule** (`scripts/checkDishBuffin.ts`,
  run at each optimum, 200 dishes): |z| ≤ 2 for the ML ending rate vs 0.039
  (SE 0.039/√66 ⊕ the simulation's bootstrap SE over dishes), and |z| ≤ 2
  for SD/mean vs 28/29 (data SE from a parametric bootstrap of 66
  shifted-exponential durations ⊕ the simulation's SE). Buffin's
  log-survival slope is reported beside it. Disclosed: donors' reserves
  kept at the 4-d level (2 h of feeding may have refilled them); 46
  workers in the nest chamber (≈ 2.0 /cm², as the dish). **Mechanics run
  at the pilot-1 point (5 dishes, old model, development only):** ML rate
  0.035 /s (z −0.8), slope 0.047, SD/mean 0.56 (z −3.9) → fails on shape,
  as the bout diagnostic predicted.
