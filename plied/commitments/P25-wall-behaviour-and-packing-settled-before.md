---
id: P25
title: Wall behaviour and packing settled before any spatial coupling
wording: wall behaviour and packing settled before any spatial coupling
summary: >-
  Applies at Stages 1-3's gate (transmission members are a spatial coupling); whether wall and
  packing are settled (T009 closed, S001) is for that review.
made: D030
state: open
nodes: [T023, T033]
links: [D158, D159]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. Base runs add no spatial coupling.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:54 UTC"
  - action: run:partd-bench-20261026
    disposition: satisfied
    because: >-
      The transmission members are spatial couplings; D159 item 5 accepted P25's disposition for
      these bounded comparisons (settled = closed with failures accepted, P52).
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52).
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: D159 item 5 accepted P25's disposition for these comparisons (P52); no packing change since.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: "D159 item 5 / P52: packing closed with failures accepted for these comparisons; unchanged."
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: "Unchanged since run:partd2b-20261029: P52's disposition holds; no packing arm."
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: A commit adds no spatial coupling; P52's disposition for these comparisons is unchanged.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: not-applicable
    because: No simulation and no spatial coupling is added; the audits only measure existing runs.
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: satisfied
    because: P52's disposition is carried as a disclosure in the reading (D185); no spatial coupling added.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
  - action: run:t057-judge-20261030
    disposition: not-applicable
    because: Governs spatial coupling; the judge adds no spatial coupling (no oracle, no coupling arm)
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
  - action: run:partdcap-nulls
    disposition: not-applicable
    because: nulls adds no spatial coupling; it computes c from base-arm runs only (D176)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:36 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partdcap-same
    disposition: not-applicable
    because: the check adds no spatial coupling; it compares stored datasets of members already run (D176)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:47 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partdcap-cross
    disposition: not-applicable
    because: cross adds no spatial coupling; it compares stored datasets of members already run (D176)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:56 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partddesc
    disposition: not-applicable
    because: no spatial coupling added; a descriptive over stored runs (D202)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 18:08 UTC"
    inputs:
      - record: D202
        rev: 97916663a5b52f993397cc2e3ac2c9edb295a2193d1d44d74c54c1220764a0b3
  - action: run:partdblocks
    disposition: not-applicable
    because: no spatial coupling added; a descriptive over stored runs (D207)
    by: lead (session 20261030)
    at: "2026-10-30 21:10 UTC"
    inputs:
      - record: D207
        rev: 8f6f241d26d437df775bce00a27ef04f216e12facb2569dc025e87ee3c8f9396
  - action: run:partdblocks-2
    disposition: not-applicable
    because: no spatial coupling added; D207's amendment changes file loading only
    by: lead (session 20261030)
    at: "2026-10-30 21:22 UTC"
    inputs:
      - record: D207
        rev: 9a55da1c62b45147ecc27069e9c2373aa6a0813e34155338fc0296b3db5c4202
  - action: run:partdblocks
    disposition: not-applicable
    because: >-
      re-read after D207's amendment: this run crashed (the machine ran out of memory) before
      writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed
      separately
    by: lead (session 20261030)
    at: "2026-10-30 21:23 UTC"
    inputs:
      - record: D207
        rev: 9a55da1c62b45147ecc27069e9c2373aa6a0813e34155338fc0296b3db5c4202
  - action: run:partdblocks-3
    disposition: not-applicable
    because: no spatial coupling added; a descriptive over stored runs
    by: lead (session 20261030)
    at: "2026-10-30 21:33 UTC"
    inputs:
      - record: D207
        rev: 8ba0cb4f72b4208a701139a480d5c5be0d67b3e8f9ff83864a421d081410fcfd
  - action: run:partdblocks-2
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside
      unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3,
      disposed separately
    by: lead (session 20261030)
    at: "2026-10-30 21:33 UTC"
    inputs:
      - record: D207
        rev: 8ba0cb4f72b4208a701139a480d5c5be0d67b3e8f9ff83864a421d081410fcfd
  - action: run:partdblocks
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 2: this first run crashed on memory before writing any output and
      nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and
      run:partdblocks-3
    by: lead (session 20261030)
    at: "2026-10-30 21:34 UTC"
    inputs:
      - record: D207
        rev: 8ba0cb4f72b4208a701139a480d5c5be0d67b3e8f9ff83864a421d081410fcfd
  - action: run:partdblocks-4
    disposition: not-applicable
    because: no spatial coupling added; a descriptive over stored runs
    by: lead (session 20261030)
    at: "2026-10-30 21:44 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 3: this first run crashed on memory before writing any output and
      nothing was read; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks-2
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside
      unread; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: run:partdblocks-3
    disposition: not-applicable
    because: >-
      re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing
      was read; superseded by run:partdblocks-4
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
    inputs:
      - record: D207
        rev: 72fe3a177216140b402fbd9675c64f8d4de2d198d87f23f2a0855df7473103ed
  - action: commit:partd-1a-20261030
    disposition: not-applicable
    because: No spatial coupling and no packing arm in this commit (records and the implementer setup only).
    by: lead (session 108deea8)
    at: "2026-10-30 22:06 UTC"
  - action: run:triggers-build-smoke
    disposition: not-applicable
    because: No spatial coupling or model change; recorded tracks only.
    by: lead (session 108deea8)
    at: "2026-10-30 22:42 UTC"
  - action: run:triggers-amend2
    disposition: not-applicable
    because: >-
      No simulation, member, model, spatial coupling or box: a scratch-script change to the item
      1(b) analysis, synthetic checks and a 2-colony smoke rerun.
    by: lead (session 108deea8)
    at: "2026-10-31 00:20 UTC"
  - action: run:triggers-cal-full
    disposition: not-applicable
    because: >-
      No simulation, member, model, spatial coupling or box: a 100-seed synthetic calibration and
      the per-colony pass over recorded tracks, both local.
    by: lead (session 108deea8)
    at: "2026-10-31 00:37 UTC"
  - action: run:triggers-quorum
    disposition: not-applicable
    because: >-
      Synthetic data only: a frame dump from the synthetic generator and an independent
      implementation run on it; no simulation of the ant model, no box.
    by: lead (session 108deea8)
    at: "2026-10-31 00:41 UTC"
  - action: commit:item1b-design-20261031
    disposition: not-applicable
    because: >-
      The commit changes no src/ file, model parameter, Es map or box state: records and process
      docs only.
    by: lead (session 108deea8)
    at: "2026-10-31 00:42 UTC"
---

## History
- 2026-10-25 00:28 UTC lead (session 7c2d50fd): created — T049 scan review (D144)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: the redesign adds spatial members (transmission and a spatially varying shared response), so this precondition binds the revised design before any of them runs. Still open.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): added D158 to links — D158 puts this precondition to the user at the gate, proposing 'settled as a closed, disclosed limitation' (T009, F027, F078); undecided
- 2026-10-25 04:19 UTC lead (session 0bcdd30b): added D159 to links — the user accepted the disposition for these bounded diagnostic comparisons (D159 item 5): packing closed, its failures accepted as limitations, F078's occupancy and spread carried with the near-share deficit; recorded as the disposition at the Stage 2 gate
- 2026-10-25 04:25 UTC lead (session 0bcdd30b): reviewed D160: it designs the C2 warm-up recheck (D159 item 4), base only, with no spatial member; packing's disposition is untouched.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. Packing is not mentioned; P52's disposition stands.
- 2026-10-25 16:54 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. Base runs add no spatial coupling.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: a water-start recheck at C2 base; it says nothing about wall behaviour or packing (F078 still carried). Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: the build adds spatial coupling members but runs none for assessment; whether wall and packing are settled stays for the Stages 1-3 gate. Unaffected.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: it cites D158/D159 only for the forecast's timing; P25's disposition (accepted in D159, P52) is unchanged.
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D166/D167: precision only; P25's disposition and its carried packing limits are untouched.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: satisfied — The transmission members are spatial couplings; D159 item 5 accepted P25's disposition for these bounded comparisons (settled = closed with failures accepted, P52).
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: cost basis only (via D158); packing disposition untouched.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: no packing change; disposition as D159.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52).
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52); no change since.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D158/D159/T033): calibration and the capability/support rules do not touch wall behaviour or packing; P52 still states what 'settled' means for Stages 1-3. Unaffected.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: a statistics build on the existing spatial members; no wall or packing change. Unaffected.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: no wall or packing change. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: no wall or packing change. Unaffected.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — D159 item 5 accepted P25's disposition for these comparisons (P52); no packing change since.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — D159 item 5 / P52: packing closed with failures accepted for these comparisons; unchanged.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Unchanged since run:partd2b-20261029: P52's disposition holds; no packing arm.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — A commit adds no spatial coupling; P52's disposition for these comparisons is unchanged.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: not-applicable — No simulation and no spatial coupling is added; the audits only measure existing runs.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: P25/P52's disposition is carried as a disclosure in the 2b reader; unaffected
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: satisfied — P52's disposition is carried as a disclosure in the reading (D185); no spatial coupling added.
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: not-applicable — Governs spatial coupling; the judge adds no spatial coupling (no oracle, no coupling arm)
- 2026-10-30 05:37 UTC lead (session 9d2b15e6): reviewed D194: D194 carries P52's meaning of 'settled' (closed with failures accepted, F078 with the near-share deficit) as a disclosure and adds no spatial coupling; the coupling arms were the ones gated at D158/D159. Unaffected.
- 2026-10-30 17:36 UTC lead (session 9d2b15e6): review for run:partdcap-nulls: not-applicable — nulls adds no spatial coupling; it computes c from base-arm runs only (D176)
- 2026-10-30 17:47 UTC lead (session 9d2b15e6): review for run:partdcap-same: not-applicable — the check adds no spatial coupling; it compares stored datasets of members already run (D176)
- 2026-10-30 17:56 UTC lead (session 9d2b15e6): review for run:partdcap-cross: not-applicable — cross adds no spatial coupling; it compares stored datasets of members already run (D176)
- 2026-10-30 17:58 UTC lead (session 9d2b15e6): reviewed D200: it cites D158 for Stage 3c; no spatial coupling added by the capability step. Unaffected.
- 2026-10-30 18:08 UTC lead (session 9d2b15e6): review for run:partddesc: not-applicable — no spatial coupling added; a descriptive over stored runs (D202)
- 2026-10-30 20:51 UTC lead (session 20261030): reviewed D205: it cites D158 for the stopping rule and lead items; it adds no spatial coupling (within-colony density and re-runs are listed as new designs, not run). Unchanged
- 2026-10-30 21:10 UTC lead (session 20261030): review for run:partdblocks: not-applicable — no spatial coupling added; a descriptive over stored runs (D207)
- 2026-10-30 21:22 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — no spatial coupling added; D207's amendment changes file loading only
- 2026-10-30 21:23 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207's amendment: this run crashed (the machine ran out of memory) before writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed separately
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — no spatial coupling added; a descriptive over stored runs
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3, disposed separately
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 2: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and run:partdblocks-3
- 2026-10-30 21:44 UTC lead (session 20261030): review for run:partdblocks-4: not-applicable — no spatial coupling added; a descriptive over stored runs
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 3: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside unread; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing was read; superseded by run:partdblocks-4
- 2026-10-30 22:06 UTC lead (session 108deea8): review for commit:partd-1a-20261030: not-applicable — No spatial coupling and no packing arm in this commit (records and the implementer setup only).
- 2026-10-30 22:42 UTC lead (session 108deea8): review for run:triggers-build-smoke: not-applicable — No spatial coupling or model change; recorded tracks only.
- 2026-10-31 00:20 UTC lead (session 108deea8): review for run:triggers-amend2: not-applicable — No simulation, member, model, spatial coupling or box: a scratch-script change to the item 1(b) analysis, synthetic checks and a 2-colony smoke rerun.
- 2026-10-31 00:37 UTC lead (session 108deea8): review for run:triggers-cal-full: not-applicable — No simulation, member, model, spatial coupling or box: a 100-seed synthetic calibration and the per-colony pass over recorded tracks, both local.
- 2026-10-31 00:41 UTC lead (session 108deea8): review for run:triggers-quorum: not-applicable — Synthetic data only: a frame dump from the synthetic generator and an independent implementation run on it; no simulation of the ant model, no box.
- 2026-10-31 00:42 UTC lead (session 108deea8): review for commit:item1b-design-20261031: not-applicable — The commit changes no src/ file, model parameter, Es map or box state: records and process docs only.
