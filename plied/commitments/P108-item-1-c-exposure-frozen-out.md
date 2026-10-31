---
id: P108
title: "Item 1(c): exposure frozen, out/unseen kept, unseen-as-unknown sensitivity"
wording: >-
  Freeze comparable exposure denominators for data and runs, retain the out/unseen split, and add a
  data-only sensitivity that treats unseen intervals as unknown rather than confirmed absence.
made: D224
state: fulfilled
nodes: [T012]
resolved_by: D226
reviews:
  - action: run:foragers1c-build-smoke
    disposition: satisfied
    because: >-
      the brief fixes amendment 1's exposure denominators for data and runs, the out/unseen rows and
      the data-only unseen-as-unknown sensitivity
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
      D225: exposure = tracked foragers x window minutes on both sides; out/unseen and the data-only
      sensitivity built and synthetic-checked
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
      D225: exposure = tracked foragers x window minutes on both sides; out/unseen and the data-only
      sensitivity built and synthetic-checked
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
- 2026-10-31 02:31 UTC lead (session 6b5fb317): created — D224 amendment 2
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: satisfied — the brief fixes amendment 1's exposure denominators for data and runs, the out/unseen rows and the data-only unseen-as-unknown sensitivity
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: satisfied — D225: exposure = tracked foragers x window minutes on both sides; out/unseen and the data-only sensitivity built and synthetic-checked
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: satisfied — D225: exposure = tracked foragers x window minutes on both sides; out/unseen and the data-only sensitivity built and synthetic-checked
- 2026-10-31 03:09 UTC lead (session 6b5fb317): set state=fulfilled; set resolved_by=D226 — D226 uses the frozen exposure on both sides, reports the out/unseen split and the data-only sensitivity
