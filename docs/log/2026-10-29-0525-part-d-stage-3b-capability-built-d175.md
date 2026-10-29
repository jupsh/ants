---
id: D176
date: 2026-10-29
time: 05:25
kind: design
title: Part D Stage 3b capability built (D175): statistics, null pool of 16 base runs per colony (P60), reader in P59's order; three gaps in D175 filled for the user's confirmation; nothing run
---
- **2026-10-29 ≈ 05:25 UTC — Part D Stage 3b capability built (D175): statistics, null pool of 16 base runs per colony (P60), reader in P59's order; three gaps in D175 filled for the user's confirmation; nothing run.**
  - **What:** the capability rule D175 approved, as code. Nothing has run: no `cap` or `capnull` simulation, no
    capability file, no Stage 2b run. The tests use synthetic numbers only.
    - `scripts/capability.ts` (md5 `d178256e`, committed path): per-dataset θ = (R, S3₂, R_J), D126's denominator
      rule, colony-bootstrap covariance, M², condition number, the fallback, null pairs, threshold, same-member
      check, cross pair. `scripts/capSeeds.ts` (`9ea9474c`): the seeds. `test/capability.test.ts` (`1afee05b`):
      11 tests.
    - Scratch: `partD2.ts` (`4a454ad5`) gains `cap`, `capnull` and `capfiles`; `partDMembers.ts` (`15edeb88`)
      holds the member list both scripts share; `partDCap.ts` (`fa55d891`) is the reader.
    - Reused unchanged, hashes checked against their freezes: `s2Audit.ts` `f9ef0fb4`, `s2AuditGate.ts`
      `47b8cb7d`, `s2AuditFile.ts` `d888bb33` (D153); `s3Audit.py` `9ce3f5a2` (D129).
  - **Fixed here (P60: the null pool's size, before any run):**
    - **Null pool:** 16 base-arm runs per colony (352 runs) on `judge` 0xc4b3, arm key 11, runs 0–15.
      **10,000 null pairs**: in each, every colony draws 4 distinct runs from its 16 without replacement, 2 to each
      side (seed 0xca90). Why 16: on synthetic colonies, c barely depends on the pool's size (8.65 with 8 runs,
      8.58 with 64; 1,000 pairs each). 16 gives four disjoint pairs per colony and stays inside D175's cost range.
    - **Member datasets:** 9 calibrated members × 6 × 22 colonies × 2 runs = 2,376 runs, arm key = the member's
      index in D158's list, runs 2k and 2k + 1 for dataset k. Members share no seeds, so every dataset is
      independent of every other. Bootstrap streams 0xca91 per (member, k).
    - **Total for the next rental:** 2,376 + 352 + Stage 2b's 528 = **3,256 runs** (D175: ≈ 2,900–3,300).
  - **Specified by the code where D175 is silent (the lead's, within D175):**
    - Flags: `--ydist` only; S3₂ uses the onsets every run records. No `--s5` or `--snap`, which only the
      descriptive Stage 2b rows need.
    - Colony value: a dataset's two runs pooled as in Stage 2b (S2 accumulators summed, J draw d with draw d,
      S3 episodes concatenated). θ is the full-sample estimate; the covariance comes from the draws where all three
      coordinates are defined.
    - Fallback in p form: a coordinate's (1 − α) percentile CI of the difference excludes 0 exactly when its
      two-sided bootstrap p, 2 · min(share ≤ 0, share ≥ 0), is below α.
    - Per-file S2 audit null streams: set index 20 + arm key (the audit used 0–3), file key run · 100 + colony.
      `s3Audit.py` keeps its per-file `Random(53)`.
  - **Gaps in D175, filled provisionally for the user to confirm [confirm]:**
    1. **Non-evaluable datasets in the counts.** D175 fixes 14 of 135 and 27 of 36 for the complete case. The code
       uses the same shares of the evaluable pairs: the check fails if more than 10 % of the evaluable same-member
       pairs exceed, and a T–D pair is distinguished if at least 75 % of its evaluable comparisons exceed.
    2. **"S3₂ as in Part C" (D175 item 5).** Part C has no S3₂, so the code reads this as the Stage 0 reader's
       colony rule (D129): at least 5 episodes with S3₂ defined, the colony value being their mean.
    3. **The fallback's α.** "Tightened on the nulls" is implemented as: the first of {0.05, 0.025, 0.01, 0.005,
       0.001} / 3 whose false-positive rate on the nulls is ≤ 5 %. If none is, the reader stops and the question
       goes to the user.
  - **Synthetic check (Gaussian colony values, no simulation; descriptive):** on 1,000 independent pairs of
    22-colony datasets, the 95th percentile of M² is ≈ 8.5 (χ²₃: 7.81). The uncalibrated Bonferroni screen at
    0.05/3 gives ≈ 6.9 % false positives; at 0.025/3 it gives 3–4 %. At 22 colonies, bootstrap covariances run a
    little narrow, which is why c and α are set on nulls rather than taken from χ². The capability verdict itself
    remains unrun.
  - **Checks:**
    - 11 unit tests: M² and the condition number on known cases; D126's edge rule; the minimum of 18 colonies;
      null pairs drawing distinct runs; the 13/14-of-135 boundary; the 27/36 boundary; fewer than 4 datasets
      making a pair not evaluable; cap seeds distinct and unused by Stage 2a or 2b.
    - Pooling: on Part C's base files (already read, D166), `poolColony` reproduces D166's base-arm S2 and S2-J
      means in the < 5 and 20–40 mm bands exactly (0.066105, −0.003452, 0.045383, −0.001511; 22 colonies).
    - `npm test` passes (286 tests); `tsc` is clean.
  - **Order enforced in code (P59):**
    - `partDCap.ts nulls` reads only the base pool and writes `nulls.json` once, with the plausibility tables P61
      asks for and the fallback rates P62 asks for.
    - `same --frozen Dnnn` needs the entry that froze c and stamps it.
    - `cross` refuses unless the same-member check passed.
  - **Before any capability run:**
    - Q21 (Part B) answered, and this entry's three gaps confirmed;
    - `plied review T033 --gate`;
    - the Stage 2b + capability estimate (3,256 runs), with its rental approval (P50);
    - `logs/partd2/cap/` and the `pd-cap-` outputs of the members sealed until c is frozen. The base pool is read
      for the freeze.
