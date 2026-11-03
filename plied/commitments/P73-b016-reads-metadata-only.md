---
id: P73
title: B016 reads metadata only
wording: >-
  It reads repository records, data descriptors and metadata (species, lab, design, recorded
  variables, availability, licence); no abstracts, full texts, results or figures; nothing
  downloaded.
made: D181
state: open
nodes: [T037]
reviews:
  - action: fetch:b016-metadata-survey-1a3f128b
    disposition: acting
    because: >-
      User authorized this B016 review in the current chat. Future catalogue requests use
      metadata.py, an explicit allowlist excluding descriptions, abstracts, methods, usage notes and
      file contents. Earlier search-output exposures are disclosed in
      backlog/B016-candidate-held-out-colony-data-sets/exposure-handoff.md. No data roles are
      assigned and no dataset or paper is downloaded.
    by: codex-b016 (session 1a3f128b)
    at: "2026-11-03 06:49 UTC"
    ref: backlog/B016-candidate-held-out-colony-data-sets/metadata.py
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
---

## History
- 2026-10-29 20:06 UTC lead (session 7f762276): created — D181 Q10
- 2026-10-29 20:16 UTC lead (session 7f762276): reviewed D182: names D181 only for Q11; B016's survey limits are unaffected
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it cites D181 only as the source of the Q04 judge; D181's answer on B016's reads is not touched by T057's L0S1 judge, so P73 is unaffected
- 2026-10-30 05:00 UTC lead (session 9aa22476): reviewed D193: it cites D181 only for the scope of the Q04 judge (sensitivity, no refit); the reading touches none of D181's answer on B016's metadata-only reads, so P73 is unaffected
- 2026-10-31 02:17 UTC lead (session 6b5fb317): reviewed D223@b738f2de5839; D223 cites D181 only for B005's Done-when 1; it is not B016 and reads no repository metadata, so P73 is unaffected
- 2026-10-31 02:32 UTC lead (session 6b5fb317): reviewed D223@d91126ff338b; D223 amendment 1 is not B016 and reads no repository metadata. Unaffected
- 2026-11-03 06:49 UTC codex-b016 (session 1a3f128b): review for fetch:b016-metadata-survey-1a3f128b: acting — User authorized this B016 review in the current chat. Future catalogue requests use metadata.py, an explicit allowlist excluding descriptions, abstracts, methods, usage notes and file contents. Earlier search-output exposures are disclosed in backlog/B016-candidate-held-out-colony-data-sets/exposure-handoff.md. No data roles are assigned and no dataset or paper is downloaded.
- 2026-11-03 15:26 UTC lead (session e38b977a): review for commit:t060-q37-records-20261103: not-triggered — The commit holds records only (git status: nothing under src/, scripts/, test/ or .claude/; backlog/ left out): T060's Stage 0 records D261-D266 with D243's dated blocks, X029, STATUS, and plied records (Q36, Q37, P175-P183, dispositions, notes, T037's message). It carries P73/P74's dispositions as the B016 worker recorded them and T037's hand-off message, but none of B016's files; the B016 exposure entry (P74) is the lead's follow-up, still owed and outside this commit.
