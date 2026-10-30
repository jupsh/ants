---
id: P42
title: >-
  Stages 1-3: a shared-signal member with a spatially varying response, its map specified before it
  runs, on the common mapping and observer
wording: >-
  The driver family needs a bounded member with one shared temporal signal and spatially varying
  response strength. Specify that response map before running it, and use the same behavioural
  mapping and observation pipeline as the transmission family.
summary: The V3b alternative as a model member, not the synthetic generator.
made: D157
state: open
nodes: [T033]
links: [D158]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. The shared-signal member does not run.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: satisfied
    because: >-
      Es's map frozen in D158/D159 (lambda 20 mm, entrance (35, 40) mm), implemented and tested in
      D164 (P46); the bench runs it under mapping M with the same observer as the transmission
      family.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: satisfied
    because: Es's map frozen (D158/D159) and implemented (D164).
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: satisfied
    because: >-
      Es's map frozen (D158/D159) and implemented (D164); colonyBles.ts md5 8b77cc4e checked
      unchanged at D172.
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: satisfied
    because: >-
      Es's map frozen (D158/D159) and implemented (D164); colonyBles.ts md5 8b77cc4e checked
      unchanged at D172.
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: satisfied
    because: >-
      Es's response map was specified (D158/D159) and implemented (D164) before it runs;
      colonyBles.ts md5 8b77cc4e checked unchanged at D172.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      Es's map specified (D158/D159) and implemented (D164); colonyBles.ts md5 8b77cc4e checked
      unchanged today.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Es map specified and implemented before running; colonyBles.ts 8b77cc4e locally and box
      checksums match local (setup).
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: Es map unchanged (colonyBles.ts 8b77cc4e); setup compares checksums with local.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: satisfied
    because: Es's map as frozen (D158/D159) and implemented (D164); colonyBles.ts unchanged since.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: not-applicable
    because: No member runs; Es's map is unchanged.
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: satisfied
    because: Es as frozen; its clipping disclosed (D184) and its 2b multipliers reported.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
---

## History
- 2026-10-25 04:09 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 specifies Es: Eu's shared OU signal with an entrance-gradient response map (lambda 20 mm, mean 1) under M, before any run [confirm]
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: Es and the entrance map (lambda 20 mm, floor-area normalisation) are approved and to be frozen in the implementation; the rationale is a hypothesis (P46). Still open until Es runs on the common mapping and observer.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. The shared-signal member is untouched.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. The shared-signal member does not run.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: it lifts the Q03 hold on Stage 2a but runs no Stages 1-3 member and touches no member, diagnostic or assessment row this governs. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: the build supplies Es, the shared-signal member with a spatially varying response this asks for; its map is built and tested, run only after the Stage 2 freeze (and Q18).
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: no change to Es or its map; Es is one of the members the forecast precedes (P56).
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: Es is not simulated or forecast separately; its spread is among the members the proxies may not forecast (15 rows unresolved).
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: satisfied — Es's map frozen in D158/D159 (lambda 20 mm, entrance (35, 40) mm), implemented and tested in D164 (P46); the bench runs it under mapping M with the same observer as the transmission family.
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: Es timed (arm factor 1.49) at strength 2; its map unchanged, nothing read from it.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: Es is calibrated in Stage 2a with its frozen map.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: satisfied — Es's map frozen (D158/D159) and implemented (D164).
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: satisfied — Es's map frozen (D158/D159) and implemented (D164); colonyBles.ts md5 8b77cc4e checked unchanged at D172.
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: satisfied — Es's map frozen (D158/D159) and implemented (D164); colonyBles.ts md5 8b77cc4e checked unchanged at D172.
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: satisfied — Es's response map was specified (D158/D159) and implemented (D164) before it runs; colonyBles.ts md5 8b77cc4e checked unchanged at D172.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D158/T033): Es, the driver member with the shared signal and spatially varying response, calibrated (D173) through the common mapping and observer. No change to its map. Unaffected.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: Es enters the capability datasets at its D173 strength with its frozen map; nothing about its response map changes. Unaffected.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: Es's map untouched; Es stays a required D member in the counts. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: Es's map untouched. Unaffected.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — Es's map specified (D158/D159) and implemented (D164); colonyBles.ts md5 8b77cc4e checked unchanged today.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Es map specified and implemented before running; colonyBles.ts 8b77cc4e locally and box checksums match local (setup).
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Es map unchanged (colonyBles.ts 8b77cc4e); setup compares checksums with local.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: satisfied — Es's map as frozen (D158/D159) and implemented (D164); colonyBles.ts unchanged since.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: not-applicable — No member runs; Es's map is unchanged.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: cites D158 for the rows; Es's map unchanged; unaffected
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: satisfied — Es as frozen; its clipping disclosed (D184) and its 2b multipliers reported.
- 2026-10-30 05:35 UTC lead (session 9d2b15e6): reviewed D194: Es (the bounded shared-signal member with a spatially varying response) was assessed under mapping M and the same observer as T; it does not reproduce (5 of 20 equivalent; S3 unresolved; 94 % clipped). P42's build requirement is met; its member is carried into Stage 3b. Stays open until the capability reading.
