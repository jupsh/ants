---
id: Q13
title: >-
  S2 audit V2/V5: how the planted coupling is generated or sized, after the frozen κ calibration
  failed (D149)
options:
  - "add a simultaneous neighbour term (gamma times neighbours' mean moving-state deviation within 10 mm), calibrated by the same rule and target, frozen anew"
  - "take the contagion generator at its strongest grid value (kappa 0.2, effect about 0.023) as the planted effect"
  - other
raised: D149
state: answered
nodes: [T032]
answered_by: D150
answer: Planted local spatial dependence replaces kappa for V2 and V5; bounded gamma calibration (D150).
---

## History
- 2026-10-25 03:22 UTC lead (session 0bcdd30b): created
- 2026-10-25 03:28 UTC lead (session 0bcdd30b): set state=answered; set answered_by=D150; set answer=Planted local spatial dependence replaces kappa for V2 and V5; bounded gamma … — user answered Q13 (D150)
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): reviewed D151: it applies this answer (D150); gamma* = 0.1 recorded.
- 2026-10-25 03:43 UTC lead (session 0bcdd30b): reviewed D152, D153: gamma* = 0.1 passed V2/V5. No change.
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D154, D155: no change.
- 2026-10-25 04:04 UTC lead (session 0bcdd30b): reviewed D156: no change.
- 2026-10-25 04:08 UTC lead (session 0bcdd30b): removed add a simultaneous neighbour term (gamma times neighbours' mean moving-state … from options; added add a simultaneous neighbour term (gamma times neighbours' mean moving-state … to options; added take the contagion generator at its strongest grid value (kappa 0.2, effect a… to options; added other to options — plied 0.3.0 merged the options at the apostrophe in neighbours' (plied#10), and the lead's input put commas inside options; restored to the three options as raised (the two proposals and other)
