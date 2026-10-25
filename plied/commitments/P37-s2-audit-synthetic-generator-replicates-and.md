---
id: P37
title: "S2 audit: synthetic generator, replicates and seeds frozen before testing"
wording: >-
  Freeze generator settings, replicate count and seeds before testing, with no seed selection to
  obtain a pass.
summary: Frozen in a log entry before any synthetic test runs.
made: D147
state: fulfilled
nodes: [T032]
resolved_by: D151
links: [D148, D149, D151, D152]
---

## History
- 2026-10-25 03:10 UTC lead (session 0bcdd30b): created
- 2026-10-25 03:22 UTC lead (session 0bcdd30b): added D148 to links; added D149 to links — D148 froze the generator, replicates and seeds before any test; D149 read its calibration rule (stop). A changed generator is frozen anew.
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): added D151 to links — D151 froze the revised V2/V5 generator before its calibration; seeds and replicate count unchanged
- 2026-10-25 03:42 UTC lead (session 0bcdd30b): set state=fulfilled; set resolved_by=D151; added D152 to links — generator, replicates and seeds frozen before testing (D148), the revision before its calibration (D151); no seed replaced
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D154, D155: fulfilled; the correction in D154 leaves generator, seeds and replicates unchanged.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): reviewed D156: no change.
