---
id: B001
title: Contacted-nestmate departures (Mailleux 1999 Table 2b, G3)
status: done
size: M
priority: 40
note:
outcome: Constant alone cannot give Table 2b (saturates 13–19% vs 44–86%, no starvation rise; guard breaks at ≥0.5); contact-triggered rule designed, not implemented.
depends: scripts/m1999Points.ts
---
# B001 — Contacted-nestmate departures (Mailleux 1999 Table 2b, G3)

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18); the 1999 side of B003 merged in. Scoped by
the lead agent 2026-10-18.

## Question
- **The gap.** In Mailleux 1999 Table 2b, 44–86 % of nestmates leave within 5 min after a trophallactic contact
  with a recruiter, and 69–93 % after another contact (rising with starvation). The model gives about 0–1 %
  after trophallaxis.
- **The suspected cause.** The `leaveCropFrac` constant: an ant whose crop is ≥ 5 % full never leaves, and
  received food does not raise its reserve (STATUS 2026-10-10 audit).
- **The question.** How much of the gap is that constant, and how much would need a contact-triggered leaving
  rule (gap G3, not modelled)?

## Why it matters
- Step 5 is the last revision round driven by the 1999 data (stopping rule). So any structural change to nestmate
  departures must be decided before the step-5 structure is fixed.
- The same rule governs nestmate departures in E6. E6's `leaveCropFrac` sensitivity stays in Plan step 9 and is
  not part of this item.
- STATUS 2026-10-10: "G3 must not be read as a result until this is settled."

## Done when
1. **Code audit:** a few lines on the departure path of a contacted nestmate (`lasiusNestWorker.ts` leave
   condition, `receiveReserve`, what received food does to reserve and crop).
2. **Table:** the Table-2b statistic (existing code in `reportM1999.ts`, `followNestmates`) and the 15 Table-2a
   rows, with `leaveCropFrac` at 0.05 (current), 0.25, 0.5 and 1.0. Run at the existing pilot point, all three
   starvation levels, paired seeds.
3. **Verdict:** can the constant alone give the 1999 pattern (lower after trophallaxis than after other contacts,
   both rising with starvation) without moving any Table-2a row by more than 1 SE_data?
   - If not: a one-page design note for the user on a contact-triggered leaving rule (the percepts it would
     read, its parameters and provenance). No implementation.

## Base
Claimed 2026-10-18 by Muse at commit `ecbb918`. `git status --porcelain`
for `src/sim/behavior/lasiusNestWorker.ts`,
`src/sim/experiments/colonyMailleux1999.ts`, `scripts/reportM1999.ts` and
`scripts/m1999Points.ts` was empty (all clean). Pilot point: optimum of
`data/fits/colony-m1999-main-shared-pilot.json` (`fit.params`, density
0.4951, warm-up 900 s, dt 0.025, shared warm-ups, 4 recruiters/nest,
contactMin default 1 s).

## Data and roles
- Mailleux 1999 Table 2a: fit. Compared only, never fitted.
- Table 2b and "all recruiters leave within 20 min": development. Compared, never fitted. Its n values look
  copied from Table 1 (`docs/research/mailleux-rules.md`), so no significance tests against it.
- Mailleux 1999 is not a cleared paper: use only the extraction in `docs/research/mailleux-rules.md`.
- Held-out: none.

## Compute
Local and niced: 4 levels × 3 days at the pilot design. Under an hour with the pool.

## Out of scope
- E6 (Plan step 9).
- Changing defaults or fits; implementing any rule; step-5 plumbing.
- **Caveat:** the Mailleux runner still has the pilot nest motion, so these results are indicative. Rerun them
  once the step-5 motion is in.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-18 15:51 UTC · Muse · Claimed at ecbb918 (all audited files clean). Pre-run reading: sweep leaveCropFrac 0.05/0.25/0.5/1.0 at the pilot optimum, 3 starvation days, paired seeds, followNestmates on. If raising the constant alone lifts after-trophallaxis leaving toward 44/56/86% while keeping after-other > after-troph, both rising with starvation, and moves no Table-2a row >1 SE_data vs 0.05, the constant suffices and no new rule is needed; if after-troph stays far below data or the pattern/guard fails at every level, a contact-triggered rule is needed and a design note (no implementation) follows.
- 2026-10-18 16:47 UTC · Muse · Sweep done: nice npx vite-node backlog/B001-contact-triggered-leaving-mailleux/sweep.ts --n 240 (paired seed 2039978842, pilot optimum, 240/day, 4/nest, dt 0.025, warm-up 900). Table 2b after-trophallaxis: 0.05: 7.0/6.1/6.1% (1/4/8 d), 0.25: 16.9/13.2/13.3%, 0.5: 18.6/14.8/13.5%, 1.0: 18.8/15.9/13.2% vs data 44/56/86%; after other: 26-39% all levels vs data 69/89/93%. After-troph never rises with starvation in the model. Table-2a guard vs 0.05: max shift 0.74 SE_data at 0.25, but 7.9 at 0.5 and 9.0 at 1.0 (timeInNest.d4). Verdict: constant alone cannot give the 1999 pattern; design note written (design-note.md), no implementation.
- 2026-10-19 17:00 UTC · lead-claude · Lead review (2026-10-19). Numbers reproduce from results/sweep.json. (1) The guard reading is confounded: inside the nest the recruiter runs lasiusNestWorker with the same P.nest.leaveCropFrac (colonyBles.ts:587), so at 0.5 and 1.0 the recruiter itself may leave with a half-full crop. That fits the guard breaking on exactly timeInNest.d4 and trophTotal.d4 while Table 2b barely moves from 0.25. design-note.md's risk line ('nestmate-side changes shift recruiter timeInNest/trophTotal') is therefore probably wrong; a nestmate-only gate is needed to tell (filed as a follow-up). The verdict on levels and pattern does not depend on it. (2) design-note.md's hazard range: P(leave within 300 s) of 44–93 % gives 1/520–1/110 s⁻¹, not 1/300–1/150. (3) Its starting values (rate, W = 300 s, trophallaxis scale) are read off Table 2b, which is development: a rule designed from Table 2b cannot then be tested on Table 2b's levels. The note says so for levels; the user should know the pattern is the only test left. (4) Baseline after-trophallaxis leaving is 6–7 % here vs the scope's 'about 0–1 %' (STATUS 2026-10-10, an earlier point): a different pilot point, not a defect. (5) results/sweep.json slimmed: per-recruiter records moved to out/sweep-full.json; summary and stamp unchanged.

## Findings

**Code audit (Done 1).** A contacted nestmate can leave only from `active`
mode, at `lasiusNestWorker.ts:415`: `reserve < receiveReserve &&
cropUl < leaveCropFrac × cropCapacity`, at hazard
`leaveRate × forageDrive`. Receiving food (`shareCrop` in
`src/sim/physics/trophallaxis.ts`) raises the receiver's `cropUl/Sugar/Water`
directly; `reserve` rises only later, as `metabolise`
(`antPhysics.ts:217–230`) absorbs crop sugar. So a receiver is usually
still hungry by reserve, but any receipt above `leaveCropFrac` of capacity
(5 % ≈ 0.1 µL at the pilot point) blocks leaving until the crop empties —
the suspected mechanism is real. Resting nestmates cannot take this exit
at all (only `returning()` / `outRate`, both irrelevant here).

**Sweep (Done 2).** `sweep.ts`, pilot optimum
(`data/fits/colony-m1999-main-shared-pilot.json`), 240 recruiters/day,
4/nest, dt 0.025, warm-up 900 s, paired seed 2039978842, `followNestmates`
on; full per-row results in `results/sweep.json` (stamped). Table 2b,
leave within 5 min (model % vs data %):

| leaveCropFrac | after trophallaxis, 1/4/8 d | after other contact, 1/4/8 d |
|---|---|---|
| 0.05 (current) | 7.0 / 6.1 / 6.1 (data 44 / 56 / 86) | 26.9 / 35.5 / 37.8 (data 69 / 89 / 93) |
| 0.25 | 16.9 / 13.2 / 13.3 | 27.2 / 36.7 / 38.7 |
| 0.5 | 18.6 / 14.8 / 13.5 | 25.6 / 37.3 / 38.5 |
| 1.0 | 18.8 / 15.9 / 13.2 | 25.9 / 37.1 / 37.6 |

Contacted-nestmate counts per cell: trophallaxis n ≈ 314–431, other
n ≈ 945–1362, so these percentages carry ≈ 1–2 % sampling error.

**Verdict (Done 3).** The constant alone cannot give the 1999 pattern.
(1) *Levels:* after-trophallaxis leaving saturates at 13–19 % — the crop
gate stops binding, and the `leaveRate` hazard, active-mode requirement
and 5-min window take over — still 25–73 points below the data.
(2) *Pattern:* after-trophallaxis leaving never rises with starvation in
the model (flat to falling at every level), while the data rise
44 → 86 %; only after-other leaving rises, mildly. The ordering
trophallaxis < other does hold at every level, as in the data.
(3) *Guard:* at 0.25 no Table-2a row moves more than 0.74 SE_data from
the 0.05 level (pass), but at 0.5 and 1.0 the guard breaks — worst
`timeInNest.d4` −7.9 and −9.0 SE_data, `trophTotal.d4` −6.8 and −8.3 —
while buying almost no extra Table-2b leaving. So of the baseline gap,
relaxing the constant to 0.25 closes only ≈ 7–10 points (≈ 9–27 %,
least at 8 d), and no admissible level does better. A second,
larger gap sits underneath: even after *other* contacts, where the
constant never binds, the model reaches only 26–39 % against 69–93 %.

**Implication and next step.** A contact-triggered leaving rule is
needed for G3; a one-page design (percepts it may read, three estimated
parameters, switch off by default) is in `design-note.md` for the
user's decision before the step-5 structure freeze. Nothing is
implemented and no default or fit changed. Confidence: high for the
qualitative verdict (saturation and missing starvation rise are far
outside sampling error); the exact percentages are indicative only, as
scoped — the Mailleux runner still has pilot nest motion, so rerun the
0.05 row once step-5 motion is in. This bears on the main line: G3
still must not be read as a result, and the step-5 structure decision
now has a concrete rule proposal to accept or reject.
