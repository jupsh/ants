---
id: D291
date: 2026-11-05
time: 18:00
kind: run
title: ants-lab stage 1c follow-up 2 checked: Codex features deny-by-default wired (42 disabled), 310 + 9 tests; the Codex smoke's only error is the code-mode notice before the turn. Lead: engine homes per session (only the login crosses sessions), the pre-turn code-mode notice is not a failure
---
- **2026-11-05 ≈ 18:00 UTC — ants-lab stage 1c follow-up 2 checked: Codex features deny-by-default wired (42 disabled), 310 + 9 tests; the Codex smoke's only error is the code-mode notice before the turn. Lead: engine homes per session (only the login crosses sessions), the pre-turn code-mode notice is not a failure.**
  - **Brief and report:** `logs/handoff/20261105-1710-lab-1c/` (`brief.md` § Follow-up 2; `report.md` § Follow-up 2
    report, with the lead's check).
  - **Implementer's report, quoted:** "The feature gate is wired and tested, and all three test tiers pass. But the
    one Codex smoke did **not** meet its acceptance bar: it returned `ok: false` with a code-mode error".
  - **Model calls:** one Codex call (clerk, `gpt-6.1-terra`, low), answered `{"answer":"OK"}`; 42 features passed
    as `--disable`, all 13 allowed features enabled. Proxy: `chatgpt.com` ×7 and `ab.chatgpt.com` ×1, all allowed;
    no `*.oaiusercontent.com` (5 denied before), no `auth.openai.com`.
  - **Lead's check:**
    - Reproduced 310/310, tsc 0 and `test:docker` 9/9.
    - The transcript's event order is `thread.started`, the code-mode error item, `turn.started`, the answer,
      `turn.completed`. The notice comes before the turn and says code mode "will fail closed": it reports the
      disabled `code_mode_host` taking effect, not a failed turn.
    - `codex features list` wrote no PATH aliases into the lab home. But the whole lab Codex home is mounted
      read-write into every Codex container (`src/box/mounts.ts`), and so is Muse's. Codex wrote a
      `trust_level = "trusted"` entry per smoke workspace into its `config.toml`, and the home holds `skills/`,
      `sessions/` (earlier transcripts) and goals, memories and history databases.
  - **Lead's decisions** (lab design, DESIGN.md Walls 3 and 4 amended):
    - **Engine homes are per session.** DESIGN mounts "their logins", not their homes. A home shared read-write
      lets one session leave config (hooks, MCP servers, a `notify` command), skills or memories that later
      sessions load. It also lets a reviewer or the second implementer read another session's transcript, which
      would defeat the reviewers' and P200's independence. Each Codex or Muse session gets a fresh home under its
      session directory: a copy of the login plus a config the conductor writes. Afterwards the conductor copies a
      refreshed login back, only if it is the same account, and discards the rest. Because that config is
      conductor-written, the feature cache keyed on the binary is complete, which settles the implementer's doubt.
    - **The pre-turn code-mode notice is not a failure.** An error item counts as a notice, recorded in the result,
      only if it comes before `turn.started` and its text begins "Code Mode is unavailable because code-mode host
      is disabled". Every other error item still fails the session. `code_mode_host` stays disabled.
  - **Next:** follow-up 3 (`brief.md` § Follow-up 3), with one Codex call and one Muse call to check the per-session
    homes. Then the lab-repo commit of 1c, which waits for the user's agreement (D290).
