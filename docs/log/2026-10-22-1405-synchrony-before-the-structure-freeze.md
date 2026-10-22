---
id: D108
date: 2026-10-22
time: 14:05
kind: design
title: Synchrony before the structure freeze (Rules in force, D107): assessment of the existing investigations for a defensible omission, and the bounded measurements it still needs; proposal, nothing run
---
- **2026-10-22 ≈ 14:05 UTC — Synchrony before the structure freeze (Rules in force, D107): assessment of the existing investigations for a defensible omission, and the bounded measurements it still needs; proposal, nothing run.**
  - **Requirement (Rules in force, Colony synchrony, 2026-10-17 ≈ 15:25):** before the model structure is frozen for any
    held-out test, the cause of the synchrony is investigated, then either modelled or its absence argued and
    disclosed. This is independent of the step-5 gate (D107). Scope: the Stroeymeyt fit colonies, C2's step-4 fit and
    the step-9 row family. **Separate from the 1999 rows:** nothing here uses, refits or reinterprets them; the
    stopping rule closes that route except for demonstrated bugs. F082 is cited as disclosure only.
  - **Part A: the existing record, assessed for a defensible omission.**
    - Criteria (stated now, but set after the whole record was read, so the assessment is not blind):
      - (a) the investigations the permitted data allow have been made, and the remaining causes cannot be separated
        on them without a new model element or new data;
      - (b) the discrepancy is quantified for the model carried into the held-out test;
      - (c) the held-out statistics are shown not to hinge on the omitted element;
      - (d) the omission, with its limits, is disclosed beside every held-out verdict.
    - **(a)** ~~Met, in my assessment.~~ **(Corrected 2026-10-22 ≈ 14:09 UTC, D109):** the record supports
      uncertainty about the cause, not that omitting it is harmless. **Existing investigations have not identified a
      mechanism sufficiently to adopt it.** Done so far:
      - the synchrony itself: D_w data 4.15 / 6.28 at 1 / 10 min vs model 1.25 / 1.57 (F022);
      - mainly within-nest, not shared across recording systems (X, F023: E ≤ 0.197);
      - co-movement graded over 1–4 cm, neither contact-range coupling nor a flat box-wide driver (Y, F024;
        confounded with packing: 2 % of data pair-bins ≥ 40 mm);
      - weak spatial order within episodes, lag rising with distance only descriptively (Test A, F026);
      - the contact-onset association is not attributable to contact: a comparable elevation precedes it, and a
        contact-activation arm is not warranted (Test B recheck, 2026-10-17 14:02, user agreed);
      - zone contrasts are mostly a classing artefact, and the null cannot separate local coupling from a shared
        driver (F065);
      - no periodic mechanism shown (F012); a global oracle can produce the synchrony but only as a cheat channel
        (F025);
      - other-species literature: waves from the brood pile (Boi 1999, F056) and excitable units (Cole 1991).

      What remains are two accounts: (i) propagation within the nest through a channel the 2-fps tracks do not
      resolve (C2's deferred Stage 2, `docs/research/latent-activity-design.md`), or (ii) drivers local to one
      recording system that reach ants unevenly. The separating tests are each limited by the 0.5-s resolution, the
      packing confound, the 7 simultaneous pairs and the lack of a positive control for local spread. I find no
      further data-only test that escapes all four.
    - **(b) Not met.** F022's model value is the C1-era start point; synchrony was never measured on C2 (D_w), the
      model step 9 would test.
    - **(c) Not met for step 9.** The only evidence on the Stroeymeyt rows is the C1 start-point oracle run
      (2026-10-17 22:56): row loss control 21 316, κ 1 19 143, placebo 0.53 15 688. Its placebo was not mean-matched
      (exp(x) raises the mean walk-on multiplier by ≈ 15 %), so sharing and modulation are confounded there. F082 is
      a different row family (1999 recruiter means), with a narrow, placebo-driven failure.
    - **(d)** procedural; it can be met.
    - **Conclusion:** ~~the record supports an omission on the cause (a), but not yet on its consequences (b, c).~~
      **(Corrected ≈ 14:09, D109):** the cause is unresolved, and no mechanism is identified well enough to adopt
      (a). The consequences of omitting it are unmeasured (b, c). Part B measures some consequences; it cannot show
      the omission harmless.
  - **Part B (recommended): the two measurements that would complete an omission argument.** Diagnostics on the fit
    colonies only: no fit, no held-out data, no model change, with off-by-default switches only.
    - **B1, the discrepancy for C2 (synchrony, data vs model):**
      - `tmpShortSim.ts --candidate C2 --fit data/fits/s2018-motion-c2.json --trips --lite`, 22 colonies, light,
        the 4-h light window, `syncAgg.py`; arms base and `--oracle coupled:1:60`;
      - reported: D_w (all / nurses / foragers) at 5 s, 1 min and 10 min, data beside;
      - reading: C2's D_w is the discrepancy carried into the omission statement. The coupled arm places the stress
        test: if its D_w ≥ the data's at 1 and 10 min, κ = 1 brackets the data's level for C2; if not, it is
        reported as not reaching it, and (c)'s result covers less.
    - **B2, the step-9 row family's sensitivity to sharing, matched on modulation:**
      - `diagS2018.ts --candidate C2 --fit … --seeds judge --reps 22 --dt 0.05 --warmup 7200 --obs 21600` (D080's
        judging settings and seeds, so the arms are paired with each other). Arms: base (rerun under the current
        code), coupled `--oracle coupled:1:60`, and a **mean-one** placebo `--oracle placebo:s:60:unit`, where s is the
        coupled arm's realised SD of log g (signal only; read before the placebo runs, as in the 2026-10-17 pilot).
        diagS2018 gains a print of that SD if it lacks one; this is reporting only;
      - rows: the 36 judged rows (32 motion + 4 activity). Not covered: row 1's stays (a check, not judged) and row 4
        (contacts vs density, still awaiting the contact observer's validation); named as gaps;
      - **reading, fixed now:** a row is *sharing-sensitive* if |Δ_coupled − Δ_placebo| > 1 combined SE (SE_data ⊕
        SE_sim in base) **and** the 95 % colony-bootstrap CI of Δ_coupled − Δ_placebo excludes 0. The CI clause fixes
        the weakness found in F082; the step-5 rule stays as it was for step 5. Also reported: the counts of rows
        with |z| > 3 and in (2, 3], per arm.
      - **Omission defensible for step 9** if no row is sharing-sensitive, or if at most 2 rows are and the
        |z| > 3 count is unchanged. Those rows are then flagged in step 9's verdict as possibly synchrony-dependent.
        **Otherwise not defensible**: the modelling route (Part C) or the user's call.
    - Both are bounded: no further arms, no κ other than 1, no τ_c other than 60 s.
    - Cost: box ≈ 2.5–3 h (B2 three arms × ≈ 40 min as D080, B1 ≈ 30 min). Local: an hour of setup and the script.
  - **Part C (not recommended now): the smallest investigation that could distinguish the causes.**
    - A positive control is what all four limits in (a) lack. Build C2's Stage 2 (local relaxation of the drive
      toward perceived neighbour activity; κ_local plus a percept range; `perception/` boundary) as a diagnostic
      switch, off and bit-identical by default. Run it through Y (C by distance), Test A (lag vs distance) and the
      Test-B time course on the fit colonies, beside the global oracle.
    - Reading, to be fixed with its design: local coupling is *a sufficient account* if it reproduces the data's
      graded co-movement over 1–4 cm and the lag rising with distance where the global oracle does not.
      ~~If it cannot, account (ii) is favoured but unresolved.~~ **(Corrected ≈ 14:09, D109):** a failure shows only
      that this implementation does not produce the signatures, and says nothing in favour of (ii). Either way, Part C
      would show a sufficient mechanism or test the diagnostics' power. One implementation's success or failure
      would not by itself distinguish propagation from local external drivers.
    - Cost: a new model element (design, code, tests, then box runs), on the order of days. Adopting it would be a
      structure change, decided by the user.
  - **For the user:** approve Part B (recommended) and its readings, or amend them; or choose Part C; or argue the
    omission on Part A alone, with (b) and (c) stated as unmeasured. Nothing runs before that.
- **2026-10-22 ≈ 14:09 UTC — Amendment 1 (D109, user guidance adopted), before anything was built or run.** Part B's
  readings above are **replaced** by these. Part A and Part C are corrected in place.
  - **What B can and cannot establish.** B1 / B2 inform the user's freeze decision; neither clears the requirement by
    itself.
    - At best, B2 shows that the 36 rows are robust to this one artificial perturbation, in the groups and windows
      where B1 shows the perturbation reaches the data's synchrony.
    - It does not show robustness to other synchrony mechanisms (an overshoot bounds nothing else). It does not cover
      row 1 (stays) or row 4 (contacts versus density), nor the 1999 rows or E6.
    - Rows 1 and 4 are **explicit scope decisions for the user before step 9**, whatever B shows.
  - **Matching, verified explicitly (point 1).**
    - **Code:** a placebo log shift (`placebo:sd:τ_c:shift=m`, multiplier exp(x + m); `unit` is m = −sd²/2) and an
      opt-in realised-signal recorder for both oracle kinds. The recorder samples the multiplier every 10 s after the
      first 30 min: the colony's one g when coupled, each in-nest ant's g under the placebo. Both are off by default
      and bit-identical, with tests.
    - **Order:** the coupled arm runs first. Its realised signal gives the placebo s = SD of log g and m = ln E[g] −
      s²/2, so the placebo's E[g] matches the coupled arm's. Nothing else from the coupled arm is read before the
      placebo runs.
    - **Verified after the placebo arm:** E[g] within ±2 %, SD of log g within ±10 %, and the lag-60-s
      autocorrelation of log g within ±0.10 (pooled over colonies).
      - Reported beside, not matched: mean of log g, skewness, the fraction of clipped steps (g at 0.25 or 4), and the
        autocorrelation at 10 s and 10 min.
      - **All three met:** the difference is read as sharing at matched mean, log-SD and 60-s autocorrelation, with
        the remaining differences in distribution shape and temporal structure disclosed.
      - **Any not met:** the comparison is labelled an *oracle-versus-placebo stress test*, and no part of its
        difference is attributed to sharing as such.
  - **B1 (coverage, point 4):**
    - arms: C2 base, coupled `coupled:1:60`, and the matched placebo (it must not raise synchrony);
    - the 22 fit colonies, light, the 4-h light window, as F022;
    - D_w for all ants, nurses and foragers at 5 s, 1 min and 10 min, each with a colony-bootstrap 95 % CI, data
      beside;
    - **per group × window cell:** *reached* if the coupled arm's D_w ≥ the data's (point estimates), *not reached*
      otherwise; the CIs are reported. C2 base minus data is the **retained discrepancy**, stated in every omission
      text.
  - **B2 (row-level classification, points 2–3):**
    - arms: C2 base, coupled and matched placebo, at D080's judging settings and seeds (`--seeds judge --reps 22`);
    - for every one of the 36 rows: base, coupled and placebo values and z, Δ_c, Δ_p, and D = Δ_c − Δ_p, with
      paired CIs from a bootstrap over matched colonies (2000 resamples). The same colony draw is used in all three
      arms, and each colony keeps its seed-paired runs;
    - **classes, fixed now:**
      - *robust to this perturbation:* the 90 % CI of D lies wholly inside ±0.5 SE_data (the project's equivalence
        margin, Rules in force: an effect that small moves the row's z by less than 0.5);
      - *sensitive:* |D| > 1 combined SE (SE_data ⊕ SE_sim in base) **and** the 95 % CI of D excludes 0. Reported with
        its sign, its size in SE_data and whether it improves or worsens the row's z;
      - *unresolved:* anything else, reported as such and never counted as robust;
    - **no aggregate allowance:** the "at most 2 sensitive rows and unchanged |z| > 3 count" rule is withdrawn. Every
      row is reported by identity and shift; the counts per arm are descriptive only;
    - a robustness statement names its rows and is qualified by B1's reached cells (rows by role are tied to that
      role's cells).
  - **Outcome language, fixed now:** "rows R are robust to an artificial global coupling that reaches [cells] of the
    data's synchrony; rows S are sensitive (sizes); rows U are unresolved; rows 1 and 4, the 1999 rows and E6 are not
    covered". No outcome is phrased as "omitting synchrony is harmless". The freeze decision is the user's.
  - **Cost:** local code and tests ≈ 2 h (placebo shift, recorder, the `--oracle` parsing in `s2018Lib.ts`, the
    reader `scripts/scratch/syncSensS2018.ts`); box ≈ 3–3.5 h (B2 three arms × ≈ 40 min; B1 three arms on 22
    colonies). Nothing is built or run before the user approves this amendment.
- **2026-10-22, between D110 (14:12) and D111 (14:32) UTC — Amendment 2 (lead, during the build; before any B1 / B2
  run), with D110's clarifications applied.** (Header time corrected when D111 was logged: it had been typed by hand as
  "≈ 14:45", ahead of the clock.)
  - **Recorder window: the observed window, [end of warm-up, end of observation), not "after the first 30 min".**
    - Why: a signal-only check on one colony (`scripts/scratch/oracleTransient.ts`: colony 0, judge seed 0, C2,
      coupled κ 1, warm-up 7200 s + 21 600 s) showed the coupled arm's slow average still settling early in the
      warm-up: E[g] 0.445 at 30–60 min, about 0.86–1.07 from 60 min on. The run's final step also gave one sample
      clipped low.
    - Matching to a transient outside the window where the rows are measured would be wrong. The Stroeymeyt runner
      now sets the recorder to [warmupS, warmupS + obsS), half-open.
    - The coupled arm's `oracleLogSd` sums used by the 1999 runner keep their 30-min start (unchanged).
  - **Seen while building** (signal statistics only, no row value or z):
    - the bins above;
    - a toy smoke run (2 reps, warm-up 1800 s, 1200 s window, 32 rows) whose coupled E[g] was 0.26 against the
      placebo's 1.08, so matching was "not met". That is meaningless at those settings, and it is what led to the
      check above.
  - **Reporting** follows D110: "the coupled–placebo contrast is equivalent within ±0.5 SE_data for rows R", with Δc
    and Δp beside it, and no exclusive attribution to sharing even when matching passes.
  - **B1 seeds:** `tmpShortSim.ts --colony c` with its default seed 4242 in every arm (paired across arms, as F022's
    control and the oracle-correction arms). Its `--seeds judge` naming does not match `syncAgg.py`'s file pattern.
    B2 keeps D080's judge seeds.
