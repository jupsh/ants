---
id: D292
date: 2026-11-05
time: 18:14
kind: run
title: ants-lab stage 1c follow-up 3 checked: per-session engine homes (only the login crosses sessions, copy-back for the same account only), the pre-turn code-mode notice recorded, 324 + 10 tests; Codex and Muse smokes ok. Stage 1c done, but two items remain: the login field names and a stale-home sweep
---
- **2026-11-05 ≈ 18:14 UTC — ants-lab stage 1c follow-up 3 checked: per-session engine homes (only the login crosses sessions, copy-back for the same account only), the pre-turn code-mode notice recorded, 324 + 10 tests; Codex and Muse smokes ok. Stage 1c done, but two items remain: the login field names and a stale-home sweep.**
  - **Brief and report:** `logs/handoff/20261105-1710-lab-1c/` (`brief.md` § Follow-up 3; `report.md` § Follow-up 3
    report, with the lead's check).
  - **Implementer's report, quoted:** "Both parts are done and both smokes pass".
  - **Model calls:**
    - **Codex** (clerk, `gpt-6.1-terra`, low): `ok: true`, with the code-mode notice recorded. Proxy: `chatgpt.com`
      ×7 and `ab.chatgpt.com` ×1, nothing else.
    - **Muse** (statistics reviewer, low, no tools): `ok: true`. Proxy: `api.meta.ai` ×2, nothing else.
    - No Claude call.
  - **Docker probes:** a file a first Codex session writes into its home (`config.toml`, `skills/x`) is absent in
    a second session. Neither engine's container can see a lab home or `~/.config/ants-lab`.
  - **Lead's check:**
    - Reproduced 324/324, tsc 0 and `test:docker` 10/10.
    - No session home is left under `<state>/sessions/`; only `ants-lab-proxy` is running.
    - Both login hashes are unchanged, and the lab homes' 627 other files have unchanged mtimes (implementer).
  - **Stage 1c is done**, with two items open:
    - **The login field names aren't verified against the real files.** These are the fields copy-back reads:
      Codex `tokens.account_id` and `last_refresh`, from Codex's documented layout; for Muse, a list of candidate
      names. The permission classifier refused the implementer's keys-only check, and the lead does not route
      around a refusal. If a field is wrong, copy-back refuses safely, but a refreshed login is lost. The user will
      be asked to run a keys-only check.
    - **No sweep for a session home left by a SIGKILLed launcher.** This goes in the stage 2 brief (a sweep at
      conductor start).
  - **Next:** the lab-repo commit of 1c and its three follow-ups, which waits for the user's agreement (D290); then
    the stage 2 brief.
