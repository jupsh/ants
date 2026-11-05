---
id: D287
date: 2026-11-05
time: 16:53
kind: decision
title: User: commit the stage-1b records (D281-D286, the T065 notes and the P198-P200 dispositions) and ants-lab's code as its first commit; then the lead writes the stage-1c brief (containers)
authority: user
scope: T065
---
- **2026-11-05 ≈ 16:53 UTC — User: commit the stage-1b records (D281-D286, the T065 notes and the P198-P200 dispositions) and ants-lab's code as its first commit; then the lead writes the stage-1c brief (containers).**
  - **User (in conversation, verbatim):** "yes and yes", replying to the lead's two questions after D286: "Do you
    want me to commit, and should I write the stage 1c brief (containers) next?"
  - **Effect:**
    - One gated records-only commit on `browser-sim-m1` (`commit:lab-1b-records-20261105`): D281-D287, the
      T065 notes, the P198-P200 dispositions and the generated views. Nothing under `src/`, `scripts/` or `test/`.
      The hand-off folders (`logs/handoff/`) are git-ignored and stay local.
    - `~/repos/ants-lab`'s first commit, local only and never pushed (D277), after a check that it holds no
      credentials.
    - Then the stage-1c brief (containers) is written for the implementer.
