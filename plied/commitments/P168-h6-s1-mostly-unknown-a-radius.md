---
id: P168
title: "H6: S1 mostly unknown, a radius proposal to the user before the freeze"
wording: If S1 turns out mostly unknown, I'd come back with a radius proposal.
made: D246
state: superseded
nodes: [T059]
resolved_by: D249
superseded_by: P171
reviews:
  - action: run:h6-fixes-20261102
    disposition: not-triggered
    because: The blind check is not run in this brief; P168 applies when its two numbers are read
    by: lead (session 0e89af04)
    at: "2026-11-02 05:50 UTC"
    inputs:
      - record: D246
        rev: 001ed95c860d0220280f7ed3039d6e65f66da0ef180bea2b9a596d153057b770
  - action: run:h6-fixes-20261102
    disposition: not-triggered
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
- 2026-11-02 05:47 UTC lead (session 0e89af04): created — D246: what follows the blind check
- 2026-11-02 05:50 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: not-triggered — The blind check is not run in this brief; P168 applies when its two numbers are read
- 2026-11-02 15:28 UTC lead (session 0e89af04): set state=superseded; set superseded_by=P171; set resolved_by=D249 — D249: 'mostly unknown' made exact (either pooled share or either zone above 50 %); the radius-proposal clause kept in P171
- 2026-11-02 15:34 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: not-triggered — Re-read D246@53e0c6fc0963: one dated line appended (D249 supersedes the lead's 50 %-pooled reading of 'mostly unknown'). The fixes run finished and was checked (D250) before the change; the cutoff concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102 and the check itself), so the disposition stands.
