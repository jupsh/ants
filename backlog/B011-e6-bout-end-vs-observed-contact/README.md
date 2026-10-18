---
id: B011
title: E6 bout end vs observed contact
status: open
size: M
priority: 110
note:
outcome:
depends:
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
<At claim: commit, and whether `src/sim/analysis/trophallaxis.ts` and `src/sim/experiments/e6Bles.ts` are dirty.>

## Data and roles
- **No E6 data compared.** The colony model has not been judged against E6 and must not be before step 9:
  simulated output only, no `reportE6.ts` against the data.
- Held-out: none.

## Compute
Local, minutes, niced.

## Out of scope
Changing the observer, any comparison with E6 data.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
