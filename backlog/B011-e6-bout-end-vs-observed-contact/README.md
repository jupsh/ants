---
id: B011
title: E6 bout end vs observed contact
status: done
size: M
priority: 110
note:
outcome: 630 simulated bouts, extra mouth contact <=0.2 s; one added event in 60 paired scan phases; geometric-contact-recorder proposal for step 9.
depends: backlog/B011-e6-bout-end-vs-observed-contact/analyse.ts, backlog/B011-e6-bout-end-vs-observed-contact/run.ts, backlog/B011-e6-bout-end-vs-observed-contact/check.ts, backlog/B011-e6-bout-end-vs-observed-contact/reduce.ts, scripts/lib.ts, scripts/simHash.ts, docs/research/bles-tec-spec.md
---
# B011 — E6 bout end vs observed contact

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS § Open problems and backlog (seeded 2026-10-18). Scoped by the lead agent 2026-10-18.

## Question
- **The mismatch.** Our trophallaxis bouts end when food stops flowing, while Bles et al. 2022 score mandible
  (head-to-head) contact.
- **The question.** In our model, how long do partners stay in contact before flow starts and after it stops?
  How does `observeContacts` treat that time, and is the mismatch large next to the resolution of the E6
  statistics?

## Why it matters
- E6 is the development benchmark at Plan step 9.
- If our observer measures flow instead of contact, E6 durations are biased by construction.
- The definition should be settled before E6 preparation, not after the E6 result is seen.

## Done when
1. **Definitions:** both stated exactly, from the code and `docs/research/bles-tec-spec.md`. Bles 2022 is not a
   cleared paper, so use no other source.
2. **Simulation** (E6 set-up, provisional model): per bout, observed contact duration minus flow duration,
   through `observeContacts`; its distribution and mean.
3. **Verdict:** yes or no, is the mismatch larger than the scan interval and histogram bins of the E6
   statistics? Then a proposal for step 9: an observer rule or a bout rule.

## Base
Commit at pickup: `f9ad78fb7af8b397eb2bb8a4040f70d429cf98e2`.
Simulation and worker sources, including `trophallaxis.ts` and `e6Bles.ts`, are clean.
Unrelated H6 records are being edited by the lead. This item uses the current
provisional spatial colony defaults (`LASIUS_PARAMS` + `LASIUS_NEST`), as scoped;
it does not select or judge the future step-9 candidate.

## Data and roles
- **No E6 data compared.** The colony model has not been judged against E6 and must not be before step 9:
  simulated output only, no `reportE6.ts` against the data.
- Held-out: none.

## Compute
Local, niced, one serial colony at a time; at most three diagnostic seeds,
53 workers, dt 0.1 s, 30 min before food and 60 min after it. An additional
65 s covers the implementation's random-phase final scan and >5-s continuation
check. No process pool or long-run launcher. A repeat without the recorder checks
that recording leaves the first colony's flow bouts and final state identical.

## Out of scope
Changing the observer, any comparison with E6 data.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-11-02 03:18 UTC · codex · Plan before simulation: audit the unchanged default spatial colony (LASIUS_PARAMS + LASIUS_NEST), 53 workers, 4 d starvation, food at 30 min, dt 0.1 s. Record uninterrupted in-nest mouthContact geometry after every step, and match every positive-flow ShareBout to its enclosing geometric episode. Report pre/post padding, censoring, unmatched bouts, and direction reversals explicitly. Apply the unchanged after/>5 s/60 s observer to flow intervals and to unique direction-identifiable mouth episodes using the same 20 diagnostic scan phases per colony. Quantify per-bout and merged-event durations and integer per-ant event-count bins; current E6 has no duration histogram. Differences reaching 60 s or changing a count bin matter to the measurement; smaller differences can still change a scan near its boundary. Start with one full colony plus a 65 s post-window guard; retain all outcomes, then at most three diagnostic seeds total if each run is comfortably under 10 min. No empirical data comparison, fit, adoption, or observer change. Synthetic matching/merging controls run first.
- 2026-11-02 03:21 UTC · codex · Before the first colony: deterministic controls passed (padding, unique mouth episodes, >5 s scan boundaries, reversing direction, incomplete coverage, no-flow direction ambiguity, identity, and event coalescing). Standalone strict TypeScript checking of the item scripts passed. The plied gate for run:b011-contact-audit-cb76ae6b2-ants-mvyoonpi passed with no applicable open commitments. Next: index 0 at the full 53-worker E6 apparatus/defaults, 20 diagnostic phases; paired repeat checks recorder neutrality. These are simulated-only observer diagnostics, not an E6 model-data comparison.
- 2026-11-02 03:24 UTC · codex · Index 0 completed: 278/278 positive-flow bouts matched unique mouth episodes, no unmatched/reversing/censored bout, padding mean 0.01475 s and maximum 0.2 s. All 20 paired observer phases gave identical scans, events and per-ant counts. Recorder-neutrality repeat passed for bouts, forager identities, body/mind state (derived head caches excepted) and conserved totals. Recorded run 29.2 s, including repeat 58.4 s. Continue the two already-planned diagnostic seeds without parameter or analysis changes.
- 2026-11-02 03:25 UTC · codex · Index 1 completed in 44.6 s: 166/166 bouts matched, no unmatched/reversing/censored bout; mean padding 0.01265 s, maximum 0.2 s. One of 3,320 bout-by-phase observations gained a scan/event (one of 20 colony phases); all others were identical. This is the planned boundary case: a sub-scan physical difference can cross the >5 s/scan boundary. Index 2 remains, with unchanged settings and reading.
- 2026-11-02 03:32 UTC · codex · All three planned colonies completed (630/630 matched, uncensored bouts; no direction reversal or unmatched coverage). Extra-duration histogram: 548 at 0 s, 78 at 0.1 s, 4 at 0.2 s; pooled mean 0.0136508 s. Exactly 1/12,600 bout-phase pairs and 1/60 colony phases gained one event, shifting one NF donor and receiver each by one count bin. No duration histogram exists in E6. Detailed outputs preserved in out/, reduced with input-hash verification to stamped results/summary.json; independent source-hash, duration, histogram/event and pooling checks passed. results/report.md records definitions, scope, full outcome and the geometric-contact-recorder proposal for step 9. Controls, four existing observer tests, project/item tsc and backlog check passed (one current result, zero stale). No empirical comparison, main-tree change or adoption. Lead handoff/record disposition follows; authoritative records remain the lead agent’s.

## Findings
Across three diagnostic colonies at the provisional spatial defaults, all 630
flow bouts matched distinct, uncensored mouth-contact episodes. Extra contact
averaged 0.01365 s (median 0, maximum 0.2 s), below the 60-s scan interval. In
12,600 paired bout/phase observations, one gained a scan; one of 60 colony/phase
comparisons gained one event and moved a non-forager donor and receiver each by
one event-count bin. The other phases were identical. Current E6 has integer
event-count histograms, not duration histograms.

Evidence and the separate geometric-contact-recorder proposal for step 9 are in
[`results/report.md`](results/report.md), with distributions, phase-level results
and provenance in [`results/summary.json`](results/summary.json). Controls, four
existing observer tests, project/item TypeScript checks and a full recorder-free
repeat passed; the stamped result is current. This is a bounded simulated-only
observer diagnostic, not an E6 judgment or model/observer adoption. Geometry-only
contacts without flow lack donor identities and are explicitly excluded; the
future step-9 candidate needs its own check. This bears on the main line's E6
measurement definition; a lead agent should record the finding and disposition
T043. No main-tree code, adopted parameter, frozen artifact or empirical role changed.
