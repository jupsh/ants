---
id: P36
title: "S2 audit: a failed synthetic check stops the audit; no switch of method, no relaxed threshold"
wording: >-
  For this approval, test J; if it fails, stop after the synthetic checks and return with the
  fallback design. … a failed synthetic check does not authorize switching methods or relaxing
  thresholds.
summary: J' is not promoted automatically; it would need its own validation and design.
made: D147
state: not-triggered
nodes: [T032]
resolved_by: D152
links: [D148, D149]
---

## History
- 2026-10-25 03:10 UTC lead (session 0bcdd30b): created
- 2026-10-25 03:22 UTC lead (session 0bcdd30b): added D148 to links; added D149 to links — D148 fixes the stop on any synthetic failure; D149 applied it to the failed calibration (no change of target, grid or mechanism by the lead)
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): reviewed D150, D151: P36 applies to the revised checks unchanged (D150 restates it).
- 2026-10-25 03:42 UTC lead (session 0bcdd30b): set state=not-triggered; set resolved_by=D152 — every synthetic acceptance rule passed (D152); no fallback, no threshold change
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D154, D155: not triggered (D152); D154 corrects only a descriptive L_ref sentence.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): reviewed D156: not triggered; no change.
