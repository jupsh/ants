---
id: D296
date: 2026-11-05
time: 21:11
kind: decision
title: ants-lab stage 2 split into 2a (the step pipeline, fakes only), 2b (loop, CLI, recovery), 2c (first live steps, to the user first), then the UI; an amendment to an entry carrying authority: goes to the user, a changed authority/scope/title halts
---
- **2026-11-05 ≈ 21:11 UTC — ants-lab stage 2 split into 2a (the step pipeline, fakes only), 2b (loop, CLI, recovery), 2c (first live steps, to the user first), then the UI; an amendment to an entry carrying authority: goes to the user, a changed authority/scope/title halts.**
  - **The split** (lead; HANDOFF.md, *Keeping it small*, D214: "one stage per brief"):
    - **2a, the step pipeline:** one step end to end, from node to outcome, built and tested with fake engines on
      temporary repositories. No model calls, and no write to the real checkout, plied or records. Also: the
      live-session files and quiet/refused alerts (D294), the stale session-home sweep (D292), and the
      authority-amendment rule below.
    - **2b, the loop and the CLI:** `lab run`, `pause`, `status`, `inbox`, `answer`, `usage`, `suggestions`;
      recovery of intents without an outcome; the interactive-session check (`--alongside`); notifications and the
      daily digest; quota modes, the ladder climb and the shadow sample in the loop.
    - **2c, the first live steps:** a real `analysis` step, then one review-tier step, on the real checkout. They
      are brought to the user before the first one runs: it is the first time the lab acts on the ants repo.
    - **Then** the UI (D288), then the plied-tool kinds and the second implementation (P200). Until those are
      built, 2a sends those kinds to the user as "not yet supported".
  - **Amendments to entries carrying `authority:`** (the open point from stage 1b; DESIGN *Tripwires*):
    - **A changed `authority:`, `scope:`, `title:`, `id:`, `date:` or `time:` field** in an existing entry is a
      `halt` hit, as now. That would be a forged or altered authority.
    - **Body-only changes** (a dated amendment line) to an existing entry that carries `authority:` are a `user`
      hit: nothing is applied and the step goes to the user. Amending a delegated or user decision is the user's.
    - **New entries keep the D285 rule:** they must match an issued `log new` on title, authority and scope.
    - Entries without `authority:` are amended by the clerk as before.
