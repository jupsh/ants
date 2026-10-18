---
id: D050
date: 2026-10-18
time: 04:40
kind: review
title: Backlog review (user request: set priorities, scope, titles; add gaps)
---
- **2026-10-18 ≈ 04:40 UTC — Backlog review (user request: set priorities, scope, titles; add gaps).** Lead
  agent; desk only, nothing run. Items scoped (Question, Done when, Data and roles, Compute, Out of scope),
  retitled where the seed was vague. Priorities favour what feeds the step-5 design:
  - **10 B008** fit-speed options, now for the step-5 Mailleux fit; **20 B014** event-driven resting ants;
    **30 B015 (new)** cleared-literature values for the step-5 free parameters (Plan parallel track b);
    **40 B001** contacted-nestmate departures (Table 2b, G3): `leaveCropFrac` scan, then a design note if needed.
  - **Blocked on the user:**
    - **50 B005**, the excursion audit: on hold in RESUME.
    - **60 B016 (new)**, held-out data survey (Plan parallel track a): exposure rules and web search first.
    - **70 B007**, contact observer: the observer is **not yet written**, although it was approved 2026-10-11.
      Stroeymeyt 2018 is not cleared; the GPL tool set-up and the agreement criterion are still to be logged.
    - **140 B010**: E1 paused.
  - **Later:** 80 B013 save / restore across processes (after B008); 90 B006, widened to the three
    light/dark contrasts the model lacks; 100 B004; 110 B011 (no E6 data compared); **130 B017 (new)**, B012's
    footprint follow-up.
  - **Dropped:** B002 (superseded: the pilot nest model it measured is being replaced; Plan step 6 gates dt) and
    B003 (merged into B001; E6's `leaveCropFrac` sensitivity is Plan step 9).
  - `backlog.mjs check`: B009's results are stale on simHash (computed before the C2 code), and B012's
    `results.json` is unstamped and outside `results/`. Both are expected to reproduce (neither uses the colony
    runner); not rerun.
- **Backlog B008 done (another session, 2026-10-18 ≈ 04:47 UTC; logged by the lead agent ≈ 12:46):** fit-speed
  options for the step-5 Mailleux fit, measured at the pilot nest motion (absolute times indicative only). Warm-up
  is 53–68 % of an independent recruiter run, so the already-implemented shared warm-ups (`fitM1999 --perNest 4`)
  are the biggest certain saving (1.6–2.2× measured). Then dt 0.2 for screening (0.55–0.62× of dt 0.1) and halved
  recruiters (0.50×); snapshots (needs B013) cap at ≈ 1.5× more; no profile hotspot worth a refactor (top 8.8 %).
  No main-tree change proposed. Bears on the step-5 design: start from `--perNest`, an identifiability run and
  B015. `backlog/B008-fit-speed-options-not-taken/results/recommendation.md`.
