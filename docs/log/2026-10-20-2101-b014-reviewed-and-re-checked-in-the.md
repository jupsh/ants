---
id: D095
date: 2026-10-20
time: 21:01
kind: review
title: B014 reviewed and re-checked in the current tree (D093): patch rebased by a 3-way apply, bit-identical in every case including the fitted C2 / C1 points with D078 / D085's recorders; awaiting the user's go to apply
---
- **2026-10-20 ≈ 21:01 UTC — B014 reviewed and re-checked in the current tree (D093): patch rebased by a 3-way apply, bit-identical in every case including the fitted C2 / C1 points with D078 / D085's recorders; awaiting the user's go to apply.**
  - **Why a re-check:** B014's `proposal.patch` (sha256 `eccf2028…`) was built on `f0a05a0`. D078 and D085 later changed
    `colonyStroeymeyt.ts` (the rest-position and neighbour recorders), so `git apply --check` now fails on that file. The
    other ten files apply cleanly.
  - **Rebase:** worktree `../ants-b014r` = HEAD + the current uncommitted tracked changes + the untracked files (verified
    identical to the main tree in `src`, `test`, `scripts/*.ts`, `data/fits`, `data/reference`, apart from local-only
    excluded files). `git apply --3way` there: no conflicts.
    - In `colonyStroeymeyt.ts` the same four edits land on the new context: the import of `newColonySim`, the
      `lazyRest` option, `newColonySim(...)` and passing `lazyRest`.
    - The other existing files change only by `export`, `protected`, type-only imports and the factory, as B014
      described.
  - **Review points:**
    - with the switch on, a resting ant's percept is null. The Stroeymeyt runner reads only `body.alive`, positions
      and `mind.mode`, and D078 / D085's recorders read the observed frame. Nothing new reads percepts;
    - the Mailleux runner keeps the recruiter's percept (`observe: [n]`).
  - **Checks in the patched worktree:**
    - tsc clean;
    - fast tests 240 / 241: the one failure is the findings register flagging the 12 stamped results stale, because
      the simHash moves `286c87ca…` → `87e05e4c…` (expected, as in B014);
    - slow tier `lazyRest.slow.test.ts` + `restMaps.test.ts`: 9 / 9.
  - **Identity** (B014's `identity.ts`, unchanged; arms: main = the current main tree unpatched, off, on, verify):
    - all 9 cases hash-equal across main / off / on: D048's three Stroeymeyt cases; Mailleux pilot and C2-proxy at
      days 1 / 4 / 8, independent and shared warm-ups, followed nestmates;
    - the 22 pooled colonies are equal off / on;
    - the verify mode (the full policy on a copy at every tick) finished both its cases without a difference.
  - **New cases** (`scripts/scratch/b014Current.ts`; B014 predates them): C2's fitted point on colony112 and colony122
    and C1's on colony112. 6-h window, the 36-row extras, `restMaps` + `neighbourStats`, diag seeds. Hash-equal across
    main / off / on.
  - **Side timings** (single runs inside the identity checks, not a benchmark), off → on:
    - colony122 1 h: 29.9 → 20.7 s;
    - colony250 6 h: 114 → 84 s;
    - 22 pooled colonies: 60.7 → 43.1 s;
    - C2-proxy Mailleux days: 5.7–7.0 → 4.6–5.3 s;
    - pilot motion: no gain (as B014).
  - **To apply (on the user's go):**
    - the rebased patch onto the main tree;
    - B014's tests come with it;
    - re-stamp the 12 stamped results with a `provenance.restamped` trail (as D078 / D085). The proof of identity is
      above: main = off in every case;
    - the role-mix option for step 5 (D094) goes into `colonyMailleux1999.ts` in the same step, off by default and
      bit-identical when off, so the simHash moves once;
    - then a verify-mode run on a C2 Mailleux nest with the role mix, before the step-5 benchmark.
- 2026-10-20 ≈ 21:03 UTC (time from `date -u`), **user: "Yes"**: apply the rebased patch, add the role-mix option, re-stamp once, then the verify run (as listed above).
