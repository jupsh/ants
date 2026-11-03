---
id: D263
date: 2026-11-03
time: 02:57
kind: review
title: T060 Stage 0 follow-up 1b built and checked (D243 amendment 2): 0b's memoryless reference and the k-bar / m0 reading, V0 cases b2, a-sparse and c-sparse; smoke as intended (a, d, b2, a-sparse not established, ratios 0.71-1.00; c, c-sparse established, 3.0-3.3; b passes by support); full Scope A V0 about 19 h serial, run in parallel
---
- **2026-11-03 ≈ 02:57 UTC — T060 Stage 0 follow-up 1b built and checked (D243 amendment 2): 0b's memoryless reference and the k-bar / m0 reading, V0 cases b2, a-sparse and c-sparse; smoke as intended (a, d, b2, a-sparse not established, ratios 0.71-1.00; c, c-sparse established, 3.0-3.3; b passes by support); full Scope A V0 about 19 h serial, run in parallel.**
  - **What changed** (implementer, follow-up 1b appended to brief `logs/handoff/20261103-0106-t060-s0-reader/brief.md`,
    gate `run:t060-s0-brief1b`; report saved in `report.md` beside it): `scripts/scratch/t060/reader.ts` (the memoryless
    reference and the new reading; a faster solver for the same profile MLE, earlier values agreeing to 3 decimals),
    `scopeA.ts` (cases b2, a-sparse, c-sparse; (b) tagged as passing by support; `--par n` child processes, identical
    to serial), 7 new tests. SHA-256 prefixes: reader.ts 01d574a3, scopeA.ts ca53b396, t060.test.ts 277ebb57;
    events.ts unchanged (b88bcc6e). `src/` and `scripts/frozen/` untouched.
  - **The lead's check:** hashes of code and smoke outputs match the report; T060 tests 30/30; `npx tsc --noEmit -p .`
    clean; `npm test` passed in the implementer's run (292).
  - **Smoke (3 sets per case, not V0):** k̄ / m0 and its lower bound: a 1.000–1.005; d 0.925–0.931; b2 0.705–0.712;
    a-sparse 0.989–0.998 (raw k̄ ≈ 1.22, m0 ≈ 1.23: the reference absorbs the small-cell bias); all not established. c
    3.015–3.020 and c-sparse 3.22–3.27 (raw ≈ 4.1, true 3), established. (b): support, reported as passing by support.
  - **Accepted by the lead as implementation details:** `--par` child processes instead of `scripts/pool.ts` (a pool task
    in committed `src/` would import git-excluded scratch code); the new `// EDGE:` readings: a redrawn excess in whole
    frames, at least 1, counting as an onset only strictly before its censoring frame; draws use the colonies that
    enter on the data, without re-applying entry; the reverse Kaplan–Meier over the kept cells' intervals, the ones in
    the likelihood ("the fit's intervals" of amendment 2). Noted: the reference corrects the memoryless bias but does
    not recover k (c-sparse), which the reading does not need.
  - **Next:** Scope A's V0 in full (200 sets per each of the seven cases) as a lead's long run, `--par 10` (memory: 14 GB
    machine), about 2 h; then brief 2 (extraction, Scope B, reproduction, speed-bound check).
