---
id: D197
date: 2026-10-30
time: 17:47
kind: decision
title: User: proceed with the gated same-member check under D196, c and α fixed; pooled and per-member exceedance reported; a failed check stops before any cross-member value (P59); D196's spread comparison is rough reassurance only; Stage 0's failed gate unchanged
authority: user
scope: T033 P59 P63
---
- **2026-10-30 ≈ 17:47 UTC — User: proceed with the gated same-member check under D196, c and α fixed; pooled and per-member exceedance reported; a failed check stops before any cross-member value (P59); D196's spread comparison is rough reassurance only; Stage 0's failed gate unchanged.**
  - **User (in conversation, verbatim):**
    > I recommend proceeding with the **gated same-member check under D196**.
    >
    > My bounded code-and-record check found no obvious configuration mismatch: both runners specify C2's fit, light
    > phase, 2 h warm-up, 4 h observation and dt 0.05. This does not establish why Part C's draw ran high, but the
    > location discrepancy alone does not invalidate a threshold based on dataset differences.
    >
    > One qualification: D196 compares a **90 % null range with a 95 % Part C CI**. Their similar widths are only rough
    > reassurance, not evidence of equal spread.
    >
    > Keep c and α fixed. Report pooled and per-member exceedance rates; if the check fails, stop before computing any
    > cross-member value, as P59 requires. Stage 0's failed gate remains unchanged.
  - **Effect:**
    - `partDCap.ts same --frozen D196` runs, gated `run:partdcap-same`, with c = 9.2824 and α = 0.025/3 as D196 froze them.
    - The member capability outputs are unsealed for it: P63's condition, c frozen, is met (D196).
    - The reading reports the pooled and per-member exceedance rates (D175 item 2: the estimated false-positive rate f).
      A failed check (D175 item 2; D176 gap 1: more than 10 % of the evaluable same-member pairs) stops there and goes
      to the user, and `cross` is not run (P59).
    - D196's spread comparison is corrected in place (dated): rough reassurance only.
    - D130's failed gate G is unchanged (P43).
