---
id: P76
title: Trail sigma sourced and grid checked before any trail-following result
wording: >-
  Before any trail-following result, the sigma is chosen from a cleared source, or fitted to trail
  data with a designated role, and the grid is no coarser than the one B017 checked for that sigma
  (cell <= sigma/2) unless a grid check at the new sigma passes B012
made: D190
state: open
nodes: [T046]
---

## History
- 2026-10-30 04:38 UTC lead (session d2c88fa6): created — D190 item 2: no biological sigma until sourced
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: D194 cites D190 only for the B017 ordering; it has no trail-following result and chooses no sigma. Unaffected.
- 2026-10-30 17:42 UTC lead (session 13dd4558): reviewed D195: D195 applies the B017 patch with samplingSigmaMm=0 and chooses no sigma, nothing enables the footprint, and no trail-following result exists, so P76 is neither triggered nor changed. It still governs the first trail-following result.
