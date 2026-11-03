---
id: Q37
title: >-
  T060 Stage 0 after brief 2 (D265): Scope B's rules cannot be met under the design (every interval
  unknown from its first frame by the partner blind-opportunity rule; 4.6-7.1 % spurious accepted
  onsets), so V0 cannot pass and nothing empirical may be read (P164, P166). How to proceed:
  conclude Stage 0 from Scope B; a support-only empirical reading (lead recommends); or redesign the
  completeness and sustained-onset rules
options:
  - "support-only empirical reading: freeze the extraction and reader (P172), build the real event tables into the sealed folder, read only support (0a count, unknown histories by cause, 0b entry), waiving Scope B acceptance for this reading only; anything beyond support not read (lead recommends)"
  - "conclude Stage 0 from Scope B: not identifiable under the complete-history rule with this kind of detection; no real event tables built; Stage 1 never built; T060 closes"
  - "redesign: amend D243 with a new completeness rule and a corrected sustained-onset rule, then rerun Scope B"
raised: D265
state: answered
nodes: [T060]
answered_by: D266
answer: >-
  support-only empirical audit through an explicitly restricted support reader; counts described as
  support retained by the frozen extraction; tag 52 conservative, colony 237 flagged separately; if
  support fails, T060 closes as unsupported by this extraction and observation rule
links: [D243, D264, D265, P153, P164, P166]
---

What D265 found (synthetic, one Scope B data set per case): under the frozen detection chain every pipeline interval is
unknown from its first frame, because some partner within about 14 mm is unread on most frames and D243's own rule (ii)
(v = 20 mm/s) then counts a blind contact opportunity. 0a and 0b have no support; Scope B rules (1) and (2) have no
denominator and rule (3) fails (4.56 % and 7.05 % against 1 %). V0 Scope A passed (D264); the reproduction and the
speed bound passed (D265). By D243's order nothing empirical is read until V0 passes, so the next step is the user's.

- Support-only empirical reading (the lead's recommendation): it turns a synthetic forecast into the measured support
  of the real tracks, for a freeze and about 45 minutes of extraction. It reads only quantities Scope B's failures do
  not bear on: whether any history is complete, and why not. If support unexpectedly passes, nothing more is read and
  the question returns. It waives Scope B's acceptance (P164's "V0 pass") for this reading only. The colony-237 old tag
  (EDGE in D265) stays conservative unless the user says otherwise.
- Conclude from Scope B: the cheapest option, with no exposure. Its conclusion rests on synthetic detection only: real
  gaps may be clustered and real partners fewer nearby, which Scope B cannot show (D243 amendment 1).
- Redesign: any rule that makes these histories complete must either bound partners' unseen motion more tightly than
  the data allow (20 mm/s already sits above 99.99 % of steps, D265) or model missed PDCs, which P153 rules out unless
  independently bounded. It also needs a corrected sustained-onset rule (rule 3). This is a new design round for the
  user.

## History
- 2026-11-03 09:02 UTC lead (session 691f3fd9): created — D265: Scope B's rules fail for a reason in the design; P166 brings it to the user
- 2026-11-03 09:02 UTC lead (session 691f3fd9): replaced the record — body: the options' consequences and the lead's recommendation
- 2026-11-03 15:18 UTC lead (session e38b977a): set state=answered; set answered_by=D266; set answer=support-only empirical audit through an explicitly restricted support reader;… — D266: the user answered Q37
