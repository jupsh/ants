---
id: P170
title: H6 blind check prints the two pooled unknown shares and one yes/no zone flag, no per-zone value
wording: >-
  The script prints only the two pooled shares plus one yes/no flag for the zone condition; no
  per-zone value is printed.
made: D249
state: fulfilled
governs: [run]
nodes: [T059]
resolved_by: D251
reviews:
  - action: run:h6-zoneflag-20261102
    disposition: acting
    because: >-
      The follow-up implements exactly this output: the two pooled shares and one yes/no zone line,
      no per-zone value
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
    inputs:
      - record: D249
        rev: 525baaca7a016fa0badfa175ef296e55e9d3392f4c939e4e18435ea895bbc323
  - action: run:h6-v1v4-20261102
    disposition: not-triggered
    because: The run does not run the blind check
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
  - action: run:h6-blindcheck-20261102
    disposition: acting
    because: >-
      unknownShare.ts (sha256 4c1b65aa…) read in full by the lead: stdout is exactly the two pooled
      shares and one yes/no zone line; errors are fixed messages; tests 33/33
    by: lead (session 0e89af04)
    at: "2026-11-02 15:37 UTC"
    inputs:
      - record: D249
        rev: 525baaca7a016fa0badfa175ef296e55e9d3392f4c939e4e18435ea895bbc323
---

## History
- 2026-11-02 15:27 UTC lead (session 0e89af04): created — D249: replaces P167's output rule
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-zoneflag-20261102: acting — The follow-up implements exactly this output: the two pooled shares and one yes/no zone line, no per-zone value
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-v1v4-20261102: not-triggered — The run does not run the blind check
- 2026-11-02 15:37 UTC lead (session 0e89af04): review for run:h6-blindcheck-20261102: acting — unknownShare.ts (sha256 4c1b65aa…) read in full by the lead: stdout is exactly the two pooled shares and one yes/no zone line; errors are fixed messages; tests 33/33
- 2026-11-02 15:39 UTC lead (session 0e89af04): set state=fulfilled; set resolved_by=D251 — D251/X027: the check printed only the two pooled shares and the yes/no zone line
