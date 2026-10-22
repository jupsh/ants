---
id: D111
date: 2026-10-22
time: 14:32
kind: run
title: Synchrony Part B launched (D108 amendments 1–2, approved D110): B2 base / coupled / matched placebo on the judge seeds, B1 synchrony coverage; built and checked
---
- **2026-10-22 ≈ 14:32 UTC — Synchrony Part B launched (D108 amendments 1–2, approved D110): B2 base / coupled / matched placebo on the judge seeds, B1 synchrony coverage; built and checked.**
  - **Built** (all off by default; tests first):
    - `ColonyOptions.oracle` placebo `shift` (exp(x + m));
    - `ColonyOptions.oracleTrace` (log g every 10 s in [from, to); the Stroeymeyt runner sets the observed window);
    - `src/sim/analysis/oracleStats.ts` (sums reduced in the worker, combined across runs);
    - `s2018Lib.ts` `--oracle placebo:sd:τ:shift=m` and `--oracleTrace`;
    - `diagS2018.ts` writes the combined realised-signal summary;
    - reader `scripts/scratch/syncSensS2018.ts` (classes as amendment 1; names and phrasing per D110).
  - **Checks:**
    - `test/oracle.test.ts` +3: shift 0 = raw placebo; shift −sd²/2 = mean-one placebo; rows identical with the
      recorder on and off; the statistics on synthetic series, and combining across runs;
    - tsc clean; `npm test` 253 / 253; 1999 identity hash `dddbafeb…` unchanged;
    - simHash `1388de91…` → `72e05b8102168b4b`; the 9 stamped results re-stamped (`scratch/restampD110.ts`);
    - a toy smoke run of the whole chain (amendment 2) and the transient check.
  - **Run:** `scripts/scratch/box/run-syncB.sh`, outputs `logs/s5sync/` and `logs/short/s5-<arm>-c<i>.json` (box).
    - Stage 1: B2 base and coupled in parallel (31 workers each).
    - The placebo's s and m are computed from the coupled arm's `oracle.summary` only.
    - Stage 2: B2 placebo (40 workers) and B1's 66 single-colony runs (22 in parallel).
    - Then the B2 reader. B1 is aggregated locally with `syncAgg.py` against the data side (`logs/short/data-c*.json`).
  - **Box:** idle; md5 equal to the local tree for every input (`logs/md5-syncB.txt`); box simHash `72e05b81…`;
    oracle tests 15 / 15 on the box. Projected ≈ 2–2.5 h.
  - **Reading:** D108 amendments 1–2 with D110's phrasing. Matching, coverage and every row's class, unresolved
    included, are reported before any freeze or step-9 decision.
- 2026-10-22 ≈ 14:33 UTC: launched, `run.sh` run `syncB-20261022T143252Z` (box).
- 2026-10-22 ≈ 16:29 UTC, **correction (set-up error, no result affected):** run `syncB-20261022T143252Z` exited 1. B2 completed (base, coupled, placebo, reader). The placebo was fixed by stage 1 as `placebo:0.337684:60:shift=-0.064832` from the coupled arm's realised signal. All 66 B1 runs failed at start: with `--candidate C2`, `tmpShortSim.ts` adds C2's activity-row recorder (`activityHours: [0]`, observation only), which needs a 6-h window, while B1 uses F022's 4-h window. Fix: an explicit `--noActivity` flag. B1 is rerun alone (`scripts/scratch/box/run-syncB1.sh`, run `syncB1-…`) with the same arms, seed 4242 and that placebo. No B2 output was read before this line.
