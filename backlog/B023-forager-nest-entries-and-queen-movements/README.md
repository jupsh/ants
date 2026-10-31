---
id: B023
title: Forager nest entries and queen movements as triggers of in-nest activity episodes
status: done
size: M
priority: 950
note:
outcome: answered on the main line (D221; F109): queen onsets exceed the margin; forager entries a smaller, pre-existing rise
depends:
---
# B023 — Forager nest entries and queen movements as triggers of in-nest activity episodes

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: Review D133 item 4; user decision D134 item 4

## Question
In the Stroeymeyt fit colonies, does in-nest activity rise after forager nest entries or queen movements beyond what precedes them and beyond matched control times? An event-centred peak alone would not establish triggering (D134 item 4).

## Why it matters
F056 (Boi 1999) names returning foragers as disrupting the entrance group. Neither event type has been tested as a
driver of the in-nest episodes the synchrony line studies (D130, D133). A trigger that precedes activity would be a
candidate driver that is local and observable, unlike the drivers tested so far (Eu, El20, P). Its absence would
narrow the candidates.

## Done when
For each event type (forager entry; queen movement onset), a design that meets the requirements below has been
stated in the Progress log before any computation, and run. The answer per event type is one of: activity after the
event exceeds both the matched-control and the pre-event baseline; it does not; or unresolved.

**Design requirements (user, D134 item 4; binding when scoped):**
- distinguish activity **preceding** the event from activity **following** it: a pre-event window as well as a
  post-event one, and the contrast post − pre against the same contrast at control times;
- **matched control times:** e.g. same colony, same 4-h block and light phase, same colony activity level in the
  pre-window, with no event within the windows;
- an event-centred activity peak alone does not establish triggering, since activity can cause entries, and
  colony-wide drivers can cause both;
- distance from the event (entrance, queen position) is reported descriptively; it is not a test.

## Base
<At claim: commit, and whether the main-tree files this item depends on are
dirty in the working tree.>

## Data and roles
Stroeymeyt 2018 main-experiment PreTreatment tracks (fit colonies; development use for this question). Forager
entries from the nest-zone crossings already used for the stays (row 1); queen identity from `task_groups.txt` /
`info` metadata (local). Held-out: none (no age-experiment or PostTreatment file).

## Compute
<What runs where, roughly how long, how many workers; niced; never slowing a
main-line run.>

## Out of scope
Causal claims beyond the matched contrast; model changes (a driver found here would be proposed to the user for
the synchrony line, not adopted); brood-pile proximity (brood coordinates are a separate, development-only data set,
D137).

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-31 01:11 UTC · lead · Answered on the main line as Part D item 1(b): designed D212 (amendments 1-2), built D215/D217, quorum D220, read D221 (F109). See Findings.

## Findings
Answered on the main line as Part D Part 2 item 1(b) (T035), not in this folder: design D212 with amendments 1-2
(user D213, D216), which adopts this item's design requirements; read D221; finding F109. In the 22 fit colonies'
light phase, nest activity rises after queen movement onsets beyond matched controls and above a 10 % margin, with no
pre-event rise; forager entries are followed by a rise smaller than the margin that was already under way before them.
Observational associations: shared drivers and reverse causation remain possible. Evidence and scripts: D221 and
`logs/partd2/triggers/` (local).
