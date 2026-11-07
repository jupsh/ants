---
id: D294
date: 2026-11-05
time: 21:08
kind: decision
title: User: hold the stage-1c commits; go ahead with the next steps; add per-session status files and the quiet-session and refused-request alerts to the lab UI design and the stage 2 brief
authority: user
scope: T065
---
- **2026-11-05 ≈ 21:08 UTC — User: hold the stage-1c commits; go ahead with the next steps; add per-session status files and the quiet-session and refused-request alerts to the lab UI design and the stage 2 brief.**
  - **The user, in answer to the lead's two questions** (commit 1c with its follow-ups and the records D288–D293;
    add the lab UI's live-session data): "you can wait on the commit and go ahead, and yes to the tracking page
    question".
  - **What this settles:**
    - **No commit yet,** in either repo. The stage 1c code and the records D288 onward stay uncommitted until the
      user says otherwise. D290's condition stands.
    - **Go ahead:** finish checking follow-up 4, then write the stage 2 (conductor) brief.
    - **Tracking page** (DESIGN.md *Watching the lab*, amended by the lead):
      - **Per-session status files,** written by the conductor from the engine's event stream, never by the agent.
        Each holds the role, engine, model, effort, node, step, start time, context tokens used against the soft and
        hard limits, and the time of the last event. Never a command, a tool's output or a log line.
      - **A quiet-session alert:** no event for longer than the role's limit.
      - **Refused requests in Alerts,** counted per session from the proxy log.
    - **No outside telemetry:** the lab sends none, and the engines' own telemetry stays off (D289). The lead's
      reasoning is in the conversation, not here: it would be a new path out of the walls, and the page already has
      its data locally.
    - These go in the stage 2 brief, since the conductor and its adapters write them.
