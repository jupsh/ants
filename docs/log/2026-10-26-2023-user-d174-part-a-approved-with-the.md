---
id: D175
date: 2026-10-26
time: 20:23
kind: decision
title: User: D174 Part A approved with the review's amendments A1-A5 and the wording, on the lead's recommendation (target power 0.80, K = 6, pass at 27 of 36 per pair); Part B not yet addressed
authority: user
scope: Q21 P29 T033
---
- **2026-10-26 ≈ 20:23 UTC — User: D174 Part A approved with the review's amendments A1-A5 and the wording, on the lead's recommendation (target power 0.80, K = 6, pass at 27 of 36 per pair); Part B not yet addressed.**
  - **Review of D174 Part A (pasted by the user, verbatim):**
    > Part A — amendments needed
    >
    >   A1. K = 4 makes the pass bar nearly unreachable, and this should be a stated choice, not a surprise.
    >   Power per pair is a share of 16 comparisons, so it moves in steps of 1/16 and ≥ 0.80 means ≥ 13/16. Arithmetic on the binomial: if a
    >   pair's true per-comparison power is exactly 0.80, the chance of observing ≥ 13/16 is only ≈ 0.60. Capability requires all 14 pairs to
    >   clear it at once, and the 16 comparisons share datasets, so they are not independent. In practice the diagnostic must be
    >   near-deterministic (true power ≳ 0.95) to have a reasonable chance of passing. That may be the intended stringency, but approve it
    >   knowingly. If it is not intended, the time to raise K is now — after a failure, adding datasets is a new design under the stopping
    >   rule. Costed options from the draft's own numbers (528 Stage 2b runs plus 396 per unit of K): K = 4 → 2,112 runs; K = 6 → 2,904; K =
    >   8 → 3,696.
    >
    >   A2. The same-member check's binomial calculation is invalid as stated.
    >   The 54 pairs are built from 4 datasets per member, so each dataset appears in 3 pairs. They are correlated, and "7 or more exceed
    >   (binomial p < 0.05 against 5 %)" assumes independence. Either drop the binomial justification and treat 7/54 as a plain pre-set alarm
    >   count, or build the check on independent pairs only. Also report the observed same-member exceedance share itself (pooled and per
    >   member) as the estimated false-positive rate — a check that passes at 6/54 is an observed rate of 11 % against a nominal 5 %, and the
    >   claim sentence promises a rate f, not just a pass.
    >
    >   A3. The synthetic nulls must go through the identical M² pipeline, including R_J.
    >   D126's null recipe resamples Part C per-colony summaries. Part C has no per-colony R_J; the audited profile comes from the S2 audit
    >   machinery. The draft does not say where the null's R_J values and, critically, the R–R_J correlation come from. R and R_J are the
    >   same ratio on raw and corrected profiles and will be strongly correlated, which is exactly what drives the condition number toward
    >   the 1e8 fallback. Require: synthetic null datasets are processed by the same code as real ones (bootstrap covariances, edge rules,
    >   fallback), and the null's joint (R, S3₂, R_J) distribution is shown to be a plausible stand-in before c is frozen.
    >
    >   A4. The per-coordinate fallback has no decision rule.
    >   "If condition number > 1e8 → the per-coordinate screen (each coordinate's 95 % CI with Bonferroni over three)" does not say when a
    >   pair counts as separated under the screen (any coordinate? a pre-chosen one?), nor that the screen's false-positive rate is also
    >   calibrated on the synthetic nulls. Since the fallback is likely to trigger given A3, this is part of the primary rule, not an edge
    >   case. Specify it and calibrate it the same way.
    >
    >   A5. Two specifications are missing.
    >   First, per-dataset estimability for the diagnostic: Part B defines support for assessment rows, but Part A never says what happens
    >   when a colony in a cap dataset has no estimable S3₂ or band. Require a rule (for example, the dataset is computed on its estimable
    >   colonies with a stated minimum, the same for every dataset) so support differences cannot masquerade as member differences. Second,
    >   the freeze order on a shared rental: c is frozen "before any cap dataset is compared across members", but the same-member check also
    >   consumes cap output. State the reader's order explicitly — synthetic c frozen, then same-member check, then, only if it passes,
    >   cross-member comparisons — and that a failed check returns to you before any cross-member value exists.
    >
    >   One wording addition: the claim should say "on these 22 colonies". Every dataset reuses the same 22 colony setups; only the
    >   simulation noise is new. The capability shown is at this colony set and sample size, not over freshly drawn colonies.
  - **Lead's response (in conversation), in short:** all five points and the wording agreed. A1: raising K narrows the
    estimate but does not by itself fix a point estimate tested at the target; fix the target and the pass probability,
    then K and the cut-off. A2: the alarm count kept as a plain pre-set count; observed rates reported. A3: nulls built
    from a pool of base-arm runs through the identical pipeline. A4: a correlation of 0.99 gives a condition number in
    the hundreds, not 1e8, so the fallback is unlikely, but it gets a full calibrated rule. The lead recommended target
    0.80, K = 6, cut-off chosen for a 90 % chance of passing all pairs at true power 0.90.
  - **User (in conversation, verbatim):** "use your recommendation. looks good to me".
  - **Part A as amended (replaces D174 Part A where they differ):**
    1. **Power and K (A1):** target power 0.80; K = 6 datasets per calibrated member on `cap` 0xc4b3 (9 × 6 × 44 =
       2,376 runs). Per pair, 36 cross-dataset comparisons (6 × 6). A pair is distinguished if **≥ 27 of 36** exceed
       the threshold. Operating characteristic under independence (binomial, 36): P(all 14 pairs pass) = 0.97 if every
       pair's true power is 0.90 (0.898 at a cut-off of 28, so 27 is the largest meeting 90 %), 1.00 at 0.95; one pair
       passes with probability 0.83 at true 0.80, 0.33 at 0.70, 0.045 at 0.60. The comparisons share datasets, so the
       true curve is flatter; this is disclosed with the result.
    2. **Same-member check (A2):** 15 pairs per member × 9 = 135 pairs. A **pre-set alarm count**, no binomial claim:
       the check fails if more than 10 % of the 135 exceed c (≥ 14). The observed exceedance rate, pooled and per
       member, is reported as the estimated false-positive rate f in the claim.
    3. **Nulls (A3):** built from a pool of base-arm runs on `cap` 0xc4b3 (size fixed in the build entry, before any
       run), resampled run by run within colony into null dataset pairs, and processed by the identical code (S2 audit
       for R_J, bootstrap covariances, edge rules, fallback). Before c is frozen, the null's joint (R, S3₂, R_J)
       distribution is shown against the base arm's and Part C's per-colony values (R, S3₂) as a plausibility check,
       reported in the freeze entry. c is the nulls' 95th percentile of M².
    4. **Fallback (A4):** if the condition number exceeds 1e8, a pair is separated if **any** coordinate's 95 % CI
       (Bonferroni over three, i.e. 98.3 %) excludes 0. The fallback's false-positive rate is measured on the same
       nulls and reported; if it exceeds 5 %, the Bonferroni level is tightened on the nulls before freezing.
    5. **Estimability (A5):** each dataset is computed on its estimable colonies (S3₂ as in Part C; bands as D145 item
       5); minimum 18 of 22, the same for every dataset. A dataset below it is "not evaluable" and reported; a pair with
       fewer than 4 evaluable datasets on either side is "not evaluable".
    6. **Order (A5):** c frozen (on nulls only) → same-member check → cross-member comparisons only if it passes. A
       failed check returns to the user before any cross-member value is computed.
    7. **Wording:** the claim says "**on these 22 colonies**": every dataset reuses the same 22 colony set-ups; only the
       simulation noise is new.
  - **Cost:** Stage 2b 528 + capability 2,376 + the null pool, ≈ 2,900–3,300 runs; an estimate goes to the user with
    the rental question.
  - **Not covered:** D174 Part B (P47's rules) was not reviewed or approved here; Q21 stays open for it.
