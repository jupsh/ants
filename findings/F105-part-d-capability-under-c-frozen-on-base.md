---
id: F105
title: Part D capability: under c frozen on base nulls (9.28), 10 of 135 same-member dataset pairs of the 9 calibrated synchrony members exceed c (f = 7.4 %, above the nominal 5 %; family T 6 of 30, family D 4 of 105), so the same-member check passes (fail at 14 or more) with a false-positive rate the capability claim must carry
topic: synchrony
status: established
date: 2026-10-30
data: logs/partd2/cap/same.json (capability datasets, 6 per member, 2 runs x 22 colonies each; simulation only)
evidence: docs/log/2026-10-30-1749-part-d-stage-3b-same-member-check-read.md
bears_on: Part D Stage 3b capability (T033; P59, P44)
related: F103, F097
supersedes:
superseded_by:
depends:
---
Rule D175 item 2 / D176 gap 1 (fail if > 10 % of evaluable pairs exceed); c = 9.2824, fallback α 0.025/3 (D196). Per
member: T20f 4/15, T20m 2, Ed2 2, Es 2, Eu-M, El20-M, Ed5, Ed20, Ew5 0; all datasets evaluable. The 15 pairs of a member
share its 6 datasets, so per-member counts are not independent and are not tested. "On these 22 colonies" (D175 item 7):
every dataset reuses the same 22 colony set-ups.
The pooled rate does not establish error control for every member, and the dependent comparisons make all three rates
imprecise; the cause of the T excess is unresolved (M² already uses each dataset's covariance; D199).
