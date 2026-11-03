---
id: B016
title: Candidate held-out colony data sets
status: done
size: S
priority: 60
note: survey complete; exposure logging and data-role decisions remain with lead/user
outcome: Metadata-only survey returned 8 candidates and 4 exclusions/backups; species/provenance gaps and title/snippet exposures disclosed; no roles assigned.
depends: backlog/B016-candidate-held-out-colony-data-sets/metadata, backlog/B016-candidate-held-out-colony-data-sets/metadata.py, backlog/B016-candidate-held-out-colony-data-sets/survey.ts, backlog/B016-candidate-held-out-colony-data-sets/exposure-handoff.md, docs/contamination/X016-greenwald-segre-feinerman-2015.md
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

## Before pickup (the user) — settled 2026-10-29 (D181)
- **Exposure rules:** repository records, data descriptors and metadata only (species, lab, design, recorded
  variables, availability, licence). No abstracts, full texts, results or figures. Methods sections only by a
  later, separate permission.
- **Web search:** approved for this survey. Titles and snippets can show results: anything seen is reported for
  `docs/contamination/`.

## Base
Commit at claim: `6c3b0f20fed944c01266ca20fe2c994da8d66d23`; desk work only.
No tracked changes in `src/`, `scripts/lib.ts`, `scripts/simHash.ts` or `backlog/_lib/`
when checked during the survey. Other record changes are retained. The result stamp
reports the actual working-tree state; this work makes no simulation comparison.

## Data and roles
- **Read:** metadata only, within the user's exposure rules. Results, figures and the findings in abstracts are
  not read.
- **Exposure:** any accidental exposure is reported for the contamination log.
- **Never** the held-literature folder (sealed). Nothing downloaded.
- **Observed in this survey:** the first web call returned long result-bearing
  snippets; projected catalogue titles also disclosed outcomes. These are detailed
  in `exposure-handoff.md` and `results/title-inventory.json` for the lead. No data
  roles are assigned here. Only filtered metadata snapshots were saved; no paper
  or data file was downloaded or opened.

## Compute
None.

## Out of scope
Downloading or opening data, reading results, clearing papers, assigning roles.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-29 20:07 UTC · lead-claude · Lead: user approved a metadata-only survey with web search (D181, Q10); unblocked (P73, P74).
- 2026-11-03 06:40 UTC · codex-b016 · User commissioned B016. Reading fixed before search: survey repository metadata for Lasius/in-nest trophallaxis, recruitment and contacts, then other ant species where needed; retain species, author/lab overlap, recorded variables, format/size, availability and licence. A promising metadata match is a candidate for a later user decision, never a validation result or role assignment; absent fields stay unknown. No abstracts, full texts, figures, data files or downloads. Record any incidental result-bearing title/snippet exactly in an exposure handoff. Desk work only; base 6c3b0f20fed944c01266ca20fe2c994da8d66d23. npm run runs showed no running jobs and returned exit 1 with historical failures; no run logs inspected.
- 2026-11-03 06:54 UTC · codex-b016 · Metadata-only catalogue phase: explicit field projection excluded descriptions/abstracts/methods/usage notes and all file contents. Queried DataCite, Dryad and Zenodo; read all 188 Lasius-matching catalogue records across four pages (many taxonomic/off-topic records). Retrieved candidate file inventories, including paginated Dryad listings. Mendeley catalogue endpoint returned HTTP 403; no workaround or content access attempted. Outcome-bearing titles remain exposures and will accompany the shortlist. P73/P74 fetch reviews recorded as acting after the user authorized those two dispositions; gate passed. Initial plied check: 0 errors, 0 warnings.
- 2026-11-03 07:03 UTC · codex-b016 · Survey complete: 8 candidates (5 follow-up, 3 reserves), 4 exclusions/backups, 28 filtered snapshots and a conservative inventory of 442 DOI/title pairs. All 188 Lasius-query DOI records checked; no new independent-lab L. niger joint food-sharing/recruitment/contact dataset confirmed within this scope. Results in results/shortlist.md and survey.json; qualitative snippet/title exposures in exposure-handoff.md and title-inventory.json for lead logging. Typecheck, metadata-field audit, provenance check (2 JSON files, 0 stale) and scoped diff check passed. No simulations, fits, papers or data-file contents opened. plied diagnostics from concurrent D243 edits retained in checks/plied-check.json; lead handles authoritative follow-up.

## Findings
The bounded metadata survey returned **8 candidates** (5 for potential follow-up,
3 reserves) and **4 exclusions/backups**. Two candidates are confirmed *Lasius
niger*: Pasquier & Grüter's colony-foraging dataset and Czaczkes & Heinze's
trail-deposition dataset. Both are narrower than full colony validation.
Baltiansky et al.'s food-exchange/detection material and Pinter-Wollman's
interaction/foraging material are useful leads, but their species or completeness
are not established by the permitted structured metadata. Kay et al.'s large
network dataset shares authors with the in-nest calibration source; it is not
presented as an independent-lab test.

No new independent-lab *L. niger* dataset jointly covering food sharing,
recruitment and contacts was confirmed under this access scope. **That does not
show that no such dataset exists.** This bears on the main-line independent-test
gap; no data role, paper clearance, model change or validation claim follows.

Evidence: [shortlist](results/shortlist.md), [machine-readable survey](results/survey.json),
28 filtered catalogue snapshots in `metadata/`, and
[the title inventory](results/title-inventory.json). All 188 DOI records in the
Lasius title/subject query were inspected as metadata; several broader discovery
queries were first-page only. Filenames establish material categories, not
verified column schemas or independent replication. Mendeley's direct metadata
endpoint failed HTTP 403; file inventory/size for that reserve remains unknown.
Current Dryad inventories supersede discrepant DataCite storage totals; the
discrepancies and duplicate filename entries are disclosed rather than resolved
by opening files.

**Exposure:** the initial web response included qualitative result-bearing
snippets and later catalogue titles also disclosed outcomes. Every source in
that first response is inventoried in [exposure-handoff.md](exposure-handoff.md),
with all later projected titles in `results/title-inventory.json`. No paper,
figure, candidate data-file contents or sealed path was opened, and no paper or
data file was downloaded. The lead must enter the exposure record and assess
future eligibility; T037 and P73/P74 are left for the lead to close/resolve.

Checks: report generation, Python syntax/metadata-field audit, TypeScript
typecheck, `backlog.mjs check B016` and scoped `git diff --check` passed. The two
JSON results carry `provenance: stamp(ITEM)` and have no stale hashes (the dirty
working tree is disclosed). plied's baseline had 0 errors/0 warnings; later
checks saw unrelated D243 review/staleness warnings while the main line changed;
the final check returned **0 errors and 0 warnings**. That final snapshot is in
`checks/plied-check.json`. No unrelated record was edited here. No simulations or
fits were run.
