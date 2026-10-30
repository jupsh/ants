---
id: D196
date: 2026-10-30
time: 17:40
kind: design
title: Part D Stage 3b capability: c frozen on the nulls (P59; D175, D176): c = 9.282 (95th percentile of M² over 10,000 null pairs, all evaluable, none by fallback); fallback α tightened to 0.025/3 (false positives 4.4 %, from 7.0 % at 0.05/3; P62); null plausibility shown (P61): R and R_J consistent with base, null S3₂ centred at 0.014 against Part C base's 0.085; no member output read
---
- **2026-10-30 ≈ 17:40 UTC — Part D Stage 3b capability: c frozen on the nulls (P59; D175, D176): c = 9.282 (95th percentile of M² over 10,000 null pairs, all evaluable, none by fallback); fallback α tightened to 0.025/3 (false positives 4.4 %, from 7.0 % at 0.05/3; P62); null plausibility shown (P61): R and R_J consistent with base, null S3₂ centred at 0.014 against Part C base's 0.085; no member output read.**
  - **What:** the first step of D175 item 6's order (P59). c is frozen on synthetic nulls built only from the base
    pool, before any member's capability output is read. Authorised by the user in conversation: "yes" to the lead's
    "Then go ahead with the nulls and the freeze of c?"
  - **Run:** `partDCap.ts nulls` (md5 `fa55d891`, and `scripts/capability.ts` `d178256e`, both as D176), run
    `partdcap-nulls-20261030T173634Z`, gated `run:partdcap-nulls` with dispositions pinned to D175, D176 and D194. Exit 0
    after ≈ 3 min. Output `logs/partd2/cap/nulls.json` (md5 `d0d80c20`), written once. It read the base pool's 352 runs
    (16 per colony, D176) and no member file.
  - **Frozen (D175 items 3 and 4, D176 gap 3):**
    - **c = 9.2824**, the 95th percentile of M² over 10,000 null pairs (seed 0xca90): 10,000 evaluable, 0 by the fallback.
      Every null dataset had all 22 colonies estimable. The rule's false-positive rate on the nulls is 0.050 by
      construction. The χ²₃ value would be 7.81, and D176's synthetic check gave ≈ 8.5, so c is wider than both, as D176
      expected for bootstrap covariances at 22 colonies.
    - **Fallback α = 0.025/3** (two-sided, per coordinate). False-positive rates on the same nulls (P62): 0.05/3 →
      7.03 %; **0.025/3 → 4.40 %**; 0.01/3 → 2.41 %; 0.005/3 → 1.37 %; 0.001/3 → 0.83 %. The first rung at or under 5 % is
      0.025/3, by D176 gap 3's ladder. No null pair needed the fallback.
    - Condition number: log10 mean 2.33 (5–95 % 2.06–2.60), i.e. a few hundred, far from the 1e8 fallback trigger.
  - **Null plausibility (P61; D175 item 3: the null's joint (R, S3₂, R_J) against the pool's and Part C base's
    per-colony values).** Dataset-level θ over the 20,000 null datasets, then per-colony values (pool: 176 = 8 disjoint
    pairs × 22; Part C base: 22):

    | quantity | null datasets, mean [5 %, 95 %] | pool per colony, mean [5 %, 95 %] | Part C base per colony, mean [5 %, 95 %] |
    |---|---|---|---|
    | R = C(20–40) / C(< 5) | −0.0446 [−0.0552, −0.0341] | (from below) −0.0445 | (from below) −0.0522 |
    | C(< 5 mm) | — | 0.0643 [0.0373, 0.0955] | 0.0661 [0.0396, 0.0945] |
    | C(20–40 mm) | — | −0.0029 [−0.0067, 0.0004] | −0.0035 [−0.0070, −0.0011] |
    | R_J | −0.0254 [−0.0392, −0.0115] | (from below) −0.0253 | not available (Part C has no J draws per colony) |
    | S2-J < 5 mm | — | 0.0450 [0.0260, 0.0653] | — |
    | S2-J 20–40 mm | — | −0.0011 [−0.0042, 0.0019] | — |
    | S3₂ | 0.0145 [−0.0407, 0.0701] | 0.0139 [−0.2404, 0.2614] | 0.0853 [−0.1306, 0.3128] |

    (The "from below" R values are ratios of the per-colony means, R's own definition; 5–95 % ranges for per-colony
    values are between colonies.) Correlations across null datasets: R–R_J 0.91, R–S3₂ −0.01, R_J–S3₂ −0.04.
    - **Reading (descriptive, no rule):** R, R_J and the band components of the null agree with both base references. In
      S3₂ the null's spread is like Part C base's: 90 % range of null datasets 0.111 wide, against Part C base's 95 % CI
      [0.028, 0.146] (D130), 0.118 wide. **Its location is not:** Part C base's dataset S3₂ (0.085) is above the null
      datasets' 95th percentile (0.070). The Stage 2b base draw (D194's gate-G descriptive: 0.019) sits near the null's
      centre. c depends on differences between null datasets, so on spread, not on location, and the null is judged a
      plausible stand-in for freezing c.
    - **Disclosure, bearing on F092:** Stage 0's gate G (D130) failed against this same Part C base S3₂ of +0.085.
      Two later base draws give 0.014 (the pool) and 0.019 (Stage 2b). This entry does not re-judge D130: its failed gate
      stays on record (P43). Whether Part C's base draw sat in the upper tail by chance or differs in some setting is not
      examined here.
  - **Process:** the freeze has no gate of its own, because plied's `checks.action_kinds` has no freeze kind. The
    `run:partdcap-nulls` dispositions of P59, P61 and P62 name the freeze entry. The members' capability outputs stay
    sealed (P63) and their paths stay in `.claude/sealed-paths.txt` until the same-member check is started. The B017
    patch (D195, 17:38 UTC, another lead session) landed while the nulls ran. It changes only
    `src/sim/physics/antPhysics.ts` and `src/sim/world/field.ts`. `rng.ts`, `capability.ts`, `capSeeds.ts`,
    `s2Audit.ts` and `s2AuditGate.ts` are unchanged (git diff), and the nulls read stored files, so the result is
    unaffected.
  - **Next (P59):** `partDCap.ts same --frozen D196`, gated as `run:partdcap-same`. If it fails, the result returns to
    the user before any cross-member value exists. Held for the user's word, given the S3₂ point above.
- **2026-10-30 ≈ 17:48 UTC — Correction (user, D197).** The spread comparison above sets the null datasets' 90 % range
  (0.111 wide) beside Part C base's 95 % CI (0.118 wide, D130). They are different quantities at different levels, so
  their similar widths are only rough reassurance, not evidence of equal spread. The freeze is unchanged: c rests on
  differences between null datasets, and the user found no configuration mismatch between the two runners (C2's fit,
  light phase, 2 h warm-up, 4 h observation, dt 0.05), which does not establish why Part C's draw ran high.
