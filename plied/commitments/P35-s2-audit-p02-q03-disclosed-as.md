---
id: P35
title: "S2 audit: P02/Q03 disclosed as a limitation of the base comparison, not waived"
wording: >-
  The outstanding C2 warm-up commitment, P02/Q03, remains a disclosed limitation of the base
  comparison and is not waived by this approval.
summary: The reading names it; approval of T032 does not resolve P02.
made: D145
state: fulfilled
nodes: [T032]
resolved_by: D156
links: [D156]
reviews:
  - action: run:s2audit
    disposition: acting
    because: The reading discloses P02/Q03 as an unwaived limitation of the base comparison (D154).
    by: lead (session 0bcdd30b)
    at: "2026-10-25 03:56 UTC"
---

## History
- 2026-10-25 03:03 UTC lead (session 0bcdd30b): created
- 2026-10-25 03:06 UTC lead (session 0bcdd30b): reviewed D146: no change; it adds a second disclosed limit of the base comparison (4-h light replicates against 24-h data), P02 stays disclosed.
- 2026-10-25 03:11 UTC lead (session 0bcdd30b): reviewed D147: unchanged; D147 restates P02/Q03 as disclosed and unwaived, and adds the duration disclosure (P38).
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): reviewed D150: no change; P02/Q03 stays disclosed.
- 2026-10-25 03:43 UTC lead (session 0bcdd30b): reviewed D152, D153: unchanged; the reading discloses P02/Q03.
- 2026-10-25 03:56 UTC lead (session 0bcdd30b): review for run:s2audit: acting — The reading discloses P02/Q03 as an unwaived limitation of the base comparison (D154).
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D155: applies when the gate is read.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): set state=fulfilled; set resolved_by=D156; added D156 to links — P02/Q03 disclosed as an unwaived limitation of the base comparison (D156)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: Q03 is carried forward into the redesign too (P45); for the S2 audit it was disclosed. Stays fulfilled.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): reviewed D158: P02/Q03 is carried into the redesign (P45) and put to the user before Stage 2a. Stays fulfilled for the audit.
