---
id: P106
title: "Item 1(c): both standardisations kept, neither causal"
wording: >-
  Keep both directions of the arithmetic standardisation; neither estimates what changing residence
  would cause.
made: D224
state: fulfilled
nodes: [T012]
resolved_by: D226
reviews:
  - action: run:foragers1c-build-smoke
    disposition: satisfied
    because: >-
      the brief requires both D-dagger and D-double-dagger, labelled arithmetic standardisations,
      not causal
    by: lead (session 6b5fb317)
    at: "2026-10-31 02:33 UTC"
    inputs:
      - record: D223
        rev: d91126ff338bb2e03861036626ef624304f4379bd9e707f9ad215faa8f1de646
      - record: D224
        rev: 40e58b5e95b78564c1257ba08746a92d3e52144e55d9f211b0ca5e809910b360
  - action: run:foragers1c-data
    disposition: satisfied
    because: "D225: both D-dagger and D-double-dagger computed and checked by hand, labelled non-causal"
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
    because: "D225: both D-dagger and D-double-dagger computed and checked by hand, labelled non-causal"
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
- 2026-10-31 02:31 UTC lead (session 6b5fb317): created — D224 amendment 1
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: satisfied — the brief requires both D-dagger and D-double-dagger, labelled arithmetic standardisations, not causal
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: satisfied — D225: both D-dagger and D-double-dagger computed and checked by hand, labelled non-causal
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: satisfied — D225: both D-dagger and D-double-dagger computed and checked by hand, labelled non-causal
- 2026-10-31 03:09 UTC lead (session 6b5fb317): set state=fulfilled; set resolved_by=D226 — D226 reports both D-dagger and D-double-dagger and says neither estimates what changing residence would do
