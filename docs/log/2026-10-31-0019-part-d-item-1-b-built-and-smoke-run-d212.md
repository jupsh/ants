---
id: D215
date: 2026-10-31
time: 00:19
kind: run
title: Part D item 1(b) built and smoke-run (D212 amendment 1; implementer, D208): 30 synthetic checks pass, checked by the lead; 2-colony smoke self-checks exact, 288 MB peak, full run ≈ 5-7 min; no event-aligned value seen; the report raises the balance SD, a possible forager excess of the rise label in the synthetic null (3 of 20 seeds) and controls near other events
---
- **2026-10-31 ≈ 00:19 UTC — Part D item 1(b) built and smoke-run (D212 amendment 1; implementer, D208): 30 synthetic checks pass, checked by the lead; 2-colony smoke self-checks exact, 288 MB peak, full run ≈ 5-7 min; no event-aligned value seen; the report raises the balance SD, a possible forager excess of the rise label in the synthetic null (3 of 20 seeds) and controls near other events.**
  - **Brief and report:** `logs/handoff/20261030-2243-triggers/` (`brief.md`; `report.md` returned as text and saved by
    the lead, D214). Gated `run:triggers-build-smoke`. Scripts (local scratch): `scripts/scratch/triggers.ts` (per
    colony, md5 `c82d8c2e`), `triggersCore.ts` (`37d3fd56`), `triggersStats.ts` (`f97e15e3`), `triggersAgg.ts`
    (`dd95b7a4`), `triggersSyn.ts` (`0801db53`); `activitySeries.ts` (`dc7fd5cd`) with its step rule factored out as
    `StepRule`, output unchanged.
  - **Report, quoted:** "All 30 synthetic checks pass on the final code. The 2-colony smoke ran: both self-checks match
    exactly (light and dark), and peak RSS is 288 MB. No event-aligned value from real data was printed or opened. The
    aggregator was not run on real data." Smoke counts (colony265, colony224): forager entries found 19 and 392, matched
    18 and 353; queen onsets found 24 and 34, matched 21 and 31. Uncontended 11.5 s and 15.0 s per colony.
  - **Lead's check:** `npx tsc --noEmit -p .` exit 0; `triggersSyn.ts` rerun, 30 PASS, "all checks passed"; `npm test`
    292/292; script md5s equal the report's; the reading code (`triggersStats.ts`, class and labels) read against D212
    amendment 1: support, then balance, then exceeds / smaller than the margin / unresolved, the rise label added
    whatever the class. No defect found.
  - **Brief errors (lead's, not code defects):** the brief said scratch scripts are outside tsc's project (they are
    inside), and gave `RNG.stream(seed, 'partd-triggers')`, whose keys must be numbers (`RNG.stream(0x1b212, 1)` used).
  - **Raised by the report, for the user (answered D216):**
    1. "Balance 'pooled SD'": Σ(n−1)·SD²/Σ(n−1) over the contributing colonies' blocks, with each event's own block SD
       written beside.
    2. "Rise qualifier in the synthetic null: possible small excess for forager entries": the rise interval was above 0
       in 3 of 20 null seeds for foragers, 0 of 20 for the queen.
    3. "Controls near other events": candidates exclude only same-type events within ± W, so in busy colonies controls
       can fall in other events' post-event periods.
    - The other gap-fillings (report Deviation 2 b-n) follow amendment 1's text and are kept as implemented.
