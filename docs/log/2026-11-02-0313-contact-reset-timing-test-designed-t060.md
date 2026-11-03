---
id: D243
date: 2026-11-02
time: 03:13
kind: design
title: Contact-reset timing test designed (T060; D238, D239; proposal for the user, nothing built or computed): Stage 0 decides whether Cole's three-interval comparison is identifiable in the 22 fit colonies (support of triplets with complete event histories, and a characteristic per-ant inactive interval against a memoryless reference passed through the same selection); only if it is, Stage 1 reads one primary statistic, log(I3/I1) in contact triplets minus near-approach reference triplets matched on rest age, I1, role, zone, activity context and light block, with an equivalence rule for 'unchanged'; H2 versus H3 not separable by this design; the record suggests Stage 0 may fail (F089, F009, F062)
---
- **2026-11-02 ≈ 03:13 UTC — Contact-reset timing test designed (T060; D238, D239; proposal for the user, nothing built or computed): Stage 0 decides whether Cole's three-interval comparison is identifiable in the 22 fit colonies (support of triplets with complete event histories, and a characteristic per-ant inactive interval against a memoryless reference passed through the same selection); only if it is, Stage 1 reads one primary statistic, log(I3/I1) in contact triplets minus near-approach reference triplets matched on rest age, I1, role, zone, activity context and light block, with an equivalence rule for 'unchanged'; H2 versus H3 not separable by this design; the record suggests Stage 0 may fail (F089, F009, F062).**
  - **Status: proposal for the user** (D238: each design comes to the user for approval before anything runs). Nothing
    is built, run or computed before approval. Values marked **[confirm]** are the lead's.
  - **Source of the hypothesis:** H2–H3 boundary, "an individual timing state reset by contact" (review D237, accepted
    with amendments D238; item 2 of the user's order). The comparison is Cole 1991 *J Insect Behav* (cleared), pp.
    131–134: isolated *L. allardycei* workers have inactive intervals with a central mode (27 intervals, SD 0.28 of the
    ant's mean); in pairs, the effect of an interaction was always to decrease the expected interval until the next
    bout (23 interactions, Fig. 2); over three consecutive inactive periods I1, I2, I3, with one interaction in I2 and
    none in I1 or I3, Fig. 3 sets out three
    outcomes: transient stimulation leaving the underlying oscillation undisturbed (I1 < I3), a shortened period (I1 >
    I3), and a phase shift (I1 = I3). The data gave I1 = 1.1, I3 = 0.9, t = 1.48, df = 35, P > 0.2, read as a phase
    shift. Two limits carry over: equality was inferred from a non-significant test, and only intervals with no more
    than one interaction were scored.
  - **Data:** the 22 Stroeymeyt fit colonies, main experiment, PreTreatment, light phase 06–18 UTC (D240), raw tracks at
    2 fps with their real detection; development use. Nurses and foragers; the queen excluded in the primary
    **[confirm]** (Cole's are workers; she is contacted almost continuously). No simulation in the design.
  - **Primary question (P135):** do complete event histories and suitable references make the three-interval comparison
    identifiable in these tracks, and if they do, which of Cole's three outcomes are the data consistent with?
  - **What it adds beyond the existing analyses:**
    - Test B and F019–F021: onsets after a contact with a moving ant (RR ≈ 3), with a comparable elevation already
      before the contact; contacts precede about 5 % of sustained onsets. Only the interval the contact falls in.
    - F062 (B018, post hoc rule): the walk-on ratio after a mover's arrival, 2.19 at 0–2 s, falls to 1.02 [1.00, 1.04]
      once rest age is stratified. Rest age is Cole's B; nothing looked at the next interval.
    - F009, F061, F089: the hazard of an onset falls with time since the last run; still runs are a two-exponential
      mixture (long component 152–665 s) and heavy-tailed within each ant (Lomax shape 0.87–1.06). Pooled or per
      still run at the 0.6 mm-frame scale, not bout-scale intervals, and never conditioned on complete contact
      histories.
    - Nothing in the record measures I3 after a contact, a per-ant characteristic interval at the bout scale, or
      whether complete contact histories exist over whole intervals.
  - **Definitions (reused where they exist):**
    - **Moving / onset:** as H6 (D241, implementation details): a step of at least 0.6 mm per frame from the last
      detection at most 3 frames back; an onset after at least 20 still frames.
    - **Sustained onset (P24):** a one-frame position excursion (a misread) can split a rest and register an onset, and
      a partner arriving within reach may make such misreads likelier, which would look like a contact-associated
      advance. An onset ends an inactive interval only if the ant's position 2 s (4 frames) later is at least 1 mm from
      its last still position **[confirm]**; excursions that fail this are counted, split by whether a partner was
      within 4.1 mm, and the still run continues. Sensitivity: the plain onset definition. This counts excursions inside
      T060's intervals only; P24's audit of still-run survival stays with T053.
    - **Inactive interval:** a still run of at least 60 s **[confirm]** (it selects the long component of F061's
      mixture; Cole's intervals are tens of minutes). Sensitivities 10 s (the onset definition) and 300 s. The bout is
      everything between two consecutive inactive intervals, short pauses included. I is the still run's length; it
      ends at the onset.
    - **Focal tracking:** inside an inactive interval, a detection gap longer than 3 frames is bridged as still if it
      lasts at most 30 s and the displacement across it is under 1 mm **[confirm]**; otherwise the interval is
      incomplete. Inside a bout, gaps of up to 10 s are allowed **[confirm]**, so that a hidden inactive interval cannot
      sit in it. An interval or bout that leaves the nest (a forager in the arena) is incomplete.
    - **Qualifying contact:** the Test B contact (a partner coming from far to near at 4.1 mm) with a partner that is
      moving while the focal ant is still (D241). **Near approach:** a moving partner reaching 4.1–8 mm without
      contact **[confirm]**.
    - **Complete event history:** an interval with no **blind contact opportunity**. Another ant j undetected from t1
      to t2 (last and next positions p1, p2; the focal at q) is one if |p1 − q| + |q − p2| − 2 × 4.1 mm ≤ v (t2 − t1),
      v = 10 mm/s (D241's travel speed), i.e. j could have reached the focal unseen. This replaces H6's fixed
      25 mm / 2 s rule, which over intervals of minutes would leave almost nothing (a forecast, not a measurement).
      An ant not detected at all during a triplet's span is not covered; the number of such ants is reported.
    - **Triplet:** three consecutive complete inactive intervals I1, I2, I3 of one ant, with complete bouts between
      them; no qualifying contact in I1 or I3; exactly one in I2 (Cole), at elapsed time B into I2, with A from the
      contact to the onset ending I2. **Reference triplet:** the same, except that I2 has no qualifying contact and has
      one near approach at elapsed time B.
    - **Zones:** H6's low- and high-forager-visit zones (D241 amendment 1), from the same code.
  - **Stage 0, identifiability (the first decision; P135).** Two conditions, both needed:
    - **0a, support:** at least 15 of the 22 colonies each with at least 20 contact triplets that have at least one
      matched reference triplet **[confirm]**. Otherwise **not identifiable (support)**.
    - **0b, a characteristic interval:** Cole's three outcomes differ only if the ant carries a phase. In a memoryless
      ant, a contact that leaves no lasting effect also gives I1 = I3, so "unchanged" would not mean "reset". Statistic
      CV̄: per ant, the CV of its complete contact-free inactive intervals (ants with at least 8); per colony, the median
      over ants; CV̄ the mean over colonies, equally weighted. **Memoryless reference:** each ant's onset times replaced
      by an exponential renewal process at that ant's own mean rate, laid over the real tracks, so the real contacts,
      detection and blind opportunities decide completeness and contact-freeness exactly as for the data (1,000
      draws). Selecting complete, contact-free intervals favours short ones and truncates the tail, which lowers a CV
      by itself; the reference undergoes the same selection. **Regular** if CV̄ is below the reference's 2.5th
      percentile and the upper bound of its 2,000-draw colony-bootstrap 95 % interval is below 0.75 **[confirm]**.
      Otherwise **not identifiable (no characteristic interval)**.
    - Reported whatever the outcome: counts of intervals, complete intervals and triplets by role, zone and activity
      context, with the incomplete fractions and their causes (focal gaps, blind opportunities, exits), for contact
      and reference triplets alike (the symmetry D242 asked of H6).
    - **What the record suggests (a forecast from existing findings, not a reading):** F089's within-ant tail and
      F009's falling hazard point to no characteristic interval at the still-run scale. Bout-scale intervals of at
      least 60 s are a different object and may differ, which is why 0b is measured rather than assumed. F062 points to
      no advance once rest age is controlled (below).
  - **Stage 1, the three-interval comparison (read only if Stage 0 says identifiable).**
    - **Matching:** each contact triplet is matched to up to 5 reference triplets of the same colony, drawn at random
      among those with the same role, zone of I2, 4-h light block (06–10, 10–14, 14–18 UTC; F108), I1 quintile, B
      quintile (rest age, F062), and colony moving-fraction tertile and 1-min slope class (falling, flat, rising) at
      the contact (H6's S1 classes). The near approach makes the reference control for a moving ant arriving close
      by (local activity, vibration, an unseen common input at that spot) without contact. Unmatched triplets are
      counted and excluded.
    - **Precondition, the advance (Cole's Fig. 2):** ΔA, the colony-mean (equally weighted) of mean log A in contact
      triplets minus mean log A in their matched references. **Advance present** if the upper bound of its 2,000-draw
      colony-bootstrap 95 % interval is below 0. Otherwise the reading is **unresolved: no contact-associated advance
      beyond the near-approach reference**, and Δ3 is reported without a label.
    - **The single primary decision statistic, Δ3:** per triplet log(I3 / I1); per colony, mean over contact triplets
      minus the mean over their matched references; Δ3 the mean over colonies, equally weighted. Intervals from the
      same 2,000-draw colony bootstrap. Equivalence margin δ = 0.2 on the log scale (about ±22 %) **[confirm]**.
      With the advance present:
      - **consistent with a phase reset** if the 90 % interval lies inside (−δ, +δ) (two one-sided tests, so
        "unchanged" is shown, not inferred from a non-significant difference as in Cole);
      - otherwise **consistent with transient stimulation** if the 95 % interval lies above 0 (Cole's I1 < I3);
      - otherwise **consistent with a shortened period** if it lies below 0 (I1 > I3);
      - otherwise **unresolved**.
      These labels, with Stage 0's, are the only decision labels.
    - **Descriptive, with 95 % intervals and no labels:** the phase-response curve, A against B with B standardised by
      the ant's median contact-free interval (Cole's Fig. 2), contact versus reference; ΔA and Δ3 against a
      reference with no approach at all (pseudo-time only), which separates contact from proximity; ΔA and Δ3 by role,
      zone and partner role; the focal ant's sub-threshold movement in the 30 s before the contact against the
      reference at the same B (F019's prior elevation).
    - **Sensitivities, frozen and all reported; none selected:** inactive interval 10 s and 300 s; at least one
      contact in I2, B taken at the first; partners still or moving; v = 20 mm/s in the blind-opportunity rule; δ 0.1
      and 0.3; queen included; the plain onset definition. A disagreement with the primary is reported as a disagreement and cannot overturn it.
  - **Observation problems, and how each is handled:**
    - **Missed contacts:** the blind-opportunity rule, applied identically to contact triplets, reference triplets and
      Stage 0's intervals; unknown fractions reported by role, zone and context.
    - **Tracking gaps:** the bridging rules above; their sensitivity to v is reported.
    - **Misreads near partners:** the sustained-onset rule, with excursion counts near and away from partners
      reported, and the plain definition as a sensitivity.
    - **Selection by completeness and contact-freeness** (it favours short I1 and I3 and long I2): the references pass
      through the same selection, and the matching holds I1 and B fixed.
    - **Slow per-ant and colony states** (F006, F019; an ant entering an active phase may both shorten its intervals
      and meet more moving ants): matching on I1, colony activity level and slope, light block; the prior-elevation
      descriptive. A state of the ant itself that the tracks do not show is not removed.
    - **Spatially varying common inputs:** matching on zone and the near-approach reference. A local input that
      reaches a contacted ant and not a near-approached one is not excluded.
    - **Trends over the light phase** (F108): matching within 4-h blocks.
  - **Outcomes that remain unresolved whatever the result:**
    - **H2 against H3 (P136):** a slow individual oscillator and excitable activation with refractory recovery both
      reset phase at an onset; neither Δ3 nor the phase-response curve separates them here, and no reviewed study sets
      up that contrast in data of this kind. It stays unresolved; the descriptives are not read for it.
    - **Causation (P137):** every label is "consistent with". The contact is observed, not assigned: an onset that
      a contact precedes may be one already under way, or a response to something unobserved.
    - **Transient against period change, partly:** how a transient stimulation shows in I3 depends on whether the
      onset the undisturbed oscillation had scheduled just after the induced bout is expressed or absorbed. Fig. 3
      draws it absorbed (I1 < I3); expressed, the next interval is a short remainder, which reads as a shortened
      period. V4b below shows which reading the pipeline gives; if it gives "shortened period", that label is
      reported as "a shortened period or an expressed transient".
    - Whether any of this explains the 10-min co-variation deficit (C1): it needs modelling (item 1(e)).
    - Transfer: Cole's ants cycle with a period of about 0.5 h; periodicity in ours is unresolved (F012, P80).
  - **Validation before any empirical reading (as D242 point 5 for H6).** Synthetic data are built on the real
    colonies' tracks: the focal ants' positions, the partners' positions and movement, and the detection are real; the
    focal ants' inactive and bout timings are replaced by a generative rule with a known answer, so qualifying
    contacts are real partners arriving while the synthetic focal is still. (The focal's real movement during a
    synthetic still interval is ignored; this is the approximation.) 200 data sets per case, the full pipeline
    (completeness, matching, references, support rules, reader) unchanged:
    - **V0, Stage 0:** (a) exponential renewal, contacts without effect: "regular" fires in at most 5 %; (b) Lomax
      renewal, shape 1 (F089's tail): "regular" at most 5 %; (c) gamma renewal with CV 0.3 (Cole's isolated ants):
      "regular" at least 80 %.
    - **V1, null:** gamma CV 0.3, contacts without effect. Any Stage 1 decision label in at most 5 %.
    - **V2, phase reset:** gamma CV 0.3; a qualifying contact at standardised phase φ = B / τ ends the interval after
      A = τ · [0.01 · (φ + 0.02)^−1.16 − 0.02] (Cole's fitted curve, with his 0.02 added to both intervals; floored at 0
      and capped at the time remaining), and the next interval is
      drawn as usual. "Consistent with a phase reset" in at least 80 %.
    - **V3, shortened period:** as V2, and the ant's mean interval is 30 % shorter for the next interval. "Shortened
      period" in at least 80 %.
    - **V4a, transient, absorbed (Fig. 3):** a contact induces a bout; the underlying schedule is kept and its next
      scheduled onset is absorbed. "Transient" in at least 80 %. **V4b, transient, expressed:** the same, with that
      onset expressed. Reported; no acceptance rule.
    - **V5, missing observations:** V1 and V2 after deleting a further 10 % of detections, twice as often in the H zone
      as in L, before everything is rebuilt. V1's labels in at most 5 %; V2's in at least 70 %.
    - **V6, local common input, no contact effect:** gamma CV 0.3 with each ant's rate multiplied by (1 + k · the
      number of moving ants within 10 mm, averaged over 60 s), k set so the rate doubles at the 90th percentile of that
      count **[confirm]**. Any decision label in at most 5 %. This is the check that the near-approach reference does
      its job; if it fails, the comparison is not identifiable against local inputs, and that is the result.
    - **Reproduction:** Test B's onset counts (as D241) and F009's nurse hazard endpoints (3.86 and 0.16 /min) within
      rounding, with the plain onset definition, before anything else is printed.
  - **Order and blinding:** after approval, the implementer builds the pipeline from a brief (D208), reusing H6's
    onset, contact, coverage and zone code once that is built and checked (T059, under way), and runs the
    reproduction and a smoke of V0–V6. The full checks run as a lead's long run. The reader is frozen by its SHA-256 in
    this entry before any empirical statistic is computed; until then the empirical outputs' path `logs/t060/` is
    sealed (added to `.claude/sealed-paths.txt` on approval). Stage 0 is read first; Stage 1's outputs are not
    computed unless Stage 0 says identifiable. If an acceptance rule fails, or a check needs a substantive design
    change, nothing empirical is read and the user decides.
  - **Not in scope:** no simulation of the model or the Stage 2b arms; no model change (P103); no choice of 1(e)'s
    mechanism.
  - **Cost:** a data-side script; minutes per pass over the 22 colonies; V0–V6 at 200 data sets each are hours on the
    local pool, run as one long run. No box.
  - **For the user:** approve, amend or reject; in particular the 60-s inactive interval, the bridging rules, the
    near-approach band, the sustained-onset rule, the support and regularity thresholds (0a, 0b), δ, V6's k, the queen, and whether Stage 1 is
    built now or only after Stage 0 has passed. The lead's recommendation: build and run Stage 0 with V0 first,
    since the record suggests it may fail, and build Stage 1 (fixed now) only if Stage 0 says identifiable.
  - **2026-11-02 ≈ 03:35 UTC — amendment 1 (D244, the user's answer to Q32; approved with amendments).** Where this
    differs from the text above, it governs. Details are fixed by the lead to implement the user's points; the user's
    words are in D244. The 60-s inactive interval, the queen's exclusion and the sustained-onset check stand. **Now:**
    Stage 0 only (extraction, matching, V0 checks). **Stage 1 is deferred:** nothing of it is built; its design below
    is kept, amended, for a later decision.
    - **Point 1, complete histories (lead).**
      - **Terms:** "contact" throughout means a **proximity-defined contact (PDC)**, a moving partner crossing to
        within 4.1 mm while the focal ant is still; touches are unverified. A near approach is a
        **proximity-defined near approach** (4.1–8 mm, no PDC).
      - **Focal ant:** in the primary, no gap beyond the onset definition's own tolerance (3 frames, 1.5 s) is
        allowed anywhere in an interval or in the bouts between a triplet's intervals; a longer gap makes the history
        **unknown**. The 30-s / 1-mm bridging is a sensitivity only.
      - **Partners:** every ant on the colony's list counts. A partner gap inside or overlapping the span is bounded
        only if it is bracketed by detections on both sides within the light phase; then the blind-opportunity rule
        applies, with **v = 20 mm/s in the primary** and 10 mm/s as a sensitivity. An unbracketed gap, or an ant not
        detected at all over the span, makes the history **unknown**, unless permitted metadata independently show
        the ant absent (for example, dead before the span); without such metadata it stays unknown. Counts of
        unknowns are reported by cause; they never make a history complete.
      - **Check on the speed bound, printed with the reproduction:** the share of in-nest detected steps faster than
        20 mm/s. If it exceeds 0.1 %, the bound is not independent of the data and the user decides before anything
        else is read.
    - **Point 2, validation in two separate scopes (lead).**
      - **Scope A, the event-table reader:** fully synthetic event tables (onsets, bouts, PDC times, completeness
        flags), with no real tracks. It tests Stage 0b's estimator, the support rule, the matching and the reader, and
        nothing upstream of the event table. Frozen settings: 22 colonies with the real colonies' numbers of ants
        (metadata only); per-ant excess scales log-uniform on 120–1,200 s; bout durations lognormal, median 20 s,
        log-SD 1; PDCs a Poisson process at 1 per 10 min of stillness; loss of complete history at 1 per 20 min;
        each run started after a 2-h burn-in, discarded; 200 data sets per case.
      - **Scope B, the extraction pipeline:** coherent synthetic tracks with an observation model, so that activity
        and position agree. Still ants sit at sites drawn uniformly over the nest area, at least 2 mm apart, with
        positional jitter SD 0.1 mm. Moving bouts are correlated random walks at 5 mm/s inside the nest, with the
        bout durations above, ending at a new still site. Timings come from the V0 generators, with the same scales
        and burn-in. Detection is a two-state Markov chain per ant, 92.7 % detected, mean gap 2 s. One-frame misread
        excursions of 1–3 mm occur at 1 per 1,000 frames, five times as often within 4.1 mm of a partner. Real
        colonies supply only the numbers of ants and the nest dimensions. The pipeline (onsets, sustained-onset rule,
        PDCs, completeness, intervals, censoring) runs unchanged and is scored against the generated truth.
      - Scope B cannot show how often contacts are hidden in the real data; it shows whether the extraction
        recovers what was generated under these settings.
    - **Point 3, Stage 0b specified (lead).** It replaces the CV statistic and its simulated memoryless reference.
      - **The object:** each inactive interval's excess E = I − 60 s, as a survival time. It is censored at the first
        PDC (beyond that point it is no longer contact-free), at the loss of complete history, and at the end of the
        light phase. The 60-s threshold is the entry time of every interval, so there is no truncation beyond it.
        Contact-free "selection" thus becomes censoring, and a memoryless ant is exactly a constant hazard in E (an
        exponential, Weibull shape k = 1).
      - **The estimator:** per colony, a censored Weibull likelihood with **one shared shape k_c** and a separate
        scale for each ant × 4-h light block (F108), fitted by maximum likelihood on the intervals of **the ants that
        supply the matched contact triplets**, each such ant's intervals weighted by its share of the colony's
        matched contact triplets. The rate of the exponential reference is the same likelihood with k fixed at 1; no
        simulated reference is needed. Colonies enter with at least 10 such ants and at least 100 uncensored
        intervals among them.
      - **The statistic:** k̄ = exp(mean over colonies of log k_c), colonies equally weighted, with a 2,000-draw
        colony-bootstrap 95 % interval.
      - **The reading:** a characteristic interval is **established for this comparison** if the interval's lower
        bound exceeds 1.5 (a hazard rising with time already spent still, beyond memoryless and beyond the falling
        hazards of F009 and F089). Otherwise the label is **a characteristic interval was not established for this
        comparison**. That label never says that the ants have no such interval.
      - **Reported beside it:** the same fit on the ants that supply the matched references; the fit with PDCs not
        censoring; and k_c by colony. Censoring is assumed independent of the ant's timing state given ant and block.
        That cannot be checked here and is stated with the result.
      - **0a's support rule stands,** counted on PDC triplets. Stage 0 says **identifiable** only if 0a and 0b
        both pass.
    - **V0, by scope (acceptance fixed now):**
      - **Scope A:**
        - (a) exponential excess (k = 1): "established" in at most 5 %;
        - (b) Lomax excess, shape 1: at most 5 %;
        - (c) Weibull excess, k = 3: at least 80 %;
        - (d) exponential excess with each ant's rate multiplied by a slow lognormal state (log-SD 0.5, τ 10 min):
          at most 5 %.
      - **Scope B, extraction:**
        - among intervals the pipeline marks complete and contact-free, at most 1 % contain a generated PDC that went
          unobserved;
        - at least 95 % of completed interval lengths are recovered within 2 frames;
        - at most 1 % of accepted onsets come from misread excursions.
      - **Scope B, end to end** (V0 (a) and (c), 50 data sets each): "established" in at most 3 of 50 and in at
        least 40 of 50.
      - **Reproduction:** as above (Test B's onset counts and F009's nurse hazard endpoints, plain onset definition),
        with the speed-bound check.
    - **Point 4, Stage 1's labels narrowed (deferred with Stage 1).** Δ3's three labels become:
      - **contact-associated advance with equivalent subsequent interval change relative to references** (90 %
        interval inside ±δ);
      - **with a longer subsequent interval change than references** (95 % interval above 0);
      - **with a shorter subsequent interval change than references** (95 % interval below 0);
      - otherwise **unresolved**.
      "Phase reset", "transient stimulation" and "shortened period" are not used as labels. The contact triplets' own
      mean log(I3 / I1) is reported as a descriptive with its interval, never as "unchanged". V6 stays a fixed
      stress test. H2 versus H3 stays unresolved (P136).
    - **Point 5, reader conventions (lead).**
      - **Time resolution:** all durations are whole frames (0.5 s). A is at least 1 frame by construction, since a
        PDC needs the focal still and the onset is a later frame; V2's generator floors A at 1 frame. Logs are taken
        in frames.
      - **Reference reuse and weighting:** matching is without replacement. Contact triplets are taken in a random
        order fixed by seed, each with up to 5 references. A reference shares no interval with its contact triplet
        and is never reused. Each contact triplet contributes the paired difference from its references' equal-weight
        mean; colonies are equally weighted; the bootstrap resamples colonies and keeps the matches fixed.
      - **Matching bins:**
        - I1 and B quintiles: per colony, from the pooled complete triplets with a PDC or a near approach in I2, fixed
          before matching.
        - Activity tertiles: the colony's 1-min moving fraction over its light phase.
        - Slope class: H6's frozen S1 definition. If H6's code leaves it open, the change between consecutive 1-min
          bins, split at the colony's 33rd and 67th percentiles.
        - Zone: the focal's position at I2's start.
      - **Sustained-onset check with missing detections:** the position 2 s after the onset is taken from frame +4,
        or else the nearest detection in frames +3 to +6. With none, the onset's status is unknown and so is the
        history of the interval it ends.
    - **Outputs and blinding:** Stage 0's empirical outputs go to `logs/t060/`, sealed from now
      (`.claude/sealed-paths.txt`) until the reader is frozen by its SHA-256 in this entry and V0 and the
      reproduction pass. Synthetic outputs go to `logs/t060-synthetic/`, which is not sealed.
  - **2026-11-03 ≈ 01:04 UTC — Stage 0 build: the lead's implementation details (amendment 1 point 5 and D244's "details
    are fixed by the lead"; nothing built or computed yet).** They fill gaps in amendment 1; none changes it.
    - **Order:** two implementer briefs (D214, one stage each). Brief 1: the event-table reader (matching, 0a, 0b,
      bootstrap, labels) and Scope A, with a smoke of 3 synthetic data sets per case. Brief 2: the extraction from
      tracks, Scope B, the reproduction and the speed-bound check (its details are fixed in a later dated line before
      it is written). Then V0 in full as a lead's long run, the reader frozen (P172), and only then Stage 0's
      empirical outputs. Code in `scripts/scratch/t060/` (scratch until frozen, as H6). Synthetic outputs in
      `logs/t060-synthetic/`.
    - **Light phase and entry:** one light phase per colony, 06–18 UTC. An inactive interval counts only if its first
      still frame is at or after 06:00; at 18:00 it is censored (0b) and excluded from triplets.
    - **Event table** (the interface between extraction and reader), per colony: the ants (nurses and foragers) with
      role and zone; per ant its inactive intervals in order, each with first still frame, onset frame (or censored),
      PDC frames, near-approach frames, the frame its history becomes unknown (if it does) and why (focal gap, partner
      blind opportunity, unbracketed or unseen partner, exit, unknown sustained-onset status); per bout between
      consecutive intervals, whether its history is complete; the colony's 10-frame moving-fraction bins.
    - **Near approach:** a moving partner, the focal still, entering 8 mm from farther; the approach lasts until the pair
      is beyond 9 mm again (1 mm hysteresis, as the PDC's 4.1 / 5.1 mm); it is a near approach if no PDC with that
      partner occurs during it; its frame is the entry into 8 mm.
    - **Triplets:** I1, I2, I3 consecutive inactive intervals of one ant (no other inactive interval between them), each
      ending in an observed onset, none with an unknown history, and both bouts between them complete. Contact
      triplet: no PDC in I1 or I3, exactly one in I2 (near approaches allowed). Reference triplet: no PDC in I1, I2 or
      I3 and exactly one near approach in I2. B = frames from I2's first still frame to the PDC (or near approach);
      A = frames from it to I2's onset (≥ 1 by construction).
    - **Matching cell:** role; zone of I2 (H6's zones, `buildZones` on H6's frozen intermediates, at the focal's position
      at I2's first still frame; an unassigned cell is its own category); 4-h block of the PDC or near-approach frame;
      I1 quintile and B quintile (per colony, from the pooled complete contact and reference triplets, fixed before
      matching); activity level tertile and slope class from H6's frozen `context()` (reader.ts lines 394–416) at that
      frame (a frame without context leaves the triplet unmatched). Matching as amendment 1 point 5, seed fixed.
    - **0a:** a colony counts if at least 20 of its contact triplets have at least one matched reference; 0a passes
      with at least 15 such colonies.
    - **0b's likelihood:** an interval enters at 60 s (120 frames) if those frames hold no PDC and no unknown history;
      E (frames) ends at the onset or is censored at the first PDC after entry, the history becoming unknown, or 18:00.
      Per colony, the weighted log-likelihood Σ_a w_a ℓ_a, w_a the ant's share of the colony's matched contact
      triplets; within an ant × block cell the scale's MLE given k is (Σ E^k / d)^(1/k), so k_c maximises the profile
      over k in [0.05, 20]; cells with no uncensored interval drop out (their profile term is 0). The block is that of
      the entry frame.
    - **0b's support (a reader edge case, P161):** besides each colony's entry rule (≥ 10 supplying ants, ≥ 100
      uncensored intervals among them), k̄ is computed only with at least 15 entering colonies (as 0a and H6's
      `MIN_COLONIES`); otherwise the label is "not established" with the reason "support". The bootstrap resamples the
      entering colonies' k_c.
    - **Scope A generator (frozen settings of amendment 1, and these):** per colony the real numbers of nurses and
      foragers (`roles()`); each ant's zone L or H with probability ½, fixed; simulated from 04:00 (2-h burn-in) to
      18:00 UTC; interval = 60 s + E, E from the case's law at the ant's scale s (log-uniform 120–1,200 s): (a)
      exponential, mean s; (b) Lomax, shape 1, scale s; (c) Weibull, k = 3, scale s; (d) exponential with hazard
      exp(X_t)/s, X a stationary Ornstein–Uhlenbeck process (SD 0.5, τ 10 min), piecewise constant per second. Bouts
      lognormal (median 20 s, log-SD 1). Durations in whole frames, at least 1. PDCs and near approaches independent
      Poisson processes during stillness, each 1 per 10 min (a near approach to 8 mm without reaching 4.1 mm is about
      as frequent as a PDC if arrivals scale with the radius, 8 / 4.1 − 1 ≈ 0.95), with no effect on timing. Loss of
      complete history 1 per 20 min at any time, making the interval or bout it falls in unknown from that frame. The
      moving-fraction bins from the synthetic ants' bouts. Streams `RNG.stream(seed, case, data set, colony, ant, purpose)`.
  - **2026-11-03 ≈ 02:22 UTC — amendment 2 (D262, the user's answer to Q36 on D261).** Where this differs from the
    text above, it governs; the lead fixes the details.
    - **0b's memoryless reference (replaces the reading's statistic, keeps its threshold):** for each colony entering
      0b, the primary fit's ants, weights and ant × block cells are refitted with k fixed at 1 (rates λ = d / ΣE per
      cell). Each of 1,000 draws keeps every interval's entry and redraws its excess as exponential at its cell's λ,
      observed up to a censoring time: an interval censored in the data keeps its censoring time; for one that ended in
      an onset at E, a censoring time is drawn from the colony's censoring distribution (reverse Kaplan–Meier over the
      fit's intervals, censorings as events, weighted as the fit) conditional on exceeding E, and none if that
      distribution's mass beyond E is spent (Efron's conditional scheme for censored data). Each draw is fitted exactly
      as the data; k̄* = exp(mean over colonies of log k_c*); m0 = the median of the 1,000 k̄*. **The reading:** "a
      characteristic interval established for this comparison" if the lower bound of the 2,000-draw colony-bootstrap
      95 % interval of k̄, divided by m0, exceeds 1.5; otherwise "a characteristic interval was not established for
      this comparison". Reported beside it: k̄, m0, the reference's 2.5th and 97.5th percentiles, k̄ / m0 with its
      interval, and `dPerCell` by colony. The same reference is applied to the two descriptive fits (reference-supplying
      ants; PDCs not censoring), reported without labels.
    - **V0, Scope A, two cases added (acceptance fixed now):**
      - **(b2)** Weibull excess, k = 0.7, scale s, everything else as case (a): "established" in at most 5 %.
      - **(a-sparse)** case (a)'s law with fewer intervals per cell, read by 0b alone: in Scope A, sparse cells and
        enough matched triplets cannot be had together (fewer complete intervals mean fewer triplets, so 0b's support
        rule would end the case before the estimator, as in case (b)). So 0b's fit and reference run directly on
        synthetic cells: 22 colonies with the real numbers of nurses and foragers, every ant weighted equally, 3 blocks
        per ant; per ant × block, 1 + Poisson(3) entering intervals, each excess exponential at the ant's scale s
        (log-uniform 120–1,200 s) and censored at an independent exponential time with mean s (about half censored).
        The colony entry rule (≥ 10 ants, ≥ 100 uncensored intervals) and the 15-colony support rule apply.
        "Established" in at most 5 % of 200 data sets. Its companion (c-sparse), the same with a Weibull k = 3 excess,
        is reported without an acceptance rule (how much the sparse cells cost).
      - **(b)** is kept; its result is reported as passing by support, not by the estimator.
  - **2026-11-03 ≈ 06:51 UTC — Stage 0 build, brief 2: the lead's details for the extraction from tracks, Scope B, the
    reproduction and the speed-bound check (promised by the ≈ 01:04 block; nothing built or computed yet).** They fill
    gaps in amendments 1 and 2; none changes a threshold, a label or an acceptance rule. Where an item below makes fewer
    histories complete than a plainer reading would, that is deliberate (P153).
    - **The colony's list** (amendment 1 point 1, "every ant on the colony's list counts"): every tag in the colony's
      PreTreatment tag file, whatever its final status, the queen included as a partner. Focal ants are the nurses and
      foragers of `roles()`; the queen is never focal.
    - **Metadata that show a tag absent** (point 1, "for example, dead before the span"): the tag file's `death`
      frame, the authors' record on the tracking clock. A tag is absent from that frame on if it has no read at or
      after it in the PreTreatment file. A tag read after its recorded death keeps no death record (counted). Nothing
      else shows absence: `last_det` and `count` come from the tracking itself and `final_status` is an end-of-experiment
      state. Lost tags and both tags of the retagged ant (`retagged_ants.txt`) count as unseen ants unless read. How the
      authors recorded deaths is not known; that is stated with the result, and the histories made unknown by unseen tags
      are counted with and without the death record.
    - **Blind frames** (point 1's blind-opportunity rule, made exact for the PDC detector). A PDC is ContactOnset's
      crossing, which registers only on a frame where both ants are read in the nest with step codes from consecutive
      frames. So a crossing is hidden by the focal's own short gaps as surely as by a partner's. Within a span (an
      interval from its first still frame to its onset, or to 18:00), the blind frames of a pair (focal i, partner j)
      are the frames where:
      - j is unread, or i is unread;
      - either ant's read follows an unread frame (code 3);
      - j's read is outside the nest;
      - i makes a moving step that the sustained-onset rule absorbs (below).

      A run of blind frames is a **blind contact opportunity** in three cases:
      - (i) j is read on a frame of the run within 4.1 mm of the focal's still position q;
      - (ii) j has unread frames in the run, and D252's `reachable` (frozen `extract.ts`) holds for them. It uses j's
        bracketing reads (its last read before them and its first after, any read in or out of the nest), r = 4.1 mm,
        v = 20 mm/s (10 mm/s as a sensitivity), and the span as the window;
      - (iii) j's unread run is not bracketed by reads within the light phase.

      q is the focal's last read at or before the run's first frame. The history becomes unknown from the earliest frame
      at which a hidden PDC could have occurred: in (i) and (iii) the run's first frame, in (ii) the floor of
      `reachable`'s a; never before the span's start. The cause is `partnerBlind` in (i) and (ii) and
      `partnerUnbracketed` in (iii).
    - **Near approaches** are counted as observed. A near approach that might have been missed does not make a history
      unknown: the design defines completeness by PDCs.
    - **Intervals and bouts** (the ≈ 01:04 block, made exact). Steps follow the onset step rule (H6).
      - **Start:** a still run starts at the read that ends a moving step (diagShort's `start`). A run whose start
        follows a break (an unread run of more than 3 frames, an out-of-nest read, or the recording's start) is not
        recorded, and the bout around it is incomplete.
      - **Onset candidate:** a moving step after at least 20 still frames (the plain onset).
      - **Sustained-onset rule:** a candidate is accepted if the focal's position at frame +4 (else its nearest read in
        +3 … +6) is at least 1 mm from its last still position (the read before the step). Otherwise it is an
        **absorbed excursion**: the still run continues; every moving step in frames +1 … +6 belongs to the same
        excursion; and the reference position stays the one before it, so the step back from a misread is never a
        candidate. If there is no read in +3 … +6, the onset status is unknown: the interval is unknown from the
        candidate's frame (cause `onsetStatus`) and the next bout is incomplete.
      - **Inactive interval:** a still run that reaches 120 frames. Its onset frame is the accepted candidate's.
      - **A break inside an interval** makes it unknown from the first unread frame (`focalGap`) or from the
        out-of-nest read (`exit`), with no onset.
      - **A complete bout:** the onset was accepted, and the focal is read in the nest, with no unread run of more than
        3 frames, from the onset to the next interval's start.
      - **An interval with no observed onset followed by a later interval** is allowed when its history is unknown;
        the bout between them is then incomplete. `validateColony` (events.ts) is relaxed to allow exactly this, and
        Scope A's outputs must stay byte-identical.
    - **Zones and bins:** the zone grid and the 10-frame moving-fraction bins are built in the same pass, as H6Pass1
      builds them (nurses' and foragers' light-phase in-nest reads; StepRule). Zones come from H6's frozen
      `buildZones`. The reproduction checks that both equal H6's frozen intermediates.
    - **Sensitivities extracted:** v = 10 mm/s; focal bridging (P154: a focal unread run inside an interval of at most
      60 frames, with less than 1 mm displacement across it, is still and known, and its frames are blind for every
      pair); the plain onset definition; no death record. All are reported; none is selected and none is labelled. The
      10-s and 300-s interval sensitivities belong to Stage 1 and are not built.
    - **Reproduction** (printed first, and nothing else from the tracks):
      - per colony: the light-phase plain onsets of nurses and foragers equal OnsetStats'; the PDCs between ants of
        `roles()` equal ContactOnset's contacts, frame by frame; ContactOnset's Test B onset counts from the same pass
        equal `logs/contacts/tb-c<i>.json`; the grid and bins equal H6's;
      - pooled: F009's nurse hazard by time since the last moving run, from the pass's bounded still runs (diagShort's
        convention, with cbAgg's bins and pooling). The 10–20 s and > 640 s bins must round to 3.86 and 0.16 /min; the
        other bins, and the foragers', are printed beside cbAgg's values on the original files.
    - **Speed-bound check** (P165), printed with the reproduction: light phase, every tag, steps by the step rule (two
      in-nest reads at most 3 frames apart), speed = displacement / (gap × 0.5 s). The rule's share is the share above
      20 mm/s of all such steps; the share among moving steps is printed beside it. If either exceeds 0.1 %, nothing else
      is read and the user decides.
    - **Scope B generator** (amendment 1 point 2's frozen settings, and these, frozen now as P156 asks):
      - **Nest:** the bounding rectangle of the colony's H6 grid cells with at least 600 detection-frames (its
        dimensions only).
      - **Ants:** the real numbers of nurses and foragers, no queen, no exits. Every ant is still at 04:00, starting an
        interval.
      - **Timing:** a still interval lasts 60 s + E, with Scope A's excess laws and per-ant scales (`excessSampler`).
        Bouts are lognormal (median 20 s, log-SD 1). Durations are whole frames, at least 1.
      - **Still sites:** uniform over the rectangle, redrawn until at least 2 mm from every still ant's site. A still
        ant's true position is its site + iid N(0, 0.1²) mm per axis per frame.
      - **Moving:** 2.5 mm per frame (5 mm/s); per-frame heading change N(0, 0.3²) rad; uniform initial heading;
        specular reflection at the walls. At the bout's drawn end, the walk goes on frame by frame while it is within
        2 mm of a still ant's site.
      - **Detection:** per ant, a two-state Markov chain (undetected → detected 0.25 per frame, detected → undetected
        0.25 × 0.073 / 0.927 per frame, so 92.7 % detected with a mean gap of 2 s), started from its stationary
        distribution.
      - **Misreads:** on a detected frame, with probability 1/1,000 (5/1,000 when another ant's true position is within
        4.1 mm), the read is displaced by U(1, 3) mm in a uniform direction.
      - **Reads and time:** all reads are in the nest; t = f / 2 s, frame 0 at 00:00 UTC.
      - **Truth:** intervals, onsets, misread frames, and PDCs from true positions and states (the 4.1 / 5.1 mm
        crossing, the partner truly moving, the focal truly still).
      - **Randomness:** streams `RNG.stream(SEED, scope B, case, data set, colony, ant, purpose)`.
    - **Scope B scoring,** pooled over a case's data sets and reported per case:
      - (1) among pipeline intervals with an accepted onset, no unknown frame and no observed PDC, the share whose
        [start, onset) holds a true PDC (at most 1 %);
      - (2) among pipeline intervals with an accepted onset and no unknown frame, the share whose length is within 2
        frames of the length of the true still interval containing its start (at least 95 %);
      - (3) the share of accepted onsets at which the ant is truly still (at most 1 %). It counts onsets from misreads
        and from jitter alike;
      - (4) end to end: cases (a) and (c), 50 data sets each, with the reader unchanged;
      - also reported, without a rule: the share of entering intervals whose known, PDC-free stretch (0b's
        uncensored part) holds a true PDC.
    - **Blinding:** the extraction writes event tables only where `--out` says. The implementer never runs it on real
      tracks except in its reproduction mode, which builds the tables in memory and prints and writes only the values
      above. Real event tables are built by the lead, into the sealed folder, after the freeze (P164).
  - **2026-11-03 ≈ 15:18 UTC — the support-only audit (D266, the user's answer to Q37): the lead's details (nothing built
    or run yet).** Scope B's acceptance is waived for this reading only (D266); everything else above stands.
    - **What runs:** the extraction as checked in D265 (`extract.ts`, the primary and the four sensitivities), per
      colony, in memory, its tables passed straight to a new **restricted support reader** (`support.ts`). Only the
      support reader's output is written, to `logs/t060-support/` (not sealed). **No event table is written:** a
      support reading does not need one, and none then exists on disk to be read beyond support. This replaces "Real
      event tables are built by the lead, into the sealed folder" for this audit; the sealed Stage 0 output folder
      (amendment 1) stays sealed and empty. A reading beyond support would need the user's decision and a fresh
      extraction (about 45 min).
    - **What the support reader outputs, and nothing else** (per colony, for the primary and for each sensitivity):
      - inactive intervals recorded; of them, those ending in an observed onset and those with no unknown frame; by
        role and by zone (L, H, unassigned);
      - histories made unknown, by cause (`CAUSES`) and role; intervals unknown only by unseen tags, with and without
        the death record; the tags on the list and those unseen in the light phase (the extraction's own counts);
      - bouts complete, and incomplete by cause;
      - contact and reference triplets (the 01:04 block); contact triplets with at least one matched reference
        (matching exactly as the reader's, seed and keys as for real data); whether the colony counts for 0a;
      - 0b's entry: the supplying ants and the uncensored intervals among them, and whether the colony enters;
      - pooled: the colonies counting for 0a (of 22) and entering 0b, and, for the primary only, **support retained by
        the frozen extraction: passes or fails** (passes only if 0a passes and at least 15 colonies enter 0b, as above
        and P161). Sensitivities are counts only, unlabelled.
    - **What it may not compute or print:** any frame number or time, interval or bout length, A, B, I1, quintile cut,
      rate, shape, CV or bootstrap, and nothing of 0b's fit, its reference, k̄ or a 0b label. It neither imports nor
      calls `readStage0`, `read0b`, `label0b`, `kbarOf`, `referenceDraws`, `fitFlat`, `fitShape` or
      `fitColony`. A test fixes the output's keys to the list above. Its counts must equal `readStage0`'s (contact
      triplets matched, colonies counting, colonies entering, supplying ants, uncensored intervals) on synthetic Scope A
      and Scope B tables.
    - **Colony 237 (tag 52):** kept conservative (D265: a partner, unseen unless read). Flagged separately in the
      output: tag 52's light-phase reads in colony 237 (a count), colony 237's intervals unknown only by unseen tags
      (with and without the death record), and whether colony 237 is pivotal, i.e. whether the 0a count or the 0b
      entry would reach 15 if colony 237 alone were counted as passing it. Nothing is changed for it.
    - **Freeze (P172):** before any run on tracks, `extract.ts`, `support.ts` and every file they import are copied
      byte-identical under `scripts/frozen/t060/` at repo-relative paths, their SHA-256s in a dated line here; the run
      uses the frozen copies.
    - **The reading, and the stops:** the pooled verdict and counts are read and logged, worded as "support retained by
      the frozen extraction", never as the true number of biological intervals or triplets (Scope B's spurious onsets
      split intervals, D265 rule 3), and never as evidence about contact resetting as a biological mechanism (D266).
      If the primary's support fails and no sensitivity's counts would pass the same rule, T060 closes: the comparison
      is unsupported by this extraction and observation rule. If the primary's support passes, or the primary fails
      while a sensitivity's counts would pass, nothing more is read and the question returns to the user.
