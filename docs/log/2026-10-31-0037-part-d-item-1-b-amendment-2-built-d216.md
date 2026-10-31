---
id: D217
date: 2026-10-31
time: 00:37
kind: run
title: Part D item 1(b) amendment 2 built (D216; implementer): 5-min control row, calibration output and the P100 rule; 39 synthetic checks pass, checked by the lead; smoke self-checks exact, primary counts unchanged; the 5-min row is thin in busy colonies (colony224: 52 of 391 forager entries matched)
---
- **2026-10-31 ≈ 00:37 UTC — Part D item 1(b) amendment 2 built (D216; implementer): 5-min control row, calibration output and the P100 rule; 39 synthetic checks pass, checked by the lead; smoke self-checks exact, primary counts unchanged; the 5-min row is thin in busy colonies (colony224: 52 of 391 forager entries matched).**
  - **Brief and report:** `logs/handoff/20261031-0030-triggers-amend2/` (report returned as text, saved by the lead,
    D214). Gated `run:triggers-amend2`. Effort high. 145k subagent tokens, 33 tool calls (the first build: 256k).
  - **Report, quoted:** "All three parts of amendment 2 are built. 39 synthetic checks pass on the final code: the 30
    existing ones, with output identical to amendment 1's numbers, plus 9 new ones. The 3-seed calibration file was
    written. In the smoke rerun both self-checks are exact and the primary counts are identical to the amendment 1
    smoke." 3-seed calibration (a test of the output, not the calibration): forager 1 of 3, queen 0 of 3. Script md5s:
    `triggers.ts` `e29ccdd8`, `triggersCore.ts` `f6c3db77`, `triggersStats.ts` `5e81303d`, `triggersAgg.ts` `66823406`,
    `triggersSyn.ts` `d7b7dfa9`, `activitySeries.ts` `dc7fd5cd` (unchanged).
  - **Lead's check:** md5s equal the report's; `npx tsc --noEmit -p .` exit 0; `triggersSyn.ts` rerun, 39 PASS; `npm test`
    292/292; `read()` in `triggersStats.ts` read against amendment 2: the class is computed as before, and with a rate
    above 0.05 the rise label is the uncalibrated text, the class unchanged (P100).
  - **Gap-fillings kept** (report Deviation 1, 3): the 5-min row's candidates also need [c − 5 min, c + 5 min) inside the
    block (events are known only within a block); the row carries the rise, time course and bands, descriptive with no
    label; the aggregator also refuses an incomplete calibration file, duplicate seeds, or stored rates that differ
    from its records.
  - **Thin descriptive row (counts only):** in colony224, `forager-ctrl5min` matched 52 of 391 entries (339 unmatched);
    with an entry every ≈ 2 min, few times lie 5 min from every entry. The row may draw on fewer colonies than the
    primary; disclosed with it.
  - **Defect fixed outside the brief:** `meta.command` (D218).
