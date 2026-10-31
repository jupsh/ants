---
id: P111
title: "Item 1(c): entry clustering excludes the focal ant; benchmark only"
wording: >-
  Preserve per-ant entry counts, exclude that ant's entries, and account for window edges and
  eligible minutes. Describe the uniform-time reference as a simple benchmark: excess clustering
  against it does not establish interaction or triggering.
made: D224
state: fulfilled
nodes: [T012]
resolved_by: D226
reviews:
  - action: run:foragers1c-build-smoke
    disposition: satisfied
    because: >-
      the brief requires amendment 1 point 4's benchmark (focal ant excluded, E_j eligible minutes,
      window edges) and per-ant entry counts
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:33 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
  - action: run:foragers1c-data
    disposition: satisfied
    because: >-
      D225: benchmark excludes the focal ant, uses E_j and window edges (hand case passes); per-ant
      entry counts kept
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:57 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
      - record: D225
        rev: 75b5077cef0329318950747616b3444f23f232161a33bb8e2b5fd3dc79f3ca27
  - action: run:foragers1c-read
    disposition: satisfied
    because: >-
      D225: benchmark excludes the focal ant, uses E_j and window edges (hand case passes); per-ant
      entry counts kept
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:57 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
      - record: D225
        rev: 75b5077cef0329318950747616b3444f23f232161a33bb8e2b5fd3dc79f3ca27
---

## History
- 2026-10-31 02:31 UTC lead (session 6b5fb317): created — D224 amendment 4
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: satisfied — the brief requires amendment 1 point 4's benchmark (focal ant excluded, E_j eligible minutes, window edges) and per-ant entry counts
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: satisfied — D225: benchmark excludes the focal ant, uses E_j and window edges (hand case passes); per-ant entry counts kept
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: satisfied — D225: benchmark excludes the focal ant, uses E_j and window edges (hand case passes); per-ant entry counts kept
- 2026-10-31 03:09 UTC lead (session 6b5fb317): set state=fulfilled; set resolved_by=D226 — D226 uses the corrected benchmark (focal ant excluded, E_j, window edges), keeps per-ant counts and calls excess clustering no evidence of interaction or triggering
