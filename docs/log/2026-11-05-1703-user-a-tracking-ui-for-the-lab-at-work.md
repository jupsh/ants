---
id: D288
date: 2026-11-05
time: 17:03
kind: decision
title: User: a tracking UI for the lab at work, served locally by ants-lab (lab ui): agent sessions per role, the step queue and reviews, quota pace per provider, open suggestions and the inbox; read-only, never showing embargoed content
authority: user
scope: T065
---
- **2026-11-05 ≈ 17:03 UTC — User: a tracking UI for the lab at work, served locally by ants-lab (lab ui): agent sessions per role, the step queue and reviews, quota pace per provider, open suggestions and the inbox; read-only, never showing embargoed content.**
  - **User (in conversation):** "Would you be able to make a UI to track them as well?" To the lead's two
    questions the user chose these options:
    - what to show: "The lab at work (Recommended)": each role's agent sessions, the step queue and reviews, quota
      pace per provider, open suggestions and the inbox;
    - where: "Local page from the lab (Recommended)": served on localhost by ants-lab from its own state, and built
      by the implementer from a brief.
  - **Lead's specification** (DESIGN *Watching the lab*):
    - read-only, bound to 127.0.0.1, with a Host-header check against DNS rebinding;
    - no write endpoints: answers stay with `lab answer` (TTY) or the user's own session;
    - no external resources;
    - for runs, only their state and which promised outputs are present: never a log line, a metric or an output
      value, blind or not, as with the blind-check rule (AGENTS.md);
    - the embargo directory is never read.
  - **Sequencing (lead):** the UI's brief follows stage 2. The conductor defines the step, session and inbox records
    the page reads, and the implementer is building 1c in the same repo now. Until then the page would have no data
    to show.
