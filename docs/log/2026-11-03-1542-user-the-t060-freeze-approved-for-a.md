---
id: D267
date: 2026-11-03
time: 15:42
kind: decision
title: User: the T060 freeze approved for a gated commit before the support audit, once the equality, whitelist and colony-237 reproduction checks pass (frozen code, its imports and the SHA-256 records); event tables kept in memory only; the recorded stop rule kept (back to the user if the primary or any sensitivity would pass support, else T060 closes as unsupported by this extraction and observation rule)
authority: user
scope: T060 P172
---
- **2026-11-03 ≈ 15:42 UTC — User: the T060 freeze approved for a gated commit before the support audit, once the equality, whitelist and colony-237 reproduction checks pass (frozen code, its imports and the SHA-256 records); event tables kept in memory only; the recorded stop rule kept (back to the user if the primary or any sensitivity would pass support, else T060 closes as unsupported by this extraction and observation rule).**
  - **The user's answer (in the session, verbatim), to the lead's question whether the freeze may be committed, gated,
    before the audit run (P172):**

    > Yes—I recommend approving the gated freeze commit **before the audit**, once the equality, whitelist and colony-237 reproduction checks pass. Include the frozen code, its imports and the SHA-256 records.
    >
    > Keeping event tables only in memory fits the restricted scope. Keep the recorded stop rule: return for a decision if the primary or any sensitivity would pass; otherwise close T060 as unsupported by this extraction and observation rule.
  - **Effect:** after the lead's check of the implementer's report (brief `logs/handoff/20261103-1529-t060-support/`),
    and only if the equality check against `readStage0`, the whitelist test and the colony-237 reproduction pass,
    `extract.ts`, `support.ts` and every file they import are copied byte-identical under `scripts/frozen/t060/`, their
    SHA-256s are recorded in a dated line of D243, and that is committed, gated, before the audit runs. If any check
    fails, nothing is frozen or committed and it comes back to the user (P166). D243's 15:18 block (event tables in
    memory only; the stop rule) stands as written.
