---
id: D048
date: 2026-10-18
time: 04:09
kind: run
title: Speed-up attempt (user request), bit-identical; local only, the box keeps the code its gates started with
---
- **2026-10-18 ≈ 04:09 UTC — Speed-up attempt (user request), bit-identical; local only, the box keeps the code its
  gates started with.**
  - **Profile** (colony122, 151 ants, C2 start, dt 0.05, 30 min + 1 h): `senseAllContacts` 27 % of self time, the
    nest policy's `meet` 9.5 %, `metabolise` 6 %, `decide` 6 %; the rest spread thinly.
  - **Changes:**
    - **Incremental contact sensing** (`ContactPairCache.last` / `adj`): only pairs with an ant whose position,
      heading or life changed bit for bit are recomputed, by the same geometry code (`pairGeometry`). The others keep
      their recorded result; each ant's partners are kept in ascending index, and percepts are built fresh each step
      from current signals. The uncached full scan stays as the reference path.
    - **`meet`:** closure lookups replaced by plain loops, same logic.
    - Not changed: `nestParamsOf` (the diagnostic switches mutate the nest parameters in place, so a memo could go
      stale) and `metabolise` (ledger arithmetic; any reordering could change results).
  - **Checks:**
    - tests 190 / 190, including the fast-path vs full-scan equivalence tests (`contactGrid.test.ts`);
    - rows byte-identical to the previous code for C2 1 h (colony122), C2 6 h with activity rows (colony250) and the
      C1 model 1 h (colony112).
  - **Gain** (back-to-back A/B, alone on the machine): 37.2 → 32.3 s, **≈ 13 %** (contact sensing 27 % → 17 % of
    the profile; `meet` gave ≈ 1 %). Projected fit ≈ 32 h → ≈ 28 h.
  - Not deployed mid-gate: the dt gate starts later in the same run, and new code would give it a different simHash
    in its provenance for ≈ 12 min saved. For the fit, after the gates.
