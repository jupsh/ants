# Project status

_Last updated: 2026-10-16 (STATUS cleanup; fit C1 running on the box, phase 1). Keep this file current: update it whenever a step starts or finishes._

Earlier history is archived verbatim: up to 2026-10-10 evening (session
notes, step results, the first decisions log) in
[`archive/STATUS-2026-10-07-to-10.md`](archive/STATUS-2026-10-07-to-10.md)
("the archive"); the 2026-10-10 night entries (pilots, Buffin, Plan 4
options A and B, the B diagnostic, choosing Stroeymeyt) in
[`archive/STATUS-2026-10-10-night.md`](archive/STATUS-2026-10-10-night.md)
("the night archive"); the Stroeymeyt work from the colony split to the
frozen candidate C1 (2026-10-10 night to 10-15) in
[`archive/STATUS-2026-10-10-to-15.md`](archive/STATUS-2026-10-10-to-15.md)
("the Stroeymeyt archive"). This file keeps the current state, the plan,
the **rules in force**, the evidence policy and open problems. New
decisions go in the Decisions log at the end; when this file passes about
1,000 lines, archive again.

## ▶ RESUME HERE

**State (2026-10-16).** Milestone M1, *Lasius niger* as the single
reference species. Work is on `browser-sim-m1`, merged to `main` (GitHub
Pages) when the user asks (last merge `e1e6847`, 2026-10-16).

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
  Buffin's rate the 1999 fit pins parameters at bounds (option A fails the
  adoption rule), and that arena-sourced stop-and-go motion (option B)
  walks ≥ 12× the 1999 distance with 20–75× the contacts. So in-nest
  motion now comes from in-nest data, Stroeymeyt et al. 2018 (*L. niger*,
  22 tracked fit colonies), and 1999 is refitted afterwards with motion
  fixed (Plan, step 5).
  - **Steps 1–3 done** (2026-10-11): data, statistics code, rows
    (`data/reference/stroeymeyt2018-fit-rows.json`); branch rule R ≤ 2.
    In the nest, ants are still ≈ 95 % of the time and move at ≈ 0.27
    cm/s when moving.
  - **Step 4 (in-nest motion), current work.** The model as it now stands
    (Stroeymeyt archive): option-B structure refitted in the nest, rest
    depth (Lomax rests, `restShape`), encounter episodes (τ_on 0.2 s),
    water as in the experiment, the frozen detection tracker
    (`data/fits/s2018-tracker.json`), a per-ant walk-on factor σ 0.4
    (fixed), trip inputs of 2026-10-11. Frozen as **candidate C1**
    (`fda8ab3`); dt gate (0.05 vs 0.025) and window gate (2 h + 6 h, 4
    seeds) **pass** (Decisions log). **Disclosed failures going in:**
    short stops (P2 rows; the data's brief stills are slow steps just
    under the threshold, the model's are real stops), trip shape (30-s
    and 2-min survival, trip count), raw detection rate, moves clustered
    in time (near-movement share 0.29 vs 0.10).
  - **Fit C1 running** (bounded, exploratory; Rules in force) on the box
    since ≈ 00:53 UTC 2026-10-16: `/root/ants-w7`,
    `logs/fitS2018-c1.log`; budget ≈ 25 h / ≈ $8. Check at 01:40 (phase
    1, start 0 gen 3, start 1 gen 2): ≈ 8–9 min per generation per start.
    The phase-1 loss rule (< 300) is out of reach, so both starts run the
    30-generation cap. **Correction (check 04:32, gen 22 both starts):**
    the two starts run side by side (≈ 8.4 min per generation each, wall
    clock), not one after the other, so phase 1 ends ≈ 05:35 UTC (≈ 4.7
    h), not ≈ 09:15. Phase 2: 16.5–20 h at the logged 33–40 min per
    generation (those figures may assume a shared pool; phase 2 alone has
    all 62 workers), so **total ≈ 21–25 h, ≈ $6.5–7.7, within the budget**;
    still read the first phase-2 generations' time. At gen 22 start 0's
    generation best has hovered at ≈ 6200–7600 since gen 9 with σ ≈ 1.4–1.8
    (no contraction); start 1 (≈ 36 000, ≈ 6× start 0) sits in a different
    nurse regime (restToActive ≈ 0.06 vs 0.44, nestPauseFactor ≈ 5.6 vs
    0.034) with restShape near its upper bound (37 of 50); start 0's
    restCrowdExp is near 0 (0.03–0.12 of 1.25). The cross-start check will
    not fire, so the report says "best within this search budget".
    Phase-1 losses are search tools only, never fit quality.
    **Check 06:33:** phase 1 ended 05:26, both at the 30-generation cap
    (start 0 final σ 1.24, not contracted; start 1 σ 0.70).
    Selection-batch losses at full settings 5196 (start 0) and 31281
    (start 1), close to their last cheap generation bests (≈ 4800–5400,
    ≈ 31 000–32 000), so the cheap settings ranked the starts as the full
    ones do. Phase 2 from start 0 only (start 1 not within 20 %). Its
    full-settings probe put nurse.nestPauseFactor at the SD cap 0.50 (flat;
    the value ≈ 0.03 is near the 0.01 floor, pauses almost off), the
    others at 0.02–0.06. Phase-2 gen 0 at 06:22, 15.8 min (the logged 33–40
    min overstated it about 2×). **Phase-2 cap raised 30 → 60** (user,
    decided on run time only; Decisions log 2026-10-16 ≈ 06:45): resumed
    06:52 at generation 3 from the checkpoint, phase 1 not rerun; **end ≈
    21:50 UTC, whole fit ≈ 21 h, ≈ $6.5**. Stop at 60 under the existing
    rules, no further extension.
    **Check 15:11 (phase 2 gen 36 of 60):** generation best 1158–1517
    since gen 31 (gen 3: 4774), median rising (1718 → 2598), **σ growing
    2.5 → 4.0** (still moving, not contracting). Gen-35 mean: nurse
    restToActive 1.17, activeToRest 1.10, **nestPauseFactor 2.04** (the
    start-point probes only went to 0.3 and found it inert, so "short stops
    out of reach of the 11 parameters" may be wrong: check P2 rows in the
    report); forager restToActive 2.85, activeToRest 1.33, nestPauseFactor
    0.28; encounterStop 0.89; **restCrowdExp 0.00 (at its bound)**;
    **restShape 0.66 (< 1: Lomax rests with infinite mean; the window gate
    passed at 1.4 only — rerun it at the estimate before reading
    anything)**. Loss reference points (debiased fitZ², 32 targets, light
    simulation vs light and dark targets): light/dark floor 16.4 (nurse
    still 6.6, forager still 2.9); a model right up to sampling noise ≈
    30–50; all targets at 2 SE ≈ 130, at 3 SE ≈ 290; logged generation
    bests are minima of 11 noisy evaluations and flatter the estimate.
    **Check 15:58 (gen 39 of 60):** generation bests 849 (gen 37), 989,
    1240; median 1597–2687; σ still growing (4.20 → 4.54); ≈ 16.5 min per
    generation, so **end ≈ 21:45 UTC**. Prepared for the end: window gate
    at the estimate = `checkS2018Window --mode window --fit <estimate>
    --reps 4 --windows 21600 --warmup 7200 --dt 0.05` (same seeds and rule
    as the C1 gate).
    **Check 20:45 (gen 55 of 60):** generation bests 532–654 since gen 52,
    median 814–1036, **σ now contracting** (3.20 → 2.75); ≈ 17.3 min per
    generation, so the last generation ends ≈ 21:35 and the selection
    batch follows; post-fit chain still waiting (pid 62443).
    **Fit C1 ended 21:39 UTC** (20.8 h, 1389 evaluations; local copy
    `data/fits/s2018-motion-c1.json`, log `logs/c1/fitS2018-c1.log`):
    phase 2 stopped at the 60-generation cap, **not converged** (final σ
    2.07; it contracted only from gen ≈ 50, 4.5 → 2.1). **Selection-batch
    loss 620.3** (start 21 940). Estimate (mean of the last 20
    generations): nurse nestSpeedFactor 0.0498, activeToRest 1.74,
    restToActive 2.00, nestPauseFactor 0.150; forager 0.0720, 1.78, 4.06,
    0.531; encounterStop 0.982 (**at its bound**, fit rule); restCrowdExp
    0.148 (off its bound now); restShape 0.698 (< 1). **The mean was still
    moving across the averaging window** (last − first, box units of 4):
    restCrowdExp +0.86, nurse.nestPauseFactor −0.44, nurse.restToActive
    +0.31, forager.nestPauseFactor −0.19 (log); the estimate averages a
    drifting path. Fit file `provenance.commit` reads `7180735` dirty (the
    box's own stale HEAD); the code is `c544f6f` (above).
    **Window gate at the estimate: PASS, 0 of 16 rows** at 6 h vs 12 h
    (4 seeds, 88 runs, same rule; largest runStill.P10.forager +0.14 SE
    [−0.05, 0.32], still.nurse −0.13 [−0.25, −0.02]; `logs/c1/window-est.log`,
    `logs/c1/checkS2018-window-fit-c1est.json`). restShape 0.70 does not
    break the 6-h window. Read first, before any other output (as agreed). **Code the relaunched fit runs = commit `c544f6f`**
    (cap-raise change; box `fitS2018.ts`, `lib.ts`, `cmaes.test.ts`
    md5-identical to it, checked 16:05). All 244 tracked files under
    `src/`, `scripts/`, `test/`, `data/fits/`, `data/reference/` match
    `c544f6f` except two comment-only differences (`s2018Lib.ts`,
    `profS2018.ts` on the box still cite `faster-fit.md`, reworded in
    `a584559`); no code difference. Box worktree otherwise untouched while
    the fit runs, except `scripts/calibTrips.ts` (`--check`) and the new
    `scripts/reportS2018.ts`, copied at 17:14 (the fit does not import
    either; checked).
    **Post-fit chain (prepared 17:00, relaunched 17:14 with the trip
    checks; routine steps of the agreed sequence):** `logs/post-c1.sh` on the box (log `logs/post-c1.log`,
    end marker `logs/post-c1.done`) waits for the fit process to exit,
    requires `wrote data/fits/s2018-motion-c1.json`, then runs, writing to
    `logs/c1/`: (1) the window gate at the estimate (`window-est.log`; read
    first, before anything else); (2) `diagS2018` at the estimate (`--at
    start --set <all 11 fitted values>`) and at the start point, 4 'diag'
    seeds per colony each, paired (`diag-est.json`, `diag-start.json`);
    (3) per-ant activity through the frozen tracker at the estimate,
    12 h, seed 4242 as the σ runs (`logs/act/sim-sC1est-c*.log`); (4)
    trip statistics at both points, `calibTrips --check` (new, judge
    only: the trip inputs in use, nothing in `data/fits` written; the
    chain checks `s2018-trips.json` unchanged), 4 seeds, 12 h, dt 0.05,
    warm-up 7200 (`trips-est.json`, `trips-start.json`). New
    `scripts/reportS2018.ts` reads (2) and (4) and the fit file: per-row
    fitZ and combinedZ (SE_sim from seed spread within colonies), the
    start → estimate trade per row (paired shift), parameters against
    their bounds; tested on the s3 walkOn07 vs base outputs (reproduces
    the logged shifts). `scratch/simact.py` now sorts named sets (C1est)
    after σ values. Dry runs: `diagS2018 --set` with all 11 values,
    `tmpTrackerSim --set` (1 h).
    **Stale done file:** `logs/fit-c1.done` (06:52:16) is from the killed
    first run; the relaunch writes none. Check the process instead:
    `ps -eo pid,etime,args | grep "[n]ode .*fitS2018.ts --cheap"`; the
    end is `best selection-batch loss …` / `wrote data/fits/s2018-motion…`
    in `logs/fitS2018-c1.log`.
  - **Fit C1 done, report written** (Decisions log, 2026-10-16 night):
    loss 647 (4 seeds), not adoptable (encounterStop at its bound, 19 of
    32 targets > 3 SE), not converged (best within budget only). Short
    stops reachable after all (53 % of the loss, from 92 %), traded
    against the still-run tail and means; **per-ant persistence collapsed**
    at the estimate (nurse 6-h lag +0.09 vs data +0.43); trip shape
    unchanged (fixed give-up time).
  - **Update 2026-10-17 ≈ 05:15 UTC:** the speed line is closed (no arm
    of the 8 meets the logged rules; the short-still deficit stays a
    disclosed failure; Decisions log ≈ 05:08). The oracle colony-coupling
    diagnostic (design ≈ 05:11, pilot ≈ 05:14) runs on the box
    (`logs/orc/run-orc.sh`); read it against the pre-registered reading,
    nothing else. The persistence targets and the trip audit stay on hold.
  - **Earlier "Now" (user, 2026-10-16 ≈ 23:35; Decisions log):** in-nest speed
    fluctuation, targeted comparison at the start point (design logged
    before running), and the compact per-ant persistence targets
    (proposal logged; implemented in the shared statistics code while the
    comparison runs). No activity-matched restShape diagnostic (not a
    prerequisite). Then: entrance-excursion path audit, separate (trips;
    lognormal give-up implemented, off). **No new fit before both are
    done**; no Lomax replacement or restShape bound from the diagnostic
    alone (if a finite mean is required: restShape > 1). Step 5 only once
    motion is settled; the checks at the optimum (spread rule, crowding,
    stays) wait for an adoptable motion fit.
  - **Box (rented 2026-10-15):** vast.ai EPYC 9534, $0.307/h, `ssh -p 46397
    root@85.218.235.6`; fit worktree `/root/ants-w7`, synced by file copy,
    checksum-identical to `e168807` at launch (its git HEAD is older and
    reads dirty). Node via `. /opt/nvm/nvm.sh && nvm use 22.22.1`,
    **SIM_WORKERS=62** (one per core; 120 threads were slower). Old boxes'
    files in `logs/box-2026-10-11/`, `logs/box-2026-10-15/`.
  - Scratch, never commit (excluded locally in `.git/info/exclude`):
    `scripts/tmp*.ts`, `scripts/scratch/`. Logs: `logs/act/`, `logs/trk*/`,
    `logs/s3/`, `logs/sp/`, `logs/short/`, `logs/trips/`.
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
1. ~~**Data in**~~ **done** (2026-10-11): metadata and the 22
   main-experiment PreTreatment tracks in `data/stroeymeyt2018/` (range
   requests; no held-out file downloaded); scale 0.0229659 mm/px.
2. ~~**Statistics code before data**~~ **done:** `src/sim/analysis/inNest.ts`,
   reducer `scripts/stroeymeytRows.ts`.
3. ~~**Rows on the 22 fit colonies**~~ **done 2026-10-11: R ≤ 2 in
   both phases** (`data/reference/stroeymeyt2018-fit-rows.json`); no
   recruiter-specific change before step 5 (branch rule).
4. **Replace B's in-nest motion** (4a set-up done 2026-10-11; **4b: fit
   C1 running**, RESUME). Fitted to rows 2–3 (32 fit rows; provenance:
   fitted, Stroeymeyt fit colonies); row 1 (forager stays) and crowding
   as checks; the spread rule at the optimum. Row 4 (contacts vs density)
   still waits on the contact observer's validation against the
   authors' tool (Rules in force); body exclusion only if row 4 demands
   it.
5. **Back to Mailleux 1999:** motion fixed from step 4; refit only the
   trophallaxis parameters (returnRate, shareRate, receiveReserve,
   reserveSd; shareEnd stays at Buffin's rate), with 1999 nest density
   from the literature if available, else free. Distance and contacts stay
   fit rows but no motion parameter is free, so they test transfer.
   Contacts under B3 (≥ 0.04 s), ≥ 1 s as sensitivity. Same adoption rule
   (Rules in force). **Stopping rule
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
- **Box:** rented 2026-10-15 for step 4b (RESUME); whether it stays for
  step 5 is the user's call after C1.

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

Stroeymeyt 2018 in-nest rows (frozen 2026-10-10 night; full operational
definitions verbatim in the Stroeymeyt archive, "Stroeymeyt rows:
operational definitions"):
- **Roles:** main experiment, PreTreatment, 22 colonies = fit; age
  experiment PreTreatment (10 colonies) = held-out, not extracted until
  M1's final test; everything else unused and unopened.
- **Rows:** 1 forager stays (duration, path; contacts per stay with the
  contact observer), 2 in-nest speed, 3 still fraction (< 0.6 mm per
  frame; 0.14 mm sensitivity) and run lengths, 4 contacts vs density, 5
  density (input). Per colony × group × phase, then the mean over
  colonies with SE = SD / √22. Scale 0.0229659 mm/px (± 1.7 % systematic).
  Repeated reads of one tag in one frame: within 0.12 mm one detection,
  else all dropped. Out-of-order lines: put back in frame order with a
  reorder window of 8 lines; later lines dropped and counted (2026-10-11).
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
- **Step-4 cost:** each colony is simulated as a warm-up plus an
  observation window, not 24 h, the window set by the window gate (step
  4b below).
- **Contact observer (approved by the user 2026-10-11):** our own MIT
  front-contact observer, written from the paper's description and the
  published parameter values (0.6 mm, 10 s merging, 0.14 mm/frame asleep,
  2 min truncation, the two width ratios); no GPL code read or ported.
  Validated locally against the authors' GPL-3.0 tool run on the fit
  colonies; the tool and its outputs stay local (`.git/info/exclude`),
  only agreement statistics are committed. The agreement criterion is
  logged before the comparison runs.

Stroeymeyt step 4b, in-nest motion fit (collected 2026-10-16 from the
Stroeymeyt archive; each item traceable to its dated entry there):
- **Structure and free set (k = 11):** per group (nurses, foragers)
  `nestSpeedFactor` [0.005, 0.5], `activeToRest` [0.01, 10] /s,
  `restToActive` [0.001, 10] /s, `nestPauseFactor` [0.01, 100] (log);
  shared `encounterStop` [0, 1], `restCrowdExp` [0, 1.25] (1.25 a
  provisional search boundary, not a stability limit), `restShape` [0.2,
  50] (log; per-rest gamma walk-on multiplier, Lomax rests). Bounds box
  Mod-BCH as in the 1999 pilots. `S2018_FREE` in `stroeymeytTargets.ts`.
- **Fit rows (32):** per group × phase: still fraction (0.6 mm),
  moving-only speed, still-run mean, P(still run ≥ 2 / 10 / 60 s),
  moving-run mean, P(moving run ≥ 2 s); target the 22-colony mean,
  colony-block SE; loss Σ fitZ², debiased. One simulated window per colony
  serves both phases (the nest model has no light/dark dependence;
  irreducible phase floor of the loss 16.4, disclosed).
- **Fixed model choices (estimated, not free):** encounter = contact
  episode counted once it lasts τ_on 0.2 s (τ_gap 0), chosen for dt
  invariance; mode switching on a unit-rate exposure clock (exact in
  continuous time); water as in the experiment (two ad-libitum sources,
  crop → body uptake `cropWaterRate` 1/300 s, thirst `thirstFrac` 0.9 for
  accepting and soliciting only, never for leaving; water above the
  maximum excreted; a drink pauses the trip); role-wise initial water and
  crops (`STROEYMEYT_WATER_INIT`; accepted as a warm-up shortcut while
  original and revised starts converge to the same late-window behaviour,
  rechecked if walk-on rates or water parameters change); **per-ant
  walk-on factor σ 0.4** (lognormal, mean 1), selected from the activity
  diagnostics, a data-informed model choice to count beside the 11
  optimizer parameters, sensitivity 0.7; explorers cannot re-enter the
  nest chamber before giving up (`exploreOutside`, a device for the trip
  input). Off and kept in code: mix2 rests, lognormal per-trip give-up
  (`exploreGiveUpSd`).
- **Trip inputs:** `data/fits/s2018-trips.json` (2026-10-11): fixed
  give-up 2147 s, outRate 1/7271 /s. The v2 calibration (lognormal
  give-up) failed and is not used (`logs/trips/calibTrips2-failed.json`);
  the 30-s survival target is kept. Short entrance excursions are a
  hypothesis until a path audit shows a distinct class; then one
  separation rule for data and simulation alike.
- **Observer:** every Stroeymeyt script observes through the **frozen
  detection tracker** `data/fits/s2018-tracker.json` (`colonyFromData`;
  in-nest gap onset by observed class × time since detection resumed,
  per-ant multipliers through the hazard mapping, durations by
  time-since-resumed bin, per colony and role; estimated on even hours,
  validated on odd hours). Never re-estimated (`estimateTracker.ts
  --write`) without the user, and never tuned to make behaviour rows
  agree. Outside the nest, misses are independent at the colony rate: an
  explicit assumption whenever trip results are read.
- **Gates** (rule: per row the 90 % bootstrap CI of the paired difference
  inside ±0.5 SE_data, all 16 rows; never relaxed; a failing gate's rows
  and effect sizes go to the user before settings change): **dt 0.05**
  (vs 0.025, 36 seeds × 22 colonies × 1 h); **window: 2-h warm-up + 6 h**
  (vs 12 h, 4 seeds per colony, bootstrap units the 88 runs). Rerun at a
  test point whenever the model changes.
- **Two-phase fit rule** (approved 2026-10-15; caps for C1 logged before
  launch): (1) phase 1, search only: dt 0.1, 2 h + 2 h, both starts
  (`S2018_START`, START2), λ 11; ends at the first of generation-best loss
  < 300, σ < 0.25, the cap (C1: 30 generations), tolX. (2) Selection:
  each start's estimate (mean of its last 5 generation means) scored at
  full settings on the selection batch (3 seeds × 22 colonies). (3) Phase
  2, the fit: full settings, CMA-ES from the better estimate, σ 0.5, at
  most 30 generations for C1, tolX 0.03, estimate = mean of the last 20
  generation means, then the selection batch. (4) No IPOP restart; if the
  other start's selection loss is within 20 % and its estimate differs by
  > 0.5 box units in any coordinate, phase 2 also runs from it. (5)
  Phase-1 results fall under the pilot conditions (never reported as fit
  quality, judged, ranked or adopted); seeds keyed by phase and start.
- **C1 is diagnostic:** its estimates support no biological conclusions;
  report items as in the Decisions log (2026-10-15 late evening). No new
  behavioural mechanism and no relaxed gate without the user; no further
  model expansion this round (user, 2026-10-15).

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
- **Literature check, 2026-10-16 (user asked whether new literature is
  needed):** inspected abstracts and search-returned methods/results
  excerpts of Gallotti & Chialvo 2018, *How ants move: individual and
  collective scaling properties* (doi:10.1098/rsif.2018.0223), Charbonneau
  & Dornhaus 2015, *Workers 'specialized' on inactivity*
  (doi:10.1007/s00265-015-1958-1), and Crosscombe et al. 2026, *Dwell Time
  Outperforms Social and Chemical Predictors of Behavioural Transitions
  in Ants* (doi:10.3390/e28040451). These are **development literature in
  other species**, informing candidate mechanisms only; no parameters
  imported, raw data downloaded, or model changed. Search results also
  exposed qualitative findings from *Ants determine their next move at
  rest* (2016), *Short-term activity cycles impede information transmission
  in ant colonies* (2017), and *Random walks with spatial and temporal
  resets can explain individual and colony-level searching patterns in
  ants* (2024); these findings are not untouched validation evidence.
  **Read in full 2026-10-16 night** (user placed the three PDFs in the
  repo root; not committed): species and data sources checked first by a
  name search (*Pristomyrmex punctatus*, *Temnothorax rugatulus*,
  *T. albipennis*; every *Lasius* mention is a reference-list entry), so
  no held-out set (Stroeymeyt age-experiment colonies, Bonavita 2026, the
  fresh E2 candidates) was touched. Still development literature in other
  species; nothing imported (Decisions log, same night).
- **Mersch, Crespi & Keller 2013 tracking-method check (2026-10-16):**
  read the PubMed abstract and search-result excerpts for *Tracking
  individuals shows spatial fidelity is a key regulator of ant social
  organization* (doi:10.1126/science.1234316; *Camponotus fellah*).
  Looked for its supplementary tracking-error methods, but the publisher
  supplement was inaccessible; no positional-accuracy number was obtained.
  Development methods source only; no held-out data or other candidate
  papers opened for this check.
- **Stroeymeyt 2018 fit tracks, contact rates (2026-10-17 ≈ 05:43 UTC,
  overnight contact check):** a new statistic (pairwise contact onsets,
  near share) computed from the 22 fit colonies' PreTreatment tracks, as
  a check on whether the motion failures matter downstream; not a fit
  target. Colony 0's values were seen before the reading was logged (code
  check). The 10 age-experiment colonies and the Stroeymeyt SM results
  remain unopened.
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
    data). No held-out file has been downloaded. **Update 2026-10-16:**
    the fit colonies' rows, per-ant statistics, detection patterns and
    trip durations have since been used and inspected throughout step 4
    (fit data; development looks logged in the Stroeymeyt archive). The
    age-experiment (held-out) colonies are still undownloaded. One
    post-treatment result line was seen in the main text (2026-10-10
    night: exposed workers reduced their in-nest movement area); the
    PostTreatment recordings are unused.
    **Supplement file role confirmed 2026-10-16:** METHODS-ONLY;
    RESULTS-RESTRICTED. The `_SM-methods_ROLE-PENDING.pdf` label was
    stale. The previously inspected Materials and Methods sections and
    Fig. S1 caption are methods/development sources (exact exposure in
    `archive/STATUS-2026-10-10-to-15.md`, "Stroeymeyt 2018 methods read").
    This does not release the whole supplement for reading: other figure
    captions, tables, simulation/statistics sections and age-experiment
    results remain restricted. No full-document extraction, OCR, search
    or browsing to locate methods; use only a known, previously reviewed
    section, and resolve any uncertain section's scope before opening it.
    The 10 age-experiment PreTreatment colonies remain held-out; all
    PostTreatment recordings, survival, qPCR and simulation outputs stay
    unused. File renamed with the explicit suffix
    `_SM-methods_METHODS-ONLY_RESULTS-RESTRICTED.pdf`.
  - **Greenwald, Segre & Feinerman 2015** (Sci. Rep. 5:12496, *Camponotus
    sanctus*): **parameter and structure source, other genus; never a
    target or test** (user, 2026-10-11). Read in full
    (`docs/research/greenwald2015.md`). E6 exposure disclosed: its colony
    food-dissemination curve and network results were seen; nothing from
    it may set an E6-facing choice beyond the step-5 priors logged then.
  - **Planckaert et al. 2019** (Sci. Rep. 9:15620): unread; probably the
    same experiments as E6, so treated like E6 development until the
    overlap is checked from its methods alone.
  - **Lenoir & Ataya 1983** (Z. Tierpsychol. 63:213–232): development
    (structure source for in-nest resting); its abstract was seen while
    identifying the scan. **Role confirmed 2026-10-16:** DEVELOPMENT,
    not fit or held-out. Full-paper reading for hypotheses and mechanism
    choices is permitted; no numerical calibration target or independent
    validation claim follows from this role. The prior exposure is the
    title/English abstract on scanned page 1, logged and approved in
    `archive/STATUS-2026-10-10-night.md` ("new literature filed"). The
    `_ROLE-PENDING.pdf` filename was stale; renamed to `_DEVELOPMENT.pdf`.
    **Role audit only:** neither PDF was opened, rendered, searched or
    extracted during these two role assignments; decisions used STATUS
    and its archived exposure/approval records. No new paper results
    were inspected and the historical archive filenames are left intact.
  - **Buffin et al. 2011 and Mailleux et al. 2011:** abstract-level findings
    were relayed in the assistant's literature replies on 2026-10-10.
    These qualitative findings are development, not untouched test results;
    quantitative full-text results have not been read (night archive).

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
  moving; foragers' short stays within 2× the 1999 recruiter's speed.
  Step 4 (Stroeymeyt archive): rests are heavy-tailed within each ant
  (exponential rests cannot fit; Lomax adopted); strong rest crowding
  condenses colonies (bound 1.25); detection gaps are clustered and
  heavy-tailed (frozen tracker); per-ant activity persists for hours
  (walk-on factor σ 0.4); the short-stop deficit is a recorded failure.
  No valid colony fit yet.

## Open problems and backlog
- **Colony:** contact-triggered leaving (Table 2b, G3) not modelled;
  the dt dependence of contacts and timeInNest (late-signal test);
  encounters are geometric overlaps (ants brush past; redesign in the
  Plan); `leaveCropFrac`'s effect on nestmate departures (sensitivity with
  E6); load-mass constant `LOAD_MG_PER_UL` 1.08 mg/µL (0.6 M sucrose;
  E6's 1 M food ~4 % heavier, negligible).
- **Stroeymeyt step 4 (beyond C1's disclosed failures):** in-nest walking
  speed fluctuation (proposal parked until after C1); entrance excursions
  vs foraging trips; the data's light/dark trip-location difference (×2.5
  in median) not modelled; contact observer validation and row 4.
- **Fit speed:** options not taken (colony-subset screening, shared
  warm-up snapshots, fixing flat parameters before phase 2) are in the
  deleted `docs/faster-fit.md` (git history, last at `e1e6847`); the
  Stroeymeyt archive records what was adopted.
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
Earlier entries: the archive, the night archive and the Stroeymeyt
archive. Newest last.

**2026-10-15 (late evening) — User decisions after the diagnostics.**
1. **No new speed mechanism yet.** In-nest speed fluctuation stays out of
   the next exploratory fit; the **short-stop deficit is recorded as an
   explicit failure** (current evidence: brief still steps are mostly
   just-below-threshold slow steps in the data, noise-level stops in the
   model; slower walking alone does not reproduce them). Not established
   that speed fluctuation would resolve it, and estimating two parameters
   from step speeds carries its own modelling assumptions. **Proposal
   preserved** for a targeted comparison after the fit shows what the
   current parameters achieve.
2. **Trips: the 30-s target is retained;** the failed v2 calibration
   (`logs/trips/calibTrips2-failed.json`) and the **existing trip inputs**
   (`data/fits/s2018-trips.json`, 2026-10-11, fixed give-up) are kept; the
   confirmation also missed trip count and 2-min survival, so dropping
   the 30-s point would not resolve the inconsistency. "Extra
   non-foraging excursions" **remains a hypothesis** until a path audit
   confirms a distinct class of entrance excursions; then one separation
   rule, applied to data and simulation alike, and genuine foraging trips
   calibrated. Lognormal give-up stays implemented, off.
3. **Box kept.**
4. **Next milestone:** a **frozen candidate**, the numerical (dt) and
   settling (window) gates, then a **bounded exploratory joint fit** with
   the trip and short-stop failures disclosed. The fit is diagnostic: its
   parameter estimates do not support final biological conclusions.
- **Frozen candidate (C1), committed `fda8ab3`:** model at that commit
  (water, frozen tracker `data/fits/s2018-tracker.json` md5 ca6f24c2…,
  walk-on factor σ 0.4, give-up lognormal off), parameters `S2018_START`
  (k = 11 free in the fit), trip inputs `data/fits/s2018-trips.json` md5
  6ea0f3ad… (2026-10-11, fixed give-up 2147 s, outRate 1/7271 s), targets
  `data/reference/stroeymeyt2018-fit-rows.json`. Disclosed failures going
  in: short stops (P2 rows), trip shape (30-s and 2-min survival, trip
  count with a lognormal), the raw detection rate, temporal clustering of
  moves.
- **Gates on C1 launched (box, `/root/ants-w7` synced to `fda8ab3`):**
  window (4-h and 6-h prefixes vs 12 h, 2-h warm-up, dt 0.05; 22 workers),
  dt (0.05 vs 0.025, 36 seeds × 22 colonies × 1 h, 1200-s warm-up; 22
  workers), and beside them the agreed sensitivity runs at the start point
  (`diagS2018`, paired 'diag' seeds: base, thirstFrac 0.8 / 0.95,
  cropWaterRate ×0.2 / ×5, walkOnSd 0.7; 6 workers each, two chains) →
  `logs/s3/`, `logs/checkS2018-{window,dt}-s3.json`. Gate rule as logged:
  per row the 90 % bootstrap CI of the paired difference inside ±0.5
  SE_data; the fit uses the shortest passing window.
- **Bound for the exploratory fit (logged before launch; applies if the
  gates pass):** the approved two-phase design with tighter caps: phase 1
  (cheap search, both starts `S2018_START` and START2) at most **30**
  generations per start (was 40), phase 2 (full settings) at most **30**
  generations (was 60), estimate = mean of the last 20 generation means as
  designed; `--tag c1`. Expected cost ≈ 5 h + 20 h on the box, ≈ $8.
  Reported as diagnostic: per-row z, parameters at bounds, which rows the
  fit trades (moving runs and speed against short stops), the persistence /
  spread diagnostics of per-ant activity, the trip rows; no biological
  conclusions from the estimates.
- **User (2026-10-15 late evening):** interpretation confirmed: all 11
  motion parameters jointly on the 22 colonies, trip inputs fixed,
  lognormal give-up off for C1. **If both gates pass, launch within the
  logged ≈ 25 h / ≈ $8 budget.** Report sensitivity shifts; **flag
  mortality or continuing drift before launch.** If a gate fails, bring
  back the failed rows and effect sizes before changing settings or
  thresholds. In the fit report, distinguish "best result within this
  search budget" from evidence that the model cannot fit the data
  (agreement across starts, parameter bounds and persistent residual
  patterns set how strong that conclusion can be).
- **Mortality / drift under the sensitivity settings (local, scratch
  `tmpDrift.ts`, start point, current trip inputs, light, 14 h, one seed;
  colonies 40 / 67 / 143 ants; `logs/sensdrift/summary.txt`):** **no
  deaths** in any of 18 runs; nurse minimum water ≥ 0.894 (thirst 0.8:
  0.794, its own threshold), forager minimum ≥ 0.904; nurse water and
  nurse activity flat between 2–8 h and 8–14 h in every run. Flagged: in
  the 143-ant colony the largest-cluster share moves between windows
  (base 0.335 → 0.452, cropWaterRate ×0.2 0.314 → 0.423, thirstFrac 0.95
  0.380 → 0.282), single seeds, both directions, within the known swings
  (±0.10, 2026-10-15); the window gate (22 colonies, paired) judges drift.
  Transfers depend strongly on cropWaterRate (bouts to nurses per h, 143
  ants: base 115–129, ×0.2 56–63, ×5 240–254) while observed activity does
  not move: a sensitivity to report beside contact- or transfer-related
  results later, not a fit-row effect.
- **Gates on C1 (box; `logs/s3/`, `logs/s3/checkS2018-{window,dt}-s3.json`):**
  - **dt 0.05 vs 0.025 (36 seeds × 22 colonies × 1 h): PASS, 0 of 16 rows
    not shown equivalent** (largest |diff| 0.10 SE).
  - **Window: FAIL, 4 of 16 rows at 6 h vs 12 h** (4 of 16 at 4 h). 6 h:
    runStill.P2.forager −0.32 SE [−0.59, −0.05]; P10.nurse −0.16 [−0.54,
    0.20]; P10.forager −0.34 [−0.80, 0.12]; P60.nurse −0.30 [−0.55,
    −0.07]; the other 12 rows pass (|diff| ≤ 0.15). 4 h: P2.forager −0.26
    [−0.61, 0.09], P10.forager −0.26 [−0.82, 0.25], P60.nurse −0.53
    [−0.91, −0.15], P60.forager −0.16 [−0.53, 0.19]. Two of the four 6-h
    failures are interval width (CI spans 0), two are small shifts (≤ 0.32
    SE) with the CI past −0.5. Sign: the shorter window has *fewer* long
    still runs, the direction of edge truncation (runs cut at the window's
    end are not complete), and P60.nurse shrinks from −0.53 (4 h) to −0.30
    (6 h). The pre-water drift had the opposite sign (short window *more*
    long runs) and failed 14 of 16 up to 3.6 SE. One seed per colony.
  - **Sensitivities (diagS2018, paired seeds; shifts vs base in SE_data;
    loss base 21 940):** thirstFrac 0.8 / 0.95 and cropWaterRate ×0.2 move
    no row by more than 0.72 SE (losses 22 083 / 21 799 / 21 980);
    **cropWaterRate ×5** still.nurse −1.38, still.forager −1.12, others ≤
    0.73 (21 989); **walkOnSd 0.7** P10.nurse −4.48, P2.nurse −2.16,
    P2.forager −1.77, P60.forager +1.69, still.forager +0.95 (loss 20 232,
    lower than at σ 0.4).
  - Per the user: the window gate failed, so its rows and effect sizes go
    to the user **before any change of settings or thresholds; fit not
    launched.** Box idle since ≈ 00:07 UTC.
- **User (2026-10-16 early):** option 1: **four seeds per colony in total,
  the 6-h window and the gate unchanged**, original seeds retained, seed
  list fixed before running, all 16 rows reassessed once. If it still
  fails: **9 h vs 12 h under the same rule** (the fit's extra runtime and
  cost approved if 9 h passes). No relaxing the gate. Truncation is
  plausible (6 h smaller than 4 h) but sign alone does not exclude drift;
  the state logs are the separate evidence against drift; the gate judges
  the total window effect whatever its cause. **σ stays 0.4**; the lower
  loss at 0.7 confirms that colony-average targets can favour a value that
  worsens individual persistence: report that trade-off explicitly. Water
  uptake has a material effect: fitted conclusions are conditional on the
  chosen water parameters. dt pass resolves the numerical question for C1
  at the tested start point. If the window gate passes, launch the bounded
  diagnostic fit as agreed.
- **Window recheck design (fixed before running):** `checkS2018Window
  --mode window --reps 4 --windows 21600,32400 --warmup 7200 --dt 0.05`;
  runs = 22 colonies × reps 0–3; seed of colony i, rep r:
  `seedFor(2018, 'converge', 0x3d, i)` for r = 0 (the original seeds,
  reproducing the first check), `seedFor(2018, 'converge', 0x3d, i, r)`
  for r = 1, 2, 3. Units of the bootstrap = the 88 runs (as the dt gate's
  colony × seed runs); rule unchanged (90 % CI inside ±0.5 SE_data, all
  16 rows). The 9-h prefix comes from the same runs and is read only if
  6 h fails. Check: rep 0 reproduces the first run's rows.
- **Window gate, 4 seeds (box, `logs/s3/window-r4.log`,
  `logs/s3/checkS2018-window-s3r4.json`): PASS, 0 of 16 rows at 6 h vs
  12 h** (largest runStill.P2.forager −0.14 SE [−0.28, 0.00]; the four
  rows that failed on one seed: P10.nurse −0.02, P10.forager −0.04,
  P60.nurse −0.02, P2.forager −0.14). 9 h also 0 of 16 (not needed).
  Rep 0 reproduces the first run exactly (mean differences equal to
  7e-18 SE). Disclosed: bootstrap units are the 88 runs, as pre-logged
  (the dt gate's convention), not colonies. **6-h window kept; fit
  launched** as agreed: `fitS2018 --cheap-gens 30 --gens 30 --obs 21600
  --tag c1` (62 workers) → `logs/fitS2018-c1.log` on the box.
- **Fit C1 provenance:** the box worktree `/root/ants-w7` is synced by
  file copy (its own git HEAD is older and shows dirty); at launch its
  `src/`, `scripts/`, `data/fits/`, `data/reference/` were checksum-identical
  to commit `e168807` (verified after launch). Read the fit's
  `provenance.commit` with that in mind.

**2026-10-16 — STATUS cleanup (user request).**
- Decisions-log entries from the Stroeymeyt colony split (2026-10-10
  night) to the short-stop / trip diagnostics (2026-10-15 late evening)
  moved verbatim to `docs/archive/STATUS-2026-10-10-to-15.md` (checked
  byte for byte against the previous file); the C1 entry above stays.
  Rules still in force from them are collected in § Rules in force
  ("Stroeymeyt step 4b"); the contamination log gains the Stroeymeyt
  update and Greenwald 2015; RESUME, Plan and Results in brief rewritten
  around C1. `docs/faster-fit.md` deleted (user; git history at
  `e1e6847`); two code comments citing it now point to the archive.
  `side-projects/faster-fit/` still cites it (the user's directory, left
  alone).
- Correction to the 2026-10-16 01:40 fit check: the phase-2 estimate was
  given as ≈ 33 min per generation only; the logged start-point cost is
  ≈ 40 min, so the total is ≈ 25–29 h (RESUME), at or over the ≈ 25 h
  budget.

**2026-10-16 ≈ 06:45 UTC — fit C1: phase-2 cap 30 → 60 (user).**
- Decided on measured run time only, before any phase-2 result after
  generation 0 was looked at (seen so far: phase-1 ends, both selection
  losses, the phase-2 probe SDs, phase-2 gen 0's best 5082 / median 5340
  and its 15.8 min). Phase 2 at ≈ 16 min per generation makes 60
  generations ≈ 21 h total, ≈ $6.5, within the approved ≈ 25 h / $8; the
  cap was cut to 30 for budget only, so this restores the design's search
  allowance. Phase 1 stays at 30 (already done; not rerun).
- **Stopping:** 60 under the existing rules (tolX 0.03, tolUpSigma), and
  no further extension to obtain convergence. More generations give the
  search a better chance to settle, not a guarantee of tolX; σ alone does
  not describe the search width (the covariance matters: the tolX rule
  uses σ·max(D)).
- **Estimate:** the mean of the last 20 generation means is scored itself
  at the selection settings (`score(r.meanAvg)`, full settings, 3 seeds
  per colony), never inferred from the losses of the averaged points. Already so in the code; unchanged.
- **Mechanism:** a validated cap increase, not removing the cap from the
  checkpoint key: `loadCheckpointRaised` (`scripts/lib.ts`) lets named
  numeric key fields only grow, all others must match exactly, and
  `fitS2018.ts` refuses a raise once any phase-2 run has finished and
  records it (`optimizer.phase2.maxGenerationsRaised`). Optimizer state
  (mean, C, paths, σ, RNG snapshot, averaging window), completed
  generations and saved runs come from the checkpoint; `maxGenerations`
  is only cmaes's loop bound and generation seeds depend only on the
  generation index, so the resumed run is the run that would have had cap
  60 from the start (test: `test/cmaes.test.ts`, resume under a raised
  cap is bit-identical to the long run). The generation in progress when
  the process is stopped is rerun with the same seeds.
- **Readings kept in scope:** the cheap/full agreement holds for the two
  selected candidates only; it supports the start choice, not that the
  cheap objective preserves rankings across parameter space. The flat
  nurse.nestPauseFactor direction is a result to report, not a reason to
  widen this run's model or bounds.
- **Done 06:52 UTC.** A script on the box (`logs/switch-c1.sh`, log
  `logs/switch-c1.log`) waited for the generation-2 checkpoint (06:52:14),
  killed only that run's pids (main, npm, sh, its 62 workers), copied the
  checkpoint to `logs/fitS2018-c1.ckpt.pre-gens60.json` (not opened) and
  relaunched `--cheap-gens 30 --gens 60 --obs 21600 --tag c1`, SIM_WORKERS 62,
  appending to `logs/fitS2018-c1.log` after a `=== resumed` marker. The
  script's own "left alive" check was broken (malformed `ps` list, counted
  0 regardless); checked by hand instead: no old pid alive, exactly 62
  workers, all under the new run. Start-up lines (only these read): cap
  raised 30 → 60, phase 1 both "done before (checkpoint)" with the same
  selection losses, phase-2 probe SDs identical, "resuming at generation
  3"; at most seconds of generation 3 were lost. New tests pass locally
  (158/158) and on the box. **Provenance:** the box now differs from
  `e168807` in `scripts/lib.ts`, `scripts/fitS2018.ts`,
  `test/cmaes.test.ts` (sha256 prefixes 69bd13317d4e, f12ca5e7b5e2,
  b4bc66512736; uncommitted local changes, same files); simHash unaffected
  (it does not cover `scripts/`). Expected end ≈ 21:50 UTC 2026-10-16
  (57 generations × ≈ 15.5 min + scoring), whole fit ≈ 21 h, ≈ $6.5.

**2026-10-16 night — fit C1: diagnostic report.** Best within this search
budget, **not** evidence that the model cannot fit: phase 2 ran from start
0 only (start 1 not within 20 %), stopped at the 60-generation cap without
converging (σ 2.07, contracting only from gen ≈ 50), and the mean was
still drifting across the 20 averaged generations (restCrowdExp +0.86 box
units of 4, nurse.nestPauseFactor −0.44). Outputs `logs/c1/` (box chain
`logs/post-c1.sh`); report `scripts/reportS2018.ts` (new);
persistence `scripts/scratch/simact.py` → `logs/c1/simact.txt`.
- **Window gate at the estimate: PASS** (0 of 16; RESUME). Read first.
- **Loss:** selection batch 620.3; `diagS2018` at the estimate, 4 fresh
  'diag' seeds per colony, 646.9 (start 21 316, same seeds). Reference
  points: floor ≈ 16, sampling noise ≈ 30–50, all rows at 2 SE ≈ 130. 8
  of 32 targets at combined |z| ≤ 2, 13 ≤ 3, **19 > 3**.
- **Where the 647 sits:** short stops (runStill P2, P10) 341 (53 %; at
  the start 92 %), moving runs 110, long stops / still-run means 93,
  stillness 74, speed 28. Worst rows (z light / dark): runStill.P10.nurse
  7.2 / 7.2; runStill.P2.forager 6.7 / 7.4; runMove.P2.forager 7.0 / 6.4;
  runStill.P10.forager 5.1 / 7.7; still.nurse −3.2 / −7.8 (part of it the
  light/dark floor: the model has no phase dependence); runStill.P2.nurse
  5.5 / 4.7; runStill.P60.forager −5.0 / −3.5; runStill.mean nurse −3.9 /
  −3.7, forager −3.9 / −3.0. Within 2: runMove.mean (both groups),
  runStill.P60.nurse, still.forager (light 2.0).
- **Short stops are not out of reach of the 11 parameters** (the earlier
  conclusion, from probes up to nestPauseFactor 0.3 at the start point,
  was wrong): P10.nurse 59 → 7 SE, P2.forager 51 → 7, P10.forager 50 →
  6.5, P2.nurse 34 → 5. The means: nurse and forager restToActive ×6 and
  ×7, nurse nestPauseFactor 0.03 → 0.15, forager 5.0 → 0.53, restShape
  1.4 → 0.70, **encounterStop 0.70 → 0.98 (at its bound, fails the
  adoption rule)**: the fit wants more brief stops than encounters can
  give.
- **What was traded** (paired shifts start → estimate, in SE_data): the
  still-run distribution was compressed as a whole. Survival past 2 s
  and 10 s fell toward the data (−30 to −56 SE: more short stills; the
  model had too few) and moving runs lengthened (runMove.P2 +14 / +16,
  means +9.5), but the long tail and the mean went too far:
  runStill.mean.forager 11.0 → 7.05 s (|z| 1.8 → 3.5; data 9.6),
  runStill.P60.forager 0.030 → 0.018 (|z| 3.7 → 4.3), runStill.mean.nurse
  19.7 → 10.0 (data 14.1, now too short, |z| 4.9 → 3.8), still.nurse
  slightly worse (5.4 → 5.9). The data have more still runs under 2 s
  (S(2 s) 0.52 vs 0.57 at the estimate, 0.81 at the start) *and* a
  heavier tail than one rest process plus pauses gives (corrected
  2026-10-16 night: first written reversed, "fewer under 2 s"); consistent with
  the parked reading that the data's brief stills are slow steps under
  the threshold (in-nest speed fluctuation), not tested here.
- **Per-ant persistence collapsed at the estimate** (frozen tracker, 12-h
  light block, seed 4242 per colony, Spearman lag correlation across ants,
  Fisher mean over colonies): nurse moving fraction 1 h / 3 h / 6 h / 11 h
  data +0.53 / +0.46 / +0.43 / +0.40; start point σ 0.4 +0.55 / +0.50 /
  +0.49 / +0.49; **estimate +0.31 / +0.12 / +0.09 / +0.10** (below σ 0
  at the start, +0.20 at 6 h). Near-movement share, nurses: data +0.42 at
  6 h, estimate +0.00; foragers moving fraction 6 h: data +0.36, estimate
  +0.08. Spread of per-ant 12-h totals: nurse moving fraction 10 / 50 /
  90 % 0.0079 / 0.0170 / 0.0305, top-20 % share 0.357 (data 0.0034 /
  0.0093 / 0.0271, 0.482; σ 0.4 at start 0.367); the near-movement share
  improved (nurse median 0.146 vs data 0.102, start 0.290; forager 0.232
  vs 0.278, start 0.447), raw detection 0.766 (data 0.815, start 0.727).
  Reading (hypothesis, untested): with restShape < 1 and fast walk-on,
  an ant's hour is dominated by whether it drew a very long rest, not by
  its walk-on trait, so the colony-average rows were bought with the
  individual structure the σ 0.4 choice was made to match.
- **σ 0.4 vs 0.7 trade-off (start point, as agreed to report):** σ 0.7
  lowered the loss (20 232 vs 21 940) but overshoots persistence (nurse
  moving fraction +0.67–0.72 vs data +0.40–0.53; σ 0.4 matched). The fit
  then lost persistence by other parameters at σ 0.4 fixed: colony-average
  targets alone do not protect individual persistence.
- **Trips** (`calibTrips --check`, 4 seeds, 12 h, dt 0.05, warm-up 7200;
  trip inputs in use, unchanged): estimate / start z: trip.n −0.9 / −0.6,
  foragerIn 0.0 / 0.0, **S(30 s) −8.3 / −10.7, S(120 s) +3.1 / +2.2,
  S(600 s) +11.2 / +10.1, S(3600 s) −4.7 / −4.7**; trip median 2160 s vs
  data 283 (mean 1466 vs 1177). The fixed give-up time (2147 s) shapes the
  trips; motion barely moves them. Trip shape stays a disclosed failure
  of the trip inputs (lognormal give-up implemented, off;
  entrance-excursion audit parked).
- **Conditional on the water parameters:** at the start point
  cropWaterRate ×5 moved still.nurse −1.38 and still.forager −1.12 SE;
  all conclusions above hold for the water settings in use only.
- **Parameters at bounds:** encounterStop (0.982 of [0, 1]); none other
  within 2 % of a bound (restCrowdExp 0.148, unit 0.12; restShape 0.698,
  unit 0.23).
- **Not adoptable** under the adoption rule (encounterStop at a bound;
  19 targets > 3 combined SE). Next steps go to the user: the parked
  proposals (in-nest speed fluctuation for short stops; entrance-excursion
  audit for trips), and the persistence collapse as a new finding against
  this estimate.

**2026-10-16 ≈ 23:20 — Next steps after fit C1 (user agreed).** Order:
persistence diagnostic → in-nest speed fluctuation (targeted comparison,
not a fit) with the trip path audit locally in parallel → no new fit until
per-ant persistence is a fit target (fit colonies, data role fit; the σ
choice already inspected them, logged here) and the rest form is settled.
- **Persistence diagnostic (logged before running; diagnostic only, no
  fit, nothing in `data/fits` written).** Two explanations of the
  collapse: (a) heavy rest tails — at restShape 0.70 the per-rest
  log-multiplier SD (≈ 1.7) is ≈ 4× the trait's σ 0.4 and rests have
  infinite mean, so an ant's hours are set by its longest rest; (b) a
  swamped trait — with walk-on ×6–7 and encounterStop 0.98, still time
  comes mostly from ant-independent stops (encounters, pauses) and the
  walk-on trait matters less. Arms: the C1 estimate with restShape 1.4
  (the start's value) and 50 (≈ no per-rest noise), all else at the
  estimate; `tmpTrackerSim --mode tracker --obsH 12 --set …`, seed 4242
  per colony (paired with `sim-sC1est`), 22 colonies × 2 arms, box.
  Reading, fixed now: persistence climbing with restShape toward the
  start's level (nurse moving fraction 6 h +0.49) → (a): the next fit
  bounds restShape ≥ 1 or uses mix2 rests; staying near the estimate's
  +0.09 at both arms → (b): the trait sits in the wrong place (stopping
  as well as walk-on). Read only lag correlations, per-ant spread and the
  long-still audit (complete still runs ≥ 1 h; data: runs ≥ 60 min almost
  absent, 2026-10-15); the arms' rows are off the fit and not judged.

**2026-10-16 ≈ 23:30 — Guidance on C1 (pasted by the user) and the
persistence diagnostic result.** The guidance and the arms' results
arrived together: `simact.py` had already been run on the arms when the
guidance was read, so the softened reading below was not fixed blind.
- **Guidance, adopted:** C1 is a useful diagnostic fit; not adopted,
  not extended. (1) The diagnostic's two explanations are neither
  exhaustive nor exclusive: raising restShape changes rest variability
  *and* typical rest durations (hence activity, encounters, clustering).
  Recovery implicates the rest distribution; failure would not have
  shown that the trait belongs on stopping. (2) Per-ant persistence
  goes into the next fit's targets as a **compact set with its weighting
  fixed beforehand**: many correlated lags must not count as independent
  targets. (3) Speed fluctuation and the entrance audit go ahead; speed
  fluctuation is a specific hypothesis, not yet the solution, judged on
  improvements **and costs together, persistence included**; the trip
  audit stays separate (motion barely moved the trips). (4) No automatic
  switch away from Lomax and no bound from this diagnostic alone; if a
  finite mean spontaneous rest is required the bound is restShape
  **> 1** (strict: ≥ 1 includes the infinite-mean case), and that
  property is of the isolated rest, not of observed rests interrupted by
  other behaviour. The 2026-10-16 ≈ 23:20 reading rule ("bounds
  restShape ≥ 1 or uses mix2") is withdrawn accordingly.
- **Corrections:** the C1 report had the short-still direction reversed
  (corrected in place: the model has too few still runs under 2 s, not
  too many). The scarcity of complete hour-long still runs is **not**
  evidence against biological long rests (the earlier observer audit
  makes that inference unreliable): the long-still count logged with the
  diagnostic (`scripts/scratch/longStill.py`) is not used as evidence.
- **Result (22 colonies per arm, seed 4242, paired; `logs/act/sim-sC1rs*`,
  `logs/c1/simact-rs.txt`):** lag correlation of per-ant moving fraction
  at 6 h, nurse / forager: data +0.43 / +0.36; start σ 0.4 +0.49 / +0.46;
  C1 estimate (restShape 0.70) +0.09 / +0.08; **restShape 1.4 +0.86 /
  +0.79; restShape 50 +0.99 / +0.95**. Persistence returns, and
  overshoots the data, as the shape rises. But the activity level moved
  by an order of magnitude with it: median per-ant moving fraction,
  nurses, 0.017 at the estimate, **0.157 at 1.4, 0.365 at 50** (data
  0.009); foragers 0.046 / 0.352 / 0.705 (data 0.054). Reading: the rest
  distribution is implicated; whether its variability or the typical
  rest length (and the activity it sets) carries the effect is not
  separated by these arms. Not tested: an activity-matched arm (walk-on
  rescaled so the still fraction stays at the estimate's).
- **Order from here:** speed-fluctuation targeted comparison (with
  persistence among the judged costs) and the entrance audit; then the
  persistence target set and weights, logged before any fit; no full
  search budget before both.

**2026-10-16 ≈ 23:35 — User: proceed with the speed-fluctuation
comparison and the compact persistence targets; no activity-matched
diagnostic.** User's caveat, recorded: the restShape result shows that
persistence depends strongly on the rest settings, not which rest family
or bound is right; even an activity-matched arm would not isolate it
fully, since more activity gives more movement observations per ant and
so more reliable activity ranks.
- **Mechanism (new, comparison only; not in the fit's free set).** The
  walker already has within-walk speed fluctuation: log speed follows an
  OU process (E1 walk fit: SD 0.359, τ 1.24 s, mean-preserving). In the
  nest the walk is only scaled (`nestSpeedFactor`), so the in-nest speed
  is as steady as arena walking. New `NestParams` factors on the walker's
  values inside the nest, in the style of `nestSpeedFactor` /
  `nestPauseFactor`: `nestSpeedSdFactor` (× `speedSdWithin`) and
  `nestSpeedTauFactor` (× `speedTau`), default 1 (bit-identical; test),
  per group possible through `forager`; settable by `--set`
  (`S2018_EXTRA`). The mean walking speed is kept (the OU term is
  mean-preserving); the median falls as the SD grows.
- **Arms (start point `S2018_START`, σ 0.4, C1 candidate otherwise; both
  groups alike):** SD factor 2 and 3 (SD 0.72, 1.08) × τ factor 1 and 4
  (τ 1.24, 5.0 s), 4 arms; control = factor 1 (the existing
  `logs/c1/diag-start.json` and `sim-s0.4` runs, valid if the default is
  bit-identical, checked). Per arm, paired with the control: (1)
  `diagS2018 --at start --set … --reps 4` (the 32 rows, 'diag' seeds),
  compared by `reportS2018.ts --est arm --start control` (per-row z,
  loss by row family); (2) per-ant activity, `tmpTrackerSim --obsH 12`,
  seed 4242, `simact.py` (lag correlations, spread); (3) the mechanism
  check, `scratch/tmpShortSim.ts` with `--set` and the trip inputs in use
  (22 colonies, 4 h), `shortAgg.py`: displacement of steps inside still
  runs < 2 s (data: 0.3–0.6 mm/frame 0.60, < 0.15 0.14; start 0.19 /
  0.70) and of all moving steps (data nurse 0.6–0.9 0.55, ≥ 1.5 0.15).
- **Reading, fixed now (diagnostic; nothing adopted):** improvements and
  costs reported together. An arm **supports the hypothesis** if (i) its
  brief stills become near-threshold slow steps (0.3–0.6 share ≥ 0.40
  for nurses, from 0.19), (ii) the short-still rows (runStill P2, P10,
  both groups) improve, and (iii) persistence (6-h lag, moving
  fraction) stays within 0.10 of the control. All other rows' changes,
  the loss by row family, spread and speed rows are listed as costs or
  gains, not hidden in a sum. Support → a fit with the two factors free
  is a candidate for the user's decision (with the persistence targets
  below); no support → the short-stop deficit stays a disclosed failure
  and the alternative (an observation-side explanation) is reviewed.
  The rest parameters stay at the start point: the arms show the
  mechanism's direction and size, not what a refit would reach.
- **Compact persistence targets (proposal for the next fit; data role
  fit, fit colonies — already inspected when σ 0.4 was chosen,
  2026-10-15 late evening, logged here).** Four rows, two per group,
  each one ordinary row (z² with SE across colonies, weight 1 like every
  other row; no lag series): **persistence** = Spearman correlation
  across ants of the moving fraction in the first vs the second 3 h of a
  6-h light window (the fit's window), Fisher-z mean over colonies (the
  data's lag curve is flat from 3 to 11 h, +0.46 → +0.40 for nurses, so
  one within-window lag carries it); **spread** = the share of the
  window's moving time carried by the top 20 % of ants. Data and
  simulation through the same code (the frozen tracker; the activity
  counts of `scratch/activityStats.ts` promoted to `src/sim/analysis/`),
  data from the 6-h light windows of each colony. Open for the user: σ
  is fixed at 0.4, and with a lognormal walk-on trait spread and
  persistence pull it opposite ways (σ 1.0 matches spread, 0.589 vs
  0.482, but overshoots persistence, 0.75 vs 0.43); whether σ becomes
  free in the next fit is not decided here.

**2026-10-16 ≈ 23:40 — Three papers read in full (user supplied; other
species; development literature, contamination log).** What bears on
step 4b, as candidate structure only (no parameter taken):
- **Gallotti & Chialvo 2018** (*T. albipennis*, in-nest tracks): bouts of
  motion and their size–duration scaling are reproduced by a first-order
  Markov process on speed (autocorrelated speed, a bout ends when speed
  falls below a threshold), with a mean-reverting shape. Supports the
  speed-fluctuation comparison now running: stops as threshold crossings
  of a fluctuating speed, not only discrete mode switches. Also "the
  more the faster": moving ants walk faster when more ants move (not
  reproduced by single-ant shuffling) — a collective speed effect our
  walker lacks; a candidate for the disclosed "moves clustered in time"
  failure (near-movement share), not acted on.
- **Crosscombe et al. 2026** (*P. punctatus*, 10 fps, flat arena, no
  brood or food): dwell time (log time in state) predicts both stops and
  starts better than neighbour cues (stop AUC 0.64–0.72 vs 0.53–0.60);
  hazards rise briefly then **decline with time in state for moving as
  well as resting**. Bearings: (i) our moving runs end at a constant
  rate (exponential), only rests are heavy-tailed — a duration-dependent
  stop hazard is a candidate for the moving-run rows (110 of C1's loss);
  (ii) neighbour cues weakly predict stops, which sits uneasily with
  encounterStop 0.98 (other species and arena; a question, not
  evidence); (iii) their population curves do not separate per-ant
  differences (frailty) from true duration dependence, as they note — the
  same ambiguity as our restShape vs walk-on trait.
- **Charbonneau & Dornhaus 2015** (*T. rugatulus*, 5-min scans over 2
  weeks): inactivity is highly repeatable; day vs night rank correlation
  of inactivity ρ 0.45 (cf. our data's +0.43 at 6 h); 25 % of workers were
  never seen active, and hierarchical clustering separates a distinct
  inactive group. Bearing on the spread vs persistence tension: our data
  have more near-inactive ants (nurse 10 % quantile 0.0034 vs σ 0.4's
  0.0076) and a larger top-20 % share; a lognormal walk-on trait cannot
  give both spread and moderate persistence (σ 1.0 overshoots
  persistence). A two-class or mixed trait (some ants mostly inactive)
  is a candidate structure for the persistence-target fit, for the user.
- Files moved to `literature/` (local only) as
  `GallottiChialvo2018_…`, `Crosscombe2026_…`,
  `CharbonneauDornhaus2015_…`; also added `Vaupel1979_Demography16-439_
  frailty-heterogeneity.pdf` (frailty models; methods for separating
  per-individual differences from duration dependence; not yet read; no
  data role). A byte-identical second copy of Charbonneau & Dornhaus was
  deleted (user).

**2026-10-16 ≈ 23:55 — Lenoir & Ataya 1983 read in full (role
development, assigned by the user this night; scanned French text, read
as page images).** *L. niger*, 5 young lab colonies (29–59 workers, 225
marked), scan sampling once a minute (7.5 h per colony over 10 days,
08–20 h) plus provoked tests; 24 acts per ant, correspondence analysis.
- **Summed activity per ant is lognormal** (Fig. 4: log score
  approximately normal, χ² p 0.30; scores 1–501, ≈ 500× between the least
  and most active ant; a few very low scores set aside as possibly
  injured by marking). Classes against the mean worker: 23.4 %
  hyperactive, 48.9 % hypoactive, 29.7 % average. Each task's activity
  across ants is **exponential** (few hyperactive workers do most of it).
- **Nurses are the least active:** 69 of 94 strict nurses (73 %) score
  "faible ou nulle"; 20 of 24 polyvalent foragers are hyperactive
  (Tab. 4). An intermediate "reserve" group (≈ 42 % of workers, often
  inactive, at the nest periphery).
- Bearing (development, structure only): in *L. niger* a broad,
  continuous lognormal activity trait is supported; this **tempers the
  two-class idea** taken from Charbonneau & Dornhaus (*Temnothorax*):
  the log spread of their score (≈ 0.3 in log10, ≈ 0.7 in ln, by eye from
  Fig. 4) is wider than σ 0.4, but it counts acts rather than locomotion
  and pools nurses with foragers (the role effect inflates it), so it
  sets no σ. No repeated measures over time: says nothing on persistence.
  Nothing imported; not a target or test.

**2026-10-16 ≈ 23:58 — User: priority is measurement error and the
frailty interpretation, beside the running comparison; the literature
helps distinguish explanations and choose tests, not expand the model
before those results.** So: the candidate structures noted from the
papers this night (two-class trait, duration-dependent stop hazard,
"the more the faster") are **parked, not to be acted on** before these
tests and the comparison report. The persistence-target build is on hold
behind them (design logged above; nothing implemented).
Two diagnostic tests, fit colonies only (data role fit), one code path for
data and the simulated observer (`scratch/diagShort.ts` extended), the
simulation at the start point with the true state recorded. Logged before
any computation; nothing in the model changes.
- **T1 — measurement error.** (a) *Noise model:* displacement of steps
  inside still runs ≥ 10 s (an ant at rest), per colony against the
  Rayleigh law the observer assumes (scale σ√2, σ = the colony's
  `noise.x/y`), and the lag-1 correlation of consecutive displacement
  vectors there (iid position noise gives −0.5; real micro-movement or
  slowly varying tracking error gives otherwise). Already seen: data 10 %
  of long-rest steps at 0.15–0.6 mm/frame vs model 2 %. (b) *Brief
  stills:* for each step inside a still run < 2 s, the cosine between
  its displacement and the preceding moving step's (heading continuity),
  data vs simulation; in the simulation the true state of each such step
  (stopped vs walking) calibrates the statistic. Reading: brief-still
  steps aligned with the walk (mean cosine clearly > 0, like the
  simulation's walking-true steps) → slow movement, behaviour, real or
  noise-pushed below threshold; isotropic (≈ 0) → stops seen through
  noise. If (a) shows tracking error heavier than the observer's, the
  observer is revised before any motion conclusion (it is part of the
  comparison), and the short-stop rows are re-read through it.
- **T2 — frailty interpretation.** Within-ant rank correlation of
  consecutive complete still-run durations (runs ≥ 2 s, the rows' runs;
  Spearman of each run with the next, per ant, minus the same with run
  order shuffled within the ant, so fixed per-ant differences cancel;
  Fisher mean over colonies). The model at the start point (per-rest
  gamma depth drawn independently, a fixed per-ant walk-on factor) gives
  ≈ 0 beyond crowding. Reading: clearly positive in the data → a latent
  state varying over minutes to hours (neither per-rest frailty nor a
  fixed per-ant trait), bearing directly on persistence and on what
  restShape stood in for in C1; ≈ 0 → per-rest heterogeneity plus fixed
  per-ant differences suffice. Not identifiable from durations alone (as
  Vaupel et al. 1979 frame it): per-rest frailty vs a truly decreasing
  waking hazard; the within-ant heavy tail (2026-10-15 shapes: Lomax
  within ant, α ≈ 1) already rules out per-ant frailty as the whole tail.

**2026-10-17 ≈ 00:10 UTC — Speed-fluctuation comparison, stage 1 (rows):
the tested arms do not support the hypothesis on the short-still rows.**
Control rerun with the new code is **bit-identical** to
`logs/c1/diag-start.json` (88 runs, every row, loss 21 315.8). Reports
`logs/sf/report-<arm>.txt` (`reportS2018 --est arm --start ctl`, paired):
| arm (SD ×, τ ×) | loss | runStill.P2 nurse / forager | runStill.P10 nurse / forager | speedMove nurse / forager |z| |
|---|---|---|---|---|
| control | 21 316 | 0.806 / 0.702 | 0.399 / 0.261 | 4.7 / 7.9 |
| 2, 1 | 23 852 | 0.809 / 0.707 | 0.412 / 0.270 | 11.2 / 11.8 |
| 2, 4 | 23 227 | 0.805 / 0.708 | 0.403 / 0.271 | 11.5 / 11.8 |
| 3, 1 | 28 552 | 0.811 / 0.715 | 0.426 / 0.288 | 21.7 / 19.3 |
| 3, 4 | 26 332 | 0.805 / 0.714 | 0.406 / 0.284 | 22.3 / 19.2 |
(data S(2 s) 0.52 / 0.44, S(10 s) 0.14 / 0.10.) Criterion (ii) fails in
every arm: survival past 2 s and 10 s stays or rises (fewer brief stills,
more stills ≥ 10 s), and the measured moving speed rises far above the
data (slow phases now count as still; the mean walking speed is kept).
Only still.nurse improves (5.4 → 1.9–3.6). Criteria (i) mechanism and
(iii) persistence follow from stage 2. Not covered by the logged arms
(not run): sub-second fluctuation (τ factor < 1) or a lower mean speed
near the threshold; with τ ≥ 1.24 s the dips last seconds, so they add
still runs ≥ 2 s rather than brief ones. Any further arm is the user's
decision (the comparison was logged with these four).

**2026-10-17 ≈ 00:25 UTC — T1/T2 results (data: 22 fit colonies, 24 h;
simulated control: start point, trips in use, 22 colonies, 4 h, true
state recorded; `logs/t12/agg-ctl.txt`, `scripts/scratch/t12Agg.py`).**
User's guidance on reading (pasted, adopted): the four speed arms are
rejected at the start point (not adopted, not put in a fit); no new arms
until the controls are read; the −0.5 benchmark assumes a stationary true
position and independent equal-variance errors on signed displacement
components, so a positive value argues against that model but does not
exclude correlated error, smoothing or tag motion; within-ant duration
correlation is not uniquely diagnostic (local conditions, interactions,
observation effects); the moving-speed rise in the arms is the
conditioning on steps above the threshold.
- **T1a (noise in long rests):** same statistic as the benchmark (signed
  2-D displacement vectors, Σ v_t·v_{t+1} / mean |v|²; simulated truly
  resting pairs −0.500). Data, nurse / forager: steps ≥ 0.15 mm/frame
  10.2 % / 10.5 % (sim 1.9 % / 1.3 %); lag-1 all +0.32 / +0.27 (sim −0.13
  / −0.24); **bulk d < 0.15 alone +0.13 / +0.11, positive in every colony
  (+0.07 to +0.17)** where iid error gives −0.5; band 0.15–0.6 +0.39 /
  +0.33. The data's resting position series fails the observer's iid
  model in amplitude and in structure. Not identified: correlated
  tracking error, smoothing, tag (thorax) movement or real slow drift.
  The tracking methods (supplement, methods section only, role
  methods-only) report real-time tag detection, position and
  orientation twice a second, detection 92.7 %; no statement on
  smoothing either way.
- **T1b (brief stills):** calibration in the simulation: truly walking
  steps +0.89 mean cosine with the preceding moving step, truly stopped
  +0.01. Data +0.44 (nurse) / +0.34 (forager), sim control +0.33 / +0.26.
  Intermediate: a mixture, not pure slow movement nor pure stops; read as
  a two-class mix ≈ 0.49 / 0.38 movement-like (model 0.37 / 0.30), with
  2.5× more brief stills in the data, so the data have more of both
  kinds. Supports investigating continued slow movement in brief stills;
  identifies no timescale.
- **T2 (consecutive still runs within ants, minus within-ant shuffles):**
  data +0.121 [0.111, 0.132] / +0.121 [0.110, 0.135]; model +0.068 [0.062,
  0.074] / +0.049 [0.041, 0.056]; unchanged after dividing by the colony
  1-h median. The model is not 0 (crowding, place); the data exceed it by
  ≈ +0.05–0.07. Confounded by T1: the data's still runs contain slow
  movement, which can link consecutive runs. No conclusion that the rest
  generator needs memory.
- **Logged rule (a) applies only in part:** tracking error *heavier than
  the observer's* is not established (the excess may be movement), but
  the observer's iid assumption is contradicted, so motion conclusions
  that rest on sub-threshold displacements (the short-still rows) stay
  provisional until the next measurement test separates the two.
- **Proposed next measurement test (not run; for the user):** position
  MSD against lag k = 1…60 frames inside still runs ≥ 30 s, data vs the
  simulated control (tag orientation beside it if the track stream
  exposes it; it now passes positions only).
  iid error: flat at 2σ² from k = 1; correlated error or smoothing: rises
  to a plateau within its correlation time; real slow drift: keeps
  growing with k. A plateau → revise the observer's error model (then
  re-read the short-still rows through it); growth → resting ants move,
  a behavioural question for the speed follow-up.

**2026-10-17 ≈ 00:35 UTC — MSD diagnostic approved, with the user's
revised reading (logged before running).** Evidence about displacement
timescales in long still periods, **not a three-way causal classifier**;
no outcome by itself triggers an observer revision or becomes a
behavioural input. Readings: flat from lag 1 — iid error around a fixed
position, or fluctuations faster than the sampling resolves; rise to a
plateau — correlated error or smoothing, but also confined physical
movement; growth over the measured lags — physical movement, but also
measurement drift or slowly varying error.
- **Softened conclusions (supersede the 00:25 wording):** T1a contradicts
  *stationary ants observed through the current iid-error model*; it does
  not isolate which part of that combination is wrong. T1b's
  intermediate cosine is consistent with a mixture of movement and stops
  but also with uniformly slower, less directionally persistent
  movement; the two simulated endpoints do not give a unique
  decomposition (the "≈ 0.49 / 0.38 movement-like" split is withdrawn).
- **Design:** bounded still runs ≥ 60 frames (30 s) at the rows' threshold
  (0.6 mm/frame, gaps ≤ 3 frames bridged, the run selection T1a used),
  exactly the same selection and code for data and simulation
  (`scratch/diagShort.ts`). Per colony and role: MSD(k) of position over
  pairs of detections k = 1…60 frames apart within a run, with the number
  of pairs and of contributing runs at each k. Summary: per-colony MSD
  curves, mean over colonies with a colony-bootstrap 95 % interval (pairs
  overlap; colonies are the units), shape as MSD(k)/MSD(1) beside the
  absolute values, run counts shown near k = 60. Simulation: the start
  point control; also, as calibration only, runs truly at rest
  throughout (expected flat at 4σ²).
- The speed follow-up is paused until this and stage 2 are read
  together.

**2026-10-17 ≈ 00:55 UTC — Speed comparison complete (stage 2) and MSD
result; read together as agreed.**
- **Speed arms, all three logged criteria:** (i) mechanism **fails**:
  share of brief-still steps at 0.3–0.6 mm/frame, nurse / forager: data
  0.60 / 0.59; control 0.20 / 0.16; arms 0.16–0.19 / 0.18–0.21 (needed ≥
  0.40); their brief stills stay noise-level true stops (truly stopped
  ≈ 60 %), and long still runs keep ≈ 2 % of steps ≥ 0.15 mm/frame (data
  10 %). (ii) **fails** (stage 1). (iii) passes: persistence at 6 h,
  nurse, control +0.49, arms +0.42–0.50. **Verdict: the four arms do not
  support the hypothesis**; not adopted, not put in a fit (user). Outputs
  `logs/sf/` (reports, `simact-sf.txt`, `t1-arms.txt`); the arms' step
  files predate the MSD addition (no MSD for arms; not in their criteria).
- **MSD in still runs ≥ 30 s** (same selection and code for data and the
  start-point control; colony means, colony bootstrap; `logs/t12/msd.txt`;
  ≈ 52 000 data / 36 500 simulated runs contribute at every k ≤ 60).
  MSD mm², nurse data / model: k 1 0.0055 / 0.0037, k 10 0.099 / 0.026,
  k 30 0.276 / 0.081, k 60 0.386 / 0.155; forager k 60 0.350 / 0.054;
  intervals disjoint at every k. Truly resting simulated runs stay flat
  at 4σ² (0.0019; calibration). Data shape MSD(k)/MSD(1): 2.5 at k 2,
  18 at k 10, 50 / 64 / 70 at k 30 / 45 / 60 (near-linear to ≈ 15 s,
  sub-linear after). **Reading (user's table):** growth over the measured
  lags, with no early plateau — consistent with physical movement, or with
  measurement drift / slowly varying error whose correlation time would be
  tens of seconds; not separated. The data exceed the model at every lag
  (≈ 1.5–2× at 0.5 s; 2.5× nurse, 6× forager at 30 s; RMS over 30 s ≈ 0.6
  mm vs 0.39 / 0.23).
- **Not known from these means:** whether all long still runs drift
  (uniform) or a minority carry slow walking (mixture).
- **Speed follow-up: still paused.** The controls neither establish a
  behavioural explanation nor exclude slowly varying measurement error.
- **Proposed next (data-only, cheap; not run, for the user):** (1)
  *frame-level drift:* correlation of displacement over k frames between
  ants resting at the same time in the same colony (a camera or image
  shift moves all tags together; independent movement or per-tag error
  does not); (2) *uniform vs minority:* per-run distribution of
  |displacement|² at k = 60 (median and quantiles beside the mean, data
  and simulation, same selection). Neither separates per-tag slow error
  from thorax movement; (1) excludes or confirms one class of
  measurement error, (2) says what the follow-up would have to produce.

**2026-10-17 ≈ 01:05 UTC — Two track-only checks approved (user); then the
track-only sequence stops unless they reveal a specific correctable
problem.** If per-tag error and physical movement stay indistinguishable,
that limitation is recorded and a **bounded sensitivity comparison across
the plausible explanations** is chosen instead; the tracks are not
required to identify what they cannot. The four speed settings failed
their intended test at the start point: conclusion kept, no further
tuning of those arms. Committed before these checks: `25e7c23`.
Design (logged before running; data: 22 fit colonies, 24 h; simulation:
start-point control, trips in use, as a reference with no camera; one
code path):
- **A — common component.** Windows of k = 60 frames (30 s; k = 10
  secondary), non-overlapping, ending at multiples of k. Eligible ant in
  a window: in the nest, detected at both ends, every step inside still
  (< 0.6 mm/frame) with gaps ≤ 3 frames. Spatial thinning: greedy subset
  with pairwise distance ≥ 10 mm (≈ 3 body lengths); windows with ≥ 4
  thinned ants. Per window a least-squares rigid motion (translation +
  small rotation about the subset's centroid) fitted to the ants'
  displacements; statistics: share of the displacement sum of squares it
  explains (R², uncentred) and the size of the fitted translation.
  Baseline: each ant's displacement replaced by its own displacement in a
  random other eligible window (positions kept; 20 shuffles). Per colony,
  observed vs shuffled; summary across colonies (colony bootstrap).
  Reading: R² and translation clearly above the shuffled baseline, with a
  consistent direction across separated ants → a common component
  (camera or image shift possible, but shared biological responses can
  also produce it; described as a common component, not camera movement);
  ≈ baseline → common drift constrained; per-tag error stays unresolved.
- **B — displacement across periods.** One value per eligible still
  period (bounded still run ≥ 60 frames, the MSD selection): squared
  displacement between the run's first detection pair exactly 60 frames
  apart, equal weight per period. Per colony quantiles (10/25/50/75/90 %)
  and the share above the simulated true-rest level (4σ² × 3); summary
  across colonies (colony bootstrap). Reading: median well above the
  true-rest level → widespread small displacement; median near it with a
  long upper tail → a minority of more mobile periods.

**2026-10-17 ≈ 01:20 UTC — Checks A and B results (`logs/t12/ab.txt`,
`scripts/scratch/abAgg.py`, `commonDrift.ts`; 22 fit colonies vs the
start-point control). The track-only sequence stops here (user's rule).**
- **A — no detectable common component.** 30-s windows (≈ 8 thinned
  resting ants ≥ 10 mm apart, ≈ 2 900 windows per colony): R² of a rigid
  motion, observed − shuffled, data +0.0002 [−0.0013, +0.0018]; the model,
  which has no camera, +0.0059 [+0.0044, +0.0076]; direction consistency
  0.293 vs shuffled 0.285 (model 0.278 / 0.279); share of windows above
  their own 95 % shuffled R² 0.096 (model 0.109). 5-s windows: data
  +0.004, model +0.003. Common drift (camera or image shift) is
  constrained to negligible; per-tag error stays unresolved.
- **B — displacement is widespread, not a minority.** One squared 30-s
  displacement per eligible still period (equal weight), nurse, mm²: data
  q10 / median / q90 0.094 / 1.27 / 9.3, **99 % of periods above 3× the
  true-rest level** (foragers 99 %); model 0.0006 / 0.073 / 1.6, 64 %
  (foragers 44 %); model truly at rest 0.0002 / 0.0013 / 0.0046, 6 %.
  Data's still periods are almost never stationary at the tag level (even
  q10 ≈ 0.3 mm in 30 s); the model's are mostly true rests plus a mobile
  minority. (The per-period first-30-s values exceed the all-pairs MSD
  mean, 0.39 mm² at k 60: displacement is larger early in a still period.)
- **Measurement detail found:** data positions are whole pixels (1 px =
  0.0230 mm; noise σ ≈ 0.018 mm); the observer does not round to the
  grid. Specific and correctable, but negligible at the scales tested
  (still threshold 26 px; band 0.15–0.6 mm = 6.5–26 px) and it does not
  explain A or B.
- **Limitation recorded:** from these tracks, slowly varying per-tag
  error (e.g. tag tilt as the ant shifts) and real thorax movement during
  rest are not separable. Established as a target either way: still
  periods in the data carry widespread slow displacement (MSD and
  per-period distribution above).
- **Proposed bounded sensitivity comparison (for the user; not run):**
  two variants calibrated to the same two data targets (long-still MSD at
  30 s and the per-period median), both with pixel rounding in the
  observer: (M) measurement — a slowly varying per-tag position error in
  the observer (OU, amplitude and τ calibrated); (B) behaviour — resting
  ants creep (small OU body motion during rest, calibrated). Judged at the
  start point on the 32 rows (short-still rows especially), persistence,
  T1a/T1b. Agreement → the identification gap does not matter for the
  motion fit; disagreement → both carried as a disclosed sensitivity.

**2026-10-17 ≈ 01:30 UTC — Sensitivity comparison approved (user):
measurement (M) vs behaviour (B) explanations of the slow displacement in
still periods. Design logged before running.**
- **Observer options (default off, bit-identical; test):** in
  `colonyStroeymeyt`, `StroeymeytColony.posDrift = { kind, sd, tau }`: a
  slowly varying position offset per ant, OU per axis with stationary SD
  `sd` (mm) and correlation time `tau` (s), updated every frame from its
  own RNG stream (drawn only when set). `kind 'tag'` (M): runs at all
  times, a per-tag measurement error. `kind 'rest'` (B): evolves only
  while the ant is truly in rest mode, starting from 0 deviation at each
  rest, and is kept afterwards (the ant has moved): creep during rest.
  B is implemented in the observer as an offset rather than in the body
  (an approximation: sub-mm creep, no effect on contacts assumed; logged).
  `pxRound`: observed coordinates rounded to the data's pixel grid
  (0.0229658793 mm). Both variants use pixel rounding; a rounding-only arm
  (P) shows its own effect. Scripts take `--obsVariant tag|rest:sd:tau`
  and `--pxRound mm` (`s2018Lib`).
- **Calibration (each variant separately, start point, trips in use,
  `tmpShortSim`, 22 colonies × 4 h):** targets from the data (fit data):
  long-still MSD at k = 60 (colony mean; nurse 0.386, forager 0.350 mm²)
  and the per-period median of check B (nurse 1.27, forager 0.98 mm²).
  Objective: Σ over the 2 roles × 2 targets of (ln sim/data)². Grid sd ∈
  {0.2, 0.3, 0.45, 0.7} mm × tau ∈ {10, 30, 90} s, one (sd, tau) per
  variant shared by both roles; the best grid point is taken, no further
  tuning; if it lies on a grid edge, the grid is extended once in that
  direction (one step) and the best taken.
- **Judging at the chosen points (paired with the control):** the 32 rows
  (`diagS2018 --at start --reps 4`, `reportS2018` vs control), persistence
  and spread (`tmpTrackerSim` 12 h, `simact.py`), T1a/T1b and checks
  A/B (`tmpShortSim` at the chosen point). Reading, fixed now:
  **agreement** if M and B move each short-still row (runStill P2, P10,
  both roles) in the same direction and their values differ by ≤ 2 SE_data,
  the loss decomposition by row family has the same ordering, and nurse
  6-h persistence differs by ≤ 0.05 → the identification gap does not
  matter for the motion fit (either variant can stand in, disclosed).
  Otherwise **disagreement** → both carried as a disclosed sensitivity in
  any later fit and its report.

**2026-10-17 ≈ 01:50 UTC — Parked candidate: colony-coupling "oracle"
diagnostic (user forwarded a proposal; user agreed to park it with a gate).**
Agents given a true colony variable (e.g. number of ants moving, recent
local activity) in a diagnostic fit, to see whether missing colony-level
coupling explains the misfit; then replaced by a perceivable channel
(slowly integrated percepts as mind state). Never adopted as such; kept
out of `src/sim/behavior/`; fit-role targets only. **Safeguard:** a
placebo arm with the same signal time-shuffled or from another colony;
only a gain beyond the placebo counts. **Gate (run first, data statistic,
no fit):** colony-level synchrony, data vs model through the same
observer: D_w = Σ_bins (Σ_ants dev)² / Σ_bins Σ_ants dev², dev = an ant's
moving fraction in the bin minus its own mean over the run, bins w = 1
frame, 1 min, 10 min (≈ 1 under independence across ants, > 1 with
synchrony); per colony, colony bootstrap. Only if the model clearly lacks
synchrony the data have is the oracle diagnostic worth its cost, and then
at the start point with one coupling parameter, not a full fit. Context:
tonight's checks showed no colony-level signal so far (T2 unchanged by
removing colony-hour variation; check A: no shared motion of resting
ants); the main misfits are individual- or observation-level. Not run
before the sensitivity comparison is read. Gate code prepared
(`scratch/syncStats.ts`), not run.

**2026-10-17 ≈ 02:20 UTC — Calibration grid result (`logs/t12/cal.txt`):
no grid point fits both targets; best points on the grid corner, logged
one-step extension running.** Objective (Σ (ln sim/data)², 4 terms):
tag 0.7/90 1.74 (best), tag 0.45/30 1.81, tag 0.45/10 1.91, rest 0.7/90
2.02 (best rest), …; rounding only (P) 42.4. **Structural mismatch:** in
the data the per-period median of the first 30 s (nurse 1.27 mm²) exceeds
the all-pairs MSD at 30 s (0.386); every stationary-OU point gives the
reverse (tag 0.7/90: median 0.58, MSD 0.70). The data's still periods
move more early than later (front-loaded displacement); a stationary
offset (M) or creep that is stationary within a rest (B) cannot produce
that, so the calibrated points will miss each target by ≈ ×1.8 in
opposite directions. Not acted on beyond the logged rule: extension one
step past the corner for both variants (sd 1.05, tau 270: points
1.05/90, 0.7/270, 1.05/270), then the best point is taken and judged as
logged, with this calibration misfit disclosed in the verdict.

**2026-10-17 ≈ 03:05 UTC — Sensitivity comparison verdict: AGREEMENT under
the logged rule — by both variants leaving the rows untouched.** Calibrated
points (best of the grid and the logged extension; objective flat along
the ridge, extension 1.91 vs 1.74): **M = tag 0.7 mm / 90 s, B = rest 0.7 mm
/ 90 s**, both with pixel rounding. Judging (`logs/judge/`, paired with the
control): loss control 21 316, rounding only (P) 21 311, M 21 123, B
21 171; every short-still row moved ≤ 0.001 (|M − B| 0.00 SE), loss
ordering by row family identical, nurse 6-h persistence M +0.48, B +0.49
(control +0.49). `judgeAgg.py`: AGREEMENT.
- **Reading:** for the 32 rows (steps classified at 0.6 mm/frame) it does
  not matter whether the slow displacement in still periods is per-tag
  error or creep: neither reaches the threshold. The identification gap
  is **closed for the motion fit**; the observer is not revised (pixel
  rounding negligible: −5 on 21 316); disclosed as a limitation.
- **Still open, as description only:** neither variant reproduces the
  *form* of the data's sub-threshold movement: long-still steps nurse
  0.15–0.3 / 0.3–0.6 mm/frame data 6.3 % / 3.8 %, M and B 16.8 % / 1.2 %;
  lag-1 data +0.32 (band +0.39), M and B −0.05 (−0.02): the data's
  sub-threshold steps keep their direction frame to frame (directed or
  smooth movement), an OU position offset gives near-independent
  increments; per-period q90 data 9.3 vs 2.5 mm²; front-loading
  (calibration entry). T1b, T2 and check A unchanged by either variant.
- **Consequence for the short stills (≈ 90 % of the start-point loss):**
  not explained by slow measurement error (shown here) nor by
  frame-scale noise (σ 0.018 mm vs the 0.6 mm threshold); together with
  T1b (brief-still steps follow the walking heading, cosine +0.44 vs
  +0.01 for stops) this is the behavioural support the user made the
  condition for **one bounded speed follow-up** (shorter correlation
  times, mean nearer the threshold, informed by the observed step
  distributions). Designed and logged next, before running.

**2026-10-17 ≈ 03:08 UTC — Bounded speed follow-up (the one the user's
guidance allowed once the controls support a behavioural reading; the
user left the choice of the next box run to Claude). Logged before
running.** Observed step distributions (fit data, all 22 colonies; model:
start-point control): moving-step displacement median nurse / forager
data 0.88 / 1.03 mm/frame, model 1.03 / 1.48; steps at 0.3–0.6 mm/frame per
moving step data 1.77 / 0.92, model 0.53 / 0.20. The data's walking is
slower and straddles the threshold (nurses take more steps just below it
than above it).
- **Arms (start point, σ 0.4, C1 candidate otherwise; both groups alike):**
  nestSpeedFactor × m, m ∈ {0.6, 0.8}, crossed with (SD factor, τ factor) ∈
  {(1, 1), (2, 0.5), (2, 0.25), (3, 0.5)} (τ 1.24 / 0.62 / 0.31 s): 8 arms.
  Shorter τ than the rejected arms (which had τ ≥ 1.24 s) so dips last
  about a frame; lower mean so walking sits near the threshold. Control:
  `logs/sf/diag-ctl.json`, `sim-s0.4`, `sf-ctl` (bit-identical code
  path). Same three outputs per arm as the first comparison (rows,
  persistence, step diagnostic).
- **Reading, fixed now:** (i) mechanism: brief-still steps at 0.3–0.6
  mm/frame ≥ 0.40 for nurses (data 0.60, control 0.20); (ii) short-still
  rows: |z| falls for at least 3 of the 4 (runStill P2, P10, both groups);
  (iii) nurse 6-h persistence within 0.10 of the control. Reported beside
  them, as gains or costs: moving-step median and the 0.3–0.6 / moving
  ratio vs the data, speedMove, moving runs, loss by row family. **An arm
  meeting (i)–(iii) supports the hypothesis** → a fit with the two speed
  factors and nestSpeedFactor free becomes a candidate for the user (with
  the persistence targets); **none** → the speed line stops: the
  short-still deficit stays a disclosed failure and the 4b motion fit is
  re-planned without it. Rest parameters stay at the start point (the
  arms show direction and size, not what a refit would reach). No further
  speed arms after this one in either case.
- **Also now (local, cheap, gated on the sensitivity verdict which is in):**
  the synchrony gate of the parked colony-coupling candidate (data pass
  and simulated control, `scratch/syncStats.ts`).
  Launched on the box 03:10 UTC (`logs/sf2/run-sf2.sh`; its header cites
  this entry as "≈ 03:20", written before the clock check).

**2026-10-17 ≈ 03:30 UTC — Synchrony gate: first output not read
(confound found in the gate code before interpretation).** `syncStats.ts`
took each ant's mean over its whole run: 24 h for the data (light and
dark), 4 h of light for the simulated control. A colony-wide day/night
activity shift then makes all ants deviate together at any bin width
and inflates the data's D_w, so data and model were not compared like
for like. Seen (not read as evidence): data D 2.6 / 4.1 / 6.3 at 5 s / 1 min
/ 10 min vs model 1.06 / 1.25 / 1.57. **Fix (before any reading):** D_w
computed within 4-h blocks (the simulated window), each ant's mean taken
within its block, pooled over blocks; data: the three light blocks
(06–10, 10–14, 14–18 UTC); model: its single 4-h light window. Same
reading as logged at 01:50.

**2026-10-17 ≈ 03:50 UTC — Synchrony gate result (block-wise, as fixed at
03:30): the data show colony-level synchrony the model lacks; the gate
opens.** `logs/t12/sync-blocks.txt`, `scratch/syncAgg.py`. D_w, all ants,
light blocks pooled (data) vs the start-point control's 4-h light window:
5 s 2.63 [2.37, 2.91] vs 1.06 [1.05, 1.08]; 1 min 4.15 [3.70, 4.64] vs 1.25
[1.19, 1.30]; 10 min 6.28 [5.51, 7.15] vs 1.57 [1.37, 1.75] (nurses alone
2.28 / 3.67 / 5.12 vs 1.03 / 1.16 / 1.42). The confound fix changed
nothing material (first output 2.60 / 4.06 / 6.29). **Per clock block**
(1 min, all): 06 h 5.01 (likely recording start and day-2 partial blocks
included), 10 h 3.70, 14 h 3.25, 18 h 2.84, 22 h 2.35, 02 h 2.91 — every
block, settled mid-day and night included, is far above the model.
Ants in the data move together at 5 s to 10 min; the model's ants are
nearly independent (local encounters and crowding give it D ≈ 1.1–1.6).
Not identified: ant-to-ant coupling vs shared external drivers
(disturbance, vibration); check A excludes a common camera shift of
resting tags, not shared biological responses. Bears on the disclosed
"moves clustered in time" failure and possibly on persistence. Per the
logged plan the colony-coupling diagnostic is now worth its cost: start
point, one coupling parameter, with a placebo arm; designed and logged
before any run, after the speed follow-up is read.

**2026-10-17 ≈ 05:08 UTC — Bounded speed follow-up v2 read against the
03:08 rules: no arm supports the hypothesis; the speed line stops.**
Eight arms at the start point (σ 0.4), control `logs/sf/diag-ctl.json`,
`logs/sf2/report-<arm>.txt` (`reportS2018 --est arm --start ctl`), step
diagnostic `sf2-<arm>` (`scratch/sf2Agg.py`), persistence
`simact.py` (`SF2<arm>` sets, seed 4242, 22 colonies). Brief-still share
(i) and 6-h persistence (iii) are on the box (`logs/short`, `logs/act`;
not fetched, the short files are large); the reports are local.
- **(ii) fails in every arm.** All four short-still rows get *worse* in
  all eight arms (survival past 2 s and 10 s rises). Control → arm, nurse
  P2 0.806 → 0.817–0.837 (data 0.52), nurse P10 0.399 → 0.427–0.490 (data
  0.14), forager P2 0.702 → 0.704–0.725 (0.44), forager P10 0.261 →
  0.268–0.314 (0.10). Lower mean walking speed makes it worse, not better
  (m 0.6 is worse than m 0.8); shorter τ barely moves it. Arms with a
  larger SD factor also cost speedMove (m 0.8, SD 3: nurse |z| 4.7 → 15.5).
- **(i) fails in every arm.** Nurse brief-still steps at 0.3–0.6
  mm/frame: control 0.196, arms 0.208–0.299 (data 0.60; the bar was
  0.40). Forager control 0.165, arms 0.197–0.299. The arms do move the
  moving-step median toward the data (nurse 1.03 → 0.83–1.07 vs data
  0.88) and raise the 0.3–0.6 steps per moving step (nurse 0.51 → 0.69–1.09
  vs data 1.77), but the extra sub-threshold steps do not turn into brief
  stills of the right kind.
- **(iii) passes in every arm** (nurse 6-h persistence 0.49 control, arms
  0.49–0.58, all within 0.10) — so persistence was not the obstacle.
- **Beside them (gains and costs):** total loss rises in every arm:
  control 21 316 → 24 278 (m 0.8, SD 1, τ 1; the best arm) … 38 420 (m
  0.6, SD 3, τ 0.5). speedMove improves for several arms (nurse/forager
  |z| 4.7/7.9 → 0.5/0.6 for m 0.6, SD 2, τ 0.25), the cost falls on
  runStill and long-still families.
- **Reading.** The four earlier arms (SD and τ varied, mean kept) and
  these eight (mean also lowered, shorter τ) all fail the short-still rows
  in the same direction. Slower, more variable walking speed, at the
  settings tried, does not produce the data's brief stills; this does not
  show that no speed model could. Together with the observer sensitivity verdict (agreement), the
  short-still deficit stays a **disclosed failure** of the 4b motion
  model, unexplained; the speed line stops as logged, with no further
  speed arms. The 4b motion fit is re-planned without it (persistence
  targets still on hold).
- **Next (logged 03:50):** the colony-coupling diagnostic, designed and
  pre-registered here before any run.

**2026-10-17 ≈ 05:11 UTC — Oracle colony-coupling diagnostic: design and
reading, logged before any run (the user left the choice of the next box
run to Claude).** Question only: *if the model's ants shared a slow colony
signal, would the data's synchrony (D_w 2.6 / 4.2 / 6.3 at 5 s / 1 min /
10 min vs model 1.06 / 1.25 / 1.57) appear, and would any row or
persistence statistic move with it?* It is a cheat channel (the signal is
the colony's true moving state, which no ant could read), not a
mechanism, not adoptable, not a fit; it says whether coupling of this
kind is worth modelling at all (Sumpter & Pratt 2003; Feinerman & Korman
2017 for the logic).
- **Hook, outside `src/sim/behavior/`:** runner option
  `ColonyOptions.oracle` (`colonyBles.ts`), carried by
  `StroeymeytColony.oracle` and set from `--oracle` in `withObsVariant`
  (cloneable, so it reaches pool workers). Absent: bit-identical (tested).
  Each step, before the policy call: u = fraction of in-nest ants not
  resting (true state), smoothed with an exponential of time constant
  τ_c; ū = the same with 30 min; every in-nest ant's `restToActive` is
  multiplied for its policy call by g = clamp((u / ū)^κ, 0.25, 4) (set and
  restored around the call, no behaviour code touched). One coupling
  parameter, κ; τ_c = 60 s fixed (the middle of the three bin widths);
  walk-on only, walk-off untouched; u / ū keeps the mean rate.
- **Arms (start point, σ 0.4, rest of C1 as in the control):** coupled
  κ = 0.5 and κ = 1 (κ > 1 is unstable by construction: the loop gain
  κ·r_off exceeds the relaxation; not tried); **placebo** for each: every
  ant gets its own independent OU log-multiplier with τ_c = 60 s and the SD
  of log g that the coupled arm produced (same marginal modulation of
  walk-on, no sharing). Placebo SD is read from a pilot of the coupled arm
  (4 colonies, one seed, signal variability only — no target statistic is
  looked at) and logged here before the placebo arms run. Control:
  `logs/sf/diag-ctl.json`, `sim-s0.4`, `sf-ctl`.
- **Outputs, as in the speed comparison:** rows (`diagS2018`, 4 seeds,
  `reportS2018` paired with the control), per-ant activity (`tmpTrackerSim`
  12 h, `simact.py`), synchrony (`tmpShortSim` → `syncAgg.py`, 4-h light
  window as the gate).
- **Reading, fixed now:** (a) *synchrony is reproduced by coupling* if a
  coupled arm closes at least half of the gap to the data at both 1 min and
  10 min (D ≥ 2.7 and ≥ 3.9, all ants, light) while the placebo of the same
  κ stays at the control's level (the CI of the control's D); a placebo that
  also rises means modulation, not sharing, and the arm shows nothing about
  coupling. (b) *persistence protected*: nurse and forager 6-h
  moving-fraction lag correlation within 0.10 of the control (data 0.43 /
  0.36; control 0.49 / 0.46). (c) rows and spread reported beside them as
  gains or costs against the control *and* the placebo (loss by family,
  top-20 % share of moving, the short-still rows), not as a criterion.
  Outcomes: (a) met and (b) kept → shared coupling reproduces the
  synchrony; whether it also repairs any row is read from (c) and recorded
  either way; the next question is external vs ant-to-ant coupling (a
  design, not a fit). (a) not met at κ ≤ 1 → this formulation cannot
  produce it; no further κ or τ_c arms. (a) met but (b) broken → the
  coupling trades persistence for synchrony; record it. Two κ only; no
  further arms in any case.

**2026-10-17 ≈ 05:14 UTC — Oracle diagnostic: hook built and tested; the
pilot sets the placebo SD (signal variability only).** `colonyBles.ts`
(`oracle` option, `oracleStep`, applied around the policy call),
`colonyStroeymeyt.ts` (`oracle` field, `oracleLogSd` in the run),
`s2018Lib.ts` (`--oracle coupled:κ:τ_c|placebo:sd:τ_c` in
`withObsVariant`), `test/oracle.test.ts` (κ = 0 and a placebo of SD 0 are
bit-identical to no oracle; coupling changes the run; `P.nest` restored).
Pilot (`scratch/oraclePilot.ts`: colonies 0–3, seed 4242, 2 h + 2 h at the
start point; prints only the SD of log g, no target statistic): SD of log
g, κ = 0.5: 0.303 / 0.287 / 0.312 / 0.385 (mean **0.32**); κ = 1: 0.547 /
0.459 / 0.533 / 0.569 (mean **0.53**). **Placebo SDs fixed at 0.32 and 0.53,
τ_c 60 s.** Arms: `orc-k0.5`, `orc-k1`, `orc-p0.32`, `orc-p0.53`. Control
sync: `t12-ctl`.

**2026-10-17 ≈ 05:15 UTC — Oracle run launched on the box**
(`logs/orc/run-orc.sh`, started 05:14:47 box time; stage 1 rows for the
four arms with 30 workers each, then stage 2 activity and synchrony;
roughly 50–60 min). Note on clocks: the three entries above (05:08, 05:11,
05:14) were first written with times ahead of the clock; corrected to
the box/local clock here. Nothing read yet.

**2026-10-17 ≈ 05:43 UTC — Overnight plan (user, just before this entry: run more on the
box overnight; contact check, dark-phase oracle synchrony, and a
slow-episode what-if in place of the creep what-if). Logged before any of
it runs.** The creep what-if was dropped before building: observer
variant B already moved observed positions during rests by the measured
amount and left the 32 rows unchanged, so true-position creep of that size
is predicted to do the same for the short stills (it could only show an
effect on contacts). The user chose the slow-episode what-if instead.
No fits, no model changes; every arm below is a runner-level switch that
is off by default (tested bit-identical) and not adoptable.

*1. Contact check (downstream relevance of the motion failures).*
`scratch/contactStats.ts`, one code path for recorded tracks
(`contactData.ts`, 22 fit colonies, PreTreatment 24 h, light 06–18 UTC /
dark) and simulated observers (`tmpShortSim --phase light|dark`, 2 h
warm-up + 12 h, seed 4242, frozen tracker). Pair of tracked in-nest ants
both detected: near if centre distance < r, far once > r + 1 mm
(hysteresis); a contact is a far → near transition (joint gaps ≤ 3
frames). r = 4.1 mm (one body length, primary) and 6 mm (sensitivity).
Statistics per colony and phase: contacts per detected ant-hour (×2 per
event); share of contacts with at least one ant moving (≥ 0.6
mm/frame); share of ant-frames with a near neighbour. Fit tracks used for
a new, non-fitted check statistic (contamination log). **Seen before this
entry:** colony 0's data values only, as a code check (light ≈ 142, dark
≈ 63 contacts per ant-hour at 4.1 mm; near share ≈ 0.93); no model value.
- Arms: control (start point σ 0.4), speed arms m0.8-s1-t1 and
  m0.6-s3-t0.5 (the smallest and largest short-still shifts of v2), the
  four oracle arms, the C1 estimate, and the three slow-episode arms below;
  light and dark.
- **Reading, fixed now:** ratio model / data of contacts per ant-hour at
  4.1 mm, geometric mean over colonies with a colony bootstrap 95 % CI,
  per phase. **Contacts adequate** if the control's ratio CI overlaps
  [0.8, 1.25] in both phases → the motion failures do not compromise
  contact rates at the precision the colony step needs; this favours
  accepting the disclosed failures and moving on (the user decides).
  **Not adequate** → in-nest motion matters downstream; the arms then show
  which changes move contacts toward the data (|log ratio| falls by more
  than its CI half-width). The moving share and the 6-mm results are
  reported beside it, not as criteria. The 25 % tolerance is a judgement
  (between-colony spread is larger), stated before the result.

*2. Dark-phase oracle synchrony* comes from the same runs (synchrony is
kept in the lite outputs): coupled and placebo arms in dark, read with
the 05:11 rule against the data's dark blocks (22, 02 h), only after the
light result is read. Light-phase reading stays the primary one.

*3. Slow-episode what-if* (`ColonyOptions.slowEp`, `--slowEp
rate:dur:factor`; `test/oracle.test.ts`). A walking in-nest ant enters, at
`rate` per walking second, a slow episode of exponential duration (mean
`dur`) in which its walker's speed is × `factor`; stopping ends it.
Discrete two-state slowing, unlike the continuous log-speed noise of the
v1/v2 speed arms. The control's moving-step median is 1.03 / 1.48
mm/frame (nurse / forager), so factor 0.4 puts nurse episode steps at ≈
0.41 and factor 0.3 puts forager ones at ≈ 0.44 (the 0.3–0.6 band); dur 1
s matches the brief stills (< 2 s). Arms (start point, σ 0.4):
`se-r0.5-f0.4` (0.5/s, 1 s, 0.4), `se-r1-f0.4`, `se-r1-f0.3`. Outputs as
v2: rows (`diagS2018`, 4 seeds, paired with `logs/sf/diag-ctl.json`),
persistence (`tmpTrackerSim` 12 h, `simact.py`), step diagnostic
(`tmpShortSim` light, full output; its control is a fresh control run of
the same length). **Reading: the 03:08 rules unchanged** — (i) nurse
brief-still steps at 0.3–0.6 ≥ 0.40; (ii) |z| falls for ≥ 3 of the 4 short
rows; (iii) nurse 6-h persistence within 0.10 of the control. An arm
meeting (i)–(iii) → discrete slow episodes become a candidate model
element for the user (a mechanistic version designed then, not this
switch); none → the short-still deficit is not produced by discrete
slowing either, recorded as such; no further slow-episode arms in either
case. Costs reported beside them (loss by family, speedMove, contacts).

**2026-10-17 ≈ 05:55 UTC — Overnight addition: how fast does activity
spread? (user's question, just before this entry; logged before any
reading.)** Bears on the open point of the 03:50 synchrony result:
ant-to-ant coupling vs a shared external driver. `scratch/wakeStats.ts`,
one code path for tracks (`contactData.ts`, all 22 fit colonies, light /
dark by clock) and simulations (`tmpShortSim`, every overnight arm, both
phases). A wake is an ant's first moving step (≥ 0.6 mm/frame) after ≥ 10
s still; every pair of wakes of different ants within 5 min is counted by
distance band between the two wake positions (< 5, 5–10, 10–20, 20–40,
≥ 40 mm) and |lag| (frames). The overnight script was restarted (it was
only waiting for the oracle run) to include it; staged code checksums
match the local files. **Seen before this entry:** colony 0's wake counts
only (2213 light / 866 dark wakes; pair totals), as a structure check; no
correlogram looked at.
- **Reading, fixed now** (pooled over colonies, colony bootstrap; lag
  bins 0, 1, 2, 3–4, 5–8, 9–16, 17–32 frames; baseline = mean count per
  frame at 240–600 frames in the same band; excess = count / baseline − 1):
  - *Spread from ant to ant* if near-lag excess (|lag| ≤ 4 frames, 2 s)
    falls with distance (< 5 mm at least 2× the 20–40 mm band) **and** the
    lag bin with the largest excess moves later with distance (later in
    the 20–40 mm band than in < 5 mm); speed ≈ distance / lag between bands,
    reported with its bootstrap range.
  - *Shared driver* if near-lag excess is within a factor 1.5 across bands
    and peaks in the 0–1 frame bins in every band.
  - Otherwise *mixed*; described, no claim.
- **Method check before the data are read:** the coupled oracle arms
  (one colony-wide signal, no distance) must read *shared driver* or at
  least show no peak-lag growth with distance; the start-point control
  (local encounters only) is the other reference. If the coupled arms
  show a spurious lag gradient, the method does not discriminate and the
  data reading is not reported as evidence. Caveats stated now: 2 fps
  limits lag to 0.5 s steps; ≥ 10 s still before a wake selects settled
  ants; distances are between centres at the two wakes.
- **Disclosure (contact check):** after the 05:43 entry, a 10-min smoke
  run of the scripts (colony 0, dark, slow-episode r1-f0.4, 1 min warm-up)
  printed its contact rate (≈ 78 per ant-hour at 4.1 mm). A code check on
  a what-if arm, far too short to bear on the reading; noted as seen.

**2026-10-17 ≈ 05:57 UTC — Spread analysis amended before any reading
(user guidance, just before this entry).** Points taken: (1) detecting
spatially ordered activation is not identifying its cause, and an
external trigger plus ant-to-ant spread can coexist (a disturbance
starts a few ants, they start their neighbours); (2) the 05:55 baseline
(far-lag level) is a null that destroys both social spread and shared
triggers: beating it shows synchrony only; the informative null keeps
the shared activity episode; (3) the event is a **movement onset**
(a crossing of the 0.6 mm/frame threshold after ≥ 10 s below it), not
waking; the analysis and reports use that name (the code's JSON key stays
`wake`/`onsets` as written; the term is fixed here). The overnight batch
had not started (still waiting on the oracle run), so the recorded output
was extended; nothing has been read. **Replaces the 05:55 reading:**
- **Recorded:** every movement onset (frame, ant, position, still time
  before it) per phase; the far-lag correlogram stays as a description
  of synchrony only. Online, per frame, every still ant (≥ 10 s below
  threshold) is a unit at risk: *exposed* if it is contacted (far → near
  at 4.1 mm, as in the contact check) by a partner that is moving while it
  is not; outcome: its own movement onset within the next 4 frames (2 s).
  Strata: distance to the nearest movement onset in the last 4 frames (< 5,
  5–10, 10–20 mm, farther or none) × colony onsets in the last 10 frames
  (0, 1–2, ≥ 3), i.e. matched on episode timing and nearness to activity.
- **Episodes** (offline): onsets in time order, a gap > 10 frames (5 s)
  ends an episode; episodes with ≥ 3 distinct ants; the first onset is the
  initiator; each ant's first onset in it.
- **Test A — spatial order within the episode:** Spearman ρ between each
  participant's distance from the initiator and its lag after it, mean
  over episodes. Null 1 (keeps the episode: who took part, where, and the
  set of onset times): onset times permuted among the participants within
  each episode (1000 permutations). Null 2 (keeps usual location): the
  same ρ computed from the initiator position of 20 other episodes of the
  same colony and phase; a fixed regional order (one part of the nest
  always first) passes null 1 but not null 2. Usual activity: partial ρ
  adding each ant's leave-one-episode-out mean normalised rank. Colony
  bootstrap for every difference.
- **Test B — contacts predict onset:** Mantel–Haenszel risk ratio
  (exposed vs unexposed, the strata above), colony bootstrap.
- **Readings (as the guidance phrased them):** ρ above both nulls (CI of
  the difference excludes 0) and lag rising with distance → *spatially
  structured activation*, not yet proof of transmission (speed from
  distance / lag reported as a description); test B risk ratio CI above 1
  → *stronger evidence of a social contribution* (contact by a moving ant
  predicts onset beyond distance and episode timing); neither → *no
  resolvable travelling wave*; fast or more complex social coupling stays
  possible (2 fps: 0.5 s resolution). Above null 1 but not null 2 → a
  regional order, not spread from the starting point. Nothing here
  identifies what starts an episode.
- **Method check unchanged in role:** the coupled oracle arms (one
  colony-wide signal) must show neither ρ above null 2 nor a test-B effect
  beyond the control's. The control model's only local channel of this
  kind is weak and indirect (walk-on is suppressed by *still* contacts,
  `restCrowdExp`, so a neighbour that starts moving releases it; a moving
  partner's arrival does not raise it): its test-B value is the reference
  for that channel, not assumed positive. If the coupled arms fail this,
  the data are not read as evidence.
