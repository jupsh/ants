---
id: D248
date: 2026-11-02
time: 05:59
kind: reading
title: B011 read (T043; codex, user-handed): in the provisional spatial colony, flow-associated mouth contact outlasts positive flow by at most 0.2 s (mean 0.014 s, 630 bouts, three colonies), below the 60-s scan; one of 60 colony/scan-phase comparisons gains one event; 84,437 no-flow mouth episodes excluded; a geometric contact recorder proposed for step 9, not adopted
---
- **2026-11-02 ≈ 05:59 UTC — B011 read (T043; codex, user-handed): in the provisional spatial colony, flow-associated mouth contact outlasts positive flow by at most 0.2 s (mean 0.014 s, 630 bouts, three colonies), below the 60-s scan; one of 60 colony/scan-phase comparisons gains one event; 84,437 no-flow mouth episodes excluded; a geometric contact recorder proposed for step 9, not adopted.**
  - **What ran:** B011 (`backlog/B011-e6-bout-end-vs-observed-contact/`), handed to a codex agent by the user and
    released by it as done (2026-11-02 ≈ 03:32 UTC; message on T043 at 03:36). Simulated output only, no E6 data, no
    held-out set. Provisional spatial colony defaults (`LASIUS_PARAMS` + `LASIUS_NEST`), Bles apparatus, 53 workers, 4-d
    starvation, food at minute 30, dt 0.1 s, three diagnostic colonies, 20 scan phases each; simHash `eb48ce968127e6a8`,
    commit `f9ad78f`. Report `results/report.md`, stamped `results/summary.json`.
  - **Checked by the lead:** `backlog.mjs check B011` (one current result, 0 stale); the item's deterministic controls
    (`check.ts`: "B011 controls passed"); `npx tsc --noEmit -p .` exit 0. The report was read in full.
  - **Reading (the item's own, adopted as a bounded descriptive result):**
    - All 630 positive-flow bouts matched distinct, uncensored mouth-contact episodes (no reversal, no unmatched bout).
      Extra mouth contact beyond flow: 548 bouts 0 s, 78 at 0.1 s, 4 at 0.2 s; mean 0.01365 s, maximum 0.2 s, below
      the 60-s scan interval in every bout.
    - Through the unchanged `observeContacts` ('after', > 5 s, 60-s scans): 12,599 of 12,600 bout/phase pairs
      identical; one gains a scan, so one of 60 colony/phase comparisons gains one event and moves one non-forager donor
      and one receiver by one event-count bin. E6 has event-count histograms, not duration histograms.
    - "Larger than a scan interval? No … Large enough to change an existing histogram bin? Yes, occasionally."
  - **Limits:** these provisional defaults only (not the step-5 candidate, other dt or another contact definition);
    60 phases reuse three colonies (no population claim); **84,437 mouth-geometry episodes without positive flow** are
    excluded because geometry gives no donor, so how such contacts would be scored as trophallaxis is not established.
  - **Proposal (not adopted; the user decides at step 9):** a geometric contact recorder for identified trophallactic
    partners, onset and end independent of flow, with a donor-direction rule through zero-flow intervals, fed through
    the existing scan and merge observer, flow bouts kept for food accounting, frozen and checked before E6 judging.
    Noted on T038.
  - **Record:** F112; T043 closed. Recorded late, on the user's review (2026-11-02), after the acknowledgement at 03:37
    UTC.
