---
id: D261
date: 2026-11-03
time: 01:28
kind: review
title: T060 Stage 0 brief 1 built and checked (event-table reader, matching, 0a, 0b, Scope A; smoke of 3 synthetic sets per case): the code does what D243 amendment 1 and the lead's block specify, but two design problems come back to the user before V0 (P166): Scope A case (b) never reaches 0b's estimator (support fails in every colony), and 0b's shape MLE is biased upward in small ant x block cells (memoryless data give 1.66 with 2 uncensored intervals per cell), so sparse real data could be labelled established
---
- **2026-11-03 ≈ 01:28 UTC — T060 Stage 0 brief 1 built and checked (event-table reader, matching, 0a, 0b, Scope A; smoke of 3 synthetic sets per case): the code does what D243 amendment 1 and the lead's block specify, but two design problems come back to the user before V0 (P166): Scope A case (b) never reaches 0b's estimator (support fails in every colony), and 0b's shape MLE is biased upward in small ant x block cells (memoryless data give 1.66 with 2 uncensored intervals per cell), so sparse real data could be labelled established.**
  - **What was built** (implementer, brief `logs/handoff/20261103-0106-t060-s0-reader/brief.md`, gate
    `run:t060-s0-brief1`; report saved beside it): `scripts/scratch/t060/` (scratch until frozen): `events.ts` (the event
    table and its validation), `reader.ts` (`readStage0`: triplets, matching, 0a, 0b, Stage 0's label, descriptives;
    SEED 6243; imports `context`, `qSorted`, `median` from H6's frozen reader), `scopeA.ts` (generator, cases a–d, CLI),
    23 tests. SHA-256 prefixes: events.ts b88bcc6e, reader.ts 415d4c6d, scopeA.ts 90f15ba1, t060.test.ts d218763d.
    Nothing under `scripts/frozen/` or `src/` changed. Nothing real was read beyond `colonies()` / `roles()` ant counts.
  - **The lead's check:** the files' hashes match the report; the T060 tests pass (23/23), `npx tsc --noEmit -p .` is
    clean, `npm test` passed in the implementer's run (292). The smoke's four output files match the reported hashes.
    The small-cell bias (below) was reproduced independently by the lead with a separate script on synthetic draws
    (4,000 cells per row): true k = 1 gives 1.662, 1.319, 1.151, 1.065, 1.017 at 2, 3, 5, 10, 30 uncensored intervals
    per cell; true k = 3 gives 5.01, 3.94, 3.45, 3.20, 3.05. It is the incidental-parameter bias of a shape MLE with a
    scale per cell profiled out.
  - **Smoke (3 synthetic sets per case; not V0, which needs 200):** "established" in a 0/3, b 0/3, c 3/3, d 0/3; k̄ about
    1.02 (a; its interval excludes 1, the bias at 18–33 uncensored per cell), 3.06 (c) and 0.94 (d). 0a counts 21–22 of
    22 colonies in a, c and d, 0 in b. Full V0 about 50 min serially (case d about 40).
  - **Problem 1, case (b) never reaches the estimator:** with a Lomax excess of shape 1 the intervals are long, so the
    loss of history and the PDCs leave about 70 contact and 42 reference triplets per colony and 1–2 matched contact
    triplets (maximum 6): 0/22 colonies count for 0a or enter 0b. V0 (b)'s rule (at most 5 % "established") would be
    met by support alone and would say nothing about the estimator under a falling hazard. Cases a and d do exercise it.
  - **Problem 2, small-cell bias:** 0b's threshold (lower bound above 1.5) has margin at Scope A's cell sizes, but real
    cells (ant × 4-h block, complete contact-free intervals of at least 60 s) may hold two or three uncensored intervals
    (F114: most windows are unknown under H6's coverage rule), where a memoryless ant gives k̂ 1.3–1.7. Then a
    memoryless population could be labelled "established". No V0 case tests sparse cells. The reader now reports
    `dPerCell` (median uncensored per cell, share of cells with at most 2) as a descriptive; it enters no label.
  - **Also reported (no change proposed):** matching takes up to 5 references per contact triplet greedily, as written,
    so references limit matched contacts (case a: about 300 references, about 60 matched contacts per colony); the
    40-ant colony falls just short of 0a's 20 (10–19).
  - **Accepted by the lead as implementation details (D243's "details are fixed by the lead"):** the six `// EDGE:`
    readings and the Scope A choices in the report's items 5–7 (every ant starts an inactive interval at 04:00; case d's
    OU from a stationary start, advanced per second, applied during E only; continuous draws rounded to whole frames,
    at least 1; Poisson times floored to frames; events after an unknown frame dropped as unobserved; an onset at or
    after 18:00 recorded as none; moving bins with every ant stepping every frame). The overall failure label is "not
    identifiable", its 0b reason worded as P159.
  - **Next:** both problems change the frozen V0 or 0b's rule, so they go to the user (P166; question raised on T060).
    Nothing else runs on T060 until the answer: no V0 run, no brief 2.
