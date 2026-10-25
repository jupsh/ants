---
id: P33
title: "S2 audit: amendment confirmed, synthetic checks pass and hashes frozen before any audit statistic"
wording: >-
  Before any audit statistic is computed on data or simulated files, the amendments are made
  concrete in a design amendment … which the user confirms; the synthetic checks must pass on the
  frozen code; then the script hashes are frozen and the run starts.
summary: Precondition for running T032.
made: D145
state: fulfilled
nodes: [T032]
resolved_by: D156
links: [D146, D156]
reviews:
  - action: run:s2audit
    disposition: satisfied
    because: >-
      Amendments confirmed (D147, D150); synthetic checks pass on the frozen code (D152); the six
      script hashes frozen (D153) and re-verified before launch; no audit statistic computed on data
      or simulated files before this run.
    by: lead (session 0bcdd30b)
    at: "2026-10-25 03:56 UTC"
---

## History
- 2026-10-25 03:03 UTC lead (session 0bcdd30b): created
- 2026-10-25 03:06 UTC lead (session 0bcdd30b): added D146 to links — D146 (proposal, awaiting Q12) holds this commitment's concrete rule
- 2026-10-25 03:11 UTC lead (session 0bcdd30b): reviewed D147: precondition unchanged; the amendment is now confirmed (D147), synthetic checks and hashes remain.
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): reviewed D150: precondition unchanged; synthetic checks now under D151's revision.
- 2026-10-25 03:43 UTC lead (session 0bcdd30b): reviewed D152, D153: amendment confirmed (D147, D150), synthetic checks pass (D152), hashes frozen (D153). Open until the run starts (Q14).
- 2026-10-25 03:56 UTC lead (session 0bcdd30b): review for run:s2audit: satisfied — Amendments confirmed (D147, D150); synthetic checks pass on the frozen code (D152); the six script hashes frozen (D153) and re-verified before launch; no audit statistic computed on data or simulated files before this run.
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D155: satisfied at launch (disposition recorded); the run has started.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): set state=fulfilled; set resolved_by=D156; added D156 to links — preconditions met before any audit statistic; run on the frozen code (D153, D155, D156)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: preconditions of the S2 run are not affected by a correction to its descriptive reading. Stays fulfilled.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): reviewed D158: it cites the S2 audit's frozen code (D153) for reuse; the audit's preconditions are untouched. Stays fulfilled.
