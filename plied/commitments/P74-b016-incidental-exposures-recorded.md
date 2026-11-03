---
id: P74
title: B016 incidental exposures recorded
wording: Any result seen in a title or snippet is reported and goes in docs/contamination/.
made: D181
state: open
nodes: [T037]
reviews:
  - action: fetch:b016-metadata-survey-1a3f128b
    disposition: acting
    because: >-
      User authorized this B016 review in the current chat. The initial search and DataCite title
      exposures are inventoried in
      backlog/B016-candidate-held-out-colony-data-sets/exposure-handoff.md; all later
      outcome-bearing titles will be added. The lead receives that inventory for
      docs/contamination/. This acting disposition does not claim that the lead has entered the
      contamination record or that the commitment is fulfilled.
    by: codex-b016 (session 1a3f128b)
    at: "2026-11-03 06:49 UTC"
    ref: backlog/B016-candidate-held-out-colony-data-sets/exposure-handoff.md
  - action: commit:t060-q37-records-20261103
    disposition: not-triggered
    because: >-
      The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/;
      backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS,
      and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). It carries
      P73/P74's dispositions as the B016 worker recorded them and T037's hand-off message, but none
      of B016's files; the B016 exposure entry (P74) is the lead's follow-up, still owed and outside
      this commit.
    by: lead (session e38b977a)
    at: "2026-11-03 15:26 UTC"
  - action: commit:t060-freeze-20261103
    disposition: not-triggered
    because: >-
      The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files,
      byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's
      colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied
      records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and
      logs/ are not committed; backlog/ left out. Nothing of B016 is in it; the B016 exposure entry
      (P74) is the lead's follow-up, still owed and outside this commit.
    by: lead (session e38b977a)
    at: "2026-11-03 16:03 UTC"
---

## History
- 2026-10-29 20:06 UTC lead (session 7f762276): created — D181 Q10
- 2026-10-29 20:16 UTC lead (session 7f762276): reviewed D182: names D181 only for Q11; Mailleux 1999 is fit / development, so its clearance is not an incidental exposure for B016
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it cites D181 only as the source of the Q04 judge; D181's answer on B016's exposures is not touched by T057's L0S1 judge, so P74 is unaffected
- 2026-10-30 05:00 UTC lead (session 9aa22476): reviewed D193: it cites D181 only for the scope of the Q04 judge (sensitivity, no refit); the reading touches none of D181's answer on B016's exposure records, so P74 is unaffected
- 2026-10-31 02:18 UTC lead (session 6b5fb317): reviewed D223@b738f2de5839; D223 cites D181 only for B005's Done-when 1; no title or snippet is involved, so P74 is unaffected
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D223@d91126ff338b; D223 amendment 1 involves no title or snippet. Unaffected
- 2026-10-31 04:22 UTC lead (session 548cad34): reviewed D232@7e78fcc5a5c3; D232 takes P74's wording as the review's own exposure rule, by reference (a commitment of its own follows only if the user approves D232, Q27); P74 still governs B016's survey (T037), unchanged
- 2026-11-02 05:57 UTC lead (session 0e89af04): reviewed D232@5c00fbac6f47; D232 applies this rule to the synchrony review's literature search (one contamination entry per search session; done as X024). It changes neither B016's survey nor the rule
- 2026-11-03 06:49 UTC codex-b016 (session 1a3f128b): review for fetch:b016-metadata-survey-1a3f128b: acting — User authorized this B016 review in the current chat. The initial search and DataCite title exposures are inventoried in backlog/B016-candidate-held-out-colony-data-sets/exposure-handoff.md; all later outcome-bearing titles will be added. The lead receives that inventory for docs/contamination/. This acting disposition does not claim that the lead has entered the contamination record or that the commitment is fulfilled.
- 2026-11-03 15:26 UTC lead (session e38b977a): review for commit:t060-q37-records-20261103: not-triggered — The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/; backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS, and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). It carries P73/P74's dispositions as the B016 worker recorded them and T037's hand-off message, but none of B016's files; the B016 exposure entry (P74) is the lead's follow-up, still owed and outside this commit.
- 2026-11-03 16:03 UTC lead (session e38b977a): review for commit:t060-freeze-20261103: not-triggered — The commit holds the T060 freeze and its records: scripts/frozen/t060/ (26 files, byte-identical to D243's freeze block SHA-256s; checked by sha256sum and by the frozen copy's colony-237 repro and synthetic pool, D243), D267, D268, D243's blocks, STATUS, and plied records (P184, P185, dispositions, notes). Nothing under src/ or test/; scripts/scratch/ and logs/ are not committed; backlog/ left out. Nothing of B016 is in it; the B016 exposure entry (P74) is the lead's follow-up, still owed and outside this commit.
