---
id: D326
date: 2026-11-07
time: 05:43
kind: decision
title: User: push browser-sim-m1 and merge it to main (fast-forward to 78765aa, five commits since f8d29d5)
authority: user
scope: T001
---
- **2026-11-07 ≈ 05:43 UTC — User: push browser-sim-m1 and merge it to main (fast-forward to 78765aa, five commits since f8d29d5).**
  - **The user's words** (after the commit of D325): "let's push this branch btw and merge to main".
  - **What it does:** `main` fast-forwards from `f8d29d5` (D272's merge) to `78765aa`, and both branches are pushed to
    `origin`. This entry and the merge gate's dispositions are committed on the branch afterwards, as D272's were in
    `eebd448`. The commits since `f8d29d5` are records (D273-D325, plied) and
    `scripts/frozen/partd/` (D324); none changes `src/`, `public/`, the fits or the data, so the pages' simulation hash
    and content are unchanged. The push to `main` runs the GitHub Pages workflow (test and build) and bypasses the PR
    rule, as the user asks.
  - The ants-lab repo is local only and is neither committed nor pushed (D294).
