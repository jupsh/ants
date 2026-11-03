---
id: D258
date: 2026-11-03
time: 00:01
kind: decision
title: User: go-ahead for the H6 freeze (T059; D257): the frozen code and every file it imports copied byte-identical under scripts/frozen/h6/ with full SHA-256s recorded, committed with the records since dca4a4a, then the H6 empirical output folder unsealed for the reading; S1 coverage-limited (P173)
authority: user
scope: T059 P151 P172
---
- **2026-11-03 ≈ 00:01 UTC — User: go-ahead for the H6 freeze (T059; D257): the frozen code and every file it imports copied byte-identical under scripts/frozen/h6/ with full SHA-256s recorded, committed with the records since dca4a4a, then the H6 empirical output folder unsealed for the reading; S1 coverage-limited (P173).**
  - **How it was given:** after D257 the lead asked whether to proceed with the freeze and the commit. The user first
    pasted an outside review of D257 (hashes verified, extractor diff checked, "I recommend proceeding with the freeze
    and commit. The coverage change does not affect either primary decision label."; it changed no files and read no
    sealed output). The lead did not take a pasted recommendation as the user's decision and asked for it in the
    user's words; the user answered: *"Yes, please go ahead."* The go-ahead covers the steps the lead listed: this
    entry, the commit gate, the copy with full SHA-256s recorded in D241 and here, `npm test` and `tsc`, the commit
    (plain message), then the H6 empirical output folder removed from `.claude/sealed-paths.txt`, and P151 and P172
    closed.
  - **Frozen set (lead's detail, from D249's "relative layout kept, so imports resolve" and P172's "every file it
    imports"):** the transitive relative-import closure of the six `scripts/scratch/h6-next/` scripts (`reader.ts`,
    the reader; `extract.ts`, the reachability extractor; `synth.ts` and `repro.ts`, the V1–V4 and reproduction code;
    `unknownShare.ts`, the blind checks; `vSpeed.ts`, P174's v), 24 files, copied under `scripts/frozen/h6/` at their
    repo-relative paths (`scripts/frozen/h6/scripts/scratch/h6-next/reader.ts`, `scripts/frozen/h6/src/sim/core/rng.ts`,
    …), so every import resolves inside the copy and it runs from the repository root. Ten are git-excluded scratch
    files; fourteen are committed and unmodified at the freeze. None derives from the Khuong CeCILL port
    (`sectoredWalker.ts` is CC BY 4.0, already committed); none resolves paths from its own location. The tests
    (`h6.test.ts`) are not part of the frozen set. The hashes are listed in the freeze entry that follows.
