---
id: P44
title: >-
  Stages 1-3: no transmission-versus-driver conclusion without a capability test through the
  observer; indistinguishable is a valid outcome
wording: >-
  Before promising a transmission-versus-driver conclusion, specify a bounded diagnostic and test
  whether it distinguishes the competing simulated mechanisms through the actual observer, including
  the spatially varying shared response. … If the available measurements cannot distinguish them,
  "these mechanisms remain indistinguishable with these observations" is a valid outcome, with
  concrete additional measurements proposed.
summary: Gate on any mechanism claim.
made: D157
state: open
nodes: [T033]
links: [D158]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. No transmission-versus-driver conclusion is drawn
      from it.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: No reading and no mechanism claim (D168).
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: not-applicable
    because: No conclusion is drawn from a rental or calibration.
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: not-applicable
    because: No conclusion is drawn from a rental or calibration.
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: not-applicable
    because: No conclusion is drawn from a rental or calibration.
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: not-applicable
    because: No transmission-versus-driver conclusion is drawn from calibration.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      The bounded capability test through the actual observer is specified (D175-D177) and built
      (D176); these runs are its datasets. No conclusion is drawn by renting.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      These runs are the specified capability test's datasets through the frozen tracker
      (tmpShortSim 6c85d31c, as D172); no conclusion before c is frozen and the checks pass.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: The relaunched runs are the same specified capability datasets; no conclusion drawn by switching.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: >-
      No transmission-versus-driver conclusion is committed; the capability test is built (D176) and
      unrun on its reader.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: satisfied
    because: >-
      These files are the capability test through the actual observer (D175); no conclusion before c
      is frozen and the checks pass.
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: satisfied
    because: The 2b reading draws no transmission-versus-driver conclusion; that waits on the capability test.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
---

## History
- 2026-10-25 04:09 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 makes discrimination conditional on a simulation-only capability test of (R, S3-2, R_J); failure gives the indistinguishable outcome with the measurement list
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: the failure wording is replaced ('The specified diagnostic did not distinguish all tested transmission and driver members at this sample size.') and capability needs independent datasets (P48).
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. The capability gate is untouched.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. No transmission-versus-driver conclusion is drawn from it.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: it lifts the Q03 hold on Stage 2a but runs no Stages 1-3 member and touches no member, diagnostic or assessment row this governs. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: no diagnostic was specified or tested; the build adds members only. Unaffected.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: the capability gate keeps its own approval (item 4); nothing in D165 bears on a mechanism claim.
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: nothing on the capability gate or a mechanism claim.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — No reading and no mechanism claim (D168).
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: cost basis only; no mechanism claim.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: D171 cites the capability test as the reason to proceed; its gate and wording are unchanged.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: not-applicable — No conclusion is drawn from a rental or calibration.
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: not-applicable — No conclusion is drawn from a rental or calibration.
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: not-applicable — No conclusion is drawn from a rental or calibration.
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: not-applicable — No transmission-versus-driver conclusion is drawn from calibration.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D158/T033): D175 approves the bounded diagnostic test (M^2 on R, S3_2, R_J; every calibrated T x D pair, Es included, through the frozen tracker), with D159's 'did not distinguish' wording as a valid outcome. Specified, not yet tested: still open.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the bounded capability test is now built (scripts/capability.ts, partDCap.ts) with the D159 failure wording in the reader; not run. Still open.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: the capability rule is now complete (D175 + D176 confirmed); still not run. Open.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: the capability rule is unchanged by Part B; still not run. Open.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — The bounded capability test through the actual observer is specified (D175-D177) and built (D176); these runs are its datasets. No conclusion is drawn by renting.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — These runs are the specified capability test's datasets through the frozen tracker (tmpShortSim 6c85d31c, as D172); no conclusion before c is frozen and the checks pass.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — The relaunched runs are the same specified capability datasets; no conclusion drawn by switching.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — No transmission-versus-driver conclusion is committed; the capability test is built (D176) and unrun on its reader.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: satisfied — These files are the capability test through the actual observer (D175); no conclusion before c is frozen and the checks pass.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: the 2b reader draws no transmission-versus-driver conclusion; unaffected
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: satisfied — The 2b reading draws no transmission-versus-driver conclusion; that waits on the capability test.
- 2026-10-30 05:35 UTC lead (session 9d2b15e6): reviewed D194: D194 draws no transmission-versus-driver conclusion and says question 2 waits on the capability test; F103 cites P44 for the same reason. Not yet fulfilled: governs the Stage 3b reading.
