---
id: D305
date: 2026-11-06
time: 02:58
kind: run
title: ants-lab first real meter read and the T064 dry run: Codex 2% weekly, Claude and Muse unknown; the researcher seat (Claude) would pause, so the first live step needs a Claude probe whose meter yield is untested; Q41 to the user
---
- **2026-11-06 ≈ 02:58 UTC — ants-lab first real meter read and the T064 dry run: Codex 2% weekly, Claude and Muse unknown; the researcher seat (Claude) would pause, so the first live step needs a Claude probe whose meter yield is untested; Q41 to the user.**
  - **Why:** D302's order after prep: a real `lab usage --read` by the lead, then the first thread's dry run, then both
    to the user before `lab enable`.
  - **Meter read** (`lab usage --read`, ants-lab tree `f99d99a7`, ≈ 02:56 UTC; the lab's own logins, no probe):
    - Claude: weekly and short unknown, "no plan rate limits in the usage report (token without the profile scope, or
      no plan)". As DESIGN expected for the lab token.
    - Codex: weekly 2 % (resets 2026-11-12 04:57 UTC), short 0 % (resets 2026-11-06 07:57 UTC).
    - Muse: unknown, "no usage data (server_sent_no_usage)". DESIGN: Muse prints no usage before its first use in a
      window, which the probe settles.
    - Three `meter` usage lines, 0 tokens. No `sessions/meter-*` left; no `enabled.json`.
  - **Thread:** T064 (first on the lead's frontier; D276's bounded item 1(e) design, P188-P197: a design brought back
    before implementation or runs). Its work is design and analysis with no runs, so it fits a first lab step.
  - **Dry run** (`lab step --dry-run --node T064`; no session, no probe): 19 packet files hashed, governing D205, D231,
    D275, D276 and the STATUS/AGENTS rules; commitments P188-P197 open. Phase 2 would start one researcher session
    (Claude Opus 5.5, high; soft 90k, hard 140k) with a same-model retry on an invalid proposal. Both "would not start:
    claude is pause; no fallback (the step would end paused)". Packet at
    `~/.local/state/ants-lab/dryrun/20261106T025748Z-T064`. `git -C ~/repos/ants status --short` unchanged.
  - **Reading:** with the Claude meter unknown, the live loop (`ensureFreshMeter`) makes one Claude probe (Haiku 5.5,
    low, no tools, "Reply with the single word OK") before the step, at most once per `meterMaxAgeMinutes` (30), and
    takes the meter from the SDK's rate-limit events (`probeClaude`). Whether the lab token's sessions carry those
    events is not known: no lab Claude session has run. If they do not, Claude stays paused, every Claude step ends
    paused, and the loop spends one Haiku call per 30 minutes for nothing. DESIGN (*Uncertainty*) forbids assuming a
    meter is low, so there is no way around it within the design. The researcher, implementer and authority reviewer
    are all Claude seats.
  - **To the user:** Q41, whether the lead makes one Claude probe and one Muse probe now (two one-turn calls, cheapest
    model, lowest effort), then re-reads, before `lab enable`; and T064 as the first thread with actor=lab.
