---
id: Q41
title: >-
  T065 before lab enable (D305): probe Claude and Muse once now to learn whether the lab can meter
  them, and T064 as the first lab thread?
options:
  - "the lead runs one Claude probe and one Muse probe now (one-turn, cheapest model, lowest effort), re-reads the meters and brings the result back; if Claude gives a meter, T064 gets actor=lab and the user runs lab enable (lead recommends)"
  - "skip the separate probe: T064 gets actor=lab now and the user runs lab enable; the loop probes on its own before the step"
  - "hold: decide how to meter Claude for the lab (another token with plan limits, or a different rule) before any probe"
raised: D305
state: answered
nodes: [T065, T064]
answered_by: D306
---

## History
- 2026-11-06 02:58 UTC lead (session 487510ed): created — D305: the first live step needs a Claude probe whose meter yield is untested
- 2026-11-06 02:59 UTC lead (session 487510ed): set state=answered; set answered_by=D306 — D306: the user chose to probe once now
