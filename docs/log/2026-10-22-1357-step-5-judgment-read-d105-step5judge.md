---
id: D106
date: 2026-10-22
time: 13:57
kind: reading
title: Step-5 judgment read (D105; step5judge-20261022T133809Z, ok, 18 m): not adequate and not adoptable (bounds, condition 4, Buffin all fail); no sensitivity flips the verdict; synchrony gate fails on 2 rows; transfer failure under the stopping rule
---
- **2026-10-22 ≈ 13:57 UTC — Step-5 judgment read (D105; step5judge-20261022T133809Z, ok, 18 m): not adequate and not adoptable (bounds, condition 4, Buffin all fail); no sensitivity flips the verdict; synchrony gate fails on 2 rows; transfer failure under the stopping rule.**
  - **Run:** `step5judge-20261022T133809Z` ok, exit 0, 17 m 53 s. Every arm exited 0, and the logs have no error
    lines. The outputs were fetched to `logs/step5/` (git-ignored). Box md5 and simHash `1388de91…` as D105. Read
    against D105's readings, mechanically.
  - **Base arm (240 recruiters per day, judge seeds), combinedZ:**
    - time in nest 1 / 4 / 8 d: −2.9, −2.4, −1.7 (sim 79 / 66 / 66 s vs 113 / 80 / 82);
    - distance: −1.0, −1.4, +0.2;
    - contacts: +2.1, **+7.7, +5.7** (sim 8.2 / 6.9 / 7.3 vs 6.1 / 3.3 / 3.3);
    - total trophallaxis: **−7.3, −6.6, −5.6** (sim 17 / 29 / 32 s vs 57 / 66 / 56);
    - contacts before the main bout: −0.9, +0.3, +1.0;
    - no bout: 1 d **16 %**, 4 d 3 %, 8 d 3 % (bound 10.9 %).
  - **Adequacy: NOT ADEQUATE.** 5 rows |z| > 3, 3 in (2, 3] (more than 2), no-bout bound exceeded on day 1.
  - **Adoption rule: fails on all three parts.**
    - (1) bounds: density and returnRate (D103);
    - (2) condition 4: max |fitZ| 9.3 (contacts 4 d) > 5, and no-bout exceeded;
    - (3) Buffin (200 dishes, 6309 bouts > 3 s): ML ending rate 0.078 /s vs 0.039 (z +8.0); SD / mean 0.61 vs 0.97
      (z −3.45). Bouts end about twice as fast as Buffin's and are more regular. **FAIL.**
  - **Sensitivities: no verdict flips.** Every arm is not adequate and fails condition 4:
    - contacts ≥ 1 s: 5 rows > 3, 2 in (2, 3]; contacts 4 / 8 d drop to z 5.1 / 3.8 (no-bout as base);
    - giveUpTime 60 s: 7 rows > 3, day-1 no-bout 25 %;
    - giveUpTime 300 s: 6 rows > 3, 0 in (2, 3], no-bout met;
    - all-nurse nestmates: 5 rows > 3, 1 in (2, 3], day-1 no-bout 18 %.

    The trophallaxis rows stay between −5.5 and −7.7, and contacts on 4 / 8 d stay > 3, in every arm.
  - **Synchrony gate: FAIL** by D094's rule. Two rows' coupled shifts differ from the placebo's by more than 1 combined
    SE: time in nest 4 d (+1.18 SE; Δc +0.8 s, Δp −6.1 s) and distance 4 d (+1.24 SE; Δc +0.6, Δp −0.9 cm). Every other
    row is within 0.65 SE. The adequacy and condition-4 verdicts are unchanged under coupling (and under placebo). The
    realised SD of log g is 0.624 vs placebo 0.53 (+18 %, not flagged).
    - **Disclosed, rule unchanged:** both failing rows are barely over the threshold. In both, the larger shift is the
      placebo's (coupled ≈ 0). The rule takes the difference of two paired shifts against the row's SE without the
      shifts' own seed noise, so a crossing of ≈ 1.2 SE is weak evidence of sensitivity. Read as fixed: under Rules in
      force, synchrony becomes a step-5 blocker. That adds nothing to this verdict, since step 5 already fails.
      It stays the disclosed blocker for freezing the structure before any held-out test. **(Clarified 2026-10-22 ≈
      14:05 UTC, user; D107):** that freeze requirement predates this gate and does not depend on it. A passing gate
      would not have cleared it: Rules in force independently require the cause to be investigated and then modelled,
      or its omission justified.
  - **Reported only:**
    - zSD: the between-recruiter distance SD is too large (zSD 6.8–7.7; sim SD 14–23 cm vs 5–8), and total
      trophallaxis is too uniform (−2 to −5);
    - Table 2b (development): contacted nestmates almost never leave within 5 min (1–21 % vs 44–93 %; G3 departures,
      B001 deferred, F058);
    - every recruiter leaves within 20 min.
  - **Verdict (stopping rule, Plan step 5):** the step-5 fit is **not adequate and not adoptable**. This is reported as
    a **transfer failure**: ~~with C2's motion fixed, the 1999 nest model cannot reach Mailleux's trophallaxis totals
    and later-day contact counts within the fitted parameters' boxes~~ **(overstated, corrected 2026-10-22 ≈ 14:05
    UTC, user; D107):** with C2's motion fixed, the fitted candidate failed to reproduce Mailleux's trophallaxis
    totals and later-day contact counts within the allotted search. The fit did not converge (D103), so this does
    not show the model cannot reproduce them anywhere within its parameter ranges. The stopping-rule verdict is
    unchanged. Its own trophallaxis bouts also end too fast
    against Buffin's dish data. No 1999-driven model revision follows in M1; only bug fixes reopen it.
    - Rows that pass: distance on all days, contacts before the main bout, and time in nest on 8 d. Time in nest on
      1 / 4 d is marginal.
    - No causal reading. The shortfall in trophallaxis comes with returnRate at its upper bound (fast leaving), and
      density at its lower bound comes with too many contacts. The fit is not converged.
  - **Next (Plan):** step 9 starts with the Stroeymeyt held-out test, and E6 later runs on this fit as the best step-5
    fit, disclosed. Rules in force require the synchrony cause to be investigated, then modelled or its absence argued,
    **before the structure is frozen** for any held-out test. How to meet that blocker before step 9 is the user's
    decision.
