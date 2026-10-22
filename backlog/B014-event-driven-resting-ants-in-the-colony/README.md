---
id: B014
title: Event-driven resting ants in the colony runner
status: done
size: M
priority: 20
note:
outcome: lazyRest switch, bit-identical (all byte-for-byte checks equal); 1.37× Stroeymeyt colony122, 1.40× Mailleux at 138 nestmates, 1.15× at 53, none under the pilot motion; proposal.patch unapplied
depends: data/fits/s2018-tracker.json, data/fits/s2018-trips.json, data/reference/stroeymeyt2018-fit-rows.json, data/reference/stroeymeyt2018-activity-rows.json
---
# B014 — Event-driven resting ants in the colony runner

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS Decisions log 2026-10-18 ≈ 04:09 (speed-up attempt) and the discussion after it. **Technical
background: `GUIDE.md` in this folder. Read it whole first.**

## Question
Can in-nest ants that are resting be consulted only at events (a constant-rate wake time, contact changes, signal and threshold changes, hazard events), behind a switch that is off by default and bit-identical when off, and how much faster are Stroeymeyt and Mailleux colony runs with it?
- **Revised 2026-10-19 (user approved DESIGN rev 2).** The mechanism is an exact per-step `restTick` for resting
  ants instead of event skipping. It repeats the original resting step and hands any other branch back to the
  original policy, so the switch is bit-identical to stepping. The question is now: how much faster are the
  Stroeymeyt and Mailleux colony runs with it, at bit-identical results?

## Why it matters
- About 95 % of in-nest ants are still, yet each is stepped every 0.05 s.
- Safe bit-identical micro-optimisation is nearly exhausted (≈ 13 % on 2026-10-18).
- The Mailleux 1999 step-5 colonies are about 10× the Stroeymeyt ones, so a 1.5–2× (or larger) speed-up there
  shortens step 5 by days of box time.
  - **Corrected 2026-10-19 (B014 design, § 3):** the *real* 1999 colonies were about 10× larger. The simulated
    1999 nests hold 23–138 nestmates (colony122: 152) and run ≤ 35 min. The measured C2-like Mailleux runs gain an
    estimated 1.3× (53 nestmates) to 1.8× (138), so step 5 saves minutes to an hour per fit, not days. The main use
    is Stroeymeyt-scale runs (`DESIGN.md` § 3).
- **Not needed for C2's step-4 fit**, which runs on the stepped code.
- If the gain is small, or equivalence can't be shown, the answer is "stay stepped", which is also useful.

## Done when
1. `DESIGN.md` is approved by the user (GUIDE.md, deliverable 1).
2. `proposal.patch` implements an opt-in switch with tests. Switch off: bit-identical (all tests, the rows of the
   three byte-for-byte checks in STATUS 2026-10-18 ≈ 04:09). Switch on: pooled = serial.
3. A stamped local benchmark gives the speed-up on the largest Stroeymeyt colony (colony122) and on one Mailleux
   1999 colony, back to back on an idle machine, plus the Findings. The box equivalence gate is a separate run,
   on the user's go-ahead.
- **Revised 2026-10-19 (DESIGN rev 2, user approved; implement before step 5, without affecting the running C2
  fit).** Item 2: switch on = switch off, bit for bit, in whole runs and in the per-step differential mode against
  the original policy, plus the boundary unit tests (DESIGN § 7). Item 3: no box equivalence gate is needed; the
  byte-for-byte checks run locally.

## Base
`f0a05a0` (HEAD at claim, 2026-10-19). `src/sim` is identical to `3a98e86` (the C2 preparation): nothing under
`src/sim` changed since. The newer commits touch scripts and records only, including D070's probe scaling in
`fitS2018.ts`. The five main-tree files below are clean at claim: `colonyBles.ts`, `lasiusNestWorker.ts`,
`contactPairs.ts`, `drive.ts`, `colonyStroeymeyt.ts`.

## Data and roles
- Stroeymeyt 2018 fit colonies: fit role. Only as simulation inputs (colony sizes, the frozen tracker) and, for
  the equivalence gate, the existing fit targets.
- Mailleux 1999 set-up: as in `fitM1999.ts`, no new data.
- Held-out: none.

## Compute
- Local: tests and benchmarks, niced, minutes.
- Box: the equivalence gate only, a few hours, on the user's go-ahead and never beside a main-line fit unless on
  idle workers.

## Out of scope
- Changing default numerics, any adopted fit, or the model.
- The drive tick is a model change: it is proposed in `DESIGN.md` for the user, not implemented as a default.
- Analytic metabolism (stays stepped in a first version).
- Applying the patch to the main tree.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-19 18:19 UTC · lead-claude-b014 · Claimed (lead-claude-b014). Base f0a05a0 (src/sim = 3a98e86; the five main-tree files clean). Baseline measured before the design, stepped code, local, niced: profile.ts (colony122, C2 start 0, dt 0.05, 30 min + 1 h) and profileM1999.ts (B008's workload, pilot motion and a C2-proxy motion, densities 2.3 and 6, 16 recruiters). Ant-steps at rest: 97.5 % / 40.0 % / 96.6 % / 97.9 %. Wall: 25.7 s / 504 / 270 / 761 ms per recruiter. Profiles: contact sensing 16.7 %, meet 10.3 %, decide 7.1 %, metabolise 6.9 % (colony122). results/baseline.json.
- 2026-10-19 18:19 UTC · lead-claude-b014 · DESIGN.md written (deliverable 1). Exact drive clock: no drive tick, no model change. Skip-invariance (event model with skipping = consulting every step, bit for bit) is the main test. Estimated gain: 1.7–1.85× colony122; 1.3× / 1.8× on Mailleux at 53 / 138 nestmates. Correction: the simulated 1999 nests are not 10× Stroeymeyt's; README corrected in place, dated. Stopped: waiting for the user's approval of DESIGN.md and the priority decision (DESIGN § 14). No worktree yet; nothing in the main tree changed.
- 2026-10-19 18:30 UTC · lead-claude-b014 · User review of DESIGN rev 1: direction approved (policy-owned contract, stepped drive with no tick, separate streams, skip-invariance), with three defects. (1) Encounter expiry reversed against meet (renewed contact resets unseen first). (2) Timestamps change decisions: 100×0.05 summed = 4.99999999999999; checked: the accumulated sum crosses one step late at dt 0.05 for 5 s and 120 s, at dt 0.1 for 5/10/120 s and at dt 0.025 for 2 s. (3) The drive-clock boundary (T ≤ D_k vs the strict crossing), equality, zero rates and mid-step rests were unspecified, and 'only the draw order changes' overstated. Required: deterministic comparisons against the original stepped policy.
- 2026-10-19 18:30 UTC · lead-claude-b014 · DESIGN rev 2: an exact per-step restTick in the policy module replaces event skipping. It uses the original accumulations (+= dt), the original need >= left test and the same body.rng hazard draws; it bails, with the RNG restored, to the original lasiusNestWorker whenever another branch could be taken. Bit-identical to stepping, so no event streams, no drive clock, no statistical box gate, no stepping-path dependencies. Verification: whole-run switch on = off, a per-step differential mode against the original policy, and boundary unit tests (encounter 1/2/3-step gaps, 5 s and 120 s timer crossings, need === dt, a zero spell, a zero rate, mid-step rests, a hazard on a tick step). Estimated 1.6–1.8× (colony122). Waiting for the user: approve rev 2, the item's question/Done-when change, priority.
- 2026-10-19 18:58 UTC · lead-claude-b014 · User approved DESIGN rev 2 and asked for the implementation before step 5, as long as the running C2 fit is not affected. Plan: worktree ../ants-b014 (branch b014-lazy-rest from f0a05a0) outside the main checkout; the box and its worktree are untouched; local runs niced; delivery as proposal.patch. Question and Done-when amended in place, dated.
- 2026-10-19 19:28 UTC · lead-claude-b014 · Implemented in the worktree ../ants-b014 (branch b014-lazy-rest from f0a05a0): restTick plus meetUnchanged (policy), lazyRest in ColonySim (records, change marks, lazy percepts, verify mode, refusals), updateAdjacency/contactPercepts split, interoceptInto, pass-through for Stroeymeyt and Mailleux. Tests test/lazyRest.test.ts (24, ~7 s) and test/slow/lazyRest.slow.test.ts (3) pass. The step-by-step harness checks every tick against the original policy on a copy. Mutation check: late and early hand-backs and a missing drop test are all caught. npm test: 217/218; the failure is the findings register flagging F058–F062 stale because the simHash moved (no code fault). tsc clean. Next, identity.ts in three arms (main checkout, worktree off, worktree on; plus verify): D048's three cases, Mailleux (pilot and C2-proxy, d1/4/8, independent and shared, follow), 22 colonies pooled. Reading: every hash equal = bit-identical, as designed. Any difference = a defect to find before any benchmark; nothing is tolerated.
- 2026-10-19 19:47 UTC · lead-claude-b014 · Identity checks (identity.ts; out/identity/*.log; results/identity.json): all 9 cases plus 22 pooled colonies bit-identical across the main checkout, worktree off and worktree on. Verify mode (10 min colony122; a C2-proxy Mailleux nest) completed without a difference. Side timings: the switch gains only 1.3–1.4× on Stroeymeyt and 1.2× on C2-proxy Mailleux, and is 7–15 % slower with the pilot motion (60 % walking). The profile shows the tick path still costing about what decide+meet did, plus per-step bookkeeping. Change marks now restricted to tick candidates; the pilot is still about 7 % slower. Next: bench.sh (4 workloads × main/off/on × 3 reps, alternating, fresh processes). Reading: speed-ups are measured, whatever they are; the item's estimate of 1.6–1.8× was mine, not a target.
- 2026-10-19 21:32 UTC · lead-claude-b014 · Benchmark round 1 (bench.sh, results/bench.json): medians main/off/on: colony122 30.0/35.6/21.7 s; Mailleux pilot 9.5/10.2/10.7; C2-proxy d2.3 5.1/5.1/4.3; C2-proxy d6 14.2/14.4/10.1. Found a regression in the switched-off path: on colony122 it is bimodal (about a third to half of runs take 35–38 s against 30 s); main fast in 53/53 runs, a clean f0a05a0 worktree 10/10. The slow runs are a garbage-collection regime (+2.5 s GC, slower allocation-heavy senseIncremental and meet). Not explained by pre-allocated garbage (main 18/18 fast). Bisect: even uncalled added functions in the hot modules trigger it (1/6). Restructured so the hot modules change only by types, private→protected and export keywords: LazyColonySim (experiments/colonyLazy.ts, newColonySim), perception/lazyPerception.ts, behavior/lasiusNestRest.ts. Still 3/10 slow switched off. Testing next whether retained heap alone (more loaded code) puts unpatched main into the slow mode.
- 2026-10-19 21:46 UTC · lead-claude-b014 · Cause found: unpatched main enters the same slow mode when it merely retains memory (--retain 30k/100k objects: 35.0 s and 38.6 s, 1/4 each). With node --no-allocation-site-pretenuring, the switched-off worktree is fast 6/6 (29.6–31.1 s) and main with retained memory 3/3. So it is V8 allocation-site pretenuring flipping on this allocation-heavy workload, sensitive to incidental heap layout, not added work. It bears on all colony runs (box fits): to become a new backlog item, not acted on here. Final layout: LazyColonySim subclass + lazyPerception + lasiusNestRest; the hot modules change by types, protected and exports only. Next (final code): npm test, slow tier, identity off/on/verify (the main arm stands: main code unchanged), bench round 2 with main/off/on plus main-np/on-np arms. Reading: hashes equal = bit-identical (else a defect). Speed-ups as measured; the -np arms give the gain free of the GC bimodality.
- 2026-10-19 22:25 UTC · lead-claude-b014 · Final code (patched simHash 0f558145f2949217): identity rerun, all 9 cases × main/off/on plus 22 pooled colonies hash-equal; verify clean. npm test in the worktree 221/222 (the failure is the findings staleness from the moved simHash); slow tier 3/3; tsc clean. Bench round 2 (results/bench.json), medians main/off/on: colony122 29.8/30.9/21.7 s (1.37×; 1.46× with pretenuring off); pilot 10.5/10.7/10.4 (none); C2-proxy d2.3 4.9/5.4/4.3 (1.15×); d6 14.3/14.5/10.2 (1.40×). Results re-stamped (main-tree stamp plus measuredOn). Records: D074, F066, STATUS proposals line, B022 filed. proposal.patch applies cleanly to the main tree (git apply --check).
- 2026-10-20 21:13 UTC · lead-claude · Applied to the main tree (D095 review, D096): proposal.patch no longer applied after D078/D085, so a rebased copy (proposal.rebased.patch, sha256 55e224a0…) was made by a 3-way apply in ../ants-b014r and checked there (identity.ts all cases main = off = on, verify clean; new cases at the fitted C2/C1 points with restMaps/neighbourStats equal). simHash → 3c4d7e2b; results re-stamped with a trail.

## Findings
**Answer.** Lazy evaluation of resting ants is implemented as an opt-in, **bit-identical** switch: `lazyRest`, via
`newColonySim` / `LazyColonySim` (`proposal.patch`, unapplied). Its speed-up is real but smaller than the design
estimate (DESIGN rev 2 said 1.6–1.8×). It pays only where nearly all in-nest ants rest:

| Workload | Speed-up |
|---|---|
| Stroeymeyt colony122 (C2 start 0, 152 ants) | **1.37×** (1.46× with pretenuring off) |
| Mailleux nest at 138 nestmates, C2-proxy motion | **1.40×** |
| Mailleux nest at 53 nestmates, C2-proxy motion | 1.15× |
| Mailleux pilot motion (60 % walking) | none (0.9–1.0×) |

All are medians of 3, back to back (`results/bench.json`).

**Evidence:**
- `results/identity.json`: all cases hash-equal in the main checkout, the worktree with the switch off and with it
  on. The cases are D048's three byte-for-byte checks, Mailleux at both motions, days 1/4/8, independent and shared
  warm-ups with followed nestmates, and the 22 colonies through the pool. The per-step verification mode, which runs
  the original policy on a copy at every tick, finished two runs without a difference.
- Tests in the patch:
  - 25 fast and 3 slow, including boundary cases against the original policy: encounter gaps of 1–4 steps; the 5-s
    and 120-s accumulated timers crossing one step after k × dt; `need === dt`; a spell left at exactly 0; a zero
    rate; mid-step rests; a hazard firing on a tick step;
  - mutation checks showing the tests catch late hand-backs, early hand-backs and a missing drop test;
  - `npm test` 221/222 in the worktree; tsc clean.
- `results/baseline.json`: the stepped profiles.
- **Stamps:** results measured on the patched worktree carry the main tree's stamp, the tree the patch applies to,
  so they go stale once it is applied. Their `measuredOn` field records the patch (sha256) and the patched simHash:
  - `identity.json`: `0f558145f2949217`, the final patch;
  - `bench.json`: `db94f55aa1bac8d0`, the final patch less one doc comment.

**Why below the estimate.** A ticked ant still costs, every step:
- the tick itself, which must repeat the drive factor, every timer and every encounter episode exactly;
- the drive;
- metabolism;
- the change marks.

The tick cost about as much as `decide`, not the 2–3 % assumed.

**The C2 fit was not affected:** nothing ran on the box, and the main tree is unchanged.

**Caveats:**
- **A switch-off regression was found and removed.** Stepped runs could fall into a slow garbage-collection regime
  (35–38 s against 30 s) when lazy code was added to the stepped modules. The mechanism, V8 allocation-site
  pretenuring, also hits unpatched main when it merely retains memory. The final layout keeps the stepped modules'
  runtime code unchanged; round 2's switched-off medians are within 1–10 % of main, and noisy.
- **The bimodality is a property of this workload under V8.** Any code change may flip it, so it is filed as B022
  (it may also cost the box fits).
- **Applying the patch moves the simHash.** `npm test`'s findings check then flags F058–F062 as stale, though their
  code paths are bit-identical; the lead agent re-stamps or notes them.

**Implications:**
- For Stroeymeyt-scale runs (judging, refits, step 9) about 1.4× at no cost to results.
- For step 5, about 1.15× at nuisance density 2.3, up to 1.4× at high density.
- The step-5 levers in B008 remain the larger ones.

**Next:**
- The user decides on applying the patch.
- If applied: add `--lazyRest` flags to the fit and judging scripts (not done here).
- B022 for pretenuring.
- Not pursued: analytic metabolism (≈ 11 % of the profile; not bit-identical) and true event skipping (DESIGN § 10).
