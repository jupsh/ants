---
id: D268
date: 2026-11-03
time: 15:50
kind: review
title: T060 support-only audit: the restricted support reader and audit CLI built and checked (D266; D243 15:18 block): counts equal readStage0's on Scope B a-0 and c-0 and Scope A c-0 (0 mismatches), whitelist and forbidden-name tests pass, colony-237 reproduction byte-identical; extract.ts gains only the retagged-partner descriptive and an import guard
---
- **2026-11-03 ≈ 15:50 UTC — T060 support-only audit: the restricted support reader and audit CLI built and checked (D266; D243 15:18 block): counts equal readStage0's on Scope B a-0 and c-0 and Scope A c-0 (0 mismatches), whitelist and forbidden-name tests pass, colony-237 reproduction byte-identical; extract.ts gains only the retagged-partner descriptive and an import guard.**
  - **What was built** (implementer, brief `logs/handoff/20261103-1529-t060-support/brief.md`, gate
    `run:t060-support-brief`; report saved beside it), in `scripts/scratch/t060/` (scratch until frozen):
    - `support.ts` (SHA-256 f22b6423): `supportOfVariant` / `supportOfColony` (whitelist (A) of the 15:18 block),
      `poolSupport` (whitelist (B): per variant the colonies counting for 0a and entering 0b and the per-colony sums;
      for the primary only the verdict keyed "support retained by the frozen extraction", with its two parts; the
      colony-237 block with `pivotal0a` / `pivotal0b`), `pooledLines` (six printed lines), and the audit CLI (`--colony
      i --out <dir>`: the extraction pass in memory, only `support-c<i>.json` written; `--pool --in --out`). From
      `reader.ts` it uses only `buildTriplets`, `matchColony` (the matched count, the no-context count and the supplying
      ants leave the call), `fitInputOf` (`supplyingAnts`, `uncensored`) and the support constants; 0b's entry is the
      reader's rule written out.
    - `extract.ts` (SHA-256 29d04b25, was 30245cb4): `colonyList` marks tags added from `retagged_ants.txt`, and the
      primary table's `extraction` gains `retaggedPartners: [{ tag, lightReads }]` (light-phase frames with a read, the
      resolver's own "seen" loop); line 908's main guard also skips when `T060_SUPPORT_AUDIT` is set, which
      `support.ts` sets before importing it (vite-node's argv does not hold the script path, so without it
      `support.ts --colony i` would have run `extract.ts`'s main and written event tables). Nothing else changed.
    - `t060.support.test.ts` (f7f17616): 10 tests, among them fixed key lists for (A) and (B), every number in (A) a
      count, and a source test that `support.ts` names none of the forbidden functions, nor `cutsI1`, `cutsB`,
      `quintileCuts` or `.cells`.
    - Unchanged: `reader.ts` 01d574a3, `events.ts` bec9264b, `argvGuard.ts` fad6e77f.
  - **The lead's check:** hashes match the report; `support.ts` read in full against the 15:18 block (outputs,
    forbidden computations, the withheld error details, the colony-237 flag) and the `extract.ts` changes read; `npx
    tsc --noEmit -p .` clean; T060 tests 66/66; `npm test` 292/292 in the implementer's run; the equality script
    (`VITEST=1 npx vite-node logs/t060-support-check/check.ts`) rerun by the lead: `failures: 0`.
    - Scope B a-0 and c-0, 22 colonies × 5 variants: 418 per-colony comparisons per variant, 0 mismatches; 0a 0 and 0b
      entering 0, as `readStage0` and the recorded `stage0-scopeB-*.json`. Scope B has no complete interval, so these
      exercise only the interval, unknown, bout and candidate counts.
    - Scope A c-0 in memory: 0 mismatches with non-zero triplets, matching and entry (0a 21 = reader 21, entering 21 =
      reader 21; 11,379 contact triplets, 1,735 matched).
    - One Scope B colony re-extracted with the new `extract.ts`: all five tables byte-identical apart from
      `retaggedPartners` (`[]`).
    - **Colony-237 reproduction:** `extract.ts --colony 15 --repro` (colony237 is index 15) gives a
      `repro-c15.json` byte-identical to D265's (SHA-256 df72e397 both); the lead confirmed with `cmp`.
  - **Runs outside the brief's list, accepted by the lead:** the Scope B re-extraction inside `check.ts` (synthetic;
    named by the acceptance), `check.ts` under `VITEST=1` (stops `scopeA.ts`/`scopeB.ts` mains on import), and
    `support.ts --colony 99` (an invalid index; it stops before any track is read, checking the guard). None read
    real tracks beyond the named repro.
  - **Other retagged tags:** only colony 237's tag 52 is added from `retagged_ants.txt`; the others are already in
    their tag files, so `retaggedPartners` is `[]` elsewhere (metadata, read by `colonyList`).
  - **What it means:** D267's three conditions for the freeze commit (equality, whitelist, colony-237 reproduction)
    are met; the freeze follows (P184). Nothing empirical has been read.
