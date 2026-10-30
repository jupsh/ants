---
id: P06
title: E2 reopening triggers and shared failures
wording: >-
  With paired seeds: (a) a between-layer difference > 1 combined SE whose CI excludes 0; (b) the E6
  verdict differs between layers; (c) 1999 adequacy differs between layers. … Shared failures:
  drinking-time spread, through the intakeSd 0.4 profile point as the drinking layer (same
  triggers); giving up matters only if > 5 % of E6 food visits end in a give-up.
summary: >-
  (a), (b) and the shared failures are evaluated with E6 ((a) was written for E6 statistics, A001).
  (c) was read at D106 candidate by T057 (D191, D193): NOT ADEQUATE on both layers, so (c) did not
  fire; step 5 was fitted on L0S1c only (D094), and an L0S1 fit was not tried (D181).
made: S001
state: open
nodes: [T039, T057]
links: [A001, D094, D193]
reviews:
  - action: commit:20261029
    disposition: not-applicable
    because: No layer comparison is run or read by committing.
    by: lead (session 20261029)
    at: "2026-10-29 21:24 UTC"
  - action: run:t057-judge-20261030
    disposition: satisfied
    because: >-
      This run evaluates (c) only, paired by seed (judge seeds in both arms), as D181/D191 define;
      (a) and (b) wait on E6 and are not read here; shared failures are not touched
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
    inputs:
      - record: D191
        rev: 347ec2bc895be5df58c46008cf1b190b25b229be70f60510794ceba5826dd314
      - record: D181
        rev: 101dc5a8d17bb98b12a2d8d26d30e658c4224eab5b17b36cbf667bbd8bbf4f17
  - action: run:t057-judge-20261030
    disposition: satisfied
    because: "Re-read D191 after its launch line: unchanged design; the run evaluates (c) only, paired by seed"
    by: lead (session 9aa22476)
    at: "2026-10-30 04:52 UTC"
    inputs:
      - record: D191
        rev: 25de831cb5ba88c9c56856ffa9d73c045779348d2121ff2758897b158cb8b97a
      - record: D181
        rev: 101dc5a8d17bb98b12a2d8d26d30e658c4224eab5b17b36cbf667bbd8bbf4f17
---
Draft label: P6 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:11 UTC lead (session 104e7640): set nodes=["T039"] — attached to its nodes (D142)
- 2026-10-25 00:31 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-29 20:06 UTC lead (session 7f762276): added T057 to nodes — D181 (Q04): (c) is evaluated on T057; P06 stays open, not waived
- 2026-10-29 21:24 UTC lead (session 20261029): review for commit:20261029: not-applicable — No layer comparison is run or read by committing.
- 2026-10-30 04:44 UTC lead (session 9aa22476): set summary=(a), (b) and the shared failures are evaluated with E6 ((a) was written for E… — D191 freezes the design that makes (c) evaluable
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it freezes the judge that evaluates (c); summary updated to point (c) to T057. The wording and state are unchanged
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: satisfied — This run evaluates (c) only, paired by seed (judge seeds in both arms), as D181/D191 define; (a) and (b) wait on E6 and are not read here; shared failures are not touched
- 2026-10-30 04:52 UTC lead (session 9aa22476): review for run:t057-judge-20261030: satisfied — Re-read D191 after its launch line: unchanged design; the run evaluates (c) only, paired by seed
- 2026-10-30 05:00 UTC lead (session 9aa22476): set summary=(a), (b) and the shared failures are evaluated with E6 ((a) was written for E…; added D193 to links — D193 reads (c): it does not fire; P06 stays open for (a), (b) and the shared failures
