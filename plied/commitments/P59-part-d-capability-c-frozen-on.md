---
id: P59
title: >-
  Part D capability: c frozen on nulls first, then the same-member check; a failed check returns to
  the user before any cross-member value
wording: >-
  c frozen (on nulls only) → same-member check → cross-member comparisons only if it passes. A
  failed check returns to the user before any cross-member value is computed.
made: D175
state: fulfilled
nodes: [T033]
resolved_by: D200
reviews:
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      Renting computes nothing; partDCap.ts enforces nulls -> same --frozen -> cross (D176), and
      member capability outputs are sealed from launch (P63).
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Running computes no separation: partDCap.ts runs locally later in the enforced order; member
      capability outputs sealed (P63).
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: Switching computes nothing; the reader order is enforced locally later.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: not-applicable
    because: No capability statistic has been computed; the reader enforces the order in code.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: satisfied
    because: >-
      capfiles computes per-file audit accumulators only; the reader enforces nulls → c frozen →
      same → cross (partDCap.ts).
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: not-applicable
    because: The 2b reader reads no capability output.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
  - action: run:partdcap-nulls
    disposition: satisfied
    because: >-
      nulls is the first step of D175 item 6's order; the code reads no member file and same refuses
      without the freezing entry (D176). c will be frozen in an entry before same runs
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:36 UTC"
    inputs:
      - record: D175
        rev: a97c730ed5c53346f2e9dbc37b1db8914870619664c53a4423689b5547f1e3ba
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partdcap-same
    disposition: satisfied
    because: >-
      c frozen on nulls only in D196; same is step 2 of the order; the user (D197) requires a failed
      check to stop before any cross-member value, and cross refuses without a passing same.json
      (D176)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:47 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
      - record: D196
        rev: e67ec9a3bd52e5eeb41bfcccda9d7a2a85443a1237617457d9c19481031db034
      - record: D197
        rev: b80fed2f6a3a83d6d30dafdd1f6007b7304b1610817dc6abe029073ca9bbafe1
  - action: run:partdcap-cross
    disposition: satisfied
    because: >-
      step 3 of the order: c frozen on nulls (D196), the same-member check passed (D198), and the
      user said to run cross (D199)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:56 UTC"
    inputs:
      - record: D196
        rev: e67ec9a3bd52e5eeb41bfcccda9d7a2a85443a1237617457d9c19481031db034
      - record: D198
        rev: 34a90e8a2dd31540939ace594de9afd8afbf9387b74fcb429f8c1b87a45188a7
      - record: D199
        rev: 95299e0ccca953d02ca049a8f811ddafd02d2ba0e4c5c3051e66822322acb684
---

## History
- 2026-10-26 20:23 UTC lead (session d6df3027): created — reader order fixed by D175 item 6
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the order is enforced in partDCap.ts (nulls writes nulls.json from base runs only; same needs --frozen Dnnn; cross refuses unless same passed). Not yet exercised. Open.
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: the order is unchanged; the same-member alarm now counts shares of evaluable pairs (more than 10 %). Open.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: the capability order is untouched. Open.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — Renting computes nothing; partDCap.ts enforces nulls -> same --frozen -> cross (D176), and member capability outputs are sealed from launch (P63).
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Running computes no separation: partDCap.ts runs locally later in the enforced order; member capability outputs sealed (P63).
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Switching computes nothing; the reader order is enforced locally later.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: not-applicable — No capability statistic has been computed; the reader enforces the order in code.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: satisfied — capfiles computes per-file audit accumulators only; the reader enforces nulls → c frozen → same → cross (partDCap.ts).
- 2026-10-29 22:15 UTC lead (session 20261029): reviewed D185: the 2b reader is independent of the capability reader and reads none of its outputs; P59's order is unaffected
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: not-applicable — The 2b reader reads no capability output.
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: D194 names the order for Stage 3b (nulls first, c frozen on them, then the same-member check). No capability value computed; capfiles resumed at 05:30 UTC. Governs the next step; open.
- 2026-10-30 17:36 UTC lead (session 9d2b15e6): review for run:partdcap-nulls: satisfied — nulls is the first step of D175 item 6's order; the code reads no member file and same refuses without the freezing entry (D176). c will be frozen in an entry before same runs
- 2026-10-30 17:42 UTC lead (session 9d2b15e6): reviewed D196: step 1 of the order done, c frozen on nulls only (9.282; α 0.025/3) and no member file read. Next the same-member check (same --frozen D196), held for the user. Open until the order completes.
- 2026-10-30 17:47 UTC lead (session 9d2b15e6): review for run:partdcap-same: satisfied — c frozen on nulls only in D196; same is step 2 of the order; the user (D197) requires a failed check to stop before any cross-member value, and cross refuses without a passing same.json (D176)
- 2026-10-30 17:50 UTC lead (session 9d2b15e6): reviewed D198: step 2 done, the same-member check passed (10/135, 7.4 %) under c frozen in D196; cross-member values are not yet computed and cross is held for the user (f above nominal, concentrated in T). Open until cross is run or the user ends the order.
- 2026-10-30 17:56 UTC lead (session 9d2b15e6): review for run:partdcap-cross: satisfied — step 3 of the order: c frozen on nulls (D196), the same-member check passed (D198), and the user said to run cross (D199)
- 2026-10-30 17:58 UTC lead (session 9d2b15e6): set state=fulfilled; set resolved_by=D200 — Order completed as written: c frozen on nulls only (D196), same-member check passed (D198), cross-member comparisons run only after it (D200)
