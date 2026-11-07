---
id: D301
date: 2026-11-05
time: 23:07
kind: run
title: ants-lab stage 2b built and checked: the loop, the commands, recovery (interrupted steps ended, unreconcilable intents halt), answers, the interactive-session check, notifications and the digest, the ladder climb and shadow sample; 456 + 10 tests; real lab run refuses (not enabled); meter wiring and the thread queue left for 2c
---
- **2026-11-05 ≈ 23:07 UTC — ants-lab stage 2b built and checked: the loop, the commands, recovery (interrupted steps ended, unreconcilable intents halt), answers, the interactive-session check, notifications and the digest, the ladder climb and shadow sample; 456 + 10 tests; real lab run refuses (not enabled); meter wiring and the thread queue left for 2c.**
  - **Brief and report:** `logs/handoff/20261105-2219-lab-2b/` (`brief.md`, `report.md`, with the lead's check). Rules:
    D300. Gated `run:lab-2b` (P198-P201 disposed). The implementer stopped once on a network error (API unreachable)
    and was resumed; nothing had changed outside its scope.
  - **Implementer's report, quoted:** "All seven modules in the brief are built, and every test it lists exists and
    passes. `npx vitest run` passes 456 tests, `npx tsc --noEmit` exits 0, and `npm run test:docker` passes 10 tests."
  - **Lead's check:** reproduced 456/456, tsc 0, the Docker tier 10/10; tree `61e2793a` reproduced; `git -C ~/repos/ants
    status --short` identical to the implementer's saved listing; no `enabled.json` in the real state directory; the
    answers writer allows only `log new … --authority user`, `check` and `log find`. On the real state directory the
    read-only commands report an empty lab, and `lab run` refuses: "the lab is not enabled for /home/norma/repos/ants".
  - **Seen against a rule (the lead's instruction, corrected):** the launch note asked for a hashed listing of the state
    directory. Before the correction (names, sizes and mtimes only) reached it, the implementer hashed 68 files there:
    smoke transcripts, session specs, the proxy log, the dry-run packets. The lead checked: the state directory holds no
    `home` directory and no file named like a login, auth or credential file, so no login copy was read. No withheld data
    is involved; not an exposure.
  - **Lead's readings of the report's doubts:**
    - **The answer registry** (doubt 1): accepted as bookkeeping. A later patch touching such an entry is governed by D296
      (a body change goes to the user, a field change halts), whatever is registered.
    - **The climb rule** (doubt 2) cannot fire for the researcher, whose rungs are already Opus. It applies once the cheaper
      roles get a retry on invalid output (clerk, reviewers); not built yet.
    - **Recovery choices** (doubt 4) accepted: each unclear case halts and goes to the user.
  - **Before 2c** (open; D296: "brought to the user before the first one runs"):
    - **Meter wiring:** the real `lab run` holds no meter reads and no probe, so it would wait on quota. `readMuseMeters`
      takes no environment and would read the user's own Muse account, not the lab's home; it must read the lab's.
    - **The thread queue** (P201): `queue.actor`, and whether plied gets a `lab` actor.
    - **The interactive check:** any Claude Code session in `~/repos/ants`, the lead's included, blocks the loop unless
      `lab run --alongside`.
    - **Config duplicates:** `ladder.shadowShare` beside `ladder.shadowRate`, and `digest.hourUtc` beside
      `limits.dailyDigestUtcHour`; one of each goes.
    - **`lab enable`,** which only the user runs.
  - **Stage 2b is complete,** uncommitted, like 1c and 2a (D294).
