# Project status

_Last updated: 2026-10-12 (session 5: start 0 stopped at gen 30; colony fast path (2×, bit-identical) and fit checkpointing in; relaunch pending). Keep this file current: update it whenever a step starts or finishes._

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
  **Step 4 in progress:** 4a done (the Stroeymeyt set-up runs). 4b
  (fit of in-nest motion, k = 10, 32 rows): all pre-fit checks done
  (trip calibration 2147 s, 1/7271 /s; dt 0.05; 2-h warm-up + 6-h
  window; Decisions log, last entries). **Start 0 was stopped by the user
  at gen 30 (24.4 h, ≈ 45 min/generation, 3× the estimate; no checkpoint
  then).** Since then (2026-10-12): the colony fast path (2× per
  evaluation, bit-identical) and per-generation checkpoints (rerun the same
  command to resume). **Start 0 relaunched on the box 2026-10-12 ≈ 00:27
  box time** (794f598, tag `s0`; old log `logs/fitS2018-s0-stopped-gen30.log`
  there); if the box dies, rerun the same command. Start 1 and
  the restart decided after it. A vast.ai
  box is rented (see the step-4b box entry
  for access and set-up).
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
- **Box speed:** cores capped at 1.9 GHz (`scaling_max_freq`; Zen 2), so
  one process runs ≈ 5× slower than locally; 243 workers ≈ 50 local cores.
  Trip calibration ≈ 1.5 h (each round bound by the 193-ant colony × 12 h);
  fit estimate revised to ≈ 2 min per generation, ≈ 10 h for two starts
  and a restart. To use idle workers, the window and dt checks run
  alongside the calibration (separate checkout `~/ants2`, 70 workers) at
  **provisional trip inputs** (exploreGiveUp 1000 s, outRate 1/3500 /s;
  disclosed); rerun if the calibrated values differ by more than 2×.

**2026-10-11 — two problems found on the box; diagnosis before any change.**
- **Trips plateau at ≈ 50 s** (calibration round 1, outRate 1/2000):
  exploreGiveUp 60 / 150 / 300 / 500 / 800 / 1200 / 1800 / 2700 s gave
  observed trip means 33 / 44 / 46 / 48 / 49 / 50 / 51 / 51 s; the target
  1177 s is not bracketed and the run stopped. Cause (code): an exploring
  forager that walks back through the hole stays under the forager policy
  (only `return` hands it to the nest), but it is in the nest, so the
  observer counts an entry. In a 70 × 54 mm area at outside walking speed
  the 4 mm hole is found within about a minute.
- **dt 0.1 vs 0.05 at the start point (provisional trip inputs): 13 of
  16 rows not shown equivalent**, systematic on stillness: still fraction
  nurses −2.71 SE (CI −2.95, −2.47), still-run mean −1.14, P(still ≥ 10
  s) −5.85 (nurses) / −4.62 (foragers), P(≥ 60 s) −3.52 / −1.16; moving
  rows mostly ok (nurses). The model is stiller at the finer step.
  Hypothesis: encounters are contact onsets checked once per step, so a
  contact flickering at the antennal-reach boundary yields more "onsets"
  (more encounter stops) at a finer step. **Test (pre-registered):** the
  same dt comparison with encounterStop 0, and with restCrowdExp 0 (one
  mechanism off at a time); if the shift disappears only without
  encounter stops, the cause is the onset detection. The window check
  (running alongside) was stopped: void at a dt-dependent point with
  broken trips.

**2026-10-11 — diagnosis results; two fixes (logged before implementing the second).**
- **dt test (pre-registered above): hypothesis rejected.** The stillness
  shift is unchanged without encounter stops (still fraction nurses
  −2.56 SE, P(still ≥ 10 s) −5.65 / −5.70) and without crowding (−3.81;
  −7.47 / −4.67). The baseline rerun reproduced the first run exactly
  (deterministic). So neither crowding mechanism is the cause.
- **New hypothesis (from the code):** mode switches act one step late. A
  walking ant that decides to rest still walks that step; a resting ant
  that decides to walk on still stands that step. Each spell gains one
  step of its old state. At the start point walking spells average 1/3 s
  (activeToRest 3 /s), about 3 steps at dt 0.1, so the lag adds ≈ 30 %
  walking at dt 0.1 and ≈ 15 % at 0.05: less stillness at the coarser
  step, as seen. **Fix:** a switch takes effect in the step it is decided
  (rest → stand now; walk on → walk now). This changes every colony run
  (the 1999 pilots and E6 runs used slow switching, 1/120–1/180 /s, where
  the lag is < 2 %; no adopted colony fit exists, so nothing adopted
  changes; E2 does not use the nest policy). The dt check is rerun after
  the fix.
- **Trips fixed (kinematic):** steering away from the hole did not hold
  explorers back (at 45 mm/s the 9 mm passage takes 0.2 s, faster than a
  turn). Now an exploring forager cannot step into the nest chamber
  (`ColonyOptions.exploreOutside`, a walkable-area test in `walkAnt`); a
  device to realise the trip-length input, disclosed. Colony209 (2 h, explore
  1000 s, outRate 1/3500): 47 observed trips, mean 647 s (censored by the
  window), stays median 835 s, foragerIn 0.81. Steering attempts reverted.
- **After the lag fix (dt 0.1 vs 0.05, start point, provisional trips):**
  all 6 moving rows now equivalent (|diff| ≤ 0.25 SE); stillness rows
  still shift: still fraction −2.79 (nurses) / −1.04 SE, still-run mean
  −1.19 / −0.89, P(≥ 2 s) −1.13 / −2.64, P(≥ 10 s) −6.42 / −7.12, P(≥ 60
  s) −3.71 / −1.06. In absolute terms small (nurse still fraction ≈ 0.003;
  P(≥ 10 s) ≈ 0.03), but the data's SEs are tiny (22 colonies × 12 h), so
  the gate's ±0.5 SE is strict. Per the rule: dt 0.05 vs 0.025 next; the
  coarsest passing dt is used.
- **dt 0.05 vs 0.025 (same point): 11 of 16 rows fail; the shifts halve
  with dt** (P(still ≥ 10 s) −6.4 → −2.8 / −7.1 → −2.3 SE; nurse still
  fraction −2.8 → −1.1): a first-order discretization error. Per the rule
  (1999 addition 1), a smaller step does not fix it; back to the cause.
- **Cause (second O(dt) term):** a switch drawn once per step makes every
  rest or walk spell a whole number of steps, mean dt / (1 − e^(−r dt)) ≈
  1/r + dt/2; walking spells at 3 /s are ≈ 15 % too long at dt 0.1, and
  the extra walking breaks long still runs. **Fix:** a switch happens
  inside the step. When rest → walk or walk → rest is drawn, a uniform
  fraction u of the step is drawn (exact to O(dt²) against the truncated
  exponential); the ant walks u (walk → rest) or 1 − u (rest → walk) of
  the step, through a percept with dt × fraction (the walker places its
  own pauses in continuous time, so a partial step is exact). The dt
  checks are rerun, 0.1 vs 0.05 first.
- **Within-step switching did not fix it** (dt 0.1 vs 0.05: P(still ≥ 10
  s) −5.8 / −6.1 SE, nurse still fraction −2.4). A single nurse alone in
  the nest (6 × 4 h per dt) shows the shift too (still 0.9456 / 0.9487 /
  0.9522 at dt 0.1 / 0.05 / 0.025), also with walker pauses off, but not
  for an ant that never rests (0.0467 / 0.0470 / 0.0478): the error is in
  the rest/walk switching of one ant, not in interactions. Why the fix
  failed: a spell that starts inside a step cannot end in the rest of that
  step (the next hazard check is at the next step), so spells are still
  ≈ dt/2 too long. **Fix (exact):** one unit-rate exposure clock per ant,
  as the walker uses for its pauses: draw E ~ Exp(1); in each step the
  current mode's rate (activeToRest, or the crowd-dependent walk-on rate)
  accumulates exposure, and the mode switches exactly when it reaches E,
  as many times as that happens inside the step; the ant walks for the
  summed walking time of the step. Exact for rates constant within a step;
  by memorylessness the clock also carries over when another cause
  (encounter, bout, leaving) changes the mode.
- **Exposure clock: most of the dt error is gone, not all** (de48823; dt
  0.1 vs 0.05, start point, provisional trips): 8 of 16 rows still fail,
  same sign as before (coarse dt less still), but the shifts are 3–4×
  smaller: nurse still fraction −2.8 → −0.67 SE, P(still ≥ 10 s) forager
  −6.4 → −2.5, nurse −7.1 → −0.6; still forager −0.36, runStill.mean
  forager −0.40, P60 −0.55 / −0.57; all moving rows pass. A unit test
  shows a lone ant's walking share is the same at dt 0.025, 0.1 and 0.5.
  **Next suspect (logged before testing): encounter detection.** An
  encounter is "a contact id not in contact last step". A coarse step
  misses contacts shorter than dt, and at a fine step, contacts at the
  edge of antenna reach flicker off and on and count again. Both make
  coarse-dt ants stop less, which is the observed sign. The earlier noEnc
  test could not show this while the switching error dominated. **Test:**
  the dt check again with encounterStop 0, and with encounterStop 0 and
  restCrowdExp 0. If the rows then pass, encounter detection is changed so
  that it does not depend on dt (logged before changing it). If they still
  fail, the remaining cause lies elsewhere (walls, walk-on rate read at
  step start).
- **Encounter detection confirmed as the remaining systematic dt term.**
  With encounterStop 0 the shifts vanish: all mean differences are within
  ±0.5 SE and of mixed sign (nurse still −0.17, P(still ≥ 10 s) forager
  +0.49, nurse +0.03 SE). The rows that still fail (6 of 16; 5 of 16 with
  restCrowdExp 0 as well) fail on CI width, not on a shift: P10 forager
  [−0.72, 1.64], P2 forager [−0.52, 0.63]. Two seeds × 22 colonies × 30
  min cannot show tail rows equivalent at ±0.5 SE. A local count
  (`scripts/diagDtEncounter.ts`, one colony, encounter stops off) shows
  the mechanism: new-contact onsets per ant-second are 0.0341 / 0.0371 /
  0.0370 at dt 0.1 / 0.05 / 0.025. Contacts shorter than a step are missed
  (the shortest 10 % last 0.40 / 0.25 / 0.15 s), and re-contacts with the
  same ant within 0.25 s rise with finer dt (2.9 / 4.7 / 5.6 %).
  **Decisions (logged before acting):** (1) an encounter becomes a
  contact *episode* with a nestmate, defined so that it does not depend
  on dt. The episode counts as an encounter once its estimated duration
  (span between first and latest sighting, + dt) reaches τ_on. It ends
  once the estimated gap (time unseen − dt) exceeds τ_gap. Both are fixed
  `estimated` constants, not fitted, chosen as the smallest pair on the
  grid τ_on ∈ {0, 0.2, 0.3, 0.5} s × τ_gap ∈ {0, 0.5, 1} s for which the
  onset rate at dt 0.1 is within 1 % of dt 0.025 (diagnostic, encounter
  stops off), smaller τ_on first. Biologically, a stop after an
  antennation of a few tenths of a second, and a brief loss of contact
  that does not count as a new meeting, are both plausible; the
  Stroeymeyt frames (0.5 s) cannot resolve either. (2) The dt check gets
  the power it needs for tail rows: --reps 6 and --obs 3600 (6× the
  data), on the box.
- **Encounter rule chosen (logged before implementing).** Comparing
  separate runs per dt could not resolve 1 %: the raw onset rate at dt 0.1
  moved by 5 % between two seed sets. The diagnostic therefore reads
  contacts on every 1st / 2nd / 4th step of the same dt-0.025 runs
  (`--sub`), which isolates detection; motion is already dt-invariant (the
  noEnc check). Onset rate per ant-s at detection dt 0.025 / 0.05 / 0.1
  (4 seeds × 20 min):
  - current rule: 0.0362 / 0.0352 / 0.0339 (−6.4 %);
  - τ_on 0 with τ_gap 0.5: 0.0335 / 0.0330 / 0.0322 (−3.9 %);
  - **τ_on 0.2 s, τ_gap 0: 0.0316 / 0.0315 / 0.0315 (−0.3 %)**;
  - every τ_on ≥ 0.2 is within 0.5 %.
  By the rule: **τ_on = 0.2 s, τ_gap = 0**. The new rule counts about
  12 % fewer encounters than the current one at dt 0.025, because grazing
  contacts under 0.2 s no longer stop an ant. encounterStop is free, so
  the fit absorbs this. Disclosed: `LASIUS_NEST_B` (option B, not
  adopted) changes meaning with it, since its stops now come 0.2 s after
  contact. Next: the dt check at --reps 6 --obs 3600 on the box.
- **dt 0.1 vs 0.05 with encounter episodes (717a041; 6 seeds × 22
  colonies × 1 h): 14 of 16 rows pass.** Every systematic shift is gone:
  still fraction +0.13 / +0.24 SE (CIs within ±0.4), all moving rows
  within ±0.04 SE, run means within ±0.08. Only the two P(still ≥ 10 s)
  rows fail, both on width: nurse +0.17 [−0.21, 0.55], forager +0.35
  [−0.21, 0.89]. The run took 401 s on 90 workers. **Next (logged before
  running):** the same check with --reps 36, which includes the 6 seeds
  above, for √6 narrower CIs. If both rows pass, dt 0.1 is adopted for
  the fit. If either still fails, dt 0.05 vs 0.025 runs at the same
  power, and the fit uses the coarsest passing dt (the gate's rule).
  Seeing the result does not change this rule.
- **Trip calibration: targets changed (logged before rerunning; the run on
  55d68fd is superseded).** The old run (trip mean 1177 s and foragerIn
  0.770, solved one input at a time) showed that the trip mean depends on
  the trip rate as well. At exploreGiveUp 1412 s the mean falls from 1359
  s (outRate 1/250) to 332 s (1/32000). `scripts/diagTripsByRole.ts`
  (colony 0, start point, true positions, 2 × 4 h) shows why. Nurses stray
  out of the entrance about 0.18 times per ant-h, for 10–15 s each.
  Foragers also make short excursions while walking (31 of 146 trips at
  1/2000 are under 60 s; 56 of 72 at 1/32000). Their real trips last
  about exploreGiveUp, which is a fixed timer (median 1415 s at 1/2000).
  So the model's trip durations have two humps, while the data's are
  skewed (light: median 144 s, mean 1025 s; about 255 complete trips per
  colony per 12 h). The trip mean reflects the mix and the shape, not
  what the in-nest fit depends on: how many foragers are in the nest
  (density) and how often ants pass the entrance. **New targets:**
  `trip.n` (complete trips per colony per 12-h phase, the same observer
  on data and model; sets the exit rate) and `foragerIn`, both means of
  light and dark. They are solved jointly on a 4 × 4 grid (exploreGiveUp
  600–2600 s × outRate 1/1000–1/8000, all 22 colonies, 12 h each) by
  interpolation in log coordinates, then confirmed at the solution.
  `trip.mean` and `trip.median` are reported against the data, not
  targeted. Disclosed limitation: the fixed give-up timer cannot give the
  skewed trip shape (a hazard-based give-up is the candidate if trip shape
  ever matters). The calibration runs on the final code (after the dt
  decision), at dt 0.1 unless the dt rule says otherwise.
- **dt 0.1 vs 0.05 at 36 seeds × 22 colonies × 1 h: 15 of 16 rows pass;
  dt 0.1 is not adopted.** The remaining failure is a small real shift,
  not width: P(still ≥ 10 s) forager +0.55 SE [0.32, 0.79]. Also seen,
  but inside the bound: still forager +0.27 [0.23, 0.32], nurse +0.13
  [0.10, 0.17]. Everything else is within ±0.2 SE. By the logged rule:
  dt 0.05 vs 0.025 at the same power is next, and the fit uses the
  coarsest passing dt. To save a round trip, the trip calibration
  (b8c8001) runs at dt 0.05 at the same time. If 0.05 fails too, it is
  rerun at the adopted dt. The residual forager-only term is not chased
  further unless 0.05 fails.
- **dt 0.05 vs 0.025 at 36 seeds × 22 colonies × 1 h: 16 of 16 rows
  pass; dt 0.05 is adopted for the step-4b fit** (coarsest passing dt, by
  the logged rule). Largest shifts: P(still ≥ 60 s) nurse +0.14 SE [0.05,
  0.24], still forager +0.13 [0.08, 0.17], P(still ≥ 10 s) forager +0.11
  [−0.11, 0.35]; all others within ±0.06. The forager term that failed at
  0.1 vs 0.05 (+0.55) has shrunk to within the bound. 5988 s on the box
  beside the calibration (`logs/checkS2018-dt-episode36-fine.json`). The
  trip calibration already running at dt 0.05 (b8c8001) stands. Next: the
  window check, then the fit, both at dt 0.05.
- **Trip calibration at dt 0.05 done (b8c8001, 156 min):** exploreGiveUp
  2147 s, outRate 1/7271 /s (`data/fits/s2018-trips.json`, on the box).
  Confirmation at the solution: trips 235.2 per colony per 12 h (−0.22
  SE), foragerIn 0.771 (+0.03 SE). Reported only: trip mean 1283 s (data
  1177), median 2148 s (data 283; the disclosed shape limit of the fixed
  give-up timer). The grid bracketed the targets (solution inside it).
  **The provisional inputs used by the dt checks (1000 s, 1/3500) are
  2.15× and 2.08× off, beyond the logged 2× bound**, so by that rule the
  dt check (0.05 vs 0.025, 36 seeds × 1 h) is rerun at the calibrated
  inputs, alongside the window check (both on the box, 120 workers each,
  tags `calib36-fine`, `calib`). If the dt rerun passes, the fit runs at
  dt 0.05 with these trip inputs.
- **Reruns at the calibrated trip inputs (2147 s, 1/7271 /s), 2026-10-11
  night, on the box.** dt 0.05 vs 0.025 (36 seeds × 22 colonies × 1 h):
  **16 of 16 rows pass; dt 0.05 confirmed**
  (`logs/checkS2018-dt-calib36-fine.json`). Window check (start point,
  light, 1 seed per colony, 20-min warm-up, prefixes of a 12-h run;
  `logs/checkS2018-window-calib.json`): **2 h fails 3 of 16 rows** (forager
  P(still ≥ 2 s) −0.33 SE [−0.63, −0.07]; nurse P(still ≥ 10 s) −0.19
  [−0.53, 0.16]; forager P(still ≥ 10 s) −0.79 [−1.39, −0.18]); 30 min fails
  7. **Caveat:** window mode had dt 0.1 hard-coded, so this ran at dt 0.1,
  not the adopted 0.05 (now a `--dt` option, default 0.1 so old runs
  reproduce).
- **Next (logged before running): the window check again at dt 0.05 with a
  2-h warm-up.** Hypothesis: the 2-h failures are a warm-up transient, not
  the window length. The warm-up (20 min) is far shorter than the forager
  cycle at the calibrated inputs (stays ≈ 4000 s, give-up 2147 s), so the
  first 2 h after it are not yet steady state. All three failures are
  still-run tails, two of them in foragers, and all have the sign of a
  short window. **Rule:** if 2 h passes (16 of 16) after the 2-h warm-up,
  the fit uses 2 h warm-up + 2 h. If it fails, the logged rule applies
  (longer window, recheck): the 12-h phase unless an intermediate window
  is added to the script and passes. Seeing the result does not change
  this rule.

**2026-10-11 — E1: Khuong positions are in-plane, not projected (user question).**
- **Question:** could the E1 incline misfit come from the tracker
  recording camera-projected positions of the tilted canvas (y shrunk by
  cos θ)?
- **Check (all 5 incline files; geometry only, no behavioural statistic):**
  raw track ends along the slope axis sit at a median ≈ 262 mm at every
  incline (projection would give ≈ 131 mm at 60°), and the median 0.4 s
  step length along y vs x is 1.03–1.14 at every incline (projection would
  give 0.5 at 60°). The y-noise rising as 1/cos θ (`slope-walking.md` §5)
  is what rescaling a foreshortened image to the plane produces, so it
  supports corrected coordinates. **Projection is ruled out** as a cause;
  our 2-D plane walker compares like with like.
- **Doc fix:** `lasius-niger.md` and `DATA.md` said the files end at
  0.2 m; raw tracks run to a median ≈ 0.26 m (up to 0.37 m) and are cut at
  0.2 m by the authors and by `KHUONG_PREP`. No code or results change.
- **Contamination:** 20° and 45° are already development; nothing
  held-out (Bonavita 2026) was opened.
- **Window recheck at dt 0.05 with a 2-h warm-up: the warm-up hypothesis is
  rejected.** 2 h still fails the same 3 rows, with smaller shifts of the
  same sign (forager P(still ≥ 2 s) −0.25 SE [−0.54, 0.04]; nurse P(still ≥
  10 s) −0.16 [−0.54, 0.19]; forager P(still ≥ 10 s) −0.41 [−1.04, 0.18]);
  30 min fails 7 (`logs/checkS2018-window-calib-w2h-dt05.json`, 1326 s on
  240 workers, wall time set by the largest colony). Reading: short windows
  shorten still-run tails (runs cut at the window edges), a window effect,
  not a transient. **Next (logged before running), by the rule "longer
  window, recheck":** 4-h and 6-h prefixes (new `--windows` option),
  dt 0.05, 2-h warm-up, same seeds. The fit uses 2-h warm-up + the shorter
  of the two that passes 16 of 16, else the full 12-h phase. Cost
  reference: 2-h warm-up + 12 h took 1326 s wall per colony set, so one
  evaluation (22 colonies × 2 phases) is about 22 min at 12 h, ≈ 9 min at
  4 h, ≈ 12 min at 6 h.
- **Window check, 4 h and 6 h (dt 0.05, 2-h warm-up; `logs/checkS2018-
  window-calib-w46h-dt05.json`):** 4 h fails 1 of 16 (forager P(still ≥
  10 s) −0.46 SE [−0.78, −0.14]); **6 h passes 16 of 16. The fit uses
  dt 0.05, 2-h warm-up + 6-h window** (`fitS2018.ts --dt 0.05 --warmup
  7200 --obs 21600`), trip inputs 2147 s, 1/7271 /s. All pre-fit checks
  are done. **Cost estimate:** a generation (≈ 10 points × 22 colonies, on
  240 workers) is bound by the largest colony's 8-h run, ≈ 13 min (from
  the 14-h run's 1394 s); at up to 100 generations × (two starts + one
  restart) that is up to ≈ 65 h, against ≈ 10 h estimated for 20 min +
  2 h windows. tolX may stop starts earlier. Launch waits for the user
  (box time).
- **Fit launched, start 0 only (user, 2026-10-11 night):** `fitS2018.ts
  --dt 0.05 --warmup 7200 --obs 21600 --runs 0 --restart 0 --tag s0`
  (new `--runs`, `--restart` options; seeds keyed by run index, so start 0
  is the same as in the full design). Up to 100 generations, ≈ 22 h at
  most. Start 1 and the IPOP restart are decided from how start 0
  converges.

**2026-10-12 — start 0 stopped; colony fast path and fit checkpoints (user request).**
- **Start 0 stopped by the user** at gen 30 after 24.4 h (log archived in
  `logs/box-2026-10-11/fitS2018-s0.log`): best 32125 → 12751, median
  23006, σ 0.97 → 2.84 (rising: still moving, not converging). Generations
  took ≈ 45 min, not the estimated 13 (240 hyperthreads, 8-h runs bound
  by the largest colony). The CMA state was not saved, so the run cannot
  be continued; a relaunch with the same tag replays it exactly. Trip
  inputs file `data/fits/s2018-trips.json` copied from the box into the repo.
- **Fast path adopted from `side-projects/colony-fastpath`** (reviewed;
  `ColonyOptions.fastPath`, default on): (a) contacts sensed once per nearby
  pair (`senseAllContacts`, `src/sim/perception/contactPairs.ts`) with a
  geometry cache reused only while both bodies' positions and headings are
  bit-identical (far pairs included); exact by construction, since the
  contact tests are symmetric and IEEE subtraction is antisymmetric, and
  each ant's list keeps ascending partner order; (b) a nest worker resting
  at the start of a step gets `perceiveResting` (contacts, region, light,
  temperature: all its rest-mode decision reads) and the full percept if it
  walks within the step; every `onStep` consumer reads only contacts and
  `inNest`; (c) `ContactGrid` is incremental (moves only ants that change
  cell, keeps a cell's neighbour list until its 3 × 3 block changes).
  **Not adopted:** `restDecision.ts` (a hand copy of the nest policy taking
  `Body`; breaks the perception boundary and would diverge silently if the
  policy changes; ≈ 5 %). **Checks:** fast tier 137 pass, incl. new
  fastPath on/off equality tests (Bles with sharing; Stroeymeyt with
  B-stops; Stroeymeyt with trips); largest colony (122, 151 ants) at fit
  settings (dt 0.05, 400 + 1200 s): rows hash identical to HEAD, 15.7 /
  14.7 s → 7.3 / 7.6 s (**2.0×**). The simulation hash changes (code), so
  results reproduce but run hashes and precomputed pages are new.
- **Checkpoints:** `cmaes` takes `checkpoint`/`resume` (full state incl.
  the RNG's cached Gaussian, `RNG.snapshot/restore`); resumed runs are
  bit-identical (unit test with bounds, noise, averaging, JSON round trip).
  `fitS2018.ts` saves `logs/fitS2018-<tag>.ckpt.json` atomically after the
  probe, after every generation and after each finished start; rerunning
  the same command resumes; a checkpoint from other inputs (sim hash,
  options) is refused. End-to-end check: a tiny fit resumed after its probe
  wrote an output identical to the uninterrupted run. Losing the box costs
  at most one generation (and its selection scoring).
- **Logs:** one line per generation (best, median, σ, minutes for that
  generation and the session, UTC time), the decoded mean every 5.
- **Next:** relaunch start 0 on the box (same command, `--tag s0`); at
  ≈ 2× it should reach gen 30 in ≈ 12 h and replay the stopped run's log
  exactly (gen 0 best 32125.3), which doubles as a check of the fast path
  on the box.
- **Relaunched** (user approved): box on 794f598 via bundle (its
  uncommitted pre-commit files saved in `/root/ants2-pre-794f598/`), fast
  tier 136 pass, same command as before with `nohup`. Check: gen 0 should
  print best 32125.3, median 43971.3.
- **Start 1 launched beside start 0 (user, "go for it" on the idle
  workers):** each generation waits for the largest colony (151 ants;
  sizes 40–151), so ≈ 1/3 of the box idles (sum of sizes / 22 × max =
  0.68). Start 0's generations cannot be shortened without changing its
  results, so start 1 (planned anyway) uses the idle capacity: `nice 19`,
  `--runs 1 --restart 0 --tag s0 --name s0-r1` (new `--name`: file names
  only; seeds keyed by tag, so it equals start 1 of the full design).
  Hyperthread sharing may slow start 0 somewhat; watch its minutes per
  generation. **For the restart:** merge the two checkpoints' `done` lists
  into one checkpoint keyed `RUNS [0,1], RESTART true`, then run
  `--runs 0,1 --restart 1 --tag s0`.
- **Start 1 paused (SIGSTOP, pid 62829 on the box) 2026-10-13 02:28; the
  "idle capacity" idea did not hold.** Start 0 alone: gen 0 reproduced the
  stopped run's log exactly (best 32125.3, median 43971.3, σ 0.972: the fast
  path is exact on the box). Gen 0 took 39.8 min with start 1 running
  (old run ≈ 41 min per early generation: no gain); **gen 1, start 1
  paused, took 19.6 min (2.1×)**. A `nice 19` job still shares hyperthreads
  and memory bandwidth with the main fit, and halved its speed. Start 0
  alone: ≈ 20 min/generation, gen 30 in ≈ 10 h, 100 generations ≈ 33 h.
  Resume start 1 (`kill -CONT 62829`) only when start 0 has finished, or
  as a separate run on a second box. Local timing for reference: the largest
  colony takes ≈ 2 min for 2 h + 6 h here, ≈ 20 min on the box.

**2026-10-14 — faster-fit options surveyed; none adopted (user request).**
- The user pasted start 0's log up to gen 43 (best 4317.9, median 7483.9,
  σ 3.015; ≈ 60 min/gen since gen 28 against ≈ 22 min early). At the user's
  request the options for a faster fit are surveyed in
  `docs/faster-fit.md`: bit-identical routes (profile at the current mean
  before any allocation refactor — the existing profiles were taken at the
  start point; faster cores rather than more, since one colony task on one
  core bounds a generation; a one-generation `SIM_WORKERS` benchmark),
  cheaper-search routes behind a rule logged in advance (multi-fidelity
  generations at dt 0.1 / 2-h window, colony-subset screening, shared
  warm-up snapshots behind an equivalence check, parameter fixing behind
  an identifiability check), and gated changes (5-h window, dt corrections)
  recorded but not recommended.
- **No decision taken and nothing changed:** start 0 continues untouched;
  its checkpoint cannot resume under changed simulation code (the
  checkpoint key carries the sim hash), so any code option applies only to
  start 1, the restart, or a later fit. Recommended order is in the
  document (§ Recommended order): faster-core box and worker benchmark
  before the next launch, profiling locally at the current mean, and a
  logged multi-fidelity rule for the restart if speed is still needed.

- **Later 2026-10-14 (box 10-15 05:04 UTC):** start 0 at gen 56 (best
  2250–2590, median 3273–4385, σ 1.74), ≈ 110 min/gen and still rising;
  the box restarted once (resumed at gen 53 from the checkpoint).
  At the gen-55 mean, nurse.nestPauseFactor is 0.033, close to its lower
  bound of 0.01. At ≈ 110 min/gen the remaining 44 generations to the
  100-generation cap take ≈ 80 h, before start 1 and the restart. The
  user is weighing whether to stop; advice given: stop and copy the
  checkpoint home, do a local per-row diagnosis at the current mean
  before any further box spend. No decision yet.
- **Start 0 stopped (user, 2026-10-14):** killed by pid at gen 57 (box
  05:06 UTC; gen 57's partial work lost; checkpoint at gen 56 →
  `cma.generation` 57). Box files copied to `logs/box-2026-10-15/`
  (checkpoint and log sha256-verified against the box; `s2018-trips.json`
  identical to ours; box repo clean at ad5b31f, no `src`/`scripts`/`data`
  change since). Resumable bit-for-bit under the same sim hash
  (16c4c1d2dabf3c19). The box (vast instance 55873702) has to be destroyed
  by the user: Claude's self-destroy call was blocked by the permission
  classifier.
- **Phase floor:** the nest model has no light/dark dependence, so both
  phases' rows face one simulated row; the irreducible part of the loss
  from the data's phase differences is only **16.4** (largest: still.nurse
  6.6, still.forager 2.9). It does not explain a loss in the thousands.
- **Per-row diagnosis:** new `scripts/diagS2018.ts` (point from a
  checkpoint mean/best or the start; seeds under a new purpose `diag`, so
  fit, selection and judging seeds stay unused). Running locally at the
  gen-57 mean, fit settings → `logs/diagS2018-mean.{log,json}`.
- **Per-row diagnosis at the gen-57 mean (2026-10-15, fit settings, one
  seed per colony, 66 min locally; `logs/diagS2018-mean.{log,json}`).**
  Loss 2483 (the fit logged 2250–2590 near here). **The still-run
  distribution carries 72 % of it** (the eight `runStill.*` rows, 1798 of
  2483): the simulated rests are too short in the tail and too many at
  2 s. Nurse P(still run ≥ 2/10/60 s): data 0.52/0.14/0.031, sim
  0.64/0.11/0.008; forager data 0.44/0.105/0.026, sim 0.47/0.049/0.009;
  mean still run 14 s vs 5.5 s (nurse), 9.6 s vs 4.3 s (forager). Worst
  rows: runStill.P10.forager z −15…−19 (592), runStill.P2.nurse +14 (398),
  runStill.P60 both groups z ≈ −10 (≈ 190 each). Also forager speedMove
  3.51 vs 2.75 (z +9…10) and still fractions too high (0.995 vs 0.984).
  - **Structural reading (arithmetic, not a fit):** the data's P2→P10
    decay implies an exponential rate of 0.16 /s (nurse), 0.18 /s
    (forager), which would put P60 at 4e-5 and 1e-5; the data have 0.031
    and 0.026. A single rest-to-active rate per group gives geometric rest
    durations, so no value of the 10 free parameters can match all three
    quantiles: the data's rests are heavy-tailed (mixture of short and
    very long). The optimiser's drift to bounds/odd values (nurse
    nestPauseFactor 0.03 → bound 0.01; forager nestPauseFactor 35;
    restCrowdExp 1.9) is it compensating. More generations would polish a
    misfit.
  - This is the evidence that the logged **per-ant spread rule / activity
    trait** (Rules in force, "Per-ant spread rule (step 4)") anticipated,
    though from the run-length rows rather than the spread rows. Not yet
    checked against the rule's own statistic (z of log SD_sim/SD_data).
  - **No decision taken.** Candidate next step, needing the user's
    go-ahead and a logged design before any code: per-ant heterogeneity of
    the rest-to-active rate (e.g. lognormal multiplier, 1 extra parameter
    per group or shared), tested first with cheap local evaluations (not a
    new box), then a fit with the existing checkpoint abandoned (the
    model and so the hash change).
- **Spread rule, read early (2026-10-15, at the gen-57 mean, not an
  optimum; approximate: log ratio of colony means, SEs combined):** z of
  log(SD_sim / SD_data) for per-ant still fraction is −9.6 / −7.7 (nurse
  light / dark) and −11.2 / −10.9 (forager); the simulated between-ant SD
  is 0.005 vs 0.012–0.014 (nurse) and 0.013 vs 0.045–0.049 (forager). All
  four cells are far below the rule's −3 trigger. The rule is defined at
  the step-4 optimum, so this is a read-ahead, not the rule firing.
- **Open question before designing the trait:** is the heavy tail of
  still runs between ants (each ant exponential, rates differ → per-ant
  trait suffices) or within ants (each ant's own rests heavy-tailed → a
  second rest state or a waking hazard that falls with rest duration;
  a trait alone would not fix it)? Checkable from the fit-colony tracks
  with no simulation. Proposed next, not yet started.
- **Between- vs within-ant still-run tails (2026-10-15; fit colonies,
  data role fit; `scripts/diagS2018Runs.ts` → `logs/diagS2018Runs.{log,json}`).**
  Per-ant accumulators (same `InNestAccumulator`, checked to add up
  exactly to each colony's runs; `stroeymeytTracks.ts` factored out of
  `stroeymeytRows.ts`, colony112 rows reproduced bit-for-bit). Still runs
  ≥ base get a geometric excess with each unit's own mean; observed vs
  expected runs ≥ D. Ratios obs/exp (base 2 s; colony rate → ant rate →
  ant × 2 h rate):
  - nurse light: 10 s 0.39 → 0.43 → 0.49; 300 s 168 → 15 → 5.7.
  - forager light: 10 s 0.38 → 0.40 → 0.44; 300 s 1470 → 46 → 16.
  - dark phases the same pattern (nurse 300 s 75 → 8.8 → 4.1; forager
    639 → 29 → 12). From base 10 s, per ant: 30–60 s 0.48–0.62, 300 s
    1.75–2.9 (per ant × 2 h: 1.5–2.2). Colony-block log ratios for the
    per-ant variant: 22/22 colonies, SE 0.01–0.6, all signs consistent.
  - **Reading:** between-ant variation is real and large (per-ant rates
    cut the 300-s excess 10–30×; per-ant mean excess over 2 s has SD of
    log 0.63–0.76 across ants, sampling noise included), but **each ant's
    own rests are heavy-tailed**: too few medium rests and too many long
    ones relative to any exponential, barely changed by per-ant or
    per-ant-per-2-h rates (10-s deficit 0.38 → 0.44). A per-ant rate trait
    alone cannot fit the runStill rows. Needed in addition: a waking
    hazard that falls with time at rest within an ant (e.g. two rest
    states, light and deep; or a rate redrawn per rest from a gamma,
    i.e. Lomax durations). Caveat: observed still runs pass through the
    observer (threshold, noise, missed detections) and include walker
    pauses, so these are shapes, not parameter estimates.
  - **No decision taken.** Proposed next (cheap, data only): compare
    candidate rest-duration families per ant on these runs (exponential,
    two-exponential mixture, Lomax; with and without a per-ant scale)
    to pick the structure, then write the model change for approval.
- **Rest-duration shapes (2026-10-15; fit colonies, data role fit;
  `scripts/diagS2018Shapes.ts` → `logs/diagS2018Shapes.{log,json}`,
  per-ant run cache `logs/s2018-antRuns.json`; 8 min).** Still-run excess
  over a base (2 s, 10 s) fitted per colony × group, per ant, and with a
  shared shape plus per-ant scale; families exp, mix2 (light + deep rest),
  lomax (rate redrawn per rest from a gamma), weibull. Exp rows reproduce
  `diagS2018Runs` exactly.
  - **Exponential is out everywhere** (ΔBIC 48k–600k).
  - **Base 2 s (the fit rows' base): lomax per colony wins all 4 cells**,
    ΔBIC ≈ 19k–24k ahead of mix2; obs/exp at ≥ 10/30/60/120/300 s
    ≈ 0.95–1.0 / 0.9–1.02 / 1.03–1.19 / 1.33–1.37 / 1.07–1.61. Shape
    α 0.94–1.06 (shared-shape fits), i.e. per-rest waking rates roughly
    exponentially distributed. mix2 second: light share 0.85–0.90, deep
    rests 30–36× longer; misses 60–120 s (obs/exp 0.67–0.79).
  - **Base 10 s: mix2 and lomax tie** (mix2 ahead in 3 cells by ΔBIC
    0–2489, lomax in 1 by 471); mix2 light share 0.64–0.79, deep ×15–22;
    lomax α 0.87–0.93.
  - **Per-ant parameters do not pay under BIC once the shape is heavy
    tailed:** the per-colony structure beats shared-shape + per-ant scale
    in all 8 cells (ΔBIC 3.8k–35k). Under AIC the per-ant scale would win
    (e.g. nurse light lomax: −2 log L 6013 lower for 1489 extra
    parameters), so between-ant variation is real but modest next to the
    within-ant tail. Whether heavy-tailed rests alone reproduce the per-ant
    still-fraction spread is for the spread rule at the step-4 optimum,
    as logged.
  - Caveats: the `colony` structure gives each colony its own parameters
    (the model has one set per group); the α estimates agree across cells
    (0.87–1.06), so one shared shape per group looks adequate. Observed
    runs pass through the observer and include walking pauses.
- **Proposed model change (NOT adopted; for the user's approval):** each
  rest draws its own waking-rate multiplier from a gamma with mean 1 and
  shape `restShape` (one new free parameter, shared by nurses and
  foragers or one per group), so rest durations are Lomax and
  `restToActive` keeps its meaning as the mean rate; crowding
  (`restCrowdExp`) still multiplies the rate. Drawn from the ant's own
  RNG stream at rest entry, so the rest stays in rest mode (fast path).
  Fallback if a gamma with α ≈ 1 gives implausibly long rests in 8-h
  windows: mix2 (light/deep, two parameters). No per-ant trait unless
  the spread rule asks for it. Before any fit: unit tests of the
  duration distribution, one local evaluation at a hand-set point to
  time it and look at the runStill rows.

**2026-10-15 — Decision (user approved): rest depth drawn per rest; step 4b
restarts with it.**
- Each rest draws a walk-on multiplier G ~ Gamma(shape `restShape`, mean
  1); the walk-on rate is `restToActive × N^−restCrowdExp × G`. Alone
  (no crowding) rest durations are Lomax, S(t) = (1 + r t / α)^−α, the
  shape that won `diagS2018Shapes` from 2 s. `restShape` 0 means off
  (constant rate, no draw), so every existing model and result is
  unchanged.
- Drawn lazily from the ant's own policy RNG on its first rest step
  (every rest entry clears it: `toRest`, `enterNest`), so rests started
  inside a step and at set-up are covered; the ant stays in rest mode
  (fast path). One shape for nurses and foragers (the data's α agree:
  0.87–1.06), free in step 4b: k = 11, bounds [0.2, 50] (log), start 1.
- No per-ant trait (BIC, shapes entry); the spread rule at the optimum
  decides, as logged. Start 0's checkpoint is retired (the model and hash
  change); its log and checkpoint stay in `logs/box-2026-10-15/`.
- Before any fit: unit tests (gamma moments; a lone resting ant's rest
  durations against the Lomax survival), the fast tier, row-hash equality
  with `restShape` 0, then one local evaluation at a hand-set point at the
  fit settings to time it and read the runStill rows.
- **Implemented (2026-10-15):** `RNG.gamma` (Marsaglia–Tsang; shape < 1
  by boosting), `Stay.restMult` (NaN until the rest's first step),
  `restDepth` in `lasiusNestWorker.ts`, `restShape` in `LASIUS_NEST_DEF`
  (0, off) and in `S2018_FREE` (k = 11), `S2018_START.restShape` 1.
  Tests: `test/rng.test.ts` (gamma moments, shapes 0.4 / 1 / 3; seeding),
  `nestWorker.test.ts` (lone rests against the Lomax survival at
  0.25–30 s, r 2, α 2, 20 000 rests; off: exponential, no depth drawn).
  Fast tier 141/141. `diagS2018.ts` gains `--set` and decodes checkpoints
  with fewer coordinates. Sim hash changes (precomputed pages run live
  until `npm run precompute`).
- **Running:** one local evaluation at the gen-57 mean with restShape 1,
  fit settings → `logs/diagS2018-mean-depth1.{log,json}` (timing, and
  whether the runStill shape moves toward the data; not a fit point:
  the other parameters were pushed to compensate for exponential rests).
- **Result (2026-10-15): gen-57 mean + restShape 1, fit settings, 22
  colonies, one diag seed each; `logs/diagS2018-mean-depth1.{log,json}`.**
  **15.9 min per evaluation on 15 local workers (66 min before on 12)**:
  long rests stay in rest mode (fast path). Loss 11938 (2483 without
  depth; not a fit point, see above). **The tail rows came within reach:**
  runStill.mean nurse 15.7 vs 14.1–14.5 (z 1.6 / 0.9; was −8), forager
  9.7 vs 9.6–9.8 (z 0.2; was −8); runStill.P60 forager z 1.9 / 4.7 (was
  −10), nurse now over (z +9 / +12, was −10). **The loss moved to the
  short end:** P2 and P10 too high (nurse P2 0.76 vs 0.52, P10 0.35 vs
  0.14; foragers 0.60 vs 0.44, 0.21 vs 0.10), i.e. too few still runs
  under 2 s; still fractions 0.997 / 0.987 vs 0.984–0.989 / 0.944–0.953.
  Short still runs come from walker pauses (nestPauseFactor, nurse at its
  lower bound 0.03 in this point) and brief stops, which the old fit set
  to compensate for exponential rests. Whether the short end is reachable
  is not shown yet.
- **Short-end reachability check (2026-10-15, user approved; a look,
  not a fit; same diag seeds, fit settings):** from the gen-57 mean +
  restShape 1: A nurse.nestPauseFactor 30; B = A + restShape 2; C = B +
  restToActive ×2 (nurse 1.64, forager 2.84). Walker pauses (rate 0.05 /s
  × factor, mean ≈ 1 s) are the model's source of still runs under 2 s;
  at gen 57 nurses have almost none (factor 0.03). Outputs
  `logs/diagS2018-short{A,B,C}.{log,json}`.
- **Short-end check results (loss; minutes per evaluation):** depth1
  11938 (15.9), A 22317 (13.3), B 10152 (31.3), C 3849 (38.4).
  - **Walker pauses are not the lever:** A (nurse pauses ×1000) made the
    nurse short end worse (P2 0.76 → 0.82, P10 0.35 → 0.45, P60 0.053 →
    0.091). Reading: at gen 57 nurse activeToRest is 3.73 /s, so walks
    last ≈ 0.27 s, under one 0.5-s frame; rests then merge across walks
    the observer cannot see, making long still runs. The data's nurses
    walk visibly (runMove mean 1.07 s; sim 0.73–0.83). The lever is walk
    length (activeToRest), which the old fit pushed up to keep the still
    fraction high under exponential rests.
  - B and C moved every forager row toward the data (C: P2 z 6, P10 −8,
    runMove P2 +4, mean −1; was 29 / 28 / −7 / −7); nurse P2 / P10 still
    z 23 / 25 at C with nurse walks still 0.27 s.
  - Evaluation cost rises as rests shorten (13–38 min here): it depends
    on the point; the optimum's cost is not known yet.
- **D (running):** C with nurse.activeToRest 1 (walks ≈ 1 s) and the
  nurse pause factor back at gen 57's 0.03 → `logs/diagS2018-shortD.*`.
- **D result (loss 7650; 65.6 min):** nurse walks ≈ 1 s overshoot
  (runMove nurse mean 1.96 s vs 1.07, P2 0.39 vs 0.14), and the nurse
  short end crossed the data: P2 0.714 (C) → 0.448 (D) vs 0.52, P10
  0.260 → 0.079 vs 0.14. **Bracketing across the five points:** every
  runStill / runMove row and both still fractions for nurses have been
  on both sides of the data at some point (tails: over at depth1, under
  at C / D), so each is reachable one at a time; jointly not shown.
  Not yet bracketed: still.forager (0.976–0.987 vs 0.944–0.953, always
  too still; forager pause factor 35 untested as a lever) and
  speedMove.forager (always 3.4–3.6 vs 2.75; set directly by
  forager.nestSpeedFactor). Evaluation cost grows with walking: 13 → 66
  min locally as nurse walks lengthened.

**2026-10-15 — Preparing the step-4b refit (user: start point, cheap-phase
rule for approval, per-colony timing; and what of `faster-fit.md` to
implement).**
- **Done, results unchanged:** `SimPool.mapTimed` (each task's time in its
  worker); `simulateAll` submits the largest colony first (§1.2; seeds
  stay keyed by data index: the smoke evaluation's loss and every
  colony's rows are bit-identical to the data-order run); `diagS2018`
  prints per-colony times; `scripts/profS2018.ts` runs one colony in
  process for CPU profiles (§1.1).
- **New start point** (`S2018_START`, revised; old values in its comment):
  between probes C and D (development looks at fit data): nurse
  0.055 / 1.9 / 1.15 / 0.03, forager 0.087 / 1.07 / 2 / 5 (speed factor,
  activeToRest, restToActive, pause factor), encounterStop 0.7,
  restCrowdExp 1.88, restShape 1.4. START2 inherits the new values except
  its own overrides. Evaluating it at fit settings with timing →
  `logs/diagS2018-start2.{log,json}`.
- **Gates must be rerun under the new model (Rules in force: gates at a
  test point).** The 6-h window was adopted because shorter windows cut
  still-run tails at the edges (2026-10-11); heavier tails make that
  worse, so the **window check** (`checkS2018Window.ts --mode window
  --windows 14400,21600`, 2-h warm-up, dt 0.05) is rerun at the new start
  before any fit; fail → longer window, as logged. The **dt gate** passed
  at dt 0.05 vs 0.025 with exponential rests; rest depth adds no
  dt-dependent step (the draw is per rest, switching is exact in
  continuous time), so it is rerun with fewer seeds as a confirmation,
  not skipped.
- **PROPOSED, not adopted — cheap-phase rule (faster-fit.md §2.1) for the
  user's approval:**
  1. *Phase 1 (search only):* dt 0.1, 2-h warm-up + 2-h window (¼ of the
     full steps). Both starts (S2018_START, START2), λ = 11, initial SDs
     from a phase-1 probe. A start's phase 1 ends at the first of:
     generation-best loss < 300; σ < 0.25 (box units); 40 generations;
     tolX. 300 (RMS z ≈ 3) because the cheap settings' known biases
     (dt +0.55 SE on one row; 2-h window: still-run tails, larger with
     heavy-tailed rests) are a few units of loss each, small next to 300
     but not next to the tens of a good fit.
  2. *Selection:* each start's phase-1 estimate (mean of its last 5
     generation means) is scored at full settings on the selection batch
     (3 seeds × 22 colonies).
  3. *Phase 2 (the fit):* full settings (dt 0.05, 2 h + 6 h, or what the
     window recheck sets), CMA-ES from the better estimate, σ 0.5, SDs
     from a full-settings probe there, at most 60 generations, tolX 0.03,
     estimate = mean of the last 20 generation means, then the selection
     batch, as now.
  4. *The IPOP restart is dropped;* the two starts give the multi-start
     check. If the other start's full selection loss is within 20 % of
     the better one's and its estimate differs by more than 0.5 box units
     in any coordinate, phase 2 also runs from it.
  5. Phase-1 results are search tools under the pilot conditions (never
     reported as fit quality, judged, ranked or adopted); phase seeds are
     keyed apart. Only phase 2 is the fit, judged by the unchanged rules.
- **faster-fit.md, item by item:**
  - §1.1 profile at the current point: script ready; runs after the
    timing run (they would compete for cores). Allocation refactor only
    if the profile shows it.
  - §1.2 faster cores: decide with the per-colony times (a generation on
    a box with a core per task is the slowest colony). `SIM_WORKERS` =
    tasks per generation (242) at most, not the hyperthread count (start
    0 ran 440 workers for 220 tasks). Largest-first: done.
  - §2.1 multi-fidelity: the proposal above.
  - §2.2 colony subsets: not proposed now; it would stack a second
    approximation on phase 1 for less saving (the largest colonies set
    the wall time, and a stratified subset keeps them).
  - §2.3 shared warm-ups: not now. With heavy-tailed rests a warm-up
    under other parameters leaves rests drawn there running hours into
    the window, so the equivalence check is likely to fail, and the
    saving is ≤ 25 %.
  - §2.4 fixing flat parameters: after phase 2, by the identifiability
    check, as planned.
- **Approved by the user (2026-10-15):** the cheap-phase rule as
  proposed above, the gate rechecks, and the faster-fit.md choices.
- **Implemented:** `cmaes` option `stop` (`stopReason` 'stop'; a run that
  never stops is bit-identical, tested); `fitS2018.ts` rewritten for the
  two phases (phase-1 starts run side by side on one pool; per-run
  checkpoints keyed `p1-s0`, `p1-s1`, `p2-s…`; seeds keyed by phase and
  start; defaults are now the gated full settings, dt 0.05, 2 h + 6 h;
  no IPOP restart); `boxS2018.sh`: `SIM_WORKERS` capped at 484 (two
  starts × λ 11 × 22 colonies), `checks` = the window recheck (4-h and
  6-h prefixes, 2-h warm-up, dt 0.05) and the dt recheck (0.05 vs 0.025,
  12 seeds × 1 h), both tagged `depth`.
- **Box rented by the user (2026-10-15):** vast.ai, Denmark, AMD EPYC
  9534 (64 cores / 128 threads, whole chip; container quota ≈ 123 CPUs),
  251 GB, $0.307/h; `ssh -p 46397 root@85.218.235.6`, repo in
  `/root/ants`. Code: bundle of ff8e35c + this session's uncommitted
  changes as a patch (provenance will read dirty until committed);
  Node 22.22.1. Fast tier 141/141 (20 files; `test/local` stays here).
  **Run hash identical to local** (colony 112, 60 + 300 s:
  4b0c6225…77576). **Two-phase fit smoke test** (tiny windows, 3 + 3
  generations): runs end to end; **killed mid-phase-1 and rerun, the
  result equals the uninterrupted run exactly** (selection loss, estimate,
  every run's key, f, x, generations, stop reason).
- **Running on the box:** worker benchmark (§1.2): 242 tasks at phase-1
  settings (start point, 11 seeds × 22 colonies, dt 0.1, 2 h + 2 h) with
  120 workers, then 62 → `logs/bench-w*.{log,json}`, `logs/bench.txt`.
- **New start point evaluated (local, fit settings, diag seeds;
  `logs/diagS2018-start2.{log,json}`):** loss 2673 at the start, about
  where start 0 got after 57 generations; worst rows runMove.P2.forager
  z 22 (walks too long), runMove.mean.forager 14, runStill.P2.nurse 12,
  speedMove.forager 11; every other row |z| ≤ 10. **Timing (laptop, 15
  workers on 8 cores / 16 threads):** 567 worker-minutes per full
  evaluation; slowest colony 43.9 min (colony201, 143 ants), median 29.2,
  smallest 2.9; wall 43.9 min = the slowest colony (largest-first).
- **Worker benchmark (box, 242 tasks at phase-1 settings, start point):
  62 workers 603 s, 120 workers 704 s; same loss (2572.6).** Hyperthreads
  add no throughput here (1177.5 worker-min at 120 vs 590.6 at 62 for the
  same tasks); with 120, the largest colony runs at half speed and sets
  the wall (11.7 vs 7.0 min). `boxS2018.sh` now uses one worker per
  physical core − 2. Box vs laptop: one box worker ≈ 2.6× a laptop
  worker under full load (cheap evaluation ≈ 54 vs ≈ 142 worker-min).
- **Fit cost estimate, this box, 62 workers, at the start point's
  costs:** phase 1 (both starts side by side) ≈ 20 min per generation;
  phase 2 ≈ 40 min per generation (242 full tasks ≈ 2360 worker-min,
  slowest task ≈ 28 min). With 20–40 phase-1 and 30–60 phase-2
  generations plus probes and selection batches: **≈ 30–55 h, ≈ $9–17.**
  Per-generation cost depends on the parameters (more walking costs
  more).
- **Gate rechecks launched on the box (2026-10-15, commit 7180735, 62
  workers):** `boxS2018.sh checks` → window (4-h and 6-h prefixes of a
  12-h run, 2-h warm-up, dt 0.05) then dt (0.05 vs 0.025, 12 seeds × 1 h),
  at the start point; `logs/checkS2018-{window,dt}-depth.json`, log
  `logs/checks-depth.log`. Rules as logged: the fit uses the shortest
  passing window (16 of 16 rows), else longer, recheck.
- **Gate recheck results (box, start point, commit 7180735;
  `logs/checkS2018-{window,dt}-depth.json`):**
  - **dt 0.05 vs 0.025: 9 of 16 not shown equivalent, but every
    difference is small (|diff| ≤ 0.40 SE); the failures are interval
    width at 12 seeds** (the 2026-10-11 gate needed 36). Not a bias
    signal; to be rerun at 36 seeds on whichever model goes forward.
  - **Window: 6 h vs 12 h fails 14 of 16, 4 h fails 15 of 16, up to
    3.6 SE**, with the sign of a drift, not of edge truncation: the short
    window has more long still runs per run (runStill P10 forager +3.6,
    P2 forager +2.2, P60 +1.0 to +1.9), shorter walks (runMove −0.7 to
    −1.6) and is less still (still.nurse −0.5). The colony is still
    changing 8–14 h after the start.
  - **Data check (fit colonies, per-ant cache):** still runs ≥ 30 min are
    rare and ≥ 60 min almost absent (per run ≥ 2 s: nurse 1e-5 / 5e-5,
    forager 6e-6 / 0; longest 56–143 min); beyond ≈ 10 min the tail falls
    with an e-fold of ≈ 7–9 min. The Lomax shape (α ≈ 1–1.4) has no
    cutoff: by rough arithmetic it gives on the order of 50× the data's
    hour-long rests. Reading: ants accumulate in hours-long rests that the
    data do not show, so the colony drifts; a heavy-tailed renewal process
    settles very slowly.
  - This is the condition of the logged fallback ("if a gamma with α ≈ 1
    gives implausibly long rests in 8-h windows: mix2"). **Before
    switching (logged before running):** one diagnostic window check with
    a near-exponential tail (`--set restShape=20`, otherwise the start
    point; same settings, tag `depth-shape20`). If 6 h then passes or the
    drift largely vanishes, the tail is confirmed as the cause and mix2
    follows by the logged fallback (user to confirm).
