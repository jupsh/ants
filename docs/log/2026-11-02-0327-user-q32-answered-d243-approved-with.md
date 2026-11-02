---
id: D244
date: 2026-11-02
time: 03:27
kind: decision
title: User: Q32 answered, D243 approved with amendments before implementation (complete histories unknown unless independently bounded, focal bridging a sensitivity, proximity-defined contacts; a coherent synthetic observation model or separate validation scopes, generator settings frozen; Stage 0b's reference rate and its ants tied to the matched triplets, failure meaning 'not established for this comparison'; Stage 1's label narrowed; reader edge cases frozen); build the Stage 0 extraction, matching and V0 checks after the amendments, Stage 1 deferred; V6 kept as a fixed stress test
authority: user
scope: Q32 T060 P152
---
- **2026-11-02 ≈ 03:27 UTC — User: Q32 answered, D243 approved with amendments before implementation (complete histories unknown unless independently bounded, focal bridging a sensitivity, proximity-defined contacts; a coherent synthetic observation model or separate validation scopes, generator settings frozen; Stage 0b's reference rate and its ants tied to the matched triplets, failure meaning 'not established for this comparison'; Stage 1's label narrowed; reader edge cases frozen); build the Stage 0 extraction, matching and V0 checks after the amendments, Stage 1 deferred; V6 kept as a fixed stress test.**
  - **User (pasted, verbatim; adopted; the link to D243's file shown as its id). It answers Q32 on D243:**
    > **For Q32, I recommend amend, keeping Stage 0 first.** The staged approach is sensible, but D243 needs these corrections before implementation:
    >
    > 1. **Make “complete history” defensible.** A 30-s focal gap with nearby endpoints can hide movement followed by a return. An entirely unseen ant, or an unbracketed partner gap, can hide contact. These histories must remain unknown unless independently bounded; reporting their counts does not make them complete. Put the proposed focal bridging in a sensitivity. Describe 4.1-mm crossings as proximity-defined contacts, since touches are unverified.
    >
    > 2. **Repair the synthetic observation model.** Replacing inactivity times while retaining the focal ant’s real movement creates incompatible activity and position records. That can test an event-table reader, but cannot validate the full onset, sustained-movement and contact pipeline. Specify coherent synthetic movement and observation, or explicitly separate those validation scopes. Freeze bout durations, initialization and per-ant timescales too.
    >
    > 3. **Finish Stage 0b’s specification.** Define how the exponential reference’s rate is estimated despite the 60-s threshold, censoring and contact-free selection. Tie the regularity assessment to the ants supplying the matched triplets: a colony’s median CV among another subset cannot establish suitable timing for those triplets. Failure should mean **“a characteristic interval was not established for this comparison,”** rather than establish its absence.
    >
    > 4. **Narrow Stage 1’s interpretation.** Equivalence of Δ3 establishes similar *changes* in contact and reference triplets. Both groups could have shorter I3 than I1 while Δ3 equals zero. Either add an explicit criterion for the within-contact “unchanged” claim, or label the result **“contact-associated advance with equivalent subsequent interval change relative to references.”** H2 versus H3 remains unresolved.
    >
    > 5. **Resolve reader edge cases before freezing.** V2 explicitly allows A = 0, while ΔA uses log A. Specify a common time-resolution or censoring convention. Also freeze reference reuse and weighting, matching-bin construction, and handling of missing detections at the sustained-onset check.
    >
    > The 60-s primary definition, queen exclusion and sustained-onset check are reasonable operational choices. Keep V6 as a fixed stress test; passing it would address that particular common-input scenario.
    >
    > I recommend building the Stage 0 extraction, matching and V0 checks after these amendments, with Stage 1 deferred. I changed no files, ran no empirical or synthetic analyses, and accessed no sealed results.
  - **Effect:**
    - **Q32** is answered: D243 is approved with amendments, written into D243 as amendment 1 (with the details the
      lead fixes to implement points 1–5). The 60-s interval, the queen's exclusion and the sustained-onset check stand.
    - **Order:** amendment 1 is recorded first. Then the implementer builds the Stage 0 extraction, the matching and
      the V0 checks (D208); Stage 1 is deferred, its design kept and amended, and nothing of it is built. Stage 0's
      empirical outputs stay sealed until its reader is frozen and V0 and the reproduction pass; a failure, or a
      needed substantive change, comes back to the user.
    - V6 stays in Stage 1's design as a fixed stress test. H2 versus H3 stays unresolved (P136). Item 1(e)'s mechanism
      stays unchosen.
