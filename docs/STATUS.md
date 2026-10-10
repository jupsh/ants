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
  - **Colony pilot fit:** its generation-0 loss at the start points was
    seen while the profile cut-off was still open (disclosed in the
    archive, 2026-10-10 night); judged uninformative.

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
