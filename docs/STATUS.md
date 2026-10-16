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
  - **Next (user agreed, 2026-10-16 ≈ 23:20; Decisions log):** (1) now:
    persistence diagnostic, restShape series at the C1 estimate (1.4,
    50; box, ≈ 20 min) to tell heavy rest tails from a swamped trait;
    (2) in-nest speed fluctuation as a targeted comparison (short stops;
    may also relieve encounterStop at its bound and the restShape < 1
    pressure); (3) entrance-excursion path audit, local, in parallel
    (trips; lognormal give-up implemented, off). **No new fit until
    per-ant persistence is in the objective** (fit colonies; log the
    role) and the rest form is settled by (1). Step 5 only once motion is
    settled; the checks at the optimum (spread rule, crowding, stays)
    wait for an adoptable motion fit.
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
    identifying the scan.
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
  still-run distribution was compressed as a whole. Short-stop shares
  fell (−30 to −56 SE) and moving runs lengthened (runMove.P2 +14 / +16,
  means +9.5), but the long tail and the mean went too far:
  runStill.mean.forager 11.0 → 7.05 s (|z| 1.8 → 3.5; data 9.6),
  runStill.P60.forager 0.030 → 0.018 (|z| 3.7 → 4.3), runStill.mean.nurse
  19.7 → 10.0 (data 14.1, now too short, |z| 4.9 → 3.8), still.nurse
  slightly worse (5.4 → 5.9). Data still runs are fewer under 2 s *and*
  heavier-tailed than one rest process plus pauses gives; consistent with
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
