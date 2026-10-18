---
id: D052
date: 2026-10-18
time: 12:41
kind: reading
title: Persistence gates with more seeds, read (run `c2gates2-20261018T034927Z`, ok, 3 h 25 m; 03:49 design; box code checksums as the first gates; no missing-value cases)
---
- **2026-10-18 ≈ 12:41 UTC — Persistence gates with more seeds, read (run `c2gates2-20261018T034927Z`, ok, 3 h 25 m;
  03:49 design; box code checksums as the first gates; no missing-value cases).**
  - **Window, 28 seeds (616 runs): all 4 activity rows pass.**

    | Row | Shift (SE) | 90 % CI |
    |---|---|---|
    | `persist.nurse` | +0.01 | [−0.28, 0.31] |
    | `persist.forager` | +0.05 | [−0.31, 0.43] |
    | `top20.nurse` | +0.01 | [−0.09, 0.10] |
    | `top20.forager` | +0.02 | [−0.07, 0.12] |

    Beside: motion rows 0 of 16 fail at 6 h and at 9 h. **The window gate passes for all 36 rows.**
  - **dt 0.05 vs 0.025, 24 seeds (528 paired runs):**
    - `persist.nurse` −0.02 [−0.33, 0.30], **pass**. The 6-seed +0.51 was noise.
    - `persist.forager` +0.17 [−0.19, 0.55], **FAIL on width** (upper bound 0.05 past the bound).
    - Beside: `top20.nurse` +0.05 [−0.04, 0.13], `top20.forager` +0.04 [−0.06, 0.14].
  - **Still open from gate 1 (01:59 design):** `runStill.P10.forager` +0.14 [−0.25, 0.53], also width (not part of
    the 03:49 rerun).
  - **Gate status for C2 at dt 0.05:**
    - window: pass, 36 of 36;
    - dt: 34 of 36 pass; two forager rows fail on width with small point estimates (+0.14 and +0.17 SE).
  - **Per the 03:49 rule: no automatic escalation; to the user.** Approximate power for the two rows, if the means
    stay: about 1.2–1.3 × their current runs would resolve them (P10 forager 36 → ≈ 44 seeds × 1 h, ≈ 40 min;
    forager persistence 24 → ≈ 32 seeds × 6 h, ≈ 2.3 h).
