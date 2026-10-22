---
id: D096
date: 2026-10-20
time: 21:06
kind: run
title: B014 applied (D095, user go): rebased patch in the main tree; step-5 role mix through the existing foragerFrac (no src change); simHash 286c87ca → 3c4d7e2b; 9 stamped results re-stamped with a trail
---
- **2026-10-20 ≈ 21:06 UTC — B014 applied (D095, user go): rebased patch in the main tree; step-5 role mix through the existing foragerFrac (no src change); simHash 286c87ca → 3c4d7e2b; 9 stamped results re-stamped with a trail.**
  - **Patch:** `backlog/B014-…/proposal.rebased.patch` (sha256 `55e224a0…`; B014's original `proposal.patch` beside it,
    unchanged). It is the diff from the main tree's 11 files to the worktree `../ants-b014r` checked in D095. Applied with
    `git apply`; afterwards all 11 files are byte-identical to the worktree's. `lazyRest` is off by default.
  - **Role mix (D094 open choice 1) without a `src` change:** the nest model already has `foragerFrac`. Each nestmate
    gets the forager trait with that probability, drawn from its own trait stream after its other draws, so nothing
    else shifts; the recruiter always has it. The transfer sets `foragerFrac` = 0.320 ('mix') or 0 ('nurse', the
    sensitivity). The count per nest is therefore binomial, not an exact 32 % (the design's "drawn"). D094 had planned
    a new option in `colonyMailleux1999.ts`; it is not needed.
  - **Step-5 code** (scripts and tests only):
    - `scripts/m1999C2.ts`: the transfer and the share;
    - `fitM1999.ts --model C2 [--roles mix|nurse]`: own output name `colony-m1999-c2[-nurse]-…`, so model-A / B
      fits are never overwritten; the density box 2–4; the bound flag on the boxes in use; B3; dt 0.05; starts at
      density 3 and 2.3. Models A / B are unchanged;
    - `m1999Points('c2')`: the C2 start points for the gates;
    - `test/m1999C2.test.ts` (5).
  - **simHash** `286c87ca9157d928` → `3c4d7e2b18d7f147` (the worktree showed `87e05e4c…` because it lacks the git-ignored
    data the hash includes).
  - **Re-stamped** with a `provenance.restamped` trail entry (as D078 / D085): the 9 files stamped at `286c87ca…`
    (B001 sweep, B013 roundtrip, B014 bench and identity, B018 rules / site / walkon, B019 comove,
    `data/reference/stroeymeyt2018-rest-position.json`).
    - The proof is D095's: with the switch off, outputs are hash-equal to the unpatched tree in every case.
    - B001's `depends` hash of `scripts/m1999Points.ts` is refreshed: the file gained a `c2` branch only, and the
      model-A points it used are unchanged.
    - Files that were already stale before today (B008, B009, B014's baseline and bench-round1) are left as they were.
  - **Checks after applying:**
    - tsc clean; `npm test` 247 / 247; findings check 0 stale. `backlog.mjs check` shows 5 stale, the five that were
      stale before today;
    - B014's switch on step-5 C2 nests with the role mix (`scripts/scratch/c2NestLazy.ts`): shared warm-up, 2
      recruiters per nest, warm-up 900 s, dt 0.05, B3, followed nestmates, decomposition, densities 2 / 4 × days 1 / 4 /
      8. Off and on are hash-equal in all 6. The verify mode (density 4, day 8) ran without a difference (229 s).
  - Next: the step-5 runtime benchmark (D094).
  - **Disclosed (≈ 21:20 UTC):** the benchmark script's smoke test (density 2, warm-up 900, switch on, one repetition
    outside the benchmark's) printed the 12 simulated recruiters' times in nest at the step-5 start point. These are
    model outputs at an unfitted point, on fit-role targets; no data were seen. The output was removed from the script
    before the benchmark ran.
  - **Benchmark moved to the box** (≈ 21:17 UTC, user question). The local run was stopped after 9 of 36
    calls (kept as `logs/c2/step5-bench/local-partial.jsonl`). Box per-core times are the relevant ones for a box fit,
    and all 36 calls run at once there.
    - Box synced (src/sim with B014, the step-5 scripts, the benchmark): `src/sim`, `scripts/*.ts`, `data/fits` and
      `data/reference` md5-equal to the local tree, except the local-only paper scripts.
    - Script `scripts/scratch/box/run-step5bench.sh`.
    - Launched: `run.sh` run `step5bench-20261020T211746Z` (box).
