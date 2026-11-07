---
id: D300
date: 2026-11-05
time: 22:19
kind: decision
title: ants-lab stage 2b scope and the lead's rules for it: interrupted steps are reconciled and ended, never resumed; answers are user-authority entries scoped to the node; halts and the live switch are cleared and set only by the user at a terminal; which threads the lab takes is left to 2c
---
- **2026-11-05 ≈ 22:19 UTC — ants-lab stage 2b scope and the lead's rules for it: interrupted steps are reconciled and ended, never resumed; answers are user-authority entries scoped to the node; halts and the live switch are cleared and set only by the user at a terminal; which threads the lab takes is left to 2c.**
  - **Scope** (D296's 2b): `lab run`, `pause`, `status`, `inbox`, `answer`, `usage`, `suggestions`; recovery of
    intents without an outcome; the interactive-session check (`--alongside`); notifications and the daily digest; quota
    modes, the ladder climb and the shadow sample in the loop. Built and tested on temporary repositories with fake
    engines, plied and notifier, like 2a: no model call, no probe, no notification sent, nothing written in the ants
    checkout. Brief: `logs/handoff/20261105-2219-lab-2b/brief.md`.
  - **The lead's rules, where DESIGN leaves the detail open** (DESIGN amended to match):
    - **An interrupted step is never resumed mid-phase.** On start, the conductor reconciles every intent without an
      outcome (DESIGN *Recovery*), then ends each step whose `steps/<id>.json` has no `end` as `interrupted`: its
      sessions released through `releaseSession`, its workspaces discarded unless an apply or commit is confirmed done,
      in which case the step ends `applied`. The node's next step starts fresh. Rebuilding a step from a half-finished
      state would be a second, untested path through the approvals.
    - **A notification intent without an outcome** cannot be checked against the world. It is sent again once:
      a duplicate line on the user's phone costs less than a lost ask.
    - **Answers.** `lab answer <ask> "<words>"` (TTY only) writes a decision entry through `records.mjs log new` with
      `--authority user --scope <node>`, the user's words quoted verbatim, the ask id and the artifact hash of what was
      asked (DESIGN *Approvals*: "A delegated decision entry names the artifact hash"), and resolves the ask. An answer
      the user writes in their own session is found by polling: a user-authority decision entry whose scope names the
      node and whose time is after the ask resolves that node's pending asks. Asks are not made plied questions in 2b:
      that would be a new kind of record write by the lab, for 2c to decide with the user.
    - **No step on a node with a pending ask** (D299). A drift ask therefore stops the node until it is answered.
    - **Halt and the live switch are the user's.** `lab run` refuses while `halt.json` exists, and refuses on a
      checkout until `<state>/enabled.json` exists. Both are changed only by TTY-only commands (`lab unhalt "<why>"`,
      `lab enable` / `lab disable`), journaled. 2b never creates `enabled.json` for the real checkout; enabling it is
      the start of 2c, the user's call.
    - **Which threads the lab takes is left to 2c.** plied's actors are `lead`, `user` and `agent` (`plied.toml`);
      there is no lab actor yet. 2b takes the queue from `plied frontier --json` filtered by a configured actor
      (`queue.actor`), tested on fixture output. The real setting, and whether plied gets a `lab` actor, go to the
      user with 2c.
    - **plied calls pass `--json`** and read `ok` from the envelope (D299).
