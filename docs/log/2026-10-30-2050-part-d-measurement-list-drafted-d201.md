---
id: D205
date: 2026-10-30
time: 20:50
kind: design
title: Part D measurement list drafted (D201; proposal for the user, nothing run): member-separating measurements led by density manipulation (the members' S6 point values differ by family across colonies; S5 and S7 do not) and direct sensing of a driver; shared-failure measurements led by the 10-min D_w shortfall, first located in the existing data by block and time of day; four interventions unresolved (needs modelling)
---
- **2026-10-30 ≈ 20:50 UTC — Part D measurement list drafted (D201; proposal for the user, nothing run): member-separating measurements led by density manipulation (the members' S6 point values differ by family across colonies; S5 and S7 do not) and direct sensing of a driver; shared-failure measurements led by the 10-min D_w shortfall, first located in the existing data by block and time of day; four interventions unresolved (needs modelling).**
  - **What:** the outcome of Part D's question 2 (D200): the ranked measurement list of D126 requirement 6 as amendment
    1 states it, split in two as the user asked (D201). Drafted by the lead for the user to approve, amend or reorder.
    Nothing is computed or run for it; every value below is already in `logs/partd2/assess/read.json` (D194) or
    `logs/partd2/desc.json` (D203). Development evidence only. S1 windows as corrected in D204 (5 s, 1 min, 10 min).
  - **Rules it follows:**
    - Each entry is ranked by its predicted T − D difference from the implemented members, where that needs no new
      arms (stopping rule, D158), and lists the controls it needs (D126 amendment 1).
    - Each member's prediction is in one of three classes:
      - **from existing outputs** (no run);
      - **runnable without new modelling**: the members could be run under the intervention, but that is a new run and
        so a new design, outside Part D's single pass;
      - **unresolved (needs modelling)** (D201).
    - Interventions are hypotheses. No placement, no family label, no closest member (D200, D201).
  - **Already in hand, not a new measurement:** the capability coordinates separate every calibrated T member from
    every D member (F106). T's near-band C is 1.7–2.2 times the data's and its R is lower than the data's; the D members
    other than Es have about twice the data's 20–40 mm band; Es's R_J is about twice the data's (D203; F107). Another
    data set measured the same way would sharpen these values but cannot by itself settle the mechanism, because no
    member reproduces jointly (F103).

  - **Part 1: measurements predicted to separate the implemented members.**
    1. **Density manipulation within a colony** (area-matched change in the number of ants, or a band emptied by
       sham-controlled confinement).
       - **From existing outputs, the between-colony analogue** (22 simulated colonies per arm, D194 descriptives):
         - **S6** (Spearman ρ of colony D_w at 1 min against in-nest ants per cm²): T20f 0.25, T20m −0.01; Eu-M 0.84,
           El20-M 0.86, Ed2 0.91, Ed5 0.85, Ed20 0.92, Ew5 0.72, Es 0.68; base 0.13. Data 0.59. The point values fall
           in two groups by family. They are point values with no interval, and a Spearman ρ over 22 colonies is
           imprecise. The contrast motivates a density experiment; it does not predict its causal effect (D206).
         - **S5** (within-ant coupling to colony activity, ≥ 3 against 0 neighbours, 95 % CI): T20f −0.18 [−0.28,
           −0.09], T20m −0.25 [−0.39, −0.09]; D members from −0.50 (Es, [−0.79, −0.26]) to +0.04 (Ed20), with El20-M,
           Ed5 and Es below 0. Data −0.16 [−0.43, 0.09]. **S5 does not separate the families.**
         - **S7** (ρ of colony S3₂ against occupancy): T20f 0.19, T20m −0.17; D −0.36 (Es) to 0.63 (Ed5). **No family
           pattern.**
       - **Limits:**
         - The nest area is fixed (28 cm², data and model alike, `s5Stats.ts`). So across colonies, density is the
           number of ants in the nest: colony size and density are not separated.
         - The S6 contrast runs against the a priori "relay predicts faster spread when denser", which amendment 1
           withdrew. The members' predictions come from their runs, and why the driver members' D_w rises with the
           number of ants is not examined here.
       - **Within-colony prediction:** runnable without new modelling (the members at a changed ant count, same nest).
         A new design.
       - **Controls (D126):** driver exposure also changes with packing; a handling sham; area matched.
    2. **Direct sensing of a driver** (substrate vibration, airflow and temperature at ≥ 3 points, synchronised with
       the video).
       - **Prediction:** the D members time-lock onsets to their own driver events by construction; T predicts no lock
         beyond chance. The size of the lock through the observer is **not computed**. The event times are runner
         state on their own RNG stream and are not written to the Stage 2b outputs. Recovering them is runnable without
         new modelling (a re-run on the same seeds), so it is a new design.
       - **Which physical channel** a D member stands for (vibration, air, heat) is **unresolved (needs modelling)**.
       - **Reading limits (D206):** a measured signal could also follow ant activity, so time-locking alone would not
         establish an external cause; a null result would constrain only the channels and sensitivities measured.
       - **Controls (D126):** front speed estimated from the sensor array; placebo windows; sensors that do not
         themselves disturb.
    3. **Higher frame rate.** **Unresolved (needs modelling):** the members are observed through the frozen 2-fps
       detection tracker. A faster observer needs its own detection model, and the tracker is frozen (AGENTS.md).
    4. **Point stimulus at a known place and time.** **Unresolved (needs modelling):** no stimulus is implemented.
    5. **Partial barrier with gaps.** **Unresolved (needs modelling):** barrier geometry and which channels it blocks
       (amendment 1 withdrew "lag follows path distance under T").
    6. **Two colonies in one system.** **Unresolved (needs modelling):** one system per run.
    - **Order:** 1 has a between-colony difference computed from the members. 2 has a difference by construction,
      size unknown. 3–6 have no member prediction. This matches D158's lead items, although its branch for a failed
      capability does not apply (D200). The order is a practical proposal, not a demonstrated superiority (D206).

  - **Part 2: measurements addressing the members' shared failures.**
    1. **The 10-min D_w shortfall (F104), the failure every arm shares.** At 10 min every arm's point estimate is below
       the data's (all ants 3.2–5.25 against 6.28; foragers 1.36–2.37 against 3.12), but not every arm is outside: on
       all ants T20m, Eu-M and Eu are unresolved; on foragers T20m and Eu are. At 5 s every non-base arm is equivalent on all
       ants, and the members were calibrated at 1 min. S1's slowest window is 10 min, so nothing slower was measured.
       - **Estimator, from the code (no test):** `syncStats.ts` computes D_w within 4-h blocks, for the data (clock
         blocks from 06:00 UTC) and for simulations (from the first frame) alike, with each ant's mean taken within
         the block. The 2 × 4 h against 8–12 h difference therefore changes the number of blocks (precision), not the
         block length. This narrows F104's open question (whether duration biases D_w down) but does not settle it:
         whether the data's clock blocks and the simulated blocks differ in coverage is not checked.
       - **(a) Locate the slow component in the existing data (first; data only, no new data, no run of the model):**
         the data's 10-min D_w per 4-h block and by light-phase block (06–10, 10–14, 14–18 UTC), from the per-block
         values `syncStats` already writes. Each simulated run is one block, so the members' per-block values exist
         too. The members have no clock, so slow synchrony concentrated in particular hours of the light phase
         would show variation the members do not represent. It would not tell an external driver from an internal
         rhythm, changing colony composition or recording effects (D206). It would be designed and logged before it
         runs.
       - **(b) Forager entries and queen movements as triggers** (T035, B023; design D134 §4): existing data. It asks
         whether the slow co-movement follows events no member models.
       - **(c) The foragers' 10-min shortfall** (data 3.12, arms 1.36–2.37) next to C2's forager stays and trips (F077,
         F038; T012, B005, waiting on this thread).
       - **(d) New data:** temperature, humidity, light and substrate vibration logged at ≤ 1-min resolution through
         the whole recording, and longer recordings (more blocks per colony).
       - **(e) Model side:** a member with a slower process (a slower driver or a slow internal state). A shortfall at
         the 10-min window does not establish a 10-min oscillator (D206). It is **unresolved (needs modelling)** and
         outside Part D's stopping rule, so it would be a new design.
    2. **Failures every member inherits from C2's motion** (pointers only; they are carried, not Part D's): the failing
       rows (F068), packing and the near-share deficit (F027, F078; P52), still–still contacts (F017, F079), and the
       forager per-ant spread (F075).
  - **Not said:** which mechanism produced the data's synchrony, or which member the data resemble (D200, D201).
  - **For the user:** approve, amend or reorder the list. If approved, Part 2 item 1(a) is the first computation, on
    development data only, designed and logged before it runs.
- **2026-10-30 ≈ 21:04 UTC — Amended in place on the user's answer to Q24 (D206).** Six places read more strongly than
  the evidence: the shortfall now separates point estimates from outside rows; Part 2 item 1(a)'s reading no longer
  points to an external or rhythmic influence; item 1(e) no longer implies a 10-min process; S6 motivates a density
  experiment without predicting its effect; direct sensing gains its reading limits; Part 1's order is a practical
  proposal. The items and their order are unchanged.
