---
id: X028
title: H6 second blind check of S1's unknown share under the reachability clause (D252, D255): pooled unknown share 0.784 for onsets and 0.897 for the at-risk reference at W 10 s, zone condition met
date: 2026-11-02
role: fit (development use)
---
- **H6 second blind check of S1's unknown share under the reachability clause (D252, D255): pooled unknown share 0.784 for onsets and 0.897 for the at-risk reference at W 10 s, zone condition met (2026-11-02 ≈ 16:56 UTC):**
  - **Who and how:** the lead, 2026-11-02 16:55 UTC, `npx vite-node scripts/scratch/h6-next/unknownShare.ts
    --h6-unknown-share --work logs/h6-work-next` (byte-identical to the first check's script, `4c1b65aa…`; gate
    `run:h6-blindcheck2-20261102`) on the 22 intermediates rebuilt under the reachability clause (D253, D255).
  - **Seen (the whole output):** onsets 0.784; at-risk reference 0.897; zone condition "yes". Nothing else.
  - **Also seen, before the check:** `logs/h6-work-next/c15.json` is byte-identical to `logs/h6-work/c15.json` (by
    SHA-256, comparing the two builds' hashes), while the other 21 files differ. It says only that colony237's
    coverage bits are the same under both neighbour rules.
  - **Consequence:** the last check D252 allows; P173 applies (D256).
  - **Role:** the Stroeymeyt 2018 fit colonies, development use for H6 (D241).
