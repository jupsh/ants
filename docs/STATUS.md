# Project status

_Last updated: 2026-10-18 (where-the-record-lives block; record checks in `npm test`). Every change is
dated in `docs/log/`._

**Where the record lives.** One file per record, plain text; `npm test` fails if the record is
inconsistent (`node findings/findings.mjs check`, `node docs/records.mjs check`). The lead agent writes it;
other agents read all of it and write none of it (AGENTS.md).

| What | Where | Write (lead agent) | Read / query |
|---|---|---|---|
| Current state, plan, rules, evidence policy | this file | edit | ▶ RESUME first |
| What we know, by topic and strength | `findings/` | `node findings/findings.mjs new …` | `findings/README.md`; `… find '<JSON>'` |
| Decisions, designs, readings (dated) | `docs/log/` | `node docs/records.mjs log new "<title>" --kind k` | `docs/log/README.md` (newest first); `… log find` |
| Exposures of withheld data | `docs/contamination/` | `… contamination new "<title>" --role r` | `docs/contamination/README.md` |
| Side questions | `backlog/` | `node backlog/backlog.mjs …` | `backlog/README.md` |
| Before 2026-10-17 ≈ 13:10 UTC | `docs/archive/` (verbatim) | — | `rg` |

Archives, by the names entries cite: "the archive" (to 2026-10-10 evening,
[`archive/STATUS-2026-10-07-to-10.md`](archive/STATUS-2026-10-07-to-10.md)); "the night archive"
(2026-10-10 night, [`archive/STATUS-2026-10-10-night.md`](archive/STATUS-2026-10-10-night.md)); "the
Stroeymeyt archive" (2026-10-10 night to 10-15, [`archive/STATUS-2026-10-10-to-15.md`](archive/STATUS-2026-10-10-to-15.md));
"the C1 archive" (2026-10-15 late evening to 2026-10-17 ≈ 06:38 UTC, with RESUME and the Plan as they stood
before the 2026-10-17 cleanup, [`archive/STATUS-2026-10-15-to-17.md`](archive/STATUS-2026-10-15-to-17.md)).
Keep this file to the current state; past about 1,000 lines, trim RESUME rather than archive.

## ▶ RESUME HERE

**State (2026-10-18).** Milestone M1, *Lasius niger* as the single reference species. Branch
`browser-sim-m1`, merged to `main` (GitHub Pages) when the user asks (last merge: fast-forward to `84846a3`,
2026-10-18 ≈ 12:48 UTC). What is known, with its evidence: `findings/README.md`. Why and when:
`docs/log/README.md`. This block holds only the state, what happens next and the open decisions.

- **Now: the C2 fit is running again** (`c2fit-20261018T210632Z`, since 2026-10-18 21:06 UTC, ≈ 28 h, so until
  about 2026-10-20 01:00; D070 approved, D071). `run.sh` shows it `quiet` (the wrapper's log is silent): use
  the D068 counts-only check. The first run
  (`c2fit-20261018T152000Z`, D055) was killed after ≈ 5.7 h (D069): phase 1 did no search, both starts stopping
  after 1 generation on the axis switch (σ × largest probe SD ≈ 0.06 / 0.04 < 0.25, met from the start; D068,
  user-requested blind checks). D070: C2's probe SDs rescaled so the largest is at the 0.5 cap, both phases (the
  identity on C1's probes); everything else as D055; fresh start. Monitor run state and the D068 counts only,
  hourly; nothing read from its log is used for any choice. D070's reproduction check passed (largest raw
  probe SD 0.068 / 0.039, as before; D071).
  - **C2** = C1 + a per-ant OU activity drive (τ 60 s, free σ per role), restShape ≥ 1.001, specular walls; 36
    rows (32 motion + 4 activity), k 13 (D041–D045; F006, F032). All numerical gates pass at the start point
    (F010).
  - **After the fit: the whole-model judgment fixed before it** (D041, D042). Fresh seeds, combinedZ, rows by
    family beside C1. Adequate = no row |z| > 3, at most 2 in (2, 3], no free parameter at or within 5 % of a box
    end (σ_drive at its lower bound reads "little or no drive needed for that role"); then the checks at the
    optimum (spread rule, crowding, stays and trips, packing, contacts: disclosed, not judged). Adequate → step 5 with
    C2's motion fixed. Not adequate → failing rows and the C1 comparison go to the user, who decides: proceed
    provisionally (C2 or C1) or stop step 4. No mechanism is added automatically.
  - **Pending before the C2 reading (lead agent):** pre-register the per-ant activity-by-zone analysis against
    C2's persistence and top-20 % rows, so it is read blind (kept out of B018).
- **Disclosed limitations carried into step 5** (none blocks it):
  - packing and the colony-specific resting site (F027, F028; aggregation arms closed, F029, F031);
  - still–still contacts (F017; measurement-ambiguous, F015, F016);
  - colony synchrony (F022–F025): a **blocker for freezing the structure** before any held-out test, and a
    sensitivity gate in step 5 (Rules in force);
  - trip durations (F038); light/dark contrasts (F034, F035).
- **Decisions the user owes before step 5 starts:**
  - the synchrony gate's κ (κ = 1 overshoots the data with foragers coupled, F025);
  - which phase's motion transfers to Mailleux 1999 (lighting not stated, 22 ± 3 °C: F042; temperature
    hypothesis F037);
  - density: a literature prior only (F043).
- **Backlog in flight** (`backlog/README.md`): B018 resting site (data side, another agent), B001
  contacted-nestmate departures (Muse), B006 light/dark (findings written; a lead review note is open).
- **Experiments:**
  - **E1 (walking): paused** since 2026-10-09 (F047); does not block M1.
  - **E2 (drinking, trail laying): provisional.** L0S1c main (`e2-3d-L0S1c.json`), L0S1 alternative
    (`e2-3d-L0S1.json`); not validated (F044, F045, F046). Reopens only under the triggers in Rules in force.
  - **Colony / Mailleux 1999: no valid colony fit yet.** The pilots failed (option A, F039; arena-sourced
    motion, F040), so in-nest motion comes from Stroeymeyt et al. 2018 (22 fit colonies; F041) and 1999 is
    refitted with motion fixed (Plan, step 5; stopping rule).
  - **E6 (Bles et al. 2022): development benchmark, not validation.** It runs after an adequate 1999 fit and
    the fit-protection checks or, if the stopping rule ends the 1999 work without one, on the best step-5 fit,
    disclosed as such (user, 2026-10-11).
- **M1's honest end state** (agreed 2026-10-10 night): *calibrated and stress-tested, with failures disclosed*,
  not "validated". Validating the colony model needs independent held-out data (Plan, parallel track; B016).
- **Box (rented 2026-10-15, kept):** vast.ai EPYC 9534, $0.307/h, `ssh -p 46397 root@85.218.235.6`; worktree
  `/root/ants-w7`, synced by file copy (its own git HEAD is older and reads dirty; code checksums are checked
  against the local files before each launch). Node via `. /opt/nvm/nvm.sh && nvm use 22.22.1`,
  **SIM_WORKERS=62** (one per core; 120 threads were slower). Old boxes' files in `logs/box-2026-10-11/`,
  `logs/box-2026-10-15/`.
- **Scratch, never commit** (excluded locally in `.git/info/exclude`): `scripts/tmp*.ts`, `scripts/scratch/`.
  Logs (git-ignored): fit C1 `logs/c1/`; C2 `logs/c2/`; diagnostics `logs/sf/`, `logs/sf2/`, `logs/t12/`,
  `logs/judge/`, `logs/orc/`, `logs/night/`, `logs/latent/`, `logs/extra/`, `logs/spread/`, `logs/lo/`,
  `logs/tb/` (box); data-side contacts / onsets / activity / test B in `logs/contacts/`; earlier `logs/act/`,
  `logs/trk*/`, `logs/s3/`, `logs/sp/`, `logs/short/`, `logs/trips/`.

### Quick guide for a new agent (step 4b; revised 2026-10-18)
- **Read first:** CLAUDE.md; this RESUME block; Rules in force (step-4b verdicts and closed lines); Evidence
  policy and `docs/contamination/`; `findings/README.md` (what is known, by topic); then the `docs/log/`
  entries your task touches (each has its design, its fixed reading and its result). Older detail is in the
  C1 archive.
- **How this user works:** every comparison is designed and its reading fixed in `docs/log/` *before* it runs,
  then read mechanically against that reading; a weak rule found at reading time is disclosed, not quietly
  replaced. The user often pastes guidance from a reviewer: log it as "user guidance, pasted, adopted", and
  correct overstated conclusions in place (dated), never silently. Bounded arm sets, no further arms after a
  "no further arms" verdict, no fits without the user. Ask before committing; commits carry no Claude
  attribution; pushing to `main` bypasses a PR rule, so only when asked.
- **Hygiene that has gone wrong before:** never type a timestamp: `node docs/records.mjs log new` stamps the
  UTC time (entries were repeatedly written ahead of the clock). While a pre-registration is open, only check
  that outputs exist (CLAUDE.md, blind checks); name anything seen early in the entry and the reply.
- **Literature:** only the cleared papers in `literature/` (pinned in `docs/literature.json`); search their
  text with `rg -n "…" .cache/papers` (scans are OCR'd: check numbers on the page image,
  `scripts/paperPage.ts`). Held PDFs live in `~/ants-literature/held/` behind a hook — never work around it;
  clearing a paper is the user's decision. Held out: the 10 Stroeymeyt age-experiment colonies and the
  Stroeymeyt SM beyond its methods.
- **Tools (all runs at the start point, seed 4242 / 'diag' seeds, paired with the controls):**
  - rows: `diagS2018.ts --at start [--set …] [--oracle …] [--slowEp …] [--obsVariant …] [--pxRound …] --reps 4
    --out f`, compared with `reportS2018.ts --est f --start logs/sf/diag-ctl.json` (paired shifts);
  - persistence: `tmpTrackerSim.ts --colony c --mode tracker --obsH 12` → `logs/act/sim-s<set>-c*.log`, read by
    `scratch/simact.py` (control set `0.4`);
  - step diagnostic, T2, synchrony, contacts, onsets, activity series, test B: `scratch/tmpShortSim.ts --colony
    c --trips [--phase light|dark] [--obs 43200] [--lite] [--tb] --tag t` (4-h full output for T2 and steps;
    12-h `--lite` for contacts / onsets / synchrony); data side `scratch/tmpShortData.ts`, `contactData.ts`,
    `contactOnsetData.ts`, `activityData.ts` (local, fit tracks);
  - aggregators (`python3 -I`): `sf2Agg.py` (brief stills), `t12Agg.py` / `t2Paired.py` (T2), `syncAgg.py`
    (synchrony), `contactAgg.py` / `contactSplit.py` (contacts), `spreadAgg.py` (episodes), `tbAgg.py` (test
    B), `caAgg.py`, `cbAgg.py`;
  - controls: rows `logs/sf/diag-ctl.json`, persistence `sim-s0.4`, T2 `t12-ctl`, contacts / onsets
    `night-ctl`;
  - diagnostic switches (runner-level, off by default, tested bit-identical, never adoptable):
    `ColonyOptions.oracle` (coupled / placebo / const, `meanOne`), `slowEp`; observer variants `posDrift`,
    `pxRound` (`test/oracle.test.ts`, `test/obsVariant.test.ts`).
- **Box:** copy only the changed files, compare md5 with the local files before launch, and never overwrite a
  file that running jobs still load — stage it and let the queued script copy it in. Outside `run.sh`, launch
  with `(setsid nohup bash script > log 2>&1 < /dev/null &)` (a plain background job over ssh hangs). Long runs: `bash
  scripts/run.sh start <name> -- <cmd…>` (detached launch, per-run folder, end notification from the run
  itself; `npm run runs -- --box`). Big per-colony outputs stay on the box: reduce them there (`cs-*` files)
  and fetch the reductions as one `tar czf -` stream over ssh (an `scp` glob timed out). The box's raw
  `logs/short` (1,606 files, 29 GB) is archived locally in `logs/box-2026-10-17/short.tar.zst` (6.6 GB, md5
  checked against `short-md5.txt`) and deleted on the box (2026-10-17).
- **Pitfalls found the hard way:** observer variant B accumulates offsets across rests (unusable for anything
  geometric); an `exp(x)` multiplier is not mean-preserving (use `meanOne`); a "local maximum anywhere"
  periodicity rule passes noise; strict uninterrupted tracking keeps only ≈ 8 % of onsets; contact-onset
  associations need a pre-contact time course before any causal reading.

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
- **Log before acting.** Decisions and pre-registrations go in `docs/log/`
  (`node docs/records.mjs log new`, which stamps the UTC time) before the
  run they govern; amendments are dated lines in the entry's own file. **Read the whole relevant entry before
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
  ≈ 06:20; **caveat 16:18: it coupled nurses only**; reopened narrowly and
  corrected 21:15 / 22:56: with foragers coupled κ = 1 overshoots the
  data's synchrony — diagnostic capacity only; still no further κ or τ
  arms); discrete slow episodes at the tested settings (13:10; this
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
  into 4.1 mm (far again past 5.1 mm), not verified touches. ~~The contact
  deficit is a blocker for step 5 (user, 13:11).~~ **Changed 2026-10-18 ≈
  01:41 (user):** the still–still crossing deficit is not a step-5 blocker
  (measurement-ambiguous, disclosed). The packing deficit (near share,
  isolated ants) is a disclosed limitation carried into step 5's
  interpretation. Closed implementations, no further arms: Q's aggregation /
  site arms and T's taxis arms (aggregation as such not rejected; attraction
  with a spacing mechanism would be a new design question). W-spec remains
  the selected diagnostic wall control, not a validated wall response.
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
Moved to records on 2026-10-18 ≈ 16:32 UTC: `docs/contamination/`, one file per source or exposure event,
verbatim; index `docs/contamination/README.md`. New entry: `node docs/records.mjs contamination new "<title>"
--role r`; amend an existing source's file with a dated line. Query, e.g. `node docs/records.mjs contamination
find '{"role":{"$regex":"held-out"}}'`.

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
- **Exploratory backlog:** the questions below that are off the main line are
  also items in `backlog/` (B001–B013 seeded 2026-10-18, B014–B017 added since;
  index `backlog/README.md`, protocol `backlog/PROTOCOL.md`; priorities set
  2026-10-18 ≈ 04:40). Trimming this list waits for the user.
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
Moved to records on 2026-10-18 ≈ 16:32 UTC: `docs/log/`, one file per dated entry, verbatim (index, newest
first: `docs/log/README.md`). New entry: `node docs/records.mjs log new "<title>" --kind k`, which stamps the UTC
time; never write dated entries in this file (`node docs/records.mjs check` flags them). Query, e.g. `node
docs/records.mjs log find '{"kind":"reading","body":{"$regex":"C2"}}'`.

Before 2026-10-17 ≈ 13:10 UTC (the first entry in `docs/log/`):
Earlier entries: the archive, the night archive, the Stroeymeyt archive
and the C1 archive (2026-10-15 late evening to 2026-10-17 ≈ 06:38 UTC;
times before 13:10 cited below without a date, such as "05:43" or
"00:25", are 2026-10-17 entries there). Newest last.
