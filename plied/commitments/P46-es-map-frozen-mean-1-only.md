---
id: P46
title: >-
  Es: map frozen; mean 1 only at a fixed position before clipping; clipped and trajectory
  multipliers reported; entrance rationale a hypothesis
wording: >-
  Freeze the floor-area normalization and entrance coordinates. … the formula gives mean multiplier
  1 at a fixed position under the stationary signal, before clipping. Response strength still varies
  spatially. Neither the clipped multiplier nor the multiplier experienced along moving ants'
  trajectories is guaranteed to average 1. Report both, as already required. Treat the entrance
  rationale as a hypothesis; this map was not established by V3b.
summary: Es implementation and its reporting.
made: D159
state: open
nodes: [T033]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. Es does not run.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: Es runs with its frozen map (D164 md5s); no multiplier is reported from a timing run.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: satisfied
    because: Es map frozen and tested (D164 md5 8b77cc4e for colonyBles.ts, unchanged since).
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: satisfied
    because: Es map frozen and tested (D164); colonyBles.ts md5 8b77cc4e checked unchanged at D172.
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: satisfied
    because: Es map frozen and tested (D164); colonyBles.ts md5 8b77cc4e checked unchanged at D172.
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: satisfied
    because: >-
      Es map frozen and tested (D164); colonyBles.ts md5 8b77cc4e unchanged; multipliers are
      reported at reading.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      Es map frozen and tested (D164), colonyBles.ts 8b77cc4e unchanged; runs carry --oracleTrace so
      the clipped and trajectory multipliers can be reported at reading.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Es map unchanged (colonyBles.ts 8b77cc4e); --oracleTrace on every member run records the
      clipped and pre-clip multipliers for reporting.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: Es map unchanged; --oracleTrace kept on every member run.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: satisfied
    because: >-
      D184 reports Es's clipped and trajectory multipliers (applied 0.33, before clipping 0.52,
      clipped 94 %; F100) and keeps the entrance rationale a hypothesis.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: satisfied
    because: Es's multipliers are reported (D184, F100); capfiles changes none.
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: satisfied
    because: >-
      Es's clipped and trajectory multipliers are reported for the 2b runs (D185's descriptive rows)
      beside D184's.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
---

## History
- 2026-10-25 04:19 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:25 UTC lead (session 0bcdd30b): reviewed D160: the recheck runs base only, without Es; Es's map and reporting are untouched.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. Es's map and its reporting are untouched.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. Es does not run.
- 2026-10-25 18:11 UTC lead (session fe835760): reviewed D163: it reads the water-start recheck at C2 base, with no driver or Es member and no clipping; the multiplier reporting this asks for is untouched.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: Es is built with its map normalised over the nest floor and E[g | x] = 1 checked by Monte Carlo in test/partD.test.ts. Whether the frozen map and entrance coordinates match D159's wording is for the Stage 2 freeze; still open.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: Es's map and normalisation are not touched.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — Es runs with its frozen map (D164 md5s); no multiplier is reported from a timing run.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: Es map unchanged; its multipliers are reported in Stage 2 readings.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: satisfied — Es map frozen and tested (D164 md5 8b77cc4e for colonyBles.ts, unchanged since).
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: satisfied — Es map frozen and tested (D164); colonyBles.ts md5 8b77cc4e checked unchanged at D172.
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: satisfied — Es map frozen and tested (D164); colonyBles.ts md5 8b77cc4e checked unchanged at D172.
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: satisfied — Es map frozen and tested (D164); colonyBles.ts md5 8b77cc4e unchanged; multipliers are reported at reading.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173 (and D174/D175): Es calibrated at strength 3 (verified 4.21); its clipped and trajectory multipliers are owed before commit or publication (D173). The map itself is unchanged. Still open.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: Es's map and normalisation are untouched; its clipped and trajectory multipliers are still owed. Open.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: Es's multipliers still owed. Open.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: Es's multipliers still owed. Open.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — Es map frozen and tested (D164), colonyBles.ts 8b77cc4e unchanged; runs carry --oracleTrace so the clipped and trajectory multipliers can be reported at reading.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Es map unchanged (colonyBles.ts 8b77cc4e); --oracleTrace on every member run records the clipped and pre-clip multipliers for reporting.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Es map unchanged; --oracleTrace kept on every member run.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: satisfied — D184 reports Es's clipped and trajectory multipliers (applied 0.33, before clipping 0.52, clipped 94 %; F100) and keeps the entrance rationale a hypothesis.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: satisfied — Es's multipliers are reported (D184, F100); capfiles changes none.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: Es's clipping (D184, F100) is carried as a disclosure and the 2b multipliers are reported; unaffected
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: satisfied — Es's clipped and trajectory multipliers are reported for the 2b runs (D185's descriptive rows) beside D184's.
