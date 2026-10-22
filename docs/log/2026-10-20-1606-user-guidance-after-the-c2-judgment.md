---
id: D082
date: 2026-10-20
time: 16:06
kind: review
title: User guidance after the C2 judgment (pasted, adopted): a bounded diagnostic round before any C3; corrections to the lead agent's C3 reasoning
---
- **2026-10-20 ≈ 16:06 UTC — User guidance after the C2 judgment (pasted, adopted): a bounded diagnostic round before any C3; corrections to the lead agent's C3 reasoning.**
  - **Context:** after D081 (C2 not adequate), the lead agent listed what might make a C3 better (in chat, not in the
    record). The user pasted a review of that list; adopted as follows.
  - **Correction (lead agent's claim, chat only):** "the τ = 60 s drive cannot create between-ant spread over 6 h, by
    construction" is **wrong**. The 0.075 σ figure is the SD of the 6-h mean *log*-drive. C2 multiplies the walk-on
    rate by M = exp(σz − σ²/2), with Cov(M(t), M(t+u)) = exp(σ² e^(−|u|/τ)) − 1. Checked numerically (τ 60 s, 6 h): the
    SD of the 6-h mean multiplier is 0.038 / 0.085 / **0.313** at σ 0.5 / 1 / 2. Compare the fixed trait (σ 0.4): 0.42.
    Defensible: **C2's fitted configuration did not produce enough spread.** How the drive maps to activity spread
    (through rests and crowding) is not known; stable heterogeneity remains a hypothesis to test.
  - **Adopted points:**
    - **Bounds** suggest compensation but do not identify its cause. C2 has too many nurse rests ≥ 10 s and ≥ 60 s *and*
      too little still time, which calls for correcting the rest distribution jointly with activity, not simply
      heavier tails. All searches hit their caps without converging: the estimates are selected, not demonstrated
      optima. D081 shows the fitted candidate failed, not that every setting would.
    - **B018's rest mixture is not a behavioural law.** Two exponentials beat one; that establishes neither two
      biological states nor a win over every continuous mixture, and the long component may itself be heavy-tailed.
      Both component durations and (modestly) the mixing proportion change with neighbours, so "neighbours act on
      long rests only" is a further simplification. B018 measured **observed** still runs: copying its fitted
      durations into latent rest states could count observation effects twice. `mix2` composes with the gamma rest
      depth, so switching it on alone does not implement that design.
    - **F067 / F070** support addressing spatial organisation eventually. They do not show that place causes
      activity, or separate stable traits from slower internal states. The 5–9 % is a descriptive reduction in
      persistence, not a causal share explained by place.
    - **Data role:** choosing a functional form from development evidence and estimating its numerical shape from it
      are different uses. A shape "fixed from B018" would be data-estimated: it needs an explicit role decision and an
      uncertainty treatment, and disclosure alone does not settle it.
    - **B014** is worth deciding separately for run time. Speed or budget is no evidence for C3's biology.
  - **Next (the user's preferred order):**
    1. trait and drive perturbations at C2's fitted settings, paired diagnostic seeds, C2 as fitted as the control;
       all row families reported, especially mean activity, persistence, spread and rest survival. A spread gain
       bought by a large activity shift is a tradeoff, not a solution;
    2. B018's conditional rest summaries measured on C2 through the same observer: does C2 fail within comparable
       neighbourhoods, or mainly by putting ants in the wrong ones?
    3. one bounded C3 only after those readings. If supported, start with a free continuous trait width before
       discrete classes; keep the site mechanism out unless the conditional comparison shows it is needed.
  - Designed in the next entry, for approval before anything runs. Nothing was changed or run by the reviewer.
