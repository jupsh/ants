---
id: P198
title: "Lab: a failed or split review panel goes to the user"
wording: A failed or split panel, or a second failed revision, goes to the user.
made: D277
state: open
nodes: [T065]
reviews:
  - action: run:lab-1a
    disposition: not-applicable
    because: >-
      run:lab-1a builds and unit-tests the lab's guard, policy, quota and adapter code with fake
      engines in ~/repos/ants-lab; no review panel runs and nothing is approved, so P198's stop rule
      has no panel outcome to route
    by: lead (session 48c74063)
    at: "2026-11-05 05:35 UTC"
    inputs:
      - record: D277
        rev: 4b7df37ecf52dd226b9df30ad81579101ed78f1e88042b334a34b2369b0b025b
  - action: run:lab-1a
    disposition: not-applicable
    because: >-
      re-read D277 (amended: plied tool, scope T065, justification in packets) and D278: run:lab-1a
      builds and unit-tests guard, policy, quota and adapter code with fakes plus three single-word
      wiring smokes per engine; no panel runs and nothing is approved, so no panel outcome exists to
      route to the user
    by: lead (session 48c74063)
    at: "2026-11-05 05:38 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: commit:lab-records-20261105
    disposition: not-applicable
    because: >-
      the commit records D277-D280; no review panel has run, so no panel outcome needs routing; the
      rule itself is committed unchanged
    by: lead (session 48c74063)
    at: "2026-11-05 06:00 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
---

## History
- 2026-11-05 05:34 UTC lead (session 48c74063): created — D277: the delegation's stop rule
- 2026-11-05 05:35 UTC lead (session 48c74063): review for run:lab-1a: not-applicable — run:lab-1a builds and unit-tests the lab's guard, policy, quota and adapter code with fake engines in ~/repos/ants-lab; no review panel runs and nothing is approved, so P198's stop rule has no panel outcome to route
- 2026-11-05 05:38 UTC lead (session 48c74063): review for run:lab-1a: not-applicable — re-read D277 (amended: plied tool, scope T065, justification in packets) and D278: run:lab-1a builds and unit-tests guard, policy, quota and adapter code with fakes plus three single-word wiring smokes per engine; no panel runs and nothing is approved, so no panel outcome exists to route to the user
- 2026-11-05 05:45 UTC lead (session 48c74063): reviewed D279@22eb7cdfc9f1; D279 read: it adds no route around the panel rule; suggestions about the lab go to the user, so P198 stands unchanged.
- 2026-11-05 05:59 UTC lead (session 48c74063): reviewed D280@e1c4e6a09f8a; D280 read: a commit instruction and the data-roles table; the panel rule is unchanged.
- 2026-11-05 06:00 UTC lead (session 48c74063): review for commit:lab-records-20261105: not-applicable — the commit records D277-D280; no review panel has run, so no panel outcome needs routing; the rule itself is committed unchanged
