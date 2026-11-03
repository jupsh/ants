---
id: P167
title: H6 blind check of S1's unknown share prints only the two pooled shares
wording: >-
  I'd print only the unknown share, pooled over all colonies, once for onsets and once for the
  at-risk reference. No roles, zones, contact split or initiators would be printed.
made: D246
state: superseded
governs: [run]
nodes: [T059]
resolved_by: D249
superseded_by: P170
reviews:
  - action: run:h6-fixes-20261102
    disposition: acting
    because: >-
      Brief task 3 makes the script print exactly the two pooled shares and nothing else, tested on
      toy input; the implementer may not run it on real data
    by: lead (session 0e89af04)
    at: "2026-11-02 05:50 UTC"
    inputs:
      - record: D246
        rev: 001ed95c860d0220280f7ed3039d6e65f66da0ef180bea2b9a596d153057b770
  - action: run:h6-fixes-20261102
    disposition: acting
    because: >-
      Re-read D246@53e0c6fc0963: one dated line appended (D249 supersedes the lead's 50 %-pooled
      reading of 'mostly unknown'). The fixes run finished and was checked (D250) before the change;
      the cutoff concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102
      and the check itself), so the disposition stands.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:34 UTC"
    inputs:
      - record: D246
        rev: 53e0c6fc09630ef9d1ab98946ed0443b11d4eef2da11c677c0a20b9459654ed2
---

## History
- 2026-11-02 05:47 UTC lead (session 0e89af04): created — D246: the user's condition on the one blind check
- 2026-11-02 05:50 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — Brief task 3 makes the script print exactly the two pooled shares and nothing else, tested on toy input; the implementer may not run it on real data
- 2026-11-02 15:28 UTC lead (session 0e89af04): set state=superseded; set superseded_by=P170; set resolved_by=D249 — D249: the output keeps the two pooled shares and adds one yes/no zone flag; P167's 'no zones printed' clause is replaced, its pooled-shares clause kept in P170
- 2026-11-02 15:34 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — Re-read D246@53e0c6fc0963: one dated line appended (D249 supersedes the lead's 50 %-pooled reading of 'mostly unknown'). The fixes run finished and was checked (D250) before the change; the cutoff concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102 and the check itself), so the disposition stands.
