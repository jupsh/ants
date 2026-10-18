---
id: D060
date: 2026-10-18
time: 16:13
kind: review
title: Backlog review: B015 done, B006 findings written (not closed), B001 running, B018 started
---
- **2026-10-18 ≈ 16:13 UTC — Backlog review: B015 done, B006 findings written (not closed), B001 running, B018
  started.** Checked by the lead agent (diffs, results, source pages):
  - **B015 (done; Codex): no step-5 free input is fixable from the cleared literature.** Density is a prior range
    only: Mailleux 2000 nests 20 × 25 × 0.5 cm with 1000–2000 workers give 2–4 ants/cm² over the full footprint
    or 3.9–7.8 over the four 16 × 4 cm sections; Buffin 2011 gives 3.5 /cm² nominal (500 workers, 11.5 × 12.5 cm).
    Both page citations checked. Neither paper gives the 1999 chamber area or local occupancy. No value for
    shareRate, receiveReserve, reserveSd or returnRate; Buffin's trophallaxis durations serve as a timing check
    only. **Bears on the step-5 design:** k stays 4 + density, unless the density prior is used as a bound (the
    user's decision).
    - Its leads list, which is for a clearing decision, includes **Portha, Deneubourg & Detrain 2004, a registered
      fresh E2 held-out candidate.** Only its title appears in Buffin's reference list (no exposure). It is not to
      be cleared as a source without the user deciding to spend it.
    - Its `backlog.mjs check` failure did not reproduce (16:10: 0 results files, 0 stale; its results are
      Markdown only).
  - **B006 (Codex; findings written, status still open, no claim): in-nest activity and moving-involved contacts
    co-vary across colonies (light/dark ratios ρ 0.97); trip duration does not (ρ 0.20–0.23, its Pearson r driven by
    colony112).** The proposal is two phase controls (in-nest walk-on, outside give-up). Lead review note added to the
    item: the note omits the set-up's 26 °C / 22 °C phase temperatures (speed is equal across phases, so any effect
    is on rates; Arrhenius 0.47 eV gives ×1.28 vs the observed ×1.37). The nest is dark to the ants in both
    phases, so a "light" factor in the nest needs a stated cause: temperature, entrainment, or light via the
    entrance or returners. **This bears on step 5's phase question:** 1999 ran at 22 ± 3 °C, which would point to
    the dark-phase motion if the cause is temperature. Not closed until the user decides.
  - **B001 (Muse, active):** its leaveCropFrac sweep at the pilot optimum (1999 Table 2b, development) is running
    locally (niced 10, the full pool). Reading stated before running; no result yet.
  - **B018:** claimed 16:09 by the agent the user assigned. It and B001 share the local CPU; both are niced.
