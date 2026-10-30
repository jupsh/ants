---
id: P48
title: >-
  Stages 1-3 capability: independent datasets at the intended size, error rates and power per pair,
  separate draws, frozen first; Es never drops out; the failure wording
wording: >-
  For a genuine capability claim, evaluate independent simulated datasets at the intended sample
  size, reporting false-positive behaviour and power across every required T–D pair. Use separate
  draws to choose and check the threshold. Freeze the procedure before inspecting assessment
  separation. If Es cannot calibrate, or a required ratio is undefined, the intended comparison is
  not evaluable; Es must not disappear from the claim by becoming ineligible.
summary: Part of P29's rule, which keeps its own approval.
made: D159
state: open
nodes: [T033]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. No capability claim is made from it.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: No capability evaluation; timing only.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: not-applicable
    because: No capability evaluation in Stage 2a.
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: not-applicable
    because: No capability evaluation in Stage 2a.
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: not-applicable
    because: No capability evaluation in Stage 2a.
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: not-applicable
    because: No capability evaluation in Stage 2a.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      Independent datasets at the intended size (6 per member, 22 x 2), threshold on separate null
      draws, FP and power per pair: procedure fixed (D175-D177), frozen at c before any member
      separation is inspected (P59, P63); Es is calibrated (D173).
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Datasets independent (capSeeds.ts 9ea9474c: arm, run, colony on 0xc4b3; seeds distinct from
      2a/2b, tested), 6 per member at 22 x 2, nulls from a separate base pool; procedure fixed
      D175-D177.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: >-
      Same independent seeds (capSeeds.ts 9ea9474c); results do not depend on the box (seeded runs,
      same Node 22.22.1).
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: No capability verdict is committed; the procedure is frozen (D175-D177) and unrun.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: satisfied
    because: >-
      Independent datasets at the intended size (D176): 6 per calibrated member, 22 colonies × 2
      runs, and the base null pool; the procedure was frozen first (D175-D177).
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: not-applicable
    because: The 2b reading is not the capability test.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
---

## History
- 2026-10-25 04:19 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:25 UTC lead (session 0bcdd30b): reviewed D160: no diagnostic or capability content; untouched.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. The capability procedure is untouched.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. No capability claim is made from it.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: it lifts the Q03 hold on Stage 2a but runs no Stages 1-3 member and touches no member, diagnostic or assessment row this governs. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: no capability claim and no independent datasets; the build is the code such datasets would use. Unaffected.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: capability procedure untouched; it keeps its approval under P29.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — No capability evaluation; timing only.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: capability procedure unchanged; it stays under P29's approval.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: not-applicable — No capability evaluation in Stage 2a.
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: not-applicable — No capability evaluation in Stage 2a.
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: not-applicable — No capability evaluation in Stage 2a.
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: not-applicable — No capability evaluation in Stage 2a.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173 (and D174/D175): Es calibrates (D173), so 'Es must not disappear' holds. D175 specifies the capability procedure P48 asks for: K = 6 independent cap datasets per member, false-positive rate from the same-member check, power per T-D pair, threshold chosen on nulls and checked on separate draws (P59-P62). Not yet built, frozen or run: still open.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: independent datasets (no seeds shared across members), FP from the same-member check, power per pair, threshold on separate null draws, and Es's 'not evaluable' path are now in code; frozen only once c is frozen, and not run. Open.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: the procedure's counting with non-evaluable datasets, the S3_2 colony rule and the fallback alpha are now fixed by the user; still to be frozen at c and run. Open.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: Part B concerns assessment rows; the capability procedure is unchanged. Open.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — Independent datasets at the intended size (6 per member, 22 x 2), threshold on separate null draws, FP and power per pair: procedure fixed (D175-D177), frozen at c before any member separation is inspected (P59, P63); Es is calibrated (D173).
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Datasets independent (capSeeds.ts 9ea9474c: arm, run, colony on 0xc4b3; seeds distinct from 2a/2b, tested), 6 per member at 22 x 2, nulls from a separate base pool; procedure fixed D175-D177.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Same independent seeds (capSeeds.ts 9ea9474c); results do not depend on the box (seeded runs, same Node 22.22.1).
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — No capability verdict is committed; the procedure is frozen (D175-D177) and unrun.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: satisfied — Independent datasets at the intended size (D176): 6 per calibrated member, 22 colonies × 2 runs, and the base null pool; the procedure was frozen first (D175-D177).
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: cites D159 for the 2b rules only; the capability procedure is unaffected
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: not-applicable — The 2b reading is not the capability test.
