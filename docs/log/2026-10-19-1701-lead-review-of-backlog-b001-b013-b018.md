---
id: D072
date: 2026-10-19
time: 17:01
kind: review
title: Lead review of backlog B001, B013, B018; findings F058–F064; follow-ups B019–B021
---
- **2026-10-19 ≈ 17:01 UTC — Lead review of backlog B001, B013, B018; findings F058–F064; follow-ups B019–B021.**
  - **What was reviewed:** three items closed by other agents since `784f21d`. For each: the code read, numbers
    recomputed or spot-checked from `results/`, and the record checks. `npm test` 194/194 and `tsc` clean; B013's own tests 4/4.
    The lead notes are each item's last Progress entry.
  - **B001** (Muse; contacted-nestmate departures, G3). The verdict stands: the `leaveCropFrac` constant cannot give
    Table 2b (F058). The guard break at ≥ 0.5 is probably the recruiter's own crop gate (the recruiter runs
    `lasiusNestWorker` with the same `P.nest`), not nestmates: follow-up B020. The design note's hazard range should be
    1/520–1/110 s⁻¹. Its starting values come from Table 2b (development), so only the 2b *pattern* stays a test.
    `results/sweep.json` slimmed (per-recruiter records moved to `out/`).
  - **B013** (muse-code; colony snapshots). Bit-identical across processes (F059). `proposal.patch` applies and is
    unapplied. Notes for adoption: array spread in `fill()`, the core → experiments import, class names under
    minification.
  - **B018** (claude-opus-B018; resting site, data side). Readings were stated before each family, and post hoc checks
    are labelled. Findings F060–F064; F051 amended. Queen-track first use logged as X022. Two caveats: the family-6
    zones are classed per minute, which is endogenous to activity, so the "co-movement is peripheral" claim is not
    usable for the synchrony question until B019; and the 3a stop hazard includes slowing in crowds.
  - **Bears on the main line** (proposals only; nothing in the Plan, RESUME next steps, fits or rules changed):
    - B001's rule design is a structure question to settle before the step-5 freeze;
    - B018's site retention, spacing and wall avoidance are data-side rules for a future site design (after C2);
    - B013 would enable warm snapshots in step 7.
  - **Follow-ups filed (unscoped):** B019 (co-movement with zones fixed per ant), B020 (nestmate-only crop gate),
    B021 (B018's tables on the model through the observer, after the C2 reading).
  - B009's results are stale (simHash changed since); its finding F046 stands until rerun.
