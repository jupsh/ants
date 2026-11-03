---
id: D245
date: 2026-11-02
time: 04:03
kind: reading
title: H6 build checked (T059): reproduction passes for all 22 colonies, Test A rho +0.015; at smoke size, null 3's eligibility under the coverage rule's neighbour clause leaves null 3 unsupported in every colony, so V3 cannot pass; brought to the user (Q33)
---
- **2026-11-02 ≈ 04:03 UTC — H6 build checked (T059): reproduction passes for all 22 colonies, Test A rho +0.015; at smoke size, null 3's eligibility under the coverage rule's neighbour clause leaves null 3 unsupported in every colony, so V3 cannot pass; brought to the user (Q33).**
  - **What ran.** The first implementer on the D241 brief (`logs/handoff/20261101-2249-h6-build/brief.md`, gate
    `run:h6-build-smoke`) was lost when the user's laptop crashed (note on T059). A second one rebuilt the code in
    `scripts/scratch/h6/` (local) from the same brief and rebuilt every intermediate. Its report:
    `logs/handoff/20261101-2249-h6-build/report.md`.
  - **Checked by the lead:** the H6 unit tests (17/17), `npm test` (37 files, 292 tests) and `npx tsc --noEmit -p .`
    pass; the code's SHA-256 values match the report (reader `36285c07…7beda7`, not frozen). The lead reran
    `repro.ts`: every colony PASS (light-phase onset events equal `logs/contacts/data-c<i>.json`; Test B `onsets` and
    `onsetsAfterContact` equal `tb-c<i>.json`, light and dark; 0 contact-frame mismatches); "Test A light rho +0.015
    over 22 colonies (F026: +0.015) → PASS".
  - **Smoke (synthetic only; 5 sets per case, 3 for V4; 200 null draws; not a validation).** With null 3's eligibility
    under the full coverage rule, as amendment 1 point 3 says: null-3 support is met in 0 of 22 colonies in every set,
    so the null-3 label never fires (V3 0/5) and V3's acceptance (both labels ≥ 80 %) cannot pass. Null 1: V1 0/5,
    V2 5/5, V3 5/5, V4-V1 0/3, V4-V3 3/3. With eligibility under point 1's three conditions only (no neighbour
    clause): support 21/22 colonies (20/22 after V4's deletion); null-3 label V1 0/3, V2 0/3, V3 3/3, V4-V1 0/3,
    V4-V3 3/3. Dropping the requirement that the observed initiator be eligible gave a V1 null-3 false positive
    (1/1). S2 check: shared signal ΔF − shift 69.6 [66.2, 73.0]; independent 0.12 [−0.23, 0.46].
  - **Reading.** The neighbour clause ("no ant last seen within reach plus 2 s of travel undetected for more than
    2 s", radius 25 mm by the lead's dated detail in D241) fails at almost every onset frame in nests this dense, so it
    excludes nearly every null-3 candidate. Point 3's extension of the coverage rule to null 3's eligibility was the
    lead's (the user's P148 names onsets and the at-risk reference). The clause guards the classification of
    "no observed contact", not whether an ant could have initiated. The same clause probably makes most onsets and
    at-risk times "unknown" in S1. That could not be checked blind and was not checked. Under P151 ("Return for a
    decision if those checks fail or require a substantive design change") this goes to the user as Q33. The full
    V1–V4 run and the freeze wait for the answer.
  - **Other points from the report, for Q33:**
    - The observed initiator must itself be eligible, or the episode is uninformative for null 3 (the reader's
      default; the diagnostic above supports it).
    - The implementer's choices where D241 is silent (report, doubts point 4) are named constants, listed for
      confirmation.
    - The draft S3 entry rule omits D212's "observed" condition: a defect against D241's "the D212 matching", to be
      fixed before the freeze.
    - Null 2 needs nothing: amendment 1 dropped it.
  - **Seen:** only the reproduction values above and synthetic outputs. The null-3 support counts (0, 21, 20 of 22
    colonies) come from the real episode skeletons and eligibility bits, not from the real initiators. No empirical
    H6 statistic was computed.
  - **2026-11-02 ≈ 06:00 UTC — exposure recorded:** the null-3 support counts under "Seen" are logged as X026 (on the user's review).
