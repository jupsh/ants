---
id: X027
title: H6 blind check of S1's unknown share before the freeze (D246, D249): pooled unknown share 0.783 for onsets and 0.896 for the at-risk reference at W 10 s, and the zone condition met (an L or H share above 50 %)
date: 2026-11-02
role: fit (development use)
---
- **H6 blind check of S1's unknown share before the freeze (D246, D249): pooled unknown share 0.783 for onsets and 0.896 for the at-risk reference at W 10 s, and the zone condition met (an L or H share above 50 %) (2026-11-02 ≈ 15:38 UTC):**
  - **Who and how:** the lead, 2026-11-02 15:37 UTC, `npx vite-node scripts/scratch/h6/unknownShare.ts
    --h6-unknown-share` (sha256 `4c1b65aa…`, read in full first; gate `run:h6-blindcheck-20261102`) on the 22 H6
    intermediates in `logs/h6-work/`, as D246 and D249 allow once before the freeze.
  - **Seen (the whole output):**
    - "S1 unknown share, onsets, W 10 s, pooled over 22 colonies: 0.783"
    - "S1 unknown share, at-risk reference, W 10 s, pooled over 22 colonies: 0.896"
    - "S1 unknown share, zone condition (L or H above 50 %, onsets or at-risk reference): yes"

    Nothing else: no per-colony, per-zone or per-role value, no contact split, no initiator and no H6 statistic.
  - **Consequence:** D249's rule is met, so a coverage proposal goes to the user before the freeze (D251; Q34). Any
    later choice of coverage rule is made knowing these three numbers, which is the purpose of the check; the S1
    reading itself (contact shares, excess) remains unseen.
  - **Role:** the Stroeymeyt 2018 fit colonies, development use for H6 (D241).
