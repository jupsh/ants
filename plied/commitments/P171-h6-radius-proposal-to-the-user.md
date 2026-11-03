---
id: P171
title: >-
  H6: radius proposal to the user before the freeze if either pooled share or either zone's share is
  above 50 %
wording: >-
  Return with a radius proposal if the pooled share is above 50 % in either number, or if either
  zone (L or H) is above 50 %.
made: D249
state: fulfilled
nodes: [T059]
resolved_by: D251
reviews:
  - action: run:h6-zoneflag-20261102
    disposition: acting
    because: >-
      The flag implements the zone half of this rule (any of L/H for onsets or at-risk above 50 %);
      the lead reads it
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
    inputs:
      - record: D249
        rev: 525baaca7a016fa0badfa175ef296e55e9d3392f4c939e4e18435ea895bbc323
  - action: run:h6-v1v4-20261102
    disposition: not-triggered
    because: No blind-check result is read in this run
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
  - action: run:h6-blindcheck-20261102
    disposition: acting
    because: >-
      The lead applies the rule to the three lines; if either pooled share is above 0.5 or the flag
      is yes, a radius proposal goes to the user before the freeze
    by: lead (session 0e89af04)
    at: "2026-11-02 15:37 UTC"
    inputs:
      - record: D249
        rev: 525baaca7a016fa0badfa175ef296e55e9d3392f4c939e4e18435ea895bbc323
---

## History
- 2026-11-02 15:27 UTC lead (session 0e89af04): created — D249: replaces P168's 'mostly unknown'
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-zoneflag-20261102: acting — The flag implements the zone half of this rule (any of L/H for onsets or at-risk above 50 %); the lead reads it
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-v1v4-20261102: not-triggered — No blind-check result is read in this run
- 2026-11-02 15:37 UTC lead (session 0e89af04): review for run:h6-blindcheck-20261102: acting — The lead applies the rule to the three lines; if either pooled share is above 0.5 or the flag is yes, a radius proposal goes to the user before the freeze
- 2026-11-02 15:39 UTC lead (session 0e89af04): set state=fulfilled; set resolved_by=D251 — D251: the rule was met and the proposal went to the user as Q34
