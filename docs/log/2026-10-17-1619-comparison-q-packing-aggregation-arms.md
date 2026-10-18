---
id: D026
date: 2026-10-17
time: 16:19
kind: design
title: Comparison Q (packing / aggregation arms, step-3 option "packing / aggregation"), design and reading logged before building
---
**2026-10-17 ≈ 16:19 UTC — Comparison Q (packing / aggregation arms,
step-3 option "packing / aggregation"), design and reading logged
before building** (user go-ahead ≈ 16:17 with amendments, pasted
guidance adopted; "aggregation rather than creep" is a hypothesis under
test, not a conclusion). Mailleux 1999: lighting not stated (16:16), so
the step-5 argument reports both phase ratios; nothing here "settles" it.
**The fit colonies are used in a development role** (as in X and Y).
- **Switches** (runner-level, off by default, tested bit-identical,
  diagnostic, **not adoptable**; outside `src/sim/behavior/`): **W**
  wall-neutral edge: in the nest, an ant whose step reaches the edge of
  the surface takes a new heading drawn uniformly among directions whose
  next 0.5 mm stays on the surface (≤ 36 draws, else reverse), from its
  own stream `RNG.stream(seed, 0x0e1d, i)`, instead of turning along the
  wall. **E** (emergent aggregation, what-if with true state): each
  in-nest ant's stop rate (`activeToRest`, nurse and forager values) ×
  (1 + k_E·n), n = resting in-nest nestmates within 8 mm (true positions
  and modes), recounted every 1 s; **k_E = 0.25 and 1.0** (fixed now). A
  percept-based mechanism is designed only if E is informative. **S**
  (data-fed site, **diagnostic only**: uses the fit colony's own
  occupancy as input, so it cannot predict held-out colonies' sites):
  stop rate × (1 + k_S·w(x, y)), w = the colony's data occupancy in the
  same phase (tracked ants, 1-mm cells, 5 × 5-mm box smoothing, divided
  by its maximum); **k_S = 3** (fixed now). The multipliers scale the
  role-specific values (16:18 defect).
- **Arms** (start point, 22 colonies × light / dark × 12 h, seed 4242,
  `--lite --robust`): **W**, **W+E(0.25)**, **W+E(1.0)**, **W+S(3)**, each
  with the control observer **and** variant M (`--obsVariant tag:0.7:90
  --pxRound 0.0229658793`); baseline (no switch) rerun with the control
  observer for the guard (its M counts are the R run's, same seeds).
  396 runs; an exits counter (observed in → out transitions of tracked
  ants) is added to `tmpShortSim --lite`.
- **Measures:** packing on control-observer output (robust under M,
  15:51): S1 median NN, S2 near share (NN < 4.1 mm), S3 NN < 8.2 mm,
  all ants; occupancy correlation with the data (5-mm cells); wall-band
  share (3 mm, descriptive). Still–still crossings (cell 5.1 / dwell 0,
  the established definition) **from the M-observed output** for the
  outcome table (the data carry their tracker's error; M is the
  calibrated stand-in); control-observer counts reported beside.
  Model / data per colony, geometric mean, colony bootstrap 2000.
- **Comparisons:** W+E and W+S **against W** (paired by colony) for their
  packing effect; **W against the baseline only** for wall share and the
  shifts in S1–S3 and occupancy correlation. **Guard:** W / baseline
  within [0.90, 1.10] for the moving fraction (each phase), exits per
  ant-hour (each phase), and the light / dark ratios of moving fraction
  and of moving-involved contacts; any outside → reported as "W shifts
  matched quantities", and the arm readings carry that caveat.
- **Outcome table, fixed now (per arm W+E(0.25), W+E(1.0), W+S(3);
  both phases):** *packing reached* = S2 ≥ 0.92 (data 0.96 / 0.955).
  r_ss = M-observed model / data still–still crossings per detected
  ant-frame. (i) packing reached and r_ss ≥ 0.8 → **the still–still
  deficit is packing**; (ii) packing reached and r_ss < 0.5 → **the
  deficit is not about packing** (falsifier); (iii) packing reached,
  0.5 ≤ r_ss < 0.8 → **mixed**; (iv) packing not reached → **not tested
  by this arm** (levels reported). For W+S, occupancy correlation ≥ 0.5
  is a **manipulation check, not evidence** (the site is the input).
  Data ceiling for occupancy: a colony's light vs dark maps correlate
  0.96 (median; 0.85–0.99).
- No further arms or strengths without the user; still–still contacts
  are never a target.
- **Built and launched ≈ 16:23** (`run.sh` run `q-20261017T162344Z`,
  `scripts/scratch/box/run-q.sh`, 396 runs, `xargs -P 62`; user approved
  the run ≈ 16:20). Code: `walkAnt` optional `edgeTurn`
  (`antPhysics.ts`); `ColonyOptions.wall` / `aggregate` / `site` with
  `stopMultStep` and `inwardTurn` (`colonyBles.ts`); threaded through
  `colonyStroeymeyt.ts`; `--wall inward`, `--agg k:r` (`s2018Lib.ts`);
  `--site k` and an exits counter (`tmpShortSim.ts`); site maps
  `logs/robust/sites.json` (from the data occupancy as logged). Tests
  `test/packingArms.test.ts` (k = 0 and empty maps bit-identical; each
  switch changes the run; nurse and forager stop rates restored; a
  uniform k = 1 site equals doubling both role values, so foragers are
  reached); `npm test` 173 / 173. Local smoke runs (colony 0, 30 min):
  the baseline reproduces 388 / 288 exactly; every arm runs (only
  completion and field presence were printed, no measure). md5 of the
  copied files checked; full sweep shows only the known `lib.ts` and
  `paperText.ts` differences. Reductions `logs/q/cs-q-*`.
