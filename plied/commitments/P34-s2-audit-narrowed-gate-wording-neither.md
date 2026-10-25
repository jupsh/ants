---
id: P34
title: "S2 audit: narrowed gate wording; neither outcome names a mechanism"
wording: >-
  If both lower confidence bounds exceed zero, conclude: "S2's decay exceeds the specified
  joint-shift null and C2 base." Otherwise retain the proposed consequence: S2 is not established as
  the main spatial row for Stages 1–3. Neither outcome identifies a mechanism or establishes its
  absence.
summary: Governs the reading's wording and what T033 may take from it.
made: D145
state: fulfilled
nodes: [T032, T033]
resolved_by: D156
links: [D156]
reviews:
  - action: run:s2audit
    disposition: acting
    because: >-
      The frozen reader prints exactly the narrowed wording for pass and fail; the reading adds that
      neither outcome names a mechanism, with V3b (F094) as the disclosed limit.
    by: lead (session 0bcdd30b)
    at: "2026-10-25 03:56 UTC"
---

## History
- 2026-10-25 03:03 UTC lead (session 0bcdd30b): created
- 2026-10-25 03:06 UTC lead (session 0bcdd30b): reviewed D146: it quotes this wording for its results and changes nothing here.
- 2026-10-25 03:11 UTC lead (session 0bcdd30b): reviewed D147: the gate wording stands; the gate support is now light-phase blocks (P38).
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): reviewed D150: no change to the gate wording.
- 2026-10-25 03:43 UTC lead (session 0bcdd30b): reviewed D152, D153: the frozen reader prints this wording; D152's V3b (S2_J 0.16 from a spatially structured shared driver) is why a pass names no mechanism.
- 2026-10-25 03:56 UTC lead (session 0bcdd30b): review for run:s2audit: acting — The frozen reader prints exactly the narrowed wording for pass and fail; the reading adds that neither outcome names a mechanism, with V3b (F094) as the disclosed limit.
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D155: applies when the gate is read.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): set state=fulfilled; set resolved_by=D156; added D156 to links — the reading uses the narrowed pass wording and states that it names no mechanism (D156)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: the user restates that the pass identifies no mechanism and requires a capability test before any (P44); this wording commitment stays fulfilled for the S2 audit.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): reviewed D158: it keeps the pass from naming a mechanism and routes any mechanism claim through a capability test (P44). Stays fulfilled for the audit.
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: it cites T033 only; the S2 audit's wording commitment is untouched.
