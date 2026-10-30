---
id: P65
title: L0S1 judge frozen before it runs; no refit from it
wording: >-
  Its parameters, seeds and interpretation are frozen in a design entry before it runs. It measures
  that candidate's sensitivity, not what an L0S1 fit could reach. No refit follows from it.
made: D181
state: fulfilled
nodes: [T057]
resolved_by: D193
links: [D193]
reviews:
  - action: commit:20261029
    disposition: not-applicable
    because: The L0S1 judge does not run by committing; its design entry remains due.
    by: lead (session 20261029)
    at: "2026-10-29 21:24 UTC"
  - action: run:t057-judge-20261030
    disposition: satisfied
    because: >-
      D191 (amended by D192) freezes the candidate, the swap, seeds seedFor(1999,'judge'), arms and
      the reading before launch, says it measures the candidate's sensitivity only and that no refit
      follows
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
    inputs:
      - record: D191
        rev: 347ec2bc895be5df58c46008cf1b190b25b229be70f60510794ceba5826dd314
      - record: D192
        rev: 55034cff018bd2f104614eb2a389a7d8676f9620fed0b282e0cb32bd8744351c
      - record: D181
        rev: 101dc5a8d17bb98b12a2d8d26d30e658c4224eab5b17b36cbf667bbd8bbf4f17
  - action: run:t057-judge-20261030
    disposition: satisfied
    because: >-
      Re-read D191 after its launch line was appended: the line records the launch checks and gate
      only; candidate, swap, seeds, arms and reading are as frozen before launch
    by: lead (session 9aa22476)
    at: "2026-10-30 04:52 UTC"
    inputs:
      - record: D191
        rev: 25de831cb5ba88c9c56856ffa9d73c045779348d2121ff2758897b158cb8b97a
      - record: D192
        rev: 55034cff018bd2f104614eb2a389a7d8676f9620fed0b282e0cb32bd8744351c
      - record: D181
        rev: 101dc5a8d17bb98b12a2d8d26d30e658c4224eab5b17b36cbf667bbd8bbf4f17
---

## History
- 2026-10-29 20:05 UTC lead (session 7f762276): created — D181 Q04
- 2026-10-29 20:16 UTC lead (session 7f762276): reviewed D182: names D181 only for the Q11 recommendation; the L0S1 judge's freeze rule is unaffected
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — The L0S1 judge does not run by committing; its design entry remains due.
- 2026-10-30 04:44 UTC lead (session 9aa22476): reviewed D191: it is the design entry P65 requires (parameters, seeds, interpretation, no refit stated). P65 stays open until the judge has run and been read; the gate disposition comes at launch
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: satisfied — D191 (amended by D192) freezes the candidate, the swap, seeds seedFor(1999,'judge'), arms and the reading before launch, says it measures the candidate's sensitivity only and that no refit follows
- 2026-10-30 04:52 UTC lead (session 9aa22476): review for run:t057-judge-20261030: satisfied — Re-read D191 after its launch line was appended: the line records the launch checks and gate only; candidate, swap, seeds, arms and reading are as frozen before launch
- 2026-10-30 04:59 UTC lead (session 9aa22476): set state=fulfilled; set resolved_by=D193; added D193 to links — D191 froze parameters, seeds and interpretation before the run; D193 read it as frozen, as a sensitivity only, no refit
