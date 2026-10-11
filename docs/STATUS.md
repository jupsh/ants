# Project status

_Last updated: 2026-10-11 (session 4: plan review and STATUS cleanup; step 3 done — branch R ≤ 2, in-nest motion ≈ 10× slower than arena; step 4 next). Keep this file current: update it whenever a step starts or finishes._

Everything up to 2026-10-10 evening (session notes, step results, the full
decisions log of about 4,500 lines) is in
[`archive/STATUS-2026-10-07-to-10.md`](archive/STATUS-2026-10-07-to-10.md)
("the archive"); the 2026-10-10 night entries (pilots, Buffin, Plan 4
options A and B, the B diagnostic, choosing Stroeymeyt) are in
[`archive/STATUS-2026-10-10-night.md`](archive/STATUS-2026-10-10-night.md)
("the night archive"). This file keeps the current state, the plan, the
**rules in force**, the evidence policy and open problems. New decisions
go in the Decisions log at the end; when this file passes about 600 lines,
archive again.

## ▶ RESUME HERE

**State (2026-10-11).** Milestone M1, *Lasius niger* as the single
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
- **Colony / Mailleux 1999 calibration: in progress, no valid colony fit
  yet.** The pilots (night archive) showed that with bouts ending at
  Buffin's rate the 1999 fit pins parameters at bounds (option A,
  refractory parting, fails the adoption rule), and that arena-sourced
  stop-and-go motion (option B) walks ≥ 12× the 1999 distance with
  20–75× the contacts. So in-nest motion now comes from in-nest data,
  Stroeymeyt et al. 2018 (*L. niger*, 22 tracked fit colonies), and 1999
  is refitted afterwards with motion fixed. Steps 1 (fetch, scale) and 2
  (statistics code, `src/sim/analysis/inNest.ts`, tested) are done; all
  22 fit-colony tracks are in (`data/stroeymeyt2018/`, 1.7 GB,
  gzip-verified). Rows, definitions and the colony split are frozen
  (Rules in force).
  **Step 3 done (2026-10-11):** the branch rule gives R ≤ 2 (1.5 / 1.6):
  Stroeymeyt foragers' short stays move like the 1999 recruiter. In the
  nest, ants are still ≈ 95 % of the time and move at ≈ 0.27 cm/s, ≈ 10×
  slower than option B's arena values (Decisions log, last entry).
  **Next:** step 4, the Stroeymeyt nest in the simulation, its frame
  observer and the cost timing; in parallel, our own contact observer
  (approved 2026-10-11). The box is destroyed; none is rented before step
  4 has been timed locally.
- **E6 (Bles et al. 2022): development benchmark, not validation.** Its
  judging rule is pre-registered (Rules in force); it runs only after an
  adequate 1999 fit and the fit-protection checks, or, if the stopping
  rule ends the 1999 work without one, on the best step-5 fit, disclosed
  as such (user, 2026-10-11).
- **M1's honest end state (agreed 2026-10-10 night):** *calibrated and
  stress-tested, with failures disclosed*, not "validated". Validating the
  colony model needs independent held-out data; finding it is a work item
  now (Plan, parallel track).

### Plan (agreed 2026-10-10 late night; steps 3–5 revised 2026-10-11)
Plan 4's pilot steps are done: A failed the adoption rule, and B with
arena-sourced motion cannot reach the 1999 distance and contact rows
(night archive). In-nest motion now comes from in-nest data (Stroeymeyt
et al. 2018, *L. niger*), and 1999 is fitted afterwards with motion fixed.
Pilot conditions (a tool, not a result; namespaced seeds) still apply to
any pilot.
1. ~~**Data in**~~ **done** (2026-10-10 night / 2026-10-11): metadata and
   the 22 main-experiment PreTreatment tracks in `data/stroeymeyt2018/`
   (fetched by range requests; no held-out file downloaded); scale
   0.0229659 mm/px from the authors' code.
2. ~~**Statistics code before data**~~ **done:** `src/sim/analysis/inNest.ts`
   (rows 1–3, 5, noise estimate), tested on synthetic colonies; reducer
   `scripts/stroeymeytRows.ts`; additions (2026-10-11): moving-only
   speed, short-stay speed, noise floor, per-ant spreads.
3. ~~**Rows on the 22 fit colonies**~~ **done 2026-10-11: R ≤ 2 in
   both phases** (`data/reference/stroeymeyt2018-fit-rows.json`).
   **Rows on the 22 fit colonies:** a targets module with roles, light
   and dark phases separately, colony-block SE. The **branch rule**
   (Rules in force, 2026-10-11) compares like with like: whole-stay speed
   of Stroeymeyt foragers' short stays against the 1999 recruiter's
   (distance / timeInNest ≈ 0.07 cm/s), not colony-wide speed against the
   0.4 cm/s outside-trophallaxis figure. The branch never changes step 4;
   it only decides whether a recruiter-specific change is considered
   before step 5.
4. **Replace B's in-nest motion:** build the Stroeymeyt nest set-up
   (70 × 40 × 6 mm nest, hole, foraging area with sugar water, each
   colony's own size; 26 °C light / 22 °C dark). Fit in-nest speed,
   stationary fraction and run lengths to rows 2–3 (provenance: fitted,
   Stroeymeyt fit colonies); row 4 (contacts vs density) once the contact
   observer is validated; row 1 (forager stays) as a check. Per-ant
   activity trait if the spread rule asks for it; body exclusion only if
   contacts vs density demands it. **Cost:** simulate short windows per
   colony and phase, not 24 h, after checking they give the same rows;
   time it locally first (Rules in force, step-4 cost).
5. **Back to Mailleux 1999:** motion fixed from step 4; refit only the
   trophallaxis parameters (returnRate, shareRate, receiveReserve,
   reserveSd; shareEnd stays at Buffin's rate), with 1999 nest density
   from the literature if available, else free. Distance and contacts stay
   fit rows but no motion parameter is free, so they test transfer.
   Contacts under B3 (≥ 0.04 s), ≥ 1 s as sensitivity. Same adoption rule
   (Rules in force). A new box is rented for this. **Stopping rule
   (2026-10-11):** this is the last model-revision round driven by the
   1999 rows in M1. If the step-5 fit is not adequate, the failing rows
   are reported as a transfer failure and the plan continues at step 9's
   Stroeymeyt held-out test; only bug fixes (code shown wrong by a test or
   invariant) reopen the 1999 fit.
6. **Gate at the optimum** (dt, warm-up, identifiability; replicate
   Jacobian for the noise floor); the flat-direction rule sets the free
   set. **Recovery** (3 replicates) before the full refits.
7. **Refits**, both layers, larger budget, shared warm-ups (4 per nest),
   debiased objective; **judging** on fresh seeds (adequacy rule).
8. **Fit protection** (gates E6): ranking check; convergence gate and
   identifiability at the optimum; flat-direction profiles.
9. **Held-out tests:** the Stroeymeyt age-experiment colonies (rows 1–4,
   unopened until then); then E6 preparation (ensemble pre-registered;
   directed navigation as its own logged addition; `leaveCropFrac`
   sensitivity) and the **E6 run** (development benchmark, pre-registered
   rule).
10. **After or alongside E6, sized by it:** full-range 1-D scans at the
    optimum; 5 synthetic recovery fits at the real n; the E2 backlog only
    if a reopening trigger fires.
- **Main risk:** Stroeymeyt colonies are ≈ 10× smaller than 1999's and
  have ad-libitum sugar. If the motion does not transfer in step 5, that
  is a finding to disclose, not to fit away (stopping rule).
- **Parallel track:** (a) candidate **held-out colony data** (in-nest
  trophallaxis, recruitment, contacts; other labs, ideally *Lasius*);
  (b) **literature values to fix in-nest parameters** (1999 nest density
  from colony and nest size, trophallaxis flow rate for `shareRate`,
  antennation durations), so fewer directions are flat. E6 must not be
  used to fix anything.
- **Box:** destroyed by the user (2026-10-10 night) after its data were
  archived in `logs/box-2026-10-10/`. Rented for step 5, or earlier only
  if timing shows step 4's fit would take more than one night locally.

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
  one nestmate lasting ~~≥ 1 s~~ **≥ 0.04 s (B3, approved 2026-10-10
  night; Depickère's video precision, chosen with the model in view but
  without looking at simulated durations under B); ≥ 1 s is a
  sensitivity** (it was chosen after seeing simulated durations), no gap
  merging; distance = path walked during the stay
  (Σ `stepLen`; disclosed: replaces per-step chords, which depended on dt).
- **Model choices (estimated, not fitted):** `giveUpTime` 120 s;
  `leaveCropFrac` 0.05; `cropFullFrac` 0.98; `LOAD_MG_PER_UL` 1.08;
  `partRefractory` 5 s (option A, still the default; sensitivity 2 / 10 s).
- **Derived:** `shareEnd` 0.0195 /s per ant (pair rate 0.039 /s, Buffin
  et al. 2011 Table 2; sensitivity 0.015 / 0.024). In-nest motion: from
  step 4 (Stroeymeyt fit colonies), replacing `nestSpeedFactor` and
  option B's arena values.
- **Free:** ~~(k = 7) nestSpeedFactor, returnRate, shareRate, shareEnd,
  receiveReserve, reserveSd, 1999-only density~~ (k = 6 after shareEnd was
  derived, k = 5 under B; night archive). **From step 5 (2026-10-11):**
  returnRate, shareRate, receiveReserve, reserveSd, plus 1999-only density
  unless the literature fixes it (k = 4 or 5). The flat-direction rule may
  fix some before the refits.
- **Adoption rule** (fixed 2026-10-10 night): no free parameter at or
  within 5 % of its box ends; condition 4 (no row beyond |fitZ| 5, no-bout
  bound); the **Buffin dish check** (`checkDishBuffin.ts`, 200 dishes):
  |z| ≤ 2 for the ML bout-ending rate vs 0.039 /s and for SD/mean vs
  28/29.
- **Pilot conditions** (archive, 2026-10-10 night, "pilot fit: APPROVED
  with conditions"): a pilot is a tool, never judged, adopted, ranked or
  in the E6 ensemble, with seeds namespaced apart and its loss never
  reported as fit quality (1); it is usable as a gate point only if the
  1-d no-bout fraction is ≤ 2 × `M1999_NO_BOUT_MAX` and no row has
  |fitZ| > 5 (4).
- **Fit:** CMA-ES, debiased objective Σ[(m − μ)² − Var(m)] / SE_data² +
  no-bout penalty, shared warm-ups with 4 recruiters per nest, larger
  budget per evaluation than the first fits.
- **Adequate** = no row |z| > 3, at most 2 rows in (2, 3], at most
  `M1999_NO_BOUT_MAX` (≈ 11 %) of recruiters per day without a bout.
  Sensitivities at the optimum: contact threshold ~~0.5 / 2 s~~ ≥ 1 s
  (B3 primary, 2026-10-10 night), giveUpTime 60 / 300 s. A verdict that flips under one of them is a real result:
  refit at the flipping setting, and that optimum joins the E6 ensemble
  (likewise a `contactGap`, if one is ever adopted). Not adequate → report
  the failing rows and why; ~~Claude decides the model change and logs it
  before acting~~ **from step 5 on, the stopping rule applies (Plan, step
  5; 2026-10-11): no further 1999-driven model revision in M1, bug fixes
  only**; E6 then runs on the best step-5 fit as a disclosed development
  benchmark (user, 2026-10-11).
- **Equivalence gate:** per row, 90 % bootstrap CI (paired seeds,
  recruiters resampled jointly over rows and levels) inside ±0.5 SE_data;
  1600 recruiters per day per level; dt 0.1 vs 0.025 (then 0.05 vs 0.025),
  warm-up 300 vs 900 s (900 adopted at the pilot point; 900 vs 1800 not
  shown equivalent for distance there, night archive). Run at the pilot optimum, and repeated at each
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
  direction at the optimum, cut at Δloss ≤ 3.84 × max(1, L_min / (15 − k))
  (15 rows − k free parameters; written as L_min / 8 when k was 7), Δloss and L_min on the χ² part only (no-bout
  penalty excluded); profile points must also meet the no-bout bound; one
  common large batch, bootstrap SE of Δloss ≤ 0.5 (else enlarge the batch
  first).

Stroeymeyt 2018 in-nest rows (frozen 2026-10-10 night; full definitions
in the Decisions log below, which stay there verbatim):
- **Roles:** main experiment, PreTreatment, 22 colonies = fit; age
  experiment PreTreatment (10 colonies) = held-out, not extracted until
  M1's final test; everything else unused and unopened.
- **Rows:** 1 forager stays (duration, path; contacts per stay with the
  contact observer), 2 in-nest speed, 3 still fraction (< 0.6 mm per
  frame; 0.14 mm sensitivity) and run lengths, 4 contacts vs density, 5
  density (input). Per colony × group × phase, then the mean over
  colonies with SE = SD / √22. Scale 0.0229659 mm/px (± 1.7 % systematic).
  Repeated reads of one tag in one frame: within 0.12 mm one detection,
  else all dropped.
- **Additions (2026-10-11, before any step-3 output):**
  - *Moving-only speed:* Σ d / Σ 0.5 g over non-still steps (d / g ≥ 0.6
    mm; 0.14 mm sensitivity), per colony × group × phase. The motor
    quantity step 4 fits; reported beside row 2.
  - *Short-stay speed V_stay:* per colony × phase, Σ path / Σ duration
    over complete forager stays of ≤ 5 min (1999's 1-d mean + 3 SD, 113 +
    3 × 57 s); sensitivity ≤ 20 min and all stays. Colonies with < 5 such
    stays in a phase drop out of that phase (count reported).
  - *Noise floor:* the path speed of a still ant under the estimated
    tracking noise, reported beside every speed (noise lengthens 0.5 s
    paths of slow ants).
  - *Per-ant spreads (diagnostic, not fit rows):* for ants with ≥ 30 min
    of in-nest steps in a phase, each ant's still fraction (0.6 mm) and
    path speed; per colony × group × phase the SD across ants; across
    colonies the mean with colony-block SE. Disclosed: added after
    colony209's colony-level rows were seen (no per-ant value was).
- **Step-3 branch rule (2026-10-11):** R = V_stay / 0.081 cm/s (1999
  distance / timeInNest at 1 d, the least starved day, closest to
  ad-libitum sugar; 4 d 0.074, 8 d 0.066 reported beside), per phase.
  - R ≤ 2 in both phases: Stroeymeyt foragers move like the 1999
    recruiter; step 4's motion is expected to reach the 1999 distance rows.
  - R ≥ 5 in both phases: the 1999 recruiter moves much less than
    Stroeymeyt foragers on visits of similar length; a recruiter-specific
    cause (standing while soliciting or sharing) or the 1999 measurement
    is examined, and any model change is logged before step 5.
  - Otherwise (in between, or the phases disagree): no branch; the 1999
    distance rows are the test in step 5.
  - Step 4 is the same on every branch. Disclosed: 1999's tracking
    interval is unknown (coarser sampling shortens paths); Stroeymeyt
    stays contain unknown trophallaxis and crop loads.
- **Per-ant spread rule (step 4):** at the step-4 optimum, z of log(SD_sim
  / SD_data) for the still fraction, per group and phase (colony-block
  SE). z < −3 in any cell → a per-ant activity trait is added (structure
  change, logged before acting) and step 4 refitted.
- **Step-4 cost:** each colony × phase is simulated as a warm-up plus an
  observation window inside one phase at its temperature (start: 20 min +
  2 h), not 24 h. Before fitting, at the start point, 2 h vs a full 12-h
  phase on paired seeds: per row the 90 % CI of the difference inside
  ±0.5 SE_data (the gate's rule); fail → longer window, recheck. One
  colony-hour is timed locally and the fit's cost estimated before any
  box is rented.
- **Contact observer (approved by the user 2026-10-11):** our own MIT
  front-contact observer, written from the paper's description and the
  published parameter values (0.6 mm, 10 s merging, 0.14 mm/frame asleep,
  2 min truncation, the two width ratios); no GPL code read or ported.
  Validated locally against the authors' GPL-3.0 tool run on the fit
  colonies; the tool and its outputs stay local (`.git/info/exclude`),
  only agreement statistics are committed. The agreement criterion is
  logged before the comparison runs.

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
  - **Mailleux, Sempo, Depickère & Detrain 2011** (Insect. Soc. 58:219–225)
    and **Depickère, Fresneau, Deneubourg & Detrain 2008** (Insect. Soc.
    55:163–170), in-nest spatial organisation under starvation: **held-out
    candidates** (user, 2026-10-10 night), unread. Only the title headers
    seen (identifying the files). Methods only, after the model structure
    is frozen; check whether their colonies overlap the held-out 2011
    recruitment paper's. The model has no aggregation mechanism yet, so
    they may not be testable in M1.
  - **Nicolis, Theraulaz & Deneubourg 2005** (Anim. Behav. 69:535–540) and
    **Depickère, Fresneau & Deneubourg 2004** (Insect. Soc. 51:81–90):
    **parameter and structure sources** for option B (user, 2026-10-10
    night); read in full, so none of their results can serve as a test.
  - **Colony pilot fit:** its generation-0 loss at the start points was
    seen while the profile cut-off was still open (disclosed in the
    archive, 2026-10-10 night); judged uninformative.
  - **Stroeymeyt et al. 2018** (*L. niger* in-nest tracking, Zenodo
    data): split by colony into fit/development and held-out colonies
    (user, 2026-10-10 night). Unread except the README and methods; the
    split is registered in the Decisions log before any track is opened.
    **Update 2026-10-11:** the 22 fit colonies' tracks are downloaded;
    only colony209's colony-level rows have been seen (code check; fit
    data). No held-out file has been downloaded.
  - **Planckaert et al. 2019** (Sci. Rep. 9:15620): unread; probably the
    same experiments as E6, so treated like E6 development until the
    overlap is checked from its methods alone.
  - **Lenoir & Ataya 1983** (Z. Tierpsychol. 63:213–232): development
    (structure source for in-nest resting); its abstract was seen while
    identifying the scan.
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
  distance (2026-10-10 night). Pilots (night archive): Buffin-rate bout
  endings push the fit to bounds; option A (refractory parting) fails the
  adoption rule; option B (arena-sourced stop-and-go motion) walks ≥ 12×
  the 1999 distance with 20–75× the contacts. Stroeymeyt 2018 in-nest
  rows (2026-10-11): ants still ≈ 95 % of the time, ≈ 0.27 cm/s when
  moving; foragers' short stays within 2× the 1999 recruiter's speed. No
  valid colony fit yet.

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
Earlier entries: the archive and the night archive. Newest last.

**2026-10-10 night — Stroeymeyt 2018 data: README and design read; colony split registered (before any track is opened).**
- **Read:** the data README (`zenodo-data-readme.txt`) and the main
  text's design paragraph. The Materials and Methods are only in the
  supplement, which science.org refused to serve (403); the user is asked
  for it. **Disclosure:** a grep of the main text for methods terms also
  showed one result line (p. 4): pathogen-exposed workers "reduced their
  area of movement while inside the nest" (post-treatment, qualitative).
  No other result was read.
- **What the data are:** 22 main-experiment colonies (11 sham-treated,
  11 pathogen-exposed), 11 age-marked colonies (age experiment), and a
  survival experiment. Each colony has a 24 h untreated **PreTreatment**
  recording and a 24 h **PostTreatment** recording that starts 2 h after the
  treated foragers are returned. ARTag positions in pixels at **2 frames/s**
  (0.5 s), with per-ant tag offsets and body length, nest-chamber Y limits,
  and nurse/forager labels from pre-treatment behaviour. No PreTreatment
  data exist for colony021 (age experiment) or colony055 (survival).
- **Split (registered; fixed before any track or colony table is opened):**
  - **Fit/development:** main experiment, PreTreatment only, all 22
    colonies.
  - **Held-out:** age experiment, PreTreatment only, its 10 colonies with
    PreTreatment data. Its tracking files are not extracted from the
    archive until M1's final test, and `ant_ages.txt` is not opened.
  - **Unused (reserve, unopened):** all PostTreatment recordings (handling
    and pathogen exposure change behaviour, which is what the paper is
    about), the survival experiment, the qPCR and simulation outputs.
  - **Why by experiment and not at random within the main experiment:**
    the rule needs no colony table to apply, so nothing is seen before
    registering. The colonies are independent, from the same lab, set-up
    and tracking system. The age-marked colonies may differ in size or
    age; that is part of what the test checks.
- **Observation model (decided in advance):** 0.5 s sampling cannot
  resolve stops shorter than about 0.5 s (Depickère's lone stop is
  0.26 s), and positions are of the tag, not the body centre. Simulated
  ants are observed the same way: positions sampled at 0.5 s (the
  `distanceSamples` mechanism), tag offset and tracking noise as estimated
  from the fit colonies. Rows are defined after the methods are read and
  before any fit-colony track is opened.
- **Data handling:** the archive goes to `data/stroeymeyt2018/` (raw zip
  not committed; CC-BY 4.0, to be added to `NOTICE.md`). Only the metadata
  and the main experiment's PreTreatment files are extracted.

**2026-10-10 night — Stroeymeyt 2018 methods read (supplement, Materials and Methods only); rows proposed.**
- **Read:** the supplement's Materials and Methods (ant host, tracking,
  arenas, the three experiments, general analysis, spatial analysis,
  social network analysis) and the Fig. S1 caption. Not read: the other
  figure captions, the tables and the simulation/statistics sections.
  Methods text includes design numbers (colony sizes, matched treatments,
  share of excluded dead ants); no behavioural result was read.
  File: `literature/Stroeymeyt2018_Science362-941_SM-methods_ROLE-PENDING.pdf`.
- **Set-up:** colonies founded from Lausanne queens (2013–14), 4.5–16
  months old, 32–193 workers (median 107), one queen, brood. Arena
  103 × 70 mm: **nest 70 × 40 mm, 6 mm high, under an IR-pass filter
  (dark to the ants)**, foraging area 70 × 54 mm, open, with water and 10 %
  sugar water ad libitum, joined by a 4 × 3 mm hole in a 9 mm wall.
  Tracking cycle: 12 h light at 26 °C (06–18 UTC), 12 h dark at 22 °C.
  Tags (0.7 mm, ≈ 0.12 mg, ≈ 10 % of body mass) on the thorax; 2 frames/s;
  detection 92.7 % per ant-second.
- **Their definitions (to reuse on simulated ants where we compare):**
  - PreTreatment file = the final 24 h before treatment (colonies
    habituate over the first days; they analyse only the last day).
  - Nurse = never left the nest before treatment; forager = left at least
    once.
  - Contact = front end of one ant's trapezoid (mandibles to gaster tip)
    inside another's. Successive records with both ants moving
    < 0.6 mm count as one contact. Contacts between immobile ants are
    truncated at 2 min.
  - Activity: change-point segments of speed, clustered into active and
    inactive bouts.
- **Scale:** no px/mm given. To be derived from metadata alone (nest
  Y-limits in px vs 40 mm; cross-checked against the authors' code,
  zenodo 1322676) before any track is opened. Note: the methods call
  0.6 mm "a third of the ant's body length" (implies 1.8 mm, but *L. niger*
  workers are ≈ 3–5 mm); the tag files' `trapezoid_length` settles it.
- **Differences from Mailleux 1999 (disclosed as a transfer risk):** small,
  young colonies (≈ 100 workers vs 1000–2000), ad-libitum sugar rather
  than a starved nest, a shallow 6 mm nest. Density
  (≈ 100 / 28 cm² ≈ 3–4 /cm² if most ants are inside) is inside B's
  allowed range.
- **Rows (approved and frozen by the user, 2026-10-10 night; fit colonies only, in-nest samples only,
  per colony then across colonies with colony-block SE, light and dark
  phases reported separately; the same 0.5 s observer applied to
  simulated ants):**
  1. **Forager stays** (entry to exit through the nest hole): duration,
     path length at 0.5 s sampling, front contacts per stay. This is the
     closest analogue of the 1999 rows (timeInNest, distance, contacts),
     but with unknown crop loads.
  2. **In-nest speed:** mean path speed at 0.5 s sampling, foragers and
     nurses separately (comparable to the 1999 ≈ 0.4 cm/s).
  3. **Stationary fraction and run lengths:** share of 0.5 s steps under
     0.6 mm (their stationarity threshold), and the durations of stationary
     and moving runs. These give stops ≥ 0.5 s and walk durations.
  4. **Contact rate:** front contacts per ant-hour in the nest, against
     in-nest density.
  5. **Inputs, not targets:** in-nest density per colony and phase.
- **Order:** download → move to `data/stroeymeyt2018/` → scale from
  metadata → rows approved and frozen here → only then open fit-colony
  tracks.

**2026-10-10 night — Stroeymeyt 2018 step 1: fetch, scale, licences.**
- **Fetch:** the full archive is 24.7 GB (19 GB are hourly arena photos).
  The user's browser download was slow, and its first 1.0 GB held only
  age-experiment (held-out) files. It was **never opened** and the user
  deleted it. Instead, members are read from the remote zip by HTTP range
  requests (Zenodo supports them): main-experiment metadata (81 files) and
  the 22 PreTreatment tracks (≈ 1.8 GB compressed, stored as `.csv.gz`).
  **No age-experiment or survival file has been downloaded.**
  `data/stroeymeyt2018/` is in `.gitignore`; licence row in `NOTICE.md`.
  Fetch script: `python3 -I scripts/fetchStroeymeyt.py` (skips existing
  files; `--list` prints the archive's members).
- **Opened (metadata only):** `info.txt` (22 colonies: 54–193 workers,
  5–16 months, boxes, `Ynestmax` 1810–2052 px with `Ynestmin` 0),
  tag-file columns and `trapezoid_length`, the plume zone map's structure
  (zone codes 1 nest, 3 sugar, 5 water; the nest zone starts at image row
  0, so its edges are not the chamber walls), `info_plume.txt` headers.
- **Scale: 0.0229659 mm/px (43.5 px/mm)**, from the authors' code
  (`analysis_parameters.R`: `pix_to_mm_ratio <- max(c(0.0225877193,
  0.0229658793))`; the two values differ by 1.7 %, probably two camera
  set-ups, and the authors use the larger for all colonies). Checks:
  - Median `trapezoid_length` 127 px = 2.9 mm (10–90 %: 2.6–3.2 mm,
    n = 2573), plausible for workers of young colonies.
  - 40 mm nest = 1742 px, below `Ynestmax` 1810–2052 (the chamber plus
    part of the 9 mm wall).
  - The contact filter's `-d 25` px = 0.57 mm is the methods' "0.6 mm".
    So "a third of the ant's body length" in the methods is a slip
    (25 px is about a fifth of 127 px).
  Their 1.7 % scale ambiguity is carried as a systematic error on
  lengths and speeds.
- **Contact rule details from the code (not in the methods):** contacts of
  the same pair separated by gaps ≤ 20 frames (10 s) are one event if
  neither ant moved > 25 px; "asleep" means < 6 px (0.14 mm) per frame;
  asleep contacts are cut at 240 frames (2 min). Trapezoid shape:
  `width_ratio` 0.7585, `width_factor` 0.7645; all contacts count
  (`angle_parallel` 0).
- **Row 3 threshold:** the frozen rows say "steps under 0.6 mm (their
  stationarity threshold)". The code's own stationarity ("asleep") is
  6 px = 0.14 mm per frame. Row 3 stays as frozen (0.6 mm); the 0.14 mm
  threshold is added as a sensitivity (logged before any track is opened).
- **Licence question (for the user):** the trapezoid geometry is defined in
  anttrackingUNIL's C++, which is **GPL-3.0**; not read. Our contact
  observer must also run on simulated ants inside MIT code, so it cannot be
  a port. Proposal: write our own front-contact observer from the paper's
  description and the two width parameters' plain meaning, and validate it
  locally against counts from the GPL tool run on the fit colonies
  (local only, like the Khuong port; only agreement statistics committed).

**2026-10-10 night — Stroeymeyt rows: operational definitions (fixed before any track is opened).**
Applied identically to recorded and simulated colonies (the simulation's
observer emits the same frame records, including missing detections).
- **Frames and positions:** the 0.5 s frame grid; consecutive frames by
  frame number. Position = tag centre (all tag offsets are 0 in the main
  experiment) × 0.0229659 mm/px. Phase by the frame's UTC time: light
  06:00–18:00, dark otherwise.
- **Ants:** workers with a task group (nurse or forager, from
  `task_groups.txt`) and final status `alive` or `lost_tag` (the latter
  until their last detection). Excluded, as the authors did: ants that
  died or were removed (`dead`, `drowned`, `accident`, …). The queen is
  excluded from the rows and counted in density.
- **In nest:** y ≤ `Ynestmax` of the colony (the authors' nest limit).
- **Steps:** between consecutive detections of the same ant, both in the
  nest, g ≤ 3 frames apart (up to 2 missing frames bridged); a step lasts
  0.5 g s with displacement d. Larger gaps break the sequence.
- **Row 2, speed:** Σ d / Σ 0.5 g over steps, per colony × group × phase.
- **Row 3, stillness:** a step is still if d / g < 0.6 mm (sensitivity
  0.14 mm, the code's "asleep" threshold). Still fraction = Σ g (still) /
  Σ g. Runs = maximal sequences of steps in one state, broken by a gap
  > 3 frames or by leaving the nest. A run is complete if bounded on both
  sides by the opposite state; only complete runs enter the duration
  statistics. Per colony × group × phase (by the run's start): mean and
  median duration, and P(run ≥ D) for D = 1, 2, 5, 10, 30, 60, 300 s.
- **Row 1, forager stays:** zone (nest or out) changes only when the new
  zone holds for 2 consecutive detections (debounce; sensitivity 1).
  Entry = first detection of the in-nest run; exit = first detection of
  the following out-of-nest run. A stay is complete if bounded by
  out-of-nest runs on both sides. Duration = exit − entry; path = Σ d of
  its steps; phase by entry. Per colony × phase: number of stays, mean and
  median duration, mean path. Contacts per stay are added once the contact
  observer is settled (licence question above).
- **Row 4, contacts:** waits on the contact observer.
- **Row 5, density (input):** in each frame an ant counts as in the nest if
  its latest detection within 20 frames (10 s) is in the nest; ants / 28
  cm² (70 × 40 mm), per colony × phase mean.
- **Tracking noise:** σ per axis from first and second differences of
  still-ant positions (`noiseTrack` approach); the simulation's observer
  adds it, together with independent missed detections at each colony's
  measured detection rate.
- **Across colonies:** row values are per colony; the target is the mean
  over the 22 colonies, with SE = SD / √22 (colony blocks). Treatment
  (sham vs pathogen) is ignored, since all of this is PreTreatment.

**2026-10-10 night — Stroeymeyt rows: repeated tag reads (data-quality rule added after one fit colony's output).**
- Statistics code: `src/sim/analysis/inNest.ts` (`InNestAccumulator`,
  `colonyRows`, `acrossColonies`), tests `test/inNest.test.ts` (synthetic
  colonies with known answers); data reducer `scripts/stroeymeytRows.ts`
  (≈ 10 s per colony).
- **Found on colony209 (a fit colony; its output was inspected):** the
  tracking files list most tags twice in a frame, ≈ 10 tags per frame,
  and 99.99 % of the repeats are within 2 px of each other, so they are
  double reports of one detection. A first rule (drop every repeated tag)
  gave zero-frame runs and cut detection to 0.75. **Rule now:** reads
  of one tag in one frame within 0.12 mm (≈ 5 px) are one detection
  (the first is kept); if any read is farther away (0.0006 % of repeats in
  colony209, > 100 px: misreads), all that tag's reads in the frame are
  dropped. Counts are reported per colony. This is a data-cleaning rule,
  not a row change; simulated colonies never produce repeats.

**2026-10-11 morning — fetch stalled overnight; resumed.**
- One download died on a DNS failure at 22:10 and five hung with it
  (the first scratchpad fetcher had no backoff). 16 of 22 tracks were
  complete. The stuck processes (own pids only) were stopped, partial
  files removed, and the remaining 6 refetched with
  `scripts/fetchStroeymeyt.py` (retries with backoff).
- The data README is now `data/stroeymeyt2018/README.txt`.
- **Seen so far:** the rows of one fit colony (colony209), used to check
  the code (repeated-read rule above). Fit data, so no contamination;
  noted for completeness. No other colony's output has been looked at.

**2026-10-11 — plan review: five changes (Claude proposed; user: "Yes, clean up STATUS or the plan where you see fit"; logged before step 3 runs).**
- **Seen before writing this:** nothing from the fit colonies beyond
  colony209's rows (previous entries). The 1999 reference values used
  below are fit rows (Table 2a), already known.
- **1. Step-3 branch compares like with like.** The old branch (row 2
  speed against ≈ 0.4 cm/s) compared colony-wide speed, mostly idle ants,
  with the 1999 recruiter's speed outside trophallaxis, a derived figure
  (5.9 cm in the ≈ 14 s left over at 4 d). The 1999 rows give whole-stay
  speed directly: distance / timeInNest = 0.081 / 0.074 / 0.066 cm/s at
  1 / 4 / 8 d. The branch now uses Stroeymeyt foragers' short stays
  measured the same way (V_stay; rule in Rules in force). The branch no
  longer changes step 4, only whether a recruiter-specific change is
  considered before step 5.
- **2. Contact observer approved:** our own MIT observer, checked against
  the GPL tool locally (Rules in force). This makes row 4 (contacts vs
  density, the model's worst failure under B) available to step 4.
- **3. Per-ant spreads** as diagnostics and a spread rule for adding a
  per-ant activity trait in step 4: colony means alone would let one
  homogeneous ant type compromise between the reserve-like resting ants
  (Lenoir & Ataya 1983) and the active ones.
- **4. Step-4 cost:** short windows per colony and phase, checked against
  a full phase before fitting; timed locally before any box. The box stays
  reserved for step 5 unless that timing says otherwise.
- **5. Stopping rule:** step 5 is the last 1999-driven model revision in
  M1; an inadequate fit there is reported as a transfer failure, and only
  bug fixes reopen it. **Open for the user:** whether E6 then still runs
  as a disclosed development benchmark (its rule now requires an adequate
  1999 fit).
- **STATUS cleanup (same request):** the 2026-10-10 night entries before
  the Stroeymeyt colony split moved verbatim to
  `docs/archive/STATUS-2026-10-10-night.md`. Rules in force corrected in
  place where the pilots had superseded them (contacts B3 primary, free
  set, shareEnd derived, adoption rule and pilot conditions stated, the
  profile cut written for any k); a Stroeymeyt section collects the
  frozen rows and today's additions. RESUME and Plan rewritten around the
  current state (all 22 fit tracks in).

**2026-10-11 — additions implemented; step 3 launched.**
- `inNest.ts`: `speedMove` (moving-only speed, both thresholds),
  `staySpeed.{300,1200,all}` with counts (< 5 stays → missing),
  `noise.floorSpeed` (σ√π / 0.5 s, rms σ of the two axes), per-ant
  `antN` / `antSd.still` / `antSd.speed` (ants with ≥ 30 min of in-nest
  steps per phase). Synthetic tests with known answers
  (`test/inNest.test.ts`, 15 pass; fast tier 127 pass).
- Step 3: `npx vite-node scripts/stroeymeytRows.ts` on the 22 fit
  colonies → `data/reference/stroeymeyt2018-fit-rows.json`, read under the
  branch rule above.

**2026-10-11 — step 3 stopped on out-of-order frames; data-cleaning rule (logged before the rerun).**
- The reducer stops on a non-increasing frame number. In the 22 fit
  tracking files, lines are sometimes written out of order: 13 files
  have 1–40 adjacent swaps (a line one frame behind, rarely up to 5), and
  colony237's last line is frame 697585 (misplaced from the middle of the
  file). No frame number occurs twice in any file, and a line's
  timestamp goes with its frame number, so these are write-order slips,
  not duplicate or corrupt records. Only frame numbers and timestamps
  were looked at, not any position or row.
- **Rule:** lines are put back in frame order with a reorder window of
  8 lines; a line arriving later than that (only colony237's) is dropped
  and counted per colony, which the definitions treat as a frame with no
  detections. Simulated colonies are produced in order.

**2026-10-11 — step 3 result: the branch rule says R ≤ 2 (Stroeymeyt foragers move like the 1999 recruiter).**
`data/reference/stroeymeyt2018-fit-rows.json` (22 fit colonies; reorder
rule applied: 1–40 lines reordered per file, 1 late line in colony237).
Means over colonies ± colony-block SE; speeds in cm/s.
- **Branch (V_stay, forager stays ≤ 5 min):** light 0.122 ± 0.008, dark
  0.130 ± 0.007 (21 colonies; colony265, 12 foragers, has < 5 such
  stays). R against 1999 at 1 d: **1.51 light, 1.60 dark → R ≤ 2 in both
  phases.** Against 4 d / 8 d: 1.65–1.97. Sensitivities: stays ≤ 20 min
  R 0.93 / 1.03; all stays R 0.29 / 0.34 (long resting stays). Per the
  rule: step 4's motion is expected to reach the 1999 distance rows; no
  recruiter-specific change is considered. (The old row-2 rule would have
  given the same branch: colony-wide speed is far below 0.4 cm/s.)
- **In-nest motion is slow and mostly still.** Still fraction (< 0.6 mm
  per 0.5 s frame): foragers 0.944 / 0.953, nurses 0.984 / 0.989
  (light / dark). Path speed: foragers 0.026 / 0.023, nurses 0.010 /
  0.009. **Moving-only speed:** foragers 0.275 / 0.275, nurses 0.221 /
  0.216 (0.14 mm threshold: 0.13 / 0.09). Option B's arena values were
  2.9–3.7 cm/s (Depickère 2004): the nest is ≈ 10× slower when moving and
  still ≈ 95 % of the time. This is the size of B's distance miss.
- **Runs (foragers, light):** still runs median 1.5 s, mean 9.6 s,
  P(≥ 60 s) 0.03, P(≥ 300 s) 0.01; moving runs median 0.9 s, mean 1.4 s.
- **Stays:** 224–252 complete per colony and phase; mean 3629 / 1911 s,
  median 769 / 498 s (most stays are long rests, not unloading visits).
- **Per-ant spreads:** SD of still fraction across ants, foragers 0.049 /
  0.045, nurses 0.014 / 0.012; of speed, foragers 0.022 / 0.019, nurses
  0.006 / 0.005.
- **Density (input):** 3.17 / 2.98 /cm², 3–6× the 1999 fits' 0.5–1.1.
- **Observation:** noise σ 0.022 mm per axis (white ratio 1.52: slow drift
  within still windows, so the second-difference σ is the one used);
  noise-floor speed 0.008, so **nurses' overall speed (0.009–0.010) is
  almost all tracking noise**, and foragers' is ≈ 3× the floor; detection
  0.805 per frame between first and last detection.
- **Next: step 4** (Stroeymeyt nest set-up, observer, cost timing).

**2026-10-11 — E6 if step 5 is not adequate: option (b) (user: "I agree with b").**
If the stopping rule ends the 1999 work without an adequate fit, E6 still
runs, with the best step-5 fit, labelled a development benchmark on a
model that failed the 1999 calibration (failing rows listed beside it).
The rest of the E6 rule (ensemble, fit protection, set-up, sensitivity
runs) applies unchanged. Option (a), no E6 without an adequate fit, is
not taken.

**2026-10-11 — step 4a: the Stroeymeyt set-up in the simulation (decisions logged before implementing).**
- **Geometry (from metadata and fit-colony positions):** the zone maps
  (`.plume`: 608 × 912 cells of 5 px) put the sugar zone at x 9–23, y
  82–99 mm and water at x 47–61, y 84–99 (image coordinates; x across the
  70 mm width). Detected positions (colony209) fill the nest at y 1–39,
  none at y 40–47 (the 9 mm wall: ants in the hole are invisible to the
  tracker), the foraging area from y 48; crossings at x ≈ 34–35. Model:
  nest 70 × 40 mm (covered), passage 4 × 9 mm centred (x 33–37, y 40–49),
  foraging area 70 × 54 mm (y 49–103); sugar drop at (16, 90), ad libitum
  (10 % ≈ 0.3 M, never runs out). Water is not modelled (no drinking of
  water in the model; disclosed). 6 mm height: planar, as elsewhere.
- **Ants:** each colony's own workers by task group (nurses, foragers:
  the data's labels, an input) plus the queen; no brood (disclosed). The
  queen moves as a nurse, never leaves, and is excluded from the rows as
  in the data.
- **Behaviour (provisional, for 4a):** fed colony (starvation 0, so
  nobody is hungry and no in-nest sharing happens; contacts and sharing
  wait for the contact observer). Nurses never leave. Forager-trait ants
  leave on trips at a new hazard `outRate` (0 by default, so every
  existing run is unchanged), run the forager policy outside (explore,
  sugar, drink, return) and re-enter. `returnRate` 0 here (no recruitment
  loop in a fed colony). `outRate` is set so the in-nest forager share
  matches the colony's density row (an input), not fitted to rows 2–3.
- **Walking:** no temperature factor between phases (the data's moving
  speed is the same in light, 26 °C, and dark, 22 °C: 0.275 / 0.275
  cm/s); temperature acts on metabolism only.
- **Observer:** every 0.5 s, each ant's body centre (tag offsets are 0 in
  the data; the thorax–centre offset is ignored, disclosed) plus white
  noise with the colony's σ, each detection missed independently at the
  colony's rate (frozen definitions), no detection in the passage (as the
  wall hides the hole); in-nest = inside the nest chamber. The frames go
  through the same `InNestAccumulator`.
- **Windows:** per colony × phase, warm-up 20 min + 2 h observed, to be
  checked against a full 12 h phase (step-4 cost rule); dt 0.1 s, checked
  against 0.05 s on the same rule.
- **Then (4b):** compare the provisional model's rows with the data and
  propose the free motion parameters (per group: in-nest speed factor,
  rest/walk switching, the walker's in-nest pause rate), logged before any
  fit. One colony-hour is timed first.

**2026-10-11 — step 4a done: set-up runs; cost; provisional model far off; crowding in the data.**
- Implemented as logged: `stroeymeytApparatus` (`apparatus.ts`),
  `ColonySim` options `setup` and `roles`, nest parameter `outRate`
  (default 0; forager overrides now also carry `nestPauseFactor` and
  `outRate`), `src/sim/experiments/colonyStroeymeyt.ts` (set-up and
  observer), `scripts/stroeymeytSim.ts` (one colony, rows beside its
  data), test `test/stroeymeytSim.test.ts`. Fast tier 128 pass;
  defaults unchanged.
- **Cost:** colony209 (100 ants), dt 0.1: **17.6–18.4 s per simulated
  colony-hour**. `perceive` (all-pairs contact check) is 37 % of it; a
  spatial grid with candidates in index order would keep results
  bit-identical. One evaluation of all 22 colonies × 2 phases at 20 min
  warm-up + 2 h ≈ 30 min serial (≈ 4 min on ~8 local workers); shorter
  windows, if they pass the window check, scale this down.
- **Provisional model vs colony209 (light; development look at fit
  data):** moving-only speed 34 vs 2.9 mm/s, path speed 20 vs 0.32,
  still fraction 0.41 vs 0.93, moving runs median 14 vs 1.0 s; still
  runs mean 8.9 vs 6.9 s (close by accident: the walker's own pauses).
  Forager stays median 31 vs 366 s (outRate 1/300 provisional). In-nest
  ants in the data move in short (≈ 1 s), slow bursts.
- **Crowding (fit data, across the 22 colonies, Spearman with the
  colony's density):** moving-only speed −0.28 to −0.54, moving-run mean
  −0.28 to −0.56 (all 8 negative; |ρ| > 0.42 is p < 0.05 at n 22); still
  fraction −0.10 to +0.24. Denser colonies walk in shorter, slower bouts
  but are not stiller. So ants cannot be simulated independently: the
  fit keeps whole colonies at their own size, and the structure needs a
  mechanism by which nestmates shorten walking (e.g. option B's
  encounter stops).

**2026-10-11 — step 4b: structure, rows and checks (approved by the user, "yes"; logged before any fit).**
- **Structure = option B's, refitted on in-nest data.** Per group
  (nurses; foragers via the forager-trait overrides): `nestSpeedFactor`
  (walking speed, × the 45 mm/s walker), `activeToRest` (spontaneous
  stops), `restToActive` (walk-on rate of a lone stopped ant),
  `nestPauseFactor` (the walker's own short pauses, 0.053 /s × factor,
  0.70 s mean). Shared: `encounterStop` (probability of stopping at the
  onset of antennal contact) and `restCrowdExp` (walk-on rate ×
  N^−b, N = ants in the stop), the only crowding mechanism the model has.
  **k = 10.** No per-ant heterogeneity yet (spread rule at the optimum).
- **Bounds (box, Mod-BCH as in the 1999 pilots; log scale):**
  nestSpeedFactor 0.005–0.5; activeToRest 0.01–10 /s; restToActive
  0.001–10 /s; nestPauseFactor 0.01–100; encounterStop 0–1 (linear);
  restCrowdExp 0–3 (linear).
- **Fit rows (32):** per group × phase: still fraction (0.6 mm),
  moving-only speed, still-run mean, P(still run ≥ 2 / 10 / 60 s),
  moving-run mean, P(moving run ≥ 2 s). Medians are left out (they move
  in 0.5 s frame steps, flat for an optimiser). Target = the 22-colony
  mean, SE = colony-block SE; loss Σ fitZ², debiased (minus the simulated
  mean's variance / SE²), as in the 1999 fits.
- **Simulation per evaluation:** all 22 colonies at their own size,
  noise and detection rate, one window each. The model has no phase
  dependence inside the nest (no temperature factor; light does not
  reach the covered nest), so one simulated window per colony serves both
  phases' rows (disclosed: light–dark differences in the data stay as
  residuals). Common random numbers within a generation.
- **Checks, not fitted (judged at the optimum):** (1) crowding: Spearman
  of moving-only speed and moving-run mean with density across the 22
  simulated colonies, against the data's (−0.28 to −0.56); (2) per-ant
  spread rule (logged earlier); (3) forager stays (row 1), after
  `outRate` is set from the density input; (4) stays-based V_stay.
- **Before the fit, locally (step-4 cost rule):** a spatial grid for
  contact checks (bit-identical, tested); at a start point, a 30-min and a
  2-h window vs a full 12-h phase, and dt 0.1 vs 0.05, each by the gate's
  rule (90 % CI of the per-row difference inside ±0.5 SE_data, colony
  bootstrap). The shortest passing window and the coarsest passing dt are
  used.
- **Box:** rented by the user for the fit (2026-10-11).

**2026-10-11 — step 4b preparations (code; nothing fitted yet).**
- **Contact grid** (`world/contactGrid.ts`): ants binned per step,
  contacts checked in the 3 × 3 cells around each ant, candidates in
  index order; runs identical with and without it (`test/contactGrid.test.ts`:
  a Bles colony with sharing, a crowded Stroeymeyt nest with option-B
  stops). 17.5 → 12.6 s per colony-hour (colony209).
- **Input row `foragerIn`** (share of foragers whose latest detection is
  in the nest, per frame; same code on data and model): data 0.821 ±
  0.035 light, 0.718 ± 0.047 dark. Added because the density row
  undercounts (it holds an ant only 10 s after its last detection, and
  real misses are clustered: inferring the forager share from density gave
  values below 0). Reducer rerun; all other rows unchanged. `outRate` now
  also applies to resting ants (so the trip rate does not depend on the
  fitted rest/walk rates) and is set by `scripts/calibOutRate.ts` to the
  mean of the two phases (0.77).
- **Start point** (`scripts/s2018Lib.ts`, by two hand-tried runs on
  colony209, a development look at fit data): speed factor 0.06, stops
  3 / 2 per s, walk-on 0.15 / 0.25 per s (nurses / foragers), pause factor
  1, encounterStop 0.5, restCrowdExp 0.5. At it, colony209's moving speed
  and nurse still fraction are close; still runs are too long at 2–10 s
  and too short in the tail (one exponential rest cannot give the data's
  P(≥ 2 s) 0.4 with P(≥ 60 s) 0.02; only the crowd exponent can fatten
  the tail, so the fit will show whether the structure suffices).
- **Scripts:** `fitS2018.ts` (as logged for 4b), `checkS2018Window.ts`
  (window and dt checks), `calibOutRate.ts`; targets, free set, bounds
  and loss in `src/sim/experiments/stroeymeytTargets.ts`; pool task
  `s2018Colony`.

**2026-10-11 — step 4b: the forager trip process needs a second input (logged before the change).**
- **Found:** `calibOutRate` could not reach the data's forager share
  (0.77): at outRate 1/632, 1/112, 1/47, 1/31, 1/25 s the simulated share
  was 0.965, 0.938, 0.914, 0.902, 0.897. Diagnostic (colony209, start
  point, 1 h): simulated trips last median 14 s, mean 22 s; every forager
  sits at a full crop (1.96 µL), so a trip is walk to the drop, find the
  crop full, go home. Data: mean stays 1900–3600 s with 23 % of forager
  time outside imply trips of ≈ 600–1000 s. Matching the share with 20 s
  trips would need ≈ 70 s stays, and forager in-nest motion would then be
  dominated by walking to and from the hole (contaminating rows 2–3).
- **Change (Stroeymeyt set-up only):** (1) no sugar drop in the model.
  In a fed colony without sharing, feeding does not reach the in-nest
  rows, and the drop is what cuts trips short (disclosed). (2) A trip is
  exploration of the foraging area for `exploreGiveUp` s, then homing.
  (3) Two inputs instead of one, both from the same observer on data and
  model: the mean duration of complete out-of-nest runs (exit to next
  entry, debounce 2; new statistic `trip.*`, reducer rerun) sets
  `exploreGiveUp`, and `foragerIn` sets `outRate`. Row 1 (stays) stays a
  check; its mean is now partly implied by the two inputs (disclosed),
  its shape (median, tail) is not.
- **Box:** rented by the user (vast.ai, Thailand, 2 × EPYC 7B12, CPU
  quota 245, 251 GB). Code fd474fc via git bundle, Node 22.22.1; fast
  tier 131 pass (the local-only Khuong test is not in the bundle); run
  hash `c4988f4c…` (colony112, 60 + 300 s) equals the local one.
- **Trip input (reducer rerun; all other rows unchanged):** complete
  trips per colony 255 / 233 (light / dark), mean 1025 ± 227 / 1329 ±
  229 s, median 144 / 423 s (heavily skewed). Target: mean of the two
  phases' means, 1177 s; the model's trips are near-fixed (explore, then
  home), so the trip *shape* is not matched (disclosed; it does not enter
  the in-nest rows; the transit frequency it implies, ≈ 8.5 per forager
  per 12 h, agrees with the data's ≈ 8). `scripts/calibTrips.ts` replaces
  `calibOutRate.ts`: grids in parallel over a 12-h window (as the data's
  phases, so complete-trip censoring matches) → `data/fits/s2018-trips.json`.

**2026-10-11 — Greenwald et al. 2015 filed; role registered before reading.**
- User supplied two PDFs (repo root). `s41598-019-52019-6.pdf` is
  Planckaert et al. 2019 (identified by its DOI file name; byte-identical
  to the copy already in `literature/`, so the root copy was removed);
  **not opened**, as instructed (E6 data).
- `srep12496.pdf`, identified from its PDF metadata only: **Greenwald,
  Segre & Feinerman 2015**, Sci. Rep. 5:12496, "Ant trophallactic
  networks: simultaneous measurement of interaction patterns and food
  dissemination" (*Camponotus sanctus*). Filed as
  `literature/Greenwald2015_SciRep5-12496_trophallactic-networks-food-dissemination.pdf`.
- **Role (user: "as a prior"): parameter and structure source, other
  genus; never a target or test.** Values from it can set priors or
  bounds for in-nest trophallaxis (flow rate, bout durations, crop loads),
  scaled and disclosed; none is a *L. niger* value. **E6 exposure
  (disclosed):** it measures food dissemination through a colony, the
  kind of outcome E6 tests in *L. niger*; E6 is already a development
  benchmark, and nothing from this paper may be used to set or tune an
  E6-facing choice beyond the step-5 priors logged here.
- **Read** (2026-10-11): extraction in `docs/research/greenwald2015.md`.
  Candidate step-5 priors: foragers unload ≈ 50 % of their crop per
  visit (vs our unload-to-10 % rule); transfer volume not linear in bout
  duration (against one constant `shareRate`); 240 s between an ant's
  trophallaxes; small events dominate. **Seen but not used:** its colony
  accumulation curve (rate 0.036, E6-type outcome) and network results.
