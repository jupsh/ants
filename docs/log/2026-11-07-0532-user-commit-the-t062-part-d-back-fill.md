---
id: D325
date: 2026-11-07
time: 05:32
kind: decision
title: User: commit the T062 Part D back-fill with the records; the ants-repo commit carries D288-D324 and their plied changes, lifting D294's hold for the ants records; the ants-lab code stays uncommitted
authority: user
scope: T062 T064 T065
---
- **2026-11-07 ≈ 05:32 UTC — User: commit the T062 Part D back-fill with the records; the ants-repo commit carries D288-D324 and their plied changes, lifting D294's hold for the ants records; the ants-lab code stays uncommitted.**
  - **The user's words** (after D324, which said the back-fill needs a commit "together with today's records (D321-D324)"
    before the lab's workspaces can see it): "go ahead with the commit".
  - **What the commit carries (the lead's reading):** `scripts/frozen/partd/` (D324) and every uncommitted record in the
    ants repo, D288-D325 with their plied changes (threads, commitments P201-P202, questions Q40-Q43, `plied.toml`'s
    `lab` actor from D302). The records cannot be split at D321: the plied files and the generated indexes interleave
    them. Committing them also puts D322-D324 in HEAD, which the lab's workspace clones need. This lifts D294's hold
    for the ants records only.
  - **Stays uncommitted:** the ants-lab code (D294's hold stands there); `logs/` (ignored: hand-offs, the L0004 draft).
