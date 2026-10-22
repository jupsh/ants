---
id: D097
date: 2026-10-20
time: 21:19
kind: reading
title: Step-5 runtime benchmark (D094) read: box, 36 fresh processes; ≈ 3 h (warm-up 900 s) to ≈ 10 h (7200 s) per fit at the generation caps; lazyRest 1.34–1.48×, bit-identical
---
- **2026-10-20 ≈ 21:19 UTC — Step-5 runtime benchmark (D094) read: box, 36 fresh processes; ≈ 3 h (warm-up 900 s) to ≈ 10 h (7200 s) per fit at the generation caps; lazyRest 1.34–1.48×, bit-identical.**
  - **Run:** `step5bench-20261020T211746Z` (box, ok, 1 m; D096's launch lines). 36 calls of `scripts/scratch/benchStep5.ts`
    (density 2 / 3 / 4 × warm-up 900 / 7200 s × lazyRest off / on × 3 reps), all at once, each in a fresh process.
    Unit: one shared-warm-up nest with 4 recruiters, as the pool's `m1999Nests` task; days 1 / 4 / 8. C2 with the role
    mix, dt 0.05, B3. The printed input md5s equal the local tree. Outputs in `logs/c2/step5-bench/`. Timing only; no
    outcome statistic is printed.
  - **Per nest-day task** (s, median of 3, mean over days), off → on:
    - warm-up 900: 2.70 → 2.00 (density 2), 3.95 → 2.95 (3), 5.02 → 3.68 (4);
    - warm-up 7200: 8.73 → 6.54, 13.36 → 9.76, 18.93 → 12.78.
    - Speed-up 1.34–1.48×. Off and on hash-equal in all 54 nest-days.
  - **Per objective evaluation** (`fitM1999` defaults: 80 recruiters per day, 4 per nest, so 60 tasks), switch on:
    - CPU: 120–221 s (warm-up 900), 392–767 s (7200);
    - wall per generation (λ 8, 62 workers, 8 waves): ≈ 16–29 s and 52–102 s.
  - **Fit budget at the generation caps** (two starts × 120 generations + one IPOP restart at λ 16, probes and
    selection batches): **≈ 3.1 h with warm-up 900 s, ≈ 10.4 h with 7200 s** (mean over densities). Upper bounds:
    tolX may stop earlier. The warm-up gate's outcome sets which; 1800 / 3600 s fall between.
  - **The gates before fitting** (D094): the equivalence gate's 1600 recruiters per day per level in the independent
    design is ≈ 3 × 1600 one-recruiter nests per level. With warm-up 7200 s that is minutes to tens of minutes per
    level on the box.
  - **Plan from here** (D094, unchanged): the warm-up and dt gate at the C2 start point first (`convergeM1999 --vary
    warmup|dt` on `m1999Points('c2')`, whose parameters already carry the role mix; `lazyRest` still to be passed through, for
    speed only), then the fit,
    launched only on the user's go.
