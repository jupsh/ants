---
id: B009
title: E2 volume-estimate clipping at zero
status: done
size: M
priority: 90
note:
outcome: At the fixed main fit, zero clipping raises drop-2 intake by 0.055 µL (2.17 data SE); no direct source for this rule was found.
depends: scripts/e2Synthetic.ts
---
# B009 — E2 volume-estimate clipping at zero

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18)

## Question
E2: the volume-estimate clipping at 0 (Math.max(0, est)) is unsourced. Does it bias the E2 rows, and is there a source for it?

## Why it matters
The E2 fit uses estimated intake volumes and their correlation with drinking
time. Clipping negative noisy estimates may shift their means, spreads, and
correlations. This check measures that shift at the fixed provisional fit; it
does not reopen E2 or change the observation model.

## Done when
Report the clipped fraction and paired differences in every affected two-drop
row, with uncertainty and a comparison to the row's data SE. Identify whether
the cleared source or existing research notes specify clipping.

## Base
`9b3987d` at claim (2026-10-18 02:54 UTC). `src/sim/experiments/e2Mailleux.ts`,
`e2Targets.ts`, and `data/fits/e2-3d-L0S1c.json` are clean; `lasiusM1.ts` is
dirty from the ongoing Stroeymeyt work. The E2 fit JSON fixes the evaluated
parameters, using `scripts/e2Synthetic.ts`'s legacy E2 model construction.

## Data and roles
Mailleux 2009 two-drop E2 targets: fit (`two.ul1`, `two.ul2`, `two.vtRs1`,
`two.vtRs2`) and development (`two.ulTot`, `two.vtSlope`, `two.vtRs`), as
already designated in `e2Targets.ts`. The main E2 fit is provisional.
Mailleux 2000 is cleared development literature (`docs/literature.json`);
existing `docs/research/mailleux-rules.md` notes are development. No held-out
data and no newly inspected development data.

## Compute
One local, niced two-drop simulation: 10 blocks × 150 scouts, 4 workers,
roughly a minute. Pair the same trips and observer draws; write only small
summaries in this folder. No active `scripts/run.sh` jobs at claim.

## Out of scope
No refit, adoption decision, held-out inspection, change to main-tree files,
or reading uncleared full texts. The separately stored `totalUl` is checked
for clipping frequency but is not an E2 target.

## Progress log
<!-- Newest last, a few lines each: what was done, the command, and the result
in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

- 2026-10-18 02:54 UTC · Codex · Claimed B009; `npm run runs` showed no
  active managed runs. The fixed comparison will use identical scouts and
  replay the observer RNG to recover the unclipped values. If row shifts are
  small against their data SE, clipping is a minor local approximation at
  this fit; large shifts identify a consequential observation assumption,
  without deciding whether E2 should reopen.
- 2026-10-18 02:56 UTC · Codex · Ran `nice -n 10 env SIM_WORKERS=4 npx
  vite-node backlog/B009-e2-volume-estimate-clipping-at-zero/compare.ts` with
  10 × 150 scouts at the fixed L0S1c fit; observer replay matched the current
  clamp exactly for every drink and total estimate. Repeated the identical
  seeded run to include pooled spread. Full summary: [results.json](results/results.json).
- 2026-10-18 03:03 UTC · Claude (lead) · Lead review. Results moved to results/results.json with a provenance stamp (compare.ts edited only for the output path and stamp); rerun bit-identical to Codex's results.json. depends: scripts/e2Synthetic.ts (model construction, outside simHash). Size corrected S → M (simulations). Seeds are reportE2's two-drop seeds (7_000_000 + 400_000) on purpose, so the clamped column equals the judged report's. STATUS Decisions-log line added by the lead.

## Findings
At the fixed provisional L0S1c fit, the clamp activates for 137/1290 (10.6%)
of first-drop estimates and 326/1290 (25.3%) of second-drop estimates among
scouts that found both drops. These are the scouts used in the two-drop rows.
The separately stored total estimate is clipped for 124/1500 (8.3%) of all
scouts; the target `two.ulTot` instead sums the two per-drop estimates.

| Two-drop row | Clamped | Unclamped | Paired shift (clamped − unclamped) | Shift / data SE |
|---|---:|---:|---:|---:|
| Drop 1 intake, fit | 0.498 µL | 0.477 µL | +0.0213 ± 0.0016 µL | +0.68 |
| Drop 2 intake, fit | 0.308 µL | 0.253 µL | +0.0547 ± 0.0052 µL | +2.17 |
| Total intake, development | 0.806 µL | 0.730 µL | +0.0761 ± 0.0058 µL | +2.01 |
| Pooled volume/time slope, development | 0.00791 µL/s | 0.00955 µL/s | −0.00164 ± 0.00015 µL/s | −1.58 |
| Pooled Spearman r, development | 0.497 | 0.499 | −0.0020 ± 0.0010 | −0.03 |
| Drop 1 Fisher-z Spearman, fit | 0.391 | 0.393 | −0.0017 ± 0.0013 | −0.01 |
| Drop 2 Fisher-z Spearman, fit | 0.458 | 0.461 | −0.0021 ± 0.0037 | −0.02 |

The ± values are SE across the ten paired blocks. Clipping also reduces the
model's between-scout SDs (drop 1: 0.392 → 0.354 µL; drop 2: 0.375 → 0.300
µL; total: 0.519 → 0.443 µL), while the reported data SDs are 0.25, 0.20,
and 0.30 µL. Without clipping the pooled slope is farther from the data's
0.006 µL/s (combined z ≈ 3.23 rather than 1.77). The two volume mean rows
remain within about one combined SE on either side of the data, so this is a
material observer sensitivity rather than evidence that one choice is valid.

**Source check.** The cleared Mailleux 2000 Methods (`.cache/papers/Mailleux2000/p02.txt`,
lines 83–99) derive intake from the difference between before/after gaster
ellipsoid volumes, without specifying a rule for negative estimates. The
existing Mailleux 2009 extraction (`docs/research/mailleux-rules.md`, §3)
does not state one. That extraction's §8 reports an indirect precedent from
Portha et al. 2004: drinking under 5 s was assigned 0 µL when no gaster
change was detectable. It does not justify applying `Math.max(0, est)` to
every noisy measurement. No direct source for the implemented clamp was found
in the checked materials.

This diagnostic does not identify how the original experimenters processed
negative differences, and it uses one fixed provisional fit rather than
refitting either observer. It supplies an observer sensitivity for the E2
record. Any change to the observation model or E2 reopening is a user
decision under STATUS's E2 rule; the paired difference here is not itself
one of that rule's reopening triggers. The executable check is [compare.ts](compare.ts),
with numerical output in [results.json](results/results.json).
