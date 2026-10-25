---
id: P38
title: "S2 audit: primary gate phase-matched on light blocks; duration difference disclosed"
wording: >-
  Use complete light-phase blocks in both data and simulations. Keep the full-support D122
  continuity check and the all-phase data profile descriptive. … Disclose the remaining difference
  in observation duration.
summary: Governs the gate's support and the reading's disclosures.
made: D147
state: fulfilled
nodes: [T032]
resolved_by: D156
links: [D156]
reviews:
  - action: run:s2audit
    disposition: acting
    because: >-
      Gate support is complete light-phase blocks in data and simulations (gateSegments, D153);
      continuity and all-phase profiles are computed as descriptive; the reading discloses the
      duration difference (data 8-12 h, simulations 2 x 4 h per colony).
    by: lead (session 0bcdd30b)
    at: "2026-10-25 03:56 UTC"
---

## History
- 2026-10-25 03:10 UTC lead (session 0bcdd30b): created
- 2026-10-25 03:22 UTC lead (session 0bcdd30b): reviewed D148, D149: synthetic only; the light-phase gate support is unchanged.
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): reviewed D150: no change; synthetic only.
- 2026-10-25 03:43 UTC lead (session 0bcdd30b): reviewed D153: light-phase complete blocks are in the frozen code (gateSegments); the duration difference goes in the reading.
- 2026-10-25 03:56 UTC lead (session 0bcdd30b): review for run:s2audit: acting — Gate support is complete light-phase blocks in data and simulations (gateSegments, D153); continuity and all-phase profiles are computed as descriptive; the reading discloses the duration difference (data 8-12 h, simulations 2 x 4 h per colony).
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D155: the run uses light-phase complete blocks as frozen.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): set state=fulfilled; set resolved_by=D156; added D156 to links — gate on complete light-phase blocks; continuity and all-phase profiles descriptive; duration difference disclosed (D156)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: the phase and duration treatment is carried into the redesign (P45); for the S2 audit it is fulfilled.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): reviewed D158: the redesign keeps the light-phase complete-block support for S2 and S2-J, and the duration disclosure. Stays fulfilled for the audit.
