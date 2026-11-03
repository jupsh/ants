# B016 checks and limits

- `npx vite-node backlog/B016-candidate-held-out-colony-data-sets/survey.ts`:
  8 candidates, 4 exclusions/backups, 442 DOI/title pairs, 28 projected snapshots.
- Python AST parse and recursive snapshot audit: valid syntax; no fields named
  abstract(s), description(s), methods or usage notes in any metadata snapshot.
  All 8 candidates have source, species/unknown, lab, material, licence and
  exposure fields. Both results JSON files carry the required item stamp.
- Four Lasius query pages: 188 records, 188 unique DOI identifiers. Versions and
  concept DOIs are deliberately not counted as independent experiments.
- `npx tsc --noEmit -p .`: exit 0.
- `node backlog/backlog.mjs check B016`: 2 stamped JSON results, 0 stale;
  computed-on-dirty-tree flag disclosed. No simulation results were generated.
- Scoped `git diff --check`: exit 0.
- plied baseline: 0 errors, 0 warnings. During concurrent main-line record work,
  later checks returned 0 errors and D243-related review-input/stale warnings.
  The final check returned **0 errors and 0 warnings**, captured in
  `checks/plied-check.json`; no unrelated node/disposition was edited here.
  The two B016 fetch
  dispositions are `acting`, as authorized by the user, not `fulfilled`.
- The catalogue helper failed with sandbox DNS resolution before an approved
  network retry. Mendeley's provider endpoint returned HTTP 403; the reserve's
  file access, format and size remain unverified. No bypass was attempted.
- No paper/data contents were downloaded. Initial search-result excerpts and
  all later potentially result-bearing titles are explicitly disclosed in
  `exposure-handoff.md` and `results/title-inventory.json`.

The metadata-field audit establishes the saved field projection, not that every
title was result-free. Titles sometimes contain conclusions or long subtitles;
the title inventory preserves that exposure. The survey is a candidate-finding
exercise and supplies no biological test, fit, comparison or role assignment.
