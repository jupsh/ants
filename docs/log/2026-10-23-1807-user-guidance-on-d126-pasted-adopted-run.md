---
id: D128
date: 2026-10-23
time: 18:07
kind: decision
title: User guidance on D126, pasted, adopted: run the S3 audit after amendments, not the full Part D as written; freeze the slope and tie, eligibility and seed rules; directional gate; matched behavioural mapping across families; all 15 rows kept; the 2-D rule deferred until calibrated; interventions as hypotheses
---
- **2026-10-23 ≈ 18:07 UTC — User guidance on D126, pasted, adopted: run the S3 audit after amendments, not the full Part D as written; freeze the slope and tie, eligibility and seed rules; directional gate; matched behavioural mapping across families; all 15 rows kept; the 2-D rule deferred until calibrated; interventions as hypotheses.**
  - **Guidance (pasted by the user), adopted in full.** "I recommend proceeding with the S3 audit after a few
    amendments, but I would not approve the full Part D design as written." Two problems in the later stages:
    unequal behavioural effects between the families, and an equivalence rule that drops difficult rows. The points:
    1. **Freeze the audit's remaining choices:**
       - the slope is OLS with an intercept, **excluding the initiator**, in observed and null statistics alike;
       - tied onsets (null 1 randomises ties, observed episodes use ant-index order); zero distance variance; undefined
         statistics; the minimum eligible episodes per colony; missing colonies;
       - null and bootstrap seeds; observed − null computed on the same eligible episodes.
       - **Null 2 is a reference-position control,** not complete removal of geometry. The two raw null excesses are
         **separate comparisons,** not an additive decomposition.
    2. **Directional gate:** the lower 95 % bound of the data's S3₂ > 0, **and** the lower bound of data − base S3₂ > 0.
       Failure means the gate did not establish positive excess ordering. It does not establish the absence of
       propagation.
    3. **Matched behavioural response:** T changed walk-on and stopping, the drivers walk-on only, so a separation could
       reflect movement duration rather than feedback vs an independent driver.
       - The primary comparison gives both families the same mapping from g to rates. Eu and El20 can stay as historical
         controls with their verdicts; revised comparators and their calibration are specified now.
       - **Correction:** "a 60-s filter cannot relay within an episode" is wrong. A relaxation filter responds at once;
         τ_c sets the response speed, not a mandatory delay. Faster filters stay reasonable candidates.
    4. **All 15 rows kept:** the perfect-model calculation is a precision forecast, not a proof of impossibility. All 15
       equivalent ⇒ joint reproduction demonstrated; otherwise report equivalent, outside and unresolved rows. Low
       precision gives an unresolved conclusion, not a smaller assessment set.
    5. **2-D inference:** Mahalanobis at 5.99 is an approximate Wald test, not automatically a calibrated 95 % bootstrap
       region (with estimated covariance, finite-sample calibration matters; NIST handbook § 5.4.3).
       - Freeze R (ratio of colony means or mean of colony ratios), near-zero denominators and singular covariance.
       - Check false-positive behaviour on synthetic nulls, including skewed colony summaries.
       - Distinguish separation of estimated means from reliable classification of another data set.
       - **Placement:** "not rejected" rather than "compatible"; a wide uncertainty region must not make an inadequate
         member look persuasive; failing to reject is not equivalence (ASA statement, 2016).
    6. **Interventions are hypotheses to evaluate:**
       - ant-mediated vibration need not follow paths around a barrier;
       - a driver's behavioural lags can depend on density even when the physical front does not;
       - a radial front's speed need not be recovered by regressing on distance from the *first observed ant*, which
         may differ from the front's origin.
       - Rank by explicit predictions of the implemented members, and label those needing more modelling unresolved.
    - **On the seven values:**
      - **reasonable as bounded diagnostic choices:** ranges, filter times, front speeds, sensitivity bounds;
      - **±1 frame / 10 mm:** defensible as a proposed practical resolution, but not justified as a fraction of the
        confounded raw contrast;
      - **gate:** directional, as above;
      - **"unattainable" rows:** dropping them is rejected;
      - **the 2-D rule:** approval deferred until its calibration and edge cases are specified.
    - **Recommendation:** amend and freeze Stage 0 first, then run the audit. Its outcome decides whether the larger
      comparison warrants the effort. (The reviewer changed no files and ran nothing.)
  - **Applied:** D126 amendment 1 (in D126's file). Stage 0 is fully specified there. The values the guidance did not
    give are marked for the user's confirmation before the audit runs on any simulated or recorded tracks. Stages 1–3
    are amended but not approved; the 2-D rule waits for its calibration.
