---
id: A005
title: STATUS RESUME as it stood before the 2026-10-24 trim (verbatim)
---
# STATUS RESUME, 2026-10-20 to 2026-10-24 (archived 2026-10-24)

Moved verbatim from `docs/STATUS.md` on 2026-10-24 (D143), when RESUME was reduced to the state and pointers and
the open work moved to plied (D142). First the "Last updated" line as it stood, then the RESUME block down to the
Quick guide. Every item cites its log entry and findings; those records are authoritative.

_Last updated: 2026-10-24 (C2 fit finished, D075; D076 approved, data side read, D077–D079; C2 judged not adequate, D080–D081; guidance D082, diagnostic round D083–D086, read D087; C2 provisionally, D088; checks D089–D091, read D092; step-5 choices D093; step-5 design D094; B014 applied D095–D096; benchmark D097; gates D098, read D100; full fit at dt 0.025 D102, finished, bound hits D103; judge now D104, judging run D105, read D106: transfer failure; closed D107; synchrony design D108, amended D109, approved D110, Part B run D111, read D112–D113; step 9 held, Part C D114–D115, amended D116, confirmed D117, built D118, S5 amendment 2 D119; CI simHash fix D120; calibration read D121; screen D122; data side and placement D123–D124; Part D request D125, design D126; publication plan D127; Part D guidance D128 → D126 amendment 1; Stage 0 confirmed D129, read D130; sensitivity (c) D131–D132; review D133; decisions D134, contact split D135, S2 audit proposal D136, brood allowlist D137, contact split read D139; plied D140–D142). Every change is
dated in `docs/log/`._

## ▶ RESUME HERE

**State (2026-10-20).** Milestone M1, *Lasius niger* as the single reference species. Branch
`browser-sim-m1`, merged to `main` (GitHub Pages) when the user asks (last merge: fast-forward to `84846a3`,
2026-10-18 ≈ 12:48 UTC). What is known, with its evidence: `findings/README.md`. Why and when:
`docs/log/README.md`. This block holds only the state, what happens next and the open decisions.

- **Open work, its order, the commitments and the decisions waiting on the user are in plied** (adopted D142;
  `plied frontier`, view `plied/README.md`). The thread draft (`docs/threads-draft.md`, revision 2) was migrated
  into it and is superseded. plied (`/home/norma/repos/plied`, 0.1.0, Rust) links this file (S001), its archives
  (A001–A004), the log, findings, backlog and contamination records; it never restates them.

- **Now: step 5 ended as a transfer failure (D106, F081); step 4 closed with C2 selected provisionally (D088); checks at C2's fitted settings done (D092,
  F075–F079), C1 beside.** C3 is deferred (D088). C2 goes into step 5 with its failures explicit; success there would
  not erase them or establish their cause. Step-5 choices decided (D093, below). **Step-5 design D094** (open choices taken as
  recommended: nestmates foragers at 0.32 via `foragerFrac`, all-nurse a sensitivity; density box 2–4 /cm²). B014
  reviewed (D095) and **applied** (D096; simHash `3c4d7e2b…`, results re-stamped). Step-5 code in place
  (`scripts/m1999C2.ts`, `fitM1999.ts --model C2`, `m1999Points('c2')`). Runtime benchmark read (D097, box): a fit at the
  generation caps ≈ 3 h (warm-up 900 s) to ≈ 10 h (7200 s); lazyRest 1.34–1.48×, bit-identical. Gates read (D100): warm-up
  7200 s adopted (shorter not shown equivalent); dt 0.05 vs 0.025 **not shown equivalent** (mostly underpowered CIs),
  so the fit was **not launched** (D099). Day-1 no-bout ≈ 90 % at the start points (bound ≈ 11 %). **Step-5 full fit at dt 0.025 finished** (D102;
  the D101 pilot was replaced after 20 s): `step5fit-20261021T013651Z`, box, ok, 32 h 22 m, warm-up 7200 s, default
  budget → `data/fits/colony-m1999-c2-main-shared.json` (local and box, md5-equal). **Read D103:** no run converged
  (all at the 120-generation cap; the restart still drifting); density 2.03 /cm² (unit 0.018) and returnRate 0.887 /s
  (unit 0.983) are within 5 % of a box end, so the **adoption rule fails on bounds** whatever the rows show. Rows not
  yet evaluated. **User: judge now (D104)**, skipping Plan steps 6–8 for step 5; judging code built (D104; simHash
  `1388de91…`, stamps re-stamped). **Judged (D105, read D106; F081, F082): not adequate, not adoptable** (bounds,
  condition 4 max |fitZ| 9.3, Buffin bouts end 2× too fast); trophallaxis totals far too short (z −5.6 to −7.3) and
  contacts on 4 / 8 d too many (+7.7 / +5.7) in every sensitivity arm. **Step 5 ends as a transfer failure (stopping
  rule): the fitted candidate failed within the allotted search** (not converged; not shown impossible within the
  ranges, D107). Synchrony gate fails narrowly (2 rows at 1.18 / 1.24 SE, placebo-driven). Step 5 closed (user, D107).
  **Synchrony Part B read** (D108 amendments 1–2, D110; run D111; B2 D112, F083; B1 D113, F084):
  - matching not met (60-s autocorrelation 0.845 vs 0.362), so B2 is a stress test only;
  - κ 1 reaches 23–56 % of the data's synchrony gap at C2's fit, no cell reached (not overshooting there, unlike
    C1's start point);
  - coupled–placebo contrast equivalent within ±0.5 SE_data for 24 / 36 rows, 1 sensitive, 11 unresolved (still-run
    tails, nurse persistence);
  - C2's own D_w 1.02–1.16 vs data 1.58–6.28.

  **User (D114): step 9 on hold; Part C pursued** (synchrony is the central interest). **Part C design D115** (proposal,
  nothing built): one propagation diagnostic (local coupling, r 4.1 / 10 / 20 mm) and two within-system driver diagnostics
  (shared, spatially local), calibrated on all-ant D_w at 1 min only; sufficiency, then a power check on simulated
  tracks before the new data statistics (S5 neighbour dependence, S6 density scaling); if nothing discriminates, the
  separating measurement or intervention is the outcome. **Amended (D116 guidance → D115 amendment 1):** focal-excluded P
  with an immediate g = 1 when isolated, normalised E_l, grid calibration with fresh-seed verification, equivalence
  sufficiency, a non-circular separation check, fixed S5 / S6. Values confirmed (D117). **Built and tested (D118):** all
  diagnostics off by default, tests 258 / 258; S5 as fixed is unestimable on simulated colonies (≈ 0.7 % of bins isolated at
  10 mm), so **amendment 2: radius 4.1 mm, approved (D119)**: contact-range neighbours only; unestimable in any comparison ⇒
  reported so, no further adjustment. **Calibration read (D121; F085):** no P variant calibrated (P4 / P10 / El10 plateau
  at the grid top, P20 verified 3.80 vs 4.15 ± 0.30), so the **separation screen is not evaluable**; Eu and El20 calibrated.
  Box run closed (≈ $3.85 in all; tooling `scripts/box.mjs`, docs/BOX.md). **Screen read (D122; F086):** neither calibrated driver is sufficient
  (Eu: flat co-movement beyond 10 mm; El20: 10-min synchrony too low). **Data side and placement read (user, D123;
  D124; F087, F088), descriptive only:** S5 resolves no neighbour dependence (−0.16 [−0.45, 0.08]); S6 is positive (0.59),
  as in every arm including base, so neither discriminates. The data's onset lag rises with distance (+11 frames, < 5 to
  20–40 mm), where base and both drivers stay near +1.2. **Part C ends without answering D114 in this pipeline.** The
  distance patterns (S2, S3) are what neither driver reproduces. **Part D design D126** (user request D125; proposal,
  nothing built): an S3 audit first (null-corrected lag slope, gate G), then fast-relay transmission members (T, 4) against
  activity-independent drivers including travelling fronts (D, 4 new + Eu, El20), calibrated on 1-min D_w only, joint
  equivalence on 15 rows on fresh seeds, a simulation-only 2-D separation on (S2 decay, S3₂), one pass, fixed outcomes.
  **Guidance D128 adopted (D126 amendment 1):** Stage 0 (the S3 audit) frozen with a directional gate; Stages 1–3
  amended (one behavioural mapping for both families, all 15 rows kept, the 2-D rule deferred until calibrated) and not
  approved. Stage 0 built and its synthetic tests pass (a size-mixed null gives a 3.6-frame raw contrast with S3₁ ≈ 0).
  Part D's output folder was sealed until D130's reading was frozen (now unsealed). Stage 0 confirmed (D129) and run. **Read (D130; F092,
  superseding F088): gate G not passed.** Data S3₂ +0.19 [0.04, 0.36], but data − base +0.10 [−0.06, 0.28]. Most of the
  11-frame raw contrast is episode composition (null 1 expects 8.8); the excess is small, carried by episodes of more than
  15 ants. Eu and El20 give ≈ 0. **Sensitivity (c) resolved (user, D131; read D132):** its loss of the excess is
  not systematic (same sample, per-episode change median ≈ 0); a few near-degenerate 4-ant episodes swing the colony
  mean. The primary S3 slope has the same heavy tails. 14.7 % of participants were not yet still at f0. Next: the user's
  call: stop Part D at Stage 0, continue to Stages 1–3 with S2 as the main spatial row, settle the misread check (d)
  first, or consider a robust S3 variant (a new rule, applied to data and base alike).
  **Review (user, D133; F093):**
  - S2 has no composition null (same-bin positions, as F065 found for zones). Auditing it like Stage 0 before Stages
    1–3 is the user's call.
  - Brood coordinates and colony metadata (box, larvae, pupae, age) are in the dataset but unused. Fetching the brood
    files needs a data-role decision.
  - Forager-entry and queen triggers are untested.
  - Step 5's Buffin failure is pilot2's donor-volume cap. The pre-committed Buffin fit row lapsed. Under the stopping
    rule only a contact-observer bug check (during vs after bout) could reopen it.
  **User decisions (D134):**
  - **Stages 1–3 are held** until an S2 audit shows what spatial pattern still needs explaining.
  - **S2 audit:** a design proposal (D136) awaits the user's approval; nothing is built or run.
  - **Contact split read (D139):** no implementation mismatch; the main partner is never counted twice within its
    bout. The excess is in walking and third-party contacts after the main bout began. Whether Mailleux scored
    those needs the paper's definition; **clearance of Mailleux 1999 is requested** (the user's decision). Nothing
    reopens before that (D138 item 1).
  - **Brood coordinates:** development only. The allowlist is frozen (D137) and the 176 files are extracted to
    `data/stroeymeyt2018-brood/`.
  - **Triggers:** in the backlog as B023.
  - The robust S3 variant stays bounded and secondary.
  - **C2 judged not adequate** (D081; F068–F070). On fresh `judge` seeds (22 runs × 22 colonies, D080): 15 of 36
    rows |z| > 3, both drive SDs at their upper bound, restShape at 1.001, restCrowdExp near 1.25. C1 beside: 24 of
    36 above 3. C2 gains persistence and short stops; it loses nurse still fraction and nurse still-run tails. The
    top-20 % spread stays far too even.
  - **Diagnostic round** (D082 guidance; D083 + amendment 1, D084; built D085, run D086, `c2diag-20261020T163117Z`,
    ok, 1 h 50 m; **read D087**, F071–F074):
    - **trait** walkOnSd 1.0: "responds, with a tradeoff". Both top-20 % rows come within |z| 2, but persistence
      overshoots (nurse zc 6.1). The still fraction shifts > 2 SE_data, toward the data (the guard's failure, not
      worse agreement). At 0.7, beside: every joint condition holds, but the spread stays far off. Holds at C2's
      other settings only;
    - **drive** σ 0.5: neither tail reading (nurse P10 up slightly, P60 down), spread not worsened; ants far more
      active;
    - **Part B:** "counteracting components" or "no resolved aggregate gap" in every row. The leaving gap is
      nearly all composition. Nurse P(still ≥ 10 s) has a clear conditional excess, partly masked by sparser
      neighbourhoods (D088's reading). No causal reading.
  - **Checks (D089 amended, D090; run D091, `c2checks-20261020T184019Z`, ok, 35 m; read D092; disclosed, not
    judged):**
    - spread: forager per-ant spread about a third of the data's (z ≈ −10, C1 alike), C2 nurses match (F075);
    - crowding: model run lengths far more consistently rank-associated with density (F076; slope untested);
    - stays: too slow and too long among eligible runs (V_stay 0.44 vs 1.22 mm/s; z affected by unequal
      eligibility); trips still shaped by the give-up time (F077);
    - packing: C2 closer than C1, occupancy correlates with the data (+0.44) but spreads over about twice the
      area (F078);
    - crossing rate versus density: 0.63 / 0.81 of the data's, still–still about a third, rank-associated with density
      (F079).
  - D076's model side: both models' per-ant activity is placeless (F070). The fit itself finished ok
    (`c2fit-20261018T210632Z`, 37 h 07 m, D075), relaunched under D070 (approved, D071). The first run
    (`c2fit-20261018T152000Z`, D055) was killed after ≈ 5.7 h (D069): phase 1 did no search, both starts stopping
    after 1 generation on the axis switch (σ × largest probe SD ≈ 0.06 / 0.04 < 0.25, met from the start; D068,
    user-requested blind checks). D070: C2's probe SDs rescaled so the largest is at the 0.5 cap, both phases (the
    identity on C1's probes); everything else as D055; fresh start. Nothing read from its log is used for any choice. D070's reproduction check passed (largest raw
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
  - **Activity vs rest position (D076, approved D077):** code D078; data side D079 (F067: per-ant persistence is
    mostly not spatial in both groups; active ants rest in less occupied places); model side D081 (F070).
- **Disclosed limitations carried into step 5** (none blocks it):
  - the C2 judgment's failing rows (F068) and the diagnostic round (F071–F074);
  - packing and the resting site: at C2 less packed, over-spread, occupancy correlated with the data (F078; F027,
    F028 for earlier versions; aggregation arms closed, F029, F031);
  - still–still crossings about a third of the data's; crossings rank-associated with density (F079; measurement-ambiguous,
    F015–F017);
  - forager per-ant spread (F075); motion's stronger rank association with density (F076; sensitivity to changing density untested);
  - forager short stays too slow and too long (F077), relevant to the 1999 distance rows;
  - colony synchrony (F022–F025): a **blocker for freezing the structure** before any held-out test, and a
    sensitivity gate in step 5 (Rules in force);
  - trip durations (F038, F077); light/dark contrasts (F034, F035).
- **Step-5 choices, decided (D093):**
  - synchrony: κ = 1 with its placebo as the overshooting stress test (F025), not tuned against Mailleux; what a
    failure means is specified in the step-5 design;
  - C2's single motion prediction carried unchanged; Mailleux lighting unknown, phase dependence omitted (F042);
  - density free within independently justified bounds on a matched area definition (F043's two ranges are different
    quantities); never fixed to make distance or contacts agree;
  - B001's departure rule deferred; G3 carried as a limitation (F058);
  - B014 applied before the substantial step-5 runs: done (D095 review, D096).
- **Publication plan (D127):** candidate papers with briefs in `docs/preprint/` (local only, git-excluded;
  index `docs/preprint/README.md`): 2 synchrony (now), 3 transfer (the existing draft, last), 4 Bles reanalysis (after the E6 run: clear the paper, then a novelty audit); E1, software and process papers
  parked. Briefs stay local only (amendment 1). 1 in-nest movement scoped and not pursued alone
  (amendment 2: its main results are known in other ants, F090, F091; parts folded into 2 and 3); a misread audit
  (data only, rests split in the data but not the model) is carried to paper 3, design first.
- **Proposals awaiting the user** (not blocking):
  - B013's `proposal.patch` (colony snapshots across processes, F059; for step-7 warm-ups and checkpoints).
- **Backlog** (`backlog/README.md`): B001, B013 and B018 done and reviewed (D072; F058–F064). B006 light/dark:
  findings written, open for the user's phase/cause decision. B019 done: B018's peripheral co-movement is mostly a
  classing artefact (F065 supersedes F064). B014 done (D074). Unscoped: B020 (nestmate-only crop gate), B021
  (B018's tables on the model, after the C2 reading), B022 (V8 pretenuring makes colony run times bimodal: ≈ 30 s
  or 35–38 s on colony122; it may cost box fit time).
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
- **Box (rented 2026-10-15; released 2026-10-22 by the user, after its box-only files were archived: 4,893 files, 5.45 GB,
  in `logs/box-2026-10-22/box-only.tar.zst`, every file md5-checked against the box's list `box-md5.txt`; file list
  `files.txt`). As it was:** vast.ai EPYC 9534, $0.307/h, `ssh -p 46397 root@85.218.235.6`; worktree
  `/root/ants-w7`, synced by file copy (its own git HEAD is older and reads dirty; code checksums are checked
  against the local files before each launch). Node via `. /opt/nvm/nvm.sh && nvm use 22.22.1`,
  **SIM_WORKERS=62** (one per core; 120 threads were slower). Old boxes' files in `logs/box-2026-10-11/`,
  `logs/box-2026-10-15/`.
- **Scratch, never commit** (excluded locally in `.git/info/exclude`): `scripts/tmp*.ts`, `scripts/scratch/`.
  Logs (git-ignored): fit C1 `logs/c1/`; C2 `logs/c2/`; diagnostics `logs/sf/`, `logs/sf2/`, `logs/t12/`,
  `logs/judge/`, `logs/orc/`, `logs/night/`, `logs/latent/`, `logs/extra/`, `logs/spread/`, `logs/lo/`,
  `logs/tb/` (box); data-side contacts / onsets / activity / test B in `logs/contacts/`; earlier `logs/act/`,
  `logs/trk*/`, `logs/s3/`, `logs/sp/`, `logs/short/`, `logs/trips/`.
