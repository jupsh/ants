---
id: P50
title: >-
  Stages 1-3 box: bench settings frozen, then measured runtime, resources and cost approved before
  renting
wording: >-
  Proceed with implementation, synthetic checks and a bounded timing benchmark once its settings are
  frozen. Bring the measured runtime, resource assumptions and cost estimate for approval before
  renting.
summary: With docs/BOX.md.
made: D159
state: open
nodes: [T033]
reviews:
  - action: run:q03-recheck-20261025
    disposition: not-applicable
    because: >-
      This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism,
      no spatial coupling, no assessment rows. It runs locally (15 cores); no box.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:55 UTC"
  - action: run:partd-bench-20261026
    disposition: acting
    because: >-
      This action is P50's bench: settings frozen in D168 before it runs (md5 bcf855f5 for the
      driver; code md5s as D164). Its runtime, resources and cost go to the user before any rental.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: satisfied
    because: >-
      Bench frozen (D168) and run; measured runtime, resources and cost brought in D169, offers
      rechecked; the user approved offer 51326867 with its estimate (D172).
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: satisfied
    because: >-
      Bench frozen (D168) and run; measured runtime, resources and cost in D169; offers refreshed
      after 51326867 failed to start, and the user approved offer 56637446 with its estimate (D172
      amendment).
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: satisfied
    because: >-
      Bench frozen (D168), measured (D169); the user approved the offer and its estimate before
      renting (D172 and its amendment).
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      Measured runtime basis (D169 bench, D172 speed), resources and cost (3,256 runs, $1.38-1.68)
      put to the user, who approved offer 50186808 (D179) before renting.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Rental approved by the user (D179) on the measured estimate; box shows 29 jobs, not 31 (about
      7 % longer, about $1.48-1.80), reported to the user.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: >-
      The failure, the remaining work, the new estimate ($1.05-1.74 on 48597476, about $2.5-3.2 in
      all, above D179's approval) and the offer went to the user, who approved the switch (D180)
      before renting.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: A commit rents nothing.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: not-applicable
    because: Local run; nothing rented.
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: not-applicable
    because: Local run; nothing rented.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
  - action: run:partdcap-nulls
    disposition: not-applicable
    because: local run on fetched files; no rental
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:36 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partdcap-same
    disposition: not-applicable
    because: local run on fetched files; no rental
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:47 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partdcap-cross
    disposition: not-applicable
    because: local run on fetched files; no rental
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:56 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partddesc
    disposition: not-applicable
    because: local, seconds to minutes; no rental
    by: lead (session 9d2b15e6)
    at: "2026-10-30 18:08 UTC"
    inputs:
      - record: D202
        rev: 97916663a5b52f993397cc2e3ac2c9edb295a2193d1d44d74c54c1220764a0b3
  - action: run:partdblocks
    disposition: not-applicable
    because: local, about a minute; no box (D207)
    by: lead (session 20261030)
    at: "2026-10-30 21:10 UTC"
    inputs:
      - record: D207
        rev: 8f6f241d26d437df775bce00a27ef04f216e12facb2569dc025e87ee3c8f9396
  - action: run:partdblocks-2
    disposition: not-applicable
    because: local (peak about 0.5 GB per file after D207's amendment, about 20-40 min); no box
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
    because: local, about 10 min, peak about 330 MB; no box
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
    because: local, about 10 min, peak about 330 MB; no box
    by: lead (session 20261030)
    at: "2026-10-30 21:45 UTC"
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
    because: No box rented; partDBlocks ran locally (D210).
    by: lead (session 108deea8)
    at: "2026-10-30 22:07 UTC"
---

## History
- 2026-10-25 04:19 UTC lead (session 0bcdd30b): created
- 2026-10-25 04:25 UTC lead (session 0bcdd30b): reviewed D160: the recheck is local (run.sh on T015), no box; the bench-before-rental rule is untouched.
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves the Q03 recheck design (T015) and confirms Stage 1 may proceed now, Stage 2a after the recheck reading; it mentions T033 only for that order. The recheck runs locally; the box bench and its approval are untouched.
- 2026-10-25 16:55 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: not-applicable — This run is the Q03 water-init recheck at C2 base (T015): no Stages 1-3 member, no mechanism, no spatial coupling, no assessment rows. It runs locally (15 cores); no box.
- 2026-10-25 18:12 UTC lead (session fe835760): reviewed D163: the recheck ran locally (1 h 12 min, 44 runs); no box rental and no change to the bench-before-rental order this sets. Unaffected.
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: implementation and synthetic checks are done; the next step it names is freezing the bounded timing benchmark's settings, then bringing the measured cost for approval. No rental.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: item 4 confirms P50's order: bench settings frozen, then run, measured runtime/resources/cost to the user before rental. New: the bench is a Part D member simulation, so P56's forecast comes first.
- 2026-10-26 01:27 UTC lead (session 0cf57b71): reviewed D167: the forecast is done (P56 fulfilled), so the bench may now be designed and frozen. Q19 (proceed as designed?) bears on whether a rental follows; the bench's runtime/resources/cost go to the user either way.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: acting — This action is P50's bench: settings frozen in D168 before it runs (md5 bcf855f5 for the driver; code md5s as D164). Its runtime, resources and cost go to the user before any rental.
- 2026-10-26 02:38 UTC lead (session 0cf57b71): reviewed D169: the bench is done and read: 3,520 runs, 272 reference job-hours; cheapest offer 5.7-9.4 h, $0.90-1.50. Runtime, resources and cost are now with the user for approval before any rental; P50 stays open (acting) until that answer.
- 2026-10-26 03:35 UTC lead (session 0cf57b71): set state=fulfilled; set resolved_by=D171 — bench frozen (D168), run and read (D169); runtime, resources and cost approved for Stage 2a under D170's delegation (D171 item 2). Stage 2b's rental is estimated from the same bench.
- 2026-10-26 03:42 UTC lead (session 0cf57b71): set state=open; cleared resolved_by — reopened: D171 item 2 withdrawn (user, 2026-10-26: 'never rent without explicit approval'); the bench's runtime, resources and cost are with the user, not yet approved
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: satisfied — Bench frozen (D168) and run; measured runtime, resources and cost brought in D169, offers rechecked; the user approved offer 51326867 with its estimate (D172).
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: satisfied — Bench frozen (D168) and run; measured runtime, resources and cost in D169; offers refreshed after 51326867 failed to start, and the user approved offer 56637446 with its estimate (D172 amendment).
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: satisfied — Bench frozen (D168), measured (D169); the user approved the offer and its estimate before renting (D172 and its amendment).
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173-D175 (via D159/T033): D174/D175 promise a Stage 2b + capability cost estimate (about 2,900-3,300 runs) with the rental question, as P50 requires before renting. Open for that rental.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the next rental is now sized at 3,256 runs (2b 528 + cap 2,376 + null pool 352); its runtime and cost estimate still go to the user before renting. Open.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: the 3,256-run estimate and its approval still precede any rental. Open.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: the next step is exactly P50's: the 3,256-run estimate goes to the user before renting. Open.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — Measured runtime basis (D169 bench, D172 speed), resources and cost (3,256 runs, $1.38-1.68) put to the user, who approved offer 50186808 (D179) before renting.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Rental approved by the user (D179) on the measured estimate; box shows 29 jobs, not 31 (about 7 % longer, about $1.48-1.80), reported to the user.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — The failure, the remaining work, the new estimate ($1.05-1.74 on 48597476, about $2.5-3.2 in all, above D179's approval) and the offer went to the user, who approved the switch (D180) before renting.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — A commit rents nothing.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: not-applicable — Local run; nothing rented.
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: no rental; unaffected
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: not-applicable — Local run; nothing rented.
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: D194 cites D159 for the reading rules; the 2b reading ran locally and rented nothing. Unaffected.
- 2026-10-30 17:36 UTC lead (session 9d2b15e6): review for run:partdcap-nulls: not-applicable — local run on fetched files; no rental
- 2026-10-30 17:47 UTC lead (session 9d2b15e6): review for run:partdcap-same: not-applicable — local run on fetched files; no rental
- 2026-10-30 17:56 UTC lead (session 9d2b15e6): review for run:partdcap-cross: not-applicable — local run on fetched files; no rental
- 2026-10-30 18:08 UTC lead (session 9d2b15e6): review for run:partddesc: not-applicable — local, seconds to minutes; no rental
- 2026-10-30 21:10 UTC lead (session 20261030): review for run:partdblocks: not-applicable — local, about a minute; no box (D207)
- 2026-10-30 21:22 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — local (peak about 0.5 GB per file after D207's amendment, about 20-40 min); no box
- 2026-10-30 21:23 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207's amendment: this run crashed (the machine ran out of memory) before writing any output, and nothing was read; the work is rerun under run:partdblocks-2, disposed separately
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — local, about 10 min, peak about 330 MB; no box
- 2026-10-30 21:33 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 2: this run's output failed P88's self-check and was set aside unread (blocks-selfcheck-failed-c91854ee.json); the work is rerun under run:partdblocks-3, disposed separately
- 2026-10-30 21:34 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 2: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-2 (self-check failed, set aside) and run:partdblocks-3
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-4: not-applicable — local, about 10 min, peak about 330 MB; no box
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks: not-applicable — re-read after D207 amendment 3: this first run crashed on memory before writing any output and nothing was read; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-2: not-applicable — re-read after D207 amendment 3: this run's output failed P88's self-check and was set aside unread; superseded by run:partdblocks-4
- 2026-10-30 21:45 UTC lead (session 20261030): review for run:partdblocks-3: not-applicable — re-read after D207 amendment 3: this run stopped on the block guard with no output; nothing was read; superseded by run:partdblocks-4
- 2026-10-30 22:07 UTC lead (session 108deea8): review for commit:partd-1a-20261030: not-applicable — No box rented; partDBlocks ran locally (D210).
