---
id: D311
date: 2026-11-06
time: 03:30
kind: run
title: ants-lab first live step L0001 on T064: the researcher session failed within a second of reaching the API, 0 tokens, its error not kept; asked as an unauditable transcript; the user answered try again (D310); the lead paused the loop until the error is recorded
---
- **2026-11-06 ≈ 03:30 UTC — ants-lab first live step L0001 on T064: the researcher session failed within a second of reaching the API, 0 tokens, its error not kept; asked as an unauditable transcript; the user answered try again (D310); the lead paused the loop until the error is recorded.**
  - **Start:** the user ran `lab enable` at 03:22:03 UTC (`enabled.json`, by norma on /dev/pts/4), then
    `lab run --alongside`.
  - **Step L0001** (node T064, the lab's claim `lab-L0001`): dirty set 35 user paths, 0 lab; packet built; workspace
    `L0001-w1-researcher` from HEAD `03e97e7`. Session `L0001-s01-researcher` (Claude Opus 5.5, high, in its box):
    the proxy allowed its CONNECT to api.anthropic.com at 03:24:00.911; it ended at 03:24:01.8 with 0 events, 0 tokens,
    `ok: false`. The step became ask L0001, "tripwire (user): a session transcript could not be audited", notified;
    workspace discarded; T064 noted "ants-lab step L0001: asked". The user pressed Ctrl-C; the SIGINT also reached the
    loop's `records.mjs log find` child ("polling for answers failed"), which runs cleanly on its own (exit 0).
  - **Correction (defect in the lab):** the session's error is built by the adapter but kept nowhere: not in
    `steps/L0001.json`, the live file, the ask's reason or the loop's output. The cause of the failure is therefore
    unknown. Fix briefed as follow-up 1 of `logs/handoff/20261106-0320-lab-ui/` (with the loop's silent idle).
  - **The answer:** the user answered L0001 "try again" (D310, by `lab answer`, 03:25:00). A second `lab run`, started at
    03:24:12 before the answer, saw the pending ask, found nothing else and slept its 10-minute idle without a log line.
  - **Lead:** paused the lab (`lab pause`, ≈ 03:29) so the 03:34 wake-up would not repeat an undiagnosable failure; the
    loop stops at that boundary. Resume after the follow-up, so the retry under D310 records its error. Cost so far:
    one researcher usage line at the 0.02 prior estimate, 0 tokens measured.
