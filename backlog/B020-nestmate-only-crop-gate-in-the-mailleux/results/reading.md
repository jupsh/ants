# B020 reading: separating the recruiter crop gate

At the historical B001 pilot point, fixing the recruiter at 0.05 greatly reduces the largest Table-2a mean shifts, but does not produce a demonstrated guard pass. Both nestmate-only arms still exceed the original 1-SE_data guard in two sample means; their uncertainty spans the boundary. After-trophallaxis leaving is 18.2 / 11.4 / 10.2% at 1 / 4 / 8 starvation days, and the 0.5 and 1 nestmate-only arms have identical recruiter outputs throughout this sample.

## Design and evidence

The reading was stated in the README Progress log before running. Five arms × three days × 80 recruiters = 1,200 recruiter observations, grouped into 20 independent nests per cell with four recruiters sharing each warm-up. Arms use paired nests and recruiter seeds. The same historical pilot fit, density 0.49510385870165696, dt 0.025 s, warm-up 900 s and default contact minimum 1 s are used throughout. No fit, model adoption or step-5 reopening is performed (D138 item 5). This is not a test of the C2/step-5 candidate.

`sweep.ts` reuses `SimPool.m1999Shared`. At this pilot, no nestmate has the forager trait. An item-only `leaveCropFrac: 0.05` role override, passed through the existing runtime spread in `nestParamsOf`, is therefore applied only to the added recruiter. That key intentionally lies outside the production `ForagerMotion` type. The script refuses parameter points with existing forager overrides or forager nestmates. Routing assertions check actual colony agents; the marked-role 0.05 baseline reproduces every `M1999Recruiter` field exactly for four recruiters on each starvation day (`results/check.json`). No production API is extended.

All 15 cell JSON files retain the recruiter summaries; `results/summary.json` contains all row means, denominators and uncertainty intervals. Every JSON is stamped. Each cell verifies unchanged simulation/dependency hashes before writing. The 15 cells used 532.0 s in total, 26.4–62.5 s per invocation, with four niced workers.

Intervals are 2,000-replicate percentile bootstraps over whole nests, paired across arms for the Table-2a shifts. Each arm keeps its own available cases for `contactsBefore`. Intervals are per row and are not simultaneous or tests against the Table-2b data.

## Table-2a guard

The original guard is a sample mean shift of at most 1 SE_data on every row. All 15 rows are estimable in each arm.

| Arm | Largest signed shift (SE_data) | Row | 95% interval for that row | Rows with absolute sample shift > 1 |
|---|---:|---|---|---:|
| Baseline, everyone 0.05 | +0.000 | timeInNest.d1 | [+0.000, +0.000] | 0 |
| Everyone 0.5 | -7.310 | trophTotal.d8 | [-17.652, +0.873] | 7 |
| Everyone 1 | -11.156 | trophTotal.d8 | [-23.616, -0.155] | 7 |
| Nestmates 0.5, recruiter 0.05 | +1.494 | trophTotal.d4 | [-0.444, +4.051] | 2 |
| Nestmates 1, recruiter 0.05 | +1.494 | trophTotal.d4 | [-0.444, +4.051] | 2 |

The shared-gate arms reproduce the large sample-mean guard failure, although precision is weak at 20 nests: no individual interval for the shared-0.5 arm lies wholly beyond the guard; the shared-1 arm has `timeInNest.d8` wholly below −1.

For both nestmate-only arms, the two sample failures are `timeInNest.d4` +1.482 SE_data (95% interval −0.269 to +4.102) and `trophTotal.d4` +1.494 (−0.444 to +4.051). None of their per-row intervals lies wholly beyond the guard, and only nine of fifteen lie wholly within it. Thus the fixed-budget evidence does not establish either a population-level guard pass or a confidently persistent guard failure. The reduction of the large shared-gate shifts supports the recruiter-confound concern; it does not remove all nestmate-side effects.

All signed sample shifts:

| Row | Everyone 0.5 | Everyone 1 | Nestmates 0.5 only | Nestmates 1 only |
|---|---:|---:|---:|---:|
| timeInNest.d1 | -1.248 | -1.328 | +0.213 | +0.213 |
| distance.d1 | +0.791 | +0.773 | +0.111 | +0.111 |
| contacts.d1 | -0.651 | -0.544 | +0.159 | +0.159 |
| trophTotal.d1 | -1.909 | -2.054 | +0.197 | +0.197 |
| contactsBefore.d1 | +0.082 | +0.082 | +0.000 | +0.000 |
| timeInNest.d4 | -3.093 | -3.730 | +1.482 | +1.482 |
| distance.d4 | +0.141 | +0.421 | +0.165 | +0.165 |
| contacts.d4 | -0.395 | +0.164 | +0.592 | +0.592 |
| trophTotal.d4 | -3.004 | -3.890 | +1.494 | +1.494 |
| contactsBefore.d4 | +0.681 | +0.834 | +0.000 | +0.000 |
| timeInNest.d8 | -4.904 | -7.665 | +0.470 | +0.470 |
| distance.d8 | +0.209 | +0.031 | +0.174 | +0.174 |
| contacts.d8 | -2.170 | -2.852 | +0.269 | +0.269 |
| trophTotal.d8 | -7.310 | -11.156 | +0.865 | +0.865 |
| contactsBefore.d8 | -0.144 | -0.259 | +0.000 | +0.000 |

## Contacted nestmates leaving within five minutes

Percentages below pool contacted nestmates across recruiters, matching the existing runner. Counts are not independent trials: nest-level uncertainty is reported in the JSON and table. Previously recorded Table-2b development values are 44 / 56 / 86% after trophallaxis and 69 / 89 / 93% after other contacts; their questionable sample sizes preclude significance tests here.

| Arm | Day | After trophallaxis: left / n | % [95% interval] | After other contact: left / n | % [95% interval] |
|---|---:|---:|---|---:|---|
| Baseline, everyone 0.05 | 1 | 5 / 100 | 5.0 [1.7, 9.5] | 81 / 320 | 25.3 [20.1, 30.7] |
| Baseline, everyone 0.05 | 4 | 5 / 136 | 3.7 [1.3, 6.8] | 162 / 427 | 37.9 [32.9, 42.4] |
| Baseline, everyone 0.05 | 8 | 4 / 133 | 3.0 [0.7, 5.7] | 169 / 433 | 39.0 [32.8, 45.3] |
| Everyone 0.5 | 1 | 24 / 96 | 25.0 [17.9, 33.0] | 72 / 301 | 23.9 [18.9, 28.7] |
| Everyone 0.5 | 4 | 22 / 135 | 16.3 [10.9, 21.8] | 156 / 402 | 38.8 [33.4, 44.0] |
| Everyone 0.5 | 8 | 15 / 118 | 12.7 [7.9, 17.9] | 164 / 419 | 39.1 [32.6, 45.5] |
| Everyone 1 | 1 | 24 / 95 | 25.3 [18.2, 33.3] | 73 / 304 | 24.0 [19.1, 28.8] |
| Everyone 1 | 4 | 26 / 137 | 19.0 [12.8, 25.3] | 153 / 393 | 38.9 [34.0, 43.9] |
| Everyone 1 | 8 | 12 / 120 | 10.0 [5.5, 15.0] | 156 / 407 | 38.3 [32.2, 44.2] |
| Nestmates 0.5, recruiter 0.05 | 1 | 18 / 99 | 18.2 [11.8, 25.3] | 80 / 324 | 24.7 [19.3, 30.7] |
| Nestmates 0.5, recruiter 0.05 | 4 | 16 / 140 | 11.4 [6.5, 16.8] | 164 / 424 | 38.7 [33.7, 43.2] |
| Nestmates 0.5, recruiter 0.05 | 8 | 14 / 137 | 10.2 [6.6, 14.0] | 174 / 433 | 40.2 [34.0, 46.1] |
| Nestmates 1, recruiter 0.05 | 1 | 18 / 99 | 18.2 [11.8, 25.3] | 80 / 324 | 24.7 [19.3, 30.7] |
| Nestmates 1, recruiter 0.05 | 4 | 16 / 140 | 11.4 [6.5, 16.8] | 164 / 424 | 38.7 [33.7, 43.2] |
| Nestmates 1, recruiter 0.05 | 8 | 14 / 137 | 10.2 [6.6, 14.0] | 174 / 433 | 40.2 [34.0, 46.1] |

The nestmate-only point estimates span 10.2–18.2%, rather than universally reproducing B001’s historical 13–19% range. Their intervals overlap that range, so the lower values are not a precise new bound. The sample still has low leaving after trophallaxis and no increasing starvation pattern. The two nestmate-only thresholds yield exactly equal recruiter summaries on every day (all 240 paired recruiter outputs checked), which supports saturation between 0.5 and 1 for these seeds and this parameter point only.

## Implication and limits

The historical shared-gate guard failure cannot be treated as evidence about nestmate-only relaxation. Most of the large point shifts disappear when the recruiter keeps its own gate, but a guard pass remains unresolved at this sample size. There is no basis here to adopt a new rule or reopen M1 step 5. Further precision or a C2 diagnostic would need a separate scope; no extra arms or seeds were run. The lead may record this qualification alongside B001 and the unresolved guard precision. No sealed paths, held-out data or uncleared literature were inspected.

## Validation and plied handoff

The role-routing and ordinary-versus-marked baseline assertions passed. Both
the standalone item TypeScript check and `npx tsc --noEmit -p .` passed.
`npm test` passed 292 tests in 37 files. `node backlog/backlog.mjs check B020`
reported all 17 stamped JSON files current, with zero stale files. The scoped
whitespace check passed; `src/`, `scripts/`, fits and precomputed outputs
remain unchanged.

The final `plied check --json` snapshot had zero errors and 15 stale-review
warnings, caused by concurrent main-line entries D223/D224. They were left
for the lead: P103 (D224); P70, P80, P83 and P87 (D223); P82 (D223 and D224);
P66, P67, P68, P69, P71, P72, P73 and P74 (D223 through their links); and
T033 (D224 through its links). These records are outside this item's scope
and this agent's record-edit authority; no scan or disposition was claimed
for them. The main line was actively changing during the task, so this is a
snapshot, not a promise that its warning count will remain fixed.
