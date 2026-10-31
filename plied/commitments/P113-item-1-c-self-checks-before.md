---
id: P113
title: "Item 1(c): self-checks before anything is read"
wording: >-
  Self-checks before anything is read: … Until they pass, only these values are printed. If one
  fails, nothing else is read and the cause is logged.
made: D223
state: fulfilled
nodes: [T012]
resolved_by: D226
reviews:
  - action: run:foragers1c-build-smoke
    disposition: satisfied
    because: >-
      the smoke prints only the three self-checks (D_w rebuild, identity, set values) and run facts;
      no other value is printed or opened
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
      D225: the self-check gate is built and passed on the smoke; the recorder on 22 colonies prints
      stream facts only
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
      D225: the self-check gate is built and passed on the smoke; the analysis gates itself on
      self-checks 1-3 before printing or writing
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
- 2026-10-31 02:31 UTC lead (session 6b5fb317): created — D223, approved by D224: an implementation requirement now binding
- 2026-10-31 02:33 UTC lead (session 6b5fb317): review for run:foragers1c-build-smoke: satisfied — the smoke prints only the three self-checks (D_w rebuild, identity, set values) and run facts; no other value is printed or opened
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-data: satisfied — D225: the self-check gate is built and passed on the smoke; the recorder on 22 colonies prints stream facts only
- 2026-10-31 02:57 UTC lead (session 6b5fb317): review for run:foragers1c-read: satisfied — D225: the self-check gate is built and passed on the smoke; the analysis gates itself on self-checks 1-3 before printing or writing
- 2026-10-31 03:09 UTC lead (session 6b5fb317): set state=fulfilled; set resolved_by=D226 — D226: all self-checks passed and were read before anything else
