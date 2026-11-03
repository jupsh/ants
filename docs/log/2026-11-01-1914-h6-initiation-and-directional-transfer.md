---
id: D241
date: 2026-11-01
time: 19:14
kind: design
title: H6 initiation and directional-transfer test designed (T059; D238, D239; proposal for the user, nothing built or computed): primary question, whether activation episodes in the 22 fit colonies are started by particular ants, beyond a null that keeps each episode's participants, with role, zone and quiet-start strata and an observational 'no observed preceding contact' class; secondary, nurse-side to entrance-side predictability against shift, fixed-membership and cross-system references, and direction-split arrival-associated rises; missed contacts, tracking gaps, ongoing rises and spatially varying common inputs handled as stated; outcomes left unresolved listed
---
- **2026-11-01 ≈ 19:14 UTC — H6 initiation and directional-transfer test designed (T059; D238, D239; proposal for the user, nothing built or computed): primary question, whether activation episodes in the 22 fit colonies are started by particular ants, beyond a null that keeps each episode's participants, with role, zone and quiet-start strata and an observational 'no observed preceding contact' class; secondary, nurse-side to entrance-side predictability against shift, fixed-membership and cross-system references, and direction-split arrival-associated rises; missed contacts, tracking gaps, ongoing rises and spatially varying common inputs handled as stated; outcomes left unresolved listed.**
  - **Status: proposal for the user** (D239; P140). Nothing is built, run or computed before approval. Values marked
    **[confirm]** are the lead's.
  - **Source of the hypothesis:** H6 (D231), from Richardson et al. 2026 (*L. acervorum*; review D237, D238). Data:
    the 22 Stroeymeyt fit colonies, main experiment, PreTreatment, light phase 06–18 UTC (D240), raw tracks at 2 fps
    with their real detection; development use. No simulation in the primary design.
  - **Primary question:** are activation episodes started by particular ants more often than their participation
    alone predicts, and do those ants differ by task group (nurse, forager, queen) and by nest zone (nurse side,
    entrance side)?
  - **Secondary questions:**
    - **S1, context:** are onsets with no observed preceding contact over-represented when colony activity is low and
      falling, beyond what the contact rate at that activity level predicts?
    - **S2, direction:** does nurse-side activity predict entrance-side activity more than the reverse?
    - **S3, arrivals:** do ants arriving in a zone (from the other zone, or from the arena) precede a rise in that
      zone's activity beyond matched controls, and does this differ by direction?
  - **What it adds beyond the existing analyses (P132):**
    - Test A and F026: episode-level spatial order from the initiator (a weak regional order in the light phase).
      Nothing tested *who* starts episodes, whether the same ants do so repeatedly, or their role and zone.
    - Test B and F019–F021: contact-associated onsets, with an elevation already before the contact; contacts precede
      only about 5 % of sustained onsets. Not split by role, zone or colony activity context, and not about initiators.
    - S3 and F088, F092: onset lag by distance within episodes; excess ordering not established.
    - F094–F107: symmetric co-movement by distance. No direction, identity or zone.
    - F109: activity after forager entries from the arena and after queen onsets, against matched controls. Not split
      by direction, and no within-nest zone crossings.
    - F110: the 10-min shortfall decomposed into co-presence and coupling. No individual structure.
  - **Definitions (reused where they exist):**
    - **Movement onset:** a crossing of 0.6 mm/frame after at least 10 s below it (2026-10-17 05:57 definition).
    - **Episode:** onsets in time order, ended by a gap of more than 10 frames (5 s), with at least 3 distinct ants; the
      first onset is the initiator (Test A). Sensitivities: ~~at least 5 ants; a 20-frame gap~~ frozen in amendment 1.
    - **Contact:** the Test B contact check (a partner coming from far to near at 4.1 mm), with a partner that is moving while the focal ant is still.
    - **"No observed preceding contact" (P134):** no observed contact with a moving ant in the W seconds before the
      onset, W = 10 s primary and 60 s (Richardson's window) as a sensitivity **[confirm]**. It is named and reported
      as an observational class, never as "spontaneous".
    - **Zones:** each nest cell's site maturity (the share of its visits made by foragers, task groups from
      `task_groups.txt`), split at the colony median into ~~a nurse side and an entrance side~~ a low- and a high-forager-visit zone (amendment 1) (Richardson's method). The
      brood coordinates are not used (descriptive only, D134).
    - **Activity series:** each zone's moving fraction per 1-min bin, with two memberships: by current location, and
      fixed by each ant's own zone (its modal side), which removes the mechanical carry-over of an ant moving
      between zones.
  - **Statistics:**
    - **Primary, initiation excess:** per ant, initiations observed against expected under null 1 (onset times
      permuted among each episode's participants, so each episode keeps who took part, where and when; 1,000
      permutations). Reported: (a) the dispersion of per-ant excess beyond the null; (b) **repeatability**, the
      Spearman correlation of per-ant excess between the first and second halves of the light phase, against the
      same under null 1; (c) the share of initiators by task group and by zone, against null 1's expected share. A
      position-keeping null (null 2: the initiator's position taken from another episode of the same colony) is
      reported beside null 1, so that a zone effect is not read as an identity effect.
    - **S1:** the share of onsets with no observed preceding contact by colony activity level (tertiles) and 1-min
      slope (falling, flat, rising), against the share of still, at-risk ants with no observed contact in the same W
      at the same level and slope. The excess, not the raw share, is read: the raw share falls with activity
      mechanically.
    - **S2:** per colony, linear Granger tests in both directions on the 1-min zone series (lag 2 min, as Richardson;
      lags 1–5 as sensitivity), summarised as the difference in F-statistics and in the share of significant tests.
      References: (i) circular shifts of one series (keep each series' autocorrelation, break alignment); (ii) the
      fixed-membership variant; (iii) the same test between zones of two different colonies recorded at the same time
      (pairs on the same dates, D240), a reference for room-level shared input (F023).
    - **S3:** arrivals (zone crossings within the nest, and entries from the arena), with the arriving ant excluded
      from the receiving zone's activity; the receiving zone's activity over the next 5 min against controls matched
      on that zone's pre-arrival level and trend (the D212 matching), split by direction; difference-in-differences
      as in F109.
    - Colonies weighted equally; 2,000-draw colony bootstrap; 95 % intervals.
  - **Observation problems, and how each is handled (P133):**
    - **Missed contacts:** detection is about 92.7 % per ant-second, so a window can hide a contact. An onset is
      classed "no observed contact" only if the focal ant is detected in at least 90 % of the window's frames and no
      ant last seen within reach plus 2 s of travel was undetected for more than 2 s inside the window; otherwise it is
      "unknown". Primary: unknowns excluded; sensitivity: unknowns counted as preceded by contact ~~(conservative)~~ (a sensitivity, not necessarily conservative; amendment 1, point 3). The
      unknown share is reported.
    - **Tracking gaps:** an onset needs its 10 s of stillness observed; gaps of up to 2 s are allowed in the primary,
      and a strict uninterrupted variant is a sensitivity (it kept only about 8 % of onsets in Test B, so it is
      reported, not read).
    - **Ongoing rises:** every statistic is also reported in quiet-start episodes, where colony moving fraction in the
      preceding 60 s is in the colony's lowest third and not rising; S3 matches on pre-arrival trend.
    - **Spatially varying common inputs:** the nest is dark to the ants but the entrance opens onto a lit, 26 °C
      foraging area, so zones can differ in exposure. Zone effects are read only alongside the position-keeping null;
      identity heterogeneity is also reported within zones; S2 is read against the cross-colony reference. None of
      these excludes a common input that varies within the nest in a way not shared with another system.
  - **Self-check before anything is read:** the rebuilt episodes reproduce Test A's light-phase values (ρ +0.015 and
    null comparisons, F026) and Test B's onset counts within rounding. Until they pass, only those values are
    printed; if one fails, nothing else is read and the cause is logged.
  - **Readings (fixed now, descriptive, P137):**
    - ~~Primary: heterogeneous initiation if repeatability exceeds null 1's 97.5th percentile and its colony-
      bootstrap interval excludes 0; otherwise unresolved. A role or zone share is over-represented when its
      interval excludes the null's expected share.~~
    - ~~S1, S2, S3: a difference is resolved when its interval excludes 0 and the reference's does not explain it.~~
      Replaced by amendment 1, point 4.
    - Every label is an association. None says that an ant causes activity, that a contact transmits it, or that
      predictability is transmission; "no observed preceding contact" is not "spontaneous".
  - **Outcomes that remain unresolved whatever the result:**
    - whether initiators cause the episodes they start, or respond earlier to something unobserved (vibration,
      airflow, an unseen contact, a local physical input);
    - whether directional predictability is transmission or a shared input with a zone-dependent delay;
    - H2 against H3: neither the identity nor the direction statistics separate a slow individual state from excitable
      recovery (P136, for T060);
    - whether any of this explains the 10-min co-variation deficit (C1), which needs modelling (item 1(e));
    - transfer limits: Richardson's colonies cycle regularly; periodicity in ours is unresolved (F012, P80).
  - **Not in scope:** no simulation (the Stage 2b arms could be put through the same code later, as a separate
    decision **[confirm]**); no model change (P103); no choice of 1(e)'s mechanism (D239).
  - **Cost and implementation:** a data-side script by the implementer from a brief (D208), reusing the onset,
    episode and contact code of 2026-10-17 (`scripts/scratch/contactOnsetData.ts`, the spread dump and `spreadAgg.py`;
    local, not committed); minutes of run time on the 22 colonies; no long run.
  - **For the user:** approve, amend or reject; in particular W (10 s, 60 s as sensitivity), the episode
    sensitivities, the zone method, the readings, and whether the arms are added later.
  - **2026-11-01 ≈ 22:45 UTC — amendment 1 (D242, the user's answer to Q31; approved with amendments).** Where this
    differs from the text above, it governs. Details marked (lead) are fixed by the lead to implement the user's
    points; the user's choices are quoted in D242.
    - **Choices:** W = 10 s primary, 60 s sensitivity. Episodes: 3 ants and a 5-s gap primary; frozen sensitivities 5
      ants, a 10-s gap, and both together; all reported, none selected. Zones are named the **low- and high-forager-
      visit zones** (L, H), not nurse side and entrance side, unless their anatomy is independently established. The
      Stage 2b arms are deferred to a separate decision and design.
    - **Zone construction (lead):** the nest area on a 2 × 2 mm grid; each cell's forager-visit share = forager
      detection-frames / (forager + nurse detection-frames) over the light phase (queen excluded); cells with fewer than
      600 such frames are unassigned; the colony median of the assigned cells' shares splits them into L (at or below)
      and H (above). An onset's zone is its cell's; onsets in unassigned cells are counted and excluded from zone
      analyses. Built once per colony from the whole light phase.
    - **Point 1, the location-conditional reference (null 3, lead):** for each episode, the initiator's zone at its
      onset frame is kept; the initiator is redrawn uniformly among the episode's **eligible observed participants in
      that zone**: participants whose own onset in the episode lies in the same zone, who were detected on the
      initiator's onset frame and in at least 90 % of the preceding 10 s, and who were still (below 0.6 mm/frame)
      throughout that 10 s. An episode with no eligible alternative is uninformative for null 3 and excluded from it
      (counted). Null 1 stays as drafted for "beyond participation". **Support for null 3:** at least 15 of the 22
      colonies each with at least 30 informative episodes in each half of the light phase; otherwise identity
      heterogeneity beyond location is **unresolved**, whatever the statistic. The position-keeping null 2 is dropped
      as a control (it does not control identity for location) and kept as a description only.
    - **Point 2, temporal structure in S2 (lead):** each zone's 1-min moving-fraction series is analysed within the
      three 4-h blocks (06–10, 10–14, 14–18 UTC) separately, each detrended by its own linear trend, and the block
      results are averaged with equal weights; the known light-phase variation (F108) therefore enters neither the
      Granger tests nor the shifts. Shift references are circular shifts within the same block by a uniform lag of at
      least 20 min (1,000 draws). The cross-colony reference uses only pairs of colonies whose recordings overlap in
      actual UTC time, on the overlapping minutes only, block by block. S2 uses complete series; quiet-start
      restrictions apply to the event analyses (the primary, S1, S3) only, and selected episodes are never
      concatenated into a series.
    - **Point 3, symmetric observation rules (lead):** the coverage rule (focal ant detected in at least 90 % of the
      W-window's frames; no ant last seen within reach plus 2 s of travel undetected for more than 2 s inside the
      window) is applied identically to onsets and to the at-risk still ant-times of S1's reference, and to null 3's
      eligibility. Unknown fractions are reported by role, zone and activity context, for onsets and reference alike.
      Two sensitivities, both reported: unknowns counted as contact, and unknowns counted as no contact. Neither is
      called conservative.
    - **Point 4, the statistical specification (lead):**
      - **The single primary decision statistic is repeatability (R̄)**: per colony, for each ant, the standardised
        initiation excess z = (O − E) / √E in each half of the light phase (06–12, 12–18 UTC), with O its observed
        initiations and E their expectation under the reference (the sum, over episodes where it is a candidate, of 1 /
        the number of candidates); the colony's statistic is the Spearman correlation of z between halves across ants
        with E ≥ 1 in both halves; R̄ is the mean over colonies, each weighted equally.
      - **Minimum support:** a colony enters with at least 8 such ants; R̄ is computed only if at least 15 colonies
        enter, else the primary is **unresolved**. Excluded colonies and ants are listed.
      - **Ties:** onsets on the same first frame of an episode share its initiation equally (1/k each); permutations
        keep tied times tied; for null 3, an episode whose tied first-frame ants lie in different zones is excluded
        (counted).
      - **Reference thresholds and the reading:** R̄ is compared with its distribution under the reference (1,000
        draws, each re-sampling the initiators and recomputing R̄ with the same support). Under null 1: **initiation
        heterogeneous beyond participation** if R̄ exceeds that distribution's 97.5th percentile and the lower bound of
        the 2,000-draw colony-bootstrap 95 % interval of R̄ minus the reference median is above 0; otherwise
        **unresolved**. Under null 3, with its support met: **heterogeneous beyond location** by the same rule;
        otherwise **unresolved**. These two labels are the only decision labels in the design.
      - **Everything else is descriptive:** role and zone shares against their reference expectations, S1, S2 and S3
        are reported as estimates with 95 % intervals, with no "resolved" or "over-represented" labels.
      - **Sensitivities** (W 60 s; 5 ants; 10-s gap; both; strict uninterrupted tracking; the two unknown rules) are
        all reported beside the primary. They cannot overturn the primary reading by selection; a disagreement is
        reported as a disagreement.
    - **Point 5, validation before any empirical reading (lead):** synthetic data are built on the real colonies'
      episode skeletons (participants, onset times, positions and detection), with initiators **reassigned by a known
      rule**; the real initiator assignment is never scored in these checks. 200 synthetic data sets per case, the full
      pipeline (reader, references and support rules) unchanged:
      - **V1, null:** initiators drawn uniformly among participants. Accept if the null-1 label fires in at most 5 % and
        the null-3 label in at most 5 %.
      - **V2, persistent spatial preference, no identity effect:** initiators drawn with weight 3 for participants in
        L, 1 in H, uniform within a zone. Accept if the null-3 label fires in at most 5 % (the null-1 label may fire: it
        is not a location control).
      - **V3, identity effect:** a fixed random 20 % of each colony's ants carry initiation weight 3, others 1, within
        participants and within zones. Accept if both labels fire in at least 80 % (null 3 counted only where its
        support is met; the share meeting support is reported).
      - **V4, missing observations:** V1 and V3 after deleting a further 10 % of detections, twice as often in H as in
        L, before onsets, episodes and eligibility are rebuilt. Accept if V1's labels fire in at most 5 % and V3's in at
        least 70 %.
      - **S2 check (descriptive, no acceptance rule):** a synthetic shared signal driving both zones with H lagging L by
        2 min, and independent zone series, through the same S2 code; the shift and cross-colony references are
        reported for both.
      - **Reproduction:** Test A's light-phase values (F026) and Test B's onset counts, as drafted.
    - **Order and blinding (lead):** the implementer builds the pipeline and runs V1–V4, the S2 check and the
      reproduction; the reader (aggregation script) is then frozen by its SHA-256 in this entry before any empirical
      statistic is computed. Until then the empirical outputs' path `logs/h6/` is sealed (`.claude/sealed-paths.txt`);
      only the reproduction values and the synthetic results are printed. If any acceptance rule fails, or a check
      needs a substantive design change, nothing empirical is read and the user decides.
  - **2026-11-01 — implementation details fixed by the lead before the brief (no change to the design):**
    - **Onsets** use the existing definition in `scripts/scratch/onsetStats.ts` (moving = a step of at least 0.6 mm per
      frame from the last detection at most 3 frames back; an onset after at least 20 still frames, with detection gaps
      of at most 3 frames, 1.5 s, allowed), so that Test A reproduces. This is the "gaps of up to 2 s" above, made exact.
    - **Coverage radius** for "an ant last seen within reach plus 2 s of travel": 25 mm (the 4.1 mm contact radius plus
      2 s at 10 mm/s, well above in-nest walking speeds).
    - **S1's at-risk reference** samples still, at-risk ant-frames every 20th frame (10 s), under the same coverage rule.
    - **Runs:** the implementer builds the code, its tests and a smoke (a few synthetic data sets per case, under 10
      min); the full V1–V4 checks (200 data sets per case) run as a lead's long run (`scripts/run.sh`).
    - **Queens:** the existing onset code counts nurses and foragers only. The H6 pipeline includes the queen as an ant
      (its role is one of the three in the primary question); the reproduction of Test A and Test B runs in a mode that
      excludes her, as they did.
  - **2026-11-02 ≈ 05:46 UTC — amendment 2 (D246, the user's answer to Q33, after the build check D245).** Where this
    differs from the text above, it governs.
    - **Null 3's eligibility** is point 1's three conditions only: detected on the initiator's onset frame, detected
      in at least 90 % of the preceding 10 s, and still throughout those 10 s. Point 3's coverage rule (its neighbour
      clause included) no longer applies to it; it still classes "no observed contact" against "unknown" for onsets and
      S1's at-risk reference. The observed initiator must meet the same three conditions, or the episode is excluded
      from null 3 (counted).
    - **S3's entries from the arena** require D212 amendment 1's *observed* condition (every detection in the 30 s
      before the entry outside the nest, observed: detections at most 10 s apart from the last one at or before the
      window's start up to the entry).
    - **The implementer's fill-ins** where this entry is silent (build report, Deviations and doubts point 4) are
      confirmed and frozen with the reader.
    - **One blind check** of S1's unknown share before the freeze, as D246 sets it; "mostly unknown" (above 50 % in
      either) returns a radius proposal to the user before the freeze.
    - **2026-11-02 ≈ 15:27 UTC — the blind check's cutoff is the user's (D249):** a radius proposal returns if either pooled share or either zone's share (L or H, onsets or at-risk reference) is above 50 %; one yes/no zone flag is printed beside the two pooled shares.
  - **2026-11-03 ≈ 00:04 UTC — the reader frozen (D259; the user's go-ahead D258, after V1–V4 passed, D257):** `reader.ts`
    SHA-256 `3c3985c09c3148a65d03c97b08eb5bcd08c8b118e3cfc19f7db58cf69c1b87d1`, with the reachability extractor
    `extract.ts` SHA-256 `ea889e9dc43984053963b4d8dfe30999ccae78aab1f399a9aa2ac66c990b9f71`; both, with every file
    they import, committed under `scripts/frozen/h6/` (P172); the full list of hashes is in D259.
