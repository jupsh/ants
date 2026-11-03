---
id: D264
date: 2026-11-03
time: 09:01
kind: reading
title: T060 V0 Scope A read (D243 amendments 1 and 2): every acceptance rule passes; 'established' in a 0/200, b2 0/200, d 0/200, a-sparse 0/200 (rules at most 5 %), c 200/200 (rule at least 80 %); b 0/200 by support, as disclosed (P177); c-sparse 200/200, reported only
---
- **2026-11-03 ≈ 09:01 UTC — T060 V0 Scope A read (D243 amendments 1 and 2): every acceptance rule passes; 'established' in a 0/200, b2 0/200, d 0/200, a-sparse 0/200 (rules at most 5 %), c 200/200 (rule at least 80 %); b 0/200 by support, as disclosed (P177); c-sparse 200/200, reported only.**
  - **What ran:** the long run `t060-v0-scopeA-20261103` (gate `run:t060-v0-scopeA-20261103`;
    `logs/runs/t060-v0-scopeA-20261103-20261103T025824Z/`), `scripts/scratch/t060/scopeA.ts --case all --sets 0:200 --par
    10`, code as checked in D263 (reader.ts `01d574a3`, scopeA.ts `ca53b396`, events.ts `b88bcc6e`), exit 0. Fully
    synthetic event tables (only `roles()` ant counts read). A laptop suspend (system log: resume 2026-11-02 22:37 local)
    stalled case c's data sets 50–59 for about 3 h; their results are unaffected (each data set is deterministic from its
    streams; wall-clock time only). Outputs `logs/t060-synthetic/v0A/<case>-0-200.json`, SHA-256 prefixes a cc4ee620, b
    e9b58dd1, c a98b907b, d b31945f0, b2 f2cdd69e, a-sparse 29f3b16b, c-sparse 0bddebb8. Read: the run log's per-case
    summary lines and, from the JSON, each set's k̄ / m0 and its lower bound (the reading's statistic).
  - **Against the rules (D243 amendment 1 V0 Scope A; amendment 2):**
    - (a) exponential excess: "established" 0/200 (rule at most 5 %): **pass**. k̄ / m0 median 1.000; lower bound
      0.982–1.002 over the 200 sets.
    - (b) Lomax excess, shape 1: 0/200, every set "not established" by support (0b never reached), **passing by support,
      not by the estimator** (P177).
    - (b2) Weibull k = 0.7: 0/200 (at most 5 %): **pass**; ratio median 0.709, lower bound 0.694–0.711.
    - (c) Weibull k = 3: 200/200 (at least 80 %): **pass**; ratio median 3.001, lower bound 2.951–3.017.
    - (d) exponential with a slow lognormal state: 0/200 (at most 5 %): **pass**; ratio median 0.927, lower bound
      0.911–0.930.
    - (a-sparse) 0b alone on sparse cells: 0/200 (at most 5 %): **pass**; ratio median 0.989, lower bound 0.952–0.995
      (the memoryless reference absorbs the small-cell bias, as in the smoke, D263).
    - (c-sparse), reported without a rule: 200/200; ratio median 3.271, lower bound 3.112–3.316 (biased upward from the
      true 3, as D263 noted; the reading needs only the ratio).
  - **What this shows:** Stage 0's reader (0a, 0b with the memoryless reference, the labels) behaves as specified on
    fully synthetic event tables: no false "established" under memoryless, slowly varying, falling-hazard or sparse
    data, and reliable detection of a Weibull k = 3. It says nothing about the extraction from tracks (Scope B) or about
    the real data (V0's Scope B rules and the reproduction are separate, D243 amendment 1; P164).
  - **Next:** brief 2's check (the entry after this one).
