---
id: B016
title: Candidate held-out colony data sets
status: blocked
size: S
priority: 60
note: the user sets the survey's exposure rules (what may be read) and approves web search first
outcome:
depends:
---
# B016 — Candidate held-out colony data sets

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: STATUS Plan, parallel track (a); RESUME ("M1's honest end state"). Added and scoped by the lead agent
2026-10-18.

## Question
Which published data sets could serve as independent held-out tests of the colony model, without seeing their
results?
- **Wanted:** in-nest trophallaxis, recruitment and contacts; ideally *Lasius niger*; from labs other than those
  we fit to.
- **Judged by:** what is measured, species, availability and licence.

## Why it matters
- **Without held-out data,** M1's colony model can only be "calibrated and stress-tested". Finding such data is a
  work item in the Plan.
- **The survey itself can contaminate:** any data set seen against a model loses its held-out status, so the
  survey must not expose results.

## Done when
A candidate list for the user, who assigns roles and clears papers. For each data set:
- citation and repository or DOI;
- species;
- what is recorded, format and size;
- licence;
- whether any of its results were seen during the survey.

## Before pickup (the user)
- **Exposure rules:** what may be read (repository records and data descriptors? methods sections? abstracts?).
- **Web search:** approval for this survey.

## Base
<At claim: commit; desk work only.>

## Data and roles
- **Read:** metadata only, within the user's exposure rules. Results, figures and the findings in abstracts are
  not read.
- **Exposure:** any accidental exposure is reported for the contamination log.
- **Never** the held-literature folder (sealed). Nothing downloaded.

## Compute
None.

## Out of scope
Downloading or opening data, reading results, clearing papers, assigning roles.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->

## Findings
<When done: the answer in a few sentences; evidence (paths in this folder);
confidence and caveats; what it implies; suggested next steps or new items. A
change the main code needs goes in this folder as `proposal.patch`.>
