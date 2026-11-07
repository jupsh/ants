---
id: D318
date: 2026-11-06
time: 04:25
kind: decision
title: User: a live rehearsal of the lab with real models, before more T064 steps
authority: user
scope: T065
---
- **2026-11-06 ≈ 04:25 UTC — User: a live rehearsal of the lab with real models, before more T064 steps.**
  - **The user's words** (after the lead's account of the rough edges, D317): "yeah go ahead and do some testing. it's
    okay if you use the actual models".
  - **The lead's reading of why:** every defect so far (D311, D312, D317, the missing plied of D315) sat where a test
    fake differs from the real system (the CLI's schema validator, a gitignored output path, a lost error, a stubbed
    plied), and the plan went from the dry run straight to a live step on T064 with no in-box session rehearsed first.
    The workspace is also a clone of HEAD while 1c onward is uncommitted (D294).
  - **The rehearsal, as the lead sets it:** after the packet/plied/outputs build (D316, D317) is checked. On a throwaway
    clone of the checkout and a separate state directory, never the real checkout or state; real engines in their
    boxes with the lab's own logins (D302); the cheapest models and lowest efforts (Claude Haiku 5.5, Codex and Muse at
    their lowest; never Fable 5.1); a throwaway plied thread in the clone. It covers each role and engine, the review
    panel, apply, the commit path in the clone, a user-tier kind, carried outputs and plied in the box. The implementer
    builds the harness and runs it, fixing what breaks, within a spend cap of $5 estimated and 40 sessions; anything
    that needs a design choice comes back to the lead.
