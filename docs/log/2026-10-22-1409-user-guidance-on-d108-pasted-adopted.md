---
id: D109
date: 2026-10-22
time: 14:09
kind: review
title: User guidance on D108, pasted, adopted: Part B's pass rule revised before running (explicit matching check, equivalence for robustness, row-level reporting, coverage-limited conclusions); Part A and C wording corrected
---
- **2026-10-22 ≈ 14:09 UTC — User guidance on D108, pasted, adopted: Part B's pass rule revised before running (explicit matching check, equivalence for robustness, row-level reporting, coverage-limited conclusions); Part A and C wording corrected.**
  - **Guidance (pasted by the user; reviewer read D108 and `oracleStep`; nothing changed or ran; no held-out data
    inspected), adopted in full.** The verdict: "Part B is useful, but D108's proposed pass rule would not yet justify
    clearing the freeze requirement." The points:
    1. "Mean-one" is not mean-matched: the coupled multiplier is a clipped ratio of two activity averages, and its mean
       is not constrained to 1. Matching log-SD alone leaves differences in distribution and temporal structure.
       Verify the matching explicitly; otherwise call it an oracle-versus-placebo stress test, without attributing
       the whole difference to sharing.
    2. Failure to detect sensitivity is not evidence of insensitivity. Keep the detection rule, but claim robustness
       only by equivalence (a paired CI wholly inside a prespecified tolerance); anything else is unresolved.
       Bootstrap matched colonies across arms, preserving their seed pairing.
    3. An unchanged failure count can hide offsetting changes: report row identities and shifts. Allowing two
       sensitive rows regardless of magnitude needs a justification that the adequacy allowance does not give.
    4. The conclusion must match the coverage. B1 should establish whether the perturbation reaches the relevant
       synchrony levels for the groups and windows judged. Even an overshoot does not show that this artificial
       mechanism bounds every plausible one. B2 can support robustness of the 36 rows to this perturbation only;
       stays and contacts-versus-density stay explicit scope decisions before step 9.
    5. Part A supports uncertainty about cause, not harmlessness of omission: "Existing investigations have not
       identified a mechanism sufficiently to adopt it." Part C could show a sufficient mechanism or test diagnostic
       power. One local-coupling implementation succeeding or failing would not by itself distinguish propagation from
       local external drivers.
    - Recommendation: B1 / B2 with a narrower interpretation and an explicit unresolved outcome, then the user's freeze
      decision. A passing diagnostic informs that decision; it does not by itself make the omission defensible.
  - **Applied:** D108 amendment 1 (in D108's file, dated): Part A and Part C wording corrected in place; Part B's
    readings replaced before anything was built or run.
