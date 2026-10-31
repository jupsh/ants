---
id: D212
date: 2026-10-30
time: 22:12
kind: design
title: Part D Part 2 item 1(b) designed (D205, D211; B023, D134 item 4; proposal for the user, nothing run): forager nest entries and queen movement onsets in the 22 fit colonies' light phase; colony in-nest moving fraction (event ant excluded) 1 min before against 1 min after each event, minus the same contrast at up to 5 matched control times (same colony and 4-h block, nearest pre-window activity, no event within the windows); colonies weighted equally, 2,000-draw colony bootstrap; per event type exceeds, does not (margin for the user) or unresolved
---
- **2026-10-30 ≈ 22:12 UTC — Part D Part 2 item 1(b) designed (D205, D211; B023, D134 item 4; proposal for the user, nothing run): forager nest entries and queen movement onsets in the 22 fit colonies' light phase; colony in-nest moving fraction (event ant excluded) 1 min before against 1 min after each event, minus the same contrast at up to 5 matched control times (same colony and 4-h block, nearest pre-window activity, no event within the windows); colonies weighted equally, 2,000-draw colony bootstrap; per event type exceeds, does not (margin for the user) or unresolved.**
  - **What:** D205 Part 2 item 1(b), taken next by the lead (D211): does in-nest activity rise after forager nest
    entries or queen movement onsets beyond what precedes them and beyond matched control times (B023's question; D134
    item 4's requirements, binding). A test with a fixed answer per event type, so a pre-registration for the user.
    **Nothing is computed before approval.** Development data only. Implementation goes to the implementer (D208).
  - **Data and roles:** the 22 Stroeymeyt 2018 fit colonies, PreTreatment tracks, read with `streamColony` and `roles`
    (`scripts/stroeymeytTracks.ts`); one tagged queen per colony (`task_groups.txt`). Fit colonies, development use for
    this question (B023). No age-experiment, PostTreatment or held-out file. Primary phase: light (06-18 UTC, Part D's
    phase); dark is descriptive only.
  - **Events** (primary definitions replaced by amendment 1; detections only, 2 fps; the in-nest flag is `streamColony`'s, y <= Ynestmax):
    - **Forager entry** at frame f: a forager's in-nest detection at f whose previous in-nest detection is >= 30 s
      earlier with at least one outside detection between, and with no outside detection in the 30 s after f.
      Sensitivities (descriptive): 10 s and 2 min instead of 30 s.
    - **Queen movement onset** at frame f: the queen's first moving step (as below) after >= 2 min of in-nest queen
      detections with no moving step and no detection gap > 30 s, followed by >= 3 moving steps within 30 s.
      Sensitivities: 1 min and 5 min of stillness.
  - **Activity:** the colony in-nest moving fraction, `ActivitySeries`' step rule (imported, not copied: a step is two
    in-nest detections <= 3 frames apart, moving if >= 0.6 mm/frame), over the in-nest nurses and foragers, **the event
    ant excluded**. A_pre = moving steps / steps in [f − W, f); A_post in [f, f + W). **Primary W = 1 min** (S1's
    calibration cell); descriptive W = 20 s and 5 min. An event whose windows leave its 4-h clock block or contain a
    frame gap > 30 s is dropped (counted).
  - **Matched controls** (amended: matching on level and trend with a tolerance, amendment 1)**:** candidate times every 10 frames in the same colony, phase and 4-h clock block, with no event of
    the same type in [c − W, c + W) and the same gap rule. For each event, the **K = 5** candidates with the nearest
    A_pre (no candidate twice for one event; reuse across events allowed). Events with fewer than K candidates keep
    what they have; events with none are dropped (counted).
  - **Statistics:** per event, DiD = (A_post − A_pre)_event − mean over its controls of (A_post − A_pre). Colony value:
    mean over its events; a colony counts if it has >= 10 events with >= 1 control. Estimate: mean over counted
    colonies, each weighted equally (as D207). 2,000-draw colony bootstrap, 95 % percentile intervals. Beside it, the
    events' own post − pre (B023's pre-event baseline), same weighting and bootstrap. All events are used (primary);
    isolated events only (no same-type event within ± W) is a sensitivity.
  - **Reading, per event type, primary settings only** (replaced by amendment 1's reading):
    - **exceeds:** the DiD interval lies above 0 **and** the events' post − pre interval lies above 0;
    - **does not:** the DiD interval's upper end is below δ;
    - **unresolved:** otherwise.
    - If both of the first two hold, it reads "exceeds, below δ".
    - **δ, for the user:** proposed as 10 % of the counted colonies' mean event A_pre (a relative margin, because the
      activity level is not yet looked at in these windows). Two event types, each read at 95 %; no other row is read
      against a rule.
  - **Descriptive (no rule):** the other windows, dwell and stillness thresholds, isolated events; nurses and foragers
    separately; DiD by distance band from the event (0-20, 20-40, > 40 mm from the entering forager's first in-nest
    detection or the queen's position at onset; Part D's bands; descriptive per B023); activity in 10-s bins from −5 to
    +5 min around events and controls; event rates per light block (06-10, 10-14, 14-18 UTC), beside F108, read as P83
    requires; the dark phase at primary settings; counts at every exclusion.
  - **What it can and cannot show:**
    - Activity can cause entries (a returning forager may respond to activity it meets), and a colony-wide driver can
      cause both. The pre-window contrast and matching on A_pre address the first only for what precedes the event
      within W; the matched controls address slow colony-wide shifts only within a 4-h block. A positive DiD is
      consistent with triggering, not proof of it (D134 item 4).
    - "Does not" constrains only these events as detected, at W = 1 min, above δ.
    - Whether triggers account for the 10-min D_w shortfall (F104) is not tested here; that would be a separate step.
    - The coverage seen in existing exit counts (`logs/q/exits-data-c*.json`, light, nurses and foragers, no dwell
      filter: 25 to 799 per colony, median ≈ 200) means no-event control windows will be scarce in the busiest
      colonies; the counts per colony are reported.
  - **Implementation requirements (lead; after D209):** stream one colony at a time and never hold a colony's input
    whole; reuse `streamColony`, `roles` and `ActivitySeries`' step rule; synthetic tests before any data run (an
    injected post-event rise recovered as "exceeds"; no rise gives a DiD interval covering 0; a rise that **precedes**
    the event is not read as "exceeds"); a smoke on 2 colonies with run time and peak memory before the full run;
    **self-check** before reading any output: per colony, the light-phase moving steps and steps over all ants equal
    an `ActivitySeries` pass over the same stream. Full run via `run.sh`, gated, outputs in `logs/partd2/triggers/`.
  - **For the user (answered: D213, amendment 1):** approve, amend or reject. Choices open: δ; primary W; the 30-s dwell and 2-min stillness; K = 5;
    light only as primary.
- **2026-10-30 ≈ 22:41 UTC — Amendment 1: the user's amendments (D213; Q25) frozen before anything is computed.** Nothing
  event-aligned has been computed or seen. Where this differs from the text above, this governs.
  - **Coverage (all definitions):** an ant is *observed* over an interval if its consecutive detections are at most
    10 s (20 frames) apart throughout it and the last one is at most 10 s before the interval's end. Missing detections
    never count as absence, stillness or residence.
  - **Primary events (nothing after the event is used):**
    - **Forager entry** at f: the forager's first in-nest detection after an observed absence of >= 30 s (every
      detection in [f − 30 s, f) outside the nest, observed as above).
    - **Queen movement onset** at f: the queen's first moving step after >= 2 min of observed stillness: over
      [f − 2 min, f) she is detected in the nest and observed, at least 120 steps (half the frames) are measurable
      (`ActivitySeries`' step rule), and none of them is moving.
    - **Sensitivities (descriptive):** a 30-s observed residence after the entry (D212's original rule); >= 3 moving
      queen steps within 30 s of the onset; absence 10 s and 2 min; stillness 1 and 5 min.
  - **Matching on level and trend, with a tolerance:**
    - For an event at f and each candidate time c: level L = A over [t − 1 min, t); trend R = A over [t − 30 s, t)
      minus A over [t − 1 min, t − 30 s). **The event ant is excluded** from A at the event and at each of its
      candidate and control times (covariates and outcome alike).
    - A candidate is acceptable if |L_c − L_e| <= 0.2 SD_L and |R_c − R_e| <= 0.2 SD_R, with SD_L and SD_R the standard
      deviations over all candidate times of that colony and 4-h block (all ants, for scale only). Among acceptable
      candidates, the K = 5 nearest by Euclidean distance in those SD units. An event with no acceptable candidate is
      **unmatched** (dropped, counted); events with 1-4 keep them (the distribution is reported).
    - **Balance (frozen check):** after matching, per event type, the colony-weighted mean event − control difference
      in L and in R, each divided by its pooled SD_L or SD_R, must be at most 0.1 in absolute value; otherwise the
      reading is **unresolved**.
  - **Colony support:** a colony contributes if it has >= 10 matched events; an event type needs **>= 11 contributing
    colonies** (half of 22), otherwise its reading is **unresolved** (sparse support; expected possible for the queen).
  - **δ:** in each bootstrap draw, δ_b = 0.10 × the colony-weighted mean event L over the drawn colonies; the interval
    is read for DiD − δ (percentile, 2,000 draws), beside DiD's own.
  - **Reading per event type (replaces D212's):**
    - **unresolved** if support or balance fails (above);
    - **exceeds:** the DiD interval lies above 0 and the events' post − pre interval lies above 0; if the DiD − δ
      interval also lies below 0, "exceeds: a positive association smaller than the chosen margin";
    - **an association smaller than the chosen margin:** the DiD − δ interval's upper end is below 0 and DiD's
      interval does not lie above 0;
    - **unresolved:** otherwise.
    - **Pre-event rise (qualifier):** the colony-weighted event − control difference in A over [f − 5 min, f − 1 min),
      from the time course, on the events and controls whose ± 5 min lie inside their block. If its interval lies above
      0, the result is labelled "preceded by a rise: an ongoing association, not evidence of triggering", whatever its
      class.
    - No class says an event type does or does not trigger activity: these are observational associations, shared
      drivers and reverse causation remain possible, and none tells whether either event type explains the 10-min D_w
      shortfall (D213).
  - **Reported with every result:** events found, dropped (block edge, gaps), unmatched, and per colony; the share of
    events with another same-type event within ± 1 min and with an event of the other type within the windows; the
    isolated-event sensitivity beside the primary; balance values; the time courses (−5 to +5 min, 10-s bins).
  - **Unchanged:** W = 1 min, K = 5, light primary, colonies weighted equally, 2,000 draws, the candidate grid, the
    descriptive rows, the implementation requirements, the synthetic tests and the self-check. The smoke on 2 colonies
    reports only counts, timings, peak memory and the self-check.
- **2026-10-31 ≈ 00:19 UTC — Amendment 2: three points settled by the user (D216, after the build report D215), before anything
  event-aligned is computed or seen.**
  - **Balance:** the pooled SD is Σ(n−1)·SD²/Σ(n−1) over the blocks of the contributing colonies, per event type (SD the
    sample SD of all-ant L or R over the block's candidates). Dividing each event's difference by its own block's SD
    is written beside, descriptive.
  - **Rise label calibration (before the read):** the synthetic no-rise case over 100 seeds, through the same code.
    The label's false-positive rate per event type (share of seeds whose rise interval lies above 0) is reported with
    the reading; if it is above 5 % for a type, that type's rise label is reported as uncalibrated rather than read.
    The classes are unaffected.
  - **Descriptive row:** the primary settings with candidates at least 5 min from any same-type event (no class), beside
    the isolated-event row. The primary candidate rule is unchanged.
  - **Kept as implemented:** the other gap-fillings of D215 (report Deviation 2 b-n), the seed `RNG.stream(0x1b212, 1)`.
- **2026-10-31 ≈ 00:58 UTC — Correction to amendment 2's wording (D220):** "the pooled SD is Σ(n−1)·SD²/Σ(n−1)" names the pooled variance;
  the pooled SD is its square root, √(Σ(n−1)·SD²/Σ(n−1)), as both implementations compute. No value or class changes.
