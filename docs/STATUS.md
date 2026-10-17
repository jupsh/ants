# Project status

_Last updated: 2026-10-17 ≈ 14:45 UTC (test-B model control read; before that L and O read, next steps and a quick guide for a new agent in RESUME). Keep this file current: update it whenever a step starts or finishes._

Earlier history is archived verbatim: up to 2026-10-10 evening (session
notes, step results, the first decisions log) in
[`archive/STATUS-2026-10-07-to-10.md`](archive/STATUS-2026-10-07-to-10.md)
("the archive"); the 2026-10-10 night entries (pilots, Buffin, Plan 4
options A and B, the B diagnostic, choosing Stroeymeyt) in
[`archive/STATUS-2026-10-10-night.md`](archive/STATUS-2026-10-10-night.md)
("the night archive"); the Stroeymeyt work from the colony split to the
frozen candidate C1 (2026-10-10 night to 10-15) in
[`archive/STATUS-2026-10-10-to-15.md`](archive/STATUS-2026-10-10-to-15.md)
("the Stroeymeyt archive"); fit C1 and the step-4b diagnostics after it
(2026-10-15 late evening to 2026-10-17 ≈ 06:38 UTC, with the RESUME and
Plan sections as they stood before the 2026-10-17 cleanup) in
[`archive/STATUS-2026-10-15-to-17.md`](archive/STATUS-2026-10-15-to-17.md)
("the C1 archive"). This file keeps the current state, the plan, the
**rules in force**, the evidence policy and open problems. New decisions
go in the Decisions log at the end; when this file passes about 1,000
lines, archive again.

## ▶ RESUME HERE

**State (2026-10-17 ≈ 14:40 UTC).** Milestone M1, *Lasius niger* as the
single reference species. Work is on `browser-sim-m1`, merged to `main`
(GitHub Pages) when the user asks (last merge `e1e6847`, 2026-10-16).

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
  - **Step 4 (in-nest motion), current work.** Candidate **C1**
    (`fda8ab3`; model, gates and fit rule in Rules in force). **Fit C1**
    (box, 2026-10-16, 20.8 h, 1389 evaluations;
    `data/fits/s2018-motion-c1.json`, `logs/c1/`, report
    `scripts/reportS2018.ts`): best within this search budget, not
    converged (stopped at the 60-generation cap), loss 647 (4 seeds);
    **not adoptable** (encounterStop at its bound, 19 of 32 targets > 3
    SE). It reached the short stops by compressing the whole still-run
    distribution, and per-ant persistence collapsed (restShape 0.70 < 1).
    Not adopted, not extended.
  - **Diagnostics since** (C1 archive and the entries below; verdicts and
    closed lines in Rules in force):
    - The **short-still deficit** (≈ 90 % of the start-point loss) stays a
      disclosed, unexplained failure: in-nest speed fluctuation (12 arms)
      and discrete slow episodes (3 arms) fail their logged rules at the
      settings tried; slowly varying tag error and rest creep, calibrated
      to the data, leave the 32 rows unchanged (observer not revised).
    - In the data, still periods carry widespread slow sub-threshold
      displacement (MSD, check B; no common camera drift); the model's
      still periods are mostly true rests.
    - **Colony synchrony:** D_w data 2.6 / 4.2 / 6.3 at 5 s / 1 min / 10
      min vs model 1.06 / 1.25 / 1.57; global oracle coupling (κ ≤ 1)
      closes under 40 % of the gap in light. **Comparison X (15:30):**
      mainly within-nest (external share across simultaneously recorded
      systems 0.09 [0.00, 0.20] at 1 min); within-nest coupling vs drivers
      local to one system not yet separated (distance check proposed).
      Rules (15:25): sensitivity gate in step 5; blocker before the
      structure freeze for held-out tests.
      **Y (16:19): mixed** — the data's co-movement decays smoothly over
      1–4 cm; the model's is contact-range only. **Defect (16:18):** the
      oracle / latent-state switches modulated nurses only (foragers' own
      walk-on value was never scaled); the oracle's closed line carries
      that caveat, reopening is the user's call.
    - **Contacts (centre-distance crossings, 4.1 mm): not adequate**;
      model / data light 0.50, dark 0.64, the deficit in crossings between
      still ants (0.26 / 0.29); moving-involved 0.78 light, 1.19 dark.
      **A blocker for step 5** (user, 13:11). **Comparison O (14:35):** the
      statistic is strongly observation-sensitive — slowly varying tag
      error (variant M) alone raises still–still crossings ×2.4 (0.26 →
      0.63 light, 0.29 → 0.72 dark) while leaving the rows unchanged;
      near share (a neighbour within 4.1 mm) is robust to it and shows the
      model less packed than the data (0.78 vs 0.95). Variant B is not
      usable for contacts (its offsets accumulate across rests).
    - A **per-ant latent activity state** (independent slow OU walk-on
      multiplier, SD 1 on the log scale, τ 60 s): **comparison L (14:35)
      supports a variability effect in both matched contrasts** — mean-one
      vs baseline and original vs constant ×1.65 — at matched realised
      activity: nurse T2 +0.04, nurse P2 / P10 |z| down (mean-one 34 → 27 /
      59 → 47), stillness not worse, persistence kept (0.44; data 0.43);
      a constant higher rate alone gives no T2 gain and worsens stillness.
      Nurse-only (by construction: the switch never reached foragers —
      defect found 16:18); it does not touch contacts. **Candidate model element
      for the user** (a mechanistic version to be designed).
    - **Contact-associated onsets** (test B): the association cannot be
      attributed to the contact (a comparable elevation precedes it); no
      contact-activation arm (user, ≈ 14:04).
    - C-a (periodic bursts): inconclusive, its rule does not
      discriminate; C-b: no refractory signature in complete still runs.
  - **Test-B model control read (14:45, reference only):** the model
    shows no contact-associated activation (exposed vs unexposed M = 1 RR
    0.93 light, 0.88 dark; contact ≈ matched close pass), so the data's
    RR ≈ 3 is not produced by the shared recorder and observer at the
    model's motion. Outputs in `logs/tb/`.
  - **Comparison R (15:34): no measurement-robust crossing statistic
    exists in the band × dwell family** — still–still contacts stay ×1.8–
    2.5 under variant M at every cell; moving-involved are robust with a
    dwell (0.95–0.97). Data side not run; options (a)–(c) for the user in
    the Decisions log. **Ra (15:51):** moving-involved contacts marginal
    in light (0.73–0.78), reproduced in dark (1.10–1.19); data light /
    dark 1.5, model 1.0. **P (15:51): mixed** — median NN matched, near
    share 0.82 (the model has ~20 % isolated ant-frames), occupancy at
    walls vs the data's colony-specific site.
  - **Comparison Q read (18:14):** W+E(1.0) reads "deficit is packing"
    by the table, but over-compacts (median NN 1.40 vs 2.17) and the
    M-observed count overshoots (×1.35–1.64); the guard failed (W cuts
    exits by a third). Qualified reading and options (a)–(c) in the
    Decisions log. Was: comparison Q, packing / aggregation arms (W wall-neutral; W+E
    emergent aggregation k 0.25 / 1.0; W+S data-fed site k 3, diagnostic
    only), control and M observers; design, outcome table and guard in
    the Decisions log ≈ 16:19. Read with `scripts/scratch/qAgg.py`
    after fetching `logs/q/cs-q-*`. Wall check (≈ 16:05): the model's
    edge-following puts ≈ half its ant-frames in a 3-mm wall band; the
    data's ants sit in a colony-specific cluster.
  - **Next steps (proposed to the user ≈ 14:38; each is pre-registered in
    the Decisions log before it runs):**
    1. **A measurement-robust contact statistic.** Widen the hysteresis
       (the 1-mm band is narrow next to a 0.7-mm drift) and require a
       dwell on each side of the crossing; calibrate with variant M — a
       robust statistic barely moves under M vs the control (bar to be
       logged, e.g. < 10 %). Recompute data vs model: if the still–still
       deficit survives, it is real; if it disappears, the contact blocker
       was largely measurement. Data side local (minutes; `contactData.ts`
       pattern), model side ≈ 1 h on the box.
    2. **Packing, from the same runs:** nearest-neighbour distance
       distributions and occupancy maps, data vs model (near share is
       already robust and differs: 0.95 vs 0.78).
    3. **Then the user decides** among a geometry-respecting physical
       creep arm (moves bodies, not observed positions), a packing /
       aggregation mechanism, or accepting the contact gap as a disclosed
       failure for step 5.
    4. **In parallel (desk work):** design a mechanistic per-ant latent
       activity state for nurses (slowly varying walk-on trait beside or in
       place of the fixed σ 0.4 trait), for a later fit together with the
       compact persistence targets.
    Parked, not to be run without the user: excitable (contact + refractory)
    coupling for synchrony (Napoli et al. 2026); any contact-activation
    arm; further speed, slow-episode, κ or τ_c arms.
  - **On hold:** the compact per-ant persistence targets (proposal
    2026-10-16 ≈ 23:35, C1 archive) and the entrance-excursion trip audit.
    No new fit before the persistence targets and their weights are logged
    and the rest form is settled; step 5 only once motion is settled; the
    checks at the optimum (spread rule, crowding, stays) wait for an
    adoptable motion fit.
  - **Box (rented 2026-10-15, kept):** vast.ai EPYC 9534, $0.307/h, `ssh -p 46397
    root@85.218.235.6`; worktree `/root/ants-w7`, synced by file copy (its
    own git HEAD is older and reads dirty; code checksums are checked
    against the local files before each launch). Node via `.
    /opt/nvm/nvm.sh && nvm use 22.22.1`, **SIM_WORKERS=62** (one per core;
    120 threads were slower). Old boxes' files in `logs/box-2026-10-11/`,
    `logs/box-2026-10-15/`.
  - Scratch, never commit (excluded locally in `.git/info/exclude`):
    `scripts/tmp*.ts`, `scripts/scratch/`. Logs (git-ignored): fit C1
    `logs/c1/`; diagnostics `logs/sf/`, `logs/sf2/`, `logs/t12/`,
    `logs/judge/`, `logs/orc/`, `logs/night/`, `logs/latent/`,
    `logs/extra/`, `logs/spread/`, `logs/lo/`, `logs/tb/` (box), data-side
    contacts / onsets / activity / test B in `logs/contacts/`; earlier `logs/act/`,
    `logs/trk*/`, `logs/s3/`, `logs/sp/`, `logs/short/`, `logs/trips/`.
- **E6 (Bles et al. 2022): development benchmark, not validation.** Its
  judging rule is pre-registered (Rules in force); it runs only after an
  adequate 1999 fit and the fit-protection checks, or, if the stopping
  rule ends the 1999 work without one, on the best step-5 fit, disclosed
  as such (user, 2026-10-11).
- **M1's honest end state (agreed 2026-10-10 night):** *calibrated and
  stress-tested, with failures disclosed*, not "validated". Validating the
  colony model needs independent held-out data; finding it is a work item
  now (Plan, parallel track).

### Quick guide for a new agent on step 4b (written 2026-10-17 ≈ 14:40 UTC)
- **Read first:** CLAUDE.md; this RESUME block; Rules in force (step-4b
  verdicts and closed lines); Evidence policy and contamination log; then
  the Decisions log entries of 2026-10-17 at the end of this file, newest
  last (each has its design, its fixed reading and its result). Older
  detail is in the C1 archive.
- **How this user works:** every comparison is designed and its reading
  fixed in the Decisions log *before* it runs, then read mechanically
  against that reading; a weak rule found at reading time is disclosed,
  not quietly replaced. The user often pastes guidance from a reviewer:
  log it as "user guidance, pasted, adopted", and correct overstated
  conclusions in place (dated), never silently. Bounded arm sets, no
  further arms after a "no further arms" verdict, no fits without the
  user. Ask before committing; commits carry no Claude attribution;
  pushing to `main` bypasses a PR rule, so only when asked.
- **Hygiene that has gone wrong before:** run `date -u` before writing
  any STATUS timestamp (entries were repeatedly written ahead of the
  clock); while a pre-registration is open, only check that outputs exist
  (CLAUDE.md, blind checks); name anything seen early in the entry and
  the reply.
- **Literature:** only the cleared papers in `literature/` (pinned in
  `docs/literature.json`); search their text with `rg -n "…"
  .cache/papers`. Held PDFs live in `~/ants-literature/held/` behind a
  hook — never work around it; clearing a paper is the user's decision.
  Held out: the 10 Stroeymeyt age-experiment colonies and the Stroeymeyt
  SM beyond its methods.
- **Tools (all runs at the start point, seed 4242 / 'diag' seeds,
  paired with the controls):**
  - rows: `diagS2018.ts --at start [--set …] [--oracle …] [--slowEp …]
    [--obsVariant …] [--pxRound …] --reps 4 --out f`, compared with
    `reportS2018.ts --est f --start logs/sf/diag-ctl.json` (paired shifts);
  - persistence: `tmpTrackerSim.ts --colony c --mode tracker --obsH 12`
    → `logs/act/sim-s<set>-c*.log`, read by `scratch/simact.py`
    (control set `0.4`);
  - step diagnostic, T2, synchrony, contacts, onsets, activity series,
    test B: `scratch/tmpShortSim.ts --colony c --trips [--phase
    light|dark] [--obs 43200] [--lite] [--tb] --tag t` (4-h full output
    for T2 and steps; 12-h `--lite` for contacts / onsets / synchrony);
    data side `scratch/tmpShortData.ts`, `contactData.ts`,
    `contactOnsetData.ts`, `activityData.ts` (local, fit tracks);
  - aggregators (`python3 -I`): `sf2Agg.py` (brief stills),
    `t12Agg.py` / `t2Paired.py` (T2), `syncAgg.py` (synchrony),
    `contactAgg.py` / `contactSplit.py` (contacts), `spreadAgg.py`
    (episodes), `tbAgg.py` (test B), `caAgg.py`, `cbAgg.py`;
  - controls: rows `logs/sf/diag-ctl.json`, persistence `sim-s0.4`, T2
    `t12-ctl`, contacts / onsets `night-ctl`.
  - Diagnostic switches (runner-level, off by default, tested
    bit-identical, never adoptable): `ColonyOptions.oracle`
    (coupled / placebo / const, `meanOne`), `slowEp`; observer variants
    `posDrift`, `pxRound` (`test/oracle.test.ts`, `test/obsVariant.test.ts`).
- **Box:** copy only the changed files, compare md5 with the local
  files before launch, and never overwrite a file that running jobs still
  load — stage it and let the queued script copy it in. Launch with
  `(setsid nohup bash script > log 2>&1 < /dev/null &)` (a plain
  background job over ssh hangs). Long runs: `bash scripts/run.sh start
  <name> -- <cmd…>` (does the detached launch; per-run folder, end
  notification from the run itself; `npm run runs -- --box`), from
  2026-10-17 ≈ 14:50 once copied to the box; before that, one hourly
  watcher on a `.done` file. Big per-colony outputs stay on the box: reduce them there
  (`cs-*` files) and fetch the reductions; the disk was ≈ 94 % full
  (2.0 GB free, 2026-10-17 14:42) before the cleanup below. Fetch many small files as one
  `tar czf -` stream over ssh (an `scp` glob timed out). The box's raw
  `logs/short` (1,606 files, 29 GB, summaries not positions) is archived
  locally in `logs/box-2026-10-17/short.tar.zst` (6.6 GB; every file
  checked against the box's md5 manifest `short-md5.txt`, 2026-10-17);
  the user deleted the 1,606 verified files on the box (box disk 7 %
  used, 30 GB free, 2026-10-17).
- **Pitfalls found the hard way:** observer variant B accumulates offsets
  across rests (unusable for anything geometric); an `exp(x)` multiplier
  is not mean-preserving (use `meanOne`); a "local maximum anywhere"
  periodicity rule passes noise; strict uninterrupted tracking keeps only
  ≈ 8 % of onsets; contact-onset associations need a pre-contact time
  course before any causal reading.

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
   C1 done 2026-10-16, not adoptable; diagnostics and the contact
   blocker**, RESUME). Fitted to rows 2–3 (32 fit rows; provenance:
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
- **Box:** rented 2026-10-15 for step 4b and kept (RESUME); whether it
  stays for step 5 is the user's call.

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
  most 30 generations for C1 (raised to 60 on 2026-10-16 for run time
  only; C1 archive), tolX 0.03, estimate = mean of the last 20
  generation means, then the selection batch. (4) No IPOP restart; if the
  other start's selection loss is within 20 % and its estimate differs by
  > 0.5 box units in any coordinate, phase 2 also runs from it. (5)
  Phase-1 results fall under the pilot conditions (never reported as fit
  quality, judged, ranked or adopted); seeds keyed by phase and start.
- **C1 is diagnostic:** its estimates support no biological conclusions;
  report items as in the Decisions log (2026-10-15 late evening). No new
  behavioural mechanism and no relaxed gate without the user; no further
  model expansion this round (user, 2026-10-15).

Stroeymeyt step 4b after fit C1 (collected 2026-10-17 from the C1
archive; each item traceable to its dated entry there or below):
- **C1:** a useful diagnostic fit; not adopted, not extended (guidance,
  2026-10-16 ≈ 23:30).
- **Rest form:** no automatic switch away from Lomax and no restShape
  bound from the persistence diagnostic alone; if a finite mean
  spontaneous rest is required, the bound is restShape **> 1** (strict),
  a property of the isolated rest, not of observed rests interrupted by
  other behaviour (2026-10-16 ≈ 23:30).
- **Next motion fit:** per-ant persistence among its targets as a compact
  set with its weighting fixed beforehand (correlated lags never count as
  independent targets); a four-row proposal (persistence and top-20 %
  spread per group) logged 2026-10-16 ≈ 23:35, on hold; whether σ becomes
  free is not decided. No full search budget before this is logged.
- **Hypotheses are judged on gains and costs together**, persistence
  included; costs listed by row family, never hidden in a sum
  (2026-10-16 ≈ 23:30, 23:35).
- **Closed lines (no further arms):** in-nest speed fluctuation (4 arms
  with the mean kept, 2026-10-17 ≈ 00:10 / 00:55; 8 with the mean lowered
  and shorter τ, ≈ 05:08); global oracle coupling (no further κ or τ_c,
  ≈ 06:20; **caveat 16:18: it coupled nurses only** — reopening is the
  user's call); discrete slow episodes at the tested settings (13:10; this
  rejects the settings, not the mechanism, 13:11); a contact-based
  activation arm is not warranted on current evidence (14:02, user).
- **Measurement:** the track-only measurement checks stopped at checks A
  and B (2026-10-17 ≈ 01:05 rule); slow per-tag error vs rest creep is
  not separable from the tracks, recorded as a limitation. For the 32
  motion rows the difference does not matter (sensitivity verdict
  AGREEMENT, ≈ 03:05) and the observer is not revised; for contacts it is
  open (comparison O, 13:11 / 13:15). Observer variants (`posDrift` tag /
  rest, `pxRound`) are off by default.
- **What-if switches** (`ColonyOptions.oracle` coupled / placebo / const,
  `slowEp`) are runner-level, outside `src/sim/behavior/`, off by default
  (tested bit-identical) and never adoptable; a mechanism one of them
  suggests is designed separately and logged before acting (≈ 05:11,
  05:43, 06:22).
- **Contacts:** contacts from tracks are crossings of tracked centres
  into 4.1 mm (far again past 5.1 mm), not verified touches; the contact
  deficit is a **blocker for step 5** (user, 13:11).
- **Colony synchrony (user, 2026-10-17 ≈ 15:25):** not a blocker for
  step 5 as such (no 1999 row measures it, and the rows are recruiter
  means), but (1) **sensitivity gate in step 5:** before a step-5 fit is
  adopted, the 1999 rows are re-evaluated at its optimum with the oracle
  coupling on (κ = 1, τ_c 60 s) and its placebo; if any row moves by
  more than ≈ 1 combined SE beyond the placebo, or the adoption verdict
  changes, synchrony becomes a step-5 blocker (a null shows insensitivity
  to this partial, artificial synchrony only — disclosed as such); (2)
  **blocker for freezing the model structure** before any held-out
  colony test (Mailleux et al. 2011: nest exits rise with starvation
  independently of direct contacts, a colony-level effect): the cause of
  the synchrony is investigated and either modelled or its absence
  argued and disclosed before the freeze.
- **Literature-derived structures parked** until the current tests are
  read (user, 2026-10-16 ≈ 23:58): a two-class or mixed activity trait, a
  duration-dependent stop hazard, "the more the faster"; an excitable
  coupling diagnostic (contact-based activation with refractoriness,
  2026-10-17 ≈ 06:38) needs the user's decision. Literature helps choose
  tests; it does not expand the model before their results.

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
  - **Napoli, Garnier & Porfiri 2026** (PRX Life 4:033010,
    doi:10.1103/ghnl-p5c1; `~/ants-literature/held/NapoliGarnierPorfiri2026_NestPhaseTransition_PRXLife_DEVELOPMENT.pdf`,
    moved 2026-10-17 ≈ 14:30):
    **DEVELOPMENT** (user, 2026-10-17 ≈ 06:38 UTC). Theory paper: active /
    inactive / refractory ants, contact-based activation carried by
    movement, bursts past a speed–density threshold (*Temnothorax*
    parameters; no *Lasius*, no tracking data; Stroeymeyt only as a
    co-author of a cited paper). Read in full except the appendices
    (2026-10-17 ≈ 06:30 UTC). Source of hypotheses and test choices only
    (excitable coupling, burst periodicity, refractory signature); no
    parameter, target or validation claim.
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
  Fit C1 (2026-10-16, C1 archive): not adoptable; it reached the short
  stops only by trading the still-run tail and per-ant persistence. Since
  (2026-10-17): the short-still deficit is not produced by speed
  fluctuation or slow episodes at the settings tried and is insensitive
  to slow measurement error; the data's colony synchrony and contacts
  between still ants are not reproduced; a per-ant latent activity state
  is under test. No valid colony fit yet.

## Open problems and backlog
- **Colony:** contact-triggered leaving (Table 2b, G3) not modelled;
  the dt dependence of contacts and timeInNest (late-signal test);
  encounters are geometric overlaps (ants brush past; redesign in the
  Plan); `leaveCropFrac`'s effect on nestmate departures (sensitivity with
  E6); load-mass constant `LOAD_MG_PER_UL` 1.08 mg/µL (0.6 M sucrose;
  E6's 1 M food ~4 % heavier, negligible).
- **Stroeymeyt step 4 (beyond C1's disclosed failures):** ~~in-nest walking
  speed fluctuation (proposal parked until after C1)~~ tested and closed
  2026-10-17 (Rules in force); colony synchrony and the deficit of
  contacts between still ants (RESUME); the form of the slow
  sub-threshold displacement in still periods (not reproduced by the
  observer variants); entrance excursions vs foraging trips; the data's light/dark trip-location difference (×2.5
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
Earlier entries: the archive, the night archive, the Stroeymeyt archive
and the C1 archive (2026-10-15 late evening to 2026-10-17 ≈ 06:38 UTC;
times before 13:10 cited below without a date, such as "05:43" or
"00:25", are 2026-10-17 entries there). Newest last.

**2026-10-17 ≈ 13:10 UTC — Overnight results read against their logged
rules (box queue finished 10:28 UTC; the hourly watchers had not yet
fired; read in the logged order).**

*Slow-episode what-if (05:43 item 3): no arm supports it.* (i) nurse
brief-still 0.3–0.6 share 0.223 / 0.242 / 0.252 vs control 0.194 (bar
0.40); (ii) only forager P2 improves (|z| 51.1 → 50.0–50.5); nurse P2 and
P10 get worse (P10 59.1 → 61.3–64.3); (iii) persistence kept (nurse 6-h
0.52, control 0.49). Gains beside: speedMove (nurse |z| 4.7 → 1.8–3.1,
forager 7.9 → 2.7–5.0) and still.nurse (5.4 → 2.9–4.3); loss rises
(21 316 → 21 982 / 22 856 / 23 373). Discrete slowing does not produce
the short stills either; recorded, no further slow-episode arms.

*Contact check (05:43 item 1): contacts NOT adequate.* Model / data
contacts per ant-hour at 4.1 mm, control: light 0.50 [0.45, 0.56], dark
0.64 [0.56, 0.74] (6 mm: 0.44, 0.56). The data's contacts involve a moving
ant in 48 % (light) / 42 % (dark), the model's in 73 %; near share data
0.95, model 0.80. So the model has ≈ 0.76 of the data's contacts that
involve a mover but ≈ 0.26 of those between still ants. In-nest motion
matters downstream. Arms moving contacts toward the data beyond the
CI half-width: only the latent-state arms with SD 1 (light 0.60 / 0.59,
dark 0.77 / 0.76); speed and slow-episode arms move away (0.35–0.47),
C1 0.42 (near share 0.73), oracle arms unchanged. Reading (not a
criterion): the missing contacts are mainly among non-moving ants, which
points at the unreproduced slow sub-threshold displacement in still
periods (00:25 / checks A, B) and at closer packing in the data.

*Dark-phase oracle synchrony (05:43 item 2, secondary):* data dark blocks
2.52 / 3.99 (1 / 10 min), control 1.22 / 1.48; κ 0.5 1.43 / 1.93; κ 1 2.07
/ 3.25 (≈ 70 % of the gap at both, so in dark κ 1 meets the half-gap
bar); placebos 1.20–1.23 / 1.53–1.55, at the control's level. The
primary (light) verdict stands (not met); dark adds that the global
coupling gets closer when the data's own synchrony is weaker.

*Latent-state follow-up (06:22): the reading is supported in three arms,
with a design confound disclosed.* Paired nurse T2 arm − control (Fisher
z): SD 0.53 τ 60 s +0.012 [+0.005, +0.018]; SD 1 τ 60 s +0.033 [+0.023,
+0.041]; SD 0.53 τ 600 s +0.018 [+0.010, +0.025]; SD 1 τ 600 s +0.058
[+0.051, +0.065] (control +0.068, data +0.121). Loss 18 197 / 14 109 /
18 248 / 13 901 (control 21 316); nurse P2 and P10 |z| fall in all (SD 1:
34.3 → 20.3–20.4, 59.1 → 30.3–31.2). Nurse 6-h persistence 0.49 / 0.50 /
0.43 / **0.32** (control 0.49; the last fails the 0.10 bound). So SD 0.53
τ 60, SD 1 τ 60 and SD 0.53 τ 600 meet (1)–(3). Foragers: T2 unchanged in
every arm (−0.004 to +0.005), forager rows unchanged — nurse-only.
Cost: still.nurse |z| 5.4 → 7.3–13.5. **Confound found at reading, not
controlled in the design:** the switch multiplies walk-on by exp(x), x
OU with mean 0, so the mean multiplier is exp(SD²/2) — ×1.15 at SD 0.53,
×1.65 at SD 1. Part of the row gain (shorter rests, worse still.nurse) can
come from the raised mean rate alone. T2 is the part a constant rate
change cannot produce, and it moves; but the size of the row gain
attributable to variability is not identified. **Candidate model element
for the user, conditional on a mean-matched check** (x with mean
−SD²/2, or the control's walk-on scaled by exp(SD²/2)).

*Step size (06:23 E2): not an artefact.* dt 0.025, SD 0.53 τ 60 s vs its
own control: loss 21 299 → 18 201 (dt 0.05: 21 316 → 18 197); nurse P10
59.1 → 49.3, P2 34.4 → 30.1 (identical to dt 0.05).

*C-b (06:38): no refractory signature.* Hazard of a movement onset by
time since the last moving run (per min; light; complete runs): data
nurses 3.86 / 1.76 / 0.67 / 0.33 / 0.24 / 0.19 / 0.16 (10–20, 20–40,
40–80, 80–160, 160–320, 320–640, > 640 s), model 3.10 / 2.09 / 1.29 /
0.83 / 0.52 / 0.34 / 0.21; foragers alike in shape. Both fall
(bout-clustering, Lomax-like); the data's falls more steeply (×24 vs
×14), higher at 10–20 s and about half the model's at 40–160 s.
Description only: a steeper fall is what mixing high- and low-propensity
states gives, the same direction as the latent-state result.

*C-a data side (06:38):* light autocorrelation of colony moving
fraction 0.74 / 0.52 / 0.37 / 0.18 / 0.02 at 1 / 2 / 3 / 5 / 10 min, small
bumps at 17–28 min (+0.06–0.07, rise ≈ 1.2× the bootstrap half-width);
dark bumps at 55 and 82 min. The literal rule says "periodic" in both,
but the rule scans 115 lags for any local maximum, which makes a marginal
pass likely by chance (a weakness of the rule as written, noted before
the model side is read). Verdict waits for the control, read through the
same code (box runs, the model's 12-h activity series was not recorded
overnight; the 06:38 entry assumed it was).
Spread analysis (05:57): running (1000 permutations per episode).

**2026-10-17 ≈ 13:11 UTC — User guidance on the overnight results
(pasted, adopted), corrections, and the next two comparisons, logged
before building or running.**
- **Decisions:** run the mean-matched latent-state check next; the
  contact deficit is a **blocker** for moving straight to step 5.
- **Corrections to the 13:10 entry:** (1) "contacts" are distance
  crossings between tracked centres, not verified touches; physical creep
  is a hypothesis — slowly varying tag error could make some crossings,
  and packing changes how many pairs sit near the threshold. The earlier
  measurement-vs-creep comparison found little difference in the motion
  rows; it did not establish equivalence for contacts. (2) The 0.76 /
  0.26 split was light only and came from combined ratios. **Direct
  counts** (`scratch/contactSplit.py`, 4.1 mm, control / data): light
  moving-involved 0.78 [0.69, 0.88], still-still **0.26** [0.23, 0.29];
  dark moving-involved 1.19 [1.01, 1.42], still-still **0.29** [0.27,
  0.33] (data still-still 123 / 108 per ant-hour). The persistent deficit
  is in contacts between ants classified as still. (3) "T2 can't come from
  a higher constant rate" was too strong: a rate change alters crowding,
  which ants contribute complete runs and their observed sequences, and
  the model already gives T2 > 0. (4) C-b supports only "no recovery
  signature in complete observed still runs from 10 s on"; shorter
  refractoriness and effects hidden by selective censoring are not
  excluded. (5) The slow-episode result rejects the tested settings, not
  the mechanism.
- **Comparison L (mean-matched latent state), SD 1, τ 60 s, paired seeds:**
  (L0) baseline (existing); (L1) constant walk-on × exp(SD²/2) = ×1.6487
  (new, `--oracle const:1.6487`); (L2) existing latent multiplier exp(x)
  (mean ×1.6487; `lat-l1-60`); (L3) mean-one latent exp(x − SD²/2) (new,
  `--oracle placebo:1:60:unit`). Outputs per arm: rows (`diagS2018`, 4
  seeds), T2 (4-h light, `t2Paired.py`), persistence (`simact.py`),
  contacts (lite, light and dark, moving-involved / still-still split)
  and **realised activity** (stillness rows, moving fraction from
  `simact.py`). **Reading, fixed now** — judged together: the
  *variability* part of the latent state is supported if L3 vs L0 has
  nurse T2 difference CI above 0, nurse P2 and P10 |z| both falling, and
  nurse 6-h persistence within 0.10, **and** L3's T2 gain exceeds L1's
  (paired L3 − L1 colony-bootstrap CI above 0). If L1 reproduces L2's row
  and T2 gains (within their CIs), the gain is a rate effect and the
  latent state in this form is not supported. Anything between is
  reported as a decomposition (rate part L1 − L0, variability part L2 −
  L1, mean-one L3 − L0), with realised activity beside it, since matching
  the stationary mean does not match realised activity.
- **Comparison O (contacts under the observation variants):** the
  calibrated observer variants of 03:05 — M (tag 0.7 mm / 90 s), B (rest
  0.7 mm / 90 s), both with pixel rounding, and P (rounding only) — through
  the contact extractor (lite, light and dark, 12 h, seed 4242, paired
  with the overnight control). **Reading, fixed now:** measurement drift
  *substantially changes the apparent contact rate* if, for M or B, the
  paired still-still contact ratio (variant / control, geometric mean)
  is ≥ 1.25 with its CI excluding 1; then the data's still-still excess
  may partly be a tracking effect and the contact statistic needs a
  measurement-robust form before creep is modelled. Otherwise physical
  creep stays the leading hypothesis, to be tested only by an arm that
  moves actual bodies and respects geometry (a separate design later;
  the observer offset cannot test geometric consequences). Moving-
  involved contacts and near share reported beside it.
- No other arms. Spread analysis and C-a are still being read under
  their own entries.

**2026-10-17 ≈ 13:14 UTC — C-a read: inconclusive by its own rule (the
rule does not discriminate).** Model control (start point, 22 colonies,
12 h light and dark, same `activitySeries.ts` / `caAgg.py`): autocorrelation
of colony moving fraction 0.34 / 0.20 / 0.15 / 0.07 / 0.03 at 1 / 2 / 3 / 5 /
10 min (data light 0.74 / 0.52 / 0.37 / 0.18 / 0.02), and the logged rule
fires at many lags in both phases for the control, which has no periodic
mechanism. So the rule, as written, passes noise; it cannot support
"periodic". Description only: the data's colony activity is far more
autocorrelated at 1–5 min (the synchrony again); its light bumps at 17–28
min (+0.06–0.07) are above the model's (≤ +0.03) but are not established
as periodicity. No periodic-burst (Temnothorax-type) mechanism is assumed
for *L. niger* from this; a stronger test (e.g. spectral peak against
colony-level surrogates) would need its own design if it matters later.
Comparisons L and O launched 13:13 UTC (`logs/lo/run-lo.sh`; code
checksums match; 572 reduced duplicates removed from the box's
`logs/short` first, each verified to have its `cs-` copy on the box and
locally).
Clock note: the 13:11 and 13:14 entries were first headed 13:15 and 13:20
(ahead of the clock) and corrected; the code comments and
`logs/lo/run-lo.sh` cite "≈ 13:15" for the 13:11 entry and are left as
they are so the box copies keep matching the local checksums.

**2026-10-17 ≈ 13:15 UTC — Readings of L and O amended before any output
was seen (user guidance, pasted, adopted).** Context first: still–still
threshold crossings are underproduced in both phases, while
moving-involved crossings go from a deficit in light (0.78) to an excess
in dark (1.19): this argues against simply increasing movement
everywhere.
- **L — replaces the 13:11 reading.** Two matched contrasts isolate
  variability at each prescribed mean rate: **(i) L3 mean-one latent vs
  L0 baseline**, **(ii) L2 original latent vs L1 constant ×1.6487** (rows:
  `reportS2018 --est L2 --start L1`; T2: `t2Paired` with L1 as control).
  A *variability effect* is supported if **both** contrasts show the nurse
  T2 difference CI above 0 and nurse P2 and P10 |z| both falling, with
  nurse 6-h persistence staying within the agreed 0.10 of the baseline
  (preserved, not required to improve). The 13:11 condition "L3's T2 gain
  exceeds L1's" is kept only as an additional, stricter report; failing it
  while winning both matched contrasts does **not** mean "rate effect
  only". "Rate effect only" is concluded only if both matched contrasts
  fail. One contrast passing → reported as partial, by contrast. Realised
  activity, contacts (moving-involved and still-still) and stillness are
  reported beside every arm.
- **O — interpretation narrowed.** A small or null tag-drift effect does
  not make physical creep the leading explanation: the tested drift
  model already failed to reproduce parts of the observed displacement
  structure, so a negative result excludes that approximation only;
  packing and other measurement structures stay unresolved. A positive
  result shows the contact statistic is sensitive to observation. The
  ≥ 1.25 paired change is reported with the **absolute** model / data
  still-still ratios beside it (e.g. 0.26 → 0.325 would be a substantial
  observation effect that still leaves most of the deficit).
- C-a: "inconclusive" stands; short-lag autocorrelation shows temporal
  persistence of colony activity, which is neither periodicity nor
  synchrony between ants.
- No additional arms.

**2026-10-17 ≈ 13:30 UTC — Spread analysis read (05:57 rules; method
check first).** `logs/spread/`, `scratch/spreadAgg.py` (1000
permutations per episode; colony bootstrap).
- **Method check passes for false positives under that particular
  simulated shared signal** (softened 13:54, user): it does not exclude
  shared external causes generally — real disturbances could affect ants
  differently by location or state. Coupled oracle arms show
  no order beyond null 2 (ρ − null 2 −0.004 to +0.003, every CI spanning
  0, light and dark) and no test-B effect beyond the control's (MH risk
  ratio 0.92–0.93 vs control 0.91). Not tested: power to detect local
  spread (no arm with local, contact-based activation exists). Model
  episodes are long (≈ 21 participants, mean lag ≈ 36 s at every
  distance), so the gap-10 episode definition chains many onsets.
- **Test B (contacts predict onset): positive in the data, both phases.**
  Still ant contacted by a moving partner vs matched still ants (strata:
  distance to recent onset × colony onsets in the last 5 s): onset
  within 2 s, light **2.09 [1.97, 2.22]**, dark **2.18 [2.04, 2.35]**
  (crude 0.0190 vs 0.0076; 0.0152 vs 0.0058); model control 0.91 [0.89,
  0.94]. Per the reading: stronger evidence of a social contribution
  beyond distance and episode timing. **Open alternative, stated now:**
  an onset is a threshold crossing, so a push or jostle by the moving
  ant, or tag confusion when two tracked centres come close, could give
  the same signature without activation. The model's 0.91 shows its
  contacts do not trigger onsets (its only local channel is walk-on
  suppression by still contacts).
- **Test A (spatial order within episodes): weak.** Light: ρ +0.015
  [+0.005, +0.024]; above null 1 (+0.014 [+0.005, +0.023]) but not null 2
  (+0.009 [−0.000, +0.017]); partial +0.014 [+0.003, +0.028] → by the
  rule a *regional order*, not spread from the starting point. Dark: ρ
  +0.022 [+0.002, +0.054], above both nulls (+0.022, +0.021, CIs from
  +0.002), so the literal rule reads *spatially structured activation*;
  but the partial (usual earliness) is −0.021 [−0.102, +0.025] and the
  CI is lopsided, so it is not robust. Effect sizes are tiny either
  way. Description: mean lag after the initiator rises with distance in
  the data (light 12 → 18 s from < 5 mm to 20–40 mm, 25 s beyond 40 mm;
  dark 9 → 12 s, 18 s), flat in the model; data episodes are shorter
  (≈ 7 participants).
- **Summary:** synchrony is real and not reproduced; contact with a
  moving ant roughly doubles the chance of a movement onset in the data
  and not at all in the model; spatial ordering within episodes is weak
  at best. Nothing identifies what starts an episode. A check that
  separates activation from pushing (e.g. onset direction relative to
  the partner's motion, or requiring a sustained moving run after the
  onset) would need its own design.

**2026-10-17 ≈ 13:53 UTC — Test B recheck, design logged before building
(user guidance, pasted, adopted).** Name for now: **contact-associated
activation** (the tracks cannot yet separate behavioural activation from
pushing or tracking errors during overlap). Test A: little evidence for an
ordered travelling wave, especially after usual timing; its weakness does
not weigh heavily against local spread (no positive control at 2 fps).
`scratch/contactOnset.ts` (one code path, data and simulated observers;
4.1 / 5.1 mm hysteresis as before; moving = step ≥ 0.6 mm/frame between
consecutive detections).
- **Stricter definitions:** focal track uninterrupted (detected and in
  the nest every frame of the window); onset = first moving step after
  ≥ 20 consecutive still steps, **sustained** = it starts a run of ≥ M
  consecutive moving steps (primary M = 2, i.e. ≥ 1 s, which removes
  one-frame displacements; sensitivity M = 1 as before and M = 4); the
  outcome window starts on the frame **after** the contact crossing (f+1
  … f+4).
- **(1) Risk ratio and absolute increase:** units = ant-frames with the
  focal still for frames f−19 … f and detected through f+4+M; exposed if
  a moving partner (partner detected at f−1 and f) crosses into 4.1 mm at
  f; same 12 strata as before; Mantel–Haenszel risk ratio and risk
  difference, colony bootstrap.
- **(2) Time course before and after contact:** for each contact event
  with the focal still and detected for f−30 … f−11 and detected through
  f+10+M, the hazard of a first sustained onset at offsets −10 … +10
  frames; an elevation before 0 means movement already beginning before
  contact.
- **(3) Close passes:** a moving partner crossing into 7 mm (hysteresis 8
  mm) with the pair never within 4.1 mm from f−4 to f+4; same time course
  and risk; contact vs close pass separates the contact threshold from
  general nearby motion.
- **(4) Share of onsets:** fraction of all sustained onsets (eligible
  units) preceded by such a contact within 4 frames, and the excess
  share exposed × (1 − 1/RR).
- **(5) Direction, supporting only:** cosine between the focal's first
  sustained displacement and the partner's motion at contact (contacts
  and close passes); not a discriminator on its own.
- **Reading, fixed now:** contact-associated activation **survives** if
  the M = 2 risk ratio CI stays above 1 in both phases, the time course
  shows no elevation before contact comparable to the one after
  (pre-contact offsets −4 … −1 below half the excess at +1 … +4), and
  contacts exceed close passes (risk ratio of contact vs close-pass
  events, CI above 1). It is **reduced to mechanical / tracking** if the
  risk ratio falls to ≈ 1 (CI including 1) once M = 2 and the
  uninterrupted-track rule apply. Mixed outcomes reported as such. The
  absolute increase and the share of onsets decide how much of the
  colony's synchrony it could carry, reported regardless. Model control
  (start point, light and dark, 12 h) through the same code on the box
  after L and O. **Then** decide whether a contact-based activation arm
  is warranted, judged on synchrony, onset timing and contacts together.

**2026-10-17 ≈ 13:54 UTC — Test B recheck design amended before running
(user guidance).**
- **Onset results kept alongside sustained movement:** M = 1 (original
  onset) and M = 2 are both primary and reported side by side (M = 4
  sensitivity). An association that survives at M = 2 extends beyond a
  brief displacement; one that disappears at M = 2 does **not**
  distinguish a push from a genuine brief behavioural response — the
  13:53 outcome "reduced to mechanical / tracking" is withdrawn.
- **Contact vs close pass matched on information available before the
  outcome only:** strata = recipient's still time before the event
  (20–39, 40–119, ≥ 120 frames) × local density (tracked ants within 10 mm
  at the event: 0–2, 3–5, ≥ 6) × partner speed at the event (0.6–1.0,
  1.0–1.5, ≥ 1.5 mm/frame) × episode timing (colony onsets in the last 10
  frames: 0, 1–2, ≥ 3); Mantel–Haenszel risk ratio contact / close pass of
  an onset at f+1 … f+4 (M = 1 and 2), colony bootstrap. Eligibility uses
  only the past (still for the 20 frames up to the event) plus track
  continuity through f+8 (detection, not stillness), the same for both.
- Correction found while building: the time-course null now also
  requires the recipient still at the reference frame, as contacts and
  close passes do.
- Reporting unchanged otherwise: risk ratio and **absolute increase**
  (exposed vs matched unexposed), the **fraction of onsets preceded by a
  contact** and the excess share, time course −10 … +10, direction as
  supporting only. Reading: contact-associated activation is supported
  beyond overlap errors and pre-contact movement if the M = 1 risk ratio
  stays above 1 with the uninterrupted-track rule, pre-contact offsets
  show no comparable elevation, and contacts exceed matched close passes;
  survival at M = 2 is reported as extending beyond brief displacement.

**2026-10-17 ≈ 14:02 UTC — Test B recheck read (13:53 / 13:54 rules), data:
the association cannot be attributed to the contact; a smaller
additional contact effect remains unresolved** (wording softened ≈ 14:04,
user).
`scratch/contactOnset.ts`, `contactOnsetData.ts`, `tbAgg.py`; 22 fit
colonies. Strict tracking cuts the sample: uninterrupted sustained onsets
are ≈ 8 % of the 05:57 onsets.
- **(1) exposed vs matched unexposed (onset at f+1 … f+4):** light M = 1
  RR 2.97 [2.73, 3.29], risk difference **+0.72 pp** [+0.62, +0.81]
  (1.08 % vs 0.32 %); M = 2 RR 2.23 [2.03, 2.46], +0.10 pp; M = 4 RR 1.83
  [1.54, 2.14], +0.01 pp. Dark M = 1 3.33 [3.05, 3.67], +0.65 pp; M = 2
  2.49 [2.24, 2.76]; M = 4 2.32 [1.81, 3.03]. The association survives
  the uninterrupted-track rule and extends beyond one-frame displacement.
- **(2) time course (M = 2, hazard per 10⁴ per frame, offsets −1 and 0 are
  0 by construction):** light contact 2.23 / 1.86 / 2.77 / 3.14 (−10…−5 /
  −4…−2 / +1…+4 / +5…+10), null 1.22 / 0.92 / 1.46 / 1.45, close pass
  1.44 / 1.21 / 1.65 / 1.80; dark contact 1.71 / 1.50 / 2.44 / 2.28, null
  1.09 / 0.68 / 1.04 / 1.20. Contact / null ≈ 1.8–2.2 before and after the
  contact alike. Excess over null pre (−4…−2) / post (+1…+4): light 0.94 /
  1.30 = **0.72**, dark 0.82 / 1.40 = **0.58** — above the logged "below
  half": a comparable elevation precedes the contact. **Fails.**
- **(3) contact vs matched close pass (pre-outcome strata):** light M = 1
  1.63 [1.53, 1.79], M = 2 1.30 [1.17, 1.49], M = 4 1.10 [0.91, 1.42];
  dark 1.91 / 1.47 / 1.35. Passes, but the pre-event hazard already
  differs (light −10…−5 contact / pass ≈ 1.55 vs post ≈ 1.68), so the
  matching does not remove the pre-existing difference.
- **(4) frequency:** sustained onsets preceded by a contact within 2 s:
  light 5.5 % [4.9, 6.1], dark 4.3 % [3.6, 5.0]; excess share ≈ 3.1 % /
  2.6 % even taking the risk ratio at face value. These recorded contacts
  precede only a small fraction of sustained onsets, which limits their
  direct contribution under this definition; rare initiating events could
  still have wider consequences, for which there is currently no evidence
  either way.
- **(5) direction:** mean cosine with the partner's motion +0.02 / −0.01
  (contacts), +0.01 / +0.15 (passes); the absent alignment weakens a simple
  pushing account without excluding every mechanical interaction
  (supporting only).
- **Reading:** M = 1 RR above 1 with uninterrupted tracks ✓; contacts above
  matched passes ✓; no comparable pre-contact elevation ✗. The elevated
  onset rate before contact is the decisive finding: the original
  comparison picked up differences that already existed between recipients
  and controls, so the association cannot be attributed to the contact,
  and a smaller additional effect remains unresolved (the pre-contact
  excess undermines the causal reading without proving zero effect). The
  result is consistent with fluctuating activity states or spatial
  selection — which makes comparison L particularly relevant — but does
  not establish either. A contact-based activation arm is **not warranted
  on this evidence** (user agrees, ≈ 14:04; no contact-activation arms
  now); the 13:30 "stronger evidence of a social contribution" is
  superseded by this recheck. Model control through the same code still
  runs after L and O, as logged (reference only).

**2026-10-17 ≈ 14:10 UTC — STATUS cleanup (user request).**
- Decisions-log entries from "User decisions after the diagnostics"
  (2026-10-15 late evening) to the Napoli et al. reading (2026-10-17
  ≈ 06:38 UTC) moved verbatim to `docs/archive/STATUS-2026-10-15-to-17.md`
  (checked byte for byte against the previous file), with the previous
  RESUME and Plan sections appended there verbatim. The entries from the
  overnight results (≈ 13:10) on stay here: they hold the readings of the
  running comparisons L and O and the test-B recheck.
- Rules still in force from the archived entries are collected in § Rules
  in force ("Stroeymeyt step 4b after fit C1"); the C1 phase-2 cap raise
  is noted in the two-phase fit rule. RESUME, Plan step 4, Results in
  brief and Open problems rewritten around the current state; Evidence
  policy unchanged. Nothing was run and no log or fit output was opened
  for the cleanup.

**2026-10-17 ≈ 14:30 UTC — Literature access: held papers moved out of
the repo; ranked search dropped (user decision, logged before acting).**
- **Why.** An uncommitted SQLite full-text search tool
  (`scripts/research_search.py`, `docs/SEARCH.md`, PDF allowlist
  `docs/search-sources.json`) was evaluated with the user. For Markdown it
  added little over `rg` (corpus ≈ 850 KB; word matching without stemming
  fails on the same wording mismatches as `rg`). Its value was the PDF
  allowlist, but that was advisory only: nothing stopped a direct
  `pdftotext` or a Read of a held PDF. The user chose the guardrail without
  the search tool.
- **Decision.** (1) `literature/` keeps only the 11 papers cleared for
  full-text reading (Auger/Hansen 2005, Sakamoto/Akimoto 2017, Carrella
  2021, Charbonneau/Dornhaus 2015, Crosscombe 2026, Gallotti/Chialvo 2018,
  Buffin 2011, Nicolis 2005, Depickère 2004, Greenwald 2015, Mailleux
  2000; roles unchanged, § Evidence policy). The other 18 (held-out,
  unread, role-pending, methods-only, results-restricted, partially read)
  move to `~/ants-literature/held/`, outside the repo; new PDFs go there
  first and move into `literature/` only after a logged decision clears
  the whole paper. (2) Claude Code settings deny reading that folder, with
  the file tools and with shell commands. (3) `scripts/paperText.ts`
  extracts the cleared papers to `.cache/papers/<paper>/pNN.txt` (one file
  per PDF page, gitignored) for `rg`; each paper is pinned by SHA-256 in
  `docs/literature.json`, with the decision that cleared it, and a paper
  whose bytes changed is refused. (4) The search tool, its docs,
  evaluation and tests are deleted (never committed).
- **Exposure.** During the evaluation only cleared papers were opened
  (Crosscombe pp. 3, 10, 12; Charbonneau/Dornhaus pp. 7, 10; via the tool
  and one direct `pdftotext` of Charbonneau p. 10). No held paper was
  opened. Paper roles and the evidence policy are unchanged.
- **Done (≈ 14:40).** 18 PDFs moved; the 11 cleared ones match their
  pinned hashes. `scripts/paperText.ts` tested (extraction, skip when
  unchanged, refusal on a changed hash, warning for an unlisted PDF).
  Guard: `.claude/settings.local.json` denies Read of `~/ants-literature/**`
  and runs `.claude/hooks/sealed.py` before Bash/Read/Grep/Glob, refusing
  any call whose text names a path in `.claude/sealed-paths.txt` (local
  only, not committed; it can also seal pending outputs during a blind
  check). Verified live: a Read and a `cat` of a harmless test file in the
  held folder were both refused. Side effect: any shell command or search
  that merely mentions the folder name is refused too (edit such text with
  the editor tools).

**2026-10-17 ≈ 14:35 UTC — Comparisons L and O read (rules of 13:15,
amending 13:11).** Box run 13:13–14:28 UTC; `logs/lo/`, contacts in
`logs/night/cs-night-{latconst,latunit,obs*}-*`.

*L — the variability effect is supported in both matched contrasts
(nurses; realised activity matched).*

| contrast | nurse T2 (Fisher z) | nurse P2 / P10 \|z\| | still.nurse \|z\| | loss | nurse 6-h persistence | nurse moving fraction (median) |
|---|---|---|---|---|---|---|
| (i) L3 mean-one vs L0 baseline | +0.041 [+0.032, +0.050] | 34.3 → 26.9 / 59.1 → 46.7 | 5.4 → 5.0 | 21 316 → 17 713 | 0.49 → 0.44 | 0.0159 → 0.0157 |
| (ii) L2 original vs L1 constant ×1.6487 | +0.042 [+0.034, +0.050] | 27.0 → 20.4 / 38.4 → 31.2 | 14.7 → 13.5 | 15 788 → 14 109 | 0.57 → 0.50 | 0.0251 → 0.0247 |
| rate only: L1 vs L0 | −0.008 [−0.015, −0.001] | 34.3 → 27.0 / 59.1 → 38.4 | **5.4 → 14.7** | 21 316 → 15 788 | 0.49 → 0.57 | 0.0159 → 0.0251 |

Both contrasts: T2 CI above 0, nurse P2 and P10 |z| fall, persistence
within 0.10 of the baseline (L3 0.44, data 0.43). Stricter extra report:
L3 − L1 T2 +0.050 [+0.042, +0.058] (passes too). Decomposition: a higher
constant rate buys row gains with no T2 gain and a large stillness cost;
the variability part moves T2 and the short-still rows at matched
realised activity, with no stillness cost when mean-one. Nurse-only
(*by construction*, corrected 16:18: the switch never reached foragers):
forager T2 and rows unchanged in every arm (−0.005 to +0.008). Contacts:
L3 leaves them as the baseline (light moving-involved 0.78, still-still
0.25; dark 1.18 / 0.28); the higher-rate arms raise both a little (light
0.94–0.95 / 0.31–0.33). So a per-ant latent activity state (slowly
varying walk-on, SD 1, τ 60 s on the log scale) is a **candidate model
element for the user**, for nurses, addressing T2 and short stills; it
does not address the contact deficit. A mechanistic form (e.g. a slowly
varying walk-on trait beside or in place of the fixed σ 0.4 trait) would
be designed then, not this switch.

*O — the contact statistic is strongly sensitive to observation.*
Paired variant / control (r 4.1 mm), and absolute model / data:
- **M (tag drift 0.7 mm / 90 s, with rounding):** still-still ×2.43
  [2.32, 2.56] light, ×2.43 [2.32, 2.57] dark → absolute **0.26 → 0.63**
  (light), **0.29 → 0.72** (dark); moving-involved ×0.92; near share
  0.768 vs 0.781. Above the ≥ 1.25 bar: a per-tag slowly varying
  measurement error of the size calibrated to the data's still-period
  displacement — which left the motion rows unchanged (03:05) — produces
  roughly half of the still-still deficit in absolute terms.
- **P (rounding only):** ×1.01 — nothing.
- **B (rest drift): not readable for contacts.** Its offsets are kept
  after each rest (by design), so they accumulate across rests and move
  observed ants away from their true neighbours: near share 0.49 vs
  0.78, moving-involved ×0.57. This is the geometric distortion that an
  observer offset cannot avoid; its still-still ×1.10 / ×1.07 is not
  interpreted.
- **Reading (13:15):** positive → the data's still-still excess may
  partly be a tracking effect; the contact statistic needs a
  measurement-robust form before creep is modelled. Physical creep is
  not excluded (M shows sensitivity, not that the data's excess is
  error); packing (data near share 0.95 vs model 0.78) is unresolved and
  untouched by M. The contact deficit stays a blocker for step 5, now
  with the measurement question in front of the creep question.

**2026-10-17 ≈ 14:45 UTC — Test-B model control read (reference only,
13:53 / 13:54 design; no reading rule was fixed for it).** Box run
14:29–≈ 14:40 UTC, `logs/tb/run-tb.sh`, start point, 22 colonies, light
and dark, 12 h, same `scratch/contactOnset.ts` recorder and simulated
observer as the data; `python3 -I scripts/scratch/tbAgg.py
'logs/tb/tb-ctl-*-c*.json'`. Data figures (14:02) rerun with the same
aggregator for like-for-like units.
- **(1) exposed vs matched unexposed:** light M = 1 RR **0.93** [0.89,
  0.96], −0.12 pp; M = 2 0.93 [0.87, 0.97]; M = 4 0.94 [0.80, 1.06]. Dark
  M = 1 **0.88** [0.84, 0.91], −0.20 pp; M = 2 0.87; M = 4 0.89. Data:
  2.97 / 3.33 at M = 1.
- **(3) contact vs matched close pass:** light 1.00 / 1.08 / 1.13 (M = 1
  / 2 / 4), dark 0.97 / 1.02 / 1.18. Data 1.63 / 1.30 / 1.10 and 1.91 /
  1.47 / 1.35.
- **(2) time course (M = 2, per 1000 at risk; the 14:02 entry's per-10⁴
  figures are the same quantity):** contact and pass hazards sit at or
  below the null on both sides of the event (light −4…−2 ≈ 0.6–0.8,
  +1…+4 ≈ 1.0–1.1; null 0.7–1.0 / 1.2–1.3). The model's hazard level is
  ≈ 4–5× the data's (data ≈ 0.1–0.3), and it has ≈ 5× as many eligible
  sustained onsets (123 292 vs 23 918 light): the same direction as the
  known stillness mismatch, not read further here.
- **(4)** sustained onsets preceded by a contact within 2 s: 2.1 % light,
  2.0 % dark (data 5.5 / 4.3 %); excess share ≈ 0. **(5)** direction:
  contact mean cos −0.05 / −0.13, pass +0.15 / +0.12 (supporting only).
- **Reading (descriptive):** the recorder and observer applied to the
  model's motion give no association (RR slightly below 1), so the data's
  RR ≈ 3 is not an artefact of the shared code path at this geometry.
  This does not change the 14:02 reading: the data's pre-contact
  elevation still prevents a causal reading, and a model with no
  fluctuating activity state is expected to show none. Not repeated with
  the latent-state arm (L3): that would be a new comparison and needs the
  user. No arm follows from this.


**2026-10-17 ≈ 14:50 UTC — Run wrapper for long jobs (user decision,
logged before building; tooling only, no simulation code touched).**
- **Why.** Watchers lose track of runs: a stale `logs/fit-c1.done` from
  the killed first C1 run (the relaunch wrote none, so the check fell back
  to a `ps | grep` pattern); the C1 switch script's broken "left alive"
  check (malformed `ps` list); killing by a shared process name lost a
  7.5 h fit (2026-10-09); the overnight queue finished 10:28 and was read
  13:10, before the hourly watchers fired.
- **Design.** `scripts/run.sh start <name> -- <cmd…>` launches detached
  (`setsid nohup`) into its own folder `logs/runs/<name>-<UTC stamp>/`
  (command, start, pid, log). The wrapper, not the script, writes `exit`
  (code, end time), so failures are recorded; pid gone without `exit` =
  died; `run.sh kill` kills exactly that run's process group and marks it
  killed. `run.sh status` (`npm run runs`, `--box` over ssh) derives each
  state from the files on every call: running / quiet (log silent past a
  threshold) / ok / failed / killed / died. It never prints log content
  (blind checks); progress only from scripts that opt in by writing
  `$RUN_DIR/progress`. `run.sh wait <id>` blocks on the box; the local
  watcher is one ssh `wait` retried on connection loss, so the end is seen
  within seconds, and a push notification follows while the session is
  open. Existing launch and copy rules (RESUME, Box) unchanged.
- **Amended ≈ 14:51 (user: no dependence on a running Claude session).**
  The wrapper sends the end notification itself (`run.sh notify`, the
  command in `logs/notify.env` on that machine; message = host, run id,
  state, duration). Not covered: the box itself going away or a kill of
  the whole process group outside `run.sh kill`; those show as died in
  `npm run runs` but send nothing.
- **Done ≈ 14:53, local only.** `scripts/run.sh`, `npm run runs`,
  `runProgress()` in `scripts/lib.ts` (opt-in, wired into no script yet),
  `logs/box.env`. Tested locally: ok, failed(7), killed (no process of the
  group left), died (group killed from outside), quiet, progress, a reused
  name resolving to the newest run, `wait`, and notifications for ok,
  failed and an OOM-style kill of the main process (failed(137)) with no
  watcher running. Not yet on the box (copy under the Box rules before the
  next launch); notification channel not yet chosen. The Box launch rule
  (RESUME) and CLAUDE.md updated.
- **On the box ≈ 14:58 (user go-ahead).** Box idle (no node jobs).
  Copied only `scripts/run.sh` (new there; md5 d40a9d82… both sides);
  `scripts/lib.ts` not copied (`runProgress` is used by no script yet).
  Smoke run `smoke-20261017T145802Z` (sleep 3) read back as ok through
  `npm run runs -- --box`. No `logs/notify.env` on either machine yet.
- **Notifications on ≈ 15:01 (user chose ntfy, F-Droid app).**
  `logs/notify.env` on laptop and box (ntfy.sh topic, local only, not
  logged here; the box file sets `RUN_HOST=box`). Tests sent from both;
  a real box run (`notify-check-…`, sleep 2) notified on its own end.
  `run.sh` re-copied after adding `RUN_HOST` (md5 93b3638a… both sides).

**2026-10-17 ≈ 15:10 UTC — Comparison R (measurement-robust contact
statistic, next step 1), design and reading logged before building.**
Bar approved by the user (just before this entry): a robust statistic moves by less
than 10 % under variant M.
- **Statistic family (one code path for data and simulated observers,
  `scripts/scratch/robustContacts.ts`).** Pairs of tracked ants both
  detected in the nest, as `contactStats.ts`; entry radius **r = 4.1 mm
  fixed** (the contact definition, one body length). Grid: exit radius
  **rOut ∈ {5.1, 6.1, 7.1} mm** (band 1 / 2 / 3 mm; the relative offset
  of two tags under M has SD ≈ 0.7·√2 ≈ 1.0 mm) × **dwell D ∈ {0, 2, 4,
  10} frames** (0 / 1 / 2 / 5 s): a contact is a crossing into < r by a
  pair whose last D joint detections were all > rOut, confirmed when its
  next D joint detections all stay < rOut (counted then, classified by
  the moving flags at the crossing frame, as now). A joint gap > 3 frames
  forgets the pair, as now. The cell (5.1, 0) is the current statistic
  and must reproduce `ContactStats` counts exactly (check before the
  box run).
- **Calibration, model only (paired, seed 4242):** start point, 22
  colonies × light / dark × 12 h, `--lite`; control (observer unchanged,
  as `night-ctl`) and **M** (`--obsVariant tag:0.7:90 --pxRound
  0.0229658793`, as in O): 88 runs on the box. Per cell and phase, ratio
  M / control of pooled counts, still–still and moving-involved, colony
  bootstrap 2000. **A cell passes** if both ratios lie in [0.90, 1.10]
  in both phases (point estimates; CIs reported). **Choice:** the
  passing cell with the narrowest band, then the shortest dwell (closest
  to the established definition, keeps most events). Retention vs the
  current statistic reported, no rule. None passes → reported, no wider
  grid without the user.
- **Then data vs model on the chosen cell only** (data side computed
  after the choice; 22 fit colonies, PreTreatment, light / dark by UTC as
  before): model / data ratio of contacts per detected ant-frame,
  still–still and moving-involved, colony bootstrap as `contactAgg.py`.
  **Reading, fixed now (still–still):** the deficit **survives** (real
  at this geometry) if the ratio's 95 % CI upper bound is < 0.8 in both
  phases; it is **largely measurement** if the point ratio is ≥ 0.8 in
  both phases; otherwise **mixed**, reported as such. Moving-involved
  reported with the same thresholds, descriptive. The other cells' data /
  model ratios are reported afterwards as sensitivity, not used for the
  reading. Limit, stated in advance: insensitivity to M shows robustness
  to slow per-tag drift only, not to other tracking errors (jumps, swaps).
- **Packing recorded in the same runs (next step 2), not read:**
  nearest-neighbour distance histograms (tracked ants detected in the
  nest, 0–30 mm in 0.25 mm bins + overflow, per role and phase) and
  occupancy (observed positions in 1 mm cells, per colony, role and
  phase), control, M and later data. Their reading is logged separately
  before any packing output is opened (blind checks until then).
- **Amended ≈ 15:13, before any box run (found building).** Check 1
  passed: cell (5.1, 0) reproduces `ContactStats` exactly (colony 0,
  light, 300 s warm-up + 30 min: 388 / 288 control, 447 / 277 M, still
  the case after the amendment). Defect: "its last D joint detections
  were all > rOut" breaks the run on every frame in the band, so a slow
  approach (≈ 1.3 mm/frame through a 2–3 mm band) can never count — the
  wider bands kept 1–4 % of contacts. **Amended pre-crossing dwell: ≥ D
  joint detections > rOut since the pair was last near or first seen**
  (band frames neither add nor reset; a > 3-frame joint gap still
  forgets the pair, so re-acquisition inside the band needs a fresh D
  beyond rOut). Confirmation after the crossing unchanged. Choice rule,
  bar and data reading unchanged. **Seen while checking (disclosed):**
  the 12 cells' counts for that one colony / 30 min, control and M
  (e.g. dwell 0: 388 → 447, i.e. +15 % under M at every band — at
  dwell 0 the wider bands do little, apparently because gaps re-acquire
  pairs inside the band as far). Not used for the choice; the rule above
  stands.
- **Launched ≈ 15:14 on the box** (`run.sh` run
  `robust-20261017T151427Z`, script `scripts/scratch/box/run-robust.sh`,
  88 runs, `xargs -P 62`). Copied only `tmpShortSim.ts` (adds
  `--robust`, otherwise identical to the box copy) and
  `robustContacts.ts`; md5 checked both sides. Other differences found
  in the full checksum sweep, none loaded by this run's recorder:
  `scripts/lib.ts` (local adds `runProgress`), `syncStats.ts` (local
  adds 4-h blocks; synchrony is not read here), data-side scripts absent
  on the box. Reductions in `logs/robust/cs-rob-*`; calibration read
  with `scripts/scratch/robustAgg.py` (cells only, packing not opened).

**2026-10-17 ≈ 15:25 UTC — Synchrony: two rules adopted (user) and
comparison X (cross-colony synchrony) designed before building.** User
agreed (≈ 15:24) that synchrony is not a step-5 blocker as such, with a
sensitivity gate in step 5 and a blocker before the structure freeze for
held-out tests (both now in Rules in force, under Contacts), and asked
for a check that separates shared external drivers from within-nest
coupling.
- **Metadata (looked at before the design; not a result):** the 22 fit
  colonies' PreTreatment recordings (24.0 h each, `info_dat.txt`, Unix
  times) include **7 simultaneous pairs**, each started minutes apart in
  different experimental systems ('box'): 020/112 (61/71), 215/213
  (92/102), 250/241 (51/52), 224/204 (71/61), 261/260 (62/52), 226/220
  (81/91), 265/276 (92/102); 8 further pairs overlap by < 20 h (adjacent
  days). Whether the systems share a room is not in the dataset README;
  the Stroeymeyt paper is not cleared (not looked up).
- **Recorder** (`scripts/scratch/xsyncData.ts`, data only, fit tracks):
  per tracked ant (nurse or forager, in the nest), per 5-s clock bin
  (floor(t / 5)), moving steps and steps (moving step as the rows:
  ≤ 3-frame gap, ≥ 0.6 mm/frame), as `ActivitySeries`.
- **Statistic** (`scripts/scratch/xsyncAgg.py`): an ant's deviation in a
  bin = its moving fraction minus its own mean in that 4-h clock block
  (blocks as `syncStats`: 06, 10, 14, 18, 22, 02 UTC), at bin widths 5 s,
  1 min (primary) and 10 min; a series = mean deviation over the ants of
  one random half of a colony detected in the bin. **r_within:** Pearson
  correlation between the two halves of one colony (100 random splits).
  **r_sim:** between a random half of A and a random half of B for the 7
  simultaneous pairs, on common clock bins (100 draws). **r_non (null):**
  the same for all clock-aligned pairs never recorded together (time of
  day, floor((t mod 86400) / w)); they share the light schedule and daily
  rhythm but not room events. The 8 partly overlapping pairs are left
  out. **External share E = (r_sim − r_non) / (r_within − r_non)**,
  r_within over the 14 colonies of the simultaneous pairs; bootstrap 2000
  over the 7 pairs (with their colonies' r_within) and, independently,
  over the non-simultaneous pairs (colony clustering of the null ignored,
  disclosed).
- **Reading, fixed now (1 min; 5 s and 10 min reported beside):**
  **mainly within-nest** if E's 95 % upper bound < 0.25; **mainly shared
  external** if E ≥ 0.5 and its lower bound > 0.25; otherwise
  **undetermined / mixed**, reported as such. Separately, r_sim − r_non
  with its CI says whether any shared external component exists.
  Supporting only: the cross-correlation of the two series of each
  simultaneous pair at lags −5 … +5 min (the systems' clocks may differ).
- **Limits, stated now:** different systems, possibly different rooms,
  so a "within-nest" result cannot exclude drivers local to one system
  (its camera, lighting, handling); a positive result shows drivers
  shared across systems. 7 pairs: the CI may well be too wide to decide.
  The data were inspected before (C-a, activity series): this is a
  diagnostic on development-role use of the fit colonies, not a fit
  target. Runs locally (fit tracks, minutes); no box.
- **Amended ≈ 15:26, before any output (tooling only):** the aggregator
  is `scripts/scratch/xsyncAgg.ts` (no numpy here; pure Python too slow
  at 5-s bins), method as above; splits from `RNG.stream(7301, colony,
  split)`, bootstrap `RNG.stream(7302, w)`. Pair classes are computed
  from the recordings' bin spans (≥ 20 h simultaneous, ≤ 0 never
  together).

**2026-10-17 ≈ 15:30 UTC — Comparison X read (15:25 rules): the colony
synchrony is mainly within-nest; a small component is shared across
simultaneously recorded systems.** `logs/xsync/agg.txt`
(`xsyncAgg.ts`), recorder outputs `logs/xsync/data-c*.json` (22 fit
colonies). Pair classes from the data: 7 simultaneous pairs as listed,
216 never-together pairs.

| bin | r_within (halves, 14 col.) | r_sim | r_non (null) | r_sim − r_non | **E** |
|---|---|---|---|---|---|
| 5 s | 0.369 | 0.064 | 0.038 | +0.026 [+0.002, +0.054] | 0.079 [0.004, 0.169] |
| **1 min** | 0.519 | 0.101 | 0.060 | +0.042 [−0.000, +0.087] | **0.091 [−0.000, 0.197]** |
| 10 min | 0.566 | 0.176 | 0.113 | +0.063 [−0.026, +0.140] | 0.139 [−0.056, 0.311] |

- **Reading (1 min): E's upper bound 0.197 < 0.25 → mainly within-nest.**
  Halves of one colony co-move strongly (r 0.52 at 1 min); halves of two
  colonies recorded at the same time in different systems barely more
  than colonies recorded on different days at the same clock time. At 5
  s the shared excess excludes 0 (a small shared component exists —
  **tentative**, corrected ≈ 15:45: the null's bootstrap ignores that its
  216 pairs share colonies, so its CI is probably too narrow; the
  headline reading errs on the conservative side, this claim does not);
  at 10 min E is undetermined (CI −0.06 to 0.31).
- **Per pair (1 min):** 112/020 0.21 (strongest), 224/204 0.15, 250/241
  0.14, the other four 0.04–0.06. Supporting, full-colony cross-
  correlation at lags −5 … +5 min: 112/020, 250/241 and 261/260 peak at
  +1 to +3 min (B after A), 224/204 flat, 213/215, 226/220, 265/276 at
  or before 0 and small. Consistent with occasional shared events and
  clock offsets of a minute or two between systems; not read further.
- **What it leaves:** within-nest coupling between ants, **or** drivers
  local to one experimental system (its own camera, lighting, handling,
  vibration). It does not separate those. A system-wide position shift
  of resting tags was already excluded by check A (2026-10-16/17), so a
  pure camera artefact is unlikely, but box-level biological drivers are
  not excluded. Next discriminating check, proposed (not designed or
  run): synchrony against distance between ants within a colony (local
  coupling decays with distance; a box-level driver acts at all
  distances).

**2026-10-17 ≈ 15:34 UTC — Comparison R calibration read (15:10 / 15:13
rules): no cell passes; the data side is not run.** Box run
`robust-20261017T151427Z` ok (19 min, 88 runs); reductions
`logs/robust/cs-rob-*`, `logs/robust/calib.txt` (`robustAgg.py calib`;
cells only, packing not opened). M / control, pooled counts, light
(dark within 0.03):

| rOut \ dwell | 0 | 2 | 4 | 10 |
|---|---|---|---|---|
| 5.1 still–still | **2.51** | 2.41 | 2.39 | 2.38 |
| 6.1 still–still | 2.37 | 1.94 | 1.95 | 1.97 |
| 7.1 still–still | 2.36 | 1.81 | 1.82 | 1.85 |
| moving-involved (all bands) | 0.90–0.92 | 0.95–0.97 | 0.95–0.96 | 0.93–0.94 |

Retention vs the current statistic 0.97–1.00 at dwell 0, 0.45–0.65 at
dwell 2, 0.29–0.40 at dwell 10. Cell (5.1, 0) vs comparison O's ×2.43:
**checked ≈ 15:45** — O's and R's raw counts are identical in all 22
colonies, both phases, control and M; pooled still–still M / control
is 2.505 (light) / 2.534 (dark) from either run. O's ×2.43 is the
geometric mean of per-colony ratios (`contactSplit.py`), R's the pooled
ratio; aggregation only.
- **Reading:** no cell has both ratios in [0.90, 1.10]; per the rule,
  reported, no wider grid without the user, and the data-vs-model step is
  not run. Moving-involved contacts are robust with any dwell ≥ 2 (0.95–
  0.97, inside the bar); still–still contacts stay ×1.8–2.5 throughout.
- **Why (interpretation, not a criterion):** for two still ants, any
  change in observed distance is either real creep or measurement error.
  M's error varies on τ 90 s with a relative SD ≈ 1 mm, so dwells of ≤
  5 s are far shorter than its time scale and a band of ≤ 3 mm is ≤ 3
  SD: pairs resting 4–7 mm apart still cross. A crossing count between
  still ants is in effect a measure of distance fluctuation, which is
  what M adds; no band × dwell choice of this family separates it.
- **Consequence for the contact blocker:** the still–still deficit
  (model / data 0.26 light, 0.29 dark) cannot be shown real or
  measurement with an event statistic of this kind. Options for the user
  (none taken): (a) judge contacts on the moving-involved part with a
  robust cell (e.g. 5.1 / 2, ratios 0.97) — a new comparison, needs its
  own reading; (b) move the still–still question to state measures
  robust to M — near share (0.77 vs 0.78 under M, comparison O) and the
  packing statistics already recorded in these runs (next step 2);
  (c) a much wider dwell (minutes, at τ's scale) — would mostly count
  arrivals, not contacts.

**2026-10-17 ≈ 15:36 UTC — Comparisons Ra (moving-involved contacts), P
(packing) and Y (synchrony vs distance): designs and readings logged
before any data-side output or packing output exists** (user ≈ 15:35,
"sure" to (a) and (b); Y proposed at ≈ 15:31, taken as included).
Data side: `robustData.ts` on the 22 fit colonies (PreTreatment, light /
dark by UTC as before); model side: the R runs already on disk
(`logs/robust/cs-rob-{ctl,M}-*`). Packing parts of those files have not
been opened.

*Ra — contacts involving a moving ant.* **Cell fixed now: rOut 5.1 mm,
dwell 2** (moving ratio under M 0.972 / 0.970, closest to 1; the
narrowest-band rule would give (5.1, 0) at 0.917 / 0.914, near the
edge — reported as sensitivity with every other cell). Model control /
data, moving-involved contacts per detected ant-frame, geometric mean of
per-colony ratios, colony bootstrap 2000 (`robustAgg.py data`).
**Reading:** *reproduced* if the point ratio lies in [0.8, 1.25] in both
phases; *deficit* (*excess*) in a phase if its CI lies entirely below
0.8 (above 1.25); otherwise marginal. The data's light / dark contrast
is reported beside (old statistic: model / data 0.78 light, 1.19 dark).
If reproduced, the step-5 relevance argument (the 1999 contact rows are
the recruiter's, a moving ant's) is put to the user; the blocker stays
the user's call.

*P — packing (robust state measures).* From the recorded nearest-
neighbour (NN) histograms (tracked ants detected in the nest; 0.25-mm
bins) and 1-mm occupancy maps, per colony, role group and phase:
statistics **S1** median NN distance, **S2** share with NN < 4.1 mm
(near share), **S3** share with NN < 8.2 mm (two body lengths), **S4**
A50 = area (mm²) of the fewest 1-mm cells holding 50 % of ant-frames.
**Robustness filter first (model only):** M / control per statistic,
pooled per phase; only statistics within [0.90, 1.10] in both phases
are judged, the others reported only. **Then data vs model** (control),
per colony ratio model / data, geometric mean, colony bootstrap, all
ants (nurses and foragers beside, descriptive). **Reading:** the model
is *less packed* if S1 and S4 ratios have CIs entirely above 1.1 (or
S2 / S3 entirely below 0.9) for every judged statistic, in both phases;
*matched* if every judged statistic's point ratio is within [0.9, 1.1];
otherwise mixed. Descriptive beside: correlation of data and model
occupancy maps per colony (5-mm cells), i.e. whether the ants are in
the same places (the model has no brood or brood-pile attraction).

*Y — synchrony against distance between ants (comparison X follow-up).*
Recorder `scripts/scratch/ydistData.ts` (data, fit tracks): per tracked
ant per 1-min clock bin, moving steps, steps and mean observed position.
Deviation = moving fraction minus the ant's 4-h clock-block mean (as X).
For every pair of ants both detected in a bin, the product of their
deviations is accumulated by the pair's distance in that bin (distance
of mean positions; classes < 5, 5–10, 10–20, 20–40, ≥ 40 mm);
C(class) = Σ dev_i·dev_j / √(Σ dev_i² · Σ dev_j²) over the class's
pair-bins; per colony, then mean over colonies with colony bootstrap.
**Decay ratio D = C(< 10 mm) / C(≥ 40 mm)** (pair-bins < 5 and 5–10
pooled). **Reading:** *local coupling supported* if D's 95 % lower bound
> 1.5; *box-wide driver supported* if D's upper bound < 1.25 and C(≥ 40)
> 0 (CI); otherwise mixed. Limits, stated now: ants close together share
a micro-environment (brood pile, entrance region), so decay can also
come from region-specific drivers; nurses on the brood are both close and
mostly still. Reported beside: C by class for nurse–nurse,
nurse–forager and forager–forager pairs; the share of pair-bins per
class.
- **Y amended ≈ 15:43, before any Y data output exists** (`logs/ydist/`
  empty; user agreed ≈ 15:40 to model reference runs for Y in the 4-h
  gap). **Seen while smoke-testing the model hook (disclosed):** colony 0,
  model control, light, 300 s + 30 min: C(< 5) 0.13, C(5–10) 0.03,
  C(≥ 40) −0.006, so D = −11.6. Encounter mechanics alone give close ants
  correlated activity, and D is unstable when C(≥ 40) ≈ 0. **Amended
  reading:** primary statistics **L = C(< 10) − C(≥ 40)** (local excess)
  and C(≥ 40) (co-movement at a distance), data (24 h) vs **model
  references** through the same recorder (`ydistStats.ts`, also wired
  into `tmpShortSim --ydist`): control (no coupling), oracle coupled κ =
  1 (`coupled:1:60`, a box-wide driver) and its placebo (`placebo:0.53:
  60`); start point, 22 colonies, light and dark 12 h pooled per colony
  (blocks from the first frame), seed 4242. Comparisons pair colonies by
  label, bootstrap over colonies jointly (2000). *Local coupling
  supported* if data L − control L > 0 (95 % CI) and data D's lower
  bound > 1.5; *box-wide driver supported* if data C(≥ 40) > 0 (CI) and
  data L − control L includes 0; otherwise mixed. **Method check:** κ = 1
  must raise C(≥ 40) above the control's (CI of the difference > 0) and
  leave L − control L including 0; the placebo must leave both at the
  control's level. A failed check is reported and makes the matching
  outcome uninformative. Role-pair rows descriptive. Box run prepared
  for launch ≈ 16:40 (user).

**2026-10-17 ≈ 15:45 UTC — Review of the 15:10–15:43 entries (user
guidance, pasted, adopted); corrections and amendments before any Ra, P
or Y output is read.** The Ra / P data recorder is running (12 of 22
files written, none opened); `logs/ydist/` is empty.
1. **Ra's cell is a post-hoc deviation, labelled as such.** The written
   R choice rule (narrowest band, then shortest dwell) applied to the
   moving-involved ratios gives (5.1, 0) at 0.917 / 0.914; the 15:36
   entry chose (5.1, 2) (0.972 / 0.970) *after seeing the calibration
   table* — a deviation from that rule, not a rule followed (the
   review's point: log it as a deviation). **Claude's addition, not the
   reviewer's** (attribution corrected ≈ 15:58): both cells are read with
   equal weight under the 15:36 thresholds; if their verdicts differ,
   Ra's verdict is "depends on the cell" and is reported as such.
2. **O vs R closed** (≈ 15:45, check in the 15:34 entry): identical raw
   counts; ×2.43 vs ×2.51 is geometric mean of per-colony ratios vs
   pooled counts.
3. **X's 5-s shared component is tentative** (corrected in place in the
   15:30 entry): the null CI ignores colony clustering, which makes
   r_sim − r_non look more significant than it is. A colony-clustered
   null bootstrap would settle it (not run).
4. **Y's reading is asymmetric; role pairs promoted.** A "box-wide"
   outcome would be informative; "local coupling" much less so, because
   nurses on the brood are close, mostly still and share a micro-
   environment. Amended: *local coupling supported* additionally
   requires ΔL (data − control) > 0 (CI) in at least one of the
   forager–nurse or forager–forager rows, not only overall or among
   nurses; a local excess confined to nurse–nurse pairs is reported as
   "local, consistent with a shared brood micro-environment". The
   aggregator prints ΔL per role pair for this (to be added before the
   data run).
5. **P may rest on few statistics.** Stated before opening: the verdict
   names the judged statistics; with one judged statistic it is
   reported as provisional, with none P is descriptive only.
6. **Ra's scope.** Dwell 2 keeps 0.45–0.65 of contacts, so Ra speaks to a
   dwell-filtered subset, not the established contact definition; this
   is said plainly when the step-5 relevance argument is put to the
   user.

**2026-10-17 ≈ 15:47 UTC — `run.sh` notifies at start too (user
request; tooling only).** The wrapper calls `run.sh notify --start` just
before the command ("<host>: <run id> started"; `timeout 20`, failures
ignored, so it never blocks or fails a run); the end notification is
unchanged. Tested locally with a dummy channel (start and end messages
both sent); copied to the box (idle), md5 98cb82bc… both sides.

**2026-10-17 ≈ 15:48 UTC — Y model references launched on the box**
(earlier than the planned ≈ 16:40: box idle, ≈ 30–45 min, so results
are in before the user's 4-h gap and the gap stays free for step-3 arms
if the user decides). `run.sh` run `ydist-20261017T154748Z`, script
`scripts/scratch/box/run-ydist.sh`: control, `coupled:1:60`,
`placebo:0.53:60` × 22 colonies × light / dark × 12 h, `--lite --ydist`,
132 runs, `xargs -P 62`. Copied `tmpShortSim.ts` (adds `--ydist`),
`ydistStats.ts`, the script; md5 both sides. Start notification sent
(first use). Reductions `logs/ydist/cs-yd-*`; read with `ydistAgg.ts
--sets data=data-c,ctl=cs-yd-ctl-,k1=cs-yd-k1-,p=cs-yd-p-` once the data
side (`ydistData.ts`, local, after the Ra / P recorder) exists.

**2026-10-17 ≈ 15:51 UTC — Comparisons Ra and P read (15:36 rules as
amended 15:45).** Data side `logs/robust/data-c*.json` (22 fit
colonies, `robustData.ts`); model control `logs/robust/cs-rob-ctl-*`.

*Ra — moving-involved contacts: marginal in light, reproduced in dark;
the model lacks the data's light / dark contrast.* Only the moving lines
of `robustAgg.py data` were read (`logs/robust/ra.txt`); the aggregator's
"mixed" label is R's wording, the Ra rule was applied by hand.

| cell | light model / data | dark model / data | verdict |
|---|---|---|---|
| 5.1 / dwell 2 | 0.73 [0.65, 0.85] | 1.10 [0.93, 1.32] | marginal (light), reproduced (dark) |
| 5.1 / dwell 0 | 0.78 [0.69, 0.89] | 1.19 [1.00, 1.42] | marginal (light), reproduced (dark) |

Both cells agree (Claude's 15:45 equal-weight rule does not bite). Light /
dark rate ratio (geometric mean over colonies): **data 1.51 / 1.53,
model 1.01 / 1.01**. ~~So the model is not short of contacts with movers
overall~~ (overstated, corrected ≈ 15:58, user guidance: the level is
about right *on average*, partly a coincidence of averaging a flat model
against a 1.5× contrast — not reproduction); the model sits between the
data's phases because it has no light / dark modulation of them (related open item: the data's light / dark
trip-location difference, not modelled). Scope (15:45 item 6): dwell 2
keeps 0.45–0.65 of contacts; dwell 0 is the established definition.

*P — packing: mixed by the rule; same density where the ants are, but
the model has more isolated ants and puts them in different places.*
`logs/robust/pack.txt` (`packAgg.py`).
- Robustness (M / control): S1 1.05, S2 0.99, S3 1.00 → judged; **S4
  (A50) 1.69 → not robust** (drift spreads occupancy), reported only.
  Three judged statistics (15:45 item 5).
- Model / data, all ants (light; dark within 0.01): **S1 median NN 0.98
  [0.90, 1.09]** (data 2.17 mm, model 2.10) — matched; **S2 NN < 4.1 mm
  0.82 [0.77, 0.86]** (data 0.96, model 0.80) — less packed; **S3 NN <
  8.2 mm 0.95 [0.93, 0.97]** (0.997 vs 0.965) — matched by the [0.9,
  1.1] rule. **Verdict: mixed** (S1, S3 matched; S2 less packed). Nurses
  carry the S2 gap (0.80; foragers 0.86).
- Reading in words: the typical neighbour distance is the same, but in
  the data almost every ant has a neighbour within a body length (96 %),
  in the model one ant-frame in five has none — the model's distribution
  has a heavier upper tail of isolated ants.
- Beside (descriptive): occupancy maps correlate **negatively** with the
  data's (median r −0.14, range −0.25 … 0.15, 5-mm cells). Checked ≈
  15:51 that both use the same frame (≈ 0–70 × 0–40 mm): the model's
  most-occupied cells are at walls and corners and its centroid at the
  nest centre; the data's are at a colony-specific site (e.g. colony 112
  near y ≈ 8 mm), presumably the brood pile. The model has no brood or
  aggregation mechanism (Evidence policy note on the held-out spatial
  papers).
- **Bearing on the still–still contact question (interpretation):** a
  model with ~20 % isolated ant-frames and no shared resting site
  should have fewer still–still crossings, whatever the measurement
  error. This points at aggregation / a resting site (step-3 option
  "packing / aggregation mechanism") over physical creep, without
  deciding it.

**2026-10-17 ≈ 16:16 UTC — Mailleux et al. 1999: lighting not stated
(user read the paper; pasted, adopted).** Asked for the step-5 phase
question (Ra: light 0.73–0.78, dark 1.10–1.19). The user checked the
1999 paper (fit data; Claude saw only the user's summary):
- **Lighting, photoperiod and time of day: not stated.** Methods give
  1000–2000 workers, Janet plaster nests, 22 ± 3 °C, "sufficient"
  humidity, diet (1 M sucrose, *Periplaneta*). In-nest behaviour was
  filmed for 20 min at 2× from the first recruiter, with an overhead
  camera (Fig. 1) — light enough to film, not evidence for a light phase
  (red or dim light possible). **The step-5 argument reports both phase
  ratios; it cannot pick one.**
- **Caveats for the step-5 argument (user):** (1) Table 2a contacts are
  per recruiter stay, and stays differ: 6.1 in 113 s (1 d), 3.3 in 80 s
  (4 d), 3.3 in 82 s (8 d) — about 0.054, 0.041, 0.040 /s (ratio of
  means, approximate; figures match `mailleux-rules.md` §4). The
  starvation effect is ≈ 2× in counts but ≈ 1.3× in rates, so the
  duration difference does most of the work. (2) Observer-scored
  antennal contacts with no distance threshold: comparable to a 4.1-mm
  crossing at the level of rate, not definition. (3) Context: returning
  fed scouts in 1000–2000-worker lab colonies with starvation
  manipulated; which starvation row matches the Stroeymeyt fit colonies'
  state is not obvious.
- **Citation corrected:** pages 73–78 (page-image header; the text layer's
  "73-104" is an OCR error, our "73–79" was off by one), fixed in
  `docs/research/mailleux-rules.md` §4; archived STATUS files left as
  they were.

**2026-10-17 ≈ 16:18 UTC — Defect found: the oracle / latent-state
switches only ever modulated nurses** (found while building the
aggregation arms; logged before Y's output is opened). `ColonySim.step`
scales `P.nest.restToActive` around the policy call, but
`nestParamsOf` (`lasiusNestWorker.ts:134`) overlays `P.nest.forager`,
and at the start point foragers have their own `restToActive` (0.6).
Verified (`chkForager.ts` in the scratchpad): ×4 on `P.nest.restToActive`
moves nurses 0.345 → 1.38, foragers stay 0.6. `test/oracle.test.ts`
uses `forager: {}` and could not catch it. Consequences (corrections,
dated, in place below this entry; nothing re-run yet):
- **Oracle coupling (06:20, "closed line"):** only nurses were coupled
  (the signal u counted all in-nest ants). The all-ants verdict "(a) not
  met" is partly by construction. Nurses alone (logged then): κ = 1 2.28
  / 3.56 vs data 3.67 / 5.12, control 1.16 / 1.42 — half-gap bars for
  nurses would be 2.42 / 3.27: just under at 1 min, past at 10 min. The
  closed line is **not** reopened here; that is the user's call.
- **Comparison L (14:35):** "Nurse-only: forager T2 and rows unchanged in
  every arm" was by construction, not a finding; the latent state was
  never given to foragers.
- **Y references (k1, p, 15:48):** a nurse-only box-wide driver;
  Y's method check reads it as such.
- **New switches (E, S) scale the role-specific values** (nurse and
  `P.nest.forager`), with a test using a forager overlay.

**2026-10-17 ≈ 16:19 UTC — Comparison Y read (15:36 / 15:43 / 15:45
rules): mixed; the data's co-movement is graded over 1–4 cm.**
`logs/ydist/agg.txt` (`ydistAgg.ts`, 22 colonies per set).
- **Method check passes** (with the 16:18 caveat: the κ = 1 driver
  reaches nurses only): κ = 1 − control ΔC(≥ 40) +0.0089 [+0.0060,
  +0.0122], ΔL +0.0010 [−0.0061, +0.0078]; placebo ΔL +0.0021 [−0.0034,
  +0.0078], ΔC(≥ 40) −0.0005 [−0.0022, +0.0010].
- **Data vs control:** ΔL **−0.045 [−0.061, −0.030]** (negative in every
  role pair: nurse–nurse −0.033, forager–nurse −0.069, forager–forager
  −0.067) → *local coupling* not supported. Data C(≥ 40) 0.0034 [−0.0071,
  0.0150] (CI includes 0; only 2 % of the data's pair-bins are ≥ 40 mm
  apart vs 37 % in the model) → *box-wide* not supported. **Verdict:
  mixed.**
- **Shape (descriptive):** C by distance (all ants), data 0.092 / 0.054 /
  0.028 / 0.012 / 0.003 (< 5 / 5–10 / 10–20 / 20–40 / ≥ 40 mm); control
  0.190 / 0.048 / 0.005 / −0.010 / −0.009. The model's co-movement is
  contact-range only (encounter mechanics); the data's is weaker at
  contact range and extends smoothly over 1–4 cm. Neither a flat
  box-wide driver nor contact-range coupling; consistent with
  propagation through the cluster or region-specific drivers (not
  separated). The distance classes are confounded with the packing
  difference (comparison P), so the ≥ 40-mm class is thin in the data.

**2026-10-17 ≈ 16:19 UTC — Comparison Q (packing / aggregation arms,
step-3 option "packing / aggregation"), design and reading logged
before building** (user go-ahead ≈ 16:17 with amendments, pasted
guidance adopted; "aggregation rather than creep" is a hypothesis under
test, not a conclusion). Mailleux 1999: lighting not stated (16:16), so
the step-5 argument reports both phase ratios; nothing here "settles" it.
**The fit colonies are used in a development role** (as in X and Y).
- **Switches** (runner-level, off by default, tested bit-identical,
  diagnostic, **not adoptable**; outside `src/sim/behavior/`): **W**
  wall-neutral edge: in the nest, an ant whose step reaches the edge of
  the surface takes a new heading drawn uniformly among directions whose
  next 0.5 mm stays on the surface (≤ 36 draws, else reverse), from its
  own stream `RNG.stream(seed, 0x0e1d, i)`, instead of turning along the
  wall. **E** (emergent aggregation, what-if with true state): each
  in-nest ant's stop rate (`activeToRest`, nurse and forager values) ×
  (1 + k_E·n), n = resting in-nest nestmates within 8 mm (true positions
  and modes), recounted every 1 s; **k_E = 0.25 and 1.0** (fixed now). A
  percept-based mechanism is designed only if E is informative. **S**
  (data-fed site, **diagnostic only**: uses the fit colony's own
  occupancy as input, so it cannot predict held-out colonies' sites):
  stop rate × (1 + k_S·w(x, y)), w = the colony's data occupancy in the
  same phase (tracked ants, 1-mm cells, 5 × 5-mm box smoothing, divided
  by its maximum); **k_S = 3** (fixed now). The multipliers scale the
  role-specific values (16:18 defect).
- **Arms** (start point, 22 colonies × light / dark × 12 h, seed 4242,
  `--lite --robust`): **W**, **W+E(0.25)**, **W+E(1.0)**, **W+S(3)**, each
  with the control observer **and** variant M (`--obsVariant tag:0.7:90
  --pxRound 0.0229658793`); baseline (no switch) rerun with the control
  observer for the guard (its M counts are the R run's, same seeds).
  396 runs; an exits counter (observed in → out transitions of tracked
  ants) is added to `tmpShortSim --lite`.
- **Measures:** packing on control-observer output (robust under M,
  15:51): S1 median NN, S2 near share (NN < 4.1 mm), S3 NN < 8.2 mm,
  all ants; occupancy correlation with the data (5-mm cells); wall-band
  share (3 mm, descriptive). Still–still crossings (cell 5.1 / dwell 0,
  the established definition) **from the M-observed output** for the
  outcome table (the data carry their tracker's error; M is the
  calibrated stand-in); control-observer counts reported beside.
  Model / data per colony, geometric mean, colony bootstrap 2000.
- **Comparisons:** W+E and W+S **against W** (paired by colony) for their
  packing effect; **W against the baseline only** for wall share and the
  shifts in S1–S3 and occupancy correlation. **Guard:** W / baseline
  within [0.90, 1.10] for the moving fraction (each phase), exits per
  ant-hour (each phase), and the light / dark ratios of moving fraction
  and of moving-involved contacts; any outside → reported as "W shifts
  matched quantities", and the arm readings carry that caveat.
- **Outcome table, fixed now (per arm W+E(0.25), W+E(1.0), W+S(3);
  both phases):** *packing reached* = S2 ≥ 0.92 (data 0.96 / 0.955).
  r_ss = M-observed model / data still–still crossings per detected
  ant-frame. (i) packing reached and r_ss ≥ 0.8 → **the still–still
  deficit is packing**; (ii) packing reached and r_ss < 0.5 → **the
  deficit is not about packing** (falsifier); (iii) packing reached,
  0.5 ≤ r_ss < 0.8 → **mixed**; (iv) packing not reached → **not tested
  by this arm** (levels reported). For W+S, occupancy correlation ≥ 0.5
  is a **manipulation check, not evidence** (the site is the input).
  Data ceiling for occupancy: a colony's light vs dark maps correlate
  0.96 (median; 0.85–0.99).
- No further arms or strengths without the user; still–still contacts
  are never a target.
- **Built and launched ≈ 16:23** (`run.sh` run `q-20261017T162344Z`,
  `scripts/scratch/box/run-q.sh`, 396 runs, `xargs -P 62`; user approved
  the run ≈ 16:20). Code: `walkAnt` optional `edgeTurn`
  (`antPhysics.ts`); `ColonyOptions.wall` / `aggregate` / `site` with
  `stopMultStep` and `inwardTurn` (`colonyBles.ts`); threaded through
  `colonyStroeymeyt.ts`; `--wall inward`, `--agg k:r` (`s2018Lib.ts`);
  `--site k` and an exits counter (`tmpShortSim.ts`); site maps
  `logs/robust/sites.json` (from the data occupancy as logged). Tests
  `test/packingArms.test.ts` (k = 0 and empty maps bit-identical; each
  switch changes the run; nurse and forager stop rates restored; a
  uniform k = 1 site equals doubling both role values, so foragers are
  reached); `npm test` 173 / 173. Local smoke runs (colony 0, 30 min):
  the baseline reproduces 388 / 288 exactly; every arm runs (only
  completion and field presence were printed, no measure). md5 of the
  copied files checked; full sweep shows only the known `lib.ts` and
  `paperText.ts` differences. Reductions `logs/q/cs-q-*`.

**2026-10-17 ≈ 16:05 UTC (logged late, ≈ 16:25) — Wall and occupancy
checks before designing Q (descriptive; user guidance ≈ 16:00 asked for
them).** `logs/robust/walls.txt` plus edge profiles printed in the
session (colonies 0, 5, 12). The model's edge rule (`walkAnt`: at an
edge the ant turns along it and walks on) puts ≈ half of model
ant-frames in a 3-mm wall band covering ≈ 21 % of the area (enrichment
≈ 2.45, corners ≈ 2.2), with 6–14 % of all ant-frames in the outermost
1-mm column or row at each wall; ant centres reach the wall line. The
data's ants form a colony-specific cluster that touches a wall only where
it abuts one; band shares computed with the model's bounds understate
the data's wall contact by ≈ 1–2 mm of offset (the data's walls sit
slightly inside), so the data's "enrichment 0.02" is not a reliable
number, but the contrast is not in doubt. Occupancy: same frame in both
(≈ 0–70 × 0–40 mm); the data's own light vs dark maps correlate 0.96
(median, 0.85–0.99), the ceiling for occupancy agreement.

**2026-10-17 ≈ 16:25 UTC — Step-4 desk work: latent activity state
design drafted** (proposal for the user, not adopted):
`docs/research/latent-activity-design.md`. Stage 1: per-ant OU drive in
the mind (mean one, both roles with role-specific σ, shared τ; σ = 0
bit-identical), replacing the runner switch, to be fitted with the
compact persistence targets. Stage 2 (optional): local coupling of the
drive through percepts, aimed at the Y shape (co-movement over 1–4 cm),
distinct from the parked excitable coupling. Open questions listed
there.

**2026-10-17 ≈ 18:14 UTC — Comparison Q read (16:19 rules): by the
table, W+E(1.0) reads "the still–still deficit is packing", the other
two arms "not tested"; the guard failed; three qualifications are
reported beside the verdict, not in place of it.** Run
`q-20261017T162344Z` ok (1 h 50 min, 396 runs); `logs/q/agg.txt`
(`qAgg.py`). Medians over colonies, light (dark within ≈ 0.04 unless
given).

| arm (control observer) | S1 median NN (mm) | S2 near share | S3 | occupancy r | wall band |
|---|---|---|---|---|---|
| data | 2.17 | 0.962 | 0.997 | (ceiling 0.96) | — |
| baseline | 2.10 | 0.803 | 0.965 | −0.14 | 0.53 |
| W | 2.54 | 0.788 | 0.977 | +0.29 | 0.16 |
| W+E(0.25) | 1.25 | 0.900 | 0.958 | +0.23 | 0.10 |
| W+E(1.0) | 1.40 | 0.937 | 0.981 | +0.29 | 0.07 |
| W+S(3) | 2.07 | 0.834 | 0.964 | +0.90 | 0.07 |

- **Effects (paired ratios):** W / baseline: S1 1.21, S2 0.98, occupancy
  r +0.43, wall band ×0.30. Against W: E(0.25) S1 0.51, S2 1.14; E(1.0)
  S1 0.52, S2 1.22; S(3) S1 0.80, S2 1.06, occupancy r +0.59. E leaves
  occupancy r unchanged (Δ −0.08 … −0.01, CIs include 0).
- **Guard: failed.** W / baseline: exits per ant-hour **0.68** [0.66,
  0.71] (light and dark), moving fraction 1.10 [1.09, 1.12] (just
  outside); light / dark ratios unchanged (1.00, 1.00). The wall-neutral
  edge cuts nest exits by a third (exits are presumably found by
  following walls) — W shifts matched quantities, a caveat on every arm.
- **Outcome table** (S2 ≥ 0.92 = packing reached; r_ss from M-observed
  output): W+E(0.25) S2 0.900 / 0.911 → **not tested** (r_ss(M) 1.64 /
  1.84); **W+E(1.0) S2 0.937 / 0.936, r_ss(M) 1.35 [1.22, 1.50] / 1.64
  [1.45, 1.88] → (i) "the still–still deficit is packing"**; W+S(3) S2
  0.834 / 0.833 → **not tested** (r_ss(M) 0.84 / 1.00; manipulation check
  passed, occupancy r 0.90 / 0.92, not evidence).
- **Qualifications (found at reading time, disclosed; the rule's verdict
  stands as written):** (1) **W+E(1.0) reaches the near-share threshold
  by over-compacting**: its median NN is 1.40 mm against the data's 2.17
  (ratio ≈ 0.65); the table used S2 alone for "packing reached", a weak
  rule (S1 was a judged statistic in P and should have entered it). (2)
  **The M-observed count overshoots** (×1.35–1.64 of the data), while
  the **control-observer still–still ratio falls** with aggregation
  (baseline 0.26 / 0.29 → W+E(1.0) 0.23 / 0.27): in this model, still
  ants in a cluster do not move relative to each other, so still–still
  crossings are produced by measurement error, in proportion to how many
  still pairs sit near 4.1 mm. The verdict therefore says that packing
  plus M-sized error can produce (and here overshoot) the data's count —
  not that the data's crossings are real creep, nor that they are not;
  as R showed, the tracks cannot separate the two. (3) Guard failure
  above. Taken together: **packing is a sufficient explanation of the
  still–still deficit under M-sized measurement error, with the caveat
  that this arm overshoots both compaction and the count**; the
  data-like configuration (S1 ≈ 2.2 mm with S2 ≈ 0.96) was not reached by
  any arm.
- **Other findings (descriptive):** a data-fed site alone (W+S) puts the
  ants in the right place (r 0.90) without the data's packing (S2 0.83),
  so location is not packing. W removes most of the wall excess (0.53 →
  0.16) and turns occupancy r positive, at the cost of exits.
- No further arms without the user (rule). Options for the user, none
  taken: (a) accept "packing is sufficient under M-sized error" as the
  answer to the contact blocker, with the qualifications; (b) one
  bounded follow-up aimed at the data-like configuration (S1 and S2
  together, e.g. aggregation with a minimum spacing), with S1 in the
  "packing reached" rule; (c) a wall rule that keeps exit rates (e.g.
  edge-following only near the entrance) before any adoption.

**2026-10-17 ≈ 21:15 UTC — User decisions after Q (pasted, adopted).**
1. **Contact blocker: (c) then (b).** First a wall rule that preserves
   exits and passes the existing guard; then **one** bounded packing
   comparison whose success requires **median NN distance and near share
   together, in both phases**, tolerances and arms pre-registered before
   running; still–still crossings remain an outcome, never a tuning
   target. Q's table verdict and its qualifications stand; the
   defensible conclusion is that **an over-packed model plus M-sized
   error can exceed the observed crossing count** — conditional
   sufficiency, not a resolution of the blocker at data-like packing,
   and no identification of creep vs error.
2. **Oracle coupling reopened narrowly, as a correction of the
   implementation defect (16:18):** include foragers, add a regression
   test with their actual parameter overlay, rerun the previously
   specified coupling / control / placebo comparison with the original
   settings and decision rule (05:11; κ 0.5 and 1, τ_c 60 s, placebos at
   the logged SDs), no expanded κ or τ search; report all-ant and
   role-specific results; **original geometry** (no wall change). A pass
   would establish diagnostic capacity only; Y leaves the spatial
   mechanism unresolved.
3. **Commit today's work as a diagnostic checkpoint** after reviewing
   the diff and passing tests and the typecheck: code, tests, STATUS and
   research notes; scratch scripts and logs stay local; the message
   names Q's guard failure and the nurse-only defect and keeps the
   switches labelled unadopted. Commit before further changes.
4. **Activity state:** shared τ initially, role-specific σ, both roles;
   stage 1 proceeds as the candidate mechanism; stage 2 deferred and
   unresolved synchrony disclosed; wall behaviour and packing settled
   before any spatial coupling; the persistence-target prerequisites
   stay before any fit.
